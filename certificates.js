/* certificates.js — category filter for the certificate cards.
   Without JavaScript, all certificates remain visible. */

(function () {
  'use strict';

  var grid = document.querySelector('.cert-grid');
  var cards = document.querySelectorAll('.cert-card[data-category]');
  if (!grid || !cards.length) return;

  var LABELS = {
    all: 'All',
    aviation: 'Aviation',
    ai: 'AI',
    academic: 'Academic'
  };
  var ORDER = ['all', 'aviation', 'ai', 'academic'];

  /* Which categories actually exist on the page */
  var present = { all: true };
  cards.forEach(function (card) {
    present[card.dataset.category] = true;
  });

  /* ---------- Build the filter bar ---------- */
  var bar = document.createElement('div');
  bar.className = 'cert-filters';
  bar.setAttribute('role', 'group');
  bar.setAttribute('aria-label', 'Filter certificates by category');

  var status = document.createElement('p');
  status.className = 'cert-filter-count';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  var buttons = [];

  ORDER.forEach(function (key) {
    if (!present[key]) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'cert-filter-btn';
    btn.dataset.filter = key;
    btn.textContent = LABELS[key];
    btn.setAttribute('aria-pressed', key === 'all' ? 'true' : 'false');
    btn.addEventListener('click', function () {
      applyFilter(key);
    });
    bar.appendChild(btn);
    buttons.push(btn);
  });

  grid.parentNode.insertBefore(bar, grid);
  grid.parentNode.insertBefore(status, grid);

  /* ---------- Filtering ---------- */
  function applyFilter(key) {
    var shown = 0;

    cards.forEach(function (card) {
      var match = key === 'all' || card.dataset.category === key;
      card.hidden = !match;
      if (match) shown++;
    });

    buttons.forEach(function (btn) {
      btn.setAttribute('aria-pressed', btn.dataset.filter === key ? 'true' : 'false');
    });

    if (key === 'all') {
      status.textContent = '';
    } else {
      status.textContent = shown + (shown === 1 ? ' certificate' : ' certificates') +
        ' in ' + LABELS[key];
    }
  }
})();
