// =======================
// Menu activo según scroll
// =======================
const sections = document.querySelectorAll('section');
const navLinks = document.querySelectorAll('.navbar a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop - 70; // altura navbar
    const sectionHeight = section.offsetHeight;

    if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  // Si llegamos al fondo de la página, marcar la última sección
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
    current = sections[sections.length - 1].getAttribute('id');
  }

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
  });
});


// =======================
// Animación de cards al entrar
// =======================
const cards = document.querySelectorAll(".card");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.3 }
);

cards.forEach((card) => observer.observe(card));

// =======================
// Carrusel básico
// =======================
const carousel = document.querySelector(".carousel");
const slides = document.querySelectorAll(".slide");
const next = document.querySelector(".next");
const prev = document.querySelector(".prev");
let index = 0;

function updateCarousel() {
  carousel.style.transform = `translateX(-${index * 100}%)`;
}

next.addEventListener("click", () => {
  index = (index + 1) % slides.length;
  updateCarousel();
});
prev.addEventListener("click", () => {
  index = (index - 1 + slides.length) % slides.length;
  updateCarousel();
});

setInterval(() => {
  index = (index + 1) % slides.length;
  updateCarousel();
}, 5000);

// Scroll Reveal sin desaparecer
const reveals = document.querySelectorAll(".reveal");

function revealOnScroll() {
  reveals.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.classList.add("active");
    }
  });
}
window.addEventListener("scroll", revealOnScroll);
revealOnScroll();

// Colores dinámicos por tecnología
document.querySelectorAll(".skill-card").forEach((card) => {
  const color = card.dataset.color;
  if (color) card.style.setProperty("--color-hover", color);
});
