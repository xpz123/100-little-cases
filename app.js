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
