// Reveal each "reason" as it scrolls into view
const lines = document.querySelectorAll(".story-line");
if (lines.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  lines.forEach((line) => observer.observe(line));
}

// Floating photos among the hearts
const photos = [
  "images/photos/photo-01.png", "images/photos/photo-08.png", "images/photos/photo-04.png", "images/photos/photo-07.png", "images/photos/photo-05.png",
  "images/photos/photo-09.png", "images/photos/photo-02.png", "images/photos/photo-10.png", "images/photos/photo-03.png"
];

const floatBg = document.querySelector(".heart-bg");
if (floatBg) {
  photos.forEach((src, i) => {
    const img = document.createElement("img");
    img.src = src;
    img.alt = "";
    img.className = "float-photo";
    img.style.left = (4 + i * 10.5) + "%";
    img.style.animationDelay = (i * 1.3) + "s";
    img.style.animationDuration = (10 + Math.random() * 6) + "s";
    floatBg.appendChild(img);
  });
}

// Background music that survives page changes
const music = document.getElementById("bg-music");
const toggleBtn = document.getElementById("music-toggle");

if (music && toggleBtn) {
  const savedTime = localStorage.getItem("musicTime");
  const savedMuted = localStorage.getItem("musicMuted") === "true";

  if (savedTime) music.currentTime = parseFloat(savedTime);
  music.muted = savedMuted;
  toggleBtn.textContent = savedMuted ? "🔇" : "🔊";

  music.play().catch(() => {
    document.addEventListener("click", () => music.play(), { once: true });
  });

  setInterval(() => {
    localStorage.setItem("musicTime", music.currentTime);
  }, 1000);

  window.addEventListener("beforeunload", () => {
    localStorage.setItem("musicTime", music.currentTime);
  });

  toggleBtn.addEventListener("click", () => {
    music.muted = !music.muted;
    localStorage.setItem("musicMuted", music.muted);
    toggleBtn.textContent = music.muted ? "🔇" : "🔊";
  });
}

// Reply form: emails her message to me through Web3Forms
const replyForm = document.getElementById("reply-form");
if (replyForm) {
  const status = document.getElementById("reply-status");
  const sendBtn = document.getElementById("reply-send");

  if (replyForm.access_key.value === "YOUR_ACCESS_KEY_HERE") {
    console.warn("Reply form: paste your Web3Forms access key into message.html first.");
  }

  replyForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    sendBtn.disabled = true;
    sendBtn.textContent = "Sending...";
    status.className = "";
    status.textContent = "";

    try {
      const res = await fetch(replyForm.action, {
        method: "POST",
        headers: { Accept: "application/json" },
        body: new FormData(replyForm)
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Send failed");
      replyForm.reset();
      status.className = "ok";
      status.textContent = "Sent! Your message is on its way to me ♥";
    } catch (err) {
      status.className = "error";
      status.textContent = "Oops, it didn't send. Please try again in a bit :(";
    }

    sendBtn.disabled = false;
    sendBtn.textContent = "Send ♥";
  });
}