// "Push when you're sad": each push shows a different message. Edit the messages below.
const MESSAGES = [
  "I'm so sorry you're sad, baby. I'm right here with you, even if I can't hug you this second.",
  "Breathe in slowly... and out. You're doing better than you think.",
  "You are not too much, and you are not a burden. You are my favorite person.",
  "Whatever happened today, it doesn't change how wonderful you are.",
  "Drink some water, baby. Then come back and push again if you need to.",
  "I love you. I love you. I love you. That's three, and I have infinity more saved up.",
  "Bad days are just days. And you have me on all the good ones too.",
  "It's okay to cry. Let it out, then let me take care of you.",
  "I'm proud of you for getting through today, even if it was hard.",
  "Pretend this is a long, warm hug from me. Squeeze your arms around yourself. Better?",
  "You make my whole world brighter. Let me return the favor and brighten yours.",
  "Tell me what's wrong when you're ready. I'll listen, no fixing, just listening."
];
// shown on every 5th push
const WORRIED = "That's a lot of pushes, baby. Please tell me what's wrong. Call me or text me, I'm here for you.";

(() => {
  const btn = document.getElementById("push-btn");
  if (!btn) return;
  const msgEl = document.getElementById("push-message");
  const label = document.getElementById("push-label");
  const burstBox = document.getElementById("push-hearts");
  const SPARKS = ["💗", "💖", "💕", "♥"];
  let bag = [], last = -1, pushes = 0;

  function nextMessage() { // shuffled, so a message never repeats until all have been shown
    if (!bag.length) {
      bag = MESSAGES.map((_, i) => i).sort(() => Math.random() - 0.5);
      if (bag[bag.length - 1] === last && bag.length > 1) bag.unshift(bag.pop());
    }
    last = bag.pop();
    return MESSAGES[last];
  }

  function burst() {
    for (let i = 0; i < 10; i++) {
      const s = document.createElement("span");
      s.className = "burst";
      s.textContent = SPARKS[Math.floor(Math.random() * SPARKS.length)];
      s.style.setProperty("--dx", Math.round(Math.random() * 260 - 130) + "px");
      s.style.setProperty("--dy", -Math.round(70 + Math.random() * 150) + "px");
      s.addEventListener("animationend", () => s.remove());
      burstBox.appendChild(s);
    }
  }

  btn.addEventListener("click", () => {
    pushes++;
    msgEl.textContent = pushes % 5 === 0 ? WORRIED : nextMessage();
    msgEl.classList.remove("show");
    void msgEl.offsetWidth; // restart the fade-in animation
    msgEl.classList.add("show");
    label.textContent = "push again if you need to";
    burst();
    if (navigator.vibrate) navigator.vibrate(25);
  });
})();
