/* about.js — collapses the long bio on mobile with a "Read more" toggle.
   Without JavaScript, the full bio is always visible. */

(function () {
  'use strict';

  var aboutText = document.querySelector('.about-text');
  var extras = document.querySelectorAll('.about-text .bio-extra');
  if (!aboutText || !extras.length) return;

  var ctaRow = aboutText.querySelector('.about-cta-row');
  var mobileQuery = window.matchMedia('(max-width: 640px)');

  /* Create the toggle button */
  var btn = document.createElement('button');
  btn.type = 'button';
  btn.className = 'read-more-btn';
  btn.setAttribute('aria-expanded', 'false');
  btn.textContent = 'Read more';

  if (ctaRow) {
    aboutText.insertBefore(btn, ctaRow);
  } else {
    aboutText.appendChild(btn);
  }

  function setExpanded(expanded) {
    aboutText.classList.toggle('collapsed', !expanded);
    btn.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    btn.textContent = expanded ? 'Read less' : 'Read more';
  }

  /* Collapse on mobile, show everything on larger screens */
  function applyLayout() {
    if (mobileQuery.matches) {
      setExpanded(false);
    } else {
      aboutText.classList.remove('collapsed');
    }
  }

  btn.addEventListener('click', function () {
    var willExpand = aboutText.classList.contains('collapsed');
    setExpanded(willExpand);
    if (!willExpand) {
      aboutText.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });

  if (mobileQuery.addEventListener) {
    mobileQuery.addEventListener('change', applyLayout);
  } else if (mobileQuery.addListener) {
    mobileQuery.addListener(applyLayout);
  }

  applyLayout();
})();
