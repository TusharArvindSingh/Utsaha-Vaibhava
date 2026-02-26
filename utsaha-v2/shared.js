// ===== SHARED JS FOR ALL UTSAHA V2 PAGES =====

// MARQUEE
function initMarquee() {
    const TEXTS = ['APRIL 10 & 11', 'BMS INSTITUTE OF TECHNOLOGY AND MANAGEMENT', '30+ EVENTS', '\u20B94L PRIZES',
        'UTSAHA VAIBHAVA 2026', 'CULTURAL', 'TECHNICAL', 'SPORTS', 'GAMING', 'REGISTER NOW'];

    const track = document.getElementById('marqueeTrack');
    if (!track) return;
    [...TEXTS, ...TEXTS].forEach(t => {
        const el = document.createElement('div');
        el.className = 'marquee-item';
        el.textContent = t;
        track.appendChild(el);
    });
}

// COUNTDOWN (only used on home page)
function initCountdown() {
    const FEST = new Date('2026-04-10T09:00:00');
    const els = {
        days: document.getElementById('cd-days'),
        hours: document.getElementById('cd-hours'),
        mins: document.getElementById('cd-mins'),
        secs: document.getElementById('cd-secs'),
    };
    if (!els.days) return;
    const prev = { days: '', hours: '', mins: '', secs: '' };
    function pad(n) { return String(n).padStart(2, '0'); }
    function tick() {
        const diff = FEST - Date.now();
        if (diff <= 0) { Object.values(els).forEach(e => e && (e.textContent = '00')); return; }
        const d = Math.floor(diff / 864e5);
        const h = Math.floor((diff / 36e5) % 24);
        const m = Math.floor((diff / 6e4) % 60);
        const s = Math.floor((diff / 1e3) % 60);
        [
            { key: 'days', val: pad(d) }, { key: 'hours', val: pad(h) },
            { key: 'mins', val: pad(m) }, { key: 'secs', val: pad(s) }
        ].forEach(({ key, val }) => {
            if (prev[key] !== val && els[key]) {
                prev[key] = val;
                els[key].textContent = val;
                els[key].classList.remove('cd-flip');
                void els[key].offsetWidth;
                els[key].classList.add('cd-flip');
            }
        });
    }
    tick();
    setInterval(tick, 1000);
}

// CANVAS PARTICLES
function initCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, sparks = [];
    function resize() { W = canvas.width = innerWidth; H = canvas.height = innerHeight; }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const PALETTE = ['#FF4D00', '#FF0070', '#FFB800', '#FF6030', '#FF3080'];

    function Spark() {
        this.reset = function () {
            this.x = Math.random() * W;
            this.y = H + Math.random() * 50;
            this.vx = (Math.random() - 0.5) * 0.7;
            this.vy = -(1.2 + Math.random() * 2.2);
            this.alpha = 0.5 + Math.random() * 0.5;
            this.size = 1 + Math.random() * 2.8;
            this.life = 0;
            this.maxLife = 90 + Math.random() * 100;
            this.color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
        };
        this.reset();
        this.y = Math.random() * H;
        this.life = Math.random() * this.maxLife;
    }

    for (let i = 0; i < 110; i++) sparks.push(new Spark());

    function draw() {
        ctx.clearRect(0, 0, W, H);
        sparks.forEach(s => {
            s.life++;
            s.x += s.vx;
            s.y += s.vy;
            const t = s.life / s.maxLife;
            const a = s.alpha * (1 - t);
            ctx.save();
            ctx.globalAlpha = a;
            ctx.fillStyle = s.color;
            ctx.shadowColor = s.color;
            ctx.shadowBlur = 7;
            ctx.beginPath();
            ctx.arc(s.x, s.y, s.size * (1 - t * 0.5), 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            if (s.life >= s.maxLife) s.reset();
        });
        requestAnimationFrame(draw);
    }
    draw();
}

// SCROLL REVEAL
function initReveal() {
    const io = new IntersectionObserver((entries) => {
        entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.07, rootMargin: '0px 0px -35px 0px' });
    setTimeout(() => {
        document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => io.observe(el));
    }, 80);
}

// NAVBAR SCROLL (add 'scrolled' class after 60px)
function initNav() {
    const header = document.querySelector('.site-header');
    if (!header) return;
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 60);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    // Wordmark: hide while hero title is visible, show once it scrolls away
    const heroTitle = document.querySelector('.hero-title');
    if (!heroTitle) {
        // No hero on this page — always show wordmark
        header.classList.add('nav-wordmark-in');
    } else {
        const obs = new IntersectionObserver(entries => {
            // isIntersecting = hero is on screen → hide wordmark
            header.classList.toggle('nav-wordmark-in', !entries[0].isIntersecting);
        }, { threshold: 0.15 });
        obs.observe(heroTitle);
    }
}

// MOBILE HAMBURGER MENU
function initMobileMenu() {
    const btn = document.getElementById('menuBtn');
    const drawer = document.getElementById('mobileNav');
    if (!btn || !drawer) return;

    btn.addEventListener('click', () => {
        const open = drawer.classList.toggle('open');
        btn.classList.toggle('open', open);
        document.body.style.overflow = open ? 'hidden' : '';
    });

    // Close on link click inside drawer
    drawer.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            drawer.classList.remove('open');
            btn.classList.remove('open');
            document.body.style.overflow = '';
        });
    });
}

// Keep old name as no-op so existing page scripts don't error
function initNavIndicator() { }

// RIPPLE
function initRipple() {
    document.addEventListener('click', e => {
        const btn = e.target.closest('.ripple-btn');
        if (!btn) return;
        btn.querySelector('.ripple')?.remove();
        const r = document.createElement('span');
        const d = Math.max(btn.clientWidth, btn.clientHeight);
        const rect = btn.getBoundingClientRect();
        r.style.cssText = `width:${d}px;height:${d}px;left:${e.clientX - rect.left - d / 2}px;top:${e.clientY - rect.top - d / 2}px`;
        r.className = 'ripple';
        btn.appendChild(r);
    });
}


