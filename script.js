/**
 * LOKESH.AI — Engineering Portfolio & Interactive AI Assistant
 * Client Logic: Ambient Particle Canvas, Dynamic Spotlights, Magnetic Physics,
 *               Interactive FAQ Accordion, Command Palette (⌘K), Staggered Scroll Reveals,
 *               and Knowledge-Powered AI Chatbot Assistant.
 */

document.addEventListener('DOMContentLoaded', () => {
    initAmbientNeonCanvas();
    initScrollProgress();
    initMobileNav();
    initScrollSpy();
    initAccordion();
    initCopyButtons();
    initCommandPalette();
    initCardSpotlights();
    initScrollReveals();
    initMagneticButtons();
    initAIChatbot();
});

/**
 * 1. Interactive Ambient Particle Canvas (Optimized for White Theme)
 */
function initAmbientNeonCanvas() {
    const canvas = document.getElementById('ambient-neon-canvas');
    if (!canvas) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        canvas.style.display = 'none';
        return;
    }

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let particles = [];
    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 30 : 65;
    const maxConnectionDistance = isMobile ? 90 : 130;

    let mouse = { x: null, y: null, radius: 140 };

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    }, { passive: true });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.45;
            this.vy = (Math.random() - 0.5) * 0.45;
            this.radius = Math.random() * 1.6 + 0.8;
            this.color = Math.random() > 0.3 ? 'rgba(2, 132, 199, ' : 'rgba(99, 102, 241, ';
            this.alpha = Math.random() * 0.35 + 0.12;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Subtle mouse repulsion
            if (mouse.x !== null && mouse.y !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < mouse.radius) {
                    const force = (mouse.radius - dist) / mouse.radius;
                    const angle = Math.atan2(dy, dx);
                    this.x -= Math.cos(angle) * force * 1.8;
                    this.y -= Math.sin(angle) * force * 1.8;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}${this.alpha})`;
            ctx.fill();
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        for (let i = 0; i < particles.length; i++) {
            particles[i].update();
            particles[i].draw();

            // Connect nearby particles
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxConnectionDistance) {
                    const linkAlpha = (1 - dist / maxConnectionDistance) * 0.18;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(2, 132, 199, ${linkAlpha})`;
                    ctx.lineWidth = 0.8;
                    ctx.stroke();
                }
            }
        }

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * 2. Top Scroll Progress Bar
 */
function initScrollProgress() {
    const progressBar = document.querySelector('.scroll-progress-bar');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${scrollPercent}%`;
    }, { passive: true });
}

/**
 * 3. Mobile Navigation Drawer
 */
function initMobileNav() {
    const toggleBtn = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });

    document.addEventListener('click', (e) => {
        if (!toggleBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('is-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * 4. Active Scroll Spy Navigation
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    if (!sections.length || !navLinks.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, {
        rootMargin: '-30% 0px -70% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

/**
 * 5. Single-Focus FAQ Accordion
 */
function initAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    if (!faqItems.length) return;

    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');

            // Close all other accordion items for clean focus
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('is-open');
                    const otherTrigger = otherItem.querySelector('.faq-trigger');
                    if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
                }
            });

            // Toggle current item
            if (isOpen) {
                item.classList.remove('is-open');
                trigger.setAttribute('aria-expanded', 'false');
            } else {
                item.classList.add('is-open');
                trigger.setAttribute('aria-expanded', 'true');
            }
        });
    });
}

/**
 * 6. Copy to Clipboard Action with Toast Notice
 */
function initCopyButtons() {
    const copyTriggers = document.querySelectorAll('[data-copy]');
    const toast = document.querySelector('.toast-notice');

    copyTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-copy');
            if (!textToCopy) return;

            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(btn.getAttribute('data-copy-label') || 'Copied to clipboard!');
            }).catch(() => {
                // Fallback for older browsers
                const tempInput = document.createElement('input');
                tempInput.value = textToCopy;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                showToast(btn.getAttribute('data-copy-label') || 'Copied to clipboard!');
            });
        });
    });

    function showToast(msg) {
        if (!toast) return;
        toast.textContent = msg;
        toast.classList.add('is-active');
        clearTimeout(toast._timeout);
        toast._timeout = setTimeout(() => {
            toast.classList.remove('is-active');
        }, 3000);
    }
}

/**
 * 7. Command Palette HUD (⌘K / Ctrl+K)
 */
function initCommandPalette() {
    const backdrop = document.querySelector('.cmd-palette-backdrop');
    const input = document.querySelector('.cmd-search-input');
    const resultsList = document.querySelector('.cmd-results-list');
    const triggerButtons = document.querySelectorAll('.cmd-k-trigger');
    if (!backdrop || !input || !resultsList) return;

    const navigationItems = [
        { label: 'View Flagship System (Viya AI)', url: '#project-viya', category: 'Project' },
        { label: 'Inspect SmartDetect Multi-Camera Re-ID v2.0', url: '#project-smartdetect', category: 'Vision' },
        { label: 'Explore Kaizy Workforce OS', url: '#project-kaizy', category: 'Project' },
        { label: 'Review Mentixy Career Intelligence', url: '#project-mentixy', category: 'Project' },
        { label: 'Check KadaiGPT Retail AI', url: '#project-kadaigpt', category: 'Project' },
        { label: 'Inspect AadhaarAnalytics 360 Research', url: '#project-aadhaar', category: 'Hackathon' },
        { label: 'Agentic AI & LLM Systems Architecture', url: '#manifesto', category: 'Architecture' },
        { label: 'Categorized Technical Arsenal & Skills', url: '#skills', category: 'Skills' },
        { label: 'Engineering Milestones & Timeline', url: '#journey', category: 'Journey' },
        { label: 'Frequently Asked Engineering Questions', url: '#faq', category: 'FAQ' },
        { label: 'Contact Lokeshkumar D (Direct Channels)', url: '#contact', category: 'Contact' },
        { label: 'Download Verified Engineering Resume (A4 Print)', url: 'Lokeshkumar_D_AI_Engineer_Resume.html', category: 'Resume' }
    ];

    function openPalette() {
        backdrop.classList.add('is-open');
        input.value = '';
        renderResults(navigationItems);
        setTimeout(() => input.focus(), 50);
    }

    function closePalette() {
        backdrop.classList.remove('is-open');
    }

    function renderResults(items) {
        resultsList.innerHTML = '';
        if (!items.length) {
            resultsList.innerHTML = '<li style="padding: 16px; color: var(--text-muted); text-align: center;">No matching commands found</li>';
            return;
        }

        items.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = `cmd-result-item ${index === 0 ? 'is-focused' : ''}`;
            li.innerHTML = `
                <span>${item.label}</span>
                <span class="cmd-result-shortcut">${item.category}</span>
            `;
            li.addEventListener('click', () => {
                closePalette();
                if (item.url.startsWith('#')) {
                    const target = document.querySelector(item.url);
                    if (target) target.scrollIntoView({ behavior: 'smooth' });
                } else {
                    window.open(item.url, '_blank');
                }
            });
            resultsList.appendChild(li);
        });
    }

    triggerButtons.forEach(btn => btn.addEventListener('click', openPalette));

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (backdrop.classList.contains('is-open')) {
                closePalette();
            } else {
                openPalette();
            }
        } else if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
            closePalette();
        }
    });

    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closePalette();
    });

    input.addEventListener('input', () => {
        const query = input.value.toLowerCase().trim();
        const filtered = navigationItems.filter(item => 
            item.label.toLowerCase().includes(query) || 
            item.category.toLowerCase().includes(query)
        );
        renderResults(filtered);
    });
}

/**
 * 8. Dynamic Card Spotlight Cursor Follower
 */
function initCardSpotlights() {
    const cards = document.querySelectorAll('.bento-tile, .project-spread, .arch-block, .skill-category-card, .channel-card, .engineer-card, .faq-item, .timeline-card, .proof-card');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
        });
    });
}

/**
 * 9. Staggered Scroll Reveals (500ms duration, cubic-bezier(0.16, 1, 0.3, 1), 75ms stagger, once: true)
 */
function initScrollReveals() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.reveal-fade-up').forEach(el => el.classList.add('is-revealed'));
        return;
    }

    const revealElements = document.querySelectorAll('.reveal-fade-up');
    if (!revealElements.length) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        const intersecting = entries.filter(entry => entry.isIntersecting);
        intersecting.forEach((entry, idx) => {
            const el = entry.target;
            const staggerDelay = Math.min(idx * 75, 400); // 75ms stagger per element
            setTimeout(() => {
                el.classList.add('is-revealed');
            }, staggerDelay);
            observer.unobserve(el); // once: true — never re-triggers distractingly on scroll-back
        });
    }, {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
}

/**
 * 10. Magnetic Button Physics (Desktop)
 */
function initMagneticButtons() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 1024) return;

    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .brand-logo, .btn-nav-cta, .btn-nav-resume, .ai-chatbot-trigger');
    magneticElements.forEach(el => {
        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            el.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
        });
        el.addEventListener('mouseleave', () => {
            el.style.transform = '';
        });
    });
}

/**
 * 11. Interactive AI Assistant Chatbot (Lokesh AI)
 */
function initAIChatbot() {
    const triggerBtn = document.querySelector('.ai-chatbot-trigger');
    const chatWindow = document.querySelector('.ai-chatbot-window');
    const closeBtn = document.querySelector('.ai-chat-close-btn');
    const resetBtn = document.querySelector('.ai-chat-reset-btn');
    const messagesArea = document.querySelector('.ai-chat-messages');
    const inputForm = document.querySelector('.ai-chat-input-form');
    const textInput = document.querySelector('.ai-chat-input');
    const chipButtons = document.querySelectorAll('.ai-chip-btn');

    if (!triggerBtn || !chatWindow || !inputForm || !textInput) return;

    // Toggle Chat Window
    triggerBtn.addEventListener('click', () => {
        const isActive = chatWindow.classList.toggle('is-active');
        if (isActive) {
            setTimeout(() => textInput.focus(), 150);
            scrollChatToBottom();
        }
    });

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            chatWindow.classList.remove('is-active');
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            resetChatHistory();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && chatWindow.classList.contains('is-active')) {
            chatWindow.classList.remove('is-active');
        }
    });

    // Chip suggestions
    chipButtons.forEach(chip => {
        chip.addEventListener('click', () => {
            const prompt = chip.getAttribute('data-prompt') || chip.textContent.trim();
            handleUserMessage(prompt);
        });
    });

    // Form Submission
    inputForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const msg = textInput.value.trim();
        if (!msg) return;
        textInput.value = '';
        handleUserMessage(msg);
    });

    function handleUserMessage(userText) {
        appendMessage(userText, 'user');
        showTypingIndicator();

        setTimeout(() => {
            hideTypingIndicator();
            const botResponse = generateAIResponse(userText);
            appendMessage(botResponse, 'bot');
        }, 600 + Math.random() * 400);
    }

    function appendMessage(content, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `chat-msg chat-msg-${sender}`;

        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble';
        bubble.innerHTML = content;

        const timeSpan = document.createElement('span');
        timeSpan.className = 'chat-msg-time';
        const now = new Date();
        timeSpan.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        msgDiv.appendChild(bubble);
        msgDiv.appendChild(timeSpan);
        messagesArea.appendChild(msgDiv);
        scrollChatToBottom();
    }

    function showTypingIndicator() {
        const existing = document.querySelector('.ai-typing-indicator');
        if (existing) return;

        const typingDiv = document.createElement('div');
        typingDiv.className = 'ai-typing-indicator';
        typingDiv.innerHTML = `
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        `;
        messagesArea.appendChild(typingDiv);
        scrollChatToBottom();
    }

    function hideTypingIndicator() {
        const indicator = document.querySelector('.ai-typing-indicator');
        if (indicator) indicator.remove();
    }

    function scrollChatToBottom() {
        messagesArea.scrollTop = messagesArea.scrollHeight;
    }

    function resetChatHistory() {
        messagesArea.innerHTML = '';
        appendMessage("Hello! I am <strong>Lokesh AI Assistant</strong>. Ask me anything about Lokesh's production systems (Viya AI, SmartDetect, Kaizy, Mentixy), full-stack architecture, technical competencies, or contact details!", 'bot');
    }

    /**
     * Knowledge-Base Response Generator
     */
    function generateAIResponse(query) {
        const q = query.toLowerCase().trim();

        // 1. Viya AI
        if (q.includes('viya') || q.includes('moneyviya') || q.includes('wealth') || q.includes('voice assistant') || q.includes('expense')) {
            return `<strong>Viya AI</strong> is Lokesh's flagship 24/7 conversational life and wealth partner operating across <strong>5 Indian languages</strong> (Tamil, English, Hindi, Telugu, Kannada).<br><br>
            <strong>Key Architecture:</strong><br>
            • 4-stage LangChain agentic workflow with n8n event triggers<br>
            • ChromaDB vector memory with sub-2s voice latency<br>
            • Whisper STT + WebSocket audio streaming + WhatsApp bot<br>
            • 121+ verified production commits.<br><br>
            👉 <a href="https://heyviya.vercel.app" target="_blank">Launch Viya AI ↗</a> | <a href="https://github.com/Lokii1211/MoneyViya" target="_blank">View GitHub Repo ↗</a>`;
        }

        // 2. SmartDetect
        if (q.includes('smartdetect') || q.includes('smart detect') || q.includes('re-id') || q.includes('vision') || q.includes('yolo') || q.includes('arcface') || q.includes('biometric') || q.includes('gdpr') || q.includes('dpdp')) {
            return `<strong>SmartDetect (v2.0.0)</strong> is an enterprise multi-camera person detection, tracking, and Re-ID platform engineered with strict DPDP Act & GDPR biometric privacy standards.<br><br>
            <strong>Arbitration Cascade:</strong><br>
            • Stage 1: Face-Anchor (InsightFace ArcFace 512-d embeddings, cosine ≥ 0.56)<br>
            • Stage 2: Torso HSV color distance metric (temporal window ≤ 10 min)<br>
            • Stage 3: OSNet deep Re-ID 512-d body embeddings (cosine ≥ 0.68 within 12h)<br>
            • Stage 4: ID-Switch guard & automated Right-to-be-Forgotten erasure receipts.<br><br>
            👉 <a href="https://github.com/Lokii1211/Smart-Detect" target="_blank">Inspect SmartDetect Repository ↗</a>`;
        }

        // 3. Kaizy
        if (q.includes('kaizy') || q.includes('workforce') || q.includes('marketplace') || q.includes('razorpay') || q.includes('escrow') || q.includes('dispatch')) {
            return `<strong>Kaizy</strong> is India's workforce operating system connecting consumers with verified skilled blue-collar workers across <strong>35 service categories</strong>.<br><br>
            <strong>Highlights:</strong><br>
            • 3-round proximity geo-dispatch engine with rating weighting<br>
            • Dynamic surge pricing calculated using 8 real-time multipliers<br>
            • Automated milestone escrow & same-day UPI worker settlement via Razorpay<br>
            • Real-time Mapbox GL worker tracking & SOS safety architecture.<br><br>
            👉 <a href="https://kaizyy.vercel.app" target="_blank">Launch Kaizy App ↗</a> | <a href="https://github.com/Lokii1211/kaizy" target="_blank">View Repo ↗</a>`;
        }

        // 4. Mentixy
        if (q.includes('mentixy') || q.includes('synaptiq') || q.includes('career') || q.includes('careerdna') || q.includes('judge0') || q.includes('claude')) {
            return `<strong>Mentixy</strong> is an AI career intelligence platform with 15+ integrated modules and conversational Claude AI counselors.<br><br>
            <strong>Core Tech:</strong><br>
            • <strong>CareerDNA™</strong> 256-dimension vector profiling via pgvector<br>
            • Multi-language sandboxed remote code execution arena (Judge0)<br>
            • 4D skill evaluations, automated gap remediations, and Campus Wars tournaments.<br><br>
            👉 <a href="https://synaptiqq.vercel.app" target="_blank">Launch Mentixy ↗</a> | <a href="https://github.com/Lokii1211/SynaptiQ" target="_blank">View Repo ↗</a>`;
        }

        // 5. KadaiGPT
        if (q.includes('kadai') || q.includes('kadaigpt') || q.includes('kirana') || q.includes('tamil') || q.includes('gst') || q.includes('retail')) {
            return `<strong>KadaiGPT</strong> is an AI smart retail assistant engineered for India's 12M+ local kirana grocery stores.<br><br>
            <strong>Features:</strong><br>
            • Bilingual voice-activated billing in Tamil & English<br>
            • 4 specialized agents (Billing, Inventory, Analytics, WhatsApp Dispatcher)<br>
            • Automated GST line invoicing + offline-first PWA with IndexedDB sync across 190+ commits.<br><br>
            👉 <a href="https://github.com/Lokii1211/kadaigpt" target="_blank">View KadaiGPT Repo ↗</a>`;
        }

        // 6. AadhaarAnalytics
        if (q.includes('aadhaar') || q.includes('uidai') || q.includes('hackathon') || q.includes('neural breach') || q.includes('big data')) {
            return `<strong>AadhaarAnalytics 360</strong> was engineered by Team Neural Breach (led by Lokeshkumar D) for the UIDAI National Hackathon 2026.<br><br>
            <strong>Scope:</strong> Chunked pandas ETL processing <strong>4,942,668 official records</strong>, uncovering a 28% update-to-enrollment surge in urban hubs and delivering 9 interactive policy dashboards.`;
        }

        // 7. Tech Stack & Skills
        if (q.includes('stack') || q.includes('skills') || q.includes('technologies') || q.includes('python') || q.includes('langchain') || q.includes('fastapi') || q.includes('next.js') || q.includes('docker')) {
            return `<strong>Lokesh's Core Technical Arsenal:</strong><br><br>
            • <strong>Agentic AI & Orchestration:</strong> LangChain, LangGraph, CrewAI, n8n, Gemini Pro, Claude AI, MCP<br>
            • <strong>Vector DBs & Search:</strong> pgvector, ChromaDB, PostgreSQL, Redis<br>
            • <strong>Computer Vision & ML:</strong> YOLOv8, InsightFace (ArcFace), ByteTrack, OSNet, OpenCV, PyTorch<br>
            • <strong>Full-Stack & Cloud:</strong> Next.js 14, TypeScript, FastAPI, Python 3.12, Docker, Supabase, Tailwind CSS.`;
        }

        // 8. Experience, SLA & Metrics
        if (q.includes('uptime') || q.includes('sla') || q.includes('metrics') || q.includes('commits') || q.includes('experience') || q.includes('stats')) {
            return `<strong>Verified System Metrics:</strong><br>
            • <strong>5 Live Production Systems</strong> deployed<br>
            • <strong>40+ Microservices & APIs</strong> orchestrated<br>
            • <strong>310+ Verified Production Commits</strong><br>
            • <strong>92.5% Uptime SLA Guarantee</strong> across live services.`;
        }

        // 9. Contact / Hire / Resume
        if (q.includes('contact') || q.includes('email') || q.includes('hire') || q.includes('phone') || q.includes('resume') || q.includes('reach') || q.includes('location')) {
            return `<strong>Direct Contact Channels:</strong><br><br>
            • <strong>Email:</strong> <a href="mailto:lokeshkumard1211@gmail.com">lokeshkumard1211@gmail.com</a><br>
            • <strong>Phone:</strong> <a href="tel:+919043202677">+91 90432 02677</a><br>
            • <strong>Location:</strong> Chennai, Tamil Nadu, India (Open to Worldwide Remote)<br>
            • <strong>GitHub:</strong> <a href="https://github.com/Lokii1211" target="_blank">github.com/Lokii1211 ↗</a><br>
            • <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/lokeshkumar12" target="_blank">linkedin.com/in/lokeshkumar12 ↗</a><br><br>
            📄 <a href="Lokeshkumar_D_AI_Engineer_Resume.html" target="_blank"><strong>Download Verified 1-Page Resume (PDF / Print) ↗</strong></a>`;
        }

        // 10. Default General Knowledge Answer
        return `I can give you in-depth details on any of Lokesh's work! Would you like to explore:<br>
        1. <strong>Viya AI</strong> (Flagship Multilingual Wealth Assistant)<br>
        2. <strong>SmartDetect v2.0</strong> (Multi-Camera Person Re-ID Engine)<br>
        3. <strong>Kaizy</strong> (Workforce OS with Geo-Dispatch)<br>
        4. <strong>Mentixy</strong> (CareerDNA™ 256-dim Profiling)<br>
        5. <strong>KadaiGPT</strong> (Kirana Voice Commerce AI)<br>
        6. <strong>Tech Arsenal & Full-Stack Stack</strong><br>
        7. <strong>Resume & Direct Contact Info</strong>?`;
    }
}
