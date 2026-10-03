/* portfolio.js — click-to-zoom lightbox for the capstone output figure.
   Without JavaScript the image displays normally. */

(function () {
  'use strict';

  var img = document.querySelector('.figure-img');
  if (!img || typeof HTMLDialogElement === 'undefined') return;

  /* Wrap the image in a button so it is keyboard accessible */
  var trigger = document.createElement('button');
  trigger.type = 'button';
  trigger.className = 'figure-btn';
  trigger.setAttribute('aria-label', 'Enlarge image: ' + (img.alt || 'figure'));
  img.parentNode.insertBefore(trigger, img);
  trigger.appendChild(img);

  /* Build the dialog once */
  var dialog = document.createElement('dialog');
  dialog.className = 'lightbox';
  dialog.setAttribute('aria-label', img.alt || 'Enlarged image');

  var closeBtn = document.createElement('button');
  closeBtn.type = 'button';
  closeBtn.className = 'lightbox-close';
  closeBtn.textContent = 'Close';

  var big = document.createElement('img');
  big.className = 'lightbox-img';
  big.alt = img.alt || '';

  dialog.appendChild(closeBtn);
  dialog.appendChild(big);
  document.body.appendChild(dialog);

  function open() {
    big.src = img.currentSrc || img.src;
    dialog.showModal();
  }

  function close() {
    dialog.close();
  }

  trigger.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  /* Click on the image or on the dark backdrop closes the lightbox */
  dialog.addEventListener('click', function (e) {
    if (e.target === dialog || e.target === big) close();
  });

  /* Free the large image when closed */
  dialog.addEventListener('close', function () {
    big.removeAttribute('src');
  });
})();
