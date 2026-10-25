// Lock screen: the site stays hidden until the secret code is entered.
// HASH and HINT are filled in by add-lock.ps1 (the code itself is never stored).
(() => {
  const HASH = "4d2defb7905174d97a411347e5b6b02985bbeb17523d97cec031f7abcff34ae2";
  const HINT = "our fav line, when the clock hits the code for... I-";
  const SALT = "formybaby-lock-v1", ITER = 150000, KEY = "siteUnlocked";

  if (!HASH) return; // no code set yet, so the site stays open
  try { localStorage.removeItem(KEY); const n = performance.getEntriesByType("navigation")[0]; if (n && n.type === "reload") sessionStorage.removeItem(KEY); if (sessionStorage.getItem(KEY) === HASH) return; } catch (e) {}

  async function hashCode(code) {
    const enc = new TextEncoder();
    const norm = code.normalize("NFC").trim().toLowerCase();
    const base = await crypto.subtle.importKey("raw", enc.encode(norm), "PBKDF2", false, ["deriveBits"]);
    const bits = await crypto.subtle.deriveBits(
      { name: "PBKDF2", hash: "SHA-256", salt: enc.encode(SALT), iterations: ITER }, base, 256);
    return Array.from(new Uint8Array(bits), (b) => b.toString(16).padStart(2, "0")).join("");
  }

  const root = document.documentElement;
  root.classList.add("locked");
  const css = document.createElement("style");
  css.textContent = `
    html.locked body > :not(#lock-screen) { display: none !important; }
    #lock-screen { position: fixed; inset: 0; z-index: 9999; display: flex; align-items: center; justify-content: center;
      padding: 24px; background: linear-gradient(160deg, #1a1220, #2b1631); color: #f3e9f7; font-family: "Segoe UI", Arial, sans-serif; }
    #lock-screen form { width: 100%; max-width: 360px; padding: 30px; text-align: center; background: rgba(255,255,255,0.07);
      border: 1px solid rgba(255,143,196,0.45); border-radius: 18px; }
    #lock-screen h1 { margin: 0 0 8px; font-family: Georgia, serif; font-size: 1.6rem; color: #f8e7ff; }
    #lock-screen p { margin: 0 0 14px; font-family: Georgia, serif; font-style: italic; line-height: 1.6; color: #d9c3e3; }
    #lock-screen input { width: 100%; box-sizing: border-box; padding: 12px 14px; text-align: center; font: inherit; color: #f3e9f7;
      background: rgba(26,18,32,0.6); border: 1px solid rgba(255,143,196,0.45); border-radius: 12px; }
    #lock-screen input:focus { outline: none; border-color: #ff8fc4; }
    #lock-screen button { margin-top: 14px; padding: 12px 34px; border: none; border-radius: 999px; background: #e0559a;
      color: #fff; font: inherit; cursor: pointer; }
    #lock-screen button:hover { background: #ff8fc4; }
    #lock-msg { min-height: 1.4em; margin-top: 12px; font-size: 0.95rem; color: #ffb3b3; }`;
  document.head.appendChild(css);

  function build() {
    const box = document.createElement("div");
    box.id = "lock-screen";
    box.innerHTML = '<form autocomplete="off"><h1>hi baby 😉</h1><p>Enter our secret code to come in.</p>' +
      '<p id="lock-hint" hidden></p><input id="lock-code" type="text" aria-label="Secret code" placeholder="secret code" ' +
      'autocomplete="off" autocapitalize="off" spellcheck="false" /><button type="submit">Open ♥</button>' +
      '<div id="lock-msg" role="status"></div></form>';
    document.body.appendChild(box);

    const form = box.querySelector("form"), input = box.querySelector("#lock-code"), msg = box.querySelector("#lock-msg");
    if (HINT) { const h = box.querySelector("#lock-hint"); h.textContent = "Hint: " + HINT; h.hidden = false; }
    input.focus();

    form.addEventListener("submit", async (ev) => {
      ev.preventDefault();
      msg.textContent = "";
      if (!window.crypto || !crypto.subtle) { msg.textContent = "Please open the site from its normal web link."; return; }
      if ((await hashCode(input.value)) === HASH) {
        try { sessionStorage.setItem(KEY, HASH); } catch (e) {}
        root.classList.remove("locked");
        box.remove();
      } else {
        msg.textContent = "That's not it, baby. Try again <3";
        input.select();
      }
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", build); else build();
})();
