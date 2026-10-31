# LoonKit

Loon 配置模板、插件、脚本、分流规则、定时任务的整理仓库。所有文件按类型分目录，配套格式速查文档和一个本地校验脚本。

- 官方文档：<https://nsloon.app/docs/intro>
- 适配版本：Loon 3.5.1(983) 及以上（Script 使用 v2 语法）

---

## 目录结构

```
LoonKit/
├── Config/      # .lcf  完整配置模板
├── Plugin/      # .lpx  插件（可一键导入）
│   └── vendor/  # 第三方插件镜像，来源见 CREDITS.md
├── Script/      # .js   脚本（被插件/配置引用）
│   └── vendor/  # 第三方脚本镜像
├── Rule/        # .lsr  分流规则
│   └── vendor/  # 第三方规则镜像
├── Task/        # .ltx  定时任务
├── Rewrite/     # .jq   复写表达式
├── Icon/        # 图标，按上游分目录
├── Docs/        # 格式速查、编写指南
└── Tools/       # 本地校验脚本
```

## 加速与镜像

仓库内的资源链接统一走 [gh-proxy](https://gh-proxy.com/) 加速，格式是 `https://gh-proxy.com/<原始 GitHub 链接>`。国内直连 `raw.githubusercontent.com` 经常超时，套一层代理能稳定拉取。

被引用的第三方资源已镜像到本仓库的 `vendor/` 目录，来源和许可记录在 [CREDITS.md](CREDITS.md)。注意：镜像只覆盖插件/规则文件本身，插件内部再引用原作者脚本的部分没有改写，仍然指向上游。


## 文件类型

| 后缀 | 全称 | 用途 |
| --- | --- | --- |
| `.lcf` | Loon Configuration File | 完整配置（General / 策略组 / 规则 / 插件 / Mitm） |
| `.lpx` | Loon Plugin Extension | 插件，包含参数、规则、脚本、Mitm 声明 |
| `.ltx` | Loon Task Extension | 任务，只有 cron 脚本，无请求拦截 |
| `.lsr` | Loon Shunt Rules | 分流规则列表 |
| `.jq` | JQ | 复写用的 jq 表达式 |
| `.js` | JavaScript | 脚本本体 |

## 导入方式

所有导入链接需要把目标地址做 URL 编码后替换 `<url>`。

| 资源 | Scheme |
| --- | --- |
| 远程配置 | `loon://import?sub=<url>` |
| 节点订阅 | `loon://import?nodelist=<url>` |
| 规则订阅 | `loon://import?rules=<url>` |
| 插件 | `loon://import?plugin=<url>` |
| 图标集 | `loon://import?iconset=<url>` |

网页里不能直接点 `loon://` 时，替换为 `https://www.nsloon.com/openloon/`，例如 `https://www.nsloon.com/openloon/import?plugin=<url>`。

## 收录内容

| 文件 | 说明 |
| --- | --- |
| `Config/Loon.lcf` | 自托管版完整配置，第三方资源已镜像并走 gh-proxy |
| `Config/Loon-Lite.lcf` | 精简配置骨架，含 General / 策略组 / 规则 / 插件 / Mitm 段位说明 |
| `Plugin/tools/google-redirect.lpx` | Google 搜索重定向（可用示例） |
| `Plugin/_template.lpx` | 插件编写模板，含参数类型与常用段 |
| `Script/tasks/checkin-template.js` | 签到/查询类脚本模板，自包含、无外部依赖 |
| `Rule/Direct.lsr` | 直连规则示例 |
| `Rule/GEOIP.lsr` | GeoIP 兜底直连 |
| `Rule/AI.lsr` | AI 服务分流（73 条），不写策略，配合 `policy = AI` 使用 |
| `Plugin/rules/ai-services.lpx` | 同一份 AI 规则的插件版，规则走 `PROXY` 组 |
| `Rule/_template.lsr` | 规则写法模板 |
| `Task/daily-checkin.ltx` | 每日定时任务模板 |
| `Rewrite/example.jq` | jq 复写表达式示例 |
| `Docs/loon-format.md` | 各文件格式速查 |
| `Docs/plugin-guide.md` | 插件编写与排错指南 |

## 命名约定

- 目录用 PascalCase：`Config` `Plugin` `Script` `Rule` `Task`。
- 文件名用小写 kebab-case，只写英文和数字：`google-redirect.lpx`。
- 插件按用途分子目录：`Plugin/ad`（广告拦截）、`Plugin/unlock`（解锁）、`Plugin/tools`（工具）、`Plugin/checkin`（签到）。
- 脚本路径与插件名保持一致：`Plugin/tools/google-redirect.lpx` ↔ `Script/tools/google-redirect.js`。
- 规则文件按策略目标命名：`Direct.lsr` `Proxy.lsr` `Reject.lsr`。

## 校验

推送前本地跑一遍，检查 `#!` 头、段名、规则行数和 JS 语法：

```bash
node Tools/validate.mjs
```

CI 会在 push 和 PR 时自动执行同一脚本，见 `.github/workflows/validate.yml`。

## 免责声明

本仓库内容仅用于学习和研究，不得用于商业或非法用途，不得在中国境内平台传播。所有脚本和规则均来自公开互联网，不保证合法性、准确性和可用性。使用即视为同意自行承担全部后果，并承诺在下载后 24 小时内从设备中彻底删除相关内容。

## 参考

- [luestr/ProxyResource](https://github.com/luestr/ProxyResource) — 配置模板与工具索引
- [luestr/IconResource](https://github.com/luestr/IconResource) — 图标资源
- [luestr/CrazyRule](https://github.com/luestr/CrazyRule) — 多客户端分流规则
- [Tartarus2014/Loon-Script](https://github.com/Tartarus2014/Loon-Script) — Loon 插件与脚本集合
