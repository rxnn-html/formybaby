// Loading screen: a beating heart shown at the start of a visit and after a refresh.
(() => {
  const KEY = "loaderShown";
  try {
    const n = performance.getEntriesByType("navigation")[0];
    if (n && n.type === "reload") sessionStorage.removeItem(KEY);
    if (sessionStorage.getItem(KEY)) return; // already shown while browsing the other pages
    sessionStorage.setItem(KEY, "1");
  } catch (e) {}

  const css = document.createElement("style");
  css.textContent = `
    #loader { position: fixed; inset: 0; z-index: 10000; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 14px; background: linear-gradient(160deg, #1a1220, #2b1631); color: #f8e7ff; transition: opacity 0.6s ease; }
    #loader.done { opacity: 0; pointer-events: none; }
    #loader svg { width: 110px; height: auto; animation: ldBeat 1.1s ease-in-out infinite; }
    @keyframes ldBeat { 0%, 100% { transform: scale(1); } 15% { transform: scale(1.15); } 30% { transform: scale(1); } 45% { transform: scale(1.1); } }
    #loader .ld-title { font-family: Georgia, serif; font-style: italic; font-size: 1.8rem; }
    #loader .ld-sub { font-family: "Segoe UI", Arial, sans-serif; font-size: 0.85rem; letter-spacing: 0.2em; text-transform: uppercase; color: #ff8fc4; }
    #loader .ld-sub i { font-style: normal; opacity: 0.2; animation: ldDot 1.2s infinite; }
    #loader .ld-sub i:nth-child(2) { animation-delay: 0.2s; }
    #loader .ld-sub i:nth-child(3) { animation-delay: 0.4s; }
    @keyframes ldDot { 0%, 100% { opacity: 0.2; } 50% { opacity: 1; } }`;
  document.head.appendChild(css);

  const box = document.createElement("div");
  box.id = "loader";
  box.setAttribute("role", "status");
  box.setAttribute("aria-label", "Loading");
  box.innerHTML = `
    <svg viewBox="0 0 100 100" aria-hidden="true">
      <defs><linearGradient id="ld-g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#ffa8d2"/><stop offset="1" stop-color="#e0559a"/></linearGradient></defs>
      <path d="M50 88 C18 62 6 44 6 28 C6 15 16 6 29 6 C38 6 46 11 50 19 C54 11 62 6 71 6 C84 6 94 15 94 28 C94 44 82 62 50 88 Z" fill="url(#ld-g)" stroke="#fff" stroke-width="3" stroke-linejoin="round"/>
      <ellipse cx="24" cy="22" rx="8" ry="4.5" transform="rotate(-35 24 22)" fill="#fff" opacity=".45"/>
      <path d="M30 42 Q36 35 42 42" fill="none" stroke="#3a1630" stroke-width="3.5" stroke-linecap="round"/>
      <path d="M58 42 Q64 35 70 42" fill="none" stroke="#3a1630" stroke-width="3.5" stroke-linecap="round"/>
      <ellipse cx="27" cy="52" rx="6.5" ry="4" fill="#ff5f9e" opacity=".55"/>
      <ellipse cx="73" cy="52" rx="6.5" ry="4" fill="#ff5f9e" opacity=".55"/>
      <path d="M43 51 Q50 61 57 51" fill="none" stroke="#3a1630" stroke-width="3.5" stroke-linecap="round"/>
    </svg>
    <div class="ld-title">for my baby</div>
    <div class="ld-sub">loading<i>.</i><i>.</i><i>.</i></div>`;
  document.documentElement.appendChild(box); // goes on <html> so it covers the page from the very first moment

  let minDone = false, loaded = false, hidden = false;
  function hide() {
    if (hidden) return;
    hidden = true;
    box.classList.add("done");
    setTimeout(() => box.remove(), 700);
  }
  const check = () => { if (minDone && loaded) hide(); };
  setTimeout(() => { minDone = true; check(); }, 1400); // always show the heart for a moment
  setTimeout(hide, 6000);                               // never keep her waiting longer than this
  if (document.readyState === "complete") { loaded = true; check(); }
  else addEventListener("load", () => { loaded = true; check(); });
})();
