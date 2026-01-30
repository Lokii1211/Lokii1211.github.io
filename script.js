// =========================================
// LOKI.AI - Premium Portfolio Scripts
// White Theme with Advanced Animations
// =========================================

document.addEventListener('DOMContentLoaded', () => {
    initNavbarScroll();
    initTypingAnimation();
    initScrollAnimations();
    initSmoothScroll();
    initSkillProgressBars();
    initProjectCardTilt();
    initMobileMenu();
    initCounterAnimation();
    initParallaxOrbs();
});

// =========================================
// NAVBAR SCROLL EFFECT
// =========================================
function initNavbarScroll() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;

        if (currentScroll > 50) {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 4px 30px rgba(0, 0, 0, 0.08)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.85)';
            navbar.style.boxShadow = 'none';
        }

        // Hide/show navbar on scroll
        if (currentScroll > lastScroll && currentScroll > 400) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        lastScroll = currentScroll;
    });

    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 150;
            if (window.scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
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
        'Business AI Platforms',
        'AI-Powered Solutions',
        'Intelligent Automation'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typedElement = document.getElementById('typed-text');

    if (!typedElement) return;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typedElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentRole.length) {
            typeSpeed = 2500;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 400;
        }

        setTimeout(type, typeSpeed);
    }

    type();
}

// =========================================
// SCROLL ANIMATIONS
// =========================================
function initScrollAnimations() {
    const animateElements = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Staggered animation
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    animateElements.forEach(el => {
        observer.observe(el);
    });
}

// =========================================
// SMOOTH SCROLL
// =========================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// =========================================
// SKILL PROGRESS BARS
// =========================================
function initSkillProgressBars() {
    const skillItems = document.querySelectorAll('.skill-item');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    skillItems.forEach(item => {
        observer.observe(item);
    });
}

// =========================================
// PROJECT CARD TILT EFFECT
// =========================================
function initProjectCardTilt() {
    const cards = document.querySelectorAll('[data-tilt]');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 25;
            const rotateY = (centerX - x) / 25;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
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
    const menuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.querySelector('.nav-links');

    if (!menuBtn || !navLinks) return;

    menuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('mobile-active');
        menuBtn.classList.toggle('active');
    });

    navLinks.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('mobile-active');
            menuBtn.classList.remove('active');
        });
    });
}

// =========================================
// COUNTER ANIMATION
// =========================================
function initCounterAnimation() {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statItems = entry.target.querySelectorAll('.stat-item');
                statItems.forEach((item, index) => {
                    setTimeout(() => {
                        const numberEl = item.querySelector('.stat-number');
                        const target = parseInt(numberEl.getAttribute('data-target'));
                        if (target) {
                            animateCounter(numberEl, target);
                        }
                    }, index * 200);
                });
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    const heroStats = document.querySelector('.hero-stats');
    if (heroStats) {
        statsObserver.observe(heroStats);
    }
}

function animateCounter(element, target) {
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const easeOutQuart = t => 1 - Math.pow(1 - t, 4);

    const startTime = performance.now();

    const updateCounter = (currentTime) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeOutQuart(progress);

        current = Math.floor(easedProgress * target);
        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(updateCounter);
        } else {
            element.textContent = target;
        }
    };

    requestAnimationFrame(updateCounter);
}

// =========================================
// PARALLAX ORBS
// =========================================
function initParallaxOrbs() {
    const orbs = document.querySelectorAll('.gradient-orb');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        orbs.forEach((orb, index) => {
            const speed = 0.05 * (index + 1);
            orb.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // Mouse parallax
    document.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth - 0.5;
        const mouseY = e.clientY / window.innerHeight - 0.5;

        orbs.forEach((orb, index) => {
            const speed = 20 * (index + 1);
            orb.style.transform = `translate(${mouseX * speed}px, ${mouseY * speed}px)`;
        });
    });
}

// =========================================
// CHAT ANIMATION
// =========================================
function initChatAnimation() {
    const messages = document.querySelectorAll('.message');

    messages.forEach((msg, index) => {
        msg.style.opacity = '0';
        msg.style.transform = 'translateY(20px)';

        setTimeout(() => {
            msg.style.transition = 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
            msg.style.opacity = '1';
            msg.style.transform = 'translateY(0)';
        }, index * 600);
    });
}

// Initialize chat animation when featured project is in view
const featuredProject = document.querySelector('.featured-project');
if (featuredProject) {
    const chatObserver = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            initChatAnimation();
            chatObserver.unobserve(featuredProject);
        }
    }, { threshold: 0.3 });
    chatObserver.observe(featuredProject);
}

// =========================================
// CONSOLE BRANDING
// =========================================
console.log(`
%c🚀 LOKI.AI Portfolio
%cBuilt with passion by Lokeshkumar D

%c💼 Looking for AI Engineering opportunities!
%c📧 lokiiii1211@gmail.com
%c💬 wa.me/919003360494
%c🔗 github.com/Lokii1211
`,
    'font-size: 24px; font-weight: bold; color: #6366f1;',
    'font-size: 14px; color: #475569;',
    'font-size: 12px; color: #22c55e;',
    'font-size: 12px; color: #6366f1;',
    'font-size: 12px; color: #25D366;',
    'font-size: 12px; color: #6366f1;'
);

// =========================================
// PERFORMANCE: Debounce scroll events
// =========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Optimize scroll listeners
const optimizedScroll = debounce(() => {
    // Any heavy scroll operations
}, 10);

window.addEventListener('scroll', optimizedScroll);
