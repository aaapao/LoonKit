#!/usr/bin/env node
/**
 * LoonKit 资源校验
 * 检查项：
 *   .lpx / .ltx  头部字段、段名、[Script] 行语法
 *   .lcf         必备段
 *   .lsr         规则行字段数
 *   .js          语法（node --check）
 * 用法：node Tools/validate.mjs
 */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SKIP_DIRS = new Set(['.git', 'node_modules', '.github', 'Tools']);

const errors = [];
const warnings = [];
const stats = { lpx: 0, ltx: 0, lcf: 0, lsr: 0, js: 0, jq: 0 };

function walk(dir) {
  for (const name of readdirSync(dir)) {
    if (SKIP_DIRS.has(name) || name.startsWith('.')) continue;
    const full = join(dir, name);
    if (statSync(full).isDirectory()) walk(full);
    else check(full);
  }
}

function fail(file, msg) {
  errors.push(`${relative(ROOT, file)}: ${msg}`);
}

function warn(file, msg) {
  warnings.push(`${relative(ROOT, file)}: ${msg}`);
}

function check(file) {
  const ext = extname(file).toLowerCase();
  const text = readFileSync(file, 'utf8');
  const lines = text.split('\n');

  if (ext === '.lpx' || ext === '.ltx') {
    stats[ext.slice(1)] += 1;

    for (const key of ['#!name', '#!desc']) {
      if (!lines.slice(0, 20).some((l) => l.startsWith(`${key} =`))) {
        fail(file, `缺少 ${key} 头`);
      }
    }
    if (!lines.slice(0, 20).some((l) => l.startsWith('#!author'))) {
      warn(file, '缺少 #!author');
    }
    if (!/^\[[A-Za-z]+\]/m.test(text)) {
      fail(file, '没有任何 [Section] 段');
    }
    if (ext === '.ltx' && !/^\[Script\]/m.test(text)) {
      fail(file, '.ltx 必须有 [Script] 段');
    }
    const argRefs = lines
      .filter((l) => /script\s*\(/.test(l))
      .flatMap((l) => [...l.matchAll(/\$\{([a-z_][a-z0-9_]*)\}/gi)].map((m) => m[1]));
    if (argRefs.length && !/^\[Argument\]/m.test(text)) {
      warn(file, `引用了 ${[...new Set(argRefs)].join(' ${')} 但没有 [Argument] 段`);
    }
  }

  if (ext === '.lcf') {
    stats.lcf += 1;
    if (!/^\[General\]/m.test(text)) fail(file, '缺少 [General] 段');
    if (!/^\[Mitm\]/im.test(text)) warn(file, '缺少 [Mitm] 段');
    const ruleLines = text
      .split(/^\[Rule\]\s*$/m)[1]
      ?.split(/^\[/m)[0]
      ?.split('\n')
      .filter((l) => l.trim() && !l.trim().startsWith('#'));
    if (ruleLines && ruleLines.length && !ruleLines[ruleLines.length - 1].startsWith('FINAL')) {
      warn(file, '[Rule] 最后一行不是 FINAL');
    }
  }

  if (ext === '.lsr') {
    stats.lsr += 1;
    lines.forEach((line, i) => {
      const l = line.trim();
      if (!l || l.startsWith('#')) return;
      const parts = l.split(',').map((p) => p.trim()).filter(Boolean);
      // FINAL 只有 类型,策略 两段，其余规则都是 类型,值,策略
      const min = parts[0].toUpperCase() === 'FINAL' ? 2 : 3;
      if (parts.length < min) {
        fail(file, `第 ${i + 1} 行字段不足（需要 ${min} 段）：${l}`);
      }
    });
  }

  if (ext === '.js') {
    stats.js += 1;
    try {
      execFileSync(process.execPath, ['--check', file], { stdio: 'pipe' });
    } catch (e) {
      fail(file, `JS 语法错误：${String(e.stderr || e.message).split('\n')[0]}`);
    }
  }

  if (ext === '.jq') stats.jq += 1;
}

walk(ROOT);

const summary = Object.entries(stats)
  .filter(([, n]) => n > 0)
  .map(([k, n]) => `${k}×${n}`)
  .join('  ');

console.log(`检查完成：${summary || '无文件'}`);

if (warnings.length) {
  console.log(`\n警告 ${warnings.length} 条：`);
  warnings.forEach((w) => console.log(`  ! ${w}`));
}

if (errors.length) {
  console.log(`\n错误 ${errors.length} 条：`);
  errors.forEach((e) => console.log(`  x ${e}`));
  process.exit(1);
}

console.log('通过。');
