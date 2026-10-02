/* contact.js — contact form: validation, character counter, Formspree submit */

(function () {
  'use strict';

  var MESSAGE_MAX = 1000;
  var MESSAGE_MIN = 10;

  var form = document.getElementById('contact-form');
  if (!form) return;

  var statusEl = document.getElementById('form-status');
  var submitBtn = form.querySelector('button[type="submit"]');
  var fields = {
    name: document.getElementById('name'),
    email: document.getElementById('email'),
    message: document.getElementById('message')
  };
  var counter = document.getElementById('char-count');

  /* ---------- Validation rules ---------- */
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  function validateField(key) {
    var value = fields[key].value.trim();

    if (key === 'name') {
      if (!value) return 'Please enter your name.';
      if (value.length < 2) return 'Name is too short.';
    }
    if (key === 'email') {
      if (!value) return 'Please enter your email address.';
      if (!EMAIL_RE.test(value)) return 'Please enter a valid email address.';
    }
    if (key === 'message') {
      if (!value) return 'Please write a message.';
      if (value.length < MESSAGE_MIN) {
        return 'Message must be at least ' + MESSAGE_MIN + ' characters.';
      }
    }
    return '';
  }

  function showFieldState(key) {
    var input = fields[key];
    var errorEl = document.getElementById(key + '-error');
    var message = validateField(key);

    input.classList.toggle('invalid', Boolean(message));
    input.classList.toggle('valid', !message && input.value.trim() !== '');
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (errorEl) errorEl.textContent = message;

    return !message;
  }

  /* ---------- Live feedback ---------- */
  Object.keys(fields).forEach(function (key) {
    fields[key].addEventListener('blur', function () {
      showFieldState(key);
    });
    fields[key].addEventListener('input', function () {
      if (fields[key].classList.contains('invalid')) showFieldState(key);
    });
  });

  /* ---------- Character counter ---------- */
  function updateCounter() {
    if (!counter) return;
    var length = fields.message.value.length;
    counter.textContent = length + ' / ' + MESSAGE_MAX;
    counter.classList.toggle('near-limit', length > MESSAGE_MAX * 0.9);
  }
  fields.message.addEventListener('input', updateCounter);
  updateCounter();

  /* ---------- Status message ---------- */
  function setStatus(text, type) {
    statusEl.textContent = text;
    statusEl.className = type || '';
  }

  function setSending(isSending) {
    submitBtn.disabled = isSending;
    submitBtn.textContent = isSending ? 'Sending...' : 'Send Message';
  }

  /* ---------- Submit ---------- */
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    setStatus('', '');

    var allValid = true;
    var firstInvalid = null;
    Object.keys(fields).forEach(function (key) {
      var ok = showFieldState(key);
      if (!ok && !firstInvalid) firstInvalid = fields[key];
      allValid = allValid && ok;
    });

    if (!allValid) {
      setStatus('Please fix the highlighted fields.', 'error');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    setSending(true);

    fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    })
      .then(function (response) {
        if (response.ok) {
          setStatus("Message sent — thank you, I'll get back to you soon.", 'success');
          form.reset();
          Object.keys(fields).forEach(function (key) {
            fields[key].classList.remove('valid', 'invalid');
            fields[key].removeAttribute('aria-invalid');
          });
          updateCounter();
        } else {
          setStatus('Something went wrong. Please try again or email me directly.', 'error');
        }
      })
      .catch(function () {
        setStatus('Something went wrong. Please try again or email me directly.', 'error');
      })
      .then(function () {
        setSending(false);
      });
  });
})();
