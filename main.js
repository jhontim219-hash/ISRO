const loader = document.getElementById('loader');
const loaderFill = document.getElementById('loader-fill');
const loaderPct = document.getElementById('loader-pct');
const uiOverlay = document.getElementById('ui-overlay');
const cursor = document.getElementById('cursor');
const navLinks = [...document.querySelectorAll('.nav__links a')];
const progressFill = document.getElementById('progress-fill');
const progressDots = document.getElementById('progress-dots');
const scrollHint = document.getElementById('scroll-hint');
const soundToggle = document.getElementById('sound-toggle');
const backgroundAudio = document.getElementById('background-audio');
const heroVideo = document.getElementById('hero-video');
const chapters = Array.from(document.querySelectorAll('.chapter'));

backgroundAudio.volume = 0.18;
backgroundAudio.muted = false;
backgroundAudio.currentTime = 0;

const chapterCount = chapters.length;
for (let i = 0; i < chapterCount; i += 1) {
  const dot = document.createElement('div');
  dot.className = 'progress-dot';
  if (i === 0) dot.classList.add('is-active');
  progressDots.appendChild(dot);
}
const progressDotsNodes = [...document.querySelectorAll('.progress-dot')];

const revealElements = document.querySelectorAll('[data-reveal]');
revealElements.forEach((item, index) => {
  item.style.transitionDelay = `${Math.min(index * 0.06, 0.42)}s`;
});

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-revealed');
      const chapter = entry.target.closest('.chapter');
      if (chapter) chapter.classList.add('is-revealed');
    }
  });
}, { threshold: 0.2, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('[data-reveal], .chapter').forEach((item) => revealObserver.observe(item));

let loaderValue = 0;
const loaderInterval = setInterval(() => {
  loaderValue += Math.random() * 14 + 4;
  if (loaderValue >= 100) {
    clearInterval(loaderInterval);
    loaderValue = 100;
  }
  loaderFill.style.width = `${loaderValue}%`;
  loaderPct.textContent = `${Math.round(loaderValue)}%`;
}, 120);

setTimeout(() => {
  loader.classList.add('is-hidden');
  uiOverlay.classList.add('is-ready');
  soundToggle.classList.remove('is-muted');
  backgroundAudio.currentTime = 0;
  backgroundAudio.play().catch(() => {
    console.warn('Autoplay audio was blocked by the browser.');
  });
  setTimeout(() => scrollHint.classList.add('is-hidden'), 1600);
}, 2100);

const lenis = new Lenis({ duration: 1.15, smoothWheel: true, wheelMultiplier: 0.9, touchMultiplier: 0.9 });
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

gsap.registerPlugin(ScrollTrigger);

gsap.from('.title-hindi', { opacity: 0, y: 80, duration: 1.6, ease: 'power3.out' });
gsap.from('.title-sub', { opacity: 0, y: 40, duration: 1.2, delay: 0.4 });
gsap.from('.hero__badge', { opacity: 0, y: -24, duration: 0.9, delay: 0.2 });

gsap.to('#hero-video', {
  y: -40,
  scale: 1.12,
  ease: 'none',
  scrollTrigger: {
    trigger: '#chapter-0',
    start: 'top top',
    end: 'bottom top',
    scrub: true,
  },
});

window.addEventListener('scroll', () => {
  const shift = window.scrollY * 0.08;
  if (heroVideo) heroVideo.style.transform = `translate3d(0, ${shift}px, 0) scale(1.08)`;
}, { passive: true });

gsap.timeline({
  scrollTrigger: {
    trigger: '#content',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1,
    onUpdate: self => {
      const progress = self.progress;
      progressFill.style.height = `${Math.max(progress * 100, 0)}%`;
      const activeIndex = Math.min(Math.floor(progress * (chapterCount - 1)), chapterCount - 1);
      progressDotsNodes.forEach((dot, index) => dot.classList.toggle('is-active', index === activeIndex));
      navLinks.forEach((link, index) => link.classList.toggle('is-active', index === activeIndex));
    },
  },
}).to('#hud', { opacity: 1, duration: 0.3 }).to('.scroll-hint', { opacity: 0, duration: 0.3 }, 0);

gsap.to('.chapter--launch .countdown__num', {
  scale: 1.4,
  duration: 1.2,
  ease: 'power2.out',
  scrollTrigger: {
    trigger: '#chapter-5',
    start: 'top center',
    end: 'bottom top',
    scrub: 1,
  },
});

const countdownText = document.querySelector('.countdown__num');
let countdownValue = 10;
const launchCountdown = setInterval(() => {
  if (countdownValue <= 0) {
    clearInterval(launchCountdown);
    countdownText.textContent = 'IGNITION';
    return;
  }
  countdownValue -= 1;
  countdownText.textContent = countdownValue;
}, 900);

gsap.to('.future-grid .future-card', {
  y: -8,
  stagger: 0.12,
  repeat: -1,
  yoyo: true,
  duration: 2.6,
  ease: 'sine.inOut',
});

gsap.utils.toArray('.chapter__media').forEach((media, index) => {
  gsap.fromTo(media, {
    opacity: 0,
    y: 32,
    rotate: -1.4,
  }, {
    opacity: 1,
    y: 0,
    rotate: 0,
    duration: 0.85,
    delay: index * 0.06,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: media,
      start: 'top 86%',
      toggleActions: 'play none none reverse',
    },
  });
});

gsap.utils.toArray('.chapter__panel div, .chapter__specs li').forEach((item, index) => {
  gsap.fromTo(item, {
    opacity: 0,
    y: 18,
  }, {
    opacity: 1,
    y: 0,
    duration: 0.55,
    delay: index * 0.04,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: item,
      start: 'top 92%',
      toggleActions: 'play none none reverse',
    },
  });
});

gsap.utils.toArray('.chapter').forEach((section) => {
  gsap.fromTo(section, {
    opacity: 0.35,
    y: 30,
  }, {
    opacity: 1,
    y: 0,
    duration: 0.9,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: section,
      start: 'top 82%',
      toggleActions: 'play none none reverse',
    },
  });
});

document.querySelectorAll('.nav__links a').forEach((link) => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.getElementById(`chapter-${link.dataset.nav}`);
    if (target) lenis.scrollTo(target, { offset: -40, duration: 1.5 });
  });
});

window.addEventListener('mousemove', (e) => {
  cursor.style.left = `${e.clientX}px`;
  cursor.style.top = `${e.clientY}px`;
});

document.querySelectorAll('a, button, .future-card').forEach((el) => {
  el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
});

soundToggle.addEventListener('click', async () => {
  const isMuted = soundToggle.classList.toggle('is-muted');
  backgroundAudio.muted = isMuted;
  if (!isMuted) {
    backgroundAudio.currentTime = 0;
    try {
      await backgroundAudio.play();
    } catch (error) {
      console.warn('Audio playback could not start automatically:', error);
    }
  } else {
    backgroundAudio.pause();
  }
});

const hudMission = document.getElementById('hud-mission');
const hudAlt = document.getElementById('hud-alt');
const hudVel = document.getElementById('hud-vel');
const hudPhase = document.getElementById('hud-phase');

function updateHud() {
  const scrolled = window.scrollY / (document.body.scrollHeight - window.innerHeight);
  hudMission.textContent = scrolled < 0.4 ? 'STANDBY' : scrolled < 0.7 ? 'LAUNCH PREP' : 'ORBIT';
  hudAlt.textContent = `${Math.round(scrolled * 420)} km`;
  hudVel.textContent = `${(scrolled * 9.8).toFixed(2)} km/s`;
  hudPhase.textContent = scrolled < 0.35 ? 'PRE-LAUNCH' : scrolled < 0.6 ? 'ASCENT' : 'DEEP SPACE';
}
window.addEventListener('scroll', updateHud, { passive: true });
updateHud();
