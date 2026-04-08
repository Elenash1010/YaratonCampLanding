export function initHeader() {
  const header = document.querySelector('header');
  const burger = document.getElementById('burger');
  const mobilePanel = document.getElementById('mobilePanel');
  const brandLink = document.querySelector('header .brand');

  if (!header || !burger || !mobilePanel) {
    return { setMenu: () => {} };
  }

  const onScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > 8);
  };

  const setMenu = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    mobilePanel.setAttribute('aria-hidden', String(!open));
    mobilePanel.style.display = open ? 'block' : 'none';
  };

  onScroll();
  setMenu(false);

  window.addEventListener('scroll', onScroll, { passive: true });

  burger.addEventListener('click', () => {
    const isOpen = burger.getAttribute('aria-expanded') === 'true';
    setMenu(!isOpen);
  });

  if (brandLink) {
    brandLink.addEventListener('click', (event) => {
      event.preventDefault();
      setMenu(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  mobilePanel.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      setMenu(false);
    }
  });

  return { setMenu };
}
