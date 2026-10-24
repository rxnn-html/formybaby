// Catch My Heart: a 30-second heart-catching game
(() => {
  const cv = document.getElementById("game-canvas");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const W = 400, H = 560, DURATION = 30;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  cv.width = W * dpr;
  cv.height = H * dpr;
  ctx.scale(dpr, dpr);

  const $ = (id) => document.getElementById(id);
  const scoreEl = $("score"), timeEl = $("time"), bestEl = $("best");
  const overlay = $("game-overlay"), title = $("game-title"), text = $("game-text"), btn = $("game-start");

  const HEART = new Path2D("M50 88 C18 62 6 44 6 28 C6 15 16 6 29 6 C38 6 46 11 50 19 C54 11 62 6 71 6 C84 6 94 15 94 28 C94 44 82 62 50 88 Z");
  const COLORS = { love: "#ff8fc4", gold: "#ffd166", broken: "#7a6486" };

  let best = 0;
  try { best = Number(localStorage.getItem("heartGameBest")) || 0; } catch (e) {}
  bestEl.textContent = best;

  const player = { x: W / 2, y: H - 74, w: 88, h: 48 };
  let target = W / 2, keys = 0;
  let state = "ready", score = 0, left = DURATION, hearts = [], pops = [], spawnIn = 0, last = 0;

  const clampX = (x) => Math.max(player.w / 2, Math.min(W - player.w / 2, x));

  function drawHeart(x, y, s, type) {
    ctx.save();
    ctx.translate(x, y);
    const k = (s * 2) / 88;
    ctx.scale(k, k);
    ctx.translate(-50, -47);
    ctx.fillStyle = COLORS[type];
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 4;
    ctx.lineJoin = "round";
    ctx.fill(HEART);
    ctx.stroke(HEART);
    if (type === "broken") {
      ctx.strokeStyle = "#1a1220";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(50, 19); ctx.lineTo(42, 40); ctx.lineTo(57, 54); ctx.lineTo(47, 74);
      ctx.stroke();
    }
    ctx.restore();
  }

  function drawPlayer() {
    const { x, y, w, h } = player;
    ctx.fillStyle = "#f3a6b8";
    ctx.beginPath();
    ctx.moveTo(x - w / 2, y); ctx.lineTo(x + w / 2, y);
    ctx.lineTo(x + w / 2 - 12, y + h); ctx.lineTo(x - w / 2 + 12, y + h);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillRect(x - w / 2 - 5, y - 5, w + 10, 9);
    ctx.fillStyle = "rgba(255, 95, 158, 0.55)";
    for (const dx of [-26, 26]) { ctx.beginPath(); ctx.ellipse(x + dx, y + 29, 7, 4, 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.strokeStyle = "#3a1630";
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    for (const dx of [-14, 14]) { ctx.beginPath(); ctx.arc(x + dx, y + 22, 5, Math.PI, 0); ctx.stroke(); }
    ctx.beginPath(); ctx.arc(x, y + 24, 7, 0.15 * Math.PI, 0.85 * Math.PI); ctx.stroke();
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    for (const h of hearts) drawHeart(h.x, h.y, h.s, h.type);
    drawPlayer();
    ctx.font = "bold 20px Georgia, serif";
    ctx.textAlign = "center";
    for (const p of pops) {
      ctx.globalAlpha = Math.min(1, p.life / 0.4);
      ctx.fillStyle = p.color;
      ctx.fillText(p.txt, p.x, p.y);
    }
    ctx.globalAlpha = 1;
  }

  function spawn(t) {
    const r = Math.random();
    const type = r < 0.14 ? "broken" : r < 0.22 ? "gold" : "love";
    hearts.push({
      type,
      x: 26 + Math.random() * (W - 52),
      y: -24,
      s: type === "gold" ? 16 : 14 + Math.random() * 6,
      vy: (150 + t * 4) * (type === "gold" ? 1.3 : 1) * (0.85 + Math.random() * 0.3)
    });
  }

  function caught(h) {
    const pts = h.type === "gold" ? 5 : h.type === "broken" ? -3 : 1;
    score = Math.max(0, score + pts);
    scoreEl.textContent = score;
    pops.push({ x: h.x, y: player.y - 10, life: 0.8, txt: (pts > 0 ? "+" : "−") + Math.abs(pts), color: pts > 0 ? "#ffd1e8" : "#b9a6c9" });
  }

  function update(dt) {
    left -= dt;
    if (left <= 0) { end(); return; }
    timeEl.textContent = Math.ceil(left);
    const t = DURATION - left;

    target = clampX(target + keys * 440 * dt);
    player.x += (target - player.x) * Math.min(1, dt * 16);

    spawnIn -= dt;
    if (spawnIn <= 0) { spawn(t); spawnIn = Math.max(0.38, 0.8 - t * 0.014); }

    for (const h of hearts) {
      h.y += h.vy * dt;
      if (!h.done && h.y + h.s * 0.5 > player.y && h.y < player.y + 24 && Math.abs(h.x - player.x) < player.w / 2 + h.s * 0.3) {
        h.done = true;
        caught(h);
      }
    }
    hearts = hearts.filter((h) => !h.done && h.y < H + 30);
    for (const p of pops) { p.y -= 40 * dt; p.life -= dt; }
    pops = pops.filter((p) => p.life > 0);
  }

  function loop(now) {
    if (state !== "playing") return;
    const dt = Math.min((now - last) / 1000, 0.05); // a hidden tab just pauses the game
    last = now;
    update(dt);
    draw();
    if (state === "playing") requestAnimationFrame(loop);
  }

  function start() {
    score = 0; left = DURATION; hearts = []; pops = []; spawnIn = 0.3;
    target = W / 2; player.x = W / 2;
    scoreEl.textContent = 0;
    timeEl.textContent = DURATION;
    overlay.hidden = true;
    state = "playing";
    last = performance.now();
    requestAnimationFrame(loop);
  }

  function end() {
    state = "over";
    timeEl.textContent = 0;
    const isBest = score > best;
    if (isBest) {
      best = score;
      bestEl.textContent = best;
      try { localStorage.setItem("heartGameBest", best); } catch (e) {}
    }
    const line = score < 15 ? "A cute warm-up round! Try again, baby ♥"
      : score < 30 ? "Nice catching! You're stealing my heart ♥"
      : "Wow... you already have my whole heart ♥";
    title.textContent = "Time's up! 💗";
    text.textContent = "Your score: " + score + "." + (isBest && score > 0 ? " New best! " : " ") + line;
    btn.textContent = "Play again";
    overlay.hidden = false;
    btn.focus();
  }

  const aim = (e) => {
    const r = cv.getBoundingClientRect();
    target = clampX((e.clientX - r.left) * (W / r.width));
  };
  cv.addEventListener("pointermove", aim);
  cv.addEventListener("pointerdown", aim);
  addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "a") keys = -1;
    else if (e.key === "ArrowRight" || e.key === "d") keys = 1;
    else return;
    if (state === "playing") e.preventDefault();
  });
  addEventListener("keyup", (e) => {
    if (["ArrowLeft", "a", "ArrowRight", "d"].includes(e.key)) keys = 0;
  });
  btn.addEventListener("click", start);

  draw(); // first frame: just the basket behind the start screen
})();
