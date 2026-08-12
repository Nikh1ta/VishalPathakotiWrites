// Shared, deliberately small interactions for every page.
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');
if (navToggle && siteNav) {
  navToggle.addEventListener('click', () => {
    const open = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!open));
    siteNav.classList.toggle('open', !open);
  });
}

document.querySelectorAll('[data-year]').forEach((year) => { year.textContent = new Date().getFullYear(); });

// Reveal content gently as it enters the viewport; content remains visible without JS.
if ('IntersectionObserver' in window) {
  document.documentElement.classList.add('has-js');
  const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
    if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
  }), { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
}
