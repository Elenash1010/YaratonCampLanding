export function initExternalEmbeds() {
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
}
