/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 7066:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;
/**
 * Copyright Marc J. Schmidt. See the LICENSE file at the top-level
 * directory of this distribution and at
 * https://github.com/marcj/css-element-queries/blob/master/LICENSE.
 */

(function (root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) :
		__WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
})(typeof window !== 'undefined' ? window : this, function () {
  // Make sure it does not throw in a SSR (Server Side Rendering) situation
  if (typeof window === "undefined") {
    return null;
  } // https://github.com/Semantic-Org/Semantic-UI/issues/3855
  // https://github.com/marcj/css-element-queries/issues/257


  var globalWindow = typeof window != 'undefined' && window.Math == Math ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')(); // Only used for the dirty checking, so the event callback count is limited to max 1 call per fps per sensor.
  // In combination with the event based resize sensor this saves cpu time, because the sensor is too fast and
  // would generate too many unnecessary events.

  var requestAnimationFrame = globalWindow.requestAnimationFrame || globalWindow.mozRequestAnimationFrame || globalWindow.webkitRequestAnimationFrame || function (fn) {
    return globalWindow.setTimeout(fn, 20);
  };

  var cancelAnimationFrame = globalWindow.cancelAnimationFrame || globalWindow.mozCancelAnimationFrame || globalWindow.webkitCancelAnimationFrame || function (timer) {
    globalWindow.clearTimeout(timer);
  };
  /**
   * Iterate over each of the provided element(s).
   *
   * @param {HTMLElement|HTMLElement[]} elements
   * @param {Function}                  callback
   */


  function forEachElement(elements, callback) {
    var elementsType = Object.prototype.toString.call(elements);
    var isCollectionTyped = '[object Array]' === elementsType || '[object NodeList]' === elementsType || '[object HTMLCollection]' === elementsType || '[object Object]' === elementsType || 'undefined' !== typeof jQuery && elements instanceof jQuery //jquery
    || 'undefined' !== typeof Elements && elements instanceof Elements //mootools
    ;
    var i = 0,
        j = elements.length;

    if (isCollectionTyped) {
      for (; i < j; i++) {
        callback(elements[i]);
      }
    } else {
      callback(elements);
    }
  }
  /**
   * Get element size
   * @param {HTMLElement} element
   * @returns {Object} {width, height}
   */


  function getElementSize(element) {
    if (!element.getBoundingClientRect) {
      return {
        width: element.offsetWidth,
        height: element.offsetHeight
      };
    }

    var rect = element.getBoundingClientRect();
    return {
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    };
  }
  /**
   * Apply CSS styles to element.
   *
   * @param {HTMLElement} element
   * @param {Object} style
   */


  function setStyle(element, style) {
    Object.keys(style).forEach(function (key) {
      element.style[key] = style[key];
    });
  }
  /**
   * Class for dimension change detection.
   *
   * @param {Element|Element[]|Elements|jQuery} element
   * @param {Function} callback
   *
   * @constructor
   */


  var ResizeSensor = function (element, callback) {
    //Is used when checking in reset() only for invisible elements
    var lastAnimationFrameForInvisibleCheck = 0;
    /**
     *
     * @constructor
     */

    function EventQueue() {
      var q = [];

      this.add = function (ev) {
        q.push(ev);
      };

      var i, j;

      this.call = function (sizeInfo) {
        for (i = 0, j = q.length; i < j; i++) {
          q[i].call(this, sizeInfo);
        }
      };

      this.remove = function (ev) {
        var newQueue = [];

        for (i = 0, j = q.length; i < j; i++) {
          if (q[i] !== ev) newQueue.push(q[i]);
        }

        q = newQueue;
      };

      this.length = function () {
        return q.length;
      };
    }
    /**
     *
     * @param {HTMLElement} element
     * @param {Function}    resized
     */


    function attachResizeEvent(element, resized) {
      if (!element) return;

      if (element.resizedAttached) {
        element.resizedAttached.add(resized);
        return;
      }

      element.resizedAttached = new EventQueue();
      element.resizedAttached.add(resized);
      element.resizeSensor = document.createElement('div');
      element.resizeSensor.dir = 'ltr';
      element.resizeSensor.className = 'resize-sensor';
      var style = {
        pointerEvents: 'none',
        position: 'absolute',
        left: '0px',
        top: '0px',
        right: '0px',
        bottom: '0px',
        overflow: 'hidden',
        zIndex: '-1',
        visibility: 'hidden',
        maxWidth: '100%'
      };
      var styleChild = {
        position: 'absolute',
        left: '0px',
        top: '0px',
        transition: '0s'
      };
      setStyle(element.resizeSensor, style);
      var expand = document.createElement('div');
      expand.className = 'resize-sensor-expand';
      setStyle(expand, style);
      var expandChild = document.createElement('div');
      setStyle(expandChild, styleChild);
      expand.appendChild(expandChild);
      var shrink = document.createElement('div');
      shrink.className = 'resize-sensor-shrink';
      setStyle(shrink, style);
      var shrinkChild = document.createElement('div');
      setStyle(shrinkChild, styleChild);
      setStyle(shrinkChild, {
        width: '200%',
        height: '200%'
      });
      shrink.appendChild(shrinkChild);
      element.resizeSensor.appendChild(expand);
      element.resizeSensor.appendChild(shrink);
      element.appendChild(element.resizeSensor);
      var computedStyle = window.getComputedStyle(element);
      var position = computedStyle ? computedStyle.getPropertyValue('position') : null;

      if ('absolute' !== position && 'relative' !== position && 'fixed' !== position && 'sticky' !== position) {
        element.style.position = 'relative';
      }

      var dirty = false; //last request animation frame id used in onscroll event

      var rafId = 0;
      var size = getElementSize(element);
      var lastWidth = 0;
      var lastHeight = 0;
      var initialHiddenCheck = true;
      lastAnimationFrameForInvisibleCheck = 0;

      var resetExpandShrink = function () {
        var width = element.offsetWidth;
        var height = element.offsetHeight;
        expandChild.style.width = width + 10 + 'px';
        expandChild.style.height = height + 10 + 'px';
        expand.scrollLeft = width + 10;
        expand.scrollTop = height + 10;
        shrink.scrollLeft = width + 10;
        shrink.scrollTop = height + 10;
      };

      var reset = function () {
        // Check if element is hidden
        if (initialHiddenCheck) {
          var invisible = element.offsetWidth === 0 && element.offsetHeight === 0;

          if (invisible) {
            // Check in next frame
            if (!lastAnimationFrameForInvisibleCheck) {
              lastAnimationFrameForInvisibleCheck = requestAnimationFrame(function () {
                lastAnimationFrameForInvisibleCheck = 0;
                reset();
              });
            }

            return;
          } else {
            // Stop checking
            initialHiddenCheck = false;
          }
        }

        resetExpandShrink();
      };

      element.resizeSensor.resetSensor = reset;

      var onResized = function () {
        rafId = 0;
        if (!dirty) return;
        lastWidth = size.width;
        lastHeight = size.height;

        if (element.resizedAttached) {
          element.resizedAttached.call(size);
        }
      };

      var onScroll = function () {
        size = getElementSize(element);
        dirty = size.width !== lastWidth || size.height !== lastHeight;

        if (dirty && !rafId) {
          rafId = requestAnimationFrame(onResized);
        }

        reset();
      };

      var addEvent = function (el, name, cb) {
        if (el.attachEvent) {
          el.attachEvent('on' + name, cb);
        } else {
          el.addEventListener(name, cb);
        }
      };

      addEvent(expand, 'scroll', onScroll);
      addEvent(shrink, 'scroll', onScroll); // Fix for custom Elements and invisible elements

      lastAnimationFrameForInvisibleCheck = requestAnimationFrame(function () {
        lastAnimationFrameForInvisibleCheck = 0;
        reset();
      });
    }

    forEachElement(element, function (elem) {
      attachResizeEvent(elem, callback);
    });

    this.detach = function (ev) {
      // clean up the unfinished animation frame to prevent a potential endless requestAnimationFrame of reset
      if (lastAnimationFrameForInvisibleCheck) {
        cancelAnimationFrame(lastAnimationFrameForInvisibleCheck);
        lastAnimationFrameForInvisibleCheck = 0;
      }

      ResizeSensor.detach(element, ev);
    };

    this.reset = function () {
      //To prevent invoking element.resizeSensor.resetSensor if it's undefined
      if (element.resizeSensor.resetSensor) {
        element.resizeSensor.resetSensor();
      }
    };
  };

  ResizeSensor.reset = function (element) {
    forEachElement(element, function (elem) {
      //To prevent invoking element.resizeSensor.resetSensor if it's undefined
      if (element.resizeSensor.resetSensor) {
        elem.resizeSensor.resetSensor();
      }
    });
  };

  ResizeSensor.detach = function (element, ev) {
    forEachElement(element, function (elem) {
      if (!elem) return;

      if (elem.resizedAttached && typeof ev === "function") {
        elem.resizedAttached.remove(ev);
        if (elem.resizedAttached.length()) return;
      }

      if (elem.resizeSensor) {
        if (elem.contains(elem.resizeSensor)) {
          elem.removeChild(elem.resizeSensor);
        }

        delete elem.resizeSensor;
        delete elem.resizedAttached;
      }
    });
  };

  if (typeof MutationObserver !== "undefined") {
    var observer = new MutationObserver(function (mutations) {
      for (var i in mutations) {
        if (mutations.hasOwnProperty(i)) {
          var items = mutations[i].addedNodes;

          for (var j = 0; j < items.length; j++) {
            if (items[j].resizeSensor) {
              ResizeSensor.reset(items[j]);
            }
          }
        }
      }
    });
    document.addEventListener("DOMContentLoaded", function (event) {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
    });
  }

  return ResizeSensor;
});

/***/ }),

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

/***/ 6662:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "getRequestDefaultConfigs": function() { return /* binding */ getRequestDefaultConfigs; },
/* harmony export */   "fetchJSON": function() { return /* binding */ fetchJSON; },
/* harmony export */   "sFetch": function() { return /* binding */ sFetch; },
/* harmony export */   "fetchCache": function() { return /* binding */ fetchCache; },
/* harmony export */   "fetchJsonCache": function() { return /* binding */ fetchJsonCache; }
/* harmony export */ });
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

/***/ }),

/***/ 5118:
/***/ (function(__unused_webpack_module, __unused_webpack_exports, __webpack_require__) {

const {
  getRequestDefaultConfigs
} = __webpack_require__(6662);

const Shopify = window.Shopify || {};
/**
 * Override the behavior of https://cdn.shopify.com/s/shopify/api.jquery.js
 */

/*

IMPORTANT:

Ajax requests that update Shopify's cart must be queued and sent synchronously to the server.
Meaning: you must wait for your 1st ajax callback to send your 2nd request, and then wait
for its callback to send your 3rd request, etc.

*/

/*

Override so that Shopify.formatMoney returns pretty
money values instead of cents.

*/
// Shopify.money_format = '${{amount}}';

/*

Events (override!)

Example override:
  ... add to your theme.liquid's script tag....

  Shopify.onItemAdded = function(line_item) {
    $('message').update('Added '+line_item.title + '...');
  }

*/

Shopify.onError = function (XMLHttpRequest, textStatus) {
  // Shopify returns a description of the error in XMLHttpRequest.responseText.
  // It is JSON.
  // Example: {"description":"The product 'Amelia - Small' is already sold out.","status":500,"message":"Cart Error"}
  var data = eval('(' + XMLHttpRequest.responseText + ')');

  if (data.message) {
    alert(data.message + '(' + data.status + '): ' + data.description);
  } else {
    alert('Error : ' + Shopify.fullMessagesFromErrors(data).join('; ') + '.');
  }
};

Shopify.fullMessagesFromErrors = function (errors) {
  var fullMessages = [];
  Array.from(errors).forEach(function (messages, attribute) {
    Array.from(messages).forEach(function (message, index) {
      fullMessages.push(attribute + ' ' + message);
    });
  });
  return fullMessages;
};

Shopify.onCartUpdate = async function (cart) {
  try {
    var _window2, _window2$spratlyTheme, _window2$spratlyTheme2, _window2$spratlyTheme3, _window3, _window3$_ThemeEvent, _window3$_ThemeEvent$;

    if (!cart) {
      var _window, _window$spratlyTheme, _window$spratlyTheme$, _window$spratlyTheme$2;

      cart = await ((_window = window) === null || _window === void 0 ? void 0 : (_window$spratlyTheme = _window.spratlyTheme) === null || _window$spratlyTheme === void 0 ? void 0 : (_window$spratlyTheme$ = _window$spratlyTheme.Cart) === null || _window$spratlyTheme$ === void 0 ? void 0 : (_window$spratlyTheme$2 = _window$spratlyTheme$.getCart) === null || _window$spratlyTheme$2 === void 0 ? void 0 : _window$spratlyTheme$2.call(_window$spratlyTheme$));
    }

    (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$spratlyTheme = _window2.spratlyTheme) === null || _window2$spratlyTheme === void 0 ? void 0 : (_window2$spratlyTheme2 = _window2$spratlyTheme.Cart) === null || _window2$spratlyTheme2 === void 0 ? void 0 : (_window2$spratlyTheme3 = _window2$spratlyTheme2.openCartDrawer) === null || _window2$spratlyTheme3 === void 0 ? void 0 : _window2$spratlyTheme3.call(_window2$spratlyTheme2);
    (_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$_ThemeEvent = _window3._ThemeEvent) === null || _window3$_ThemeEvent === void 0 ? void 0 : (_window3$_ThemeEvent$ = _window3$_ThemeEvent.emit) === null || _window3$_ThemeEvent$ === void 0 ? void 0 : _window3$_ThemeEvent$.call(_window3$_ThemeEvent, 'ON_CART_UPDATE', cart);
    console.info('There are now ' + cart.item_count + ' items in the cart.');
  } catch (err) {
    console.error("Failed to trigger Shopify.onCartUpdate()", err);
  }
};

Shopify.onCartShippingRatesUpdate = function (rates, shipping_address) {
  var readable_address = '';
  if (shipping_address.zip) readable_address += shipping_address.zip + ', ';
  if (shipping_address.province) readable_address += shipping_address.province + ', ';
  readable_address += shipping_address.country;
  alert('There are ' + rates.length + ' shipping rates available for ' + readable_address + ', starting at ' + Shopify.formatMoney(rates[0].price) + '.');
};
/**
 * Shopify will override the fetch and XHR request for analytics so we will not override it.
 * Use the Shopify.onItemAdded instead.
 * @param line_item
 */


Shopify.onItemAdded = async line_item => {
  var _window4, _window4$spratlyTheme, _window4$spratlyTheme2, _window4$spratlyTheme3, _window5, _window5$spratlyTheme, _window5$spratlyTheme2, _window5$spratlyTheme3, _window9, _window9$_ThemeEvent, _window9$_ThemeEvent$;

  const {
    source,
    payload
  } = line_item;
  const cart = await ((_window4 = window) === null || _window4 === void 0 ? void 0 : (_window4$spratlyTheme = _window4.spratlyTheme) === null || _window4$spratlyTheme === void 0 ? void 0 : (_window4$spratlyTheme2 = _window4$spratlyTheme.Cart) === null || _window4$spratlyTheme2 === void 0 ? void 0 : (_window4$spratlyTheme3 = _window4$spratlyTheme2.refreshCart) === null || _window4$spratlyTheme3 === void 0 ? void 0 : _window4$spratlyTheme3.call(_window4$spratlyTheme2));
  (_window5 = window) === null || _window5 === void 0 ? void 0 : (_window5$spratlyTheme = _window5.spratlyTheme) === null || _window5$spratlyTheme === void 0 ? void 0 : (_window5$spratlyTheme2 = _window5$spratlyTheme.Cart) === null || _window5$spratlyTheme2 === void 0 ? void 0 : (_window5$spratlyTheme3 = _window5$spratlyTheme2.openCartDrawer) === null || _window5$spratlyTheme3 === void 0 ? void 0 : _window5$spratlyTheme3.call(_window5$spratlyTheme2);
  setTimeout(() => {
    var _window6, _window6$spratlyTheme, _window6$spratlyTheme2, _window7, _window7$spratlyTheme, _window7$spratlyTheme2, _window7$spratlyTheme3, _window8, _window8$spratlyTheme;

    (_window6 = window) === null || _window6 === void 0 ? void 0 : (_window6$spratlyTheme = _window6.spratlyTheme) === null || _window6$spratlyTheme === void 0 ? void 0 : (_window6$spratlyTheme2 = _window6$spratlyTheme.Notification) === null || _window6$spratlyTheme2 === void 0 ? void 0 : _window6$spratlyTheme2.show({
      target: (_window7 = window) === null || _window7 === void 0 ? void 0 : (_window7$spratlyTheme = _window7.spratlyTheme) === null || _window7$spratlyTheme === void 0 ? void 0 : (_window7$spratlyTheme2 = _window7$spratlyTheme.Cart) === null || _window7$spratlyTheme2 === void 0 ? void 0 : (_window7$spratlyTheme3 = _window7$spratlyTheme2.domNodes) === null || _window7$spratlyTheme3 === void 0 ? void 0 : _window7$spratlyTheme3.cartDrawerItems,
      method: 'prepend',
      type: 'success',
      message: (_window8 = window) === null || _window8 === void 0 ? void 0 : (_window8$spratlyTheme = _window8.spratlyThemeStrings) === null || _window8$spratlyTheme === void 0 ? void 0 : _window8$spratlyTheme.itemAdded
    });
  }, 400);
  (_window9 = window) === null || _window9 === void 0 ? void 0 : (_window9$_ThemeEvent = _window9._ThemeEvent) === null || _window9$_ThemeEvent === void 0 ? void 0 : (_window9$_ThemeEvent$ = _window9$_ThemeEvent.emit) === null || _window9$_ThemeEvent$ === void 0 ? void 0 : _window9$_ThemeEvent$.call(_window9$_ThemeEvent, 'ON_ITEM_ADDED', {
    source,
    payload
  }, cart);
  Shopify.onCartUpdate(cart);
};

Shopify.onProduct = function (product) {
  alert('Received everything we ever wanted to know about ' + product.title);
};
/* Tools */

/*
Examples of call:
Shopify.formatMoney(600000, 'â‚¬{{amount_with_comma_separator}} EUR')
Shopify.formatMoney(600000, 'â‚¬{{amount}} EUR')
Shopify.formatMoney(600000, '${{amount_no_decimals}}')
Shopify.formatMoney(600000, '{{ shop.money_format }}') in a Liquid template!

In a Liquid template, you have access to a shop money formats with:
{{ shop.money_format }}
{{ shop.money_with_currency_format }}
{{ shop.money_without_currency_format }}
All these formats are editable on the Preferences page in your admin.
*/


Shopify.formatMoney = function (cents, format) {
  if (typeof cents == 'string') {
    cents = cents.replace('.', '');
  }

  var value = '';
  var placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  var formatString = format || this.money_format;

  function defaultOption(opt, def) {
    return typeof opt == 'undefined' ? def : opt;
  }

  function formatWithDelimiters(number, precision, thousands, decimal) {
    precision = defaultOption(precision, 2);
    thousands = defaultOption(thousands, ',');
    decimal = defaultOption(decimal, '.');

    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);
    var parts = number.split('.'),
        dollars = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, '$1' + thousands),
        cents = parts[1] ? decimal + parts[1] : '';
    return dollars + cents;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;

    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;

    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;

    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
};

Shopify.resizeImage = function (image, size) {
  try {
    if (size === 'original') {
      return image;
    } else {
      var matches = image.match(/(.*\/[\w\-_.]+)\.(\w{2,4})/);
      return matches[1] + '_' + size + '.' + matches[2];
    }
  } catch (e) {
    return image;
  }
};
/* Ajax API */
// -------------------------------------------------------------------------------------
// POST to cart/add.js returns the JSON of the line item associated with the added item.
// -------------------------------------------------------------------------------------


Shopify.addItem = function (variant_id, quantity, callback) {
  console.info('// TODO: Implement Shopify.addItem function!'); //  quantity = quantity || 1
  // let params = {
  //   type: 'POST',
  //   url: '/cart/add.js',
  //   data: 'quantity=' + quantity + '&id=' + variant_id,
  //   dataType: 'json',
  //   success: function (line_item) {
  //     if ((typeof callback) === 'function') {
  //       callback(line_item)
  //     } else {
  //       Shopify.onItemAdded(line_item)
  //     }
  //   },
  //   error: function (XMLHttpRequest, textStatus) {
  //     Shopify.onError(XMLHttpRequest, textStatus)
  //   }
  // }
  // jQuery.ajax(params)
}; // ---------------------------------------------------------
// POST to cart/add.js returns the JSON of the line item.
// ---------------------------------------------------------


Shopify.addItemFromForm = function (form_id, callback) {
  console.info('// TODO: Implement Shopify.addItemFromForm function!'); // var params = {
  //   type: 'POST',
  //   url: '/cart/add.js',
  //   data: jQuery('#' + form_id).serialize(),
  //   dataType: 'json',
  //   success: function (line_item) {
  //     if ((typeof callback) === 'function') {
  //       callback(line_item)
  //     } else {
  //       Shopify.onItemAdded(line_item)
  //     }
  //   },
  //   error: function (XMLHttpRequest, textStatus) {
  //     Shopify.onError(XMLHttpRequest, textStatus)
  //   }
  // }
  // jQuery.ajax(params)
}; // ---------------------------------------------------------
// GET cart.js returns the cart in JSON.
// ---------------------------------------------------------


Shopify.getCart = function (callback) {
  console.info('// TODO: Implement Shopify.getCart function!'); // jQuery.getJSON('/cart.js', function (cart, textStatus) {
  //   if ((typeof callback) === 'function') {
  //     callback(cart)
  //   } else {
  //     Shopify.onCartUpdate(cart)
  //   }
  // })
};

Shopify.pollForCartShippingRatesForDestination = function (shippingAddress, callback, errback) {
  console.info('// TODO: Implement Shopify.pollForCartShippingRatesForDestination function!'); // errback = errback || Shopify.onError
  // var poller = function () {
  //   jQuery.ajax('/cart/async_shipping_rates', {
  //     dataType: 'json',
  //     success: function (response, textStatus, xhr) {
  //       if (xhr.status === 200) {
  //         if ((typeof callback) == 'function') {
  //           callback(response.shipping_rates, shippingAddress)
  //         } else {
  //           Shopify.onCartShippingRatesUpdate(response.shipping_rates, shippingAddress)
  //         }
  //       } else {
  //         setTimeout(poller, 500)
  //       }
  //     },
  //     error: errback
  //   })
  // }
  //
  // return poller
};

Shopify.getCartShippingRatesForDestination = function (shippingAddress, callback, errback) {
  console.info('// TODO: Implement Shopify.getCartShippingRatesForDestination function!'); // errback = errback || Shopify.onError
  // var params = {
  //   type: 'POST',
  //   url: '/cart/prepare_shipping_rates',
  //   data: Shopify.param({'shipping_address': shippingAddress}),
  //   success: Shopify.pollForCartShippingRatesForDestination(shippingAddress, callback, errback),
  //   error: errback
  // }
  //
  // jQuery.ajax(params)
}; // ---------------------------------------------------------
// GET products/<product-handle>.js returns the product in JSON.
// ---------------------------------------------------------


Shopify.getProduct = function (handle, callback) {
  console.info('// TODO: Implement Shopify.getProduct function!'); // jQuery.getJSON('/products/' + handle + '.js', function (product, textStatus) {
  //   if ((typeof callback) === 'function') {
  //     callback(product)
  //   } else {
  //     Shopify.onProduct(product)
  //   }
  // })
}; // ---------------------------------------------------------
// POST to cart/change.js returns the cart in JSON.
// ---------------------------------------------------------


Shopify.changeItem = function (variant_id, quantity, callback) {
  console.info('// TODO: Implement Shopify.changeItem function!'); // var params = {
  //   type: 'POST',
  //   url: '/cart/change.js',
  //   data: 'quantity=' + quantity + '&id=' + variant_id,
  //   dataType: 'json',
  //   success: function (cart) {
  //     if ((typeof callback) === 'function') {
  //       callback(cart)
  //     } else {
  //       Shopify.onCartUpdate(cart)
  //     }
  //   },
  //   error: function (XMLHttpRequest, textStatus) {
  //     Shopify.onError(XMLHttpRequest, textStatus)
  //   }
  // }
  // jQuery.ajax(params)
}; // ---------------------------------------------------------
// POST to cart/change.js returns the cart in JSON.
// ---------------------------------------------------------


Shopify.removeItem = function (variant_id, callback) {
  console.info('// TODO: Implement Shopify.removeItem function!'); // var params = {
  //   type: 'POST',
  //   url: '/cart/change.js',
  //   data: 'quantity=0&id=' + variant_id,
  //   dataType: 'json',
  //   success: function (cart) {
  //     if ((typeof callback) === 'function') {
  //       callback(cart)
  //     } else {
  //       Shopify.onCartUpdate(cart)
  //     }
  //   },
  //   error: function (XMLHttpRequest, textStatus) {
  //     Shopify.onError(XMLHttpRequest, textStatus)
  //   }
  // }
  // jQuery.ajax(params)
}; // ---------------------------------------------------------
// POST to cart/clear.js returns the cart in JSON.
// It removes all the items in the cart, but does
// not clear the cart attributes nor the cart note.
// ---------------------------------------------------------


Shopify.clear = async function (callback, removeAttributes = false) {
  try {
    await Promise.all([await fetch('/cart/clear.js'), removeAttributes && (await fetch('/cart/update.js', { ...getRequestDefaultConfigs(),
      method: 'POST',
      body: JSON.stringify({
        attributes: {
          _foxCartDiscounts: null
        }
      })
    }))]);

    if (typeof callback === "function") {
      callback();
    }
  } catch (error) {
    console.error("Failed to clear cart. ", error);
  }
}; // ---------------------------------------------------------
// POST to cart/update.js returns the cart in JSON.
// ---------------------------------------------------------


Shopify.updateCartFromForm = function (form_id, callback) {
  console.info('// TODO: Implement Shopify.updateCartFromForm function!'); // var params = {
  //   type: 'POST',
  //   url: '/cart/update.js',
  //   data: jQuery('#' + form_id).serialize(),
  //   dataType: 'json',
  //   success: function (cart) {
  //     if ((typeof callback) === 'function') {
  //       callback(cart)
  //     } else {
  //       Shopify.onCartUpdate(cart)
  //     }
  //   },
  //   error: function (XMLHttpRequest, textStatus) {
  //     Shopify.onError(XMLHttpRequest, textStatus)
  //   }
  // }
  // jQuery.ajax(params)
}; // ---------------------------------------------------------
// POST to cart/update.js returns the cart in JSON.
// To clear a particular attribute, set its value to an empty string.
// Receives attributes as a hash or array. Look at comments below.
// ---------------------------------------------------------


Shopify.updateCartAttributes = function (attributes, callback) {
  console.info('// TODO: Implement Shopify.updateCartAttributes function!'); // var data = ''
  // // If attributes is an array of the form:
  // // [ { key: 'my key', value: 'my value' }, ... ]
  // if (jQuery.isArray(attributes)) {
  //   jQuery.each(attributes, function (indexInArray, valueOfElement) {
  //     var key = attributeToString(valueOfElement.key)
  //     if (key !== '') {
  //       data += 'attributes[' + key + ']=' + attributeToString(valueOfElement.value) + '&'
  //     }
  //   })
  // }
  //   // If attributes is a hash of the form:
  // // { 'my key' : 'my value', ... }
  // else if ((typeof attributes === 'object') && attributes !== null) {
  //   jQuery.each(attributes, function (key, value) {
  //     data += 'attributes[' + attributeToString(key) + ']=' + attributeToString(value) + '&'
  //   })
  // }
  // var params = {
  //   type: 'POST',
  //   url: '/cart/update.js',
  //   data: data,
  //   dataType: 'json',
  //   success: function (cart) {
  //     if ((typeof callback) === 'function') {
  //       callback(cart)
  //     } else {
  //       Shopify.onCartUpdate(cart)
  //     }
  //   },
  //   error: function (XMLHttpRequest, textStatus) {
  //     Shopify.onError(XMLHttpRequest, textStatus)
  //   }
  // }
  // jQuery.ajax(params)
}; // ---------------------------------------------------------
// POST to cart/update.js returns the cart in JSON.
// ---------------------------------------------------------


Shopify.updateCartNote = function (note, callback) {
  console.info('// TODO: Implement Shopify.updateCartNote function!'); // var params = {
  //   type: 'POST',
  //   url: '/cart/update.js',
  //   data: 'note=' + attributeToString(note),
  //   dataType: 'json',
  //   success: function (cart) {
  //     if ((typeof callback) === 'function') {
  //       callback(cart)
  //     } else {
  //       Shopify.onCartUpdate(cart)
  //     }
  //   },
  //   error: function (XMLHttpRequest, textStatus) {
  //     Shopify.onError(XMLHttpRequest, textStatus)
  //   }
  // }
  // jQuery.ajax(params)
};

/***/ }),

/***/ 3578:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var QueryHandler = __webpack_require__(3745);

var each = __webpack_require__(2178).each;
/**
 * Represents a single media query, manages it's state and registered handlers for this query
 *
 * @constructor
 * @param {string} query the media query string
 * @param {boolean} [isUnconditional=false] whether the media query should run regardless of whether the conditions are met. Primarily for helping older browsers deal with mobile-first design
 */


function MediaQuery(query, isUnconditional) {
  this.query = query;
  this.isUnconditional = isUnconditional;
  this.handlers = [];
  this.mql = window.matchMedia(query);
  var self = this;

  this.listener = function (mql) {
    // Chrome passes an MediaQueryListEvent object, while other browsers pass MediaQueryList directly
    self.mql = mql.currentTarget || mql;
    self.assess();
  };

  this.mql.addListener(this.listener);
}

MediaQuery.prototype = {
  constuctor: MediaQuery,

  /**
   * add a handler for this query, triggering if already active
   *
   * @param {object} handler
   * @param {function} handler.match callback for when query is activated
   * @param {function} [handler.unmatch] callback for when query is deactivated
   * @param {function} [handler.setup] callback for immediate execution when a query handler is registered
   * @param {boolean} [handler.deferSetup=false] should the setup callback be deferred until the first time the handler is matched?
   */
  addHandler: function (handler) {
    var qh = new QueryHandler(handler);
    this.handlers.push(qh);
    this.matches() && qh.on();
  },

  /**
   * removes the given handler from the collection, and calls it's destroy methods
   *
   * @param {object || function} handler the handler to remove
   */
  removeHandler: function (handler) {
    var handlers = this.handlers;
    each(handlers, function (h, i) {
      if (h.equals(handler)) {
        h.destroy();
        return !handlers.splice(i, 1); //remove from array and exit each early
      }
    });
  },

  /**
   * Determine whether the media query should be considered a match
   *
   * @return {Boolean} true if media query can be considered a match, false otherwise
   */
  matches: function () {
    return this.mql.matches || this.isUnconditional;
  },

  /**
   * Clears all handlers and unbinds events
   */
  clear: function () {
    each(this.handlers, function (handler) {
      handler.destroy();
    });
    this.mql.removeListener(this.listener);
    this.handlers.length = 0; //clear array
  },

  /*
      * Assesses the query, turning on all handlers if it matches, turning them off if it doesn't match
      */
  assess: function () {
    var action = this.matches() ? 'on' : 'off';
    each(this.handlers, function (handler) {
      handler[action]();
    });
  }
};
module.exports = MediaQuery;

/***/ }),

/***/ 6227:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var MediaQuery = __webpack_require__(3578);

var Util = __webpack_require__(2178);

var each = Util.each;
var isFunction = Util.isFunction;
var isArray = Util.isArray;
/**
 * Allows for registration of query handlers.
 * Manages the query handler's state and is responsible for wiring up browser events
 *
 * @constructor
 */

function MediaQueryDispatch() {
  if (!window.matchMedia) {
    throw new Error('matchMedia not present, legacy browsers require a polyfill');
  }

  this.queries = {};
  this.browserIsIncapable = !window.matchMedia('only all').matches;
}

MediaQueryDispatch.prototype = {
  constructor: MediaQueryDispatch,

  /**
   * Registers a handler for the given media query
   *
   * @param {string} q the media query
   * @param {object || Array || Function} options either a single query handler object, a function, or an array of query handlers
   * @param {function} options.match fired when query matched
   * @param {function} [options.unmatch] fired when a query is no longer matched
   * @param {function} [options.setup] fired when handler first triggered
   * @param {boolean} [options.deferSetup=false] whether setup should be run immediately or deferred until query is first matched
   * @param {boolean} [shouldDegrade=false] whether this particular media query should always run on incapable browsers
   */
  register: function (q, options, shouldDegrade) {
    var queries = this.queries,
        isUnconditional = shouldDegrade && this.browserIsIncapable;

    if (!queries[q]) {
      queries[q] = new MediaQuery(q, isUnconditional);
    } //normalise to object in an array


    if (isFunction(options)) {
      options = {
        match: options
      };
    }

    if (!isArray(options)) {
      options = [options];
    }

    each(options, function (handler) {
      if (isFunction(handler)) {
        handler = {
          match: handler
        };
      }

      queries[q].addHandler(handler);
    });
    return this;
  },

  /**
   * unregisters a query and all it's handlers, or a specific handler for a query
   *
   * @param {string} q the media query to target
   * @param {object || function} [handler] specific handler to unregister
   */
  unregister: function (q, handler) {
    var query = this.queries[q];

    if (query) {
      if (handler) {
        query.removeHandler(handler);
      } else {
        query.clear();
        delete this.queries[q];
      }
    }

    return this;
  }
};
module.exports = MediaQueryDispatch;

/***/ }),

/***/ 3745:
/***/ (function(module) {

/**
 * Delegate to handle a media query being matched and unmatched.
 *
 * @param {object} options
 * @param {function} options.match callback for when the media query is matched
 * @param {function} [options.unmatch] callback for when the media query is unmatched
 * @param {function} [options.setup] one-time callback triggered the first time a query is matched
 * @param {boolean} [options.deferSetup=false] should the setup callback be run immediately, rather than first time query is matched?
 * @constructor
 */
function QueryHandler(options) {
  this.options = options;
  !options.deferSetup && this.setup();
}

QueryHandler.prototype = {
  constructor: QueryHandler,

  /**
   * coordinates setup of the handler
   *
   * @function
   */
  setup: function () {
    if (this.options.setup) {
      this.options.setup();
    }

    this.initialised = true;
  },

  /**
   * coordinates setup and triggering of the handler
   *
   * @function
   */
  on: function () {
    !this.initialised && this.setup();
    this.options.match && this.options.match();
  },

  /**
   * coordinates the unmatch event for the handler
   *
   * @function
   */
  off: function () {
    this.options.unmatch && this.options.unmatch();
  },

  /**
   * called when a handler is to be destroyed.
   * delegates to the destroy or unmatch callbacks, depending on availability.
   *
   * @function
   */
  destroy: function () {
    this.options.destroy ? this.options.destroy() : this.off();
  },

  /**
   * determines equality by reference.
   * if object is supplied compare options, if function, compare match callback
   *
   * @function
   * @param {object || function} [target] the target for comparison
   */
  equals: function (target) {
    return this.options === target || this.options.match === target;
  }
};
module.exports = QueryHandler;

/***/ }),

/***/ 2178:
/***/ (function(module) {

/**
 * Helper function for iterating over a collection
 *
 * @param collection
 * @param fn
 */
function each(collection, fn) {
  var i = 0,
      length = collection.length,
      cont;

  for (i; i < length; i++) {
    cont = fn(collection[i], i);

    if (cont === false) {
      break; //allow early exit
    }
  }
}
/**
 * Helper function for determining whether target object is an array
 *
 * @param target the object under test
 * @return {Boolean} true if array, false otherwise
 */


function isArray(target) {
  return Object.prototype.toString.apply(target) === '[object Array]';
}
/**
 * Helper function for determining whether target object is a function
 *
 * @param target the object under test
 * @return {Boolean} true if function, false otherwise
 */


function isFunction(target) {
  return typeof target === 'function';
}

module.exports = {
  isFunction: isFunction,
  isArray: isArray,
  each: each
};

/***/ }),

/***/ 1179:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

var MediaQueryDispatch = __webpack_require__(6227);

module.exports = new MediaQueryDispatch();

/***/ }),

/***/ 1339:
/***/ (function() {

Element.prototype.matches || (Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector), window.Element && !Element.prototype.closest && (Element.prototype.closest = function (e) {
  var t = this;

  do {
    if (t.matches(e)) return t;
    t = t.parentElement || t.parentNode;
  } while (null !== t && 1 === t.nodeType);

  return null;
});

/***/ }),

/***/ 2297:
/***/ (function() {

!function () {
  function t() {
    var e = Array.prototype.slice.call(arguments),
        r = document.createDocumentFragment();
    e.forEach(function (e) {
      var t = e instanceof Node;
      r.appendChild(t ? e : document.createTextNode(String(e)));
    }), this.parentNode.insertBefore(r, this.nextSibling);
  }

  [Element.prototype, CharacterData.prototype, DocumentType.prototype].forEach(function (e) {
    e.hasOwnProperty("after") || Object.defineProperty(e, "after", {
      configurable: !0,
      enumerable: !0,
      writable: !0,
      value: t
    });
  });
}();

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

/***/ 598:
/***/ (function() {

!function () {
  function t() {
    var e = Array.prototype.slice.call(arguments),
        n = document.createDocumentFragment();
    e.forEach(function (e) {
      var t = e instanceof Node;
      n.appendChild(t ? e : document.createTextNode(String(e)));
    }), this.insertBefore(n, this.firstChild);
  }

  [Element.prototype, Document.prototype, DocumentFragment.prototype].forEach(function (e) {
    e.hasOwnProperty("prepend") || Object.defineProperty(e, "prepend", {
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
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
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

// EXTERNAL MODULE: ./node_modules/mdn-polyfills/Element.prototype.closest.js
var Element_prototype_closest = __webpack_require__(1339);
// EXTERNAL MODULE: ./node_modules/mdn-polyfills/Node.prototype.after.js
var Node_prototype_after = __webpack_require__(2297);
// EXTERNAL MODULE: ./node_modules/mdn-polyfills/Node.prototype.prepend.js
var Node_prototype_prepend = __webpack_require__(598);
;// CONCATENATED MODULE: ./src/js/utilities/polyfill.js



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
;// CONCATENATED MODULE: ./src/js/components/Notification.jsx
/* provided dependency */ var createElement = __webpack_require__(6295)["default"];
/* harmony default export */ function components_Notification({
  type,
  message,
  onclick
}) {
  let icon;

  if (type === 'warning') {
    icon = createElement("svg", {
      class: "w-6 h-6",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, createElement("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    }));
  } else if (type === 'success') {
    icon = createElement("svg", {
      class: "w-6 h-6",
      fill: "none",
      stroke: "currentColor",
      viewBox: "0 0 24 24",
      xmlns: "http://www.w3.org/2000/svg"
    }, createElement("path", {
      "stroke-linecap": "round",
      "stroke-linejoin": "round",
      "stroke-width": "2",
      d: "M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
    }));
  }

  return createElement("div", {
    className: `notification ${type}`,
    onclick: onclick
  }, icon, createElement("div", {
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
;// CONCATENATED MODULE: ./src/js/components/LazyImage.jsx
/* provided dependency */ var LazyImage_createElement = __webpack_require__(6295)["default"];
/* harmony default export */ function LazyImage(props) {
  const {
    src,
    alt,
    style = {},
    className = '',
    onLoad = () => {},
    onError = () => {}
  } = props;
  const image = LazyImage_createElement("img", {
    style: style,
    className: `transition-opacity opacity-0 ${className}`,
    src: src,
    alt: alt
  });
  image.addEventListener('load', imgLoaded);
  image.addEventListener('error', imgError);

  if (image.complete && image.naturalWidth) {
    imgLoaded();
  }

  function imgLoaded() {
    onLoad && onLoad();
    image.classList.add('opacity-100');
    image.removeEventListener('load', imgLoaded);
    image.removeEventListener('error', imgError);
  }

  function imgError(err) {
    console.error('Failed to load LazyImage. ', err, props);
    onError && onError();
    image.style.opacity = 0;
    image.removeEventListener('load', imgLoaded);
    image.removeEventListener('error', imgError);
  }

  return image;
}
;// CONCATENATED MODULE: ./src/js/components/InstagramImage.jsx
/* provided dependency */ var InstagramImage_createElement = __webpack_require__(6295)["default"];
// eslint-disable-next-line no-unused-vars

/* harmony default export */ function InstagramImage({
  image
}) {
  return InstagramImage_createElement("div", {
    className: "sf-column"
  }, InstagramImage_createElement("a", {
    href: image.permalink,
    target: "_blank",
    className: "sf__insta-item block relative"
  }, InstagramImage_createElement("div", {
    className: "sf__insta-content absolute z-10 inset-0 flex items-center justify-center"
  }, InstagramImage_createElement("div", {
    class: "sf__insta-icon"
  }, InstagramImage_createElement("svg", {
    className: "w-10 h-10",
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 448 512"
  }, InstagramImage_createElement("path", {
    fill: "currentColor",
    d: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"
  })))), InstagramImage_createElement("div", {
    className: "sf__insta-image",
    style: {
      "--aspect-ratio": "1/1"
    }
  }, InstagramImage_createElement(LazyImage, {
    src: image.media_url,
    alt: `instagram-image-${image.username}-${image.id}`
  })), InstagramImage_createElement("div", {
    className: "sf__item-bg"
  })));
}
// EXTERNAL MODULE: ./src/js/utilities/fetch.js
var utilities_fetch = __webpack_require__(6662);
;// CONCATENATED MODULE: ./src/js/modules/instagram.js
/* provided dependency */ var instagram_createElement = __webpack_require__(6295)["default"];

// eslint-disable-next-line no-unused-vars


class Instagram {
  constructor(container, accessToken, imagesCount = 4) {
    _defineProperty(this, "mediaAPI", 'https://graph.instagram.com/me/media?fields=caption,id,media_type,media_url,permalink,thumbnail_url,timestamp,username');

    this.container = container;
    this.imagesContainer = container.querySelector('.instagram-images');
    this.accessToken = accessToken;
    this.imagesCount = imagesCount;
    if (window.__sfWindowLoaded) this.init().catch(console.error);else window.addEventListener("load", () => this.init().catch(console.error));
  }

  async init() {
    const media = await (0,utilities_fetch.fetchJsonCache)(`${this.mediaAPI}&access_token=${this.accessToken}`, {
      cache: 'force-cache'
    });
    if (!media) return;

    if (media.error) {
      var _media$error;

      return console.error('Instagram error: ', (_media$error = media.error) === null || _media$error === void 0 ? void 0 : _media$error.message);
    }

    media.data.filter(d => d.media_type === 'IMAGE' || d.media_type === 'CAROUSEL_ALBUM') // .reverse()
    .slice(0, this.imagesCount).forEach(image => {
      const imgNode = instagram_createElement(InstagramImage, {
        image: image
      });
      this.imagesContainer.appendChild(imgNode);
    });
  }

}
;// CONCATENATED MODULE: ./src/js/components/WishlistRemoveButton.jsx
/* provided dependency */ var WishlistRemoveButton_createElement = __webpack_require__(6295)["default"];
/* harmony default export */ function WishlistRemoveButton({
  productHandle
}) {
  return WishlistRemoveButton_createElement("div", {
    className: "block md:hidden absolute z-10 right-5 top-5"
  }, WishlistRemoveButton_createElement("div", {
    className: "sf__tooltip-item sf-wishlist__remove",
    dataSet: {
      productHandle
    }
  }, WishlistRemoveButton_createElement("svg", {
    className: "w-5 h-5",
    fill: "none",
    stroke: "currentColor",
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
  }, WishlistRemoveButton_createElement("path", {
    "stroke-linecap": "round",
    "stroke-linejoin": "round",
    "stroke-width": "2",
    d: "M6 18L18 6M6 6l12 12"
  }))));
}
;// CONCATENATED MODULE: ./src/js/utilities/events.js
const addEventDelegate = ({
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
class events_Event {
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
;// CONCATENATED MODULE: ./src/js/pages/wishlist.js
/* provided dependency */ var wishlist_createElement = __webpack_require__(6295)["default"];

// eslint-disable-next-line no-unused-vars




class Wishlist {
  constructor() {
    _defineProperty(this, "isWishlistPage", false);

    _defineProperty(this, "storageKey", 'sf__wishlist-products');

    _defineProperty(this, "products", []);

    _defineProperty(this, "productNodes", {});

    _defineProperty(this, "pageTemplate", 'page.wishlist');

    _defineProperty(this, "addedClass", 'added-to-wishlist');

    _defineProperty(this, "hasItemClass", 'wishlist-has-item');

    _defineProperty(this, "selectors", {
      container: '.sf-wishlist__container',
      noProducts: '.sf-wishlist__no_products',
      wrapper: '.sf-wishlist__wrapper',
      productCard: '.sf__pcard',
      wishlistButton: '.sf-wishlist__button',
      wishlistText: '.sf-wishlist__button-content',
      removeButton: '.sf-wishlist__remove',
      count: '.sf-wishlist-count'
    });

    _defineProperty(this, "init", async () => {
      if (this.isWishlistPage) {
        await this.renderWishlistPage();
        this.addEventToRemoveButtons();
      }

      this.setWishlistButtonsState();
      this.addEventToWishlistButtons();
      this.updateWishlistCount();
    });

    _defineProperty(this, "saveToStorage", () => {
      this.products = Array.from(new Set(this.products));
      localStorage.setItem(this.storageKey, JSON.stringify(this.products));
    });

    _defineProperty(this, "setWishlistButtonsState", () => {
      const buttons = document.querySelectorAll(this.selectors.wishlistButton);
      buttons.forEach(btn => {
        var _btn$dataset, _btn$classList;

        const prodHandle = btn === null || btn === void 0 ? void 0 : (_btn$dataset = btn.dataset) === null || _btn$dataset === void 0 ? void 0 : _btn$dataset.productHandle;

        if (this.products.indexOf(prodHandle) >= 0 && !(btn !== null && btn !== void 0 && (_btn$classList = btn.classList) !== null && _btn$classList !== void 0 && _btn$classList.contains(this.addedClass))) {
          this.toggleButtonState(btn, true);

          if (this.isWishlistPage) {
            btn.classList.remove(this.selectors.wishlistButton.replace('.', ''));
            btn.classList.add(this.selectors.removeButton.replace('.', ''));
          }
        }
      });
    });

    _defineProperty(this, "updateWishlistCount", () => {
      const size = this.products.length;
      const countElems = document.querySelectorAll(this.selectors.count);
      [...countElems].forEach(elem => {
        elem.textContent = size;
      });
      const method = size ? 'add' : 'remove';
      document.body.classList[method](this.hasItemClass);
    });

    _defineProperty(this, "addEventToWishlistButtons", () => {
      addEventDelegate({
        selector: this.selectors.wishlistButton,
        handler: (e, btn) => {
          var _btn$dataset2;

          e.preventDefault();
          const productHandle = btn === null || btn === void 0 ? void 0 : (_btn$dataset2 = btn.dataset) === null || _btn$dataset2 === void 0 ? void 0 : _btn$dataset2.productHandle;

          if (productHandle) {
            const active = !btn.classList.contains(this.addedClass);
            this.toggleButtonState(btn, active);
            this.updateWishlistCount();
          }
        }
      });
    });

    _defineProperty(this, "toggleButtonState", (btn, active) => {
      var _btn$dataset3;

      const productHandle = btn === null || btn === void 0 ? void 0 : (_btn$dataset3 = btn.dataset) === null || _btn$dataset3 === void 0 ? void 0 : _btn$dataset3.productHandle;
      const wishlistText = btn.querySelector(this.selectors.wishlistText);

      if (active) {
        this.addToWishlist(productHandle);
        btn.classList.add(this.addedClass);
      } else {
        this.removeFromWishlist(productHandle);
        btn.classList.remove(this.addedClass);
      }

      if (wishlistText) {
        var _wishlistText$dataset;

        const temp = wishlistText === null || wishlistText === void 0 ? void 0 : (_wishlistText$dataset = wishlistText.dataset) === null || _wishlistText$dataset === void 0 ? void 0 : _wishlistText$dataset.revertText;
        wishlistText.dataset.revertText = wishlistText.textContent;
        wishlistText.textContent = temp;
      }
    });

    _defineProperty(this, "addEventToRemoveButtons", () => {
      addEventDelegate({
        selector: this.selectors.removeButton,
        handler: (e, btn) => {
          var _btn$dataset4;

          e.preventDefault();
          const prod = btn === null || btn === void 0 ? void 0 : btn.closest(this.selectors.wrapper);
          prod === null || prod === void 0 ? void 0 : prod.remove();
          const productHandle = btn === null || btn === void 0 ? void 0 : (_btn$dataset4 = btn.dataset) === null || _btn$dataset4 === void 0 ? void 0 : _btn$dataset4.productHandle;

          if (productHandle) {
            this.removeFromWishlist(productHandle);
            this.updateWishlistCount();

            if (!this.products.length) {
              this.showNoProductsMessage();
            }
          }
        }
      });
    });

    _defineProperty(this, "renderWishlistPage", async () => {
      const container = document.querySelector(this.selectors.container);

      if (container) {
        let noItemAvailable = true;

        if (this.products.length) {
          const promises = this.products.map(async hdl => {
            const prodHTML = await (0,utilities_fetch.fetchCache)(`/products/${hdl}?view=grid-card-item`);
            const item = wishlist_createElement("div", {
              className: `hidden relative ${this.selectors.wrapper.replace('.', '')}`
            });
            item.innerHTML = prodHTML;

            if (item.querySelector(this.selectors.productCard)) {
              noItemAvailable = false;
              item.appendChild(wishlist_createElement(WishlistRemoveButton, {
                productHandle: hdl
              }));
              this.productNodes[hdl] = item;
            }
          });
          await Promise.all(promises); // Render in order

          this.products.forEach(hdl => {
            const prod = this.productNodes[hdl];

            if (prod) {
              container.appendChild(prod);
              prod.classList.remove('hidden');
            }
          });
          window.spratlyTheme.Products.initProductForms().catch(console.error);
        }

        if (noItemAvailable) {
          this.showNoProductsMessage();
        } else {
          this.setWishlistButtonsState();
        }

        container.classList.add('opacity-100');
      }
    });

    _defineProperty(this, "showNoProductsMessage", () => {
      const container = document.querySelector(this.selectors.container);
      const noProducts = document.querySelector(this.selectors.noProducts);
      document.documentElement.classList.add('grow-full');
      container.classList.add('hidden');
      noProducts.classList.remove('hidden');
    });

    this.products = Array.from(new Set(Array.from(JSON.parse(localStorage.getItem(this.storageKey)) || [])));
    this.isWishlistPage = window.spratlyThemeSettings.template === this.pageTemplate;
    this.init();
  }

  addToWishlist(handle) {
    if (handle && this.products.indexOf(handle) === -1) {
      this.products.push(handle);
      this.saveToStorage();
    }
  }

  removeFromWishlist(handle) {
    this.products = this.products.filter(hdl => hdl !== handle);
    this.saveToStorage();
  }

}

/* harmony default export */ var wishlist = (new Wishlist());
;// CONCATENATED MODULE: ./src/js/pages/compare-product.js
/* provided dependency */ var compare_product_createElement = __webpack_require__(6295)["default"];

// import { Product } from '@modules/product'

 // TODO: update product compare page

class CompareProduct {
  constructor() {
    _defineProperty(this, "storageKey", 'sf__compare-products');

    _defineProperty(this, "products", []);

    _defineProperty(this, "productNodes", {});

    _defineProperty(this, "pageTemplate", 'page.product-compare');

    _defineProperty(this, "addedClass", 'added-to-compare');

    _defineProperty(this, "selectors", {
      container: '.sf-prod-compare__container',
      noProducts: '.sf-prod-compare__no_products',
      wrapper: '.sf-prod-compare__wrapper',
      item: '.sf-prod-compare',
      compareButton: '.sf-prod-compare__button',
      compareText: '.sf-prod-compare__button-content',
      removeButton: '.sf-prod-compare__remove'
    });

    _defineProperty(this, "init", () => {
      if (window.spratlyThemeSettings.template === this.pageTemplate) {
        this.renderComparePage();
        this.addEventToRemoveButtons();
      } else {
        this.setCompareButtonsState();
        this.addEventToCompareButtons();
      }
    });

    _defineProperty(this, "saveToStorage", () => {
      this.products = Array.from(new Set(this.products));
      localStorage.setItem(this.storageKey, JSON.stringify(this.products));
    });

    _defineProperty(this, "setCompareButtonsState", () => {
      const buttons = document.querySelectorAll(this.selectors.compareButton);
      buttons.forEach(btn => {
        var _btn$dataset, _btn$classList;

        const prodHandle = btn === null || btn === void 0 ? void 0 : (_btn$dataset = btn.dataset) === null || _btn$dataset === void 0 ? void 0 : _btn$dataset.productHandle;

        if (this.products.indexOf(prodHandle) >= 0 && !(btn !== null && btn !== void 0 && (_btn$classList = btn.classList) !== null && _btn$classList !== void 0 && _btn$classList.contains(this.addedClass))) {
          this.toggleButtonState(btn, true);
        }
      });
    });

    _defineProperty(this, "addEventToCompareButtons", () => {
      addEventDelegate({
        selector: this.selectors.compareButton,
        handler: (e, btn) => {
          var _btn$dataset2;

          e.preventDefault();
          const productHandle = btn === null || btn === void 0 ? void 0 : (_btn$dataset2 = btn.dataset) === null || _btn$dataset2 === void 0 ? void 0 : _btn$dataset2.productHandle;

          if (productHandle) {
            const active = !btn.classList.contains(this.addedClass);
            this.toggleButtonState(btn, active);
          }
        }
      });
    });

    _defineProperty(this, "toggleButtonState", (btn, active) => {
      var _btn$dataset3;

      const productHandle = btn === null || btn === void 0 ? void 0 : (_btn$dataset3 = btn.dataset) === null || _btn$dataset3 === void 0 ? void 0 : _btn$dataset3.productHandle;
      const compareText = btn.querySelector(this.selectors.compareText);

      if (active) {
        this.addToCompare(productHandle);
        btn.classList.add(this.addedClass);
      } else {
        this.removeFromCompare(productHandle);
        btn.classList.remove(this.addedClass);
      }

      if (compareText) {
        var _compareText$dataset;

        const temp = compareText === null || compareText === void 0 ? void 0 : (_compareText$dataset = compareText.dataset) === null || _compareText$dataset === void 0 ? void 0 : _compareText$dataset.revertText;
        compareText.dataset.revertText = compareText.textContent;
        compareText.textContent = temp;
      }
    });

    _defineProperty(this, "addEventToRemoveButtons", () => {
      addEventDelegate({
        selector: this.selectors.removeButton,
        handler: (e, btn) => {
          var _btn$dataset4;

          e.preventDefault();
          const prod = btn === null || btn === void 0 ? void 0 : btn.closest(this.selectors.wrapper);
          prod === null || prod === void 0 ? void 0 : prod.remove();
          const productHandle = btn === null || btn === void 0 ? void 0 : (_btn$dataset4 = btn.dataset) === null || _btn$dataset4 === void 0 ? void 0 : _btn$dataset4.productHandle;

          if (productHandle) {
            this.removeFromCompare(productHandle);

            if (!this.products.length) {
              this.showNoProductsMessage();
            }
          }
        }
      });
    });

    _defineProperty(this, "renderComparePage", async () => {
      const container = document.querySelector(this.selectors.container);

      if (container) {
        let noItemAvailable = true;

        if (this.products.length) {
          const promises = this.products.map(async hdl => {
            const prodHTML = await (0,utilities_fetch.fetchCache)(`/products/${hdl}?view=compare`);
            const item = compare_product_createElement("div", {
              className: `hidden ${this.selectors.wrapper.replace('.', '')}`
            });
            item.innerHTML = prodHTML;

            if (item.querySelector(this.selectors.item)) {
              noItemAvailable = false;
              this.productNodes[hdl] = item;
            }
          });
          await Promise.all(promises); // Render in order

          this.products.forEach(hdl => {
            const prodNode = this.productNodes[hdl];

            if (prodNode) {
              container.appendChild(prodNode);
              prodNode.classList.remove('hidden');
            }
          });
          window.spratlyTheme.Products.initProductForms().catch(console.error);
        }

        if (noItemAvailable) {
          this.showNoProductsMessage();
        }

        container.classList.add('opacity-100');
      }
    });

    _defineProperty(this, "showNoProductsMessage", () => {
      const container = document.querySelector(this.selectors.container);
      const noProducts = document.querySelector(this.selectors.noProducts);
      document.documentElement.classList.add('grow-full');
      container.classList.add('hidden');
      noProducts.classList.remove('hidden');
    });

    this.products = Array.from(new Set(Array.from(JSON.parse(localStorage.getItem(this.storageKey)) || [])));
    this.init();
  }

  addToCompare(handle) {
    if (handle && this.products.indexOf(handle) === -1) {
      this.products.push(handle);
      this.saveToStorage();
    }
  }

  removeFromCompare(handle) {
    this.products = this.products.filter(hdl => hdl !== handle);
    this.saveToStorage();
  }

}

/* harmony default export */ var compare_product = (new CompareProduct());
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-predictive-search/src/validate.js
function validateQuery(query) {
  var error;

  if (query === null || query === undefined) {
    error = new TypeError("'query' is missing");
    error.type = "argument";
    throw error;
  }

  if (typeof query !== "string") {
    error = new TypeError("'query' is not a string");
    error.type = "argument";
    throw error;
  }
}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-predictive-search/src/utilities/CustomError.js
function GenericError() {
  var error = Error.call(this);
  error.name = "Server error";
  error.message = "Something went wrong on the server";
  error.status = 500;
  return error;
}
function NotFoundError(status) {
  var error = Error.call(this);
  error.name = "Not found";
  error.message = "Not found";
  error.status = status;
  return error;
}
function ServerError() {
  var error = Error.call(this);
  error.name = "Server error";
  error.message = "Something went wrong on the server";
  error.status = 500;
  return error;
}
function ContentTypeError(status) {
  var error = Error.call(this);
  error.name = "Content-Type error";
  error.message = "Content-Type was not provided or is of wrong type";
  error.status = status;
  return error;
}
function JsonParseError(status) {
  var error = Error.call(this);
  error.name = "JSON parse error";
  error.message = "JSON syntax error";
  error.status = status;
  return error;
}
function ThrottledError(status, name, message, retryAfter) {
  var error = Error.call(this);
  error.name = name;
  error.message = message;
  error.status = status;
  error.retryAfter = retryAfter;
  return error;
}
function InvalidParameterError(status, name, message) {
  var error = Error.call(this);
  error.name = name;
  error.message = message;
  error.status = status;
  return error;
}
function ExpectationFailedError(status, name, message) {
  var error = Error.call(this);
  error.name = name;
  error.message = message;
  error.status = status;
  return error;
}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-predictive-search/src/request.js

function request(searchPath, configParams, query, onSuccess, onError) {
  var xhr = new XMLHttpRequest();
  var route = searchPath + '/suggest.json';

  xhr.onreadystatechange = function () {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      var contentType = xhr.getResponseHeader("Content-Type");

      if (xhr.status >= 500) {
        onError(new ServerError());
        return;
      }

      if (xhr.status === 404) {
        onError(new NotFoundError(xhr.status));
        return;
      }

      if (typeof contentType !== "string" || contentType.toLowerCase().match("application/json") === null) {
        onError(new ContentTypeError(xhr.status));
        return;
      }

      if (xhr.status === 417) {
        try {
          var invalidParameterJson = JSON.parse(xhr.responseText);
          onError(new InvalidParameterError(xhr.status, invalidParameterJson.message, invalidParameterJson.description));
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      if (xhr.status === 422) {
        try {
          var expectationFailedJson = JSON.parse(xhr.responseText);
          onError(new ExpectationFailedError(xhr.status, expectationFailedJson.message, expectationFailedJson.description));
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      if (xhr.status === 429) {
        try {
          var throttledJson = JSON.parse(xhr.responseText);
          onError(new ThrottledError(xhr.status, throttledJson.message, throttledJson.description, xhr.getResponseHeader("Retry-After")));
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      if (xhr.status === 200) {
        try {
          var res = JSON.parse(xhr.responseText);
          res.query = query;
          onSuccess(res);
        } catch (error) {
          onError(new JsonParseError(xhr.status));
        }

        return;
      }

      try {
        var genericErrorJson = JSON.parse(xhr.responseText);
        onError(new GenericError(xhr.status, genericErrorJson.message, genericErrorJson.description));
      } catch (error) {
        onError(new JsonParseError(xhr.status));
      }

      return;
    }
  };

  xhr.open("get", route + "?q=" + encodeURIComponent(query) + "&" + configParams);
  xhr.setRequestHeader("Content-Type", "application/json");
  xhr.send();
}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-predictive-search/src/utilities/debounce.js
function debounce(func, wait) {
  var timeout = null;
  return function () {
    var context = this;
    var args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      timeout = null;
      func.apply(context, args);
    }, wait || 0);
  };
}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-predictive-search/src/utilities/Dispatcher.js
function Dispatcher() {
  this.events = {};
}

Dispatcher.prototype.on = function (eventName, callback) {
  var event = this.events[eventName];

  if (!event) {
    event = new DispatcherEvent(eventName);
    this.events[eventName] = event;
  }

  event.registerCallback(callback);
};

Dispatcher.prototype.off = function (eventName, callback) {
  var event = this.events[eventName];

  if (event && event.callbacks.indexOf(callback) > -1) {
    event.unregisterCallback(callback);

    if (event.callbacks.length === 0) {
      delete this.events[eventName];
    }
  }
};

Dispatcher.prototype.dispatch = function (eventName, payload) {
  var event = this.events[eventName];

  if (event) {
    event.fire(payload);
  }
};

function DispatcherEvent(eventName) {
  this.eventName = eventName;
  this.callbacks = [];
}

DispatcherEvent.prototype.registerCallback = function (callback) {
  this.callbacks.push(callback);
};

DispatcherEvent.prototype.unregisterCallback = function (callback) {
  var index = this.callbacks.indexOf(callback);

  if (index > -1) {
    this.callbacks.splice(index, 1);
  }
};

DispatcherEvent.prototype.fire = function (payload) {
  var callbacks = this.callbacks.slice(0);
  callbacks.forEach(function (callback) {
    callback(payload);
  });
};
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-predictive-search/src/utilities/Cache.js
function Cache(config) {
  this._store = {};
  this._keys = [];

  if (config && config.bucketSize) {
    this.bucketSize = config.bucketSize;
  } else {
    this.bucketSize = 20;
  }
}

Cache.prototype.set = function (key, value) {
  if (this.count() >= this.bucketSize) {
    var deleteKey = this._keys.splice(0, 1);

    this.delete(deleteKey);
  }

  this._keys.push(key);

  this._store[key] = value;
  return this._store;
};

Cache.prototype.get = function (key) {
  return this._store[key];
};

Cache.prototype.has = function (key) {
  return Boolean(this._store[key]);
};

Cache.prototype.count = function () {
  return Object.keys(this._store).length;
};

Cache.prototype.delete = function (key) {
  var exists = Boolean(this._store[key]);
  delete this._store[key];
  return exists && !this._store[key];
};
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-predictive-search/src/utilities/objectToQueryParams.js
function objectToQueryParams(obj, parentKey) {
  var output = "";
  parentKey = parentKey || null;
  Object.keys(obj).forEach(function (key) {
    var outputKey = key + "=";

    if (parentKey) {
      outputKey = parentKey + "[" + key + "]";
    }

    switch (trueTypeOf(obj[key])) {
      case "object":
        output += objectToQueryParams(obj[key], parentKey ? outputKey : key);
        break;

      case "array":
        output += outputKey + "=" + obj[key].join(",") + "&";
        break;

      default:
        if (parentKey) {
          outputKey += "=";
        }

        output += outputKey + encodeURIComponent(obj[key]) + "&";
        break;
    }
  });
  return output;
}

function trueTypeOf(obj) {
  return Object.prototype.toString.call(obj).slice(8, -1).toLowerCase();
}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-predictive-search/src/theme-predictive-search.js



var DEBOUNCE_RATE = 10;
var requestDebounced = debounce(request, DEBOUNCE_RATE);
function PredictiveSearch(config) {
  if (!config) {
    throw new TypeError("No config object was specified");
  }

  var configParameters = config;
  this._retryAfter = null;
  this._currentQuery = null;
  this.dispatcher = new Dispatcher();
  this.cache = new Cache({
    bucketSize: 40
  });
  this.searchPath = configParameters.search_path || "/search";

  if (configParameters.search_path) {
    delete configParameters['search_path'];
  }

  this.configParams = objectToQueryParams(configParameters);
}
PredictiveSearch.SEARCH_PATH = "/search";
PredictiveSearch.TYPES = {
  PRODUCT: "product",
  PAGE: "page",
  ARTICLE: "article",
  COLLECTION: "collection"
};
PredictiveSearch.FIELDS = {
  AUTHOR: "author",
  BODY: "body",
  PRODUCT_TYPE: "product_type",
  TAG: "tag",
  TITLE: "title",
  VARIANTS_BARCODE: "variants.barcode",
  VARIANTS_SKU: "variants.sku",
  VARIANTS_TITLE: "variants.title",
  VENDOR: "vendor"
};
PredictiveSearch.UNAVAILABLE_PRODUCTS = {
  SHOW: "show",
  HIDE: "hide",
  LAST: "last"
};

PredictiveSearch.prototype.query = function query(query) {
  try {
    validateQuery(query);
  } catch (error) {
    this.dispatcher.dispatch("error", error);
    return;
  }

  if (query === "") {
    return this;
  }

  this._currentQuery = normalizeQuery(query);
  var cacheResult = this.cache.get(this._currentQuery);

  if (cacheResult) {
    this.dispatcher.dispatch("success", cacheResult);
    return this;
  }

  requestDebounced(this.searchPath, this.configParams, query, function (result) {
    this.cache.set(normalizeQuery(result.query), result);

    if (normalizeQuery(result.query) === this._currentQuery) {
      this._retryAfter = null;
      this.dispatcher.dispatch("success", result);
    }
  }.bind(this), function (error) {
    if (error.retryAfter) {
      this._retryAfter = error.retryAfter;
    }

    this.dispatcher.dispatch("error", error);
  }.bind(this));
  return this;
};

PredictiveSearch.prototype.on = function on(eventName, callback) {
  this.dispatcher.on(eventName, callback);
  return this;
};

PredictiveSearch.prototype.off = function on(eventName, callback) {
  this.dispatcher.off(eventName, callback);
  return this;
};

function normalizeQuery(query) {
  if (typeof query !== "string") {
    return null;
  }

  return query.trim().replace(" ", "-").toLowerCase();
}
// EXTERNAL MODULE: ./node_modules/scroll-into-view/scrollIntoView.js
var scrollIntoView = __webpack_require__(643);
var scrollIntoView_default = /*#__PURE__*/__webpack_require__.n(scrollIntoView);
;// CONCATENATED MODULE: ./src/js/utilities/load-assets.js
function loadJS(src, target = document.body, async = true, defer = false) {
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
function loadCSS(href, target = document.head) {
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
;// CONCATENATED MODULE: ./src/js/utilities/localization.js
function initLocalization() {
  const switchers = document.querySelectorAll('[data-localization-select]');
  switchers && switchers.forEach(function (select) {
    select.addEventListener('change', function (e) {
      const value = e.target.value;
      const form = select.closest('[data-localization-form]');
      const input = form.querySelector('input[data-localization-input]');
      input && input.setAttribute('value', value);
      input && form.submit();
    });
  });
}
;// CONCATENATED MODULE: ./src/js/utilities/index.js
/* provided dependency */ var utilities_createElement = __webpack_require__(6295)["default"];






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
const utilities_camelCaseToSnakeCase = str => str.replace(/[A-Z]/g, $1 => `_${$1.toLowerCase()}`);
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
  const d = utilities_createElement("div", null);
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
;// CONCATENATED MODULE: ./src/js/modules/mega-menu.js



class Megamenu {
  constructor(container) {
    _defineProperty(this, "selectors", {
      hamburgerButtons: ['.sf-menu-button'],
      menuWrapper: '.sf-menu-wrapper',
      menu: '.sf-menu-content',
      links: ['.sf-link'],
      userSection: '.sf-customer-section',
      desktopMenuItems: ['.sf-menu-item'],
      desktopSubMenus: '.sf-menu__desktop-sub-menu'
    });

    _defineProperty(this, "menuSelectors", {
      subMenu: '.sf-menu__desktop-sub-menu'
    });

    _defineProperty(this, "signInTabSelectors", {
      button: '.my-account-btn.signin',
      header: '.tab-header input.signin',
      content: '.tab-content.signin'
    });

    _defineProperty(this, "registerTabSelectors", {
      button: '.my-account-btn.register',
      header: '.tab-header input.register',
      content: '.tab-content.register'
    });

    _defineProperty(this, "activeDesktopMenuItem", null);

    _defineProperty(this, "sliders", {});

    _defineProperty(this, "closeDesktopSubmenu", menuItemIndex => {
      var _header$classList;

      const menuItem = this.menuData[menuItemIndex];
      const {
        header
      } = menuItem;
      header === null || header === void 0 ? void 0 : (_header$classList = header.classList) === null || _header$classList === void 0 ? void 0 : _header$classList.remove('show-menu');
    });

    this.container = container;
    this.transitionDuration = 300;
    this.domNodes = queryDomNodes(this.selectors);
    this.menuData = [...this.domNodes.desktopMenuItems].map(item => {
      const header = item.closest('header');
      const menuNodes = queryDomNodes(this.menuSelectors, item);
      return {
        header,
        item,
        ...menuNodes,
        active: false
      };
    });

    if (this.domNodes.userSection) {
      this.accountTabs = {
        signin: queryDomNodes(this.signInTabSelectors, this.container),
        register: queryDomNodes(this.registerTabSelectors, this.container)
      };
      this.domNodes.closeBtn = this.domNodes.userSection.querySelector('.close-btn');
    }

    this.init();
    window.spratlyTheme = window.spratlyTheme || {};
    window.spratlyTheme.headerSliders = this.sliders;
  }

  init() {
    [...this.domNodes.hamburgerButtons].forEach(btn => {
      btn.addEventListener("click", () => {
        document.documentElement.classList.add('prevent-scroll');
        this.openMenu();
      });
    });
    this.domNodes.menuWrapper.addEventListener("click", e => {
      if (e.target === this.domNodes.menuWrapper) {
        this.closeMenu();
      }
    });
    this.initMobileMegaMenu();

    if (this.domNodes.userSection) {
      this.initUserSection();
    }

    this.initDesktopMegaMenu();
  }

  initDesktopMegaMenu() {
    [...this.menuData].forEach(menuItem => {
      const {
        item,
        subMenu
      } = menuItem;

      if (subMenu) {
        const productsBanner = subMenu.querySelector('.sf-mega-menu-products');

        if (productsBanner) {
          var _window;

          if ((_window = window) !== null && _window !== void 0 && _window.__sfWindowLoaded) {
            menuItem.productsBannerSlider = this.initProductsBanner(productsBanner);
          } else {
            window.addEventListener("load", () => {
              menuItem.productsBannerSlider = this.initProductsBanner(productsBanner);
            });
          }
        }
      } // if (item?.classList?.contains('sf-menu-item--no-mega')) {
      //     const menuWrap = item.querySelector('.sf-menu__dropdown')
      //     let itemPos = item.getBoundingClientRect()
      //     let itemPosOb = {
      //         bottom: itemPos.bottom,
      //         left: itemPos.left,
      //         paddingBottom: window.getComputedStyle(item.firstElementChild, null).getPropertyValue('padding-bottom')
      //     }
      //     if(menuWrap) {
      //         menuWrap.style.bottom = -itemPosOb.bottom + itemPosOb.paddingBottom + 'px'
      //         menuWrap.style.left = itemPosOb.left + 'px'
      //         item?.addEventListener('mouseover', () => {
      //             itemPos = item.getBoundingClientRect()
      //             itemPosOb['bottom'] = itemPos.bottom
      //             itemPosOb['left'] = itemPos.left
      //             menuWrap.style.bottom = -itemPosOb.bottom + itemPosOb.paddingBottom + 'px'
      //             menuWrap.style.left = itemPosOb.left + 'px'
      //         })
      //     }
      // }

    });
  }

  initProductsBanner(banner) {
    var _header$dataset, _window2, _window3;

    const header = banner.closest('header');
    const menuItem = banner.closest('.sf-menu-item');
    const screenClass = `.${header === null || header === void 0 ? void 0 : (_header$dataset = header.dataset) === null || _header$dataset === void 0 ? void 0 : _header$dataset.screen}` || '';
    const id = banner.dataset.id;
    const sliderContainer = document.querySelector(`.sf-slider-${id}`);
    const columns = sliderContainer.dataset.column;
    let slider;
    loadCSS((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.themeStyleURLs.swiper.url);
    loadJS((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.themeScriptURLs.swiper.url).then(() => {
      slider = new window.spratlyTheme.Swiper(`${screenClass} .sf-slider-${id}`, {
        slidesPerView: 1,
        loop: false,
        autoplay: false,
        breakpoints: {
          1200: {
            slidesPerView: columns
          },
          992: {
            slidesPerView: columns >= 2 ? 2 : columns
          }
        }
      });
      this.sliders[menuItem.dataset.index] = slider;

      if (slider) {
        const prevBtn = document.querySelector(`#sf-slider-controls-${id} .sf-slider__controls-prev`);
        const nextBtn = document.querySelector(`#sf-slider-controls-${id} .sf-slider__controls-next`);
        prevBtn && prevBtn.addEventListener('click', () => slider.slidePrev());
        nextBtn && nextBtn.addEventListener('click', () => slider.slideNext());
      }
    });
  }

  initMobileMegaMenu() {
    [...this.domNodes.links].forEach(link => {
      const subLinks = link.querySelector('.sf-sub-links');
      const backBtn = link.querySelector('.back');

      if (subLinks) {
        link.addEventListener('click', e => {
          const parentNode = e.target.parentNode;

          if (e.target.classList.contains('back') || parentNode.classList.contains('back')) {
            return;
          }

          this.openSubMenu(subLinks);
        });
      }

      if (backBtn) {
        backBtn.addEventListener("click", () => this.closeSubMenu(subLinks));
      }
    });
  }

  initUserSection() {
    document.body.appendChild(this.domNodes.userSection);
    let activeTab = this.accountTabs['signin'].content;
    Object.values(this.accountTabs).forEach(({
      button,
      header,
      content
    }) => {
      header.addEventListener('click', () => {
        activeTab.classList.add('hidden');
        content.classList.remove('hidden');
        activeTab = content;
      });
      button.addEventListener('click', () => {
        header.click();
        this.domNodes.userSection.classList.add('-translate-x-full');
        this.closeMenu();
      });
    });
    this.domNodes.closeBtn.addEventListener('click', () => {
      this.domNodes.userSection.classList.remove('-translate-x-full');
    });
  } //////////////// MOBILE MENU EVENTS


  openMenu() {
    const {
      menuWrapper
    } = this.domNodes;
    menuWrapper.style.setProperty('--window-inner-height', `${window.innerHeight}px`);
    menuWrapper.classList.remove('hidden');
    setTimeout(() => {
      menuWrapper.style.setProperty('--tw-bg-opacity', '0.3');
      menuWrapper.firstElementChild.classList.remove('-translate-x-full');
    });
  }

  closeMenu() {
    const {
      menuWrapper,
      menu
    } = this.domNodes;
    menuWrapper.style.setProperty('--tw-bg-opacity', '0');
    menuWrapper.firstElementChild.classList.add('-translate-x-full');
    setTimeout(() => {
      menuWrapper.classList.add('hidden');
      document.documentElement.classList.remove('prevent-scroll');
      menu.classList.remove('sf-sub-menu-open');
      menu.classList.remove('-translate-x-full'); // Close search
    }, this.transitionDuration);
  }

  openSubMenu(subLinks) {
    subLinks.classList.add('flex');
    subLinks.classList.remove('hidden');
    this.domNodes.menu.classList.add('-translate-x-full');
    setTimeout(() => {
      this.domNodes.menu.classList.add('sf-sub-menu-open');
    }, this.transitionDuration);
  }

  closeSubMenu(subLinks) {
    this.domNodes.menu.classList.remove('sf-sub-menu-open');
    this.domNodes.menu.classList.remove('-translate-x-full');
    setTimeout(() => {
      subLinks.classList.add('hidden');
    }, this.transitionDuration);
  }

}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-currency/currency.js
/**
 * Currency Helpers
 * -----------------------------------------------------------------------------
 * A collection of useful functions that help with currency formatting
 *
 * Current contents
 * - formatMoney - Takes an amount in cents and returns it as a formatted dollar value.
 *
 */
const moneyFormat = '${{amount}}';
/**
 * Format money values based on your shop currency settings
 * @param  {Number|string} cents - value in cents or dollar amount e.g. 300 cents
 * or 3.00 dollars
 * @param  {String} format - shop money_format setting
 * @return {String} value - formatted value
 */

function formatMoney(cents, format) {
  if (typeof cents === 'string') {
    cents = cents.replace('.', '');
  }

  let value = '';
  const placeholderRegex = /\{\{\s*(\w+)\s*\}\}/;
  const formatString = format || moneyFormat;

  function formatWithDelimiters(number, precision = 2, thousands = ',', decimal = '.') {
    if (isNaN(number) || number == null) {
      return 0;
    }

    number = (number / 100.0).toFixed(precision);
    const parts = number.split('.');
    const dollarsAmount = parts[0].replace(/(\d)(?=(\d\d\d)+(?!\d))/g, `$1${thousands}`);
    const centsAmount = parts[1] ? decimal + parts[1] : '';
    return dollarsAmount + centsAmount;
  }

  switch (formatString.match(placeholderRegex)[1]) {
    case 'amount':
      value = formatWithDelimiters(cents, 2);
      break;

    case 'amount_no_decimals':
      value = formatWithDelimiters(cents, 0);
      break;

    case 'amount_with_comma_separator':
      value = formatWithDelimiters(cents, 2, '.', ',');
      break;

    case 'amount_no_decimals_with_comma_separator':
      value = formatWithDelimiters(cents, 0, '.', ',');
      break;
  }

  return formatString.replace(placeholderRegex, value);
}
;// CONCATENATED MODULE: ./src/js/components/SearchProductItem.jsx
/* provided dependency */ var SearchProductItem_createElement = __webpack_require__(6295)["default"];
// eslint-disable-next-line no-unused-vars


/* harmony default export */ function SearchProductItem({
  product
}) {
  var _window2, _window2$spratlyTheme, _product$featured_ima, _product$featured_ima2;

  let aspectRatio = product.featured_image.aspect_ratio;

  if (window.adminThemeSettings.pcard_image_ratio !== 'original') {
    aspectRatio = window.adminThemeSettings.pcard_image_ratio;
  }

  const style = {
    '--aspect-ratio': aspectRatio
  };
  let comparePrice = null;

  if (Number(product.compare_at_price_max)) {
    var _window, _window$spratlyThemeS;

    comparePrice = SearchProductItem_createElement("span", {
      className: "sf-currency text-color-secondary text-sm line-through mr-2"
    });
    comparePrice.innerHTML = formatMoney(product.compare_at_price_max, (_window = window) === null || _window === void 0 ? void 0 : (_window$spratlyThemeS = _window.spratlyThemeSettings) === null || _window$spratlyThemeS === void 0 ? void 0 : _window$spratlyThemeS.money_format);
  }

  const price = SearchProductItem_createElement("span", {
    className: "sf-currency"
  });
  price.innerHTML = formatMoney(product.price, (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$spratlyTheme = _window2.spratlyThemeSettings) === null || _window2$spratlyTheme === void 0 ? void 0 : _window2$spratlyTheme.money_format);
  return SearchProductItem_createElement("a", {
    href: product.url,
    className: "mb-3 flex flex-col group",
    dataSet: {
      productId: product === null || product === void 0 ? void 0 : product.id
    }
  }, SearchProductItem_createElement("div", {
    className: "mb-3 w-full",
    style: style
  }, SearchProductItem_createElement(LazyImage, {
    src: product === null || product === void 0 ? void 0 : (_product$featured_ima = product.featured_image) === null || _product$featured_ima === void 0 ? void 0 : _product$featured_ima.url,
    alt: product === null || product === void 0 ? void 0 : (_product$featured_ima2 = product.featured_image) === null || _product$featured_ima2 === void 0 ? void 0 : _product$featured_ima2.alt
  }), product.available ? null : SearchProductItem_createElement("span", {
    class: "absolute prod__tag prod__tag--soldout"
  }, window.spratlyThemeStrings.soldOut || 'Sold Out')), SearchProductItem_createElement("div", {
    className: "md:ml-0 w-full"
  }, SearchProductItem_createElement("p", {
    className: "font-medium group-hover:text-color-primary-darker"
  }, product.title), SearchProductItem_createElement("div", {
    className: "mt-1"
  }, SearchProductItem_createElement("span", {
    className: 'text-color-sale-price'
  }, comparePrice), SearchProductItem_createElement("span", {
    className: 'text-color-regular-price'
  }, price))));
}
;// CONCATENATED MODULE: ./src/js/modules/search.js
/* provided dependency */ var search_createElement = __webpack_require__(6295)["default"];

// eslint-disable-next-line no-unused-vars





class Search {
  constructor() {
    _defineProperty(this, "selectors", {
      container: '[data-search-container]',
      logo: '.sf-logo-default',
      form: 'form',
      input: '[data-search-input]',
      submit: 'button[type="submit"]',
      loading: '[data-spinner]',
      clear: '[data-clear-search]',
      close: '[data-close-search]',
      moreResult: '[data-more-result]',
      resultContent: '[data-result]',
      popularSearches: '[data-popular-searches]',
      popularSearchItems: ['[data-ps-item]'],
      searchItemsWrapper: '[data-search-items-wrapper]',
      searchItems: ['[data-search-item]'],
      searchQuery: '[data-query]',
      searchMessage: '[data-message]'
    });

    _defineProperty(this, "searchInputs", []);

    _defineProperty(this, "transitionDuration", 300);

    _defineProperty(this, "currScreen", '');

    _defineProperty(this, "predictiveSearch", void 0);

    _defineProperty(this, "enablePredictiveSearch", true);

    _defineProperty(this, "init", () => {
      const searchPopup = document.querySelector('[data-search-popup]');
      if (!searchPopup) return;
      this.enablePredictiveSearch = searchPopup.dataset.enablePredictiveSearch === "true";
      this.domNodes = queryDomNodes(this.selectors, searchPopup);
      this.domNodes.searchPopup = searchPopup;
      document.body.appendChild(searchPopup);
      addEventDelegate({
        selector: '[data-open-search-popup]',
        handler: () => this.toggleSearchPopup(true)
      });
      const {
        input,
        submit,
        clear,
        close,
        logo,
        form
      } = this.domNodes;
      if (logo) logo.style = "";

      if (this.enablePredictiveSearch) {
        this.initPredictiveSearch();
        input.addEventListener('input', () => {
          const query = input.value;

          if (query) {
            this.toggleSpinnerLoading(true);
            this.toggleClearSearch(true);
            this.predictiveSearch.query(query);
          } else {
            this.toggleSpinnerLoading(false);
            this.toggleClearSearch(false);
            this.toggleSearchContent(false);
            this.togglePopularSearches(true);
          }
        });
      }

      input === null || input === void 0 ? void 0 : input.addEventListener('keydown', e => {
        // ESC
        if (e.keyCode === 27) {
          this.toggleSearchPopup(false);
        }
      });
      submit.addEventListener('click', e => {
        e.preventDefault();

        if (input.value) {
          form.submit();
        }
      });
      clear.addEventListener('click', () => {
        clear.style.visibility = "hidden";
        input.value = "";
        input.focus();
        this.toggleSpinnerLoading(false);
        this.toggleSearchContent(false);
        this.togglePopularSearches(true);
      });
      close.addEventListener('click', e => {
        this.toggleSearchPopup(false);
      });
      searchPopup.addEventListener('click', e => {
        if (e.target === searchPopup) {
          this.toggleSearchPopup(false);
        }
      });
      this.setPopularSearchesLink();
    });

    _defineProperty(this, "setPopularSearchesLink", () => {
      const {
        popularSearchItems
      } = this.domNodes;
      popularSearchItems.forEach(itm => itm.href = createSearchLink(itm.dataset.psQuery));
    });

    _defineProperty(this, "toggleSpinnerLoading", show => {
      const {
        loading,
        submit
      } = this.domNodes;
      submit.style.visibility = show ? 'hidden' : 'visible';
      loading.style.visibility = show ? 'visible' : 'hidden';
    });

    _defineProperty(this, "togglePopularSearches", show => {
      const {
        popularSearches
      } = this.domNodes;
      popularSearches.style.display = show ? "" : "none";
    });

    _defineProperty(this, "toggleClearSearch", show => {
      const {
        clear
      } = this.domNodes;
      clear.style.visibility = show ? "visible" : "hidden";
    });

    _defineProperty(this, "toggleSearchContent", show => {
      var _resultContent$classL;

      const {
        resultContent
      } = this.domNodes;
      const method = show ? 'remove' : 'add';
      resultContent === null || resultContent === void 0 ? void 0 : (_resultContent$classL = resultContent.classList) === null || _resultContent$classL === void 0 ? void 0 : _resultContent$classL[method]('hidden');
    });

    _defineProperty(this, "initPredictiveSearch", () => {
      this.createPredictiveSearchInstance();
      this.predictiveSearch.on("success", suggestions => {
        try {
          var _suggestions$resource, _suggestions$resource2;

          const productSuggestions = (suggestions === null || suggestions === void 0 ? void 0 : (_suggestions$resource = suggestions.resources) === null || _suggestions$resource === void 0 ? void 0 : (_suggestions$resource2 = _suggestions$resource.results) === null || _suggestions$resource2 === void 0 ? void 0 : _suggestions$resource2.products) ?? [];
          this.toggleSpinnerLoading(false);
          this.renderSearchQueryAndMessage(productSuggestions.length);
          this.togglePopularSearches(!productSuggestions.length);
          this.renderSearchResult(productSuggestions);
          this.toggleSearchContent(true);
        } catch (err) {
          console.error(err);
          throw err;
        }
      });
      this.predictiveSearch.on("error", console.error);
    });

    _defineProperty(this, "createPredictiveSearchInstance", () => {
      if (this.predictiveSearch) return;
      const {
        searchByTag,
        searchByBody,
        unavailableProductsOption
      } = this.domNodes.searchPopup.dataset || {};
      const fields = [PredictiveSearch.FIELDS.TITLE, PredictiveSearch.FIELDS.VENDOR, PredictiveSearch.FIELDS.PRODUCT_TYPE, PredictiveSearch.FIELDS.VARIANTS_TITLE];

      if (searchByTag === "true") {
        fields.push(PredictiveSearch.FIELDS.TAG);
      }

      if (searchByBody === "true") {
        fields.push(PredictiveSearch.FIELDS.BODY);
      }

      this.predictiveSearch = new PredictiveSearch({
        resources: {
          type: [PredictiveSearch.TYPES.PRODUCT],
          limit: 10,
          options: {
            unavailable_products: PredictiveSearch.UNAVAILABLE_PRODUCTS[unavailableProductsOption],
            fields
          }
        }
      });
    });

    _defineProperty(this, "renderSearchQueryAndMessage", results => {
      const {
        input,
        searchQuery,
        moreResult,
        searchMessage
      } = this.domNodes;
      const query = input.value;
      const {
        resultsOne,
        resultsOther
      } = searchMessage.dataset;

      const _resultsOne = resultsOne.replace(/\"{{ terms }}\"/, "").trim();

      const _resultsOther = resultsOther.replace(/\"{{ terms }}\"/, "").trim();

      const msg = results === 1 ? _resultsOne : _resultsOther;
      searchMessage.textContent = msg.replace("{{ count }}", results);
      searchQuery.textContent = query;

      if (results) {
        moreResult.parentElement.style.display = "";
        moreResult.href = createSearchLink(query);
      } else {
        searchMessage.textContent = searchMessage.dataset.noResults;
        moreResult.parentElement.style.display = "none";
      }
    });

    _defineProperty(this, "renderSearchResult", productSuggestions => {
      const {
        searchItems,
        searchItemsWrapper
      } = this.domNodes;
      searchItemsWrapper.style.display = productSuggestions.length ? '' : 'none';
      searchItems.forEach((item, ind) => {
        if (ind >= productSuggestions.length) {
          item.classList.add('hidden');
        } else {
          const newItem = search_createElement(SearchProductItem, {
            product: productSuggestions[ind]
          });
          const currItem = item.firstChild;

          if (!currItem) {
            item.appendChild(newItem);
          } else {
            var _currItem$dataset;

            if (Number(currItem === null || currItem === void 0 ? void 0 : (_currItem$dataset = currItem.dataset) === null || _currItem$dataset === void 0 ? void 0 : _currItem$dataset.productId) !== productSuggestions[ind].id) {
              animateReplace(currItem, newItem);
            }
          }

          item.classList.remove('hidden');
        }
      });
    });

    _defineProperty(this, "toggleSearchPopup", show => {
      const {
        searchPopup,
        input,
        container
      } = this.domNodes;

      if (show) {
        searchPopup.classList.remove('invisible');
        searchPopup.classList.add('opacity-100');
        container.classList.add('md:translate-y-0');
        setTimeout(() => {
          container.classList.remove('duration-300');
        }, this.transitionDuration);
        input.focus(); // document.documentElement.classList.add('prevent-scroll')
      } else {
        container.classList.remove('md:translate-y-0');
        searchPopup.classList.remove('opacity-100');
        setTimeout(() => {
          searchPopup.classList.add('invisible');
          container.classList.add('duration-300');
        }, this.transitionDuration); // document.documentElement.classList.remove('prevent-scroll')
      }
    });

    this.init();
  }

}

/* harmony default export */ var search = (new Search());
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-product/theme-product.js
/**
 * Returns a product JSON object when passed a product URL
 * @param {*} url
 */
function getProductJson(handle) {
  return fetch('/products/' + handle + '.js').then(function (response) {
    return response.json();
  });
}
/**
 * Find a match in the project JSON (using a ID number) and return the variant (as an Object)
 * @param {Object} product Product JSON object
 * @param {Number} value Accepts Number (e.g. 6908023078973)
 * @returns {Object} The variant object once a match has been successful. Otherwise null will be return
 */

function getVariantFromId(product, value) {
  _validateProductStructure(product);

  if (typeof value !== 'number') {
    throw new TypeError(value + ' is not a Number.');
  }

  var result = product.variants.filter(function (variant) {
    return variant.id === value;
  });
  return result[0] || null;
}
/**
 * Convert the Object (with 'name' and 'value' keys) into an Array of values, then find a match & return the variant (as an Object)
 * @param {Object} product Product JSON object
 * @param {Object} collection Object with 'name' and 'value' keys (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
 */

function getVariantFromSerializedArray(product, collection) {
  _validateProductStructure(product); // If value is an array of options


  var optionArray = _createOptionArrayFromOptionCollection(product, collection);

  return getVariantFromOptionArray(product, optionArray);
}
/**
 * Find a match in the project JSON (using Array with option values) and return the variant (as an Object)
 * @param {Object} product Product JSON object
 * @param {Array} options List of submitted values (e.g. ['36', 'Black'])
 * @returns {Object || null} The variant object once a match has been successful. Otherwise null will be returned
 */

function getVariantFromOptionArray(product, options) {
  _validateProductStructure(product);

  _validateOptionsArray(options);

  var result = product.variants.filter(function (variant) {
    return options.every(function (option, index) {
      return variant.options[index] === option;
    });
  });
  return result[0] || null;
}
/**
 * Creates an array of selected options from the object
 * Loops through the project.options and check if the "option name" exist (product.options.name) and matches the target
 * @param {Object} product Product JSON object
 * @param {Array} collection Array of object (e.g. [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }])
 * @returns {Array} The result of the matched values. (e.g. ['36', 'Black'])
 */

function _createOptionArrayFromOptionCollection(product, collection) {
  _validateProductStructure(product);

  _validateSerializedArray(collection);

  var optionArray = [];
  collection.forEach(function (option) {
    for (var i = 0; i < product.options.length; i++) {
      if (product.options[i].name.toLowerCase() === option.name.toLowerCase()) {
        optionArray[i] = option.value;
        break;
      }
    }
  });
  return optionArray;
}
/**
 * Check if the product data is a valid JS object
 * Error will be thrown if type is invalid
 * @param {object} product Product JSON object
 */


function _validateProductStructure(product) {
  if (typeof product !== 'object') {
    throw new TypeError(product + ' is not an object.');
  }

  if (Object.keys(product).length === 0 && product.constructor === Object) {
    throw new Error(product + ' is empty.');
  }
}
/**
 * Validate the structure of the array
 * It must be formatted like jQuery's serializeArray()
 * @param {Array} collection Array of object [{ name: "Size", value: "36" }, { name: "Color", value: "Black" }]
 */


function _validateSerializedArray(collection) {
  if (!Array.isArray(collection)) {
    throw new TypeError(collection + ' is not an array.');
  }

  if (collection.length === 0) {
    return [];
  }

  if (collection[0].hasOwnProperty('name')) {
    if (typeof collection[0].name !== 'string') {
      throw new TypeError('Invalid value type passed for name of option ' + collection[0].name + '. Value should be string.');
    }
  } else {
    throw new Error(collection[0] + 'does not contain name key.');
  }
}
/**
 * Validate the structure of the array
 * It must be formatted as list of values
 * @param {Array} collection Array of object (e.g. ['36', 'Black'])
 */


function _validateOptionsArray(options) {
  if (Array.isArray(options) && typeof options[0] === 'object') {
    throw new Error(options + 'is not a valid array of options.');
  }
}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-product-form/listeners.js
function Listeners() {
  this.entries = [];
}

Listeners.prototype.add = function (element, event, fn) {
  this.entries.push({
    element: element,
    event: event,
    fn: fn
  });
  element.addEventListener(event, fn);
};

Listeners.prototype.removeAll = function () {
  this.entries = this.entries.filter(function (listener) {
    listener.element.removeEventListener(listener.event, listener.fn);
    return false;
  });
};
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-product-form/theme-product-form.js


var selectors = {
  idInput: '[name="id"]',
  optionInput: '[name^="options"]',
  quantityInput: '[name="quantity"]',
  propertyInput: '[name^="properties"]'
}; // Public Methods
// -----------------------------------------------------------------------------

/**
 * Returns a URL with a variant ID query parameter. Useful for updating window.history
 * with a new URL based on the currently select product variant.
 * @param {string} url - The URL you wish to append the variant ID to
 * @param {number} id  - The variant ID you wish to append to the URL
 * @returns {string} - The new url which includes the variant ID query parameter
 */

function getUrlWithVariant(url, id) {
  if (/variant=/.test(url)) {
    return url.replace(/(variant=)[^&]+/, '$1' + id);
  } else if (/\?/.test(url)) {
    return url.concat('&variant=').concat(id);
  }

  return url.concat('?variant=').concat(id);
}
/**
 * Constructor class that creates a new instance of a product form controller.
 *
 * @param {Element} element - DOM element which is equal to the <form> node wrapping product form inputs
 * @param {Object} product - A product object
 * @param {Object} options - Optional options object
 * @param {Function} options.onOptionChange - Callback for whenever an option input changes
 * @param {Function} options.onQuantityChange - Callback for whenever an quantity input changes
 * @param {Function} options.onPropertyChange - Callback for whenever a property input changes
 * @param {Function} options.onFormSubmit - Callback for whenever the product form is submitted
 */

function ProductForm(element, product, options) {
  this.element = element;
  this.product = _validateProductObject(product);
  options = options || {};
  this._listeners = new Listeners();

  this._listeners.add(this.element, 'submit', this._onSubmit.bind(this, options));

  this.optionInputs = this._initInputs(selectors.optionInput, options.onOptionChange);
  this.quantityInputs = this._initInputs(selectors.quantityInput, options.onQuantityChange);
  this.propertyInputs = this._initInputs(selectors.propertyInput, options.onPropertyChange);
}
/**
 * Cleans up all event handlers that were assigned when the Product Form was constructed.
 * Useful for use when a section needs to be reloaded in the theme editor.
 */

ProductForm.prototype.destroy = function () {
  this._listeners.removeAll();
};
/**
 * Getter method which returns the array of currently selected option values
 *
 * @returns {Array} An array of option values
 */


ProductForm.prototype.options = function () {
  return _serializeOptionValues(this.optionInputs, function (item) {
    var regex = /(?:^(options\[))(.*?)(?:\])/;
    item.name = regex.exec(item.name)[2]; // Use just the value between 'options[' and ']'

    return item;
  });
};
/**
 * Getter method which returns the currently selected variant, or `null` if variant
 * doesn't exist.
 *
 * @returns {Object|null} Variant object
 */


ProductForm.prototype.variant = function () {
  return getVariantFromSerializedArray(this.product, this.options());
};
/**
 * Getter method which returns a collection of objects containing name and values
 * of property inputs
 *
 * @returns {Array} Collection of objects with name and value keys
 */


ProductForm.prototype.properties = function () {
  var properties = _serializePropertyValues(this.propertyInputs, function (propertyName) {
    var regex = /(?:^(properties\[))(.*?)(?:\])/;
    var name = regex.exec(propertyName)[2]; // Use just the value between 'properties[' and ']'

    return name;
  });

  return Object.entries(properties).length === 0 ? null : properties;
};
/**
 * Getter method which returns the current quantity or 1 if no quantity input is
 * included in the form
 *
 * @returns {Array} Collection of objects with name and value keys
 */


ProductForm.prototype.quantity = function () {
  return this.quantityInputs[0] ? Number.parseInt(this.quantityInputs[0].value, 10) : 1;
}; // Private Methods
// -----------------------------------------------------------------------------


ProductForm.prototype._setIdInputValue = function (value) {
  var idInputElement = this.element.querySelector(selectors.idInput);

  if (!idInputElement) {
    idInputElement = document.createElement('input');
    idInputElement.type = 'hidden';
    idInputElement.name = 'id';
    this.element.appendChild(idInputElement);
  }

  idInputElement.value = value.toString();
};

ProductForm.prototype._onSubmit = function (options, event) {
  event.dataset = this._getProductFormEventData();

  if (event.dataset.variant) {
    this._setIdInputValue(event.dataset.variant.id);
  }

  if (options.onFormSubmit) {
    options.onFormSubmit(event);
  }
};

ProductForm.prototype._onFormEvent = function (cb) {
  if (typeof cb === 'undefined') {
    return Function.prototype;
  }

  return function (event) {
    event.dataset = this._getProductFormEventData();
    cb(event);
  }.bind(this);
};

ProductForm.prototype._initInputs = function (selector, cb) {
  var elements = Array.prototype.slice.call(this.element.querySelectorAll(selector));
  return elements.map(function (element) {
    this._listeners.add(element, 'change', this._onFormEvent(cb));

    return element;
  }.bind(this));
};

ProductForm.prototype._getProductFormEventData = function () {
  return {
    options: this.options(),
    variant: this.variant(),
    properties: this.properties(),
    quantity: this.quantity()
  };
};

function _serializeOptionValues(inputs, transform) {
  return inputs.reduce(function (options, input) {
    if (input.checked || // If input is a checked (means type radio or checkbox)
    input.type !== 'radio' && input.type !== 'checkbox' // Or if its any other type of input
    ) {
      options.push(transform({
        name: input.name,
        value: input.value
      }));
    }

    return options;
  }, []);
}

function _serializePropertyValues(inputs, transform) {
  return inputs.reduce(function (properties, input) {
    if (input.checked || // If input is a checked (means type radio or checkbox)
    input.type !== 'radio' && input.type !== 'checkbox' // Or if its any other type of input
    ) {
      properties[transform(input.name)] = input.value;
    }

    return properties;
  }, {});
}

function _validateProductObject(product) {
  if (typeof product !== 'object') {
    throw new TypeError(product + ' is not an object.');
  }

  if (typeof product.variants[0].options === 'undefined') {
    throw new TypeError('Product object is invalid. Make sure you use the product object that is output from {{ product | json }} or from the http://[your-product-url].js route');
  }

  return product;
}
;// CONCATENATED MODULE: ./src/js/utilities/product-fns.js
/* provided dependency */ var product_fns_createElement = __webpack_require__(6295)["default"];


const themeProducts = window._themeProducts || {};
const fetchProductByHandle = async handle => {
  const product = await (0,utilities_fetch.fetchJsonCache)(`/products/${handle}.js`, {
    cache: 'force-cache'
  }).catch(console.error);

  if (product) {
    themeProducts[product.id] = product;
    return product;
  }

  return false;
};
const getProductData = async ({
  productId,
  productHandle
}) => {
  var _productData, _productData2;

  let productData = themeProducts[productId];

  if (!productData) {
    productData = await fetchProductByHandle(productHandle).catch(console.error);
  }

  productData.has_only_default_variant = ((_productData = productData) === null || _productData === void 0 ? void 0 : _productData.has_only_default_variant) || productHasOnlyDefaultVariant((_productData2 = productData) === null || _productData2 === void 0 ? void 0 : _productData2.options);
  return productData;
};
const getProductJSON = async handle => {
  const html = await fetchCache(`/products/${handle}?section_id=product-json`);

  if (html && !/^<!doctype html>/.test(html)) {
    const node = product_fns_createElement("div", null);
    node.innerHTML = html;
    const productJSONNode = node.querySelector('script.product-json');

    if (productJSONNode) {
      const data = JSON.parse(productJSONNode.innerText);

      if (data) {
        const {
          dataset
        } = productJSONNode;
        Object.entries(dataset).forEach(([k, v]) => data[camelCaseToSnakeCase(k)] = ['true', 'false'].indexOf(v) + 1 ? v === "true" : v);
        const selectedVariantNode = node.querySelector('script.selected-variant-json');

        if (selectedVariantNode) {
          data.selected_or_first_available_variant = JSON.parse(selectedVariantNode.innerText);
        }

        return data;
      }
    }
  }

  return null;
};
const getProductsJSON = async handles => {
  const productData = {};
  const promises = handles.map(async hdl => {
    productData[hdl] = await getProductJSON(hdl);
  });
  await Promise.all(promises);
  return handles.map(hdl => productData[hdl]);
};
const productHasOnlyDefaultVariant = prodOptions => {
  if (Array.isArray(prodOptions) && prodOptions.length === 1) {
    var _firstOption$values;

    const firstOption = prodOptions[0];

    if ((firstOption === null || firstOption === void 0 ? void 0 : firstOption.name) === "Title" && (firstOption === null || firstOption === void 0 ? void 0 : (_firstOption$values = firstOption.values) === null || _firstOption$values === void 0 ? void 0 : _firstOption$values.join()) === "Default Title") {
      return true;
    }
  }

  return false;
};
const getProductInstances = query => {
  let fieldSearch = 'id';

  if (typeof query === "string") {
    fieldSearch = 'handle';
  }

  return window.spratlyTheme.Products.productInstances.filter(pro => pro.productData[fieldSearch] === query);
};
window._getProductInstances = getProductInstances;
const getThemeProductSettings = () => {
  if (window.themeProductSettings) {
    return window.themeProductSettings;
  }

  const {
    spratlyThemeSettings,
    adminThemeSettings: {
      product_colors,
      use_ajax_atc
    },
    money_format
  } = window;
  let colorSwatch = [];
  let imageSwatch = [];

  try {
    colorSwatch = product_colors.split(',').filter(Boolean).map(item => {
      const [key, value] = item.split(':');
      return {
        key: key.trim().toLowerCase(),
        value: value.trim(),
        type: 'color'
      };
    });
    Object.keys(spratlyThemeSettings).forEach(key => {
      if (key.includes('filter_color') && !key.includes('.png')) {
        if (spratlyThemeSettings[`${key}.png`]) {
          imageSwatch.push({
            type: 'image',
            key: spratlyThemeSettings[key].toLowerCase(),
            value: spratlyThemeSettings[`${key}.png`]
          });
        }
      }
    });
  } catch (e) {
    console.error('Failed to convert color/image swatch structure!', e);
  }

  const productSettings = {
    colorSwatch,
    imageSwatch,
    use_ajax_atc,
    money_format
  };
  window.themeProductSettings = productSettings;
  return productSettings;
};
const isValidColor = strColor => {
  strColor = strColor.replace(/\s/g, '').toLowerCase();
  let s = new Option().style;
  s.color = strColor;
  return s.color === strColor;
};
const getOptionValueFromOptionNode = optNode => {
  if (optNode.type === 'checkbox') {
    return optNode.value;
  }

  if (optNode.tagName === 'OPTION') {
    const select = optNode.closest('select');
    return select.value;
  }

  return optNode.innerText.trim();
};
;// CONCATENATED MODULE: ./src/js/data/product-slider.config.js
const commonConfigs = {
  loop: true
};
const configs = {
  'mobile': {
    autoHeight: true,
    loop: true
  },
  'quick-view': {
    autoHeight: true
  },
  'layout-4': {},
  'layout-5': {
    slidesPerView: 1,
    slidesPerGroup: 1,
    watchSlidesProgress: true,
    watchSlidesVisibility: true,
    breakpoints: {
      768: {
        slidesPerView: 2,
        slidesPerGroup: 2,
        spaceBetween: 10
      }
    }
  },
  'layout-6': {},
  'layout-7': {
    slidesPerView: 3,
    speed: 500,
    centeredSlides: true
  }
};
function getProductSliderConfig(layout) {
  const conf = configs[layout] || configs['layout-4'];
  return Object.assign({}, commonConfigs, conf);
}
// EXTERNAL MODULE: ./node_modules/enquire.js/src/index.js
var src = __webpack_require__(1179);
var src_default = /*#__PURE__*/__webpack_require__.n(src);
// EXTERNAL MODULE: ./src/js/libs/resizeSensor.js
var resizeSensor = __webpack_require__(7066);
;// CONCATENATED MODULE: ./src/js/modules/product-helper.js








class ProductHelper {
  // "galley" || "slider" || "featured-image"
  // 'sticky-atc' || 'card' || 'quick-view' || 'mobile' || 'product-template'
  constructor({
    container,
    productData
  }) {
    var _container$dataset;

    _defineProperty(this, "mediaMode", '');

    _defineProperty(this, "view", '');

    _defineProperty(this, "selectors", {
      productSection: '[data-section-type="product-page"]',
      infoWrapper: '.sf-prod__info-wrapper',
      info: '.sf-prod__info',
      featuredImage: '.spc__main-img',
      mediaWrapper: '.sf-prod-media__wrapper',
      previewWrapper: '.sf-preview__wrapper',
      mediaDesktop: '.sf-product-media__desktop',
      mediaMobile: '.sf-product-media__mobile',
      slider: '.swiper-container',
      sliderPagination: '.swiper-pagination',
      sliderPrevEl: '.swiper-button-prev',
      sliderNextEl: '.swiper-button-next',
      navSlider: '.nav-swiper-container',
      navSliderMobile: '.nav-swiper-container-mobile',
      mediaNavsWrapper: '.sf-prod-media__navs-wrapper',
      mediaNavs: '.sf-prod-media__navs',
      mediaNav: '.sf-prod-media__nav',
      medias: ['.sf-prod-media-item'],
      mediaZoomIns: ['.sf-prod-media__zoom-in'],
      videos: ['.media-video']
    });

    _defineProperty(this, "classes", {
      fixed: 'stay-fixed',
      absolute: 'stay-absolute'
    });

    _defineProperty(this, "positions", {
      'info': 'default',
      'mediaNavs': 'default'
    });

    _defineProperty(this, "mediaWrapperRect", {});

    _defineProperty(this, "fixedElemsHeight", {
      info: 0,
      mediaNavs: 0
    });

    _defineProperty(this, "players", {});

    _defineProperty(this, "currPlayer", void 0);

    _defineProperty(this, "mobileSlider", null);

    _defineProperty(this, "init", () => {
      var _this$container, _this$container$close, _this$container$close2, _this$container$close3;

      switch (this.view) {
        case 'product-template':
          this.layout = ((_this$container = this.container) === null || _this$container === void 0 ? void 0 : (_this$container$close = _this$container.closest) === null || _this$container$close === void 0 ? void 0 : (_this$container$close2 = _this$container$close.call(_this$container, 'section[data-section-type="product-page"]')) === null || _this$container$close2 === void 0 ? void 0 : (_this$container$close3 = _this$container$close2.dataset) === null || _this$container$close3 === void 0 ? void 0 : _this$container$close3.layout) || 'layout-1';

          if (window.__sfWindowLoaded) {
            this.initLightbox();
            this.initPlyrs();
          } else {
            window.addEventListener("load", () => {
              this.initPlyrs();
              this.initLightbox();
            });
          }

          this.addEventToMainMedias();
          this.initSlider();

          if (this.mediaMode !== 'slider') {
            this.mediaMode = 'gallery';

            if (this.domNodes.mediaNavs) {
              this.addEventToMediaNavs();
            }
          }

          break;

        case 'featured-product':
          this.initSlider();
          break;

        case 'card':
          this.mediaMode = 'featured-image';
          break;

        case 'sticky-atc':
          this.mediaMode = 'featured-image';
          break;

        case 'quick-view':
          this.mediaMode = 'featured-image';
          this.initSlider();
          break;

        default:
          break;
      }
    });

    _defineProperty(this, "initPlyrs", () => {
      var _this$domNodes, _this$domNodes$videos;

      if ((_this$domNodes = this.domNodes) !== null && _this$domNodes !== void 0 && (_this$domNodes$videos = _this$domNodes.videos) !== null && _this$domNodes$videos !== void 0 && _this$domNodes$videos.length) {
        var _window, _window$themeStyleURL, _window$themeStyleURL2, _window2, _window2$themeScriptU, _window2$themeScriptU2;

        loadCSS((_window = window) === null || _window === void 0 ? void 0 : (_window$themeStyleURL = _window.themeStyleURLs) === null || _window$themeStyleURL === void 0 ? void 0 : (_window$themeStyleURL2 = _window$themeStyleURL.plyr) === null || _window$themeStyleURL2 === void 0 ? void 0 : _window$themeStyleURL2.url);
        loadJS((_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$themeScriptU = _window2.themeScriptURLs) === null || _window2$themeScriptU === void 0 ? void 0 : (_window2$themeScriptU2 = _window2$themeScriptU.plyr) === null || _window2$themeScriptU2 === void 0 ? void 0 : _window2$themeScriptU2.url).then(() => {
          var _ref, _this$domNodes2;

          (_ref = [...((_this$domNodes2 = this.domNodes) === null || _this$domNodes2 === void 0 ? void 0 : _this$domNodes2.videos)]) === null || _ref === void 0 ? void 0 : _ref.forEach(vid => {
            var _vid$classList, _vid$dataset;

            const elm = vid !== null && vid !== void 0 && (_vid$classList = vid.classList) !== null && _vid$classList !== void 0 && _vid$classList.contains('local-video') ? vid === null || vid === void 0 ? void 0 : vid.querySelector('video') : vid;
            const player = new window.spratlyLibs.Plyr(elm);
            player.on('playing', () => {
              if ((this === null || this === void 0 ? void 0 : this.currPlayer) !== player) {
                var _this$currPlayer, _this$currPlayer$paus;

                this === null || this === void 0 ? void 0 : (_this$currPlayer = this.currPlayer) === null || _this$currPlayer === void 0 ? void 0 : (_this$currPlayer$paus = _this$currPlayer.pause) === null || _this$currPlayer$paus === void 0 ? void 0 : _this$currPlayer$paus.call(_this$currPlayer);
                this.currPlayer = player;
              }
            });
            this.players[Number(vid === null || vid === void 0 ? void 0 : (_vid$dataset = vid.dataset) === null || _vid$dataset === void 0 ? void 0 : _vid$dataset.mediaId)] = player;
          });
        }).catch(err => console.error("Failed to init Plyr", err));
      }
    });

    _defineProperty(this, "initLightbox", () => {
      var _window3, _window3$themeStyleUR, _window3$themeStyleUR2, _window4, _window4$themeScriptU, _window4$themeScriptU2;

      loadCSS((_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$themeStyleUR = _window3.themeStyleURLs) === null || _window3$themeStyleUR === void 0 ? void 0 : (_window3$themeStyleUR2 = _window3$themeStyleUR.glightbox) === null || _window3$themeStyleUR2 === void 0 ? void 0 : _window3$themeStyleUR2.url);
      loadJS((_window4 = window) === null || _window4 === void 0 ? void 0 : (_window4$themeScriptU = _window4.themeScriptURLs) === null || _window4$themeScriptU === void 0 ? void 0 : (_window4$themeScriptU2 = _window4$themeScriptU.glightbox) === null || _window4$themeScriptU2 === void 0 ? void 0 : _window4$themeScriptU2.url).then(() => {
        var _this$productData, _this$productData$med;

        const elements = this === null || this === void 0 ? void 0 : (_this$productData = this.productData) === null || _this$productData === void 0 ? void 0 : (_this$productData$med = _this$productData.media) === null || _this$productData$med === void 0 ? void 0 : _this$productData$med.map(media => {
          if (media.media_type === 'image') {
            return {
              href: media.src,
              type: 'image'
            };
          }

          if (media.media_type === 'external_video') {
            // TODO: fix Youtube video on lightbox
            const href = getVideoURL(media.external_id, media.host);
            return {
              href,
              type: 'video',
              source: media.host
            };
          }

          if (media.media_type === 'video') {
            var _media$sources, _media$sources$;

            const href = media === null || media === void 0 ? void 0 : (_media$sources = media.sources) === null || _media$sources === void 0 ? void 0 : (_media$sources$ = _media$sources[0]) === null || _media$sources$ === void 0 ? void 0 : _media$sources$.url;
            return {
              href,
              type: 'video'
            };
          }

          if (media.media_type === 'model') {
            var _document$querySelect;

            const mediaElem = (_document$querySelect = document.querySelector(`.media-model[data-media-id="${media.id}"]`)) === null || _document$querySelect === void 0 ? void 0 : _document$querySelect.cloneNode(true);
            mediaElem.classList.remove('hidden');
            mediaElem.classList.add('model-in-lightbox');
            return {
              content: mediaElem,
              width: '80vw',
              height: '70vh'
            };
          }
        });
        this.lightbox = new window.spratlyLibs.GLightbox({
          elements,
          openEffect: 'fade',
          closeEffect: 'fade',
          draggable: false,
          autofocusVideos: true
        }); // TODO: fix video width https://github.com/biati-digital/glightbox/issues/203
      }).catch(err => console.error("Failed to init Glightbox", err));
    });

    _defineProperty(this, "initSlider", () => {
      var _this$domNodes3, _window5;

      if (!(this !== null && this !== void 0 && (_this$domNodes3 = this.domNodes) !== null && _this$domNodes3 !== void 0 && _this$domNodes3.slider)) return;
      this.mediaMode = 'slider';
      loadCSS((_window5 = window) === null || _window5 === void 0 ? void 0 : _window5.themeStyleURLs.swiper.url).then(() => {
        var _window6;

        loadJS((_window6 = window) === null || _window6 === void 0 ? void 0 : _window6.themeScriptURLs.swiper.url).then(() => {
          const {
            view,
            domNodes: {
              slider,
              sliderPagination,
              navSlider,
              sliderNextEl,
              sliderPrevEl
            }
          } = this;
          let layout = view === 'product-template' ? this.layout : view;
          this.navSlider = navSlider ? new window.spratlyTheme.Swiper(navSlider, {
            slidesPerView: 5,
            freeMode: true,
            spaceBetween: 10,
            watchSlidesVisibility: true,
            watchSlidesProgress: true,
            direction: layout === 'layout-6' ? 'vertical' : 'horizontal',
            on: {
              init: function () {
                navSlider.classList.add('opacity-100');
              }
            }
          }) : null;
          const thumbs = this.navSlider ? {
            thumbs: {
              swiper: this.navSlider
            }
          } : {};
          const config = Object.assign({}, getProductSliderConfig(layout), {
            autoHeight: true,
            navigation: {
              nextEl: sliderNextEl,
              prevEl: sliderPrevEl
            },
            pagination: {
              el: sliderPagination,
              clickable: true,
              type: 'bullets'
            },
            ...thumbs,
            on: {
              init: () => {
                var _this$domNodes4, _this$domNodes4$slide, _this$domNodes4$slide2;

                this === null || this === void 0 ? void 0 : (_this$domNodes4 = this.domNodes) === null || _this$domNodes4 === void 0 ? void 0 : (_this$domNodes4$slide = _this$domNodes4.slider) === null || _this$domNodes4$slide === void 0 ? void 0 : (_this$domNodes4$slide2 = _this$domNodes4$slide.classList) === null || _this$domNodes4$slide2 === void 0 ? void 0 : _this$domNodes4$slide2.remove('hidden');
                this.domNodes = queryDomNodes(this.selectors, this.container);
              }
            }
          });

          if (this.view === 'product-template') {
            src_default().register("screen and (max-width: 767px)", {
              match: () => {
                this.initMobileSlider();
                this.handleSlideChange();
              }
            });
            src_default().register("screen and (min-width: 768px)", {
              match: () => {
                this.slider = new window.spratlyTheme.Swiper(slider, config);
                this.handleSlideChange();
              }
            });
          } else {
            this.slider = new window.spratlyTheme.Swiper(slider, config);
            this.handleSlideChange();
          }

          let times = 1;
          if (layout === 'layout-5') times = 2;
          this.slider.on('slideChange', swiper => {
            var _crrSlide$dataset;

            const {
              slides,
              activeIndex
            } = swiper;
            const crrSlide = slides[activeIndex];
            const aspectRatio = crrSlide === null || crrSlide === void 0 ? void 0 : (_crrSlide$dataset = crrSlide.dataset) === null || _crrSlide$dataset === void 0 ? void 0 : _crrSlide$dataset.aspectRatio;

            if (aspectRatio) {
              var _this$domNodes$previe;

              (_this$domNodes$previe = this.domNodes.previewWrapper) === null || _this$domNodes$previe === void 0 ? void 0 : _this$domNodes$previe.style.setProperty('--aspect-ratio', aspectRatio * times);
            }
          });
        });
      });
    });

    _defineProperty(this, "initMobileSlider", () => {
      const {
        domNodes: {
          navSliderMobile
        }
      } = this;
      console.log(navSliderMobile);
      this.navSliderMobile = navSliderMobile ? new window.spratlyTheme.Swiper(navSliderMobile, {
        slidesPerView: 3,
        // freeMode: true,
        spaceBetween: 10,
        loop: true,
        centeredSlides: true,
        slideToClickedSlide: true,
        // watchSlidesVisibility: true,
        // watchSlidesProgress: true,
        on: {
          init: function () {
            navSliderMobile.classList.add('opacity-100');
          }
        }
      }) : null;
      console.log();
      const slider = this.domNodes.mediaMobile.querySelector(this.selectors.slider);
      this.slider = new window.spratlyTheme.Swiper(slider, {
        autoHeight: true,
        loop: true,
        pagination: {
          el: this.domNodes.mediaMobile.querySelector(this.selectors.sliderPagination),
          clickable: true,
          type: 'bullets'
        },
        thumbs: {
          swiper: this.navSliderMobile
        }
      });
    });

    _defineProperty(this, "handleSlideChange", () => {
      if (!this.slider) return;
      let draggable = true;
      let mediaType = '';
      let visibleSlides = [];
      this.slider.on('slideChange', swiper => {
        let {
          slides,
          activeIndex
        } = swiper;
        visibleSlides = [activeIndex];

        if (this.layout === 'layout-5' || this.layout === 'layout-7') {
          visibleSlides.push(activeIndex + 1);
        }

        for (let index of visibleSlides) {
          var _currSlide$dataset;

          const currSlide = slides[index];
          mediaType = currSlide === null || currSlide === void 0 ? void 0 : (_currSlide$dataset = currSlide.dataset) === null || _currSlide$dataset === void 0 ? void 0 : _currSlide$dataset.mediaType;
          if (mediaType === 'model') break;
        }

        if (mediaType === 'model') {
          this.slider.allowTouchMove = false;
          draggable = false;
        } else {
          if (!draggable) this.slider.allowTouchMove = true;
          draggable = true;
        }
      });
    });

    _defineProperty(this, "changeMediaByVariant", variant => {
      // console.log('=======> variant', variant)
      if (this.mediaMode === 'slider') {
        var _variant$featured_med, _this$slider, _this$slider$slideToL;

        const slideIndex = (variant === null || variant === void 0 ? void 0 : (_variant$featured_med = variant.featured_media) === null || _variant$featured_med === void 0 ? void 0 : _variant$featured_med.position) || 0;
        this === null || this === void 0 ? void 0 : (_this$slider = this.slider) === null || _this$slider === void 0 ? void 0 : (_this$slider$slideToL = _this$slider.slideToLoop) === null || _this$slider$slideToL === void 0 ? void 0 : _this$slider$slideToL.call(_this$slider, slideIndex - 1);
      } else if (this.mediaMode === 'featured-image') {
        var _variant$featured_ima;

        const src = variant === null || variant === void 0 ? void 0 : (_variant$featured_ima = variant.featured_image) === null || _variant$featured_ima === void 0 ? void 0 : _variant$featured_ima.src;
        const {
          featuredImage
        } = this.domNodes;
        const img = featuredImage === null || featuredImage === void 0 ? void 0 : featuredImage.querySelector('img');

        if (img && src) {
          var _this$productData2, _this$productData2$in, _featuredImage$classL, _featuredImage$classL2;

          img.src = src;
          img.removeAttribute('srcset');
          const method = ((_this$productData2 = this.productData) === null || _this$productData2 === void 0 ? void 0 : (_this$productData2$in = _this$productData2.initialVariant) === null || _this$productData2$in === void 0 ? void 0 : _this$productData2$in.id) === (variant === null || variant === void 0 ? void 0 : variant.id) ? 'add' : 'remove';
          featuredImage === null || featuredImage === void 0 ? void 0 : (_featuredImage$classL = featuredImage.classList) === null || _featuredImage$classL === void 0 ? void 0 : (_featuredImage$classL2 = _featuredImage$classL[method]) === null || _featuredImage$classL2 === void 0 ? void 0 : _featuredImage$classL2.call(_featuredImage$classL, 'group-hover:opacity-0');
        }
      } else {// handle change image in gallery mode
      }
    });

    _defineProperty(this, "addEventToMediaNavs", () => {
      addEventDelegate({
        selector: this.selectors.mediaNav,
        handler: (e, media) => {
          const {
            index,
            mediaId
          } = media === null || media === void 0 ? void 0 : media.dataset;

          if (index) {
            var _this$currPlayer2, _this$currPlayer2$pau, _this$players, _this$currPlayer3, _this$currPlayer3$pla;

            const media = this.domNodes.medias[Number(index) || 0];
            scrollIntoView_default()(media, {
              time: 300
            });
            (_this$currPlayer2 = this.currPlayer) === null || _this$currPlayer2 === void 0 ? void 0 : (_this$currPlayer2$pau = _this$currPlayer2.pause) === null || _this$currPlayer2$pau === void 0 ? void 0 : _this$currPlayer2$pau.call(_this$currPlayer2);
            this.currPlayer = (_this$players = this.players) === null || _this$players === void 0 ? void 0 : _this$players[Number(mediaId)];
            (_this$currPlayer3 = this.currPlayer) === null || _this$currPlayer3 === void 0 ? void 0 : (_this$currPlayer3$pla = _this$currPlayer3.play) === null || _this$currPlayer3$pla === void 0 ? void 0 : _this$currPlayer3$pla.call(_this$currPlayer3);
          }
        }
      });
    });

    _defineProperty(this, "addEventToMainMedias", () => {
      addEventDelegate({
        selector: this.selectors.medias[0],
        handler: (e, media) => {
          var _media$dataset, _e$target;

          const index = Number(media === null || media === void 0 ? void 0 : (_media$dataset = media.dataset) === null || _media$dataset === void 0 ? void 0 : _media$dataset.index) || 0;

          if (e !== null && e !== void 0 && (_e$target = e.target) !== null && _e$target !== void 0 && _e$target.closest(this.selectors.mediaZoomIns[0]) || media.classList.contains('media-type-image')) {
            var _this$currPlayer4, _this$lightbox;

            (_this$currPlayer4 = this.currPlayer) === null || _this$currPlayer4 === void 0 ? void 0 : _this$currPlayer4.pause();
            this === null || this === void 0 ? void 0 : (_this$lightbox = this.lightbox) === null || _this$lightbox === void 0 ? void 0 : _this$lightbox.openAt(index);
          }
        }
      });
    });

    this.productData = productData;
    this.container = container;
    this.view = (container === null || container === void 0 ? void 0 : (_container$dataset = container.dataset) === null || _container$dataset === void 0 ? void 0 : _container$dataset.view) || 'product-template';
    this.domNodes = queryDomNodes(this.selectors, this.container);
    this.init();
  }

}
;// CONCATENATED MODULE: ./src/js/modules/product.js










class Product {
  constructor(productForm, _options = {}) {
    var _productForm$classLis, _window6, _window6$spratlyTheme, _window6$spratlyTheme2, _window6$spratlyTheme3;

    _defineProperty(this, "selectors", {
      price: '.prod__price',
      comparePrice: '.prod__compare_price',
      error: '.prod__form-error',
      addToCart: '.add-to-cart',
      variantIdNode: '[name="id"]',
      optionNodes: ['.product-option-item'],
      optionLabels: ['[data-option-label]'],
      quantityInput: '.quantity-input__element[name="quantity"]',
      quantityBtns: ['.quantity-input__button'],
      variantDropdown: '.sf-product-variant-option-dropdown',
      dynamicCheckout: '.prod__dynamic_checkout'
    });

    _defineProperty(this, "productForm", void 0);

    _defineProperty(this, "productBlock", void 0);

    _defineProperty(this, "activeOptionNodeByPosition", {});

    _defineProperty(this, "productData", void 0);

    _defineProperty(this, "themeProductSettings", getThemeProductSettings());

    _defineProperty(this, "productHelper", void 0);

    _defineProperty(this, "listeners", []);

    _defineProperty(this, "classes", {
      showSwatchImage: 'show-swatch-image'
    });

    _defineProperty(this, "init", async () => {
      var _this$productData;

      this.productData = await getProductData(this.productForm.dataset);

      if (!((_this$productData = this.productData) !== null && _this$productData !== void 0 && _this$productData.variants)) {
        return;
      }

      this.initProductVariant();
      this.initProductEvents().catch(console.error);
      this.productHelper = new ProductHelper({
        container: this.productBlock,
        productData: this.productData
      });
    });

    _defineProperty(this, "initProductVariant", () => {
      const {
        domNodes: {
          variantIdNode
        },
        productData,
        productData: {
          variants
        } = {}
      } = this;

      if (productData && variantIdNode) {
        let currentVariantId = Number(variantIdNode.value);

        if (!currentVariantId) {
          currentVariantId = productData.selected_or_first_available_variant.id;
        }

        const currentVariant = variants.find(v => v.id === currentVariantId) || variants[0];
        this.productData.initialVariant = currentVariant;

        if (currentVariant !== null && currentVariant !== void 0 && currentVariant.options) {
          this.updateBySelectedVariant(currentVariant);
        }

        this.initOptions();
      }
    });

    _defineProperty(this, "initOptions", () => {
      const {
        themeProductSettings = {},
        domNodes: {
          optionNodes
        },
        productData: {
          variants,
          aspect_ratio
        } = {}
      } = this;
      optionNodes.forEach(optNode => {
        const {
          optionType,
          value: optionValue
        } = optNode === null || optNode === void 0 ? void 0 : optNode.dataset;
        const optionValueLowerCase = optionValue === null || optionValue === void 0 ? void 0 : optionValue.toLowerCase();
        const shouldShowSwatchImage = ['image', 'default'].includes(optionType);

        if (shouldShowSwatchImage) {
          const {
            optionPosition
          } = optNode.dataset;
          const variantToShowSwatchImage = variants.find(v => v[`option${optionPosition}`] === optionValue);

          if (variantToShowSwatchImage) {
            var _variantToShowSwatchI;

            const src = variantToShowSwatchImage === null || variantToShowSwatchImage === void 0 ? void 0 : (_variantToShowSwatchI = variantToShowSwatchImage.featured_image) === null || _variantToShowSwatchI === void 0 ? void 0 : _variantToShowSwatchI.src;

            if (src) {
              optNode.classList.add(this.classes.showSwatchImage);
              optNode.style.backgroundImage = `url(${src})`;
              optNode.style['--option-aspect-ratio'] = aspect_ratio;
            }
          }

          const {
            imageSwatch = []
          } = themeProductSettings;
          const match = imageSwatch.find(i => i.key === optionValueLowerCase);

          if (match !== null && match !== void 0 && match.value) {
            if (match.type === 'image') {
              optNode.style.backgroundImage = `url(${match.value})`;
              optNode.style.backgroundSize = `cover`;
              optNode.style.backgroundPosition = `center`;
              optNode.style.fontSize = '0';
              optNode.style.lineHeight = '0';
            }
          }
        }

        const {
          colorSwatch = []
        } = themeProductSettings;
        const match = colorSwatch.find(i => i.key === optionValueLowerCase);

        if (optionType === 'color') {
          if (match !== null && match !== void 0 && match.value) {
            if (match.type === 'color') {
              optNode.style.backgroundColor = match.value;
              optNode.style.fontSize = '0';
              optNode.style.lineHeight = '0';
            }
          } else if (isValidColor(optionValueLowerCase)) {
            optNode.style.backgroundColor = optionValueLowerCase;
            optNode.style.fontSize = '0';
            optNode.style.lineHeight = '0';
          }
        }
      });
    });

    _defineProperty(this, "initProductEvents", async () => {
      // this.domNodes.variantDropdown?.addEventListener('change', this.handleSelectVariant)
      this.listeners = [addEventDelegate({
        event: 'change',
        context: this.productForm,
        selector: this.selectors.variantDropdown,
        handler: this.handleSelectVariant
      }), addEventDelegate({
        context: this.productForm,
        selector: this.selectors.optionNodes[0],
        handler: this.handleSelectVariant
      }), addEventDelegate({
        context: this.productForm,
        selector: this.selectors.addToCart,
        handler: this.handleAddToCart
      }), addEventDelegate({
        context: this.productForm,
        selector: this.selectors.quantityBtns[0],
        handler: this.handleQtyBtnClick
      }), addEventDelegate({
        event: 'change',
        context: this.productForm,
        selector: this.selectors.quantityInput,
        handler: this.handleQtyInputChange
      })];
    });

    _defineProperty(this, "unsubscribeEvents", () => {
      this.listeners.forEach(unsubscribeFunc => unsubscribeFunc());
    });

    _defineProperty(this, "handleQtyInputChange", e => {
      var _window, _window$_ThemeEvent;

      (_window = window) === null || _window === void 0 ? void 0 : (_window$_ThemeEvent = _window._ThemeEvent) === null || _window$_ThemeEvent === void 0 ? void 0 : _window$_ThemeEvent.emit(`${this.productData.id}__QUANTITY_CHANGE`, Number(e.target.value), this);
    });

    _defineProperty(this, "handleQtyBtnClick", (e, btn) => {
      var _window2, _window2$_ThemeEvent;

      const {
        quantitySelector
      } = btn.dataset;
      const {
        quantityInput
      } = this.domNodes;
      const currentQty = Number(quantityInput.value);
      let newQty = currentQty;

      if (quantitySelector === 'decrease') {
        newQty = currentQty > 1 ? currentQty - 1 : 1;
      } else {
        newQty = currentQty + 1;
      }

      quantityInput.value = newQty;
      (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$_ThemeEvent = _window2._ThemeEvent) === null || _window2$_ThemeEvent === void 0 ? void 0 : _window2$_ThemeEvent.emit(`${this.productData.id}__QUANTITY_CHANGE`, newQty, this);
    });

    _defineProperty(this, "getVariantFromActiveOptions", () => {
      const {
        productData,
        productData: {
          initialVariant
        },
        activeOptionNodeByPosition,
        productBlock
      } = this;
      let options;

      if (productBlock.dataset.view === 'card') {
        const initialVariantOptions = {
          1: initialVariant.option1,
          2: initialVariant.option2,
          3: initialVariant.option3
        };
        Object.values(activeOptionNodeByPosition).forEach(optNode => {
          const {
            optionPosition,
            value
          } = optNode.dataset;
          initialVariantOptions[optionPosition] = value;
        });
        options = Object.values(initialVariantOptions);
      } else {
        options = Object.values(activeOptionNodeByPosition).map(optNode => optNode.dataset.value);
      }

      options = options.filter(Boolean);
      const variant = getVariantFromOptionArray(productData, options);
      return variant;
    });

    _defineProperty(this, "handleSelectVariant", e => {
      let {
        target
      } = e;
      let newVariant;

      if (target.classList.contains('combined-variant')) {
        var _e$target, _this$productData2, _this$productData2$va, _this$productData2$va2;

        const variantId = Number(e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.value);
        newVariant = (_this$productData2 = this.productData) === null || _this$productData2 === void 0 ? void 0 : (_this$productData2$va = _this$productData2.variants) === null || _this$productData2$va === void 0 ? void 0 : (_this$productData2$va2 = _this$productData2$va.find) === null || _this$productData2$va2 === void 0 ? void 0 : _this$productData2$va2.call(_this$productData2$va, v => v.id === variantId);
      } else {
        if (target.tagName === 'SELECT') {
          target = target.querySelectorAll('option')[target.selectedIndex];
        }

        if (!target.classList.contains('product-option-item')) {
          target = target.closest('.product-option-item');
          if (target) console.error("Unable to find option node!");
        }

        const {
          optionPosition
        } = target.dataset;
        const currActiveOptNode = this.activeOptionNodeByPosition[optionPosition];
        this.toggleOptionNodeActive(currActiveOptNode, false);
        this.toggleOptionNodeActive(target, true);
        newVariant = this.getVariantFromActiveOptions();
      }

      const {
        variantIdNode
      } = this.domNodes;

      if (variantIdNode) {
        var _newVariant, _newVariant2;

        variantIdNode.setAttribute('value', String((_newVariant = newVariant) === null || _newVariant === void 0 ? void 0 : _newVariant.id));
        variantIdNode.value = String((_newVariant2 = newVariant) === null || _newVariant2 === void 0 ? void 0 : _newVariant2.id);
      }

      this.updateBySelectedVariant(newVariant);
    });

    _defineProperty(this, "updatePriceByVariant", variant => {
      if (variant) {
        var _window3, _window3$spratlyTheme, _comparePrice$classLi, _comparePrice$classLi2;

        const {
          comparePrice,
          price
        } = this.domNodes;
        const money_format = (_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$spratlyTheme = _window3.spratlyThemeSettings) === null || _window3$spratlyTheme === void 0 ? void 0 : _window3$spratlyTheme.money_format;
        const priceText = formatMoney(variant.price, money_format);
        const comparePriceText = formatMoney(variant.compare_at_price, money_format);
        if (price) price.innerHTML = priceText;
        if (comparePrice) comparePrice.innerHTML = comparePriceText;
        const method = variant.compare_at_price ? 'remove' : 'add';
        comparePrice === null || comparePrice === void 0 ? void 0 : (_comparePrice$classLi = comparePrice.classList) === null || _comparePrice$classLi === void 0 ? void 0 : (_comparePrice$classLi2 = _comparePrice$classLi[method]) === null || _comparePrice$classLi2 === void 0 ? void 0 : _comparePrice$classLi2.call(_comparePrice$classLi, 'hidden');
      }
    });

    _defineProperty(this, "updateOptionLabel", (position, value) => {
      var _this$domNodes$option, _this$domNodes$option2;

      const label = (_this$domNodes$option = this.domNodes.optionLabels) === null || _this$domNodes$option === void 0 ? void 0 : (_this$domNodes$option2 = _this$domNodes$option.find) === null || _this$domNodes$option2 === void 0 ? void 0 : _this$domNodes$option2.call(_this$domNodes$option, label => Number(label.dataset.labelPosition) === position);
      if (label) label.textContent = value;
    });

    _defineProperty(this, "toggleOptionNodeActive", (optNode, active) => {
      if (!optNode) return;

      if (active) {
        const {
          optionPosition,
          value: optionValue
        } = optNode.dataset;
        this.activeOptionNodeByPosition[optionPosition] = optNode;
        this.updateOptionLabel(optionPosition, optionValue);

        switch (optNode.tagName) {
          case 'INPUT':
            optNode.checked = 'checked';
            optNode.dataset.selected = 'true';
            break;

          case 'OPTION':
            optNode.dataset.selected = 'true';
            const select = optNode.closest('select');
            if (select) select.value = optNode.value;
            break;

          case 'DIV':
            optNode.dataset.selected = 'true';

            if (['default', 'image', 'color'].includes(optNode.dataset.optionType)) {
              optNode.parentElement.classList.add('sf_variant-selected');
            }

            break;

          default:
            console.warn('Unable to activate option node', optNode);
            break;
        }
      } else {
        if (['default', 'image', 'color'].includes(optNode.dataset.optionType)) {
          optNode.parentElement.classList.remove('sf_variant-selected');
        } else {
          optNode.style.border = '';
        }

        optNode.checked = false;
        delete optNode.dataset.selected;
        const select = optNode.closest('select');
        if (select) select.value = '';
      }
    });

    _defineProperty(this, "updateBySelectedVariant", variant => {
      var _window4, _window4$_ThemeEvent;

      if (variant) {
        Object.values(this.activeOptionNodeByPosition).forEach(optNode => this.toggleOptionNodeActive(optNode, false));
        const {
          optionNodes
        } = this.domNodes;
        const {
          options = []
        } = variant || {};
        options.forEach((option, index) => {
          const optPosition = index + 1;
          optionNodes.forEach(optNode => {
            const _optPosition = Number(optNode.dataset.optionPosition);

            const _optValue = optNode.dataset.value;

            if (_optPosition === optPosition && option === _optValue) {
              this.toggleOptionNodeActive(optNode, true);
            }
          });
        });
      }

      (_window4 = window) === null || _window4 === void 0 ? void 0 : (_window4$_ThemeEvent = _window4._ThemeEvent) === null || _window4$_ThemeEvent === void 0 ? void 0 : _window4$_ThemeEvent.emit(`${this.productData.id}__VARIANT_CHANGE`, variant, this); // window?.DoublyGlobalCurrency?.convertAll?.($?.('[name=doubly-currencies]')?.val?.());

      this.changeProductImage(variant);
      this.updatePriceByVariant(variant);
      this.updateATCButtonByVariant(variant);
      this.updateBrowserHistory(variant);
    });

    _defineProperty(this, "updateATCButtonByVariant", variant => {
      const atcButtons = this.productForm.querySelectorAll(this.selectors.addToCart);
      const dynamicCheckout = this.productForm.querySelector(this.selectors.dynamicCheckout);

      if (!(variant !== null && variant !== void 0 && variant.available) || !variant) {
        dynamicCheckout === null || dynamicCheckout === void 0 ? void 0 : dynamicCheckout.classList.add('disabled');
      } else {
        dynamicCheckout === null || dynamicCheckout === void 0 ? void 0 : dynamicCheckout.classList.remove('disabled');
      }

      Array.from(atcButtons).forEach(atc => {
        const atcTextNode = atc.querySelector('[data-add-to-cart-text]');

        if (!(variant !== null && variant !== void 0 && variant.available)) {
          atc.classList.add('disabled');

          if (atcTextNode) {
            if (typeof (variant === null || variant === void 0 ? void 0 : variant.available) === 'boolean') {
              var _window$spratlyThemeS;

              // Sold out
              atcTextNode.innerText = atc.dataset.soldOut || ((_window$spratlyThemeS = window.spratlyThemeStrings) === null || _window$spratlyThemeS === void 0 ? void 0 : _window$spratlyThemeS.soldOut);
            } else {
              var _window$spratlyThemeS2;

              // Unavailable
              atcTextNode.innerText = atc.dataset.unavailable || ((_window$spratlyThemeS2 = window.spratlyThemeStrings) === null || _window$spratlyThemeS2 === void 0 ? void 0 : _window$spratlyThemeS2.unavailable);
            }
          }
        } else {
          var _window$spratlyThemeS3;

          Array.from(atcButtons).forEach(atc => {
            atc.classList.remove('disabled');
          });
          atcTextNode && (atcTextNode.innerText = atc.dataset.addToCartText || ((_window$spratlyThemeS3 = window.spratlyThemeStrings) === null || _window$spratlyThemeS3 === void 0 ? void 0 : _window$spratlyThemeS3.addToCart));
        }
      });
    });

    _defineProperty(this, "updateBrowserHistory", variant => {
      const container = this.productForm.closest('[data-section-type="product-page"]');
      let enableHistoryState;

      if (container) {
        enableHistoryState = container.dataset.enableHistoryState;
      } else {
        return;
      }

      if (!variant || enableHistoryState !== 'true') {
        return;
      }

      const url = getUrlWithVariant(window.location.href, variant.id);
      window.history.replaceState({
        path: url
      }, '', url);
    });

    _defineProperty(this, "changeProductImage", variant => {
      var _this$productHelper;

      (_this$productHelper = this.productHelper) === null || _this$productHelper === void 0 ? void 0 : _this$productHelper.changeMediaByVariant(variant);
    });

    _defineProperty(this, "handleAddToCart", async e => {
      var _this$themeProductSet;

      e.preventDefault();

      if (!(this !== null && this !== void 0 && (_this$themeProductSet = this.themeProductSettings) !== null && _this$themeProductSet !== void 0 && _this$themeProductSet.use_ajax_atc)) {
        return this.productForm.submit();
      }

      const missing = productFormCheck(this.productForm);

      if (missing.length > 0) {
        var _this$domNodes, _window5;

        notification.show({
          target: this === null || this === void 0 ? void 0 : (_this$domNodes = this.domNodes) === null || _this$domNodes === void 0 ? void 0 : _this$domNodes.error,
          method: 'appendChild',
          type: 'warning',
          message: (_window5 = window) === null || _window5 === void 0 ? void 0 : _window5.spratlyThemeStrings.requiredField
        });
      } else {
        this.toggleSpinner(true); // Some 3rd apps might override the default FormData, use this code to prevent it.

        let formData = new FormData(this.productForm);

        if (typeof formData._asNative === 'function') {
          formData = formData._asNative().fd;
        }

        const sourceEvent = formData.get('source_event') || 'product-form';
        this.cartAddFromForm(formData).then(r => r.json()).then(res => {
          if ((res === null || res === void 0 ? void 0 : res.status) === 422 && res !== null && res !== void 0 && res.description) {
            var _this$domNodes2;

            notification.show({
              target: this === null || this === void 0 ? void 0 : (_this$domNodes2 = this.domNodes) === null || _this$domNodes2 === void 0 ? void 0 : _this$domNodes2.error,
              method: 'appendChild',
              type: 'warning',
              message: res === null || res === void 0 ? void 0 : res.description
            });
          } else {
            window.Shopify.onItemAdded({
              source: sourceEvent,
              payload: res
            });
          }

          setTimeout(() => {
            this.toggleSpinner(false);
          }, 500);
        });
      }
    });

    _defineProperty(this, "cartAddFromForm", formData => {
      const config = (0,utilities_fetch.getRequestDefaultConfigs)();
      delete config.headers['Content-Type'];
      config.method = 'POST';
      config.body = formData;
      return fetch('/cart/add.js', config);
    });

    _defineProperty(this, "toggleSpinner", show => {
      const method = show ? 'add' : 'remove';
      this.productForm.classList[method]('adding');
    });

    _defineProperty(this, "serializeForm", formData => {
      let obj = {};

      for (var key of formData.keys()) {
        obj[key] = formData.get(key);
      }

      return obj;
    });

    if (productForm !== null && productForm !== void 0 && (_productForm$classLis = productForm.classList) !== null && _productForm$classLis !== void 0 && _productForm$classLis.contains('initialized')) return;
    const {
      autoInit = true,
      saveInstanceToDOM = false
    } = _options;
    this.productForm = productForm;
    this.productBlock = productForm === null || productForm === void 0 ? void 0 : productForm.closest('.sf-prod__block');
    this.domNodes = queryDomNodes(this.selectors, this.productBlock);
    if (autoInit) this.init().catch(console.error);
    if (saveInstanceToDOM) this.productForm._productInstane = this;
    this.productForm.classList.add('initialized');
    (_window6 = window) === null || _window6 === void 0 ? void 0 : (_window6$spratlyTheme = _window6.spratlyTheme) === null || _window6$spratlyTheme === void 0 ? void 0 : (_window6$spratlyTheme2 = _window6$spratlyTheme.Products) === null || _window6$spratlyTheme2 === void 0 ? void 0 : (_window6$spratlyTheme3 = _window6$spratlyTheme2.productInstances) === null || _window6$spratlyTheme3 === void 0 ? void 0 : _window6$spratlyTheme3.push(this);
  }

}

class Products {
  constructor() {
    _defineProperty(this, "productInstances", []);

    _defineProperty(this, "initProductForms", async ({
      context = document.documentElement,
      forceReInit = false
    } = {}) => {
      if (forceReInit) {
        this.productInstances.forEach(prodInstance => prodInstance === null || prodInstance === void 0 ? void 0 : prodInstance.unsubscribeEvents());
        this.productInstances = [];
      }

      ;
      [...context.querySelectorAll('form[data-product-id]')].forEach(form => {
        if (!form.classList.contains('initialized') || forceReInit) {
          new Product(form);
        }
      });
    });
  }

}

/* harmony default export */ var product = (new Products());
;// CONCATENATED MODULE: ./src/js/utilities/dom-intersection-observer.js


if (!window.IntersectionObserver) {
  loadJS('https://polyfill.io/v3/polyfill.min.js?features=IntersectionObserver');
}

function handleBackgroundImageLazyload() {
  return addIntersectionObserver('sf-bg-lazy');
}
handleBackgroundImageLazyload();
async function addIntersectionObserver(classSelector, newClass = '') {
  let lazyImages = [].slice.call(document.getElementsByClassName(classSelector));

  if ("IntersectionObserver" in window) {
    let lazyImageObserver = new IntersectionObserver(function (entries, observer) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          let lazyImage = entry.target;
          lazyImage.classList.remove(classSelector);
          newClass && lazyImage.classList.remove(newClass);
          lazyImageObserver.unobserve(lazyImage);
        }
      });
    });
    lazyImages.forEach(function (lazyImage) {
      lazyImageObserver.observe(lazyImage);
    });
  }
}
function observeElement(target, callback, option = null) {
  let observer = new IntersectionObserver(callback, option);
  observer.observe(target);
}
// EXTERNAL MODULE: ./src/js/utilities/shopify.js
var shopify = __webpack_require__(5118);
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-sections/section.js
var SECTION_ID_ATTR = 'data-section-id';
function Section(container, properties) {
  this.container = validateContainerElement(container);
  this.id = container.getAttribute(SECTION_ID_ATTR);
  this.extensions = []; // eslint-disable-next-line es5/no-es6-static-methods

  Object.assign(this, validatePropertiesObject(properties));
  this.onLoad();
}
Section.prototype = {
  onLoad: Function.prototype,
  onUnload: Function.prototype,
  onSelect: Function.prototype,
  onDeselect: Function.prototype,
  onBlockSelect: Function.prototype,
  onBlockDeselect: Function.prototype,
  extend: function extend(extension) {
    this.extensions.push(extension); // Save original extension
    // eslint-disable-next-line es5/no-es6-static-methods

    var extensionClone = Object.assign({}, extension);
    delete extensionClone.init; // Remove init function before assigning extension properties
    // eslint-disable-next-line es5/no-es6-static-methods

    Object.assign(this, extensionClone);

    if (typeof extension.init === 'function') {
      extension.init.apply(this);
    }
  }
};

function validateContainerElement(container) {
  if (!(container instanceof Element)) {
    throw new TypeError('Theme Sections: Attempted to load section. The section container provided is not a DOM element.');
  }

  if (container.getAttribute(SECTION_ID_ATTR) === null) {
    throw new Error('Theme Sections: The section container provided does not have an id assigned to the ' + SECTION_ID_ATTR + ' attribute.');
  }

  return container;
}

function validatePropertiesObject(value) {
  if (typeof value !== 'undefined' && typeof value !== 'object' || value === null) {
    throw new TypeError('Theme Sections: The properties object provided is not a valid');
  }

  return value;
} // Object.assign() polyfill from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Polyfill


if (typeof Object.assign != 'function') {
  // Must be writable: true, enumerable: false, configurable: true
  Object.defineProperty(Object, 'assign', {
    value: function assign(target) {
      // .length of function is 2
      'use strict';

      if (target == null) {
        // TypeError if undefined or null
        throw new TypeError('Cannot convert undefined or null to object');
      }

      var to = Object(target);

      for (var index = 1; index < arguments.length; index++) {
        var nextSource = arguments[index];

        if (nextSource != null) {
          // Skip over if undefined or null
          for (var nextKey in nextSource) {
            // Avoid bugs when hasOwnProperty is shadowed
            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
              to[nextKey] = nextSource[nextKey];
            }
          }
        }
      }

      return to;
    },
    writable: true,
    configurable: true
  });
}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-sections/theme-sections.js
/*
 * @shopify/theme-sections
 * -----------------------------------------------------------------------------
 *
 * A framework to provide structure to your Shopify sections and a load and unload
 * lifecycle. The lifecycle is automatically connected to theme editor events so
 * that your sections load and unload as the editor changes the content and
 * settings of your sections.
 */

var SECTION_TYPE_ATTR = 'data-section-type';
var theme_sections_SECTION_ID_ATTR = 'data-section-id';
window.Shopify = window.Shopify || {};
window.Shopify.theme = window.Shopify.theme || {};
window.Shopify.theme.sections = window.Shopify.theme.sections || {};
var registered = window.Shopify.theme.sections.registered = window.Shopify.theme.sections.registered || {};
var instances = window.Shopify.theme.sections.instances = window.Shopify.theme.sections.instances || [];
function register(type, properties) {
  if (typeof type !== 'string') {
    throw new TypeError('Theme Sections: The first argument for .register must be a string that specifies the type of the section being registered');
  }

  if (typeof registered[type] !== 'undefined') {
    throw new Error('Theme Sections: A section of type "' + type + '" has already been registered. You cannot register the same section type twice');
  }

  function TypedSection(container) {
    Section.call(this, container, properties);
  }

  TypedSection.constructor = Section;
  TypedSection.prototype = Object.create(Section.prototype);
  TypedSection.prototype.type = type;
  return registered[type] = TypedSection;
}
function unregister(types) {
  types = normalizeType(types);
  types.forEach(function (type) {
    delete registered[type];
  });
}
function load(types, containers) {
  types = normalizeType(types);

  if (typeof containers === 'undefined') {
    containers = document.querySelectorAll('[' + SECTION_TYPE_ATTR + ']');
  }

  containers = normalizeContainers(containers);
  types.forEach(function (type) {
    var TypedSection = registered[type];

    if (typeof TypedSection === 'undefined') {
      return;
    }

    containers = containers.filter(function (container) {
      // Filter from list of containers because container already has an instance loaded
      if (isInstance(container)) {
        return false;
      } // Filter from list of containers because container doesn't have data-section-type attribute


      if (container.getAttribute(SECTION_TYPE_ATTR) === null) {
        return false;
      } // Keep in list of containers because current type doesn't match


      if (container.getAttribute(SECTION_TYPE_ATTR) !== type) {
        return true;
      }

      instances.push(new TypedSection(container)); // Filter from list of containers because container now has an instance loaded

      return false;
    });
  });
}
function unload(selector) {
  var instancesToUnload = getInstances(selector);
  instancesToUnload.forEach(function (instance) {
    var index = instances.map(function (e) {
      return e.id;
    }).indexOf(instance.id);
    instances.splice(index, 1);
    instance.onUnload();
  });
}
function extend(selector, extension) {
  var instancesToExtend = getInstances(selector);
  instancesToExtend.forEach(function (instance) {
    instance.extend(extension);
  });
}
function getInstances(selector) {
  var filteredInstances = []; // Fetch first element if its an array

  if (NodeList.prototype.isPrototypeOf(selector) || Array.isArray(selector)) {
    var firstElement = selector[0];
  } // If selector element is DOM element


  if (selector instanceof Element || firstElement instanceof Element) {
    var containers = normalizeContainers(selector);
    containers.forEach(function (container) {
      filteredInstances = filteredInstances.concat(instances.filter(function (instance) {
        return instance.container === container;
      }));
    }); // If select is type string
  } else if (typeof selector === 'string' || typeof firstElement === 'string') {
    var types = normalizeType(selector);
    types.forEach(function (type) {
      filteredInstances = filteredInstances.concat(instances.filter(function (instance) {
        return instance.type === type;
      }));
    });
  }

  return filteredInstances;
}
function getInstanceById(id) {
  var instance;

  for (var i = 0; i < instances.length; i++) {
    if (instances[i].id === id) {
      instance = instances[i];
      break;
    }
  }

  return instance;
}
function isInstance(selector) {
  return getInstances(selector).length > 0;
}

function normalizeType(types) {
  // If '*' then fetch all registered section types
  if (types === '*') {
    types = Object.keys(registered); // If a single section type string is passed, put it in an array
  } else if (typeof types === 'string') {
    types = [types]; // If single section constructor is passed, transform to array with section
    // type string
  } else if (types.constructor === Section) {
    types = [types.prototype.type]; // If array of typed section constructors is passed, transform the array to
    // type strings
  } else if (Array.isArray(types) && types[0].constructor === Section) {
    types = types.map(function (TypedSection) {
      return TypedSection.prototype.type;
    });
  }

  types = types.map(function (type) {
    return type.toLowerCase();
  });
  return types;
}

function normalizeContainers(containers) {
  // Nodelist with entries
  if (NodeList.prototype.isPrototypeOf(containers) && containers.length > 0) {
    containers = Array.prototype.slice.call(containers); // Empty Nodelist
  } else if (NodeList.prototype.isPrototypeOf(containers) && containers.length === 0) {
    containers = []; // Handle null (document.querySelector() returns null with no match)
  } else if (containers === null) {
    containers = []; // Single DOM element
  } else if (!Array.isArray(containers) && containers instanceof Element) {
    containers = [containers];
  }

  return containers;
}

if (window.Shopify.designMode) {
  document.addEventListener('shopify:section:load', function (event) {
    var id = event.detail.sectionId;
    var container = event.target.querySelector('[' + theme_sections_SECTION_ID_ATTR + '="' + id + '"]');

    if (container !== null) {
      load(container.getAttribute(SECTION_TYPE_ATTR), container);
    }
  });
  document.addEventListener('shopify:section:unload', function (event) {
    var id = event.detail.sectionId;
    var container = event.target.querySelector('[' + theme_sections_SECTION_ID_ATTR + '="' + id + '"]');
    var instance = getInstances(container)[0];

    if (typeof instance === 'object') {
      unload(container);
    }
  });
  document.addEventListener('shopify:section:select', function (event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onSelect(event);
    }
  });
  document.addEventListener('shopify:section:deselect', function (event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onDeselect(event);
    }
  });
  document.addEventListener('shopify:block:select', function (event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onBlockSelect(event);
    }
  });
  document.addEventListener('shopify:block:deselect', function (event) {
    var instance = getInstanceById(event.detail.sectionId);

    if (typeof instance === 'object') {
      instance.onBlockDeselect(event);
    }
  });
}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-images/images.js
/**
 * Image Helper Functions
 * -----------------------------------------------------------------------------
 * https://github.com/Shopify/slate.git.
 *
 */

/**
 * Preloads an image in memory and uses the browsers cache to store it until needed.
 *
 * @param {Array} images - A list of image urls
 * @param {String} size - A shopify image size attribute
 */
function preload(images, size) {
  if (typeof images === 'string') {
    images = [images];
  }

  for (let i = 0; i < images.length; i++) {
    const image = images[i];
    loadImage(getSizedImageUrl(image, size));
  }
}
/**
 * Loads and caches an image in the browsers cache.
 * @param {string} path - An image url
 */

function loadImage(path) {
  new Image().src = path;
}
/**
 * Find the Shopify image attribute size
 *
 * @param {string} src
 * @returns {null}
 */

function imageSize(src) {
  const match = src.match(/.+_((?:pico|icon|thumb|small|compact|medium|large|grande)|\d{1,4}x\d{0,4}|x\d{1,4})[_\.@]/);

  if (match) {
    return match[1];
  } else {
    return null;
  }
}
/**
 * Adds a Shopify size attribute to a URL
 *
 * @param src
 * @param size
 * @returns {*}
 */

function getSizedImageUrl(src, size) {
  if (size === null) {
    return src;
  }

  if (size === 'master') {
    return removeProtocol(src);
  }

  const match = src.match(/\.(jpg|jpeg|gif|png|bmp|bitmap|tiff|tif)(\?v=\d+)?$/i);

  if (match) {
    const prefix = src.split(match[0]);
    const suffix = match[0];
    return removeProtocol(`${prefix[0]}_${size}${suffix}`);
  } else {
    return null;
  }
}
function removeProtocol(path) {
  return path.replace(/http(s)?:/, '');
}
;// CONCATENATED MODULE: ./src/js/components/CartDrawerItem.jsx
/* provided dependency */ var CartDrawerItem_createElement = __webpack_require__(6295)["default"];


/* harmony default export */ function CartDrawerItem({
  item,
  index
}) {
  try {
    var _window, _window$spratlyThemeS, _window2;

    const {
      variant_id,
      url,
      image,
      product_has_only_default_variant,
      options_with_values,
      product_title,
      key,
      quantity,
      original_price,
      featured_image: {
        aspect_ratio = 0.75
      }
    } = item;
    const price = CartDrawerItem_createElement("span", {
      className: "scd-item__line_price sf-currency"
    });
    price.innerHTML = formatMoney(original_price, (_window = window) === null || _window === void 0 ? void 0 : (_window$spratlyThemeS = _window.spratlyThemeSettings) === null || _window$spratlyThemeS === void 0 ? void 0 : _window$spratlyThemeS.money_format);
    return CartDrawerItem_createElement("div", {
      className: "scd-item",
      dataSet: {
        variantId: variant_id,
        lineKey: item.key,
        cartItem: true,
        productId: item.product_id
      }
    }, CartDrawerItem_createElement("div", {
      className: "scd-item__inner flex items-start"
    }, CartDrawerItem_createElement("div", {
      className: "scd-item__image"
    }, image ? CartDrawerItem_createElement("a", {
      className: "block",
      href: url,
      style: {
        '--aspect-ratio': aspect_ratio
      }
    }, CartDrawerItem_createElement("img", {
      src: getSizedImageUrl(image, '300x'),
      alt: ""
    })) : CartDrawerItem_createElement("svg", {
      className: "sf__placeholder-svg w-full h-full",
      xmlns: "http://www.w3.org/2000/svg",
      viewBox: "0 0 525.5 525.5"
    }, CartDrawerItem_createElement("path", {
      d: "M324.5 212.7H203c-1.6 0-2.8 1.3-2.8 2.8V308c0 1.6 1.3 2.8 2.8 2.8h121.6c1.6 0 2.8-1.3 2.8-2.8v-92.5c0-1.6-1.3-2.8-2.9-2.8zm1.1 95.3c0 .6-.5 1.1-1.1 1.1H203c-.6 0-1.1-.5-1.1-1.1v-92.5c0-.6.5-1.1 1.1-1.1h121.6c.6 0 1.1.5 1.1 1.1V308z"
    }), CartDrawerItem_createElement("path", {
      d: "M210.4 299.5H240v.1s.1 0 .2-.1h75.2v-76.2h-105v76.2zm1.8-7.2l20-20c1.6-1.6 3.8-2.5 6.1-2.5s4.5.9 6.1 2.5l1.5 1.5 16.8 16.8c-12.9 3.3-20.7 6.3-22.8 7.2h-27.7v-5.5zm101.5-10.1c-20.1 1.7-36.7 4.8-49.1 7.9l-16.9-16.9 26.3-26.3c1.6-1.6 3.8-2.5 6.1-2.5s4.5.9 6.1 2.5l27.5 27.5v7.8zm-68.9 15.5c9.7-3.5 33.9-10.9 68.9-13.8v13.8h-68.9zm68.9-72.7v46.8l-26.2-26.2c-1.9-1.9-4.5-3-7.3-3s-5.4 1.1-7.3 3l-26.3 26.3-.9-.9c-1.9-1.9-4.5-3-7.3-3s-5.4 1.1-7.3 3l-18.8 18.8V225h101.4z"
    }), CartDrawerItem_createElement("path", {
      d: "M232.8 254c4.6 0 8.3-3.7 8.3-8.3s-3.7-8.3-8.3-8.3-8.3 3.7-8.3 8.3 3.7 8.3 8.3 8.3zm0-14.9c3.6 0 6.6 2.9 6.6 6.6s-2.9 6.6-6.6 6.6-6.6-2.9-6.6-6.6 3-6.6 6.6-6.6z"
    }))), CartDrawerItem_createElement("div", {
      className: "scd-item__info"
    }, CartDrawerItem_createElement("a", {
      href: url,
      target: "_blank",
      className: "font-medium hover:underline"
    }, product_title), !product_has_only_default_variant ? CartDrawerItem_createElement("div", {
      className: "mb-0.5 scd-item__variant mb-0.5 flex"
    }, options_with_values.map(option => {
      return CartDrawerItem_createElement("span", {
        className: "scd-item__variant-option"
      }, CartDrawerItem_createElement("span", null, option.name, ": "), option.value);
    })) : null, CartDrawerItem_createElement("div", {
      className: "scd-item__prices"
    }, price), CartDrawerItem_createElement("div", {
      className: "flex items-center mt-[10px]"
    }, CartDrawerItem_createElement("div", {
      className: "scd-item__quantity flex justify-between rounded"
    }, CartDrawerItem_createElement("button", {
      className: "scd-item__btn",
      dataSet: {
        qtyChange: `dec--${item.key}`
      }
    }, "-"), CartDrawerItem_createElement("input", {
      className: "py-2 scd-item__qty_input w-9 text-center",
      type: "number",
      name: "updates[]",
      id: `updates_${key}`,
      dataSet: {
        variantId: variant_id,
        lineKey: item.key
      },
      value: quantity,
      min: "0"
    }), CartDrawerItem_createElement("button", {
      className: "scd-item__btn",
      dataSet: {
        qtyChange: `inc--${item.key}`
      }
    }, "+")), CartDrawerItem_createElement("button", {
      className: "scd-item__remove underline p-2 ml-2",
      dataSet: {
        lineKey: item.key,
        itemIndex: index + 1
      }
    }, (_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.spratlyThemeStrings.cartRemove)))), CartDrawerItem_createElement("div", {
      className: "scd-item-shipping"
    }, CartDrawerItem_createElement("img", {
      src: $('[data-shipping-info]').attr('data-shipping-country')
    }), CartDrawerItem_createElement("div", {

    }, $('[data-shipping-info]').attr('data-shipping-info'))));
  } catch (error) {
    console.error('Failed to create new cart-drawer-item.', error);
    return CartDrawerItem_createElement("div", {
      className: "hidden"
    }, "Failed to create new cart-drawer-item.");
  }
}
;// CONCATENATED MODULE: ./src/js/modules/countdown-timer.js



class CountdownTimer {
  constructor(container, startTime, endTime, options = {}) {
    _defineProperty(this, "times", ['day', 'hour', 'min', 'sec']);

    _defineProperty(this, "selectors", {
      day: '.countdown-timer-day',
      hour: '.countdown-timer-hour',
      min: '.countdown-timer-minute',
      sec: '.countdown-timer-sec'
    });

    _defineProperty(this, "DAY_IN_MS", 24 * 60 * 60 * 1000);

    _defineProperty(this, "HOUR_IN_MS", 60 * 60 * 1000);

    _defineProperty(this, "MIN_IN_MS", 60 * 1000);

    _defineProperty(this, "start", () => {
      this.timer = setInterval(() => {
        if (this.startTime > this.endTime) this.stop();else this.update();
      }, this.intervalTime);
      this.container.classList.add("opacity-100");
      this.container.classList.remove("opacity-0");
    });

    _defineProperty(this, "update", () => {
      const timeData = this.format(this.endTime - this.startTime);
      this.times.forEach(time => {
        var _this$domNodes;

        if (this !== null && this !== void 0 && (_this$domNodes = this.domNodes) !== null && _this$domNodes !== void 0 && _this$domNodes[time]) {
          this.domNodes[time].textContent = this.addZeroPrefix(timeData[time]);
        }
      });
      this.startTime += this.intervalTime;
    });

    _defineProperty(this, "stop", () => {
      clearInterval(this.timer);

      if (this.options.loop) {
        this.startTime = this.savedStartTime;
        this.start();
      } else {
        this.timer = null;
        this.options.callback();
      }
    });

    _defineProperty(this, "clear", () => {
      clearInterval(this.timer);
      this.timer = null;
      this.startTime = this.savedStartTime;
      this.times.forEach(time => {
        var _this$domNodes2;

        if (this !== null && this !== void 0 && (_this$domNodes2 = this.domNodes) !== null && _this$domNodes2 !== void 0 && _this$domNodes2[time]) {
          this.domNodes[time].textContent = "00";
        }
      });
    });

    _defineProperty(this, "addZeroPrefix", num => {
      var _this$options;

      if (this !== null && this !== void 0 && (_this$options = this.options) !== null && _this$options !== void 0 && _this$options.addZeroPrefix && num < 10) {
        return `0${num}`;
      }

      return num.toString();
    });

    _defineProperty(this, "format", ms => {
      return {
        day: Math.floor(ms / this.DAY_IN_MS),
        hour: Math.floor(ms / this.HOUR_IN_MS) % 24,
        min: Math.floor(ms / this.MIN_IN_MS) % 60,
        sec: Math.floor(ms / 1000) % 60
      };
    });

    this.container = container;
    this.startTime = startTime;
    this.savedStartTime = startTime;
    this.endTime = endTime;
    this.options = Object.assign({}, {
      addZeroPrefix: true,
      loop: false,
      callback: () => {}
    }, options);
    this.intervalTime = 1000;
    this.timer = null;
    this.domNodes = queryDomNodes(this.selectors, container);
    this.start();
  }

}

/* harmony default export */ var countdown_timer = (CountdownTimer);
;// CONCATENATED MODULE: ./src/js/modules/animate-loading.js

class AnimateLoading {
  constructor(target, options = {}) {
    _defineProperty(this, "selectors", {
      loadingBar: 'al-loading-bar',
      loadingOverlay: 'al-loading-overlay'
    });

    _defineProperty(this, "defaultOptions", {
      overlay: null,
      thickness: '3px',
      color: 'gray',
      startDuration: 1000,
      finishDuration: 300
    });

    this.options = Object.assign({}, this.defaultOptions, options);
    this.target = target;
    this.overlay = this.options.overlay || this.target;
    this.cleanUp = this.cleanUp.bind(this);
    this.setLoadingData();
  }

  setLoadingData() {
    const {
      overlay,
      options: {
        startDuration,
        finishDuration,
        thickness,
        color
      }
    } = this;
    overlay.style.setProperty('--al-thickness', ` ${thickness}`);
    overlay.style.setProperty('--al-color', ` ${color}`);
    overlay.style.setProperty('--al-start-duration', ` ${startDuration}ms`);
    overlay.style.setProperty('--al-finish-duration', ` ${finishDuration}ms`);
  }

  start() {
    this.target.classList.add(this.selectors.loadingBar, 'start', 'loading');
    this.overlay.classList.add(this.selectors.loadingOverlay, 'overlay-show');
  }

  finish(callback = () => {}) {
    const {
      target,
      overlay,
      cleanUp,
      options: {
        finishDuration
      }
    } = this;
    const endWidth = window.getComputedStyle(target, ':before').width;
    target.style.setProperty('--al-end-width', endWidth);
    target.classList.add('loaded');
    target.classList.remove('loading');
    setTimeout(() => {
      target.classList.add('finished');
      overlay.classList.remove('overlay-show');
    }, 50);
    setTimeout(cleanUp, finishDuration * 2);
    setTimeout(callback, finishDuration);
  }

  cleanUp() {
    this.target.classList.remove(this.selectors.loadingBar, 'start', 'loaded', 'finished');
    this.overlay.classList.remove(this.selectors.loadingOverlay);
  }

}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-addresses/loader.js
var query = "query countries($locale: SupportedLocale!) {" + "  countries(locale: $locale) {" + "    name" + "    code" + "    labels {" + "      address1" + "      address2" + "      city" + "      company" + "      country" + "      firstName" + "      lastName" + "      phone" + "      postalCode" + "      zone" + "    }" + "    formatting {" + "      edit" + "    }" + "    zones {" + "      name" + "      code" + "    }" + "  }" + "}";
var GRAPHQL_ENDPOINT = 'https://country-service.shopifycloud.com/graphql';
function loadCountries(locale) {
  var response = fetch(GRAPHQL_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      query: query,
      operationName: 'countries',
      variables: {
        locale: toSupportedLocale(locale)
      }
    })
  });
  return response.then(function (res) {
    return res.json();
  }).then(function (countries) {
    return countries.data.countries;
  });
}
var DEFAULT_LOCALE = 'EN';
var SUPPORTED_LOCALES = ['DA', 'DE', 'EN', 'ES', 'FR', 'IT', 'JA', 'NL', 'PT', 'PT_BR'];
function toSupportedLocale(locale) {
  var supportedLocale = locale.replace(/-/, '_').toUpperCase();

  if (SUPPORTED_LOCALES.indexOf(supportedLocale) !== -1) {
    return supportedLocale;
  } else if (SUPPORTED_LOCALES.indexOf(supportedLocale.substring(0, 2)) !== -1) {
    return supportedLocale.substring(0, 2);
  } else {
    return DEFAULT_LOCALE;
  }
}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-addresses/helpers.js
function mergeObjects() {
  var to = Object({});

  for (var index = 0; index < arguments.length; index++) {
    var nextSource = arguments[index];

    if (nextSource) {
      for (var nextKey in nextSource) {
        if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
          to[nextKey] = nextSource[nextKey];
        }
      }
    }
  }

  return to;
}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-addresses/addressForm.js


var FIELD_REGEXP = /({\w+})/g;
var LINE_DELIMITER = '_';
var INPUT_SELECTORS = {
  lastName: '[name="address[last_name]"]',
  firstName: '[name="address[first_name]"]',
  company: '[name="address[company]"]',
  address1: '[name="address[address1]"]',
  address2: '[name="address[address2]"]',
  country: '[name="address[country]"]',
  zone: '[name="address[province]"]',
  postalCode: '[name="address[zip]"]',
  city: '[name="address[city]"]',
  phone: '[name="address[phone]"]'
};
function AddressForm(rootEl, locale, options) {
  locale = locale || 'en';
  options = options || {
    inputSelectors: {}
  };
  var formElements = loadFormElements(rootEl, mergeObjects(INPUT_SELECTORS, options.inputSelectors));
  validateElements(formElements);
  return loadShippingCountries(options.shippingCountriesOnly).then(function (shippingCountryCodes) {
    return loadCountries(locale).then(function (countries) {
      init(rootEl, formElements, filterCountries(countries, shippingCountryCodes));
    });
  });
}
/**
 * Runs when countries have been loaded
 */

function init(rootEl, formElements, countries) {
  populateCountries(formElements, countries);
  var selectedCountry = formElements.country.input ? formElements.country.input.value : null;
  setEventListeners(rootEl, formElements, countries);
  handleCountryChange(rootEl, formElements, selectedCountry, countries);
}
/**
 * Handles when a country change: set labels, reorder fields, populate zones
 */


function handleCountryChange(rootEl, formElements, countryCode, countries) {
  var country = getCountry(countryCode, countries);
  setLabels(formElements, country);
  reorderFields(rootEl, formElements, country);
  populateZones(formElements, country);
}
/**
 * Sets up event listener for country change
 */


function setEventListeners(rootEl, formElements, countries) {
  formElements.country.input.addEventListener('change', function (event) {
    handleCountryChange(rootEl, formElements, event.target.value, countries);
  });
}
/**
 * Reorder fields in the DOM and add data-attribute to fields given a country
 */


function reorderFields(rootEl, formElements, country) {
  var formFormat = country.formatting.edit;
  var countryWrapper = formElements.country.wrapper;
  var afterCountry = false;
  getOrderedField(formFormat).forEach(function (row) {
    row.forEach(function (line) {
      formElements[line].wrapper.dataset.lineCount = row.length;

      if (!formElements[line].wrapper) {
        return;
      }

      if (line === 'country') {
        afterCountry = true;
        return;
      }

      if (afterCountry) {
        rootEl.append(formElements[line].wrapper);
      } else {
        rootEl.insertBefore(formElements[line].wrapper, countryWrapper);
      }
    });
  });
}
/**
 * Update labels for a given country
 */


function setLabels(formElements, country) {
  Object.keys(formElements).forEach(function (formElementName) {
    formElements[formElementName].labels.forEach(function (label) {
      label.textContent = country.labels[formElementName];
    });
  });
}
/**
 * Add right countries in the dropdown for a given country
 */


function populateCountries(formElements, countries) {
  var countrySelect = formElements.country.input;
  var duplicatedCountrySelect = countrySelect.cloneNode(true);
  countries.forEach(function (country) {
    var optionElement = document.createElement('option');
    optionElement.value = country.code;
    optionElement.textContent = country.name;
    duplicatedCountrySelect.appendChild(optionElement);
  });
  countrySelect.innerHTML = duplicatedCountrySelect.innerHTML;

  if (countrySelect.dataset.default) {
    countrySelect.value = countrySelect.dataset.default;
  }
}
/**
 * Add right zones in the dropdown for a given country
 */


function populateZones(formElements, country) {
  var zoneEl = formElements.zone;

  if (!zoneEl) {
    return;
  }

  if (country.zones.length === 0) {
    zoneEl.wrapper.dataset.ariaHidden = 'true';
    zoneEl.input.innerHTML = '';
    return;
  }

  zoneEl.wrapper.dataset.ariaHidden = 'false';
  var zoneSelect = zoneEl.input;
  var duplicatedZoneSelect = zoneSelect.cloneNode(true);
  duplicatedZoneSelect.innerHTML = '';
  country.zones.forEach(function (zone) {
    var optionElement = document.createElement('option');
    optionElement.value = zone.code;
    optionElement.textContent = zone.name;
    duplicatedZoneSelect.appendChild(optionElement);
  });
  zoneSelect.innerHTML = duplicatedZoneSelect.innerHTML;

  if (zoneSelect.dataset.default) {
    zoneSelect.value = zoneSelect.dataset.default;
  }
}
/**
 * Will throw if an input or a label is missing from the wrapper
 */


function validateElements(formElements) {
  Object.keys(formElements).forEach(function (elementKey) {
    var element = formElements[elementKey].input;
    var labels = formElements[elementKey].labels;

    if (!element) {
      return;
    }

    if (typeof element !== 'object') {
      throw new TypeError(formElements[elementKey] + ' is missing an input or select.');
    } else if (typeof labels !== 'object') {
      throw new TypeError(formElements[elementKey] + ' is missing a label.');
    }
  });
}
/**
 * Given an countryCode (eg. 'CA'), will return the data of that country
 */


function getCountry(countryCode, countries) {
  countryCode = countryCode || 'CA';
  return countries.filter(function (country) {
    return country.code === countryCode;
  })[0];
}
/**
 * Given a format (eg. "{firstName}{lastName}_{company}_{address1}_{address2}_{city}_{country}{province}{zip}_{phone}")
 * will return an array of how the form needs to be formatted, eg.:
 * =>
 * [
 *   ['firstName', 'lastName'],
 *   ['company'],
 *   ['address1'],
 *   ['address2'],
 *   ['city'],
 *   ['country', 'province', 'zip'],
 *   ['phone']
 * ]
 */


function getOrderedField(format) {
  return format.split(LINE_DELIMITER).map(function (fields) {
    var result = fields.match(FIELD_REGEXP);

    if (!result) {
      return [];
    }

    return result.map(function (fieldName) {
      var newFieldName = fieldName.replace(/[{}]/g, '');

      switch (newFieldName) {
        case 'zip':
          return 'postalCode';

        case 'province':
          return 'zone';

        default:
          return newFieldName;
      }
    });
  });
}
/**
 * Given a rootEl where all `input`s, `select`s, and `labels` are nested, it
 * will returns all form elements (wrapper, input and labels) of the form.
 * See `FormElements` type for details
 */


function loadFormElements(rootEl, inputSelectors) {
  var elements = {};
  Object.keys(INPUT_SELECTORS).forEach(function (inputKey) {
    var input = rootEl.querySelector(inputSelectors[inputKey]);
    elements[inputKey] = input ? {
      wrapper: input.parentElement,
      input: input,
      labels: document.querySelectorAll('[for="' + input.id + '"]')
    } : {};
  });
  return elements;
}
/**
 * If shippingCountriesOnly is set to true, will return the list of countries the
 * shop ships to. Otherwise returns null.
 */


function loadShippingCountries(shippingCountriesOnly) {
  if (!shippingCountriesOnly) {
    // eslint-disable-next-line no-undef
    return Promise.resolve(null);
  }

  var response = fetch(location.origin + '/meta.json');
  return response.then(function (res) {
    return res.json();
  }).then(function (meta) {
    // If ships_to_countries has * in the list, it means the shop ships to
    // all countries
    return meta.ships_to_countries.indexOf('*') !== -1 ? null : meta.ships_to_countries;
  }).catch(function () {
    return null;
  });
}
/**
 * Only returns countries that are in includedCountryCodes
 * Returns all countries if no includedCountryCodes is passed
 */


function filterCountries(countries, includedCountryCodes) {
  if (!includedCountryCodes) {
    return countries;
  }

  return countries.filter(function (country) {
    return includedCountryCodes.indexOf(country.code) !== -1;
  });
}
;// CONCATENATED MODULE: ./node_modules/@shopify/theme-addresses/theme-addresses.js


;// CONCATENATED MODULE: ./src/js/modules/cart.js
/* provided dependency */ var cart_createElement = __webpack_require__(6295)["default"];

// eslint-disable-next-line no-unused-vars










class Cart {
  constructor() {
    var _this$container3, _this$container3$data;

    _defineProperty(this, "cart", {});

    _defineProperty(this, "selectors", {
      cartIcons: ['.sf-cart-icon'],
      cartCounts: ['.sf-cart-count'],
      cartDrawer: '.scd__wrapper',
      cartDrawerContent: '.scd__content',
      cartDrawerFooter: '.scd__footer',
      cartDrawerClose: '.scd__close',
      cartSubtotal: '[data-cart-subtotal-price]',
      cartTotal: '.scd__total',
      cartCheckout: '.scd__checkout',
      cartDiscountCode: '[name="discount"]',
      cartDrawerItems: '.scd__items',
      cartCountDown: '.scd__countdown',
      cartCountDownMessage: "[data-countdown-message]",
      footerActions: ['.scd__footer-actions button'],
      overlay: '.scd__overlay',
      addressForm: '[data-address="root"]',
      zipCode: '[name="address[zip]"]',
      province: '[name="address[province]"]',
      country: '[name="address[country]"]',
      shippingContent: '.scd__addon-message',
      cartNote: '[name="note"]',
      cartDiscounts: '[data-discounts]',
      cartDiscountsList: '[data-discounts-list]'
    });

    _defineProperty(this, "cartSelectors", {
      item: '[data-cart-item]',
      btn: ['.scd-item__btn'],
      qtyInput: ['.scd-item__qty_input'],
      qtyNumb: ['.scd-item__qty_numb'],
      remove: '.scd-item__remove',
      linePrice: '[data-cart-item-final-price]',
      orgLinePrice: ['[data-cart-item-original-price]']
    });

    _defineProperty(this, "scrollHandlerAdded", false);

    _defineProperty(this, "countdownTimerStarted", false);

    _defineProperty(this, "transitionDuration", 300);

    _defineProperty(this, "openAddon", null);

    _defineProperty(this, "buttonActive", null);

    _defineProperty(this, "discountCodeKey", 'sf-discount-code');

    _defineProperty(this, "queryDomNodes", () => {
      this.domNodes = queryDomNodes(this.selectors);
    });

    _defineProperty(this, "initCartCountDown", () => {
      const {
        cartCountDown
      } = this.domNodes;

      if (cartCountDown) {
        const startTime = Date.now();
        const duration = Number(cartCountDown.dataset.countdownTime) || 5;
        const repeat = cartCountDown.dataset.repeat === 'true';
        const message = cartCountDown.dataset.timeoutMessage;
        const endTime = startTime + duration * 60 * 1000;
        this.countdownTimer = new countdown_timer(cartCountDown, startTime, endTime, {
          addZeroPrefix: false,
          loop: repeat,
          callback: () => {
            if (!repeat && message) {
              this.domNodes.cartCountDownMessage.innerHTML = message;
              cartCountDown.classList.add('time-out');
              cartCountDown.style.color = '#f44336';
            }
          }
        });
        this.countdownTimerStarted = true;
      }
    });

    _defineProperty(this, "updateCurrency", (item, value) => {
      if (item) {
        var _window, _window$spratlyThemeS;

        item.innerHTML = formatMoney(value, (_window = window) === null || _window === void 0 ? void 0 : (_window$spratlyThemeS = _window.spratlyThemeSettings) === null || _window$spratlyThemeS === void 0 ? void 0 : _window$spratlyThemeS.money_format);
      }
    });

    _defineProperty(this, "addScrollHandler", () => {
      var _this$domNodes, _this$domNodes$cartDr, _this$domNodes2, _this$domNodes2$cartD, _this$domNodes3, _this$domNodes3$cartD, _this$domNodes3$cartD2;

      const cartItemsOffsetTop = (_this$domNodes = this.domNodes) === null || _this$domNodes === void 0 ? void 0 : (_this$domNodes$cartDr = _this$domNodes.cartDrawerItems) === null || _this$domNodes$cartDr === void 0 ? void 0 : _this$domNodes$cartDr.offsetTop;
      const footerHeight = (_this$domNodes2 = this.domNodes) === null || _this$domNodes2 === void 0 ? void 0 : (_this$domNodes2$cartD = _this$domNodes2.cartDrawerFooter) === null || _this$domNodes2$cartD === void 0 ? void 0 : _this$domNodes2$cartD.offsetHeight;
      const cartItemsPaddingTop = '10px';
      (_this$domNodes3 = this.domNodes) === null || _this$domNodes3 === void 0 ? void 0 : (_this$domNodes3$cartD = _this$domNodes3.cartDrawerItems) === null || _this$domNodes3$cartD === void 0 ? void 0 : (_this$domNodes3$cartD2 = _this$domNodes3$cartD.style) === null || _this$domNodes3$cartD2 === void 0 ? void 0 : _this$domNodes3$cartD2.setProperty('--scd-items-max-height', `calc(100vh - ${cartItemsOffsetTop}px - ${footerHeight}px - ${cartItemsPaddingTop})`);
      this.scrollHandlerAdded = true;
    });

    _defineProperty(this, "setCartItemData", item => {
      const key = item.dataset.lineKey;
      const itemDomNodes = queryDomNodes(this.cartSelectors, item);
      const itemData = { ...itemDomNodes,
        key,
        item,
        quantity: Number(itemDomNodes.qtyInput[0].value)
      };
      this.cartItems[key] = itemData;
    });

    _defineProperty(this, "getCartItemData", id => {
      if (!this.cartItems[id]) {
        const item = this.domNodes.cartDrawerContent.querySelector(`${this.cartSelectors.item}[data-line-key="${id}"]`);
        this.setCartItemData(item);
      }

      return this.cartItems[id];
    });

    _defineProperty(this, "getCart", () => {
      return (0,utilities_fetch.fetchJSON)('/cart.json');
    });

    _defineProperty(this, "changeCart", lineItem => {
      return (0,utilities_fetch.fetchJSON)('/cart/change.js', { ...(0,utilities_fetch.getRequestDefaultConfigs)(),
        method: 'POST',
        body: JSON.stringify(lineItem)
      });
    });

    _defineProperty(this, "updateCart", data => {
      return (0,utilities_fetch.fetchJSON)('/cart/update.js', { ...(0,utilities_fetch.getRequestDefaultConfigs)(),
        method: 'POST',
        body: JSON.stringify(data)
      });
    });

    _defineProperty(this, "removeItem", (lineItem, key) => {
      this.loading.start();
      this.changeCart(lineItem).then(cart => {
        var _window2, _window2$Shopify, _window2$Shopify$onCa;

        this.loading.finish(() => {
          this.removeItemDomNode(key);
          this.updateCartSubtotal(cart.total_price);
        });
        (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$Shopify = _window2.Shopify) === null || _window2$Shopify === void 0 ? void 0 : (_window2$Shopify$onCa = _window2$Shopify.onCartUpdate) === null || _window2$Shopify$onCa === void 0 ? void 0 : _window2$Shopify$onCa.call(_window2$Shopify, cart);
      });
    });

    _defineProperty(this, "removeItemDomNode", key => {
      var _this$cartItems$key, _this$cartItems$key$i;

      (_this$cartItems$key = this.cartItems[key]) === null || _this$cartItems$key === void 0 ? void 0 : (_this$cartItems$key$i = _this$cartItems$key.item) === null || _this$cartItems$key$i === void 0 ? void 0 : _this$cartItems$key$i.remove();
      delete this.cartItems[key];
    });

    _defineProperty(this, "changeItemQty", ({
      key,
      quantity
    }) => {
      this.loading.start();
      this.changeCart({
        id: key,
        quantity
      }).then(cart => {
        var _window4, _window4$Shopify, _window4$Shopify$onCa;

        this.loading.finish(() => {
          var _cart$items;

          const newItem = cart === null || cart === void 0 ? void 0 : (_cart$items = cart.items) === null || _cart$items === void 0 ? void 0 : _cart$items.find(item => item.key === key);

          if (quantity === 0) {
            var _this$cartItems$key2, _this$cartItems$key2$;

            (_this$cartItems$key2 = this.cartItems[key]) === null || _this$cartItems$key2 === void 0 ? void 0 : (_this$cartItems$key2$ = _this$cartItems$key2.item) === null || _this$cartItems$key2$ === void 0 ? void 0 : _this$cartItems$key2$.remove();
            delete this.cartItems[key];
            this.updateCartSubtotal(cart.total_price);
          } else {
            this.updateCartDrawerItem(key, newItem);
            this.updateCartSubtotal(cart.total_price);

            if (quantity > (newItem === null || newItem === void 0 ? void 0 : newItem.quantity)) {
              var _window3, _window3$spratlyTheme;

              const message = ((_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$spratlyTheme = _window3.spratlyThemeSettings) === null || _window3$spratlyTheme === void 0 ? void 0 : _window3$spratlyTheme.not_enough_item_message) ?? 'Not enough items available. Only __inventory_quantity__ left.';
              notification === null || notification === void 0 ? void 0 : notification.show({
                target: this.cartItems[key].item,
                type: 'warning',
                message: message.replace('__inventory_quantity__', newItem === null || newItem === void 0 ? void 0 : newItem.quantity)
              });
            }
          } // this.updateCartCount(cart)

        });
        (_window4 = window) === null || _window4 === void 0 ? void 0 : (_window4$Shopify = _window4.Shopify) === null || _window4$Shopify === void 0 ? void 0 : (_window4$Shopify$onCa = _window4$Shopify.onCartUpdate) === null || _window4$Shopify$onCa === void 0 ? void 0 : _window4$Shopify$onCa.call(_window4$Shopify, cart);
      }).catch(err => {
        this.loading.finish();

        if ((err === null || err === void 0 ? void 0 : err.status) === 422) {
          var _window5, _window5$spratlyTheme;

          const message = ((_window5 = window) === null || _window5 === void 0 ? void 0 : (_window5$spratlyTheme = _window5.spratlyThemeSettings) === null || _window5$spratlyTheme === void 0 ? void 0 : _window5$spratlyTheme.sold_out_items_message) ?? 'The product is already sold out.';
          notification === null || notification === void 0 ? void 0 : notification.show({
            target: this.cartItems[key].item,
            type: 'warning',
            message
          });
        }

        console.log("Failed to change item quantity: ", err);
      });
    });

    _defineProperty(this, "updateCartDrawerItem", (id, newItem) => {
      const currItem = this.getCartItemData(id);

      if (currItem && newItem) {
        var _currItem$qtyNumb, _currItem$qtyNumb$for;

        const newQty = newItem.quantity;
        currItem.qtyInput.forEach(input => input.value = newQty);
        currItem.quantity = newQty;
        currItem === null || currItem === void 0 ? void 0 : (_currItem$qtyNumb = currItem.qtyNumb) === null || _currItem$qtyNumb === void 0 ? void 0 : (_currItem$qtyNumb$for = _currItem$qtyNumb.forEach) === null || _currItem$qtyNumb$for === void 0 ? void 0 : _currItem$qtyNumb$for.call(_currItem$qtyNumb, qtyNb => qtyNb.textContent = newQty);
        this.updateCurrency(currItem === null || currItem === void 0 ? void 0 : currItem.linePrice, newItem.final_line_price);
        currItem === null || currItem === void 0 ? void 0 : currItem.orgLinePrice.forEach(line => this.updateCurrency(line, newItem.original_line_price));
      }
    });

    _defineProperty(this, "updateCartSubtotal", total_price => {
      const {
        cartSubtotal
      } = this.domNodes; // this.updateCurrency(cartSubtotal, cart.original_total_price)

      this.updateCurrency(cartSubtotal, total_price);
      this.updateCartDiscount();
    });

    _defineProperty(this, "updateCartDiscount", () => {
      return fetch(`${window.spratlyThemeSettings.rootUrl}?section_id=cart-discounts`).then(res => res.text()).then(html => {
        var _this$domNodes$cartDi, _window6, _window6$_ThemeEvent, _window6$_ThemeEvent$;

        const dom = generateDomFromString(html);
        console.log(this.domNodes.cartDiscountsList, 'this.domNodes.cartDiscountsList');
        (_this$domNodes$cartDi = this.domNodes.cartDiscountsList) === null || _this$domNodes$cartDi === void 0 ? void 0 : _this$domNodes$cartDi.remove();
        this.domNodes.cartDiscountsList = dom.querySelector(this.selectors.cartDiscountsList);

        if (this.domNodes.cartDiscountsList) {
          var _this$domNodes$cartDi2;

          (_this$domNodes$cartDi2 = this.domNodes.cartDiscounts) === null || _this$domNodes$cartDi2 === void 0 ? void 0 : _this$domNodes$cartDi2.appendChild(this.domNodes.cartDiscountsList);
        }

        (_window6 = window) === null || _window6 === void 0 ? void 0 : (_window6$_ThemeEvent = _window6._ThemeEvent) === null || _window6$_ThemeEvent === void 0 ? void 0 : (_window6$_ThemeEvent$ = _window6$_ThemeEvent.emit) === null || _window6$_ThemeEvent$ === void 0 ? void 0 : _window6$_ThemeEvent$.call(_window6$_ThemeEvent, 'ON_DISCOUNT_UPDATE');
      });
    });

    _defineProperty(this, "refreshCart", async () => {
      const cart = await this.getCart();
      this.cart = cart; // this.updateCartCount(cart)

      await this.updateCartDrawerView(cart);
      return cart;
    });

    _defineProperty(this, "updateCartDrawerView", cart => {
      cart === null || cart === void 0 ? void 0 : cart.items.forEach((item, index) => {
        const inCartItem = this.cartItems[item.key];

        if (!inCartItem) {
          this.addNewItem(item, index);
        } else if (inCartItem.quantity !== item.quantity) {
          this.updateCartDrawerItem(inCartItem.key, item);
        }

        this.updateCartSubtotal(cart.total_price);
      });
    });

    _defineProperty(this, "addNewItem", (item, index) => {
      var _this$domNodes4, _this$domNodes4$cartD;

      const newItem = cart_createElement(CartDrawerItem, {
        item: item,
        index: index
      });
      this === null || this === void 0 ? void 0 : (_this$domNodes4 = this.domNodes) === null || _this$domNodes4 === void 0 ? void 0 : (_this$domNodes4$cartD = _this$domNodes4.cartDrawerItems) === null || _this$domNodes4$cartD === void 0 ? void 0 : _this$domNodes4$cartD.prepend(newItem);
      this.setCartItemData(newItem);
    });

    _defineProperty(this, "updateCartCount", cart => {
      if (Number(cart.item_count) < 1) {
        var _this$container, _this$container$class;

        (_this$container = this.container) === null || _this$container === void 0 ? void 0 : (_this$container$class = _this$container.classList) === null || _this$container$class === void 0 ? void 0 : _this$container$class.remove('cart-has-items');

        if (this.countdownTimer) {
          this.countdownTimer.clear();
          this.countdownTimerStarted = false;
        }

        document.body.classList.add('cart-empty');
      } else {
        var _this$container2, _this$container2$clas;

        (_this$container2 = this.container) === null || _this$container2 === void 0 ? void 0 : (_this$container2$clas = _this$container2.classList) === null || _this$container2$clas === void 0 ? void 0 : _this$container2$clas.add('cart-has-items');
        document.body.classList.remove('cart-empty');

        if (!this.countdownTimerStarted && this.countdownTimer) {
          this.countdownTimer.start();
          this.countdownTimerStarted = true;
        }
      }

      [...this.domNodes.cartCounts].forEach(cartCount => {
        cartCount.textContent = cart.item_count;
      });
    });

    _defineProperty(this, "updateCartNote", () => {
      this.updateCart({
        note: this.domNodes.cartNote.value
      }).then(res => {
        console.log(res, 'res cart note');
      });
    });

    _defineProperty(this, "openCartDrawer", e => {
      var _window7, _window7$spratlyTheme;

      if (((_window7 = window) === null || _window7 === void 0 ? void 0 : (_window7$spratlyTheme = _window7.spratlyThemeSettings) === null || _window7$spratlyTheme === void 0 ? void 0 : _window7$spratlyTheme.template) === 'cart') return;
      e === null || e === void 0 ? void 0 : e.preventDefault();
      const {
        cartDrawer,
        cartDrawerContent
      } = this.domNodes;

      if (cartDrawer && cartDrawerContent) {
        if (window.innerWidth < 770) {
          document.documentElement.classList.add('prevent-scroll');
          cartDrawer.classList.add('mobile');
        }

        cartDrawer.classList.remove('hidden');
        setTimeout(() => {
          cartDrawer.style.setProperty('--tw-bg-opacity', '0.5');
          cartDrawerContent === null || cartDrawerContent === void 0 ? void 0 : cartDrawerContent.classList.remove('translate-x-full');
          !this.scrollHandlerAdded && this.addScrollHandler();
        }, 50);
      }
    });

    _defineProperty(this, "closeCartDrawer", () => {
      const {
        cartDrawer,
        cartDrawerContent
      } = this.domNodes;

      if (cartDrawer && cartDrawerContent) {
        var _cartDrawer$style;

        cartDrawer === null || cartDrawer === void 0 ? void 0 : (_cartDrawer$style = cartDrawer.style) === null || _cartDrawer$style === void 0 ? void 0 : _cartDrawer$style.setProperty('--tw-bg-opacity', '0');
        cartDrawerContent === null || cartDrawerContent === void 0 ? void 0 : cartDrawerContent.classList.add('translate-x-full');
        setTimeout(() => {
          var _cartDrawer$classList, _cartDrawer$classList2;

          cartDrawer === null || cartDrawer === void 0 ? void 0 : (_cartDrawer$classList = cartDrawer.classList) === null || _cartDrawer$classList === void 0 ? void 0 : _cartDrawer$classList.add('hidden');
          cartDrawer === null || cartDrawer === void 0 ? void 0 : (_cartDrawer$classList2 = cartDrawer.classList) === null || _cartDrawer$classList2 === void 0 ? void 0 : _cartDrawer$classList2.remove('mobile');
          document.documentElement.classList.remove('prevent-scroll');
          this.closeAddon();
        }, this.transitionDuration);
      }
    });

    _defineProperty(this, "initCartAddons", () => {
      addEventDelegate({
        selector: '.scd__footer-actions button',
        handler: (evt, target) => {
          var _window$spratlyThemeS2, _this$domNodes$overla;

          evt.preventDefault();

          if (((_window$spratlyThemeS2 = window.spratlyThemeSettings) === null || _window$spratlyThemeS2 === void 0 ? void 0 : _window$spratlyThemeS2.template) === 'cart') {
            var _document$querySelect, _document$querySelect2;

            (_document$querySelect = document.querySelector('.scd__addon.open')) === null || _document$querySelect === void 0 ? void 0 : (_document$querySelect2 = _document$querySelect.classList) === null || _document$querySelect2 === void 0 ? void 0 : _document$querySelect2.remove('open');
          }

          const action = target.dataset.open;
          const targetAddon = this.domNodes.cartDrawer.querySelector(`#scd-${action}`);
          target.classList.add('active');
          targetAddon === null || targetAddon === void 0 ? void 0 : targetAddon.classList.add('open');
          (_this$domNodes$overla = this.domNodes.overlay) === null || _this$domNodes$overla === void 0 ? void 0 : _this$domNodes$overla.classList.add('open');
          this.buttonActive = target;
          this.openAddon = targetAddon;

          if (action === 'shipping') {
            this.initAddressForm();
          }
        }
      });
      addEventDelegate({
        selector: '.btn-cancel',
        context: this.domNodes.cartDrawer,
        handler: e => {
          e.preventDefault();
          this.closeAddon();
        }
      });
      addEventDelegate({
        selector: '.btn-calc',
        context: this.domNodes.cartDrawer,
        handler: e => {
          e.preventDefault();
          this.calculateShipping();
        }
      });

      if (this.domNodes.cartDiscountCode) {
        const code = localStorage.getItem(this.discountCodeKey);
        if (code) this.domNodes.cartDiscountCode.value = code;
      }

      this.saveAddonValue();
    });

    _defineProperty(this, "closeAddon", () => {
      var _this$openAddon, _this$buttonActive, _this$domNodes$overla2;

      (_this$openAddon = this.openAddon) === null || _this$openAddon === void 0 ? void 0 : _this$openAddon.classList.remove('open');
      (_this$buttonActive = this.buttonActive) === null || _this$buttonActive === void 0 ? void 0 : _this$buttonActive.classList.remove('active');
      (_this$domNodes$overla2 = this.domNodes.overlay) === null || _this$domNodes$overla2 === void 0 ? void 0 : _this$domNodes$overla2.classList.remove('open');
      this.openAddon = null;
      this.buttonActive = null;
    });

    _defineProperty(this, "initAddressForm", () => {
      var _window$Shopify;

      AddressForm(this.domNodes.addressForm, (_window$Shopify = window.Shopify) === null || _window$Shopify === void 0 ? void 0 : _window$Shopify.locale);
    });

    _defineProperty(this, "calculateShipping", () => {
      var _this$domNodes$zipCod;

      const zipCode = (_this$domNodes$zipCod = this.domNodes.zipCode.value) === null || _this$domNodes$zipCod === void 0 ? void 0 : _this$domNodes$zipCod.trim();
      const country = this.domNodes.country.value;
      const province = this.domNodes.province.value;
      this.domNodes.shippingContent.classList.remove('error');
      this.domNodes.shippingContent.innerHTML = '';
      fetch(`/cart/shipping_rates.json?shipping_address%5Bzip%5D=${zipCode}&shipping_address%5Bcountry%5D=${country}&shipping_address%5Bprovince%5D=${province}`).then(res => res.json()).then(res => {
        if (res && res.shipping_rates) {
          const {
            shipping_rates
          } = res;

          if (shipping_rates.length > 0) {
            var _window8, _window8$spratlyTheme;

            this.domNodes.shippingContent.appendChild(cart_createElement("p", {
              className: 'mb-3 text-base'
            }, (_window8 = window) === null || _window8 === void 0 ? void 0 : (_window8$spratlyTheme = _window8.spratlyThemeStrings) === null || _window8$spratlyTheme === void 0 ? void 0 : _window8$spratlyTheme.shippingRatesResult.replace('{{count}}', shipping_rates.length)));
            shipping_rates.map(rate => {
              var _window9, _window9$spratlyTheme;

              const rateNode = cart_createElement("span", null);
              rateNode.innerHTML = formatMoney(rate.price, (_window9 = window) === null || _window9 === void 0 ? void 0 : (_window9$spratlyTheme = _window9.spratlyThemeSettings) === null || _window9$spratlyTheme === void 0 ? void 0 : _window9$spratlyTheme.money_format);
              this.domNodes.shippingContent.appendChild(cart_createElement("p", null, rate.name, ": ", rateNode)); // this.domNodes.shippingContent.appendChild(<p>{rate.name}: {formatMoney(rate.price, window?.spratlyThemeSettings?.money_format)}</p>)
            });
          } else {
            this.domNodes.shippingContent.innerHTML = `<p>{window?.spratlyThemeStrings?.noShippingRate}</p>`;
          }
        } else {
          this.domNodes.shippingContent.classList.add('error');
          Object.entries(res).map(error => {
            const message = `${error[0]} ${error[1][0]}`;
            this.domNodes.shippingContent.appendChild(cart_createElement("p", null, message));
          });
        }
      }).catch(error => {
        console.log(error, 'error');
      });
    });

    _defineProperty(this, "saveAddonValue", () => {
      if (this.domNodes.cartDiscountCode) {
        addEventDelegate({
          event: 'click',
          context: this.domNodes.cartDrawer,
          selector: '.btn-save',
          handler: (e, target) => {
            e.preventDefault();

            if ((target === null || target === void 0 ? void 0 : target.dataset.action) === 'coupon') {
              const code = this.domNodes.cartDiscountCode.value;
              localStorage.setItem(this.discountCodeKey, code);
            }

            if ((target === null || target === void 0 ? void 0 : target.dataset.action) === 'note') {
              this.updateCartNote();
            }

            this.closeAddon();
          }
        });
      }
    });

    this.container = document.querySelector('section.sf-header');

    if ((this === null || this === void 0 ? void 0 : (_this$container3 = this.container) === null || _this$container3 === void 0 ? void 0 : (_this$container3$data = _this$container3.dataset) === null || _this$container3$data === void 0 ? void 0 : _this$container3$data.page) === '/cart') {
      this.container = document.documentElement;
    }

    this.queryDomNodes();
    this.loading = new AnimateLoading(this.domNodes.cartDrawerContent);
    this.cartItems = {};
    this.init();
  }

  async init() {
    var _window10, _window10$_ThemeEvent, _window10$_ThemeEvent2;

    addEventDelegate({
      selector: this.selectors.cartIcons[0],
      handler: this.openCartDrawer
    });
    addEventDelegate({
      selector: this.selectors.cartDrawerClose,
      handler: this.closeCartDrawer
    });
    addEventDelegate({
      selector: this.selectors.cartDrawer,
      handler: e => {
        if (e.target === this.domNodes.cartDrawer) {
          this.closeCartDrawer();
        }
      }
    });
    addEventDelegate({
      context: this.domNodes.cartDrawer,
      selector: this.cartSelectors.btn[0],
      handler: (e, btn) => {
        e.preventDefault();
        const [qtyChange, key] = btn.dataset.qtyChange.split('--');
        let {
          quantity
        } = this.getCartItemData(key);
        quantity += qtyChange === 'dec' ? -1 : +1;
        this.changeItemQty({
          key,
          quantity
        });
      }
    });
    addEventDelegate({
      context: this.domNodes.cartDrawer,
      event: 'change',
      selector: this.cartSelectors.qtyInput[0],
      handler: (e, input) => {
        e.preventDefault();
        const key = input.dataset.lineKey;
        const quantity = Number(input.value);
        this.changeItemQty({
          key,
          quantity
        });
      }
    });
    addEventDelegate({
      context: this.domNodes.cartDrawer,
      selector: this.cartSelectors.remove,
      handler: (e, removeBtn) => {
        var _removeBtn$dataset, _removeBtn$dataset2;

        e.preventDefault();
        const line = removeBtn === null || removeBtn === void 0 ? void 0 : (_removeBtn$dataset = removeBtn.dataset) === null || _removeBtn$dataset === void 0 ? void 0 : _removeBtn$dataset.itemIndex;
        const key = removeBtn === null || removeBtn === void 0 ? void 0 : (_removeBtn$dataset2 = removeBtn.dataset) === null || _removeBtn$dataset2 === void 0 ? void 0 : _removeBtn$dataset2.lineKey;

        if (line) {
          var _this$cart, _this$cart$items;

          console.log("hererrererreer");
          const index = (_this$cart = this.cart) === null || _this$cart === void 0 ? void 0 : (_this$cart$items = _this$cart.items) === null || _this$cart$items === void 0 ? void 0 : _this$cart$items.findIndex(item => item.key === key);
          this.removeItem({
            line: index + 1,
            quantity: 0
          }, key);
        }
      }
    });
    [...this.domNodes.cartDrawer.querySelectorAll(this.cartSelectors.item)].forEach(this.setCartItemData);
    this.initCartCountDown();
    this.initCartAddons();
    this.cart = await this.getCart();
    (_window10 = window) === null || _window10 === void 0 ? void 0 : (_window10$_ThemeEvent = _window10._ThemeEvent) === null || _window10$_ThemeEvent === void 0 ? void 0 : (_window10$_ThemeEvent2 = _window10$_ThemeEvent.subscribe) === null || _window10$_ThemeEvent2 === void 0 ? void 0 : _window10$_ThemeEvent2.call(_window10$_ThemeEvent, 'ON_CART_UPDATE', cart => {
      this.cart = cart;
      this.updateCartCount(cart);
    });
  }

}

/* harmony default export */ var cart = (Cart);
;// CONCATENATED MODULE: ./src/js/modules/siteNav.js


class SiteNav {
  constructor(container) {
    _defineProperty(this, "selectors", {
      menuItems: ['.sf-nav .sf-menu-item'],
      dropdowns: ['.sf-menu__submenu'],
      subMenu: '.sf-menu__submenu',
      dropdownBg: '.sf-nav__bg',
      overlay: '.sf-header__overlay',
      swiper: '.swiper-container'
    });

    _defineProperty(this, "classes", {
      slideFromRight: 'slide-from-right',
      slideReveal: 'slide-reveal',
      active: 'sf-mega-active'
    });

    _defineProperty(this, "headerSticky", false);

    _defineProperty(this, "attachEvents", () => {
      this.domNodes.menuItems.forEach((menuItem, index) => {
        menuItem.addEventListener('mouseenter', evt => this.onMenuItemEnter(evt, index));
        menuItem.addEventListener('mouseleave', evt => this.onMenuItemLeave(evt, index));
      });
    });

    _defineProperty(this, "initDropdownSize", () => {
      var _this$container, _this$container2;

      (_this$container = this.container) === null || _this$container === void 0 ? void 0 : _this$container.style.setProperty('--sf-dropdown-width', this.windowWidth());
      (_this$container2 = this.container) === null || _this$container2 === void 0 ? void 0 : _this$container2.style.setProperty('--sf-dropdown-height', this.windowHeight());
    });

    _defineProperty(this, "onMenuItemEnter", (evt, index) => {
      var _target$dataset, _this$container3, _this$container4, _this$container5, _this$container6, _this$container7;

      const {
        target
      } = evt;
      console.log(evt, 'enter');
      if (target.classList.contains('sf-menu-item--no-mega')) return;
      clearTimeout(this.timeoutLeave);
      this.activeIndex = Number((_target$dataset = target.dataset) === null || _target$dataset === void 0 ? void 0 : _target$dataset.index);
      this.headerSticky = ((_this$container3 = this.container) === null || _this$container3 === void 0 ? void 0 : _this$container3.dataset.sticky) === 'true';
      this.reInitSlider(target);
      this.visited ? (_this$container4 = this.container) === null || _this$container4 === void 0 ? void 0 : _this$container4.classList.remove(this.classes.slideReveal) : (_this$container5 = this.container) === null || _this$container5 === void 0 ? void 0 : _this$container5.classList.add(this.classes.slideReveal);
      this.visited = true;
      this.lastActiveIndex >= 0 && this.activeIndex >= 0 && (this.lastActiveIndex < this.activeIndex ? (_this$container6 = this.container) === null || _this$container6 === void 0 ? void 0 : _this$container6.classList.add(this.classes.slideFromRight) : this.lastActiveIndex > this.activeIndex && ((_this$container7 = this.container) === null || _this$container7 === void 0 ? void 0 : _this$container7.classList.remove(this.classes.slideFromRight)));
      this.getElementBoundingRect(target).then(rect => {
        if (rect) {
          var _this$container8, _this$container9;

          (_this$container8 = this.container) === null || _this$container8 === void 0 ? void 0 : _this$container8.style.setProperty('--sf-dropdown-width', rect.width);
          (_this$container9 = this.container) === null || _this$container9 === void 0 ? void 0 : _this$container9.style.setProperty('--sf-dropdown-height', rect.height);
        }

        this.timeoutEnter = setTimeout(() => {
          var _this$container10;

          if (this.activeIndex !== Number(target.dataset.index)) return;
          (_this$container10 = this.container) === null || _this$container10 === void 0 ? void 0 : _this$container10.classList.add(this.classes.active);
          target.closest('.sf-menu-item').classList.add('sf-menu-item--active');
        }, 120);
      });
    });

    _defineProperty(this, "onMenuItemLeave", (evt, index) => {
      // console.log(evt, 'leave')
      this.activeIndex = -1;
      this.lastActiveIndex = index;
      evt.target.closest('.sf-menu-item').classList.remove('sf-menu-item--active');
      this.timeoutLeave = setTimeout(() => {
        if (this.activeIndex === -1 || this.activeIndex < 0) {
          this.visited = false;
        }

        this.resetMegaMenu(evt.target);
      }, 80);
    });

    _defineProperty(this, "reInitSlider", menuItem => {
      var _window, _window$spratlyTheme;

      const swiper = menuItem.querySelector(this.selectors.swiper);
      if (!swiper) return;
      const itemIndex = menuItem.dataset.index;
      const slider = (_window = window) === null || _window === void 0 ? void 0 : (_window$spratlyTheme = _window.spratlyTheme) === null || _window$spratlyTheme === void 0 ? void 0 : _window$spratlyTheme.headerSliders[itemIndex];
      slider === null || slider === void 0 ? void 0 : slider.update();
    });

    _defineProperty(this, "getElementBoundingRect", async element => {
      const subMenu = element.querySelector(this.selectors.subMenu);

      if (subMenu) {
        const rect = subMenu.getBoundingClientRect();
        return {
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top
        };
      }
    });

    _defineProperty(this, "resetMegaMenu", () => {
      var _this$container11;

      this.activeIndex = -1;
      clearTimeout(this.timeoutEnter);
      (_this$container11 = this.container) === null || _this$container11 === void 0 ? void 0 : _this$container11.classList.remove(this.classes.active, this.classes.slideFromRight, this.classes.slideReveal, 'sf-header--bg-black', 'sf-header--bg-white');
    });

    _defineProperty(this, "windowWidth", () => {
      return window.innerWidth;
    });

    _defineProperty(this, "windowHeight", () => {
      return window.innerHeight;
    });

    _defineProperty(this, "destroy", () => {
      this.domNodes.menuItems.forEach((menuItem, index) => {
        menuItem.removeEventListener('mouseenter', evt => this.onMenuItemEnter(evt, index));
        menuItem.removeEventListener('mouseleave', evt => this.onMenuItemLeave(evt, index));
      });
    });

    if (!container) return;
    this.container = container;
    this.domNodes = queryDomNodes(this.selectors, this.container);
    this.activeIndex = -1;
    this.lastActiveIndex = -1;
    this.visited = false;
    this.timeoutEnter = null;
    this.timeoutLeave = null;
    this.attachEvents();
  }

}
;// CONCATENATED MODULE: ./src/js/utilities/select.js
function customSelect(container) {
  let x, i, j, l, ll, selElmnt, a, b, c, ar, at;
  x = container.getElementsByClassName("sf__custom-select");
  l = x.length;

  if (x.length > 0) {
    for (i = 0; i < l; i++) {
      var _selElmnt$options$sel;

      selElmnt = x[i].getElementsByTagName("select")[0];
      ll = selElmnt.length;
      /*for each element, create a new DIV that will act as the selected item:*/

      a = document.createElement("DIV");
      a.setAttribute("class", "select-selected");
      at = document.createElement("SPAN");
      at.innerHTML = (_selElmnt$options$sel = selElmnt.options[selElmnt.selectedIndex]) === null || _selElmnt$options$sel === void 0 ? void 0 : _selElmnt$options$sel.innerHTML;
      x[i].appendChild(a);
      a.appendChild(at);
      ar = document.createElement("SPAN");
      ar.innerHTML = `<svg fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M441.9 167.3l-19.8-19.8c-4.7-4.7-12.3-4.7-17 0L224 328.2 42.9 147.5c-4.7-4.7-12.3-4.7-17 0L6.1 167.3c-4.7 4.7-4.7 12.3 0 17l209.4 209.4c4.7 4.7 12.3 4.7 17 0l209.4-209.4c4.7-4.7 4.7-12.3 0-17z"/></svg>`;
      ar.setAttribute("class", "select-arrow");
      a.appendChild(ar);
      /*for each element, create a new DIV that will contain the option list:*/

      b = document.createElement("DIV");
      b.setAttribute("class", "select-items select-hide");

      for (j = 0; j < ll; j++) {
        /*for each option in the original select element,
        create a new DIV that will act as an option item:*/
        c = document.createElement("DIV");
        c.innerHTML = selElmnt.options[j].innerHTML;

        if (selElmnt.options[j].getAttribute('selected')) {
          c.setAttribute("class", "same-as-selected");
        }

        c.addEventListener("click", function (e) {
          /*when an item is clicked, update the original select box,
          and the selected item:*/
          let y, i, k, s, h, sl, yl;
          s = this.parentNode.parentNode.getElementsByTagName("select")[0];
          sl = s.length;
          h = this.parentNode.previousSibling;

          for (i = 0; i < sl; i++) {
            if (s.options[i].innerHTML == this.innerHTML) {
              s.selectedIndex = i;
              h.childNodes[0].innerHTML = this.innerHTML;
              y = this.parentNode.getElementsByClassName("same-as-selected");
              yl = y.length;

              for (k = 0; k < yl; k++) {
                y[k].removeAttribute("class");
              }

              this.setAttribute("class", "same-as-selected");
              break;
            }
          }

          s.dispatchEvent(new Event('change'));
          s.dispatchEvent(new Event('click'));
          h.click();
        });
        b.appendChild(c);
      }

      x[i].appendChild(b);
      a.addEventListener("click", function (e) {
        /*when the select box is clicked, close any other select boxes,
        and open/close the current select box:*/
        e.stopPropagation();
        closeAllSelect(this);
        this.nextSibling.classList.toggle("select-hide");
        this.classList.toggle("select-arrow-active");
      });
    }
  }
}

function closeAllSelect(elmnt) {
  /*a function that will close all select boxes in the document,
  except the current select box:*/
  var x,
      y,
      i,
      xl,
      yl,
      arrNo = [];
  x = document.getElementsByClassName("select-items");
  y = document.getElementsByClassName("select-selected");
  xl = x.length;
  yl = y.length;

  for (i = 0; i < yl; i++) {
    if (elmnt == y[i]) {
      arrNo.push(i);
    } else {
      y[i].classList.remove("select-arrow-active");
    }
  }

  for (i = 0; i < xl; i++) {
    if (arrNo.indexOf(i)) {
      x[i].classList.add("select-hide");
    }
  }
}
/*if the user clicks anywhere outside the select box,
then close all select boxes:*/


document.addEventListener("click", closeAllSelect);
;// CONCATENATED MODULE: ./src/js/sections/header.js






register('header', {
  onLoad: function () {
    var _this$container, _this$container$datas, _this$container2, _this$container2$data;

    this.isDesignMode = ((_this$container = this.container) === null || _this$container === void 0 ? void 0 : (_this$container$datas = _this$container.dataset) === null || _this$container$datas === void 0 ? void 0 : _this$container$datas.designMode) === 'true';
    this.selectors = {
      headers: ['header'],
      logos: ['.sf-logo'],
      topbar: '.sf-topbar',
      headerWrapper: '.header__wrapper',
      topbarClose: '.sf-topbar__close'
    };
    customSelect(this.container);
    this.domNodes = queryDomNodes(this.selectors, this.container);
    this.innerWidth = window.innerWidth;
    this.offsetTop = this.domNodes.headerWrapper.offsetTop;
    this.headerHeight = this.domNodes.headerWrapper.offsetHeight;
    this.stickyEnabled = ((_this$container2 = this.container) === null || _this$container2 === void 0 ? void 0 : (_this$container2$data = _this$container2.dataset) === null || _this$container2$data === void 0 ? void 0 : _this$container2$data.sticky) === 'true' || false;
    this.classes = {
      scrollUp: 'scroll-up',
      scrollDown: 'scroll-down',
      stuck: 'stuck'
    };

    try {
      var _this$domNodes, _this$domNodes$header, _this$domNodes$header2, _this$domNodes$header3, _window, _window$_shh, _window2, _window2$_smcp;

      this.transparentHeader = ((_this$domNodes = this.domNodes) === null || _this$domNodes === void 0 ? void 0 : (_this$domNodes$header = _this$domNodes.headers) === null || _this$domNodes$header === void 0 ? void 0 : (_this$domNodes$header2 = _this$domNodes$header[0]) === null || _this$domNodes$header2 === void 0 ? void 0 : (_this$domNodes$header3 = _this$domNodes$header2.dataset) === null || _this$domNodes$header3 === void 0 ? void 0 : _this$domNodes$header3.transparent) === 'true';
      this.initAddon();
      this.handleSticky();
      this.siteNav = new SiteNav(this.container);
      (_window = window) === null || _window === void 0 ? void 0 : (_window$_shh = _window._shh) === null || _window$_shh === void 0 ? void 0 : _window$_shh.call(_window);
      (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$_smcp = _window2._smcp) === null || _window2$_smcp === void 0 ? void 0 : _window2$_smcp.call(_window2);
      this.container.classList.add('opacity-100');
      window.__sfHeader = this;
      window.addEventListener('resize', () => {
        this.innerWidth = window.innerWidth;
      });

      if (this.transparentHeader && this.innerWidth > 1280) {
        var _this$domNodes$header4, _this$domNodes$header5;

        (_this$domNodes$header4 = this.domNodes.headerWrapper) === null || _this$domNodes$header4 === void 0 ? void 0 : (_this$domNodes$header5 = _this$domNodes$header4.classList) === null || _this$domNodes$header5 === void 0 ? void 0 : _this$domNodes$header5.add('transparent-on-top');
      } else {
        var _this$domNodes$header6, _this$domNodes$header7;

        (_this$domNodes$header6 = this.domNodes.headerWrapper) === null || _this$domNodes$header6 === void 0 ? void 0 : (_this$domNodes$header7 = _this$domNodes$header6.classList) === null || _this$domNodes$header7 === void 0 ? void 0 : _this$domNodes$header7.remove('transparent-on-top');
      }
    } catch (error) {
      console.error('Failed to init header section.', error);
    }
  },
  initAddon: function () {
    this.megamenu = new Megamenu(this.container);

    if (this.isDesignMode) {
      var _window$spratlyTheme, _window$spratlyTheme$, _window$spratlyTheme$2, _window$spratlyTheme2, _window$spratlyTheme3, _window$spratlyTheme4, _window$spratlyTheme5, _window$spratlyTheme6, _window$spratlyTheme7, _window$spratlyTheme8, _window$spratlyTheme9, _window$spratlyTheme10, _window$spratlyTheme11, _window$spratlyTheme12, _window$spratlyTheme13;

      window.spratlyTheme = window.spratlyTheme || {};
      (_window$spratlyTheme = window.spratlyTheme) === null || _window$spratlyTheme === void 0 ? void 0 : (_window$spratlyTheme$ = _window$spratlyTheme.Wishlist) === null || _window$spratlyTheme$ === void 0 ? void 0 : (_window$spratlyTheme$2 = _window$spratlyTheme$.updateWishlistCount) === null || _window$spratlyTheme$2 === void 0 ? void 0 : _window$spratlyTheme$2.call(_window$spratlyTheme$);
      (_window$spratlyTheme2 = window.spratlyTheme) === null || _window$spratlyTheme2 === void 0 ? void 0 : (_window$spratlyTheme3 = _window$spratlyTheme2.Currency) === null || _window$spratlyTheme3 === void 0 ? void 0 : (_window$spratlyTheme4 = _window$spratlyTheme3.queryDomNodes) === null || _window$spratlyTheme4 === void 0 ? void 0 : _window$spratlyTheme4.call(_window$spratlyTheme3);
      (_window$spratlyTheme5 = window.spratlyTheme) === null || _window$spratlyTheme5 === void 0 ? void 0 : (_window$spratlyTheme6 = _window$spratlyTheme5.Currency) === null || _window$spratlyTheme6 === void 0 ? void 0 : (_window$spratlyTheme7 = _window$spratlyTheme6.addEventToCurrenySwitchers) === null || _window$spratlyTheme7 === void 0 ? void 0 : _window$spratlyTheme7.call(_window$spratlyTheme6);
      (_window$spratlyTheme8 = window.spratlyTheme) === null || _window$spratlyTheme8 === void 0 ? void 0 : (_window$spratlyTheme9 = _window$spratlyTheme8.Search) === null || _window$spratlyTheme9 === void 0 ? void 0 : (_window$spratlyTheme10 = _window$spratlyTheme9.queryDomNodes) === null || _window$spratlyTheme10 === void 0 ? void 0 : _window$spratlyTheme10.call(_window$spratlyTheme9);
      (_window$spratlyTheme11 = window.spratlyTheme) === null || _window$spratlyTheme11 === void 0 ? void 0 : (_window$spratlyTheme12 = _window$spratlyTheme11.Search) === null || _window$spratlyTheme12 === void 0 ? void 0 : (_window$spratlyTheme13 = _window$spratlyTheme12.init) === null || _window$spratlyTheme13 === void 0 ? void 0 : _window$spratlyTheme13.call(_window$spratlyTheme12);
    }

    window.spratlyTheme.Cart = new cart();
  },
  handleSticky: function () {
    var _window3;

    let extraSpace = ((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.spratlyThemeSettings.template) === 'product' ? 20 : 50;
    if (!this.stickyEnabled) return;
    let lastScroll = 0;

    if (this.offsetTop === 0) {
      this.container.classList.add(this.classes.stuck);
    }

    window.addEventListener('scroll', () => {
      const currentScroll = window.pageYOffset;

      if (currentScroll <= this.offsetTop) {
        this.container.classList.remove(this.classes.scrollUp, this.classes.stuck);

        if (this.transparentHeader && this.innerWidth > 1279) {
          var _this$domNodes$header8, _this$domNodes$header9, _this$domNodes$header10;

          (_this$domNodes$header8 = this.domNodes.headerWrapper) === null || _this$domNodes$header8 === void 0 ? void 0 : (_this$domNodes$header9 = _this$domNodes$header8.classList) === null || _this$domNodes$header9 === void 0 ? void 0 : (_this$domNodes$header10 = _this$domNodes$header9.add) === null || _this$domNodes$header10 === void 0 ? void 0 : _this$domNodes$header10.call(_this$domNodes$header9, 'transparent-on-top');
        }

        return;
      }

      this.container.classList.add(this.classes.stuck);

      if (currentScroll > this.headerHeight + extraSpace && currentScroll > lastScroll && !this.container.classList.contains(this.classes.scrollDown)) {
        this.container.classList.remove(this.classes.scrollUp);
        this.container.classList.add(this.classes.scrollDown);
      } else if (currentScroll < lastScroll && this.container.classList.contains(this.classes.scrollDown)) {
        this.container.classList.remove(this.classes.scrollDown);
        this.container.classList.add(this.classes.scrollUp);

        if (this.transparentHeader && this.innerWidth > 1279) {
          var _this$domNodes$header11, _this$domNodes$header12, _this$domNodes$header13;

          (_this$domNodes$header11 = this.domNodes.headerWrapper) === null || _this$domNodes$header11 === void 0 ? void 0 : (_this$domNodes$header12 = _this$domNodes$header11.classList) === null || _this$domNodes$header12 === void 0 ? void 0 : (_this$domNodes$header13 = _this$domNodes$header12.remove) === null || _this$domNodes$header13 === void 0 ? void 0 : _this$domNodes$header13.call(_this$domNodes$header12, 'transparent-on-top');
        }
      }

      lastScroll = currentScroll;
    });
  },
  onUnload: function () {
    this.siteNav.destroy();
  }
});
;// CONCATENATED MODULE: ./src/js/utilities/debounce.js
function debounce_debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}
;// CONCATENATED MODULE: ./src/js/utilities/accordion.js




class Accordion {
  constructor(container, options = this.defaultOptions) {
    _defineProperty(this, "defaultOptions", {
      presetContentHeight: false,
      duration: 300,
      callback: () => {}
    });

    _defineProperty(this, "selectors", {
      items: ['.sf__accordion-item'],
      buttons: ['.sf__accordion-button'],
      contents: ['.sf__accordion-content']
    });

    _defineProperty(this, "openClass", 'open');

    _defineProperty(this, "initClass", 'acc-initialized');

    _defineProperty(this, "removeEventsFunction", null);

    _defineProperty(this, "debouncedSetContentHeight", debounce_debounce(this.setContentHeight));

    _defineProperty(this, "destroy", () => {
      this.removeEventsFunction();
      window.removeEventListener("resize", this.debouncedSetContentHeight);
    });

    _defineProperty(this, "setContentOpacity", () => {
      this.domNodes.contents.forEach(cont => cont.style.opacity = 1);
    });

    _defineProperty(this, "setItemOverflowState", () => {
      var _this$domNodes, _this$domNodes$items;

      (_this$domNodes = this.domNodes) === null || _this$domNodes === void 0 ? void 0 : (_this$domNodes$items = _this$domNodes.items) === null || _this$domNodes$items === void 0 ? void 0 : _this$domNodes$items.forEach((item, index) => {
        var _this$domNodes2, _this$domNodes2$conte, _item$classList, _item$classList$conta, _contents$classList, _contents$classList$m;

        let contents = (_this$domNodes2 = this.domNodes) === null || _this$domNodes2 === void 0 ? void 0 : (_this$domNodes2$conte = _this$domNodes2.contents) === null || _this$domNodes2$conte === void 0 ? void 0 : _this$domNodes2$conte[index];
        const method = item !== null && item !== void 0 && (_item$classList = item.classList) !== null && _item$classList !== void 0 && (_item$classList$conta = _item$classList.contains) !== null && _item$classList$conta !== void 0 && _item$classList$conta.call(_item$classList, this.openClass) ? 'remove' : 'add';
        contents === null || contents === void 0 ? void 0 : (_contents$classList = contents.classList) === null || _contents$classList === void 0 ? void 0 : (_contents$classList$m = _contents$classList[method]) === null || _contents$classList$m === void 0 ? void 0 : _contents$classList$m.call(_contents$classList, 'overflow-hidden');
      });
    });

    _defineProperty(this, "setContentHeight", () => {
      this.domNodes = queryDomNodes(this.selectors, this.container);
      const {
        items,
        contents
      } = this.domNodes;
      items.forEach((item, index) => {
        var _contents$index2, _contents$index2$clas;

        if (item !== null && item !== void 0 && item.classList.contains(this.openClass)) {
          var _item$style, _contents$index, _item$style2;

          item === null || item === void 0 ? void 0 : (_item$style = item.style) === null || _item$style === void 0 ? void 0 : _item$style.setProperty('--content-max-height', `auto`);
          const maxHeight = contents === null || contents === void 0 ? void 0 : (_contents$index = contents[index]) === null || _contents$index === void 0 ? void 0 : _contents$index.scrollHeight;
          item === null || item === void 0 ? void 0 : (_item$style2 = item.style) === null || _item$style2 === void 0 ? void 0 : _item$style2.setProperty('--content-max-height', `${maxHeight}px`);
        } else {
          var _item$style3;

          item === null || item === void 0 ? void 0 : (_item$style3 = item.style) === null || _item$style3 === void 0 ? void 0 : _item$style3.setProperty('--content-max-height', 0);
        }

        contents === null || contents === void 0 ? void 0 : (_contents$index2 = contents[index]) === null || _contents$index2 === void 0 ? void 0 : (_contents$index2$clas = _contents$index2.classList) === null || _contents$index2$clas === void 0 ? void 0 : _contents$index2$clas.add('max-height-set');
      });
      this.setItemOverflowState();
      this.setContentOpacity();
    });

    _defineProperty(this, "toggle", index => {
      var _this$domNodes3, _this$domNodes3$items, _this$domNodes4, _this$domNodes4$conte, _accItem$classList, _accItem$classList2, _this$domNodes5, _this$domNodes5$conte, _this$domNodes5$conte2;

      const accItem = (_this$domNodes3 = this.domNodes) === null || _this$domNodes3 === void 0 ? void 0 : (_this$domNodes3$items = _this$domNodes3.items) === null || _this$domNodes3$items === void 0 ? void 0 : _this$domNodes3$items[index];
      const accContent = (_this$domNodes4 = this.domNodes) === null || _this$domNodes4 === void 0 ? void 0 : (_this$domNodes4$conte = _this$domNodes4.contents) === null || _this$domNodes4$conte === void 0 ? void 0 : _this$domNodes4$conte[index];
      const isOpen = accItem === null || accItem === void 0 ? void 0 : (_accItem$classList = accItem.classList) === null || _accItem$classList === void 0 ? void 0 : _accItem$classList.contains(this.openClass);
      accItem === null || accItem === void 0 ? void 0 : (_accItem$classList2 = accItem.classList) === null || _accItem$classList2 === void 0 ? void 0 : _accItem$classList2.toggle(this.openClass);
      const maxHeight = isOpen ? 0 : (_this$domNodes5 = this.domNodes) === null || _this$domNodes5 === void 0 ? void 0 : (_this$domNodes5$conte = _this$domNodes5.contents) === null || _this$domNodes5$conte === void 0 ? void 0 : (_this$domNodes5$conte2 = _this$domNodes5$conte[index]) === null || _this$domNodes5$conte2 === void 0 ? void 0 : _this$domNodes5$conte2.scrollHeight;
      accItem === null || accItem === void 0 ? void 0 : accItem.style.setProperty('--content-max-height', `${maxHeight}px`);

      if (isOpen) {
        var _accContent$classList;

        accContent === null || accContent === void 0 ? void 0 : (_accContent$classList = accContent.classList) === null || _accContent$classList === void 0 ? void 0 : _accContent$classList.add('overflow-hidden');
      } else {
        setTimeout(() => {
          var _accContent$classList2;

          accContent === null || accContent === void 0 ? void 0 : (_accContent$classList2 = accContent.classList) === null || _accContent$classList2 === void 0 ? void 0 : _accContent$classList2.remove('overflow-hidden');
        }, 350);
      }
    });

    if (!container || container.classList.contains(this.initClass)) return;
    this.container = container;
    this.domNodes = queryDomNodes(this.selectors, this.container);
    this.options = Object.assign({}, this.defaultOptions, options);
    this.init();
  }

  init() {
    var _this$container, _this$container$style;

    (_this$container = this.container) === null || _this$container === void 0 ? void 0 : (_this$container$style = _this$container.style) === null || _this$container$style === void 0 ? void 0 : _this$container$style.setProperty('--duration', ` ${this.options.duration}ms`);
    this.removeEventsFunction = addEventDelegate({
      context: this.container,
      selector: this.selectors.buttons[0],
      handler: (e, btn) => {
        btn.classList.add('pointer-events-none');
        const index = this.domNodes.buttons.indexOf(btn);
        this.toggle(index);
        setTimeout(() => {
          btn.classList.remove('pointer-events-none');
        }, 350);
      }
    });

    if (this.options.presetContentHeight) {
      window.requestAnimationFrame(this.setContentHeight);
    } else {
      this.setItemOverflowState();
      this.setContentOpacity();
    }

    window.addEventListener("resize", this.debouncedSetContentHeight);
    if (typeof this.options.callback === "function") this.options.callback();
    this.container.classList.add(this.initClass);
  }

}
;// CONCATENATED MODULE: ./src/js/sections/footer.js



register('footer', {
  onLoad: function () {
    var _this$container;

    const mobileAccordion = this === null || this === void 0 ? void 0 : (_this$container = this.container) === null || _this$container === void 0 ? void 0 : _this$container.querySelector('.sf-footer__accordion');

    if (mobileAccordion) {
      var _this$container2;

      this.acc = new Accordion(mobileAccordion, {
        presetContentHeight: true
      });
      const newsLetter = (_this$container2 = this.container) === null || _this$container2 === void 0 ? void 0 : _this$container2.querySelector('.sf__accordion-item.order-first');

      if (newsLetter) {
        var _this$acc, _this$acc$domNodes;

        const index = Array.from((_this$acc = this.acc) === null || _this$acc === void 0 ? void 0 : (_this$acc$domNodes = _this$acc.domNodes) === null || _this$acc$domNodes === void 0 ? void 0 : _this$acc$domNodes.items).indexOf(newsLetter);
        this.acc.toggle(index);
      }
    }

    customSelect(this.container);
  }
}); // load('footer')
;// CONCATENATED MODULE: ./src/js/sections/slider.js



register('slider', {
  onLoad: function () {
    // Do something when a section instance is loaded
    this.autoplay = this.container.dataset.autoplay === 'true';
    this.autoplaySpeed = parseInt(this.container.dataset.autoplaySpeed);
    this.showArrows = this.container.dataset.enableArrows === 'true';
    this.showDots = this.container.dataset.enableDots === 'true';
    this.adaptHeight = this.container.dataset.slideHeight === 'adapt';
    this.lastVideo = null;
    this.lastActive = null;
    this.timeout = null;

    const _this = this;

    if (isInViewport(this.container)) {
      this._initSlider(_this);
    } else {
      if (window.__sfWindowLoaded) this._initSlider(_this);else window.addEventListener("load", () => this._initSlider(_this));
    }

    window.addEventListener("resize", () => this._initSlider(_this)); // if (this.adaptHeight) {
    //   this.setSlideshowHeight()
    // }
  },
  _initSlider: function (_this) {
    var _window;

    const selectors = {
      slideContent: '.sf__slide-content'
    };
    const paginationIcon = `<svg width="65px" height="65px" viewBox="0 0 72 72" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><circle class="time" stroke-width="5" fill="none" stroke-linecap="round" cx="33" cy="33" r="28"></circle></svg>`;
    loadCSS((_window = window) === null || _window === void 0 ? void 0 : _window.themeStyleURLs.swiper.url).then(() => {
      var _window2;

      loadJS((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.themeScriptURLs.swiper.url).then(() => {
        _this.slider = new window.spratlyTheme.Swiper(`#sf-slider-${_this.id}`, {
          init: false,
          autoplay: _this.autoplay ? {
            delay: _this.autoplaySpeed * 1000,
            disableOnInteraction: false
          } : false,
          slidesPerView: 1,
          slidesPerGroup: 1,
          autoHeight: true,
          loop: false,
          effect: 'fade',
          fadeEffect: {
            crossFade: true
          },
          speed: 1000,
          navigation: _this.showArrows ? {
            nextEl: _this.container.querySelector('.sf-slider__controls-next'),
            prevEl: _this.container.querySelector('.sf-slider__controls-prev')
          } : false,
          pagination: _this.showDots ? {
            el: _this.container.querySelector('.swiper-pagination'),
            clickable: true,
            bulletClass: 'sf__dot',
            bulletActiveClass: 'sf__dot-active',
            renderBullet: function (index, className) {
              return '<span class="' + className + '">' + paginationIcon + '</span>';
            }
          } : false
        });
        _this.lastSlide = null;
        _this.currentSlide = null;
        _this.slider && _this.slider.on('slideChangeTransitionStart', () => {
          _this.lastSlide && _this.lastSlide.classList.remove('slide-in');
          _this.lastSlide && _this.lastSlide.classList.add('slide-out');
        });
        _this.slider && _this.slider.on('slideChangeTransitionEnd', ({
          activeIndex,
          slides
        }) => {
          const currentSlide = slides[activeIndex];
          _this.currentSlide = currentSlide.querySelector(selectors.slideContent);
          _this.currentSlide && _this.currentSlide.classList.add('slide-in');
          _this.lastSlide && _this.lastSlide.classList.remove('slide-out', 'slide-in');
          _this.lastSlide = _this.currentSlide;
        });
        _this.slider && _this.slider.on('init', _this._handleChange.bind(this));
        _this.slider && _this.slider.on('slideChange', _this._handleChange.bind(this));

        _this.slider.init();
      });
    });
  },
  _handleChange: function (swiper) {
    const {
      activeIndex,
      slides
    } = swiper;
    const slideType = slides[activeIndex].dataset.slideType;
    this.lastActive && this.slider.slideToLoop(this.lastActive);

    if (slideType === 'video_slide') {
      const video = slides[activeIndex].querySelector('video');

      if (video) {
        let playPromise = video.play();
        this.lastVideo && this.lastVideo.pause();

        if (playPromise !== undefined) {
          playPromise.then(() => {
            this.lastVideo = video;
          });
        }
      }
    } else {
      this.lastVideo && this.lastVideo.pause();
      this.lastVideo = null;
    }
  },
  setSlideshowHeight: function () {
    const minAspectRatio = this.container.dataset.minAspectRatio;
    const slideHeight = document.documentElement.offsetWidth / minAspectRatio + 'px';
    console.log(slideHeight, 'slideHeight');
  },
  // Shortcut function called when a section block is selected by the Theme Editor 'shopify:block:select' event.
  onBlockSelect: function (ev) {
    var _this$slider, _this$slider$slideToL;

    // if (this.adaptHeight) {
    //   this.setSlideshowHeight()
    // }
    // Do something when a section block is selected
    const block = ev.target;
    const index = Number(block.dataset.slide);
    this.lastActive = index;
    (_this$slider = this.slider) === null || _this$slider === void 0 ? void 0 : (_this$slider$slideToL = _this$slider.slideToLoop) === null || _this$slider$slideToL === void 0 ? void 0 : _this$slider$slideToL.call(_this$slider, index);
  }
});
;// CONCATENATED MODULE: ./src/js/modules/tabs.js



class Tabs {
  constructor(container, cb = () => {}) {
    _defineProperty(this, "selectors", {
      tabHeaders: ['.sf-tab-header'],
      tabContents: ['.sf-tab-content']
    });

    _defineProperty(this, "activeClass", 'active');

    _defineProperty(this, "currentActiveIndex", -1);

    _defineProperty(this, "currentTab", null);

    _defineProperty(this, "init", () => {
      addEventDelegate({
        context: this.container,
        selector: this.selectors.tabHeaders[0],
        handler: (e, tabHeader) => {
          var _tabHeader$dataset;

          e.preventDefault();
          const index = Number(tabHeader === null || tabHeader === void 0 ? void 0 : (_tabHeader$dataset = tabHeader.dataset) === null || _tabHeader$dataset === void 0 ? void 0 : _tabHeader$dataset.index);
          this.setActiveTab(index);
          this.cb(tabHeader);
        }
      });
    });

    _defineProperty(this, "setActiveTab", tabIndex => {
      const {
        tabHeaders,
        tabContents
      } = this.domNodes;

      if (tabContents.length && tabIndex !== -1 && this.currentActiveIndex !== tabIndex) {
        var _currHeader$classList, _currHeader$classList2, _this$currentTab, _this$currentTab$clas, _this$currentTab$clas2, _this$currentTab2, _this$currentTab2$sty, _this$currentTab2$sty2, _newHeader$classList, _newHeader$classList$, _newTab$classList, _newTab$classList$add;

        const currHeader = tabHeaders === null || tabHeaders === void 0 ? void 0 : tabHeaders[this.currentActiveIndex];
        const newHeader = tabHeaders === null || tabHeaders === void 0 ? void 0 : tabHeaders[tabIndex];
        const newTab = tabContents === null || tabContents === void 0 ? void 0 : tabContents[tabIndex];
        currHeader === null || currHeader === void 0 ? void 0 : (_currHeader$classList = currHeader.classList) === null || _currHeader$classList === void 0 ? void 0 : (_currHeader$classList2 = _currHeader$classList.remove) === null || _currHeader$classList2 === void 0 ? void 0 : _currHeader$classList2.call(_currHeader$classList, this.activeClass);
        (_this$currentTab = this.currentTab) === null || _this$currentTab === void 0 ? void 0 : (_this$currentTab$clas = _this$currentTab.classList) === null || _this$currentTab$clas === void 0 ? void 0 : (_this$currentTab$clas2 = _this$currentTab$clas.remove) === null || _this$currentTab$clas2 === void 0 ? void 0 : _this$currentTab$clas2.call(_this$currentTab$clas, this.activeClass, 'opacity-100');
        (_this$currentTab2 = this.currentTab) === null || _this$currentTab2 === void 0 ? void 0 : (_this$currentTab2$sty = _this$currentTab2.style) === null || _this$currentTab2$sty === void 0 ? void 0 : (_this$currentTab2$sty2 = _this$currentTab2$sty.removeProperty) === null || _this$currentTab2$sty2 === void 0 ? void 0 : _this$currentTab2$sty2.call(_this$currentTab2$sty, 'opacity');
        newHeader === null || newHeader === void 0 ? void 0 : (_newHeader$classList = newHeader.classList) === null || _newHeader$classList === void 0 ? void 0 : (_newHeader$classList$ = _newHeader$classList.add) === null || _newHeader$classList$ === void 0 ? void 0 : _newHeader$classList$.call(_newHeader$classList, this.activeClass);
        newTab === null || newTab === void 0 ? void 0 : (_newTab$classList = newTab.classList) === null || _newTab$classList === void 0 ? void 0 : (_newTab$classList$add = _newTab$classList.add) === null || _newTab$classList$add === void 0 ? void 0 : _newTab$classList$add.call(_newTab$classList, this.activeClass);
        setTimeout(() => newTab.style.opacity = 1);
        this.currentActiveIndex = tabIndex;
        this.currentTab = newTab;
      }
    });

    this.container = container;
    this.cb = cb;
    this.domNodes = queryDomNodes(this.selectors, container);
    this.init();
    this.setActiveTab(0);
  }

}
;// CONCATENATED MODULE: ./src/js/sections/testimonials.js




register('testimonials', {
  onLoad: function () {
    var _container$dataset, _container$dataset2, _container$dataset3;

    const {
      container
    } = this;
    const design = container === null || container === void 0 ? void 0 : (_container$dataset = container.dataset) === null || _container$dataset === void 0 ? void 0 : _container$dataset.design;
    const containerType = container === null || container === void 0 ? void 0 : (_container$dataset2 = container.dataset) === null || _container$dataset2 === void 0 ? void 0 : _container$dataset2.container;
    const autorotate = (container === null || container === void 0 ? void 0 : (_container$dataset3 = container.dataset) === null || _container$dataset3 === void 0 ? void 0 : _container$dataset3.autoplay) === 'true';

    if (!design) {
      return console.warn("Failed to init Testimonials: design not found!!");
    }

    const slider = container.querySelector('.swiper-container');

    if (!slider) {
      container.classList.add('opacity-100');
      return;
    }

    const defaultSettings = {
      pagination: {
        el: this.container.querySelector('.swiper-pagination'),
        clickable: true
      },
      navigation: {
        nextEl: this.container.querySelector('.sf-slider__controls-next'),
        prevEl: this.container.querySelector('.sf-slider__controls-prev')
      },
      autoplay: autorotate ? {
        delay: 5000,
        pauseOnMouseEnter: false
      } : false,
      loop: true,
      slidesPerView: 1
    };
    let settings = {};
    let gutter = 400;

    switch (design) {
      case 'testimonials-1':
        settings = {
          centeredSlides: true,
          slidesPerView: 1,
          slidesPerGroup: 1,
          spaceBetween: 20,
          speed: 300,
          slideToClickedSlide: true,
          loop: true,
          breakpoints: {
            768: {
              slidesPerView: 3,
              slidesPerGroup: 3,
              spaceBetween: 20,
              speed: 1000
            },
            1280: {
              slidesPerView: 5,
              slidesPerGroup: 3,
              spaceBetween: 30
            },
            2560: {
              slidesPerView: 7,
              slidesPerGroup: 3
            }
          }
        };
        break;

      case 'testimonials-2':
        settings = {
          slidesPerView: 1,
          spaceBetween: 30,
          breakpoints: {
            768: {
              slidesPerView: 3,
              slidesPerGroup: 2
            }
          }
        };
        break;

      case 'testimonials-3':
        settings = {
          slidesPerView: 1,
          spaceBetween: 30,
          breakpoints: {
            768: {
              slidesPerView: containerType === 'w-full' ? 3 : 2
            }
          }
        };
        break;

      case 'testimonials-4':
        if (containerType === 'container-fluid') gutter = 200;
        if (containerType === 'container') gutter = 150;
        settings = {
          slidesPerView: 1,
          centeredSlides: true,
          slideToClickedSlide: true,
          breakpoints: {
            768: {
              spaceBetween: parseInt(gutter / 4),
              slidesPerView: 3
            },
            992: {
              spaceBetween: gutter / 2,
              slidesPerView: 3
            },
            1920: {
              spaceBetween: gutter,
              slidesPerView: 3
            }
          }
        };
        break;

      case 'testimonials-6':
        settings = {
          slidesPerView: 1,
          loop: true,
          breakpoints: {
            768: {
              slidesPerView: 2
            },
            1366: {
              slidesPerView: containerType === 'container' ? 2 : 3
            },
            1600: {
              slidesPerView: containerType === 'container' ? 2 : 4
            }
          }
        };
        break;

      case 'testimonials-5':
        settings = {
          fade: {
            crossFade: true
          }
        };
        break;
    } // Testimonials 5


    const images = container.querySelector('.sf-tabs');

    if (images) {
      this.imagesTab = new Tabs(images);
    }

    const initSlider = () => {
      var _window, _window2;

      loadCSS((_window = window) === null || _window === void 0 ? void 0 : _window.themeStyleURLs.swiper.url);
      loadJS((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.themeScriptURLs.swiper.url).then(() => {
        this.slider = new window.spratlyTheme.Swiper(slider, { ...defaultSettings,
          ...settings
        });

        if (design === 'testimonials-4') {
          this.slider.on('activeIndexChange', swiper => {
            console.log(swiper, 'slide change');
            const {
              realIndex
            } = swiper;
            this.container.querySelector('.sf-slider-index').innerHTML = parseInt(realIndex) + 1;
          });
        }

        if (design === 'testimonials-5') {
          this.slider.on('slideChange', swiper => {
            const {
              realIndex
            } = swiper;
            this.imagesTab.setActiveTab(realIndex);
          });
        }
      });
    };

    if (isInViewport(this.container)) {
      initSlider();
    } else {
      if (window.__sfWindowLoaded) initSlider();else window.addEventListener("load", initSlider);
    }
  },
  onBlockSelect: function (ev) {
    var _this$slider, _this$slider$slideToL;

    // Do something when a section block is selected
    const block = ev.target;
    const index = Number(block.dataset.index);
    this === null || this === void 0 ? void 0 : (_this$slider = this.slider) === null || _this$slider === void 0 ? void 0 : (_this$slider$slideToL = _this$slider.slideToLoop) === null || _this$slider$slideToL === void 0 ? void 0 : _this$slider$slideToL.call(_this$slider, index);
  }
});
;// CONCATENATED MODULE: ./src/js/sections/instagram.js


register('instagram', {
  onLoad: function () {
    const {
      container
    } = this;
    const {
      accessToken,
      imagesCount
    } = container === null || container === void 0 ? void 0 : container.dataset;

    if (accessToken) {
      new Instagram(container, accessToken, imagesCount);
    } else {
      console.warn('Failed to init Instagram section! Missing Access Token');
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/countdown-timer.js


register('countdown-timer', {
  onLoad: function () {
    console.log('==========> Load countdown timer section');
    const cdContainer = this.container.querySelector('.countdown-timer-container');
    const time = cdContainer.dataset.time;
    const endTime = Date.parse(time.split(' ').join('T'));

    if (cdContainer && endTime) {
      new countdown_timer(cdContainer, Date.now(), endTime);
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/banner-with-slider.js



register('banner-with-slider', {
  onLoad: function () {
    const {
      container
    } = this;
    this.lastActive = null;

    const initSlider = () => {
      var _window, _window2;

      const paginationIcon = `<svg width="65px" height="65px" viewBox="0 0 72 72" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><circle class="time" stroke-width="5" fill="none" stroke-linecap="round" cx="33" cy="33" r="28"></circle></svg>`;
      loadCSS((_window = window) === null || _window === void 0 ? void 0 : _window.themeStyleURLs.swiper.url);
      loadJS((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.themeScriptURLs.swiper.url).then(() => {
        const _this = this;

        this.slider = new window.spratlyTheme.Swiper(`.sf-slider-${this.id}`, {
          autoplay: container.dataset.autoplay === 'true',
          slidesPerView: 1,
          loop: true,
          fadeEffect: {
            crossFade: true
          },
          pagination: {
            el: this.container.querySelector('.swiper-pagination'),
            clickable: true,
            bulletClass: 'sf__dot',
            bulletActiveClass: 'sf__dot-active',
            renderBullet: function (index, className) {
              return '<span class="' + className + '">' + paginationIcon + '</span>';
            }
          },
          on: {
            init: function () {
              this.slideToLoop(_this.lastActive);
            }
          }
        });
      });
    };

    if (isInViewport(container)) {
      initSlider();
    } else {
      if (window.__sfWindowLoaded) initSlider();else window.addEventListener("load", initSlider);
    }
  },
  onBlockSelect: function (ev) {
    var _this$slider, _this$slider$slideToL;

    // Do something when a section block is selected
    const block = ev.target;
    const index = Number(block.dataset.slide);
    this.lastActive = index;
    (_this$slider = this.slider) === null || _this$slider === void 0 ? void 0 : (_this$slider$slideToL = _this$slider.slideToLoop) === null || _this$slider$slideToL === void 0 ? void 0 : _this$slider$slideToL.call(_this$slider, index);
  }
});
;// CONCATENATED MODULE: ./node_modules/@googlemaps/js-api-loader/dist/index.esm.js
// do not edit .js files directly - edit src/index.jst
var fastDeepEqual = function equal(a, b) {
  if (a === b) return true;

  if (a && b && typeof a == 'object' && typeof b == 'object') {
    if (a.constructor !== b.constructor) return false;
    var length, i, keys;

    if (Array.isArray(a)) {
      length = a.length;
      if (length != b.length) return false;

      for (i = length; i-- !== 0;) if (!equal(a[i], b[i])) return false;

      return true;
    }

    if (a.constructor === RegExp) return a.source === b.source && a.flags === b.flags;
    if (a.valueOf !== Object.prototype.valueOf) return a.valueOf() === b.valueOf();
    if (a.toString !== Object.prototype.toString) return a.toString() === b.toString();
    keys = Object.keys(a);
    length = keys.length;
    if (length !== Object.keys(b).length) return false;

    for (i = length; i-- !== 0;) if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

    for (i = length; i-- !== 0;) {
      var key = keys[i];
      if (!equal(a[key], b[key])) return false;
    }

    return true;
  } // true if both NaN, false otherwise


  return a !== a && b !== b;
};
/**
 * Copyright 2019 Google LLC. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at.
 *
 *      Http://www.apache.org/licenses/LICENSE-2.0.
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */


const DEFAULT_ID = "__googleMapsScriptId";
/**
 * [[Loader]] makes it easier to add Google Maps JavaScript API to your application
 * dynamically using
 * [Promises](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise).
 * It works by dynamically creating and appending a script node to the the
 * document head and wrapping the callback function so as to return a promise.
 *
 * ```
 * const loader = new Loader({
 *   apiKey: "",
 *   version: "weekly",
 *   libraries: ["places"]
 * });
 *
 * loader.load().then((google) => {
 *   const map = new google.maps.Map(...)
 * })
 * ```
 */

class Loader {
  /**
   * Creates an instance of Loader using [[LoaderOptions]]. No defaults are set
   * using this library, instead the defaults are set by the Google Maps
   * JavaScript API server.
   *
   * ```
   * const loader = Loader({apiKey, version: 'weekly', libraries: ['places']});
   * ```
   */
  constructor({
    apiKey,
    channel,
    client,
    id = DEFAULT_ID,
    libraries = [],
    language,
    region,
    version,
    mapIds,
    nonce,
    retries = 3,
    url = "https://maps.googleapis.com/maps/api/js"
  }) {
    this.CALLBACK = "__googleMapsCallback";
    this.callbacks = [];
    this.done = false;
    this.loading = false;
    this.errors = [];
    this.version = version;
    this.apiKey = apiKey;
    this.channel = channel;
    this.client = client;
    this.id = id || DEFAULT_ID; // Do not allow empty string

    this.libraries = libraries;
    this.language = language;
    this.region = region;
    this.mapIds = mapIds;
    this.nonce = nonce;
    this.retries = retries;
    this.url = url;

    if (Loader.instance) {
      if (!fastDeepEqual(this.options, Loader.instance.options)) {
        throw new Error(`Loader must not be called again with different options. ${JSON.stringify(this.options)} !== ${JSON.stringify(Loader.instance.options)}`);
      }

      return Loader.instance;
    }

    Loader.instance = this;
  }

  get options() {
    return {
      version: this.version,
      apiKey: this.apiKey,
      channel: this.channel,
      client: this.client,
      id: this.id,
      libraries: this.libraries,
      language: this.language,
      region: this.region,
      mapIds: this.mapIds,
      nonce: this.nonce,
      url: this.url
    };
  }

  get failed() {
    return this.done && !this.loading && this.errors.length >= this.retries + 1;
  }
  /**
   * CreateUrl returns the Google Maps JavaScript API script url given the [[LoaderOptions]].
   *
   * @ignore
   */


  createUrl() {
    let url = this.url;
    url += `?callback=${this.CALLBACK}`;

    if (this.apiKey) {
      url += `&key=${this.apiKey}`;
    }

    if (this.channel) {
      url += `&channel=${this.channel}`;
    }

    if (this.client) {
      url += `&client=${this.client}`;
    }

    if (this.libraries.length > 0) {
      url += `&libraries=${this.libraries.join(",")}`;
    }

    if (this.language) {
      url += `&language=${this.language}`;
    }

    if (this.region) {
      url += `&region=${this.region}`;
    }

    if (this.version) {
      url += `&v=${this.version}`;
    }

    if (this.mapIds) {
      url += `&map_ids=${this.mapIds.join(",")}`;
    }

    return url;
  }
  /**
   * Load the Google Maps JavaScript API script and return a Promise.
   */


  load() {
    return this.loadPromise();
  }
  /**
   * Load the Google Maps JavaScript API script and return a Promise.
   *
   * @ignore
   */


  loadPromise() {
    return new Promise((resolve, reject) => {
      this.loadCallback(err => {
        if (!err) {
          resolve(window.google);
        } else {
          reject(err.error);
        }
      });
    });
  }
  /**
   * Load the Google Maps JavaScript API script with a callback.
   */


  loadCallback(fn) {
    this.callbacks.push(fn);
    this.execute();
  }
  /**
   * Set the script on document.
   */


  setScript() {
    if (document.getElementById(this.id)) {
      // TODO wrap onerror callback for cases where the script was loaded elsewhere
      this.callback();
      return;
    }

    const url = this.createUrl();
    const script = document.createElement("script");
    script.id = this.id;
    script.type = "text/javascript";
    script.src = url;
    script.onerror = this.loadErrorCallback.bind(this);
    script.defer = true;
    script.async = true;

    if (this.nonce) {
      script.nonce = this.nonce;
    }

    document.head.appendChild(script);
  }

  deleteScript() {
    const script = document.getElementById(this.id);

    if (script) {
      script.remove();
    }
  }
  /**
   * Reset the loader state.
   */


  reset() {
    this.deleteScript();
    this.done = false;
    this.loading = false;
    this.errors = [];
    this.onerrorEvent = null;
  }

  resetIfRetryingFailed() {
    if (this.failed) {
      this.reset();
    }
  }

  loadErrorCallback(e) {
    this.errors.push(e);

    if (this.errors.length <= this.retries) {
      const delay = this.errors.length * Math.pow(2, this.errors.length);
      console.log(`Failed to load Google Maps script, retrying in ${delay} ms.`);
      setTimeout(() => {
        this.deleteScript();
        this.setScript();
      }, delay);
    } else {
      this.onerrorEvent = e;
      this.callback();
    }
  }

  setCallback() {
    window.__googleMapsCallback = this.callback.bind(this);
  }

  callback() {
    this.done = true;
    this.loading = false;
    this.callbacks.forEach(cb => {
      cb(this.onerrorEvent);
    });
    this.callbacks = [];
  }

  execute() {
    this.resetIfRetryingFailed();

    if (this.done) {
      this.callback();
    } else {
      // short circuit and warn if google.maps is already loaded
      if (window.google && window.google.maps && window.google.maps.version) {
        console.warn("Google Maps already loaded outside @googlemaps/js-api-loader." + "This may result in undesirable behavior as options and script parameters may not match.");
        this.callback();
        return;
      }

      if (this.loading) ;else {
        this.loading = true;
        this.setCallback();
        this.setScript();
      }
    }
  }

}


;// CONCATENATED MODULE: ./src/js/sections/google-maps.js


register('google-maps', {
  onLoad: function () {
    let mapElm = this.container.querySelector('#sf__map');
    const {
      mapX,
      mapY,
      mapZoom,
      mapTitle,
      key
    } = mapElm.dataset;
    console.log(mapElm);
    console.log(mapX, mapY, mapZoom, key);
    const loader = new Loader({
      apiKey: key,
      version: "weekly"
    });
    loader.load().then(() => {
      let mapOptions = {
        zoom: parseInt(mapZoom),
        center: new google.maps.LatLng(mapX, mapY),
        scrollwheel: false,
        styles: [{
          "featureType": "water",
          "elementType": "geometry",
          "stylers": [{
            "color": "#e9e9e9"
          }, {
            "lightness": 17
          }]
        }, {
          "featureType": "landscape",
          "elementType": "geometry",
          "stylers": [{
            "color": "#f5f5f5"
          }, {
            "lightness": 20
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#ffffff"
          }, {
            "lightness": 17
          }]
        }, {
          "featureType": "road.highway",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#ffffff"
          }, {
            "lightness": 29
          }, {
            "weight": 0.2
          }]
        }, {
          "featureType": "road.arterial",
          "elementType": "geometry",
          "stylers": [{
            "color": "#ffffff"
          }, {
            "lightness": 18
          }]
        }, {
          "featureType": "road.local",
          "elementType": "geometry",
          "stylers": [{
            "color": "#ffffff"
          }, {
            "lightness": 16
          }]
        }, {
          "featureType": "poi",
          "elementType": "geometry",
          "stylers": [{
            "color": "#f5f5f5"
          }, {
            "lightness": 21
          }]
        }, {
          "featureType": "poi.park",
          "elementType": "geometry",
          "stylers": [{
            "color": "#dedede"
          }, {
            "lightness": 21
          }]
        }, {
          "elementType": "labels.text.stroke",
          "stylers": [{
            "visibility": "on"
          }, {
            "color": "#ffffff"
          }, {
            "lightness": 16
          }]
        }, {
          "elementType": "labels.text.fill",
          "stylers": [{
            "saturation": 36
          }, {
            "color": "#333333"
          }, {
            "lightness": 40
          }]
        }, {
          "elementType": "labels.icon",
          "stylers": [{
            "visibility": "off"
          }]
        }, {
          "featureType": "transit",
          "elementType": "geometry",
          "stylers": [{
            "color": "#f2f2f2"
          }, {
            "lightness": 19
          }]
        }, {
          "featureType": "administrative",
          "elementType": "geometry.fill",
          "stylers": [{
            "color": "#fefefe"
          }, {
            "lightness": 20
          }]
        }, {
          "featureType": "administrative",
          "elementType": "geometry.stroke",
          "stylers": [{
            "color": "#fefefe"
          }, {
            "lightness": 17
          }, {
            "weight": 1.2
          }]
        }]
      };
      let map = new google.maps.Map(mapElm, mapOptions);
      new google.maps.Marker({
        position: new google.maps.LatLng(mapX, mapY),
        map: map,
        title: mapTitle
      });
    });
  }
}); // load('google-maps')
;// CONCATENATED MODULE: ./src/js/sections/video.js


register('video-section', {
  onLoad: function () {
    if (window.__sfWindowLoaded) this._initVideo(this.id);else window.addEventListener("load", () => this._initVideo(this.id));
  },
  _initVideo: function (id) {
    var _window, _window$themeStyleURL, _window$themeStyleURL2, _window2, _window2$themeScriptU, _window2$themeScriptU2;

    loadCSS((_window = window) === null || _window === void 0 ? void 0 : (_window$themeStyleURL = _window.themeStyleURLs) === null || _window$themeStyleURL === void 0 ? void 0 : (_window$themeStyleURL2 = _window$themeStyleURL.plyr) === null || _window$themeStyleURL2 === void 0 ? void 0 : _window$themeStyleURL2.url);
    loadJS((_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$themeScriptU = _window2.themeScriptURLs) === null || _window2$themeScriptU === void 0 ? void 0 : (_window2$themeScriptU2 = _window2$themeScriptU.plyr) === null || _window2$themeScriptU2 === void 0 ? void 0 : _window2$themeScriptU2.url).then(() => {
      const videoWrapper = document.querySelector(`#sf-video__player-${id}`);
      const ratio = videoWrapper.dataset.videoRatio;
      const autoplay = videoWrapper.dataset.autoplay === 'true';
      const loop = videoWrapper.dataset.loop === 'true';
      new window.spratlyLibs.Plyr(videoWrapper, {
        autoplay: autoplay,
        ratio: ratio,
        loop: {
          active: loop
        }
      });
    }).catch(err => console.error("Failed to init video-section", err));
  }
});
;// CONCATENATED MODULE: ./src/js/components/Spinner.jsx
/* provided dependency */ var Spinner_createElement = __webpack_require__(6295)["default"];
/* harmony default export */ function Spinner({
  className = ''
}) {
  return Spinner_createElement("svg", {
    className: `animate-spin hidden w-[20px] h-[20px] ${className}`,
    xmlns: "http://www.w3.org/2000/svg",
    viewBox: "0 0 24 24",
    fill: "none"
  }, Spinner_createElement("circle", {
    className: "opacity-25",
    cx: "12",
    cy: "12",
    r: "10",
    stroke: "currentColor",
    "stroke-width": "4"
  }), Spinner_createElement("path", {
    className: "opacity-75",
    fill: "currentColor",
    d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
  }));
}
;// CONCATENATED MODULE: ./src/js/sections/custom-content.js
/* provided dependency */ var custom_content_createElement = __webpack_require__(6295)["default"];






 // eslint-disable-next-line no-unused-vars



register('custom-content', {
  onLoad: function () {
    this.selectors = {
      cdtContainer: ['.countdown-timer-container'],
      bundleError: '.product-bundles__error',
      productBundles: ['.product-bundles'],
      productVariantSelects: '.sf-product-variant-option-dropdown',
      totalPrice: '[data-total-price]',
      submitBundle: '[data-add-bundle]',
      errorWrapper: '.product-bundles__error'
    };
    this.domNodes = queryDomNodes(this.selectors, this.container);
    this.spinner = custom_content_createElement(Spinner, {
      className: "m-0.5"
    });
    this.initCountDown();
    this.initProductBundles();
    if (window.__sfWindowLoaded) this._initVideo(this.id);else window.addEventListener("load", () => this._initVideo(this.id));
  },
  initCountDown: function () {
    const countdowns = this.domNodes.cdtContainer;

    if (countdowns.length) {
      for (let countdown of countdowns) {
        const time = countdown.dataset.time;
        const endTime = Date.parse(time.split(' ').join('T'));

        if (endTime) {
          new countdown_timer(countdown, Date.now(), endTime);
        }
      }
    }
  },
  initProductBundles: function () {
    this.products = [];
    this.variants = [];
    this.domNodes.productBundles.length && this.domNodes.productBundles.map(bundle => {
      const products = bundle.querySelectorAll('.product-bundles__item');

      for (let product of products) {
        let variants = product.nextElementSibling.innerHTML;
        variants = JSON.parse(variants);
        this.variants.push(variants);
        this.products.push(product);
        addEventDelegate({
          context: product,
          event: 'change',
          selector: this.selectors.productVariantSelects,
          handler: e => this._handleChangePrice(e, product, variants)
        });
      }

      addEventDelegate({
        context: bundle,
        selector: this.selectors.submitBundle,
        handler: e => this._handleAddItems(e, bundle)
      });
    });
  },
  _handleChangePrice: function (evt, product, variants) {
    var _window, _window$spratlyThemeS, _window4, _window4$spratlyTheme;

    const regularPrice = product.querySelector('[data-regular-price]');
    const comparePrice = product.querySelector('[data-compare-price]');
    const savedPrice = product.querySelector('[data-saved-price]');
    const selectedVariant = evt.target.value;
    const variant = variants.find(v => v.id === parseInt(selectedVariant));
    regularPrice.innerHTML = formatMoney(variant.price, (_window = window) === null || _window === void 0 ? void 0 : (_window$spratlyThemeS = _window.spratlyThemeSettings) === null || _window$spratlyThemeS === void 0 ? void 0 : _window$spratlyThemeS.money_format);
    regularPrice.dataset.price = variant.price;

    if (variant.compare_at_price && variant.compare_at_price > variant.price) {
      var _window2, _window2$spratlyTheme, _window3, _window3$spratlyTheme;

      comparePrice.classList.remove('hidden');
      savedPrice.classList.remove('hidden');
      comparePrice.innerHTML = formatMoney(variant.compare_at_price, (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$spratlyTheme = _window2.spratlyThemeSettings) === null || _window2$spratlyTheme === void 0 ? void 0 : _window2$spratlyTheme.money_format);
      savedPrice.innerHTML = formatMoney(variant.compare_at_price - variant.price, (_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$spratlyTheme = _window3.spratlyThemeSettings) === null || _window3$spratlyTheme === void 0 ? void 0 : _window3$spratlyTheme.money_format);
    } else {
      comparePrice.classList.add('hidden');
      savedPrice.classList.add('hidden');
    } // Calculate total price


    const selectedVariants = this.products.map(product => {
      var _variants, _variants$find;

      let variants = product.nextElementSibling.innerHTML;
      variants = JSON.parse(variants);
      const select = product.querySelector('[name="id"]');
      return (_variants = variants) === null || _variants === void 0 ? void 0 : (_variants$find = _variants.find) === null || _variants$find === void 0 ? void 0 : _variants$find.call(_variants, v => (v === null || v === void 0 ? void 0 : v.id) === Number(select === null || select === void 0 ? void 0 : select.value));
    }).filter(Boolean);
    const totalPrice = selectedVariants.reduce((s, v) => s + v.price, 0);
    const container = product.closest('.product-bundles');
    container.querySelector(this.selectors.totalPrice).innerHTML = formatMoney(totalPrice, (_window4 = window) === null || _window4 === void 0 ? void 0 : (_window4$spratlyTheme = _window4.spratlyThemeSettings) === null || _window4$spratlyTheme === void 0 ? void 0 : _window4$spratlyTheme.money_format);
  },
  _handleAddItems: function (e, bundle) {
    e.preventDefault();
    const inputIds = bundle.querySelectorAll('[name="id"]');
    const errorWrapper = bundle.querySelector(this.selectors.errorWrapper);
    const button = bundle.querySelector(this.selectors.submitBundle);
    const ids = [...inputIds].map(input => input.value);
    const data = {
      items: ids.map(id => ({
        id,
        quantity: 1
      }))
    };
    const config = (0,utilities_fetch.getRequestDefaultConfigs)();
    config.method = 'POST';
    config.body = JSON.stringify(data);

    this._toggleLoading(true, button);

    fetch('/cart/add.js', config).then(async res => {
      if (!(res !== null && res !== void 0 && res.ok)) {
        const err = await res.json();

        this._showError((err === null || err === void 0 ? void 0 : err.description) || "Failed to add all items to cart!", errorWrapper);
      } else {
        window.Shopify.onItemAdded(res);
      }

      setTimeout(() => {
        this._toggleLoading(false, button);
      }, 300);
    }).catch(err => {
      var _err$toString;

      this._showError(err === null || err === void 0 ? void 0 : (_err$toString = err.toString) === null || _err$toString === void 0 ? void 0 : _err$toString.call(err), errorWrapper);

      this._toggleLoading(false, button);
    });
  },
  _showError: function (err, errorWrapper) {
    notification.show({
      target: errorWrapper,
      method: 'appendChild',
      type: 'warning',
      message: err
    });
  },
  _toggleLoading: function (loading, button) {
    if (loading) {
      button.appendChild(this.spinner);
      button.classList.add('sf-spinner-loading');
    } else {
      var _this$spinner;

      this === null || this === void 0 ? void 0 : (_this$spinner = this.spinner) === null || _this$spinner === void 0 ? void 0 : _this$spinner.remove();
      button.classList.remove('sf-spinner-loading');
    }
  },
  _initVideo: function (id) {
    var _window5, _window5$themeStyleUR, _window5$themeStyleUR2, _window6, _window6$themeScriptU, _window6$themeScriptU2;

    loadCSS((_window5 = window) === null || _window5 === void 0 ? void 0 : (_window5$themeStyleUR = _window5.themeStyleURLs) === null || _window5$themeStyleUR === void 0 ? void 0 : (_window5$themeStyleUR2 = _window5$themeStyleUR.plyr) === null || _window5$themeStyleUR2 === void 0 ? void 0 : _window5$themeStyleUR2.url);
    loadJS((_window6 = window) === null || _window6 === void 0 ? void 0 : (_window6$themeScriptU = _window6.themeScriptURLs) === null || _window6$themeScriptU === void 0 ? void 0 : (_window6$themeScriptU2 = _window6$themeScriptU.plyr) === null || _window6$themeScriptU2 === void 0 ? void 0 : _window6$themeScriptU2.url).then(() => {
      const videoWrapper = document.querySelector(`#sf-video__player-${id}`);
      const ratio = videoWrapper === null || videoWrapper === void 0 ? void 0 : videoWrapper.dataset.videoRatio;
      const autoplay = (videoWrapper === null || videoWrapper === void 0 ? void 0 : videoWrapper.dataset.autoplay) === 'true';
      const loop = (videoWrapper === null || videoWrapper === void 0 ? void 0 : videoWrapper.dataset.loop) === 'true';
      new window.spratlyLibs.Plyr(videoWrapper, {
        autoplay: autoplay,
        ratio: ratio,
        loop: {
          active: loop
        }
      });
    }).catch(err => console.error("Failed to init video-section", err));
  }
});
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

    loadCSS((_window = window) === null || _window === void 0 ? void 0 : _window.themeStyleURLs.swiper.url).then(() => {
      var _window2;

      loadJS((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.themeScriptURLs.swiper.url).then(() => {
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
;// CONCATENATED MODULE: ./src/js/sections/featured-collection.js
/* provided dependency */ var featured_collection_createElement = __webpack_require__(6295)["default"];







register('featured-collection', {
  onLoad: function () {
    this.selectors = {
      loadMoreBtn: '[data-load-more]',
      productsContainer: '[data-products-container]'
    };
    this.domNodes = queryDomNodes(this.selectors);
    window.spratlyTheme.Products.initProductForms().catch(console.error);
    const {
      container
    } = this;
    const buttonType = container.dataset.buttonType;
    const infiniteLoad = container.dataset.infiniteLoad;
    const enableSlider = container.dataset.enableSlider === 'true';
    const showPagination = container.dataset.showPagination === 'true';
    const showNavigation = container.dataset.showNavigation === 'true';
    const items = container.dataset.items;

    if (enableSlider) {
      initSlider({
        container: container,
        items: parseInt(items),
        showPagination: showPagination,
        showNavigation: showNavigation,
        loop: true
      });
    }

    this.canLoad = true;
    this.currentPage = 1;
    this.spinner = featured_collection_createElement(Spinner, null);
    if (infiniteLoad === 'true') this.initInfiniteLoad();
    if (buttonType === 'load' && this.domNodes.loadMoreBtn) this.initLoadMore();
  },
  initLoadMore: function () {
    const {
      container
    } = this;
    this.triggerLoad = false;
    this.totalPages = parseInt(container.dataset.totalPages);
    addEventDelegate({
      context: this.container,
      selector: this.selectors.loadMoreBtn,
      handler: e => {
        e.preventDefault();
        this.handleLoadMore();
      }
    });
  },
  initInfiniteLoad: function () {
    const maxPages = this.container.dataset.maxPages;
    const handleIfLoad = debounce_debounce(() => {
      this.handleLoadMore();
      console.log('trigger load');
    }, 100);
    window.addEventListener('scroll', e => {
      this.canLoad = this.currentPage < parseInt(maxPages);
      if (!this.canLoad) return;

      if (this.container.offsetTop + this.container.clientHeight - window.innerHeight < window.scrollY && !this.triggerLoad) {
        this.triggerLoad = true;
        handleIfLoad();
      }
    });
  },
  handleLoadMore: function () {
    this.currentPage++;
    this.canLoad = this.currentPage < this.totalPages;
    this.toggleLoading(true);
    const url = this.container.dataset.url;
    const dataUrl = `${url}?page=${this.currentPage}&section_id=${this.id}`;
    (0,utilities_fetch.fetchCache)(dataUrl).then(html => {
      this.toggleLoading(false);
      const dom = generateDomFromString(html);
      const products = dom.querySelector(this.selectors.productsContainer);

      if (products) {
        Array.from(products.childNodes).forEach(product => this.domNodes.productsContainer.appendChild(product));
        window.spratlyTheme.Products.initProductForms();
      }

      this.triggerLoad = false;

      if (!this.canLoad) {
        this.domNodes.loadMoreBtn && this.domNodes.loadMoreBtn.classList.add('hidden');
      }
    });
  },
  toggleLoading: function (status) {
    if (!this.domNodes.loadMoreBtn) return;

    if (status) {
      this.domNodes.loadMoreBtn.appendChild(this.spinner);
      this.domNodes.loadMoreBtn.classList.add('sf-spinner-loading');
    } else {
      var _this$spinner;

      this === null || this === void 0 ? void 0 : (_this$spinner = this.spinner) === null || _this$spinner === void 0 ? void 0 : _this$spinner.remove();
      this.domNodes.loadMoreBtn.classList.remove('sf-spinner-loading');
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/icon-box.js


register('icon-box', {
  onLoad: function () {
    const enableSlider = this.container.dataset.enableSlider === 'true';
    const showPagination = this.container.dataset.showPagination === 'true';
    const showNavigation = this.container.dataset.showNavigation === 'true';
    const items = this.container.dataset.items;

    if (enableSlider) {
      initSlider({
        container: this.container,
        items: parseInt(items),
        slidesPerView: 1,
        slidesPerGroup: 1,
        showPagination: true,
        showNavigation: true
      });
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/collection-list.js


register('collection-list', {
  onLoad: function () {
    const enableSlider = this.container.dataset.enableSlider === 'true';
    const items = this.container.dataset.items;
    const autoplay = this.container.dataset.autoplay === 'true';
    const autoplaySpeed = this.container.dataset.autoplaySpeed;
    const paginationIcon = `<svg width="65px" height="65px" viewBox="0 0 72 72" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"><circle class="time" stroke-width="5" fill="none" stroke-linecap="round" cx="33" cy="33" r="28"></circle></svg>`;
    console.log(autoplay, 'autoplay');

    if (enableSlider) {
      initSlider({
        container: this.container,
        items: parseInt(items) + 1,
        loop: true,
        slidesPerGroup: 2,
        showNavigation: true,
        showPagination: true,
        speed: 500,
        autoplay: autoplay ? {
          delay: parseInt(autoplaySpeed) * 1000
        } : false,
        pagination: {
          el: this.container.querySelector('.swiper-pagination'),
          clickable: true,
          bulletClass: 'sf__dot',
          bulletActiveClass: 'sf__dot-active',
          renderBullet: function (index, className) {
            return '<span class="' + className + '">' + paginationIcon + '</span>';
          }
        }
      });
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/press.js



register('press', {
  onLoad: function () {
    this.prevSlideIndex = 0;

    const initSlider = () => {
      var _window, _window2;

      loadCSS((_window = window) === null || _window === void 0 ? void 0 : _window.themeStyleURLs.swiper.url);
      loadJS((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.themeScriptURLs.swiper.url).then(() => {
        const contentWrapper = this.container.querySelector('.press-content');
        const navWrapper = this.container.querySelector('.press-list .swiper-container');
        const autoplay = this.container.dataset.autoplay === 'true';
        this.items = parseInt(this.container.dataset.items);
        this.canLoop = window.innerWidth < 1300 ? this.items > 3 : this.items > 5;
        this.contentSlider = new window.spratlyTheme.Swiper(contentWrapper, {
          slidesPerView: 1,
          allowTouchMove: false,
          fadeEffect: {
            crossFade: true
          }
        });
        this.navSlider = new window.spratlyTheme.Swiper(navWrapper, {
          autoplay: autoplay ? {
            delay: 5000
          } : false,
          items: 1,
          speed: 500,
          loop: this.canLoop,
          centeredSlides: this.canLoop,
          pagination: {
            el: this.container.querySelector('.swiper-pagination'),
            clickable: true
          },
          slideToClickedSlide: true,
          breakpoints: {
            768: {
              slidesPerView: 3,
              navigation: false
            },
            1300: {
              slidesPerView: 5,
              navigation: false
            }
          },
          on: {
            init: function (swiper) {
              const firstSlide = swiper.slides[swiper.activeIndex];
              console.log(firstSlide, 'firstSlide');
              firstSlide && firstSlide.classList.add('press-logo--active');
            }
          }
        });
        !this.canLoop && this.navSlider.on('click', this._handleClick.bind(this));
        this.navSlider.on('slideChange', this._handleChange.bind(this));
      });
    };

    if (isInViewport(this.container)) {
      initSlider();
    } else {
      if (window.__sfWindowLoaded) initSlider();else window.addEventListener("load", initSlider);
    }
  },
  _handleChange: function (swiper) {
    console.log(swiper, 'swiper');
    const {
      realIndex,
      activeIndex,
      slides
    } = swiper || {};
    const prevSlide = this.container.querySelector('.press-logo--active[data-index="' + this.prevSlideIndex + '"]');
    const currentSlide = slides[activeIndex];
    currentSlide && currentSlide.classList.add('press-logo--active');
    prevSlide && prevSlide.classList.remove('press-logo--active'); // Change content slide

    this.contentSlider.slideTo(realIndex); // Set prev slide index

    this.prevSlideIndex = realIndex;
  },
  _handleClick: function (swiper) {
    console.log(swiper, 'swiper');
    const {
      clickedIndex,
      clickedSlide
    } = swiper || {};
    const prevSlide = this.container.querySelector('.press-logo--active[data-index="' + this.prevSlideIndex + '"]');
    clickedSlide && clickedSlide.classList.add('press-logo--active');
    prevSlide && prevSlide.classList.remove('press-logo--active'); // Change content slide

    this.contentSlider.slideTo(clickedIndex); // Set prev slide index

    this.prevSlideIndex = clickedIndex;
  },
  onBlockSelect: function (evt) {
    var _this$contentSlider, _this$contentSlider$s, _this$navSlider, _this$navSlider$slide;

    const block = evt.target;
    const index = Number(block.dataset.index);
    this === null || this === void 0 ? void 0 : (_this$contentSlider = this.contentSlider) === null || _this$contentSlider === void 0 ? void 0 : (_this$contentSlider$s = _this$contentSlider.slideTo) === null || _this$contentSlider$s === void 0 ? void 0 : _this$contentSlider$s.call(_this$contentSlider, index);
    this === null || this === void 0 ? void 0 : (_this$navSlider = this.navSlider) === null || _this$navSlider === void 0 ? void 0 : (_this$navSlider$slide = _this$navSlider.slideTo) === null || _this$navSlider$slide === void 0 ? void 0 : _this$navSlider$slide.call(_this$navSlider, index);
  }
});
;// CONCATENATED MODULE: ./src/js/sections/hero.js



register('hero', {
  onLoad: function () {
    const parallaxEnabled = this.container.dataset.parallax === 'true';

    if (parallaxEnabled && window.innerWidth > 767) {
      const bg = this.container.querySelector('.sf-hero__bg');
      if (!bg) return;

      if (isInViewport(bg)) {
        this._initParallax(bg);
      } else {
        if (window.__sfWindowLoaded) this._initParallax(bg);else window.addEventListener("load", () => this._initParallax(bg));
      }
    }
  },
  _initParallax: function (bg) {
    loadJS(window.themeScriptURLs.parallax.url).then(() => {
      new window.spratlyLibs.simpleParallax(bg, {
        scale: 1.1,
        maxTransition: 80
      });
    });
  }
});
;// CONCATENATED MODULE: ./src/js/sections/reviews-pages.js


register('reviews-page', {
  onLoad: function () {
    var _window;

    let wrapper = this.container.querySelector('.sf__masonry-wrapper');
    loadJS((_window = window) === null || _window === void 0 ? void 0 : _window.themeScriptURLs.tilt.url).then(() => {
      setTimeout(() => {
        this.msry = new window.spratlyLibs.Masonry(wrapper, {
          itemSelector: '.sf__masonry-item',
          percentPosition: true
        });
        this.container.style.removeProperty('opacity');
      }, 300);
    });
  }
});
;// CONCATENATED MODULE: ./src/js/sections/faqs.js


register('page-faqs', {
  onLoad: function () {
    let accList = this.container.querySelectorAll('.sf__accordio-blocks');
    accList.forEach(item => {
      new Accordion(item, {
        presetContentHeight: true
      });
    });
  }
});
;// CONCATENATED MODULE: ./src/js/sections/featured-slider.js




register('featured-slider', {
  onLoad: function () {
    this.selectors = {
      sliderContainer: '.featured-slider__products',
      slideImages: ['featured-slider__img'],
      slideImagesContainer: '.featured-slider__images',
      sliderControls: '.sf-slider__controls',
      prevBtn: '.sf-slider__controls-prev',
      nextBtn: '.sf-slider__controls-next'
    };
    this.domNodes = queryDomNodes(this.selectors, this.container);

    const initSlider = () => {
      var _window;

      loadCSS((_window = window) === null || _window === void 0 ? void 0 : _window.themeStyleURLs.swiper.url).then(() => {
        var _window2;

        loadJS((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.themeScriptURLs.swiper.url).then(() => {
          const showNavigation = this.container.dataset.showNavigation === 'true';
          const showPagination = this.container.dataset.showPagination === 'true';
          const autoplay = this.container.dataset.autoplay === 'true';
          const timeout = this.container.dataset.timeout;
          this.slider = new window.spratlyTheme.Swiper(this.domNodes.sliderContainer, {
            speed: 400,
            loop: false,
            autoplay: autoplay ? {
              delay: parseInt(timeout),
              disableOnInteraction: false
            } : false,
            pagination: showPagination ? {
              el: this.container.querySelector('.swiper-pagination'),
              type: 'bullets',
              clickable: true
            } : false,
            on: {
              init: () => {
                if (showNavigation) {
                  var _this$domNodes$prevBt, _this$domNodes$nextBt;

                  (_this$domNodes$prevBt = this.domNodes.prevBtn) === null || _this$domNodes$prevBt === void 0 ? void 0 : _this$domNodes$prevBt.addEventListener('click', () => this.slider.slidePrev());
                  (_this$domNodes$nextBt = this.domNodes.nextBtn) === null || _this$domNodes$nextBt === void 0 ? void 0 : _this$domNodes$nextBt.addEventListener('click', () => this.slider.slideNext());
                  this.domNodes.prevBtn.disabled = true;
                }

                window.spratlyTheme.Products.initProductForms({
                  context: this.container
                }); // Calculate controls position

                if (this.container.dataset.container === 'w-full') {
                  const firstItem = this.domNodes.sliderContainer.querySelector('.sf-image');

                  if (firstItem && this.domNodes.sliderControls) {
                    var _this$domNodes$slider;

                    const itemHeight = firstItem.clientHeight;
                    const contentHeight = (_this$domNodes$slider = this.domNodes.sliderContainer.querySelector('.featured-slider__product-content')) === null || _this$domNodes$slider === void 0 ? void 0 : _this$domNodes$slider.clientHeight;
                    this.domNodes.sliderControls.style.setProperty('--offset-top', parseInt(itemHeight) / 2 + parseInt(contentHeight) + 24 + 'px');
                  }
                }
              }
            }
          }); // Sync 2 sliders

          this.imageSlider = new window.spratlyTheme.Swiper(this.domNodes.slideImagesContainer, {
            speed: 500,
            loop: false,
            effect: 'fade',
            fadeEffect: {
              crossFade: true
            }
          });
          this.slider.on('activeIndexChange', swiper => {
            const {
              activeIndex,
              isBeginning,
              isEnd
            } = swiper;
            this.imageSlider.slideTo(activeIndex);
            window.spratlyTheme.Products.initProductForms({
              context: this.container
            });

            if (showNavigation) {
              this.domNodes.prevBtn.disabled = isBeginning;
              this.domNodes.nextBtn.disabled = isEnd;
            }
          });
          this.imageSlider.on('activeIndexChange', swiper => {
            const {
              activeIndex
            } = swiper;
            this.slider.slideTo(activeIndex);
          });
        });
      });
    };

    if (isInViewport(this.container)) {
      initSlider();
    } else {
      if (window.__sfWindowLoaded) initSlider();else window.addEventListener("load", initSlider);
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/brand-list.js



register('brand-list', {
  onLoad: function () {
    this.initMobile();
  },
  initMobile: function () {
    const enableSlider = this.container.dataset.enableSlider === 'true';
    if (!enableSlider) return;
    const wrapper = this.container.querySelector('[data-wrapper]');
    const mediaQuery = window.matchMedia('(max-width: 1025px)');

    const handleChange = e => {
      if (e.matches) {
        this.initSlider();
        wrapper.classList.add('swiper-wrapper');
      } else {
        this.slider && this.slider.destroy(true, true);
        wrapper.classList.remove('swiper-wrapper');
      }
    }; // Register event listener


    mediaQuery.addListener(handleChange); // Initial check

    handleChange(mediaQuery);
  },
  initSlider: function () {
    const autoplay = this.container.dataset.enableAutoplay === 'true';
    const autoplaySpeed = this.container.dataset.autoplaySpeed;
    const items = parseInt(this.container.dataset.items);

    const initSlider = () => {
      var _window, _window2;

      loadCSS((_window = window) === null || _window === void 0 ? void 0 : _window.themeStyleURLs.swiper.url);
      loadJS((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.themeScriptURLs.swiper.url).then(() => {
        this.slider = new window.spratlyTheme.Swiper(this.container.querySelector('.swiper-container'), {
          slidesPerView: items,
          slidesPerGroup: items,
          autoplay: autoplay ? {
            delay: parseInt(autoplaySpeed) * 1000
          } : false,
          loop: true,
          navigation: {
            nextEl: this.container.querySelector('.swiper-button-next'),
            prevEl: this.container.querySelector('.swiper-button-prev')
          },
          pagination: {
            el: this.container.querySelector('.swiper-pagination'),
            clickable: true
          }
        });
      });
    };

    if (isInViewport(this.container)) {
      initSlider();
    } else {
      if (window.__sfWindowLoaded) initSlider();else window.addEventListener("load", initSlider);
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/collapsible-tabs.js


register('sf-collapsible', {
  onLoad: function () {
    const accContainer = this.container.querySelector('.prod__accordion');
    this.acc = new Accordion(accContainer);
    this.container.classList.add('opacity-100');
  },
  onBlockSelect: function (ev) {
    var _ev$target, _ev$target$dataset;

    const index = Number(ev === null || ev === void 0 ? void 0 : (_ev$target = ev.target) === null || _ev$target === void 0 ? void 0 : (_ev$target$dataset = _ev$target.dataset) === null || _ev$target$dataset === void 0 ? void 0 : _ev$target$dataset.index) || 0;

    if (this.acc) {
      var _accItem$classList, _accItem$classList$co;

      const accItem = this.acc.domNodes.items[index];
      const isAccOpen = accItem === null || accItem === void 0 ? void 0 : (_accItem$classList = accItem.classList) === null || _accItem$classList === void 0 ? void 0 : (_accItem$classList$co = _accItem$classList.contains) === null || _accItem$classList$co === void 0 ? void 0 : _accItem$classList$co.call(_accItem$classList, 'open');

      if (!isAccOpen) {
        var _this$acc;

        this === null || this === void 0 ? void 0 : (_this$acc = this.acc) === null || _this$acc === void 0 ? void 0 : _this$acc.toggle(index);
      }
    }
  },
  onBlockDeselect: function (ev) {
    var _ev$target2, _ev$target2$dataset;

    const index = Number(ev === null || ev === void 0 ? void 0 : (_ev$target2 = ev.target) === null || _ev$target2 === void 0 ? void 0 : (_ev$target2$dataset = _ev$target2.dataset) === null || _ev$target2$dataset === void 0 ? void 0 : _ev$target2$dataset.index) || 0;

    if (this.acc) {
      var _accItem$classList2, _accItem$classList2$c;

      const accItem = this.acc.domNodes.items[index];
      const isAccOpen = accItem === null || accItem === void 0 ? void 0 : (_accItem$classList2 = accItem.classList) === null || _accItem$classList2 === void 0 ? void 0 : (_accItem$classList2$c = _accItem$classList2.contains) === null || _accItem$classList2$c === void 0 ? void 0 : _accItem$classList2$c.call(_accItem$classList2, 'open');

      if (isAccOpen) {
        var _this$acc2;

        this === null || this === void 0 ? void 0 : (_this$acc2 = this.acc) === null || _this$acc2 === void 0 ? void 0 : _this$acc2.toggle(index);
      }
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/featured-product.js


register('featured-product', {
  onLoad: function () {
    var _window$spratlyTheme, _window$spratlyTheme$, _window$spratlyTheme$2, _window$spratlyTheme$3;

    (_window$spratlyTheme = window.spratlyTheme) === null || _window$spratlyTheme === void 0 ? void 0 : (_window$spratlyTheme$ = _window$spratlyTheme.Products) === null || _window$spratlyTheme$ === void 0 ? void 0 : (_window$spratlyTheme$2 = _window$spratlyTheme$.initProductForms) === null || _window$spratlyTheme$2 === void 0 ? void 0 : (_window$spratlyTheme$3 = _window$spratlyTheme$2.call(_window$spratlyTheme$, {
      context: this.container
    })) === null || _window$spratlyTheme$3 === void 0 ? void 0 : _window$spratlyTheme$3.catch(console.error);
    const prodAccordions = this.container.querySelectorAll('.prod__accordion');
    prodAccordions.forEach(acc => new Accordion(acc));
  }
});
;// CONCATENATED MODULE: ./src/js/sections/collection.js



register('collection-template', {
  onLoad: function () {
    var _window;

    const showFilter = this.container.dataset.showFilter === 'true';
    const filterType = this.container.dataset.filtersType;
    customSelect(this.container);
    loadJS((_window = window) === null || _window === void 0 ? void 0 : _window.themeScriptURLs.collection.url).then(() => {
      var _window2, _window2$spratlyTheme, _window2$spratlyTheme2, _window2$spratlyTheme3;

      (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$spratlyTheme = _window2.spratlyTheme) === null || _window2$spratlyTheme === void 0 ? void 0 : (_window2$spratlyTheme2 = _window2$spratlyTheme.Collection) === null || _window2$spratlyTheme2 === void 0 ? void 0 : (_window2$spratlyTheme3 = _window2$spratlyTheme2.init) === null || _window2$spratlyTheme3 === void 0 ? void 0 : _window2$spratlyTheme3.call(_window2$spratlyTheme2);
    });

    if (showFilter) {
      if (filterType === 'tags_filter') {
        var _window3;

        loadJS((_window3 = window) === null || _window3 === void 0 ? void 0 : _window3.themeScriptURLs.tagFilter.url).then(() => {
          var _window4, _window4$spratlyTheme, _window4$spratlyTheme2, _window4$spratlyTheme3;

          (_window4 = window) === null || _window4 === void 0 ? void 0 : (_window4$spratlyTheme = _window4.spratlyTheme) === null || _window4$spratlyTheme === void 0 ? void 0 : (_window4$spratlyTheme2 = _window4$spratlyTheme.CollectionTagsFilters) === null || _window4$spratlyTheme2 === void 0 ? void 0 : (_window4$spratlyTheme3 = _window4$spratlyTheme2.init) === null || _window4$spratlyTheme3 === void 0 ? void 0 : _window4$spratlyTheme3.call(_window4$spratlyTheme2, this.container);
        });
      }

      if (filterType === 'storefront_filters') {
        var _window5, _window5$themeScriptU;

        loadJS((_window5 = window) === null || _window5 === void 0 ? void 0 : (_window5$themeScriptU = _window5.themeScriptURLs.collectionFilterOS2) === null || _window5$themeScriptU === void 0 ? void 0 : _window5$themeScriptU.url).then(() => {
          var _window6, _window6$spratlyTheme, _window6$spratlyTheme2, _window6$spratlyTheme3;

          (_window6 = window) === null || _window6 === void 0 ? void 0 : (_window6$spratlyTheme = _window6.spratlyTheme) === null || _window6$spratlyTheme === void 0 ? void 0 : (_window6$spratlyTheme2 = _window6$spratlyTheme.CollectionFilters) === null || _window6$spratlyTheme2 === void 0 ? void 0 : (_window6$spratlyTheme3 = _window6$spratlyTheme2.init) === null || _window6$spratlyTheme3 === void 0 ? void 0 : _window6$spratlyTheme3.call(_window6$spratlyTheme2);
        });
      }
    } else {
      this.handleSortBy();
    }

    window.spratlyTheme.Products.initProductForms().catch(console.error);
  },

  handleSortBy() {
    this.queryParams = {};

    if (window.location.search.length) {
      let aKeyValue;
      let aCouples = location.search.substr(1).split('&');

      for (let i = 0; i < aCouples.length; i++) {
        aKeyValue = aCouples[i].split('=');

        if (aKeyValue.length > 1) {
          this.queryParams[decodeURIComponent(aKeyValue[0])] = decodeURIComponent(aKeyValue[1]);
        }
      }
    }

    const sorts = document.querySelectorAll('[name="SortBy"]');
    sorts === null || sorts === void 0 ? void 0 : sorts.forEach(sort => {
      sort.addEventListener('change', e => {
        console.log(e.target.value);
        this.queryParams.sort_by = e.target.value;

        if (this.queryParams.page) {
          delete this.queryParams.page;
        }

        window.location.search = decodeURIComponent(new URLSearchParams(Object.entries(this.queryParams)).toString());
      });
    });
  }

});
;// CONCATENATED MODULE: ./src/js/sections/collection-header.js


register('collection-header', {
  onLoad: function () {
    const parallaxEnabled = this.container.dataset.enableParallax === 'true';

    if (parallaxEnabled && window.innerWidth > 767) {
      const bg = this.container.querySelector('.collection-header__bg');
      loadJS(window.themeScriptURLs.parallax.url).then(() => {
        new window.spratlyLibs.simpleParallax(bg, {
          scale: 1.1,
          customWrapper: '.collection-header'
        });
      });
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/brand-header.js


register('brand-header', {
  onLoad: function () {
    this.initGallery();
  },
  initGallery: function () {
    const slider = this.container.querySelector('.brand-header__gallery');
    const imagesCount = slider.querySelectorAll('.brand-header__gallery-img').length;

    if (imagesCount > 1) {
      var _window;

      loadCSS((_window = window) === null || _window === void 0 ? void 0 : _window.themeStyleURLs.swiper.url).then(() => {
        var _window2;

        loadJS((_window2 = window) === null || _window2 === void 0 ? void 0 : _window2.themeScriptURLs.swiper.url).then(() => {
          this.slider = new window.spratlyTheme.Swiper(slider, {
            autoplay: {
              delay: 5000
            },
            slidesPerView: 1,
            loop: true,
            fadeEffect: {
              crossFade: true
            },
            pagination: {
              el: this.container.querySelector('.swiper-pagination'),
              clickable: true
            }
          });
        });
      });
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/product.js




register('product-page', {
  // Shortcut function called when a section is loaded via 'sections.load()' or by the Theme Editor 'shopify:section:load' event.
  onLoad: function () {
    var _Products$initProduct, _Products$initProduct2, _window, _window$spratlyTheme, _window$spratlyTheme$, _window$spratlyTheme$2, _window2, _window2$spratlyTheme, _window2$spratlyTheme2, _window2$spratlyTheme3, _window3, _window3$spratlyTheme, _window3$spratlyTheme2, _window3$spratlyTheme3, _window4, _window4$spratlyTheme, _window4$spratlyTheme2, _window4$spratlyTheme3, _window5, _window5$spratlyTheme, _window5$spratlyTheme2, _window5$spratlyTheme3;

    window.spratlyThemeSettings = window.spratlyThemeSettings || {};
    window.spratlyThemeSettings.productContainer = this.container.dataset.container || 'container';
    product === null || product === void 0 ? void 0 : (_Products$initProduct = product.initProductForms) === null || _Products$initProduct === void 0 ? void 0 : (_Products$initProduct2 = _Products$initProduct.call(product)) === null || _Products$initProduct2 === void 0 ? void 0 : _Products$initProduct2.catch(console.error);
    addRecentViewedProduct(this.container.dataset.productHandle);
    (_window = window) === null || _window === void 0 ? void 0 : (_window$spratlyTheme = _window.spratlyTheme) === null || _window$spratlyTheme === void 0 ? void 0 : (_window$spratlyTheme$ = _window$spratlyTheme.SizeChart) === null || _window$spratlyTheme$ === void 0 ? void 0 : (_window$spratlyTheme$2 = _window$spratlyTheme$.init) === null || _window$spratlyTheme$2 === void 0 ? void 0 : _window$spratlyTheme$2.call(_window$spratlyTheme$);
    (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$spratlyTheme = _window2.spratlyTheme) === null || _window2$spratlyTheme === void 0 ? void 0 : (_window2$spratlyTheme2 = _window2$spratlyTheme.ProductCountdown) === null || _window2$spratlyTheme2 === void 0 ? void 0 : (_window2$spratlyTheme3 = _window2$spratlyTheme2.init) === null || _window2$spratlyTheme3 === void 0 ? void 0 : _window2$spratlyTheme3.call(_window2$spratlyTheme2);
    (_window3 = window) === null || _window3 === void 0 ? void 0 : (_window3$spratlyTheme = _window3.spratlyTheme) === null || _window3$spratlyTheme === void 0 ? void 0 : (_window3$spratlyTheme2 = _window3$spratlyTheme.StickyATC) === null || _window3$spratlyTheme2 === void 0 ? void 0 : (_window3$spratlyTheme3 = _window3$spratlyTheme2.init) === null || _window3$spratlyTheme3 === void 0 ? void 0 : _window3$spratlyTheme3.call(_window3$spratlyTheme2);
    (_window4 = window) === null || _window4 === void 0 ? void 0 : (_window4$spratlyTheme = _window4.spratlyTheme) === null || _window4$spratlyTheme === void 0 ? void 0 : (_window4$spratlyTheme2 = _window4$spratlyTheme.BoostSales) === null || _window4$spratlyTheme2 === void 0 ? void 0 : (_window4$spratlyTheme3 = _window4$spratlyTheme2.init) === null || _window4$spratlyTheme3 === void 0 ? void 0 : _window4$spratlyTheme3.call(_window4$spratlyTheme2);
    (_window5 = window) === null || _window5 === void 0 ? void 0 : (_window5$spratlyTheme = _window5.spratlyTheme) === null || _window5$spratlyTheme === void 0 ? void 0 : (_window5$spratlyTheme2 = _window5$spratlyTheme.Sharing) === null || _window5$spratlyTheme2 === void 0 ? void 0 : (_window5$spratlyTheme3 = _window5$spratlyTheme2.init) === null || _window5$spratlyTheme3 === void 0 ? void 0 : _window5$spratlyTheme3.call(_window5$spratlyTheme2);
    const prodAccordions = document.querySelectorAll('.prod__accordion');
    prodAccordions.forEach(acc => new Accordion(acc));
  }
});
;// CONCATENATED MODULE: ./src/js/sections/product-tabs.js
/* provided dependency */ var product_tabs_createElement = __webpack_require__(6295)["default"];
// eslint-disable-next-line no-unused-vars








register('product-tabs', {
  onLoad: function () {
    this.initTabs();
    this.initMobileSelect();
    this.selectors = {
      loadMoreBtn: '[data-load-more]',
      productsContainer: '[data-products-container]'
    };
    this.domNodes = queryDomNodes(this.selectors);
    this.tabSliders = [];
    customSelect(this.container);
    const sliderEnabled = this.container.dataset.enableSlider === 'true';
    const buttonType = this.container.dataset.buttonType;
    const blocks = this.container.querySelectorAll('.sf-tab-content');

    if (sliderEnabled) {
      this.showPagination = this.container.dataset.showPagination === 'true';
      this.showNavigation = this.container.dataset.showNavigation === 'true';
      this.items = this.container.dataset.items;

      for (let block of blocks) {
        this.initSlider(block);
      }
    }

    if (!sliderEnabled && buttonType === 'load') {
      this.canLoad = true;
      this.currentPage = 1;
      this.spinner = product_tabs_createElement(Spinner, null);

      for (let block of blocks) {
        this.initLoadMore(block);
      }
    }
  },
  initTabs: function () {
    this.tabs = new Tabs(this === null || this === void 0 ? void 0 : this.container, target => {
      const tabId = target.getAttribute('href');
      const slider = this.container.querySelector(tabId + ' .swiper-container');
      console.log('switch tab', slider); // trigger update slider

      slider && slider.swiper.update();
    });
  },
  initSlider: function (sliderContainer) {
    initSlider({
      container: sliderContainer,
      items: parseInt(this.items),
      slidesPerGroup: 2,
      showPagination: this.showPagination,
      showNavigation: this.showNavigation
    });
  },
  initMobileSelect: function () {
    this.select = this.container.querySelector('[data-tab-select]');
    this.select.addEventListener('change', () => {
      var _this$tabs, _this$tabs$currentTab;

      this.tabs.setActiveTab(parseInt(this.select.value));
      const slider = (_this$tabs = this.tabs) === null || _this$tabs === void 0 ? void 0 : (_this$tabs$currentTab = _this$tabs.currentTab) === null || _this$tabs$currentTab === void 0 ? void 0 : _this$tabs$currentTab.querySelector('.swiper-container');
      slider && slider.swiper.update();
    });
  },
  initLoadMore: function (wrapper) {
    addEventDelegate({
      context: wrapper,
      selector: this.selectors.loadMoreBtn,
      handler: e => {
        e.preventDefault();
        this.handleLoadMore(wrapper);
      }
    });
  },
  handleLoadMore: function (wrapper) {
    const loadBtn = wrapper.querySelector(this.selectors.loadMoreBtn);
    const productsContainer = wrapper.querySelector(this.selectors.productsContainer);
    let currentPage = wrapper.dataset.page;
    currentPage = parseInt(currentPage);
    const totalPages = wrapper.dataset.totalPages;
    this.toggleLoading(loadBtn, true);
    const url = wrapper.dataset.url;
    const dataUrl = `${url}?page=${currentPage + 1}&section_id=${this.id}`;
    (0,utilities_fetch.fetchCache)(dataUrl).then(html => {
      currentPage++;
      wrapper.dataset.page = currentPage;
      this.toggleLoading(loadBtn, false);
      const dom = generateDomFromString(html);
      const products = dom.querySelector(this.selectors.productsContainer);

      if (products) {
        Array.from(products.childNodes).forEach(product => productsContainer.appendChild(product));
        window.spratlyTheme.Products.initProductForms({
          context: this.context
        });
      }

      if (currentPage >= parseInt(totalPages)) loadBtn && loadBtn.remove();
    });
  },
  toggleLoading: function (loadBtn, status) {
    if (!loadBtn) return;

    if (status) {
      loadBtn.appendChild(this.spinner);
      loadBtn.classList.add('sf-spinner-loading');
    } else {
      var _this$spinner;

      this === null || this === void 0 ? void 0 : (_this$spinner = this.spinner) === null || _this$spinner === void 0 ? void 0 : _this$spinner.remove();
      loadBtn.classList.remove('sf-spinner-loading');
    }
  },
  onBlockSelect: function (evt) {
    const {
      index
    } = evt.target.dataset;
    this.tabs.setActiveTab(index);
  }
});
;// CONCATENATED MODULE: ./src/js/sections/product-recommendations.js


register('product-recommendations', {
  onLoad: function () {
    var _window, _window$themeScriptUR, _window$themeScriptUR2;

    loadJS((_window = window) === null || _window === void 0 ? void 0 : (_window$themeScriptUR = _window.themeScriptURLs) === null || _window$themeScriptUR === void 0 ? void 0 : (_window$themeScriptUR2 = _window$themeScriptUR.productRecommendations) === null || _window$themeScriptUR2 === void 0 ? void 0 : _window$themeScriptUR2.url).then(() => {
      window.spratlyTheme.ShopifyProductRecommendation = new window.spratlyTheme.ProductRecommendation(this.container);
      this.recommendation = window.spratlyTheme.ShopifyProductRecommendation;
    });
  }
});
;// CONCATENATED MODULE: ./src/js/sections/foxkit-related-products.js

register('foxkit-related-products', {
  onLoad: function () {
    var _window, _window$FoxKit, _window$FoxKit$foxKit;

    if ((_window = window) !== null && _window !== void 0 && (_window$FoxKit = _window.FoxKit) !== null && _window$FoxKit !== void 0 && (_window$FoxKit$foxKit = _window$FoxKit.foxKitSettings) !== null && _window$FoxKit$foxKit !== void 0 && _window$FoxKit$foxKit.productRecommendations) {
      var _window2, _window2$FoxKit, _window2$FoxKit$initP;

      (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$FoxKit = _window2.FoxKit) === null || _window2$FoxKit === void 0 ? void 0 : (_window2$FoxKit$initP = _window2$FoxKit.initProductRecommendations) === null || _window2$FoxKit$initP === void 0 ? void 0 : _window2$FoxKit$initP.call(_window2$FoxKit);
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/recently-viewed-products.js

register('recently-viewed', {
  onLoad() {
    var _window$spratlyTheme, _window$spratlyTheme$, _window$spratlyTheme$2;

    (_window$spratlyTheme = window.spratlyTheme) === null || _window$spratlyTheme === void 0 ? void 0 : (_window$spratlyTheme$ = _window$spratlyTheme.RecentlyViewedProducts) === null || _window$spratlyTheme$ === void 0 ? void 0 : (_window$spratlyTheme$2 = _window$spratlyTheme$.init) === null || _window$spratlyTheme$2 === void 0 ? void 0 : _window$spratlyTheme$2.call(_window$spratlyTheme$);
  }

});
;// CONCATENATED MODULE: ./src/js/sections/blog-template.js


register('blog-template', {
  onLoad: function () {
    var _this$container;

    const container = (_this$container = this.container) === null || _this$container === void 0 ? void 0 : _this$container.querySelector('.sf__aside-instagram');

    if (container) {
      const {
        accessToken,
        imagesCount
      } = container.dataset;

      if (accessToken) {
        new Instagram(container, accessToken, imagesCount);
      } else {
        console.warn('Failed to init Instagram section! Missing Access Token');
      }
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/article-template.js


register('article-template', {
  onLoad: function () {
    var _this$container;

    const container = (_this$container = this.container) === null || _this$container === void 0 ? void 0 : _this$container.querySelector('.sf__aside-instagram');

    if (container) {
      const {
        accessToken,
        imagesCount
      } = container.dataset;

      if (accessToken) {
        new Instagram(container, accessToken, imagesCount);
      } else {
        console.warn('Failed to init Instagram section! Missing Access Token');
      }
    }
  }
});
;// CONCATENATED MODULE: ./src/js/sections/index.js
 // Header + Footer


 // Home sections



















 // Collection page sections



 // Product page sections





 // Blog template section



function loadAllSections() {
  try {
    load('*');
  } catch (error) {
    console.error("Faied to load sections. ", error);
  }
}
;// CONCATENATED MODULE: ./src/js/app.js













window._themeProducts = window._themeProducts || {};
window.spratlyThemeSettings = window.spratlyThemeSettings || {};
window.spratlyTheme = {
  Notification: notification,
  Instagram: Instagram,
  Megamenu: Megamenu,
  Search: search,
  themeData: {},
  Wishlist: wishlist,
  CompareProduct: compare_product,
  Products: product,
  Product: Product
};

function initTheme() {
  window._ThemeEvent = new events_Event();
  runHelpers(); // customSelect()

  loadAllSections();
  window.spratlyTheme.Products.initProductForms().catch(console.error);
}

initTheme();
}();
/******/ })()
;