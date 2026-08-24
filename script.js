/**
 * LOKESH.AI — Engineering Portfolio & Interactive AI Assistant
 * Client Logic: Dynamic Spotlights, Magnetic Physics,
 *               Interactive FAQ Accordion, Command Palette (⌘K), Staggered Scroll Reveals,
 *               and Intelligent Knowledge-Powered AI Chatbot Assistant.
 */

document.addEventListener('DOMContentLoaded', () => {
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
 * 1. Top Scroll Progress Bar
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
 * 2. Mobile Navigation Drawer
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
 * 3. Active Scroll Spy Navigation
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
 * 4. Single-Focus FAQ Accordion
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
 * 5. Copy to Clipboard Action with Toast Notice
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
 * 6. Command Palette HUD (⌘K / Ctrl+K)
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
        { label: 'Agentic AI & LLM Systems Architecture', url: '#stack', category: 'Architecture' },
        { label: 'Categorized Technical Arsenal & Skills', url: '#skills', category: 'Skills' },
        { label: 'Engineering Milestones & Timeline', url: '#journey', category: 'Experience' },
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
 * 7. Dynamic Card Spotlight Cursor Follower
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
 * 8. Staggered Scroll Reveals (500ms duration, cubic-bezier(0.16, 1, 0.3, 1), 75ms stagger, once: true)
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
 * 9. Magnetic Button Physics (Desktop)
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
 * 10. Intelligent Knowledge-Powered AI Assistant Chatbot (Lokesh AI)
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
    const faqChatTrigger = document.querySelector('#faq-open-ai-chat');

    if (!triggerBtn || !chatWindow || !inputForm || !textInput) return;

    function openChat() {
        chatWindow.classList.add('is-active');
        setTimeout(() => textInput.focus(), 150);
        scrollChatToBottom();
    }

    function toggleChat() {
        const isActive = chatWindow.classList.toggle('is-active');
        if (isActive) {
            setTimeout(() => textInput.focus(), 150);
            scrollChatToBottom();
        }
    }

    // Trigger buttons
    triggerBtn.addEventListener('click', toggleChat);

    if (faqChatTrigger) {
        faqChatTrigger.addEventListener('click', openChat);
    }

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
        }, 450 + Math.random() * 250);
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
        appendMessage("Hello! I am <strong>Lokesh AI Assistant</strong>. Ask me anything about Lokesh's production systems (<strong>Viya AI</strong>, <strong>SmartDetect</strong>, <strong>Kaizy</strong>, <strong>Mentixy</strong>), NLP & Voice models, freelance availability, or contact channels!", 'bot');
    }

    /**
     * Broad-Comprehension NLP Knowledge Engine
     */
    function generateAIResponse(query) {
        const raw = query.toLowerCase().trim();
        const clean = raw.replace(/[^\w\s]/gi, ' ');
        const tokens = clean.split(/\s+/).filter(Boolean);

        function hasAny(...words) {
            return words.some(w => raw.includes(w) || tokens.includes(w));
        }

        // 1. NLP / Natural Language Processing / LLM / Voice AI
        if (hasAny('nlp', 'natural language', 'llm', 'language model', 'whisper', 'stt', 'tts', 'speech', 'voice', 'audio', 'transcription', 'bilingual', 'multilingual', 'tamil', 'hindi', 'rag', 'token', 'transformer', 'prompt', 'langchain', 'langgraph')) {
            return `<strong>Yes! Lokesh has extensive production expertise in Natural Language Processing (NLP), LLM Orchestration, and Multilingual Voice AI:</strong><br><br>
            • <strong>Multilingual Voice Pipelines:</strong> Engineered <strong>Viya AI</strong> and <strong>KadaiGPT</strong> supporting 5 Indian languages (Tamil, English, Hindi, Telugu, Kannada) with Whisper STT &amp; sub-2s latency.<br>
            • <strong>Stateful Agentic Workflows:</strong> LangChain &amp; LangGraph multi-stage graph architectures with tool-routing, schema validation, and fallback deterministic state machines.<br>
            • <strong>High-Precision RAG:</strong> Chunked semantic search &amp; vector retrieval via <strong>pgvector</strong> and <strong>ChromaDB</strong> with sub-100ms vector lookups.<br>
            • <strong>Vector Profiling:</strong> Built CareerDNA™ 256-dimension vector embedding evaluation in <strong>Mentixy</strong>.<br><br>
            👉 <a href="#stack">Explore Architecture Blueprint ↓</a> | <a href="#project-viya">Inspect Viya AI Flagship ↓</a>`;
        }

        // 2. Freelance / Contract / Hiring / Availability / Rates
        if (hasAny('freelance', 'freelancing', 'contract', 'contractor', 'hire', 'available', 'availability', 'build', 'mvp', 'consulting', 'rates', 'quote', 'pricing', 'work together', 'full time', 'fulltime', 'part time', 'hourly', 'remote')) {
            return `<strong>Yes! Lokesh is actively available for:</strong><br><br>
            1. <strong>Freelance AI Engineering Contracts:</strong> Production MVPs, multi-agent LLM systems, custom RAG pipelines, and computer vision integrations.<br>
            2. <strong>Full-Time AI Engineering Roles:</strong> Open to remote worldwide or on-site relocation.<br>
            3. <strong>Architecture Advisory &amp; Code Audits:</strong> Fast turnaround on system design and latency optimizations.<br><br>
            <strong>Direct Channels:</strong><br>
            • <strong>Email:</strong> <a href="mailto:lokiiii1211@gmail.com">lokiiii1211@gmail.com</a> (Response &lt; 24h)<br>
            • <strong>WhatsApp:</strong> <a href="https://wa.me/919003360494" target="_blank">+91 90033 60494 ↗</a><br>
            • <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/lokiiii1211" target="_blank">linkedin.com/in/lokiiii1211 ↗</a><br><br>
            📄 <a href="Lokeshkumar_D_AI_Engineer_Resume.html" target="_blank"><strong>Download Verified 1-Page Resume ↗</strong></a>`;
        }

        // 3. SmartDetect & Computer Vision / YOLO / Re-ID
        if (hasAny('smartdetect', 'smart detect', 'vision', 'cv', 'yolo', 'yolov8', 're-id', 'reid', 'arcface', 'insightface', 'osnet', 'bytetrack', 'tracking', 'detection', 'biometric', 'camera', 'cctv', 'face', 'dpdp', 'gdpr')) {
            return `<strong>SmartDetect (v2.0.0)</strong> is an enterprise multi-camera person detection, tracking, and Re-ID platform engineered with strict DPDP Act &amp; GDPR biometric privacy standards.<br><br>
            <strong>Arbitration Cascade:</strong><br>
            • <strong>Stage 1 (Primary Anchor):</strong> InsightFace ArcFace 512-d embeddings (cosine &ge; 0.56). Under the <em>Face-Anchor principle</em>, fallback Re-ID is blocked if a face is unmatched.<br>
            • <strong>Stage 2:</strong> Torso HSV color distance &le; 30 within a 10-min window.<br>
            • <strong>Stage 3:</strong> OSNet deep Re-ID 512-d body embeddings (cosine &ge; 0.68 within 12h).<br>
            • <strong>Stage 4:</strong> ID-Switch guard &amp; verifiable Right-to-be-Forgotten erasure receipts.<br><br>
            👉 <a href="https://github.com/Lokii1211/Smart-Detect" target="_blank">Inspect SmartDetect Repository ↗</a>`;
        }

        // 4. Viya AI
        if (hasAny('viya', 'moneyviya', 'wealth', 'expense', 'finance', 'fintech')) {
            return `<strong>Viya AI</strong> is Lokesh's flagship 24/7 conversational life and wealth partner operating across <strong>5 Indian languages</strong> (Tamil, English, Hindi, Telugu, Kannada).<br><br>
            <strong>Key Architecture:</strong><br>
            • 4-stage LangChain agentic workflow with n8n event triggers<br>
            • ChromaDB vector memory with sub-2s voice latency<br>
            • Whisper STT + WebSocket audio streaming + WhatsApp bot<br>
            • 121+ verified production commits.<br><br>
            👉 <a href="https://heyviya.vercel.app" target="_blank">Launch Viya AI ↗</a> | <a href="https://github.com/Lokii1211/MoneyViya" target="_blank">View GitHub Repo ↗</a>`;
        }

        // 5. Kaizy
        if (hasAny('kaizy', 'workforce', 'marketplace', 'gig', 'worker', 'blue collar', 'razorpay', 'escrow', 'dispatch', 'surge')) {
            return `<strong>Kaizy</strong> is India's workforce operating system connecting consumers with verified skilled blue-collar workers across <strong>35 service categories</strong>.<br><br>
            <strong>Highlights:</strong><br>
            • 3-round proximity geo-dispatch engine with rating weighting<br>
            • Dynamic surge pricing calculated using 8 real-time multipliers<br>
            • Automated milestone escrow &amp; same-day UPI worker settlement via Razorpay<br>
            • Real-time Mapbox GL worker tracking &amp; SOS safety architecture.<br><br>
            👉 <a href="https://kaizyy.vercel.app" target="_blank">Launch Kaizy App ↗</a> | <a href="https://github.com/Lokii1211/kaizy" target="_blank">View Repo ↗</a>`;
        }

        // 6. Mentixy
        if (hasAny('mentixy', 'synaptiq', 'career', 'careerdna', 'judge0', 'claude', 'coding arena', 'edtech')) {
            return `<strong>Mentixy</strong> is an AI career intelligence platform with 15+ integrated modules and conversational Claude AI counselors.<br><br>
            <strong>Core Tech:</strong><br>
            • <strong>CareerDNA™</strong> 256-dimension vector profiling via pgvector<br>
            • Multi-language sandboxed remote code execution arena (Judge0)<br>
            • 4D skill evaluations, automated gap remediations, and Campus Wars tournaments.<br><br>
            👉 <a href="https://synaptiqq.vercel.app" target="_blank">Launch Mentixy ↗</a> | <a href="https://github.com/Lokii1211/SynaptiQ" target="_blank">View Repo ↗</a>`;
        }

        // 7. KadaiGPT
        if (hasAny('kadai', 'kadaigpt', 'kirana', 'grocery', 'retail', 'billing', 'gst')) {
            return `<strong>KadaiGPT</strong> is an AI smart retail assistant engineered for India's 12M+ local kirana grocery stores.<br><br>
            <strong>Features:</strong><br>
            • Bilingual voice-activated billing in Tamil &amp; English<br>
            • 4 specialized agents (Billing, Inventory, Analytics, WhatsApp Dispatcher)<br>
            • Automated GST line invoicing + offline-first PWA with IndexedDB sync across 190+ commits.<br><br>
            👉 <a href="https://github.com/Lokii1211/kadaigpt" target="_blank">View KadaiGPT Repo ↗</a>`;
        }

        // 8. AadhaarAnalytics 360
        if (hasAny('aadhaar', 'uidai', 'hackathon', 'neural breach', 'big data', '4.94m', 'migration')) {
            return `<strong>AadhaarAnalytics 360</strong> was engineered by Team Neural Breach (led by Lokeshkumar D) for the UIDAI National Hackathon 2026.<br><br>
            <strong>Scope:</strong> Chunked pandas ETL processing <strong>4,942,668 official records</strong>, uncovering a 28% update-to-enrollment surge in tier-1 urban hubs and delivering 9 interactive policy dashboards.`;
        }

        // 9. Tech Stack, Skills & Backend Architecture
        if (hasAny('stack', 'skills', 'technologies', 'python', 'fastapi', 'backend', 'fullstack', 'nextjs', 'next.js', 'react', 'typescript', 'docker', 'postgres', 'postgresql', 'supabase', 'redis', 'pgvector')) {
            return `<strong>Lokesh's Core Technical Arsenal:</strong><br><br>
            • <strong>Agentic AI &amp; LLM Orchestration:</strong> LangChain, LangGraph, CrewAI, n8n, Gemini Pro, Claude AI, Whisper STT<br>
            • <strong>Vector DBs &amp; Search:</strong> pgvector, ChromaDB, PostgreSQL, Redis<br>
            • <strong>Computer Vision &amp; ML:</strong> YOLOv8, InsightFace (ArcFace), ByteTrack, OSNet, OpenCV, PyTorch<br>
            • <strong>Full-Stack &amp; Cloud:</strong> Next.js 14, TypeScript, FastAPI, Python 3.12, Docker, Supabase, Tailwind CSS.`;
        }

        // 10. Experience, SLAs & Metrics
        if (hasAny('experience', 'uptime', 'sla', 'metrics', 'commits', 'stats', 'how many', 'systems built', 'track record')) {
            return `<strong>Verified Production Metrics:</strong><br>
            • <strong>5 Live Production Systems</strong> deployed<br>
            • <strong>40+ Microservices &amp; APIs</strong> orchestrated<br>
            • <strong>310+ Verified Production Commits</strong><br>
            • <strong>92.5% Uptime SLA Guarantee</strong> across live services.`;
        }

        // 11. Who is Lokesh / Intro / Greetings
        if (hasAny('who are you', 'who is lokesh', 'about', 'intro', 'introduce', 'bio', 'hi', 'hello', 'hey', 'good morning', 'good evening', 'howdy', 'what do you do', 'sup', 'yo')) {
            return `Hello! I am the interactive AI assistant for <strong>Lokeshkumar D</strong> — an <strong>Agentic AI Engineer &amp; Full-Stack Architect</strong> based in Chennai, India (open worldwide).<br><br>
            Lokesh has shipped <strong>5 live production AI systems</strong> spanning autonomous multi-agent graphs, multilingual voice NLP, and enterprise computer vision Re-ID cascades with a <strong>92.5% uptime SLA guarantee</strong>.<br><br>
            Would you like to explore his <strong>flagship systems</strong>, review his <strong>tech stack</strong>, or discuss <strong>freelance/full-time opportunities</strong>?`;
        }

        // 12. Contact / Resume / Location
        if (hasAny('contact', 'email', 'phone', 'whatsapp', 'resume', 'cv', 'pdf', 'reach', 'location', 'chennai', 'social')) {
            return `<strong>Direct Contact Channels:</strong><br><br>
            • <strong>Email:</strong> <a href="mailto:lokiiii1211@gmail.com">lokiiii1211@gmail.com</a><br>
            • <strong>WhatsApp:</strong> <a href="https://wa.me/919003360494" target="_blank">+91 90033 60494 ↗</a><br>
            • <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/lokiiii1211" target="_blank">linkedin.com/in/lokiiii1211 ↗</a><br>
            • <strong>GitHub:</strong> <a href="https://github.com/Lokii1211" target="_blank">github.com/Lokii1211 ↗</a><br>
            • <strong>Location:</strong> Chennai, Tamil Nadu, India (Available Worldwide Remote)<br><br>
            📄 <a href="Lokeshkumar_D_AI_Engineer_Resume.html" target="_blank"><strong>Download Verified 1-Page Resume (PDF / Print) ↗</strong></a>`;
        }

        // 13. Smart Fallback with Guided Follow-ups
        return `I can help you with anything regarding Lokesh's AI engineering work! What would you like to explore?<br><br>
        1. <strong>NLP &amp; Voice AI:</strong> Multilingual pipelines &amp; Whisper STT in Viya AI &amp; KadaiGPT<br>
        2. <strong>Computer Vision &amp; Re-ID:</strong> 5-stage identity cascade in SmartDetect v2.0<br>
        3. <strong>Workforce &amp; Career Systems:</strong> Kaizy geo-dispatch &amp; Mentixy CareerDNA™<br>
        4. <strong>Freelance &amp; Full-Time:</strong> Project availability, MVP builds, &amp; contract rates<br>
        5. <strong>Verified Resume &amp; Contact Channels:</strong> Direct email &amp; WhatsApp`;
    }
}
