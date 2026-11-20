'use strict';
const tabs = [...document.querySelectorAll('[role="tab"]')];
function activateTab(tab, focus = false) {
  tabs.forEach(item => {
    const active = item === tab;
    item.setAttribute('aria-selected', String(active));
    item.tabIndex = active ? 0 : -1;
    document.getElementById(item.getAttribute('aria-controls')).hidden = !active;
  });
  if (focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
  });
});
const dialog = document.querySelector('.capture-dialog');
if (dialog && typeof dialog.showModal === 'function') {
  const image = dialog.querySelector('img');
  document.querySelectorAll('.capture-panel a, .platform-preview').forEach(link => {
    link.addEventListener('click', event => {
      if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      image.src = link.href;
      image.alt = link.querySelector('img')?.alt || link.getAttribute('aria-label');
      dialog.showModal();
    });
  });
  dialog.querySelector('button').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
}
fetch('release.json', { cache: 'no-cache' }).then(response => {
  if (!response.ok) throw new Error('Release metadata unavailable');
  return response.json();
}).then(release => {
  const url = new URL(release.downloadUrl);
  if (url.origin !== 'https://github.com' || !url.pathname.startsWith('/marottejm/asistente-android/releases/download/')) return;
  document.querySelectorAll('.apk-link').forEach(link => link.href = url.href);
  document.querySelectorAll('[data-version]').forEach(element => element.textContent = `Versión ${release.version}`);
  document.querySelectorAll('[data-size]').forEach(element => element.textContent = `${Math.round(release.size / 1024 / 1024)} MiB`);
}).catch(() => { /* The verified release remains available as a normal HTML link. */ });
