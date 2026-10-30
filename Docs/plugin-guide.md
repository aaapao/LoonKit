# 插件编写与排错

## 从模板开始

复制 `Plugin/_template.lpx`，改 `#!` 头和段内容。文件放 `Plugin/<分类>/<name>.lpx`，配套脚本放 `Script/<分类>/<name>.js`。

## 五个必查项

**1. 头部格式**

`#!name` 和 `#!desc` 必须存在，且在文件最前面。少了 `#!name`，Loon 导入时会直接失败。

**2. MITM 覆盖域名**

只要有 `[Rewrite]` 或 `[Script]` 要读改请求，`[MITM]` 的 `hostname` 必须覆盖目标域名，否则规则命中但脚本不执行。子域名要单独写通配：

```
[MITM]
hostname = example.com, *.example.com
```

**3. 证书信任**

iOS 装完证书还要去「设置 → 通用 → 关于本机 → 证书信任设置」手动信任，否则全部请求失败，且报错很隐蔽。

**4. 读 body 要声明**

改请求或响应体必须加 `requires_body=true`，否则脚本里拿到的 `body` 是空的。二进制体加 `binary_body_mode=true`。

**5. `$done()` 只调一次**

异步分支里提前 `$done()` 再落到外层 `$done()` 会导致脚本行为异常。统一在 Promise 收尾处调用一次。

## 参数

`[Argument]` 里定义，`[Script]` 里用 `${name}` 引用。`input` 的默认值要用双引号包住，否则带空格的值会被截断。

```
[Argument]
cron = input,"0 8 * * *",tag=执行时间
mode = select,"auto","manual",tag=模式
enabled = switch,true,tag=启用

[Script]
cron ${cron} then script("a.js", "mode=${mode}") with enable=${enabled}, tag="任务", timeout=300
```

脚本里 `$argument` 可能是字符串也可能是对象，写个兼容函数最稳，参考 `Script/tasks/checkin-template.js`。

## 调试

- 加 `debug=true`，脚本日志会进 Loon 的日志页。
- 先用 `generic` 类型做手动触发入口，比等 cron 快得多。
- 插件改完必须重新导入一次，Loon 不会自动拉取更新。

## 常见故障对照

| 现象 | 原因 |
| --- | --- |
| 插件导入报错 | `#!` 头缺失或段名拼错 |
| 规则命中但脚本不跑 | MITM 域名没覆盖，或证书未信任 |
| 脚本拿不到 body | 漏了 `requires_body=true` |
| 定时任务不执行 | cron 表达式段数不对，或 `enable=false` |
| 修改后无效果 | 没重新导入插件，或配置里插件被禁用 |
