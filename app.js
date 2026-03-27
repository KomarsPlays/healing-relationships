/**
 * Komars Landing — App Logic
 * Scroll animations, FAQ accordion, mobile nav, smooth scroll
 */

(function() {
    'use strict';

    // ===== INTERSECTION OBSERVER (Reveal on Scroll) =====
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // ===== NAV MORPH EFFECT (transparent → blur glass on scroll) =====
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    function updateNav() {
        const scrollY = window.scrollY;
        if (scrollY > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    }

    // Check on load (in case page is already scrolled)
    updateNav();

    window.addEventListener('scroll', updateNav, { passive: true });

    // ===== MOBILE NAV TOGGLE =====
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', () => {
            navToggle.classList.toggle('open');
            navMenu.classList.toggle('open');
            document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
        });

        // Close on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
                document.body.style.overflow = '';
            });
        });
    }

    // ===== FAQ ACCORDION =====
    document.querySelectorAll('.faq__question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.closest('.faq__item');
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq__item.open').forEach(openItem => {
                openItem.classList.remove('open');
                openItem.querySelector('.faq__question').setAttribute('aria-expanded', 'false');
            });

            // Toggle current
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });
    // ===== IMPACT CENTER — TREMOR ON HOLD =====
    const impactBtn = document.getElementById('impactCenterBtn');
    if (impactBtn) {
        const items = document.querySelectorAll('.impact__item');

        function startTremor() {
            items.forEach(item => item.classList.add('impact__item--shaking'));
            // Haptic feedback on mobile
            if (navigator.vibrate) {
                navigator.vibrate([100, 50, 100, 50, 100]);
            }
        }

        function stopTremor() {
            items.forEach(item => item.classList.remove('impact__item--shaking'));
        }

        // Mouse events
        impactBtn.addEventListener('mousedown', startTremor);
        impactBtn.addEventListener('mouseup', stopTremor);
        impactBtn.addEventListener('mouseleave', stopTremor);

        // Touch events (mobile)
        impactBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            startTremor();
        }, { passive: false });
        impactBtn.addEventListener('touchend', stopTremor);
        impactBtn.addEventListener('touchcancel', stopTremor);
    }

})();

// ===== MESSENGER MODAL (global scope for inline onclick) =====
function openMessengerModal() {
    const modal = document.getElementById('messengerModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        // Yandex Metrika goal: modal opened
        if (typeof ym !== 'undefined') ym(COUNTER_ID, 'reachGoal', 'click_messenger_modal');
    }
}

function closeMessengerModal() {
    const modal = document.getElementById('messengerModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Close on Escape key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMessengerModal();
});
