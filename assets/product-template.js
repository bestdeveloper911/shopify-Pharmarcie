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
var scrollIntoView = __webpack_require__(643);
var scrollIntoView_default = /*#__PURE__*/__webpack_require__.n(scrollIntoView);
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
  scrollIntoView_default()(scrollToTopTarget);
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
;// CONCATENATED MODULE: ./src/js/modules/boost-sales-helper.js



class BoostSales {
  constructor() {
    _defineProperty(this, "selectors", {
      liveViews: ['.prod__live-views'],
      stockCountdowns: ['.prod__stock-countdown']
    });

    _defineProperty(this, "init", () => {
      try {
        this.domNodes = queryDomNodes(this.selectors);
        this.initLiveViews();
        this.initStockCountDown();
      } catch (error) {
        console.error("Failed to init Boost Sales Helper");
      }
    });

    _defineProperty(this, "initLiveViews", () => {
      var _this$domNodes, _this$domNodes$liveVi;

      (_this$domNodes = this.domNodes) === null || _this$domNodes === void 0 ? void 0 : (_this$domNodes$liveVi = _this$domNodes.liveViews) === null || _this$domNodes$liveVi === void 0 ? void 0 : _this$domNodes$liveVi.forEach(liveViews => {
        if (liveViews.dataset.initialized !== "true") {
          const liveViewElem = liveViews.querySelector('.live-views-text');
          const settings = liveViews.dataset;

          if (liveViewElem) {
            const lvtHTML = liveViewElem.innerHTML;
            liveViewElem.innerHTML = lvtHTML.replace(settings.liveViewsCurrent, `<span class="live-view-numb">${settings.liveViewsCurrent}</span>`);
            this.changeLiveViewsNumber(liveViewElem, settings);
          }

          liveViews.dataset.initialized = true;
        }
      });
    });

    _defineProperty(this, "changeLiveViewsNumber", (liveViewElem, settings) => {
      const numbElem = liveViewElem.querySelector('.live-view-numb');
      const {
        liveViewsDuration,
        liveViewsMax,
        liveViewsMin
      } = settings;
      const duration = Number(liveViewsDuration) || 5;
      const max = Number(liveViewsMax) || 30;
      const min = Number(liveViewsMin) || 20;

      if (numbElem) {
        setInterval(() => {
          const newViews = Math.floor(Math.random() * (max - min + 1)) + min;
          numbElem.textContent = newViews;
        }, duration * 1000);
      }
    });

    _defineProperty(this, "initStockCountDown", () => {
      var _this$domNodes2, _this$domNodes2$stock;

      (_this$domNodes2 = this.domNodes) === null || _this$domNodes2 === void 0 ? void 0 : (_this$domNodes2$stock = _this$domNodes2.stockCountdowns) === null || _this$domNodes2$stock === void 0 ? void 0 : _this$domNodes2$stock.forEach(stockCountdown => {
        if (stockCountdown.dataset.initialized !== "true") {
          const progress = stockCountdown.querySelector('.psc__progress');
          const width = progress.dataset.stockCountdownWidth;

          if (progress) {
            progress.style.width = "100%";
            setTimeout(() => {
              progress.style.width = width;
            }, 3000);
          }

          stockCountdown.dataset.initialized = true;
        }
      });
    });

    this.init();
  }

}

window.spratlyTheme = window.spratlyTheme || {};
window.spratlyTheme.BoostSales = new BoostSales();
;// CONCATENATED MODULE: ./src/js/modules/sticky-atc.js



class StickyATC {
  constructor() {
    _defineProperty(this, "selectors", {
      variantIdNode: '[name="id"]',
      prodTitle: '.psa__title',
      mainImage: '.spc__main-img',
      variantSelects: ['.sf-product-variant-option-dropdown']
    });

    _defineProperty(this, "observeTarget", null);

    _defineProperty(this, "variantIds", []);

    _defineProperty(this, "mainATCButton", void 0);

    _defineProperty(this, "init", () => {
      var _stickyATCBar$classLi, _stickyATCBar$classLi2;

      this.mainATCButton = document.querySelector('.sf-prod-template__desktop .sf__btn.add-to-cart');
      const stickyATCBar = document.querySelector('.prod__sticky-atc');
      if (!this.mainATCButton || !stickyATCBar || stickyATCBar !== null && stickyATCBar !== void 0 && (_stickyATCBar$classLi = stickyATCBar.classList) !== null && _stickyATCBar$classLi !== void 0 && _stickyATCBar$classLi.contains('initialized')) return;
      this.domNodes = queryDomNodes(this.selectors, stickyATCBar);
      const {
        prodTitle,
        mainImage,
        variantSelects
      } = this.domNodes;

      if (variantSelects && variantSelects[0] && variantSelects[0].options) {
        this.variantIds = [...variantSelects[0].options].map(opt => Number(opt.value));

        if (this.variantIds.length) {
          this.syncVariantWithMainProduct();
        }
      }

      const headerHeight = window.spratlyThemeSettings.headerHeight || 66;
      const rootMargin = `-${headerHeight}px 0px 0px 0px`;
      this.observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
          const method = entry.intersectionRatio != 1 ? 'remove' : 'add';
          stickyATCBar === null || stickyATCBar === void 0 ? void 0 : stickyATCBar.classList[method]('translate-y-full');
          document.documentElement.classList[entry.intersectionRatio != 1 ? 'add' : 'remove']('stick-atc-show');
        });
      }, {
        threshold: 1,
        rootMargin
      });
      prodTitle === null || prodTitle === void 0 ? void 0 : prodTitle.addEventListener("click", scrollToTop);
      mainImage === null || mainImage === void 0 ? void 0 : mainImage.addEventListener("click", scrollToTop);
      this.setObserveTarget();
      stickyATCBar === null || stickyATCBar === void 0 ? void 0 : (_stickyATCBar$classLi2 = stickyATCBar.classList) === null || _stickyATCBar$classLi2 === void 0 ? void 0 : _stickyATCBar$classLi2.add('initialized');
    });

    _defineProperty(this, "setObserveTarget", () => {
      this.observer.observe(this.mainATCButton);
      this.observeTarget = this.mainATCButton;
      document.body.style.paddingBottom = '76px';
    });

    _defineProperty(this, "syncVariantWithMainProduct", () => {
      var _window$spratlyTheme, _window$spratlyTheme$, _window$spratlyTheme$2, _window$spratlyTheme$3;

      const mainProductId = window.spratlyThemeSettings.productId;
      const stickyATCProductInstance = (_window$spratlyTheme = window.spratlyTheme) === null || _window$spratlyTheme === void 0 ? void 0 : (_window$spratlyTheme$ = _window$spratlyTheme.Products) === null || _window$spratlyTheme$ === void 0 ? void 0 : (_window$spratlyTheme$2 = _window$spratlyTheme$.productInstances) === null || _window$spratlyTheme$2 === void 0 ? void 0 : (_window$spratlyTheme$3 = _window$spratlyTheme$2.find) === null || _window$spratlyTheme$3 === void 0 ? void 0 : _window$spratlyTheme$3.call(_window$spratlyTheme$2, pro => {
        var _pro$productHelper;

        return (pro === null || pro === void 0 ? void 0 : (_pro$productHelper = pro.productHelper) === null || _pro$productHelper === void 0 ? void 0 : _pro$productHelper.view) === "sticky-atc";
      });

      if (mainProductId && stickyATCProductInstance) {
        var _window, _window$_ThemeEvent, _window$_ThemeEvent$s;

        const {
          variantSelects,
          variantIdNode
        } = this.domNodes;
        (_window = window) === null || _window === void 0 ? void 0 : (_window$_ThemeEvent = _window._ThemeEvent) === null || _window$_ThemeEvent === void 0 ? void 0 : (_window$_ThemeEvent$s = _window$_ThemeEvent.subscribe) === null || _window$_ThemeEvent$s === void 0 ? void 0 : _window$_ThemeEvent$s.call(_window$_ThemeEvent, `${mainProductId}__VARIANT_CHANGE`, async (variant, prodInst) => {
          if (variant && prodInst.productForm.classList.contains('main-product')) {
            stickyATCProductInstance.updateBySelectedVariant(variant);

            if (variantIdNode) {
              variantIdNode.setAttribute('value', String(variant === null || variant === void 0 ? void 0 : variant.id));
              variantIdNode.value = String(variant === null || variant === void 0 ? void 0 : variant.id);
            }

            variantSelects.forEach(select => select.selectedIndex = this.variantIds.indexOf(variant.id));
          }
        });
      }
    });

    this.init();
  }

}

window.spratlyTheme = window.spratlyTheme || {};
window.spratlyTheme.StickyATC = new StickyATC();
;// CONCATENATED MODULE: ./src/js/components/Modal.jsx
/* provided dependency */ var Modal_createElement = __webpack_require__(6295)["default"];
function Modal_Modal() {
  return Modal_createElement("div", {
    style: {
      '--tw-bg-opacity': '0.3'
    },
    className: `sf-modal sf-modal__wrapper fixed inset-0 px-5 bg-black flex items-center justify-center transition-opacity opacity-0 duration-200 ease-out`
  }, Modal_createElement("div", {
    className: "sf-modal__content bg-white relative rounded max-h-[90vh]"
  }, Modal_createElement("button", {
    className: "sf-modal__close text-black absolute p-2 bg-white hover:bg-gray-300 rounded-full z-10"
  }, Modal_createElement("svg", {
    className: "w-4 h-4",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
  }, Modal_createElement("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    d: "M6 18L18 6M6 6l12 12"
  }))), Modal_createElement("div", {
    className: "sf-modal__content-inner"
  })));
}
;// CONCATENATED MODULE: ./src/js/utilities/events.js
const events_addEventDelegate = ({
  context = document.documentElement,
  event = 'click',
  selector,
  handler
}) => {
  const listener = function (e) {
    // loop parent nodes from the target to the delegation node
    for (let target = e.target; target && target !== this; target = target.parentNode) {
      if (target.matches(selector)) {
        handler.call(target, e, target);
        break;
      }
    }
  };

  context.addEventListener(event, listener, false);
  return () => {
    context.removeEventListener(event, listener, false);
  };
};
class Event {
  constructor() {
    this.events = {};
  }

  get evts() {
    return Object.keys(this.events);
  }

  subscribe(event, handler) {
    this.events[event] = this.events[event] || [];
    this.events[event].push(handler);
    return () => this.unSubscribe(event, handler);
  }

  unSubscribe(event, handler) {
    const handlers = this.events[event];

    if (handlers && Array.isArray(handlers)) {
      for (let i = 0; i < handlers.length; i++) {
        if (handlers[i] === handler) {
          handlers.splice(i, 1);
          break;
        }
      }
    }
  }

  emit(event, ...args) {
    // console.groupCollapsed(`Theme Event: ${event}`);
    // console.trace();
    // console.groupEnd();
    (this.events[event] || []).forEach(handler => {
      handler(...args);
    });
  }

}
;// CONCATENATED MODULE: ./src/js/modules/modal.js
/* provided dependency */ var modal_createElement = __webpack_require__(6295)["default"];

// eslint-disable-next-line no-unused-vars

 // import ScrollLock from '@utils/scroll-lock'

class Modal {
  constructor() {
    var _this$modal, _this$modal2;

    _defineProperty(this, "init", () => {
      events_addEventDelegate({
        selector: '.sf-modal__wrapper',
        handler: e => {
          var _e$target;

          if ((e === null || e === void 0 ? void 0 : e.target) === this.modal || e !== null && e !== void 0 && (_e$target = e.target) !== null && _e$target !== void 0 && _e$target.closest('.sf-modal__close')) {
            this.close(e);
          }
        }
      });
    });

    _defineProperty(this, "setSizes", (sizes = '') => {
      this.resetSize();
      this.sizes = sizes;
      sizes.split(" ").forEach(size => {
        var _this$modalContent, _this$modalContent$cl;

        (_this$modalContent = this.modalContent) === null || _this$modalContent === void 0 ? void 0 : (_this$modalContent$cl = _this$modalContent.classList) === null || _this$modalContent$cl === void 0 ? void 0 : _this$modalContent$cl.add(size);
      });
    });

    _defineProperty(this, "setWidth", width => {
      this.modalContent.style.width = width;
    });

    _defineProperty(this, "resetSize", () => {
      if (this.sizes) {
        this.sizes.split(" ").forEach(size => {
          var _this$modalContent2, _this$modalContent2$c;

          (_this$modalContent2 = this.modalContent) === null || _this$modalContent2 === void 0 ? void 0 : (_this$modalContent2$c = _this$modalContent2.classList) === null || _this$modalContent2$c === void 0 ? void 0 : _this$modalContent2$c.remove(size);
        });
        this.sizes = '';
      }
    });

    _defineProperty(this, "appendChild", child => {
      var _this$modalContentInn;

      this === null || this === void 0 ? void 0 : (_this$modalContentInn = this.modalContentInner) === null || _this$modalContentInn === void 0 ? void 0 : _this$modalContentInn.appendChild(child);
      this.children = child;
    });

    _defineProperty(this, "removeChild", () => {
      var _this$children;

      this === null || this === void 0 ? void 0 : (_this$children = this.children) === null || _this$children === void 0 ? void 0 : _this$children.remove();
    });

    _defineProperty(this, "open", () => {
      // this.scrollLock.enable()
      document.documentElement.classList.add('prevent-scroll');
      document.body.appendChild(this.modal);
      setTimeout(() => this.modal.classList.add('opacity-100'));
      window.addEventListener("keydown", this.handleKeyDown);
    });

    _defineProperty(this, "close", e => {
      e === null || e === void 0 ? void 0 : e.preventDefault();
      this.modal.classList.remove('opacity-100'); // this.scrollLock.disable()

      window.removeEventListener("keydown", this.handleKeyDown);
      setTimeout(() => {
        this.modal.remove();
        this.removeChild();
        this.resetSize();
        this.modalContent.style.removeProperty('width');
        document.documentElement.classList.remove('prevent-scroll');
      }, this.transitionDuration);
    });

    _defineProperty(this, "handleKeyDown", e => {
      // ESC
      if (e.keyCode === 27) {
        this.close();
      }
    });

    this.modal = modal_createElement(Modal_Modal, null);
    this.modalContent = (_this$modal = this.modal) === null || _this$modal === void 0 ? void 0 : _this$modal.firstChild;
    this.modalContentInner = (_this$modal2 = this.modal) === null || _this$modal2 === void 0 ? void 0 : _this$modal2.querySelector('.sf-modal__content-inner');
    this.transitionDuration = 200;
    this.init(); // this.scrollLock = new ScrollLock(document.body)
  }

}

/* harmony default export */ var modal = (Modal);
;// CONCATENATED MODULE: ./src/js/components/Notification.jsx
/* provided dependency */ var Notification_createElement = __webpack_require__(6295)["default"];
/* harmony default export */ function components_Notification({
  type,
  message,
  onclick
}) {
  let icon;

  if (type === 'warning') {
    icon = Notification_createElement("svg", {
      class: "w-6 h-6",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, Notification_createElement("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    }));
  } else if (type === 'success') {
    icon = Notification_createElement("svg", {
      class: "w-6 h-6",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, Notification_createElement("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    }));
  }

  return Notification_createElement("div", {
    className: `notification ${type}`,
    onclick: onclick
  }, icon, Notification_createElement("div", {
    className: "ml-3 text-sm md:text-base"
  }, message));
}
;// CONCATENATED MODULE: ./src/js/modules/notification.js
/* provided dependency */ var notification_createElement = __webpack_require__(6295)["default"];

// eslint-disable-next-line no-unused-vars


class Notification {
  constructor() {
    _defineProperty(this, "noti", null);

    _defineProperty(this, "removeTimeoutId", null);

    _defineProperty(this, "hideTimeoutId", null);

    _defineProperty(this, "transitionDuration", 300);

    _defineProperty(this, "show", ({
      target,
      type,
      message,
      method = 'after',
      last = 3000
    }) => {
      this.clearTimeout();
      this.removeNoti();
      this.noti = notification_createElement(components_Notification, {
        type: type,
        message: message,
        onclick: this.handleClick
      });
      target === null || target === void 0 ? void 0 : target[method](this.noti);
      setTimeout(() => {
        this.noti.classList.add('show');
      }, 50);
      this.hideTimeoutId = setTimeout(() => {
        this.noti.classList.add('hide');
        this.removeTimeoutId = setTimeout(this.removeNoti, this.transitionDuration * 2);
      }, last);
    });

    _defineProperty(this, "handleClick", () => {
      clearTimeout(this.removeTimeoutId);
      this.noti.classList.add('hide');
      setTimeout(this.removeNoti, this.transitionDuration * 2);
    });

    _defineProperty(this, "clearTimeout", () => {
      clearTimeout(this.removeTimeoutId);
      clearTimeout(this.hideTimeoutId);
    });

    _defineProperty(this, "removeNoti", () => {
      var _this$noti;

      this === null || this === void 0 ? void 0 : (_this$noti = this.noti) === null || _this$noti === void 0 ? void 0 : _this$noti.remove();
    });
  }

}

/* harmony default export */ var notification = (new Notification());
;// CONCATENATED MODULE: ./src/js/modules/contact-form-ask.js





class ContactFormAsk {
  constructor() {
    _defineProperty(this, "init", () => {
      this.showSuccessMessage();
      events_addEventDelegate({
        selector: '.form-ask__button',
        handler: e => {
          e.preventDefault();
          this.modal.appendChild(this.container);
          this.modal.setWidth('500px');
          this.modal.setSizes('max-w-[90vw]');
          this.container.classList.remove('hidden');
          this.modal.open();
        }
      });
    });

    _defineProperty(this, "showSuccessMessage", () => {
      const successMessage = this.container.querySelector('.form-ask__success');

      if (successMessage) {
        const notiBlock = document.querySelector('.form-ask__success-block');
        const target = window.innerWidth < 768 ? successMessage : notiBlock;

        if (window.innerWidth < 768) {
          document.body.appendChild(successMessage);
        }

        setTimeout(() => {
          notification.show({
            target,
            method: 'appendChild',
            type: 'success',
            message: successMessage.dataset.message
          });
        }, 2000);
      }
    });

    this.container = document.querySelector('.form-ask__wrapper');
    if (!this.container) return;
    this.init();
    this.modal = new modal();
  }

}

new ContactFormAsk();
;// CONCATENATED MODULE: ./src/js/modules/sharing.js
/* provided dependency */ var sharing_createElement = __webpack_require__(6295)["default"];

// eslint-disable-next-line no-unused-vars




class Sharing {
  constructor() {
    _defineProperty(this, "selectors", {
      shareContent: '.sf-sharing',
      openBtn: '[data-open-share]'
    });

    _defineProperty(this, "init", () => {
      this.domNodes.openBtn.classList.remove('hidden');
      this.modal = new modal();
      events_addEventDelegate({
        selector: this.selectors.openBtn,
        handler: e => {
          e.preventDefault();

          if (this.shareContent) {
            const html = sharing_createElement("div", null);
            html.innerHTML = this.shareContent;
            this.modal.appendChild(html);
            this.modal.setSizes('bg-white sf-sharing');
            this.modal.open();
          }
        }
      });
    });

    this.domNodes = queryDomNodes(this.selectors);
    const {
      shareContent
    } = this.domNodes;

    if (shareContent && shareContent.innerHTML) {
      this.shareContent = shareContent.innerHTML;
      this.init();
    }
  }

}

window.spratlyTheme = window.spratlyTheme || {};
window.spratlyTheme.Sharing = new Sharing();
;// CONCATENATED MODULE: ./src/js/pages/product-template.js





}();
/******/ })()
;