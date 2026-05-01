/* ─────────────────────────────────
   CUSTOM CURSOR
───────────────────────────────── */
const cursor = document.getElementById('cursor');
const cursorFollower = document.getElementById('cursorFollower');

let mouseX = 0, mouseY = 0;
let followerX = 0, followerY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    cursor.style.left = mouseX + 'px';
    cursor.style.top = mouseY + 'px';
});

(function animateFollower() {
    followerX += (mouseX - followerX) * 0.12;
    followerY += (mouseY - followerY) * 0.12;
    cursorFollower.style.left = followerX + 'px';
    cursorFollower.style.top = followerY + 'px';
    requestAnimationFrame(animateFollower);
})();

document.querySelectorAll('a, button, .project-card, .about-card').forEach(el => {
    el.addEventListener('mouseenter', () => cursorFollower.style.transform = 'translate(-50%,-50%) scale(2)');
    el.addEventListener('mouseleave', () => cursorFollower.style.transform = 'translate(-50%,-50%) scale(1)');
});

/* ─────────────────────────────────
   NAVBAR — scroll + hamburger
───────────────────────────────── */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');

window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
});

hamburger.addEventListener('click', () => {
    navbar.classList.toggle('nav-open');
    const spans = hamburger.querySelectorAll('span');
    if (navbar.classList.contains('nav-open')) {
        spans[0].style.transform = 'rotate(45deg) translate(5px,5px)';
        spans[1].style.opacity = '0';
        spans[2].style.transform = 'rotate(-45deg) translate(5px,-5px)';
    } else {
        spans.forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    }
});

// Close nav on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navbar.classList.remove('nav-open');
        hamburger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
    });
});

/* ─────────────────────────────────
   TYPED TEXT EFFECT
───────────────────────────────── */
const phrases = [
    'SEO Specialist',
    'Website Developer',
    'eCommerce Expert',
    'Truck Dispatcher',
    'Digital Marketing Pro',
];
const typedEl = document.getElementById('typedText');
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function type() {
    const current = phrases[phraseIdx];
    if (isDeleting) {
        typedEl.textContent = current.slice(0, --charIdx);
    } else {
        typedEl.textContent = current.slice(0, ++charIdx);
    }

    let speed = isDeleting ? 60 : 100;

    if (!isDeleting && charIdx === current.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
        speed = 400;
    }
    setTimeout(type, speed);
}
type();

/* ─────────────────────────────────
   COUNTER ANIMATION
───────────────────────────────── */
function animateCounter(el) {
    const target = parseInt(el.dataset.target, 10);
    let current = 0;
    const step = Math.ceil(target / 50);
    const timer = setInterval(() => {
        current = Math.min(current + step, target);
        el.textContent = current;
        if (current >= target) clearInterval(timer);
    }, 40);
}

/* ─────────────────────────────────
   INTERSECTION OBSERVER
   — reveal sections + counters
───────────────────────────────── */
const revealEls = document.querySelectorAll('.reveal');
const counters = document.querySelectorAll('.stat-num');
let countersStarted = false;

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Stagger children inside grids
            const children = entry.target.querySelectorAll('.about-card, .skill-category, .project-card, .timeline-item');
            children.forEach((child, i) => {
                child.style.transitionDelay = `${i * 80}ms`;
            });

            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.12 });

revealEls.forEach(el => observer.observe(el));

// Counters trigger only when stats row itself is in view
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
    const heroObserver = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && !countersStarted) {
            countersStarted = true;
            counters.forEach(c => animateCounter(c));
            heroObserver.disconnect();
        }
    }, { threshold: 0.65, rootMargin: '0px 0px -10% 0px' });

    heroObserver.observe(heroStats);
}

/* ─────────────────────────────────
   ACTIVE NAV LINK (scroll spy)
───────────────────────────────── */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

const spyObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(link => {
                link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
            });
        }
    });
}, { rootMargin: '-40% 0px -55% 0px' });

sections.forEach(s => spyObserver.observe(s));

/* ─────────────────────────────────
   CONTACT FORM SUBMIT
───────────────────────────────── */
const form = document.getElementById('contactForm');
form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const btnSpan = btn.querySelector('span');
    const attachmentInput = document.getElementById('attachment');
    const original = btnSpan.textContent;

    if (attachmentInput && attachmentInput.files.length > 0) {
        const file = attachmentInput.files[0];
        const maxSize = 50 * 1024 * 1024;
        const isPdfType = file.type === 'application/pdf';
        const hasPdfExt = file.name.toLowerCase().endsWith('.pdf');

        if (!isPdfType && !hasPdfExt) {
            btnSpan.textContent = 'Only PDF file allowed';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            setTimeout(() => {
                btnSpan.textContent = original;
                btn.style.background = '';
            }, 2500);
            return;
        }

        if (file.size > maxSize) {
            btnSpan.textContent = 'Max file size is 50MB';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            setTimeout(() => {
                btnSpan.textContent = original;
                btn.style.background = '';
            }, 2500);
            return;
        }
    }

    btnSpan.textContent = 'Sending...';
    btn.disabled = true;

    const formData = new FormData(form);

    try {
        const res = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            body: formData
        });
        const json = await res.json();
        if (json.success) {
            btnSpan.textContent = 'Message Sent ✓';
            btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
            setTimeout(() => {
                btnSpan.textContent = original;
                btn.style.background = '';
                btn.disabled = false;
                form.reset();
            }, 3500);
        } else {
            btnSpan.textContent = 'Failed. Try again.';
            btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
            setTimeout(() => {
                btnSpan.textContent = original;
                btn.style.background = '';
                btn.disabled = false;
            }, 3000);
        }
    } catch {
        btnSpan.textContent = 'Error. Try again.';
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
        setTimeout(() => {
            btnSpan.textContent = original;
            btn.style.background = '';
            btn.disabled = false;
        }, 3000);
    }
});

/* ─────────────────────────────────
   SMOOTH SCROLL for anchor links
───────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

/* ─────────────────────────────────
   BACK TO TOP
───────────────────────────────── */
const backTop = document.getElementById('backTop');
window.addEventListener('scroll', () => {
    backTop.style.opacity = window.scrollY > 400 ? '1' : '0.4';
});

/* ─────────────────────────────────
   TILT EFFECT on project cards
───────────────────────────────── */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const midX = rect.width / 2;
        const midY = rect.height / 2;
        const rotateX = ((y - midY) / midY) * 4;
        const rotateY = -((x - midX) / midX) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = '';
    });
});

/* ─────────────────────────────────
   NAV ACTIVE STYLE injection
───────────────────────────────── */
const style = document.createElement('style');
style.textContent = `.nav-link.active { color: var(--text) !important; } .nav-link.active::after { transform: scaleX(1) !important; }`;
document.head.appendChild(style);
