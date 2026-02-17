// =========================================
// LOKI.AI - Senior AI Engineer Portfolio
// Premium Animations, Popups & Interactions
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initParticleCanvas();
    initNavbarScroll();
    initTypingAnimation();
    initScrollAnimations();
    initSmoothScroll();
    initSkillProgressBars();
    initProjectCardTilt();
    initMobileMenu();
    initCounterAnimation();
    initParallaxOrbs();
    initScrollToTop();
    initProjectModals();
    initMagneticButtons();
    initTechMarquee();
});

// =========================================
// DARK MODE — Default: Light (White)
// =========================================
function initDarkMode() {
    const btn = document.getElementById('dark-mode-btn');
    if (!btn) return;

    // Default is light. Only go dark if explicitly saved.
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    btn.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// =========================================
// PARTICLE CANVAS - Neural Network
// =========================================
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));

    const count = Math.min(50, Math.floor(window.innerWidth / 30));
    const maxDist = 140;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.r = Math.random() * 2 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(99, 102, 241, 0.5)';
            ctx.fill();
        }
    }

    for (let i = 0; i < count; i++) particles.push(new Particle());

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX; mouse.y = e.clientY;
    });

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(99, 102, 241, ${0.12 * (1 - dist / maxDist)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.18 * (1 - dist / 180)})`;
                    ctx.lineWidth = 0.7;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// =========================================
// NAVBAR SCROLL
// =========================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const s = window.scrollY;
        const dark = document.documentElement.getAttribute('data-theme') === 'dark';
        navbar.style.background = s > 50
            ? (dark ? 'rgba(10,10,26,0.95)' : 'rgba(255,255,255,0.95)')
            : (dark ? 'rgba(10,10,26,0.85)' : 'rgba(255,255,255,0.85)');
        navbar.style.boxShadow = s > 50 ? '0 4px 30px rgba(0,0,0,0.08)' : 'none';
        navbar.style.transform = (s > lastScroll && s > 400) ? 'translateY(-100%)' : 'translateY(0)';
        lastScroll = s;
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    window.addEventListener('scroll', () => {
        let cur = '';
        sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 150) cur = sec.id; });
        navLinks.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${cur}`);
        });
    });
}

// =========================================
// TYPING ANIMATION
// =========================================
function initTypingAnimation() {
    const roles = [
        'Agentic AI Systems',
        'LLM Applications',
        'RAG Pipelines',
        'Multi-Agent Workflows',
        'Production AI Platforms'
    ];
    let ri = 0, ci = 0, del = false;
    const el = document.getElementById('typed-text');
    if (!el) return;

    function type() {
        const r = roles[ri];
        if (del) { el.textContent = r.substring(0, --ci); }
        else { el.textContent = r.substring(0, ++ci); }
        let sp = del ? 40 : 80;
        if (!del && ci === r.length) { sp = 2500; del = true; }
        else if (del && ci === 0) { del = false; ri = (ri + 1) % roles.length; sp = 400; }
        setTimeout(type, sp);
    }
    type();
}

// =========================================
// SCROLL ANIMATIONS with stagger
// =========================================
function initScrollAnimations() {
    const els = document.querySelectorAll('.animate-on-scroll');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('visible'), i * 80);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => obs.observe(el));
}

// =========================================
// SMOOTH SCROLL
// =========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(a => {
        a.addEventListener('click', function (e) {
            e.preventDefault();
            const id = this.getAttribute('href');
            if (id === '#') return;
            const t = document.querySelector(id);
            if (t) window.scrollTo({ top: t.offsetTop - 80, behavior: 'smooth' });
        });
    });
}

// =========================================
// SKILL PROGRESS BARS
// =========================================
function initSkillProgressBars() {
    const items = document.querySelectorAll('.skill-item');
    const obs = new IntersectionObserver((entries) => {
        entries.forEach((e, i) => {
            if (e.isIntersecting) {
                setTimeout(() => e.target.classList.add('in-view'), i * 80);
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.5 });
    items.forEach(i => obs.observe(i));
}

// =========================================
// PROJECT CARD TILT
// =========================================
function initProjectCardTilt() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const rx = (e.clientY - r.top - r.height / 2) / 25;
            const ry = (r.width / 2 - (e.clientX - r.left)) / 25;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
        });
    });
}

// =========================================
// MOBILE MENU
// =========================================
function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const nav = document.querySelector('.nav-links');
    if (!btn || !nav) return;
    btn.addEventListener('click', () => {
        nav.classList.toggle('mobile-active');
        btn.classList.toggle('active');
    });
    nav.querySelectorAll('.nav-link').forEach(l => {
        l.addEventListener('click', () => {
            nav.classList.remove('mobile-active');
            btn.classList.remove('active');
        });
    });
}

// =========================================
// COUNTER ANIMATION
// =========================================
function initCounterAnimation() {
    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.stat-item').forEach((item, i) => {
                    setTimeout(() => {
                        const n = item.querySelector('.stat-number');
                        const t = parseInt(n.getAttribute('data-target'));
                        if (t) animateNum(n, t);
                    }, i * 200);
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    const hs = document.querySelector('.hero-stats');
    if (hs) obs.observe(hs);
}

function animateNum(el, target) {
    const dur = 2000, ease = t => 1 - Math.pow(1 - t, 4);
    const start = performance.now();
    const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        el.textContent = Math.floor(ease(p) * target);
        if (p < 1) requestAnimationFrame(tick); else el.textContent = target;
    };
    requestAnimationFrame(tick);
}

// =========================================
// PARALLAX ORBS
// =========================================
function initParallaxOrbs() {
    const orbs = document.querySelectorAll('.gradient-orb');
    document.addEventListener('mousemove', (e) => {
        const mx = e.clientX / window.innerWidth - 0.5;
        const my = e.clientY / window.innerHeight - 0.5;
        orbs.forEach((o, i) => {
            const s = 20 * (i + 1);
            o.style.transform = `translate(${mx * s}px, ${my * s}px)`;
        });
    });
}

// =========================================
// SCROLL TO TOP BUTTON
// =========================================
function initScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>';
    btn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(btn);

    window.addEventListener('scroll', () => {
        btn.classList.toggle('visible', window.scrollY > 600);
    });
    btn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// =========================================
// PROJECT DETAIL MODALS (POPUP)
// =========================================
function initProjectModals() {
    // Create modal overlay
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.innerHTML = `
        <div class="modal-content">
            <button class="modal-close" aria-label="Close">&times;</button>
            <div class="modal-icon"></div>
            <h2 class="modal-title"></h2>
            <p class="modal-subtitle"></p>
            <div class="modal-desc"></div>
            <div class="modal-tech"></div>
            <div class="modal-actions"></div>
        </div>
    `;
    document.body.appendChild(overlay);

    const projectData = [
        {
            icon: '🏪',
            title: 'KadaiGPT',
            subtitle: 'AI-Powered Smart Shop Assistant • 2026',
            desc: 'A production-grade AI assistant for local retailers and small businesses. Built with LangChain agent architecture, it manages inventory, generates sales analytics, provides customer insights, and handles automated GST invoicing — all through natural conversation on WhatsApp in Tamil & English.',
            tech: ['Python', 'FastAPI', 'LangChain', 'WhatsApp', 'Gemini', 'PostgreSQL'],
            highlights: ['📊 Real-time sales analytics dashboard', '🧾 Automated GST invoice generation', '🗣️ Bilingual: Tamil + English NLP', '📦 Smart inventory tracking with alerts'],
        },
        {
            icon: '🎙️',
            title: 'Voice AI Assistant',
            subtitle: 'Real-Time Conversational Agent • 2026',
            desc: 'A cutting-edge voice AI system with OpenAI Whisper for speech-to-text and advanced TTS for natural responses. Features LLM-powered reasoning engine with context memory, WebSocket streaming for real-time interaction, and sub-2-second end-to-end response latency.',
            tech: ['Python', 'Whisper', 'WebSocket', 'LangChain', 'FastAPI', 'TTS'],
            highlights: ['⚡ Sub-2s end-to-end latency', '🔊 Real-time voice streaming', '🧠 Context-aware memory', '🎯 Intent classification engine'],
        },
        {
            icon: '📊',
            title: 'AadhaarInsights 360',
            subtitle: 'UIDAI National Data Hackathon • 2026',
            desc: 'Led Team Neural Breach to analyze 4.94M+ Aadhaar enrollment and update records across India. Discovered critical societal patterns including a 22x update-to-enrolment ratio and 65.3% child enrolment dominance, providing actionable insights for national policy.',
            tech: ['Python', 'Pandas', 'NumPy', 'Seaborn', 'Matplotlib', 'Statistics'],
            highlights: ['📈 4.94M+ records analyzed', '📋 9 statistical visualizations', '🔍 22x update ratio discovery', '🏆 National-level hackathon'],
        },
        {
            icon: '🎯',
            title: 'SkillSync AI',
            subtitle: 'VEL IDEAFORGE 2K26 Finalist',
            desc: 'AI-powered career guidance platform that analyzes student skills, interests, and market trends to recommend personalized career paths. Features RAG-powered retrieval, skill gap analysis with AI-generated learning roadmaps, NLP-based resume analysis, and mock interview preparation.',
            tech: ['Python', 'React', 'LangChain', 'Gemini', 'ChromaDB', 'FastAPI'],
            highlights: ['🎓 Personalized career paths', '📝 AI resume analysis', '🗺️ Learning roadmap generation', '🎤 Mock interview prep'],
        }
    ];

    // Attach click to project cards (not featured)
    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, i) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openModal(projectData[i]));
    });

    // Close modal
    overlay.querySelector('.modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeModal();
    });

    function openModal(data) {
        if (!data) return;
        overlay.querySelector('.modal-icon').textContent = data.icon;
        overlay.querySelector('.modal-title').textContent = data.title;
        overlay.querySelector('.modal-subtitle').textContent = data.subtitle;

        let descHTML = `<p>${data.desc}</p>`;
        if (data.highlights) {
            descHTML += '<div class="modal-highlights">';
            data.highlights.forEach(h => { descHTML += `<div class="modal-highlight-item">${h}</div>`; });
            descHTML += '</div>';
        }
        overlay.querySelector('.modal-desc').innerHTML = descHTML;

        let techHTML = '';
        data.tech.forEach(t => { techHTML += `<span class="modal-tech-tag">${t}</span>`; });
        overlay.querySelector('.modal-tech').innerHTML = techHTML;

        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// =========================================
// MAGNETIC BUTTONS
// =========================================
function initMagneticButtons() {
    document.querySelectorAll('.btn, .cta-btn').forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });
}

// =========================================
// TECH STACK MARQUEE
// =========================================
function initTechMarquee() {
    const marquee = document.querySelector('.tech-marquee-track');
    if (!marquee) return;
    // Duplicate content for seamless loop
    marquee.innerHTML += marquee.innerHTML;
}

// =========================================
// CHAT ANIMATION
// =========================================
const fp = document.querySelector('.featured-project');
if (fp) {
    const co = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            document.querySelectorAll('.message').forEach((msg, i) => {
                msg.style.opacity = '0';
                msg.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    msg.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                    msg.style.opacity = '1';
                    msg.style.transform = 'translateY(0)';
                }, i * 600);
            });
            co.unobserve(fp);
        }
    }, { threshold: 0.3 });
    co.observe(fp);
}

// =========================================
// CONSOLE BRANDING
// =========================================
console.log('%c🚀 LOKI.AI Portfolio\n%cSenior AI Agentic Engineer\n%c📧 lokiiii1211@gmail.com',
    'font-size:20px;font-weight:bold;color:#6366f1;',
    'font-size:14px;color:#8b5cf6;',
    'font-size:12px;color:#22c55e;'
);

// =========================================
// UTILITY
// =========================================
function debounce(fn, ms) {
    let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); };
}
