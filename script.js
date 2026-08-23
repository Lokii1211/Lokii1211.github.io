/**
 * LOKESH.AI — Personal Portfolio & Engineering Showcase
 * Senior UI/UX & Creative Engineering Client Logic
 * Features: Pure White Default Theme, Interactive FAQ Accordion, Scroll Progress,
 *           Cmd+K Command Palette, Dynamic Card Glow, Stagger Scroll Reveals.
 */

document.addEventListener('DOMContentLoaded', () => {
    initScrollProgress();
    initTheme();
    initMobileNav();
    initScrollSpy();
    initAccordion();
    initCopyButtons();
    initCommandPalette();
    initCardSpotlights();
});

/**
 * 1. Scroll Progress Bar
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
 * 2. Theme Toggle (Pure White Default, Obsidian Night on Demand)
 */
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('loki_theme');

    // Default to pure white (no data-theme="dark" attribute) unless user explicitly chose dark
    if (savedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        const isCurrentlyDark = document.documentElement.getAttribute('data-theme') === 'dark';
        if (isCurrentlyDark) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('loki_theme', 'light');
            showToast('Switched to Gallery White Mode');
        } else {
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('loki_theme', 'dark');
            showToast('Switched to Obsidian Night Mode');
        }
    });
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

    // Close on navigation link click
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
 * 5. Interactive FAQ Accordion
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
        { label: 'Featured Projects (Viya AI, SmartDetect, Kaizy...)', target: '#projects', shortcut: 'P' },
        { label: 'Engineering Stack & Multi-Agent Architecture', target: '#stack', shortcut: 'S' },
        { label: 'Founder Profile & Technical Philosophy', target: '#about', shortcut: 'A' },
        { label: 'Technical Arsenal & Skill Matrix', target: '#skills', shortcut: 'K' },
        { label: 'Frequently Asked Questions (FAQ)', target: '#faq', shortcut: 'F' },
        { label: 'Direct Contact & Hiring Channels', target: '#contact', shortcut: 'C' },
        { label: 'View Verified Resume (PDF / Web)', url: 'Lokeshkumar_D_AI_Engineer_Resume.html', shortcut: 'R' },
        { label: 'Copy Email (lokiiii1211@gmail.com)', action: 'copy_email', shortcut: 'E' },
        { label: 'Toggle Obsidian / White Theme', action: 'toggle_theme', shortcut: 'T' }
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
        } else if (cmd.action === 'toggle_theme') {
            const themeBtn = document.getElementById('theme-toggle');
            if (themeBtn) themeBtn.click();
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
        // Cmd+K or Ctrl+K
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            if (backdrop.classList.contains('is-open')) closePalette();
            else openPalette();
        }
        // Escape
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
 * 9. Dynamic Card Mouse-Following Spotlight / Glare
 */
function initCardSpotlights() {
    const cards = document.querySelectorAll('.project-spread, .arch-block, .skill-category-card, .channel-card, .engineer-card, .faq-item');
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
