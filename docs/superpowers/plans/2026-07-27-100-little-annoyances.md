# 100件令人烦恼的小事儿（配图版）实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个可爱卡通浪漫风格、手机/电脑均良好展示的静态网页，用瀑布流卡片展示「100件令人烦恼的小事儿」，含配图、大图弹窗和背景音乐。

**Architecture:** 纯静态 HTML + CSS + 原生 JS，无构建步骤、无外部依赖。内容集中在 `data.js`，`app.js` 负责渲染卡片、弹窗、音乐控制。用户日常只改 `data.js` 和 `配图/`。

**Tech Stack:** HTML5、CSS3（CSS columns 瀑布流 + 响应式）、原生 JavaScript（ES6）。

## Global Constraints

- 纯静态，无构建步骤、无 npm、无外部 CDN 依赖（字体用系统字体栈）。
- 手机（iPhone Safari）与电脑均需良好展示，响应式。
- 背景音乐文件：`演奏曲-【钢琴演奏】周杰伦与昆凌英国教堂婚礼的钢琴音乐.ogg`（已存在于根目录）。
- 配图目录：`配图/`（已存在），样例图 `配图/洗衣机脏了.png`。
- 图片/音乐路径含中文，用相对路径引用，浏览器自动 URL 编码。
- 风格：可爱、卡通、浪漫。配色奶油粉 + 淡紫 + 薄荷绿柔和渐变，圆角、柔和阴影。
- 用户只需维护 `data.js`（加条目）和 `配图/`（放图）两处。

---

## File Structure

- `index.html` — 页面骨架：标题区、卡片容器、弹窗容器、音乐按钮、`<audio>`，引用 css/js。
- `style.css` — 全部样式：配色变量、标题区、瀑布流、卡片、弹窗、音乐按钮、响应式断点、装饰动画。
- `data.js` — `const CASES = [...]`，全局变量供 app.js 读取。用户唯一维护的内容文件。
- `app.js` — 读取 `CASES` 渲染卡片；卡片点击弹窗；弹窗关闭；音乐播放/暂停切换。

---

### Task 1: 页面骨架 + 数据文件

**Files:**
- Create: `index.html`
- Create: `data.js`

**Interfaces:**
- Produces: 全局 `const CASES`，元素数组，每项 `{ id:number, title:string, desc:string, image:string }`。
- Produces: DOM 锚点 id：`#grid`（卡片容器）、`#modal`（弹窗根）、`#music-btn`（音乐按钮）、`#bgm`（audio 元素）。

- [ ] **Step 1: 创建 data.js，含样例数据**

```js
// 内容维护：复制一行，修改 id / title / desc / image。
// image 填 配图/ 下的文件名（相对路径）；留空 "" 则显示可爱占位图。
const CASES = [
  { id: 1, title: "洗衣机的滚筒好脏好脏", desc: "明明没用几次呢", image: "配图/洗衣机脏了.png" },
];
```

- [ ] **Step 2: 创建 index.html 骨架**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>100件令人烦恼的小事儿</title>
  <link rel="stylesheet" href="style.css">
</head>
<body>
  <header class="hero">
    <h1 class="hero-title">100件令人烦恼的小事儿</h1>
    <p class="hero-sub">生活里那些小小的、忍不住想吐槽的瞬间 ♡</p>
  </header>

  <main id="grid" class="grid"></main>

  <div id="modal" class="modal" hidden>
    <div class="modal-backdrop"></div>
    <div class="modal-card" role="dialog" aria-modal="true">
      <button class="modal-close" aria-label="关闭">×</button>
      <div class="modal-body"></div>
    </div>
  </div>

  <button id="music-btn" class="music-btn" aria-label="播放/暂停背景音乐" title="背景音乐">♪</button>
  <audio id="bgm" loop preload="auto"
         src="演奏曲-【钢琴演奏】周杰伦与昆凌英国教堂婚礼的钢琴音乐.ogg"></audio>

  <script src="data.js"></script>
  <script src="app.js"></script>
</body>
</html>
```

- [ ] **Step 3: 浏览器打开验证**

在浏览器打开 `index.html`。预期：看到标题区文字「100件令人烦恼的小事儿」和副标题；无 JS 报错（此时卡片区为空，属正常，app.js 尚未创建）。

- [ ] **Step 4: Commit**

```bash
git init 2>/dev/null; git add index.html data.js
git commit -m "feat: add page skeleton and data file"
```

---

### Task 2: 样式（风格 + 瀑布流 + 响应式 + 装饰）

**Files:**
- Create: `style.css`

**Interfaces:**
- Consumes: Task 1 的 DOM 结构与 class（`.hero`、`.grid`、`.card`、`.modal`、`.music-btn`）。
- Produces: class 约定供 app.js 生成卡片时使用：`.card`、`.card-img`、`.card-placeholder`、`.card-title`、`.card-desc`、`.modal.open`、`.modal-img`、`.modal-title`、`.modal-desc`、`.music-btn.playing`。

- [ ] **Step 1: 编写 style.css**

```css
:root {
  --cream: #fff6f0;
  --pink: #ffd6e8;
  --pink-deep: #ff9ec4;
  --purple: #e6d6ff;
  --purple-deep: #b39ddb;
  --mint: #d6f5e8;
  --text: #6b5b73;
  --shadow: 0 8px 24px rgba(179, 157, 219, 0.25);
  --radius: 20px;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Comic Sans MS", system-ui, sans-serif;
  color: var(--text);
  background: linear-gradient(135deg, var(--cream), var(--pink) 40%, var(--purple) 100%);
  background-attachment: fixed;
  min-height: 100vh;
  padding: 0 16px 60px;
}

.hero { text-align: center; padding: 48px 16px 32px; }
.hero-title {
  font-size: clamp(28px, 6vw, 52px);
  color: var(--pink-deep);
  text-shadow: 2px 2px 0 #fff, 4px 4px 8px rgba(255, 158, 196, 0.3);
  letter-spacing: 2px;
}
.hero-sub { margin-top: 12px; font-size: clamp(14px, 3vw, 18px); color: var(--purple-deep); }

/* 瀑布流：CSS columns，多列自动填充 */
.grid {
  column-count: 4;
  column-gap: 20px;
  max-width: 1200px;
  margin: 0 auto;
}
@media (max-width: 1024px) { .grid { column-count: 3; } }
@media (max-width: 768px)  { .grid { column-count: 2; } }
@media (max-width: 480px)  { .grid { column-count: 1; } }

.card {
  break-inside: avoid;
  margin-bottom: 20px;
  background: #fff;
  border-radius: var(--radius);
  box-shadow: var(--shadow);
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.card:hover {
  transform: translateY(-6px) rotate(-1deg);
  box-shadow: 0 14px 32px rgba(179, 157, 219, 0.4);
}
.card-img { width: 100%; display: block; }
.card-placeholder {
  width: 100%;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 56px;
  background: linear-gradient(135deg, var(--pink), var(--purple), var(--mint));
}
.card-body { padding: 14px 16px 18px; }
.card-title { font-size: 17px; font-weight: 700; color: var(--pink-deep); margin-bottom: 6px; }
.card-desc {
  font-size: 14px; line-height: 1.5;
  display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;
  overflow: hidden;
}

/* 弹窗 */
.modal { position: fixed; inset: 0; z-index: 100; display: flex; align-items: center; justify-content: center; padding: 20px; }
.modal[hidden] { display: none; }
.modal-backdrop { position: absolute; inset: 0; background: rgba(107, 91, 115, 0.45); backdrop-filter: blur(6px); }
.modal-card {
  position: relative;
  max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto;
  background: #fff; border-radius: var(--radius); box-shadow: var(--shadow);
  padding: 20px; animation: pop 0.25s ease;
}
@keyframes pop { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
.modal-close {
  position: absolute; top: 10px; right: 14px;
  border: none; background: var(--pink); color: #fff;
  width: 34px; height: 34px; border-radius: 50%; font-size: 22px; cursor: pointer; line-height: 1;
}
.modal-img { width: 100%; border-radius: 14px; margin-bottom: 16px; }
.modal-placeholder {
  width: 100%; aspect-ratio: 1/1; border-radius: 14px; margin-bottom: 16px;
  display: flex; align-items: center; justify-content: center; font-size: 80px;
  background: linear-gradient(135deg, var(--pink), var(--purple), var(--mint));
}
.modal-title { font-size: 22px; color: var(--pink-deep); margin-bottom: 10px; }
.modal-desc { font-size: 16px; line-height: 1.7; white-space: pre-wrap; }

/* 音乐按钮 */
.music-btn {
  position: fixed; top: 18px; right: 18px; z-index: 200;
  width: 52px; height: 52px; border-radius: 50%; border: none; cursor: pointer;
  background: linear-gradient(135deg, var(--pink-deep), var(--purple-deep));
  color: #fff; font-size: 24px; box-shadow: var(--shadow);
  display: flex; align-items: center; justify-content: center;
}
.music-btn.playing { animation: spin 3s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
```

- [ ] **Step 2: 浏览器打开验证**

在浏览器打开 `index.html`。预期：背景呈粉紫渐变，标题区样式生效，右上角出现圆形音乐按钮（♪）。卡片区仍空（app.js 未创建）。

- [ ] **Step 3: Commit**

```bash
git add style.css
git commit -m "feat: add cute cartoon romantic styles with responsive masonry"
```

---

### Task 3: 渲染卡片 + 大图弹窗

**Files:**
- Create: `app.js`

**Interfaces:**
- Consumes: 全局 `CASES`（Task 1）；DOM `#grid`、`#modal`、`.modal-body`、`.modal-close`、`.modal-backdrop`（Task 1）；style class（Task 2）。
- Produces: 函数 `renderCards()`、`openModal(item)`、`closeModal()`；常量 `PLACEHOLDER_EMOJI = "🥲"`。

- [ ] **Step 1: 编写 app.js 的卡片渲染与弹窗逻辑**

```js
const PLACEHOLDER_EMOJI = "🥲";
const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const modalBody = modal.querySelector(".modal-body");

function cardMedia(item, cls, placeholderCls) {
  if (item.image) {
    return `<img class="${cls}" src="${encodeURI(item.image)}" alt="${item.title}" loading="lazy">`;
  }
  return `<div class="${placeholderCls}">${PLACEHOLDER_EMOJI}</div>`;
}

function renderCards() {
  grid.innerHTML = CASES.map((item) => `
    <article class="card" data-id="${item.id}">
      ${cardMedia(item, "card-img", "card-placeholder")}
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
      </div>
    </article>
  `).join("");
}

function openModal(item) {
  modalBody.innerHTML = `
    ${cardMedia(item, "modal-img", "modal-placeholder")}
    <h2 class="modal-title">${item.title}</h2>
    <p class="modal-desc">${item.desc}</p>
  `;
  modal.hidden = false;
}

function closeModal() {
  modal.hidden = true;
  modalBody.innerHTML = "";
}

grid.addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;
  const item = CASES.find((c) => c.id === Number(card.dataset.id));
  if (item) openModal(item);
});

modal.querySelector(".modal-close").addEventListener("click", closeModal);
modal.querySelector(".modal-backdrop").addEventListener("click", closeModal);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeModal(); });

renderCards();
```

- [ ] **Step 2: 浏览器打开验证**

在浏览器打开 `index.html`。预期：
- 看到样例卡片「洗衣机的滚筒好脏好脏」，显示独角兽配图 + 标题 + 描述。
- 点击卡片 → 弹出大图窗，显示大图、完整标题、完整描述。
- 点 ×、点背景虚化区、按 Esc → 弹窗关闭。

- [ ] **Step 3: 临时加一条无图数据验证占位图**

在 `data.js` 的 `CASES` 临时追加：`{ id: 999, title: "测试无图", desc: "占位图测试", image: "" }`，刷新页面。预期：该卡片显示渐变背景 + 🥲 emoji 占位图。验证后删除这条临时数据。

- [ ] **Step 4: Commit**

```bash
git add app.js
git commit -m "feat: render masonry cards with image fallback and detail modal"
```

---

### Task 4: 背景音乐播放/暂停控制

**Files:**
- Modify: `app.js`（追加音乐控制逻辑，在 `renderCards()` 调用之后）

**Interfaces:**
- Consumes: DOM `#music-btn`、`#bgm`（Task 1）；class `.music-btn.playing`（Task 2）。
- Produces: 函数 `toggleMusic()`。

- [ ] **Step 1: 在 app.js 末尾追加音乐控制**

```js
const musicBtn = document.getElementById("music-btn");
const bgm = document.getElementById("bgm");

function toggleMusic() {
  if (bgm.paused) {
    bgm.play().then(() => {
      musicBtn.classList.add("playing");
    }).catch(() => {
      // 播放被浏览器拒绝（极少见，因由用户点击触发）；保持暂停状态
    });
  } else {
    bgm.pause();
    musicBtn.classList.remove("playing");
  }
}

musicBtn.addEventListener("click", toggleMusic);
bgm.addEventListener("pause", () => musicBtn.classList.remove("playing"));
bgm.addEventListener("play", () => musicBtn.classList.add("playing"));
```

- [ ] **Step 2: 浏览器打开验证（需通过本地服务器，file:// 可能限制音频）**

启动本地服务器并打开：

```bash
cd /Users/tal/work/100_little_cases && python3 -m http.server 8000
```

浏览器访问 `http://localhost:8000`。预期：
- 点右上角音乐按钮 → 钢琴曲开始播放，按钮开始旋转。
- 再点 → 音乐暂停，按钮停止旋转。
- 音乐循环播放（loop）。

- [ ] **Step 3: Commit**

```bash
git add app.js
git commit -m "feat: add background music play/pause toggle"
```

---

### Task 5: 移动端验证与最终检查

**Files:**
- 无新增；如有问题则 Modify `style.css`。

- [ ] **Step 1: 电脑端多列验证**

`http://localhost:8000` 宽屏下预期 4 列瀑布流；缩窗到 ~1000px → 3 列；~700px → 2 列；~450px → 单列。

- [ ] **Step 2: iPhone 视口验证**

用浏览器开发者工具切换到 iPhone 视口（如 iPhone 14）。预期：单列卡片、标题区文字不溢出、音乐按钮不遮挡内容、弹窗在小屏可滚动查看长描述。

- [ ] **Step 3: 长描述卡片验证**

临时把样例 desc 改成一段长文字（3 行以上），刷新。预期：卡片描述截断为 2 行 + 省略号；弹窗内显示完整长文字。验证后还原。

- [ ] **Step 4: 最终 Commit（如有样式修正）**

```bash
git add -A
git commit -m "fix: responsive adjustments for mobile and long descriptions"
```

---

## Self-Review

**Spec coverage:**
- 集中式 data.js → Task 1 ✓
- 瀑布流响应式布局 → Task 2 + Task 5 ✓
- 卡片点击大图弹窗 → Task 3 ✓
- 缺图占位图 → Task 3（cardMedia 分支）✓
- 右上角音乐悬浮按钮播放/暂停循环 + 旋转动画 → Task 2（样式）+ Task 4（逻辑）✓
- 可爱卡通浪漫风格配色 → Task 2 ✓
- 样例数据（洗衣机独角兽）→ Task 1 ✓
- 手机/电脑响应式 → Task 5 ✓

**Placeholder scan:** 无 TBD/TODO；所有代码步骤含完整代码。

**Type consistency:** `cardMedia(item, cls, placeholderCls)` 在 Task 3 定义并在卡片/弹窗复用；`PLACEHOLDER_EMOJI`、`renderCards`、`openModal`、`closeModal`、`toggleMusic` 命名前后一致；DOM id（`#grid`/`#modal`/`#music-btn`/`#bgm`）与 Task 1 骨架一致。
