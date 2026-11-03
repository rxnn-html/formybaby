// Love pop-ups: a little bubble with a sweet message pops up every 15-30 seconds.
(() => {
  if (window.__lovePop) return;
  window.__lovePop = true;

  const MIN = 15, MAX = 30, SHOW = 4.5; // seconds: wait between pop-ups (random in this range), and how long each one stays
  const MESSAGES = [
    "hey cutie! 💗",
    "love u <3",
    "keep smiling, baby 😊",
    "you're the best part of my day ♥",
    "drink some water, baby 💧",
    "I'm so proud of you 🥹",
    "thinking of you right now 💭",
    "you're so beautiful, did you know? ✨",
    "sending you a big hug 🤗",
    "you make me so happy 💗",
    "don't forget to eat, cutie 🍓",
    "you're my favorite person 🧸",
    "miss u already 🥺",
    "you deserve all the love in the world 💞",
    "smile for me? 😊",
    "I love you more than yesterday 💌",
    "you're doing great, baby 🌸",
    "hi baby, just saying I love you 💗"
  ];

  const css = document.createElement("style");
  css.textContent = `
    #love-pop { position: fixed; left: 50%; bottom: 90px; z-index: 4000; max-width: min(88vw, 360px); padding: 12px 22px;
      border: 2px solid #fff; border-radius: 999px; background: linear-gradient(135deg, #ff8fc4, #e0559a); color: #fff;
      font: 600 1rem/1.4 "Segoe UI", Arial, sans-serif; text-align: center; pointer-events: none; opacity: 0;
      box-shadow: 0 8px 24px rgba(0,0,0,0.4), 0 0 18px rgba(255,143,196,0.5); transform: translate(-50%, 24px) scale(0.8); }
    #love-pop.show { animation: loveIn 0.5s cubic-bezier(0.2, 1.4, 0.4, 1) forwards; }
    #love-pop.hide { animation: loveOut 0.5s ease forwards; }
    @keyframes loveIn { to { opacity: 1; transform: translate(-50%, 0) scale(1); } }
    @keyframes loveOut { from { opacity: 1; transform: translate(-50%, 0) scale(1); } to { opacity: 0; transform: translate(-50%, -14px) scale(0.9); } }
    @media (prefers-reduced-motion: reduce) { #love-pop.show, #love-pop.hide { animation-duration: 0.01s; } }`;
  document.head.appendChild(css);

  let box = null, bag = [], last = -1;
  const wait = () => setTimeout(pop, (MIN + Math.random() * (MAX - MIN)) * 1000);

  function nextMessage() { // shuffled, so a message never repeats until all have been shown
    if (!bag.length) {
      bag = MESSAGES.map((_, i) => i).sort(() => Math.random() - 0.5);
      if (bag[bag.length - 1] === last && bag.length > 1) bag.unshift(bag.pop());
    }
    last = bag.pop();
    return MESSAGES[last];
  }

  function pop() {
    // stay quiet while the tab is hidden, or while the loading / lock screen is up
    if (document.hidden || document.getElementById("lock-screen") || document.getElementById("loader")) { wait(); return; }
    if (!box) {
      box = document.createElement("div");
      box.id = "love-pop";
      box.setAttribute("role", "status");
      box.setAttribute("aria-live", "polite");
      document.documentElement.appendChild(box); // on <html>, so it always stays pinned to the screen
    }
    box.className = "";
    box.textContent = nextMessage();
    void box.offsetWidth; // restart the animation
    box.className = "show";
    setTimeout(() => { box.className = "hide"; }, SHOW * 1000);
    setTimeout(wait, SHOW * 1000 + 600);
  }

  wait();
})();
