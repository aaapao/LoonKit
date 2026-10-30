# 图标

`Qure/` `For-own-use/` `IconResource/` 三个目录是从上游镜像下来的图标文件，来源见 [CREDITS.md](../CREDITS.md)。图标版权归原作者，转载前先看对方许可。

## 可用来源

| 项目 | 说明 |
| --- | --- |
| [Koolson/Qure](https://github.com/Koolson/Qure) | 策略组图标，`IconSet/Color/*.png` |
| [luestr/IconResource](https://github.com/luestr/IconResource) | App 图标，`App_icon/120px/*.png` |

## 用法

策略组图标写在 `[Proxy Group]` 行末：

```
PROXY = select, DIRECT, img-url = https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Proxy.png
```

插件图标写在头部：

```
#!icon = https://raw.githubusercontent.com/Koolson/Qure/master/IconSet/Color/Google.png
```

## 自建图标

要放自己的图标，按 `Icon/<分类>/<name>.png` 存，尺寸 120×120，PNG 透明底，命名与插件名一致。引用走 raw 直链：

```
https://raw.githubusercontent.com/aaapao/LoonKit/main/Icon/tools/google.png
```
