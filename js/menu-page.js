/* ═══════════════════════════════════════════════════════════════
   OSTIL CAFÉ — MENU PAGE JAVASCRIPT
   Sticky nav, category highlighting, smooth scroll, mobile menu
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── HAMBURGER / MOBILE MENU ─── */
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');
  const cls = document.getElementById('menuClose');

  if (ham && mob && cls) {
    function openMenu() {
      mob.classList.add('open');
      ham.classList.add('open');
      ham.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeMenu() {
      mob.classList.remove('open');
      ham.classList.remove('open');
      ham.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    ham.addEventListener('click', openMenu);
    cls.addEventListener('click', closeMenu);
    mob.querySelectorAll('.mob-link').forEach(a => a.addEventListener('click', closeMenu));

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mob.classList.contains('open')) closeMenu();
    });
  }

  /* ─── SMOOTH SCROLL FOR CATEGORY LINKS ─── */
  document.querySelectorAll('.menu-cat-link').forEach(link => {
    link.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href.startsWith('#')) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ─── ACTIVE CATEGORY HIGHLIGHTING ON SCROLL ─── */
  const categories = document.querySelectorAll('.menu-category');
  const catLinks = document.querySelectorAll('.menu-cat-link');

  function updateActiveCategory() {
    let current = '';
    const offset = 200;

    categories.forEach(section => {
      const rect = section.getBoundingClientRect();
      if (rect.top <= offset) {
        current = section.id;
      }
    });

    catLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === '#' + current) {
        link.classList.add('active');
        // Scroll active link into view in the scrollable nav
        const scrollContainer = link.parentElement;
        if (scrollContainer) {
          const linkRect = link.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          if (linkRect.left < containerRect.left || linkRect.right > containerRect.right) {
            link.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      } else {
        link.classList.remove('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveCategory, { passive: true });
  updateActiveCategory();

  /* ─── CARD REVEAL ON SCROLL ─── */
  const cards = document.querySelectorAll('.menu-card');
  const cardObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }, index * 50);
        cardObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
    cardObserver.observe(card);
  });

  /* ─── PARALLAX HERO ─── */
  const heroImg = document.querySelector('.menu-hero-bg');
  if (heroImg) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < 600) {
        heroImg.style.transform = `translateY(${scrolled * 0.3}px)`;
      }
    }, { passive: true });
  }

  /* ─── CURSOR GLOW (desktop only) ─── */
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position:fixed;
      width:250px; height:250px;
      border-radius:50%;
      background:radial-gradient(circle, rgba(200,145,58,0.05) 0%, transparent 70%);
      pointer-events:none;
      z-index:0;
      transform:translate(-50%, -50%);
      transition:opacity 0.3s;
      opacity:0;
    `;
    document.body.appendChild(glow);

    let timeout;
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = '1';
      clearTimeout(timeout);
      timeout = setTimeout(() => { glow.style.opacity = '0'; }, 2000);
    }, { passive: true });
  }

})();
