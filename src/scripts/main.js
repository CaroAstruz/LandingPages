import { animateCounters } from './counter.js';
import { initLang, getCurrentLang } from './i18n.js';
import { initNewsletter } from './newsletter.js';
import { initDownloadSection } from './download.js';

// ============================
// i18n — detect and apply language
// ============================

initLang();
initNewsletter();
initDownloadSection();

// ============================
// Intersection Observer — scroll animations
// ============================

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Trigger counters if this element or its parent contains [data-counter]
      if (entry.target.querySelector('[data-counter]')) {
        animateCounters(entry.target);
      }

      // Trigger revenue bar segments
      if (entry.target.id === 'revenueBar' || entry.target.querySelector('.revenue-bar')) {
        const segments = document.querySelectorAll('.revenue-segment');
        segments.forEach(seg => seg.classList.add('visible'));
      }

      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

// Observe all animated elements
document.querySelectorAll('.fade-in-up, .tier-card, .step, #revenueBar').forEach(el => {
  observer.observe(el);
});

// Also observe stat containers and royalty visual for counters
document.querySelectorAll('.stats-grid, .royalty-visual').forEach(el => {
  observer.observe(el);
});

// ============================
// Navbar scroll effect
// ============================

const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ============================
// Mobile menu
// ============================

const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

function toggleMenu() {
  const isOpen = mobileMenu.classList.contains('open');
  mobileMenu.classList.toggle('open');
  mobileOverlay.classList.toggle('open');
  hamburger.classList.toggle('active');
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

function closeMenu() {
  mobileMenu.classList.remove('open');
  mobileOverlay.classList.remove('open');
  hamburger.classList.remove('active');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', toggleMenu);
mobileOverlay.addEventListener('click', closeMenu);

// Close menu on link click
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', closeMenu);
});

// ============================
// Smooth scroll for anchor links
// ============================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const href = anchor.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================
// Language switcher — prevent default and navigate with hash
// ============================

document.querySelectorAll('.lang-link').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const lang = link.dataset.lang;
    const hash = window.location.hash;
    window.location.href = '/' + lang + hash;
  });
});
