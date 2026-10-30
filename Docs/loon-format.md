# Loon 文件格式速查

以 Loon 3.5.1(983) 为准，对应官方文档 <https://nsloon.app/docs/intro>。

## 通用规则

- 注释用 `#`，行内注释不支持。
- 段名写成 `[Section]`，段内一行一条配置。
- 编码 UTF-8，换行 LF，文件末尾留一个空行。
- 配置类文件（`.lcf` `.lpx` `.ltx`）的段名不区分大小写，但仓库统一用官方写法。

## .lcf 配置

常用段，顺序即生效顺序：

| 段 | 作用 |
| --- | --- |
| `[General]` | 全局参数：DNS、IPv6、TUN、测试 URL |
| `[Proxy]` | 手动节点 |
| `[Remote Proxy]` | 订阅节点 |
| `[Proxy Group]` | 策略组 |
| `[Remote Filter]` | 按名字正则从订阅里筛节点，供策略组引用 |
| `[Rule]` | 本地规则 |
| `[Remote Rule]` | 远程规则订阅 |
| `[Host]` | 本地 DNS 映射 |
| `[Rewrite]` | 复写 |
| `[Script]` | 脚本 |
| `[Plugin]` | 插件订阅 |
| `[Mitm]` | 证书与解密域名 |

`[Remote Rule]` 行格式：

```
https://example.com/Direct.lsr, policy = DIRECT, tag = 直连, enabled = true
```

`[Plugin]` 行格式：

```
https://example.com/x.lpx, enabled = true, pin = false
```

## .lpx 插件

头部字段（`#!` 开头，紧贴文件第一行）：

| 字段 | 必填 | 说明 |
| --- | --- | --- |
| `#!name` | 是 | 插件名，导入列表显示 |
| `#!desc` | 是 | 一句话说明 |
| `#!author` | 否 | 作者，建议留联系方式 |
| `#!system` | 否 | `iOS, iPadOS, macOS` |
| `#!loon_version` | 否 | 适配的 Loon 版本 |
| `#!date` | 否 | 更新日期 `YYYY-MM-DD` |
| `#!homepage` | 否 | 项目地址 |
| `#!tag` | 否 | 分类标签 |
| `#!icon` | 否 | 图标直链 |

可用的段：`[Argument]` `[Rule]` `[Rewrite]` `[Script]` `[MITM]`。

`[Argument]` 三种控件：

```
switch 开关   enabled = switch,true,tag=启用
select 下拉   mode = select,"auto","manual",tag=模式
input  输入   interval = input,"300",type=number,tag=间隔
```

参数在 `[Script]` 里用 `${参数名}` 引用。

## .ltx 任务

结构同 `.lpx`，只保留 `[Argument]` 和 `[Script]` 里的 cron 行，没有请求拦截能力。

## .lsr 规则

```
类型,值,策略[,额外参数]
```

| 类型 | 示例 |
| --- | --- |
| `DOMAIN` | `DOMAIN,api.example.com,PROXY` |
| `DOMAIN-SUFFIX` | `DOMAIN-SUFFIX,example.com,PROXY` |
| `DOMAIN-KEYWORD` | `DOMAIN-KEYWORD,example,PROXY` |
| `IP-CIDR` | `IP-CIDR,1.2.3.0/24,PROXY,no-resolve` |
| `IP-CIDR6` | `IP-CIDR6,2400:3200::/32,DIRECT,no-resolve` |
| `GEOIP` | `GEOIP,CN,DIRECT` |
| `URL-REGEX` | `URL-REGEX,^https?:\/\/api\.,PROXY` |
| `FINAL` | `FINAL,PROXY` |

`no-resolve` 表示不做 DNS 解析，纯 IP 规则建议都加。

## Script v2 语法

```
request         if <条件> then script(<路径>[, <参数>]) [with <选项>]
response        if <条件> then script(<路径>[, <参数>]) [with <选项>]
cron            "<表达式>" then script(<路径>[, <参数>]) [with <选项>]
network-changed then script(<路径>[, <参数>]) [with <选项>]
generic         then script(<路径>[, <参数>]) [with <选项>]
```

条件里可用的变量：

```
${url}  ${request.method}  ${request.header['X-Key']}
${response.status}  ${response.header['Content-Type']}
```

`with` 可用选项：`enable` `tag` `timeout` `requires_body` `binary_body_mode` `debug` `img_url`。

cron 支持五段（分 时 日 月 周）和六段（秒 分 时 日 月 周）。

参数两种写法：

```
script("a.js", "mode=auto&v=2")        # 字符串，脚本里自己解析
script("a.js", {${mode}, ${level}})    # 对象，脚本里 $argument 直接是对象
```

## 导入 Scheme

目标地址先 URL 编码，再替换 `<url>`。

| 资源 | 链接 |
| --- | --- |
| 远程配置 | `loon://import?sub=<url>` |
| 节点订阅 | `loon://import?nodelist=<url>` |
| 规则订阅 | `loon://import?rules=<url>` |
| 插件 | `loon://import?plugin=<url>` |
| 图标集 | `loon://import?iconset=<url>` |
| GeoIP | `loon://import?geoip=<url>` |
| 解析器 | `loon://import?parser=<url>` |

网页里把 `loon://` 换成 `https://www.nsloon.com/openloon/`，例如 `https://www.nsloon.com/openloon/import?plugin=<url>`。

常用操作：`loon://on` `loon://off` `loon://update?sub=all` `loon://flowmodel=filter` `loon://proxymode=tun`。
