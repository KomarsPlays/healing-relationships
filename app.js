/**
 * Komars Landing — App Logic
 * Scroll animations, FAQ accordion, mobile nav, smooth scroll
 */

// ===== SHARED BODY SCROLL LOCK =====
// Мобильное меню и модалка пишут в body.style.overflow — счётчик не даёт
// одному оверлею разблокировать скролл, пока открыт другой.
let bodyScrollLocks = 0;
function lockBodyScroll() {
    bodyScrollLocks++;
    document.body.style.overflow = 'hidden';
}
function unlockBodyScroll() {
    bodyScrollLocks = Math.max(0, bodyScrollLocks - 1);
    if (bodyScrollLocks === 0) document.body.style.overflow = '';
}

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
            const willOpen = !navMenu.classList.contains('open');
            navToggle.classList.toggle('open', willOpen);
            navMenu.classList.toggle('open', willOpen);
            navToggle.setAttribute('aria-expanded', String(willOpen));
            if (willOpen) lockBodyScroll(); else unlockBodyScroll();
        });

        // Close on link click
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (!navMenu.classList.contains('open')) return;
                navToggle.classList.remove('open');
                navMenu.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                unlockBodyScroll();
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

        // Keyboard (role="button" обещает Enter/Space — выполняем обещание)
        impactBtn.addEventListener('keydown', (e) => {
            if ((e.key === 'Enter' || e.key === ' ') && !e.repeat) {
                e.preventDefault();
                startTremor();
            }
        });
        impactBtn.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' || e.key === ' ') stopTremor();
        });
    }

    // ===== IMPACT CARDS — KEYBOARD ACCESS + ARIA SYNC =====
    // Карточки раскрываются inline-onclick на div; даём им клавиатуру
    // и синхронизируем aria-expanded после переключения.
    document.querySelectorAll('.impact__item').forEach(item => {
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
        item.addEventListener('click', () => {
            const detail = item.querySelector('.impact__detail');
            if (detail) {
                item.setAttribute('aria-expanded', detail.classList.contains('open') ? 'true' : 'false');
            }
        });
    });

})();

// ===== MESSENGER MODAL (global scope for inline onclick) =====
let messengerModalReturnFocus = null;

function openMessengerModal() {
    const modal = document.getElementById('messengerModal');
    if (modal && !modal.classList.contains('active')) {
        messengerModalReturnFocus = document.activeElement;
        modal.classList.add('active');
        lockBodyScroll();
        const closeBtn = modal.querySelector('.messenger-modal__close');
        if (closeBtn) closeBtn.focus();
        // Yandex Metrika goal: modal opened
        if (typeof ym !== 'undefined') ym(108266859, 'reachGoal', 'click_messenger_modal');
    }
}

function closeMessengerModal() {
    const modal = document.getElementById('messengerModal');
    if (modal && modal.classList.contains('active')) {
        modal.classList.remove('active');
        unlockBodyScroll();
        if (messengerModalReturnFocus && typeof messengerModalReturnFocus.focus === 'function') {
            messengerModalReturnFocus.focus();
        }
        messengerModalReturnFocus = null;
    }
}

// Close on Escape + focus trap внутри открытой модалки
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeMessengerModal();
        return;
    }
    if (e.key !== 'Tab') return;
    const modal = document.getElementById('messengerModal');
    if (!modal || !modal.classList.contains('active')) return;
    const focusables = modal.querySelectorAll('button, a[href]');
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
    }
});

// ===== COOKIE NOTICE =====
// Показывается, пока посетитель не нажал "Хорошо"; выбор хранится в localStorage.
(function() {
    const notice = document.getElementById('cookieNotice');
    const btn = document.getElementById('cookieNoticeBtn');
    if (!notice || !btn) return;
    let accepted = false;
    try {
        accepted = localStorage.getItem('cookieConsent') === '1';
    } catch (e) { /* приватный режим — просто покажем плашку */ }
    if (accepted) return;
    // Задержка показа: первый экран остаётся чистым, кнопка записи видна
    setTimeout(() => { notice.hidden = false; }, 1200);
    btn.addEventListener('click', () => {
        try {
            localStorage.setItem('cookieConsent', '1');
        } catch (e) { /* нет localStorage — скроем до перезагрузки */ }
        notice.hidden = true;
    });
})();
