/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 6295:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var mdn_polyfills_Node_prototype_append_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(2422);
/* harmony import */ var mdn_polyfills_Node_prototype_append_js__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(mdn_polyfills_Node_prototype_append_js__WEBPACK_IMPORTED_MODULE_0__);


class JSX {
  constructor() {
    this.component = this.component.bind(this);
    return this.component;
  }

  component(tagName, attrs, ...children) {
    if (typeof tagName === 'function') {
      // Override children
      return tagName({ ...attrs,
        children
      });
    }

    if (children) {
      children = children.filter(val => val !== null);
    }

    if (attrs) {
      if (attrs.class) {
        attrs.className = attrs.class;
      }

      delete attrs.children;
    } // Normal DOM node tagName


    function createWithAttrs(tagName, attrs) {
      attrs = attrs || {};
      let elem = document.createElement(tagName);

      try {
        elem = Object.assign(elem, attrs);
      } catch {
        const attrKeys = Object.keys(attrs);

        for (let i = 0; i < attrKeys.length; i++) {
          if (attrs[i] !== 'dataSet') {
            elem.setAttribute(attrKeys[i], attrs[attrKeys[i]]);
          }
        }
      }

      return elem;
    }

    let elem = tagName !== 'fragment' ? createWithAttrs(tagName, attrs) : document.createDocumentFragment(); // Evaluate SVG DOM node tagName
    // All svg inner tags: https://developer.mozilla.org/en-US/docs/Web/SVG/Element

    const svgInnerTags = ['svg', 'path', 'rect', 'text', 'circle', 'g'];

    if (svgInnerTags.indexOf(tagName) !== -1) {
      elem = document.createElementNS('http://www.w3.org/2000/svg', tagName);

      for (const key in attrs) {
        const attrName = key === 'className' ? 'class' : key;
        elem.setAttribute(attrName, attrs[key]);
      }
    } // Populate children to created DOM Node


    for (const child of children) {
      if (Array.isArray(child)) {
        elem.append(...child);
      } else {
        elem.append(child);
      }
    } // After elements are created


    if (attrs !== null && attrs !== void 0 && attrs.dataSet) {
      for (const key in attrs.dataSet) {
        if (Object.prototype.hasOwnProperty.call(attrs.dataSet, key)) {
          elem.dataset[key] = attrs.dataSet[key];
        }
      }
    }

    if (attrs && !window.__aleartedJSXData) {
      if (Object.keys(attrs).find(key => key.match(/^data-/))) {
        console.trace(`Your "${tagName}" component uses a data-* attribute! Use dataSet instead!!`);
        alert('Do not use data-* in your JSX component! Use dataSet instead!! - Check the console.trace for more info');
        window.__aleartedJSXData = true;
      }
    }

    if (attrs !== null && attrs !== void 0 && attrs.ref) {
      // Create a custom reference to DOM node
      if (typeof attrs.ref === 'function') {
        attrs.ref(elem);
      } else {
        attrs.ref = elem;
      }
    }

    if (attrs !== null && attrs !== void 0 && attrs.on) {
      Object.entries(attrs.on).forEach(([event, handler]) => {
        elem.addEventListener(event, handler);
      });
    } // Append style attributes to created DOM node


    if (attrs !== null && attrs !== void 0 && attrs.style) {
      Object.entries(attrs.style).forEach(([property, value]) => {
        elem.style.setProperty(property, value);
      }); // Object.assign(elem.style, attrs.style);
    }

    return elem;
  }

}

/* harmony default export */ __webpack_exports__["default"] = (new JSX());

/***/ }),

/***/ 2422:
/***/ (function() {

!function () {
  function t() {
    var e = Array.prototype.slice.call(arguments),
        n = document.createDocumentFragment();
    e.forEach(function (e) {
      var t = e instanceof Node;
      n.appendChild(t ? e : document.createTextNode(String(e)));
    }), this.appendChild(n);
  }

  [Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(function (e) {
    e.hasOwnProperty("append") || Object.defineProperty(e, "append", {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: t
    });
  });
}();

/***/ }),

/***/ 643:
/***/ (function(module) {

var COMPLETE = 'complete',
    CANCELED = 'canceled';

function raf(task) {
  if ('requestAnimationFrame' in window) {
    return window.requestAnimationFrame(task);
  }

  setTimeout(task, 16);
}

function setElementScroll(element, x, y) {
  Math.max(0, x);
  Math.max(0, y);

  if (element.self === element) {
    element.scrollTo(x, y);
  } else {
    element.scrollLeft = x;
    element.scrollTop = y;
  }
}

function getTargetScrollLocation(scrollSettings, parent) {
  var align = scrollSettings.align,
      target = scrollSettings.target,
      targetPosition = target.getBoundingClientRect(),
      parentPosition,
      x,
      y,
      differenceX,
      differenceY,
      targetWidth,
      targetHeight,
      leftAlign = align && align.left != null ? align.left : 0.5,
      topAlign = align && align.top != null ? align.top : 0.5,
      leftOffset = align && align.leftOffset != null ? align.leftOffset : 0,
      topOffset = align && align.topOffset != null ? align.topOffset : 0,
      leftScalar = leftAlign,
      topScalar = topAlign;

  if (scrollSettings.isWindow(parent)) {
    targetWidth = Math.min(targetPosition.width, parent.innerWidth);
    targetHeight = Math.min(targetPosition.height, parent.innerHeight);
    x = targetPosition.left + parent.pageXOffset - parent.innerWidth * leftScalar + targetWidth * leftScalar;
    y = targetPosition.top + parent.pageYOffset - parent.innerHeight * topScalar + targetHeight * topScalar;
    x -= leftOffset;
    y -= topOffset;
    x = scrollSettings.align.lockX ? parent.pageXOffset : x;
    y = scrollSettings.align.lockY ? parent.pageYOffset : y;
    differenceX = x - parent.pageXOffset;
    differenceY = y - parent.pageYOffset;
  } else {
    targetWidth = targetPosition.width;
    targetHeight = targetPosition.height;
    parentPosition = parent.getBoundingClientRect();
    var offsetLeft = targetPosition.left - (parentPosition.left - parent.scrollLeft);
    var offsetTop = targetPosition.top - (parentPosition.top - parent.scrollTop);
    x = offsetLeft + targetWidth * leftScalar - parent.clientWidth * leftScalar;
    y = offsetTop + targetHeight * topScalar - parent.clientHeight * topScalar;
    x -= leftOffset;
    y -= topOffset;
    x = Math.max(Math.min(x, parent.scrollWidth - parent.clientWidth), 0);
    y = Math.max(Math.min(y, parent.scrollHeight - parent.clientHeight), 0);
    x = scrollSettings.align.lockX ? parent.scrollLeft : x;
    y = scrollSettings.align.lockY ? parent.scrollTop : y;
    differenceX = x - parent.scrollLeft;
    differenceY = y - parent.scrollTop;
  }

  return {
    x: x,
    y: y,
    differenceX: differenceX,
    differenceY: differenceY
  };
}

function animate(parent) {
  var scrollSettings = parent._scrollSettings;

  if (!scrollSettings) {
    return;
  }

  var maxSynchronousAlignments = scrollSettings.maxSynchronousAlignments;
  var location = getTargetScrollLocation(scrollSettings, parent),
      time = Date.now() - scrollSettings.startTime,
      timeValue = Math.min(1 / scrollSettings.time * time, 1);

  if (scrollSettings.endIterations >= maxSynchronousAlignments) {
    setElementScroll(parent, location.x, location.y);
    parent._scrollSettings = null;
    return scrollSettings.end(COMPLETE);
  }

  var easeValue = 1 - scrollSettings.ease(timeValue);
  setElementScroll(parent, location.x - location.differenceX * easeValue, location.y - location.differenceY * easeValue);

  if (time >= scrollSettings.time) {
    scrollSettings.endIterations++; // Align ancestor synchronously

    scrollSettings.scrollAncestor && animate(scrollSettings.scrollAncestor);
    animate(parent);
    return;
  }

  raf(animate.bind(null, parent));
}

function defaultIsWindow(target) {
  return target.self === target;
}

function transitionScrollTo(target, parent, settings, scrollAncestor, callback) {
  var idle = !parent._scrollSettings,
      lastSettings = parent._scrollSettings,
      now = Date.now(),
      cancelHandler,
      passiveOptions = {
    passive: true
  };

  if (lastSettings) {
    lastSettings.end(CANCELED);
  }

  function end(endType) {
    parent._scrollSettings = null;

    if (parent.parentElement && parent.parentElement._scrollSettings) {
      parent.parentElement._scrollSettings.end(endType);
    }

    if (settings.debug) {
      console.log('Scrolling ended with type', endType, 'for', parent);
    }

    callback(endType);

    if (cancelHandler) {
      parent.removeEventListener('touchstart', cancelHandler, passiveOptions);
      parent.removeEventListener('wheel', cancelHandler, passiveOptions);
    }
  }

  var maxSynchronousAlignments = settings.maxSynchronousAlignments;

  if (maxSynchronousAlignments == null) {
    maxSynchronousAlignments = 3;
  }

  parent._scrollSettings = {
    startTime: now,
    endIterations: 0,
    target: target,
    time: settings.time,
    ease: settings.ease,
    align: settings.align,
    isWindow: settings.isWindow || defaultIsWindow,
    maxSynchronousAlignments: maxSynchronousAlignments,
    end: end,
    scrollAncestor
  };

  if (!('cancellable' in settings) || settings.cancellable) {
    cancelHandler = end.bind(null, CANCELED);
    parent.addEventListener('touchstart', cancelHandler, passiveOptions);
    parent.addEventListener('wheel', cancelHandler, passiveOptions);
  }

  if (idle) {
    animate(parent);
  }

  return cancelHandler;
}

function defaultIsScrollable(element) {
  return 'pageXOffset' in element || (element.scrollHeight !== element.clientHeight || element.scrollWidth !== element.clientWidth) && getComputedStyle(element).overflow !== 'hidden';
}

function defaultValidTarget() {
  return true;
}

function findParentElement(el) {
  if (el.assignedSlot) {
    return findParentElement(el.assignedSlot);
  }

  if (el.parentElement) {
    if (el.parentElement.tagName === 'BODY') {
      return el.parentElement.ownerDocument.defaultView || el.parentElement.ownerDocument.ownerWindow;
    }

    return el.parentElement;
  }

  if (el.getRootNode) {
    var parent = el.getRootNode();

    if (parent.nodeType === 11) {
      return parent.host;
    }
  }
}

module.exports = function (target, settings, callback) {
  if (!target) {
    return;
  }

  if (typeof settings === 'function') {
    callback = settings;
    settings = null;
  }

  if (!settings) {
    settings = {};
  }

  settings.time = isNaN(settings.time) ? 1000 : settings.time;

  settings.ease = settings.ease || function (v) {
    return 1 - Math.pow(1 - v, v / 2);
  };

  settings.align = settings.align || {};
  var parent = findParentElement(target),
      parents = 1;

  function done(endType) {
    parents--;

    if (!parents) {
      callback && callback(endType);
    }
  }

  var validTarget = settings.validTarget || defaultValidTarget;
  var isScrollable = settings.isScrollable;

  if (settings.debug) {
    console.log('About to scroll to', target);

    if (!parent) {
      console.error('Target did not have a parent, is it mounted in the DOM?');
    }
  }

  var scrollingElements = [];

  while (parent) {
    if (settings.debug) {
      console.log('Scrolling parent node', parent);
    }

    if (validTarget(parent, parents) && (isScrollable ? isScrollable(parent, defaultIsScrollable) : defaultIsScrollable(parent))) {
      parents++;
      scrollingElements.push(parent);
    }

    parent = findParentElement(parent);

    if (!parent) {
      done(COMPLETE);
      break;
    }
  }

  return scrollingElements.reduce((cancel, parent, index) => transitionScrollTo(target, parent, settings, scrollingElements[index + 1], done), null);
};

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	!function() {
/******/ 		// getDefaultExport function for compatibility with non-harmony modules
/******/ 		__webpack_require__.n = function(module) {
/******/ 			var getter = module && module.__esModule ?
/******/ 				function() { return module['default']; } :
/******/ 				function() { return module; };
/******/ 			__webpack_require__.d(getter, { a: getter });
/******/ 			return getter;
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	!function() {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = function(exports, definition) {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	!function() {
/******/ 		__webpack_require__.o = function(obj, prop) { return Object.prototype.hasOwnProperty.call(obj, prop); }
/******/ 	}();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
!function() {
"use strict";

;// CONCATENATED MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}
// EXTERNAL MODULE: ./node_modules/scroll-into-view/scrollIntoView.js
var scroll_into_view_scrollIntoView = __webpack_require__(643);
;// CONCATENATED MODULE: ./src/js/utilities/index.js
/* provided dependency */ var createElement = __webpack_require__(6295)["default"];






window.__getSectionInstanceByType = type => window.Shopify.theme.sections.instances.find(inst => inst.type === type);

function productFormCheck(form) {
  const fieldsSelector = '[name][required]:not([hidden]):not([type="hidden"])';
  const fields = form.querySelectorAll(fieldsSelector);
  const missing = [];
  fields.forEach(field => {
    if (field.required && !['hidden'].includes(field.type)) {
      if (field.type === 'radio') {
        let hasValue = false;
        const fName = field.name;
        form.querySelectorAll(`input[name="${fName}"]`).forEach(v => {
          if (v.value) {
            hasValue = true;
          }
        });

        if (!hasValue) {
          missing.push(field);
        }
      } else if (!field.value) {
        missing.push(field);
      }
    }
  });
  return missing;
}
function queryDomNodes(selectors = {}, context = document) {
  const domNodes = Object.entries(selectors).reduce((acc, [name, selector]) => {
    var _context$queryMethod;

    const findOne = typeof selector === 'string';
    const queryMethod = findOne ? 'querySelector' : 'querySelectorAll';
    const sl = findOne ? selector : selector[0];
    acc[name] = context === null || context === void 0 ? void 0 : (_context$queryMethod = context[queryMethod]) === null || _context$queryMethod === void 0 ? void 0 : _context$queryMethod.call(context, sl);

    if (!findOne && acc[name]) {
      acc[name] = [...acc[name]];
    }

    return acc;
  }, {});
  return domNodes;
}
const camelCaseToSnakeCase = str => str.replace(/[A-Z]/g, $1 => `_${$1.toLowerCase()}`);
function animateReplace(oldNode, newNode) {
  if (!oldNode || !newNode) {
    return;
  }

  oldNode.classList.add('ar__old-node');
  newNode.classList.add('ar__new-node');
  oldNode.style.opacity = 0;
  oldNode.replaceWith(newNode);
  setTimeout(() => newNode.style.opacity = 1);
}
function createSearchLink(query) {
  const searchParams = new URLSearchParams({
    type: 'product',
    ['options[unavailable_products]']: 'last',
    ['options[prefix]']: 'last',
    q: query
  });
  return `${PredictiveSearch.SEARCH_PATH}?${searchParams.toString()}`;
}
function isInViewport(elem) {
  const rect = elem.getBoundingClientRect(); // NOTE: not accuracy in all cases but we only need this

  return rect.top > 0 && rect.top < (window.innerHeight || document.documentElement.clientHeight);
}

function loadStyles() {
  const {
    themeStyleURLs = {}
  } = window;
  Object.values(themeStyleURLs).forEach(style => {
    const {
      url,
      required,
      afterWindowLoaded
    } = style;

    if (url && required) {
      var _window;

      if (!afterWindowLoaded || (_window = window) !== null && _window !== void 0 && _window.__sfWindowLoaded) {
        loadCSS(url);
      } else {
        window.addEventListener("load", () => loadCSS(url));
      }
    }
  });
}

function loadScripts() {
  const {
    themeScriptURLs = {}
  } = window;
  Object.values(themeScriptURLs).forEach(script => {
    const {
      url,
      required,
      afterWindowLoaded
    } = script;

    if (url && required) {
      var _window2;

      if (!afterWindowLoaded || (_window2 = window) !== null && _window2 !== void 0 && _window2.__sfWindowLoaded) {
        loadJS(url);
      } else {
        window.addEventListener("load", () => loadJS(url));
      }
    }
  });
}

function addCustomerFormHandlers() {
  addEventDelegate({
    selector: '.sf-customer__forms',
    handler: (e, form) => {
      if (e.target.classList.contains('sf-customer__reset-password-btn')) {
        form.classList.add('show-recover-password-form');
        return;
      }

      if (e.target.classList.contains('sf-customer__cancel-reset')) {
        form.classList.remove('show-recover-password-form');
        return;
      }
    }
  });

  if (document.querySelector('.sf-customer__recover-form-posted')) {
    var _document$querySelect, _document$querySelect2;

    (_document$querySelect = document.querySelector('.sf-customer__forms')) === null || _document$querySelect === void 0 ? void 0 : (_document$querySelect2 = _document$querySelect.classList) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.add('show-recover-password-form');
  }
}

function getVideoURL(id, host) {
  if (host === 'youtube') {
    return `https://www.youtube.com/watch?v=${id}&gl=true`;
  }

  if (host === 'vimeo') {
    return `https://vimeo.com/${id}`;
  }

  return '';
}

function showCookieConsent() {
  const {
    show_cookie_consent
  } = window.adminThemeSettings;
  const cookieAccepted = getCookie('cookieconsent_status');

  if (show_cookie_consent && !cookieAccepted) {
    var _window3, _window3$themeStyleUR, _window3$themeStyleUR2, _window4, _window4$themeScriptU, _window4$themeScriptU2;

    loadCSS((_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$themeStyleUR = _window3.themeStyleURLs) === null || _window3$themeStyleUR === void 0 ? void 0 : (_window3$themeStyleUR2 = _window3$themeStyleUR.cookieConsent) === null || _window3$themeStyleUR2 === void 0 ? void 0 : _window3$themeStyleUR2.url);
    loadJS((_window4 = window) === null || _window4 === void 0 ? void 0 : (_window4$themeScriptU = _window4.themeScriptURLs) === null || _window4$themeScriptU === void 0 ? void 0 : (_window4$themeScriptU2 = _window4$themeScriptU.cookieConsent) === null || _window4$themeScriptU2 === void 0 ? void 0 : _window4$themeScriptU2.url);
  }
}

const scrollToTopTarget = document.querySelector('#scroll-to-top-target');
function scrollToTop() {
  scrollIntoView(scrollToTopTarget);
}

function initScrollTop() {
  const scrollTopButton = document.querySelector('#scroll-to-top-button');

  if (scrollTopButton) {
    scrollTopButton.addEventListener('click', scrollToTop);
    window.addEventListener('scroll', function () {
      const method = window.scrollY > 100 ? 'add' : 'remove';
      scrollTopButton.classList[method]('opacity-100');
    });
  }
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  var expires = 'expires=' + d.toUTCString();
  document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/';
}
function getCookie(cname) {
  var name = cname + '=';
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return '';
}
function addRecentViewedProduct(handle) {
  let max = 20;
  const saveKey = 'sf-recent-viewed-products';
  const products = getCookie(saveKey) ? JSON.parse(getCookie(saveKey)) : [];
  if (handle && !products.includes(handle)) products.push(handle);
  setCookie(saveKey, JSON.stringify(products.filter((x, i) => {
    return i <= max - 1;
  })));
}
const generateDomFromString = value => {
  const d = createElement("div", null);
  d.innerHTML = value;
  return d;
};
function emailIsValid(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function updateParam(key, value) {
  var {
    location
  } = window;
  var baseUrl = [location.protocol, '//', location.host, location.pathname].join('');
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has(key)) {
    if (value !== '' && value !== 'undefined') {
      urlParams.set(key, value);
    }

    if (value === '' || value === 'undefined') {
      urlParams.delete(key);
    }
  } else {
    if (value) urlParams.append(key, value);
  }

  window.history.replaceState({}, "", baseUrl + '?' + urlParams.toString());
  return false;
}
function getParams() {
  let params = {};
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  for (const entry of urlParams.entries()) {
    params[entry[0]] = entry[1];
  }

  return params;
}
function runHelpers() {
  try {
    loadScripts();
    loadStyles(); ////////////////////

    showCookieConsent();
    initLocalization();
    addCustomerFormHandlers();
    initScrollTop();
  } catch (err) {
    console.error('Failed to run helpers.', err);
  }
}
;// CONCATENATED MODULE: ./src/js/utilities/debounce.js
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
;// CONCATENATED MODULE: ./src/js/utilities/fetch.js
const requestDefaultConfigs = {
  mode: 'same-origin',
  credentials: 'same-origin',
  headers: {
    'X-Requested-With': 'XMLHttpRequest',
    'Content-Type': 'application/json'
  }
};
function getRequestDefaultConfigs() {
  return JSON.parse(JSON.stringify(requestDefaultConfigs));
}
const fetchJSON = (url, config = requestDefaultConfigs) => {
  return fetch(url, config).then(function (response) {
    if (!response.ok) {
      throw response;
    }

    return response.json();
  });
};
const sFetch = (url, config = requestDefaultConfigs) => {
  return fetch(url, config);
};
const cache = new Map();
const fetchCache = (url, config = requestDefaultConfigs) => {
  return new Promise((resolve, reject) => {
    if (cache.get(url)) {
      return resolve(cache.get(url));
    }

    fetch(url, config).then(res => {
      const text = res.text();
      resolve(text);
      cache.set(url, text);
      return text;
    }).catch(reject);
  });
};
const cache2 = new Map();
const fetchJsonCache = (url, config = requestDefaultConfigs) => {
  return new Promise((resolve, reject) => {
    if (cache2.get(url)) {
      return resolve(cache2.get(url));
    }

    fetch(url, config).then(res => {
      const json = res.json();
      resolve(json);
      cache2.set(url, json);
      return json;
    }).catch(reject);
  });
};
;// CONCATENATED MODULE: ./src/js/utilities/load-assets.js
function load_assets_loadJS(src, target = document.body, async = true, defer = false) {
  return new Promise((resolve, reject) => {
    const doc = target.ownerDocument;
    const currScript = doc.querySelector(`script[src="${src}"]`);

    if (currScript) {
      if (currScript.dataset.loaded) return resolve(true);
      currScript.addEventListener("load", () => {
        currScript.dataset.loaded = true;
        resolve(true);
      });
      return;
    }

    const script = doc.createElement('script');
    script.src = src;
    script.async = async;
    script.defer = defer;
    script.addEventListener("load", () => {
      // console.groupCollapsed('%c ===> Script loaded: ', '#f7a046', (src.match(/.*\/(.+\.js)/) || [])[1]);
      // console.trace();
      // console.groupEnd();
      script.dataset.loaded = true;
      resolve(true);
    });
    script.onerror = reject;
    target.appendChild(script);
  });
}
function load_assets_loadCSS(href, target = document.head) {
  return new Promise((resolve, reject) => {
    const doc = target.ownerDocument;
    const currLink = doc.querySelector(`link[href="${href}"]`);

    if (currLink) {
      if (currLink.dataset.loaded) return resolve(true);
      currLink.addEventListener("load", () => {
        currLink.dataset.loaded = true;
        resolve(true);
      });
      return;
    }

    const link = doc.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.addEventListener("load", () => {
      // console.groupCollapsed('%c ===> Style loaded: ', '#f7a046', (href.match(/.*\/(.+\.css)/) || [])[1])
      // console.trace();
      // console.groupEnd();
      link.dataset.loaded = true;
      resolve(true);
    });
    link.onerror = reject;
    target.appendChild(link);
  });
}
function loadAsset(url) {
  if (url.match(/.*\.js$/)) {}
}
;// CONCATENATED MODULE: ./src/js/utilities/section.js


function initSlider({
  container,
  pagination,
  items = 4,
  slidesPerView = 2,
  slidesPerGroup = 2,
  loop = false,
  showPagination = false,
  showNavigation = false,
  autoplay = false,
  speed = 300
}) {
  if (!container) return;
  const sliderContainer = container.querySelector('.swiper-container');
  if (!sliderContainer) return;
  const controlsContainer = container.querySelector('.sf-slider__controls');
  const prevButton = controlsContainer && controlsContainer.querySelector('.sf-slider__controls-prev');
  const nextButton = controlsContainer && controlsContainer.querySelector('.sf-slider__controls-next');
  const lgItems = items > 4 ? items - 1 : items;
  const mdItems = items > 4 ? items - 2 : items;
  const slideItemsLength = sliderContainer.querySelector('.swiper-wrapper').childElementCount;
  let slider;
  if (showPagination) sliderContainer.classList.add('swiper-container-show-pagination');
  if (showNavigation) sliderContainer.classList.add('swiper-container-show-nav');

  const _initSlider = () => {
    var _window;

    load_assets_loadCSS((_window = window) === null || _window === void 0 ? void 0 : _window.themeStyleURLs.swiper.url).then(() => {
      var _window2;

      load_assets_loadJS((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.themeScriptURLs.swiper.url).then(() => {
        slider = new window.spratlyTheme.Swiper(sliderContainer, {
          init: false,
          autoplay: autoplay ? {
            delay: 4000,
            disableOnInteraction: true
          } : false,
          slidesPerView: slidesPerView,
          slidesPerGroup: slidesPerGroup || slidesPerView,
          loop: loop,
          touchRatio: 1.5,
          speed: speed,
          pagination: showPagination ? pagination || {
            el: container.querySelector('.swiper-pagination'),
            clickable: true
          } : false,
          breakpoints: {
            280: {
              slidesPerView: slidesPerView,
              slidesPerGroup: slidesPerView
            },
            768: {
              slidesPerView: 3,
              slidesPerGroup: 2
            },
            992: {
              slidesPerView: mdItems,
              slidesPerGroup: slidesPerGroup || mdItems
            },
            1200: {
              slidesPerView: lgItems,
              slidesPerGroup: slidesPerGroup || lgItems
            },
            1366: {
              slidesPerView: items,
              slidesPerGroup: slidesPerGroup || items
            }
          },
          on: {
            breakpoint: (swiper, breakpointParams) => {
              controlsContainer && handleControls(swiper, breakpointParams);
            },
            slideChange: swiper => {
              const {
                isBeginning,
                isEnd
              } = swiper;
              if (!loop && prevButton) prevButton.disabled = isBeginning;
              if (!loop && nextButton) nextButton.disabled = isEnd;
            }
          }
        });
        slider.on('init', () => {
          // Update prod form ids
          const forms = container.querySelectorAll('.swiper-slide form.shopify-product-form');
          forms.length && [...forms].forEach((form, ind) => {
            form.setAttribute('id', `${form.getAttribute('id')}__${ind}`);
          });
          setTimeout(() => {
            // Calculate controls position
            const firstItem = container.querySelector('.sf-image');

            if (firstItem && controlsContainer) {
              const itemHeight = firstItem.clientHeight;
              controlsContainer.style.setProperty('--offset-top', parseInt(itemHeight) / 2 + 'px');
            }
          }, 200); // Attach events for custom controls

          if (slider && showNavigation) {
            prevButton && prevButton.addEventListener('click', () => slider.slidePrev());
            nextButton && nextButton.addEventListener('click', () => slider.slideNext());
          }

          if (!loop && prevButton) prevButton.disabled = true;
        }); // Init swiper

        slider.init();
      });
    });
  };

  if (isInViewport(container)) {
    _initSlider();
  } else {
    if (window.__sfWindowLoaded) _initSlider();else window.addEventListener("load", _initSlider);
  }

  const handleControls = (swiper, breakpointParams) => {
    const {
      slidesPerView
    } = breakpointParams;

    if (slideItemsLength > slidesPerView) {
      controlsContainer.classList.remove('hidden');
      slider.allowTouchMove = true;
    } else {
      controlsContainer.classList.add('hidden');
      slider.allowTouchMove = false;
    }
  };
}
;// CONCATENATED MODULE: ./src/js/modules/product-recommendations.js
/* provided dependency */ var product_recommendations_createElement = __webpack_require__(6295)["default"];







class ProductRecommendation {
  constructor(container, productHandles) {
    _defineProperty(this, "selectors", {
      productList: '[data-product-list]',
      gridContainer: '[data-grid-container]'
    });

    _defineProperty(this, "productNodes", {});

    _defineProperty(this, "productHandles", void 0);

    _defineProperty(this, "swiper", void 0);

    _defineProperty(this, "currentScreen", '');

    _defineProperty(this, "initByScreenSize", () => {
      const {
        productList,
        gridContainer
      } = this.domNodes;
      const {
        enableSlider,
        items
      } = this.options;
      const screen = window.innerWidth > 767 ? 'desktop' : 'mobile';
      if (screen === this.currentScreen) return;
      this.currentScreen = screen;

      if (screen === 'desktop') {
        var _this$productHandles;

        gridContainer.classList.remove('sf__ms');
        productList.classList.remove('sf__ms-wrapper');

        if (enableSlider === "true" && ((_this$productHandles = this.productHandles) === null || _this$productHandles === void 0 ? void 0 : _this$productHandles.length) > Number(items)) {
          if (this.swiper) this.swiper.init();else {
            gridContainer.classList.add('swiper-container');
            initSlider({
              container: this.container,
              items: parseInt(items),
              showNavigation: true
            });
            this.swiper = gridContainer.swiper;
          }
        }
      } else {
        if (this.swiper) this.swiper.destroy(false, true);
        gridContainer.classList.remove('swiper-container');
        gridContainer.classList.add('sf__ms');
        productList.classList.add('sf__ms-wrapper');
      }
    });

    _defineProperty(this, "initProductCountdown", () => {
      var _window, _window$themeScriptUR, _window$themeScriptUR2;

      load_assets_loadJS((_window = window) === null || _window === void 0 ? void 0 : (_window$themeScriptUR = _window.themeScriptURLs) === null || _window$themeScriptUR === void 0 ? void 0 : (_window$themeScriptUR2 = _window$themeScriptUR.countdown) === null || _window$themeScriptUR2 === void 0 ? void 0 : _window$themeScriptUR2.url).then(() => {
        var _window2, _window2$spratlyTheme, _window2$spratlyTheme2, _window2$spratlyTheme3;

        (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$spratlyTheme = _window2.spratlyTheme) === null || _window2$spratlyTheme === void 0 ? void 0 : (_window2$spratlyTheme2 = _window2$spratlyTheme.ProductCountdown) === null || _window2$spratlyTheme2 === void 0 ? void 0 : (_window2$spratlyTheme3 = _window2$spratlyTheme2.init) === null || _window2$spratlyTheme3 === void 0 ? void 0 : _window2$spratlyTheme3.call(_window2$spratlyTheme2);
      });
    });

    this.container = container;
    if (productHandles) this.productHandles = productHandles;
    this.init().catch(console.error);
  }

  async init() {
    var _this$productHandles2;

    if (!this.container || this.container.classList.contains('initialized')) return;
    this.options = this.container.dataset;

    if (this.options.enableSlider) {
      var _window3, _window4;

      load_assets_loadCSS((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.themeStyleURLs.swiper.url);
      load_assets_loadJS((_window4 = window) === null || _window4 === void 0 ? void 0 : _window4.themeScriptURLs.swiper.url);
    }

    this.domNodes = queryDomNodes(this.selectors, this.container);

    if (!this.productHandles) {
      const {
        baseUrl,
        productId,
        limit
      } = this.options;
      const res = await fetchJSON(`${baseUrl}.json?product_id=${productId}&limit=${limit}`);
      const {
        products
      } = res || {};
      this.productHandles = products.map(({
        handle
      }) => handle);
    }

    if ((_this$productHandles2 = this.productHandles) !== null && _this$productHandles2 !== void 0 && _this$productHandles2.length) {
      var _window$spratlyTheme, _window$spratlyTheme$;

      const promises = this.productHandles.map(async handle => {
        const prodHTML = await fetchCache(`/products/${handle}?view=grid-card-item`);
        const item = product_recommendations_createElement("div", {
          className: "swiper-slide"
        });
        item.innerHTML = prodHTML;

        if (item.querySelector('[data-view="card"]')) {
          this.productNodes[handle] = item;
        }
      });
      await Promise.all(promises);
      this.productHandles.forEach(handle => {
        const prod = this.productNodes[handle];

        if (prod) {
          this.domNodes.productList.appendChild(prod);
        }
      });
      (_window$spratlyTheme = window.spratlyTheme) === null || _window$spratlyTheme === void 0 ? void 0 : (_window$spratlyTheme$ = _window$spratlyTheme.Products) === null || _window$spratlyTheme$ === void 0 ? void 0 : _window$spratlyTheme$.initProductForms({
        context: this.container
      }).then(() => {
        var _window5, _window5$spratlyTheme, _window5$spratlyTheme2, _window6, _window6$spratlyTheme, _window6$spratlyTheme2, _this$container, _this$container$class;

        this.initByScreenSize();
        window.addEventListener('resize', debounce(this.initByScreenSize));
        (_window5 = window) === null || _window5 === void 0 ? void 0 : (_window5$spratlyTheme = _window5.spratlyTheme) === null || _window5$spratlyTheme === void 0 ? void 0 : (_window5$spratlyTheme2 = _window5$spratlyTheme.CompareProduct) === null || _window5$spratlyTheme2 === void 0 ? void 0 : _window5$spratlyTheme2.setCompareButtonsState();
        (_window6 = window) === null || _window6 === void 0 ? void 0 : (_window6$spratlyTheme = _window6.spratlyTheme) === null || _window6$spratlyTheme === void 0 ? void 0 : (_window6$spratlyTheme2 = _window6$spratlyTheme.Wishlist) === null || _window6$spratlyTheme2 === void 0 ? void 0 : _window6$spratlyTheme2.setWishlistButtonsState();
        (_this$container = this.container) === null || _this$container === void 0 ? void 0 : (_this$container$class = _this$container.classList) === null || _this$container$class === void 0 ? void 0 : _this$container$class.remove('hidden');
        this.container.classList.add('opacity-100', 'initialized');
      }).catch(console.error);
    }
  }

}

window.spratlyTheme = window.spratlyTheme || {};
window.spratlyTheme.ProductRecommendation = ProductRecommendation;
}();
/******/ })()
;