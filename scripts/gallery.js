export function initGallery(modalApi) {
  const modal = document.getElementById('photoModal');
  const modalImage = document.getElementById('modalImage');
  const closeButton = document.getElementById('closeModal');
  const tiles = Array.from(document.querySelectorAll('.tile'));
  const openFirstPhoto = document.getElementById('openFirstPhoto');

  if (!modal || !modalImage || !closeButton || tiles.length === 0) {
    return;
  }

  const openPhoto = (src, alt, trigger) => {
    if (!src) return;
    modalImage.src = src;
    modalImage.alt = alt || 'Фото лагеря';
    modalApi.openModalEl(modal, trigger);
    closeButton.focus();
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

  modal.addEventListener('modal:close', () => {
    modalImage.removeAttribute('src');
    modalImage.alt = '';
  });
}
