// HCM Construction — tương tác phía client (không phụ thuộc thư viện)
(() => {
  document.documentElement.classList.add('js');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Header đổi nền khi cuộn
  const header = document.querySelector('[data-header]');
  const onScroll = () => header && header.classList.toggle('is-scrolled', window.scrollY > 24);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // Menu mobile
  const toggle = document.querySelector('[data-nav-toggle]');
  const nav = document.querySelector('[data-nav]');
  const setNav = (open) => {
    document.body.classList.toggle('nav-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Đóng menu' : 'Mở menu');
  };
  if (toggle && nav) {
    toggle.addEventListener('click', () => setNav(!document.body.classList.contains('nav-open')));
    nav.addEventListener('click', (e) => e.target.closest('a') && setNav(false));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && document.body.classList.contains('nav-open')) {
        setNav(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 961px)').addEventListener('change', (m) => m.matches && setNav(false));
  }

  // Hiện dần khi cuộn tới
  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((el) => el.classList.add('is-visible'));
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.08 }
    );
    reveals.forEach((el) => io.observe(el));
  }

  // Đếm số thống kê
  const counters = document.querySelectorAll('[data-count]');
  const fmt = (n, d) => n.toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const runCounter = (el) => {
    const target = parseFloat(el.dataset.count);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    const duration = 1600;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(target * eased, decimals);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!reduceMotion && 'IntersectionObserver' in window) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => cio.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = fmt(parseFloat(el.dataset.count), parseInt(el.dataset.decimals || '0', 10))));
  }

  // Lọc dự án
  const filter = document.querySelector('[data-filter]');
  if (filter) {
    const items = document.querySelectorAll('[data-filter-grid] [data-category]');
    filter.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-filter-value]');
      if (!btn) return;
      const value = btn.dataset.filterValue;
      filter.querySelectorAll('[data-filter-value]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      items.forEach((item) => {
        item.hidden = value !== 'all' && item.dataset.category !== value;
        item.classList.add('is-visible');
      });
    });
  }

  // Form liên hệ: kiểm tra phía client + trạng thái đang gửi
  const form = document.querySelector('[data-contact-form]');
  if (form) {
    const messages = {
      name: 'Vui lòng nhập họ tên.',
      phone: 'Số điện thoại chưa hợp lệ (ví dụ 0909 123 456).',
      email: 'Email chưa hợp lệ (ví dụ ten@congty.vn).',
      message: 'Vui lòng mô tả nhu cầu (ít nhất 10 ký tự).'
    };
    const checks = {
      name: (v) => v.trim().length >= 2,
      phone: (v) => /^[0-9+\s().-]{8,20}$/.test(v.trim()),
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: (v) => v.trim().length >= 10
    };
    const showError = (input, msg) => {
      const field = input.closest('.field');
      let err = field.querySelector('.field-error');
      if (msg) {
        if (!err) {
          err = document.createElement('p');
          err.className = 'field-error';
          err.id = 'e-' + input.name;
          field.appendChild(err);
        }
        err.textContent = msg;
        field.classList.add('has-error');
        input.setAttribute('aria-invalid', 'true');
        input.setAttribute('aria-describedby', err.id);
      } else {
        if (err) err.remove();
        field.classList.remove('has-error');
        input.removeAttribute('aria-invalid');
        input.removeAttribute('aria-describedby');
      }
    };
    const validate = (input) => {
      const ok = checks[input.name] ? checks[input.name](input.value) : true;
      showError(input, ok ? null : messages[input.name]);
      return ok;
    };
    Object.keys(checks).forEach((name) => {
      const input = form.elements[name];
      input.addEventListener('blur', () => input.value && validate(input));
      input.addEventListener('input', () => input.getAttribute('aria-invalid') && validate(input));
    });
    form.addEventListener('submit', (e) => {
      const invalid = Object.keys(checks).map((n) => form.elements[n]).filter((input) => !validate(input));
      if (invalid.length) {
        e.preventDefault();
        invalid[0].focus();
        return;
      }
      const btn = form.querySelector('[data-submit]');
      btn.classList.add('is-loading');
      btn.setAttribute('aria-busy', 'true');
    });
  }

  // Đưa focus tới thông báo kết quả form
  const focusTarget = document.querySelector('[data-focus]');
  if (focusTarget) focusTarget.focus({ preventScroll: false });
})();
