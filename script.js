/* ============================================================
   TARUN PATIDAR — PORTFOLIO SCRIPT
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Loading screen ---------- */
  const loader = document.getElementById('loader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 500);
  });
  // fallback in case load event is delayed
  setTimeout(() => loader.classList.add('hidden'), 2200);

  /* ---------- Theme: dark only (light theme disabled) ---------- */
  document.documentElement.removeAttribute('data-theme');
  localStorage.removeItem('tp-theme');

  /* ---------- Navbar scroll state + active link ---------- */
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('[data-nav]');
  const sections = document.querySelectorAll('section[id]');
  const scrollProgress = document.getElementById('scrollProgress');
  const backToTop = document.getElementById('backToTop');

  function onScroll() {
    const scrollY = window.scrollY;
    navbar.classList.toggle('scrolled', scrollY > 40);
    backToTop.classList.toggle('visible', scrollY > 600);

    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
    scrollProgress.style.width = pct + '%';

    let currentId = '';
    sections.forEach(sec => {
      const rect = sec.getBoundingClientRect();
      if (rect.top <= 120 && rect.bottom >= 120) currentId = sec.id;
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  backToTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------- Mobile hamburger ---------- */
  const hamburger = document.getElementById('hamburger');
  const navLinksWrap = document.getElementById('navLinks');
  hamburger.addEventListener('click', () => {
    const open = navLinksWrap.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', open);
  });
  navLinksWrap.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    navLinksWrap.classList.remove('open');
    hamburger.classList.remove('open');
  }));

  /* ---------- Custom cursor ---------- */
  const cursorDot = document.getElementById('cursorDot');
  const cursorGlow = document.getElementById('cursorGlow');
  let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
  });
  (function animateGlow() {
    glowX += (mouseX - glowX) * 0.12;
    glowY += (mouseY - glowY) * 0.12;
    cursorGlow.style.left = glowX + 'px';
    cursorGlow.style.top = glowY + 'px';
    requestAnimationFrame(animateGlow);
  })();
  document.querySelectorAll('a, button, .tilt, input, textarea').forEach(el => {
    el.addEventListener('mouseenter', () => cursorDot.classList.add('grow'));
    el.addEventListener('mouseleave', () => cursorDot.classList.remove('grow'));
  });

  /* ---------- Particle background ---------- */
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let particles = [];
  let W, H;

  function resizeCanvas() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  function initParticles() {
    const count = Math.min(70, Math.floor((W * H) / 22000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.4,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      hue: Math.random() > 0.5 ? '59,130,246' : '139,92,246'
    }));
  }
  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.hue},0.5)`;
      ctx.fill();
    });
    // connective lines for nearby particles
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(120,140,255,${0.08 * (1 - dist / 110)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  resizeCanvas();
  initParticles();
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) drawParticles();
  window.addEventListener('resize', () => { resizeCanvas(); initParticles(); });

  /* ---------- Typing animation ---------- */
  const roles = [
    'PHP Developer',
    'Laravel Developer',
    'CakePHP Developer',
    'Backend Engineer'
  ];
  const typedEl = document.getElementById('typedRole');
  let roleIdx = 0, charIdx = 0, deleting = false;

  function typeLoop() {
    const current = roles[roleIdx];
    if (!deleting) {
      charIdx++;
      typedEl.textContent = current.slice(0, charIdx);
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(typeLoop, 1400);
        return;
      }
    } else {
      charIdx--;
      typedEl.textContent = current.slice(0, charIdx);
      if (charIdx === 0) {
        deleting = false;
        roleIdx = (roleIdx + 1) % roles.length;
      }
    }
    setTimeout(typeLoop, deleting ? 40 : 75);
  }
  typeLoop();

  /* ---------- Hero API counter (small flourish) ---------- */
  const heroApiCount = document.getElementById('heroApiCount');
  let apiN = 0;
  const apiTimer = setInterval(() => {
    apiN++;
    heroApiCount.textContent = apiN;
    if (apiN >= 50) clearInterval(apiTimer);
  }, 90);

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('[data-reveal]');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });
  revealEls.forEach(el => revealObserver.observe(el));

  /* ---------- Animated counters (About stats) ---------- */
  const counters = document.querySelectorAll('.stat-num');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1600;
      const start = performance.now();
      function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
      counterObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => counterObserver.observe(el));

  /* ---------- Skill bar fill ---------- */
  const skillBars = document.querySelectorAll('.skill-bar');
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const bar = entry.target;
      const fill = bar.querySelector('.skill-fill');
      fill.style.width = bar.dataset.level + '%';
      skillObserver.unobserve(bar);
    });
  }, { threshold: 0.4 });
  skillBars.forEach(el => skillObserver.observe(el));

  /* ---------- Project card tilt ---------- */
  document.querySelectorAll('.tilt').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const rotateX = ((y / rect.height) - 0.5) * -8;
      const rotateY = ((x / rect.width) - 0.5) * 8;
      card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)';
    });
  });

  /* ---------- Button ripple ---------- */
  document.querySelectorAll('.btn-ripple').forEach(btn => {
    btn.addEventListener('click', function (e) {
      const rect = this.getBoundingClientRect();
      const ripple = document.createElement('span');
      const size = Math.max(rect.width, rect.height);
      ripple.className = 'ripple';
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
      ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

});


setInterval(function () {
    if (
        window.outerWidth - window.innerWidth > 160 ||
        window.outerHeight - window.innerHeight > 160
    ) {
        document.body.innerHTML = "<h1>Developer Tools are not allowed.</h1>";
    }
}, 1000);

// Disable Right Click
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// Disable Developer Tools Shortcuts
document.addEventListener('keydown', function (e) {

    // F12
    if (e.key === 'F12') {
        e.preventDefault();
        return false;
    }

    // Ctrl + Shift + I
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'I') {
        e.preventDefault();
        return false;
    }

    // Ctrl + Shift + J
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'J') {
        e.preventDefault();
        return false;
    }

    // Ctrl + Shift + C
    if (e.ctrlKey && e.shiftKey && e.key.toUpperCase() === 'C') {
        e.preventDefault();
        return false;
    }

    // Ctrl + U
    if (e.ctrlKey && e.key.toUpperCase() === 'U') {
        e.preventDefault();
        return false;
    }

    // Ctrl + S
    if (e.ctrlKey && e.key.toUpperCase() === 'S') {
        e.preventDefault();
        return false;
    }
});
