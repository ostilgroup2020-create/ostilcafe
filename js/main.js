/* ═══════════════════════════════════════════════════════════════
   OSTIL CAFÉ — MAIN JAVASCRIPT
   Navigation, scroll effects, menu tabs, form, animations
   ═══════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── NAVIGATION SCROLL ─── */
  const nav = document.getElementById('navbar');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 50);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ─── HAMBURGER / MOBILE MENU ─── */
  const ham = document.getElementById('hamburger');
  const mob = document.getElementById('mobileMenu');
  const cls = document.getElementById('menuClose');

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

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mob.classList.contains('open')) closeMenu();
  });

  /* ─── SCROLL REVEAL WITH STAGGER ─── */
  const reveals = document.querySelectorAll('.reveal,.reveal-left,.reveal-right');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), 0);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  /* ─── ACTIVE NAV LINK HIGHLIGHTING ─── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const sectionSpy = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(a => {
          const isActive = a.getAttribute('href') === '#' + entry.target.id;
          a.style.color = isActive ? 'var(--gold)' : '';
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => sectionSpy.observe(s));

  /* ─── SMOOTH SCROLL FOR NAV LINKS ─── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  /* ─── PARALLAX HERO IMAGE ─── */
  const heroImage = document.querySelector('.hero-image');
  if (heroImage) {
    window.addEventListener('scroll', () => {
      const scrolled = window.scrollY;
      if (scrolled < window.innerHeight) {
        heroImage.style.transform = `translateY(${scrolled * 0.35}px) scale(${1 + scrolled * 0.0003})`;
      }
    }, { passive: true });
  }

  /* ─── COUNTER ANIMATION ─── */
  const statNums = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const text = el.textContent;
    const match = text.match(/(\d+)/);
    if (!match) return;

    const target = parseInt(match[1]);
    const suffix = text.replace(match[1], '').trim();
    const prefix = text.substring(0, text.indexOf(match[1]));
    const duration = 1800;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.round(target * eased);
      el.textContent = prefix + current + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  /* ─── LAZY LOAD IMAGES WITH FADE ─── */
  const lazyImages = document.querySelectorAll('img[data-src]');
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });
        imgObserver.unobserve(img);
      }
    });
  }, { rootMargin: '200px' });

  lazyImages.forEach(img => {
    img.style.opacity = '0';
    img.style.transition = 'opacity 0.6s ease';
    imgObserver.observe(img);
  });

})();


/* ═══════════════════════════════════════════════════════════════
   MENU TAB SWITCH
   ═══════════════════════════════════════════════════════════════ */
function switchTab(name, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-selected', 'false');
  });
  document.querySelectorAll('.menu-panel').forEach(p => p.classList.remove('active'));

  btn.classList.add('active');
  btn.setAttribute('aria-selected', 'true');

  const panel = document.getElementById('tab-' + name);
  panel.classList.add('active');
  panel.classList.remove('visible');
  requestAnimationFrame(() => panel.classList.add('visible'));
}


/* ═══════════════════════════════════════════════════════════════
   FORM SUBMISSION
   ═══════════════════════════════════════════════════════════════ */
function handleSubmit() {
  const btn = document.getElementById('submitBtn');
  const name = document.getElementById('fname').value.trim();
  const email = document.getElementById('femail').value.trim();

  if (!name || !email) {
    btn.textContent = 'Please fill required fields';
    btn.style.background = '#9b2335';
    setTimeout(() => {
      btn.textContent = 'Send Message';
      btn.style.background = '';
    }, 2500);
    return;
  }

  // Show success state
  btn.textContent = 'Message Sent ✓';
  btn.style.background = '#4ade80';
  btn.style.color = '#000';

  // Add confetti burst effect
  createConfetti(btn);

  setTimeout(() => {
    btn.textContent = 'Send Message';
    btn.style.background = '';
    btn.style.color = '';
  }, 3500);

  // Clear form
  document.getElementById('fname').value = '';
  document.getElementById('femail').value = '';
  const phone = document.getElementById('fphone');
  const subject = document.getElementById('fsubject');
  const msg = document.getElementById('fmsg');
  if (phone) phone.value = '';
  if (subject) subject.value = '';
  if (msg) msg.value = '';
}


/* ═══════════════════════════════════════════════════════════════
   CONFETTI BURST (on form submit)
   ═══════════════════════════════════════════════════════════════ */
function createConfetti(origin) {
  const rect = origin.getBoundingClientRect();
  const colors = ['#c8913a', '#e2a84d', '#f2c87a', '#f5ead8', '#4ade80'];

  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position:fixed;
      width:${Math.random() * 6 + 4}px;
      height:${Math.random() * 6 + 4}px;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      border-radius:50%;
      left:${rect.left + rect.width / 2}px;
      top:${rect.top}px;
      pointer-events:none;
      z-index:9999;
      opacity:1;
      transition:all ${Math.random() * 0.8 + 0.5}s ease-out;
    `;
    document.body.appendChild(particle);

    requestAnimationFrame(() => {
      particle.style.left = `${rect.left + rect.width / 2 + (Math.random() - 0.5) * 200}px`;
      particle.style.top = `${rect.top - Math.random() * 120 - 30}px`;
      particle.style.opacity = '0';
      particle.style.transform = `rotate(${Math.random() * 360}deg)`;
    });

    setTimeout(() => particle.remove(), 1500);
  }
}


/* ═══════════════════════════════════════════════════════════════
   CURSOR GLOW EFFECT (desktop only)
   ═══════════════════════════════════════════════════════════════ */
(function () {
  if (window.matchMedia('(pointer: fine)').matches) {
    const glow = document.createElement('div');
    glow.id = 'cursor-glow';
    glow.style.cssText = `
      position:fixed;
      width:300px; height:300px;
      border-radius:50%;
      background:radial-gradient(circle, rgba(200,145,58,0.06) 0%, transparent 70%);
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
      timeout = setTimeout(() => {
        glow.style.opacity = '0';
      }, 2000);
    }, { passive: true });
  }
})();
