// Theme Toggle System
(function () {
  const currentTheme = localStorage.getItem('theme') || 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
})();

// Utility for slider buttons (Global scope required for inline onclicks if any, though modern practice avoids this)
let slideIndex = 0;
function moveSlide(dir) {
  const slides = document.querySelector('.slides');
  if (!slides) return;
  const total = slides.children.length;
  slideIndex = (slideIndex + dir + total) % total;
  slides.style.transform = `translateX(-${slideIndex * 100}%)`;
}

document.addEventListener('DOMContentLoaded', () => {

  // --- 1. THEME TOGGLE ---
  const themeToggle = document.getElementById('themeToggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.body.style.transition = 'background-color 0.3s ease, color 0.3s ease';
      document.documentElement.setAttribute('data-theme', newTheme);
      localStorage.setItem('theme', newTheme);

      // Animation effect
      themeToggle.style.transform = 'scale(0.9)';
      setTimeout(() => themeToggle.style.transform = 'scale(1)', 150);
    });
  }

  // --- 2. NAVIGATION SYSTEMS ---
  const navUl = document.querySelector('nav ul');
  const hamburger = document.querySelector('.hamburger');

  // A. Mobile Hamburger Logic
  if (hamburger && navUl) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      navUl.classList.toggle('active');
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!navUl.contains(e.target) && !hamburger.contains(e.target) && navUl.classList.contains('active')) {
        navUl.classList.remove('active');
        hamburger.classList.remove('active');
      }
    });
  }

  // B. Droplet Navigation Effect
  if (navUl) {
    const droplet = document.createElement('div');
    droplet.classList.add('nav-droplet');
    navUl.appendChild(droplet);

    const links = navUl.querySelectorAll('li a');

    function moveDroplet(element) {
      if (!element) return;
      const linkRect = element.getBoundingClientRect();
      const ulRect = navUl.getBoundingClientRect();

      const left = linkRect.left - ulRect.left;
      const top = linkRect.top - ulRect.top;

      droplet.style.width = `${linkRect.width}px`;
      droplet.style.height = `${linkRect.height}px`;
      droplet.style.transform = `translate(${left}px, ${top}px)`;
      droplet.style.opacity = '1';
    }

    // Determine and set active link
    let currentPath = window.location.pathname.split('/').pop();
    if (currentPath === '' || currentPath === '/') currentPath = 'index.html';

    // Find active link (exact match)
    let activeLink = document.querySelector(`nav ul li a[href="${currentPath}"]`);

    if (activeLink) {
      // Small timeout/RAF to wait for layout stability (fonts, css loading)
      requestAnimationFrame(() => moveDroplet(activeLink));
      setTimeout(() => moveDroplet(activeLink), 300);
    }

    // Hover interactions
    links.forEach(link => {
      link.addEventListener('mouseenter', (e) => moveDroplet(e.target));
    });

    // Reset on mouse leave
    navUl.addEventListener('mouseleave', () => {
      if (activeLink) {
        moveDroplet(activeLink);
      } else {
        droplet.style.opacity = '0';
      }
    });

    // Helper for resize events to re-position droplet
    window.addEventListener('resize', () => {
      const currentHover = document.querySelector('nav ul li a:hover');
      if (currentHover) moveDroplet(currentHover);
      else if (activeLink) moveDroplet(activeLink);
    });
  }

  // --- 3. UI ENHANCEMENTS ---

  // Back to Top
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      if (window.pageYOffset > 300) backToTop.classList.add('visible');
      else backToTop.classList.remove('visible');
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Scroll Progress Bar
  const scrollProgress = document.getElementById('scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', () => {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scrolled = (winScroll / height) * 100;
      scrollProgress.style.width = scrolled + '%';
    });
  }

  // Scroll Reveal Animation (Intersection Observer)
  const revealElements = document.querySelectorAll('section, .card, h2, p, footer, .announcement-box, .announcement-banner');
  if ('IntersectionObserver' in window) {
    const revealOnScroll = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          revealOnScroll.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -20px 0px" });

    revealElements.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('active');
      } else {
        el.classList.add('reveal');
        revealOnScroll.observe(el);
      }
    });
  } else {
    // Fallback for older browsers
    revealElements.forEach(el => el.classList.add('active'));
  }

  // Statistics Counter Animation
  const statNumbers = document.querySelectorAll('.stat-number');
  if (statNumbers.length && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.getAttribute('data-target'));
          const duration = 2000; // ms
          const frames = 60;
          const increment = target / (duration / (1000 / frames));

          let current = 0;
          const updateCounter = () => {
            current += increment;
            if (current < target) {
              entry.target.textContent = Math.ceil(current) + (target >= 100 ? '+' : '');
              requestAnimationFrame(updateCounter);
            } else {
              entry.target.textContent = target + (target >= 100 ? '+' : '');
            }
          };
          updateCounter();
          statsObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    statNumbers.forEach(stat => statsObserver.observe(stat));
  }

  // --- 4. PRODUCT PAGE FEATURES ---

  // Carousel & Lightbox
  const sliderContainer = document.querySelector('.slider');
  const slidesContainer = document.getElementById('slides');
  if (sliderContainer && slidesContainer) {
    const images = Array.from(slidesContainer.querySelectorAll('img'));

    // Create Thumbnails
    const thumbContainer = document.createElement('div');
    thumbContainer.className = 'thumbnails-row';
    const wrapper = document.createElement('div');
    wrapper.className = 'slider-wrapper';
    sliderContainer.parentNode.insertBefore(wrapper, sliderContainer);
    wrapper.appendChild(sliderContainer);
    wrapper.appendChild(thumbContainer);

    images.forEach((img, index) => {
      const thumb = document.createElement('img');
      thumb.src = img.src;
      thumb.className = index === 0 ? 'thumb active' : 'thumb';
      thumb.onclick = () => {
        slidesContainer.style.transform = `translateX(-${index * 100}%)`;
        document.querySelectorAll('.thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        if (typeof slideIndex !== 'undefined') slideIndex = index;
      };
      thumbContainer.appendChild(thumb);
    });

    // Lightbox Logic
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.className = 'lightbox';
    lightbox.innerHTML = `<span class="close-lightbox">&times;</span><img class="lightbox-content" id="lightbox-img">`;
    document.body.appendChild(lightbox);

    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-lightbox');

    images.forEach(img => {
      img.style.cursor = 'zoom-in';
      img.addEventListener('click', () => {
        lightbox.style.display = 'block';
        lightboxImg.src = img.src;
      });
    });

    closeBtn.onclick = () => { lightbox.style.display = 'none'; };
    lightbox.onclick = (e) => { if (e.target === lightbox) lightbox.style.display = 'none'; };
  }

  // --- 5. VISUAL EFFECTS ---

  // Liquid Fabric Cursor Animation (Canvas)
  const canvas = document.getElementById('fabricCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let mouse = { x: 0, y: 0 };
    let animationId;

    function resize() {
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
      initParticles();
    }

    class Particle {
      constructor(x, y) {
        this.x = x; this.y = y;
        this.baseX = x; this.baseY = y;
        this.vx = 0; this.vy = 0;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        const dx = mouse.x - this.x;
        const dy = mouse.y - this.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const maxDist = 150;

        if (dist < maxDist) {
          const force = (maxDist - dist) / maxDist;
          const angle = Math.atan2(dy, dx);
          this.vx += Math.cos(angle) * force * 0.6;
          this.vy += Math.sin(angle) * force * 0.6;
        }

        // Return to base
        this.vx += (this.baseX - this.x) * 0.05;
        this.vy += (this.baseY - this.y) * 0.05;
        this.vx *= 0.85;
        this.vy *= 0.85;
        this.x += this.vx;
        this.y += this.vy;
      }
      draw() {
        // Accent color from CSS variable
        ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() || '#3b82f6';
        ctx.globalAlpha = 0.4;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particles = [];
      const spacing = 40;
      const cols = Math.ceil(width / spacing);
      const rows = Math.ceil(height / spacing);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          particles.push(new Particle(i * spacing + (j % 2) * (spacing / 2), j * spacing));
        }
      }
    }

    function drawConnections() {
      ctx.globalAlpha = 0.15;
      ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim() || '#3b82f6';
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          if (Math.sqrt(dx * dx + dy * dy) < 50) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => { p.update(); p.draw(); });
      drawConnections();
      animationId = requestAnimationFrame(animate);
    }

    window.addEventListener('mousemove', (e) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    });

    resize();
    window.addEventListener('resize', resize);
    animate();

    // Cleanup on page leave (though rarely needed for SPA-like feel)
    window.addEventListener('beforeunload', () => cancelAnimationFrame(animationId));
  }
});
