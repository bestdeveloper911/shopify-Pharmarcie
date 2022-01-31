/******/ (function() { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 2136:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "Z": function() { return /* binding */ CollectionFilters; }
});

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(4942);
// EXTERNAL MODULE: ./src/js/utilities/events.js
var events = __webpack_require__(8971);
// EXTERNAL MODULE: ./src/js/utilities/index.js
var utilities = __webpack_require__(2870);
// EXTERNAL MODULE: ./src/js/utilities/debounce.js
var debounce = __webpack_require__(2627);
;// CONCATENATED MODULE: ./src/js/utilities/accordion.js




class Accordion {
  constructor(container, options = this.defaultOptions) {
    (0,defineProperty/* default */.Z)(this, "defaultOptions", {
      presetContentHeight: false,
      duration: 300,
      callback: () => {}
    });

    (0,defineProperty/* default */.Z)(this, "selectors", {
      items: ['.sf__accordion-item'],
      buttons: ['.sf__accordion-button'],
      contents: ['.sf__accordion-content']
    });

    (0,defineProperty/* default */.Z)(this, "openClass", 'open');

    (0,defineProperty/* default */.Z)(this, "initClass", 'acc-initialized');

    (0,defineProperty/* default */.Z)(this, "removeEventsFunction", null);

    (0,defineProperty/* default */.Z)(this, "debouncedSetContentHeight", (0,debounce/* debounce */.D)(this.setContentHeight));

    (0,defineProperty/* default */.Z)(this, "destroy", () => {
      this.removeEventsFunction();
      window.removeEventListener("resize", this.debouncedSetContentHeight);
    });

    (0,defineProperty/* default */.Z)(this, "setContentOpacity", () => {
      this.domNodes.contents.forEach(cont => cont.style.opacity = 1);
    });

    (0,defineProperty/* default */.Z)(this, "setItemOverflowState", () => {
      var _this$domNodes, _this$domNodes$items;

      (_this$domNodes = this.domNodes) === null || _this$domNodes === void 0 ? void 0 : (_this$domNodes$items = _this$domNodes.items) === null || _this$domNodes$items === void 0 ? void 0 : _this$domNodes$items.forEach((item, index) => {
        var _this$domNodes2, _this$domNodes2$conte, _item$classList, _item$classList$conta, _contents$classList, _contents$classList$m;

        let contents = (_this$domNodes2 = this.domNodes) === null || _this$domNodes2 === void 0 ? void 0 : (_this$domNodes2$conte = _this$domNodes2.contents) === null || _this$domNodes2$conte === void 0 ? void 0 : _this$domNodes2$conte[index];
        const method = item !== null && item !== void 0 && (_item$classList = item.classList) !== null && _item$classList !== void 0 && (_item$classList$conta = _item$classList.contains) !== null && _item$classList$conta !== void 0 && _item$classList$conta.call(_item$classList, this.openClass) ? 'remove' : 'add';
        contents === null || contents === void 0 ? void 0 : (_contents$classList = contents.classList) === null || _contents$classList === void 0 ? void 0 : (_contents$classList$m = _contents$classList[method]) === null || _contents$classList$m === void 0 ? void 0 : _contents$classList$m.call(_contents$classList, 'overflow-hidden');
      });
    });

    (0,defineProperty/* default */.Z)(this, "setContentHeight", () => {
      this.domNodes = (0,utilities/* queryDomNodes */.zt)(this.selectors, this.container);
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

    (0,defineProperty/* default */.Z)(this, "toggle", index => {
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
    this.domNodes = (0,utilities/* queryDomNodes */.zt)(this.selectors, this.container);
    this.options = Object.assign({}, this.defaultOptions, options);
    this.init();
  }

  init() {
    var _this$container, _this$container$style;

    (_this$container = this.container) === null || _this$container === void 0 ? void 0 : (_this$container$style = _this$container.style) === null || _this$container$style === void 0 ? void 0 : _this$container$style.setProperty('--duration', ` ${this.options.duration}ms`);
    this.removeEventsFunction = (0,events/* addEventDelegate */.X)({
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
;// CONCATENATED MODULE: ./src/js/pages/collection-filters.js




class CollectionFilters {
  constructor() {
    (0,defineProperty/* default */.Z)(this, "selectedTags", new Set());

    (0,defineProperty/* default */.Z)(this, "currentPage", 1);

    (0,defineProperty/* default */.Z)(this, "innerWidth", window.innerWidth);

    (0,defineProperty/* default */.Z)(this, "selectors", {
      section: '[data-section-type="collection-template"]',
      collectionContainer: '.sf__collection-container',
      sidebar: '.sf__sidebar',
      openSidebar: '.sf__sidebar-open',
      closeSidebar: '.sf__sidebar-close',
      sidebarContent: '.sf__sidebar-content',
      sidebarWrapper: '.sf__sidebar-wrapper',
      filterWrapper: '.sf__filter-wrapper',
      tagsFilter: '[data-tags-filter]',
      mbSortIcon: '.sf__sortmb-icon',
      mbSortWrapper: '.sf__sortmb-wrapper',
      mbSortList: '.sf__sortmb-list',
      mbSortListItems: ['.sf__sortmb-list li'],
      mbSortListItemActive: '.sf__sortmb-list li.active',
      mbSortCloseIcon: '.sf__hidden-sortmb'
    });

    (0,defineProperty/* default */.Z)(this, "initSidebarFilter", () => {
      const {
        sidebar,
        filterWrapper
      } = this.domNodes;

      if (sidebar && filterWrapper) {
        if (this.accs) this.accs.destroy();
        let presetContentHeight = this.setPresetContentHeight();
        filterWrapper.classList.remove('acc-initialized');
        this.accs = new Accordion(filterWrapper, {
          presetContentHeight,
          callback: () => filterWrapper.classList.add('opacity-100')
        });
      }

      this.toggleSidebarFilter();
      window.addEventListener('resize', () => {
        this.innerWidth = window.innerWidth;
        this.responsiveSidebar();
      });
    });

    (0,defineProperty/* default */.Z)(this, "setPresetContentHeight", () => {
      var _this$domNodes$sideba;

      let presetContentHeight = true;
      let sidebarType = (_this$domNodes$sideba = this.domNodes.sidebar) === null || _this$domNodes$sideba === void 0 ? void 0 : _this$domNodes$sideba.dataset.type;

      if (this.innerWidth < 1280) {
        presetContentHeight = false;
      } else if (this.innerWidth > 1279 && sidebarType !== 'fixed') {
        presetContentHeight = true;
      } else if (sidebarType === 'fixed') {
        presetContentHeight = false;
      }

      return presetContentHeight;
    });

    (0,defineProperty/* default */.Z)(this, "responsiveSidebar", () => {
      var _this$domNodes$sideba2;

      let sidebarType = (_this$domNodes$sideba2 = this.domNodes.sidebar) === null || _this$domNodes$sideba2 === void 0 ? void 0 : _this$domNodes$sideba2.dataset.type;

      if (sidebarType === 'leftColumn' || sidebarType === 'rightColumn') {
        if (this.innerWidth > 1279) {
          var _this$domNodes$sideba3;

          (_this$domNodes$sideba3 = this.domNodes.sidebar) === null || _this$domNodes$sideba3 === void 0 ? void 0 : _this$domNodes$sideba3.style.removeProperty('display');
        } else {
          var _this$domNodes$sideba4, _this$domNodes$sideba5;

          (_this$domNodes$sideba4 = this.domNodes.sidebar) === null || _this$domNodes$sideba4 === void 0 ? void 0 : _this$domNodes$sideba4.style.setProperty('display', 'none');
          (_this$domNodes$sideba5 = this.domNodes.sidebar) === null || _this$domNodes$sideba5 === void 0 ? void 0 : _this$domNodes$sideba5.style.setProperty('--tw-bg-opacity', '0');
        }
      }
    });

    (0,defineProperty/* default */.Z)(this, "toggleSidebarFilter", () => {
      const {
        section,
        sidebar,
        openSidebar,
        closeSidebar
      } = this.domNodes;
      openSidebar === null || openSidebar === void 0 ? void 0 : openSidebar.addEventListener('click', e => {
        e.preventDefault();
        this.openSidebarFilter();
        section.classList.add('sidebar-open');
        document.documentElement.classList.add('prevent-scroll');
      });
      closeSidebar === null || closeSidebar === void 0 ? void 0 : closeSidebar.addEventListener('click', this.closeSidebarFilter);
      sidebar === null || sidebar === void 0 ? void 0 : sidebar.addEventListener('click', e => {
        if (e.target === sidebar) {
          this.closeSidebarFilter();
          section.classList.remove('sidebar-open');
          document.documentElement.classList.remove('prevent-scroll');
        }
      });
    });

    (0,defineProperty/* default */.Z)(this, "openSidebarFilter", () => {
      const {
        sidebar,
        sidebarContent
      } = this.domNodes;
      sidebar === null || sidebar === void 0 ? void 0 : sidebar.style.setProperty('display', 'block'); // document.documentElement.classList.add('overflow-hidden')

      setTimeout(() => {
        var _this$accs;

        sidebar === null || sidebar === void 0 ? void 0 : sidebar.style.setProperty('--tw-bg-opacity', '0.5');
        sidebarContent === null || sidebarContent === void 0 ? void 0 : sidebarContent.style.setProperty('--tw-translate-x', '0');
        (_this$accs = this.accs) === null || _this$accs === void 0 ? void 0 : _this$accs.setContentHeight();
      }, 50);
    });

    (0,defineProperty/* default */.Z)(this, "closeSidebarFilter", () => {
      const {
        sidebar,
        sidebarContent
      } = this.domNodes;
      const sidebarType = sidebar.dataset.type;

      if (this.innerWidth < 1280 || sidebarType === 'fixed') {
        sidebar === null || sidebar === void 0 ? void 0 : sidebar.style.setProperty('--tw-bg-opacity', '0');
        sidebarContent === null || sidebarContent === void 0 ? void 0 : sidebarContent.style.setProperty('--tw-translate-x', '-100%');
        document.documentElement.classList.remove('prevent-scroll');
        setTimeout(() => {
          sidebar === null || sidebar === void 0 ? void 0 : sidebar.style.setProperty('display', 'none');
        }, 200);
      }
    });

    (0,defineProperty/* default */.Z)(this, "initSortbyMobile", () => {
      (0,events/* addEventDelegate */.X)({
        selector: this.selectors.mbSortIcon,
        handler: this.openSortByMobile
      });
      document.body.addEventListener("click", this.handleSortWrapperClick);
      let activeItem = this.domNodes.mbSortListItemActive;
      (0,events/* addEventDelegate */.X)({
        selector: this.selectors.mbSortListItems[0],
        handler: (e, item) => {
          if (item !== activeItem) {
            var _activeItem, _activeItem$classList, _activeItem$classList2, _window$spratlyTheme, _window$spratlyTheme$;

            (_activeItem = activeItem) === null || _activeItem === void 0 ? void 0 : (_activeItem$classList = _activeItem.classList) === null || _activeItem$classList === void 0 ? void 0 : (_activeItem$classList2 = _activeItem$classList.remove) === null || _activeItem$classList2 === void 0 ? void 0 : _activeItem$classList2.call(_activeItem$classList, 'active');
            item.classList.add('active');
            activeItem = item;
            this.closeSortByMobile();
            const sortValue = item.dataset.value;
            if (sortValue) (_window$spratlyTheme = window.spratlyTheme) === null || _window$spratlyTheme === void 0 ? void 0 : (_window$spratlyTheme$ = _window$spratlyTheme.CollectionTagsFilters) === null || _window$spratlyTheme$ === void 0 ? void 0 : _window$spratlyTheme$._onSorting(sortValue);
            const selectInform = document.querySelector('[data-form-sortby] select');
            selectInform.selectedIndex = item.dataset.index;
            const form = selectInform.closest('form');
            form.dispatchEvent(new Event('input'));
          }
        }
      });
    });

    (0,defineProperty/* default */.Z)(this, "openSortByMobile", () => {
      const {
        mbSortWrapper,
        mbSortList
      } = this.domNodes;
      mbSortWrapper === null || mbSortWrapper === void 0 ? void 0 : mbSortWrapper.style.setProperty('display', 'block');
      setTimeout(() => {
        document.documentElement.classList.add('overflow-hidden');
        mbSortWrapper === null || mbSortWrapper === void 0 ? void 0 : mbSortWrapper.style.setProperty('--tw-bg-opacity', '0.5');
        mbSortList === null || mbSortList === void 0 ? void 0 : mbSortList.style.setProperty('--tw-translate-y', '0');
      }, 200);
    });

    (0,defineProperty/* default */.Z)(this, "closeSortByMobile", e => {
      const {
        mbSortWrapper,
        mbSortList
      } = this.domNodes;
      mbSortWrapper === null || mbSortWrapper === void 0 ? void 0 : mbSortWrapper.style.setProperty('--tw-bg-opacity', '0');
      mbSortList === null || mbSortList === void 0 ? void 0 : mbSortList.style.setProperty('--tw-translate-y', '100%');
      document.documentElement.classList.remove('overflow-hidden');
      setTimeout(() => {
        mbSortWrapper === null || mbSortWrapper === void 0 ? void 0 : mbSortWrapper.style.setProperty('display', 'none');
      }, 200);
    });

    (0,defineProperty/* default */.Z)(this, "handleSortWrapperClick", e => {
      var _e$target, _e$target2, _e$target3;

      const list = (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.closest(this.selectors.mbSortList);
      const open = (_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : _e$target2.closest(this.selectors.mbSortIcon);
      const close = (_e$target3 = e.target) === null || _e$target3 === void 0 ? void 0 : _e$target3.closest(this.selectors.mbSortCloseIcon);

      if (!list && !open || close) {
        this.closeSortByMobile();
      }
    });
  }

  init() {
    this.queryDomNodes();
    this.sectionId = this.domNodes.section.dataset.sectionId;
    this.initSortbyMobile();
    window.requestAnimationFrame(this.initSidebarFilter);
  }

  queryDomNodes() {
    this.domNodes = (0,utilities/* queryDomNodes */.zt)(this.selectors);
  }

} // window.spratlyTheme = window.spratlyTheme || {}
// window.spratlyTheme.CollectionFilters = new CollectionFilters()

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

/***/ 2627:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "D": function() { return /* binding */ debounce; }
/* harmony export */ });
function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
  };
}

/***/ }),

/***/ 8971:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "X": function() { return /* binding */ addEventDelegate; }
/* harmony export */ });
/* unused harmony export default */
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

/***/ }),

/***/ 2870:
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "zt": function() { return /* binding */ queryDomNodes; },
/* harmony export */   "k3": function() { return /* binding */ scrollToTop; },
/* harmony export */   "db": function() { return /* binding */ updateParam; }
/* harmony export */ });
/* unused harmony exports productFormCheck, camelCaseToSnakeCase, animateReplace, createSearchLink, isInViewport, getVideoURL, setCookie, getCookie, addRecentViewedProduct, generateDomFromString, emailIsValid, getParams, runHelpers */
/* harmony import */ var scroll_into_view__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(643);
/* harmony import */ var scroll_into_view__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(scroll_into_view__WEBPACK_IMPORTED_MODULE_0__);
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
  scroll_into_view__WEBPACK_IMPORTED_MODULE_0___default()(scrollToTopTarget);
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

/***/ }),

/***/ 4942:
/***/ (function(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "Z": function() { return /* binding */ _defineProperty; }
/* harmony export */ });
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

// UNUSED EXPORTS: default

// EXTERNAL MODULE: ./node_modules/@babel/runtime/helpers/esm/defineProperty.js
var defineProperty = __webpack_require__(4942);
// EXTERNAL MODULE: ./src/js/utilities/index.js
var utilities = __webpack_require__(2870);
// EXTERNAL MODULE: ./src/js/utilities/events.js
var events = __webpack_require__(8971);
;// CONCATENATED MODULE: ./src/js/modules/animate-loading.js

class AnimateLoading {
  constructor(target, options = {}) {
    (0,defineProperty/* default */.Z)(this, "selectors", {
      loadingBar: 'al-loading-bar',
      loadingOverlay: 'al-loading-overlay'
    });

    (0,defineProperty/* default */.Z)(this, "defaultOptions", {
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
// EXTERNAL MODULE: ./src/js/utilities/debounce.js
var debounce = __webpack_require__(2627);
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
// EXTERNAL MODULE: ./src/js/pages/collection-filters.js + 1 modules
var collection_filters = __webpack_require__(2136);
;// CONCATENATED MODULE: ./src/js/pages/tags-filter.js







class TagsFilter {
  constructor() {
    (0,defineProperty/* default */.Z)(this, "selectors", {
      tag: '[data-tag-filter]',
      sidebar: '[data-sidebar-filter]',
      btnReset: '[data-reset-filter]',
      container: '[data-section-container]',
      mainContent: '#MainContent',
      sortBy: '[name="sort_by"]'
    });

    (0,defineProperty/* default */.Z)(this, "setLoadingTarget", () => {
      this.loading = new AnimateLoading(this.domNodes.container);
    });

    this.domNodes = (0,utilities/* queryDomNodes */.zt)(this.selectors);
    this.collectionFilter = new collection_filters/* default */.Z();
    this.setLoadingTarget();
    window.addEventListener('resize', (0,debounce/* debounce */.D)(this.setLoadingTarget, 500));
  }

  init(section) {
    var _this$section, _this$section$dataset, _this$collectionFilte;

    this.section = section;
    this.sectionId = (_this$section = this.section) === null || _this$section === void 0 ? void 0 : (_this$section$dataset = _this$section.dataset) === null || _this$section$dataset === void 0 ? void 0 : _this$section$dataset.sectionId;
    (0,events/* addEventDelegate */.X)({
      selector: this.selectors.tag,
      handler: this.handleFilter.bind(this)
    });
    this.handleSortBy();
    (_this$collectionFilte = this.collectionFilter) === null || _this$collectionFilte === void 0 ? void 0 : _this$collectionFilte.init();
  }

  handleFilter(e) {
    var _e$target;

    e.preventDefault();
    e.stopPropagation();
    const url = e === null || e === void 0 ? void 0 : (_e$target = e.target) === null || _e$target === void 0 ? void 0 : _e$target.getAttribute('href');
    if (url) this.fetchSectionHtml(url);
  }

  handleSortBy() {
    var _this$domNodes$sortBy;

    (_this$domNodes$sortBy = this.domNodes.sortBy) === null || _this$domNodes$sortBy === void 0 ? void 0 : _this$domNodes$sortBy.addEventListener('change', e => {
      var _e$target2;

      const value = e === null || e === void 0 ? void 0 : (_e$target2 = e.target) === null || _e$target2 === void 0 ? void 0 : _e$target2.value;

      this._onSorting(value);
    });
  }

  fetchSectionHtml(url) {
    this.loading.start();
    fetch(url).then(response => response.text()).then(responseText => {
      this.renderProductGrid(responseText);
      this.onFinishFilter(url);
    });
  }

  renderProductGrid(html) {
    var _dom$querySelector, _dom$querySelector2;

    const dom = new DOMParser().parseFromString(html, 'text/html');
    this.domNodes.mainContent.innerHTML = dom === null || dom === void 0 ? void 0 : (_dom$querySelector = dom.querySelector(this.selectors.mainContent)) === null || _dom$querySelector === void 0 ? void 0 : _dom$querySelector.innerHTML;
    document.title = dom === null || dom === void 0 ? void 0 : (_dom$querySelector2 = dom.querySelector('title')) === null || _dom$querySelector2 === void 0 ? void 0 : _dom$querySelector2.innerText;
  }

  onFinishFilter(url) {
    this._updateBrowserHistory(url);

    this._reInitEvents();

    this.loading.finish(() => {
      (0,utilities/* scrollToTop */.k3)();
    });
  }

  _onSorting(value) {
    if (!value) return;
    (0,utilities/* updateParam */.db)('sort_by', value);
    this.fetchSectionHtml(window.location.href);
  }

  _updateBrowserHistory(url) {
    window.history.replaceState({
      path: url
    }, '', url);
  }

  _reInitEvents() {
    var _window$spratlyTheme2, _window$spratlyTheme3, _this$collectionFilte2;

    this.domNodes = (0,utilities/* queryDomNodes */.zt)(this.selectors);
    this.setLoadingTarget();
    this.handleSortBy();
    window.spratlyTheme.Products.initProductForms({
      context: this.container
    }).then(() => {
      var _window, _window$spratlyTheme, _window$spratlyTheme$, _window2, _window2$spratlyTheme, _window2$spratlyTheme2;

      (_window = window) === null || _window === void 0 ? void 0 : (_window$spratlyTheme = _window.spratlyTheme) === null || _window$spratlyTheme === void 0 ? void 0 : (_window$spratlyTheme$ = _window$spratlyTheme.CompareProduct) === null || _window$spratlyTheme$ === void 0 ? void 0 : _window$spratlyTheme$.setCompareButtonsState();
      (_window2 = window) === null || _window2 === void 0 ? void 0 : (_window2$spratlyTheme = _window2.spratlyTheme) === null || _window2$spratlyTheme === void 0 ? void 0 : (_window2$spratlyTheme2 = _window2$spratlyTheme.Wishlist) === null || _window2$spratlyTheme2 === void 0 ? void 0 : _window2$spratlyTheme2.setWishlistButtonsState();
    }).catch(console.error);
    customSelect(this.domNodes.container);
    (_window$spratlyTheme2 = window.spratlyTheme) === null || _window$spratlyTheme2 === void 0 ? void 0 : (_window$spratlyTheme3 = _window$spratlyTheme2.Collection) === null || _window$spratlyTheme3 === void 0 ? void 0 : _window$spratlyTheme3.init();
    (_this$collectionFilte2 = this.collectionFilter) === null || _this$collectionFilte2 === void 0 ? void 0 : _this$collectionFilte2.init();
    document.documentElement.classList.remove('prevent-scroll');
  }

}
window.spratlyTheme = window.spratlyTheme || {};
window.spratlyTheme.CollectionTagsFilters = new TagsFilter();
}();
/******/ })()
;