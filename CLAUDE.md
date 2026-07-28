# 那些令宝儿烦恼的小事儿 — 项目说明

一个可爱卡通浪漫风格的静态网页，展示「那些令宝儿烦恼的小事儿」（配图版），部署在 GitHub Pages。

- 线上地址：https://xpz123.github.io/100-little-cases/
- 仓库：https://github.com/xpz123/100-little-cases （public）

## 文件结构

- `index.html` — 页面骨架
- `style.css` — 样式（可爱卡通浪漫风格 + 响应式瀑布流）
- `app.js` — 卡片渲染 / 时间过滤 / 分页（每页 5 条）/ 大图弹窗 / 背景音乐控制
- `data.js` — ★内容数据文件（加小事儿改这里）
- `配图/` — ★配图目录（放图片）
- `演奏曲-…钢琴音乐.ogg` — 背景音乐
- `compress-images.sh` — 图片压缩工具
- `update.sh` — 一键更新脚本

## 如何添加一条新的小事儿

1. 把配图放进 `配图/` 目录。
2. 在 `data.js` 的 `CASES` 数组里加一行：
   ```js
   { id: 2, title: "标题", desc: "描述", image: "配图/图片名.png", date: "2026-07-28" },
   ```
   - `image` 留空 `""` 则显示可爱占位图（🥲）。
   - `date` 填生成日期，格式 `"YYYY-MM-DD"`，用于卡片上的日期徽章展示和顶部的时间过滤（全部/最近1天/最近1周/最近1个月）。
3. 提交更新网站（见下方，务必按流程走）。
4. **同步发一条小红书帖子**（见下方「同步发布小红书」）。

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

## 同步发布小红书

每新增一条 item 并更新网站后，用同一条 item 的 `title` / `desc` / 配图，同步发一条小红书帖子。

使用已安装的 **xiaohongshu-skills**（位于 `~/.claude/skills/xiaohongshu-skills`，通过 Chrome 扩展 + 真实账号操作）。

**内容映射规则：**
- 标题 = item 的 `title`（≤ 20 单位：汉字/全角计 1，英文数字每 2 个计 1；超长则重新创作到约 20）。
- 正文 = item 的 `desc`，末尾另起一行加固定话题标签：
  `#生活碎片 #烦恼小事 #可爱插画 #独角兽` +（可按内容补 1 个贴切标签，如打工人日常）。
- 配图 = item 的 `image` 对应的**绝对路径**（如 `/Users/tal/work/100_little_cases/配图/xxx.png`）。压缩后的图即可，无需额外处理。

**发布步骤（务必分步 + 用户确认）：**

```bash
# 0. 前置：确保 bridge server 在跑（扩展需已装并启用、Chrome 已登录小红书）
cd ~/.claude/skills/xiaohongshu-skills
pgrep -f bridge_server.py >/dev/null || nohup uv run python scripts/bridge_server.py > /tmp/xhs_bridge.log 2>&1 &
sleep 4
uv run python scripts/cli.py check-login      # 期望 {"logged_in": true}

# 1. 把标题、正文写入 UTF-8 临时文件（不要在命令行内联中文）
#    /tmp/xhs_title.txt  /tmp/xhs_content.txt

# 2. 填表单（不发布），停在发布页供预览
uv run python scripts/cli.py fill-publish \
  --title-file /tmp/xhs_title.txt \
  --content-file /tmp/xhs_content.txt \
  --images "/Users/tal/work/100_little_cases/配图/xxx.png"

# 3. 用 AskUserQuestion 让用户在 Chrome 里确认预览后，再发布：
uv run python scripts/cli.py click-publish
```

**注意事项：**
- **必须分步 + 用户确认后再 `click-publish`**，不要一步 `publish` 直接发。
- **控制频率**：多条时每条间隔约 1 分钟以上，避免触发风控。
- `click-publish` 有时会打 warning「未捕获到发布反馈」，通常仍已发布成功；让用户到小红书确认。
- 若 bridge 连接卡住无输出：多半是 bridge server 没常驻，按步骤 0 手动 `nohup` 启动即可。
- 发布是公开、真实账号、难撤回的操作，务必先确认再发。
