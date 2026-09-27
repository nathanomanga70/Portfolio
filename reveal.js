document.addEventListener('DOMContentLoaded', function () {
  // Guard: if the browser doesn't support IntersectionObserver,
  // do nothing — sections simply display normally, no animation.
  if (!('IntersectionObserver' in window)) return;

  var sections = document.querySelectorAll('main > section');
  if (!sections.length) return;

  // Only now do we mark sections as "reveal" (hidden pre-animation state).
  // This avoids any flash of invisible content if this script were ever slow to run.
  sections.forEach(function (el) {
    el.classList.add('reveal');
  });

  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  sections.forEach(function (el) {
    observer.observe(el);
  });
});
