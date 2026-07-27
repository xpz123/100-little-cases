const PLACEHOLDER_EMOJI = "🥲";
const grid = document.getElementById("grid");
const modal = document.getElementById("modal");
const modalBody = modal.querySelector(".modal-body");
const emptyTip = document.getElementById("empty-tip");
const filters = document.getElementById("filters");

let currentRange = "all";

function cardMedia(item, cls, placeholderCls) {
  if (item.image) {
    return `<img class="${cls}" src="${encodeURI(item.image)}" alt="${item.title}" loading="lazy">`;
  }
  return `<div class="${placeholderCls}">${PLACEHOLDER_EMOJI}</div>`;
}

function dateBadge(item, cls) {
  if (!item.date) return "";
  return `<span class="${cls}">🗓 ${item.date}</span>`;
}

// 判断某条是否落在选中的时间范围内
function inRange(item, range) {
  if (range === "all") return true;
  if (!item.date) return false;
  const days = { day: 1, week: 7, month: 30 }[range];
  const then = new Date(item.date + "T00:00:00");
  if (isNaN(then)) return false;
  const now = new Date();
  const diffDays = (now - then) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= days;
}

function renderCards() {
  const list = CASES.filter((item) => inRange(item, currentRange));
  grid.innerHTML = list.map((item) => `
    <article class="card" data-id="${item.id}">
      ${cardMedia(item, "card-img", "card-placeholder")}
      <div class="card-body">
        <h3 class="card-title">${item.title}</h3>
        <p class="card-desc">${item.desc}</p>
        ${dateBadge(item, "card-date")}
      </div>
    </article>
  `).join("");
  emptyTip.hidden = list.length > 0;
}

function openModal(item) {
  modalBody.innerHTML = `
    ${cardMedia(item, "modal-img", "modal-placeholder")}
    <h2 class="modal-title">${item.title}</h2>
    ${dateBadge(item, "modal-date")}
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

filters.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;
  currentRange = btn.dataset.range;
  filters.querySelectorAll(".filter-btn").forEach((b) => b.classList.toggle("is-active", b === btn));
  renderCards();
});

renderCards();

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
