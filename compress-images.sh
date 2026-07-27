#!/usr/bin/env bash
# 压缩 配图/ 下超过 1MB 的图片，就地覆盖为 ≤1MB 的版本。
# - PNG：缩到最长边 1600px，再从 256 色逐级减色（保留透明通道、色彩锐利，适合卡通图）。
# - JPG/JPEG/WEBP：缩到最长边 1600px，再逐级降质量。
# 已 ≤1MB 的图片会被跳过，不重复压缩。
# 依赖：ImageMagick（magick）。
set -euo pipefail

DIR="配图"
MAX_BYTES=$((1024 * 1024))   # 1MB
MAX_DIM=1600                 # 最长边像素上限

if ! command -v magick >/dev/null 2>&1; then
  echo "❌ 未找到 ImageMagick，请先安装：brew install imagemagick"
  exit 1
fi

if [ ! -d "$DIR" ]; then
  echo "⚠️  未找到 $DIR 目录，跳过压缩。"
  exit 0
fi

filesize() { stat -f%z "$1" 2>/dev/null || stat -c%s "$1"; }
mb() { echo "scale=2; $1/1048576" | bc; }

shopt -s nullglob nocaseglob
found=0
for img in "$DIR"/*.png "$DIR"/*.jpg "$DIR"/*.jpeg "$DIR"/*.webp; do
  found=1
  size=$(filesize "$img")
  if [ "$size" -le "$MAX_BYTES" ]; then
    echo "✓ 已达标 ($(mb "$size")MB): $img"
    continue
  fi

  echo "→ 压缩中: $img ($(mb "$size")MB)"
  ext_lower=$(echo "${img##*.}" | tr '[:upper:]' '[:lower:]')

  # 第一步：限制最长边到 MAX_DIM（只缩小、不放大）
  magick "$img" -strip -resize "${MAX_DIM}x${MAX_DIM}>" "$img"

  # 第二步：按格式逐级压缩直到 ≤1MB
  if [ "$ext_lower" = "png" ]; then
    for colors in 256 192 128 96 64 48 32; do
      magick "$img" -colors "$colors" "$img"
      [ "$(filesize "$img")" -le "$MAX_BYTES" ] && { level="${colors}色"; break; }
      level="${colors}色"
    done
  else
    for q in 90 82 75 68 60 52 45 38; do
      magick "$img" -quality "$q" "$img"
      [ "$(filesize "$img")" -le "$MAX_BYTES" ] && { level="q=${q}"; break; }
      level="q=${q}"
    done
  fi

  newsize=$(filesize "$img")
  echo "  完成: $(mb "$newsize")MB ($level)"
  if [ "$newsize" -gt "$MAX_BYTES" ]; then
    echo "  ⚠️  仍超过 1MB，建议手动检查或换更小的原图。"
  fi
done

if [ "$found" -eq 0 ]; then
  echo "（$DIR 下没有找到图片文件）"
fi
echo "✅ 图片压缩检查完成。"
