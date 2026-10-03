document.addEventListener('DOMContentLoaded', function () {
  // Guard: if the browser doesn't support IntersectionObserver,
  // do nothing — sections simply display normally, no animation.
  if (!('IntersectionObserver' in window)) return;

  var all = document.querySelectorAll('main > section');
  if (all.length < 2) return;

  // The first section (hero) is above the fold: it must show immediately.
  // Hiding it until the animation runs delays the Largest Contentful Paint.
  var sections = Array.prototype.slice.call(all, 1);

  // Only now do we mark sections as "reveal" (hidden pre-animation state).
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
