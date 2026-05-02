/* ============================================
   SWEET LAYERS — script.js
   ============================================ */

/* ── Navbar scroll effect ── */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 60);
  document.getElementById('backToTop').classList.toggle('visible', window.scrollY > 400);
});

/* ── Hamburger menu ── */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
  });
});

/* ── Parallax hero ── */
const heroBg = document.getElementById('heroBg');
window.addEventListener('scroll', () => {
  if (window.scrollY < window.innerHeight && heroBg) {
    heroBg.style.transform = `translateY(${window.scrollY * 0.3}px)`;
  }
});

/* ── Scroll reveal (IntersectionObserver) ── */
const revealEls = document.querySelectorAll(
  '.reveal-left, .reveal-right, .reveal-up, .reveal-zoom, .reveal-fade'
);
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObserver.observe(el));

/* ── Testimonial carousel ── */
const carousel  = document.getElementById('testimonialCarousel');
const cards     = carousel ? carousel.querySelectorAll('.testimonial-card') : [];
const dotsWrap  = document.getElementById('carouselDots');
let currentSlide = 0;
let autoSlide;

function buildDots() {
  if (!dotsWrap) return;
  cards.forEach((_, i) => {
    const dot = document.createElement('button');
    dot.className = 'dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Review ${i + 1}`);
    dot.addEventListener('click', () => goToSlide(i));
    dotsWrap.appendChild(dot);
  });
}

function goToSlide(index) {
  currentSlide = (index + cards.length) % cards.length;
  carousel.style.transform = `translateX(-${currentSlide * 100}%)`;
  dotsWrap.querySelectorAll('.dot').forEach((d, i) =>
    d.classList.toggle('active', i === currentSlide)
  );
}

function startAuto() {
  autoSlide = setInterval(() => goToSlide(currentSlide + 1), 5000);
}

if (cards.length) {
  carousel.style.transition = 'transform .55s cubic-bezier(.4,0,.2,1)';
  buildDots();
  document.getElementById('prevBtn').addEventListener('click', () => {
    clearInterval(autoSlide);
    goToSlide(currentSlide - 1);
    startAuto();
  });
  document.getElementById('nextBtn').addEventListener('click', () => {
    clearInterval(autoSlide);
    goToSlide(currentSlide + 1);
    startAuto();
  });
  startAuto();
}

/* ═══════════════════════════════════════════════
   WHATSAPP ORDER FORM
═══════════════════════════════════════════════ */
const WA_NUMBER  = '917249762723 ';   // country code + number, no +
const orderForm  = document.getElementById('orderForm');
const formError  = document.getElementById('formError');
const formErrorMsg = document.getElementById('formErrorMsg');
const formRedirecting = document.getElementById('formRedirecting');
const retryWaBtn = document.getElementById('retryWaBtn');

let lastWaUrl = ''; // stored so retry button can reuse it

function showError(msg) {
  formErrorMsg.textContent = msg;
  formError.style.display  = 'flex';
  formError.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}
function hideError() { formError.style.display = 'none'; }

function formatDate(dateStr) {
  if (!dateStr) return '—';
  const [y, m, d] = dateStr.split('-');
  const months = ['Jan','Feb','Mar','Apr','May','Jun',
                  'Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${d} ${months[+m - 1]} ${y}`;
}

function buildWhatsAppMessage(data) {
  const lines = [
    '🎂 *Sweet Layers* 🎂',
    '*New Order Received!*',
    '─────────────────',
    `👤 *Name:* ${data.name}`,
    `📞 *Phone:* ${data.phone}`,
    `🍰 *Cake Type:* ${data.cakeType}`,
    `✍️ *Message on Cake:* ${data.cakeMessage || '—'}`,
    `📅 *Delivery Date:* ${formatDate(data.deliveryDate)}`,
    `📍 *Delivery Address:* ${data.deliveryAddress}`,
    '─────────────────',
    '_Sent via Sweet Layers website_'
  ];
  return lines.join('\n');
}

function sendToWhatsApp(waUrl) {
  lastWaUrl = waUrl;
  // Show redirecting panel, hide form
  orderForm.style.display = 'none';
  formRedirecting.style.display = 'block';
  // Open WhatsApp
  window.open(waUrl, '_blank');
}

if (orderForm) {
  orderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    hideError();

    // ── Collect values ──
    const name            = document.getElementById('customerName').value.trim();
    const phone           = document.getElementById('customerPhone').value.trim();
    const cakeType        = document.getElementById('cakeType').value.trim();
    const cakeMessage     = document.getElementById('cakeMessage').value.trim();
    const deliveryDate    = document.getElementById('deliveryDate').value.trim();
    const deliveryAddress = document.getElementById('deliveryAddress').value.trim();

    // ── Validate required fields ──
    if (!name)            return showError('Please enter your name.');
    if (!phone)           return showError('Please enter your phone number.');
    if (!cakeType)        return showError('Please select a cake type.');
    if (!deliveryDate)    return showError('Please select a delivery date.');
    if (!deliveryAddress) return showError('Please enter the delivery address.');

    // ── Build message ──
    const message = buildWhatsAppMessage({
      name, phone, cakeType, cakeMessage, deliveryDate, deliveryAddress
    });

    // ── Encode & redirect ──
    const encoded = encodeURIComponent(message);
    const waUrl   = `https://wa.me/${WA_NUMBER}?text=${encoded}`;
    sendToWhatsApp(waUrl);
  });
}

// Retry button — reopen WhatsApp with same message
if (retryWaBtn) {
  retryWaBtn.addEventListener('click', () => {
    if (lastWaUrl) window.open(lastWaUrl, '_blank');
  });
}

/* ── Back to top ── */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── Background music toggle ── */
const bgMusic     = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
const musicIcon   = document.getElementById('musicIcon');
const musicLabel  = document.getElementById('musicLabel');
let   musicOn     = false;

if (musicToggle && bgMusic) {
  musicToggle.addEventListener('click', () => {
    musicOn = !musicOn;
    if (musicOn) {
      bgMusic.play().catch(() => {});
      musicIcon.className  = 'fa-solid fa-pause';
      musicLabel.textContent = 'Music On';
    } else {
      bgMusic.pause();
      musicIcon.className  = 'fa-solid fa-music';
      musicLabel.textContent = 'Music Off';
    }
  });
}

/* ── Active nav highlight on scroll ── */
const sections   = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinkEls.forEach(link =>
        link.classList.toggle(
          'active-nav',
          link.getAttribute('href') === '#' + entry.target.id
        )
      );
    }
  });
}, { threshold: 0.45 });
sections.forEach(s => sectionObserver.observe(s));
