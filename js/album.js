// Our Album: polaroid grid, videos that play themselves, full-screen viewer, favorites, surprise button.
(() => {
  const grid = document.getElementById("album-grid");
  if (!grid) return;
  const $ = (id) => document.getElementById(id);
  const items = (typeof ALBUM !== "undefined" ? ALBUM : []).map((d, i) => Object.assign({ id: i }, d));
  const STICKERS = ["🌸", "💗", "✨", "🎀", "🧸", "🦋"];
  let favs = [], view = "all", list = [], cur = 0, touchX = 0;
  try { favs = JSON.parse(localStorage.getItem("albumFavs")) || []; } catch (e) {}
  const saveFavs = () => { try { localStorage.setItem("albumFavs", JSON.stringify(favs)); } catch (e) {} };

  const videoCount = items.filter((i) => i.type === "video").length;
  $("album-count").textContent = items.length ? (items.length - videoCount) + " photos & " + videoCount + " videos, saved with love 💗" : "";
  const label = (it) => it.caption || (it.date ? new Date(it.date + "T00:00:00").toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" }) : "");

  // videos play by themselves (muted) while on screen, and pause when scrolled away
  const vidObs = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) e.target.play().catch(() => {}); else e.target.pause();
  }), { threshold: 0.6 }) : null;
  const showObs = "IntersectionObserver" in window ? new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) { e.target.classList.add("in"); showObs.unobserve(e.target); }
  }), { threshold: 0.1 }) : null;

  function card(it, idx) {
    const fig = document.createElement("figure");
    fig.className = "polaroid" + (favs.includes(it.id) ? " fav" : "");
    fig.style.setProperty("--tilt", ((it.id * 37) % 7 - 3) * 0.7 + "deg");
    const frame = document.createElement("button");
    frame.className = "frame";
    frame.setAttribute("aria-label", "Open memory " + (idx + 1));
    let media;
    if (it.type === "video") {
      media = document.createElement("video");
      media.src = it.src + "#t=0.1";
      media.muted = true; media.loop = true; media.playsInline = true; media.preload = "metadata";
      media.setAttribute("muted", ""); media.setAttribute("playsinline", "");
      if (vidObs) vidObs.observe(media);
    } else {
      media = document.createElement("img");
      media.src = it.src; media.loading = "lazy"; media.decoding = "async"; media.alt = "A memory of us";
    }
    frame.appendChild(media);
    if (it.type === "video") { const b = document.createElement("span"); b.className = "badge"; b.textContent = "🎬"; frame.appendChild(b); }
    frame.addEventListener("click", () => openLb(idx));
    const cap = document.createElement("figcaption");
    cap.textContent = label(it) || "💗";
    fig.append(frame, cap);
    if (it.id % 5 === 2) { const s = document.createElement("span"); s.className = "sticker"; s.textContent = STICKERS[Math.floor(it.id / 5) % STICKERS.length]; fig.appendChild(s); }
    if (showObs) showObs.observe(fig); else fig.classList.add("in");
    return fig;
  }

  function render() {
    list = items.filter((it) => view === "all" || (view === "video" && it.type === "video") || (view === "fav" && favs.includes(it.id)));
    grid.textContent = "";
    list.forEach((it, i) => grid.appendChild(card(it, i)));
    const empty = $("album-empty");
    empty.hidden = list.length > 0;
    empty.textContent = !items.length ? "The album is empty for now." : view === "fav" ? "No favorites yet. Open a photo and tap the heart." : "Nothing here yet.";
  }

  const lb = $("lb"), stage = $("lb-stage");
  function showLb() {
    const it = list[cur];
    stage.textContent = "";
    let m;
    if (it.type === "video") {
      m = document.createElement("video");
      m.src = it.src; m.controls = true; m.autoplay = true; m.muted = true; m.loop = true; m.playsInline = true;
      m.setAttribute("playsinline", "");
      m.play().catch(() => {});
    } else { m = document.createElement("img"); m.src = it.src; m.alt = "A memory of us"; }
    stage.appendChild(m);
    $("lb-info").textContent = (cur + 1) + " / " + list.length + (label(it) ? "  ·  " + label(it) : "");
    const on = favs.includes(it.id);
    $("lb-fav").textContent = on ? "♥" : "♡";
    $("lb-fav").classList.toggle("on", on);
  }
  function openLb(i) { cur = i; lb.hidden = false; document.body.style.overflow = "hidden"; showLb(); }
  function closeLb() { lb.hidden = true; stage.textContent = ""; document.body.style.overflow = ""; if (view === "fav") render(); }
  const step = (d) => { cur = (cur + d + list.length) % list.length; showLb(); };

  $("lb-close").addEventListener("click", closeLb);
  $("lb-prev").addEventListener("click", () => step(-1));
  $("lb-next").addEventListener("click", () => step(1));
  lb.addEventListener("click", (e) => { if (e.target === lb) closeLb(); });
  stage.addEventListener("touchstart", (e) => { touchX = e.changedTouches[0].clientX; }, { passive: true });
  stage.addEventListener("touchend", (e) => {
    const dx = e.changedTouches[0].clientX - touchX;
    if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
  });
  addEventListener("keydown", (e) => {
    if (lb.hidden) return;
    if (e.key === "Escape") closeLb(); else if (e.key === "ArrowLeft") step(-1); else if (e.key === "ArrowRight") step(1);
  });
  $("lb-fav").addEventListener("click", () => {
    const id = list[cur].id, k = favs.indexOf(id);
    if (k >= 0) favs.splice(k, 1); else favs.push(id);
    saveFavs();
    showLb();
    const fig = view === "fav" ? null : grid.children[cur];
    if (fig) fig.classList.toggle("fav", favs.includes(id));
  });

  document.querySelectorAll(".chip[data-view]").forEach((b) => b.addEventListener("click", () => {
    view = b.dataset.view;
    document.querySelectorAll(".chip[data-view]").forEach((x) => x.classList.toggle("on", x === b));
    render();
  }));
  $("album-surprise").addEventListener("click", () => { if (list.length) openLb(Math.floor(Math.random() * list.length)); });

  render();
})();
