// HCM — tương tác phía trình duyệt (không dùng thư viện)
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  // ---- Header: nền đặc khi cuộn, ẩn khi cuộn xuống ----
  const header = $('[data-header]');
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    header.classList.toggle('is-solid', y > 40);
    header.classList.toggle('is-hidden', y > 400 && y > lastY && !document.body.classList.contains('menu-open'));
    lastY = y;
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---- Menu di động ----
  const toggle = $('[data-menu-toggle]');
  const nav = $('#main-nav');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', open);
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('menu-open', open);
  };
  toggle.addEventListener('click', () => setMenu(toggle.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => e.key === 'Escape' && nav.classList.contains('is-open') && (setMenu(false), toggle.focus()));
  $$('a', nav).forEach((a) => a.addEventListener('click', () => setMenu(false)));

  // ---- Hiện dần khi cuộn ----
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.isIntersecting && (e.target.classList.add('is-visible'), io.unobserve(e.target))),
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );
  $$('.reveal').forEach((el) => io.observe(el));

  // ---- Đếm số ----
  const countIO = new IntersectionObserver((entries) =>
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      countIO.unobserve(e.target);
      const end = Number(e.target.dataset.count);
      if (reduced) return (e.target.textContent = end);
      const t0 = performance.now();
      const step = (t) => {
        const k = Math.min(1, (t - t0) / 1600);
        e.target.textContent = Math.round(end * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    })
  );
  $$('[data-count]').forEach((el) => countIO.observe(el));

  // ---- Hero slider ----
  const hero = $('[data-hero]');
  if (hero) {
    const slides = $$('[data-slide]', hero);
    const captions = $$('[data-caption]', hero);
    const dots = $$('[data-dot]', hero);
    const words = $$('.hero-rotator span', hero);
    const MS = 6000;
    hero.style.setProperty('--slide-ms', `${MS}ms`);
    let i = 0, w = 0, timer;

    const go = (n) => {
      [slides, captions].forEach((list) => list[i] && list[i].classList.remove('is-active'));
      dots[i] && dots[i].setAttribute('aria-selected', 'false');
      i = (n + slides.length) % slides.length;
      [slides, captions].forEach((list) => list[i] && list[i].classList.add('is-active'));
      if (dots[i]) {
        dots[i].setAttribute('aria-selected', 'true');
        const bar = dots[i].firstElementChild; // chạy lại thanh tiến trình
        bar.style.display = 'none'; void bar.offsetWidth; bar.style.display = '';
      }
      // ảnh kế tiếp: tải trước
      const next = slides[(i + 1) % slides.length]?.querySelector('img');
      if (next) next.loading = 'eager';
      if (words.length > 1) {
        const prev = words[w];
        prev.classList.remove('is-active'); prev.classList.add('is-leaving');
        setTimeout(() => prev.classList.remove('is-leaving'), 700);
        w = (w + 1) % words.length;
        words[w].classList.add('is-active');
      }
    };
    const play = () => { clearInterval(timer); if (!reduced && slides.length > 1) timer = setInterval(() => go(i + 1), MS); };
    dots.forEach((d) => d.addEventListener('click', () => { go(Number(d.dataset.dot)); play(); }));
    document.addEventListener('visibilitychange', () => (document.hidden ? clearInterval(timer) : play()));
    if (slides.length < 2) $('.hero-dots', hero)?.remove();
    play();

    // vuốt trên điện thoại
    let sx = null;
    hero.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    hero.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) { go(i + (dx < 0 ? 1 : -1)); play(); }
      sx = null;
    });
  }

  // ---- Lọc dự án ----
  $$('[data-filters]').forEach((group) => {
    const grid = document.getElementById(group.dataset.filters);
    const buttons = $$('[data-filter]', group);
    const status = $('[data-filter-status]');
    const apply = (key, push) => {
      let n = 0;
      buttons.forEach((b) => {
        const on = b.dataset.filter === key;
        b.classList.toggle('is-active', on);
        b.setAttribute('aria-pressed', on);
      });
      $$('.project-card', grid).forEach((card) => {
        const show = key === 'all' || card.dataset.category === key;
        card.hidden = !show;
        if (show) { n++; card.classList.remove('is-visible'); requestAnimationFrame(() => card.classList.add('is-visible')); }
      });
      grid.classList.toggle('is-filtered', key !== 'all');
      if (status) status.textContent = `Đang hiển thị ${n} dự án`;
      if (push && 'hash' in group.dataset) history.replaceState(null, '', key === 'all' ? location.pathname : `#${key}`);
    };
    buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter, true)));
    const initial = location.hash.slice(1);
    if ('hash' in group.dataset && buttons.some((b) => b.dataset.filter === initial)) apply(initial, false);
  });

  // ---- Lightbox ----
  const gallery = $('[data-gallery]');
  const lb = $('[data-lightbox]');
  if (gallery && lb) {
    const items = $$('a', gallery);
    const img = $('[data-lb-img]', lb);
    const count = $('[data-lb-count]', lb);
    let cur = 0, opener = null;

    const show = (n) => {
      cur = (n + items.length) % items.length;
      img.style.opacity = 0;
      img.onload = () => (img.style.opacity = 1);
      img.src = items[cur].href;
      img.alt = items[cur].querySelector('img').alt;
      count.textContent = `${cur + 1} / ${items.length}`;
      new Image().src = items[(cur + 1) % items.length].href;
    };
    const open = (n) => {
      opener = document.activeElement;
      lb.hidden = false;
      requestAnimationFrame(() => lb.classList.add('is-open'));
      document.body.style.overflow = 'hidden';
      show(n);
      $('[data-lb-close]', lb).focus();
    };
    const close = () => {
      lb.classList.remove('is-open');
      document.body.style.overflow = '';
      setTimeout(() => (lb.hidden = true), 250);
      opener && opener.focus();
    };

    items.forEach((a, n) => a.addEventListener('click', (e) => { e.preventDefault(); open(n); }));
    $('[data-lb-close]', lb).addEventListener('click', close);
    $('[data-lb-prev]', lb).addEventListener('click', () => show(cur - 1));
    $('[data-lb-next]', lb).addEventListener('click', () => show(cur + 1));
    lb.addEventListener('click', (e) => e.target === lb && close());
    addEventListener('keydown', (e) => {
      if (lb.hidden) return;
      if (e.key === 'Escape') close();
      if (e.key === 'ArrowLeft') show(cur - 1);
      if (e.key === 'ArrowRight') show(cur + 1);
      if (e.key === 'Tab') { // giữ focus trong lightbox
        const f = $$('button', lb);
        if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
        else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
      }
    });
    let sx = null;
    lb.addEventListener('touchstart', (e) => (sx = e.touches[0].clientX), { passive: true });
    lb.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1));
      sx = null;
    });
  }
})();
