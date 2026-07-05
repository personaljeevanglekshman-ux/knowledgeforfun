document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initTypingAnimation();
  initScrollEffects();
  initLightbox();
  initForms();
  initFooterYear();
});

/* ===== Theme Toggle ===== */
function initTheme() {
  const toggle = document.getElementById('theme-toggle');
  const saved = localStorage.getItem('kff-theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  if (saved) {
    document.documentElement.setAttribute('data-theme', saved);
  } else if (prefersDark) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }

  toggle.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('kff-theme', next);
  });
}

/* ===== Navigation ===== */
function initNavigation() {
  const header = document.getElementById('header');
  const navToggle = document.getElementById('nav-toggle');
  const navClose = document.getElementById('nav-close');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav__link');
  const sections = document.querySelectorAll('section[id]');

  navToggle.addEventListener('click', () => navMenu.classList.add('show'));
  navClose.addEventListener('click', () => navMenu.classList.remove('show'));

  navLinks.forEach(link => {
    link.addEventListener('click', () => navMenu.classList.remove('show'));
  });

  window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 50);

    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');

      if (scrollPos >= top && scrollPos < top + height) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  });
}

/* ===== Typing Animation ===== */
function initTypingAnimation() {
  const el = document.getElementById('typing-text');
  const phrases = [
    'Discover the World Through Stories',
    'Nature, Architecture & Photography',
    'Knowledge For Fun'
  ];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = current.substring(0, charIndex - 1);
      charIndex--;
    } else {
      el.textContent = current.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === current.length) {
      speed = 2500;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      speed = 500;
    }

    setTimeout(type, speed);
  }

  type();
}

/* ===== Scroll Effects ===== */
function initScrollEffects() {
  const scrollTop = document.getElementById('scroll-top');
  const fadeElements = document.querySelectorAll('.fade-in');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  fadeElements.forEach(el => observer.observe(el));

  window.addEventListener('scroll', () => {
    scrollTop.classList.toggle('visible', window.scrollY > 400);
  });

  scrollTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ===== Lightbox ===== */
function initLightbox() {
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightbox-img');
  const lightboxCaption = document.getElementById('lightbox-caption');
  const closeBtn = document.getElementById('lightbox-close');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');
  const items = document.querySelectorAll('.gallery__item');

  const images = Array.from(items).map(item => ({
    src: item.querySelector('img').src.replace('w=600', 'w=1200'),
    alt: item.querySelector('img').alt,
    caption: item.querySelector('.gallery__overlay span').textContent
  }));

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    updateLightbox();
    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightbox() {
    const img = images[currentIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.textContent = img.caption;
  }

  items.forEach((item, index) => {
    item.addEventListener('click', () => openLightbox(index));
  });

  closeBtn.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => {
    if (e.target === lightbox) closeLightbox();
  });

  prevBtn.addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex - 1 + images.length) % images.length;
    updateLightbox();
  });

  nextBtn.addEventListener('click', e => {
    e.stopPropagation();
    currentIndex = (currentIndex + 1) % images.length;
    updateLightbox();
  });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') {
      currentIndex = (currentIndex - 1 + images.length) % images.length;
      updateLightbox();
    }
    if (e.key === 'ArrowRight') {
      currentIndex = (currentIndex + 1) % images.length;
      updateLightbox();
    }
  });
}

/* ===== Form Validation ===== */
function initForms() {
  const newsletterForm = document.getElementById('newsletter-form');
  const contactForm = document.getElementById('contact-form');

  newsletterForm.addEventListener('submit', e => {
    e.preventDefault();
    const emailInput = document.getElementById('newsletter-email');
    const errorEl = document.getElementById('newsletter-error');
    const successEl = document.getElementById('newsletter-success');

    errorEl.textContent = '';
    successEl.hidden = true;

    const email = emailInput.value.trim();
    if (!email) {
      errorEl.textContent = 'Please enter your email address.';
      emailInput.classList.add('error');
      return;
    }
    if (!isValidEmail(email)) {
      errorEl.textContent = 'Please enter a valid email address.';
      emailInput.classList.add('error');
      return;
    }

    emailInput.classList.remove('error');
    newsletterForm.querySelector('.form-group').style.display = 'none';
    newsletterForm.querySelector('.btn').style.display = 'none';
    successEl.hidden = false;
  });

  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    clearContactErrors();

    const fields = {
      name: document.getElementById('contact-name'),
      email: document.getElementById('contact-email'),
      subject: document.getElementById('contact-subject'),
      message: document.getElementById('contact-message')
    };

    let valid = true;

    if (!fields.name.value.trim()) {
      showError('name-error', 'Please enter your name.');
      fields.name.classList.add('error');
      valid = false;
    }
    if (!fields.email.value.trim()) {
      showError('email-error', 'Please enter your email.');
      fields.email.classList.add('error');
      valid = false;
    } else if (!isValidEmail(fields.email.value.trim())) {
      showError('email-error', 'Please enter a valid email.');
      fields.email.classList.add('error');
      valid = false;
    }
    if (!fields.subject.value.trim()) {
      showError('subject-error', 'Please enter a subject.');
      fields.subject.classList.add('error');
      valid = false;
    }
    if (!fields.message.value.trim()) {
      showError('message-error', 'Please enter a message.');
      fields.message.classList.add('error');
      valid = false;
    } else if (fields.message.value.trim().length < 10) {
      showError('message-error', 'Message must be at least 10 characters.');
      fields.message.classList.add('error');
      valid = false;
    }

    if (!valid) return;

    document.getElementById('contact-success').hidden = false;
    contactForm.reset();
  });

  document.querySelectorAll('.form-group input, .form-group textarea').forEach(input => {
    input.addEventListener('input', () => input.classList.remove('error'));
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function showError(id, message) {
  document.getElementById(id).textContent = message;
}

function clearContactErrors() {
  ['name-error', 'email-error', 'subject-error', 'message-error'].forEach(id => {
    document.getElementById(id).textContent = '';
  });
  document.querySelectorAll('#contact-form input, #contact-form textarea').forEach(el => {
    el.classList.remove('error');
  });
  document.getElementById('contact-success').hidden = true;
}

/* ===== Footer Year ===== */
function initFooterYear() {
  document.getElementById('footer-year').textContent = new Date().getFullYear();
}
