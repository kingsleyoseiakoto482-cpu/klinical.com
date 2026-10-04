/* ============================================================
   Do You Miss Me? — by Klinical
   ============================================================ */

const card       = document.getElementById("card");
const yesBtn     = document.getElementById("yesBtn");
const noBtn      = document.getElementById("noBtn");
const overlay    = document.getElementById("overlay");
const againBtn   = document.getElementById("againBtn");
const heartField = document.getElementById("heartField");

/* ------------------------------------------------------------
   1) Floating hearts background
   ------------------------------------------------------------ */
const heartEmojis = ["💖", "💕", "💗", "❤️", "💞", "🌸", "✨"];

function spawnFloatingHeart() {
  const h = document.createElement("span");
  h.className = "float-heart";
  h.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  h.style.left = Math.random() * 100 + "vw";
  h.style.fontSize = 16 + Math.random() * 22 + "px";
  h.style.animationDuration = 8 + Math.random() * 8 + "s";
  h.style.animationDelay = Math.random() * 3 + "s";
  heartField.appendChild(h);
  setTimeout(() => h.remove(), 18000);
}
setInterval(spawnFloatingHeart, 550);
for (let i = 0; i < 8; i++) setTimeout(spawnFloatingHeart, i * 300);

/* ------------------------------------------------------------
   2) Runaway "No" button
   ------------------------------------------------------------ */
let escapeCount = 0;

function moveNoButton() {
  // First escape → detach from layout so it can roam free
  if (!noBtn.classList.contains("runaway")) {
    const r = noBtn.getBoundingClientRect();
    noBtn.classList.add("runaway");
    noBtn.style.top  = r.top  + "px";
    noBtn.style.left = r.left + "px";
  }

  const pad = 20;
  const btnW = noBtn.offsetWidth;
  const btnH = noBtn.offsetHeight;
  const maxX = window.innerWidth  - btnW - pad;
  const maxY = window.innerHeight - btnH - pad;

  const newX = pad + Math.random() * (maxX - pad);
  const newY = pad + Math.random() * (maxY - pad);

  noBtn.style.left = newX + "px";
  noBtn.style.top  = newY + "px";

  // Shrink & fade slightly as it keeps running
  escapeCount++;
  const scale = Math.max(0.55, 1 - escapeCount * 0.05);
  const opacity = Math.max(0.4, 1 - escapeCount * 0.05);
  noBtn.style.transform = `scale(${scale})`;
  noBtn.style.opacity = opacity;

  // Cheeky messages
  const teases = [
    "No", "Are you sure?", "Really?", "Think again 🥺",
    "Don't do this 😭", "Please?", "Last chance…", "Nope 😌",
    "Try again 💫", "Catch me if you can 🏃‍♀️"
  ];
  noBtn.textContent = teases[Math.min(escapeCount, teases.length - 1)];
}

// Escape on hover (desktop)
noBtn.addEventListener("mouseenter", moveNoButton);
// Escape on tap (mobile) — before click registers
noBtn.addEventListener("touchstart", (e) => {
  e.preventDefault();
  moveNoButton();
}, { passive: false });
// Fallback click protection
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  moveNoButton();
});

/* ------------------------------------------------------------
   3) Yes → celebration
   ------------------------------------------------------------ */
yesBtn.addEventListener("click", () => {
  overlay.classList.add("show");
  burstHearts();
  startOverlayRain();
});

/* Heart burst from the click point */
function burstHearts() {
  const rect = yesBtn.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;

  for (let i = 0; i < 32; i++) {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    c.style.left = originX + "px";
    c.style.top  = originY + "px";

    const angle = Math.random() * Math.PI * 2;
    const dist  = 120 + Math.random() * 280;
    const tx = Math.cos(angle) * dist;
    const ty = Math.sin(angle) * dist;

    c.style.setProperty("--tx", tx + "px");
    c.style.setProperty("--ty", ty + "px");
    c.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    c.style.animationDelay = Math.random() * 0.25 + "s";

    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2200);
  }
}

/* Continuous heart rain while overlay is visible */
let rainInterval = null;
function startOverlayRain() {
  if (rainInterval) return;
  rainInterval = setInterval(() => {
    const c = document.createElement("span");
    c.className = "confetti";
    c.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    c.style.left = Math.random() * window.innerWidth + "px";
    c.style.top  = window.innerHeight + "px";
    c.style.setProperty("--tx", (Math.random() * 200 - 100) + "px");
    c.style.setProperty("--ty", -(window.innerHeight + 100) + "px");
    c.style.setProperty("--rot", (Math.random() * 720 - 360) + "deg");
    c.style.animationDuration = "2.5s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 2800);
  }, 180);
}

/* ------------------------------------------------------------
   4) "Ask again" reset
   ------------------------------------------------------------ */
againBtn.addEventListener("click", () => {
  overlay.classList.remove("show");
  clearInterval(rainInterval);
  rainInterval = null;

  // Reset No button back into the flow
  noBtn.classList.remove("runaway");
  noBtn.removeAttribute("style");
  noBtn.textContent = "No";
  escapeCount = 0;

  // Re-trigger card entrance animation
  card.style.animation = "none";
  void card.offsetWidth;
  card.style.animation = "";
});