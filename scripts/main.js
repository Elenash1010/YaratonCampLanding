document.addEventListener('DOMContentLoaded', () => {
  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;').replaceAll("'", '&#039;');

  const renderEvents = () => {
    const grid = document.getElementById('eventsGrid');
    const events = Array.isArray(window.YARATON_EVENTS) ? window.YARATON_EVENTS : [];
    if (!grid || events.length === 0) {
      document.getElementById('events')?.setAttribute('hidden', '');
      return;
    }

    const scheduleHtml = (days = []) => days.map((day) => `
      <section class="event-day"><h4>${escapeHtml(day.day)}</h4>
        ${day.note ? `<p class="event-day-note">${escapeHtml(day.note)}</p>` : ''}
        <dl class="event-schedule">${(day.items || []).map(([time, activity]) =>
          `<div><dt>${escapeHtml(time)}</dt><dd>${escapeHtml(activity)}</dd></div>`).join('')}</dl>
      </section>`).join('');

    const pricesHtml = (prices = {}) => `
      <div class="event-price-wrap" tabindex="0" role="region" aria-label="Таблица стоимости — прокрутите по горизонтали при необходимости">
        <table class="event-price-table">
          <thead><tr>${(prices.columns || []).map((cell) => `<th scope="col">${escapeHtml(cell)}</th>`).join('')}</tr></thead>
          <tbody>${(prices.rows || []).map((row) => `<tr>${row.map((cell, index) => index === 0 ? `<th scope="row">${escapeHtml(cell)}</th>` : `<td>${escapeHtml(cell)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>${prices.note ? `<p class="event-price-note">${escapeHtml(prices.note)}</p>` : ''}`;

    grid.innerHTML = events.map((event) => `
      <article class="event-card">
        <button class="event-card-media" type="button" data-modal="eventModal-${escapeHtml(event.id)}" aria-label="Открыть программу: ${escapeHtml(event.title)}">
          <img src="${escapeHtml(event.image)}" alt="${escapeHtml(event.imageAlt)}" loading="lazy" decoding="async">
        </button>
        <span class="event-card-copy"><span class="event-card-eyebrow">${escapeHtml(event.eyebrow)}</span>
          <span class="event-card-title"><span class="event-card-title-prefix">${escapeHtml(event.titlePrefix || 'Семейный фестиваль')}</span><strong>${escapeHtml(event.titleMain || event.title)}</strong></span>
          <span class="event-card-details">
            <span><span class="event-card-detail-label">Время проведения:</span> <strong>${escapeHtml(event.date)}</strong></span>
            <span><span class="event-card-detail-label">Место проведения:</span> <strong>${escapeHtml(event.place)}</strong></span>
          </span>
          <span class="event-card-summary">${escapeHtml(event.summary)}</span>
          <span class="event-card-meta">${(event.highlights || []).slice(0, 3).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</span>
          <span class="event-card-actions">
            <a class="btn btn-primary" href="#contacts">Участвую!</a>
            <button class="btn btn-secondary" type="button" data-modal="eventModal-${escapeHtml(event.id)}">Программа и стоимость</button>
          </span>
        </span>
      </article>`).join('');

    events.forEach((event) => {
      const modalId = `eventModal-${event.id}`;
      const modal = document.createElement('div');
      modal.className = 'modal shift-modal event-modal';
      modal.id = modalId;
      modal.setAttribute('aria-hidden', 'true');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-modal', 'true');
      modal.setAttribute('aria-labelledby', `eventTitle-${event.id}`);
      modal.innerHTML = `<div class="box"><div class="topbar"><div class="event-modal-tags"><span class="tag">${escapeHtml(event.date)}</span><span class="tag">${escapeHtml(event.place)}</span></div>
        <button class="close" type="button" data-modal-close="${escapeHtml(modalId)}" aria-label="Закрыть подробности мероприятия">Закрыть ✕</button></div>
        <div class="content"><header class="event-modal-header">
          <h3 id="eventTitle-${escapeHtml(event.id)}">${escapeHtml(event.title)}</h3>
        </header>
          <div class="event-modal-hero"><img src="${escapeHtml(event.modalImage || event.image)}" alt="${escapeHtml(event.modalImageAlt || event.imageAlt)}" decoding="async"></div>
          <div class="event-modal-intro"><p>${escapeHtml(event.summary)}</p></div>
          <div class="event-highlights" aria-label="Главное в программе">${(event.highlights || []).map((item) => `<span>${escapeHtml(item)}</span>`).join('')}</div>
          <section class="event-modal-section"><h3>Главные события фестиваля</h3>
            <div class="event-feature-details">${(event.featureDetails || []).map((feature) => `
              <article class="event-feature-card"><h4>${escapeHtml(feature.title)}</h4>
                ${feature.description ? `<p>${escapeHtml(feature.description)}</p>` : ''}
                <ul>${(feature.items || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
              </article>`).join('')}
            </div>
          </section>
          <section class="event-modal-section"><h3>Расписание</h3><div class="event-days">${scheduleHtml(event.schedule)}</div></section>
          <section class="event-modal-section"><h3>Стоимость участия</h3>${pricesHtml(event.prices)}</section>
          <div class="event-detail-columns"><section class="event-modal-section"><h3>Что входит</h3><ul>${(event.included || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>
            <div class="event-meals"><h4>Питание по тарифам</h4><ul>${(event.meals || []).map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul></div>
          </section>
          <section class="event-modal-section"><h3>Можно оплатить дополнительно</h3><ul class="event-extras">${(event.extras || []).map((item) => `
            <li><strong>${escapeHtml(item.title)}</strong>${(item.lines || []).map((line) => `<span>${escapeHtml(line)}</span>`).join('')}</li>`).join('')}</ul>
          </section></div>
          <div class="event-modal-actions"><a class="btn btn-primary" href="#contacts" data-modal-close="${escapeHtml(modalId)}" data-modal-contact>Забронировать участие</a></div>
        </div></div>`;
      document.body.appendChild(modal);
    });
  };

  renderEvents();

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
    const scrollTop = window.scrollY;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');

    if (trigger instanceof HTMLElement) {
      if (!trigger.id) {
        trigger.id = `trigger-${Math.random().toString(36).slice(2, 10)}`;
      }
      modal.dataset.returnFocusId = trigger.id;
    }

    syncBodyState();
    // Horizontal scrolling can be introduced by focused/opened triggers inside
    // mobile carousels. Always pin the document back to the left edge.
    window.scrollTo(0, scrollTop);
    document.documentElement.scrollLeft = 0;
    document.body.scrollLeft = 0;
    modal.dispatchEvent(new CustomEvent('modal:open'));
  };

  const closeModalEl = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    syncBodyState();

    const returnFocusId = modal.dataset.returnFocusId;
    if (returnFocusId) {
      const returnFocusEl = document.getElementById(returnFocusId);
      const scrollTop = window.scrollY;

      try {
        returnFocusEl?.focus({ preventScroll: true });
      } catch {
        returnFocusEl?.focus();
      }

      // On mobile, returning focus to a trigger inside a horizontal scroller can
      // shift the whole page sideways. Force the viewport back to the page origin.
      window.scrollTo(0, scrollTop);
      document.documentElement.scrollLeft = 0;
      document.body.scrollLeft = 0;
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
    const href = brandLink.getAttribute('href') || '';
    if (href.startsWith('#')) {
      event.preventDefault();
      setMenu(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
    if (href === '#day-schedule') return;

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

  document.querySelectorAll('[data-consent-block]').forEach((block) => {
    const checkbox = block.querySelector('input[type="checkbox"]');
    const warning = block.querySelector('.privacy-consent-warning');
    const contactPanel = block.closest('.panel');
    const embeddedForm = contactPanel?.querySelector('.contact-form-embed');
    if (!checkbox || !warning) return;

    const hideConsentWarning = () => {
      block.classList.remove('is-warning');
      warning.hidden = true;
      checkbox.removeAttribute('aria-invalid');
    };

    const showConsentWarning = () => {
      block.classList.add('is-warning');
      warning.hidden = false;
      checkbox.setAttribute('aria-invalid', 'true');
    };

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        hideConsentWarning();
      }
    });

    checkbox.addEventListener('invalid', (event) => {
      event.preventDefault();
      showConsentWarning();
    });

    embeddedForm?.addEventListener('click', () => {
      if (!checkbox.checked) {
        showConsentWarning();
      }
    });

    window.addEventListener('blur', () => {
      if (!checkbox.checked && document.activeElement === embeddedForm?.querySelector('iframe')) {
        showConsentWarning();
      }
    });
  });

  const year = document.getElementById('year');
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  const photoModal = document.getElementById('photoModal');
  const modalImage = document.getElementById('modalImage');
  const photoModalMedia = photoModal?.querySelector('.photo-modal-media');
  const closePhotoButton = document.getElementById('closeModal');
  const tiles = Array.from(document.querySelectorAll('.tile'));
  const openFirstPhoto = document.getElementById('openFirstPhoto');
  const dayPhotoTrigger = document.querySelector('.js-open-day-photo');

  const openPhoto = (src, alt, trigger) => {
    if (!photoModal || !modalImage || !src) return;
    document.getElementById('day-schedule')?.classList.add('is-hidden');
    modalImage.src = src;
    modalImage.alt = alt || 'Фото лагеря';
    openModalEl(photoModal, trigger);
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

  dayPhotoTrigger?.addEventListener('click', () => {
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

  photoModalMedia?.addEventListener('click', (event) => {
    if (event.target === photoModalMedia) {
      closeModalEl(photoModal);
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
      if (openTrigger.matches('.event-card') && window.getSelection()?.toString().trim()) {
        return;
      }
      event.preventDefault();
      openModalById(openTrigger.getAttribute('data-modal'), openTrigger);
      return;
    }

    const closeTrigger = event.target.closest('[data-modal-close]');
    if (closeTrigger) {
      event.preventDefault();
      if (closeTrigger.matches('[data-consent-accept]')) {
        const consentCheckbox = document.getElementById('contact-privacy-consent');
        const consentBlock = consentCheckbox?.closest('[data-consent-block]');
        const consentWarning = consentBlock?.querySelector('.privacy-consent-warning');

        if (consentCheckbox) {
          consentCheckbox.checked = true;
          consentCheckbox.removeAttribute('aria-invalid');
          consentCheckbox.dispatchEvent(new Event('change', { bubbles: true }));
        }
        consentBlock?.classList.remove('is-warning');
        if (consentWarning) {
          consentWarning.hidden = true;
        }
      }
      closeModalById(closeTrigger.getAttribute('data-modal-close'));
      if (closeTrigger.matches('[data-modal-contact]')) {
        document.getElementById('contacts')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
      return;
    }

    const paymentTrigger = event.target.closest('.js-payment-instructions');
    if (paymentTrigger) {
      event.preventDefault();
      openModalById('paymentModal', paymentTrigger);
    }
  });

  document.addEventListener('keydown', (event) => {
    const eventCard = event.target.closest?.('.event-card[data-modal]');
    if (eventCard && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      openModalById(eventCard.getAttribute('data-modal'), eventCard);
      return;
    }
    if (event.key !== 'Escape') return;
    setMenu(false);
    closeAllModals();
  });

  requestAnimationFrame(updateAllScrollerHints);
});
