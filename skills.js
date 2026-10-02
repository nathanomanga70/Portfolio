/* skills.js — adds a search box that highlights matching skills.
   Without JavaScript, all skills remain visible as usual. */

(function () {
  'use strict';

  var chips = document.querySelectorAll('.chip');
  var anchor = document.querySelector('.skill-note');
  if (!chips.length || !anchor) return;

  /* ---------- Build the filter UI ---------- */
  var wrapper = document.createElement('div');
  wrapper.className = 'skill-filter';

  var label = document.createElement('label');
  label.setAttribute('for', 'skill-search');
  label.textContent = 'Find a skill';

  var input = document.createElement('input');
  input.type = 'search';
  input.id = 'skill-search';
  input.placeholder = 'e.g. NOTAM, METAR, Claude...';
  input.setAttribute('autocomplete', 'off');
  input.setAttribute('aria-describedby', 'skill-count');

  var count = document.createElement('p');
  count.className = 'filter-count';
  count.id = 'skill-count';
  count.setAttribute('role', 'status');
  count.setAttribute('aria-live', 'polite');

  wrapper.appendChild(label);
  wrapper.appendChild(input);
  wrapper.appendChild(count);
  anchor.parentNode.insertBefore(wrapper, anchor.nextSibling);

  /* ---------- Filtering ---------- */
  function normalize(text) {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function applyFilter() {
    var query = normalize(input.value);
    var matches = 0;

    chips.forEach(function (chip) {
      if (!query) {
        chip.classList.remove('dimmed', 'match');
        return;
      }
      var isMatch = normalize(chip.textContent).indexOf(query) !== -1;
      chip.classList.toggle('match', isMatch);
      chip.classList.toggle('dimmed', !isMatch);
      if (isMatch) matches++;
    });

    if (!query) {
      count.textContent = '';
    } else if (matches === 0) {
      count.textContent = 'No matching skill.';
    } else {
      count.textContent = matches + (matches === 1 ? ' skill found' : ' skills found');
    }
  }

  input.addEventListener('input', applyFilter);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      input.value = '';
      applyFilter();
    }
  });
})();
