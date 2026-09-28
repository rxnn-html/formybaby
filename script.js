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

const carousel = document.querySelector(".carousel-container");
if (carousel) {
  let index = 0;
  const slides = carousel.querySelectorAll("video");
  setInterval(() => {
    index = (index + 1) % slides.length;
    carousel.scrollTo({ left: slides[index].offsetLeft - carousel.offsetLeft, behavior: "smooth" });
  }, 4000);
}

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
    img.style.left = (4 + i * 10.5) + "%";                          // spread across the screen
    img.style.animationDelay = (i * 1.3) + "s";                     // stagger the start
    img.style.animationDuration = (10 + Math.random() * 6) + "s";   // vary the speed
    floatBg.appendChild(img);
  });
}