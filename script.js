// =====================================================
// LOKI.AI — Agentic AI Engineer Portfolio
// Boot sequence · Agent terminal · LokiBot · ⌘K palette
// =====================================================

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
    initDarkMode();
    initBootSequence();
    initParticleCanvas();
    initNavbar();
    initMobileMenu();
    initTypingAnimation();
    initAgentTerminal();
    initScrollAnimations();
    initCounterAnimation();
    initScrollProgress();
    initCursorGlow();
    initTimelineFill();
    initTiltCards();
    initMagneticButtons();
    initCommandPalette();
    initChatbot();
});

// ---------- Dark mode (dark-first) ----------
function initDarkMode() {
    const btn = document.getElementById('dark-mode-btn');
    const saved = localStorage.getItem('theme');
    // Dark is the default brand experience; light only if explicitly chosen
    if (saved === 'light') {
        document.documentElement.removeAttribute('data-theme');
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
    }
    if (!btn) return;
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

// ---------- Agent boot preloader ----------
function initBootSequence() {
    const preloader = document.getElementById('preloader');
    const body = document.getElementById('boot-body');
    if (!preloader || !body) return;

    const finish = () => {
        preloader.classList.add('done');
        setTimeout(() => preloader.remove(), 600);
    };

    if (prefersReducedMotion || sessionStorage.getItem('booted')) {
        finish();
        return;
    }
    sessionStorage.setItem('booted', '1');

    const lines = [
        { text: '<span class="accent">$</span> loki-agent --init', delay: 100 },
        { text: '→ loading LLM runtime........... <span class="ok">✓</span>', delay: 280 },
        { text: '→ mounting agent tools.......... <span class="ok">✓</span>', delay: 240 },
        { text: '→ connecting vector memory...... <span class="ok">✓</span>', delay: 240 },
        { text: '→ syncing 4 live products....... <span class="ok">✓</span>', delay: 260 },
        { text: '<span class="ok">✦ All systems operational. Welcome.</span>', delay: 320 }
    ];

    let i = 0;
    (function next() {
        if (i >= lines.length) { setTimeout(finish, 420); return; }
        const div = document.createElement('div');
        div.innerHTML = lines[i].text;
        body.appendChild(div);
        i++;
        setTimeout(next, lines[i - 1].delay);
    })();

    // Safety: never trap the user behind the preloader
    setTimeout(finish, 4000);
}

// ---------- Neural particle canvas ----------
function initParticleCanvas() {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas || prefersReducedMotion) { if (canvas) canvas.remove(); return; }
    const ctx = canvas.getContext('2d');
    let particles = [];
    const mouse = { x: null, y: null };

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', debounce(resize, 200));
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    const count = Math.min(64, Math.floor(window.innerWidth / 24));
    const maxDist = 150;

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.45,
            vy: (Math.random() - 0.5) * 0.45,
            r: Math.random() * 1.8 + 0.6
        });
    }

    function isDark() { return document.documentElement.getAttribute('data-theme') === 'dark'; }

    function frame() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const hue = isDark() ? 235 : 243;
        const dotAlpha = isDark() ? 0.7 : 0.45;

        for (const p of particles) {
            p.x += p.vx; p.y += p.vy;
            if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
            if (mouse.x !== null) {
                const dx = mouse.x - p.x, dy = mouse.y - p.y;
                const d = Math.hypot(dx, dy);
                if (d < 180 && d > 0.001) { p.vx += dx / d * 0.004; p.vy += dy / d * 0.004; }
            }
            p.vx *= 0.998; p.vy *= 0.998;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${hue}, 80%, 70%, ${dotAlpha})`;
            ctx.fill();
        }

        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const a = particles[i], b = particles[j];
                const d = Math.hypot(a.x - b.x, a.y - b.y);
                if (d < maxDist) {
                    ctx.beginPath();
                    ctx.moveTo(a.x, a.y);
                    ctx.lineTo(b.x, b.y);
                    ctx.strokeStyle = `hsla(${hue}, 80%, 65%, ${(1 - d / maxDist) * 0.14})`;
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(frame);
    }
    frame();
}

// ---------- Navbar ----------
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const links = document.querySelectorAll('.nav-link');
    const sections = [...links].map(l => document.querySelector(l.getAttribute('href'))).filter(Boolean);

    window.addEventListener('scroll', throttle(() => {
        navbar.classList.toggle('scrolled', window.scrollY > 40);
        // Active section highlight
        let current = sections[0];
        for (const s of sections) {
            if (s.getBoundingClientRect().top <= 120) current = s;
        }
        links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + current.id));
    }, 120));
}

function initMobileMenu() {
    const btn = document.getElementById('mobile-menu-btn');
    const menu = document.getElementById('nav-links');
    if (!btn || !menu) return;
    btn.addEventListener('click', () => {
        const open = menu.classList.toggle('open');
        btn.classList.toggle('open', open);
        btn.setAttribute('aria-expanded', open);
    });
    menu.querySelectorAll('.nav-link').forEach(l => l.addEventListener('click', () => {
        menu.classList.remove('open');
        btn.classList.remove('open');
        btn.setAttribute('aria-expanded', 'false');
    }));
}

// ---------- Hero role typing ----------
function initTypingAnimation() {
    const el = document.getElementById('typed-text');
    if (!el) return;
    const roles = [
        'autonomous AI agents',
        'multi-agent LLM systems',
        'RAG pipelines at scale',
        'production AI products',
        'voice & multilingual AI'
    ];
    if (prefersReducedMotion) { el.textContent = roles[0]; return; }

    let roleIdx = 0, charIdx = 0, deleting = false;
    (function tick() {
        const word = roles[roleIdx];
        el.textContent = word.slice(0, charIdx);
        if (!deleting) {
            if (charIdx < word.length) { charIdx++; setTimeout(tick, 55); }
            else { deleting = true; setTimeout(tick, 2200); }
        } else {
            if (charIdx > 0) { charIdx--; setTimeout(tick, 28); }
            else { deleting = false; roleIdx = (roleIdx + 1) % roles.length; setTimeout(tick, 350); }
        }
    })();
}

// ---------- Simulated agent session terminal ----------
function initAgentTerminal() {
    const body = document.getElementById('terminal-body');
    if (!body) return;

    const script = [
        { html: '<span class="t-prompt">loki@prod</span> <span class="t-dim">~</span> <span class="t-cmd">$ agent run --task "user asks: track ₹500 grocery expense"</span>', d: 900 },
        { html: '<span class="t-accent">[planner]</span> intent → <span class="t-cmd">expense.log</span> · lang: <span class="t-cmd">en-IN</span>', d: 700 },
        { html: '<span class="t-accent">[tools]</span> calling <span class="t-cmd">expense_tracker.add()</span> …', d: 650 },
        { html: '<span class="t-ok">  ✓ db.insert → supabase.expenses (38ms)</span>', d: 550 },
        { html: '<span class="t-accent">[memory]</span> updating user budget context (pgvector)', d: 650 },
        { html: '<span class="t-ok">  ✓ embeddings refreshed</span>', d: 550 },
        { html: '<span class="t-accent">[agent]</span> streaming response → WhatsApp', d: 600 },
        { html: '<span class="t-cmd">  "✅ Recorded! ₹500 groceries. Budget left: ₹1,800"</span>', d: 900 },
        { html: '<span class="t-dim">─────────────────────────────</span>', d: 500 },
        { html: '<span class="t-prompt">loki@prod</span> <span class="t-dim">~</span> <span class="t-cmd">$ agent status --all</span>', d: 750 },
        { html: '<span class="t-ok">  ● viya-ai</span>      <span class="t-dim">uptime 99.5% · 5 langs</span>', d: 420 },
        { html: '<span class="t-ok">  ● kaizy</span>        <span class="t-dim">dispatch engine · escrow live</span>', d: 420 },
        { html: '<span class="t-ok">  ● mentixy</span>      <span class="t-dim">AI counselor · compiler on</span>', d: 420 },
        { html: '<span class="t-ok">  ● kadaigpt</span>     <span class="t-dim">tamil-nlp · gst-invoices</span>', d: 700 },
        { html: '<span class="t-warn">→ 4/4 products healthy. Ready for the next mission.</span>', d: 2600 }
    ];

    if (prefersReducedMotion) {
        body.innerHTML = script.map(l => `<div>${l.html}</div>`).join('');
        return;
    }

    let i = 0;
    (function next() {
        if (i >= script.length) {
            setTimeout(() => { body.innerHTML = ''; i = 0; next(); }, 1200);
            return;
        }
        const div = document.createElement('div');
        div.innerHTML = script[i].html;
        body.appendChild(div);
        while (body.children.length > 14) body.removeChild(body.firstChild);
        body.scrollTop = body.scrollHeight;
        i++;
        setTimeout(next, script[i - 1].d);
    })();
}

// ---------- Scroll reveal ----------
function initScrollAnimations() {
    const els = document.querySelectorAll('.animate-on-scroll');
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach(el => io.observe(el));
}

// ---------- Stat counters ----------
function initCounterAnimation() {
    const nums = document.querySelectorAll('.stat-number');
    if (!nums.length) return;
    const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (!e.isIntersecting) return;
            const el = e.target;
            const target = +el.dataset.target;
            if (prefersReducedMotion) { el.textContent = target; io.unobserve(el); return; }
            const start = performance.now();
            const dur = 1600;
            (function step(now) {
                const p = Math.min((now - start) / dur, 1);
                el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3)));
                if (p < 1) requestAnimationFrame(step);
            })(start);
            io.unobserve(el);
        });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
}

// ---------- Scroll progress ----------
function initScrollProgress() {
    const bar = document.getElementById('scroll-progress');
    if (!bar) return;
    window.addEventListener('scroll', throttle(() => {
        const h = document.documentElement.scrollHeight - window.innerHeight;
        bar.style.width = (h > 0 ? (window.scrollY / h) * 100 : 0) + '%';
    }, 40));
}

// ---------- Cursor glow ----------
function initCursorGlow() {
    const glow = document.getElementById('cursor-glow');
    if (!glow || prefersReducedMotion || 'ontouchstart' in window) { if (glow) glow.remove(); return; }
    let x = 0, y = 0, tx = 0, ty = 0;
    window.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; glow.style.opacity = ''; });
    (function loop() {
        x += (tx - x) * 0.08; y += (ty - y) * 0.08;
        glow.style.left = x + 'px';
        glow.style.top = y + 'px';
        requestAnimationFrame(loop);
    })();
}

// ---------- Timeline progressive fill ----------
function initTimelineFill() {
    const line = document.getElementById('timeline-line');
    if (!line) return;
    window.addEventListener('scroll', throttle(() => {
        const rect = line.getBoundingClientRect();
        const visible = Math.min(Math.max(window.innerHeight * 0.75 - rect.top, 0), rect.height);
        line.style.setProperty('--line-fill', (visible / rect.height) * 100 + '%');
    }, 60));
}

// ---------- 3D tilt cards ----------
function initTiltCards() {
    if (prefersReducedMotion || 'ontouchstart' in window) return;
    document.querySelectorAll('.tilt-card, .project-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const r = card.getBoundingClientRect();
            const px = (e.clientX - r.left) / r.width - 0.5;
            const py = (e.clientY - r.top) / r.height - 0.5;
            card.style.transform = `perspective(900px) rotateY(${px * 7}deg) rotateX(${-py * 7}deg) translateY(-4px)`;
        });
        card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
}

// ---------- Magnetic buttons ----------
function initMagneticButtons() {
    if (prefersReducedMotion || 'ontouchstart' in window) return;
    document.querySelectorAll('.magnetic').forEach(btn => {
        btn.addEventListener('mousemove', e => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
        });
        btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
}

// ---------- Command palette (⌘K) ----------
function initCommandPalette() {
    const palette = document.getElementById('cmd-palette');
    const input = document.getElementById('cmd-input');
    const list = document.getElementById('cmd-list');
    const openBtn = document.getElementById('cmd-btn');
    const backdrop = document.getElementById('cmd-backdrop');
    if (!palette || !input || !list) return;

    const commands = [
        { icon: '🏠', label: 'Go to Home', hint: 'section', action: () => nav('#home') },
        { icon: '👤', label: 'Go to About', hint: 'section', action: () => nav('#about') },
        { icon: '🧠', label: 'Go to Agent Stack', hint: 'section', action: () => nav('#architecture') },
        { icon: '🚀', label: 'Go to Projects', hint: 'section', action: () => nav('#projects') },
        { icon: '⚡', label: 'Go to Skills', hint: 'section', action: () => nav('#skills') },
        { icon: '🛤️', label: 'Go to Journey', hint: 'section', action: () => nav('#timeline') },
        { icon: '📬', label: 'Go to Contact', hint: 'section', action: () => nav('#contact') },
        { icon: '🤖', label: 'Ask LokiBot', hint: 'chat', action: () => { close(); window.__openLokiBot && window.__openLokiBot(); } },
        { icon: '📄', label: 'Open Resume', hint: 'new tab', action: () => window.open('Lokeshkumar_D_AI_Engineer_Resume.html', '_blank') },
        { icon: '🐙', label: 'Open GitHub', hint: 'new tab', action: () => window.open('https://github.com/Lokii1211', '_blank') },
        { icon: '💼', label: 'Open LinkedIn', hint: 'new tab', action: () => window.open('https://linkedin.com/in/lokiiii1211', '_blank') },
        { icon: '💬', label: 'Chat on WhatsApp', hint: 'new tab', action: () => window.open('https://wa.me/919003360494', '_blank') },
        { icon: '🌓', label: 'Toggle Theme', hint: 'ui', action: () => { document.getElementById('dark-mode-btn').click(); close(); } }
    ];
    let filtered = commands;
    let selected = 0;

    function nav(hash) {
        close();
        document.querySelector(hash)?.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth' });
    }
    function render() {
        list.innerHTML = filtered.map((c, i) =>
            `<li class="cmd-item${i === selected ? ' selected' : ''}" data-i="${i}" role="option">
                <span class="cmd-item-icon">${c.icon}</span><span>${c.label}</span>
                <span class="cmd-item-hint">${c.hint}</span>
            </li>`).join('');
        list.querySelectorAll('.cmd-item').forEach(li => {
            li.addEventListener('click', () => filtered[+li.dataset.i].action());
        });
    }
    function open() {
        palette.hidden = false;
        input.value = '';
        filtered = commands; selected = 0;
        render();
        input.focus();
    }
    function close() { palette.hidden = true; }

    openBtn?.addEventListener('click', open);
    backdrop?.addEventListener('click', close);
    input.addEventListener('input', () => {
        const q = input.value.toLowerCase();
        filtered = commands.filter(c => c.label.toLowerCase().includes(q));
        selected = 0;
        render();
    });
    document.addEventListener('keydown', e => {
        if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
            e.preventDefault();
            palette.hidden ? open() : close();
        }
        if (palette.hidden) return;
        if (e.key === 'Escape') close();
        if (e.key === 'ArrowDown') { e.preventDefault(); selected = Math.min(selected + 1, filtered.length - 1); render(); }
        if (e.key === 'ArrowUp') { e.preventDefault(); selected = Math.max(selected - 1, 0); render(); }
        if (e.key === 'Enter' && filtered[selected]) { e.preventDefault(); filtered[selected].action(); }
    });
}

// =====================================================
// LokiBot — client-side AI assistant
// Intent-matched knowledge base + streamed typing
// =====================================================
function initChatbot() {
    const fab = document.getElementById('chatbot-fab');
    const panel = document.getElementById('chatbot-panel');
    const messagesEl = document.getElementById('chatbot-messages');
    const chipsEl = document.getElementById('chatbot-chips');
    const form = document.getElementById('chatbot-form');
    const input = document.getElementById('chatbot-input');
    const minBtn = document.getElementById('chatbot-min');
    const tooltip = document.getElementById('chatbot-tooltip');
    const heroChatBtn = document.getElementById('hero-chat-btn');
    if (!fab || !panel) return;

    // ----- Knowledge base -----
    const KB = [
        {
            intent: 'greeting',
            keywords: ['hi', 'hello', 'hey', 'yo', 'namaste', 'vanakkam', 'good morning', 'good evening'],
            answer: "Hey there! 👋 I'm LokiBot, Lokesh's AI assistant.\n\nI can tell you about his projects, skills, experience, availability, or how to contact him. What would you like to know?",
            chips: ['Show me his projects', 'What are his skills?', 'Is he available for hire?']
        },
        {
            intent: 'projects',
            keywords: ['project', 'products', 'built', 'work', 'portfolio', 'viya', 'kaizy', 'mentixy', 'kadaigpt', 'apps', 'shipped'],
            answer: "Lokesh has shipped 4 live products 🚀\n\n💰 Viya AI — AI life & wealth partner on PWA, WhatsApp & Android. 5 Indian languages, real-time stock insights.\n\n⚡ Kaizy — India's workforce OS: 3-round dispatch engine, Razorpay escrow, GPS tracking, 35 service types.\n\n🧠 Mentixy — AI career intelligence: Claude-powered counselor, live coding arena, CareerDNA™ vector profiling.\n\n🏪 KadaiGPT — WhatsApp shop assistant with Tamil NLP, auto GST invoicing & inventory AI.\n\nAll live, with real users and real infrastructure.",
            chips: ['Tell me about Viya AI', 'What tech does he use?', 'How do I hire him?']
        },
        {
            intent: 'viya',
            keywords: ['viya', 'finance', 'wealth', 'expense', 'money'],
            answer: "💰 Viya AI — his flagship product.\n\nA multi-channel AI personal finance platform: users track expenses, set budgets and get investment insights just by chatting — in 5 Indian languages (EN, HI, TA, TE, KN).\n\nStack: Python, FastAPI, LangChain, Gemini, n8n, Supabase, Vercel. Runs on Android, WhatsApp and PWA with 99.5% uptime.\n\n🔗 Try it: heyviya.vercel.app",
            chips: ['Other projects?', 'What are his skills?', 'Contact Lokesh']
        },
        {
            intent: 'skills',
            keywords: ['skill', 'stack', 'tech', 'technology', 'language', 'framework', 'tools', 'langchain', 'python', 'fastapi', 'rag', 'agent'],
            answer: "⚡ Lokesh's arsenal:\n\n🧠 AI/LLM: LangChain, LangGraph, CrewAI, RAG, multi-agent systems, MCP, function calling, GPT-4 / Claude / Gemini, Whisper\n\n⚙️ Backend: Python, FastAPI, Node.js, WebSockets, n8n\n\n🎨 Frontend: React, Next.js 14, TypeScript, Tailwind\n\n🗄️ Data: PostgreSQL, Supabase, pgvector, ChromaDB, Redis\n\n☁️ DevOps: Docker, Vercel, AWS, GitHub Actions, CI/CD\n\nHis specialty: agentic AI systems that actually reach production.",
            chips: ['Show projects', 'Is he available?', 'View resume']
        },
        {
            intent: 'hire',
            keywords: ['hire', 'available', 'freelance', 'job', 'work with', 'recruit', 'opportunity', 'collaborate', 'salary', 'rate', 'open to'],
            answer: "✅ Yes — Lokesh is available for:\n\n• Full-time AI Engineering roles\n• Freelance AI/ML projects\n• Startup consulting & MVPs\n\nHe's a founder-engineer who has taken 4 products from zero to production — agent orchestration, RAG, payments, real-time systems, the whole stack.\n\nFastest way to reach him:\n📧 lokiiii1211@gmail.com\n💬 WhatsApp: +91 9003360494",
            chips: ['Open WhatsApp', 'View resume', 'See his projects']
        },
        {
            intent: 'contact',
            keywords: ['contact', 'email', 'whatsapp', 'phone', 'reach', 'linkedin', 'github', 'call', 'connect'],
            answer: "📬 Reach Lokesh here:\n\n📧 Email: lokiiii1211@gmail.com\n💬 WhatsApp: +91 9003360494\n💼 LinkedIn: linkedin.com/in/lokiiii1211\n🐙 GitHub: github.com/Lokii1211\n\nHe usually replies fast — especially for interesting AI projects. 😉",
            chips: ['Open WhatsApp', 'Is he available for hire?']
        },
        {
            intent: 'experience',
            keywords: ['experience', 'journey', 'background', 'story', 'timeline', 'history', 'founder', 'startup'],
            answer: "🛤️ The journey so far:\n\n2023 — Started B.Tech IT at Sri Krishna College of Technology\n2025 — Shipped Viya AI (first product live, 99.5% uptime)\n2026 — Co-founded & launched Kaizy, Mentixy and KadaiGPT\nJan 2026 — UIDAI Data Hackathon (led team analyzing 4.94M+ records) + VEL IDEAFORGE 2K26 finalist\n\n310+ commits across 4 revenue-model-backed products. He builds while others plan.",
            chips: ['His achievements?', 'Show projects', 'Hire him']
        },
        {
            intent: 'education',
            keywords: ['education', 'college', 'degree', 'university', 'study', 'btech', 'skct', 'cgpa', 'student'],
            answer: "🎓 Education:\n\nB.Tech in Information Technology\nSri Krishna College of Technology, Coimbatore (2023–2027)\n\nBut honestly? His real education is the 4 production products he's shipped while studying. That's the kind of engineer who doesn't wait for permission to build.",
            chips: ['Show projects', 'His skills?']
        },
        {
            intent: 'achievements',
            keywords: ['achievement', 'award', 'hackathon', 'uidai', 'ideaforge', 'won', 'finalist', 'recognition', 'certificate'],
            answer: "🏆 Recognition:\n\n• UIDAI Data Hackathon 2026 — led Team Neural Breach analyzing 4.94M+ Aadhaar records for national policy insights\n• VEL IDEAFORGE 2K26 — national finalist with SkillSync AI\n• 4 live products shipped with real users & 99.5% uptime\n\nProof-of-work over paper certificates. 💪",
            chips: ['Show projects', 'Hire him', 'Contact']
        },
        {
            intent: 'chatbot',
            keywords: ['who are you', 'what are you', 'lokibot', 'how do you work', 'are you real', 'are you ai', 'chatgpt'],
            answer: "I'm LokiBot 🤖 — a lightweight AI assistant Lokesh built right into this portfolio. No servers, no API costs — just clean client-side engineering with intent matching and streamed responses.\n\nKind of proves the point, doesn't it? He builds AI experiences everywhere — even his portfolio has an agent. 😄",
            chips: ['Show his projects', 'His skills?']
        },
        {
            intent: 'resume',
            keywords: ['resume', 'cv', 'download'],
            answer: "📄 You can view his resume right here:\n\n→ Opening it in a new tab for you…",
            chips: ['His projects', 'Contact him'],
            action: () => setTimeout(() => window.open('Lokeshkumar_D_AI_Engineer_Resume.html', '_blank'), 800)
        },
        {
            intent: 'thanks',
            keywords: ['thank', 'thanks', 'awesome', 'great', 'cool', 'nice', 'bye', 'goodbye'],
            answer: "You're welcome! 🙌 If you're building something with AI — or hiring someone who ships — Lokesh is one message away:\n\n💬 wa.me/919003360494\n📧 lokiiii1211@gmail.com",
            chips: ['Open WhatsApp', 'See projects again']
        }
    ];

    const FALLBACK = {
        answer: "Hmm, I'm not sure about that one 🤔 — I'm focused on everything about Lokesh.\n\nTry asking about his projects, skills, experience, achievements, or how to hire him!",
        chips: ['Show projects', 'His skills?', 'Is he available for hire?']
    };

    const chipActions = {
        'Open WhatsApp': () => window.open('https://wa.me/919003360494', '_blank'),
        'View resume': () => window.open('Lokeshkumar_D_AI_Engineer_Resume.html', '_blank')
    };

    // ----- Engine -----
    function matchIntent(text) {
        const q = text.toLowerCase();
        let best = null, bestScore = 0;
        for (const item of KB) {
            let score = 0;
            for (const kw of item.keywords) {
                if (q.includes(kw)) score += kw.length > 4 ? 2 : 1;
            }
            if (score > bestScore) { bestScore = score; best = item; }
        }
        return bestScore > 0 ? best : FALLBACK;
    }

    function addMsg(text, who) {
        const div = document.createElement('div');
        div.className = `cb-msg ${who}`;
        div.textContent = text;
        messagesEl.appendChild(div);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return div;
    }

    function showTyping() {
        const t = document.createElement('div');
        t.className = 'cb-typing';
        t.innerHTML = '<span></span><span></span><span></span>';
        messagesEl.appendChild(t);
        messagesEl.scrollTop = messagesEl.scrollHeight;
        return t;
    }

    function streamText(el, text, done) {
        if (prefersReducedMotion) { el.textContent = text; done && done(); return; }
        let i = 0;
        (function step() {
            // Type in small chunks for a streaming feel
            i = Math.min(i + 2 + Math.floor(Math.random() * 3), text.length);
            el.textContent = text.slice(0, i);
            messagesEl.scrollTop = messagesEl.scrollHeight;
            if (i < text.length) setTimeout(step, 14);
            else done && done();
        })();
    }

    function setChips(chips) {
        chipsEl.innerHTML = '';
        (chips || []).forEach(label => {
            const b = document.createElement('button');
            b.className = 'cb-chip';
            b.type = 'button';
            b.textContent = label;
            b.addEventListener('click', () => {
                if (chipActions[label]) { chipActions[label](); return; }
                handleUserMessage(label);
            });
            chipsEl.appendChild(b);
        });
    }

    let busy = false;
    function handleUserMessage(text) {
        if (busy || !text.trim()) return;
        busy = true;
        setChips([]);
        addMsg(text, 'user');
        const match = matchIntent(text);
        const typing = showTyping();
        const thinkTime = prefersReducedMotion ? 50 : 600 + Math.random() * 500;
        setTimeout(() => {
            typing.remove();
            const el = addMsg('', 'bot');
            streamText(el, match.answer, () => {
                setChips(match.chips);
                match.action && match.action();
                busy = false;
            });
        }, thinkTime);
    }

    // ----- UI wiring -----
    let opened = false;
    function openPanel() {
        panel.hidden = false;
        fab.classList.add('open');
        tooltip.classList.remove('show');
        input.focus();
        if (!opened) {
            opened = true;
            const typing = showTyping();
            setTimeout(() => {
                typing.remove();
                const el = addMsg('', 'bot');
                streamText(el,
                    "Hey! 👋 I'm LokiBot — Lokesh's personal AI assistant, built into this site.\n\nAsk me anything about his projects, skills, or availability. Recruiters welcome. 😄",
                    () => setChips(['Show me his projects', 'What are his skills?', 'Is he available for hire?']));
            }, prefersReducedMotion ? 50 : 800);
        }
    }
    function closePanel() {
        panel.hidden = true;
        fab.classList.remove('open');
    }

    fab.addEventListener('click', () => panel.hidden ? openPanel() : closePanel());
    minBtn?.addEventListener('click', closePanel);
    heroChatBtn?.addEventListener('click', openPanel);
    window.__openLokiBot = openPanel;

    form.addEventListener('submit', e => {
        e.preventDefault();
        const text = input.value;
        input.value = '';
        handleUserMessage(text);
    });

    // Nudge tooltip after a few seconds
    setTimeout(() => {
        if (panel.hidden) {
            tooltip.classList.add('show');
            setTimeout(() => tooltip.classList.remove('show'), 5000);
        }
    }, 6000);
}

// ---------- Utils ----------
function debounce(fn, ms) {
    let t;
    return (...args) => { clearTimeout(t); t = setTimeout(() => fn(...args), ms); };
}
function throttle(fn, ms) {
    let last = 0, timer;
    return (...args) => {
        const now = Date.now();
        if (now - last >= ms) { last = now; fn(...args); }
        else { clearTimeout(timer); timer = setTimeout(() => { last = Date.now(); fn(...args); }, ms - (now - last)); }
    };
}
