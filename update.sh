#!/usr/bin/env bash
# 一键更新：压缩图片 → 提交 → 推送到 GitHub Pages。
# 用法：
#   ./update.sh                 # 用默认提交信息（带时间戳）
#   ./update.sh "新增3条小事儿"  # 自定义提交信息
set -euo pipefail

cd "$(dirname "$0")"

# 1. 先压缩配图（超过 1MB 的自动压到 ≤1MB）
echo "==== 步骤 1/3：压缩图片 ===="
./compress-images.sh

# 2. 暂存改动（代码 + 配图，确保图片不会漏传）
echo ""
echo "==== 步骤 2/3：提交改动 ===="
git add -A

if git diff --cached --quiet; then
  echo "没有需要提交的改动，结束。"
  exit 0
fi

msg="${1:-更新内容 $(date '+%Y-%m-%d %H:%M')}"
git commit -m "$msg"

# 3. 推送
echo ""
echo "==== 步骤 3/3：推送到 GitHub ===="
git push origin main

echo ""
echo "✅ 已推送。约 1 分钟后网站自动更新："
echo "   https://xpz123.github.io/100-little-cases/"
