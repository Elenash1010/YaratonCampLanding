export function initSeasonTabs(onChange) {
  const tabs = Array.from(document.querySelectorAll('.tab'));
  if (tabs.length === 0) return;

  const panels = {
    spring: document.getElementById('season-spring'),
    summer: document.getElementById('season-summer'),
    autumn: document.getElementById('season-autumn'),
    winter: document.getElementById('season-winter'),
  };

  const activateSeason = (key) => {
    tabs.forEach((tab) => tab.setAttribute('aria-selected', 'false'));
    document.getElementById(`tab-${key}`)?.setAttribute('aria-selected', 'true');

    Object.entries(panels).forEach(([panelKey, panel]) => {
      if (panel) {
        panel.hidden = panelKey !== key;
      }
    });

    onChange?.();
  };

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateSeason(tab.id.replace('tab-', '')));
  });
}

export function initScrollers() {
  const updateScrollerHints = (wrap) => {
    const scroller = wrap.querySelector('[data-scroller]');
    if (!scroller) return;

    const maxScroll = scroller.scrollWidth - scroller.clientWidth;
    const position = scroller.scrollLeft;

    wrap.classList.toggle('has-left', position > 2);
    wrap.classList.toggle('has-right', position < maxScroll - 2);

    const prev = wrap.querySelector('[data-scroll="prev"]');
    const next = wrap.querySelector('[data-scroll="next"]');
    if (prev) prev.disabled = position <= 2;
    if (next) next.disabled = position >= maxScroll - 2;
  };

  const updateAllScrollerHints = () => {
    document.querySelectorAll('[data-scroller-wrap]').forEach(updateScrollerHints);
  };

  const scrollByPage = (scroller, direction) => {
    const gap = 14;
    const step = scroller.clientWidth - gap;
    scroller.scrollBy({ left: direction * step, behavior: 'smooth' });
  };

  document.querySelectorAll('[data-scroller-wrap]').forEach((wrap) => {
    const scroller = wrap.querySelector('[data-scroller]');
    if (!scroller) return;

    updateScrollerHints(wrap);

    scroller.addEventListener('scroll', () => updateScrollerHints(wrap), { passive: true });
    scroller.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight') {
        event.preventDefault();
        scrollByPage(scroller, 1);
      }
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        scrollByPage(scroller, -1);
      }
    });

    scroller.setAttribute('tabindex', '0');
    scroller.setAttribute('role', 'region');

    wrap.querySelectorAll('.scroll-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const direction = button.dataset.scroll === 'next' ? 1 : -1;
        scrollByPage(scroller, direction);
      });
    });
  });

  window.addEventListener('resize', () => requestAnimationFrame(updateAllScrollerHints), { passive: true });

  return { updateAllScrollerHints };
}

export function initClosableSections() {
  document.querySelectorAll('[data-close]').forEach((button) => {
    button.addEventListener('click', () => {
      const selector = button.getAttribute('data-close');
      document.querySelector(selector)?.classList.add('is-hidden');
    });
  });

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href === '#!') return;

    const target = document.querySelector(href);
    if (!target || !target.classList.contains('closable')) return;

    link.addEventListener('click', () => {
      target.classList.remove('is-hidden');
    });
  });
}
