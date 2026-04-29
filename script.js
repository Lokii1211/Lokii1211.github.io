// =========================================
// LOKI.AI - Premium AI Engineer Portfolio
// Advanced 2D/3D Animations & Interactions
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
    init3DCardDepth();
    initCursorGlow();
    initMorphingShapes();
    initScrollProgress();
    initHeroParticles3D();
    initTextRevealAnimation();
    initFloatingIcons();
});

// =========================================
// DARK MODE
// =========================================
function initDarkMode() {
    const btn = document.getElementById('dark-mode-btn');
    if (!btn) return;
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
// ADVANCED PARTICLE CANVAS - Neural Network 
// =========================================
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    let frame = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));

    const count = Math.min(70, Math.floor(window.innerWidth / 22));
    const maxDist = 160;

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.6;
            this.vy = (Math.random() - 0.5) * 0.6;
            this.r = Math.random() * 2.5 + 0.5;
            this.baseR = this.r;
            this.pulse = Math.random() * Math.PI * 2;
            this.hue = 220 + Math.random() * 40;
        }
        update() {
            this.pulse += 0.02;
            this.r = this.baseR + Math.sin(this.pulse) * 0.5;
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse attraction
            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    this.vx += dx * 0.00008;
                    this.vy += dy * 0.00008;
                }
            }
            // Speed dampening
            this.vx *= 0.999;
            this.vy *= 0.999;
        }
        draw() {
            const glow = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r * 4);
            glow.addColorStop(0, `hsla(${this.hue}, 80%, 65%, 0.8)`);
            glow.addColorStop(1, `hsla(${this.hue}, 80%, 65%, 0)`);
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r * 4, 0, Math.PI * 2);
            ctx.fillStyle = glow;
            ctx.fill();

            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 80%, 70%, 0.9)`;
            ctx.fill();
        }
    }

    for (let i = 0; i < count; i++) particles.push(new Particle());

    document.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX; mouse.y = e.clientY;
    });

    function animate() {
        frame++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < maxDist) {
                    const alpha = 0.15 * (1 - dist / maxDist);
                    const gradient = ctx.createLinearGradient(
                        particles[i].x, particles[i].y,
                        particles[j].x, particles[j].y
                    );
                    gradient.addColorStop(0, `hsla(${particles[i].hue}, 70%, 60%, ${alpha})`);
                    gradient.addColorStop(1, `hsla(${particles[j].hue}, 70%, 60%, ${alpha})`);
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = gradient;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
            // Mouse connection lines
            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 200) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `hsla(270, 80%, 65%, ${0.25 * (1 - dist / 200)})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
}

// =========================================
// 3D HERO PARTICLES (Floating Spheres)
// =========================================
function initHeroParticles3D() {
    const hero = document.querySelector('.hero-visual');
    if (!hero) return;
    const container = document.createElement('div');
    container.className = 'hero-3d-particles';
    hero.prepend(container);

    for (let i = 0; i < 12; i++) {
        const sphere = document.createElement('div');
        sphere.className = 'floating-sphere';
        sphere.style.setProperty('--delay', `${Math.random() * 5}s`);
        sphere.style.setProperty('--duration', `${4 + Math.random() * 6}s`);
        sphere.style.setProperty('--x', `${Math.random() * 100}%`);
        sphere.style.setProperty('--y', `${Math.random() * 100}%`);
        sphere.style.setProperty('--size', `${6 + Math.random() * 18}px`);
        sphere.style.setProperty('--hue', `${220 + Math.random() * 50}`);
        container.appendChild(sphere);
    }
}

// =========================================
// CURSOR GLOW EFFECT
// =========================================
function initCursorGlow() {
    if (window.innerWidth < 768) return;
    const glow = document.createElement('div');
    glow.className = 'cursor-glow';
    document.body.appendChild(glow);

    let cx = 0, cy = 0, tx = 0, ty = 0;
    document.addEventListener('mousemove', (e) => { tx = e.clientX; ty = e.clientY; });

    function update() {
        cx += (tx - cx) * 0.12;
        cy += (ty - cy) * 0.12;
        glow.style.transform = `translate(${cx - 150}px, ${cy - 150}px)`;
        requestAnimationFrame(update);
    }
    update();
}

// =========================================
// 3D CARD DEPTH EFFECT
// =========================================
function init3DCardDepth() {
    document.querySelectorAll('.arch-card, .cert-card, .highlight-card, .contact-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            const rx = (y - 0.5) * 12;
            const ry = (0.5 - x) * 12;
            card.style.transform = `perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px) scale(1.02)`;
            // Shine effect
            card.style.setProperty('--shine-x', `${x * 100}%`);
            card.style.setProperty('--shine-y', `${y * 100}%`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// =========================================
// MORPHING SHAPES BACKGROUND
// =========================================
function initMorphingShapes() {
    const container = document.createElement('div');
    container.className = 'morphing-shapes';
    document.body.prepend(container);

    for (let i = 0; i < 4; i++) {
        const shape = document.createElement('div');
        shape.className = 'morph-shape';
        shape.style.setProperty('--i', i);
        container.appendChild(shape);
    }
}

// =========================================
// SCROLL PROGRESS INDICATOR
// =========================================
function initScrollProgress() {
    const bar = document.createElement('div');
    bar.className = 'scroll-progress-bar';
    document.body.appendChild(bar);

    window.addEventListener('scroll', () => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        const p = (window.scrollY / h) * 100;
        bar.style.width = `${p}%`;
    });
}

// =========================================
// TEXT REVEAL ANIMATION
// =========================================
function initTextRevealAnimation() {
    const titles = document.querySelectorAll('.section-title');
    titles.forEach(title => {
        const text = title.textContent;
        title.innerHTML = '';
        title.setAttribute('data-text', text);
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.className = 'char-reveal';
            span.textContent = char === ' ' ? '\u00A0' : char;
            span.style.setProperty('--char-i', i);
            title.appendChild(span);
        });
    });

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.querySelectorAll('.char-reveal').forEach((c, i) => {
                    setTimeout(() => c.classList.add('revealed'), i * 30);
                });
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.3 });
    document.querySelectorAll('.section-title').forEach(t => obs.observe(t));
}

// =========================================
// FLOATING TECH ICONS  
// =========================================
function initFloatingIcons() {
    const icons = ['⚡', '🧠', '🔗', '📊', '🚀', '💡', '🔮', '⚙️'];
    const container = document.createElement('div');
    container.className = 'floating-icons-bg';
    document.body.prepend(container);

    icons.forEach((icon, i) => {
        const el = document.createElement('span');
        el.className = 'floating-bg-icon';
        el.textContent = icon;
        el.style.setProperty('--fi-delay', `${i * 2}s`);
        el.style.setProperty('--fi-x', `${10 + Math.random() * 80}%`);
        el.style.setProperty('--fi-dur', `${12 + Math.random() * 12}s`);
        container.appendChild(el);
    });
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
        'Production AI Products',
        'Agentic AI Systems',
        'Full-Stack AI Platforms',
        'WhatsApp AI Agents',
        'Freelance AI Solutions',
        'AI-Powered SaaS Products',
        'LangChain & RAG Systems',
        'Your Next AI Product'
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
// PROJECT CARD 3D TILT
// =========================================
function initProjectCardTilt() {
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width;
            const y = (e.clientY - r.top) / r.height;
            const rx = (y - 0.5) * 15;
            const ry = (0.5 - x) * 15;
            card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(20px) scale(1.03)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0) scale(1)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)';
        });
        card.addEventListener('mouseenter', () => {
            card.style.transition = 'transform 0.1s ease';
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
            const s = 25 * (i + 1);
            o.style.transform = `translate(${mx * s}px, ${my * s}px)`;
        });
    });
}

// =========================================
// SCROLL TO TOP
// =========================================
function initScrollToTop() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 15l-6-6-6 6"/></svg>';
    btn.setAttribute('aria-label', 'Scroll to top');
    document.body.appendChild(btn);
    window.addEventListener('scroll', () => { btn.classList.toggle('visible', window.scrollY > 600); });
    btn.addEventListener('click', () => { window.scrollTo({ top: 0, behavior: 'smooth' }); });
}

// =========================================
// PROJECT DETAIL MODALS
// =========================================
function initProjectModals() {
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
        </div>
    `;
    document.body.appendChild(overlay);

    const projectData = [
        {
            icon: '⚡', title: 'Kaizy', subtitle: 'On-Demand Home Services Marketplace • 2026',
            desc: 'Complete marketplace connecting homeowners with verified tradespeople. 18 production pages, 6 API routes, Rapido-style 3-round dispatch engine with atomic job acceptance, dynamic pricing with 35 problem types and 8 multipliers, Razorpay escrow payment system with full booking lifecycle, real-time GPS tracking, WhatsApp-style chat, and 10-type notification cascade — all in 3 languages.',
            tech: ['Next.js 14', 'TypeScript', 'Supabase', 'Razorpay', 'Mapbox', 'Redis'],
            highlights: ['🚀 3-Round Dispatch Engine', '💳 Escrow Payment System', '📍 Real-time GPS Tracking', '💬 WhatsApp-style Chat', '🔔 10-Type Notification Cascade', '🌐 3-Language Support (EN/HI/TA)'],
        },
        {
            icon: '🧠', title: 'Mentixy', subtitle: 'AI Career Intelligence Platform • 2026',
            desc: 'Full-stack career intelligence platform with 15+ features: AI counselor powered by Claude API, coding arena with real-time Judge0 compiler, aptitude practice, company intelligence, CareerDNA™ vector profiling using pgvector (256-dim embeddings), community network, and internship discovery. WebSocket real-time system for messaging, leaderboard updates, and presence tracking.',
            tech: ['Next.js 14', 'FastAPI', 'PostgreSQL', 'Claude AI', 'Redis', 'pgvector'],
            highlights: ['🎯 AI Career Counselor', '💻 Real-time Code Compiler', '🧬 CareerDNA™ Vector Profiling', '📊 Company Intelligence', '🏆 Leaderboard & Streaks', '🔐 JWT RS256 + Supabase RLS'],
        },
        {
            icon: '🏪', title: 'KadaiGPT', subtitle: 'AI Smart Shop Assistant • 2026',
            desc: 'LangChain-based AI agent for local retailers — real-time inventory management, sales analytics, automated GST invoicing, and bilingual NLP queries (Tamil & English). Workers can check stock, generate bills, get daily reports, and manage their entire shop through a simple WhatsApp conversation.',
            tech: ['Python', 'LangChain', 'FastAPI', 'Gemini', 'PostgreSQL', 'WhatsApp API'],
            highlights: ['🧾 Automated GST Invoicing', '🗣️ Bilingual NLP (Tamil & English)', '📦 Real-time Inventory Tracking', '📊 Daily Sales Analytics', '🤖 WhatsApp-native Interface', '⚡ 5+ Hours/Week Saved per Retailer'],
        }
    ];

    const cards = document.querySelectorAll('.project-card');
    cards.forEach((card, i) => {
        card.style.cursor = 'pointer';
        card.addEventListener('click', () => openModal(projectData[i]));
    });

    overlay.querySelector('.modal-close').addEventListener('click', closeModal);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

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
            btn.style.transform = `translate(${x * 0.25}px, ${y * 0.25}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}

// =========================================
// TECH MARQUEE
// =========================================
function initTechMarquee() {
    const marquee = document.querySelector('.tech-marquee-track');
    if (!marquee) return;
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
console.log('%c🚀 LOKI.AI Portfolio\n%cAI Engineer | Agentic AI Expert\n%c📧 lokiiii1211@gmail.com',
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

// =========================================
// CURSOR GLOW TRACKER
// =========================================
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || window.innerWidth < 768) return;
    
    let mouseX = 0, mouseY = 0, glowX = 0, glowY = 0;
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });
    
    function animate() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animate);
    }
    animate();
}

// =========================================
// SCROLL PROGRESS BAR
// =========================================
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (scrollTop / docHeight) * 100;
        bar.style.width = progress + '%';
    });
}

