/**
 * LOKESH.AI — Engineering Portfolio & Interactive AI Assistant
 * Client Logic: Dynamic Spotlights, Magnetic Physics,
 *               Interactive FAQ Accordion, Command Palette (⌘K), Staggered Scroll Reveals,
 *               and High-Intelligence Knowledge-Powered AI Chatbot Assistant.
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
    const cards = document.querySelectorAll('.bento-tile, .project-spread, .arch-block, .skill-category-card, .channel-card, .engineer-card, .faq-item, .timeline-card, .proof-card, .cap-card');
    
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
        }, 400 + Math.random() * 200);
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
     * Broad-Comprehension NLP Knowledge Engine for Founders, CTOs, and Engineers
     */
    function generateAIResponse(query) {
        const raw = query.toLowerCase().trim();
        const clean = raw.replace(/[^\w\s]/gi, ' ');
        const tokens = clean.split(/\s+/).filter(Boolean);

        function hasAny(...words) {
            return words.some(w => raw.includes(w) || tokens.includes(w));
        }

        // 1. Executive Pitch / Why Hire / Value Proposition (CTO, CEO, Founder, Recruiter)
        if (hasAny('why hire', 'why should we hire', 'value', 'differentiator', 'difference', 'roi', 'pitch', 'stand out', 'potential', 'strengths')) {
            return `<strong>Why Founders &amp; CTOs Hire Lokesh:</strong><br><br>
            • <strong>Production Over Prototypes:</strong> 5 live systems in 24/7 production with a 92.5% SLA guarantee — not toy wrappers.<br>
            • <strong>Deterministic Multi-Agent Graphs:</strong> Replaces fragile prompts with stateful LangGraph cyclical state machines, fallback routing, and strict Pydantic schema validation.<br>
            • <strong>Multilingual Voice &amp; Vision:</strong> Engineered sub-2s voice latency across 5 Indian languages (Whisper STT) and 5-stage identity arbitration cascades in computer vision (ArcFace + OSNet).<br>
            • <strong>High-Velocity Execution:</strong> 310+ production commits, sub-100ms vector search on pgvector, and rapid MVP turnarounds (2–4 weeks).<br>
            <div class="chat-action-buttons">
                <a href="#project-viya" class="chat-action-btn chat-action-btn-primary">Explore Viya AI Flagship ↓</a>
                <a href="mailto:lokiiii1211@gmail.com" class="chat-action-btn">Email Lokesh ↗</a>
                <a href="https://wa.me/919003360494" target="_blank" class="chat-action-btn">WhatsApp Direct ↗</a>
            </div>`;
        }

        // 2. Freelance / MVP Development / Turnaround Timeline / Rates
        if (hasAny('freelance', 'freelancing', 'contract', 'contractor', 'hire', 'available', 'availability', 'mvp', 'build', 'timeline', 'estimate', 'cost', 'pricing', 'rate', 'rates', 'quote', 'work together', 'project', 'start a project')) {
            return `<strong>Yes! Lokesh is actively available for Freelance AI Contracts &amp; Production MVPs:</strong><br><br>
            • <strong>Rapid MVP Turnaround:</strong> Typically <strong>2 to 4 weeks</strong> from architecture blueprint to live deployed system with CI/CD and automated tests.<br>
            • <strong>Scope Capabilities:</strong> Autonomous agentic workflows, custom RAG pipelines (pgvector/ChromaDB), multilingual voice agents, and real-time computer vision pipelines.<br>
            • <strong>Full-Stack Handover:</strong> Typed FastAPI backends, PostgreSQL schemas, and responsive Next.js 14 dashboards.<br>
            • <strong>Also Available For:</strong> Full-Time AI Engineering positions (Worldwide Remote or On-site Relocation).<br>
            <div class="chat-action-buttons">
                <a href="mailto:lokiiii1211@gmail.com" class="chat-action-btn chat-action-btn-primary">Email Project Inquiries ↗</a>
                <a href="https://wa.me/919003360494" target="_blank" class="chat-action-btn">Chat on WhatsApp ↗</a>
                <a href="Lokeshkumar_D_AI_Engineer_Resume.html" target="_blank" class="chat-action-btn">Download Resume ↗</a>
            </div>`;
        }

        // 3. NLP, Natural Language Processing, LLMs, Voice AI & RAG
        if (hasAny('nlp', 'natural language', 'llm', 'language model', 'whisper', 'stt', 'tts', 'speech', 'voice', 'audio', 'transcription', 'bilingual', 'multilingual', 'tamil', 'hindi', 'rag', 'token', 'transformer', 'prompt', 'langchain', 'langgraph')) {
            return `<strong>Lokesh's Production NLP, LLM &amp; Voice Arsenal:</strong><br><br>
            • <strong>Multilingual Voice Pipelines:</strong> Built <strong>Viya AI</strong> and <strong>KadaiGPT</strong> handling 5 Indian languages (Tamil, English, Hindi, Telugu, Kannada) with Whisper STT &amp; sub-2s streaming audio.<br>
            • <strong>Deterministic Agent Graphs:</strong> Multi-stage LangChain / LangGraph state workflows with tool calling, schema guardrails, and deterministic fallbacks.<br>
            • <strong>Sub-100ms Vector RAG:</strong> Chunked semantic search and embedding retrieval via <strong>pgvector</strong> and <strong>ChromaDB</strong>.<br>
            • <strong>Vector Profiling:</strong> Built CareerDNA™ 256-dim embedding representations in <strong>Mentixy</strong>.<br>
            <div class="chat-action-buttons">
                <a href="#project-viya" class="chat-action-btn chat-action-btn-primary">Launch Viya AI Demo ↓</a>
                <a href="#stack" class="chat-action-btn">Inspect RAG Blueprint ↓</a>
            </div>`;
        }

        // 4. SmartDetect & Computer Vision / YOLO / Re-ID
        if (hasAny('smartdetect', 'smart detect', 'vision', 'cv', 'yolo', 'yolov8', 're-id', 'reid', 'arcface', 'insightface', 'osnet', 'bytetrack', 'tracking', 'detection', 'biometric', 'camera', 'cctv', 'face', 'dpdp', 'gdpr')) {
            return `<strong>SmartDetect (v2.0.0) — Enterprise Multi-Camera Re-ID Platform:</strong><br><br>
            • <strong>5-Stage Arbitration Cascade:</strong><br>
              1. <em>Primary Face-Anchor:</em> InsightFace ArcFace 512-d embeddings (cosine &ge; 0.56). Fallback is blocked if face is unmatched.<br>
              2. <em>Torso Metric:</em> HSV color distance &le; 30 within a 10-min window.<br>
              3. <em>Deep Re-ID:</em> OSNet 512-d body embeddings (cosine &ge; 0.68 within 12h).<br>
              4. <em>ID-Switch Guard:</em> ByteTrack drops tracklets on 2 consecutive contradictions.<br>
            • <strong>Biometric Governance:</strong> Verifiable Right-to-be-Forgotten erasure receipts &amp; auto-purging under DPDP Act / GDPR.<br>
            <div class="chat-action-buttons">
                <a href="https://github.com/Lokii1211/Smart-Detect" target="_blank" class="chat-action-btn chat-action-btn-primary">View GitHub Repo ↗</a>
                <a href="#project-smartdetect" class="chat-action-btn">Inspect Vision Specs ↓</a>
            </div>`;
        }

        // 5. Viya AI
        if (hasAny('viya', 'moneyviya', 'wealth', 'expense', 'finance', 'fintech')) {
            return `<strong>Viya AI — 24/7 Multilingual Conversational Wealth Partner:</strong><br><br>
            • <strong>Multi-Agent Graph:</strong> 4-stage LangChain arbitration with n8n event webhooks.<br>
            • <strong>5 Indian Languages:</strong> Tamil, English, Hindi, Telugu, and Kannada.<br>
            • <strong>Low Latency:</strong> Sub-2s audio response via Whisper STT + WebSocket streaming + ChromaDB memory.<br>
            • <strong>Production Status:</strong> 121+ verified commits, live deployment on Vercel.<br>
            <div class="chat-action-buttons">
                <a href="https://heyviya.vercel.app" target="_blank" class="chat-action-btn chat-action-btn-primary">Launch Live Web App ↗</a>
                <a href="https://github.com/Lokii1211/MoneyViya" target="_blank" class="chat-action-btn">View Code on GitHub ↗</a>
            </div>`;
        }

        // 6. Kaizy
        if (hasAny('kaizy', 'workforce', 'marketplace', 'gig', 'worker', 'blue collar', 'razorpay', 'escrow', 'dispatch', 'surge')) {
            return `<strong>Kaizy — Blue-Collar Workforce Operating System:</strong><br><br>
            • <strong>Smart Geo-Dispatch:</strong> 3-round proximity matching engine across 35 service categories.<br>
            • <strong>Surge Pricing:</strong> 8 dynamic real-time demand/supply multipliers.<br>
            • <strong>Milestone Escrow:</strong> Automated UPI payouts upon service completion via Razorpay.<br>
            • <strong>Worker Tracking:</strong> Real-time Mapbox GL navigation with SOS safety architecture.<br>
            <div class="chat-action-buttons">
                <a href="https://kaizyy.vercel.app" target="_blank" class="chat-action-btn chat-action-btn-primary">Launch Kaizy App ↗</a>
                <a href="https://github.com/Lokii1211/kaizy" target="_blank" class="chat-action-btn">View Repository ↗</a>
            </div>`;
        }

        // 7. Mentixy
        if (hasAny('mentixy', 'synaptiq', 'career', 'careerdna', 'judge0', 'claude', 'coding arena', 'edtech')) {
            return `<strong>Mentixy — AI Career Intelligence Platform:</strong><br><br>
            • <strong>CareerDNA™:</strong> 256-dimension vector embedding skill evaluations via pgvector.<br>
            • <strong>Judge0 Coding Arena:</strong> Sandboxed multi-language remote code execution with automated test case evaluation.<br>
            • <strong>15+ Modules:</strong> Claude AI conversational counseling, skill gap remediation, and Campus Wars.<br>
            <div class="chat-action-buttons">
                <a href="https://synaptiqq.vercel.app" target="_blank" class="chat-action-btn chat-action-btn-primary">Launch Mentixy App ↗</a>
                <a href="https://github.com/Lokii1211/SynaptiQ" target="_blank" class="chat-action-btn">View Repository ↗</a>
            </div>`;
        }

        // 8. KadaiGPT
        if (hasAny('kadai', 'kadaigpt', 'kirana', 'grocery', 'retail', 'billing', 'gst')) {
            return `<strong>KadaiGPT — Kirana Smart Retail Voice AI:</strong><br><br>
            • <strong>Bilingual Voice Billing:</strong> Tamil &amp; English voice parsing for fast inventory checkouts.<br>
            • <strong>4 Specialized Agents:</strong> Billing Agent, Inventory Agent, Analytics Agent, WhatsApp Dispatcher.<br>
            • <strong>Offline-First PWA:</strong> IndexedDB sync + automated GST line invoicing across 190+ commits.<br>
            <div class="chat-action-buttons">
                <a href="https://github.com/Lokii1211/kadaigpt" target="_blank" class="chat-action-btn chat-action-btn-primary">View GitHub Repo ↗</a>
            </div>`;
        }

        // 9. AadhaarAnalytics 360
        if (hasAny('aadhaar', 'uidai', 'hackathon', 'neural breach', 'big data', '4.94m', 'migration')) {
            return `<strong>AadhaarAnalytics 360 (UIDAI National Hackathon):</strong><br><br>
            • <strong>Big Data Scale:</strong> Processed <strong>4,942,668 official records</strong> via chunked pandas ETL.<br>
            • <strong>Insights:</strong> Uncovered a 28% update-to-enrollment surge in tier-1 urban centers.<br>
            • <strong>Deliverables:</strong> 9 interactive policy dashboards for biometric update trends.`;
        }

        // 10. Technical Arsenal & Full-Stack Architecture
        if (hasAny('stack', 'skills', 'technologies', 'python', 'fastapi', 'backend', 'fullstack', 'nextjs', 'next.js', 'react', 'typescript', 'docker', 'postgres', 'postgresql', 'supabase', 'redis', 'pgvector')) {
            return `<strong>Lokesh's Core Technical Arsenal:</strong><br><br>
            • <strong>Agentic AI &amp; Orchestration:</strong> LangChain, LangGraph, CrewAI, n8n, Gemini Pro, Claude AI, Whisper STT<br>
            • <strong>Vector DBs &amp; Retrieval:</strong> pgvector, ChromaDB, PostgreSQL, Redis<br>
            • <strong>Computer Vision &amp; ML:</strong> YOLOv8, InsightFace (ArcFace), ByteTrack, OSNet, OpenCV, PyTorch<br>
            • <strong>Full-Stack &amp; Cloud:</strong> Next.js 14, TypeScript, FastAPI, Python 3.12, Docker, Supabase, Tailwind CSS.<br>
            <div class="chat-action-buttons">
                <a href="#skills" class="chat-action-btn chat-action-btn-primary">View Full Skills Matrix ↓</a>
                <a href="#stack" class="chat-action-btn">Architecture Flow ↓</a>
            </div>`;
        }

        // 11. Experience, SLAs & Metrics
        if (hasAny('experience', 'uptime', 'sla', 'metrics', 'commits', 'stats', 'how many', 'systems built', 'track record', 'proof')) {
            return `<strong>Verified System Deliverables:</strong><br><br>
            • <strong>5 Live Production Systems:</strong> Viya AI, SmartDetect, Kaizy, Mentixy, KadaiGPT.<br>
            • <strong>40+ Microservices &amp; APIs:</strong> High-throughput FastAPI endpoints &amp; WebSockets.<br>
            • <strong>310+ Verified Commits:</strong> Robust, continuous production delivery.<br>
            • <strong>92.5% Uptime SLA:</strong> Hardened serverless and microservice deployments.<br>
            <div class="chat-action-buttons">
                <a href="#journey" class="chat-action-btn chat-action-btn-primary">View Milestones Timeline ↓</a>
                <a href="Lokeshkumar_D_AI_Engineer_Resume.html" target="_blank" class="chat-action-btn">Verified Resume ↗</a>
            </div>`;
        }

        // 12. Who is Lokesh / Intro / Greetings / Location
        if (hasAny('who are you', 'who is lokesh', 'about', 'intro', 'introduce', 'bio', 'hi', 'hello', 'hey', 'good morning', 'good evening', 'howdy', 'what do you do', 'sup', 'yo')) {
            return `Hello! I am the interactive AI assistant for <strong>Lokeshkumar D</strong> — an <strong>Agentic AI Engineer &amp; Full-Stack Architect</strong> based in Chennai, India (open to worldwide remote &amp; relocation).<br><br>
            Lokesh has shipped <strong>5 live production AI platforms</strong> spanning autonomous multi-agent graphs, multilingual voice AI, and enterprise computer vision Re-ID with a <strong>92.5% uptime SLA</strong>.<br><br>
            He is actively available for <strong>Full-Time AI Engineering roles and Freelance Production MVPs</strong>.<br>
            <div class="chat-action-buttons">
                <a href="#projects" class="chat-action-btn chat-action-btn-primary">View 5 Live Systems ↓</a>
                <a href="mailto:lokiiii1211@gmail.com" class="chat-action-btn">Send Direct Email ↗</a>
                <a href="https://wa.me/919003360494" target="_blank" class="chat-action-btn">WhatsApp Chat ↗</a>
            </div>`;
        }

        // 13. Direct Contact & Resume
        if (hasAny('contact', 'email', 'phone', 'whatsapp', 'resume', 'cv', 'pdf', 'reach', 'location', 'chennai', 'social')) {
            return `<strong>Direct Contact Channels:</strong><br><br>
            • <strong>Email:</strong> <a href="mailto:lokiiii1211@gmail.com">lokiiii1211@gmail.com</a> (Response SLA &lt; 24h)<br>
            • <strong>WhatsApp:</strong> <a href="https://wa.me/919003360494" target="_blank">+91 90033 60494 ↗</a><br>
            • <strong>LinkedIn:</strong> <a href="https://linkedin.com/in/lokiiii1211" target="_blank">linkedin.com/in/lokiiii1211 ↗</a><br>
            • <strong>GitHub:</strong> <a href="https://github.com/Lokii1211" target="_blank">github.com/Lokii1211 ↗</a><br>
            • <strong>Location:</strong> Chennai, Tamil Nadu, India (Worldwide Remote)<br>
            <div class="chat-action-buttons">
                <a href="Lokeshkumar_D_AI_Engineer_Resume.html" target="_blank" class="chat-action-btn chat-action-btn-primary">Download Verified 1-Page Resume (PDF) ↗</a>
                <a href="mailto:lokiiii1211@gmail.com" class="chat-action-btn">Compose Email ↗</a>
            </div>`;
        }

        // 14. Smart Fallback with Guided Action Links
        return `I can give you immediate technical details on any part of Lokesh's AI engineering work! What would you like to explore?<br><br>
        1. <strong>Why Hire Lokesh:</strong> Production track record, multi-agent graphs, &amp; ROI<br>
        2. <strong>Freelance &amp; MVP Builds:</strong> 2–4 week turnaround timelines &amp; contract terms<br>
        3. <strong>NLP &amp; Voice Pipelines:</strong> Viya AI &amp; Whisper STT across 5 Indian languages<br>
        4. <strong>Computer Vision:</strong> SmartDetect v2.0 5-stage Re-ID cascade<br>
        5. <strong>Verified Resume:</strong> Print-ready 1-page A4 engineering resume<br>
        <div class="chat-action-buttons">
            <a href="mailto:lokiiii1211@gmail.com" class="chat-action-btn chat-action-btn-primary">Email Direct ↗</a>
            <a href="https://wa.me/919003360494" target="_blank" class="chat-action-btn">WhatsApp Chat ↗</a>
            <a href="#projects" class="chat-action-btn">View Projects ↓</a>
        </div>`;
    }
}
