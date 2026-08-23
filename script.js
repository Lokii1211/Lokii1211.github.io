/**
 * Lokeshkumar D — Personal Portfolio Script
 * Lightweight, accessible interactions: theme toggle, mobile navigation, smooth scrolling.
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initMobileNav();
    initSmoothScroll();
    initActiveNavObserver();
});

/**
 * Theme Toggle (Dark Mode Default + Light Mode Option)
 */
function initThemeToggle() {
    const themeBtn = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('lokii_theme');

    // Default to dark mode unless user explicitly selected light
    if (savedTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }

    if (!themeBtn) return;

    themeBtn.addEventListener('click', () => {
        const isCurrentLight = document.documentElement.getAttribute('data-theme') === 'light';
        if (isCurrentLight) {
            document.documentElement.removeAttribute('data-theme');
            localStorage.setItem('lokii_theme', 'dark');
        } else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('lokii_theme', 'light');
        }
    });
}

/**
 * Mobile Navigation Drawer
 */
function initMobileNav() {
    const mobileBtn = document.getElementById('mobile-toggle');
    const navLinks = document.getElementById('nav-links');

    if (!mobileBtn || !navLinks) return;

    mobileBtn.addEventListener('click', () => {
        const isOpen = navLinks.classList.toggle('is-open');
        mobileBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close on navigation link click
    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('is-open');
            mobileBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Close when clicking outside
    document.addEventListener('click', (e) => {
        if (!mobileBtn.contains(e.target) && !navLinks.contains(e.target)) {
            navLinks.classList.remove('is-open');
            mobileBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

/**
 * Smooth Scroll for internal anchor links
 */
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Active Navigation Link Highlighting via Intersection Observer
 */
function initActiveNavObserver() {
    const sections = document.querySelectorAll('header[id], section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    if (!sections.length || !navLinks.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '-20% 0px -70% 0px',
        threshold: 0
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.getAttribute('id');
                navLinks.forEach(link => {
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    } else {
                        link.classList.remove('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));
}
