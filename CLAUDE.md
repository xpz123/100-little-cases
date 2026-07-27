# 那些令宝儿烦恼的小事儿 — 项目说明

一个可爱卡通浪漫风格的静态网页，展示「那些令宝儿烦恼的小事儿」（配图版），部署在 GitHub Pages。

- 线上地址：https://xpz123.github.io/100-little-cases/
- 仓库：https://github.com/xpz123/100-little-cases （public）

## 文件结构

- `index.html` — 页面骨架
- `style.css` — 样式（可爱卡通浪漫风格 + 响应式瀑布流）
- `app.js` — 卡片渲染 / 大图弹窗 / 背景音乐控制
- `data.js` — ★内容数据文件（加小事儿改这里）
- `配图/` — ★配图目录（放图片）
- `演奏曲-…钢琴音乐.ogg` — 背景音乐
- `compress-images.sh` — 图片压缩工具
- `update.sh` — 一键更新脚本

## 如何添加一条新的小事儿

1. 把配图放进 `配图/` 目录。
2. 在 `data.js` 的 `CASES` 数组里加一行：
   ```js
   { id: 2, title: "标题", desc: "描述", image: "配图/图片名.png" },
   ```
   - `image` 留空 `""` 则显示可爱占位图（🥲）。
3. 提交（见下方，务必按流程走）。

## ⚠️ 提交前必须先压缩图片（重要）

**每次提交前，必须先运行图片压缩**，把 `配图/` 下超过 1MB 的图片压到 ≤1MB，再提交。原因：
1. 图片过大拖慢网页加载、浪费仓库空间。
2. 曾经出现过「图片没提交导致线上 404」的问题——`git add -A` / `update.sh` 会确保配图一起提交。

**推荐做法：直接运行一键更新脚本**（它会自动完成 压缩 → add → commit → push）：

```bash
./update.sh "本次更新说明"      # 自定义提交信息
./update.sh                    # 或用默认信息（带时间戳）
```

**如果手动分步提交**，也必须先压缩：

```bash
./compress-images.sh           # 1. 先压缩图片（≤1MB）
git add -A                     # 2. 暂存全部改动（含 配图/）
git commit -m "更新说明"        # 3. 提交
git push origin main           # 4. 推送
```

> Claude Code 注意：本项目后续基本由 Claude Code 代为提交。**任何一次提交，都要先执行 `./compress-images.sh`（或直接用 `./update.sh`），确保新图已压缩且被一并提交。不要跳过压缩步骤。**

## 图片压缩说明

`compress-images.sh` 的策略：
- 只处理 `配图/` 下超过 1MB 的图片，已达标的跳过（不重复压缩）。
- PNG：缩到最长边 1600px，再从 256 色逐级减色，直到 ≤1MB（保留透明、适合卡通图）。
- JPG/JPEG/WEBP：缩到最长边 1600px，再逐级降质量。
- 依赖 ImageMagick（`brew install imagemagick`）。

## 本地预览

```bash
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000
```
（背景音乐因浏览器策略需通过 http 服务器打开，直接双击 index.html 音乐可能无法播放。）
