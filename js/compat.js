(function () {
  'use strict';

  if (!Number.isFinite) {
    Number.isFinite = function (value) { return typeof value === 'number' && isFinite(value); };
  }
  if (!Math.log10) {
    Math.log10 = function (value) { return Math.log(value) / Math.LN10; };
  }
  if (!String.prototype.startsWith) {
    String.prototype.startsWith = function (search, pos) {
      var start = pos > 0 ? pos | 0 : 0;
      return this.substring(start, start + search.length) === search;
    };
  }
  if (!Object.values) {
    Object.values = function (obj) { return Object.keys(obj).map(function (key) { return obj[key]; }); };
  }
  if (!Object.entries) {
    Object.entries = function (obj) { return Object.keys(obj).map(function (key) { return [key, obj[key]]; }); };
  }
  if (typeof window.CustomEvent !== 'function') {
    window.CustomEvent = function (event, params) {
      params = params || { bubbles: false, cancelable: false, detail: null };
      var evt = document.createEvent('CustomEvent');
      evt.initCustomEvent(event, params.bubbles, params.cancelable, params.detail);
      return evt;
    };
  }
  window.requestAnimationFrame = window.requestAnimationFrame || function (callback) {
    return window.setTimeout(function () { callback(Date.now()); }, 16);
  };
  window.cancelAnimationFrame = window.cancelAnimationFrame || window.clearTimeout;

  function showRuntimeError(message) {
    var box = document.getElementById('runtimeError');
    var detail = document.getElementById('runtimeErrorDetail');
    if (!box) return;
    if (detail && message) detail.textContent = message;
    box.hidden = false;
  }

  window.addEventListener('error', function (event) {
    var target = event && event.target;
    if (target && (target.tagName === 'SCRIPT' || target.tagName === 'LINK')) {
      showRuntimeError('A required local asset failed to load. Keep index.html, css/, js/, assets/, and data/ together.');
      return;
    }
    if (event && event.message) showRuntimeError('Runtime error: ' + event.message);
  }, true);

  window.addEventListener('unhandledrejection', function () {
    showRuntimeError('A browser feature failed during initialization. Try the current Chrome, Edge, Firefox, or Safari release.');
  });
})();
