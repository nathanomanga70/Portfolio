/* main.js — Nathan Omanga Ndjekondo portfolio
   Features: animated stat counters, back-to-top button, automatic footer year */

document.addEventListener('DOMContentLoaded', function () {
  initCounters();
  initBackToTop();
  initFooterYear();
});

/* 1. Animated counters for the stats section */
function initCounters() {
  var counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animate(el) {
    var target = parseInt(el.dataset.count, 10);
    if (isNaN(target)) return;

    if (reduceMotion) {
      el.textContent = target;
      return;
    }

    var duration = 1200;
    var start = performance.now();
    el.classList.add('counting');

    function step(now) {
      var progress = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.classList.remove('counting');
      }
    }
    requestAnimationFrame(step);
  }

  if (!('IntersectionObserver' in window)) {
    counters.forEach(function (el) { el.textContent = el.dataset.count; });
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animate(entry.target);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.6 });

  counters.forEach(function (el) {
    el.textContent = '0';
    observer.observe(el);
  });
}

/* 2. Back-to-top button */
function initBackToTop() {
  var btn = document.createElement('button');
  btn.className = 'back-to-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Back to top');
  btn.innerHTML = '&uarr;';
  document.body.appendChild(btn);

  function toggle() {
    btn.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', toggle, { passive: true });
  toggle();

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* 3. Automatic year in the footer */
function initFooterYear() {
  var footer = document.querySelector('footer');
  if (!footer) return;

  var year = new Date().getFullYear();
  var walker = document.createTreeWalker(footer, NodeFilter.SHOW_TEXT);
  var node;
  while ((node = walker.nextNode())) {
    if (/©\s*\d{4}/.test(node.nodeValue)) {
      node.nodeValue = node.nodeValue.replace(/©\s*\d{4}/, '© ' + year);
      break;
    }
  }
}
