'use strict';
const tabs = [...document.querySelectorAll('[role="tab"]')];
const demoLayout = window.matchMedia('(min-width: 801px)');
function updateTabOrientation() {
  document.querySelector('.demo-tabs').setAttribute('aria-orientation', demoLayout.matches ? 'vertical' : 'horizontal');
}
updateTabOrientation();
demoLayout.addEventListener('change', updateTabOrientation);

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
    if (event.key === (demoLayout.matches ? 'ArrowDown' : 'ArrowRight')) next = (index + 1) % tabs.length;
    if (event.key === (demoLayout.matches ? 'ArrowUp' : 'ArrowLeft')) next = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    if (next !== undefined) { event.preventDefault(); activateTab(tabs[next], true); }
  });
});
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
