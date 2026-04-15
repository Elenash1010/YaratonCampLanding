document.addEventListener('DOMContentLoaded', () => {
  const header = document.querySelector('header');
  const burger = document.getElementById('burger');
  const mobilePanel = document.getElementById('mobilePanel');
  const brandLink = document.querySelector('header .brand');
  const modals = Array.from(document.querySelectorAll('.modal'));

  const onScroll = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 8);
    }
  };

  const setMenu = (open) => {
    if (!burger || !mobilePanel) return;
    burger.setAttribute('aria-expanded', String(open));
    mobilePanel.setAttribute('aria-hidden', String(!open));
    mobilePanel.style.display = open ? 'block' : 'none';
  };

  const syncBodyState = () => {
    if (document.querySelector('.modal.is-open')) {
      document.body.setAttribute('data-modal-open', '1');
    } else {
      document.body.removeAttribute('data-modal-open');
    }
  };

  const openModalEl = (modal, trigger = null) => {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    if (trigger instanceof HTMLElement) {
      if (!trigger.id) {
        trigger.id = `trigger-${Math.random().toString(36).slice(2, 10)}`;
      }
      modal.dataset.returnFocusId = trigger.id;
    }

    syncBodyState();
    modal.dispatchEvent(new CustomEvent('modal:open'));
  };

  const closeModalEl = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    syncBodyState();

    const returnFocusId = modal.dataset.returnFocusId;
    if (returnFocusId) {
      document.getElementById(returnFocusId)?.focus();
    }

    modal.dispatchEvent(new CustomEvent('modal:close'));
  };

  const openModalById = (id, trigger = null) => {
    openModalEl(document.getElementById(id), trigger);
  };

  const closeModalById = (id) => {
    closeModalEl(document.getElementById(id));
  };

  const closeAllModals = () => {
    modals.forEach(closeModalEl);
  };

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

  const tabs = Array.from(document.querySelectorAll('.tab'));
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

    requestAnimationFrame(updateAllScrollerHints);
  };

  onScroll();
  setMenu(false);
  closeAllModals();

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', () => requestAnimationFrame(updateAllScrollerHints), { passive: true });

  burger?.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    setMenu(!isOpen);
  });

  brandLink?.addEventListener('click', (event) => {
    event.preventDefault();
    setMenu(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  mobilePanel?.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setMenu(false);
    }
  });

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateSeason(tab.id.replace('tab-', '')));
  });

  document.querySelectorAll('.card.shift, .card.program').forEach((card) => {
    const modalTrigger = card.querySelector('[data-modal]');
    const media = card.querySelector('.card-media');
    if (!modalTrigger || !media) return;

    media.setAttribute('data-modal', modalTrigger.getAttribute('data-modal'));
    media.setAttribute('role', 'button');
    media.setAttribute('tabindex', '0');

    const triggerLabel =
      modalTrigger.getAttribute('aria-label') ||
      media.getAttribute('aria-label') ||
      'Открыть подробности';
    media.setAttribute('aria-label', triggerLabel);

    media.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        media.click();
      }
    });
  });

  document.querySelectorAll('[data-scroller-wrap]').forEach((wrap) => {
    const scroller = wrap.querySelector('[data-scroller]');
    if (!scroller) return;

    updateScrollerHints(wrap);
    scroller.setAttribute('tabindex', '0');
    scroller.setAttribute('role', 'region');

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

    wrap.querySelectorAll('.scroll-btn').forEach((button) => {
      button.addEventListener('click', () => {
        const direction = button.dataset.scroll === 'next' ? 1 : -1;
        scrollByPage(scroller, direction);
      });
    });
  });

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

  document.querySelectorAll('iframe').forEach((frame) => {
    if (!frame.getAttribute('loading')) {
      frame.setAttribute('loading', 'lazy');
    }
  });

  document.querySelector('#route iframe')?.setAttribute('title', 'Карта проезда до лагеря Яратон');
  document.querySelector('#contacts iframe')?.setAttribute('title', 'Форма заявки на смену');

  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const photoModal = document.getElementById('photoModal');
  const modalImage = document.getElementById('modalImage');
  const closePhotoButton = document.getElementById('closeModal');
  const tiles = Array.from(document.querySelectorAll('.tile'));
  const openFirstPhoto = document.getElementById('openFirstPhoto');
  const dayPhotoTrigger = document.querySelector('.js-open-day-photo');

  const openPhoto = (src, alt, trigger) => {
    if (!photoModal || !modalImage || !src) return;
    modalImage.src = src;
    modalImage.alt = alt || 'Фото лагеря';
    openModalEl(photoModal, trigger);
    closePhotoButton?.focus();
  };

  tiles.forEach((tile) => {
    const open = () =>
      openPhoto(
        tile.dataset.full,
        tile.dataset.alt || tile.getAttribute('aria-label') || 'Фото лагеря',
        tile
      );

    tile.addEventListener('click', open);
    tile.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  });

  openFirstPhoto?.addEventListener('click', () => {
    const firstTile = tiles[0];
    if (firstTile) {
      openPhoto(
        firstTile.dataset.full,
        firstTile.dataset.alt || firstTile.getAttribute('aria-label') || 'Фото лагеря',
        firstTile
      );
    }
  });

  dayPhotoTrigger?.addEventListener('click', (event) => {
    event.preventDefault();
    openPhoto(
      dayPhotoTrigger.dataset.photoSrc,
      dayPhotoTrigger.dataset.photoAlt || 'Как проходит наш идеальный день в ЯРАТОНЕ',
      dayPhotoTrigger
    );
  });

  photoModal?.addEventListener('modal:close', () => {
    modalImage?.removeAttribute('src');
    if (modalImage) {
      modalImage.alt = '';
    }
  });

  modals.forEach((modal) => {
    modal.addEventListener('click', (event) => {
      if (event.target === modal) {
        closeModalEl(modal);
      }
    });
  });

  document.addEventListener('click', (event) => {
    const openTrigger = event.target.closest('[data-modal]');
    if (openTrigger) {
      event.preventDefault();
      openModalById(openTrigger.getAttribute('data-modal'), openTrigger);
      return;
    }

    const closeTrigger = event.target.closest('[data-modal-close]');
    if (closeTrigger) {
      event.preventDefault();
      closeModalById(closeTrigger.getAttribute('data-modal-close'));
      return;
    }

    const paymentTrigger = event.target.closest('.js-payment-instructions');
    if (paymentTrigger) {
      event.preventDefault();
      openModalById('paymentModal', paymentTrigger);
    }
  });

  document.addEventListener('keydown', (event) => {
    if (event.key !== 'Escape') return;
    setMenu(false);
    closeAllModals();
  });

  requestAnimationFrame(updateAllScrollerHints);
});
