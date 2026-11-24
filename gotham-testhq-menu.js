/* Gotham Stage 4 — Test HQ navigation entry; no changes to existing game routes. */
(() => {
  'use strict';
  const ENTRY_ID = 'gotham-stage4-hq-entry';
  function addEntry() {
    if (document.getElementById(ENTRY_ID)) return true;
    const nav = document.querySelector('#app aside nav, #app nav, aside nav, nav');
    if (!nav) return false;
    const link = document.createElement('a');
    link.id = ENTRY_ID;
    link.href = './gotham-escape.html';
    link.textContent = '🦇 Batman Escape Room';
    link.title = 'Gotham Stage 4 · Batman detective console';
    link.style.cssText = 'display:block;box-sizing:border-box;width:100%;margin:5px 0;padding:11px 13px;border-radius:10px;color:inherit;text-decoration:none;font:inherit;font-weight:600;line-height:1.35;background:rgba(111,151,181,.12);border:1px solid rgba(153,176,193,.28)';
    link.addEventListener('mouseenter', () => link.style.background = 'rgba(111,151,181,.22)');
    link.addEventListener('mouseleave', () => link.style.background = 'rgba(111,151,181,.12)');
    const after = [...nav.querySelectorAll('button,a')].reverse().find(x => /gotham|batcomputer|escape room/i.test(x.textContent || ''));
    if (after) after.insertAdjacentElement('afterend', link);
    else nav.appendChild(link);
    return true;
  }
  function init() {
    addEntry();
    // Existing HQ menus may be rebuilt dynamically; restore the entry if needed.
    let scheduled = false;
    const obs = new MutationObserver(() => {
      if (document.getElementById(ENTRY_ID) || scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => { scheduled = false; addEntry(); });
    });
    obs.observe(document.documentElement, {childList:true,subtree:true});
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, {once:true});
  else init();
})();
