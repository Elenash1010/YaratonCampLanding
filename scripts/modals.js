export function initModals({ setMenu }) {
  const modals = Array.from(document.querySelectorAll('.modal'));
  const body = document.body;

  const syncBodyState = () => {
    if (document.querySelector('.modal.is-open')) {
      body.setAttribute('data-modal-open', '1');
    } else {
      body.removeAttribute('data-modal-open');
    }
  };

  const openModalEl = (modal, trigger = null) => {
    if (!modal) return;
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.dataset.returnFocusId = '';

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

  modals.forEach((modal) => {
    closeModalEl(modal);

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

  return {
    openModalEl,
    closeModalEl,
    openModalById,
    closeModalById,
    closeAllModals,
  };
}
