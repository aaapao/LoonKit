# 第三方资源来源

`vendor/` 与 `Icon/` 下的文件均为**镜像缓存**，版权归原作者。这里只记录来源，方便核对和追溯。

## 图标

| 本地路径 | 上游 |
| --- | --- |
| `Icon/Qure/*.png`（14 个） | [Koolson/Qure](https://github.com/Koolson/Qure) · `IconSet/Color` |
| `Icon/For-own-use/AI.png` | [Tartarus2014/For-own-use](https://github.com/Tartarus2014/For-own-use) · `Color` |
| `Icon/IconResource/GitHub.png` | [luestr/IconResource](https://github.com/luestr/IconResource) · `App_icon/120px` |

## 分流规则

| 本地路径 | 上游 |
| --- | --- |
| `Rule/vendor/ACL4SSR/LocalAreaNetwork.list` | [ACL4SSR/ACL4SSR](https://github.com/ACL4SSR/ACL4SSR) · `Clash/LocalAreaNetwork.list` |
| `Rule/vendor/Tartarus2014/TestFlight.lsr` | [Tartarus2014/Loon-Script](https://github.com/Tartarus2014/Loon-Script) · `Rule/Apple/TestFlight.lsr` |
| `Rule/vendor/Tartarus2014/Direct.lsr` | [Tartarus2014/Loon-Script](https://github.com/Tartarus2014/Loon-Script) · `Rule/Direct.lsr` |
| `Rule/vendor/Tartarus2014/GEOIP.lsr` | [Tartarus2014/Loon-Script](https://github.com/Tartarus2014/Loon-Script) · `Rule/GEOIP.lsr` |

## 插件

| 本地路径 | 上游 |
| --- | --- |
| `Plugin/vendor/Tartarus2014/LoonGallery.lpx` | [Tartarus2014/Loon-Script](https://github.com/Tartarus2014/Loon-Script) |
| `Plugin/vendor/MaYIHEI/ipquality-web-test.lpx` | [MaYIHEI/paperclip](https://github.com/MaYIHEI/paperclip) |
| `Plugin/vendor/Sub-Store/Loon-parser.plugin` | [sub-store-org/Sub-Store](https://github.com/sub-store-org/Sub-Store) |
| `Plugin/vendor/mc2u/loon_resource_parser.lpx` | [mc2u/Loon](https://github.com/mc2u/Loon) |
| `Plugin/vendor/Script-Hub/script-hub.loon.plugin` | [Script-Hub-Org/Script-Hub](https://github.com/Script-Hub-Org/Script-Hub) |
| `Plugin/vendor/chavyleung/boxjs.rewrite.loon.plugin` | [chavyleung/scripts](https://github.com/chavyleung/scripts) |
| `Plugin/vendor/devchristian1337/Spotify.lpx` | [devchristian1337/loon-plugins](https://github.com/devchristian1337/loon-plugins) |
| `Plugin/vendor/devchristian1337/YouTube.lpx` | [devchristian1337/loon-plugins](https://github.com/devchristian1337/loon-plugins) |

## 脚本

| 本地路径 | 上游 |
| --- | --- |
| `Script/vendor/Sub-Store/sub-store-parser.loon.min.js` | [sub-store-org/Sub-Store](https://github.com/sub-store-org/Sub-Store) · release 分支 |

## 衍生规则

以下文件由上游规则集转换而来，非逐字镜像。

| 本地路径 | 上游 | 改动 |
| --- | --- | --- |
| `Rule/AI.lsr`、`Plugin/rules/ai-services.lpx` | [ConnersHua/RuleGo](https://github.com/ConnersHua/RuleGo) · `Surge/Ruleset/Extra/AI.list` | 转为 Loon 语法，去除 Surge 专有的 `extended-matching` 参数 |

## 未镜像的资源

以下资源来自 `kelee.one` / `rule.kelee.one`，抓取时被拦截（403 / DNS 无解析），因此保留原链接，未做本地化：

- 规则：`AI.lsr` `Apple.lsr` `GitHub.lsr` `DouYin.lsr` `TikTok.lsr` `YouTube.lsr` `Netflix.lsr` `Bahamut.lsr` `Telegram.lsr` `Proxy.lsr` `ProxyLite.lsr` `ChinaMax.lsr`
- 插件：`Block_HTTPDNS.lpx` `BlockAdvertisers.lpx` `Node_detection_tool.lpx`

## 许可与下架

各上游许可不同，使用前请自行核对。若你是权利人并要求移除某个文件，请开 issue，会立即删除。
