/**
 * LOKESH.AI — Cinematic Dark Glass & Neon Portfolio Engine
 * Client Logic: Unified Ambient Particle Canvas, Dynamic Neon Glow Spotlights,
 *               Magnetic Button Physics, Interactive FAQ Accordion, Command Palette (⌘K),
 *               and Staggered Scroll Reveals.
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
});

/**
 * 1. Interactive Ambient Neon Particle Canvas
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
    const particleCount = isMobile ? 35 : 75;
    const maxConnectionDistance = isMobile ? 90 : 135;

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
            this.color = Math.random() > 0.3 ? 'rgba(0, 216, 240, ' : 'rgba(112, 89, 194, ';
            this.alpha = Math.random() * 0.45 + 0.15;
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
                    this.x -= (dx / dist) * force * 1.8;
                    this.y -= (dy / dist) * force * 1.8;
                }
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = `${this.color}${this.alpha})`;
            ctx.shadowBlur = 8;
            ctx.shadowColor = this.color.includes('216') ? '#00d8f0' : '#7059c2';
            ctx.fill();
            ctx.shadowBlur = 0;
        }
    }

    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    let isVisible = true;
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
    });

    function animate() {
        if (!isVisible) {
            requestAnimationFrame(animate);
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // Draw connecting laser threads
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxConnectionDistance) {
                    const opacity = (1 - dist / maxConnectionDistance) * 0.14;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 216, 240, ${opacity})`;
                    ctx.lineWidth = 0.85;
                    ctx.stroke();
                }
            }
        }

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

/**
 * 2. Scroll Progress Bar
 */
function initScrollProgress() {
    const progressBar = document.getElementById('scroll-progress');
    if (!progressBar) return;

    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    }, { passive: true });
}

/**
 * 3. Mobile Drawer Navigation
 */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');
    if (!toggleBtn || !navLinks) return;

    toggleBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        toggleBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            toggleBtn.setAttribute('aria-expanded', 'false');
        });
    });
}

/**
 * 4. Active Section Scroll Spy
 */
function initScrollSpy() {
    const sections = document.querySelectorAll('header[id], section[id]');
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
        rootMargin: '-20% 0px -60% 0px'
    });

    sections.forEach(section => observer.observe(section));
}

/**
 * 5. Interactive FAQ Accordion (Single-Focus with Rotating Chevron)
 */
function initAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        if (!trigger) return;

        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('is-open');
            
            // Close other accordion items for clean focus
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
 * 6. Click-to-Copy with Micro-Toast Notice
 */
function initCopyButtons() {
    const copyBtns = document.querySelectorAll('[data-email], .copy-trigger');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const textToCopy = btn.getAttribute('data-email') || 'lokiiii1211@gmail.com';
            
            navigator.clipboard.writeText(textToCopy).then(() => {
                showToast(`Copied ${textToCopy} to clipboard! ✓`);
            }).catch(() => {
                showToast(`Copied to clipboard! ✓`);
            });
        });
    });
}

/**
 * 7. Global Toast Notice
 */
function showToast(message) {
    let toast = document.getElementById('toast-notice');
    if (!toast) {
        toast = document.createElement('div');
        toast.id = 'toast-notice';
        toast.className = 'toast-notice';
        document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('is-active');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
        toast.classList.remove('is-active');
    }, 2800);
}

/**
 * 8. Quick Command Palette (Cmd + K / Ctrl + K)
 */
function initCommandPalette() {
    const backdrop = document.getElementById('cmd-palette-backdrop');
    const input = document.getElementById('cmd-search-input');
    const list = document.getElementById('cmd-results-list');
    const trigger = document.getElementById('cmd-k-trigger');
    if (!backdrop || !input || !list) return;

    const commands = [
        { label: 'Featured Systems (Viya AI, SmartDetect, Kaizy...)', target: '#projects', shortcut: 'P' },
        { label: 'Engineering Stack & Architecture', target: '#stack', shortcut: 'S' },
        { label: 'Engineering Profile & Manifesto', target: '#about', shortcut: 'A' },
        { label: 'Technical Arsenal & Skill Matrix', target: '#skills', shortcut: 'K' },
        { label: 'Engineering Journey & Timeline', target: '#journey', shortcut: 'J' },
        { label: 'Frequently Asked Questions (FAQ)', target: '#faq', shortcut: 'F' },
        { label: 'Direct Contact & Hiring Channels', target: '#contact', shortcut: 'C' },
        { label: 'View Verified Resume (PDF / Web)', url: 'Lokeshkumar_D_AI_Engineer_Resume.html', shortcut: 'R' },
        { label: 'Copy Email (lokiiii1211@gmail.com)', action: 'copy_email', shortcut: 'E' }
    ];

    function renderResults(filterText = '') {
        list.innerHTML = '';
        const query = filterText.toLowerCase().trim();
        const filtered = commands.filter(c => c.label.toLowerCase().includes(query));

        if (!filtered.length) {
            list.innerHTML = '<li style="padding: 16px; text-align: center; color: var(--text-tertiary); font-size: 0.9rem;">No matching commands found</li>';
            return;
        }

        filtered.forEach((cmd, idx) => {
            const li = document.createElement('li');
            li.className = `cmd-result-item ${idx === 0 ? 'is-focused' : ''}`;
            li.innerHTML = `
                <span>${cmd.label}</span>
                <span class="cmd-result-shortcut">${cmd.shortcut}</span>
            `;
            li.addEventListener('click', () => executeCommand(cmd));
            list.appendChild(li);
        });
    }

    function openPalette() {
        backdrop.classList.add('is-open');
        input.value = '';
        renderResults();
        setTimeout(() => input.focus(), 50);
    }

    function closePalette() {
        backdrop.classList.remove('is-open');
    }

    function executeCommand(cmd) {
        closePalette();
        if (cmd.action === 'copy_email') {
            navigator.clipboard.writeText('lokiiii1211@gmail.com');
            showToast('Email copied: lokiiii1211@gmail.com ✓');
        } else if (cmd.url) {
            window.open(cmd.url, '_blank');
        } else if (cmd.target) {
            const targetEl = document.querySelector(cmd.target);
            if (targetEl) targetEl.scrollIntoView({ behavior: 'smooth' });
        }
    }

    if (trigger) trigger.addEventListener('click', openPalette);

    backdrop.addEventListener('click', (e) => {
        if (e.target === backdrop) closePalette();
    });

    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (backdrop.classList.contains('is-open')) closePalette();
            else openPalette();
        }
        if (e.key === 'Escape' && backdrop.classList.contains('is-open')) {
            closePalette();
        }
    });

    input.addEventListener('input', (e) => {
        renderResults(e.target.value);
    });

    input.addEventListener('keydown', (e) => {
        const items = list.querySelectorAll('.cmd-result-item');
        if (!items.length) return;
        let focusedIndex = Array.from(items).findIndex(el => el.classList.contains('is-focused'));

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            items[focusedIndex]?.classList.remove('is-focused');
            focusedIndex = (focusedIndex + 1) % items.length;
            items[focusedIndex]?.classList.add('is-focused');
            items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            items[focusedIndex]?.classList.remove('is-focused');
            focusedIndex = (focusedIndex - 1 + items.length) % items.length;
            items[focusedIndex]?.classList.add('is-focused');
            items[focusedIndex]?.scrollIntoView({ block: 'nearest' });
        } else if (e.key === 'Enter') {
            e.preventDefault();
            if (focusedIndex >= 0 && items[focusedIndex]) {
                items[focusedIndex].click();
            }
        }
    });
}

/**
 * 9. Dynamic Card Mouse-Following Spotlight
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
 * 10. Staggered Scroll Reveals (500ms duration, cubic-bezier(0.16, 1, 0.3, 1), 75ms stagger, once: true)
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
 * 11. Magnetic Button Physics (Desktop)
 */
function initMagneticButtons() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 1024) return;

    const magneticElements = document.querySelectorAll('.btn-primary, .btn-secondary, .brand-logo, .btn-nav-cta');
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
