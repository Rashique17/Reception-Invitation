const openBtn = document.getElementById("openBtn");
const petalsHost = document.getElementById("petals");

if (openBtn) {
  const setPressed = (pressed) => {
    openBtn.classList.toggle("is-pressed", pressed);
  };

  openBtn.addEventListener("pointerdown", () => setPressed(true));
  openBtn.addEventListener("pointerup", () => setPressed(false));
  openBtn.addEventListener("pointercancel", () => setPressed(false));
  openBtn.addEventListener("blur", () => setPressed(false));

  openBtn.addEventListener("click", () => {
    try {
      window.sessionStorage.setItem("playMusic", "1");
    } catch {}
    window.location.href = "./details.html";
  });
}

const bgMusic = document.getElementById("bgMusic");

if (bgMusic) {
  let shouldPlay = false;

  try {
    shouldPlay = window.sessionStorage.getItem("playMusic") === "1";
    window.sessionStorage.removeItem("playMusic");
  } catch {}

  if (shouldPlay) {
    bgMusic.loop = true;

    const attachResume = () => {
      const resume = () => {
        const next = bgMusic.play();
        if (next && typeof next.catch === "function") next.catch(() => {});
      };

      window.addEventListener("pointerdown", resume, { once: true });
      window.addEventListener("keydown", resume, { once: true });
    };

    const started = bgMusic.play();
    if (started && typeof started.catch === "function") started.catch(attachResume);
  }
}

if (petalsHost) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const petalCount = reduceMotion ? 0 : 22;

  for (let i = 0; i < petalCount; i += 1) {
    const petal = document.createElement("span");
    petal.className = "petal";

    const left = Math.random() * 100;
    const delay = Math.random() * 7;
    const duration = 9 + Math.random() * 7;
    const drift = (Math.random() * 2 - 1) * (20 + Math.random() * 70);
    const scale = 0.7 + Math.random() * 0.9;

    petal.style.left = `${left}%`;
    petal.style.animationDelay = `${delay}s`;
    petal.style.animationDuration = `${duration}s`;
    petal.style.setProperty("--drift", `${drift}px`);
    petal.style.transform = `scale(${scale})`;

    petalsHost.appendChild(petal);
  }
}

const revealEls = document.querySelectorAll(".reveal");

if (revealEls.length) {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.2 }
    );

    revealEls.forEach((el) => observer.observe(el));
  }
}

const cdDays = document.getElementById("cdDays");
const cdHours = document.getElementById("cdHours");
const cdMinutes = document.getElementById("cdMinutes");
const cdSeconds = document.getElementById("cdSeconds");

if (cdDays && cdHours && cdMinutes && cdSeconds) {
  const target = new Date("2027-01-03T19:00:00+06:00").getTime();

  const pad2 = (n) => String(n).padStart(2, "0");

  const tick = () => {
    const now = Date.now();
    let diff = target - now;

    if (diff < 0) diff = 0;

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    cdDays.textContent = String(days);
    cdHours.textContent = pad2(hours);
    cdMinutes.textContent = pad2(minutes);
    cdSeconds.textContent = pad2(seconds);
  };

  tick();
  setInterval(tick, 1000);
}

const carouselTrack = document.getElementById("thanksCarouselTrack");

if (carouselTrack) {
  const carousel = carouselTrack.closest(".carousel");
  const prevBtn = carousel ? carousel.querySelector(".carousel-btn--prev") : null;
  const nextBtn = carousel ? carousel.querySelector(".carousel-btn--next") : null;
  const dots = carousel ? Array.from(carousel.querySelectorAll(".carousel-dot")) : [];
  const slides = Array.from(carouselTrack.querySelectorAll(".carousel-slide"));
  const slideCount = slides.length;
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!slideCount) {
    if (prevBtn) prevBtn.disabled = true;
    if (nextBtn) nextBtn.disabled = true;
  }

  let index = 0;
  let timerId = null;

  const setIndex = (next) => {
    if (!slideCount) return;
    index = ((next % slideCount) + slideCount) % slideCount;
    slides.forEach((s, i) => s.classList.toggle("is-active", i === index));

    dots.forEach((d) => d.classList.toggle("is-active", d.dataset.index === String(index)));
  };

  const stopAuto = () => {
    if (timerId) window.clearInterval(timerId);
    timerId = null;
  };

  const startAuto = () => {
    if (reduceMotion || !slideCount) return;
    stopAuto();
    timerId = window.setInterval(() => setIndex(index + 1), 3000);
  };

  const manual = (next) => {
    setIndex(next);
    startAuto();
  };

  if (prevBtn) prevBtn.addEventListener("click", () => manual(index - 1));
  if (nextBtn) nextBtn.addEventListener("click", () => manual(index + 1));

  dots.forEach((d) => {
    d.addEventListener("click", () => manual(Number(d.dataset.index || 0)));
  });

  if (carousel) {
    carousel.addEventListener("pointerenter", stopAuto);
    carousel.addEventListener("pointerleave", startAuto);
    carousel.addEventListener("focusin", stopAuto);
    carousel.addEventListener("focusout", startAuto);
  }

  setIndex(0);
  startAuto();
}
