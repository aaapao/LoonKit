# LoonKit · jq 复写表达式示例
#
# 用途：直接对响应 JSON 做增删改，不用写 JS，比脚本轻。
# 一个 .jq 文件放一条完整表达式，注释用 # 开头。
#
# 示例：删除响应里的广告字段，再把 vip 强制改成 true
del(.data.ads, .data.banner) | .data.vip = true
