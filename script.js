/* ============================================================
   PREMIUM PORTFOLIO — script.js
   ============================================================ */

/* ---- THEME TOGGLE (dark / light) ---- */
const html        = document.documentElement;
const themeToggle = document.getElementById('theme-toggle');
const themeIcon   = document.getElementById('theme-icon');

const savedTheme  = localStorage.getItem('theme') || 'dark';
applyTheme(savedTheme);

themeToggle.addEventListener('click', () => {
  const next = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  localStorage.setItem('theme', next);
});

function applyTheme(theme) {
  html.setAttribute('data-theme', theme);
  if (theme === 'dark') {
    themeIcon.className = 'fas fa-sun';
    themeToggle.setAttribute('aria-label', 'Cambiar a modo claro');
  } else {
    themeIcon.className = 'fas fa-moon';
    themeToggle.setAttribute('aria-label', 'Cambiar a modo oscuro');
  }
}

/* ---- SCROLL PROGRESS BAR ---- */
const scrollProgress = document.getElementById('scroll-progress');

/* ---- BACK TO TOP ---- */
const backToTop = document.getElementById('back-to-top');
backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ---- NAVBAR: glass effect + active link ---- */
const navbar      = document.getElementById('navbar');
const allNavLinks = document.querySelectorAll('.nav-links a');
const allSections = document.querySelectorAll('section[id]');

const NAVBAR_H = 70; // altura de la navbar en px

// Marca el link activo por id de sección
function setActiveLink(id) {
  allNavLinks.forEach(link => {
    link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
  });
}

// IntersectionObserver con zona de detección:
// ignora la navbar (top) y la mitad inferior del viewport (bottom)
// → la sección se activa cuando su borde superior entra en la mitad
//   superior visible de la pantalla (debajo de la navbar)
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      setActiveLink(entry.target.getAttribute('id'));
    }
  });
}, {
  rootMargin: `-${NAVBAR_H}px 0px -50% 0px`,
  threshold: 0
});

allSections.forEach(s => sectionObserver.observe(s));

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY;
  const total    = document.body.scrollHeight - window.innerHeight;

  navbar.classList.toggle('scrolled', scrolled > 40);

  // Barra de progreso
  scrollProgress.style.width = `${Math.min((scrolled / total) * 100, 100)}%`;

  // Botón volver arriba
  backToTop.classList.toggle('visible', scrolled > 400);

  // Caso borde: al llegar al fondo → última sección activa
  if (scrolled + window.innerHeight >= document.body.scrollHeight - 8) {
    const last = allSections[allSections.length - 1];
    if (last) setActiveLink(last.getAttribute('id'));
    return;
  }

  // Caso borde: al estar en el tope → primera sección activa
  if (scrolled < NAVBAR_H) {
    const first = allSections[0];
    if (first) setActiveLink(first.getAttribute('id'));
  }
}, { passive: true });

// Inicializar en carga de página
setActiveLink(allSections[0]?.getAttribute('id') ?? '');

/* ---- HAMBURGER MENU ---- */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('active', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
});

// Close menu on link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  });
});

// Close menu when clicking outside
document.addEventListener('click', e => {
  if (!navbar.contains(e.target)) {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
    hamburger.setAttribute('aria-expanded', 'false');
  }
});

/* ---- TYPING ANIMATION ---- */
const roles = [
  'Desarrollador Full Stack',
  'Ingeniero Electrónico',
  'Ingeniero de Requisitos',
  'Desarrollador Frontend',
  'Desarrollador Backend',
];

const typingEl = document.getElementById('typing-text');
let roleIndex  = 0;
let charIndex  = 0;
let isDeleting = false;

function typeLoop() {
  const current = roles[roleIndex];

  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIndex--);
    if (charIndex < 0) {
      isDeleting  = false;
      roleIndex   = (roleIndex + 1) % roles.length;
      setTimeout(typeLoop, 420);
      return;
    }
    setTimeout(typeLoop, 35);
  } else {
    typingEl.textContent = current.substring(0, charIndex++);
    if (charIndex > current.length) {
      isDeleting = true;
      setTimeout(typeLoop, 2200);
      return;
    }
    setTimeout(typeLoop, 75);
  }
}
setTimeout(typeLoop, 1600);

/* ---- SCROLL REVEAL (IntersectionObserver) ---- */
const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
);

revealEls.forEach(el => revealObserver.observe(el));

/* ---- STAT COUNTER ANIMATION ---- */
const counters = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const duration = 1600; // ms
      const fps    = 60;
      const steps  = Math.round(duration / (1000 / fps));
      let   step   = 0;

      const timer = setInterval(() => {
        step++;
        const progress = easeOutQuad(step / steps);
        el.textContent = Math.round(progress * target);
        if (step >= steps) {
          el.textContent = target;
          clearInterval(timer);
        }
      }, 1000 / fps);

      counterObserver.unobserve(el);
    });
  },
  { threshold: 0.6 }
);

counters.forEach(c => counterObserver.observe(c));

function easeOutQuad(t) { return t * (2 - t); }

/* ---- PROGRESS BARS (trigger animation when visible) ---- */
const progressDivs = document.querySelectorAll('.progress-bar div');

const progressObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.animationPlayState = 'running';
        progressObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.3 }
);

progressDivs.forEach(bar => {
  bar.style.animationPlayState = 'paused';
  progressObserver.observe(bar);
});

/* ---- SMOOTH SCROLL for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 70; // navbar height
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});
