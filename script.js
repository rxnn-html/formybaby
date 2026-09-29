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
  "mybaby1.png", "f2.png", "mybaby4.png", "f1.png", "mybaby5.png",
  "f3.png", "mybaby2.png", "f4.png", "mybaby3.png"
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