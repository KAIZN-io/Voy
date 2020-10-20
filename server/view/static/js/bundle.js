(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/*!
  * Bootstrap v4.5.2 (https://getbootstrap.com/)
  * Copyright 2011-2020 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
  */
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('jquery'), require('popper.js')) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'popper.js'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.bootstrap = {}, global.jQuery, global.Popper));
}(this, (function (exports, $, Popper) { 'use strict';

  $ = $ && Object.prototype.hasOwnProperty.call($, 'default') ? $['default'] : $;
  Popper = Popper && Object.prototype.hasOwnProperty.call(Popper, 'default') ? Popper['default'] : Popper;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function _extends() {
    _extends = Object.assign || function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];

        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }

      return target;
    };

    return _extends.apply(this, arguments);
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.5.2): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  var TRANSITION_END = 'transitionend';
  var MAX_UID = 1000000;
  var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    if (obj === null || typeof obj === 'undefined') {
      return "" + obj;
    }

    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined;
      }
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    $.fn.emulateTransitionEnd = transitionEndEmulator;
    $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        var hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
      }

      try {
        return document.querySelector(selector) ? selector : null;
      } catch (err) {
        return null;
      }
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      } // Get transition-duration of the element


      var transitionDuration = $(element).css('transition-duration');
      var transitionDelay = $(element).css('transition-delay');
      var floatTransitionDuration = parseFloat(transitionDuration);
      var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first


      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(TRANSITION_END);
    },
    // TODO: Remove in v5
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(TRANSITION_END);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    },
    findShadowRoot: function findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document


      if (typeof element.getRootNode === 'function') {
        var root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }

      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root


      if (!element.parentNode) {
        return null;
      }

      return Util.findShadowRoot(element.parentNode);
    },
    jQueryDetection: function jQueryDetection() {
      if (typeof $ === 'undefined') {
        throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
      }

      var version = $.fn.jquery.split(' ')[0].split('.');
      var minMajor = 1;
      var ltMajor = 2;
      var minMinor = 9;
      var minPatch = 1;
      var maxMajor = 4;

      if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
        throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
      }
    }
  };
  Util.jQueryDetection();
  setTransitionEndSupport();

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'alert';
  var VERSION = '4.5.2';
  var DATA_KEY = 'bs.alert';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var SELECTOR_DISMISS = '[data-dismiss="alert"]';
  var EVENT_CLOSE = "close" + EVENT_KEY;
  var EVENT_CLOSED = "closed" + EVENT_KEY;
  var EVENT_CLICK_DATA_API = "click" + EVENT_KEY + DATA_API_KEY;
  var CLASS_NAME_ALERT = 'alert';
  var CLASS_NAME_FADE = 'fade';
  var CLASS_NAME_SHOW = 'show';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Alert = /*#__PURE__*/function () {
    function Alert(element) {
      this._element = element;
    } // Getters


    var _proto = Alert.prototype;

    // Public
    _proto.close = function close(element) {
      var rootElement = this._element;

      if (element) {
        rootElement = this._getRootElement(element);
      }

      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    } // Private
    ;

    _proto._getRootElement = function _getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = document.querySelector(selector);
      }

      if (!parent) {
        parent = $(element).closest("." + CLASS_NAME_ALERT)[0];
      }

      return parent;
    };

    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
      var closeEvent = $.Event(EVENT_CLOSE);
      $(element).trigger(closeEvent);
      return closeEvent;
    };

    _proto._removeElement = function _removeElement(element) {
      var _this = this;

      $(element).removeClass(CLASS_NAME_SHOW);

      if (!$(element).hasClass(CLASS_NAME_FADE)) {
        this._destroyElement(element);

        return;
      }

      var transitionDuration = Util.getTransitionDurationFromElement(element);
      $(element).one(Util.TRANSITION_END, function (event) {
        return _this._destroyElement(element, event);
      }).emulateTransitionEnd(transitionDuration);
    };

    _proto._destroyElement = function _destroyElement(element) {
      $(element).detach().trigger(EVENT_CLOSED).remove();
    } // Static
    ;

    Alert._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert._handleDismiss = function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    _createClass(Alert, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return Alert;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(EVENT_CLICK_DATA_API, SELECTOR_DISMISS, Alert._handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Alert._jQueryInterface;
  $.fn[NAME].Constructor = Alert;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$1 = 'button';
  var VERSION$1 = '4.5.2';
  var DATA_KEY$1 = 'bs.button';
  var EVENT_KEY$1 = "." + DATA_KEY$1;
  var DATA_API_KEY$1 = '.data-api';
  var JQUERY_NO_CONFLICT$1 = $.fn[NAME$1];
  var CLASS_NAME_ACTIVE = 'active';
  var CLASS_NAME_BUTTON = 'btn';
  var CLASS_NAME_FOCUS = 'focus';
  var SELECTOR_DATA_TOGGLE_CARROT = '[data-toggle^="button"]';
  var SELECTOR_DATA_TOGGLES = '[data-toggle="buttons"]';
  var SELECTOR_DATA_TOGGLE = '[data-toggle="button"]';
  var SELECTOR_DATA_TOGGLES_BUTTONS = '[data-toggle="buttons"] .btn';
  var SELECTOR_INPUT = 'input:not([type="hidden"])';
  var SELECTOR_ACTIVE = '.active';
  var SELECTOR_BUTTON = '.btn';
  var EVENT_CLICK_DATA_API$1 = "click" + EVENT_KEY$1 + DATA_API_KEY$1;
  var EVENT_FOCUS_BLUR_DATA_API = "focus" + EVENT_KEY$1 + DATA_API_KEY$1 + " " + ("blur" + EVENT_KEY$1 + DATA_API_KEY$1);
  var EVENT_LOAD_DATA_API = "load" + EVENT_KEY$1 + DATA_API_KEY$1;
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Button = /*#__PURE__*/function () {
    function Button(element) {
      this._element = element;
    } // Getters


    var _proto = Button.prototype;

    // Public
    _proto.toggle = function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var rootElement = $(this._element).closest(SELECTOR_DATA_TOGGLES)[0];

      if (rootElement) {
        var input = this._element.querySelector(SELECTOR_INPUT);

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && this._element.classList.contains(CLASS_NAME_ACTIVE)) {
              triggerChangeEvent = false;
            } else {
              var activeElement = rootElement.querySelector(SELECTOR_ACTIVE);

              if (activeElement) {
                $(activeElement).removeClass(CLASS_NAME_ACTIVE);
              }
            }
          }

          if (triggerChangeEvent) {
            // if it's not a radio button or checkbox don't add a pointless/invalid checked property to the input
            if (input.type === 'checkbox' || input.type === 'radio') {
              input.checked = !this._element.classList.contains(CLASS_NAME_ACTIVE);
            }

            $(input).trigger('change');
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (!(this._element.hasAttribute('disabled') || this._element.classList.contains('disabled'))) {
        if (addAriaPressed) {
          this._element.setAttribute('aria-pressed', !this._element.classList.contains(CLASS_NAME_ACTIVE));
        }

        if (triggerChangeEvent) {
          $(this._element).toggleClass(CLASS_NAME_ACTIVE);
        }
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$1);
      this._element = null;
    } // Static
    ;

    Button._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$1);

        if (!data) {
          data = new Button(this);
          $(this).data(DATA_KEY$1, data);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    };

    _createClass(Button, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$1;
      }
    }]);

    return Button;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(EVENT_CLICK_DATA_API$1, SELECTOR_DATA_TOGGLE_CARROT, function (event) {
    var button = event.target;
    var initialButton = button;

    if (!$(button).hasClass(CLASS_NAME_BUTTON)) {
      button = $(button).closest(SELECTOR_BUTTON)[0];
    }

    if (!button || button.hasAttribute('disabled') || button.classList.contains('disabled')) {
      event.preventDefault(); // work around Firefox bug #1540995
    } else {
      var inputBtn = button.querySelector(SELECTOR_INPUT);

      if (inputBtn && (inputBtn.hasAttribute('disabled') || inputBtn.classList.contains('disabled'))) {
        event.preventDefault(); // work around Firefox bug #1540995

        return;
      }

      if (initialButton.tagName !== 'LABEL' || inputBtn && inputBtn.type !== 'checkbox') {
        Button._jQueryInterface.call($(button), 'toggle');
      }
    }
  }).on(EVENT_FOCUS_BLUR_DATA_API, SELECTOR_DATA_TOGGLE_CARROT, function (event) {
    var button = $(event.target).closest(SELECTOR_BUTTON)[0];
    $(button).toggleClass(CLASS_NAME_FOCUS, /^focus(in)?$/.test(event.type));
  });
  $(window).on(EVENT_LOAD_DATA_API, function () {
    // ensure correct active class is set to match the controls' actual values/states
    // find all checkboxes/readio buttons inside data-toggle groups
    var buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLES_BUTTONS));

    for (var i = 0, len = buttons.length; i < len; i++) {
      var button = buttons[i];
      var input = button.querySelector(SELECTOR_INPUT);

      if (input.checked || input.hasAttribute('checked')) {
        button.classList.add(CLASS_NAME_ACTIVE);
      } else {
        button.classList.remove(CLASS_NAME_ACTIVE);
      }
    } // find all button toggles


    buttons = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE));

    for (var _i = 0, _len = buttons.length; _i < _len; _i++) {
      var _button = buttons[_i];

      if (_button.getAttribute('aria-pressed') === 'true') {
        _button.classList.add(CLASS_NAME_ACTIVE);
      } else {
        _button.classList.remove(CLASS_NAME_ACTIVE);
      }
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$1] = Button._jQueryInterface;
  $.fn[NAME$1].Constructor = Button;

  $.fn[NAME$1].noConflict = function () {
    $.fn[NAME$1] = JQUERY_NO_CONFLICT$1;
    return Button._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$2 = 'carousel';
  var VERSION$2 = '4.5.2';
  var DATA_KEY$2 = 'bs.carousel';
  var EVENT_KEY$2 = "." + DATA_KEY$2;
  var DATA_API_KEY$2 = '.data-api';
  var JQUERY_NO_CONFLICT$2 = $.fn[NAME$2];
  var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key

  var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key

  var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  var SWIPE_THRESHOLD = 40;
  var Default = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  var DefaultType = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  var DIRECTION_NEXT = 'next';
  var DIRECTION_PREV = 'prev';
  var DIRECTION_LEFT = 'left';
  var DIRECTION_RIGHT = 'right';
  var EVENT_SLIDE = "slide" + EVENT_KEY$2;
  var EVENT_SLID = "slid" + EVENT_KEY$2;
  var EVENT_KEYDOWN = "keydown" + EVENT_KEY$2;
  var EVENT_MOUSEENTER = "mouseenter" + EVENT_KEY$2;
  var EVENT_MOUSELEAVE = "mouseleave" + EVENT_KEY$2;
  var EVENT_TOUCHSTART = "touchstart" + EVENT_KEY$2;
  var EVENT_TOUCHMOVE = "touchmove" + EVENT_KEY$2;
  var EVENT_TOUCHEND = "touchend" + EVENT_KEY$2;
  var EVENT_POINTERDOWN = "pointerdown" + EVENT_KEY$2;
  var EVENT_POINTERUP = "pointerup" + EVENT_KEY$2;
  var EVENT_DRAG_START = "dragstart" + EVENT_KEY$2;
  var EVENT_LOAD_DATA_API$1 = "load" + EVENT_KEY$2 + DATA_API_KEY$2;
  var EVENT_CLICK_DATA_API$2 = "click" + EVENT_KEY$2 + DATA_API_KEY$2;
  var CLASS_NAME_CAROUSEL = 'carousel';
  var CLASS_NAME_ACTIVE$1 = 'active';
  var CLASS_NAME_SLIDE = 'slide';
  var CLASS_NAME_RIGHT = 'carousel-item-right';
  var CLASS_NAME_LEFT = 'carousel-item-left';
  var CLASS_NAME_NEXT = 'carousel-item-next';
  var CLASS_NAME_PREV = 'carousel-item-prev';
  var CLASS_NAME_POINTER_EVENT = 'pointer-event';
  var SELECTOR_ACTIVE$1 = '.active';
  var SELECTOR_ACTIVE_ITEM = '.active.carousel-item';
  var SELECTOR_ITEM = '.carousel-item';
  var SELECTOR_ITEM_IMG = '.carousel-item img';
  var SELECTOR_NEXT_PREV = '.carousel-item-next, .carousel-item-prev';
  var SELECTOR_INDICATORS = '.carousel-indicators';
  var SELECTOR_DATA_SLIDE = '[data-slide], [data-slide-to]';
  var SELECTOR_DATA_RIDE = '[data-ride="carousel"]';
  var PointerType = {
    TOUCH: 'touch',
    PEN: 'pen'
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Carousel = /*#__PURE__*/function () {
    function Carousel(element, config) {
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._element = element;
      this._indicatorsElement = this._element.querySelector(SELECTOR_INDICATORS);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent);

      this._addEventListeners();
    } // Getters


    var _proto = Carousel.prototype;

    // Public
    _proto.next = function next() {
      if (!this._isSliding) {
        this._slide(DIRECTION_NEXT);
      }
    };

    _proto.nextWhenVisible = function nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && $(this._element).is(':visible') && $(this._element).css('visibility') !== 'hidden') {
        this.next();
      }
    };

    _proto.prev = function prev() {
      if (!this._isSliding) {
        this._slide(DIRECTION_PREV);
      }
    };

    _proto.pause = function pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (this._element.querySelector(SELECTOR_NEXT_PREV)) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    };

    _proto.cycle = function cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    };

    _proto.to = function to(index) {
      var _this = this;

      this._activeElement = this._element.querySelector(SELECTOR_ACTIVE_ITEM);

      var activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        $(this._element).one(EVENT_SLID, function () {
          return _this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      var direction = index > activeIndex ? DIRECTION_NEXT : DIRECTION_PREV;

      this._slide(direction, this._items[index]);
    };

    _proto.dispose = function dispose() {
      $(this._element).off(EVENT_KEY$2);
      $.removeData(this._element, DATA_KEY$2);
      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default, config);
      Util.typeCheckConfig(NAME$2, config, DefaultType);
      return config;
    };

    _proto._handleSwipe = function _handleSwipe() {
      var absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }

      var direction = absDeltax / this.touchDeltaX;
      this.touchDeltaX = 0; // swipe left

      if (direction > 0) {
        this.prev();
      } // swipe right


      if (direction < 0) {
        this.next();
      }
    };

    _proto._addEventListeners = function _addEventListeners() {
      var _this2 = this;

      if (this._config.keyboard) {
        $(this._element).on(EVENT_KEYDOWN, function (event) {
          return _this2._keydown(event);
        });
      }

      if (this._config.pause === 'hover') {
        $(this._element).on(EVENT_MOUSEENTER, function (event) {
          return _this2.pause(event);
        }).on(EVENT_MOUSELEAVE, function (event) {
          return _this2.cycle(event);
        });
      }

      if (this._config.touch) {
        this._addTouchEventListeners();
      }
    };

    _proto._addTouchEventListeners = function _addTouchEventListeners() {
      var _this3 = this;

      if (!this._touchSupported) {
        return;
      }

      var start = function start(event) {
        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          _this3.touchStartX = event.originalEvent.clientX;
        } else if (!_this3._pointerEvent) {
          _this3.touchStartX = event.originalEvent.touches[0].clientX;
        }
      };

      var move = function move(event) {
        // ensure swiping with one touch and not pinching
        if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {
          _this3.touchDeltaX = 0;
        } else {
          _this3.touchDeltaX = event.originalEvent.touches[0].clientX - _this3.touchStartX;
        }
      };

      var end = function end(event) {
        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          _this3.touchDeltaX = event.originalEvent.clientX - _this3.touchStartX;
        }

        _this3._handleSwipe();

        if (_this3._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          _this3.pause();

          if (_this3.touchTimeout) {
            clearTimeout(_this3.touchTimeout);
          }

          _this3.touchTimeout = setTimeout(function (event) {
            return _this3.cycle(event);
          }, TOUCHEVENT_COMPAT_WAIT + _this3._config.interval);
        }
      };

      $(this._element.querySelectorAll(SELECTOR_ITEM_IMG)).on(EVENT_DRAG_START, function (e) {
        return e.preventDefault();
      });

      if (this._pointerEvent) {
        $(this._element).on(EVENT_POINTERDOWN, function (event) {
          return start(event);
        });
        $(this._element).on(EVENT_POINTERUP, function (event) {
          return end(event);
        });

        this._element.classList.add(CLASS_NAME_POINTER_EVENT);
      } else {
        $(this._element).on(EVENT_TOUCHSTART, function (event) {
          return start(event);
        });
        $(this._element).on(EVENT_TOUCHMOVE, function (event) {
          return move(event);
        });
        $(this._element).on(EVENT_TOUCHEND, function (event) {
          return end(event);
        });
      }
    };

    _proto._keydown = function _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault();
          this.prev();
          break;

        case ARROW_RIGHT_KEYCODE:
          event.preventDefault();
          this.next();
          break;
      }
    };

    _proto._getItemIndex = function _getItemIndex(element) {
      this._items = element && element.parentNode ? [].slice.call(element.parentNode.querySelectorAll(SELECTOR_ITEM)) : [];
      return this._items.indexOf(element);
    };

    _proto._getItemByDirection = function _getItemByDirection(direction, activeElement) {
      var isNextDirection = direction === DIRECTION_NEXT;
      var isPrevDirection = direction === DIRECTION_PREV;

      var activeIndex = this._getItemIndex(activeElement);

      var lastItemIndex = this._items.length - 1;
      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      var delta = direction === DIRECTION_PREV ? -1 : 1;
      var itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    };

    _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
      var targetIndex = this._getItemIndex(relatedTarget);

      var fromIndex = this._getItemIndex(this._element.querySelector(SELECTOR_ACTIVE_ITEM));

      var slideEvent = $.Event(EVENT_SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
      $(this._element).trigger(slideEvent);
      return slideEvent;
    };

    _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        var indicators = [].slice.call(this._indicatorsElement.querySelectorAll(SELECTOR_ACTIVE$1));
        $(indicators).removeClass(CLASS_NAME_ACTIVE$1);

        var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

        if (nextIndicator) {
          $(nextIndicator).addClass(CLASS_NAME_ACTIVE$1);
        }
      }
    };

    _proto._slide = function _slide(direction, element) {
      var _this4 = this;

      var activeElement = this._element.querySelector(SELECTOR_ACTIVE_ITEM);

      var activeElementIndex = this._getItemIndex(activeElement);

      var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

      var nextElementIndex = this._getItemIndex(nextElement);

      var isCycling = Boolean(this._interval);
      var directionalClassName;
      var orderClassName;
      var eventDirectionName;

      if (direction === DIRECTION_NEXT) {
        directionalClassName = CLASS_NAME_LEFT;
        orderClassName = CLASS_NAME_NEXT;
        eventDirectionName = DIRECTION_LEFT;
      } else {
        directionalClassName = CLASS_NAME_RIGHT;
        orderClassName = CLASS_NAME_PREV;
        eventDirectionName = DIRECTION_RIGHT;
      }

      if (nextElement && $(nextElement).hasClass(CLASS_NAME_ACTIVE$1)) {
        this._isSliding = false;
        return;
      }

      var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.isDefaultPrevented()) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      var slidEvent = $.Event(EVENT_SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });

      if ($(this._element).hasClass(CLASS_NAME_SLIDE)) {
        $(nextElement).addClass(orderClassName);
        Util.reflow(nextElement);
        $(activeElement).addClass(directionalClassName);
        $(nextElement).addClass(directionalClassName);
        var nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10);

        if (nextElementInterval) {
          this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
          this._config.interval = nextElementInterval;
        } else {
          this._config.interval = this._config.defaultInterval || this._config.interval;
        }

        var transitionDuration = Util.getTransitionDurationFromElement(activeElement);
        $(activeElement).one(Util.TRANSITION_END, function () {
          $(nextElement).removeClass(directionalClassName + " " + orderClassName).addClass(CLASS_NAME_ACTIVE$1);
          $(activeElement).removeClass(CLASS_NAME_ACTIVE$1 + " " + orderClassName + " " + directionalClassName);
          _this4._isSliding = false;
          setTimeout(function () {
            return $(_this4._element).trigger(slidEvent);
          }, 0);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        $(activeElement).removeClass(CLASS_NAME_ACTIVE$1);
        $(nextElement).addClass(CLASS_NAME_ACTIVE$1);
        this._isSliding = false;
        $(this._element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    } // Static
    ;

    Carousel._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$2);

        var _config = _extends({}, Default, $(this).data());

        if (typeof config === 'object') {
          _config = _extends({}, _config, config);
        }

        var action = typeof config === 'string' ? config : _config.slide;

        if (!data) {
          data = new Carousel(this, _config);
          $(this).data(DATA_KEY$2, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError("No method named \"" + action + "\"");
          }

          data[action]();
        } else if (_config.interval && _config.ride) {
          data.pause();
          data.cycle();
        }
      });
    };

    Carousel._dataApiClickHandler = function _dataApiClickHandler(event) {
      var selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return;
      }

      var target = $(selector)[0];

      if (!target || !$(target).hasClass(CLASS_NAME_CAROUSEL)) {
        return;
      }

      var config = _extends({}, $(target).data(), $(this).data());

      var slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel._jQueryInterface.call($(target), config);

      if (slideIndex) {
        $(target).data(DATA_KEY$2).to(slideIndex);
      }

      event.preventDefault();
    };

    _createClass(Carousel, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$2;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);

    return Carousel;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(EVENT_CLICK_DATA_API$2, SELECTOR_DATA_SLIDE, Carousel._dataApiClickHandler);
  $(window).on(EVENT_LOAD_DATA_API$1, function () {
    var carousels = [].slice.call(document.querySelectorAll(SELECTOR_DATA_RIDE));

    for (var i = 0, len = carousels.length; i < len; i++) {
      var $carousel = $(carousels[i]);

      Carousel._jQueryInterface.call($carousel, $carousel.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$2] = Carousel._jQueryInterface;
  $.fn[NAME$2].Constructor = Carousel;

  $.fn[NAME$2].noConflict = function () {
    $.fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return Carousel._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$3 = 'collapse';
  var VERSION$3 = '4.5.2';
  var DATA_KEY$3 = 'bs.collapse';
  var EVENT_KEY$3 = "." + DATA_KEY$3;
  var DATA_API_KEY$3 = '.data-api';
  var JQUERY_NO_CONFLICT$3 = $.fn[NAME$3];
  var Default$1 = {
    toggle: true,
    parent: ''
  };
  var DefaultType$1 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  var EVENT_SHOW = "show" + EVENT_KEY$3;
  var EVENT_SHOWN = "shown" + EVENT_KEY$3;
  var EVENT_HIDE = "hide" + EVENT_KEY$3;
  var EVENT_HIDDEN = "hidden" + EVENT_KEY$3;
  var EVENT_CLICK_DATA_API$3 = "click" + EVENT_KEY$3 + DATA_API_KEY$3;
  var CLASS_NAME_SHOW$1 = 'show';
  var CLASS_NAME_COLLAPSE = 'collapse';
  var CLASS_NAME_COLLAPSING = 'collapsing';
  var CLASS_NAME_COLLAPSED = 'collapsed';
  var DIMENSION_WIDTH = 'width';
  var DIMENSION_HEIGHT = 'height';
  var SELECTOR_ACTIVES = '.show, .collapsing';
  var SELECTOR_DATA_TOGGLE$1 = '[data-toggle="collapse"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Collapse = /*#__PURE__*/function () {
    function Collapse(element, config) {
      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = [].slice.call(document.querySelectorAll("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," + ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
      var toggleList = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE$1));

      for (var i = 0, len = toggleList.length; i < len; i++) {
        var elem = toggleList[i];
        var selector = Util.getSelectorFromElement(elem);
        var filterElement = [].slice.call(document.querySelectorAll(selector)).filter(function (foundElem) {
          return foundElem === element;
        });

        if (selector !== null && filterElement.length > 0) {
          this._selector = selector;

          this._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    var _proto = Collapse.prototype;

    // Public
    _proto.toggle = function toggle() {
      if ($(this._element).hasClass(CLASS_NAME_SHOW$1)) {
        this.hide();
      } else {
        this.show();
      }
    };

    _proto.show = function show() {
      var _this = this;

      if (this._isTransitioning || $(this._element).hasClass(CLASS_NAME_SHOW$1)) {
        return;
      }

      var actives;
      var activesData;

      if (this._parent) {
        actives = [].slice.call(this._parent.querySelectorAll(SELECTOR_ACTIVES)).filter(function (elem) {
          if (typeof _this._config.parent === 'string') {
            return elem.getAttribute('data-parent') === _this._config.parent;
          }

          return elem.classList.contains(CLASS_NAME_COLLAPSE);
        });

        if (actives.length === 0) {
          actives = null;
        }
      }

      if (actives) {
        activesData = $(actives).not(this._selector).data(DATA_KEY$3);

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      var startEvent = $.Event(EVENT_SHOW);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      if (actives) {
        Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide');

        if (!activesData) {
          $(actives).data(DATA_KEY$3, null);
        }
      }

      var dimension = this._getDimension();

      $(this._element).removeClass(CLASS_NAME_COLLAPSE).addClass(CLASS_NAME_COLLAPSING);
      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        $(this._triggerArray).removeClass(CLASS_NAME_COLLAPSED).attr('aria-expanded', true);
      }

      this.setTransitioning(true);

      var complete = function complete() {
        $(_this._element).removeClass(CLASS_NAME_COLLAPSING).addClass(CLASS_NAME_COLLAPSE + " " + CLASS_NAME_SHOW$1);
        _this._element.style[dimension] = '';

        _this.setTransitioning(false);

        $(_this._element).trigger(EVENT_SHOWN);
      };

      var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      var scrollSize = "scroll" + capitalizedDimension;
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      this._element.style[dimension] = this._element[scrollSize] + "px";
    };

    _proto.hide = function hide() {
      var _this2 = this;

      if (this._isTransitioning || !$(this._element).hasClass(CLASS_NAME_SHOW$1)) {
        return;
      }

      var startEvent = $.Event(EVENT_HIDE);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      var dimension = this._getDimension();

      this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
      Util.reflow(this._element);
      $(this._element).addClass(CLASS_NAME_COLLAPSING).removeClass(CLASS_NAME_COLLAPSE + " " + CLASS_NAME_SHOW$1);
      var triggerArrayLength = this._triggerArray.length;

      if (triggerArrayLength > 0) {
        for (var i = 0; i < triggerArrayLength; i++) {
          var trigger = this._triggerArray[i];
          var selector = Util.getSelectorFromElement(trigger);

          if (selector !== null) {
            var $elem = $([].slice.call(document.querySelectorAll(selector)));

            if (!$elem.hasClass(CLASS_NAME_SHOW$1)) {
              $(trigger).addClass(CLASS_NAME_COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }

      this.setTransitioning(true);

      var complete = function complete() {
        _this2.setTransitioning(false);

        $(_this2._element).removeClass(CLASS_NAME_COLLAPSING).addClass(CLASS_NAME_COLLAPSE).trigger(EVENT_HIDDEN);
      };

      this._element.style[dimension] = '';
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
    };

    _proto.setTransitioning = function setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$3);
      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default$1, config);
      config.toggle = Boolean(config.toggle); // Coerce string values

      Util.typeCheckConfig(NAME$3, config, DefaultType$1);
      return config;
    };

    _proto._getDimension = function _getDimension() {
      var hasWidth = $(this._element).hasClass(DIMENSION_WIDTH);
      return hasWidth ? DIMENSION_WIDTH : DIMENSION_HEIGHT;
    };

    _proto._getParent = function _getParent() {
      var _this3 = this;

      var parent;

      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent; // It's a jQuery object

        if (typeof this._config.parent.jquery !== 'undefined') {
          parent = this._config.parent[0];
        }
      } else {
        parent = document.querySelector(this._config.parent);
      }

      var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this._config.parent + "\"]";
      var children = [].slice.call(parent.querySelectorAll(selector));
      $(children).each(function (i, element) {
        _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
      });
      return parent;
    };

    _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
      var isOpen = $(element).hasClass(CLASS_NAME_SHOW$1);

      if (triggerArray.length) {
        $(triggerArray).toggleClass(CLASS_NAME_COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
      }
    } // Static
    ;

    Collapse._getTargetFromElement = function _getTargetFromElement(element) {
      var selector = Util.getSelectorFromElement(element);
      return selector ? document.querySelector(selector) : null;
    };

    Collapse._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$3);

        var _config = _extends({}, Default$1, $this.data(), typeof config === 'object' && config ? config : {});

        if (!data && _config.toggle && typeof config === 'string' && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        if (!data) {
          data = new Collapse(this, _config);
          $this.data(DATA_KEY$3, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Collapse, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$3;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$1;
      }
    }]);

    return Collapse;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(EVENT_CLICK_DATA_API$3, SELECTOR_DATA_TOGGLE$1, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }

    var $trigger = $(this);
    var selector = Util.getSelectorFromElement(this);
    var selectors = [].slice.call(document.querySelectorAll(selector));
    $(selectors).each(function () {
      var $target = $(this);
      var data = $target.data(DATA_KEY$3);
      var config = data ? 'toggle' : $trigger.data();

      Collapse._jQueryInterface.call($target, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$3] = Collapse._jQueryInterface;
  $.fn[NAME$3].Constructor = Collapse;

  $.fn[NAME$3].noConflict = function () {
    $.fn[NAME$3] = JQUERY_NO_CONFLICT$3;
    return Collapse._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$4 = 'dropdown';
  var VERSION$4 = '4.5.2';
  var DATA_KEY$4 = 'bs.dropdown';
  var EVENT_KEY$4 = "." + DATA_KEY$4;
  var DATA_API_KEY$4 = '.data-api';
  var JQUERY_NO_CONFLICT$4 = $.fn[NAME$4];
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key

  var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key

  var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key

  var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key

  var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)

  var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + "|" + ARROW_DOWN_KEYCODE + "|" + ESCAPE_KEYCODE);
  var EVENT_HIDE$1 = "hide" + EVENT_KEY$4;
  var EVENT_HIDDEN$1 = "hidden" + EVENT_KEY$4;
  var EVENT_SHOW$1 = "show" + EVENT_KEY$4;
  var EVENT_SHOWN$1 = "shown" + EVENT_KEY$4;
  var EVENT_CLICK = "click" + EVENT_KEY$4;
  var EVENT_CLICK_DATA_API$4 = "click" + EVENT_KEY$4 + DATA_API_KEY$4;
  var EVENT_KEYDOWN_DATA_API = "keydown" + EVENT_KEY$4 + DATA_API_KEY$4;
  var EVENT_KEYUP_DATA_API = "keyup" + EVENT_KEY$4 + DATA_API_KEY$4;
  var CLASS_NAME_DISABLED = 'disabled';
  var CLASS_NAME_SHOW$2 = 'show';
  var CLASS_NAME_DROPUP = 'dropup';
  var CLASS_NAME_DROPRIGHT = 'dropright';
  var CLASS_NAME_DROPLEFT = 'dropleft';
  var CLASS_NAME_MENURIGHT = 'dropdown-menu-right';
  var CLASS_NAME_POSITION_STATIC = 'position-static';
  var SELECTOR_DATA_TOGGLE$2 = '[data-toggle="dropdown"]';
  var SELECTOR_FORM_CHILD = '.dropdown form';
  var SELECTOR_MENU = '.dropdown-menu';
  var SELECTOR_NAVBAR_NAV = '.navbar-nav';
  var SELECTOR_VISIBLE_ITEMS = '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)';
  var PLACEMENT_TOP = 'top-start';
  var PLACEMENT_TOPEND = 'top-end';
  var PLACEMENT_BOTTOM = 'bottom-start';
  var PLACEMENT_BOTTOMEND = 'bottom-end';
  var PLACEMENT_RIGHT = 'right-start';
  var PLACEMENT_LEFT = 'left-start';
  var Default$2 = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic',
    popperConfig: null
  };
  var DefaultType$2 = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string',
    popperConfig: '(null|object)'
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Dropdown = /*#__PURE__*/function () {
    function Dropdown(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    } // Getters


    var _proto = Dropdown.prototype;

    // Public
    _proto.toggle = function toggle() {
      if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED)) {
        return;
      }

      var isActive = $(this._menu).hasClass(CLASS_NAME_SHOW$2);

      Dropdown._clearMenus();

      if (isActive) {
        return;
      }

      this.show(true);
    };

    _proto.show = function show(usePopper) {
      if (usePopper === void 0) {
        usePopper = false;
      }

      if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED) || $(this._menu).hasClass(CLASS_NAME_SHOW$2)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $.Event(EVENT_SHOW$1, relatedTarget);

      var parent = Dropdown._getParentFromElement(this._element);

      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      } // Disable totally Popper.js for Dropdown in Navbar


      if (!this._inNavbar && usePopper) {
        /**
         * Check for Popper dependency
         * Popper - https://popper.js.org
         */
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper.js (https://popper.js.org/)');
        }

        var referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (Util.isElement(this._config.reference)) {
          referenceElement = this._config.reference; // Check if it's jQuery element

          if (typeof this._config.reference.jquery !== 'undefined') {
            referenceElement = this._config.reference[0];
          }
        } // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251


        if (this._config.boundary !== 'scrollParent') {
          $(parent).addClass(CLASS_NAME_POSITION_STATIC);
        }

        this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig());
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && $(parent).closest(SELECTOR_NAVBAR_NAV).length === 0) {
        $(document.body).children().on('mouseover', null, $.noop);
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      $(this._menu).toggleClass(CLASS_NAME_SHOW$2);
      $(parent).toggleClass(CLASS_NAME_SHOW$2).trigger($.Event(EVENT_SHOWN$1, relatedTarget));
    };

    _proto.hide = function hide() {
      if (this._element.disabled || $(this._element).hasClass(CLASS_NAME_DISABLED) || !$(this._menu).hasClass(CLASS_NAME_SHOW$2)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var hideEvent = $.Event(EVENT_HIDE$1, relatedTarget);

      var parent = Dropdown._getParentFromElement(this._element);

      $(parent).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      if (this._popper) {
        this._popper.destroy();
      }

      $(this._menu).toggleClass(CLASS_NAME_SHOW$2);
      $(parent).toggleClass(CLASS_NAME_SHOW$2).trigger($.Event(EVENT_HIDDEN$1, relatedTarget));
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$4);
      $(this._element).off(EVENT_KEY$4);
      this._element = null;
      this._menu = null;

      if (this._popper !== null) {
        this._popper.destroy();

        this._popper = null;
      }
    };

    _proto.update = function update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    } // Private
    ;

    _proto._addEventListeners = function _addEventListeners() {
      var _this = this;

      $(this._element).on(EVENT_CLICK, function (event) {
        event.preventDefault();
        event.stopPropagation();

        _this.toggle();
      });
    };

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, this.constructor.Default, $(this._element).data(), config);
      Util.typeCheckConfig(NAME$4, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getMenuElement = function _getMenuElement() {
      if (!this._menu) {
        var parent = Dropdown._getParentFromElement(this._element);

        if (parent) {
          this._menu = parent.querySelector(SELECTOR_MENU);
        }
      }

      return this._menu;
    };

    _proto._getPlacement = function _getPlacement() {
      var $parentDropdown = $(this._element.parentNode);
      var placement = PLACEMENT_BOTTOM; // Handle dropup

      if ($parentDropdown.hasClass(CLASS_NAME_DROPUP)) {
        placement = $(this._menu).hasClass(CLASS_NAME_MENURIGHT) ? PLACEMENT_TOPEND : PLACEMENT_TOP;
      } else if ($parentDropdown.hasClass(CLASS_NAME_DROPRIGHT)) {
        placement = PLACEMENT_RIGHT;
      } else if ($parentDropdown.hasClass(CLASS_NAME_DROPLEFT)) {
        placement = PLACEMENT_LEFT;
      } else if ($(this._menu).hasClass(CLASS_NAME_MENURIGHT)) {
        placement = PLACEMENT_BOTTOMEND;
      }

      return placement;
    };

    _proto._detectNavbar = function _detectNavbar() {
      return $(this._element).closest('.navbar').length > 0;
    };

    _proto._getOffset = function _getOffset() {
      var _this2 = this;

      var offset = {};

      if (typeof this._config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = _extends({}, data.offsets, _this2._config.offset(data.offsets, _this2._element) || {});
          return data;
        };
      } else {
        offset.offset = this._config.offset;
      }

      return offset;
    };

    _proto._getPopperConfig = function _getPopperConfig() {
      var popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: this._getOffset(),
          flip: {
            enabled: this._config.flip
          },
          preventOverflow: {
            boundariesElement: this._config.boundary
          }
        }
      }; // Disable Popper.js if we have a static display

      if (this._config.display === 'static') {
        popperConfig.modifiers.applyStyle = {
          enabled: false
        };
      }

      return _extends({}, popperConfig, this._config.popperConfig);
    } // Static
    ;

    Dropdown._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$4);

        var _config = typeof config === 'object' ? config : null;

        if (!data) {
          data = new Dropdown(this, _config);
          $(this).data(DATA_KEY$4, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    Dropdown._clearMenus = function _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var toggles = [].slice.call(document.querySelectorAll(SELECTOR_DATA_TOGGLE$2));

      for (var i = 0, len = toggles.length; i < len; i++) {
        var parent = Dropdown._getParentFromElement(toggles[i]);

        var context = $(toggles[i]).data(DATA_KEY$4);
        var relatedTarget = {
          relatedTarget: toggles[i]
        };

        if (event && event.type === 'click') {
          relatedTarget.clickEvent = event;
        }

        if (!context) {
          continue;
        }

        var dropdownMenu = context._menu;

        if (!$(parent).hasClass(CLASS_NAME_SHOW$2)) {
          continue;
        }

        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $.contains(parent, event.target)) {
          continue;
        }

        var hideEvent = $.Event(EVENT_HIDE$1, relatedTarget);
        $(parent).trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
          continue;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support


        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().off('mouseover', null, $.noop);
        }

        toggles[i].setAttribute('aria-expanded', 'false');

        if (context._popper) {
          context._popper.destroy();
        }

        $(dropdownMenu).removeClass(CLASS_NAME_SHOW$2);
        $(parent).removeClass(CLASS_NAME_SHOW$2).trigger($.Event(EVENT_HIDDEN$1, relatedTarget));
      }
    };

    Dropdown._getParentFromElement = function _getParentFromElement(element) {
      var parent;
      var selector = Util.getSelectorFromElement(element);

      if (selector) {
        parent = document.querySelector(selector);
      }

      return parent || element.parentNode;
    } // eslint-disable-next-line complexity
    ;

    Dropdown._dataApiKeydownHandler = function _dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || $(event.target).closest(SELECTOR_MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
        return;
      }

      if (this.disabled || $(this).hasClass(CLASS_NAME_DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this);

      var isActive = $(parent).hasClass(CLASS_NAME_SHOW$2);

      if (!isActive && event.which === ESCAPE_KEYCODE) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (!isActive || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
        if (event.which === ESCAPE_KEYCODE) {
          $(parent.querySelector(SELECTOR_DATA_TOGGLE$2)).trigger('focus');
        }

        $(this).trigger('click');
        return;
      }

      var items = [].slice.call(parent.querySelectorAll(SELECTOR_VISIBLE_ITEMS)).filter(function (item) {
        return $(item).is(':visible');
      });

      if (items.length === 0) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // Up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // Down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    };

    _createClass(Dropdown, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$4;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$2;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$2;
      }
    }]);

    return Dropdown;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(EVENT_KEYDOWN_DATA_API, SELECTOR_DATA_TOGGLE$2, Dropdown._dataApiKeydownHandler).on(EVENT_KEYDOWN_DATA_API, SELECTOR_MENU, Dropdown._dataApiKeydownHandler).on(EVENT_CLICK_DATA_API$4 + " " + EVENT_KEYUP_DATA_API, Dropdown._clearMenus).on(EVENT_CLICK_DATA_API$4, SELECTOR_DATA_TOGGLE$2, function (event) {
    event.preventDefault();
    event.stopPropagation();

    Dropdown._jQueryInterface.call($(this), 'toggle');
  }).on(EVENT_CLICK_DATA_API$4, SELECTOR_FORM_CHILD, function (e) {
    e.stopPropagation();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$4] = Dropdown._jQueryInterface;
  $.fn[NAME$4].Constructor = Dropdown;

  $.fn[NAME$4].noConflict = function () {
    $.fn[NAME$4] = JQUERY_NO_CONFLICT$4;
    return Dropdown._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$5 = 'modal';
  var VERSION$5 = '4.5.2';
  var DATA_KEY$5 = 'bs.modal';
  var EVENT_KEY$5 = "." + DATA_KEY$5;
  var DATA_API_KEY$5 = '.data-api';
  var JQUERY_NO_CONFLICT$5 = $.fn[NAME$5];
  var ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key

  var Default$3 = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true
  };
  var DefaultType$3 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean'
  };
  var EVENT_HIDE$2 = "hide" + EVENT_KEY$5;
  var EVENT_HIDE_PREVENTED = "hidePrevented" + EVENT_KEY$5;
  var EVENT_HIDDEN$2 = "hidden" + EVENT_KEY$5;
  var EVENT_SHOW$2 = "show" + EVENT_KEY$5;
  var EVENT_SHOWN$2 = "shown" + EVENT_KEY$5;
  var EVENT_FOCUSIN = "focusin" + EVENT_KEY$5;
  var EVENT_RESIZE = "resize" + EVENT_KEY$5;
  var EVENT_CLICK_DISMISS = "click.dismiss" + EVENT_KEY$5;
  var EVENT_KEYDOWN_DISMISS = "keydown.dismiss" + EVENT_KEY$5;
  var EVENT_MOUSEUP_DISMISS = "mouseup.dismiss" + EVENT_KEY$5;
  var EVENT_MOUSEDOWN_DISMISS = "mousedown.dismiss" + EVENT_KEY$5;
  var EVENT_CLICK_DATA_API$5 = "click" + EVENT_KEY$5 + DATA_API_KEY$5;
  var CLASS_NAME_SCROLLABLE = 'modal-dialog-scrollable';
  var CLASS_NAME_SCROLLBAR_MEASURER = 'modal-scrollbar-measure';
  var CLASS_NAME_BACKDROP = 'modal-backdrop';
  var CLASS_NAME_OPEN = 'modal-open';
  var CLASS_NAME_FADE$1 = 'fade';
  var CLASS_NAME_SHOW$3 = 'show';
  var CLASS_NAME_STATIC = 'modal-static';
  var SELECTOR_DIALOG = '.modal-dialog';
  var SELECTOR_MODAL_BODY = '.modal-body';
  var SELECTOR_DATA_TOGGLE$3 = '[data-toggle="modal"]';
  var SELECTOR_DATA_DISMISS = '[data-dismiss="modal"]';
  var SELECTOR_FIXED_CONTENT = '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top';
  var SELECTOR_STICKY_CONTENT = '.sticky-top';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Modal = /*#__PURE__*/function () {
    function Modal(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._dialog = element.querySelector(SELECTOR_DIALOG);
      this._backdrop = null;
      this._isShown = false;
      this._isBodyOverflowing = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
      this._scrollbarWidth = 0;
    } // Getters


    var _proto = Modal.prototype;

    // Public
    _proto.toggle = function toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    };

    _proto.show = function show(relatedTarget) {
      var _this = this;

      if (this._isShown || this._isTransitioning) {
        return;
      }

      if ($(this._element).hasClass(CLASS_NAME_FADE$1)) {
        this._isTransitioning = true;
      }

      var showEvent = $.Event(EVENT_SHOW$2, {
        relatedTarget: relatedTarget
      });
      $(this._element).trigger(showEvent);

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = true;

      this._checkScrollbar();

      this._setScrollbar();

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      $(this._element).on(EVENT_CLICK_DISMISS, SELECTOR_DATA_DISMISS, function (event) {
        return _this.hide(event);
      });
      $(this._dialog).on(EVENT_MOUSEDOWN_DISMISS, function () {
        $(_this._element).one(EVENT_MOUSEUP_DISMISS, function (event) {
          if ($(event.target).is(_this._element)) {
            _this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(function () {
        return _this._showElement(relatedTarget);
      });
    };

    _proto.hide = function hide(event) {
      var _this2 = this;

      if (event) {
        event.preventDefault();
      }

      if (!this._isShown || this._isTransitioning) {
        return;
      }

      var hideEvent = $.Event(EVENT_HIDE$2);
      $(this._element).trigger(hideEvent);

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = false;
      var transition = $(this._element).hasClass(CLASS_NAME_FADE$1);

      if (transition) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      $(document).off(EVENT_FOCUSIN);
      $(this._element).removeClass(CLASS_NAME_SHOW$3);
      $(this._element).off(EVENT_CLICK_DISMISS);
      $(this._dialog).off(EVENT_MOUSEDOWN_DISMISS);

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, function (event) {
          return _this2._hideModal(event);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        this._hideModal();
      }
    };

    _proto.dispose = function dispose() {
      [window, this._element, this._dialog].forEach(function (htmlElement) {
        return $(htmlElement).off(EVENT_KEY$5);
      });
      /**
       * `document` has 2 events `EVENT_FOCUSIN` and `EVENT_CLICK_DATA_API`
       * Do not move `document` in `htmlElements` array
       * It will remove `EVENT_CLICK_DATA_API` event that should remain
       */

      $(document).off(EVENT_FOCUSIN);
      $.removeData(this._element, DATA_KEY$5);
      this._config = null;
      this._element = null;
      this._dialog = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._isTransitioning = null;
      this._scrollbarWidth = null;
    };

    _proto.handleUpdate = function handleUpdate() {
      this._adjustDialog();
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default$3, config);
      Util.typeCheckConfig(NAME$5, config, DefaultType$3);
      return config;
    };

    _proto._triggerBackdropTransition = function _triggerBackdropTransition() {
      var _this3 = this;

      if (this._config.backdrop === 'static') {
        var hideEventPrevented = $.Event(EVENT_HIDE_PREVENTED);
        $(this._element).trigger(hideEventPrevented);

        if (hideEventPrevented.defaultPrevented) {
          return;
        }

        var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

        if (!isModalOverflowing) {
          this._element.style.overflowY = 'hidden';
        }

        this._element.classList.add(CLASS_NAME_STATIC);

        var modalTransitionDuration = Util.getTransitionDurationFromElement(this._dialog);
        $(this._element).off(Util.TRANSITION_END);
        $(this._element).one(Util.TRANSITION_END, function () {
          _this3._element.classList.remove(CLASS_NAME_STATIC);

          if (!isModalOverflowing) {
            $(_this3._element).one(Util.TRANSITION_END, function () {
              _this3._element.style.overflowY = '';
            }).emulateTransitionEnd(_this3._element, modalTransitionDuration);
          }
        }).emulateTransitionEnd(modalTransitionDuration);

        this._element.focus();
      } else {
        this.hide();
      }
    };

    _proto._showElement = function _showElement(relatedTarget) {
      var _this4 = this;

      var transition = $(this._element).hasClass(CLASS_NAME_FADE$1);
      var modalBody = this._dialog ? this._dialog.querySelector(SELECTOR_MODAL_BODY) : null;

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      this._element.setAttribute('role', 'dialog');

      if ($(this._dialog).hasClass(CLASS_NAME_SCROLLABLE) && modalBody) {
        modalBody.scrollTop = 0;
      } else {
        this._element.scrollTop = 0;
      }

      if (transition) {
        Util.reflow(this._element);
      }

      $(this._element).addClass(CLASS_NAME_SHOW$3);

      if (this._config.focus) {
        this._enforceFocus();
      }

      var shownEvent = $.Event(EVENT_SHOWN$2, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (_this4._config.focus) {
          _this4._element.focus();
        }

        _this4._isTransitioning = false;
        $(_this4._element).trigger(shownEvent);
      };

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._dialog);
        $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);
      } else {
        transitionComplete();
      }
    };

    _proto._enforceFocus = function _enforceFocus() {
      var _this5 = this;

      $(document).off(EVENT_FOCUSIN) // Guard against infinite focus loop
      .on(EVENT_FOCUSIN, function (event) {
        if (document !== event.target && _this5._element !== event.target && $(_this5._element).has(event.target).length === 0) {
          _this5._element.focus();
        }
      });
    };

    _proto._setEscapeEvent = function _setEscapeEvent() {
      var _this6 = this;

      if (this._isShown) {
        $(this._element).on(EVENT_KEYDOWN_DISMISS, function (event) {
          if (_this6._config.keyboard && event.which === ESCAPE_KEYCODE$1) {
            event.preventDefault();

            _this6.hide();
          } else if (!_this6._config.keyboard && event.which === ESCAPE_KEYCODE$1) {
            _this6._triggerBackdropTransition();
          }
        });
      } else if (!this._isShown) {
        $(this._element).off(EVENT_KEYDOWN_DISMISS);
      }
    };

    _proto._setResizeEvent = function _setResizeEvent() {
      var _this7 = this;

      if (this._isShown) {
        $(window).on(EVENT_RESIZE, function (event) {
          return _this7.handleUpdate(event);
        });
      } else {
        $(window).off(EVENT_RESIZE);
      }
    };

    _proto._hideModal = function _hideModal() {
      var _this8 = this;

      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._element.removeAttribute('role');

      this._isTransitioning = false;

      this._showBackdrop(function () {
        $(document.body).removeClass(CLASS_NAME_OPEN);

        _this8._resetAdjustments();

        _this8._resetScrollbar();

        $(_this8._element).trigger(EVENT_HIDDEN$2);
      });
    };

    _proto._removeBackdrop = function _removeBackdrop() {
      if (this._backdrop) {
        $(this._backdrop).remove();
        this._backdrop = null;
      }
    };

    _proto._showBackdrop = function _showBackdrop(callback) {
      var _this9 = this;

      var animate = $(this._element).hasClass(CLASS_NAME_FADE$1) ? CLASS_NAME_FADE$1 : '';

      if (this._isShown && this._config.backdrop) {
        this._backdrop = document.createElement('div');
        this._backdrop.className = CLASS_NAME_BACKDROP;

        if (animate) {
          this._backdrop.classList.add(animate);
        }

        $(this._backdrop).appendTo(document.body);
        $(this._element).on(EVENT_CLICK_DISMISS, function (event) {
          if (_this9._ignoreBackdropClick) {
            _this9._ignoreBackdropClick = false;
            return;
          }

          if (event.target !== event.currentTarget) {
            return;
          }

          _this9._triggerBackdropTransition();
        });

        if (animate) {
          Util.reflow(this._backdrop);
        }

        $(this._backdrop).addClass(CLASS_NAME_SHOW$3);

        if (!callback) {
          return;
        }

        if (!animate) {
          callback();
          return;
        }

        var backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
        $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);
      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(CLASS_NAME_SHOW$3);

        var callbackRemove = function callbackRemove() {
          _this9._removeBackdrop();

          if (callback) {
            callback();
          }
        };

        if ($(this._element).hasClass(CLASS_NAME_FADE$1)) {
          var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

          $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(_backdropTransitionDuration);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    } // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------
    ;

    _proto._adjustDialog = function _adjustDialog() {
      var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = this._scrollbarWidth + "px";
      }

      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = this._scrollbarWidth + "px";
      }
    };

    _proto._resetAdjustments = function _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    };

    _proto._checkScrollbar = function _checkScrollbar() {
      var rect = document.body.getBoundingClientRect();
      this._isBodyOverflowing = Math.round(rect.left + rect.right) < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    };

    _proto._setScrollbar = function _setScrollbar() {
      var _this10 = this;

      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        var fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT));
        var stickyContent = [].slice.call(document.querySelectorAll(SELECTOR_STICKY_CONTENT)); // Adjust fixed content padding

        $(fixedContent).each(function (index, element) {
          var actualPadding = element.style.paddingRight;
          var calculatedPadding = $(element).css('padding-right');
          $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this10._scrollbarWidth + "px");
        }); // Adjust sticky content margin

        $(stickyContent).each(function (index, element) {
          var actualMargin = element.style.marginRight;
          var calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this10._scrollbarWidth + "px");
        }); // Adjust body padding

        var actualPadding = document.body.style.paddingRight;
        var calculatedPadding = $(document.body).css('padding-right');
        $(document.body).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
      }

      $(document.body).addClass(CLASS_NAME_OPEN);
    };

    _proto._resetScrollbar = function _resetScrollbar() {
      // Restore fixed content padding
      var fixedContent = [].slice.call(document.querySelectorAll(SELECTOR_FIXED_CONTENT));
      $(fixedContent).each(function (index, element) {
        var padding = $(element).data('padding-right');
        $(element).removeData('padding-right');
        element.style.paddingRight = padding ? padding : '';
      }); // Restore sticky content

      var elements = [].slice.call(document.querySelectorAll("" + SELECTOR_STICKY_CONTENT));
      $(elements).each(function (index, element) {
        var margin = $(element).data('margin-right');

        if (typeof margin !== 'undefined') {
          $(element).css('margin-right', margin).removeData('margin-right');
        }
      }); // Restore body padding

      var padding = $(document.body).data('padding-right');
      $(document.body).removeData('padding-right');
      document.body.style.paddingRight = padding ? padding : '';
    };

    _proto._getScrollbarWidth = function _getScrollbarWidth() {
      // thx d.walsh
      var scrollDiv = document.createElement('div');
      scrollDiv.className = CLASS_NAME_SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    } // Static
    ;

    Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$5);

        var _config = _extends({}, Default$3, $(this).data(), typeof config === 'object' && config ? config : {});

        if (!data) {
          data = new Modal(this, _config);
          $(this).data(DATA_KEY$5, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    };

    _createClass(Modal, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$5;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$3;
      }
    }]);

    return Modal;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(EVENT_CLICK_DATA_API$5, SELECTOR_DATA_TOGGLE$3, function (event) {
    var _this11 = this;

    var target;
    var selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = document.querySelector(selector);
    }

    var config = $(target).data(DATA_KEY$5) ? 'toggle' : _extends({}, $(target).data(), $(this).data());

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    var $target = $(target).one(EVENT_SHOW$2, function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if modal will actually get shown
        return;
      }

      $target.one(EVENT_HIDDEN$2, function () {
        if ($(_this11).is(':visible')) {
          _this11.focus();
        }
      });
    });

    Modal._jQueryInterface.call($(target), config, this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$5] = Modal._jQueryInterface;
  $.fn[NAME$5].Constructor = Modal;

  $.fn[NAME$5].noConflict = function () {
    $.fn[NAME$5] = JQUERY_NO_CONFLICT$5;
    return Modal._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.5.2): tools/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/main/LICENSE)
   * --------------------------------------------------------------------------
   */
  var uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];
  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'srcset', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
  };
  /**
   * A pattern that recognizes a commonly useful subset of URLs that are safe.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^#&/:?]*(?:[#/?]|$))/gi;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[\d+/a-z]+=*$/i;

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.indexOf(attrName) !== -1) {
      if (uriAttrs.indexOf(attrName) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
      }

      return true;
    }

    var regExp = allowedAttributeList.filter(function (attrRegex) {
      return attrRegex instanceof RegExp;
    }); // Check if a regular expression validates the attribute.

    for (var i = 0, len = regExp.length; i < len; i++) {
      if (attrName.match(regExp[i])) {
        return true;
      }
    }

    return false;
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    var domParser = new window.DOMParser();
    var createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    var whitelistKeys = Object.keys(whiteList);
    var elements = [].slice.call(createdDocument.body.querySelectorAll('*'));

    var _loop = function _loop(i, len) {
      var el = elements[i];
      var elName = el.nodeName.toLowerCase();

      if (whitelistKeys.indexOf(el.nodeName.toLowerCase()) === -1) {
        el.parentNode.removeChild(el);
        return "continue";
      }

      var attributeList = [].slice.call(el.attributes);
      var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);
      attributeList.forEach(function (attr) {
        if (!allowedAttribute(attr, whitelistedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    };

    for (var i = 0, len = elements.length; i < len; i++) {
      var _ret = _loop(i);

      if (_ret === "continue") continue;
    }

    return createdDocument.body.innerHTML;
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$6 = 'tooltip';
  var VERSION$6 = '4.5.2';
  var DATA_KEY$6 = 'bs.tooltip';
  var EVENT_KEY$6 = "." + DATA_KEY$6;
  var JQUERY_NO_CONFLICT$6 = $.fn[NAME$6];
  var CLASS_PREFIX = 'bs-tooltip';
  var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];
  var DefaultType$4 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(number|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacement: '(string|array)',
    boundary: '(string|element)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    whiteList: 'object',
    popperConfig: '(null|object)'
  };
  var AttachmentMap = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
  };
  var Default$4 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: 0,
    container: false,
    fallbackPlacement: 'flip',
    boundary: 'scrollParent',
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist,
    popperConfig: null
  };
  var HOVER_STATE_SHOW = 'show';
  var HOVER_STATE_OUT = 'out';
  var Event = {
    HIDE: "hide" + EVENT_KEY$6,
    HIDDEN: "hidden" + EVENT_KEY$6,
    SHOW: "show" + EVENT_KEY$6,
    SHOWN: "shown" + EVENT_KEY$6,
    INSERTED: "inserted" + EVENT_KEY$6,
    CLICK: "click" + EVENT_KEY$6,
    FOCUSIN: "focusin" + EVENT_KEY$6,
    FOCUSOUT: "focusout" + EVENT_KEY$6,
    MOUSEENTER: "mouseenter" + EVENT_KEY$6,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$6
  };
  var CLASS_NAME_FADE$2 = 'fade';
  var CLASS_NAME_SHOW$4 = 'show';
  var SELECTOR_TOOLTIP_INNER = '.tooltip-inner';
  var SELECTOR_ARROW = '.arrow';
  var TRIGGER_HOVER = 'hover';
  var TRIGGER_FOCUS = 'focus';
  var TRIGGER_CLICK = 'click';
  var TRIGGER_MANUAL = 'manual';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Tooltip = /*#__PURE__*/function () {
    function Tooltip(element, config) {
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper.js (https://popper.js.org/)');
      } // private


      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    var _proto = Tooltip.prototype;

    // Public
    _proto.enable = function enable() {
      this._isEnabled = true;
    };

    _proto.disable = function disable() {
      this._isEnabled = false;
    };

    _proto.toggleEnabled = function toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    };

    _proto.toggle = function toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        var dataKey = this.constructor.DATA_KEY;
        var context = $(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $(event.currentTarget).data(dataKey, context);
        }

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if ($(this.getTipElement()).hasClass(CLASS_NAME_SHOW$4)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      $.removeData(this.element, this.constructor.DATA_KEY);
      $(this.element).off(this.constructor.EVENT_KEY);
      $(this.element).closest('.modal').off('hide.bs.modal', this._hideModalHandler);

      if (this.tip) {
        $(this.tip).remove();
      }

      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;

      if (this._popper) {
        this._popper.destroy();
      }

      this._popper = null;
      this.element = null;
      this.config = null;
      this.tip = null;
    };

    _proto.show = function show() {
      var _this = this;

      if ($(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements');
      }

      var showEvent = $.Event(this.constructor.Event.SHOW);

      if (this.isWithContent() && this._isEnabled) {
        $(this.element).trigger(showEvent);
        var shadowRoot = Util.findShadowRoot(this.element);
        var isInTheDom = $.contains(shadowRoot !== null ? shadowRoot : this.element.ownerDocument.documentElement, this.element);

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return;
        }

        var tip = this.getTipElement();
        var tipId = Util.getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);
        this.setContent();

        if (this.config.animation) {
          $(tip).addClass(CLASS_NAME_FADE$2);
        }

        var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

        var attachment = this._getAttachment(placement);

        this.addAttachmentClass(attachment);

        var container = this._getContainer();

        $(tip).data(this.constructor.DATA_KEY, this);

        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $(tip).appendTo(container);
        }

        $(this.element).trigger(this.constructor.Event.INSERTED);
        this._popper = new Popper(this.element, tip, this._getPopperConfig(attachment));
        $(tip).addClass(CLASS_NAME_SHOW$4); // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().on('mouseover', null, $.noop);
        }

        var complete = function complete() {
          if (_this.config.animation) {
            _this._fixTransition();
          }

          var prevHoverState = _this._hoverState;
          _this._hoverState = null;
          $(_this.element).trigger(_this.constructor.Event.SHOWN);

          if (prevHoverState === HOVER_STATE_OUT) {
            _this._leave(null, _this);
          }
        };

        if ($(this.tip).hasClass(CLASS_NAME_FADE$2)) {
          var transitionDuration = Util.getTransitionDurationFromElement(this.tip);
          $(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }
      }
    };

    _proto.hide = function hide(callback) {
      var _this2 = this;

      var tip = this.getTipElement();
      var hideEvent = $.Event(this.constructor.Event.HIDE);

      var complete = function complete() {
        if (_this2._hoverState !== HOVER_STATE_SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        _this2._cleanTipClass();

        _this2.element.removeAttribute('aria-describedby');

        $(_this2.element).trigger(_this2.constructor.Event.HIDDEN);

        if (_this2._popper !== null) {
          _this2._popper.destroy();
        }

        if (callback) {
          callback();
        }
      };

      $(this.element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(tip).removeClass(CLASS_NAME_SHOW$4); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().off('mouseover', null, $.noop);
      }

      this._activeTrigger[TRIGGER_CLICK] = false;
      this._activeTrigger[TRIGGER_FOCUS] = false;
      this._activeTrigger[TRIGGER_HOVER] = false;

      if ($(this.tip).hasClass(CLASS_NAME_FADE$2)) {
        var transitionDuration = Util.getTransitionDurationFromElement(tip);
        $(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }

      this._hoverState = '';
    };

    _proto.update = function update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    } // Protected
    ;

    _proto.isWithContent = function isWithContent() {
      return Boolean(this.getTitle());
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var tip = this.getTipElement();
      this.setElementContent($(tip.querySelectorAll(SELECTOR_TOOLTIP_INNER)), this.getTitle());
      $(tip).removeClass(CLASS_NAME_FADE$2 + " " + CLASS_NAME_SHOW$4);
    };

    _proto.setElementContent = function setElementContent($element, content) {
      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // Content is a DOM node or a jQuery
        if (this.config.html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($(content).text());
        }

        return;
      }

      if (this.config.html) {
        if (this.config.sanitize) {
          content = sanitizeHtml(content, this.config.whiteList, this.config.sanitizeFn);
        }

        $element.html(content);
      } else {
        $element.text(content);
      }
    };

    _proto.getTitle = function getTitle() {
      var title = this.element.getAttribute('data-original-title');

      if (!title) {
        title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
      }

      return title;
    } // Private
    ;

    _proto._getPopperConfig = function _getPopperConfig(attachment) {
      var _this3 = this;

      var defaultBsConfig = {
        placement: attachment,
        modifiers: {
          offset: this._getOffset(),
          flip: {
            behavior: this.config.fallbackPlacement
          },
          arrow: {
            element: SELECTOR_ARROW
          },
          preventOverflow: {
            boundariesElement: this.config.boundary
          }
        },
        onCreate: function onCreate(data) {
          if (data.originalPlacement !== data.placement) {
            _this3._handlePopperPlacementChange(data);
          }
        },
        onUpdate: function onUpdate(data) {
          return _this3._handlePopperPlacementChange(data);
        }
      };
      return _extends({}, defaultBsConfig, this.config.popperConfig);
    };

    _proto._getOffset = function _getOffset() {
      var _this4 = this;

      var offset = {};

      if (typeof this.config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = _extends({}, data.offsets, _this4.config.offset(data.offsets, _this4.element) || {});
          return data;
        };
      } else {
        offset.offset = this.config.offset;
      }

      return offset;
    };

    _proto._getContainer = function _getContainer() {
      if (this.config.container === false) {
        return document.body;
      }

      if (Util.isElement(this.config.container)) {
        return $(this.config.container);
      }

      return $(document).find(this.config.container);
    };

    _proto._getAttachment = function _getAttachment(placement) {
      return AttachmentMap[placement.toUpperCase()];
    };

    _proto._setListeners = function _setListeners() {
      var _this5 = this;

      var triggers = this.config.trigger.split(' ');
      triggers.forEach(function (trigger) {
        if (trigger === 'click') {
          $(_this5.element).on(_this5.constructor.Event.CLICK, _this5.config.selector, function (event) {
            return _this5.toggle(event);
          });
        } else if (trigger !== TRIGGER_MANUAL) {
          var eventIn = trigger === TRIGGER_HOVER ? _this5.constructor.Event.MOUSEENTER : _this5.constructor.Event.FOCUSIN;
          var eventOut = trigger === TRIGGER_HOVER ? _this5.constructor.Event.MOUSELEAVE : _this5.constructor.Event.FOCUSOUT;
          $(_this5.element).on(eventIn, _this5.config.selector, function (event) {
            return _this5._enter(event);
          }).on(eventOut, _this5.config.selector, function (event) {
            return _this5._leave(event);
          });
        }
      });

      this._hideModalHandler = function () {
        if (_this5.element) {
          _this5.hide();
        }
      };

      $(this.element).closest('.modal').on('hide.bs.modal', this._hideModalHandler);

      if (this.config.selector) {
        this.config = _extends({}, this.config, {
          trigger: 'manual',
          selector: ''
        });
      } else {
        this._fixTitle();
      }
    };

    _proto._fixTitle = function _fixTitle() {
      var titleType = typeof this.element.getAttribute('data-original-title');

      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    };

    _proto._enter = function _enter(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? TRIGGER_FOCUS : TRIGGER_HOVER] = true;
      }

      if ($(context.getTipElement()).hasClass(CLASS_NAME_SHOW$4) || context._hoverState === HOVER_STATE_SHOW) {
        context._hoverState = HOVER_STATE_SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HOVER_STATE_SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    };

    _proto._leave = function _leave(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? TRIGGER_FOCUS : TRIGGER_HOVER] = false;
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HOVER_STATE_OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HOVER_STATE_OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    };

    _proto._isWithActiveTrigger = function _isWithActiveTrigger() {
      for (var trigger in this._activeTrigger) {
        if (this._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    };

    _proto._getConfig = function _getConfig(config) {
      var dataAttributes = $(this.element).data();
      Object.keys(dataAttributes).forEach(function (dataAttr) {
        if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
          delete dataAttributes[dataAttr];
        }
      });
      config = _extends({}, this.constructor.Default, dataAttributes, typeof config === 'object' && config ? config : {});

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      Util.typeCheckConfig(NAME$6, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.whiteList, config.sanitizeFn);
      }

      return config;
    };

    _proto._getDelegateConfig = function _getDelegateConfig() {
      var config = {};

      if (this.config) {
        for (var key in this.config) {
          if (this.constructor.Default[key] !== this.config[key]) {
            config[key] = this.config[key];
          }
        }
      }

      return config;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length) {
        $tip.removeClass(tabClass.join(''));
      }
    };

    _proto._handlePopperPlacementChange = function _handlePopperPlacementChange(popperData) {
      this.tip = popperData.instance.popper;

      this._cleanTipClass();

      this.addAttachmentClass(this._getAttachment(popperData.placement));
    };

    _proto._fixTransition = function _fixTransition() {
      var tip = this.getTipElement();
      var initConfigAnimation = this.config.animation;

      if (tip.getAttribute('x-placement') !== null) {
        return;
      }

      $(tip).removeClass(CLASS_NAME_FADE$2);
      this.config.animation = false;
      this.hide();
      this.show();
      this.config.animation = initConfigAnimation;
    } // Static
    ;

    Tooltip._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$6);

        var _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
          $(this).data(DATA_KEY$6, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tooltip, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$6;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$4;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$6;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY$6;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY$6;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$4;
      }
    }]);

    return Tooltip;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$6] = Tooltip._jQueryInterface;
  $.fn[NAME$6].Constructor = Tooltip;

  $.fn[NAME$6].noConflict = function () {
    $.fn[NAME$6] = JQUERY_NO_CONFLICT$6;
    return Tooltip._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$7 = 'popover';
  var VERSION$7 = '4.5.2';
  var DATA_KEY$7 = 'bs.popover';
  var EVENT_KEY$7 = "." + DATA_KEY$7;
  var JQUERY_NO_CONFLICT$7 = $.fn[NAME$7];
  var CLASS_PREFIX$1 = 'bs-popover';
  var BSCLS_PREFIX_REGEX$1 = new RegExp("(^|\\s)" + CLASS_PREFIX$1 + "\\S+", 'g');

  var Default$5 = _extends({}, Tooltip.Default, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
  });

  var DefaultType$5 = _extends({}, Tooltip.DefaultType, {
    content: '(string|element|function)'
  });

  var CLASS_NAME_FADE$3 = 'fade';
  var CLASS_NAME_SHOW$5 = 'show';
  var SELECTOR_TITLE = '.popover-header';
  var SELECTOR_CONTENT = '.popover-body';
  var Event$1 = {
    HIDE: "hide" + EVENT_KEY$7,
    HIDDEN: "hidden" + EVENT_KEY$7,
    SHOW: "show" + EVENT_KEY$7,
    SHOWN: "shown" + EVENT_KEY$7,
    INSERTED: "inserted" + EVENT_KEY$7,
    CLICK: "click" + EVENT_KEY$7,
    FOCUSIN: "focusin" + EVENT_KEY$7,
    FOCUSOUT: "focusout" + EVENT_KEY$7,
    MOUSEENTER: "mouseenter" + EVENT_KEY$7,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$7
  };
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Popover = /*#__PURE__*/function (_Tooltip) {
    _inheritsLoose(Popover, _Tooltip);

    function Popover() {
      return _Tooltip.apply(this, arguments) || this;
    }

    var _proto = Popover.prototype;

    // Overrides
    _proto.isWithContent = function isWithContent() {
      return this.getTitle() || this._getContent();
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX$1 + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var $tip = $(this.getTipElement()); // We use append for html objects to maintain js events

      this.setElementContent($tip.find(SELECTOR_TITLE), this.getTitle());

      var content = this._getContent();

      if (typeof content === 'function') {
        content = content.call(this.element);
      }

      this.setElementContent($tip.find(SELECTOR_CONTENT), content);
      $tip.removeClass(CLASS_NAME_FADE$3 + " " + CLASS_NAME_SHOW$5);
    } // Private
    ;

    _proto._getContent = function _getContent() {
      return this.element.getAttribute('data-content') || this.config.content;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX$1);

      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    } // Static
    ;

    Popover._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$7);

        var _config = typeof config === 'object' ? config : null;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          $(this).data(DATA_KEY$7, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Popover, null, [{
      key: "VERSION",
      // Getters
      get: function get() {
        return VERSION$7;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$5;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$7;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY$7;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event$1;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY$7;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$5;
      }
    }]);

    return Popover;
  }(Tooltip);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$7] = Popover._jQueryInterface;
  $.fn[NAME$7].Constructor = Popover;

  $.fn[NAME$7].noConflict = function () {
    $.fn[NAME$7] = JQUERY_NO_CONFLICT$7;
    return Popover._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$8 = 'scrollspy';
  var VERSION$8 = '4.5.2';
  var DATA_KEY$8 = 'bs.scrollspy';
  var EVENT_KEY$8 = "." + DATA_KEY$8;
  var DATA_API_KEY$6 = '.data-api';
  var JQUERY_NO_CONFLICT$8 = $.fn[NAME$8];
  var Default$6 = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  var DefaultType$6 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  var EVENT_ACTIVATE = "activate" + EVENT_KEY$8;
  var EVENT_SCROLL = "scroll" + EVENT_KEY$8;
  var EVENT_LOAD_DATA_API$2 = "load" + EVENT_KEY$8 + DATA_API_KEY$6;
  var CLASS_NAME_DROPDOWN_ITEM = 'dropdown-item';
  var CLASS_NAME_ACTIVE$2 = 'active';
  var SELECTOR_DATA_SPY = '[data-spy="scroll"]';
  var SELECTOR_NAV_LIST_GROUP = '.nav, .list-group';
  var SELECTOR_NAV_LINKS = '.nav-link';
  var SELECTOR_NAV_ITEMS = '.nav-item';
  var SELECTOR_LIST_ITEMS = '.list-group-item';
  var SELECTOR_DROPDOWN = '.dropdown';
  var SELECTOR_DROPDOWN_ITEMS = '.dropdown-item';
  var SELECTOR_DROPDOWN_TOGGLE = '.dropdown-toggle';
  var METHOD_OFFSET = 'offset';
  var METHOD_POSITION = 'position';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var ScrollSpy = /*#__PURE__*/function () {
    function ScrollSpy(element, config) {
      var _this = this;

      this._element = element;
      this._scrollElement = element.tagName === 'BODY' ? window : element;
      this._config = this._getConfig(config);
      this._selector = this._config.target + " " + SELECTOR_NAV_LINKS + "," + (this._config.target + " " + SELECTOR_LIST_ITEMS + ",") + (this._config.target + " " + SELECTOR_DROPDOWN_ITEMS);
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      $(this._scrollElement).on(EVENT_SCROLL, function (event) {
        return _this._process(event);
      });
      this.refresh();

      this._process();
    } // Getters


    var _proto = ScrollSpy.prototype;

    // Public
    _proto.refresh = function refresh() {
      var _this2 = this;

      var autoMethod = this._scrollElement === this._scrollElement.window ? METHOD_OFFSET : METHOD_POSITION;
      var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      var offsetBase = offsetMethod === METHOD_POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      var targets = [].slice.call(document.querySelectorAll(this._selector));
      targets.map(function (element) {
        var target;
        var targetSelector = Util.getSelectorFromElement(element);

        if (targetSelector) {
          target = document.querySelector(targetSelector);
        }

        if (target) {
          var targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            // TODO (fat): remove sketch reliance on jQuery position/offset
            return [$(target)[offsetMethod]().top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        _this2._offsets.push(item[0]);

        _this2._targets.push(item[1]);
      });
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$8);
      $(this._scrollElement).off(EVENT_KEY$8);
      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default$6, typeof config === 'object' && config ? config : {});

      if (typeof config.target !== 'string' && Util.isElement(config.target)) {
        var id = $(config.target).attr('id');

        if (!id) {
          id = Util.getUID(NAME$8);
          $(config.target).attr('id', id);
        }

        config.target = "#" + id;
      }

      Util.typeCheckConfig(NAME$8, config, DefaultType$6);
      return config;
    };

    _proto._getScrollTop = function _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    };

    _proto._getScrollHeight = function _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    };

    _proto._getOffsetHeight = function _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    };

    _proto._process = function _process() {
      var scrollTop = this._getScrollTop() + this._config.offset;

      var scrollHeight = this._getScrollHeight();

      var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      for (var i = this._offsets.length; i--;) {
        var isActiveTarget = this._activeTarget !== this._targets[i] && scrollTop >= this._offsets[i] && (typeof this._offsets[i + 1] === 'undefined' || scrollTop < this._offsets[i + 1]);

        if (isActiveTarget) {
          this._activate(this._targets[i]);
        }
      }
    };

    _proto._activate = function _activate(target) {
      this._activeTarget = target;

      this._clear();

      var queries = this._selector.split(',').map(function (selector) {
        return selector + "[data-target=\"" + target + "\"]," + selector + "[href=\"" + target + "\"]";
      });

      var $link = $([].slice.call(document.querySelectorAll(queries.join(','))));

      if ($link.hasClass(CLASS_NAME_DROPDOWN_ITEM)) {
        $link.closest(SELECTOR_DROPDOWN).find(SELECTOR_DROPDOWN_TOGGLE).addClass(CLASS_NAME_ACTIVE$2);
        $link.addClass(CLASS_NAME_ACTIVE$2);
      } else {
        // Set triggered link as active
        $link.addClass(CLASS_NAME_ACTIVE$2); // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor

        $link.parents(SELECTOR_NAV_LIST_GROUP).prev(SELECTOR_NAV_LINKS + ", " + SELECTOR_LIST_ITEMS).addClass(CLASS_NAME_ACTIVE$2); // Handle special case when .nav-link is inside .nav-item

        $link.parents(SELECTOR_NAV_LIST_GROUP).prev(SELECTOR_NAV_ITEMS).children(SELECTOR_NAV_LINKS).addClass(CLASS_NAME_ACTIVE$2);
      }

      $(this._scrollElement).trigger(EVENT_ACTIVATE, {
        relatedTarget: target
      });
    };

    _proto._clear = function _clear() {
      [].slice.call(document.querySelectorAll(this._selector)).filter(function (node) {
        return node.classList.contains(CLASS_NAME_ACTIVE$2);
      }).forEach(function (node) {
        return node.classList.remove(CLASS_NAME_ACTIVE$2);
      });
    } // Static
    ;

    ScrollSpy._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$8);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
          $(this).data(DATA_KEY$8, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(ScrollSpy, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$8;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$6;
      }
    }]);

    return ScrollSpy;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(window).on(EVENT_LOAD_DATA_API$2, function () {
    var scrollSpys = [].slice.call(document.querySelectorAll(SELECTOR_DATA_SPY));
    var scrollSpysLength = scrollSpys.length;

    for (var i = scrollSpysLength; i--;) {
      var $spy = $(scrollSpys[i]);

      ScrollSpy._jQueryInterface.call($spy, $spy.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$8] = ScrollSpy._jQueryInterface;
  $.fn[NAME$8].Constructor = ScrollSpy;

  $.fn[NAME$8].noConflict = function () {
    $.fn[NAME$8] = JQUERY_NO_CONFLICT$8;
    return ScrollSpy._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$9 = 'tab';
  var VERSION$9 = '4.5.2';
  var DATA_KEY$9 = 'bs.tab';
  var EVENT_KEY$9 = "." + DATA_KEY$9;
  var DATA_API_KEY$7 = '.data-api';
  var JQUERY_NO_CONFLICT$9 = $.fn[NAME$9];
  var EVENT_HIDE$3 = "hide" + EVENT_KEY$9;
  var EVENT_HIDDEN$3 = "hidden" + EVENT_KEY$9;
  var EVENT_SHOW$3 = "show" + EVENT_KEY$9;
  var EVENT_SHOWN$3 = "shown" + EVENT_KEY$9;
  var EVENT_CLICK_DATA_API$6 = "click" + EVENT_KEY$9 + DATA_API_KEY$7;
  var CLASS_NAME_DROPDOWN_MENU = 'dropdown-menu';
  var CLASS_NAME_ACTIVE$3 = 'active';
  var CLASS_NAME_DISABLED$1 = 'disabled';
  var CLASS_NAME_FADE$4 = 'fade';
  var CLASS_NAME_SHOW$6 = 'show';
  var SELECTOR_DROPDOWN$1 = '.dropdown';
  var SELECTOR_NAV_LIST_GROUP$1 = '.nav, .list-group';
  var SELECTOR_ACTIVE$2 = '.active';
  var SELECTOR_ACTIVE_UL = '> li > .active';
  var SELECTOR_DATA_TOGGLE$4 = '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]';
  var SELECTOR_DROPDOWN_TOGGLE$1 = '.dropdown-toggle';
  var SELECTOR_DROPDOWN_ACTIVE_CHILD = '> .dropdown-menu .active';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Tab = /*#__PURE__*/function () {
    function Tab(element) {
      this._element = element;
    } // Getters


    var _proto = Tab.prototype;

    // Public
    _proto.show = function show() {
      var _this = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(CLASS_NAME_ACTIVE$3) || $(this._element).hasClass(CLASS_NAME_DISABLED$1)) {
        return;
      }

      var target;
      var previous;
      var listElement = $(this._element).closest(SELECTOR_NAV_LIST_GROUP$1)[0];
      var selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        var itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? SELECTOR_ACTIVE_UL : SELECTOR_ACTIVE$2;
        previous = $.makeArray($(listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $.Event(EVENT_HIDE$3, {
        relatedTarget: this._element
      });
      var showEvent = $.Event(EVENT_SHOW$3, {
        relatedTarget: previous
      });

      if (previous) {
        $(previous).trigger(hideEvent);
      }

      $(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = document.querySelector(selector);
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $.Event(EVENT_HIDDEN$3, {
          relatedTarget: _this._element
        });
        var shownEvent = $.Event(EVENT_SHOWN$3, {
          relatedTarget: previous
        });
        $(previous).trigger(hiddenEvent);
        $(_this._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$9);
      this._element = null;
    } // Private
    ;

    _proto._activate = function _activate(element, container, callback) {
      var _this2 = this;

      var activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? $(container).find(SELECTOR_ACTIVE_UL) : $(container).children(SELECTOR_ACTIVE$2);
      var active = activeElements[0];
      var isTransitioning = callback && active && $(active).hasClass(CLASS_NAME_FADE$4);

      var complete = function complete() {
        return _this2._transitionComplete(element, active, callback);
      };

      if (active && isTransitioning) {
        var transitionDuration = Util.getTransitionDurationFromElement(active);
        $(active).removeClass(CLASS_NAME_SHOW$6).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto._transitionComplete = function _transitionComplete(element, active, callback) {
      if (active) {
        $(active).removeClass(CLASS_NAME_ACTIVE$3);
        var dropdownChild = $(active.parentNode).find(SELECTOR_DROPDOWN_ACTIVE_CHILD)[0];

        if (dropdownChild) {
          $(dropdownChild).removeClass(CLASS_NAME_ACTIVE$3);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      $(element).addClass(CLASS_NAME_ACTIVE$3);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      Util.reflow(element);

      if (element.classList.contains(CLASS_NAME_FADE$4)) {
        element.classList.add(CLASS_NAME_SHOW$6);
      }

      if (element.parentNode && $(element.parentNode).hasClass(CLASS_NAME_DROPDOWN_MENU)) {
        var dropdownElement = $(element).closest(SELECTOR_DROPDOWN$1)[0];

        if (dropdownElement) {
          var dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(SELECTOR_DROPDOWN_TOGGLE$1));
          $(dropdownToggleList).addClass(CLASS_NAME_ACTIVE$3);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    } // Static
    ;

    Tab._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$9);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY$9, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tab, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$9;
      }
    }]);

    return Tab;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(EVENT_CLICK_DATA_API$6, SELECTOR_DATA_TOGGLE$4, function (event) {
    event.preventDefault();

    Tab._jQueryInterface.call($(this), 'show');
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$9] = Tab._jQueryInterface;
  $.fn[NAME$9].Constructor = Tab;

  $.fn[NAME$9].noConflict = function () {
    $.fn[NAME$9] = JQUERY_NO_CONFLICT$9;
    return Tab._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$a = 'toast';
  var VERSION$a = '4.5.2';
  var DATA_KEY$a = 'bs.toast';
  var EVENT_KEY$a = "." + DATA_KEY$a;
  var JQUERY_NO_CONFLICT$a = $.fn[NAME$a];
  var EVENT_CLICK_DISMISS$1 = "click.dismiss" + EVENT_KEY$a;
  var EVENT_HIDE$4 = "hide" + EVENT_KEY$a;
  var EVENT_HIDDEN$4 = "hidden" + EVENT_KEY$a;
  var EVENT_SHOW$4 = "show" + EVENT_KEY$a;
  var EVENT_SHOWN$4 = "shown" + EVENT_KEY$a;
  var CLASS_NAME_FADE$5 = 'fade';
  var CLASS_NAME_HIDE = 'hide';
  var CLASS_NAME_SHOW$7 = 'show';
  var CLASS_NAME_SHOWING = 'showing';
  var DefaultType$7 = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  var Default$7 = {
    animation: true,
    autohide: true,
    delay: 500
  };
  var SELECTOR_DATA_DISMISS$1 = '[data-dismiss="toast"]';
  /**
   * ------------------------------------------------------------------------
   * Class Definition
   * ------------------------------------------------------------------------
   */

  var Toast = /*#__PURE__*/function () {
    function Toast(element, config) {
      this._element = element;
      this._config = this._getConfig(config);
      this._timeout = null;

      this._setListeners();
    } // Getters


    var _proto = Toast.prototype;

    // Public
    _proto.show = function show() {
      var _this = this;

      var showEvent = $.Event(EVENT_SHOW$4);
      $(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      }

      this._clearTimeout();

      if (this._config.animation) {
        this._element.classList.add(CLASS_NAME_FADE$5);
      }

      var complete = function complete() {
        _this._element.classList.remove(CLASS_NAME_SHOWING);

        _this._element.classList.add(CLASS_NAME_SHOW$7);

        $(_this._element).trigger(EVENT_SHOWN$4);

        if (_this._config.autohide) {
          _this._timeout = setTimeout(function () {
            _this.hide();
          }, _this._config.delay);
        }
      };

      this._element.classList.remove(CLASS_NAME_HIDE);

      Util.reflow(this._element);

      this._element.classList.add(CLASS_NAME_SHOWING);

      if (this._config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto.hide = function hide() {
      if (!this._element.classList.contains(CLASS_NAME_SHOW$7)) {
        return;
      }

      var hideEvent = $.Event(EVENT_HIDE$4);
      $(this._element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      this._close();
    };

    _proto.dispose = function dispose() {
      this._clearTimeout();

      if (this._element.classList.contains(CLASS_NAME_SHOW$7)) {
        this._element.classList.remove(CLASS_NAME_SHOW$7);
      }

      $(this._element).off(EVENT_CLICK_DISMISS$1);
      $.removeData(this._element, DATA_KEY$a);
      this._element = null;
      this._config = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _extends({}, Default$7, $(this._element).data(), typeof config === 'object' && config ? config : {});
      Util.typeCheckConfig(NAME$a, config, this.constructor.DefaultType);
      return config;
    };

    _proto._setListeners = function _setListeners() {
      var _this2 = this;

      $(this._element).on(EVENT_CLICK_DISMISS$1, SELECTOR_DATA_DISMISS$1, function () {
        return _this2.hide();
      });
    };

    _proto._close = function _close() {
      var _this3 = this;

      var complete = function complete() {
        _this3._element.classList.add(CLASS_NAME_HIDE);

        $(_this3._element).trigger(EVENT_HIDDEN$4);
      };

      this._element.classList.remove(CLASS_NAME_SHOW$7);

      if (this._config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto._clearTimeout = function _clearTimeout() {
      clearTimeout(this._timeout);
      this._timeout = null;
    } // Static
    ;

    Toast._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY$a);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, _config);
          $element.data(DATA_KEY$a, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](this);
        }
      });
    };

    _createClass(Toast, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$a;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$7;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$7;
      }
    }]);

    return Toast;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$a] = Toast._jQueryInterface;
  $.fn[NAME$a].Constructor = Toast;

  $.fn[NAME$a].noConflict = function () {
    $.fn[NAME$a] = JQUERY_NO_CONFLICT$a;
    return Toast._jQueryInterface;
  };

  exports.Alert = Alert;
  exports.Button = Button;
  exports.Carousel = Carousel;
  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;
  exports.Modal = Modal;
  exports.Popover = Popover;
  exports.Scrollspy = ScrollSpy;
  exports.Tab = Tab;
  exports.Toast = Toast;
  exports.Tooltip = Tooltip;
  exports.Util = Util;

  Object.defineProperty(exports, '__esModule', { value: true });

})));


},{"jquery":2,"popper.js":3}],2:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v3.5.1
 * https://jquery.com/
 *
 * Includes Sizzle.js
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://jquery.org/license
 *
 * Date: 2020-05-04T22:49Z
 */
( function( global, factory ) {

	"use strict";

	if ( typeof module === "object" && typeof module.exports === "object" ) {

		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
} )( typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Edge <= 12 - 13+, Firefox <=18 - 45+, IE 10 - 11, Safari 5.1 - 9+, iOS 6 - 9.1
// throw exceptions when non-strict code (e.g., ASP.NET 4.5) accesses strict mode
// arguments.callee.caller (trac-13335). But as of jQuery 3.0 (2016), strict mode should be common
// enough that all such attempts are guarded in a try block.
"use strict";

var arr = [];

var getProto = Object.getPrototypeOf;

var slice = arr.slice;

var flat = arr.flat ? function( array ) {
	return arr.flat.call( array );
} : function( array ) {
	return arr.concat.apply( [], array );
};


var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var fnToString = hasOwn.toString;

var ObjectFunctionString = fnToString.call( Object );

var support = {};

var isFunction = function isFunction( obj ) {

      // Support: Chrome <=57, Firefox <=52
      // In some browsers, typeof returns "function" for HTML <object> elements
      // (i.e., `typeof document.createElement( "object" ) === "function"`).
      // We don't want to classify *any* DOM node as a function.
      return typeof obj === "function" && typeof obj.nodeType !== "number";
  };


var isWindow = function isWindow( obj ) {
		return obj != null && obj === obj.window;
	};


var document = window.document;



	var preservedScriptAttributes = {
		type: true,
		src: true,
		nonce: true,
		noModule: true
	};

	function DOMEval( code, node, doc ) {
		doc = doc || document;

		var i, val,
			script = doc.createElement( "script" );

		script.text = code;
		if ( node ) {
			for ( i in preservedScriptAttributes ) {

				// Support: Firefox 64+, Edge 18+
				// Some browsers don't support the "nonce" property on scripts.
				// On the other hand, just using `getAttribute` is not enough as
				// the `nonce` attribute is reset to an empty string whenever it
				// becomes browsing-context connected.
				// See https://github.com/whatwg/html/issues/2369
				// See https://html.spec.whatwg.org/#nonce-attributes
				// The `node.getAttribute` check was added for the sake of
				// `jQuery.globalEval` so that it can fake a nonce-containing node
				// via an object.
				val = node[ i ] || node.getAttribute && node.getAttribute( i );
				if ( val ) {
					script.setAttribute( i, val );
				}
			}
		}
		doc.head.appendChild( script ).parentNode.removeChild( script );
	}


function toType( obj ) {
	if ( obj == null ) {
		return obj + "";
	}

	// Support: Android <=2.3 only (functionish RegExp)
	return typeof obj === "object" || typeof obj === "function" ?
		class2type[ toString.call( obj ) ] || "object" :
		typeof obj;
}
/* global Symbol */
// Defining this global in .eslintrc.json would create a danger of using the global
// unguarded in another place, it seems safer to define global only for this module



var
	version = "3.5.1",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {

		// Return all the elements in a clean array
		if ( num == null ) {
			return slice.call( this );
		}

		// Return just the one element from the set
		return num < 0 ? this[ num + this.length ] : this[ num ];
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	even: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return ( i + 1 ) % 2;
		} ) );
	},

	odd: function() {
		return this.pushStack( jQuery.grep( this, function( _elem, i ) {
			return i % 2;
		} ) );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[ 0 ] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = arguments[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				copy = options[ name ];

				// Prevent Object.prototype pollution
				// Prevent never-ending loop
				if ( name === "__proto__" || target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = Array.isArray( copy ) ) ) ) {
					src = target[ name ];

					// Ensure proper type for the source value
					if ( copyIsArray && !Array.isArray( src ) ) {
						clone = [];
					} else if ( !copyIsArray && !jQuery.isPlainObject( src ) ) {
						clone = {};
					} else {
						clone = src;
					}
					copyIsArray = false;

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isPlainObject: function( obj ) {
		var proto, Ctor;

		// Detect obvious negatives
		// Use toString instead of jQuery.type to catch host objects
		if ( !obj || toString.call( obj ) !== "[object Object]" ) {
			return false;
		}

		proto = getProto( obj );

		// Objects with no prototype (e.g., `Object.create( null )`) are plain
		if ( !proto ) {
			return true;
		}

		// Objects with prototype are plain iff they were constructed by a global Object function
		Ctor = hasOwn.call( proto, "constructor" ) && proto.constructor;
		return typeof Ctor === "function" && fnToString.call( Ctor ) === ObjectFunctionString;
	},

	isEmptyObject: function( obj ) {
		var name;

		for ( name in obj ) {
			return false;
		}
		return true;
	},

	// Evaluates a script in a provided context; falls back to the global one
	// if not specified.
	globalEval: function( code, options, doc ) {
		DOMEval( code, { nonce: options && options.nonce }, doc );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	// Support: Android <=4.0 only, PhantomJS 1 only
	// push.apply(_, arraylike) throws on ancient WebKit
	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return flat( ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

if ( typeof Symbol === "function" ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}

// Populate the class2type map
jQuery.each( "Boolean Number String Function Array Date RegExp Object Error Symbol".split( " " ),
function( _i, name ) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
} );

function isArrayLike( obj ) {

	// Support: real iOS 8.2 only (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = toType( obj );

	if ( isFunction( obj ) || isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.3.5
 * https://sizzlejs.com/
 *
 * Copyright JS Foundation and other contributors
 * Released under the MIT license
 * https://js.foundation/
 *
 * Date: 2020-03-14
 */
( function( window ) {
var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	nonnativeSelectorCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	pushNative = arr.push,
	push = arr.push,
	slice = arr.slice,

	// Use a stripped-down indexOf as it's faster than native
	// https://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|" +
		"ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// https://www.w3.org/TR/css-syntax-3/#ident-token-diagram
	identifier = "(?:\\\\[\\da-fA-F]{1,6}" + whitespace +
		"?|\\\\[^\\r\\n\\f]|[\\w-]|[^\0-\\x7f])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5]
		// or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" +
		whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace +
		"*" ),
	rdescend = new RegExp( whitespace + "|>" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + identifier + ")" ),
		"CLASS": new RegExp( "^\\.(" + identifier + ")" ),
		"TAG": new RegExp( "^(" + identifier + "|[*])" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
			whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" +
			whitespace + "*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace +
			"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + whitespace +
			"*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rhtml = /HTML$/i,
	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,

	// CSS escapes
	// http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\[\\da-fA-F]{1,6}" + whitespace + "?|\\\\([^\\r\\n\\f])", "g" ),
	funescape = function( escape, nonHex ) {
		var high = "0x" + escape.slice( 1 ) - 0x10000;

		return nonHex ?

			// Strip the backslash prefix from a non-hex escape sequence
			nonHex :

			// Replace a hexadecimal escape sequence with the encoded Unicode code point
			// Support: IE <=11+
			// For values outside the Basic Multilingual Plane (BMP), manually construct a
			// surrogate pair
			high < 0 ?
				String.fromCharCode( high + 0x10000 ) :
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// CSS string/identifier serialization
	// https://drafts.csswg.org/cssom/#common-serializing-idioms
	rcssescape = /([\0-\x1f\x7f]|^-?\d)|^-$|[^\0-\x1f\x7f-\uFFFF\w-]/g,
	fcssescape = function( ch, asCodePoint ) {
		if ( asCodePoint ) {

			// U+0000 NULL becomes U+FFFD REPLACEMENT CHARACTER
			if ( ch === "\0" ) {
				return "\uFFFD";
			}

			// Control characters and (dependent upon position) numbers get escaped as code points
			return ch.slice( 0, -1 ) + "\\" +
				ch.charCodeAt( ch.length - 1 ).toString( 16 ) + " ";
		}

		// Other potentially-special ASCII characters get backslash-escaped
		return "\\" + ch;
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	},

	inDisabledFieldset = addCombinator(
		function( elem ) {
			return elem.disabled === true && elem.nodeName.toLowerCase() === "fieldset";
		},
		{ dir: "parentNode", next: "legend" }
	);

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		( arr = slice.call( preferredDoc.childNodes ) ),
		preferredDoc.childNodes
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	// eslint-disable-next-line no-unused-expressions
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( ( target[ j++ ] = els[ i++ ] ) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, match, groups, newSelector,
		newContext = context && context.ownerDocument,

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context.nodeType : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {
		setDocument( context );
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( ( m = match[ 1 ] ) ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( ( elem = context.getElementById( m ) ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if ( newContext && ( elem = newContext.getElementById( m ) ) &&
							contains( context, elem ) &&
							elem.id === m ) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context.getElementsByTagName( selector ) );
					return results;

				// Class selector
				} else if ( ( m = match[ 3 ] ) && support.getElementsByClassName &&
					context.getElementsByClassName ) {

					push.apply( results, context.getElementsByClassName( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if ( support.qsa &&
				!nonnativeSelectorCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) ) &&

				// Support: IE 8 only
				// Exclude object elements
				( nodeType !== 1 || context.nodeName.toLowerCase() !== "object" ) ) {

				newSelector = selector;
				newContext = context;

				// qSA considers elements outside a scoping root when evaluating child or
				// descendant combinators, which is not what we want.
				// In such cases, we work around the behavior by prefixing every selector in the
				// list with an ID selector referencing the scope context.
				// The technique has to be used as well when a leading combinator is used
				// as such selectors are not recognized by querySelectorAll.
				// Thanks to Andrew Dupont for this technique.
				if ( nodeType === 1 &&
					( rdescend.test( selector ) || rcombinators.test( selector ) ) ) {

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) && testContext( context.parentNode ) ||
						context;

					// We can use :scope instead of the ID hack if the browser
					// supports it & if we're not changing the context.
					if ( newContext !== context || !support.scope ) {

						// Capture the context ID, setting it first if necessary
						if ( ( nid = context.getAttribute( "id" ) ) ) {
							nid = nid.replace( rcssescape, fcssescape );
						} else {
							context.setAttribute( "id", ( nid = expando ) );
						}
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					while ( i-- ) {
						groups[ i ] = ( nid ? "#" + nid : ":scope" ) + " " +
							toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );
				}

				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch ( qsaError ) {
					nonnativeSelectorCache( selector, true );
				} finally {
					if ( nid === expando ) {
						context.removeAttribute( "id" );
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created element and returns a boolean result
 */
function assert( fn ) {
	var el = document.createElement( "fieldset" );

	try {
		return !!fn( el );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( el.parentNode ) {
			el.parentNode.removeChild( el );
		}

		// release memory in IE
		el = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			a.sourceIndex - b.sourceIndex;

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( ( cur = cur.nextSibling ) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return ( name === "input" || name === "button" ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for :enabled/:disabled
 * @param {Boolean} disabled true for :disabled; false for :enabled
 */
function createDisabledPseudo( disabled ) {

	// Known :disabled false positives: fieldset[disabled] > legend:nth-of-type(n+2) :can-disable
	return function( elem ) {

		// Only certain elements can match :enabled or :disabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-enabled
		// https://html.spec.whatwg.org/multipage/scripting.html#selector-disabled
		if ( "form" in elem ) {

			// Check for inherited disabledness on relevant non-disabled elements:
			// * listed form-associated elements in a disabled fieldset
			//   https://html.spec.whatwg.org/multipage/forms.html#category-listed
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-fe-disabled
			// * option elements in a disabled optgroup
			//   https://html.spec.whatwg.org/multipage/forms.html#concept-option-disabled
			// All such elements have a "form" property.
			if ( elem.parentNode && elem.disabled === false ) {

				// Option elements defer to a parent optgroup if present
				if ( "label" in elem ) {
					if ( "label" in elem.parentNode ) {
						return elem.parentNode.disabled === disabled;
					} else {
						return elem.disabled === disabled;
					}
				}

				// Support: IE 6 - 11
				// Use the isDisabled shortcut property to check for disabled fieldset ancestors
				return elem.isDisabled === disabled ||

					// Where there is no isDisabled, check manually
					/* jshint -W018 */
					elem.isDisabled !== !disabled &&
					inDisabledFieldset( elem ) === disabled;
			}

			return elem.disabled === disabled;

		// Try to winnow out elements that can't be disabled before trusting the disabled property.
		// Some victims get caught in our net (label, legend, menu, track), but it shouldn't
		// even exist on them, let alone have a boolean value.
		} else if ( "label" in elem ) {
			return elem.disabled === disabled;
		}

		// Remaining elements are neither :enabled nor :disabled
		return false;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	var namespace = elem.namespaceURI,
		docElem = ( elem.ownerDocument || elem ).documentElement;

	// Support: IE <=8
	// Assume HTML when documentElement doesn't yet exist, such as inside loading iframes
	// https://bugs.jquery.com/ticket/4833
	return !rhtml.test( namespace || docElem && docElem.nodeName || "HTML" );
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, subWindow,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// Return early if doc is invalid or already selected
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( doc == document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document.documentElement;
	documentIsHTML = !isXML( document );

	// Support: IE 9 - 11+, Edge 12 - 18+
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( preferredDoc != document &&
		( subWindow = document.defaultView ) && subWindow.top !== subWindow ) {

		// Support: IE 11, Edge
		if ( subWindow.addEventListener ) {
			subWindow.addEventListener( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		} else if ( subWindow.attachEvent ) {
			subWindow.attachEvent( "onunload", unloadHandler );
		}
	}

	// Support: IE 8 - 11+, Edge 12 - 18+, Chrome <=16 - 25 only, Firefox <=3.6 - 31 only,
	// Safari 4 - 5 only, Opera <=11.6 - 12.x only
	// IE/Edge & older browsers don't support the :scope pseudo-class.
	// Support: Safari 6.0 only
	// Safari 6.0 supports :scope but it's an alias of :root there.
	support.scope = assert( function( el ) {
		docElem.appendChild( el ).appendChild( document.createElement( "div" ) );
		return typeof el.querySelectorAll !== "undefined" &&
			!el.querySelectorAll( ":scope fieldset div" ).length;
	} );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( el ) {
		el.className = "i";
		return !el.getAttribute( "className" );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert( function( el ) {
		el.appendChild( document.createComment( "" ) );
		return !el.getElementsByTagName( "*" ).length;
	} );

	// Support: IE<9
	support.getElementsByClassName = rnative.test( document.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programmatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( el ) {
		docElem.appendChild( el ).id = expando;
		return !document.getElementsByName || !document.getElementsByName( expando ).length;
	} );

	// ID filter and find
	if ( support.getById ) {
		Expr.filter[ "ID" ] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute( "id" ) === attrId;
			};
		};
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var elem = context.getElementById( id );
				return elem ? [ elem ] : [];
			}
		};
	} else {
		Expr.filter[ "ID" ] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" &&
					elem.getAttributeNode( "id" );
				return node && node.value === attrId;
			};
		};

		// Support: IE 6 - 7 only
		// getElementById is not reliable as a find shortcut
		Expr.find[ "ID" ] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var node, i, elems,
					elem = context.getElementById( id );

				if ( elem ) {

					// Verify the id attribute
					node = elem.getAttributeNode( "id" );
					if ( node && node.value === id ) {
						return [ elem ];
					}

					// Fall back on getElementsByName
					elems = context.getElementsByName( id );
					i = 0;
					while ( ( elem = elems[ i++ ] ) ) {
						node = elem.getAttributeNode( "id" );
						if ( node && node.value === id ) {
							return [ elem ];
						}
					}
				}

				return [];
			}
		};
	}

	// Tag
	Expr.find[ "TAG" ] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( ( elem = results[ i++ ] ) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find[ "CLASS" ] = support.getElementsByClassName && function( className, context ) {
		if ( typeof context.getElementsByClassName !== "undefined" && documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See https://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( ( support.qsa = rnative.test( document.querySelectorAll ) ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( el ) {

			var input;

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// https://bugs.jquery.com/ticket/12359
			docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\r\\' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// https://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( el.querySelectorAll( "[msallowcapture^='']" ).length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !el.querySelectorAll( "[selected]" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !el.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Support: IE 11+, Edge 15 - 18+
			// IE 11/Edge don't find elements on a `[name='']` query in some cases.
			// Adding a temporary attribute to the document before the selection works
			// around the issue.
			// Interestingly, IE 10 & older don't seem to have the issue.
			input = document.createElement( "input" );
			input.setAttribute( "name", "" );
			el.appendChild( input );
			if ( !el.querySelectorAll( "[name='']" ).length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*name" + whitespace + "*=" +
					whitespace + "*(?:''|\"\")" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !el.querySelectorAll( ":checked" ).length ) {
				rbuggyQSA.push( ":checked" );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibling-combinator selector` fails
			if ( !el.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}

			// Support: Firefox <=3.6 - 5 only
			// Old Firefox doesn't throw on a badly-escaped identifier.
			el.querySelectorAll( "\\\f" );
			rbuggyQSA.push( "[\\r\\n\\f]" );
		} );

		assert( function( el ) {
			el.innerHTML = "<a href='' disabled='disabled'></a>" +
				"<select disabled='disabled'><option/></select>";

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = document.createElement( "input" );
			input.setAttribute( "type", "hidden" );
			el.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( el.querySelectorAll( "[name=d]" ).length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( el.querySelectorAll( ":enabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: IE9-11+
			// IE's :disabled selector does not pick up the children of disabled fieldsets
			docElem.appendChild( el ).disabled = true;
			if ( el.querySelectorAll( ":disabled" ).length !== 2 ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Support: Opera 10 - 11 only
			// Opera 10-11 does not throw on post-comma invalid pseudos
			el.querySelectorAll( "*,:x" );
			rbuggyQSA.push( ",.*:" );
		} );
	}

	if ( ( support.matchesSelector = rnative.test( ( matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector ) ) ) ) {

		assert( function( el ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( el, "*" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( el, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( ( b = b.parentNode ) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		// Support: IE 11+, Edge 17 - 18+
		// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
		// two documents; shallow comparisons work.
		// eslint-disable-next-line eqeqeq
		compare = ( a.ownerDocument || a ) == ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			( !support.sortDetached && b.compareDocumentPosition( a ) === compare ) ) {

			// Choose the first element that is related to our preferred document
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( a == document || a.ownerDocument == preferredDoc &&
				contains( preferredDoc, a ) ) {
				return -1;
			}

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			// eslint-disable-next-line eqeqeq
			if ( b == document || b.ownerDocument == preferredDoc &&
				contains( preferredDoc, b ) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {

			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			return a == document ? -1 :
				b == document ? 1 :
				/* eslint-enable eqeqeq */
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( ( cur = cur.parentNode ) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( ( cur = cur.parentNode ) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			// Support: IE 11+, Edge 17 - 18+
			// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
			// two documents; shallow comparisons work.
			/* eslint-disable eqeqeq */
			ap[ i ] == preferredDoc ? -1 :
			bp[ i ] == preferredDoc ? 1 :
			/* eslint-enable eqeqeq */
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	setDocument( elem );

	if ( support.matchesSelector && documentIsHTML &&
		!nonnativeSelectorCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch ( e ) {
			nonnativeSelectorCache( expr, true );
		}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( context.ownerDocument || context ) != document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	// Support: IE 11+, Edge 17 - 18+
	// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
	// two documents; shallow comparisons work.
	// eslint-disable-next-line eqeqeq
	if ( ( elem.ownerDocument || elem ) != document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			( val = elem.getAttributeNode( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.escape = function( sel ) {
	return ( sel + "" ).replace( rcssescape, fcssescape );
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( ( elem = results[ i++ ] ) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( ( node = elem[ i++ ] ) ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = ( match[ 3 ] || match[ 4 ] ||
				match[ 5 ] || "" ).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {

			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = match[ 1 ].toLowerCase();

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" ) );
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

				// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr[ "CHILD" ].test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length ) ) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() {
					return true;
				} :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				( pattern = new RegExp( "(^|" + whitespace +
					")" + className + "(" + whitespace + "|$)" ) ) && classCache(
						className, function( elem ) {
							return pattern.test(
								typeof elem.className === "string" && elem.className ||
								typeof elem.getAttribute !== "undefined" &&
									elem.getAttribute( "class" ) ||
								""
							);
				} );
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				/* eslint-disable max-len */

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
				/* eslint-enable max-len */

			};
		},

		"CHILD": function( type, what, _argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, _context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( ( node = node[ dir ] ) ) {
									if ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node.uniqueID ] ||
								( outerCache[ node.uniqueID ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( ( node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) || start.pop() ) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node.uniqueID ] ||
									( outerCache[ node.uniqueID ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while ( ( node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) || start.pop() ) ) {

									if ( ( ofType ?
										node.nodeName.toLowerCase() === name :
										node.nodeType === 1 ) &&
										++diff ) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node.uniqueID ] ||
												( outerCache[ node.uniqueID ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		"not": markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, _context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( ( elem = unmatched[ i ] ) ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, _context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		"has": markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		"contains": markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || getText( elem ) ).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( ( elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute( "xml:lang" ) || elem.getAttribute( "lang" ) ) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem.parentNode ) && elem.nodeType === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		"enabled": createDisabledPseudo( false ),
		"disabled": createDisabledPseudo( true ),

		"checked": function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		"selected": function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				// eslint-disable-next-line no-unused-expressions
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos[ "empty" ]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem.getAttribute( "type" ) ) == null ||
					attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		"last": createPositionalPseudo( function( _matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		"eq": createPositionalPseudo( function( _matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		"even": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"odd": createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"lt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ?
				argument + length :
				argument > length ?
					length :
					argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		"gt": createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos[ "nth" ] = Expr.pseudos[ "eq" ];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( ( match = rcombinators.exec( soFar ) ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( ( match = matchExpr[ type ].exec( soFar ) ) && ( !preFilters[ type ] ||
				( match = preFilters[ type ]( match ) ) ) ) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		skip = combinator.next,
		key = skip || dir,
		checkNonElements = base && key === "parentNode",
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( ( elem = elem[ dir ] ) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
			return false;
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
			if ( xml ) {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( ( elem = elem[ dir ] ) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem.uniqueID ] ||
							( outerCache[ elem.uniqueID ] = {} );

						if ( skip && skip === elem.nodeName.toLowerCase() ) {
							elem = elem[ dir ] || elem;
						} else if ( ( oldCache = uniqueCache[ key ] ) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ key ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
								return true;
							}
						}
					}
				}
			}
			return false;
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( ( elem = unmatched[ i ] ) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context.nodeType ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( ( elem = temp[ i ] ) ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( ( elem = matcherOut[ i ] ) ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( ( matcherIn[ i ] = elem ) );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( ( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1 ) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || Expr.relative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				( checkContext = context ).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( ( matcher = Expr.relative[ tokens[ i ].type ] ) ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

					// If the preceding token was a descendant combinator, insert an implicit any-element `*`
					tokens
						.slice( 0, i - 1 )
						.concat( { value: tokens[ i - 2 ].type === " " ? "*" : "" } )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find[ "TAG" ]( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {

				// Support: IE 11+, Edge 17 - 18+
				// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
				// two documents; shallow comparisons work.
				// eslint-disable-next-line eqeqeq
				outermostContext = context == document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;

					// Support: IE 11+, Edge 17 - 18+
					// IE/Edge sometimes throw a "Permission denied" error when strict-comparing
					// two documents; shallow comparisons work.
					// eslint-disable-next-line eqeqeq
					if ( !context && elem.ownerDocument != document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( ( matcher = elementMatchers[ j++ ] ) ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( ( elem = !matcher && elem ) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( ( matcher = setMatchers[ j++ ] ) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) );

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if ( tokens.length > 2 && ( token = tokens[ 0 ] ).type === "ID" &&
			context.nodeType === 9 && documentIsHTML && Expr.relative[ tokens[ 1 ].type ] ) {

			context = ( Expr.find[ "ID" ]( token.matches[ 0 ]
				.replace( runescape, funescape ), context ) || [] )[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr[ "needsContext" ].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( Expr.relative[ ( type = token.type ) ] ) {
				break;
			}
			if ( ( find = Expr.find[ type ] ) ) {

				// Search, expanding context for leading sibling combinators
				if ( ( seed = find(
					token.matches[ 0 ].replace( runescape, funescape ),
					rsibling.test( tokens[ 0 ].type ) && testContext( context.parentNode ) ||
						context
				) ) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( el ) {

	// Should return 1, but returns 4 (following)
	return el.compareDocumentPosition( document.createElement( "fieldset" ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// https://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert( function( el ) {
	el.innerHTML = "<a href='#'></a>";
	return el.firstChild.getAttribute( "href" ) === "#";
} ) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	} );
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert( function( el ) {
	el.innerHTML = "<input/>";
	el.firstChild.setAttribute( "value", "" );
	return el.firstChild.getAttribute( "value" ) === "";
} ) ) {
	addHandle( "value", function( elem, _name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	} );
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( el ) {
	return el.getAttribute( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
				( val = elem.getAttributeNode( name ) ) && val.specified ?
					val.value :
					null;
		}
	} );
}

return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;

// Deprecated
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;
jQuery.escapeSelector = Sizzle.escape;




var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undefined;

	while ( ( elem = elem[ dir ] ) && elem.nodeType !== 9 ) {
		if ( elem.nodeType === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n.nextSibling ) {
		if ( n.nodeType === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;



function nodeName( elem, name ) {

  return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();

};
var rsingleTag = ( /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i );



// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			return !!qualifier.call( elem, i, elem ) !== not;
		} );
	}

	// Single element
	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );
	}

	// Arraylike of elements (jQuery, arguments, Array)
	if ( typeof qualifier !== "string" ) {
		return jQuery.grep( elements, function( elem ) {
			return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
		} );
	}

	// Filtered directly for both simple and complex selectors
	return jQuery.filter( qualifier, elements, not );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	if ( elems.length === 1 && elem.nodeType === 1 ) {
		return jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [];
	}

	return jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
		return elem.nodeType === 1;
	} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i, ret,
			len = this.length,
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		ret = this.pushStack( [] );

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		return len > 1 ? jQuery.uniqueSort( ret ) : ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	// Shortcut simple #id case for speed
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[ 1 ],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[ 2 ] );

					if ( elem ) {

						// Inject the element directly into the jQuery object
						this[ 0 ] = elem;
						this.length = 1;
					}
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this[ 0 ] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( isFunction( selector ) ) {
			return root.ready !== undefined ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			targets = typeof selectors !== "string" && jQuery( selectors );

		// Positional selectors never match, since there's no _selection_ context
		if ( !rneedsContext.test( selectors ) ) {
			for ( ; i < l; i++ ) {
				for ( cur = this[ i ]; cur && cur !== context; cur = cur.parentNode ) {

					// Always skip document fragments
					if ( cur.nodeType < 11 && ( targets ?
						targets.index( cur ) > -1 :

						// Don't pass non-elements to Sizzle
						cur.nodeType === 1 &&
							jQuery.find.matchesSelector( cur, selectors ) ) ) {

						matched.push( cur );
						break;
					}
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, _i, until ) {
		return dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, _i, until ) {
		return dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, _i, until ) {
		return dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return siblings( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		if ( elem.contentDocument != null &&

			// Support: IE 11+
			// <object> elements with no `data` attribute has an object
			// `contentDocument` with a `null` prototype.
			getProto( elem.contentDocument ) ) {

			return elem.contentDocument;
		}

		// Support: IE 9 - 11 only, iOS 7 only, Android Browser <=4.3 only
		// Treat the template element as a regular one in browsers that
		// don't support it.
		if ( nodeName( elem, "template" ) ) {
			elem = elem.content || elem;
		}

		return jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );
var rnothtmlwhite = ( /[^\x20\t\r\n\f]+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	jQuery.each( options.match( rnothtmlwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = locked || options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && toType( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory && !firing ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


function Identity( v ) {
	return v;
}
function Thrower( ex ) {
	throw ex;
}

function adoptValue( value, resolve, reject, noValue ) {
	var method;

	try {

		// Check for promise aspect first to privilege synchronous behavior
		if ( value && isFunction( ( method = value.promise ) ) ) {
			method.call( value ).done( resolve ).fail( reject );

		// Other thenables
		} else if ( value && isFunction( ( method = value.then ) ) ) {
			method.call( value, resolve, reject );

		// Other non-thenables
		} else {

			// Control `resolve` arguments by letting Array#slice cast boolean `noValue` to integer:
			// * false: [ value ].slice( 0 ) => resolve( value )
			// * true: [ value ].slice( 1 ) => resolve()
			resolve.apply( undefined, [ value ].slice( noValue ) );
		}

	// For Promises/A+, convert exceptions into rejections
	// Since jQuery.when doesn't unwrap thenables, we can skip the extra checks appearing in
	// Deferred#then to conditionally suppress rejection.
	} catch ( value ) {

		// Support: Android 4.0 only
		// Strict mode functions invoked without .call/.apply get global-object context
		reject.apply( undefined, [ value ] );
	}
}

jQuery.extend( {

	Deferred: function( func ) {
		var tuples = [

				// action, add listener, callbacks,
				// ... .then handlers, argument index, [final state]
				[ "notify", "progress", jQuery.Callbacks( "memory" ),
					jQuery.Callbacks( "memory" ), 2 ],
				[ "resolve", "done", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 0, "resolved" ],
				[ "reject", "fail", jQuery.Callbacks( "once memory" ),
					jQuery.Callbacks( "once memory" ), 1, "rejected" ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				"catch": function( fn ) {
					return promise.then( null, fn );
				},

				// Keep pipe for back-compat
				pipe: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;

					return jQuery.Deferred( function( newDefer ) {
						jQuery.each( tuples, function( _i, tuple ) {

							// Map tuples (progress, done, fail) to arguments (done, fail, progress)
							var fn = isFunction( fns[ tuple[ 4 ] ] ) && fns[ tuple[ 4 ] ];

							// deferred.progress(function() { bind to newDefer or newDefer.notify })
							// deferred.done(function() { bind to newDefer or newDefer.resolve })
							// deferred.fail(function() { bind to newDefer or newDefer.reject })
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer.resolve )
										.fail( newDefer.reject );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},
				then: function( onFulfilled, onRejected, onProgress ) {
					var maxDepth = 0;
					function resolve( depth, deferred, handler, special ) {
						return function() {
							var that = this,
								args = arguments,
								mightThrow = function() {
									var returned, then;

									// Support: Promises/A+ section 2.3.3.3.3
									// https://promisesaplus.com/#point-59
									// Ignore double-resolution attempts
									if ( depth < maxDepth ) {
										return;
									}

									returned = handler.apply( that, args );

									// Support: Promises/A+ section 2.3.1
									// https://promisesaplus.com/#point-48
									if ( returned === deferred.promise() ) {
										throw new TypeError( "Thenable self-resolution" );
									}

									// Support: Promises/A+ sections 2.3.3.1, 3.5
									// https://promisesaplus.com/#point-54
									// https://promisesaplus.com/#point-75
									// Retrieve `then` only once
									then = returned &&

										// Support: Promises/A+ section 2.3.4
										// https://promisesaplus.com/#point-64
										// Only check objects and functions for thenability
										( typeof returned === "object" ||
											typeof returned === "function" ) &&
										returned.then;

									// Handle a returned thenable
									if ( isFunction( then ) ) {

										// Special processors (notify) just wait for resolution
										if ( special ) {
											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special )
											);

										// Normal processors (resolve) also hook into progress
										} else {

											// ...and disregard older resolution values
											maxDepth++;

											then.call(
												returned,
												resolve( maxDepth, deferred, Identity, special ),
												resolve( maxDepth, deferred, Thrower, special ),
												resolve( maxDepth, deferred, Identity,
													deferred.notifyWith )
											);
										}

									// Handle all other returned values
									} else {

										// Only substitute handlers pass on context
										// and multiple values (non-spec behavior)
										if ( handler !== Identity ) {
											that = undefined;
											args = [ returned ];
										}

										// Process the value(s)
										// Default process is resolve
										( special || deferred.resolveWith )( that, args );
									}
								},

								// Only normal processors (resolve) catch and reject exceptions
								process = special ?
									mightThrow :
									function() {
										try {
											mightThrow();
										} catch ( e ) {

											if ( jQuery.Deferred.exceptionHook ) {
												jQuery.Deferred.exceptionHook( e,
													process.stackTrace );
											}

											// Support: Promises/A+ section 2.3.3.3.4.1
											// https://promisesaplus.com/#point-61
											// Ignore post-resolution exceptions
											if ( depth + 1 >= maxDepth ) {

												// Only substitute handlers pass on context
												// and multiple values (non-spec behavior)
												if ( handler !== Thrower ) {
													that = undefined;
													args = [ e ];
												}

												deferred.rejectWith( that, args );
											}
										}
									};

							// Support: Promises/A+ section 2.3.3.3.1
							// https://promisesaplus.com/#point-57
							// Re-resolve promises immediately to dodge false rejection from
							// subsequent errors
							if ( depth ) {
								process();
							} else {

								// Call an optional hook to record the stack, in case of exception
								// since it's otherwise lost when execution goes async
								if ( jQuery.Deferred.getStackHook ) {
									process.stackTrace = jQuery.Deferred.getStackHook();
								}
								window.setTimeout( process );
							}
						};
					}

					return jQuery.Deferred( function( newDefer ) {

						// progress_handlers.add( ... )
						tuples[ 0 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onProgress ) ?
									onProgress :
									Identity,
								newDefer.notifyWith
							)
						);

						// fulfilled_handlers.add( ... )
						tuples[ 1 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onFulfilled ) ?
									onFulfilled :
									Identity
							)
						);

						// rejected_handlers.add( ... )
						tuples[ 2 ][ 3 ].add(
							resolve(
								0,
								newDefer,
								isFunction( onRejected ) ?
									onRejected :
									Thrower
							)
						);
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 5 ];

			// promise.progress = list.add
			// promise.done = list.add
			// promise.fail = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(
					function() {

						// state = "resolved" (i.e., fulfilled)
						// state = "rejected"
						state = stateString;
					},

					// rejected_callbacks.disable
					// fulfilled_callbacks.disable
					tuples[ 3 - i ][ 2 ].disable,

					// rejected_handlers.disable
					// fulfilled_handlers.disable
					tuples[ 3 - i ][ 3 ].disable,

					// progress_callbacks.lock
					tuples[ 0 ][ 2 ].lock,

					// progress_handlers.lock
					tuples[ 0 ][ 3 ].lock
				);
			}

			// progress_handlers.fire
			// fulfilled_handlers.fire
			// rejected_handlers.fire
			list.add( tuple[ 3 ].fire );

			// deferred.notify = function() { deferred.notifyWith(...) }
			// deferred.resolve = function() { deferred.resolveWith(...) }
			// deferred.reject = function() { deferred.rejectWith(...) }
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? undefined : this, arguments );
				return this;
			};

			// deferred.notifyWith = list.fireWith
			// deferred.resolveWith = list.fireWith
			// deferred.rejectWith = list.fireWith
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( singleValue ) {
		var

			// count of uncompleted subordinates
			remaining = arguments.length,

			// count of unprocessed arguments
			i = remaining,

			// subordinate fulfillment data
			resolveContexts = Array( i ),
			resolveValues = slice.call( arguments ),

			// the master Deferred
			master = jQuery.Deferred(),

			// subordinate callback factory
			updateFunc = function( i ) {
				return function( value ) {
					resolveContexts[ i ] = this;
					resolveValues[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( !( --remaining ) ) {
						master.resolveWith( resolveContexts, resolveValues );
					}
				};
			};

		// Single- and empty arguments are adopted like Promise.resolve
		if ( remaining <= 1 ) {
			adoptValue( singleValue, master.done( updateFunc( i ) ).resolve, master.reject,
				!remaining );

			// Use .then() to unwrap secondary thenables (cf. gh-3000)
			if ( master.state() === "pending" ||
				isFunction( resolveValues[ i ] && resolveValues[ i ].then ) ) {

				return master.then();
			}
		}

		// Multiple arguments are aggregated like Promise.all array elements
		while ( i-- ) {
			adoptValue( resolveValues[ i ], updateFunc( i ), master.reject );
		}

		return master.promise();
	}
} );


// These usually indicate a programmer mistake during development,
// warn about them ASAP rather than swallowing them by default.
var rerrorNames = /^(Eval|Internal|Range|Reference|Syntax|Type|URI)Error$/;

jQuery.Deferred.exceptionHook = function( error, stack ) {

	// Support: IE 8 - 9 only
	// Console exists when dev tools are open, which can happen at any time
	if ( window.console && window.console.warn && error && rerrorNames.test( error.name ) ) {
		window.console.warn( "jQuery.Deferred exception: " + error.message, error.stack, stack );
	}
};




jQuery.readyException = function( error ) {
	window.setTimeout( function() {
		throw error;
	} );
};




// The deferred used on DOM ready
var readyList = jQuery.Deferred();

jQuery.fn.ready = function( fn ) {

	readyList
		.then( fn )

		// Wrap jQuery.readyException in a function so that the lookup
		// happens at the time of error handling instead of callback
		// registration.
		.catch( function( error ) {
			jQuery.readyException( error );
		} );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );
	}
} );

jQuery.ready.then = readyList.then;

// The ready event handler and self cleanup method
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed );
	window.removeEventListener( "load", completed );
	jQuery.ready();
}

// Catch cases where $(document).ready() is called
// after the browser event has already occurred.
// Support: IE <=9 - 10 only
// Older IE sometimes signals "interactive" too soon
if ( document.readyState === "complete" ||
	( document.readyState !== "loading" && !document.documentElement.doScroll ) ) {

	// Handle it asynchronously to allow scripts the opportunity to delay ready
	window.setTimeout( jQuery.ready );

} else {

	// Use the handy event callback
	document.addEventListener( "DOMContentLoaded", completed );

	// A fallback to window.onload, that will always work
	window.addEventListener( "load", completed );
}




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( toType( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, _key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	if ( chainable ) {
		return elems;
	}

	// Gets
	if ( bulk ) {
		return fn.call( elems );
	}

	return len ? fn( elems[ 0 ], key ) : emptyGet;
};


// Matches dashed string for camelizing
var rmsPrefix = /^-ms-/,
	rdashAlpha = /-([a-z])/g;

// Used by camelCase as callback to replace()
function fcamelCase( _all, letter ) {
	return letter.toUpperCase();
}

// Convert dashed to camelCase; used by the css and data modules
// Support: IE <=9 - 11, Edge 12 - 15
// Microsoft forgot to hump their vendor prefix (#9572)
function camelCase( string ) {
	return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
}
var acceptData = function( owner ) {

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	cache: function( owner ) {

		// Check if the owner object already has a cache
		var value = owner[ this.expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner.nodeType ) {
					owner[ this.expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, this.expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		// Always use camelCase key (gh-2257)
		if ( typeof data === "string" ) {
			cache[ camelCase( data ) ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ camelCase( prop ) ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		return key === undefined ?
			this.cache( owner ) :

			// Always use camelCase key (gh-2257)
			owner[ this.expando ] && owner[ this.expando ][ camelCase( key ) ];
	},
	access: function( owner, key, value ) {

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				( ( key && typeof key === "string" ) && value === undefined ) ) {

			return this.get( owner, key );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i,
			cache = owner[ this.expando ];

		if ( cache === undefined ) {
			return;
		}

		if ( key !== undefined ) {

			// Support array or space separated string of keys
			if ( Array.isArray( key ) ) {

				// If key is an array of keys...
				// We always set camelCase keys, so remove that.
				key = key.map( camelCase );
			} else {
				key = camelCase( key );

				// If a key with the spaces exists, use it.
				// Otherwise, create an array by matching non-whitespace
				key = key in cache ?
					[ key ] :
					( key.match( rnothtmlwhite ) || [] );
			}

			i = key.length;

			while ( i-- ) {
				delete cache[ key[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undefined || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <=35 - 45
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://bugs.chromium.org/p/chromium/issues/detail?id=378607 (bug restricted)
			if ( owner.nodeType ) {
				owner[ this.expando ] = undefined;
			} else {
				delete owner[ this.expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undefined && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function getData( data ) {
	if ( data === "true" ) {
		return true;
	}

	if ( data === "false" ) {
		return false;
	}

	if ( data === "null" ) {
		return null;
	}

	// Only convert to a number if it doesn't change the string
	if ( data === +data + "" ) {
		return +data;
	}

	if ( rbrace.test( data ) ) {
		return JSON.parse( data );
	}

	return data;
}

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$&" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = getData( data );
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = dataUser.get( elem );

				if ( elem.nodeType === 1 && !dataPriv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE 11 only
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( this, function( value ) {
			var data;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {

				// Attempt to get data from the cache
				// The key will always be camelCased in Data
				data = dataUser.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each( function() {

				// We always store the camelCased key
				dataUser.set( this, key, value );
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || Array.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undefined ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var documentElement = document.documentElement;



	var isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem );
		},
		composed = { composed: true };

	// Support: IE 9 - 11+, Edge 12 - 18+, iOS 10.0 - 10.2 only
	// Check attachment across shadow DOM boundaries when possible (gh-3504)
	// Support: iOS 10.0-10.2 only
	// Early iOS 10 versions support `attachShadow` but not `getRootNode`,
	// leading to errors. We need to check for `getRootNode`.
	if ( documentElement.getRootNode ) {
		isAttached = function( elem ) {
			return jQuery.contains( elem.ownerDocument, elem ) ||
				elem.getRootNode( composed ) === elem.ownerDocument;
		};
	}
var isHiddenWithinTree = function( elem, el ) {

		// isHiddenWithinTree might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;

		// Inline style trumps all
		return elem.style.display === "none" ||
			elem.style.display === "" &&

			// Otherwise, check computed style
			// Support: Firefox <=43 - 45
			// Disconnected elements can have computed display: none, so first confirm that elem is
			// in the document.
			isAttached( elem ) &&

			jQuery.css( elem, "display" ) === "none";
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted, scale,
		maxIterations = 20,
		currentValue = tween ?
			function() {
				return tween.cur();
			} :
			function() {
				return jQuery.css( elem, prop, "" );
			},
		initial = currentValue(),
		unit = valueParts && valueParts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = elem.nodeType &&
			( jQuery.cssNumber[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Support: Firefox <=54
		// Halve the iteration target value to prevent interference from CSS upper bounds (gh-2144)
		initial = initial / 2;

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		while ( maxIterations-- ) {

			// Evaluate and update our best guess (doubling guesses that zero out).
			// Finish if the scale equals or crosses 1 (making the old*new product non-positive).
			jQuery.style( elem, prop, initialInUnit + unit );
			if ( ( 1 - scale ) * ( 1 - ( scale = currentValue() / initial || 0.5 ) ) <= 0 ) {
				maxIterations = 0;
			}
			initialInUnit = initialInUnit / scale;

		}

		initialInUnit = initialInUnit * 2;
		jQuery.style( elem, prop, initialInUnit + unit );

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}


var defaultDisplayMap = {};

function getDefaultDisplay( elem ) {
	var temp,
		doc = elem.ownerDocument,
		nodeName = elem.nodeName,
		display = defaultDisplayMap[ nodeName ];

	if ( display ) {
		return display;
	}

	temp = doc.body.appendChild( doc.createElement( nodeName ) );
	display = jQuery.css( temp, "display" );

	temp.parentNode.removeChild( temp );

	if ( display === "none" ) {
		display = "block";
	}
	defaultDisplayMap[ nodeName ] = display;

	return display;
}

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		display = elem.style.display;
		if ( show ) {

			// Since we force visibility upon cascade-hidden elements, an immediate (and slow)
			// check is required in this first loop unless we have a nonempty display value (either
			// inline or about-to-be-restored)
			if ( display === "none" ) {
				values[ index ] = dataPriv.get( elem, "display" ) || null;
				if ( !values[ index ] ) {
					elem.style.display = "";
				}
			}
			if ( elem.style.display === "" && isHiddenWithinTree( elem ) ) {
				values[ index ] = getDefaultDisplay( elem );
			}
		} else {
			if ( display !== "none" ) {
				values[ index ] = "none";

				// Remember what we're overwriting
				dataPriv.set( elem, "display", display );
			}
		}
	}

	// Set the display of the elements in a second loop to avoid constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ].style.display = values[ index ];
		}
	}

	return elements;
}

jQuery.fn.extend( {
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			if ( isHiddenWithinTree( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		} );
	}
} );
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([a-z][^\/\0>\x20\t\r\n\f]*)/i );

var rscriptType = ( /^$|^module$|\/(?:java|ecma)script/i );



( function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Android 4.0 - 4.3 only
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Android <=4.1 only
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE <=11 only
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;

	// Support: IE <=9 only
	// IE <=9 replaces <option> tags with their contents when inserted outside of
	// the select element.
	div.innerHTML = "<option></option>";
	support.option = !!div.lastChild;
} )();


// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: IE <=9 only
if ( !support.option ) {
	wrapMap.optgroup = wrapMap.option = [ 1, "<select multiple='multiple'>", "</select>" ];
}


function getAll( context, tag ) {

	// Support: IE <=9 - 11 only
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var ret;

	if ( typeof context.getElementsByTagName !== "undefined" ) {
		ret = context.getElementsByTagName( tag || "*" );

	} else if ( typeof context.querySelectorAll !== "undefined" ) {
		ret = context.querySelectorAll( tag || "*" );

	} else {
		ret = [];
	}

	if ( tag === undefined || tag && nodeName( context, tag ) ) {
		return jQuery.merge( [ context ], ret );
	}

	return ret;
}


// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			"globalEval",
			!refElements || dataPriv.get( refElements[ i ], "globalEval" )
		);
	}
}


var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, attached, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( toType( elem ) === "object" ) {

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment.appendChild( context.createElement( "div" ) );

				// Deserialize a standard representation
				tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp.lastChild;
				}

				// Support: Android <=4.0 only, PhantomJS 1 only
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment.firstChild;

				// Ensure the created nodes are orphaned (#12392)
				tmp.textContent = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment.textContent = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		attached = isAttached( elem );

		// Append to fragment
		tmp = getAll( fragment.appendChild( elem ), "script" );

		// Preserve script evaluation history
		if ( attached ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE <=9 - 11+
// focus() and blur() are asynchronous, except when they are no-op.
// So expect focus to be synchronous when the element is already active,
// and blur to be synchronous when the element is not already active.
// (focus and blur are always synchronous in other supported browsers,
// this just defines when we can count on it).
function expectSync( elem, type ) {
	return ( elem === safeActiveElement() ) === ( type === "focus" );
}

// Support: IE <=9 only
// Accessing document.activeElement can throw unexpectedly
// https://bugs.jquery.com/ticket/13393
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeof types === "object" ) {

		// ( types-Object, selector, data )
		if ( typeof selector !== "string" ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undefined;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undefined;
	} else if ( fn == null ) {
		if ( typeof selector === "string" ) {

			// ( types, selector, fn )
			fn = data;
			data = undefined;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undefined;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Only attach events to objects that accept data
		if ( !acceptData( elem ) ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Ensure that invalid selectors throw exceptions at attach time
		// Evaluate against documentElement in case elem is a non-element node (e.g., document)
		if ( selector ) {
			jQuery.find.matchesSelector( documentElement, selector );
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = Object.create( null );
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== "undefined" && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnothtmlwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( nativeEvent ) {

		var i, j, ret, matched, handleObj, handlerQueue,
			args = new Array( arguments.length ),

			// Make a writable jQuery.Event from the native event object
			event = jQuery.event.fix( nativeEvent ),

			handlers = (
					dataPriv.get( this, "events" ) || Object.create( null )
				)[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;

		for ( i = 1; i < arguments.length; i++ ) {
			args[ i ] = arguments[ i ];
		}

		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// If the event is namespaced, then each handler is only invoked if it is
				// specially universal or its namespaces are a superset of the event's.
				if ( !event.rnamespace || handleObj.namespace === false ||
					event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, handleObj, sel, matchedHandlers, matchedSelectors,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		if ( delegateCount &&

			// Support: IE <=9
			// Black-hole SVG <use> instance trees (trac-13180)
			cur.nodeType &&

			// Support: Firefox <=42
			// Suppress spec-violating clicks indicating a non-primary pointer button (trac-3861)
			// https://www.w3.org/TR/DOM-Level-3-Events/#event-type-click
			// Support: IE 11 only
			// ...but not arrow key "clicks" of radio inputs, which can have `button` -1 (gh-2343)
			!( event.type === "click" && event.button >= 1 ) ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.nodeType === 1 && !( event.type === "click" && cur.disabled === true ) ) {
					matchedHandlers = [];
					matchedSelectors = {};
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matchedSelectors[ sel ] === undefined ) {
							matchedSelectors[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matchedSelectors[ sel ] ) {
							matchedHandlers.push( handleObj );
						}
					}
					if ( matchedHandlers.length ) {
						handlerQueue.push( { elem: cur, handlers: matchedHandlers } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		cur = this;
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: cur, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	addProp: function( name, hook ) {
		Object.defineProperty( jQuery.Event.prototype, name, {
			enumerable: true,
			configurable: true,

			get: isFunction( hook ) ?
				function() {
					if ( this.originalEvent ) {
							return hook( this.originalEvent );
					}
				} :
				function() {
					if ( this.originalEvent ) {
							return this.originalEvent[ name ];
					}
				},

			set: function( value ) {
				Object.defineProperty( this, name, {
					enumerable: true,
					configurable: true,
					writable: true,
					value: value
				} );
			}
		} );
	},

	fix: function( originalEvent ) {
		return originalEvent[ jQuery.expando ] ?
			originalEvent :
			new jQuery.Event( originalEvent );
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		click: {

			// Utilize native event to ensure correct state for checkable inputs
			setup: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Claim the first handler
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					// dataPriv.set( el, "click", ... )
					leverageNative( el, "click", returnTrue );
				}

				// Return false to allow normal processing in the caller
				return false;
			},
			trigger: function( data ) {

				// For mutual compressibility with _default, replace `this` access with a local var.
				// `|| data` is dead code meant only to preserve the variable through minification.
				var el = this || data;

				// Force setup before triggering a click
				if ( rcheckableType.test( el.type ) &&
					el.click && nodeName( el, "input" ) ) {

					leverageNative( el, "click" );
				}

				// Return non-false to allow normal event-path propagation
				return true;
			},

			// For cross-browser consistency, suppress native .click() on links
			// Also prevent it if we're currently inside a leveraged native-event stack
			_default: function( event ) {
				var target = event.target;
				return rcheckableType.test( target.type ) &&
					target.click && nodeName( target, "input" ) &&
					dataPriv.get( target, "click" ) ||
					nodeName( target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

// Ensure the presence of an event listener that handles manually-triggered
// synthetic events by interrupting progress until reinvoked in response to
// *native* events that it fires directly, ensuring that state changes have
// already occurred before other listeners are invoked.
function leverageNative( el, type, expectSync ) {

	// Missing expectSync indicates a trigger call, which must force setup through jQuery.event.add
	if ( !expectSync ) {
		if ( dataPriv.get( el, type ) === undefined ) {
			jQuery.event.add( el, type, returnTrue );
		}
		return;
	}

	// Register the controller as a special universal handler for all event namespaces
	dataPriv.set( el, type, false );
	jQuery.event.add( el, type, {
		namespace: false,
		handler: function( event ) {
			var notAsync, result,
				saved = dataPriv.get( this, type );

			if ( ( event.isTrigger & 1 ) && this[ type ] ) {

				// Interrupt processing of the outer synthetic .trigger()ed event
				// Saved data should be false in such cases, but might be a leftover capture object
				// from an async native handler (gh-4350)
				if ( !saved.length ) {

					// Store arguments for use when handling the inner native event
					// There will always be at least one argument (an event object), so this array
					// will not be confused with a leftover capture object.
					saved = slice.call( arguments );
					dataPriv.set( this, type, saved );

					// Trigger the native event and capture its result
					// Support: IE <=9 - 11+
					// focus() and blur() are asynchronous
					notAsync = expectSync( this, type );
					this[ type ]();
					result = dataPriv.get( this, type );
					if ( saved !== result || notAsync ) {
						dataPriv.set( this, type, false );
					} else {
						result = {};
					}
					if ( saved !== result ) {

						// Cancel the outer synthetic event
						event.stopImmediatePropagation();
						event.preventDefault();
						return result.value;
					}

				// If this is an inner synthetic event for an event with a bubbling surrogate
				// (focus or blur), assume that the surrogate already propagated from triggering the
				// native event and prevent that from happening again here.
				// This technically gets the ordering wrong w.r.t. to `.trigger()` (in which the
				// bubbling surrogate propagates *after* the non-bubbling base), but that seems
				// less bad than duplication.
				} else if ( ( jQuery.event.special[ type ] || {} ).delegateType ) {
					event.stopPropagation();
				}

			// If this is a native event triggered above, everything is now in order
			// Fire an inner synthetic event with the original arguments
			} else if ( saved.length ) {

				// ...and capture the result
				dataPriv.set( this, type, {
					value: jQuery.event.trigger(

						// Support: IE <=9 - 11+
						// Extend with the prototype to reset the above stopImmediatePropagation()
						jQuery.extend( saved[ 0 ], jQuery.Event.prototype ),
						saved.slice( 1 ),
						this
					)
				} );

				// Abort handling of the native event
				event.stopImmediatePropagation();
			}
		}
	} );
}

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&

				// Support: Android <=2.3 only
				src.returnValue === false ?
			returnTrue :
			returnFalse;

		// Create target properties
		// Support: Safari <=6 - 7 only
		// Target should not be a text node (#504, #13143)
		this.target = ( src.target && src.target.nodeType === 3 ) ?
			src.target.parentNode :
			src.target;

		this.currentTarget = src.currentTarget;
		this.relatedTarget = src.relatedTarget;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || Date.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// https://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && !this.isSimulated ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Includes all common event props including KeyEvent and MouseEvent specific props
jQuery.each( {
	altKey: true,
	bubbles: true,
	cancelable: true,
	changedTouches: true,
	ctrlKey: true,
	detail: true,
	eventPhase: true,
	metaKey: true,
	pageX: true,
	pageY: true,
	shiftKey: true,
	view: true,
	"char": true,
	code: true,
	charCode: true,
	key: true,
	keyCode: true,
	button: true,
	buttons: true,
	clientX: true,
	clientY: true,
	offsetX: true,
	offsetY: true,
	pointerId: true,
	pointerType: true,
	screenX: true,
	screenY: true,
	targetTouches: true,
	toElement: true,
	touches: true,

	which: function( event ) {
		var button = event.button;

		// Add which for key events
		if ( event.which == null && rkeyEvent.test( event.type ) ) {
			return event.charCode != null ? event.charCode : event.keyCode;
		}

		// Add which for click: 1 === left; 2 === middle; 3 === right
		if ( !event.which && button !== undefined && rmouseEvent.test( event.type ) ) {
			if ( button & 1 ) {
				return 1;
			}

			if ( button & 2 ) {
				return 3;
			}

			if ( button & 4 ) {
				return 2;
			}

			return 0;
		}

		return event.which;
	}
}, jQuery.event.addProp );

jQuery.each( { focus: "focusin", blur: "focusout" }, function( type, delegateType ) {
	jQuery.event.special[ type ] = {

		// Utilize native event if possible so blur/focus sequence is correct
		setup: function() {

			// Claim the first handler
			// dataPriv.set( this, "focus", ... )
			// dataPriv.set( this, "blur", ... )
			leverageNative( this, type, expectSync );

			// Return false to allow normal processing in the caller
			return false;
		},
		trigger: function() {

			// Force setup before trigger
			leverageNative( this, type );

			// Return non-false to allow normal event-path propagation
			return true;
		},

		delegateType: delegateType
	};
} );

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://bugs.chromium.org/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {

	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {

			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


var

	// Support: IE <=10 - 11, Edge 12 - 13 only
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Prefer a tbody over its parent table for containing new rows
function manipulationTarget( elem, content ) {
	if ( nodeName( elem, "table" ) &&
		nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ) {

		return jQuery( elem ).children( "tbody" )[ 0 ] || elem;
	}

	return elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem.getAttribute( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	if ( ( elem.type || "" ).slice( 0, 5 ) === "true/" ) {
		elem.type = elem.type.slice( 5 );
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.get( src );
		events = pdataOld.events;

		if ( events ) {
			dataPriv.remove( dest, "handle events" );

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = flat( args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		valueIsFunction = isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( valueIsFunction ||
			( l > 1 && typeof value === "string" &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( valueIsFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android <=4.0 only, PhantomJS 1 only
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, "script" ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ].ownerDocument;

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src && ( node.type || "" ).toLowerCase()  !== "module" ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl && !node.noModule ) {
								jQuery._evalUrl( node.src, {
									nonce: node.nonce || node.getAttribute( "nonce" )
								}, doc );
							}
						} else {
							DOMEval( node.textContent.replace( rcleanScript, "" ), node, doc );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node.nodeType === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node.parentNode ) {
			if ( keepData && isAttached( node ) ) {
				setGlobalEval( getAll( node, "script" ) );
			}
			node.parentNode.removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return html;
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = isAttached( elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: https://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undefined; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv.expando ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv.expando ] = undefined;
				}
				if ( elem[ dataUser.expando ] ) {

					// Support: Chrome <=35 - 45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser.expando ] = undefined;
				}
			}
		}
	}
} );

jQuery.fn.extend( {
	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each( function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var parent = this.parentNode;

			if ( jQuery.inArray( this, ignored ) < 0 ) {
				jQuery.cleanData( getAll( this ) );
				if ( parent ) {
					parent.replaceChild( elem, this );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: Android <=4.0 only, PhantomJS 1 only
			// .get() because push.apply(_, arraylike) throws on ancient WebKit
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );
var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE <=11 only, Firefox <=30 (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem.ownerDocument.defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.call( elem );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var rboxStyle = new RegExp( cssExpand.join( "|" ), "i" );



( function() {

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {

		// This is a singleton, we need to execute it only once
		if ( !div ) {
			return;
		}

		container.style.cssText = "position:absolute;left:-11111px;width:60px;" +
			"margin-top:1px;padding:0;border:0";
		div.style.cssText =
			"position:relative;display:block;box-sizing:border-box;overflow:scroll;" +
			"margin:auto;border:1px;padding:1px;" +
			"width:60%;top:1%";
		documentElement.appendChild( container ).appendChild( div );

		var divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";

		// Support: Android 4.0 - 4.3 only, Firefox <=3 - 44
		reliableMarginLeftVal = roundPixelMeasures( divStyle.marginLeft ) === 12;

		// Support: Android 4.0 - 4.3 only, Safari <=9.1 - 10.1, iOS <=7.0 - 9.3
		// Some styles come back with percentage values, even though they shouldn't
		div.style.right = "60%";
		pixelBoxStylesVal = roundPixelMeasures( divStyle.right ) === 36;

		// Support: IE 9 - 11 only
		// Detect misreporting of content dimensions for box-sizing:border-box elements
		boxSizingReliableVal = roundPixelMeasures( divStyle.width ) === 36;

		// Support: IE 9 only
		// Detect overflow:scroll screwiness (gh-3699)
		// Support: Chrome <=64
		// Don't get tricked when zoom affects offsetWidth (gh-4029)
		div.style.position = "absolute";
		scrollboxSizeVal = roundPixelMeasures( div.offsetWidth / 3 ) === 12;

		documentElement.removeChild( container );

		// Nullify the div so it wouldn't be stored in the memory and
		// it will also be a sign that checks already performed
		div = null;
	}

	function roundPixelMeasures( measure ) {
		return Math.round( parseFloat( measure ) );
	}

	var pixelPositionVal, boxSizingReliableVal, scrollboxSizeVal, pixelBoxStylesVal,
		reliableTrDimensionsVal, reliableMarginLeftVal,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	// Finish early in limited (non-browser) environments
	if ( !div.style ) {
		return;
	}

	// Support: IE <=9 - 11 only
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	jQuery.extend( support, {
		boxSizingReliable: function() {
			computeStyleTests();
			return boxSizingReliableVal;
		},
		pixelBoxStyles: function() {
			computeStyleTests();
			return pixelBoxStylesVal;
		},
		pixelPosition: function() {
			computeStyleTests();
			return pixelPositionVal;
		},
		reliableMarginLeft: function() {
			computeStyleTests();
			return reliableMarginLeftVal;
		},
		scrollboxSize: function() {
			computeStyleTests();
			return scrollboxSizeVal;
		},

		// Support: IE 9 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Behavior in IE 9 is more subtle than in newer versions & it passes
		// some versions of this test; make sure not to make it pass there!
		reliableTrDimensions: function() {
			var table, tr, trChild, trStyle;
			if ( reliableTrDimensionsVal == null ) {
				table = document.createElement( "table" );
				tr = document.createElement( "tr" );
				trChild = document.createElement( "div" );

				table.style.cssText = "position:absolute;left:-11111px";
				tr.style.height = "1px";
				trChild.style.height = "9px";

				documentElement
					.appendChild( table )
					.appendChild( tr )
					.appendChild( trChild );

				trStyle = window.getComputedStyle( tr );
				reliableTrDimensionsVal = parseInt( trStyle.height ) > 3;

				documentElement.removeChild( table );
			}
			return reliableTrDimensionsVal;
		}
	} );
} )();


function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,

		// Support: Firefox 51+
		// Retrieving style before computed somehow
		// fixes an issue with getting wrong values
		// on detached elements
		style = elem.style;

	computed = computed || getStyles( elem );

	// getPropertyValue is needed for:
	//   .css('filter') (IE 9 only, #12537)
	//   .css('--customProperty) (#3144)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];

		if ( ret === "" && !isAttached( elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// https://drafts.csswg.org/cssom/#resolved-values
		if ( !support.pixelBoxStyles() && rnumnonpx.test( ret ) && rboxStyle.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?

		// Support: IE <=9 - 11 only
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var cssPrefixes = [ "Webkit", "Moz", "ms" ],
	emptyStyle = document.createElement( "div" ).style,
	vendorProps = {};

// Return a vendor-prefixed property or undefined
function vendorPropName( name ) {

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

// Return a potentially-mapped jQuery.cssProps or vendor prefixed property
function finalPropName( name ) {
	var final = jQuery.cssProps[ name ] || vendorProps[ name ];

	if ( final ) {
		return final;
	}
	if ( name in emptyStyle ) {
		return name;
	}
	return vendorProps[ name ] = vendorPropName( name ) || name;
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rcustomProp = /^--/,
	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	};

function setPositiveNumber( _elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function boxModelAdjustment( elem, dimension, box, isBorderBox, styles, computedVal ) {
	var i = dimension === "width" ? 1 : 0,
		extra = 0,
		delta = 0;

	// Adjustment may not be necessary
	if ( box === ( isBorderBox ? "border" : "content" ) ) {
		return 0;
	}

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin
		if ( box === "margin" ) {
			delta += jQuery.css( elem, box + cssExpand[ i ], true, styles );
		}

		// If we get here with a content-box, we're seeking "padding" or "border" or "margin"
		if ( !isBorderBox ) {

			// Add padding
			delta += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// For "border" or "margin", add border
			if ( box !== "padding" ) {
				delta += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );

			// But still keep track of it otherwise
			} else {
				extra += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}

		// If we get here with a border-box (content + padding + border), we're seeking "content" or
		// "padding" or "margin"
		} else {

			// For "content", subtract padding
			if ( box === "content" ) {
				delta -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// For "content" or "padding", subtract border
			if ( box !== "margin" ) {
				delta -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	// Account for positive content-box scroll gutter when requested by providing computedVal
	if ( !isBorderBox && computedVal >= 0 ) {

		// offsetWidth/offsetHeight is a rounded sum of content, padding, scroll gutter, and border
		// Assuming integer scroll gutter, subtract the rest and round down
		delta += Math.max( 0, Math.ceil(
			elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
			computedVal -
			delta -
			extra -
			0.5

		// If offsetWidth/offsetHeight is unknown, then we can't determine content-box scroll gutter
		// Use an explicit zero to avoid NaN (gh-3964)
		) ) || 0;
	}

	return delta;
}

function getWidthOrHeight( elem, dimension, extra ) {

	// Start with computed style
	var styles = getStyles( elem ),

		// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-4322).
		// Fake content-box until we know it's needed to know the true value.
		boxSizingNeeded = !support.boxSizingReliable() || extra,
		isBorderBox = boxSizingNeeded &&
			jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
		valueIsBorderBox = isBorderBox,

		val = curCSS( elem, dimension, styles ),
		offsetProp = "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 );

	// Support: Firefox <=54
	// Return a confounding non-pixel value or feign ignorance, as appropriate.
	if ( rnumnonpx.test( val ) ) {
		if ( !extra ) {
			return val;
		}
		val = "auto";
	}


	// Support: IE 9 - 11 only
	// Use offsetWidth/offsetHeight for when box sizing is unreliable.
	// In those cases, the computed value can be trusted to be border-box.
	if ( ( !support.boxSizingReliable() && isBorderBox ||

		// Support: IE 10 - 11+, Edge 15 - 18+
		// IE/Edge misreport `getComputedStyle` of table rows with width/height
		// set in CSS while `offset*` properties report correct values.
		// Interestingly, in some cases IE 9 doesn't suffer from this issue.
		!support.reliableTrDimensions() && nodeName( elem, "tr" ) ||

		// Fall back to offsetWidth/offsetHeight when value is "auto"
		// This happens for inline elements with no explicit setting (gh-3571)
		val === "auto" ||

		// Support: Android <=4.1 - 4.3 only
		// Also use offsetWidth/offsetHeight for misreported inline dimensions (gh-3602)
		!parseFloat( val ) && jQuery.css( elem, "display", false, styles ) === "inline" ) &&

		// Make sure the element is visible & connected
		elem.getClientRects().length ) {

		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

		// Where available, offsetWidth/offsetHeight approximate border box dimensions.
		// Where not available (e.g., SVG), assume unreliable box-sizing and interpret the
		// retrieved value as a content box dimension.
		valueIsBorderBox = offsetProp in elem;
		if ( valueIsBorderBox ) {
			val = elem[ offsetProp ];
		}
	}

	// Normalize "" and auto
	val = parseFloat( val ) || 0;

	// Adjust for the element's box model
	return ( val +
		boxModelAdjustment(
			elem,
			dimension,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles,

			// Provide the current computed size to request scroll gutter calculation (gh-3589)
			val
		)
	) + "px";
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"animationIterationCount": true,
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"gridArea": true,
		"gridColumn": true,
		"gridColumnEnd": true,
		"gridColumnStart": true,
		"gridRow": true,
		"gridRowEnd": true,
		"gridRowStart": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name ),
			style = elem.style;

		// Make sure that we're working with the right name. We don't
		// want to query the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			// The isCustomProp check can be removed in jQuery 4.0 when we only auto-append
			// "px" to a few hardcoded values.
			if ( type === "number" && !isCustomProp ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undefined ) {

				if ( isCustomProp ) {
					style.setProperty( name, value );
				} else {
					style[ name ] = value;
				}
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undefined ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = camelCase( name ),
			isCustomProp = rcustomProp.test( name );

		// Make sure that we're working with the right name. We don't
		// want to modify the value if it is a CSS custom property
		// since they are user-defined.
		if ( !isCustomProp ) {
			name = finalPropName( origName );
		}

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}

		return val;
	}
} );

jQuery.each( [ "height", "width" ], function( _i, dimension ) {
	jQuery.cssHooks[ dimension ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&

					// Support: Safari 8+
					// Table columns in Safari have non-zero offsetWidth & zero
					// getBoundingClientRect().width unless display is changed.
					// Support: IE <=11 only
					// Running getBoundingClientRect on a disconnected node
					// in IE throws an error.
					( !elem.getClientRects().length || !elem.getBoundingClientRect().width ) ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, dimension, extra );
						} ) :
						getWidthOrHeight( elem, dimension, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = getStyles( elem ),

				// Only read styles.position if the test has a chance to fail
				// to avoid forcing a reflow.
				scrollboxSizeBuggy = !support.scrollboxSize() &&
					styles.position === "absolute",

				// To avoid forcing a reflow, only fetch boxSizing if we need it (gh-3991)
				boxSizingNeeded = scrollboxSizeBuggy || extra,
				isBorderBox = boxSizingNeeded &&
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
				subtract = extra ?
					boxModelAdjustment(
						elem,
						dimension,
						extra,
						isBorderBox,
						styles
					) :
					0;

			// Account for unreliable border-box dimensions by comparing offset* to computed and
			// faking a content-box to get border and padding (gh-3699)
			if ( isBorderBox && scrollboxSizeBuggy ) {
				subtract -= Math.ceil(
					elem[ "offset" + dimension[ 0 ].toUpperCase() + dimension.slice( 1 ) ] -
					parseFloat( styles[ dimension ] ) -
					boxModelAdjustment( elem, dimension, "border", false, styles ) -
					0.5
				);
			}

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ dimension ] = value;
				value = jQuery.css( elem, dimension );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( prefix !== "margin" ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( Array.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( tween.elem.nodeType !== 1 ||
				tween.elem[ tween.prop ] != null && tween.elem.style[ tween.prop ] == null ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.nodeType === 1 && (
					jQuery.cssHooks[ tween.prop ] ||
					tween.elem.style[ finalPropName( tween.prop ) ] != null ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE <=9 only
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, inProgress,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

function schedule() {
	if ( inProgress ) {
		if ( document.hidden === false && window.requestAnimationFrame ) {
			window.requestAnimationFrame( schedule );
		} else {
			window.setTimeout( schedule, jQuery.fx.interval );
		}

		jQuery.fx.tick();
	}
}

// Animations created synchronously will run synchronously
function createFxNow() {
	window.setTimeout( function() {
		fxNow = undefined;
	} );
	return ( fxNow = Date.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( Animation.tweeners[ prop ] || [] ).concat( Animation.tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	var prop, value, toggle, hooks, oldfire, propTween, restoreDisplay, display,
		isBox = "width" in props || "height" in props,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHiddenWithinTree( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Queue-skipping animations hijack the fx hooks
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Detect show/hide animations
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.test( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// Pretend to be hidden if this is a "show" and
				// there is still data from a stopped show/hide
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;

				// Ignore all other no-op show/hide data
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );
		}
	}

	// Bail out if this is a no-op like .hide().hide()
	propTween = !jQuery.isEmptyObject( props );
	if ( !propTween && jQuery.isEmptyObject( orig ) ) {
		return;
	}

	// Restrict "overflow" and "display" styles during box animations
	if ( isBox && elem.nodeType === 1 ) {

		// Support: IE <=9 - 11, Edge 12 - 15
		// Record all 3 overflow attributes because IE does not infer the shorthand
		// from identically-valued overflowX and overflowY and Edge just mirrors
		// the overflowX value there.
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Identify a display type, preferring old show/hide data over the CSS cascade
		restoreDisplay = dataShow && dataShow.display;
		if ( restoreDisplay == null ) {
			restoreDisplay = dataPriv.get( elem, "display" );
		}
		display = jQuery.css( elem, "display" );
		if ( display === "none" ) {
			if ( restoreDisplay ) {
				display = restoreDisplay;
			} else {

				// Get nonempty value(s) by temporarily forcing visibility
				showHide( [ elem ], true );
				restoreDisplay = elem.style.display || restoreDisplay;
				display = jQuery.css( elem, "display" );
				showHide( [ elem ] );
			}
		}

		// Animate inline elements as inline-block
		if ( display === "inline" || display === "inline-block" && restoreDisplay != null ) {
			if ( jQuery.css( elem, "float" ) === "none" ) {

				// Restore the original display value at the end of pure show/hide animations
				if ( !propTween ) {
					anim.done( function() {
						style.display = restoreDisplay;
					} );
					if ( restoreDisplay == null ) {
						display = style.display;
						restoreDisplay = display === "none" ? "" : display;
					}
				}
				style.display = "inline-block";
			}
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always( function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		} );
	}

	// Implement show/hide animations
	propTween = false;
	for ( prop in orig ) {

		// General show/hide setup for this element animation
		if ( !propTween ) {
			if ( dataShow ) {
				if ( "hidden" in dataShow ) {
					hidden = dataShow.hidden;
				}
			} else {
				dataShow = dataPriv.access( elem, "fxshow", { display: restoreDisplay } );
			}

			// Store hidden/visible for toggle so `.stop().toggle()` "reverses"
			if ( toggle ) {
				dataShow.hidden = !hidden;
			}

			// Show elements before animating them
			if ( hidden ) {
				showHide( [ elem ], true );
			}

			/* eslint-disable no-loop-func */

			anim.done( function() {

			/* eslint-enable no-loop-func */

				// The final step of a "hide" animation is actually hiding the element
				if ( !hidden ) {
					showHide( [ elem ] );
				}
				dataPriv.remove( elem, "fxshow" );
				for ( prop in orig ) {
					jQuery.style( elem, prop, orig[ prop ] );
				}
			} );
		}

		// Per-property setup
		propTween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );
		if ( !( prop in dataShow ) ) {
			dataShow[ prop ] = propTween.start;
			if ( hidden ) {
				propTween.end = propTween.start;
				propTween.start = 0;
			}
		}
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( Array.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = Animation.prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3 only
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			// If there's more to do, yield
			if ( percent < 1 && length ) {
				return remaining;
			}

			// If this was an empty animation, synthesize a final progress notification
			if ( !length ) {
				deferred.notifyWith( elem, [ animation, 1, 0 ] );
			}

			// Resolve the animation and report its conclusion
			deferred.resolveWith( elem, [ animation ] );
			return false;
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length; index++ ) {
		result = Animation.prefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			if ( isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, animation.opts.queue ).stop =
					result.stop.bind( result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	// Attach callbacks from options
	animation
		.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		} )
	);

	return animation;
}

jQuery.Animation = jQuery.extend( Animation, {

	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnothtmlwhite );
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length; index++ ) {
			prop = props[ index ];
			Animation.tweeners[ prop ] = Animation.tweeners[ prop ] || [];
			Animation.tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			Animation.prefilters.unshift( callback );
		} else {
			Animation.prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !isFunction( easing ) && easing
	};

	// Go to the end state if fx are off
	if ( jQuery.fx.off ) {
		opt.duration = 0;

	} else {
		if ( typeof opt.duration !== "number" ) {
			if ( opt.duration in jQuery.fx.speeds ) {
				opt.duration = jQuery.fx.speeds[ opt.duration ];

			} else {
				opt.duration = jQuery.fx.speeds._default;
			}
		}
	}

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHiddenWithinTree ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

jQuery.each( [ "toggle", "show", "hide" ], function( _i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = Date.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Run the timer and safely remove it when done (allowing for external removal)
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	jQuery.fx.start();
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( inProgress ) {
		return;
	}

	inProgress = true;
	schedule();
};

jQuery.fx.stop = function() {
	inProgress = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// https://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window.setTimeout( next, time );
		hooks.stop = function() {
			window.clearTimeout( timeout );
		};
	} );
};


( function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: Android <=4.3 only
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE <=11 only
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: IE <=11 only
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === "undefined" ) {
			return jQuery.prop( elem, name, value );
		}

		// Attribute hooks are determined by the lowercase version
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			hooks = jQuery.attrHooks[ name.toLowerCase() ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undefined );
		}

		if ( value !== undefined ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			elem.setAttribute( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undefined : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name,
			i = 0,

			// Attribute names can contain non-HTML whitespace characters
			// https://html.spec.whatwg.org/multipage/syntax.html#attributes-2
			attrNames = value && value.match( rnothtmlwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};

jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( _i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle,
			lowercaseName = name.toLowerCase();

		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ lowercaseName ];
			attrHandle[ lowercaseName ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				lowercaseName :
				null;
			attrHandle[ lowercaseName ] = handle;
		}
		return ret;
	};
} );




var rfocusable = /^(?:input|select|textarea|button)$/i,
	rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undefined ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// Support: IE <=9 - 11 only
				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// https://web.archive.org/web/20141116233347/http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				if ( tabindex ) {
					return parseInt( tabindex, 10 );
				}

				if (
					rfocusable.test( elem.nodeName ) ||
					rclickable.test( elem.nodeName ) &&
					elem.href
				) {
					return 0;
				}

				return -1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
// eslint rule "no-unused-expressions" is disabled for this code
// since it considers such accessions noop
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {

			/* eslint no-unused-expressions: "off" */

			var parent = elem.parentNode;
			if ( parent ) {
				parent.selectedIndex;

				if ( parent.parentNode ) {
					parent.parentNode.selectedIndex;
				}
			}
		}
	};
}

jQuery.each( [
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
} );




	// Strip and collapse whitespace according to HTML spec
	// https://infra.spec.whatwg.org/#strip-and-collapse-ascii-whitespace
	function stripAndCollapse( value ) {
		var tokens = value.match( rnothtmlwhite ) || [];
		return tokens.join( " " );
	}


function getClass( elem ) {
	return elem.getAttribute && elem.getAttribute( "class" ) || "";
}

function classesToArray( value ) {
	if ( Array.isArray( value ) ) {
		return value;
	}
	if ( typeof value === "string" ) {
		return value.match( rnothtmlwhite ) || [];
	}
	return [];
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0;

		if ( isFunction( value ) ) {
			return this.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return this.attr( "class", "" );
		}

		classes = classesToArray( value );

		if ( classes.length ) {
			while ( ( elem = this[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( " " + stripAndCollapse( curValue ) + " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = stripAndCollapse( cur );
					if ( curValue !== finalValue ) {
						elem.setAttribute( "class", finalValue );
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value,
			isValidValue = type === "string" || Array.isArray( value );

		if ( typeof stateVal === "boolean" && isValidValue ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( isFunction( value ) ) {
			return this.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return this.each( function() {
			var className, i, self, classNames;

			if ( isValidValue ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( this );
				classNames = classesToArray( value );

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( value === undefined || type === "boolean" ) {
				className = getClass( this );
				if ( className ) {

					// Store className if set
					dataPriv.set( this, "__className__", className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( this.setAttribute ) {
					this.setAttribute( "class",
						className || value === false ?
						"" :
						dataPriv.get( this, "__className__" ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem.nodeType === 1 &&
				( " " + stripAndCollapse( getClass( elem ) ) + " " ).indexOf( className ) > -1 ) {
					return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, valueIsFunction,
			elem = this[ 0 ];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] ||
					jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undefined
				) {
					return ret;
				}

				ret = elem.value;

				// Handle most common string cases
				if ( typeof ret === "string" ) {
					return ret.replace( rreturn, "" );
				}

				// Handle cases where value is null/undef or number
				return ret == null ? "" : ret;
			}

			return;
		}

		valueIsFunction = isFunction( value );

		return this.each( function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( valueIsFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( Array.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE <=10 - 11 only
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					stripAndCollapse( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option, i,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one",
					values = one ? null : [],
					max = one ? index + 1 : options.length;

				if ( index < 0 ) {
					i = max;

				} else {
					i = one ? index : 0;
				}

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// Support: IE <=9 only
					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							!option.disabled &&
							( !option.parentNode.disabled ||
								!nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];

					/* eslint-disable no-cond-assign */

					if ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) {
						optionSet = true;
					}

					/* eslint-enable no-cond-assign */
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
jQuery.each( [ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( Array.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


support.focusin = "onfocusin" in window;


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	stopPropagationCallback = function( e ) {
		e.stopPropagation();
	};

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special, lastElement,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split( "." ) : [];

		cur = lastElement = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join( "." );
		event.rnamespace = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem.ownerDocument || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {
			lastElement = cur;
			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = (
					dataPriv.get( cur, "events" ) || Object.create( null )
				)[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && isFunction( elem[ type ] ) && !isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;

					if ( event.isPropagationStopped() ) {
						lastElement.addEventListener( type, stopPropagationCallback );
					}

					elem[ type ]();

					if ( event.isPropagationStopped() ) {
						lastElement.removeEventListener( type, stopPropagationCallback );
					}

					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


// Support: Firefox <=44
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome <=48 - 49, Safari <=9.0 - 9.1
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://bugs.chromium.org/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {

				// Handle: regular nodes (via `this.ownerDocument`), window
				// (via `this.document`) & document (via `this`).
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this.document || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = { guid: Date.now() };

var rquery = ( /\?/ );



// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE 9 - 11 only
	// IE throws on parseFromString with invalid input.
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( Array.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeof v === "object" && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && toType( obj ) === "object" ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, valueOrFunction ) {

			// If value is a function, invoke it and use its return value
			var value = isFunction( valueOrFunction ) ?
				valueOrFunction() :
				valueOrFunction;

			s[ s.length ] = encodeURIComponent( key ) + "=" +
				encodeURIComponent( value == null ? "" : value );
		};

	if ( a == null ) {
		return "";
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( Array.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		} )
		.map( function( _i, elem ) {
			var val = jQuery( this ).val();

			if ( val == null ) {
				return null;
			}

			if ( Array.isArray( val ) ) {
				return jQuery.map( val, function( val ) {
					return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
				} );
			}

			return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		} ).get();
	}
} );


var
	r20 = /%20/g,
	rhash = /#.*$/,
	rantiCache = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = document.createElement( "a" );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnothtmlwhite ) || [];

		if ( isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader( "Content-Type" );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

			// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",

		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": JSON.parse,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// Request state (becomes false upon send and true upon completion)
			completed,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// uncached part of the url
			uncached,

			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext.nodeType || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			// Default abort message
			strAbort = "canceled",

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( completed ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ match[ 1 ].toLowerCase() + " " ] =
									( responseHeaders[ match[ 1 ].toLowerCase() + " " ] || [] )
										.concat( match[ 2 ] );
							}
						}
						match = responseHeaders[ key.toLowerCase() + " " ];
					}
					return match == null ? null : match.join( ", " );
				},

				// Raw string
				getAllResponseHeaders: function() {
					return completed ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					if ( completed == null ) {
						name = requestHeadersNames[ name.toLowerCase() ] =
							requestHeadersNames[ name.toLowerCase() ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( completed == null ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( completed ) {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						} else {

							// Lazy-add the new callbacks in a way that preserves old ones
							for ( code in map ) {
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR );

		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || location.href ) + "" )
			.replace( rprotocol, location.protocol + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = ( s.dataType || "*" ).toLowerCase().match( rnothtmlwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = document.createElement( "a" );

			// Support: IE <=8 - 11, Edge 12 - 15
			// IE throws exception on accessing the href property if url is malformed,
			// e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE <=8 - 11 only
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( completed ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( "ajaxStart" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		// Remove hash to simplify url manipulation
		cacheURL = s.url.replace( rhash, "" );

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// Remember the hash so we can put it back
			uncached = s.url.slice( cacheURL.length );

			// If data is available and should be processed, append data to url
			if ( s.data && ( s.processData || typeof s.data === "string" ) ) {
				cacheURL += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data;

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add or update anti-cache param if needed
			if ( s.cache === false ) {
				cacheURL = cacheURL.replace( rantiCache, "$1" );
				uncached = ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + ( nonce.guid++ ) +
					uncached;
			}

			// Put hash and anti-cache on the URL that will be requested (gh-1732)
			s.url = cacheURL + uncached;

		// Change '%20' to '+' if this is encoded form body content (gh-2658)
		} else if ( s.data && s.processData &&
			( s.contentType || "" ).indexOf( "application/x-www-form-urlencoded" ) === 0 ) {
			s.data = s.data.replace( r20, "+" );
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || completed ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		completeDeferred.add( s.complete );
		jqXHR.done( s.success );
		jqXHR.fail( s.error );

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( completed ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window.setTimeout( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				completed = false;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Rethrow post-completion exceptions
				if ( completed ) {
					throw e;
				}

				// Propagate others as results
				done( -1, e );
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Ignore repeat invocations
			if ( completed ) {
				return;
			}

			completed = true;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window.clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Use a noop converter for missing script
			if ( !isSuccess && jQuery.inArray( "script", s.dataTypes ) > -1 ) {
				s.converters[ "text script" ] = function() {};
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader( "Last-Modified" );
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader( "etag" );
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( "ajaxStop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
} );

jQuery.each( [ "get", "post" ], function( _i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );

jQuery.ajaxPrefilter( function( s ) {
	var i;
	for ( i in s.headers ) {
		if ( i.toLowerCase() === "content-type" ) {
			s.contentType = s.headers[ i ] || "";
		}
	}
} );


jQuery._evalUrl = function( url, options, doc ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: "script",
		cache: true,
		async: false,
		global: false,

		// Only evaluate the response if it is successful (gh-4126)
		// dataFilter is not invoked for failure responses, so using it instead
		// of the default converter is kludgy but it works.
		converters: {
			"text script": function() {}
		},
		dataFilter: function( response ) {
			jQuery.globalEval( response, options, doc );
		}
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap;

		if ( this[ 0 ] ) {
			if ( isFunction( html ) ) {
				html = html.call( this[ 0 ] );
			}

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map( function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			} ).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var htmlIsFunction = isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( htmlIsFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function( selector ) {
		this.parent( selector ).not( "body" ).each( function() {
			jQuery( this ).replaceWith( this.childNodes );
		} );
		return this;
	}
} );


jQuery.expr.pseudos.hidden = function( elem ) {
	return !jQuery.expr.pseudos.visible( elem );
};
jQuery.expr.pseudos.visible = function( elem ) {
	return !!( elem.offsetWidth || elem.offsetHeight || elem.getClientRects().length );
};




jQuery.ajaxSettings.xhr = function() {
	try {
		return new window.XMLHttpRequest();
	} catch ( e ) {}
};

var xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE <=9 only
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr();

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers[ "X-Requested-With" ] ) {
					headers[ "X-Requested-With" ] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr.onload =
								xhr.onerror = xhr.onabort = xhr.ontimeout =
									xhr.onreadystatechange = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {

								// Support: IE <=9 only
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( typeof xhr.status !== "number" ) {
									complete( 0, "error" );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr.status,
										xhr.statusText
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,

									// Support: IE <=9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr.responseType || "text" ) !== "text"  ||
									typeof xhr.responseText !== "string" ?
										{ binary: xhr.response } :
										{ text: xhr.responseText },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				errorCallback = xhr.onerror = xhr.ontimeout = callback( "error" );

				// Support: IE 9 only
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr.onabort !== undefined ) {
					xhr.onabort = errorCallback;
				} else {
					xhr.onreadystatechange = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window.setTimeout( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( "abort" );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Prevent auto-execution of scripts when no explicit dataType was provided (See gh-2432)
jQuery.ajaxPrefilter( function( s ) {
	if ( s.crossDomain ) {
		s.contents.script = false;
	}
} );

// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: "text/javascript, application/javascript, " +
			"application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {

	// This transport only deals with cross domain or forced-by-attrs requests
	if ( s.crossDomain || s.scriptAttrs ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery( "<script>" )
					.attr( s.scriptAttrs || {} )
					.prop( { charset: s.scriptCharset, src: s.url } )
					.on( "load error", callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					} );

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce.guid++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" &&
				( s.contentType || "" )
					.indexOf( "application/x-www-form-urlencoded" ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ "script json" ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undefined ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		} );

		// Delegate to script
		return "script";
	}
} );




// Support: Safari 8 only
// In Safari 8 documents created via document.implementation.createHTMLDocument
// collapse sibling forms: the second one becomes a child of the first one.
// Because of that, this security measure has to be disabled in Safari 8.
// https://bugs.webkit.org/show_bug.cgi?id=137337
support.createHTMLDocument = ( function() {
	var body = document.implementation.createHTMLDocument( "" ).body;
	body.innerHTML = "<form></form><form></form>";
	return body.childNodes.length === 2;
} )();


// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( typeof data !== "string" ) {
		return [];
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}

	var base, parsed, scripts;

	if ( !context ) {

		// Stop scripts or inline event handlers from being executed immediately
		// by using document.implementation
		if ( support.createHTMLDocument ) {
			context = document.implementation.createHTMLDocument( "" );

			// Set the base href for the created document
			// so any parsed elements with URLs
			// are based on the document's URL (gh-2965)
			base = context.createElement( "base" );
			base.href = document.location.href;
			context.head.appendChild( base );
		} else {
			context = document;
		}
	}

	parsed = rsingleTag.exec( data );
	scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[ 1 ] ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = stripAndCollapse( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




jQuery.expr.pseudos.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			if ( typeof props.top === "number" ) {
				props.top += "px";
			}
			if ( typeof props.left === "number" ) {
				props.left += "px";
			}
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {

	// offset() relates an element's border box to the document origin
	offset: function( options ) {

		// Preserve chaining for setter
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var rect, win,
			elem = this[ 0 ];

		if ( !elem ) {
			return;
		}

		// Return zeros for disconnected and hidden (display: none) elements (gh-2310)
		// Support: IE <=11 only
		// Running getBoundingClientRect on a
		// disconnected node in IE throws an error
		if ( !elem.getClientRects().length ) {
			return { top: 0, left: 0 };
		}

		// Get document-relative position by adding viewport scroll to viewport-relative gBCR
		rect = elem.getBoundingClientRect();
		win = elem.ownerDocument.defaultView;
		return {
			top: rect.top + win.pageYOffset,
			left: rect.left + win.pageXOffset
		};
	},

	// position() relates an element's margin box to its offset parent's padding box
	// This corresponds to the behavior of CSS absolute positioning
	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset, doc,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// position:fixed elements are offset from the viewport, which itself always has zero offset
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume position:fixed implies availability of getBoundingClientRect
			offset = elem.getBoundingClientRect();

		} else {
			offset = this.offset();

			// Account for the *real* offset parent, which can be the document or its root element
			// when a statically positioned element is identified
			doc = elem.ownerDocument;
			offsetParent = elem.offsetParent || doc.documentElement;
			while ( offsetParent &&
				( offsetParent === doc.body || offsetParent === doc.documentElement ) &&
				jQuery.css( offsetParent, "position" ) === "static" ) {

				offsetParent = offsetParent.parentNode;
			}
			if ( offsetParent && offsetParent !== elem && offsetParent.nodeType === 1 ) {

				// Incorporate borders into its offset, since they are outside its content origin
				parentOffset = jQuery( offsetParent ).offset();
				parentOffset.top += jQuery.css( offsetParent, "borderTopWidth", true );
				parentOffset.left += jQuery.css( offsetParent, "borderLeftWidth", true );
			}
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {

			// Coalesce documents and windows
			var win;
			if ( isWindow( elem ) ) {
				win = elem;
			} else if ( elem.nodeType === 9 ) {
				win = elem.defaultView;
			}

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari <=7 - 9.1, Chrome <=37 - 49
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://bugs.chromium.org/p/chromium/issues/detail?id=589347
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( _i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( isWindow( elem ) ) {

					// $( window ).outerWidth/Height return w/h including scrollbars (gh-1729)
					return funcName.indexOf( "outer" ) === 0 ?
						elem[ "inner" + name ] :
						elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable );
		};
	} );
} );


jQuery.each( [
	"ajaxStart",
	"ajaxStop",
	"ajaxComplete",
	"ajaxError",
	"ajaxSuccess",
	"ajaxSend"
], function( _i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
} );




jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},

	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );

jQuery.each( ( "blur focus focusin focusout resize scroll click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup contextmenu" ).split( " " ),
	function( _i, name ) {

		// Handle event binding
		jQuery.fn[ name ] = function( data, fn ) {
			return arguments.length > 0 ?
				this.on( name, null, data, fn ) :
				this.trigger( name );
		};
	} );




// Support: Android <=4.0 only
// Make sure we trim BOM and NBSP
var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;

// Bind a function to a context, optionally partially applying any
// arguments.
// jQuery.proxy is deprecated to promote standards (specifically Function#bind)
// However, it is not slated for removal any time soon
jQuery.proxy = function( fn, context ) {
	var tmp, args, proxy;

	if ( typeof context === "string" ) {
		tmp = fn[ context ];
		context = fn;
		fn = tmp;
	}

	// Quick check to determine if target is callable, in the spec
	// this throws a TypeError, but we will just return undefined.
	if ( !isFunction( fn ) ) {
		return undefined;
	}

	// Simulated bind
	args = slice.call( arguments, 2 );
	proxy = function() {
		return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
	};

	// Set the guid of unique handler to the same of original handler, so it can be removed
	proxy.guid = fn.guid = fn.guid || jQuery.guid++;

	return proxy;
};

jQuery.holdReady = function( hold ) {
	if ( hold ) {
		jQuery.readyWait++;
	} else {
		jQuery.ready( true );
	}
};
jQuery.isArray = Array.isArray;
jQuery.parseJSON = JSON.parse;
jQuery.nodeName = nodeName;
jQuery.isFunction = isFunction;
jQuery.isWindow = isWindow;
jQuery.camelCase = camelCase;
jQuery.type = toType;

jQuery.now = Date.now;

jQuery.isNumeric = function( obj ) {

	// As of jQuery 3.0, isNumeric is limited to
	// strings and numbers (primitives or objects)
	// that can be coerced to finite numbers (gh-2662)
	var type = jQuery.type( obj );
	return ( type === "number" || type === "string" ) &&

		// parseFloat NaNs numeric-cast false positives ("")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		!isNaN( obj - parseFloat( obj ) );
};

jQuery.trim = function( text ) {
	return text == null ?
		"" :
		( text + "" ).replace( rtrim, "" );
};



// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}




var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === "undefined" ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;
} );

},{}],3:[function(require,module,exports){
(function (global){
/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.16.1
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.Popper = factory());
}(this, (function () { 'use strict';

var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined' && typeof navigator !== 'undefined';

var timeoutDuration = function () {
  var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
  for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
    if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
      return 1;
    }
  }
  return 0;
}();

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

/**
 * Returns the reference node of the reference object, or the reference object itself.
 * @method
 * @memberof Popper.Utils
 * @param {Element|Object} reference - the reference element (the popper will be relative to this)
 * @returns {Element} parent
 */
function getReferenceNode(reference) {
  return reference && reference.referenceNode ? reference.referenceNode : reference;
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent || null;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width']) + parseFloat(styles['border' + sideB + 'Width']);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
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
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.width;
  var height = sizes.height || element.clientHeight || result.height;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop);
    var marginLeft = parseFloat(styles.marginLeft);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, getReferenceNode(reference));
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicitly asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);

  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;

  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized]);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width']);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;

    // flips variation if reference element overflows boundaries
    var flippedVariationByRef = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    // flips variation if popper content overflows boundaries
    var flippedVariationByContent = !!options.flipVariationsByContent && (isVertical && variation === 'start' && overflowsRight || isVertical && variation === 'end' && overflowsLeft || !isVertical && variation === 'start' && overflowsBottom || !isVertical && variation === 'end' && overflowsTop);

    var flippedVariation = flippedVariationByRef || flippedVariationByContent;

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport',
    /**
     * @prop {Boolean} flipVariations=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the reference element overlaps its boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariations: false,
    /**
     * @prop {Boolean} flipVariationsByContent=false
     * The popper will switch placement variation between `-start` and `-end` when
     * the popper element overlaps its reference boundaries.
     *
     * The original placement should have a set variation.
     */
    flipVariationsByContent: false
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {Element|referenceObject} reference - The reference element used to position the popper
   * @param {Element} popper - The HTML / XML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

return Popper;

})));


}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],4:[function(require,module,exports){
!function webpackUniversalModuleDefinition(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var n=e();for(var r in n)("object"==typeof exports?exports:t)[r]=n[r]}}(window,function(){return function(o){function webpackJsonpCallback(t){for(var e,n,r=t[0],i=t[1],s=0,a=[];s<r.length;s++)n=r[s],u[n]&&a.push(u[n][0]),u[n]=0;for(e in i)Object.prototype.hasOwnProperty.call(i,e)&&(o[e]=i[e]);for(c&&c(t);a.length;)a.shift()()}var n={},u={0:0};function __webpack_require__(t){if(n[t])return n[t].exports;var e=n[t]={i:t,l:!1,exports:{}};return o[t].call(e.exports,e,e.exports,__webpack_require__),e.l=!0,e.exports}__webpack_require__.e=function requireEnsure(i){var t=[],n=u[i];if(0!==n)if(n)t.push(n[2]);else{var e=new Promise(function(t,e){n=u[i]=[t,e]});t.push(n[2]=e);var r,s=document.createElement("script");s.charset="utf-8",s.timeout=120,__webpack_require__.nc&&s.setAttribute("nonce",__webpack_require__.nc),s.src=function jsonpScriptSrc(t){return __webpack_require__.p+"tf-"+({}[t]||t)+"-"+{1:"2aa33b10e0e549020c12"}[t]+".js"}(i);var a=new Error;r=function(t){s.onerror=s.onload=null,clearTimeout(o);var e=u[i];if(0!==e){if(e){var n=t&&("load"===t.type?"missing":t.type),r=t&&t.target&&t.target.src;a.message="Loading chunk "+i+" failed.\n("+n+": "+r+")",a.name="ChunkLoadError",a.type=n,a.request=r,e[1](a)}u[i]=void 0}};var o=setTimeout(function(){r({type:"timeout",target:s})},12e4);s.onerror=s.onload=r,document.head.appendChild(s)}return Promise.all(t)},__webpack_require__.m=o,__webpack_require__.c=n,__webpack_require__.d=function(t,e,n){__webpack_require__.o(t,e)||Object.defineProperty(t,e,{enumerable:!0,get:n})},__webpack_require__.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},__webpack_require__.t=function(e,t){if(1&t&&(e=__webpack_require__(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(__webpack_require__.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)__webpack_require__.d(n,r,function(t){return e[t]}.bind(null,r));return n},__webpack_require__.n=function(t){var e=t&&t.__esModule?function getDefault(){return t.default}:function getModuleExports(){return t};return __webpack_require__.d(e,"a",e),e},__webpack_require__.o=function(t,e){return Object.prototype.hasOwnProperty.call(t,e)},__webpack_require__.p="",__webpack_require__.oe=function(t){throw console.error(t),t};var t=window.webpackJsonp=window.webpackJsonp||[],e=t.push.bind(t);t.push=webpackJsonpCallback,t=t.slice();for(var r=0;r<t.length;r++)webpackJsonpCallback(t[r]);var c=e;return __webpack_require__(__webpack_require__.s=127)}([function(L,t,e){(function(M){(function(){"use strict";var o,e="Sugar",f=1,d=2,t=!(!Object.defineProperty||!Object.defineProperties),h=function getGlobal(){return testGlobal(void 0!==M&&M)||testGlobal("undefined"!=typeof window&&window)}(),p=!1,m={},y={},i=t?Object.defineProperty:function definePropertyShim(t,e,n){t[e]=n.value},u=getNewChainableClass("Chainable");function testGlobal(t){return t&&t.Object===Object?t:null}function createNamespace(u){var c="Object"===u,l=getNewChainableClass(u);function defineWithOptionCollect(t,i,s){setProperty(l,t,function(t,e,n){var r=collectDefineOptions(t,e,n);return function defineMethods(r,t,i,s,a){g(t,function(t,e){var n=t;s&&(n=wrapMethodWithArguments(t)),a&&(n.flags=a),i&d&&!t.instance&&setProperty(n,"instance",function wrapInstanceMethod(t,e){return e?wrapMethodWithArguments(t,!0):function wrapInstanceMethodFixed(i){switch(i.length){case 0:case 1:return function(){return i(this)};case 2:return function(t){return i(this,t)};case 3:return function(t,e){return i(this,t,e)};case 4:return function(t,e,n){return i(this,t,e,n)};case 5:return function(t,e,n,r){return i(this,t,e,n,r)}}}(t)}(t,s)),i&f&&setProperty(n,"static",!0),setMethod(r,e,n),r.active&&r.extend(e)})}(l,r.methods,i,s,r.last),l})}return defineWithOptionCollect("defineStatic",f),defineWithOptionCollect("defineInstance",d),defineWithOptionCollect("defineInstanceAndStatic",d|f),defineWithOptionCollect("defineStaticWithArguments",f,!0),defineWithOptionCollect("defineInstanceWithArguments",d,!0),setProperty(l,"defineStaticPolyfill",function(t,e,n){var r=collectDefineOptions(t,e,n);return extendNative(h[u],r.methods,!0,r.last),l}),setProperty(l,"defineInstancePolyfill",function(t,e,n){var r=collectDefineOptions(t,e,n);return extendNative(h[u].prototype,r.methods,!0,r.last),g(r.methods,function(t,e){defineChainableMethod(l,e,t)}),l}),setProperty(l,"alias",function(t,e){var n="string"==typeof e?l[e]:e;return setMethod(l,t,n),l}),setProperty(l,"extend",function(s){var n,r=h[u],i=r.prototype,a={},o={};function arrayOptionExists(t,e){var n=s[t];if(n)for(var r,i=0;r=n[i];i++)if(r===e)return!0;return!1}function canExtend(t,e,n){return!function objectRestricted(t,e){return c&&e===i&&(!p||"get"===t||"set"===t)}(t,n)&&!function disallowedByFlags(t,e,n){if(!e[t]||!n)return!1;for(var r=0;r<n.length;r++)if(!1===s[n[r]])return!0}(t,n,e.flags)&&!function methodIsExcepted(t){return arrayOptionExists("except",t)}(t)}if(n=(s=s||{}).methods,!function namespaceIsExcepted(){return arrayOptionExists("except",r)||function arrayOptionExcludes(t,e){return s[t]&&!arrayOptionExists(t,e)}("namespaces",r)}())return c&&"boolean"==typeof s.objectPrototype&&(p=s.objectPrototype),g(n||l,function(t,e){n&&(t=l[e=t]),hasOwn(t,"instance")&&canExtend(e,t,i)&&(o[e]=t.instance),hasOwn(t,"static")&&canExtend(e,t,r)&&(a[e]=t)}),extendNative(r,a),extendNative(i,o),n||setProperty(l,"active",!0),l}),m[u]=l,y["[object "+u+"]"]=l,mapNativeToChainable(u),function mapObjectChainablesToNamespace(n){g(o.Object&&o.Object.prototype,function(t,e){"function"==typeof t&&setObjectChainableOnNamespace(n,e,t)})}(l),o[u]=l}function toString(){return e}function collectDefineOptions(t,e,n){var r;return{last:"string"==typeof t?((r={})[t]=e,n):(r=t,e),methods:r}}function wrapMethodWithArguments(i,s){var a=i.length-1-(s?1:0);return function(){var t,e=[],n=[];s&&e.push(this),t=Math.max(arguments.length,a);for(var r=0;r<t;r++)r<a?e.push(arguments[r]):n.push(arguments[r]);return e.push(n),i.apply(this,e)}}function extendNative(n,t,r,i){g(t,function(t,e){r&&!i&&n[e]||setProperty(n,e,t)})}function setMethod(t,e,n){(t[e]=n).instance&&defineChainableMethod(t,e,n.instance)}function getNewChainableClass(t){var n=function SugarChainable(t,e){if(!(this instanceof n))return new n(t,e);this.constructor!==n&&(t=this.constructor.apply(t,arguments)),this.raw=t};return setProperty(n,"toString",function(){return e+t}),setProperty(n.prototype,"valueOf",function(){return this.raw}),n}function defineChainableMethod(t,e,n){var r,i,s,a=function wrapWithChainableResult(t){return function(){return new u(t.apply(this.raw,arguments))}}(n);i=(r=(s=u.prototype)[e])&&r!==Object.prototype[e],r&&r.disambiguate||(s[e]=i?function disambiguateMethod(n){function Ed(){var t,e=this.raw;return null!=e&&(t=y[classToString(e)]),new(t=t||o.Object)(e)[n].apply(this,arguments)}return Ed.disambiguate=!0,Ed}(e):a),t.prototype[e]=a,t===o.Object&&function mapObjectChainableToAllNamespaces(e,n){g(m,function(t){setObjectChainableOnNamespace(t,e,n)})}(e,a)}function setObjectChainableOnNamespace(t,e,n){var r=t.prototype;hasOwn(r,e)||(r[e]=n)}function mapNativeToChainable(t,e){var n=m[t],r=h[t].prototype;!e&&s&&(e=s(r)),g(e,function(t){if(!function nativeMethodProhibited(t){return"constructor"===t||"valueOf"===t||"__proto__"===t}(t)){try{var e=r[t];if("function"!=typeof e)return}catch(t){return}defineChainableMethod(n,t,e)}})}var s=Object.getOwnPropertyNames,n=Object.prototype.toString,r=Object.prototype.hasOwnProperty,g=function(t,e){for(var n in t)if(hasOwn(t,n)&&!1===e.call(t,t[n],n,t))break};function setProperty(t,e,n,r){i(t,e,{value:n,enumerable:!!r,configurable:!0,writable:!0})}function classToString(t){return n.call(t)}function hasOwn(t,e){return!!t&&r.call(t,e)}function getOwn(t,e){if(hasOwn(t,e))return t[e]}!function setupGlobal(){if(!(o=h[e])){if(o=function(n){return g(o,function(t,e){hasOwn(m,e)&&t.extend(n)}),o},L.exports)L.exports=o;else try{h[e]=o}catch(t){}g("Object Number String Array Date RegExp Function".split(" "),function(t){createNamespace(t)}),function setGlobalProperties(){setProperty(o,"VERSION","2.0.6"),setProperty(o,"extend",o),setProperty(o,"toString",toString),setProperty(o,"createNamespace",createNamespace),setProperty(o,"util",{hasOwn:hasOwn,getOwn:getOwn,setProperty:setProperty,classToString:classToString,defineProperty:i,forEachProperty:g,mapNativeToChainable:mapNativeToChainable})}()}}();var a,c,l,b=!("0"in Object("a")),v="\t\n\v\f\r   ᠎             \u2028\u2029　\ufeff",O=".",_=",",C=o.Object,w=o.Array,x=o.Date,k=o.String,j=(o.Number,o.Function);o.RegExp;function isClass(t,e,n){return(n=n||classToString(t))==="[object "+e+"]"}function wrapNamespace(r){return function(t,e,n){t[r](e,n)}}wrapNamespace("alias"),wrapNamespace("defineStatic"),wrapNamespace("defineInstance");var S=wrapNamespace("defineStaticPolyfill"),P=wrapNamespace("defineInstancePolyfill");wrapNamespace("defineInstanceAndStatic"),wrapNamespace("defineInstanceWithArguments");function assertCallable(t){if(!c(t))throw new TypeError("Function is not callable")}function isDefined(t){return void 0!==t}function isObjectType(t,e){return!!t&&"object"===(e||typeof t)}function isPrimitive(t,e){return e=e||typeof t,null==t||"string"===e||"number"===e||"boolean"===e}function isPlainObject(t,e){return isObjectType(t)&&isClass(t,"Object",e)&&function hasValidPlainObjectPrototype(t){var e="toString"in t,n="constructor"in t;return!n&&!e||n&&!hasOwn(t,"constructor")&&hasOwn(t.constructor.prototype,"isPrototypeOf")}(t)&&function hasOwnEnumeratedProperties(t){var e=Object.prototype;for(var n in t){var r=t[n];if(!hasOwn(t,n)&&r!==e[n])return!1}return!0}(t)}function isArrayIndex(t){return t>>>0==t&&4294967295!=t}function iterateOverSparseArray(t,e,n,r){for(var i,s=getSparseArrayIndexes(t,n,r),a=0,o=s.length;a<o;a++)i=s[a],e.call(t,t[i],i,t);return t}function getSparseArrayIndexes(t,r,e,n){var i,s=[];for(i in t)isArrayIndex(i)&&(e||(n?i<=r:r<=i))&&s.push(+i);return s.sort(function(t,e){var n=r<t;return n!=r<e?n?-1:1:t-e}),s}function spaceSplit(t){return t.split(" ")}function forEach(t,e){for(var n=0,r=t.length;n<r;n++){if(!(n in t))return iterateOverSparseArray(t,e,n);e(t[n],n)}}var E,T=Math.trunc||function(t){return 0!==t&&isFinite(t)?t<0?F(t):R(t):t};function padNumber(t,e,n,r,i){var s=N(t).toString(r||10);return s=function repeatString(t,e){var n="";t=t.toString();for(;0<e;)1&e&&(n+=t),(e>>=1)&&(t+=t);return n}(i||"0",e-s.replace(/\.\d+/,"").length)+s,(n||t<0)&&(s=(t<0?"-":"+")+s),s}var N=Math.abs,F=(Math.pow,Math.min,Math.max,Math.ceil),R=Math.floor,D=(Math.round,String.fromCharCode);(function privatePropertyAccessor(t){var n="_sugar_"+t;return function(t,e){return 1<arguments.length?(setProperty(t,n,e),t):t[n]}})("utc");!function buildClassChecks(){var n={};function addKnownType(t){n["[object "+t+"]"]=!0}function buildClassCheck(t,e){return e&&isClass(new e,"Object")?function getConstructorClassCheck(t){var e=String(t);return function(t){return String(t.constructor)===e}}(e):function getToStringClassCheck(n){return function(t,e){return isClass(t,n,e)}}(t)}function buildPrimitiveClassCheck(n){var r=n.toLowerCase();return function(t){var e=typeof t;return e===r||"object"==e&&isClass(t,n)}}!function addCoreTypes(){var t=spaceSplit("Boolean Number String Date RegExp Function Array Error Set Map");buildPrimitiveClassCheck(t[0]),buildPrimitiveClassCheck(t[1]),a=buildPrimitiveClassCheck(t[2]),buildClassCheck(t[3]),buildClassCheck(t[4]),c=buildClassCheck(t[5]),l=Array.isArray||buildClassCheck(t[6]),buildClassCheck(t[7]),buildClassCheck(t[8],"undefined"!=typeof Set&&Set),buildClassCheck(t[9],"undefined"!=typeof Map&&Map),addKnownType("Arguments"),addKnownType(t[0]),addKnownType(t[1]),addKnownType(t[2]),addKnownType(t[3]),addKnownType(t[4]),addKnownType(t[6])}(),function addArrayTypes(){forEach(spaceSplit("Int8 Uint8 Uint8Clamped Int16 Uint16 Int32 Uint32 Float32 Float64"),function(t){addKnownType(t+"Array")})}(),function(t,e){return function isKnownType(t){return n[t]}(e)||isPlainObject(t,e)}}(),function buildFullWidthNumber(){var t=O,e=_,n="";E={};for(var r,i=0;i<=9;i++)n+=r=D(i+65296),E[r]=D(i+48);E[e]="",E["．"]=t,E[t]=t,function allCharsReg(t){return RegExp("["+t+"]","g")}(n+"．"+e+t),n}();var I=["valueOf","toString","constructor","isPrototypeOf","hasOwnProperty","toLocaleString","propertyIsEnumerable"];function arrayIndexOf(t,e,n,r){var i,s,a,o=t.length;for(a=r?-1:1,i=r?o-1:0,(n=T(n))||0===n||(n=i),n<0&&(n=o+n),(!r&&n<0||r&&o<=n)&&(n=i),s=n;r&&0<=s||!r&&s<o;){if(!(s in t))return sparseIndexOf(t,e,n,r);if(isArrayIndex(s)&&t[s]===e)return s;s+=a}return-1}function sparseIndexOf(t,e,n,r){var i,s=getSparseArrayIndexes(t,n,!1,r);for(s.sort(function(t,e){return r?e-t:t-e});void 0!==(i=s.shift());)if(t[i]===e)return+i;return-1}function arrayReduce(t,e,n,r){var i,s,a=t.length,o=0,u=isDefined(n);if(assertCallable(e),0==a&&!u)throw new TypeError("Reduce called on empty array with no initial value");for(u?i=n:(i=t[r?a-1:o],o++);o<a;)(s=r?a-o-1:o)in t&&(i=e(i,t[s],s,t)),o++;return i}!function buildDontEnumFix(){if(!{toString:1}.propertyIsEnumerable("toString")){var i=g;g=function(t,e){i(t,e);for(var n,r=0;(n=I[r])&&(!hasOwn(t,n)||!1!==e.call(t,t[n],n,t));r++);}}}(),function buildChainableNativeMethodsFix(){Object.getOwnPropertyNames||!function defineNativeMethodsOnChainable(){var r="FullYear,Month,Date,Hours,Minutes,Seconds,Milliseconds".split(",");function addDateTokens(t,e){for(var n=0;n<r.length;n++)e.push(t+r[n])}g({Function:"apply,call",RegExp:"compile,exec,test",Number:"toExponential,toFixed,toLocaleString,toPrecision",Object:"hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString",Array:"concat,join,pop,push,reverse,shift,slice,sort,splice,toLocaleString,unshift",Date:"getTime,getTimezoneOffset,setTime,toDateString,toGMTString,toLocaleDateString,toLocaleString,toLocaleTimeString,toTimeString,toUTCString",String:"anchor,big,blink,bold,charAt,charCodeAt,concat,fixed,fontcolor,fontsize,indexOf,italics,lastIndexOf,link,localeCompare,match,replace,search,slice,small,split,strike,sub,substr,substring,sup,toLocaleLowerCase,toLocaleUpperCase,toLowerCase,toUpperCase"},function(t,e){var n=t.split(",");"Date"===e&&(addDateTokens("get",n),addDateTokens("set",n),addDateTokens("getUTC",n),addDateTokens("setUTC",n)),n.push("toString"),mapNativeToChainable(e,n)})}()}(),S(C,{keys:function(t){var n=[];return function assertNonNull(t){if(null==t)throw new TypeError("Object required")}(t),g(function coercePrimitiveToObject(t){return isPrimitive(t)&&(t=Object(t)),b&&a(t)&&function forceStringCoercion(t){var e,n=0;for(;e=t.charAt(n);)t[n++]=e}(t),t}(t),function(t,e){n.push(e)}),n}}),S(w,{isArray:function(t){return l(t)}}),P(w,{every:function(t){var e=arguments[1],n=this.length,r=0;for(assertCallable(t);r<n;){if(r in this&&!t.call(e,this[r],r,this))return!1;r++}return!0},some:function(t){var e=arguments[1],n=this.length,r=0;for(assertCallable(t);r<n;){if(r in this&&t.call(e,this[r],r,this))return!0;r++}return!1},map:function(t){var e=arguments[1],n=this.length,r=0,i=new Array(n);for(assertCallable(t);r<n;)r in this&&(i[r]=t.call(e,this[r],r,this)),r++;return i},filter:function(t){var e=arguments[1],n=this.length,r=0,i=[];for(assertCallable(t);r<n;)r in this&&t.call(e,this[r],r,this)&&i.push(this[r]),r++;return i},indexOf:function(t){var e=arguments[1];return a(this)?this.indexOf(t,e):arrayIndexOf(this,t,e)},lastIndexOf:function(t){var e=arguments[1];return a(this)?this.lastIndexOf(t,e):arrayIndexOf(this,t,e,!0)},forEach:function(t){var e=arguments[1],n=this.length,r=0;for(assertCallable(t);r<n;)r in this&&t.call(e,this[r],r,this),r++},reduce:function(t){return arrayReduce(this,t,arguments[1])},reduceRight:function(t){return arrayReduce(this,t,arguments[1],!0)}});var A=RegExp("^["+v+"]+|["+v+"]+$","g");P(k,{trim:function(){return this.toString().replace(A,"")}}),P(j,{bind:function(r){for(var i=[],t=1,e=arguments.length;t<e;t++)i.push(arguments[t]);var n,s=this;return assertCallable(this),(n=function(){for(var t=[],e=0,n=arguments.length;e<n;e++)t.push(arguments[e]);return s.apply(s.prototype&&this instanceof s?this:r,i.concat(t))}).prototype=this.prototype,n}}),S(x,{now:function(){return(new Date).getTime()}}),P(x,{toISOString:function(){return padNumber(this.getUTCFullYear(),4)+"-"+padNumber(this.getUTCMonth()+1,2)+"-"+padNumber(this.getUTCDate(),2)+"T"+padNumber(this.getUTCHours(),2)+":"+padNumber(this.getUTCMinutes(),2)+":"+padNumber(this.getUTCSeconds(),2)+"."+padNumber(this.getUTCMilliseconds(),3)+"Z"},toJSON:function(t){return this.toISOString(t)}},!function hasISOSupport(){var t=new Date(Date.UTC(2e3,0));return!!t.toISOString&&"2000-01-01T00:00:00.000Z"===t.toISOString()}())}).call(this)}).call(this,e(94))},function(t,e,n){"use strict";n.r(e),n.d(e,"defaultsBool",function(){return i}),n.d(e,"defaultsStr",function(){return s}),n.d(e,"defaultsNb",function(){return a}),n.d(e,"defaultsArr",function(){return o}),n.d(e,"defaultsFn",function(){return u});var r=n(3),i=function defaultsBool(t,e){return Object(r.isBoolean)(t)?t:e},s=function defaultsStr(t,e){return Object(r.isString)(t)?t:e},a=function defaultsNb(t,e){return isNaN(t)?e:t},o=function defaultsArr(t,e){return Object(r.isArray)(t)?t:e},u=function defaultsFn(t,e){return Object(r.isFn)(t)?t:e}},function(t,e,n){"use strict";n.r(e),n.d(e,"getText",function(){return o}),n.d(e,"getFirstTextNode",function(){return u}),n.d(e,"createElm",function(){return c}),n.d(e,"removeElm",function(){return l}),n.d(e,"createText",function(){return f}),n.d(e,"hasClass",function(){return d}),n.d(e,"addClass",function(){return h}),n.d(e,"removeClass",function(){return p}),n.d(e,"createOpt",function(){return m}),n.d(e,"createCheckItem",function(){return y}),n.d(e,"elm",function(){return g}),n.d(e,"tag",function(){return b});var r=n(9),s=n(3),i=n(8),a=r.root.document,o=function getText(t){return Object(s.isUndef)(t.textContent)?Object(i.trim)(t.innerText):Object(i.trim)(t.textContent)},u=function getFirstTextNode(t){for(var e=0;e<t.childNodes.length;e++){var n=t.childNodes[e];if(3===n.nodeType)return n.data}},c=function createElm(t){var e=arguments.length<=0?void 0:t;if(!Object(s.isString)(e))return null;for(var n=a.createElement(e),r=0;r<arguments.length;r++){var i=r<0||arguments.length<=r?void 0:arguments[r];Object(s.isArray)(i)&&2===i.length&&n.setAttribute(i[0],i[1])}return n},l=function removeElm(t){return t.parentNode.removeChild(t)},f=function createText(t){return a.createTextNode(t)},d=function hasClass(t,e){return!Object(s.isUndef)(t)&&(supportsClassList()?t.classList.contains(e):t.className.match(new RegExp("(\\s|^)"+e+"(\\s|$)")))},h=function addClass(t,e){Object(s.isUndef)(t)||(supportsClassList()?t.classList.add(e):""===t.className?t.className=e:d(t,e)||(t.className+=" "+e))},p=function removeClass(t,e){if(!Object(s.isUndef)(t))if(supportsClassList())t.classList.remove(e);else{var n=new RegExp("(\\s|^)"+e+"(\\s|$)","g");t.className=t.className.replace(n,"")}},m=function createOpt(t,e,n){var r=!!n?c("option",["value",e],["selected","true"]):c("option",["value",e]);return r.appendChild(f(t)),r},y=function createCheckItem(t,e,n,r){var i=3<arguments.length&&void 0!==r?r:[],s=c("li"),a=c("label",["for",t]),o=c("input",["id",t],["name",t],["type","checkbox"],["value",e],i);return a.appendChild(o),a.appendChild(f(n)),s.appendChild(a),s.label=a,s.check=o,s},g=function elm(t){return a.getElementById(t)},b=function tag(t,e){return t.getElementsByTagName(e)};function supportsClassList(){return a.documentElement.classList}},function(t,e,n){"use strict";n.r(e),n.d(e,"EMPTY_FN",function(){return r}),n.d(e,"isObj",function(){return i}),n.d(e,"isFn",function(){return s}),n.d(e,"isArray",function(){return a}),n.d(e,"isString",function(){return o}),n.d(e,"isNumber",function(){return u}),n.d(e,"isBoolean",function(){return c}),n.d(e,"isUndef",function(){return l}),n.d(e,"isNull",function(){return f}),n.d(e,"isEmpty",function(){return d});var r=function EMPTY_FN(){},i=function isObj(t){return"[object Object]"===Object.prototype.toString.call(t)},s=function isFn(t){return"[object Function]"===Object.prototype.toString.call(t)},a=function isArray(t){return"[object Array]"===Object.prototype.toString.call(t)},o=function isString(t){return"[object String]"===Object.prototype.toString.call(t)},u=function isNumber(t){return"[object Number]"===Object.prototype.toString.call(t)},c=function isBoolean(t){return"[object Boolean]"===Object.prototype.toString.call(t)},l=function isUndef(t){return void 0===t},f=function isNull(t){return null===t},d=function isEmpty(t){return l(t)||f(t)||0===t.length}},function(t,e,n){"use strict";n.r(e),n.d(e,"INPUT",function(){return r}),n.d(e,"SELECT",function(){return i}),n.d(e,"MULTIPLE",function(){return s}),n.d(e,"CHECKLIST",function(){return a}),n.d(e,"NONE",function(){return o}),n.d(e,"ENTER_KEY",function(){return u}),n.d(e,"TAB_KEY",function(){return c}),n.d(e,"ESC_KEY",function(){return l}),n.d(e,"UP_ARROW_KEY",function(){return f}),n.d(e,"DOWN_ARROW_KEY",function(){return d}),n.d(e,"HEADER_TAG",function(){return h}),n.d(e,"CELL_TAG",function(){return p}),n.d(e,"STRING",function(){return m}),n.d(e,"NUMBER",function(){return y}),n.d(e,"FORMATTED_NUMBER",function(){return g}),n.d(e,"DATE",function(){return b}),n.d(e,"IP_ADDRESS",function(){return v}),n.d(e,"AUTO_FILTER_DELAY",function(){return O});var r="input",i="select",s="multiple",a="checklist",o="none",u=13,c=9,l=27,f=38,d=40,h="TH",p="TD",m="string",y="number",g="formatted-number",b="date",v="ipaddress",O=750},function(t,e,n){"use strict";n.r(e),n.d(e,"addEvt",function(){return i}),n.d(e,"removeEvt",function(){return s}),n.d(e,"stopEvt",function(){return a}),n.d(e,"cancelEvt",function(){return o}),n.d(e,"targetEvt",function(){return u}),n.d(e,"keyCode",function(){return c}),n.d(e,"isKeyPressed",function(){return l}),n.d(e,"bound",function(){return bound});var r=n(9),i=function addEvt(t,e,n,r){t.addEventListener?t.addEventListener(e,n,r):t.attachEvent?t.attachEvent("on"+e,n):t["on"+e]=n},s=function removeEvt(t,e,n,r){t.removeEventListener?t.removeEventListener(e,n,r):t.detachEvent?t.detachEvent("on"+e,n):t["on"+e]=null},a=function stopEvt(t){(t=t||r.root.event).stopPropagation?t.stopPropagation():t.cancelBubble=!0},o=function cancelEvt(t){(t=t||r.root.event).preventDefault?t.preventDefault():t.returnValue=!1},u=function targetEvt(t){return(t=t||r.root.event).target||t.srcElement},c=function keyCode(t){return t.charCode?t.charCode:t.keyCode?t.keyCode:t.which?t.which:0},l=function isKeyPressed(t,e){return-1!==(1<arguments.length&&void 0!==e?e:[]).indexOf(c(t))};function bound(t,e){var n="".concat(t.name,"_bound");return e[n]||(e[n]=t.bind(e)),e[n]}},function(t,e,n){"use strict";n(182)()},function(t,e,n){"use strict";n(267)()},function(t,e,n){"use strict";n.r(e),n.d(e,"trim",function(){return r}),n.d(e,"isEmpty",function(){return i}),n.d(e,"rgxEsc",function(){return u}),n.d(e,"matchCase",function(){return s}),n.d(e,"contains",function(){return a}),n.d(e,"toCamelCase",function(){return c}),n.d(e,"uuid",function(){return l});var o=n(88),r=function trim(t){return t.trim?t.trim():t.replace(/^\s*|\s*$/g,"")},i=function isEmpty(t){return""===r(t)},u=function rgxEsc(t){return String(t).replace(/[-\/\\^$*+?.()|[\]{}]/g,"\\$&")},s=function matchCase(t,e){return 1<arguments.length&&void 0!==e&&e?t:t.toLowerCase()},a=function contains(t,e,n,r,i){var s=2<arguments.length&&void 0!==n&&n,a=3<arguments.length&&void 0!==r&&r?"g":"gi";return 4<arguments.length&&void 0!==i&&i&&(t=Object(o.remove)(t),e=Object(o.remove)(e)),(s?new RegExp("(^\\s*)"+u(t)+"(\\s*$)",a):new RegExp(u(t),a)).test(e)},c=function toCamelCase(t){return(0<arguments.length&&void 0!==t?t:"").replace(/^([A-Z])|[\s-_]+(\w)/g,function(t,e,n){return n?n.toUpperCase():e.toLowerCase()})},l=function uuid(){function hq(){return Math.random().toString(16).slice(-4)}return hq()+hq()+"-"+hq()+"-"+hq()+"-"+hq()+"-"+hq()+hq()+hq()}},function(t,n,r){"use strict";r.r(n),function(t){function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}r.d(n,"root",function(){return e});var e="object"===("undefined"==typeof self?"undefined":_typeof(self))&&self.self===self&&self||"object"===(void 0===t?"undefined":_typeof(t))&&t.global===t&&t||void 0}.call(this,r(94))},function(t,e,n){"use strict";n.r(e),n.d(e,"Feature",function(){return s});var r=n(8);function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var i="Not implemented.",s=function(){function Feature(t,e){var n=this;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Feature),e.meta=e.meta||{},this.tf=t,this.feature=e.meta.altName||e.meta.name||Object(r.toCamelCase)(e.name),this.enabled=t[this.feature],this.config=t.config(),this.emitter=t.emitter,this.initialized=!1,this.emitter.on(["destroy"],function(){return n.destroy()})}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(Feature,[{key:"init",value:function init(){throw new Error(i)}},{key:"reset",value:function reset(){this.enable(),this.init()}},{key:"destroy",value:function destroy(){throw new Error(i)}},{key:"enable",value:function enable(){this.enabled=!0}},{key:"disable",value:function disable(){this.enabled=!1}},{key:"isEnabled",value:function isEnabled(){return!0===this.enabled}}]),Feature}()},function(t,e,n){"use strict";var r=n(0),i=n(14).localeManager;r.Date.defineStatic({addLocale:function(t,e){return i.add(t,e)}}),t.exports=r.Date.addLocale},function(t,e,n){"use strict";var r,i,s,a,o,u,c,l,f,d,h,p=n(142),m=n(32),y=n(98),g=n(52),b=n(143);!function buildClassChecks(){var n={};function addKnownType(t){n["[object "+t+"]"]=!0}function buildClassCheck(t,e){return e&&y(new e,"Object")?function getConstructorClassCheck(t){var e=String(t);return function(t){return String(t.constructor)===e}}(e):function getToStringClassCheck(n){return function(t,e){return y(t,n,e)}}(t)}function buildPrimitiveClassCheck(n){var r=n.toLowerCase();return function(t){var e=typeof t;return e===r||"object"==e&&y(t,n)}}!function addCoreTypes(){var t=g(p);i=buildPrimitiveClassCheck(t[0]),s=buildPrimitiveClassCheck(t[1]),a=buildPrimitiveClassCheck(t[2]),o=buildClassCheck(t[3]),u=buildClassCheck(t[4]),c=buildClassCheck(t[5]),l=Array.isArray||buildClassCheck(t[6]),h=buildClassCheck(t[7]),f=buildClassCheck(t[8],"undefined"!=typeof Set&&Set),d=buildClassCheck(t[9],"undefined"!=typeof Map&&Map),addKnownType("Arguments"),addKnownType(t[0]),addKnownType(t[1]),addKnownType(t[2]),addKnownType(t[3]),addKnownType(t[4]),addKnownType(t[6])}(),function addArrayTypes(){m(g("Int8 Uint8 Uint8Clamped Int16 Uint16 Int32 Uint32 Float32 Float64"),function(t){addKnownType(t+"Array")})}(),r=function(t,e){return function isKnownType(t){return n[t]}(e)||b(t,e)}}(),t.exports={isSerializable:r,isBoolean:i,isNumber:s,isString:a,isDate:o,isRegExp:u,isFunction:c,isArray:l,isSet:f,isMap:d,isError:h}},function(t,e,n){"use strict";t.exports={HOURS_INDEX:3,DAY_INDEX:4,WEEK_INDEX:5,MONTH_INDEX:6,YEAR_INDEX:7}},function(t,e,n){"use strict";var r,i,s=n(129),a=n(95),o=n(133);!function buildLocales(){function LocaleManager(t){this.locales={},this.add(t)}LocaleManager.prototype={get:function(t,e){var n=this.locales[t];return!n&&s[t]?n=this.add(t,s[t]):!n&&t&&(n=this.locales[t.slice(0,2)]),n||!1===e?n:this.current},getAll:function(){return this.locales},set:function(t){var e=this.get(t,!1);if(!e)throw new TypeError("Invalid Locale: "+t);return this.current=e},add:function(t,e){e?e.code=t:t=(e=t).code;var n=e.compiledFormats?e:o(e);return this.locales[t]=n,this.current||(this.current=n),n},remove:function(t){return this.current.code===t&&(this.current=this.get("en")),delete this.locales[t]}},r=o(a),i=new LocaleManager(r)}(),t.exports={English:r,localeManager:i}},function(t,e,n){"use strict";t.exports={abs:Math.abs,pow:Math.pow,min:Math.min,max:Math.max,ceil:Math.ceil,floor:Math.floor,round:Math.round}},function(t,e,n){"use strict";var r=n(0);t.exports={hasOwn:r.util.hasOwn,getOwn:r.util.getOwn,setProperty:r.util.setProperty,classToString:r.util.classToString,defineProperty:r.util.defineProperty,forEachProperty:r.util.forEachProperty,mapNativeToChainable:r.util.mapNativeToChainable}},function(t,e,n){"use strict";n(323)()},function(t,e,n){"use strict";n.r(e),n.d(e,"LEFT",function(){return r}),n.d(e,"RIGHT",function(){return c}),n.d(e,"CENTER",function(){return l}),n.d(e,"Toolbar",function(){return f});var i=n(10),s=n(2),a=n(1),o=n(3);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var u=["initializing-feature","initializing-extension"],r="left",c="right",l="center",f=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(Toolbar,i["Feature"]);var r=_createSuper(Toolbar);function Toolbar(t){var n;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Toolbar);var e=(n=r.call(this,t,Toolbar)).config.toolbar||{};return n.contCssClass=Object(a.defaultsStr)(e.container_css_class,"inf"),n.lContCssClass=Object(a.defaultsStr)(e.left_cont_css_class,"ldiv"),n.rContCssClass=Object(a.defaultsStr)(e.right_cont_css_class,"rdiv"),n.cContCssClass=Object(a.defaultsStr)(e.center_cont_css_class,"mdiv"),n.tgtId=Object(a.defaultsStr)(e.target_id,null),n.cont=null,n.lCont=null,n.rCont=null,n.cCont=null,n.innerCont={left:null,center:null,right:null},n.emitter.on(u,function(t,e){return n.init(e)}),n.enabled=!0,n}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(Toolbar,[{key:"init",value:function init(t){if(!this.initialized&&!t){var e=this.tf,n=Object(s.createElm)("div");if(n.className=this.contCssClass,this.tgtId)Object(s.elm)(this.tgtId).appendChild(n);else if(e.gridLayout){var r=e.Mod.gridLayout;r.tblMainCont.appendChild(n),n.className=r.infDivCssClass}else{var i=Object(s.createElm)("caption");i.appendChild(n),e.dom().insertBefore(i,e.dom().firstChild)}this.cont=n,this.lCont=this.createContainer(n,this.lContCssClass),this.rCont=this.createContainer(n,this.rContCssClass),this.cCont=this.createContainer(n,this.cContCssClass),this.innerCont={left:this.lCont,center:this.cCont,right:this.rCont},this.initialized=!0,Object(o.isUndef)(e.help)&&(e.Mod.help.enable(),this.emitter.emit("init-help",e))}}},{key:"container",value:function container(t,e){var n=0<arguments.length&&void 0!==t?t:c,r=1<arguments.length?e:void 0,i=this.innerCont[n];return r&&i.appendChild(r),i}},{key:"createContainer",value:function createContainer(t,e){var n=Object(s.createElm)("div",["class",e]);return t.appendChild(n),n}},{key:"destroy",value:function destroy(){if(this.initialized){var t=this.tf;Object(s.removeElm)(this.cont),this.cont=null;var e=t.dom(),n=Object(s.tag)(e,"caption");[].forEach.call(n,function(t){return Object(s.removeElm)(t)}),this.initialized=!1}}}]),Toolbar}();f.meta={alwaysInstantiate:!0}},function(t,e,n){"use strict";var r=n(121);t.exports=function Range(t,e){this.start=r(t),this.end=r(e)}},function(t,e,n){"use strict";n.r(e),n.d(e,"has",function(){return r});var a=n(8),r=function has(t,e,n){for(var r=Boolean(n),i=0,s=t.length;i<s;i++)if(Object(a.matchCase)(t[i].toString(),r)===e)return!0;return!1}},function(t,e,n){"use strict";var r=n(16).forEachProperty;t.exports=function defineOnPrototype(t,e){var n=t.prototype;r(e,function(t,e){n[e]=t})}},function(t,e,n){"use strict";n.r(e),n.d(e,"parse",function(){return r});var s=n(3),r=function parse(t,e){var n=1<arguments.length&&void 0!==e?e:".";if(Object(s.isNumber)(t))return t;var r=new RegExp("[^0-9-"+n+"]",["g"]),i=parseFloat((""+t).replace(/\((.*)\)/,"-$1").replace(r,"").replace(n,"."));return isNaN(i)?0:i}},function(t,e,n){"use strict";var r=n(25);t.exports=function callDateGet(t,e){return t["get"+(r(t)?"UTC":"")+e]()}},function(t,e,n){"use strict";var r=n(23);t.exports=function getWeekday(t){return r(t,"Day")}},function(t,e,n){"use strict";var r=n(148);t.exports=r("utc")},function(t,e,n){"use strict";var r=n(15),i=r.ceil,s=r.floor,a=Math.trunc||function(t){return 0!==t&&isFinite(t)?t<0?i(t):s(t):t};t.exports=a},function(t,e,n){"use strict";var r=n(65);t.exports=function createDate(t,e,n){return r(null,t,e,n).date}},function(t,e,n){"use strict";var r=n(0);t.exports={sugarObject:r.Object,sugarArray:r.Array,sugarDate:r.Date,sugarString:r.String,sugarNumber:r.Number,sugarFunction:r.Function,sugarRegExp:r.RegExp}},function(t,e,n){"use strict";var a=n(39),o=n(40),u=n(24),r=n(12),i=n(15),c=r.isNumber,l=i.abs;t.exports=function setWeekday(t,e,n){if(c(e)){var r=u(t);if(n){var i=0<n?1:-1,s=e%7-r;s&&s/l(s)!=i&&(e+=7*i)}return a(t,o(t)+e-r),t.getTime()}}},function(t,e,n){"use strict";n(399)()},function(t,e,n){"use strict";n.r(e),n.d(e,"ignoreCase",function(){return r}),n.d(e,"numSortAsc",function(){return i}),n.d(e,"numSortDesc",function(){return s}),n.d(e,"dateSortAsc",function(){return u}),n.d(e,"dateSortDesc",function(){return c}),n.d(e,"sortNumberStr",function(){return l}),n.d(e,"sortDateStr",function(){return f});var a=n(22),o=n(47),r=function ignoreCase(t,e){var n=t.toLowerCase(),r=e.toLowerCase();return n<r?-1:r<n?1:0},i=function numSortAsc(t,e){return t-e},s=function numSortDesc(t,e){return e-t},u=function dateSortAsc(t,e){return t.getTime()-e.getTime()},c=function dateSortDesc(t,e){return e.getTime()-t.getTime()},l=function sortNumberStr(i,t){var s=1<arguments.length&&void 0!==t?t:",";return function(t,e){var n=Object(a.parse)(t,s),r=Object(a.parse)(e,s);return i(n,r)}},f=function sortDateStr(i,t){var s=1<arguments.length&&void 0!==t?t:"en-us";return function(t,e){var n=o.Date.create(t,s),r=o.Date.create(e,s);return i(n,r)}}},function(t,e,n){"use strict";var i=n(138);t.exports=function forEach(t,e){for(var n=0,r=t.length;n<r;n++){if(!(n in t))return i(t,e,n);e(t[n],n)}}},function(t,e,n){"use strict";t.exports=function isDefined(t){return void 0!==t}},function(t,e,n){"use strict";var r=n(100),i=[{name:"millisecond",method:"Milliseconds",multiplier:1,start:0,end:999},{name:"second",method:"Seconds",multiplier:1e3,start:0,end:59},{name:"minute",method:"Minutes",multiplier:6e4,start:0,end:59},{name:"hour",method:"Hours",multiplier:36e5,start:0,end:23},{name:"day",alias:"date",method:"Date",ambiguous:!0,multiplier:864e5,start:1,end:function(t){return r(t)}},{name:"week",method:"ISOWeek",ambiguous:!0,multiplier:6048e5},{name:"month",method:"Month",ambiguous:!0,multiplier:26298e5,start:0,end:11},{name:"year",method:"FullYear",ambiguous:!0,multiplier:315576e5,start:0}];t.exports=i},function(t,e,n){"use strict";var r=n(23);t.exports=function getYear(t){return r(t,"FullYear")}},function(t,e,n){"use strict";var r=n(23);t.exports=function getMonth(t){return r(t,"Month")}},function(t,e,n){"use strict";var a=n(33),r=n(12),o=n(38),u=n(106),c=r.isFunction;t.exports=function setUnitAndLowerToEdge(r,t,i,s){return u(t,function(t,e){var n=s?t.end:t.start;return c(n)&&(n=n(r)),o(r,t.method,n),!a(i)||i<e}),r}},function(t,e,n){"use strict";var i=n(25),s=n(23);t.exports=function callDateSet(t,e,n,r){r&&n===s(t,e,n)||t["set"+(i(t)?"UTC":"")+e](n)}},function(t,e,n){"use strict";var r=n(38);t.exports=function setDate(t,e){r(t,"Date",e)}},function(t,e,n){"use strict";var r=n(23);t.exports=function getDate(t){return r(t,"Date")}},function(t,e,n){"use strict";var r=n(25);t.exports=function cloneDate(t){var e=new Date(t.getTime());return r(e,!!r(t)),e}},function(t,e,n){"use strict";t.exports=function isUndefined(t){return void 0===t}},function(t,e,n){"use strict";var r=n(13),i=r.HOURS_INDEX,s=r.DAY_INDEX,a=r.WEEK_INDEX,o=r.MONTH_INDEX;t.exports=function getLowerUnitIndex(t){return t===o?s:t===a?i:t-1}},function(t,e,n){"use strict";var r=n(66);t.exports=function getNewDate(){return r("newDateInternal")()}},function(t,e,n){"use strict";var s=n(54);t.exports=function advanceDate(t,e,n,r){var i={};return i[e]=n,s(t,i,r,1)}},function(t,e,n){"use strict";t.exports=function dateIsValid(t){return!isNaN(t.getTime())}},function(t,e,n){"use strict";n(128),n(387),t.exports=n(0)},function(t,e,n){"use strict";n.r(e),n.d(e,"BaseDropdown",function(){return i});var r=n(10),d=n(31),h=n(3),p=n(4);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var i=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(BaseDropdown,r["Feature"]);var i=_createSuper(BaseDropdown);function BaseDropdown(t,e){var n;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,BaseDropdown);var r=(n=i.call(this,t,e)).config;return n.customSorter=Object(h.isObj)(r.filter_options_sorter)&&Object(h.isArray)(r.filter_options_sorter.col)&&Object(h.isArray)(r.filter_options_sorter.comparer)?r.filter_options_sorter:null,n.isCustom=!1,n.opts=[],n.optsTxt=[],n.excludedOpts=[],n}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(BaseDropdown,[{key:"sortOptions",value:function sortOptions(t,e){var n=1<arguments.length&&void 0!==e?e:[],r=this.tf;if(r.isCustomOptions(t)||!r.sortSlc||Object(h.isArray)(r.sortSlc)&&-1===r.sortSlc.indexOf(t))return n;var i,s=r.caseSensitive,a=-1!==r.sortFilterOptionsDesc.indexOf(t);if(this.customSorter&&-1!==this.customSorter.col.indexOf(t)){var o=this.customSorter.col.indexOf(t);i=this.customSorter.comparer[o]}else if(r.hasType(t,[p.NUMBER,p.FORMATTED_NUMBER])){var u=r.getDecimal(t),c=a?d.numSortDesc:d.numSortAsc;i=Object(d.sortNumberStr)(c,u)}else if(r.hasType(t,[p.DATE])){var l=r.feature("dateType").getLocale(t),f=a?d.dateSortDesc:d.dateSortAsc;i=Object(d.sortDateStr)(f,l)}else if(i=s?void 0:d.ignoreCase,a)return n.sort(i).reverse();return n.sort(i)}},{key:"refreshFilters",value:function refreshFilters(t){var n=this;t.forEach(function(t){var e=n.getValues(t);n.build(t,n.tf.linkedFilters),n.selectOptions(t,e)})}},{key:"isValidLinkedValue",value:function isValidLinkedValue(t,e){var n=this.tf;if(n.disableExcludedOptions)return!0;if(n.paging){if(!Object(h.isEmpty)(e)&&n.isRowValid(t))return!0}else if(n.isRowDisplayed(t))return!0;return!1}},{key:"linkFilters",value:function linkFilters(){var t=this.tf;t.linkedFilters&&t.activeFilterId&&this.refreshAll()}}]),BaseDropdown}()},function(t,e,n){"use strict";var r=n(16).forEachProperty;t.exports=function simpleMerge(n,t){return r(t,function(t,e){n[e]=t}),n}},function(t,e,n){"use strict";var r=n(49);t.exports=function simpleClone(t){return r({},t)}},function(t,e,n){"use strict";t.exports={HALF_WIDTH_ZERO:48,FULL_WIDTH_ZERO:65296,HALF_WIDTH_PERIOD:".",FULL_WIDTH_PERIOD:"．",HALF_WIDTH_COMMA:",",OPEN_BRACE:"{",CLOSE_BRACE:"}"}},function(t,e,n){"use strict";t.exports=function spaceSplit(t){return t.split(" ")}},function(t,e,n){"use strict";t.exports=function tzOffset(t){return t.getTimezoneOffset()}},function(t,e,n){"use strict";var h=n(34),r=n(13),p=n(26),m=n(39),y=n(40),g=n(36),i=n(44),b=n(29),s=n(15),v=n(23),a=n(12),O=n(162),_=n(43),C=n(163),w=n(164),x=n(55),k=r.DAY_INDEX,j=r.WEEK_INDEX,S=r.MONTH_INDEX,P=r.YEAR_INDEX,E=s.round,T=a.isNumber;t.exports=function updateDate(o,u,t,c,l,f,e){var d;function setUnit(t,e,n,r){var i,s,a=n.method;!function setUpperUnit(t,e){l&&!d&&(d="weekday"===t?j:C(e))}(t,r),function setSpecificity(t){t>u.specificity||(u.specificity=t)}(r),(s=e%1)&&(function handleFraction(t,e,n){if(e){var r=h[_(e)],i=E(t.multiplier/r.multiplier*n);u[r.name]=i}}(n,r,s),e=p(e)),"weekday"!==t?(i=r===S&&28<y(o),!c||n.ambiguous?(c&&(r===j&&(e*=7,a=h[k].method),e=e*c+v(o,a)),w(o,a,e,c),i&&function monthHasShifted(t,e){return e<0&&(e=e%12+12),e%12!==g(t)}(o,e)&&m(o,0)):o.setTime(o.getTime()+e*c*n.multiplier)):c||b(o,e,f)}if(T(u)&&c)u={millisecond:u};else if(T(u))return o.setTime(u),o;return x(u,setUnit),t&&u.specificity&&O(o,u.specificity),function canDisambiguate(){if(d&&!(P<d))switch(l){case-1:return o>=(e||i());case 1:return o<=(e||i())}}()&&function disambiguateHigherUnit(){var t=h[d];c=l,setUnit(t.name,1,t,d)}(),o}},function(t,e,n){"use strict";var r=n(13),a=n(33),o=n(167),u=n(64),c=r.DAY_INDEX;t.exports=function iterateOverDateParams(i,s,t,e){function run(t,e,n){var r=o(i,t);a(r)&&s(t,r,e,n)}u(function(t,e){var n=run(t.name,t,e);return!1!==n&&e===c&&(n=run("weekday",t,e)),n},t,e)}},function(t,e,n){"use strict";var r=n(14),i=n(13),s=n(110),a=n(43),o=n(37),u=i.WEEK_INDEX,c=r.localeManager;t.exports=function moveToEndOfUnit(t,e,n,r){return e===u&&s(t,c.get(n).getFirstDayOfWeek()),o(t,a(e),r,!0)}},function(t,e,n){"use strict";var r=n(14),i=n(13),s=n(43),a=n(67),o=n(37),u=i.WEEK_INDEX,c=r.localeManager;t.exports=function moveToBeginningOfUnit(t,e,n){return e===u&&a(t,c.get(n).getFirstDayOfWeek()),o(t,s(e))}},function(t,e,n){"use strict";var r=n(183),i=n(185),s=r.defineInstance;t.exports=function defineInstanceSimilar(t,e,n,r){s(t,i(e,n),r)}},function(t,e,n){"use strict";var r=n(400);t.exports=function rangeIsValid(t){return r(t.start)&&r(t.end)&&typeof t.start==typeof t.end}},function(t,e,n){"use strict";n.r(e);var a=n(9).root.document;e.default={write:function write(t,e,n){var r="";n&&(r="; expires="+(r=new Date((new Date).getTime()+36e5*n)).toGMTString()),a.cookie=t+"="+escape(e)+r},read:function read(t){var e="",n=t+"=";if(0<a.cookie.length){var r=a.cookie,i=r.indexOf(n);if(-1!==i){i+=n.length;var s=r.indexOf(";",i);-1===s&&(s=r.length),e=unescape(r.substring(i,s))}}return e},remove:function remove(t){this.write(t,"",-1)}}},function(t,e,n){"use strict";var r=n(131),i=n(49),s=n(50);t.exports=function getEnglishVariant(t){return i(s(r),t)}},function(t,e,n){"use strict";t.exports={ISO_FIRST_DAY_OF_WEEK:1,ISO_FIRST_DAY_OF_WEEK_YEAR:4}},function(t,e,n){"use strict";t.exports=function isObjectType(t,e){return!!t&&"object"===(e||typeof t)}},function(t,e,n){"use strict";var i=n(34),r=n(13),s=n(42),a=r.YEAR_INDEX;t.exports=function iterateOverDateUnits(t,e,n){n=n||0,s(e)&&(e=a);for(var r=e;n<=r&&!1!==t(i[r],r);r--);}},function(t,e,n){"use strict";var y=n(104),g=n(157),r=n(14),i=n(13),b=n(25),v=n(26),O=n(32),_=n(53),C=n(33),w=n(105),x=n(44),k=n(54),j=n(29),S=n(49),P=n(45),E=n(42),s=n(12),T=n(46),N=n(50),F=n(63),R=n(56),D=n(169),a=n(16),I=n(57),A=n(55),M=n(170),L=n(171),H=s.isNumber,z=s.isString,B=s.isDate,W=a.getOwn,U=r.English,V=r.localeManager,Y=i.DAY_INDEX,K=i.WEEK_INDEX,G=i.MONTH_INDEX,q=i.YEAR_INDEX;t.exports=function getExtendedDate(i,t,e,n){var a,o,u,s,c,l,f,d,h,r,p,m;function parseFormatValues(i,t){var s=p||{};return O(t.to,function(t,e){var n,r=i[e+1];r&&(n=function parseIrregular(t,e){{if("utc"===e)return 1;if("year"===e){var n=t.match(g);if(n)return M(n[1],a,f)}}}(r,t),E(n)&&(n=u.parseValue(r,t)),s[t]=n)}),s}function cloneDateByFlag(t,e){return b(t)&&!C(h)&&(h=!0),b(t)&&!C(r)&&(r=!0),e&&(t=new Date(t.getTime())),t}function afterDateSet(t){s.push(t)}function handleAmpm(t){1===t&&o.hour<12?o.hour+=12:0===t&&12===o.hour&&(o.hour=0)}function handleTimezoneOffset(t,e){b(a,!0),t<0&&(e*=-1);var n=60*t+(e||0);n&&(o.minute=(o.minute||0)-n)}function handleUnitlessShift(){C(o.month)?o.unit=q:C(o.weekday)&&(o.unit=K)}function handleUnitlessNum(t){C(o.weekday)?setOrdinalWeekday(t):C(o.month)&&(o.date=o.num)}function handleMidday(t){o.hour=t%24,23<t&&afterDateSet(function(){P(a,"date",v(t/24))})}function handleRelativeDay(){w(a),E(o.unit)&&(o.unit=Y,o.num=o.day,delete o.day)}function handleRelativeUnit(t){var e;e=C(o.num)?o.num:C(o.edge)&&E(o.shift)?0:1,C(o.weekday)&&(t===G?(setOrdinalWeekday(e),e=1):(k(a,{weekday:o.weekday},!0),delete o.weekday)),o.half&&(e*=o.half),C(o.shift)?e*=o.shift:o.sign&&(e*=o.sign),C(o.day)&&(e+=o.day,delete o.day),function separateAbsoluteUnits(i){var s;A(o,function(t,e,n,r){if(i<=r)return a.setTime(NaN),!1;r<i&&((s=s||{})[t]=e,D(o,t))}),s&&(afterDateSet(function(){k(a,s,!0,0,!1,l),p&&S(p,s)}),o.edge&&(handleEdge(o.edge,s),delete o.edge))}(t),o[U.units[t]]=e,c=!0}function handleEdge(e,i){var n,s=i.unit;s||L(i,function(t,e,n,r){"weekday"===t&&C(i.month)||(s=r)}),s===G&&C(i.weekday)&&(n=i.weekday,delete i.weekday),afterDateSet(function(){var t;e<0?I(a,s,d):0<e&&(1===e&&I(a,t=Y),R(a,s,d,t)),C(n)&&(j(a,n,-e),w(a))}),i.specificity=s===G?Y:s-1}function setOrdinalWeekday(t){o.weekday=7*(t-1)+o.weekday,o.date=1,l=1}return s=[],function setupOptions(t){t=z(t)?{locale:t}:t||{},f=+!!W(t,"future")-+!!W(t,"past"),d=W(t,"locale"),h=W(t,"fromUTC"),r=W(t,"setUTC"),p=W(t,"params"),m=W(t,"clone")}(e),a=i&&t?cloneDateByFlag(i,!0):x(),b(a,h),z(t)?a=function parseStringDate(t){t=t.toLowerCase(),u=V.get(d);for(var e,n,r=0;e=u.compiledFormats[r];r++)if(n=t.match(e.reg)){if(u.cacheFormat(e,r),o=parseFormatValues(n,e),C(o.timestamp)){a.setTime(o.timestamp);break}C(o.ampm)&&handleAmpm(o.ampm),(o.utc||C(o.tzHour))&&handleTimezoneOffset(o.tzHour,o.tzMinute),C(o.shift)&&E(o.unit)&&handleUnitlessShift(),C(o.num)&&E(o.unit)&&handleUnitlessNum(o.num),o.midday&&handleMidday(o.midday),C(o.day)&&handleRelativeDay(o.day),C(o.unit)&&handleRelativeUnit(o.unit),o.edge&&handleEdge(o.edge,o);break}return o?c?k(a,o,!1,1):k(a,o,!0,0,f,l,i):(a=new Date(t),h&&T(a)&&a.setTime(a.getTime()+_(a)*y)),function fireCallbacks(){O(s,function(t){t.call()})}(),a}(t):B(t)?a=cloneDateByFlag(t,m||n):F(t)?(o=N(t),k(a,o,!0)):!H(t)&&null!==t||a.setTime(t),b(a,!!r),{set:o,date:a}}},function(t,e,n){"use strict";var r=n(158),i=n(28),s=n(160),a=i.sugarDate;t.exports=s(a,r)},function(t,e,n){"use strict";var r=n(29),i=n(24),s=n(15).floor;t.exports=function moveToBeginningOfWeek(t,e){return r(t,7*s((i(t)-e)/7)+e),t}},function(t,e,n){"use strict";t.exports=function simpleCapitalize(t){return t.charAt(0).toUpperCase()+t.slice(1)}},function(t,e,n){"use strict";var a=n(26),o=n(41),u=n(45);t.exports=function getTimeDistanceForUnit(t,e,n){var r,i,s=t<e;if(s||(i=e,e=t,t=i),r=e-t,1<n.multiplier&&(r=a(r/n.multiplier)),n.ambiguous)for(t=o(t),r&&(r-=1,u(t,n.name,r));t<e&&(u(t,n.name,1),!(e<t));)r+=1;return s?-r:r}},function(t,e,n){"use strict";var r=n(15),a=n(298),o=r.abs;t.exports=function padNumber(t,e,n,r,i){var s=o(t).toString(r||10);return s=a(i||"0",e-s.replace(/\.\d+/,"").length)+s,(n||t<0)&&(s=(t<0?"-":"+")+s),s}},function(t,e,n){"use strict";var r=n(62),a=n(39),o=n(40),u=n(41),c=n(42),l=n(110),f=n(67),d=n(108),h=r.ISO_FIRST_DAY_OF_WEEK,p=r.ISO_FIRST_DAY_OF_WEEK_YEAR;t.exports=function getWeekNumber(t,e,n,r){var i,s=0;for(c(n)&&(n=h),c(r)&&(r=p),i=l(u(t),n),d(i,n,r),e&&t<i&&(i=f(u(t),n),d(i,n,r));i<=t;)a(i,o(i)+7),s++;return s}},function(t,e,n){"use strict";t.exports="year|month|week|day|hour|minute|second|millisecond"},function(t,e,n){"use strict";var r=n(12),p=n(59),m=n(124),y=n(402),g=n(403),b=n(404),v=n(126),O=r.isNumber,_=r.isString,C=r.isDate,w=r.isFunction;t.exports=function rangeEvery(t,e,n,r){var i,s,a,o,u=t.start,c=t.end,l=c<u,f=u,d=0,h=[];if(!p(t))return n?NaN:[];for(w(e)&&(r=e,e=null),e=e||1,O(u)?(s=b(u,e),i=function(){return y(f,e,s)}):_(u)?i=function(){return g(f,e)}:C(u)&&(a=v(e),e=a[0],o=a[1],i=function(){return m(f,e,o)}),l&&0<e&&(e*=-1);l?c<=f:f<=c;)n||h.push(f),r&&r(f,d,t),f=i(),d++;return n?d-1:h}},function(t,e,n){"use strict";n.r(e),n.d(e,"DateType",function(){return s});var r=n(47),i=(n(422),n(10)),o=n(3),u=n(4),c=n(9);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var s=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(DateType,i["Feature"]);var n=_createSuper(DateType);function DateType(t){var e;return function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,DateType),(e=n.call(this,t,DateType)).locale=t.locale,e.datetime=r.Date,e.enable(),e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(DateType,[{key:"init",value:function init(){var n=this;this.initialized||(this.datetime.setLocale(this.locale),this.addConfigFormats(this.tf.colTypes),this.emitter.on(["add-date-type-formats"],function(t,e){return n.addConfigFormats(e)}),this.emitter.emit("date-type-initialized",this.tf,this),this.initialized=!0)}},{key:"parse",value:function parse(t,e){return this.datetime.create(t,e)}},{key:"isValid",value:function isValid(t,e){return this.datetime.isValid(this.parse(t,e))}},{key:"getOptions",value:function getOptions(t,e){var n=(e=e||this.tf.colTypes)[t];return Object(o.isObj)(n)?n:{}}},{key:"getLocale",value:function getLocale(t){return this.getOptions(t).locale||this.locale}},{key:"addConfigFormats",value:function addConfigFormats(t){var s=this,a=0<arguments.length&&void 0!==t?t:[];a.forEach(function(t,e){var n=s.getOptions(e,a);if(n.type===u.DATE&&n.hasOwnProperty("format")){var r=s.datetime.getLocale(n.locale||s.locale),i=Object(o.isArray)(n.format)?n.format:[n.format];try{i.forEach(function(t){r.addFormat(t)})}catch(t){c.root.console.error(t)}}})}},{key:"destroy",value:function destroy(){var n=this;this.initialized&&(this.emitter.off(["add-date-type-formats"],function(t,e){return n.addConfigFormats(e)}),this.initialized=!1)}}]),DateType}()},function(t,e,n){"use strict";n.r(e),n.d(e,"Help",function(){return r});var i=n(10),o=n(2),u=n(5),s=n(4),a=n(9),c=n(3),l=n(1),f=n(18);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var d="https://www.tablefilter.com/",r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(Help,i["Feature"]);var r=_createSuper(Help);function Help(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Help);var n=(e=r.call(this,t,Help)).config.help_instructions||{};return e.tgtId=Object(l.defaultsStr)(n.target_id,null),e.contTgtId=Object(l.defaultsStr)(n.container_target_id,null),e.instrText=Object(c.isEmpty)(n.text)?'Use the filters above each column to filter and limit table data. Advanced searches can be performed by using the following operators: <br /><b>&lt;</b>, <b>&lt;=</b>, <b>&gt;</b>, <b>&gt;=</b>, <b>=</b>, <b>*</b>, <b>!</b>, <b>{</b>, <b>}</b>, <b>||</b>,<b>&amp;&amp;</b>, <b>[empty]</b>, <b>[nonempty]</b>, <b>rgx:</b><br/><a href="https://github.com/koalyptus/TableFilter/wiki/4.-Filter-operators" target="_blank">Learn more</a><hr/>':n.text,e.instrHtml=Object(l.defaultsStr)(n.html,null),e.btnText=Object(l.defaultsStr)(n.btn_text,"?"),e.btnHtml=Object(l.defaultsStr)(n.btn_html,null),e.btnCssClass=Object(l.defaultsStr)(n.btn_css_class,"helpBtn"),e.contCssClass=Object(l.defaultsStr)(n.container_css_class,"helpCont"),e.btn=null,e.cont=null,e.contAdjustLeftPosition=Object(l.defaultsNb)(n.container_adjust_left_position,25),e.boundMouseup=null,e.defaultHtml='<div class="helpFooter"><h4>TableFilter v'+t.version+'</h4><a href="'+d+'" target="_blank">'+d+"</a><br/><span>&copy;2015-"+t.year+' Max Guglielmi</span><div align="center" style="margin-top:8px;"><a href="javascript:void(0);" class="close">Close</a></div></div>',e.toolbarPosition=Object(l.defaultsStr)(n.toolbar_position,f.RIGHT),e.emitter.on(["init-help"],function(){return e.init()}),e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(Help,[{key:"onMouseup",value:function onMouseup(t){for(var e=Object(u.targetEvt)(t);e&&e!==this.cont&&e!==this.btn;)e=e.parentNode;e!==this.cont&&e!==this.btn&&this.toggle()}},{key:"init",value:function init(){var t=this;if(!this.initialized){this.emitter.emit("initializing-feature",this,!Object(c.isNull)(this.tgtId));var e=this.tf,n=Object(o.createElm)("span"),r=Object(o.createElm)("div");this.boundMouseup=this.onMouseup.bind(this),(this.tgtId?Object(o.elm)(this.tgtId):e.feature("toolbar").container(this.toolbarPosition)).appendChild(n);var i=this.contTgtId?Object(o.elm)(this.contTgtId):n;if(this.btnHtml){n.innerHTML=this.btnHtml;var s=n.firstChild;Object(u.addEvt)(s,"click",function(){return t.toggle()}),i.appendChild(r)}else{i.appendChild(r);var a=Object(o.createElm)("a",["href","javascript:void(0);"]);a.className=this.btnCssClass,a.appendChild(Object(o.createText)(this.btnText)),n.appendChild(a),Object(u.addEvt)(a,"click",function(){return t.toggle()})}this.instrHtml?(this.contTgtId&&i.appendChild(r),r.innerHTML=this.instrHtml,this.contTgtId||(r.className=this.contCssClass)):(r.innerHTML=this.instrText,r.className=this.contCssClass),r.innerHTML+=this.defaultHtml,Object(u.addEvt)(r,"click",function(){return t.toggle()}),this.cont=r,this.btn=n,this.initialized=!0,this.emitter.emit("feature-initialized",this)}}},{key:"toggle",value:function toggle(){if(this.isEnabled()){Object(u.removeEvt)(a.root,"mouseup",this.boundMouseup);var t=this.cont.style.display;""===t||t===s.NONE?(this.cont.style.display="inline",0<this.tf.dom().scrollLeft&&(this.cont.style.left="".concat(this.btn.offsetLeft-this.tf.dom().scrollLeft+this.contAdjustLeftPosition,"px")),Object(u.addEvt)(a.root,"mouseup",this.boundMouseup)):(this.cont.style.display=s.NONE,this.cont.style.left="")}}},{key:"destroy",value:function destroy(){this.initialized&&(Object(o.removeElm)(this.btn),this.btn=null,Object(o.removeElm)(this.cont),this.cont=null,this.boundMouseup=null,this.initialized=!1)}}]),Help}();r.meta={alwaysInstantiate:!0}},function(t,e,n){"use strict";n.r(e),n.d(e,"State",function(){return r});var i=n(10),s=n(92),a=n(93),o=n(8),u=n(3),c=n(1);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(State,i["Feature"]);var r=_createSuper(State);function State(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,State);var n=(e=r.call(this,t,State)).config.state||{};return e.enableHash=!0===n||Object(u.isArray)(n.types)&&-1!==n.types.indexOf("hash"),e.enableLocalStorage=Object(u.isArray)(n.types)&&-1!==n.types.indexOf("local_storage"),e.enableCookie=Object(u.isArray)(n.types)&&-1!==n.types.indexOf("cookie"),e.persistFilters=Object(c.defaultsBool)(n.filters,!0),e.persistPageNumber=Boolean(n.page_number),e.persistPageLength=Boolean(n.page_length),e.persistSort=Boolean(n.sort),e.persistColsVisibility=Boolean(n.columns_visibility),e.persistFiltersVisibility=Boolean(n.filters_visibility),e.cookieDuration=Object(c.defaultsNb)(parseInt(n.cookie_duration,10),87600),e.enableStorage=e.enableLocalStorage||e.enableCookie,e.storage=null,e.hash=null,e.pageNb=null,e.pageLength=null,e.sort=null,e.hiddenCols=null,e.filtersVisibility=null,e.state={},e.prfxCol="col_",e.pageNbKey="page",e.pageLengthKey="page_length",e.filtersVisKey="filters_visibility",e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(State,[{key:"init",value:function init(){var i=this;this.initialized||(this.emitter.on(["after-filtering"],function(){return i.update()}),this.emitter.on(["after-page-change","after-clearing-filters"],function(t,e){return i.updatePage(e)}),this.emitter.on(["after-page-length-change"],function(t,e){return i.updatePageLength(e)}),this.emitter.on(["column-sorted"],function(t,e,n){return i.updateSort(e,n)}),this.emitter.on(["sort-initialized"],function(){return i._syncSort()}),this.emitter.on(["columns-visibility-initialized"],function(){return i._syncColsVisibility()}),this.emitter.on(["column-shown","column-hidden"],function(t,e,n,r){return i.updateColsVisibility(r)}),this.emitter.on(["filters-visibility-initialized"],function(){return i._syncFiltersVisibility()}),this.emitter.on(["filters-toggled"],function(t,e,n){return i.updateFiltersVisibility(n)}),this.enableHash&&(this.hash=new s.Hash(this),this.hash.init()),this.enableStorage&&(this.storage=new a.Storage(this),this.storage.init()),this.initialized=!0)}},{key:"update",value:function update(){var r=this;if(this.isEnabled()){var i=this.state,t=this.tf;if(this.persistFilters)t.getFiltersValue().forEach(function(t,e){var n="".concat(r.prfxCol).concat(e);Object(u.isString)(t)&&Object(o.isEmpty)(t)?i.hasOwnProperty(n)&&(i[n].flt=void 0):(i[n]=i[n]||{},i[n].flt=t)});if(this.persistPageNumber&&(Object(u.isNull)(this.pageNb)?i[this.pageNbKey]=void 0:i[this.pageNbKey]=this.pageNb),this.persistPageLength&&(Object(u.isNull)(this.pageLength)?i[this.pageLengthKey]=void 0:i[this.pageLengthKey]=this.pageLength),this.persistSort&&!Object(u.isNull)(this.sort)){Object.keys(i).forEach(function(t){-1!==t.indexOf(r.prfxCol)&&i[t]&&(i[t].sort=void 0)});var e="".concat(this.prfxCol).concat(this.sort.column);i[e]=i[e]||{},i[e].sort={descending:this.sort.descending}}this.persistColsVisibility&&(Object(u.isNull)(this.hiddenCols)||(Object.keys(i).forEach(function(t){-1!==t.indexOf(r.prfxCol)&&i[t]&&(i[t].hidden=void 0)}),this.hiddenCols.forEach(function(t){var e="".concat(r.prfxCol).concat(t);i[e]=i[e]||{},i[e].hidden=!0}))),this.persistFiltersVisibility&&(Object(u.isNull)(this.filtersVisibility)?i[this.filtersVisKey]=void 0:i[this.filtersVisKey]=this.filtersVisibility),this.emitter.emit("state-changed",t,i)}}},{key:"updatePage",value:function updatePage(t){this.pageNb=t,this.update()}},{key:"updatePageLength",value:function updatePageLength(t){this.pageLength=t,this.update()}},{key:"updateSort",value:function updateSort(t,e){this.sort={column:t,descending:e},this.update()}},{key:"updateColsVisibility",value:function updateColsVisibility(t){this.hiddenCols=t,this.update()}},{key:"updateFiltersVisibility",value:function updateFiltersVisibility(t){this.filtersVisibility=t,this.update()}},{key:"override",value:function override(t){this.state=t,this.emitter.emit("state-changed",this.tf,t)}},{key:"sync",value:function sync(){var t=this.state,e=this.tf;if(this._syncFilters(),this.persistPageNumber){var n=t[this.pageNbKey];this.emitter.emit("change-page",e,n)}if(this.persistPageLength){var r=t[this.pageLengthKey];this.emitter.emit("change-page-results",e,r)}this._syncSort(),this._syncColsVisibility(),this._syncFiltersVisibility()}},{key:"overrideAndSync",value:function overrideAndSync(t){this.disable(),this.override(t),this.sync(),this.enable()}},{key:"_syncFilters",value:function _syncFilters(){var r=this;if(this.persistFilters){var i=this.state,s=this.tf;s.eachCol(function(t){return s.setFilterValue(t,"")}),Object.keys(i).forEach(function(t){if(-1!==t.indexOf(r.prfxCol)){var e=parseInt(t.replace(r.prfxCol,""),10),n=i[t].flt;s.setFilterValue(e,n)}}),s.filter()}}},{key:"_syncSort",value:function _syncSort(){var r=this;if(this.persistSort){var i=this.state,s=this.tf;Object.keys(i).forEach(function(t){if(-1!==t.indexOf(r.prfxCol)){var e=parseInt(t.replace(r.prfxCol,""),10);if(!Object(u.isUndef)(i[t].sort)){var n=i[t].sort;r.emitter.emit("sort",s,e,n.descending)}}})}}},{key:"_syncColsVisibility",value:function _syncColsVisibility(){var n=this;if(this.persistColsVisibility){var r=this.state,e=this.tf,i=[];Object.keys(r).forEach(function(t){if(-1!==t.indexOf(n.prfxCol)){var e=parseInt(t.replace(n.prfxCol,""),10);Object(u.isUndef)(r[t].hidden)||i.push(e)}}),i.forEach(function(t){n.emitter.emit("hide-column",e,t)})}}},{key:"_syncFiltersVisibility",value:function _syncFiltersVisibility(){if(this.persistFiltersVisibility){var t=this.state,e=this.tf,n=t[this.filtersVisKey];this.filtersVisibility=n,this.emitter.emit("show-filters",e,n)}}},{key:"destroy",value:function destroy(){var i=this;this.initialized&&(this.state={},this.emitter.off(["after-filtering"],function(){return i.update()}),this.emitter.off(["after-page-change","after-clearing-filters"],function(t,e){return i.updatePage(e)}),this.emitter.off(["after-page-length-change"],function(t,e){return i.updatePageLength(e)}),this.emitter.off(["column-sorted"],function(t,e,n){return i.updateSort(e,n)}),this.emitter.off(["sort-initialized"],function(){return i._syncSort()}),this.emitter.off(["columns-visibility-initialized"],function(){return i._syncColsVisibility()}),this.emitter.off(["column-shown","column-hidden"],function(t,e,n,r){return i.updateColsVisibility(r)}),this.emitter.off(["filters-visibility-initialized"],function(){return i._syncFiltersVisibility()}),this.emitter.off(["filters-toggled"],function(t,e,n){return i.updateFiltersVisibility(n)}),this.enableHash&&(this.hash.destroy(),this.hash=null),this.enableStorage&&(this.storage.destroy(),this.storage=null),this.initialized=!1)}}]),State}()},function(t,e,n){"use strict";n.r(e),n.d(e,"GridLayout",function(){return r});var i=n(10),d=n(2),h=n(5),p=n(8),m=n(4),s=n(1);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(GridLayout,i["Feature"]);var r=_createSuper(GridLayout);function GridLayout(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,GridLayout);var n=(e=r.call(this,t,GridLayout)).config.grid_layout||{};return e.width=Object(s.defaultsStr)(n.width,null),e.height=Object(s.defaultsStr)(n.height,null),e.mainContCssClass=Object(s.defaultsStr)(n.cont_css_class,"grd_Cont"),e.contCssClass=Object(s.defaultsStr)(n.tbl_cont_css_class,"grd_tblCont"),e.headContCssClass=Object(s.defaultsStr)(n.tbl_head_css_class,"grd_headTblCont"),e.infDivCssClass=Object(s.defaultsStr)(n.inf_grid_css_class,"grd_inf"),e.headRowIndex=Object(s.defaultsNb)(n.headers_row_index,0),e.headRows=Object(s.defaultsArr)(n.headers_rows,[0]),e.filters=Object(s.defaultsBool)(n.filters,!0),e.noHeaders=Boolean(n.no_headers),e.defaultColWidth=Object(s.defaultsStr)(n.default_col_width,"100px"),e.colElms=[],e.prfxGridFltTd="_td_",e.prfxGridTh="tblHeadTh_",e.sourceTblHtml=t.dom().outerHTML,e.tblHasColTag=0<Object(d.tag)(t.dom(),"col").length,e.tblMainCont=null,e.tblCont=null,e.headTblCont=null,e.headTbl=null,t.fltGrid=e.filters,e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(GridLayout,[{key:"init",value:function init(){var n=this,t=this.tf,e=t.dom();if(!this.initialized){this.setOverrides(),this.setDefaultColWidths(),this.tblMainCont=this.createContainer("div",this.mainContCssClass),this.width&&(this.tblMainCont.style.width=this.width),e.parentNode.insertBefore(this.tblMainCont,e),this.tblCont=this.createContainer("div",this.contCssClass),this.setConfigWidth(this.tblCont),this.height&&(this.tblCont.style.height=this.height),e.parentNode.insertBefore(this.tblCont,e);var r=Object(d.removeElm)(e);if(this.tblCont.appendChild(r),""===e.style.width){var i=this.initialTableWidth();e.style.width=(Object(p.contains)("%",i)?e.clientWidth:i)+"px"}var s=Object(d.removeElm)(this.tblCont);this.tblMainCont.appendChild(s),this.headTblCont=this.createContainer("div",this.headContCssClass),this.headTbl=Object(d.createElm)("table");var a=Object(d.createElm)("tHead"),o=e.rows[this.headRowIndex],u=this.getSortTriggerIds(o),c=this.createFiltersRow();this.setHeadersRow(a),this.headTbl.appendChild(a),0===t.filtersRowIndex?a.insertBefore(c,o):a.appendChild(c),this.headTblCont.appendChild(this.headTbl),this.tblCont.parentNode.insertBefore(this.headTblCont,this.tblCont);var l=Object(d.tag)(e,"thead");0<l.length&&e.removeChild(l[0]),this.headTbl.style.tableLayout="fixed",e.style.tableLayout="fixed",t.setColWidths(this.headTbl),this.headTbl.style.width=e.style.width,Object(h.addEvt)(this.tblCont,"scroll",function(t){var e=Object(h.targetEvt)(t).scrollLeft;n.headTblCont.scrollLeft=e});var f=t.extension("sort");f&&(f.asyncSort=!0,f.triggerIds=u),this.setColumnElements(),t.popupFilters&&(c.style.display=m.NONE),this.initialized=!0}}},{key:"setOverrides",value:function setOverrides(){var t=this.tf;t.refRow=0,t.headersRow=0,t.filtersRowIndex=1}},{key:"setDefaultColWidths",value:function setDefaultColWidths(){var r=this,i=this.tf;0<i.colWidths.length||(i.eachCol(function(t){var e,n=i.dom().rows[i.getHeadersRowIndex()].cells[t];e=""!==n.width?n.width:""!==n.style.width?parseInt(n.style.width,10):r.defaultColWidth,i.colWidths[t]=e}),i.setColWidths())}},{key:"initialTableWidth",value:function initialTableWidth(){var t,e=this.tf.dom();return t=""!==e.width?e.width:""!==e.style.width?e.style.width:e.clientWidth,parseInt(t,10)}},{key:"createContainer",value:function createContainer(t,e){var n=Object(d.createElm)(t);return n.className=e,n}},{key:"createFiltersRow",value:function createFiltersRow(){var r=this,i=this.tf,s=Object(d.createElm)("tr");return this.filters&&i.fltGrid&&(i.externalFltIds=[],i.eachCol(function(t){var e="".concat(i.prfxFlt+t+r.prfxGridFltTd+i.id),n=Object(d.createElm)(i.fltCellTag,["id",e]);s.appendChild(n),i.externalFltIds[t]=e})),s}},{key:"setColumnElements",value:function setColumnElements(){var t=this.tf,e=Object(d.tag)(t.dom(),"col");this.tblHasColTag=0<e.length;for(var n=t.getCellsNb()-1;0<=n;n--){var r=void 0;this.tblHasColTag?r=e[n]:(r=Object(d.createElm)("col"),t.dom().insertBefore(r,t.dom().firstChild)),r.style.width=t.colWidths[n],this.colElms[n]=r}this.tblHasColTag=!0}},{key:"setHeadersRow",value:function setHeadersRow(t){if(this.noHeaders)t.appendChild(Object(d.createElm)("tr"));else for(var e=0;e<this.headRows.length;e++){var n=this.tf.dom().rows[this.headRows[e]];t.appendChild(n)}}},{key:"setConfigWidth",value:function setConfigWidth(t){this.width&&(-1!==this.width.indexOf("%")?t.style.width="100%":t.style.width=this.width)}},{key:"getSortTriggerIds",value:function getSortTriggerIds(r){var i=this,s=this.tf,a=[];return s.eachCol(function(t){var e=r.cells[t],n=e.getAttribute("id");n&&""!==n||(n="".concat(i.prfxGridTh+t,"_").concat(s.id),e.setAttribute("id",n)),a.push(n)}),a}},{key:"destroy",value:function destroy(){var t=this.tf,e=t.dom();if(this.initialized){var n=Object(d.removeElm)(e);this.tblMainCont.parentNode.insertBefore(n,this.tblMainCont),Object(d.removeElm)(this.tblMainCont),this.tblMainCont=null,this.headTblCont=null,this.headTbl=null,this.tblCont=null,e.outerHTML=this.sourceTblHtml,this.tf.tbl=Object(d.elm)(t.id),this.initialized=!1}}}]),GridLayout}()},function(t,e,n){"use strict";n.r(e),n.d(e,"Loader",function(){return r});var i=n(10),s=n(2),a=n(3),o=n(9),u=n(4),c=n(1);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var l=["before-filtering","before-populating-filter","before-page-change","before-clearing-filters","before-page-length-change","before-reset-page","before-reset-page-length","before-loading-extensions","before-loading-themes"],f=["after-filtering","after-populating-filter","after-page-change","after-clearing-filters","after-page-length-change","after-reset-page","after-reset-page-length","after-loading-extensions","after-loading-themes"],r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(Loader,i["Feature"]);var r=_createSuper(Loader);function Loader(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Loader);var n=(e=r.call(this,t,Loader)).config.loader||{};return e.targetId=Object(c.defaultsStr)(n.target_id,null),e.cont=null,e.text=Object(c.defaultsStr)(n.text,"Loading..."),e.html=Object(c.defaultsStr)(n.html,null),e.cssClass=Object(c.defaultsStr)(n.css_class,"loader"),e.closeDelay=250,e.onShow=Object(c.defaultsFn)(n.on_show_loader,a.EMPTY_FN),e.onHide=Object(c.defaultsFn)(n.on_hide_loader,a.EMPTY_FN),e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(Loader,[{key:"init",value:function init(){var t=this;if(!this.initialized){var e=this.tf,n=this.emitter,r=Object(s.createElm)("div");r.className=this.cssClass;var i=this.targetId?Object(s.elm)(this.targetId):e.dom().parentNode;this.targetId?i.appendChild(r):i.insertBefore(r,e.dom()),this.cont=r,this.html?this.cont.innerHTML=this.html:this.cont.appendChild(Object(s.createText)(this.text)),this.show(u.NONE),n.on(l,function(){return t.show("")}),n.on(f,function(){return t.show(u.NONE)}),this.initialized=!0}}},{key:"show",value:function show(t){if(this.isEnabled()){var e=t===u.NONE?this.closeDelay:1;o.root.setTimeout(function displayLoader(){this.cont&&(t!==u.NONE&&this.onShow(this),(this.cont.style.display=t)===u.NONE&&this.onHide(this))}.bind(this),e)}}},{key:"destroy",value:function destroy(){var t=this;if(this.initialized){var e=this.emitter;Object(s.removeElm)(this.cont),this.cont=null,e.off(l,function(){return t.show("")}),e.off(f,function(){return t.show(u.NONE)}),this.initialized=!1}}}]),Loader}()},function(t,e,n){"use strict";n.r(e),n.d(e,"HighlightKeyword",function(){return i});var h=n(2),o=n(3),d=n(8),r=n(1);function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var i=function(){function HighlightKeyword(t){!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,HighlightKeyword);var e=t.config();this.highlightCssClass=Object(r.defaultsStr)(e.highlight_css_class,"keyword"),this.tf=t,this.emitter=t.emitter}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(HighlightKeyword,[{key:"init",value:function init(){var r=this;this.emitter.on(["before-filtering","destroy"],function(){return r.unhighlightAll()}),this.emitter.on(["highlight-keyword"],function(t,e,n){return r._processTerm(e,n)})}},{key:"highlight",value:function highlight(t,e,n){if(t.hasChildNodes)for(var r=t.childNodes,i=0;i<r.length;i++)this.highlight(r[i],e,n);if(3===t.nodeType){var s=t.nodeValue.toLowerCase().indexOf(e.toLowerCase());if(-1!==s){var a=t.parentNode;if(a&&a.className!==n){var o=t.nodeValue,u=Object(h.createText)(o.substr(0,s)),c=o.substr(s,e.length),l=Object(h.createText)(o.substr(s+e.length)),f=Object(h.createText)(c),d=Object(h.createElm)("span");d.className=n,d.appendChild(f),a.insertBefore(u,t),a.insertBefore(d,t),a.insertBefore(l,t),a.removeChild(t)}}}}},{key:"unhighlight",value:function unhighlight(t,e){for(var n=this.tf.dom().querySelectorAll(".".concat(e)),r=0;r<n.length;r++){var i=n[r],s=Object(h.getText)(i);if(Object(o.isNull)(t)||-1!==s.toLowerCase().indexOf(t.toLowerCase())){var a=i.parentNode;a.replaceChild(Object(h.createText)(s),i),a.normalize()}}}},{key:"unhighlightAll",value:function unhighlightAll(){this.tf.highlightKeywords&&this.unhighlight(null,this.highlightCssClass)}},{key:"destroy",value:function destroy(){var r=this;this.emitter.off(["before-filtering","destroy"],function(){return r.unhighlightAll()}),this.emitter.off(["highlight-keyword"],function(t,e,n){return r._processTerm(e,n)})}},{key:"_processTerm",value:function _processTerm(t,e){var n=this.tf,r=new RegExp(Object(d.rgxEsc)(n.lkOperator)),i=new RegExp(n.eqOperator),s=new RegExp(n.stOperator),a=new RegExp(n.enOperator),o=new RegExp(n.leOperator),u=new RegExp(n.geOperator),c=new RegExp(n.lwOperator),l=new RegExp(n.grOperator),f=new RegExp(n.dfOperator);e=e.replace(r,"").replace(i,"").replace(s,"").replace(a,""),(o.test(e)||u.test(e)||c.test(e)||l.test(e)||f.test(e))&&(e=Object(h.getText)(t)),""!==e&&this.highlight(t,e,this.highlightCssClass)}}]),HighlightKeyword}();i.meta={name:"highlightKeyword",altName:"highlightKeywords"}},function(t,e,n){"use strict";n.r(e),n.d(e,"PopupFilter",function(){return r});var i=n(10),s=n(3),o=n(2),u=n(5),a=n(4),c=n(9),l=n(1);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(PopupFilter,i["Feature"]);var r=_createSuper(PopupFilter);function PopupFilter(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,PopupFilter);var n=(e=r.call(this,t,PopupFilter)).config.popup_filters||{};return e.closeOnFiltering=Object(l.defaultsBool)(n.close_on_filtering,!0),e.iconPath=Object(l.defaultsStr)(n.image,t.themesPath+"icn_filter.gif"),e.activeIconPath=Object(l.defaultsStr)(n.image_active,t.themesPath+"icn_filterActive.gif"),e.iconHtml=Object(l.defaultsStr)(n.image_html,'<img src="'+e.iconPath+'" alt="Column filter" />'),e.placeholderCssClass=Object(l.defaultsStr)(n.placeholder_css_class,"popUpPlaceholder"),e.containerCssClass=Object(l.defaultsStr)(n.div_css_class,"popUpFilter"),e.adjustToContainer=Object(l.defaultsBool)(n.adjust_to_container,!0),e.onBeforeOpen=Object(l.defaultsFn)(n.on_before_popup_filter_open,s.EMPTY_FN),e.onAfterOpen=Object(l.defaultsFn)(n.on_after_popup_filter_open,s.EMPTY_FN),e.onBeforeClose=Object(l.defaultsFn)(n.on_before_popup_filter_close,s.EMPTY_FN),e.onAfterClose=Object(l.defaultsFn)(n.on_after_popup_filter_close,s.EMPTY_FN),e.fltSpans=[],e.fltIcons=[],e.filtersCache=null,e.fltElms=Object(l.defaultsArr)(e.filtersCache,[]),e.prfxDiv="popup_",e.activeFilterIdx=-1,e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(PopupFilter,[{key:"onClick",value:function onClick(t){var e=Object(u.targetEvt)(t).parentNode,n=parseInt(e.getAttribute("ci"),10);if(this.closeAll(n),this.toggle(n),this.adjustToContainer){var r=this.fltElms[n],i=.95*this.tf.getHeaderElement(n).clientWidth;r.style.width=parseInt(i,10)+"px"}Object(u.cancelEvt)(t),Object(u.stopEvt)(t)}},{key:"onMouseup",value:function onMouseup(t){if(-1!==this.activeFilterIdx){var e=Object(u.targetEvt)(t),n=this.fltElms[this.activeFilterIdx];if(this.fltIcons[this.activeFilterIdx]!==e){for(;e&&e!==n;)e=e.parentNode;e!==n&&this.close(this.activeFilterIdx)}}}},{key:"init",value:function init(){var n=this;if(!this.initialized){var t=this.tf;t.externalFltIds=[""],t.filtersRowIndex=0,t.headersRow<=1&&isNaN(t.config().headers_row_index)&&(t.headersRow=0),t.gridLayout&&(t.headersRow--,this.buildIcons()),this.emitter.on(["before-filtering"],function(){return n.setIconsState()}),this.emitter.on(["after-filtering"],function(){return n.closeAll()}),this.emitter.on(["cell-processed"],function(t,e){return n.changeState(e,!0)}),this.emitter.on(["filters-row-inserted"],function(){return n.buildIcons()}),this.emitter.on(["before-filter-init"],function(t,e){return n.build(e)}),this.initialized=!0}}},{key:"reset",value:function reset(){this.enable(),this.init(),this.buildIcons(),this.buildAll()}},{key:"buildIcons",value:function buildIcons(){var n=this,r=this.tf;r.headersRow++,r.eachCol(function(t){var e=Object(o.createElm)("span",["ci",t]);e.innerHTML=n.iconHtml,r.getHeaderElement(t).appendChild(e),Object(u.addEvt)(e,"click",function(t){return n.onClick(t)}),n.fltSpans[t]=e,n.fltIcons[t]=e.firstChild},function(t){return r.getFilterType(t)===a.NONE})}},{key:"buildAll",value:function buildAll(){for(var t=0;t<this.filtersCache.length;t++)this.build(t,this.filtersCache[t])}},{key:"build",value:function build(t,e){var n=this.tf,r="".concat(this.prfxDiv).concat(n.id,"_").concat(t),i=Object(o.createElm)("div",["class",this.placeholderCssClass]),s=e||Object(o.createElm)("div",["id",r],["class",this.containerCssClass]);n.externalFltIds[t]=s.id,i.appendChild(s);var a=n.getHeaderElement(t);a.insertBefore(i,a.firstChild),Object(u.addEvt)(s,"click",function(t){return Object(u.stopEvt)(t)}),this.fltElms[t]=s}},{key:"toggle",value:function toggle(t){this.isOpen(t)?this.close(t):this.open(t)}},{key:"open",value:function open(t){var e=this,n=this.tf,r=this.fltElms[t];if(this.onBeforeOpen(this,r,t),r.style.display="block",this.activeFilterIdx=t,Object(u.addEvt)(c.root,"mouseup",function(t){return e.onMouseup(t)}),n.getFilterType(t)===a.INPUT){var i=n.getFilterElement(t);i&&i.focus()}this.onAfterOpen(this,r,t)}},{key:"close",value:function close(t){var e=this,n=this.fltElms[t];this.onBeforeClose(this,n,t),n.style.display=a.NONE,this.activeFilterIdx===t&&(this.activeFilterIdx=-1),Object(u.removeEvt)(c.root,"mouseup",function(t){return e.onMouseup(t)}),this.onAfterClose(this,n,t)}},{key:"isOpen",value:function isOpen(t){return"block"===this.fltElms[t].style.display}},{key:"closeAll",value:function closeAll(t){if(!Object(s.isUndef)(t)||this.closeOnFiltering)for(var e=0;e<this.fltElms.length;e++)if(e!==t){var n=this.tf.getFilterType(e);(n===a.CHECKLIST||n===a.MULTIPLE)&&Object(s.isUndef)(t)||this.close(e)}}},{key:"setIconsState",value:function setIconsState(){for(var t=0;t<this.fltIcons.length;t++)this.changeState(t,!1)}},{key:"changeState",value:function changeState(t,e){var n=this.fltIcons[t];n&&(n.src=e?this.activeIconPath:this.iconPath)}},{key:"destroy",value:function destroy(){var n=this;if(this.initialized){this.filtersCache=[];for(var t=0;t<this.fltElms.length;t++){var e=this.fltElms[t],r=e.parentNode,i=this.fltSpans[t],s=this.fltIcons[t];e&&(Object(o.removeElm)(e),this.filtersCache[t]=e),e=null,r&&Object(o.removeElm)(r),r=null,i&&Object(o.removeElm)(i),i=null,s&&Object(o.removeElm)(s),s=null}this.fltElms=[],this.fltSpans=[],this.fltIcons=[],this.tf.externalFltIds=[],this.emitter.off(["before-filtering"],function(){return n.setIconsState()}),this.emitter.off(["after-filtering"],function(){return n.closeAll()}),this.emitter.off(["cell-processed"],function(t,e){return n.changeState(e,!0)}),this.emitter.off(["filters-row-inserted"],function(){return n.buildIcons()}),this.emitter.off(["before-filter-init"],function(t,e){return n.build(e)}),this.initialized=!1}}}]),PopupFilter}();r.meta={altName:"popupFilters"}},function(t,e,n){"use strict";n.r(e),n.d(e,"MarkActiveColumns",function(){return r});var i=n(10),s=n(2),a=n(3),o=n(1);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(MarkActiveColumns,i["Feature"]);var r=_createSuper(MarkActiveColumns);function MarkActiveColumns(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,MarkActiveColumns);var n=(e=r.call(this,t,MarkActiveColumns)).config.mark_active_columns||{};return e.headerCssClass=Object(o.defaultsStr)(n.header_css_class,"activeHeader"),e.cellCssClass=Object(o.defaultsStr)(n.cell_css_class,"activeCell"),e.highlightColumn=Boolean(n.highlight_column),e.onBeforeActiveColumn=Object(o.defaultsFn)(n.on_before_active_column,a.EMPTY_FN),e.onAfterActiveColumn=Object(o.defaultsFn)(n.on_after_active_column,a.EMPTY_FN),e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(MarkActiveColumns,[{key:"init",value:function init(){var n=this;this.initialized||(this.emitter.on(["before-filtering"],function(){return n.clearActiveColumns()}),this.emitter.on(["cell-processed"],function(t,e){return n.markActiveColumn(e)}),this.initialized=!0)}},{key:"clearActiveColumns",value:function clearActiveColumns(){var e=this,n=this.tf;n.eachCol(function(t){Object(s.removeClass)(n.getHeaderElement(t),e.headerCssClass),e.highlightColumn&&e.eachColumnCell(t,function(t){return Object(s.removeClass)(t,e.cellCssClass)})})}},{key:"markActiveColumn",value:function markActiveColumn(t){var e=this,n=this.tf.getHeaderElement(t);Object(s.hasClass)(n,this.headerCssClass)||(this.onBeforeActiveColumn(this,t),Object(s.addClass)(n,this.headerCssClass),this.highlightColumn&&this.eachColumnCell(t,function(t){return Object(s.addClass)(t,e.cellCssClass)}),this.onAfterActiveColumn(this,t))}},{key:"eachColumnCell",value:function eachColumnCell(t,e,n){var r=1<arguments.length&&void 0!==e?e:a.EMPTY_FN,i=2<arguments.length&&void 0!==n?n:this.tf.dom();[].forEach.call(i.querySelectorAll("tbody td:nth-child(".concat(t+1,")")),r)}},{key:"destroy",value:function destroy(){var n=this;this.initialized&&(this.clearActiveColumns(),this.emitter.off(["before-filtering"],function(){return n.clearActiveColumns()}),this.emitter.off(["cell-processed"],function(t,e){return n.markActiveColumn(e)}),this.initialized=!1)}}]),MarkActiveColumns}()},function(t,e,n){"use strict";n.r(e),n.d(e,"RowsCounter",function(){return r});var i=n(10),a=n(2),o=n(3),s=n(1),u=n(18);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(RowsCounter,i["Feature"]);var r=_createSuper(RowsCounter);function RowsCounter(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,RowsCounter);var n=(e=r.call(this,t,RowsCounter)).config.rows_counter||{};return e.targetId=Object(s.defaultsStr)(n.target_id,null),e.container=null,e.label=null,e.text=Object(s.defaultsStr)(n.text,"Rows: "),e.fromToTextSeparator=Object(s.defaultsStr)(n.separator,"-"),e.overText=Object(s.defaultsStr)(n.over_text," / "),e.cssClass=Object(s.defaultsStr)(n.css_class,"tot"),e.toolbarPosition=Object(s.defaultsStr)(n.toolbar_position,u.LEFT),e.onBeforeRefreshCounter=Object(s.defaultsFn)(n.on_before_refresh_counter,o.EMPTY_FN),e.onAfterRefreshCounter=Object(s.defaultsFn)(n.on_after_refresh_counter,o.EMPTY_FN),e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(RowsCounter,[{key:"init",value:function init(){var t=this;if(!this.initialized){this.emitter.emit("initializing-feature",this,!Object(o.isNull)(this.targetId));var e=this.tf,n=Object(a.createElm)("div");n.className=this.cssClass;var r=Object(a.createElm)("span"),i=Object(a.createElm)("span");i.appendChild(Object(a.createText)(this.text));var s=this.targetId?Object(a.elm)(this.targetId):e.feature("toolbar").container(this.toolbarPosition);this.targetId?(s.appendChild(i),s.appendChild(r)):(n.appendChild(i),n.appendChild(r),s.appendChild(n)),this.container=n,this.label=r,this.emitter.on(["after-filtering","grouped-by-page"],function(){return t.refresh(e.getValidRowsNb())}),this.emitter.on(["rows-changed"],function(){return t.refresh()}),this.initialized=!0,this.refresh(),this.emitter.emit("feature-initialized",this)}}},{key:"refresh",value:function refresh(t){if(this.initialized&&this.isEnabled()){var e,n=this.tf;if(this.onBeforeRefreshCounter(n,this.label),n.paging){var r=n.feature("paging");if(r){var i=n.getValidRowsNb(),s=parseInt(r.startPagingRow,10)+(0<i?1:0),a=s+r.pageLength-1<=i?s+r.pageLength-1:i;e=s+this.fromToTextSeparator+a+this.overText+i}}else e=t&&""!==t?t:n.getFilterableRowsNb()-n.nbHiddenRows;this.label.innerHTML=e,this.onAfterRefreshCounter(n,this.label,e)}}},{key:"destroy",value:function destroy(){var t=this;this.initialized&&(!this.targetId&&this.container?Object(a.removeElm)(this.container):Object(a.elm)(this.targetId).innerHTML="",this.label=null,this.container=null,this.emitter.off(["after-filtering","grouped-by-page"],function(){return t.refresh(tf.getValidRowsNb())}),this.emitter.off(["rows-changed"],function(){return t.refresh()}),this.initialized=!1)}}]),RowsCounter}()},function(t,e,n){"use strict";n.r(e),n.d(e,"StatusBar",function(){return r});var i=n(10),s=n(9),o=n(2),u=n(3),a=n(1),c=n(18);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var l=["after-filtering","after-populating-filter","after-page-change","after-clearing-filters","after-page-length-change","after-reset-page","after-reset-page-length","after-loading-extensions","after-loading-themes"],r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(StatusBar,i["Feature"]);var r=_createSuper(StatusBar);function StatusBar(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,StatusBar);var n=(e=r.call(this,t,StatusBar)).config.status_bar||{};return e.targetId=Object(a.defaultsStr)(n.target_id,null),e.container=null,e.msgContainer=null,e.labelContainer=null,e.text=Object(a.defaultsStr)(n.text,""),e.cssClass=Object(a.defaultsStr)(n.css_class,"status"),e.delay=250,e.onBeforeShowMsg=Object(a.defaultsFn)(n.on_before_show_msg,u.EMPTY_FN),e.onAfterShowMsg=Object(a.defaultsFn)(n.on_after_show_msg,u.EMPTY_FN),e.msgFilter=Object(a.defaultsStr)(n.msg_filter,"Filtering data..."),e.msgPopulate=Object(a.defaultsStr)(n.msg_populate,"Populating filter..."),e.msgPopulateCheckList=Object(a.defaultsStr)(n.msg_populate_checklist,"Populating list..."),e.msgChangePage=Object(a.defaultsStr)(n.msg_change_page,"Collecting paging data..."),e.msgClear=Object(a.defaultsStr)(n.msg_clear,"Clearing filters..."),e.msgChangeResults=Object(a.defaultsStr)(n.msg_change_results,"Changing results per page..."),e.msgResetPage=Object(a.defaultsStr)(n.msg_reset_page,"Re-setting page..."),e.msgResetPageLength=Object(a.defaultsStr)(n.msg_reset_page_length,"Re-setting page length..."),e.msgSort=Object(a.defaultsStr)(n.msg_sort,"Sorting data..."),e.msgLoadExtensions=Object(a.defaultsStr)(n.msg_load_extensions,"Loading extensions..."),e.msgLoadThemes=Object(a.defaultsStr)(n.msg_load_themes,"Loading theme(s)..."),e.toolbarPosition=Object(a.defaultsStr)(n.toolbar_position,c.LEFT),e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(StatusBar,[{key:"init",value:function init(){var t=this;if(!this.initialized){var e=this.tf,n=this.emitter;n.emit("initializing-feature",this,!Object(u.isNull)(this.targetId));var r=Object(o.createElm)("div");r.className=this.cssClass;var i=Object(o.createElm)("span"),s=Object(o.createElm)("span");s.appendChild(Object(o.createText)(this.text));var a=this.targetId?Object(o.elm)(this.targetId):e.feature("toolbar").container(this.toolbarPosition);this.targetId?(a.appendChild(s),a.appendChild(i)):(r.appendChild(s),r.appendChild(i),a.appendChild(r)),this.container=r,this.msgContainer=i,this.labelContainer=s,n.on(["before-filtering"],function(){return t.message(t.msgFilter)}),n.on(["before-populating-filter"],function(){return t.message(t.msgPopulate)}),n.on(["before-page-change"],function(){return t.message(t.msgChangePage)}),n.on(["before-clearing-filters"],function(){return t.message(t.msgClear)}),n.on(["before-page-length-change"],function(){return t.message(t.msgChangeResults)}),n.on(["before-reset-page"],function(){return t.message(t.msgResetPage)}),n.on(["before-reset-page-length"],function(){return t.message(t.msgResetPageLength)}),n.on(["before-loading-extensions"],function(){return t.message(t.msgLoadExtensions)}),n.on(["before-loading-themes"],function(){return t.message(t.msgLoadThemes)}),n.on(l,function(){return t.message("")}),this.initialized=!0,n.emit("feature-initialized",this)}}},{key:"message",value:function message(t){var e=this,n=0<arguments.length&&void 0!==t?t:"";if(this.isEnabled()){this.onBeforeShowMsg(this.tf,n);var r=""===n?this.delay:1;s.root.setTimeout(function(){e.initialized&&(e.msgContainer.innerHTML=n,e.onAfterShowMsg(e.tf,n))},r)}}},{key:"destroy",value:function destroy(){var t=this;if(this.initialized){var e=this.emitter;this.container.innerHTML="",this.targetId||Object(o.removeElm)(this.container),this.labelContainer=null,this.msgContainer=null,this.container=null,e.off(["before-filtering"],function(){return t.message(t.msgFilter)}),e.off(["before-populating-filter"],function(){return t.message(t.msgPopulate)}),e.off(["before-page-change"],function(){return t.message(t.msgChangePage)}),e.off(["before-clearing-filters"],function(){return t.message(t.msgClear)}),e.off(["before-page-length-change"],function(){return t.message(t.msgChangeResults)}),e.off(["before-reset-page"],function(){return t.message(t.msgResetPage)}),e.off(["before-reset-page-length"],function(){return t.message(t.msgResetPageLength)}),e.off(["before-loading-extensions"],function(){return t.message(t.msgLoadExtensions)}),e.off(["before-loading-themes"],function(){return t.message(t.msgLoadThemes)}),e.off(l,function(){return t.message("")}),this.initialized=!1}}}]),StatusBar}()},function(t,e,n){"use strict";n.r(e),n.d(e,"ClearButton",function(){return r});var i=n(10),s=n(2),a=n(5),o=n(1),u=n(3),c=n(18);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(ClearButton,i["Feature"]);var r=_createSuper(ClearButton);function ClearButton(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,ClearButton);var n=(e=r.call(this,t,ClearButton)).config.btn_reset||{};return e.targetId=Object(o.defaultsStr)(n.target_id,null),e.text=Object(o.defaultsStr)(n.text,null),e.cssClass=Object(o.defaultsStr)(n.css_class,"reset"),e.tooltip=n.tooltip||"Clear filters",e.html=Object(o.defaultsStr)(n.html,!t.enableIcons||e.text?null:'<input type="button" value="" class="'+e.cssClass+'" title="'+e.tooltip+'" />'),e.toolbarPosition=Object(o.defaultsStr)(n.toolbar_position,c.RIGHT),e.container=null,e.element=null,e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(ClearButton,[{key:"onClick",value:function onClick(){this.isEnabled()&&this.tf.clearFilters()}},{key:"init",value:function init(){var t=this,e=this.tf;if(!this.initialized){this.emitter.emit("initializing-feature",this,!Object(u.isNull)(this.targetId));var n=Object(s.createElm)("span");if((this.targetId?Object(s.elm)(this.targetId):e.feature("toolbar").container(this.toolbarPosition)).appendChild(n),this.html){n.innerHTML=this.html;var r=n.firstChild;Object(a.addEvt)(r,"click",function(){return t.onClick()})}else{var i=Object(s.createElm)("a",["href","javascript:void(0);"]);i.className=this.cssClass,i.appendChild(Object(s.createText)(this.text)),n.appendChild(i),Object(a.addEvt)(i,"click",function(){return t.onClick()})}this.element=n.firstChild,this.container=n,this.initialized=!0,this.emitter.emit("feature-initialized",this)}}},{key:"destroy",value:function destroy(){this.initialized&&(Object(s.removeElm)(this.element),Object(s.removeElm)(this.container),this.element=null,this.container=null,this.initialized=!1)}}]),ClearButton}();r.meta={altName:"btnReset"}},function(t,e,n){"use strict";n.r(e),n.d(e,"AlternateRows",function(){return r});var i=n(10),s=n(2),a=n(1),o=n(5);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(AlternateRows,i["Feature"]);var r=_createSuper(AlternateRows);function AlternateRows(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,AlternateRows);var n=(e=r.call(this,t,AlternateRows)).config;return e.evenCss=Object(a.defaultsStr)(n.even_row_css_class,"even"),e.oddCss=Object(a.defaultsStr)(n.odd_row_css_class,"odd"),e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(AlternateRows,[{key:"init",value:function init(){this.initialized||(this.processAll(),this.emitter.on(["row-processed","row-paged"],Object(o.bound)(this.processRowHandler,this)),this.emitter.on(["column-sorted","rows-changed"],Object(o.bound)(this.processAll,this)),this.initialized=!0)}},{key:"processAll",value:function processAll(){if(this.isEnabled())for(var t=this.tf.getValidRows(!0),e=t.length,n=0,r=0;r<e;r++){var i=t[r];this.setRowBg(i,n),n++}}},{key:"processRow",value:function processRow(t,e,n){n?this.setRowBg(t,e):this.removeRowBg(t)}},{key:"setRowBg",value:function setRowBg(t,e){if(this.isEnabled()&&!isNaN(t)){var n=this.tf.dom().rows,r=isNaN(e)?t:e;this.removeRowBg(t),Object(s.addClass)(n[t],r%2?this.evenCss:this.oddCss)}}},{key:"removeRowBg",value:function removeRowBg(t){if(!isNaN(t)){var e=this.tf.dom().rows;Object(s.removeClass)(e[t],this.oddCss),Object(s.removeClass)(e[t],this.evenCss)}}},{key:"processRowHandler",value:function processRowHandler(t,e,n,r){this.processRow(e,n,r)}},{key:"destroy",value:function destroy(){var n=this;this.initialized&&(this.tf.eachRow(0)(function(t,e){return n.removeRowBg(e)}),this.emitter.off(["row-processed","row-paged"],Object(o.bound)(this.processRowHandler,this)),this.emitter.off(["column-sorted","rows-changed"],Object(o.bound)(this.processAll,this)),this.initialized=!1)}}]),AlternateRows}()},function(t,e,n){"use strict";n.r(e),n.d(e,"NoResults",function(){return r});var i=n(10),s=n(2),a=n(3),o=n(4),u=n(1);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(NoResults,i["Feature"]);var r=_createSuper(NoResults);function NoResults(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,NoResults);var n=(e=r.call(this,t,NoResults)).config.no_results_message||{};return e.content=Object(u.defaultsStr)(n.content,"No results"),e.customContainer=Object(u.defaultsStr)(n.custom_container,null),e.customContainerId=Object(u.defaultsStr)(n.custom_container_id,null),e.isExternal=!Object(a.isEmpty)(e.customContainer)||!Object(a.isEmpty)(e.customContainerId),e.cssClass=Object(u.defaultsStr)(n.css_class,"no-results"),e.cont=null,e.onBeforeShow=Object(u.defaultsFn)(n.on_before_show_msg,a.EMPTY_FN),e.onAfterShow=Object(u.defaultsFn)(n.on_after_show_msg,a.EMPTY_FN),e.onBeforeHide=Object(u.defaultsFn)(n.on_before_hide_msg,a.EMPTY_FN),e.onAfterHide=Object(u.defaultsFn)(n.on_after_hide_msg,a.EMPTY_FN),e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(NoResults,[{key:"init",value:function init(){var t=this;if(!this.initialized){var e=this.tf,n=this.customContainer||Object(s.elm)(this.customContainerId)||e.dom(),r=Object(s.createElm)("div");r.className=this.cssClass,r.innerHTML=this.content,this.isExternal?n.appendChild(r):n.parentNode.insertBefore(r,n.nextSibling),this.cont=r,this.emitter.on(["initialized","after-filtering"],function(){return t.toggle()}),this.initialized=!0}}},{key:"toggle",value:function toggle(){0<this.tf.getValidRowsNb()?this.hide():this.show()}},{key:"show",value:function show(){this.initialized&&this.isEnabled()&&(this.onBeforeShow(this.tf,this),this.setWidth(),this.cont.style.display="block",this.onAfterShow(this.tf,this))}},{key:"hide",value:function hide(){this.initialized&&this.isEnabled()&&(this.onBeforeHide(this.tf,this),this.cont.style.display=o.NONE,this.onAfterHide(this.tf,this))}},{key:"setWidth",value:function setWidth(){if(this.initialized&&!this.isExternal&&this.isEnabled()){var t=this.tf;if(t.gridLayout){var e=t.feature("gridLayout");this.cont.style.width=e.headTbl.clientWidth+"px"}else this.cont.style.width=(t.dom().tHead?t.dom().tHead.clientWidth:t.dom().tBodies[0].clientWidth)+"px"}}},{key:"destroy",value:function destroy(){var t=this;this.initialized&&(Object(s.removeElm)(this.cont),this.cont=null,this.emitter.off(["after-filtering"],function(){return t.toggle()}),this.initialized=!1)}}]),NoResults}()},function(t,e,n){"use strict";n.r(e),n.d(e,"Paging",function(){return i});var r=n(10),y=n(2),g=n(3),b=n(5),v=n(4),o=n(1),f=n(18);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?_assertThisInitialized(t):e}(this,t)}}function _assertThisInitialized(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var i=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(Paging,r["Feature"]);var a=_createSuper(Paging);function Paging(e){var t;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Paging);var n=(t=a.call(this,e,Paging)).config.paging||{};t.btnCssClass=Object(o.defaultsStr)(n.btn_css_class,"pgInp"),t.pageSlc=null,t.pageLengthSlc=null,t.tgtId=Object(o.defaultsStr)(n.target_id,null),t.pageLength=Object(o.defaultsNb)(n.length,10),t.pageLengthTgtId=Object(o.defaultsStr)(n.results_per_page_target_id,null),t.pgSlcCssClass=Object(o.defaultsStr)(n.slc_css_class,"pgSlc"),t.pgInpCssClass=Object(o.defaultsStr)(n.inp_css_class,"pgNbInp"),t.resultsPerPage=Object(o.defaultsArr)(n.results_per_page,null),t.hasResultsPerPage=Object(g.isArray)(t.resultsPerPage),t.resultsSlcCssClass=Object(o.defaultsStr)(n.results_slc_css_class,"rspg"),t.resultsSpanCssClass=Object(o.defaultsStr)(n.results_span_css_class,"rspgSpan"),t.startPagingRow=0,t.nbPages=0,t.currentPageNb=1,t.btnNextPageText=Object(o.defaultsStr)(n.btn_next_page_text,">"),t.btnPrevPageText=Object(o.defaultsStr)(n.btn_prev_page_text,"<"),t.btnLastPageText=Object(o.defaultsStr)(n.btn_last_page_text,">|"),t.btnFirstPageText=Object(o.defaultsStr)(n.btn_first_page_text,"|<"),t.btnNextPageHtml=Object(o.defaultsStr)(n.btn_next_page_html,e.enableIcons?'<input type="button" value="" class="'+t.btnCssClass+' nextPage" title="Next page" />':null),t.btnPrevPageHtml=Object(o.defaultsStr)(n.btn_prev_page_html,e.enableIcons?'<input type="button" value="" class="'+t.btnCssClass+' previousPage" title="Previous page" />':null),t.btnFirstPageHtml=Object(o.defaultsStr)(n.btn_first_page_html,e.enableIcons?'<input type="button" value="" class="'+t.btnCssClass+' firstPage" title="First page" />':null),t.btnLastPageHtml=Object(o.defaultsStr)(n.btn_last_page_html,e.enableIcons?'<input type="button" value="" class="'+t.btnCssClass+' lastPage" title="Last page" />':null),t.pageText=Object(o.defaultsStr)(n.page_text," Page "),t.ofText=Object(o.defaultsStr)(n.of_text," of "),t.nbPgSpanCssClass=Object(o.defaultsStr)(n.nb_pages_css_class,"nbpg"),t.hasBtns=Object(o.defaultsBool)(n.btns,!0),t.pageSelectorType=Object(o.defaultsStr)(n.page_selector_type,v.SELECT),t.toolbarPosition=Object(o.defaultsStr)(n.toolbar_position,f.CENTER),t.onBeforeChangePage=Object(o.defaultsFn)(n.on_before_change_page,g.EMPTY_FN),t.onAfterChangePage=Object(o.defaultsFn)(n.on_after_change_page,g.EMPTY_FN),t.slcResultsTxt=null,t.btnNextCont=null,t.btnPrevCont=null,t.btnLastCont=null,t.btnFirstCont=null,t.pgCont=null,t.pgBefore=null,t.pgAfter=null;var r=e.refRow,i=e.getRowsNb(!0);t.nbPages=Math.ceil((i-r)/t.pageLength);var s=_assertThisInitialized(t);return t.evt={slcIndex:function slcIndex(){return s.pageSelectorType===v.SELECT?s.pageSlc.options.selectedIndex:parseInt(s.pageSlc.value,10)-1},nbOpts:function nbOpts(){return s.pageSelectorType===v.SELECT?parseInt(s.pageSlc.options.length,10)-1:s.nbPages-1},next:function next(){var t=s.evt.slcIndex()<s.evt.nbOpts()?s.evt.slcIndex()+1:0;s.changePage(t)},prev:function prev(){var t=0<s.evt.slcIndex()?s.evt.slcIndex()-1:s.evt.nbOpts();s.changePage(t)},last:function last(){s.changePage(s.evt.nbOpts())},first:function first(){s.changePage(0)},_detectKey:function _detectKey(t){Object(b.isKeyPressed)(t,[v.ENTER_KEY])&&(e.sorted?(e.filter(),s.changePage(s.evt.slcIndex())):s.changePage(),this.blur())},slcPagesChange:null,nextEvt:null,prevEvt:null,lastEvt:null,firstEvt:null},t}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(Paging,[{key:"init",value:function init(){var t,n=this,e=this.tf,r=this.evt;if(!this.initialized){this.emitter.emit("initializing-feature",this,!Object(g.isNull)(this.tgtId)),this.hasResultsPerPage&&(this.resultsPerPage.length<2?this.hasResultsPerPage=!1:(this.pageLength=this.resultsPerPage[1][0],this.setResultsPerPage())),r.slcPagesChange=function(t){var e=t.target;n.changePage(e.selectedIndex)},this.pageSelectorType===v.SELECT&&((t=Object(y.createElm)(v.SELECT)).className=this.pgSlcCssClass,Object(b.addEvt)(t,"change",r.slcPagesChange)),this.pageSelectorType===v.INPUT&&((t=Object(y.createElm)(v.INPUT,["value",this.currentPageNb])).className=this.pgInpCssClass,Object(b.addEvt)(t,"keypress",r._detectKey));var i=Object(y.createElm)("span"),s=Object(y.createElm)("span"),a=Object(y.createElm)("span"),o=Object(y.createElm)("span");if(this.hasBtns){if(this.btnNextPageHtml)i.innerHTML=this.btnNextPageHtml,Object(b.addEvt)(i,"click",r.next);else{var u=Object(y.createElm)(v.INPUT,["type","button"],["value",this.btnNextPageText],["title","Next"]);u.className=this.btnCssClass,Object(b.addEvt)(u,"click",r.next),i.appendChild(u)}if(this.btnPrevPageHtml)s.innerHTML=this.btnPrevPageHtml,Object(b.addEvt)(s,"click",r.prev);else{var c=Object(y.createElm)(v.INPUT,["type","button"],["value",this.btnPrevPageText],["title","Previous"]);c.className=this.btnCssClass,Object(b.addEvt)(c,"click",r.prev),s.appendChild(c)}if(this.btnLastPageHtml)a.innerHTML=this.btnLastPageHtml,Object(b.addEvt)(a,"click",r.last);else{var l=Object(y.createElm)(v.INPUT,["type","button"],["value",this.btnLastPageText],["title","Last"]);l.className=this.btnCssClass,Object(b.addEvt)(l,"click",r.last),a.appendChild(l)}if(this.btnFirstPageHtml)o.innerHTML=this.btnFirstPageHtml,Object(b.addEvt)(o,"click",r.first);else{var f=Object(y.createElm)(v.INPUT,["type","button"],["value",this.btnFirstPageText],["title","First"]);f.className=this.btnCssClass,Object(b.addEvt)(f,"click",r.first),o.appendChild(f)}}var d=this.tgtId?Object(y.elm)(this.tgtId):e.feature("toolbar").container(this.toolbarPosition);d.appendChild(o),d.appendChild(s);var h=Object(y.createElm)("span");h.appendChild(Object(y.createText)(this.pageText)),h.className=this.nbPgSpanCssClass,d.appendChild(h),d.appendChild(t);var p=Object(y.createElm)("span");p.appendChild(Object(y.createText)(this.ofText)),p.className=this.nbPgSpanCssClass,d.appendChild(p);var m=Object(y.createElm)("span");m.className=this.nbPgSpanCssClass,m.appendChild(Object(y.createText)(" "+this.nbPages+" ")),d.appendChild(m),d.appendChild(i),d.appendChild(a),this.btnNextCont=i,this.btnPrevCont=s,this.btnLastCont=a,this.btnFirstCont=o,this.pgCont=m,this.pgBefore=h,this.pgAfter=p,this.pageSlc=t,this.setPagingInfo(),e.fltGrid||(e.validateAllRows(),this.setPagingInfo(e.validRowsIndex)),this.emitter.on(["after-filtering"],Object(b.bound)(this.resetPagingInfo,this)),this.emitter.on(["change-page"],Object(b.bound)(this.changePageHandler,this)),this.emitter.on(["change-page-results"],Object(b.bound)(this.changePageResultsHandler,this)),this.initialized=!0,this.emitter.emit("feature-initialized",this)}}},{key:"reset",value:function reset(t){var e=0<arguments.length&&void 0!==t&&t;this.enable(),this.init(),e&&this.tf.filter()}},{key:"resetPagingInfo",value:function resetPagingInfo(){this.startPagingRow=0,this.currentPageNb=1,this.setPagingInfo(this.tf.validRowsIndex)}},{key:"setPagingInfo",value:function setPagingInfo(t){var e=this.tf,n=this.tgtId?Object(y.elm)(this.tgtId):e.feature("toolbar").container(this.toolbarPosition);if(e.validRowsIndex=t||e.getValidRows(!0),this.nbPages=Math.ceil(e.validRowsIndex.length/this.pageLength),this.pgCont.innerHTML=this.nbPages,this.pageSelectorType===v.SELECT&&(this.pageSlc.innerHTML=""),0<this.nbPages)if(n.style.visibility="visible",this.pageSelectorType===v.SELECT)for(var r=0;r<this.nbPages;r++){var i=Object(y.createOpt)(r+1,r*this.pageLength,!1);this.pageSlc.options[r]=i}else this.pageSlc.value=this.currentPageNb;else n.style.visibility="hidden";this.groupByPage(e.validRowsIndex)}},{key:"groupByPage",value:function groupByPage(t){var e=this.tf,n=e.dom().rows,r=parseInt(this.startPagingRow,10),i=r+parseInt(this.pageLength,10);t&&(e.validRowsIndex=t);for(var s=0,a=e.getValidRowsNb(!0);s<a;s++){var o=e.validRowsIndex[s],u=n[o],c=u.getAttribute("validRow"),l=!1;r<=s&&s<i?(Object(g.isNull)(c)||Boolean("true"===c))&&(l=!(u.style.display="")):u.style.display=v.NONE,this.emitter.emit("row-paged",e,o,s,l)}this.emitter.emit("grouped-by-page",e,this)}},{key:"getPage",value:function getPage(){return this.currentPageNb}},{key:"setPage",value:function setPage(t){if(this.tf.isInitialized()&&this.isEnabled()){var e=this.evt,n=_typeof(t);if("string"===n)switch(t.toLowerCase()){case"next":e.next();break;case"previous":e.prev();break;case"last":e.last();break;case"first":e.first();break;default:e.next()}else"number"===n&&this.changePage(t-1)}}},{key:"setResultsPerPage",value:function setResultsPerPage(){var e=this,t=this.tf,n=this.evt;if(!this.pageLengthSlc&&this.resultsPerPage){n.slcResultsChange=function(t){e.onChangeResultsPerPage(),t.target.blur()};var r=Object(y.createElm)(v.SELECT);r.className=this.resultsSlcCssClass;var i=this.resultsPerPage[0],s=this.resultsPerPage[1],a=Object(y.createElm)("span");a.className=this.resultsSpanCssClass;var o=this.pageLengthTgtId?Object(y.elm)(this.pageLengthTgtId):t.feature("toolbar").container(f.RIGHT);a.appendChild(Object(y.createText)(i));var u=t.feature("help");u&&u.btn?(u.btn.parentNode.insertBefore(a,u.btn),u.btn.parentNode.insertBefore(r,u.btn)):(o.appendChild(a),o.appendChild(r));for(var c=0;c<s.length;c++){var l=new Option(s[c],s[c],!1,!1);r.options[c]=l}Object(b.addEvt)(r,"change",n.slcResultsChange),this.slcResultsTxt=a,this.pageLengthSlc=r}}},{key:"removeResultsPerPage",value:function removeResultsPerPage(){this.tf.isInitialized()&&this.pageLengthSlc&&this.resultsPerPage&&(this.pageLengthSlc&&Object(y.removeElm)(this.pageLengthSlc),this.slcResultsTxt&&Object(y.removeElm)(this.slcResultsTxt),this.pageLengthSlc=null,this.slcResultsTxt=null)}},{key:"changePage",value:function changePage(t){var e=this.tf;this.isEnabled()&&(this.emitter.emit("before-page-change",e,t+1),null===t&&(t=this.pageSelectorType===v.SELECT?this.pageSlc.options.selectedIndex:this.pageSlc.value-1),0<=t&&t<=this.nbPages-1&&(this.onBeforeChangePage(this,t+1),this.currentPageNb=parseInt(t,10)+1,this.pageSelectorType===v.SELECT?this.pageSlc.options[t].selected=!0:this.pageSlc.value=this.currentPageNb,this.startPagingRow=this.pageSelectorType===v.SELECT?this.pageSlc.value:t*this.pageLength,this.groupByPage(),this.onAfterChangePage(this,t+1)),this.emitter.emit("after-page-change",e,t+1))}},{key:"changeResultsPerPage",value:function changeResultsPerPage(t){this.isEnabled()&&!isNaN(t)&&(this.pageLengthSlc.value=t,this.onChangeResultsPerPage())}},{key:"onChangeResultsPerPage",value:function onChangeResultsPerPage(){var t=this.tf;if(this.isEnabled()&&0!==t.getValidRowsNb()){var e=this.pageLengthSlc,n=this.pageSelectorType,r=this.pageSlc,i=this.emitter;i.emit("before-page-length-change",t);var s=e.selectedIndex,a=n===v.SELECT?r.selectedIndex:parseInt(r.value-1,10);if(this.pageLength=parseInt(e.options[s].value,10),this.startPagingRow=this.pageLength*a,!isNaN(this.pageLength)&&(this.startPagingRow>=t.nbFilterableRows&&(this.startPagingRow=t.nbFilterableRows-this.pageLength),this.setPagingInfo(),n===v.SELECT)){var o=r.options.length-1<=a?r.options.length-1:a;r.options[o].selected=!0}i.emit("after-page-length-change",t,this.pageLength)}}},{key:"resetPage",value:function resetPage(){var t=this.tf;if(this.isEnabled()){this.emitter.emit("before-reset-page",t);var e=t.feature("store").getPageNb();""!==e&&this.changePage(e-1),this.emitter.emit("after-reset-page",t,e)}}},{key:"resetPageLength",value:function resetPageLength(){var t=this.tf;if(this.isEnabled()){this.emitter.emit("before-reset-page-length",t);var e=t.feature("store").getPageLength();""!==e&&(this.pageLengthSlc.options[e].selected=!0,this.changeResultsPerPage()),this.emitter.emit("after-reset-page-length",t,e)}}},{key:"changePageHandler",value:function changePageHandler(t,e){this.setPage(e)}},{key:"changePageResultsHandler",value:function changePageResultsHandler(t,e){this.changeResultsPerPage(e)}},{key:"destroy",value:function destroy(){if(this.initialized){var t=this.evt;this.pageSlc&&(this.pageSelectorType===v.SELECT?Object(b.removeEvt)(this.pageSlc,"change",t.slcPagesChange):this.pageSelectorType===v.INPUT&&Object(b.removeEvt)(this.pageSlc,"keypress",t._detectKey),Object(y.removeElm)(this.pageSlc)),this.btnNextCont&&(Object(b.removeEvt)(this.btnNextCont,"click",t.next),Object(y.removeElm)(this.btnNextCont),this.btnNextCont=null),this.btnPrevCont&&(Object(b.removeEvt)(this.btnPrevCont,"click",t.prev),Object(y.removeElm)(this.btnPrevCont),this.btnPrevCont=null),this.btnLastCont&&(Object(b.removeEvt)(this.btnLastCont,"click",t.last),Object(y.removeElm)(this.btnLastCont),this.btnLastCont=null),this.btnFirstCont&&(Object(b.removeEvt)(this.btnFirstCont,"click",t.first),Object(y.removeElm)(this.btnFirstCont),this.btnFirstCont=null),this.pgBefore&&(Object(y.removeElm)(this.pgBefore),this.pgBefore=null),this.pgAfter&&(Object(y.removeElm)(this.pgAfter),this.pgAfter=null),this.pgCont&&(Object(y.removeElm)(this.pgCont),this.pgCont=null),this.hasResultsPerPage&&this.removeResultsPerPage(),this.emitter.off(["after-filtering"],Object(b.bound)(this.resetPagingInfo,this)),this.emitter.off(["change-page"],Object(b.bound)(this.changePageHandler,this)),this.emitter.off(["change-page-results"],Object(b.bound)(this.changePageResultsHandler,this)),this.pageSlc=null,this.nbPages=0,this.initialized=!1}}}]),Paging}()},function(t,e){e.remove=function removeDiacritics(t){return t.replace(/[^\u0000-\u007e]/g,function(t){return r[t]||t})};for(var n=[{base:" ",chars:" "},{base:"0",chars:"߀"},{base:"A",chars:"ⒶＡÀÁÂẦẤẪẨÃĀĂẰẮẴẲȦǠÄǞẢÅǺǍȀȂẠẬẶḀĄȺⱯ"},{base:"AA",chars:"Ꜳ"},{base:"AE",chars:"ÆǼǢ"},{base:"AO",chars:"Ꜵ"},{base:"AU",chars:"Ꜷ"},{base:"AV",chars:"ꜸꜺ"},{base:"AY",chars:"Ꜽ"},{base:"B",chars:"ⒷＢḂḄḆɃƁ"},{base:"C",chars:"ⒸＣꜾḈĆCĈĊČÇƇȻ"},{base:"D",chars:"ⒹＤḊĎḌḐḒḎĐƊƉᴅꝹ"},{base:"Dh",chars:"Ð"},{base:"DZ",chars:"ǱǄ"},{base:"Dz",chars:"ǲǅ"},{base:"E",chars:"ɛⒺＥÈÉÊỀẾỄỂẼĒḔḖĔĖËẺĚȄȆẸỆȨḜĘḘḚƐƎᴇ"},{base:"F",chars:"ꝼⒻＦḞƑꝻ"},{base:"G",chars:"ⒼＧǴĜḠĞĠǦĢǤƓꞠꝽꝾɢ"},{base:"H",chars:"ⒽＨĤḢḦȞḤḨḪĦⱧⱵꞍ"},{base:"I",chars:"ⒾＩÌÍÎĨĪĬİÏḮỈǏȈȊỊĮḬƗ"},{base:"J",chars:"ⒿＪĴɈȷ"},{base:"K",chars:"ⓀＫḰǨḲĶḴƘⱩꝀꝂꝄꞢ"},{base:"L",chars:"ⓁＬĿĹĽḶḸĻḼḺŁȽⱢⱠꝈꝆꞀ"},{base:"LJ",chars:"Ǉ"},{base:"Lj",chars:"ǈ"},{base:"M",chars:"ⓂＭḾṀṂⱮƜϻ"},{base:"N",chars:"ꞤȠⓃＮǸŃÑṄŇṆŅṊṈƝꞐᴎ"},{base:"NJ",chars:"Ǌ"},{base:"Nj",chars:"ǋ"},{base:"O",chars:"ⓄＯÒÓÔỒỐỖỔÕṌȬṎŌṐṒŎȮȰÖȪỎŐǑȌȎƠỜỚỠỞỢỌỘǪǬØǾƆƟꝊꝌ"},{base:"OE",chars:"Œ"},{base:"OI",chars:"Ƣ"},{base:"OO",chars:"Ꝏ"},{base:"OU",chars:"Ȣ"},{base:"P",chars:"ⓅＰṔṖƤⱣꝐꝒꝔ"},{base:"Q",chars:"ⓆＱꝖꝘɊ"},{base:"R",chars:"ⓇＲŔṘŘȐȒṚṜŖṞɌⱤꝚꞦꞂ"},{base:"S",chars:"ⓈＳẞŚṤŜṠŠṦṢṨȘŞⱾꞨꞄ"},{base:"T",chars:"ⓉＴṪŤṬȚŢṰṮŦƬƮȾꞆ"},{base:"Th",chars:"Þ"},{base:"TZ",chars:"Ꜩ"},{base:"U",chars:"ⓊＵÙÚÛŨṸŪṺŬÜǛǗǕǙỦŮŰǓȔȖƯỪỨỮỬỰỤṲŲṶṴɄ"},{base:"V",chars:"ⓋＶṼṾƲꝞɅ"},{base:"VY",chars:"Ꝡ"},{base:"W",chars:"ⓌＷẀẂŴẆẄẈⱲ"},{base:"X",chars:"ⓍＸẊẌ"},{base:"Y",chars:"ⓎＹỲÝŶỸȲẎŸỶỴƳɎỾ"},{base:"Z",chars:"ⓏＺŹẐŻŽẒẔƵȤⱿⱫꝢ"},{base:"a",chars:"ⓐａẚàáâầấẫẩãāăằắẵẳȧǡäǟảåǻǎȁȃạậặḁąⱥɐɑ"},{base:"aa",chars:"ꜳ"},{base:"ae",chars:"æǽǣ"},{base:"ao",chars:"ꜵ"},{base:"au",chars:"ꜷ"},{base:"av",chars:"ꜹꜻ"},{base:"ay",chars:"ꜽ"},{base:"b",chars:"ⓑｂḃḅḇƀƃɓƂ"},{base:"c",chars:"ｃⓒćĉċčçḉƈȼꜿↄ"},{base:"d",chars:"ⓓｄḋďḍḑḓḏđƌɖɗƋᏧԁꞪ"},{base:"dh",chars:"ð"},{base:"dz",chars:"ǳǆ"},{base:"e",chars:"ⓔｅèéêềếễểẽēḕḗĕėëẻěȅȇẹệȩḝęḙḛɇǝ"},{base:"f",chars:"ⓕｆḟƒ"},{base:"ff",chars:"ﬀ"},{base:"fi",chars:"ﬁ"},{base:"fl",chars:"ﬂ"},{base:"ffi",chars:"ﬃ"},{base:"ffl",chars:"ﬄ"},{base:"g",chars:"ⓖｇǵĝḡğġǧģǥɠꞡꝿᵹ"},{base:"h",chars:"ⓗｈĥḣḧȟḥḩḫẖħⱨⱶɥ"},{base:"hv",chars:"ƕ"},{base:"i",chars:"ⓘｉìíîĩīĭïḯỉǐȉȋịįḭɨı"},{base:"j",chars:"ⓙｊĵǰɉ"},{base:"k",chars:"ⓚｋḱǩḳķḵƙⱪꝁꝃꝅꞣ"},{base:"l",chars:"ⓛｌŀĺľḷḹļḽḻſłƚɫⱡꝉꞁꝇɭ"},{base:"lj",chars:"ǉ"},{base:"m",chars:"ⓜｍḿṁṃɱɯ"},{base:"n",chars:"ⓝｎǹńñṅňṇņṋṉƞɲŉꞑꞥлԉ"},{base:"nj",chars:"ǌ"},{base:"o",chars:"ⓞｏòóôồốỗổõṍȭṏōṑṓŏȯȱöȫỏőǒȍȏơờớỡởợọộǫǭøǿꝋꝍɵɔᴑ"},{base:"oe",chars:"œ"},{base:"oi",chars:"ƣ"},{base:"oo",chars:"ꝏ"},{base:"ou",chars:"ȣ"},{base:"p",chars:"ⓟｐṕṗƥᵽꝑꝓꝕρ"},{base:"q",chars:"ⓠｑɋꝗꝙ"},{base:"r",chars:"ⓡｒŕṙřȑȓṛṝŗṟɍɽꝛꞧꞃ"},{base:"s",chars:"ⓢｓśṥŝṡšṧṣṩșşȿꞩꞅẛʂ"},{base:"ss",chars:"ß"},{base:"t",chars:"ⓣｔṫẗťṭțţṱṯŧƭʈⱦꞇ"},{base:"th",chars:"þ"},{base:"tz",chars:"ꜩ"},{base:"u",chars:"ⓤｕùúûũṹūṻŭüǜǘǖǚủůűǔȕȗưừứữửựụṳųṷṵʉ"},{base:"v",chars:"ⓥｖṽṿʋꝟʌ"},{base:"vy",chars:"ꝡ"},{base:"w",chars:"ⓦｗẁẃŵẇẅẘẉⱳ"},{base:"x",chars:"ⓧｘẋẍ"},{base:"y",chars:"ⓨｙỳýŷỹȳẏÿỷẙỵƴɏỿ"},{base:"z",chars:"ⓩｚźẑżžẓẕƶȥɀⱬꝣ"}],r={},i=0;i<n.length;i+=1)for(var s=n[i].chars,a=0;a<s.length;a+=1)r[s[a]]=n[i].base;e.replacementList=n,e.diacriticsMap=r},function(t,e,n){"use strict";function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}n.r(e),n.d(e,"Emitter",function(){return r});var r=function(){function Emitter(){!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Emitter),this.events={}}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(Emitter,[{key:"on",value:function on(t,e){var n=this;t.forEach(function(t){n.events[t]=n.events[t]||[],n.events[t].push(e)})}},{key:"off",value:function off(t,e){var n=this;t.forEach(function(t){t in n.events&&n.events[t].splice(n.events[t].indexOf(e),1)})}},{key:"emit",value:function emit(t){if(t in this.events)for(var e=0;e<this.events[t].length;e++)this.events[t][e].apply(this,[].slice.call(arguments,1))}}]),Emitter}()},function(t,e,n){"use strict";n.r(e),n.d(e,"Dropdown",function(){return r});var i=n(48),f=n(2),d=n(20),h=n(8),c=n(5),p=n(4),s=n(1);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(Dropdown,i["BaseDropdown"]);var r=_createSuper(Dropdown);function Dropdown(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Dropdown);var n=(e=r.call(this,t,Dropdown)).config;return e.enableSlcResetFilter=Object(s.defaultsBool)(n.enable_slc_reset_filter,!0),e.nonEmptyText=Object(s.defaultsStr)(n.non_empty_text,"(Non empty)"),e.multipleSlcTooltip=Object(s.defaultsStr)(n.multiple_slc_tooltip,"Use Ctrl/Cmd key for multiple selections"),e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(Dropdown,[{key:"onSlcFocus",value:function onSlcFocus(t){var e=Object(c.targetEvt)(t),n=this.tf;if(n.loadFltOnDemand&&"0"===e.getAttribute("filled")){var r=e.getAttribute("ct");this.build(r)}this.emitter.emit("filter-focus",n,e)}},{key:"onSlcChange",value:function onSlcChange(){this.tf.onSlcChange&&this.tf.filter()}},{key:"refreshAll",value:function refreshAll(){var t=this.tf.getFiltersByType(p.SELECT,!0),e=this.tf.getFiltersByType(p.MULTIPLE,!0),n=t.concat(e);this.refreshFilters(n)}},{key:"init",value:function init(t,e,n){var i=this,r=this.tf,s=r.getFilterType(t),a=e?r.externalFltIds[t]:null,o=Object(f.createElm)(p.SELECT,["id",r.buildFilterId(t)],["ct",t],["filled","0"]);if(s===p.MULTIPLE&&(o.multiple=p.MULTIPLE,o.title=this.multipleSlcTooltip),o.className=s.toLowerCase()===p.SELECT?r.fltCssClass:r.fltMultiCssClass,a?Object(f.elm)(a).appendChild(o):n.appendChild(o),r.fltIds.push(o.id),r.loadFltOnDemand){var u=Object(f.createOpt)(r.getClearFilterText(t),"");o.appendChild(u)}else this.build(t);Object(c.addEvt)(o,"change",function(){return i.onSlcChange()}),Object(c.addEvt)(o,"focus",function(t){return i.onSlcFocus(t)}),this.emitter.on(["build-select-filter"],function(t,e,n,r){return i.build(e,n,r)}),this.emitter.on(["select-options"],function(t,e,n){return i.selectOptions(e,n)}),this.emitter.on(["rows-changed"],function(){return i.refreshAll()}),this.emitter.on(["after-filtering"],function(){return i.linkFilters()}),this.initialized=!0}},{key:"build",value:function build(i,t){var s=this,a=1<arguments.length&&void 0!==t&&t,o=this.tf;i=Number(i),this.emitter.emit("before-populating-filter",o,i),this.opts=[],this.optsTxt=[];var n,e=o.getFilterElement(i);if(this.isCustom=o.isCustomOptions(i),this.isCustom){var r=o.getCustomOptions(i);this.opts=r[0],this.optsTxt=r[1]}var u=o.getActiveFilterId();a&&u&&(n=o.getColumnIndexFromFilterId(u));var c=null,l=null;a&&o.disableExcludedOptions&&(c=[],l=[]),o.eachRow()(function(t){var e=o.getCellValue(t.cells[i]),n=Object(h.matchCase)(e,o.caseSensitive);if(Object(d.has)(s.opts,n,o.caseSensitive)||s.opts.push(e),a&&o.disableExcludedOptions){var r=l[i];r=r||o.getVisibleColumnValues(i),Object(d.has)(r,n,o.caseSensitive)||Object(d.has)(c,n,o.caseSensitive)||c.push(e)}},function(t,e){return-1!==o.excludeRows.indexOf(e)||(!(t.cells.length===o.nbCells&&!s.isCustom)||(!(!a||s.isValidLinkedValue(e,n))||void 0))}),this.opts=this.sortOptions(i,this.opts),c=c&&this.sortOptions(i,c),this.addOptions(i,e,a,c),this.emitter.emit("after-populating-filter",o,i,e)}},{key:"addOptions",value:function addOptions(t,e,n,r){var i=this.tf,s=e.value;e.innerHTML="",e=this.addFirstOption(e);for(var a=0;a<this.opts.length;a++)if(""!==this.opts[a]){var o=this.opts[a],u=this.isCustom?this.optsTxt[a]:o,c=!1;n&&i.disableExcludedOptions&&Object(d.has)(r,Object(h.matchCase)(o,i.caseSensitive),i.caseSensitive)&&(c=!0);var l=void 0;l=i.loadFltOnDemand&&s===this.opts[a]&&i.getFilterType(t)===p.SELECT?Object(f.createOpt)(u,o,!0):Object(f.createOpt)(u,o,!1),c&&(l.disabled=!0),e.appendChild(l)}e.setAttribute("filled","1")}},{key:"addFirstOption",value:function addFirstOption(t){var e=this.tf,n=e.getColumnIndexFromFilterId(t.id),r=Object(f.createOpt)(this.enableSlcResetFilter?e.getClearFilterText(n):"","");if(this.enableSlcResetFilter||(r.style.display=p.NONE),t.appendChild(r),e.enableEmptyOption){var i=Object(f.createOpt)(e.emptyText,e.emOperator);t.appendChild(i)}if(e.enableNonEmptyOption){var s=Object(f.createOpt)(e.nonEmptyText,e.nmOperator);t.appendChild(s)}return t}},{key:"selectOptions",value:function selectOptions(t,e){var n=1<arguments.length&&void 0!==e?e:[],r=this.tf;if(0!==n.length){var i=r.getFilterElement(t);[].forEach.call(i.options,function(t){""!==n[0]&&""!==t.value||(t.selected=!1),""!==t.value&&Object(d.has)(n,t.value,!0)&&(t.selected=!0)})}}},{key:"getValues",value:function getValues(t){var e=this.tf.getFilterElement(t),n=[];return e.selectedOptions?[].forEach.call(e.selectedOptions,function(t){return n.push(t.value)}):[].forEach.call(e.options,function(t){t.selected&&n.push(t.value)}),n}},{key:"destroy",value:function destroy(){var r=this;this.emitter.off(["build-select-filter"],function(t,e,n){return r.build(t,e,n)}),this.emitter.off(["select-options"],function(t,e,n){return r.selectOptions(e,n)}),this.emitter.off(["rows-changed"],function(){return r.refreshAll()}),this.emitter.off(["after-filtering"],function(){return r.linkFilters()}),this.initialized=!1}}]),Dropdown}()},function(t,e,n){"use strict";n.r(e),n.d(e,"CheckList",function(){return r});var i=n(48),b=n(2),d=n(20),v=n(8),f=n(5),s=n(3),h=n(4),a=n(1);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _setPrototypeOf(t,e){return(_setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(t,e){return t.__proto__=e,t})(t,e)}function _createSuper(r){var i=function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Date.prototype.toString.call(Reflect.construct(Date,[],function(){})),!0}catch(t){return!1}}();return function _createSuperInternal(){var t,e=_getPrototypeOf(r);if(i){var n=_getPrototypeOf(this).constructor;t=Reflect.construct(e,arguments,n)}else t=e.apply(this,arguments);return function _possibleConstructorReturn(t,e){return!e||"object"!==_typeof(e)&&"function"!=typeof e?function _assertThisInitialized(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}(this,t)}}function _getPrototypeOf(t){return(_getPrototypeOf=Object.setPrototypeOf?Object.getPrototypeOf:function _getPrototypeOf(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}var r=function(){!function _inherits(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&_setPrototypeOf(t,e)}(CheckList,i["BaseDropdown"]);var r=_createSuper(CheckList);function CheckList(t){var e;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,CheckList);var n=(e=r.call(this,t,CheckList)).config;return e.containers=[],e.containerCssClass=Object(a.defaultsStr)(n.div_checklist_css_class,"div_checklist"),e.filterCssClass=Object(a.defaultsStr)(n.checklist_css_class,"flt_checklist"),e.itemCssClass=Object(a.defaultsStr)(n.checklist_item_css_class,"flt_checklist_item"),e.selectedItemCssClass=Object(a.defaultsStr)(n.checklist_selected_item_css_class,"flt_checklist_slc_item"),e.activateText=Object(a.defaultsStr)(n.activate_checklist_text,"Click to load filter data"),e.disabledItemCssClass=Object(a.defaultsStr)(n.checklist_item_disabled_css_class,"flt_checklist_item_disabled"),e.enableResetOption=Object(a.defaultsBool)(n.enable_checklist_reset_filter,!0),e.prfx="chkdiv_",e}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(CheckList,[{key:"optionClick",value:function optionClick(t){var e=Object(f.targetEvt)(t),n=this.tf;this.emitter.emit("filter-focus",n,e),this.setItemOption(e),n.filter()}},{key:"onCheckListClick",value:function onCheckListClick(t){var e=this,n=Object(f.targetEvt)(t);if(this.tf.loadFltOnDemand&&"0"===n.getAttribute("filled")){var r=n.getAttribute("ct"),i=this.containers[r];this.build(r),Object(f.removeEvt)(i,"click",function(t){return e.onCheckListClick(t)})}}},{key:"refreshAll",value:function refreshAll(){var t=this.tf.getFiltersByType(h.CHECKLIST,!0);this.refreshFilters(t)}},{key:"init",value:function init(t,e,n){var r=this,i=this.tf,s=e?i.externalFltIds[t]:null,a=Object(b.createElm)("div",["id","".concat(this.prfx).concat(t,"_").concat(i.id)],["ct",t],["filled","0"]);a.className=this.containerCssClass,s?Object(b.elm)(s).appendChild(a):n.appendChild(a),this.containers[t]=a,i.fltIds.push(i.buildFilterId(t)),i.loadFltOnDemand?(Object(f.addEvt)(a,"click",function(t){return r.onCheckListClick(t)}),a.appendChild(Object(b.createText)(this.activateText))):this.build(t),this.emitter.on(["build-checklist-filter"],function(t,e,n){return r.build(e,n)}),this.emitter.on(["select-checklist-options"],function(t,e,n){return r.selectOptions(e,n)}),this.emitter.on(["rows-changed"],function(){return r.refreshAll()}),this.emitter.on(["after-filtering"],function(){return r.linkFilters()}),this.initialized=!0}},{key:"build",value:function build(i,t){var s=this,a=1<arguments.length&&void 0!==t&&t,o=this.tf;i=Number(i),this.emitter.emit("before-populating-filter",o,i),this.opts=[],this.optsTxt=[];var e=this.containers[i],n=Object(b.createElm)("ul",["id",o.fltIds[i]],["colIndex",i]);n.className=this.filterCssClass;var r,u=o.caseSensitive;if(this.isCustom=o.isCustomOptions(i),this.isCustom){var c=o.getCustomOptions(i);this.opts=c[0],this.optsTxt=c[1]}var l=o.getActiveFilterId();a&&l&&(r=o.getColumnIndexFromFilterId(l));var f=[];a&&o.disableExcludedOptions&&(this.excludedOpts=[]),e.innerHTML="",o.eachRow()(function(t){var e=o.getCellValue(t.cells[i]),n=Object(v.matchCase)(e,u);Object(d.has)(s.opts,n,u)||s.opts.push(e);var r=f[i];a&&o.disableExcludedOptions&&(r=r||o.getVisibleColumnValues(i),Object(d.has)(r,n,u)||Object(d.has)(s.excludedOpts,n,u)||s.excludedOpts.push(e))},function(t,e){return-1!==o.excludeRows.indexOf(e)||(!(t.cells.length===o.nbCells&&!s.isCustom)||(!(!a||s.isValidLinkedValue(e,r))||void 0))}),this.opts=this.sortOptions(i,this.opts),this.excludedOpts&&(this.excludedOpts=this.sortOptions(i,this.excludedOpts)),this.addChecks(i,n),o.loadFltOnDemand&&(e.innerHTML=""),e.appendChild(n),e.setAttribute("filled","1"),this.emitter.emit("after-populating-filter",o,i,e)}},{key:"addChecks",value:function addChecks(t,e){for(var n=this,r=this.tf,i=this.addTChecks(t,e),s=0;s<this.opts.length;s++){var a=this.opts[s],o=this.isCustom?this.optsTxt[s]:a,u=r.fltIds[t],c=s+i,l=Object(b.createCheckItem)("".concat(u,"_").concat(c),a,o,["data-idx",c]);l.className=this.itemCssClass,r.linkedFilters&&r.disableExcludedOptions&&Object(d.has)(this.excludedOpts,Object(v.matchCase)(a,r.caseSensitive),r.caseSensitive)?(Object(b.addClass)(l,this.disabledItemCssClass),l.check.disabled=!0,l.disabled=!0):Object(f.addEvt)(l.check,"click",function(t){return n.optionClick(t)}),e.appendChild(l),""===a&&(l.style.display=h.NONE)}}},{key:"addTChecks",value:function addTChecks(t,e){var n=this,r=this.tf,i=1,s=r.fltIds[t],a=Object(b.createCheckItem)("".concat(s,"_0"),"",r.getClearFilterText(t),["data-idx",0]);if(a.className=this.itemCssClass,e.appendChild(a),Object(f.addEvt)(a.check,"click",function(t){return n.optionClick(t)}),this.enableResetOption||(a.style.display=h.NONE),r.enableEmptyOption){var o=Object(b.createCheckItem)("".concat(s,"_1"),r.emOperator,r.emptyText,["data-idx",1]);o.className=this.itemCssClass,e.appendChild(o),Object(f.addEvt)(o.check,"click",function(t){return n.optionClick(t)}),i++}if(r.enableNonEmptyOption){var u=Object(b.createCheckItem)("".concat(s,"_2"),r.nmOperator,r.nonEmptyText,["data-idx",2]);u.className=this.itemCssClass,e.appendChild(u),Object(f.addEvt)(u.check,"click",function(t){return n.optionClick(t)}),i++}return i}},{key:"setItemOption",value:function setItemOption(t){var r=this;if(t){var e=this.tf,n=t.value,i=t.dataset.idx,s=e.getColumnIndexFromFilterId(t.id),a=e.getFilterElement(parseInt(s,10)),o=a.childNodes,u=o[i],c=a.getAttribute("value")||"",l=a.getAttribute("indexes")||"";if(t.checked){if(""===n){l.split(e.separator).forEach(function(t){t=Number(t);var e=o[t],n=Object(b.tag)(e,"input")[0];n&&0<t&&(n.checked=!1,Object(b.removeClass)(e,r.selectedItemCssClass))}),a.setAttribute("value",""),a.setAttribute("indexes","")}else{var f=l+i+e.separator,d=Object(v.trim)(c+" "+n+" "+e.orOperator);a.setAttribute("value",d),a.setAttribute("indexes",f);var h=Object(b.tag)(o[0],"input")[0];h&&(h.checked=!1)}Object(b.removeClass)(o[0],this.selectedItemCssClass),Object(b.addClass)(u,this.selectedItemCssClass)}else{var p=new RegExp(Object(v.rgxEsc)(n+" "+e.orOperator)),m=c.replace(p,""),y=new RegExp(Object(v.rgxEsc)(i+e.separator)),g=l.replace(y,"");a.setAttribute("value",Object(v.trim)(m)),a.setAttribute("indexes",g),Object(b.removeClass)(u,this.selectedItemCssClass)}}}},{key:"selectOptions",value:function selectOptions(t,e){var r=this,i=1<arguments.length&&void 0!==e?e:[],s=this.tf,n=s.getFilterElement(t);if(n&&0!==i.length){var a=Object(b.tag)(n,"li");n.setAttribute("value",""),n.setAttribute("indexes",""),[].forEach.call(a,function(t){var e=Object(b.tag)(t,"input")[0],n=Object(v.matchCase)(e.value,s.caseSensitive);""!==n&&Object(d.has)(i,n,s.caseSensitive)?e.checked=!0:-1!==i.indexOf(s.nmOperator)&&n===Object(v.matchCase)(s.nonEmptyText,s.caseSensitive)?e.checked=!0:-1!==i.indexOf(s.emOperator)&&n===Object(v.matchCase)(s.emptyText,s.caseSensitive)?e.checked=!0:e.checked=!1,r.setItemOption(e)})}}},{key:"getValues",value:function getValues(t){var e=this.tf,n=e.getFilterElement(t);if(!n)return[];var r=n.getAttribute("value"),i=Object(s.isEmpty)(r)?"":r;return i=(i=i.substr(0,i.length-3)).split(" "+e.orOperator+" ")}},{key:"destroy",value:function destroy(){var r=this;this.emitter.off(["build-checklist-filter"],function(t,e,n){return r.build(e,n)}),this.emitter.off(["select-checklist-options"],function(t,e,n){return r.selectOptions(e,n)}),this.emitter.off(["rows-changed"],function(){return r.refreshAll()}),this.emitter.off(["after-filtering"],function(){return r.linkFilters()}),this.initialized=!1}}]),CheckList}()},function(t,e,n){"use strict";n.r(e),n.d(e,"hasHashChange",function(){return c}),n.d(e,"Hash",function(){return l});var r=n(5),i=n(9);function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var s=i.root.JSON,a=i.root.location,o=i.root.decodeURIComponent,u=i.root.encodeURIComponent,c=function hasHashChange(){var t=i.root.documentMode;return"onhashchange"in i.root&&(void 0===t||7<t)},l=function(){function Hash(t){!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Hash),this.state=t,this.lastHash=null,this.emitter=t.emitter,this.boundSync=null}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(Hash,[{key:"init",value:function init(){var n=this;c()&&(this.lastHash=a.hash,this.boundSync=this.sync.bind(this),this.emitter.on(["state-changed"],function(t,e){return n.update(e)}),this.emitter.on(["initialized"],this.boundSync),Object(r.addEvt)(i.root,"hashchange",this.boundSync))}},{key:"update",value:function update(t){var e="#".concat(u(s.stringify(t)));this.lastHash!==e&&(a.hash=e,this.lastHash=e)}},{key:"parse",value:function parse(t){return-1===t.indexOf("#")?null:(t=t.substr(1),s.parse(o(t)))}},{key:"sync",value:function sync(){var t=this.parse(a.hash);t&&this.state.overrideAndSync(t)}},{key:"destroy",value:function destroy(){var n=this;this.emitter.off(["state-changed"],function(t,e){return n.update(e)}),this.emitter.off(["initialized"],this.boundSync),Object(r.removeEvt)(i.root,"hashchange",this.boundSync),this.state=null,this.lastHash=null,this.emitter=null}}]),Hash}()},function(t,e,n){"use strict";n.r(e),n.d(e,"hasStorage",function(){return u}),n.d(e,"Storage",function(){return c});var r=n(60),i=n(9);function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var s=i.root.JSON,a=i.root.localStorage,o=i.root.location,u=function hasStorage(){return"Storage"in i.root},c=function(){function Storage(t){!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Storage),this.state=t,this.tf=t.tf,this.enableLocalStorage=t.enableLocalStorage&&u(),this.enableCookie=t.enableCookie&&!this.enableLocalStorage,this.emitter=t.emitter,this.duration=t.cookieDuration}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(Storage,[{key:"init",value:function init(){var n=this;this.emitter.on(["state-changed"],function(t,e){return n.save(e)}),this.emitter.on(["initialized"],function(){return n.sync()})}},{key:"save",value:function save(t){this.enableLocalStorage?a[this.getKey()]=s.stringify(t):r.default.write(this.getKey(),s.stringify(t),this.duration)}},{key:"retrieve",value:function retrieve(){var t=null;return(t=this.enableLocalStorage?a[this.getKey()]:r.default.read(this.getKey()))?s.parse(t):null}},{key:"remove",value:function remove(){this.enableLocalStorage?a.removeItem(this.getKey()):r.default.remove(this.getKey())}},{key:"sync",value:function sync(){var t=this.retrieve();t&&this.state.overrideAndSync(t)}},{key:"getKey",value:function getKey(){return s.stringify({key:"".concat(this.tf.prfxTf,"_").concat(this.tf.id),path:o.pathname})}},{key:"destroy",value:function destroy(){var n=this;this.emitter.off(["state-changed"],function(t,e){return n.save(e)}),this.emitter.off(["initialized"],function(){return n.sync()}),this.remove(),this.state=null,this.emitter=null}}]),Storage}()},function(t,e){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,e,n){"use strict";var r=n(61)({mdy:!0,firstDayOfWeek:0,firstDayOfWeekYear:1,short:"{MM}/{dd}/{yyyy}",medium:"{Month} {d}, {yyyy}",long:"{Month} {d}, {yyyy} {time}",full:"{Weekday}, {Month} {d}, {yyyy} {time}",stamp:"{Dow} {Mon} {d} {yyyy} {time}",time:"{h}:{mm} {TT}"});t.exports=r},function(t,e,n){"use strict";t.exports={year:{base:"yyyy|ayy",requiresSuffix:!0},month:{base:"MM",requiresSuffix:!0},date:{base:"dd",requiresSuffix:!0},hour:{base:"hh",requiresSuffixOr:":"},minute:{base:"mm"},second:{base:"ss"},num:{src:"\\d+",requiresNumerals:!0}}},function(t,e,n){"use strict";t.exports=function map(t,e){for(var n=[],r=0,i=t.length;r<i;r++)r in t&&n.push(e(t[r],r));return n}},function(t,e,n){"use strict";var r=n(16).classToString;t.exports=function isClass(t,e,n){return(n=n||r(t))==="[object "+e+"]"}},function(t,e,n){"use strict";t.exports=function getRegNonCapturing(t,e){return 1<t.length&&(t="(?:"+t+")"),e&&(t+="?"),t}},function(t,e,n){"use strict";var r=n(35),i=n(36),s=n(23);t.exports=function getDaysInMonth(t){return 32-s(new Date(r(t),i(t),32),"Date")}},function(t,e,n){"use strict";t.exports=String.fromCharCode},function(t,e,n){"use strict";var r=n(15),i=r.abs,s=r.pow,a=r.round;t.exports=function withPrecision(t,e,n){var r=s(10,i(e||0));return e<0&&(r=1/r),(n=n||a)(t*r)/r}},function(t,e,n){"use strict";var r=n(15),s=n(64),a=r.abs;t.exports=function getAdjustedUnit(t,n){var r=0,i=0;return s(function(t,e){if(1<=(i=a(n(t))))return r=e,!1}),[i,r,t]}},function(t,e,n){"use strict";t.exports=6e4},function(t,e,n){"use strict";var r=n(13),i=n(37),s=r.HOURS_INDEX;t.exports=function resetTime(t){return i(t,s)}},function(t,e,n){"use strict";var r=n(34),i=n(43);t.exports=function walkUnitDown(t,e){for(;0<=t&&!1!==e(r[t],t);)t=i(t)}},function(t,e,n){"use strict";var r=n(62),i=n(40),s=n(39),a=n(165),o=n(35),u=n(36),c=n(166),l=n(41),f=n(24),d=n(29),h=n(12),p=n(108),m=h.isNumber,y=r.ISO_FIRST_DAY_OF_WEEK,g=r.ISO_FIRST_DAY_OF_WEEK_YEAR;t.exports=function setISOWeekNumber(t,e){if(m(e)){var n=l(t),r=f(t);p(n,y,g),s(n,i(n)+7*(e-1)),a(t,o(n)),c(t,u(n)),s(t,i(n)),d(t,r||7)}return t.getTime()}},function(t,e,n){"use strict";var r=n(13),i=n(39),s=n(37),a=n(67),o=r.MONTH_INDEX;t.exports=function moveToFirstDayOfWeekYear(t,e,n){s(t,o),i(t,n),a(t,e)}},function(t,e,n){"use strict";var r=n(168);t.exports=function getDateParamKey(t,e){return r(t,e)||r(t,e+"s")||"day"===e&&r(t,"date")}},function(t,e,n){"use strict";var r=n(29),i=n(24),s=n(15).ceil;t.exports=function moveToEndOfWeek(t,e){var n=e-1;return r(t,7*s((i(t)-n)/7)+n),t}},function(t,e,n){"use strict";var p=n(104),m=n(34),r=n(13),y=n(25),g=n(53),b=n(41),v=n(33),O=n(45),_=n(46),C=n(56),w=n(65),x=n(57),k=r.MONTH_INDEX;t.exports=function compareDate(t,e,n,r,i){var s,a,o,u,c,l,f,d=0,h=0;return y(t)&&((i=i||{}).fromUTC=!0,i.setUTC=!0),l=w(null,e,i,!0),0<n&&(d=h=n,o=!0),!!_(l.date)&&(l.set&&l.set.specificity&&((v(l.set.edge)||v(l.set.shift))&&(a=!0,x(l.date,l.set.specificity,r)),c=a||l.set.specificity===k?C(b(l.date),l.set.specificity,r).getTime():function addSpecificUnit(){var t=m[l.set.specificity];return O(b(l.date),t.name,1).getTime()-1}(),!o&&v(l.set.sign)&&l.set.specificity&&(h=-(d=50))),f=t.getTime(),u=l.date.getTime(),c=c||u,(s=function getTimezoneShift(){return l.set&&l.set.specificity?0:(g(l.date)-g(t))*p}())&&(u-=s,c-=s),u-d<=f&&f<=c+h)}},function(t,e,n){"use strict";var r=n(54),i=n(113);t.exports=function advanceDateWithArgs(t,e,n){return e=i(e,!0),r(t,e[0],e[1],n)}},function(t,e,n){"use strict";var r=n(12),a=n(50),o=n(63),u=n(276),c=n(277),l=r.isNumber,f=r.isString;t.exports=function collectUpdateDateArguments(t,e){var n,r,i=t[0],s=t[1];return e&&f(i)?(n=u(i),r=s):l(i)&&l(s)?n=c(t):(n=o(i)?a(i):i,r=s),[n,r]}},function(t,e,n){"use strict";var r=n(115),i=n(295),s=n(118),a=i.dateFormatMatcher;t.exports=function dateFormat(t,e,n){return s(t),e=r[e]||e||"{long}",a(e,t,n)}},function(t,e,n){"use strict";t.exports={ISO8601:"{yyyy}-{MM}-{dd}T{HH}:{mm}:{ss}.{SSS}{Z}",RFC1123:"{Dow}, {dd} {Mon} {yyyy} {HH}:{mm}:{ss} {ZZ}",RFC1036:"{Weekday}, {dd}-{Mon}-{yy} {HH}:{mm}:{ss} {ZZ}"}},function(t,e,n){"use strict";var r=n(23);t.exports=function getHours(t){return r(t,"Hours")}},function(t,e,n){"use strict";var i=n(25),s=n(26),a=n(53),o=n(70),u=n(15).abs;t.exports=function getUTCOffset(t,e){var n,r=i(t)?0:a(t);return n=!0===e?":":"",!r&&e?"Z":o(s(-r/60),2,!0)+n+o(u(r%60),2)}},function(t,e,n){"use strict";var r=n(46);t.exports=function assertDateIsValid(t){if(!r(t))throw new TypeError("Date is not valid")}},function(t,e,n){"use strict";var r=n(14),i=n(317),s=n(36),a=n(33),o=n(44),u=n(318),c=n(24),l=n(46),f=n(12),d=n(111),h=f.isString,p=r.English;t.exports=function fullCompareDate(t,e,n){var r;if(l(t)){if(h(e))switch(e=i(e).toLowerCase(),!0){case"future"===e:return t.getTime()>o().getTime();case"past"===e:return t.getTime()<o().getTime();case"today"===e:return u(t);case"tomorrow"===e:return u(t,1);case"yesterday"===e:return u(t,-1);case"weekday"===e:return 0<c(t)&&c(t)<6;case"weekend"===e:return 0===c(t)||6===c(t);case a(r=p.weekdayMap[e]):return c(t)===r;case a(r=p.monthMap[e]):return s(t)===r}return d(t,e,n)}}},function(t,e,n){"use strict";var r=n(14),c=n(114),i=n(12),l=n(118),f=n(364),d=i.isFunction,h=r.localeManager;t.exports=function dateRelative(t,e,n,r){var i,s,a,o,u;return l(t),u=d(n)?n:(o=n,r),i=f(t,e),u&&(s=u.apply(t,i.concat(h.get(o))))?c(t,s,o):(0===i[1]&&(i[1]=1,i[0]=1),a=e?"duration":0<i[2]?"future":"past",h.get(o).getRelativeFormat(i,a))}},function(t,e,n){"use strict";var r=n(12),i=n(122),s=r.isDate;t.exports=function cloneRangeMember(t){return s(t)?new Date(t.getTime()):i(t)}},function(t,e,n){"use strict";var r=n(12).isDate;t.exports=function getRangeMemberPrimitiveValue(t){return null==t?t:r(t)?t.getTime():t.valueOf()}},function(t,e,n){"use strict";var r=n(12),i=n(28),s=r.isDate,a=i.sugarDate;t.exports=function getDateForRange(t){return s(t)?t:null==t?new Date:a.create?a.create(t):new Date(t)}},function(t,e,n){"use strict";var s=n(125),a=n(38),o=n(23);t.exports=function incrementDate(t,e,n){var r,i=s[n];return i?r=new Date(t.getTime()+e*i):(r=new Date(t),a(r,n,o(t,n)+e)),r}},function(t,e,n){"use strict";t.exports={Hours:36e5,Minutes:6e4,Seconds:1e3,Milliseconds:1}},function(t,e,n){"use strict";var i=n(393),r=n(12),s=n(68),a=r.isNumber;t.exports=function getDateIncrementObject(t){var e,n,r;return a(t)?[t,"Milliseconds"]:(n=+(e=t.match(i))[1]||1,(r=s(e[2].toLowerCase())).match(/hour|minute|second/i)?r+="s":"Year"===r?r="FullYear":"Week"===r?(r="Date",n*=7):"Day"===r&&(r="Date"),[n,r])}},function(t,e,s){"use strict";s.r(e),s.d(e,"TableFilter",function(){return r});var u=s(5),l=s(2),Y=s(8),K=s(3),G=s(22),a=s(1),n=s(9),o=s(89),c=s(90),f=s(91),d=s(74),h=s(75),p=s(76),m=s(77),y=s(78),g=s(79),b=s(80),v=s(81),O=s(82),_=s(83),C=s(84),w=s(85),x=s(86),k=s(87),j=s(18),q=s(4);function _typeof(t){return(_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function _typeof(t){return typeof t}:function _typeof(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function _defineProperties(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}var S=n.root.document,P=[d.DateType,h.Help,p.State,v.MarkActiveColumns,m.GridLayout,y.Loader,g.HighlightKeyword,b.PopupFilter,O.RowsCounter,_.StatusBar,C.ClearButton,w.AlternateRows,x.NoResults,k.Paging,j.Toolbar],r=function(){function TableFilter(){var e,r=this;!function _classCallCheck(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,TableFilter),this.id=null,this.version="0.7.2",this.year=(new Date).getFullYear(),this.tbl=null,this.refRow=null,this.headersRow=null,this.cfg={},this.nbFilterableRows=0,this.nbCells=null,this.hasConfig=!1,this.initialized=!1;for(var t=arguments.length,n=new Array(t),i=0;i<t;i++)n[i]=arguments[i];if(n.forEach(function(t){"object"===_typeof(t)&&"TABLE"===t.nodeName?(r.tbl=t,r.id=t.id||"tf_".concat(Object(Y.uuid)()),r.tbl.id=r.id):Object(K.isString)(t)?(r.id=t,r.tbl=Object(l.elm)(t)):Object(K.isNumber)(t)?e=t:Object(K.isObj)(t)&&(r.cfg=t,r.hasConfig=!0)}),!this.tbl||"TABLE"!==this.tbl.nodeName)throw new Error("Could not instantiate TableFilter: HTML table\n                DOM element not found.");if(0===this.getRowsNb(!0))throw new Error("Could not instantiate TableFilter: HTML table\n                requires at least 1 row.");var s=this.cfg;this.emitter=new o.Emitter,this.refRow=Object(K.isUndef)(e)?2:e+1,this.filterTypes=[].map.call((this.dom().rows[this.refRow]||this.dom().rows[0]).cells,function(t,e){var n=r.cfg["col_".concat(e)];return n?n.toLowerCase():q.INPUT}),this.basePath=Object(a.defaultsStr)(s.base_path,"tablefilter/"),this.fltGrid=Object(a.defaultsBool)(s.grid,!0),this.gridLayout=Object(K.isObj)(s.grid_layout)||Boolean(s.grid_layout),this.filtersRowIndex=Object(a.defaultsNb)(s.filters_row_index,0),this.headersRow=Object(a.defaultsNb)(s.headers_row_index,0===this.filtersRowIndex?1:0),this.fltCellTag=Object(a.defaultsStr)(s.filters_cell_tag,q.CELL_TAG),this.fltIds=[],this.validRowsIndex=[],this.stylePath=this.getStylePath(),this.stylesheet=this.getStylesheetPath(),this.stylesheetId=this.id+"_style",this.fltsRowCssClass=Object(a.defaultsStr)(s.flts_row_css_class,"fltrow"),this.enableIcons=Object(a.defaultsBool)(s.enable_icons,!0),this.alternateRows=Boolean(s.alternate_rows),this.colWidths=Object(a.defaultsArr)(s.col_widths,[]),this.defaultColWidth=Object(a.defaultsNb)(s.default_col_width,100),this.fltCssClass=Object(a.defaultsStr)(s.flt_css_class,"flt"),this.fltMultiCssClass=Object(a.defaultsStr)(s.flt_multi_css_class,"flt_multi"),this.fltSmallCssClass=Object(a.defaultsStr)(s.flt_small_css_class,"flt_s"),this.singleFltCssClass=Object(a.defaultsStr)((s.single_filter||{}).css_class,"single_flt"),this.enterKey=Object(a.defaultsBool)(s.enter_key,!0),this.onBeforeFilter=Object(a.defaultsFn)(s.on_before_filter,K.EMPTY_FN),this.onAfterFilter=Object(a.defaultsFn)(s.on_after_filter,K.EMPTY_FN),this.caseSensitive=Boolean(s.case_sensitive),this.hasExactMatchByCol=Object(K.isArray)(s.columns_exact_match),this.exactMatchByCol=this.hasExactMatchByCol?s.columns_exact_match:[],this.exactMatch=Boolean(s.exact_match),this.ignoreDiacritics=s.ignore_diacritics,this.linkedFilters=Boolean(s.linked_filters),this.disableExcludedOptions=Boolean(s.disable_excluded_options),this.activeFilterId=null,this.hasExcludedRows=Boolean(Object(K.isArray)(s.exclude_rows)&&0<s.exclude_rows.length),this.excludeRows=Object(a.defaultsArr)(s.exclude_rows,[]),this.externalFltIds=Object(a.defaultsArr)(s.external_flt_ids,[]),this.onFiltersLoaded=Object(a.defaultsFn)(s.on_filters_loaded,K.EMPTY_FN),this.singleFlt=Object(K.isObj)(s.single_filter)||Boolean(s.single_filter),this.singleFltExcludeCols=Object(K.isObj)(s.single_filter)&&Object(K.isArray)(s.single_filter.exclude_cols)?s.single_filter.exclude_cols:[],this.onRowValidated=Object(a.defaultsFn)(s.on_row_validated,K.EMPTY_FN),this.cellParser=Object(K.isObj)(s.cell_parser)&&Object(K.isFn)(s.cell_parser.parse)&&Object(K.isArray)(s.cell_parser.cols)?s.cell_parser:{cols:[],parse:K.EMPTY_FN},this.watermark=s.watermark||"",this.isWatermarkArray=Object(K.isArray)(this.watermark),this.help=Object(K.isUndef)(s.help_instructions)?void 0:Object(K.isObj)(s.help_instructions)||Boolean(s.help_instructions),this.popupFilters=Object(K.isObj)(s.popup_filters)||Boolean(s.popup_filters),this.markActiveColumns=Object(K.isObj)(s.mark_active_columns)||Boolean(s.mark_active_columns),this.clearFilterText=Object(K.isArray)(s.clear_filter_text)?s.clear_filter_text:Object(a.defaultsStr)(s.clear_filter_text,"Clear"),this.enableEmptyOption=Boolean(s.enable_empty_option),this.emptyText=Object(a.defaultsStr)(s.empty_text,"(Empty)"),this.enableNonEmptyOption=Boolean(s.enable_non_empty_option),this.nonEmptyText=Object(a.defaultsStr)(s.non_empty_text,"(Non empty)"),this.onSlcChange=Object(a.defaultsBool)(s.on_change,!0),this.sortSlc=!!Object(K.isUndef)(s.sort_select)||Object(a.defaultsArr)(s.sort_select,Boolean(s.sort_select)),this.sortFilterOptionsAsc=Object(a.defaultsArr)(s.sort_filter_options_asc,[]),this.sortFilterOptionsDesc=Object(a.defaultsArr)(s.sort_filter_options_desc,[]),this.loadFltOnDemand=Boolean(s.load_filters_on_demand),this.hasCustomOptions=Object(K.isObj)(s.custom_options),this.customOptions=s.custom_options,this.rgxOperator=Object(a.defaultsStr)(s.regexp_operator,"rgx:"),this.emOperator=Object(a.defaultsStr)(s.empty_operator,"[empty]"),this.nmOperator=Object(a.defaultsStr)(s.nonempty_operator,"[nonempty]"),this.orOperator=Object(a.defaultsStr)(s.or_operator,"||"),this.anOperator=Object(a.defaultsStr)(s.and_operator,"&&"),this.grOperator=Object(a.defaultsStr)(s.greater_operator,">"),this.lwOperator=Object(a.defaultsStr)(s.lower_operator,"<"),this.leOperator=Object(a.defaultsStr)(s.lower_equal_operator,"<="),this.geOperator=Object(a.defaultsStr)(s.greater_equal_operator,">="),this.dfOperator=Object(a.defaultsStr)(s.different_operator,"!"),this.lkOperator=Object(a.defaultsStr)(s.like_operator,"*"),this.eqOperator=Object(a.defaultsStr)(s.equal_operator,"="),this.stOperator=Object(a.defaultsStr)(s.start_with_operator,"{"),this.enOperator=Object(a.defaultsStr)(s.end_with_operator,"}"),this.separator=Object(a.defaultsStr)(s.separator,","),this.rowsCounter=Object(K.isObj)(s.rows_counter)||Boolean(s.rows_counter),this.statusBar=Object(K.isObj)(s.status_bar)||Boolean(s.status_bar),this.loader=Object(K.isObj)(s.loader)||Boolean(s.loader),this.displayBtn=Boolean(s.btn),this.btnText=Object(a.defaultsStr)(s.btn_text,this.enableIcons?"":"Go"),this.btnCssClass=Object(a.defaultsStr)(s.btn_css_class,this.enableIcons?"btnflt_icon":"btnflt"),this.btnReset=Object(K.isObj)(s.btn_reset)||Boolean(s.btn_reset),this.onBeforeReset=Object(a.defaultsFn)(s.on_before_reset,K.EMPTY_FN),this.onAfterReset=Object(a.defaultsFn)(s.on_after_reset,K.EMPTY_FN),this.paging=Object(K.isObj)(s.paging)||Boolean(s.paging),this.nbHiddenRows=0,this.autoFilter=Object(K.isObj)(s.auto_filter)||Boolean(s.auto_filter),this.autoFilterDelay=Object(K.isObj)(s.auto_filter)&&Object(K.isNumber)(s.auto_filter.delay)?s.auto_filter.delay:q.AUTO_FILTER_DELAY,this.isUserTyping=null,this.autoFilterTimer=null,this.highlightKeywords=Boolean(s.highlight_keywords),this.noResults=Object(K.isObj)(s.no_results_message)||Boolean(s.no_results_message),this.state=Object(K.isObj)(s.state)||Boolean(s.state),this.dateType=!0,this.locale=Object(a.defaultsStr)(s.locale,"en"),this.thousandsSeparator=Object(a.defaultsStr)(s.thousands_separator,","),this.decimalSeparator=Object(a.defaultsStr)(s.decimal_separator,"."),this.colTypes=Object(K.isArray)(s.col_types)?s.col_types:[],this.prfxTf="TF",this.prfxFlt="flt",this.prfxValButton="btn",this.prfxResponsive="resp",this.stickyCssClass="sticky",this.extensions=Object(a.defaultsArr)(s.extensions,[]),this.enableDefaultTheme=Boolean(s.enable_default_theme),this.hasThemes=this.enableDefaultTheme||Object(K.isArray)(s.themes),this.themes=Object(a.defaultsArr)(s.themes,[]),this.themesPath=this.getThemesPath(),this.responsive=Boolean(s.responsive),this.toolbar=Object(K.isObj)(s.toolbar)||Boolean(s.toolbar),this.stickyHeaders=Boolean(s.sticky_headers),this.Mod={},this.ExtRegistry={},this.instantiateFeatures(P)}return function _createClass(t,e,n){return e&&_defineProperties(t.prototype,e),n&&_defineProperties(t,n),t}(TableFilter,[{key:"init",value:function init(){var n=this;if(!this.initialized){this.import(this.stylesheetId,this.getStylesheetPath(),null,"link");var t,e=this.Mod;if(this.loadThemes(),this.initFeatures([d.DateType,h.Help,p.State,v.MarkActiveColumns,m.GridLayout,y.Loader,g.HighlightKeyword,b.PopupFilter]),this.fltGrid){var r=this._insertFiltersRow();this.nbCells=this.getCellsNb(this.refRow),this.nbFilterableRows=this.getRowsNb();for(var i=this.singleFlt?1:this.nbCells,s=0;s<i;s++){this.emitter.emit("before-filter-init",this,s);var a=Object(l.createElm)(this.fltCellTag),o=this.getFilterType(s);this.singleFlt&&(a.colSpan=this.nbCells),this.gridLayout||r.appendChild(a),t=s===i-1&&this.displayBtn?this.fltSmallCssClass:this.fltCssClass,this.singleFlt&&(o=q.INPUT,t=this.singleFltCssClass),o===q.SELECT||o===q.MULTIPLE?(e.dropdown=e.dropdown||new c.Dropdown(this),e.dropdown.init(s,this.isExternalFlt(),a)):o===q.CHECKLIST?(e.checkList=e.checkList||new f.CheckList(this),e.checkList.init(s,this.isExternalFlt(),a)):this._buildInputFilter(s,t,a),s===i-1&&this.displayBtn&&this._buildSubmitButton(this.isExternalFlt()?Object(l.elm)(this.externalFltIds[s]):a),this.emitter.emit("after-filter-init",this,s)}this.emitter.on(["filter-focus"],function(t,e){return n.setActiveFilterId(e.id)})}else this._initNoFilters();this.hasExcludedRows&&(this.emitter.on(["after-filtering"],function(){return n.setExcludeRows()}),this.setExcludeRows()),this.initFeatures([O.RowsCounter,_.StatusBar,C.ClearButton,w.AlternateRows,x.NoResults,k.Paging,j.Toolbar]),this.setColWidths(),this.gridLayout||(Object(l.addClass)(this.dom(),this.prfxTf),this.responsive&&Object(l.addClass)(this.dom(),this.prfxResponsive),0<this.colWidths.length&&this.setFixedLayout(),this.stickyHeaders&&this.dom().tHead&&Object(l.addClass)(this.dom(),this.stickyCssClass)),this.initExtensions(),this.initialized=!0,this.onFiltersLoaded(this),this.emitter.emit("initialized",this)}}},{key:"detectKey",value:function detectKey(t){this.enterKey&&(Object(u.isKeyPressed)(t,[q.ENTER_KEY])?(this.filter(),Object(u.cancelEvt)(t),Object(u.stopEvt)(t)):(this.isUserTyping=!0,n.root.clearInterval(this.autoFilterTimer),this.autoFilterTimer=null))}},{key:"onKeyUp",value:function onKeyUp(t){if(this.autoFilter)if(this.isUserTyping=!1,Object(u.isKeyPressed)(t,[q.ENTER_KEY,q.TAB_KEY,q.ESC_KEY,q.UP_ARROW_KEY,q.DOWN_ARROW_KEY]))n.root.clearInterval(this.autoFilterTimer),this.autoFilterTimer=null;else{if(null!==this.autoFilterTimer)return;this.autoFilterTimer=n.root.setInterval(function filter(){n.root.clearInterval(this.autoFilterTimer),this.autoFilterTimer=null,this.isUserTyping||(this.filter(),this.isUserTyping=null)}.bind(this),this.autoFilterDelay)}}},{key:"onKeyDown",value:function onKeyDown(){this.autoFilter&&(this.isUserTyping=!0)}},{key:"onInpFocus",value:function onInpFocus(t){var e=Object(u.targetEvt)(t);this.emitter.emit("filter-focus",this,e)}},{key:"onInpBlur",value:function onInpBlur(){this.autoFilter&&(this.isUserTyping=!1,n.root.clearInterval(this.autoFilterTimer)),this.emitter.emit("filter-blur",this)}},{key:"_insertFiltersRow",value:function _insertFiltersRow(){if(!this.gridLayout){var t,e=Object(l.tag)(this.dom(),"thead");return(t=0<e.length?e[0].insertRow(this.filtersRowIndex):this.dom().insertRow(this.filtersRowIndex)).className=this.fltsRowCssClass,this.isExternalFlt()&&(t.style.display=q.NONE),this.emitter.emit("filters-row-inserted",this,t),t}}},{key:"_initNoFilters",value:function _initNoFilters(){this.fltGrid||(this.refRow=0<this.refRow?this.refRow-1:0,this.nbFilterableRows=this.getRowsNb())}},{key:"_buildInputFilter",value:function _buildInputFilter(t,e,n){var r=this,i=this.getFilterType(t),s=this.isExternalFlt()?this.externalFltIds[t]:null,a=i===q.INPUT?"text":"hidden",o=Object(l.createElm)(q.INPUT,["id",this.buildFilterId(t)],["type",a],["ct",t]);"hidden"!=a&&this.watermark&&o.setAttribute("placeholder",this.isWatermarkArray?this.watermark[t]||"":this.watermark),o.className=e||this.fltCssClass,Object(u.addEvt)(o,"focus",function(t){return r.onInpFocus(t)}),s?Object(l.elm)(s).appendChild(o):n.appendChild(o),this.fltIds.push(o.id),Object(u.addEvt)(o,"keypress",function(t){return r.detectKey(t)}),Object(u.addEvt)(o,"keydown",function(){return r.onKeyDown()}),Object(u.addEvt)(o,"keyup",function(t){return r.onKeyUp(t)}),Object(u.addEvt)(o,"blur",function(){return r.onInpBlur()})}},{key:"_buildSubmitButton",value:function _buildSubmitButton(t){var e=this,n=Object(l.createElm)(q.INPUT,["type","button"],["value",this.btnText]);n.className=this.btnCssClass,t.appendChild(n),Object(u.addEvt)(n,"click",function(){return e.filter()})}},{key:"instantiateFeatures",value:function instantiateFeatures(t){var o=this;(0<arguments.length&&void 0!==t?t:[]).forEach(function(t){var e=t;e.meta=e.meta||{name:null,altName:null},e.meta.name=Object(Y.toCamelCase)(e.name);var n=e.meta,r=n.name,i=n.altName,s=n.alwaysInstantiate,a=i||r;o.hasConfig&&!0!==o[a]&&!Boolean(s)||(o.Mod[r]=o.Mod[r]||new e(o))})}},{key:"initFeatures",value:function initFeatures(t){var i=this;(0<arguments.length&&void 0!==t?t:[]).forEach(function(t){var e=t.meta,n=e.name,r=e.altName;!0===i[r||n]&&i.Mod[n]&&i.Mod[n].init()})}},{key:"feature",value:function feature(t){return this.Mod[t]}},{key:"initExtensions",value:function initExtensions(){var e=this,t=this.extensions;0!==t.length&&(s.p=this.basePath,this.emitter.emit("before-loading-extensions",this),t.forEach(function(t){e.loadExtension(t)}),this.emitter.emit("after-loading-extensions",this))}},{key:"loadExtension",value:function loadExtension(n){var r=this;if(n&&n.name&&!this.hasExtension(n.name)){var e,i=n.name,t=n.path;e=i&&t?n.path+i:(i=i.replace(".js",""),"extensions/{}/{}".replace(/{}/g,i)),s.e(1).then(function(){var t=[s(440)("./"+e)];(function(t){var e=new t.default(r,n);e.init(),r.ExtRegistry[i]=e}).apply(null,t)}).catch(s.oe)}}},{key:"extension",value:function extension(t){return this.ExtRegistry[t]}},{key:"hasExtension",value:function hasExtension(t){return!Object(K.isEmpty)(this.ExtRegistry[t])}},{key:"registerExtension",value:function registerExtension(t,e){this.ExtRegistry[e]=t}},{key:"destroyExtensions",value:function destroyExtensions(){var e=this.ExtRegistry;Object.keys(e).forEach(function(t){e[t].destroy(),e[t]=void 0})}},{key:"loadThemes",value:function loadThemes(){var s=this;if(this.hasThemes){var t=this.themes;if(this.emitter.emit("before-loading-themes",this),this.enableDefaultTheme){this.themes.push({name:"default"})}t.forEach(function(t,e){var n=t.name,r=t.path,i=s.prfxTf+n;n&&!r?r=s.themesPath+n+"/"+n+".css":!n&&t.path&&(n="theme{0}".replace("{0}",e)),s.isImported(r,"link")||s.import(i,r,null,"link")}),this.loader=!0,this.emitter.emit("after-loading-themes",this)}}},{key:"getStylesheet",value:function getStylesheet(t){var e=0<arguments.length&&void 0!==t?t:"default";return Object(l.elm)(this.prfxTf+e)}},{key:"destroy",value:function destroy(){var n=this;if(this.initialized){var t=this.emitter;this.isExternalFlt()&&!this.popupFilters&&this.removeExternalFlts(),this.destroyExtensions(),this.validateAllRows(),t.emit("destroy",this),this.fltGrid&&!this.gridLayout&&this.dom().deleteRow(this.filtersRowIndex),this.hasExcludedRows&&t.off(["after-filtering"],function(){return n.setExcludeRows()}),this.emitter.off(["filter-focus"],function(t,e){return n.setActiveFilterId(e.id)}),Object(l.removeClass)(this.dom(),this.prfxTf),Object(l.removeClass)(this.dom(),this.prfxResponsive),this.dom().tHead&&Object(l.removeClass)(this.dom().tHead,this.stickyCssClass),this.nbHiddenRows=0,this.validRowsIndex=[],this.fltIds=[],this.initialized=!1}}},{key:"removeExternalFlts",value:function removeExternalFlts(){this.isExternalFlt()&&this.externalFltIds.forEach(function(t){var e=Object(l.elm)(t);e&&(e.innerHTML="")})}},{key:"isCustomOptions",value:function isCustomOptions(t){return this.hasCustomOptions&&-1!==this.customOptions.cols.indexOf(t)}},{key:"getCustomOptions",value:function getCustomOptions(t){if(!Object(K.isEmpty)(t)&&this.isCustomOptions(t)){for(var e=this.customOptions,n=[],r=[],i=e.cols.indexOf(t),s=e.values[i],a=e.texts[i],o=e.sorts[i],u=0,c=s.length;u<c;u++)r.push(s[u]),a[u]?n.push(a[u]):n.push(s[u]);return o&&(r.sort(),n.sort()),[r,n]}}},{key:"filter",value:function filter(){var v=this;if(this.fltGrid&&this.initialized){var O=this.emitter;this.onBeforeFilter(this),O.emit("before-filtering",this);var _=0;this.validRowsIndex=[];var C=this.getFiltersValue();this.eachRow()(function(t,e){t.style.display="";for(var n=t.cells,r=n.length,i=[],s=!0,a=!1,o=0;o<r;o++){var u=C[v.singleFlt?0:o];if(""!==u){var c=Object(Y.matchCase)(v.getCellValue(n[o]),v.caseSensitive),l=u.toString().split(v.orOperator),f=1<l.length,d=u.toString().split(v.anOperator),h=1<d.length;if(Object(K.isArray)(u)||f||h){for(var p=void 0,m=void 0,y=!1,g=0,b=(m=Object(K.isArray)(u)?u:f?l:d).length;g<b&&(p=Object(Y.trim)(m[g]),(y=v._match(p,c,n[o]))&&O.emit("highlight-keyword",v,n[o],p),!(f&&y||h&&!y))&&(!Object(K.isArray)(u)||!y);g++);i[o]=y}else i[o]=v._match(Object(Y.trim)(u),c,n[o]),i[o]&&O.emit("highlight-keyword",v,n[o],u);i[o]||(s=!1),v.singleFlt&&-1===v.singleFltExcludeCols.indexOf(o)&&i[o]&&(a=!0),O.emit("cell-processed",v,o,n[o])}}a&&(s=!0),v.validateRow(e,s),s||_++,O.emit("row-processed",v,e,v.validRowsIndex.length-1,s)},function(t){return t.cells.length!==v.nbCells}),this.nbHiddenRows=_,this.onAfterFilter(this),O.emit("after-filtering",this,C)}}},{key:"_match",value:function _match(t,e,n){var r,i=n.cellIndex,s=this.getDecimal(i),a=new RegExp(this.leOperator),o=new RegExp(this.geOperator),u=new RegExp(this.lwOperator),c=new RegExp(this.grOperator),l=new RegExp(this.dfOperator),f=new RegExp(Object(Y.rgxEsc)(this.lkOperator)),d=new RegExp(this.eqOperator),h=new RegExp(this.stOperator),p=new RegExp(this.enOperator),m=this.emOperator,y=this.nmOperator,g=new RegExp(Object(Y.rgxEsc)(this.rgxOperator));t=Object(Y.matchCase)(t,this.caseSensitive);var b=!1,v=u.test(t),O=a.test(t),_=c.test(t),C=o.test(t),w=l.test(t),x=d.test(t),k=f.test(t),j=h.test(t),S=p.test(t),P=m===t,E=y===t,T=g.test(t);if(this.hasType(i,[q.DATE])){var N,F,R=this.Mod.dateType,D=R.isValid.bind(R),I=R.parse.bind(R),A=R.getLocale(i),M=v&&D(t.replace(u,""),A),L=O&&D(t.replace(a,""),A),H=_&&D(t.replace(c,""),A),z=C&&D(t.replace(o,""),A),B=w&&D(t.replace(l,""),A),W=x&&D(t.replace(d,""),A);N=I(e,A),b=L?N<=(F=I(t.replace(a,""),A)):M?N<(F=I(t.replace(u,""),A)):z?(F=I(t.replace(o,""),A))<=N:H?(F=I(t.replace(c,""),A))<N:B?(F=I(t.replace(l,""),A),N.toString()!==F.toString()):W?(F=I(t.replace(d,""),A),N.toString()===F.toString()):f.test(t)?Object(Y.contains)(t.replace(f,""),e,!1,this.caseSensitive):D(t)?(F=I(t,A),N.toString()===F.toString()):P?!n.hasChildNodes()||Object(K.isEmpty)(e):E?n.hasChildNodes()&&!Object(K.isEmpty)(e):Object(Y.contains)(t,e,this.isExactMatch(i),this.caseSensitive)}else if(r=Object(G.parse)(e,s)||Number(e),T)try{var U=t.replace(g,"");b=new RegExp(U).test(e)}catch(t){b=!1}else if(O)b=r<=Object(G.parse)(t.replace(a,""),s);else if(C)b=r>=Object(G.parse)(t.replace(o,""),s);else if(v)b=r<Object(G.parse)(t.replace(u,""),s);else if(_)b=r>Object(G.parse)(t.replace(c,""),s);else if(w)b=!Object(Y.contains)(t.replace(l,""),e,!1,this.caseSensitive);else if(k)b=Object(Y.contains)(t.replace(f,""),e,!1,this.caseSensitive);else if(x)b=Object(Y.contains)(t.replace(d,""),e,!0,this.caseSensitive);else if(j)b=0===e.indexOf(t.replace(h,""));else if(S){var V=t.replace(p,"");b=e.lastIndexOf(V,e.length-1)===e.length-1-(V.length-1)&&-1<e.lastIndexOf(V,e.length-1)}else b=P?!n.hasChildNodes()||Object(K.isEmpty)(e):E?n.hasChildNodes()&&!Object(K.isEmpty)(e):r&&this.hasType(i,[q.NUMBER,q.FORMATTED_NUMBER])&&!this.singleFlt?r===(t=Object(G.parse)(t,s)||t)||Object(Y.contains)(t.toString(),r.toString(),this.isExactMatch(i),this.caseSensitive):Object(Y.contains)(t,e,this.isExactMatch(i),this.caseSensitive,this.ignoresDiacritics(i));return b}},{key:"getColumnData",value:function getColumnData(t,e,n){var r=1<arguments.length&&void 0!==e&&e,i=2<arguments.length&&void 0!==n?n:[];return this.getColValues(t,r,!0,i)}},{key:"getColumnValues",value:function getColumnValues(t,e,n){var r=1<arguments.length&&void 0!==e&&e,i=2<arguments.length&&void 0!==n?n:[];return this.getColValues(t,r,!1,i)}},{key:"getColValues",value:function getColValues(s,t,e,n){var a=this,r=1<arguments.length&&void 0!==t&&t,o=3<arguments.length&&void 0!==n?n:[],u=[],c=2<arguments.length&&void 0!==e&&e?this.getCellData.bind(this):this.getCellValue.bind(this);return r&&u.push(this.getHeadersText()[s]),this.eachRow()(function(t,e){var n=-1!==o.indexOf(e),r=t.cells;if(r.length===a.nbCells&&!n){var i=c(r[s]);u.push(i)}}),u}},{key:"getFilterValue",value:function getFilterValue(t){if(this.fltGrid){var e="",n=this.getFilterElement(t);if(!n)return e;var r=this.getFilterType(t);return r!==q.MULTIPLE&&r!==q.CHECKLIST?e=n.value:r===q.MULTIPLE?e=this.feature("dropdown").getValues(t):r===q.CHECKLIST&&(e=this.feature("checkList").getValues(t)),(Object(K.isArray)(e)&&0===e.length||1===e.length&&""===e[0])&&(e=""),e}}},{key:"getFiltersValue",value:function getFiltersValue(){var r=this;if(this.fltGrid){var i=[];return this.fltIds.forEach(function(t,e){var n=r.getFilterValue(e);Object(K.isArray)(n)?i.push(n):i.push(Object(Y.trim)(n))}),i}}},{key:"getFilterId",value:function getFilterId(t){if(this.fltGrid)return this.fltIds[t]}},{key:"getFiltersByType",value:function getFiltersByType(t,e){if(this.fltGrid){for(var n=[],r=0,i=this.fltIds.length;r<i;r++){if(this.getFilterType(r)===t.toLowerCase()){var s=e?r:this.fltIds[r];n.push(s)}}return n}}},{key:"getFilterElement",value:function getFilterElement(t){return Object(l.elm)(this.fltIds[t])}},{key:"getCellsNb",value:function getCellsNb(t){var e=0<arguments.length&&void 0!==t?t:0,n=this.dom().rows[0<=e?e:0];return n?n.cells.length:0}},{key:"getRowsNb",value:function getRowsNb(t){var e=this.getWorkingRows().length;return this.dom().tHead?t?e+this.dom().querySelectorAll("thead > tr").length:e:t?e:e-this.refRow}},{key:"getWorkingRows",value:function getWorkingRows(){return S.querySelectorAll("table#".concat(this.id," > tbody > tr"))}},{key:"getCellValue",value:function getCellValue(t){var e=t.cellIndex,n=this.cellParser;return-1!==n.cols.indexOf(e)?n.parse(this,t,e):Object(l.getText)(t)}},{key:"getCellData",value:function getCellData(t){var e=t.cellIndex,n=this.getCellValue(t);if(this.hasType(e,[q.FORMATTED_NUMBER]))return Object(G.parse)(n,this.getDecimal(e));if(this.hasType(e,[q.NUMBER]))return Number(n);if(this.hasType(e,[q.DATE])){var r=this.Mod.dateType;return r.parse(n,r.getLocale(e))}return n}},{key:"getData",value:function getData(t,e){var n=0<arguments.length&&void 0!==t&&t,r=1<arguments.length&&void 0!==e&&e;return this.getTableData(n,r,!0)}},{key:"getValues",value:function getValues(t,e){var n=0<arguments.length&&void 0!==t&&t,r=1<arguments.length&&void 0!==e&&e;return this.getTableData(n,r,!1)}},{key:"getTableData",value:function getTableData(t,e,n){var o=this,r=0<arguments.length&&void 0!==t&&t,u=1<arguments.length&&void 0!==e&&e,c=[],l=2<arguments.length&&void 0!==n&&n?this.getCellData.bind(this):this.getCellValue.bind(this);if(r){var i=this.getHeadersText(u);c.push([this.getHeadersRowIndex(),i])}return this.eachRow()(function(t,e){for(var n=[e,[]],r=t.cells,i=0,s=r.length;i<s;i++)if(!(u&&o.hasExtension("colsVisibility")&&o.extension("colsVisibility").isColHidden(i))){var a=l(r[i]);n[1].push(a)}c.push(n)}),c}},{key:"getFilteredData",value:function getFilteredData(t,e){var n=0<arguments.length&&void 0!==t&&t,r=1<arguments.length&&void 0!==e&&e;return this.filteredData(n,r,!0)}},{key:"getFilteredValues",value:function getFilteredValues(t,e){var n=0<arguments.length&&void 0!==t&&t,r=1<arguments.length&&void 0!==e&&e;return this.filteredData(n,r,!1)}},{key:"filteredData",value:function filteredData(){var t=0<arguments.length&&void 0!==arguments[0]&&arguments[0],e=1<arguments.length&&void 0!==arguments[1]&&arguments[1],n=2<arguments.length&&void 0!==arguments[2]&&arguments[2];if(0===this.validRowsIndex.length)return[];var r=this.dom().rows,filteredData=[],i=n?this.getCellData.bind(this):this.getCellValue.bind(this);if(t){var s=this.getHeadersText(e);filteredData.push([this.getHeadersRowIndex(),s])}for(var a=this.getValidRows(!0),o=0;o<a.length;o++){for(var u=[this.validRowsIndex[o],[]],c=r[this.validRowsIndex[o]].cells,l=0;l<c.length;l++)if(!(e&&this.hasExtension("colsVisibility")&&this.extension("colsVisibility").isColHidden(l))){var f=i(c[l]);u[1].push(f)}filteredData.push(u)}return filteredData}},{key:"getFilteredColumnData",value:function getFilteredColumnData(t,e,n){var r=1<arguments.length&&void 0!==e&&e,i=2<arguments.length&&void 0!==n?n:[];return this.getFilteredDataCol(t,r,!0,i,!1)}},{key:"getVisibleColumnData",value:function getVisibleColumnData(t,e,n){var r=1<arguments.length&&void 0!==e&&e,i=2<arguments.length&&void 0!==n?n:[];return this.getFilteredDataCol(t,r,!0,i,!0)}},{key:"getFilteredColumnValues",value:function getFilteredColumnValues(t,e,n){var r=1<arguments.length&&void 0!==e&&e,i=2<arguments.length&&void 0!==n?n:[];return this.getFilteredDataCol(t,r,!1,i,!1)}},{key:"getVisibleColumnValues",value:function getVisibleColumnValues(t,e,n){var r=1<arguments.length&&void 0!==e&&e,i=2<arguments.length&&void 0!==n?n:[];return this.getFilteredDataCol(t,r,!1,i,!0)}},{key:"getFilteredDataCol",value:function getFilteredDataCol(e,t,n,r,i){var s=this,a=1<arguments.length&&void 0!==t&&t,o=2<arguments.length&&void 0!==n&&n,u=3<arguments.length&&void 0!==r?r:[],c=!(4<arguments.length&&void 0!==i)||i;if(Object(K.isUndef)(e))return[];var l=this.dom().rows,f=o?this.getCellData.bind(this):this.getCellValue.bind(this),d=this.getValidRows(!0).filter(function(t){return-1===u.indexOf(t)&&(!c||"none"!==s.getRowDisplay(l[t]))}).map(function(t){return f(l[t].cells[e])});return a&&d.unshift(this.getHeadersText()[e]),d}},{key:"getRowDisplay",value:function getRowDisplay(t){return t.style.display}},{key:"validateRow",value:function validateRow(t,e){var n=this.dom().rows[t];if(n&&Object(K.isBoolean)(e)){-1!==this.excludeRows.indexOf(t)&&(e=!0);var r=e?"":q.NONE,i=e?"true":"false";n.style.display=r,this.paging&&n.setAttribute("validRow",i),e&&(-1===this.validRowsIndex.indexOf(t)&&this.validRowsIndex.push(t),this.onRowValidated(this,t),this.emitter.emit("row-validated",this,t))}}},{key:"validateAllRows",value:function validateAllRows(){if(this.initialized){this.validRowsIndex=[];for(var t=this.refRow;t<this.nbFilterableRows;t++)this.validateRow(t,!0)}}},{key:"setFilterValue",value:function setFilterValue(t,e){var n=1<arguments.length&&void 0!==e?e:"";if(this.fltGrid){var r=this.getFilterElement(t),i=this.getFilterType(t);if(r)if(i===q.MULTIPLE){var s=Object(K.isArray)(n)?n:n.split(" "+this.orOperator+" ");this.loadFltOnDemand&&!this.initialized&&this.emitter.emit("build-select-filter",this,t,this.linkedFilters,this.isExternalFlt()),this.emitter.emit("select-options",this,t,s)}else if(i===q.CHECKLIST){var a=[];this.loadFltOnDemand&&!this.initialized&&this.emitter.emit("build-checklist-filter",this,t,this.linkedFilters),a=Object(K.isArray)(n)?n:(n=Object(Y.matchCase)(n,this.caseSensitive)).split(" "+this.orOperator+" "),this.emitter.emit("select-checklist-options",this,t,a)}else this.loadFltOnDemand&&!this.initialized&&this.emitter.emit("build-select-filter",this,t,this.linkedFilters,this.isExternalFlt()),r.value=n}}},{key:"setFixedLayout",value:function setFixedLayout(t){var e=0<arguments.length&&void 0!==t?t:this.dom(),n=this.colWidths,r=e.clientWidth;if(0<n.length){var i=this.defaultColWidth;r=n.reduce(function(t,e){return parseInt(t||i,10)+parseInt(e||i,10)})}e.style.width="".concat(r,"px"),e.style.tableLayout="fixed"}},{key:"setColWidths",value:function setColWidths(t){var e=0<arguments.length&&void 0!==t?t:this.dom(),n=this.colWidths;if(0!==n.length){var r=Object(l.tag)(e,"col"),i=0<r.length,s=i?null:S.createDocumentFragment();this.eachCol(function(t){var e;i?e=r[t]:(e=Object(l.createElm)("col"),s.appendChild(e)),e.style.width=n[t]}),i||e.insertBefore(s,e.firstChild)}}},{key:"setExcludeRows",value:function setExcludeRows(){var e=this;this.hasExcludedRows&&this.excludeRows.forEach(function(t){return e.validateRow(t,!0)})}},{key:"clearFilters",value:function clearFilters(){if(this.fltGrid){this.emitter.emit("before-clearing-filters",this),this.onBeforeReset(this,this.getFiltersValue());for(var t=0,e=this.fltIds.length;t<e;t++)this.setFilterValue(t,"");this.filter(),this.onAfterReset(this),this.emitter.emit("after-clearing-filters",this)}}},{key:"getActiveFilterId",value:function getActiveFilterId(){return this.activeFilterId}},{key:"setActiveFilterId",value:function setActiveFilterId(t){this.activeFilterId=t}},{key:"getColumnIndexFromFilterId",value:function getColumnIndexFromFilterId(t){var e=(0<arguments.length&&void 0!==t?t:"").split("_")[0];return e=e.split(this.prfxFlt)[1],parseInt(e,10)}},{key:"buildFilterId",value:function buildFilterId(t){return"".concat(this.prfxFlt).concat(t,"_").concat(this.id)}},{key:"isExternalFlt",value:function isExternalFlt(){return 0<this.externalFltIds.length}},{key:"getStylePath",value:function getStylePath(){return Object(a.defaultsStr)(this.config.style_path,this.basePath+"style/")}},{key:"getStylesheetPath",value:function getStylesheetPath(){return Object(a.defaultsStr)(this.config.stylesheet,this.getStylePath()+"tablefilter.css")}},{key:"getThemesPath",value:function getThemesPath(){return Object(a.defaultsStr)(this.config.themes_path,this.getStylePath()+"themes/")}},{key:"activateFilter",value:function activateFilter(t){Object(K.isUndef)(t)||this.setActiveFilterId(this.getFilterId(t))}},{key:"isExactMatch",value:function isExactMatch(t){var e=this.getFilterType(t);return this.exactMatchByCol[t]||this.exactMatch||e!==q.INPUT}},{key:"isRowValid",value:function isRowValid(t){return-1!==this.getValidRows().indexOf(t)}},{key:"isRowDisplayed",value:function isRowDisplayed(t){var e=this.dom().rows[t];return""===this.getRowDisplay(e)}},{key:"ignoresDiacritics",value:function ignoresDiacritics(t){var e=this.ignoreDiacritics;return Object(K.isArray)(e)?e[t]:Boolean(e)}},{key:"getClearFilterText",value:function getClearFilterText(t){var e=this.clearFilterText;return Object(K.isArray)(e)?e[t]:e}},{key:"eachCol",value:function eachCol(t,e,n){for(var r=0<arguments.length&&void 0!==t?t:K.EMPTY_FN,i=1<arguments.length&&void 0!==e?e:K.EMPTY_FN,s=2<arguments.length&&void 0!==n?n:K.EMPTY_FN,a=this.getCellsNb(this.refRow),o=0;o<a;o++)if(!0!==i(o)){if(!0===s(o))break;r(o)}}},{key:"eachRow",value:function eachRow(t){var a=this,o=0<arguments.length&&void 0!==t?t:this.refRow;return function(){for(var t=0<arguments.length&&void 0!==arguments[0]?arguments[0]:K.EMPTY_FN,e=1<arguments.length&&void 0!==arguments[1]?arguments[1]:K.EMPTY_FN,n=2<arguments.length&&void 0!==arguments[2]?arguments[2]:K.EMPTY_FN,r=a.dom().rows,i=a.getRowsNb(!0),s=o;s<i;s++)if(!0!==e(r[s],s)){if(!0===n(r[s],s))break;t(r[s],s)}}}},{key:"isImported",value:function isImported(t,e){for(var n=1<arguments.length&&void 0!==e?e:"script",r=!1,i="script"===n?"src":"href",s=Object(l.tag)(S,n),a=0,o=s.length;a<o;a++)if(!Object(K.isUndef)(s[a][i])&&s[a][i].match(t)){r=!0;break}return r}},{key:"import",value:function _import(t,e,n,r){var i=this,s=3<arguments.length&&void 0!==r?r:"script";if(!this.isImported(e,s)){var a,o=this,u=!1,c=Object(l.tag)(S,"head")[0];(a="link"===s.toLowerCase()?Object(l.createElm)("link",["id",t],["type","text/css"],["rel","stylesheet"],["href",e]):Object(l.createElm)("script",["id",t],["type","text/javascript"],["src",e])).onload=a.onreadystatechange=function(){u||i.readyState&&"loaded"!==i.readyState&&"complete"!==i.readyState||(u=!0,"function"==typeof n&&n.call(null,o))},a.onerror=function(){throw new Error("TableFilter could not load: ".concat(e))},c.appendChild(a)}}},{key:"isInitialized",value:function isInitialized(){return this.initialized}},{key:"getFiltersId",value:function getFiltersId(){return this.fltIds||[]}},{key:"getValidRows",value:function getValidRows(t){var e=this;return t&&(this.validRowsIndex=[],this.eachRow()(function(t){e.paging?"true"!==t.getAttribute("validRow")&&null!==t.getAttribute("validRow")||e.validRowsIndex.push(t.rowIndex):e.getRowDisplay(t)!==q.NONE&&e.validRowsIndex.push(t.rowIndex)})),this.validRowsIndex}},{key:"getFiltersRowIndex",value:function getFiltersRowIndex(){return this.filtersRowIndex}},{key:"getHeadersRowIndex",value:function getHeadersRowIndex(){return this.headersRow}},{key:"getStartRowIndex",value:function getStartRowIndex(){return this.refRow}},{key:"getLastRowIndex",value:function getLastRowIndex(){return this.getRowsNb(!0)-1}},{key:"hasType",value:function hasType(t,e){var n=1<arguments.length&&void 0!==e?e:[];if(0===this.colTypes.length)return!1;var r=this.colTypes[t];return Object(K.isObj)(r)&&(r=r.type),-1!==n.indexOf(r)}},{key:"getHeaderElement",value:function getHeaderElement(t){var e,n=this.gridLayout?this.Mod.gridLayout.headTbl:this.dom(),r=Object(l.tag)(n,"thead"),i=this.getHeadersRowIndex();return 0===r.length&&(e=n.rows[i].cells[t]),1===r.length&&(e=r[0].rows[i].cells[t]),e}},{key:"getHeadersText",value:function getHeadersText(t){var r=this,e=0<arguments.length&&void 0!==t&&t,i=[];return this.eachCol(function(t){var e=r.getHeaderElement(t),n=Object(l.getFirstTextNode)(e);i.push(n)},function(t){return!(!e||!r.hasExtension("colsVisibility"))&&r.extension("colsVisibility").isColHidden(t)}),i}},{key:"getFilterType",value:function getFilterType(t){return this.filterTypes[t]}},{key:"getFilterableRowsNb",value:function getFilterableRowsNb(){return this.getRowsNb(!1)}},{key:"getValidRowsNb",value:function getValidRowsNb(t){var e=0<arguments.length&&void 0!==t&&t;return this.getValidRows(e).length}},{key:"dom",value:function dom(){return this.tbl}},{key:"getDecimal",value:function getDecimal(t){var e=this.decimalSeparator;if(this.hasType(t,[q.FORMATTED_NUMBER])){var n=this.colTypes[t];n.hasOwnProperty("decimal")&&(e=n.decimal)}return e}},{key:"config",value:function config(){return this.cfg}}]),TableFilter}()},function(t,e,n){"use strict";n(11),n(156),n(175),n(177),n(178),n(179),n(180),n(181),n(186),n(187),n(188),n(189),n(190),n(191),n(192),n(193),n(194),n(195),n(196),n(197),n(198),n(199),n(200),n(201),n(202),n(203),n(204),n(205),n(206),n(207),n(208),n(209),n(210),n(211),n(212),n(213),n(214),n(215),n(216),n(217),n(218),n(219),n(220),n(221),n(222),n(223),n(224),n(225),n(226),n(227),n(228),n(229),n(230),n(231),n(232),n(233),n(234),n(235),n(236),n(237),n(238),n(239),n(240),n(241),n(242),n(243),n(244),n(245),n(246),n(247),n(248),n(249),n(250),n(251),n(252),n(253),n(254),n(255),n(256),n(257),n(258),n(259),n(260),n(261),n(262),n(263),n(264),n(265),n(266),n(268),n(269),n(270),n(271),n(272),n(273),n(274),n(275),n(278),n(279),n(280),n(281),n(282),n(283),n(284),n(285),n(286),n(287),n(288),n(289),n(290),n(291),n(292),n(293),n(294),n(306),n(308),n(309),n(310),n(311),n(312),n(313),n(314),n(315),n(316),n(319),n(320),n(321),n(322),n(324),n(325),n(326),n(327),n(328),n(329),n(330),n(331),n(332),n(333),n(334),n(335),n(336),n(337),n(338),n(339),n(340),n(341),n(342),n(343),n(345),n(346),n(347),n(348),n(349),n(350),n(351),n(352),n(353),n(354),n(355),n(356),n(357),n(358),n(359),n(360),n(361),n(362),n(363),n(365),n(366),n(368),n(369),n(370),n(371),n(372),n(373),n(374),n(375),n(376),n(377),n(378),n(379),n(380),n(381),n(382),n(383),n(384),n(385),n(386),t.exports=n(0)},function(t,e,n){"use strict";var r=n(130),i={"en-US":n(95),"en-GB":r,"en-AU":r,"en-CA":n(132)};t.exports=i},function(t,e,n){"use strict";var r=n(61)({short:"{dd}/{MM}/{yyyy}",medium:"{d} {Month} {yyyy}",long:"{d} {Month} {yyyy} {H}:{mm}",full:"{Weekday}, {d} {Month}, {yyyy} {time}",stamp:"{Dow} {d} {Mon} {yyyy} {time}"});t.exports=r},function(t,e,n){"use strict";t.exports={code:"en",plural:!0,timeMarkers:"at",ampm:"AM|A.M.|a,PM|P.M.|p",units:"millisecond:|s,second:|s,minute:|s,hour:|s,day:|s,week:|s,month:|s,year:|s",months:"Jan:uary|,Feb:ruary|,Mar:ch|,Apr:il|,May,Jun:e|,Jul:y|,Aug:ust|,Sep:tember|t|,Oct:ober|,Nov:ember|,Dec:ember|",weekdays:"Sun:day|,Mon:day|,Tue:sday|,Wed:nesday|,Thu:rsday|,Fri:day|,Sat:urday|+weekend",numerals:"zero,one|first,two|second,three|third,four:|th,five|fifth,six:|th,seven:|th,eight:|h,nin:e|th,ten:|th",articles:"a,an,the",tokens:"the,st|nd|rd|th,of|in,a|an,on",time:"{H}:{mm}",past:"{num} {unit} {sign}",future:"{num} {unit} {sign}",duration:"{num} {unit}",modifiers:[{name:"half",src:"half",value:.5},{name:"midday",src:"noon",value:12},{name:"midday",src:"midnight",value:24},{name:"day",src:"yesterday",value:-1},{name:"day",src:"today|tonight",value:0},{name:"day",src:"tomorrow",value:1},{name:"sign",src:"ago|before",value:-1},{name:"sign",src:"from now|after|from|in|later",value:1},{name:"edge",src:"first day|first|beginning",value:-2},{name:"edge",src:"last day",value:1},{name:"edge",src:"end|last",value:2},{name:"shift",src:"last",value:-1},{name:"shift",src:"the|this",value:0},{name:"shift",src:"next",value:1}],parse:["(?:just)? now","{shift} {unit:5-7}","{months?} {year}","{midday} {4?} {day|weekday}","{months},?[-.\\/\\s]?{year?}","{edge} of (?:day)? {day|weekday}","{0} {num}{1?} {weekday} {2} {months},? {year?}","{shift?} {day?} {weekday?} (?:at)? {midday}","{sign?} {3?} {half} {3?} {unit:3-4|unit:7} {sign?}","{0?} {edge} {weekday?} {2} {shift?} {unit:4-7?} {months?},? {year?}"],timeParse:["{day|weekday}","{shift} {unit:5?} {weekday}","{0?} {date}{1?} {2?} {months?}","{weekday} {2?} {shift} {unit:5}","{0?} {num} {2?} {months}\\.?,? {year?}","{num?} {unit:4-5} {sign} {day|weekday}","{0|months} {date?}{1?} of {shift} {unit:6-7}","{0?} {num}{1?} {weekday} of {shift} {unit:6}","{year?}[-.\\/\\s]?{months}[-.\\/\\s]{date}","{date}[-.\\/\\s]{months}(?:[-.\\/\\s]{year|yy})?","{weekday?}\\.?,? {months}\\.?,? {date}{1?},? {year?}","{weekday?}\\.?,? {date} {months} {year}"],timeFrontParse:["{sign} {num} {unit}","{num} {unit} {sign}","{4?} {day|weekday}"]}},function(t,e,n){"use strict";var r=n(61)({short:"{yyyy}-{MM}-{dd}",medium:"{d} {Month}, {yyyy}",long:"{d} {Month}, {yyyy} {H}:{mm}",full:"{Weekday}, {d} {Month}, {yyyy} {time}",stamp:"{Dow} {d} {Mon} {yyyy} {time}"});t.exports=r},function(t,e,n){"use strict";var r=n(134),i=n(62),l=n(135),s=n(136),a=n(96),o=n(97),f=n(137),d=n(32),u=n(33),h=n(141),c=n(12),p=n(15),m=n(42),y=n(49),g=n(146),b=n(147),v=n(99),O=n(16),_=n(64),C=n(150),w=n(152),x=n(154),k=n(155),j=O.hasOwn,S=O.getOwn,P=O.forEachProperty,E=w.fullWidthNumberMap,T=w.fullWidthNumbers,N=p.pow,F=p.max,R=i.ISO_FIRST_DAY_OF_WEEK,D=i.ISO_FIRST_DAY_OF_WEEK_YEAR,I=c.isString,A=c.isFunction;t.exports=function getNewLocale(t){function Locale(t){this.init(t)}return Locale.prototype={getMonthName:function(t,e){return this.monthSuffix?t+1+this.monthSuffix:b(this.months,t,e,12)},getWeekdayName:function(t,e){return b(this.weekdays,t,e,7)},parseValue:function(t,e){var n=this[e+"Map"];return j(n,t)?n[t]:this.parseNumber(t,e)},parseNumber:function(t,e){var n;return j(this.numeralMap,t)&&(n=this.numeralMap[t]),isNaN(n)&&(n=this.parseRegularNumerals(t)),isNaN(n)&&(n=this.parseIrregularNumerals(t)),"month"===e&&(n-=1),n},parseRegularNumerals:function(t){return+(t=t.replace(/^−/,"-").replace(/,/,"."))},parseIrregularNumerals:function(t){for(var e,n,r,i,s,a=1,o=0,u=(s=t.split("")).length-1;r=s[u];u--)i=S(this.numeralMap,r),m(i)&&(i=S(E,r)||0),(n=0<i&&i%10==0)?(e&&(o+=a),u?a=i:o+=i):(o+=i*a,a*=10),e=n;return o},getOrdinal:function(t){return this.ordinalSuffix||g(t)},getRelativeFormat:function(t,e){return this.convertAdjustedToFormat(t,e)},getDuration:function(t){return this.convertAdjustedToFormat(x(F(0,t)),"duration")},getFirstDayOfWeek:function(){var t=this.firstDayOfWeek;return u(t)?t:R},getFirstDayOfWeekYear:function(){return this.firstDayOfWeekYear||D},convertAdjustedToFormat:function(t,e){var n,r,i,s=t[0],a=t[1],o=t[2],u=this[e]||this.relative;return A(u)?u.call(this,s,a,o,e):(i=this.plural&&1!==s?1:0,r=this.units[8*i+a]||this.units[a],n=this[0<o?"fromNow":"ago"],u.replace(/\{(.*?)\}/g,function(t,e){switch(e){case"num":return s;case"unit":return r;case"sign":return n}}))},cacheFormat:function(t,e){this.compiledFormats.splice(e,1),this.compiledFormats.unshift(t)},addFormat:function(t){var e,u,c=this;function getTokenSrc(t){var e,n,r,i=t.match(/\?$/),s=t.match(/^(\d+)\??$/),a=t.match(/(\d)(?:-(\d))?/),o=t.replace(/[^a-z]+$/i,"");return(r=S(c.parsingAliases,o))?(n=formatToSrc(r),i&&(n=v(n,!0)),n):(s?n=c.tokens[s[1]]:(r=S(l,o))?(n=r.src,o=r.param||o):(r=S(c.parsingTokens,o)||S(c,o),o=o.replace(/s$/,""),r=r||(S(c.parsingTokens,o)||S(c,o+"s")),I(r)?(n=r,e=c[o+"Suffix"]):("weekday"===o&&"ko"===c.code&&(r=f(r,function(t){return 1<t.length})),a&&(r=f(r,function(t,e){var n=e%(c.units?8:r.length);return n>=a[1]&&n<=(a[2]||a[1])})),n=C(r))),n?(n=s?v(n):(u.push(o),"("+n+")"),e&&(n=k(o,n,e)),i&&(n+="?"),n):"")}function formatToSrc(t){return t=(t=t.replace(/ /g," ?")).replace(/\{([^,]+?)\}/g,function(t,e){var n=e.split("|");return 1<n.length?v(o(n,getTokenSrc).join("|")):getTokenSrc(e)})}!function parseInputFormat(){u=[],e=formatToSrc(t)}(),c.addRawFormat(e,u)},addRawFormat:function(t,e){this.compiledFormats.unshift({reg:RegExp("^ *"+t+" *$","i"),to:e})},init:function(t){var c=this;function buildValueArray(t,s,a,o){var e,n=t,u=[];c[n]||(n+="s"),a||(a={},e=!0),function forAllAlternates(t,r){d(c[t],function(t,n){forEachAlternate(t,function(t,e){r(t,e,n)})})}(n,function(t,e,n){var r,i=e*s+n;r=o?o(n):n,a[t]=r,a[t.toLowerCase()]=r,u[i]=t}),c[n]=u,e&&(c[t+"Map"]=a)}function forEachAlternate(t,e){var n=o(t.split("+"),function(t){return t.replace(/(.+):(.+)$/,function(t,e,n){return o(n.split("|"),function(t){return e+t}).join("|")})}).join("|");d(n.split("|"),e)}function addFormatSet(t,e,n){d(c[t],function(t){e&&(t=getFormatWithTime(t,n)),c.addFormat(t)})}function getFormatWithTime(t,e){return e?function getTimeBefore(){return v("{time}[,\\s\\u3000]",!0)}()+t:t+function getTimeAfter(){var t,e=",?[\\s\\u3000]";(t=C(c.timeMarkers))&&(e+="| (?:"+t+") ");return e=v(e,c.timeMarkerOptional),v(e+"{time}{tzOffset}",!0)}()}!function initFormats(){c.compiledFormats=[],c.parsingAliases={},c.parsingTokens={}}(),function initDefinition(){y(c,t)}(),function initArrayFields(){d(r,function(t){var e=c[t];I(e)?c[t]=h(e):e||(c[t]=[])})}(),buildValueArray("month",12),buildValueArray("weekday",7),buildValueArray("unit",8),buildValueArray("ampm",2),function buildNumerals(){var t={};buildValueArray("numeral",10,t),buildValueArray("article",1,t,function(){return 1}),buildValueArray("placeholder",4,t,function(t){return N(10,t+1)}),c.numeralMap=t}(),function buildTimeFormats(){c.parsingAliases.time=function getTimeFormat(t){var e,n;n=function getTimeSeparatorSrc(){return c.timeSeparator?"[:"+c.timeSeparator+"]":":"}(),e=c.ampmFront?"{ampm?} {hour} (?:{minute} (?::?{second})?)?":c.ampm.length?"{hour}(?:"+n+"{minute?}(?:"+n+"{second?})? {ampm?}| {ampm})":"{hour}(?:"+n+"{minute?}(?:"+n+"{second?})?)";return e}(),c.parsingAliases.tzOffset="(?:{Z}|{GMT?}(?:{tzHour}(?::?{tzMinute}(?: \\([\\w\\s]+\\))?)?)?)?"}(),function buildParsingTokens(){P(a,function(t,e){var n,r=t.base?function getCoreTokensForBase(t){return o(t.split("|"),function(t){return l[t].src}).join("|")}(t.base):t.src;(t.requiresNumerals||c.numeralUnits)&&(r+=function getNumeralSrc(){var t,e="";t=c.numerals.concat(c.placeholders).concat(c.articles),c.allowsFullWidth&&(t=t.concat(T.split("")));t.length&&(e="|(?:"+C(t)+")+");return e}()),(n=c[e+"s"])&&n.length&&(r+="|"+C(n)),c.parsingTokens[e]=r})}(),function buildTimeSuffixes(){_(function(t,e){var n=c.timeSuffixes[e];n&&(c[(t.alias||t.name)+"Suffix"]=n)})}(),function buildModifiers(){d(c.modifiers,function(i){var s,a=i.name,t=a+"Map";s=c[t]||{},forEachAlternate(i.src,function(t,e){var n=S(c.parsingTokens,a),r=i.value;s[t]=r,c.parsingTokens[a]=n?n+"|"+t:t,"sign"===i.name&&0===e&&(c[1===r?"fromNow":"ago"]=t)}),c[t]=s})}(),function addCoreFormats(){d(s,function(t){var e=t.src;t.localeCheck&&!t.localeCheck(c)||(t.mdy&&c.mdy&&(e=t.mdy),t.time?(c.addFormat(getFormatWithTime(e,!0)),c.addFormat(getFormatWithTime(e))):c.addFormat(e))}),c.addFormat("{time}")}(),function addLocaleFormats(){addFormatSet("parse"),addFormatSet("timeParse",!0),addFormatSet("timeFrontParse",!0,!0)}()}},new Locale(t)}},function(t,e,n){"use strict";t.exports=["months","weekdays","units","numerals","placeholders","articles","tokens","timeMarkers","ampm","timeSuffixes","parse","timeParse","timeFrontParse","modifiers"]},function(t,e,n){"use strict";t.exports={yyyy:{param:"year",src:"[-−+]?\\d{4,6}"},yy:{param:"year",src:"\\d{2}"},y:{param:"year",src:"\\d"},ayy:{param:"year",src:"'\\d{2}"},MM:{param:"month",src:"(?:1[012]|0?[1-9])"},dd:{param:"date",src:"(?:3[01]|[12][0-9]|0?[1-9])"},hh:{param:"hour",src:"(?:2[0-4]|[01]?[0-9])"},mm:{param:"minute",src:"[0-5]\\d"},ss:{param:"second",src:"[0-5]\\d(?:[,.]\\d+)?"},tzHour:{src:"[-−+](?:2[0-4]|[01]?[0-9])"},tzMinute:{src:"[0-5]\\d"},iyyyy:{param:"year",src:"(?:[-−+]?\\d{4}|[-−+]\\d{5,6})"},ihh:{param:"hour",src:"(?:2[0-4]|[01][0-9])(?:[,.]\\d+)?"},imm:{param:"minute",src:"[0-5]\\d(?:[,.]\\d+)?"},GMT:{param:"utc",src:"GMT"},Z:{param:"utc",src:"Z"},timestamp:{src:"\\d+"}}},function(t,e,n){"use strict";t.exports=[{src:"{MM}[-.\\/]{yyyy}"},{time:!0,src:"{dd}[-\\/]{MM}(?:[-\\/]{yyyy|yy|y})?",mdy:"{MM}[-\\/]{dd}(?:[-\\/]{yyyy|yy|y})?"},{time:!0,src:"{dd}\\.{MM}(?:\\.{yyyy|yy|y})?",mdy:"{MM}\\.{dd}(?:\\.{yyyy|yy|y})?",localeCheck:function(t){return"."!==t.timeSeparator}},{time:!0,src:"{yyyy}[-.\\/]{MM}(?:[-.\\/]{dd})?"},{src:"\\\\/Date\\({timestamp}(?:[-+]\\d{4,4})?\\)\\\\/"},{src:"{iyyyy}(?:-?{MM}(?:-?{dd}(?:T{ihh}(?::?{imm}(?::?{ss})?)?)?)?)?{tzOffset?}"}]},function(t,e,n){"use strict";t.exports=function filter(t,e){for(var n=[],r=0,i=t.length;r<i;r++){var s=t[r];r in t&&e(s,r)&&n.push(s)}return n}},function(t,e,n){"use strict";var u=n(139);t.exports=function iterateOverSparseArray(t,e,n,r){for(var i,s=u(t,n,r),a=0,o=s.length;a<o;a++)i=s[a],e.call(t,t[i],i,t);return t}},function(t,e,n){"use strict";var a=n(140);t.exports=function getSparseArrayIndexes(t,r,e,n){var i,s=[];for(i in t)a(i)&&(e||(n?i<=r:r<=i))&&s.push(+i);return s.sort(function(t,e){var n=r<t;return n!=r<e?n?-1:1:t-e}),s}},function(t,e,n){"use strict";t.exports=function isArrayIndex(t){return t>>>0==t&&4294967295!=t}},function(t,e,n){"use strict";var r=n(51).HALF_WIDTH_COMMA;t.exports=function commaSplit(t){return t.split(r)}},function(t,e,n){"use strict";t.exports="Boolean Number String Date RegExp Function Array Error Set Map"},function(t,e,n){"use strict";var r=n(98),i=n(63),s=n(144),a=n(145);t.exports=function isPlainObject(t,e){return i(t)&&r(t,"Object",e)&&a(t)&&s(t)}},function(t,e,n){"use strict";var i=n(16).hasOwn;t.exports=function hasOwnEnumeratedProperties(t){var e=Object.prototype;for(var n in t){var r=t[n];if(!i(t,n)&&r!==e[n])return!1}return!0}},function(t,e,n){"use strict";var r=n(16).hasOwn;t.exports=function hasValidPlainObjectPrototype(t){var e="constructor"in t;return!e&&!("toString"in t)||e&&!r(t,"constructor")&&r(t.constructor.prototype,"isPrototypeOf")}},function(t,e,n){"use strict";t.exports=function getOrdinalSuffix(t){if(11<=t&&t<=13)return"th";switch(t%10){case 1:return"st";case 2:return"nd";case 3:return"rd";default:return"th"}}},function(t,e,n){"use strict";t.exports=function getArrayWithOffset(t,e,n,r){var i;return 1<n&&(i=t[e+(n-1)*r]),i||t[e]}},function(t,e,n){"use strict";var r=n(149),i=n(16).setProperty;t.exports=function privatePropertyAccessor(t){var n=r+t;return function(t,e){return 1<arguments.length?(i(t,n,e),t):t[n]}}},function(t,e,n){"use strict";t.exports="_sugar_"},function(t,e,n){"use strict";var r=n(97),i=n(151);t.exports=function arrayToRegAlternates(t){var e=t.join("");return t&&t.length?e.length===t.length?"["+e+"]":r(t,i).join("|"):""}},function(t,e,n){"use strict";var r=n(12).isString;t.exports=function escapeRegExp(t){return r(t)||(t=String(t)),t.replace(/([\\/'*+?|()[\]{}.^$-])/g,"\\$1")}},function(t,e,n){"use strict";var a,o,u,r=n(51),c=n(101),l=n(153),f=r.HALF_WIDTH_ZERO,d=r.FULL_WIDTH_ZERO,h=r.HALF_WIDTH_PERIOD,p=r.FULL_WIDTH_PERIOD,m=r.HALF_WIDTH_COMMA;!function buildFullWidthNumber(){var t=p,e=h,n=m,r="";o={};for(var i,s=0;s<=9;s++)r+=i=c(s+d),o[i]=c(s+f);o[n]="",o[t]=e,o[e]=e,a=l(r+t+n+e),u=r}(),t.exports={fullWidthNumberReg:a,fullWidthNumberMap:o,fullWidthNumbers:u}},function(t,e,n){"use strict";t.exports=function allCharsReg(t){return RegExp("["+t+"]","g")}},function(t,e,n){"use strict";var r=n(26),i=n(102),s=n(103);t.exports=function getAdjustedUnitForNumber(e){return s(e,function(t){return r(i(e/t.multiplier,1))})}},function(t,e,n){"use strict";var i=n(96),s=n(99);t.exports=function getParsingTokenWithSuffix(t,e,n){var r=i[t];return r.requiresSuffix?e=s(e+s(n)):r.requiresSuffixOr?e+=s(r.requiresSuffixOr+"|"+n):e+=s(n,!0),e}},function(t,e,n){"use strict";var r=n(0),i=n(27);n(172),r.Date.defineStatic({create:function(t,e){return i(t,e)}}),t.exports=r.Date.create},function(t,e,n){"use strict";t.exports=/^'?(\d{1,2})$/},function(t,e,n){"use strict";var r={newDateInternal:n(159)};t.exports=r},function(t,e,n){"use strict";t.exports=function defaultNewDate(){return new Date}},function(t,e,n){"use strict";var s=n(50),a=n(161),o=n(16).forEachProperty;t.exports=function defineOptionsAccessor(t,r){var i=s(r);function getOption(t){return i[t]}return a(t,"getOption",getOption),a(t,"setOption",function setOption(t,e){var n;1===arguments.length?n=t:(n={})[t]=e,o(n,function(t,e){null===t&&(t=r[e]),i[e]=t})}),getOption}},function(t,e,n){"use strict";var r=n(16).setProperty;t.exports=function defineAccessor(t,e,n){r(t,e,n)}},function(t,e,n){"use strict";var r=n(43),i=n(37);t.exports=function resetLowerUnits(t,e){return i(t,r(e))}},function(t,e,n){"use strict";var r=n(13),i=r.DAY_INDEX,s=r.MONTH_INDEX;t.exports=function getHigherUnitIndex(t){return t===i?s:t+1}},function(t,e,n){"use strict";var i=n(38),s=n(107);t.exports=function callDateSetWithWeek(t,e,n,r){"ISOWeek"===e?s(t,n):i(t,e,n,r)}},function(t,e,n){"use strict";var r=n(38);t.exports=function setYear(t,e){r(t,"FullYear",e)}},function(t,e,n){"use strict";var r=n(38);t.exports=function setMonth(t,e){r(t,"Month",e)}},function(t,e,n){"use strict";var r=n(109),i=n(16).getOwn;t.exports=function getDateParam(t,e){return i(t,r(t,e))}},function(t,e,n){"use strict";var r=n(16).hasOwn;t.exports=function getOwnKey(t,e){if(r(t,e))return e}},function(t,e,n){"use strict";var r=n(109);t.exports=function deleteDateParam(t,e){delete t[r(t,e)]}},function(t,e,n){"use strict";var s=n(35),a=n(15).abs;t.exports=function getYearFromAbbreviation(t,e,n){var r,i=+t;return i+=i<50?2e3:1900,n&&(r=i-s(e))/a(r)!==n&&(i+=100*n),i}},function(t,e,n){"use strict";var r=n(13),i=n(55),s=r.DAY_INDEX,a=r.YEAR_INDEX;t.exports=function iterateOverHigherDateParams(t,e){i(t,e,a,s)}},function(t,e,n){"use strict";n(173)()},function(t,e,n){"use strict";var r=n(27),i=n(28),s=n(174),a=i.sugarDate;t.exports=function setDateChainableConstructor(){s(a,r)}},function(t,e,n){"use strict";t.exports=function setChainableConstructor(t,e){t.prototype.constructor=function(){return e.apply(this,arguments)}}},function(t,e,n){"use strict";var r=n(0),i=n(14),s=n(176),a=i.localeManager;r.Date.defineStatic({getAllLocaleCodes:function(){return s(a.getAll())}}),t.exports=r.Date.getAllLocaleCodes},function(t,e,n){"use strict";t.exports=function getKeys(t){return Object.keys(t)}},function(t,e,n){"use strict";var r=n(0),i=n(14).localeManager;r.Date.defineStatic({getAllLocales:function(){return i.getAll()}}),t.exports=r.Date.getAllLocales},function(t,e,n){"use strict";var r=n(0),i=n(14).localeManager;r.Date.defineStatic({getLocale:function(t){return i.get(t,!t)}}),t.exports=r.Date.getLocale},function(t,e,n){"use strict";var r=n(0),i=n(14).localeManager;r.Date.defineStatic({removeLocale:function(t){return i.remove(t)}}),t.exports=r.Date.removeLocale},function(t,e,n){"use strict";var r=n(0),i=n(14).localeManager;r.Date.defineStatic({setLocale:function(t){return i.set(t)}}),t.exports=r.Date.setLocale},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.day},function(t,e,n){"use strict";var r=n(34),a=n(27),i=n(15),o=n(45),s=n(28),u=n(58),c=s.sugarNumber,l=i.round;t.exports=function buildNumberUnitMethods(){u(c,r,function(t,e){var n,r,i,s=e.name;n=function(t){return l(t*e.multiplier)},r=function(t,e,n){return o(a(e,n,!0),s,t)},i=function(t,e,n){return o(a(e,n,!0),s,-t)},t[s]=n,t[s+"s"]=n,t[s+"Before"]=i,t[s+"sBefore"]=i,t[s+"Ago"]=i,t[s+"sAgo"]=i,t[s+"After"]=r,t[s+"sAfter"]=r,t[s+"FromNow"]=r,t[s+"sFromNow"]=r})}},function(t,e,n){"use strict";var r=n(184);t.exports={alias:r("alias"),defineStatic:r("defineStatic"),defineInstance:r("defineInstance"),defineStaticPolyfill:r("defineStaticPolyfill"),defineInstancePolyfill:r("defineInstancePolyfill"),defineInstanceAndStatic:r("defineInstanceAndStatic"),defineInstanceWithArguments:r("defineInstanceWithArguments")}},function(t,e,n){"use strict";t.exports=function wrapNamespace(r){return function(t,e,n){t[r](e,n)}}},function(t,e,n){"use strict";var i=n(32),s=n(52),a=n(12).isString;t.exports=function collectSimilarMethods(t,n){var r={};return a(t)&&(t=s(t)),i(t,function(t,e){n(r,t,e)}),r}},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.dayAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.dayAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.dayBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.dayFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.days},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.daysAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.daysAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.daysBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.daysFromNow},function(t,e,n){"use strict";var r=n(0),i=n(14).localeManager;r.Number.defineInstance({duration:function(t,e){return i.get(e).getDuration(t)}}),t.exports=r.Number.duration},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.hour},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.hourAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.hourAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.hourBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.hourFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.hours},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.hoursAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.hoursAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.hoursBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.hoursFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.millisecond},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.millisecondAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.millisecondAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.millisecondBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.millisecondFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.milliseconds},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.millisecondsAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.millisecondsAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.millisecondsBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.millisecondsFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.minute},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.minuteAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.minuteAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.minuteBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.minuteFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.minutes},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.minutesAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.minutesAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.minutesBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.minutesFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.month},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.monthAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.monthAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.monthBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.monthFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.months},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.monthsAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.monthsAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.monthsBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.monthsFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.second},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.secondAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.secondAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.secondBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.secondFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.seconds},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.secondsAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.secondsAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.secondsBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.secondsFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.week},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.weekAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.weekAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.weekBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.weekFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.weeks},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.weeksAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.weeksAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.weeksBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.weeksFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.year},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.yearAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.yearAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.yearBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.yearFromNow},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.years},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.yearsAfter},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.yearsAgo},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.yearsBefore},function(t,e,n){"use strict";var r=n(0);n(6),t.exports=r.Number.yearsFromNow},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.addDays},function(t,e,n){"use strict";var r=n(34),i=n(13),s=n(32),a=n(27),o=n(111),u=n(45),c=n(56),l=n(28),f=n(68),d=n(57),h=n(58),p=n(69),m=l.sugarDate,y=i.HOURS_INDEX,g=i.DAY_INDEX;t.exports=function buildDateUnitMethods(){h(m,r,function(t,r,n){var i=r.name,e=f(i);g<n&&s(["Last","This","Next"],function(n){t["is"+n+e]=function(t,e){return o(t,n+" "+i,0,e,{locale:"en"})}}),y<n&&(t["beginningOf"+e]=function(t,e){return d(t,n,e)},t["endOf"+e]=function(t,e){return c(t,n,e)}),t["add"+e+"s"]=function(t,e,n){return u(t,i,e,n)};t[i+"sAgo"]=t[i+"sUntil"]=function(t,e,n){return p(a(e,n,!0),t,r)},t[i+"sSince"]=t[i+"sFromNow"]=function(t,e,n){return p(t,a(e,n,!0),r)}})}},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.addHours},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.addMilliseconds},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.addMinutes},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.addMonths},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.addSeconds},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.addWeeks},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.addYears},function(t,e,n){"use strict";var r=n(0),i=n(112);r.Date.defineInstanceWithArguments({advance:function(t,e){return i(t,e,1)}}),t.exports=r.Date.advance},function(t,e,n){"use strict";var i=n(42);t.exports=function getDateParamsFromString(t){var e,n,r={};return(e=t.match(/^(-?\d*[\d.]\d*)?\s?(\w+?)s?$/i))&&(i(n)&&(n=e[1]?+e[1]:1),r[e[2].toLowerCase()]=n),r}},function(t,e,n){"use strict";var r=n(13),s=n(33),a=n(106),o=r.YEAR_INDEX;t.exports=function collectDateParamsFromArguments(n){var r={},i=0;return a(o,function(t){var e=n[i++];s(e)&&(r[t.name]=e)}),r}},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.beginningOfDay},function(t,e,n){"use strict";var r=n(0),i=n(105),s=n(24),a=n(29);r.Date.defineInstance({beginningOfISOWeek:function(t){var e=s(t);return 0===e?e=-6:1!==e&&(e=1),a(t,e),i(t)}}),t.exports=r.Date.beginningOfISOWeek},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.beginningOfMonth},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.beginningOfWeek},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.beginningOfYear},function(t,e,n){"use strict";var r=n(0),i=n(41);r.Date.defineInstance({clone:function(t){return i(t)}}),t.exports=r.Date.clone},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.daysAgo},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.daysFromNow},function(t,e,n){"use strict";var r=n(0),i=n(100);r.Date.defineInstance({daysInMonth:function(t){return i(t)}}),t.exports=r.Date.daysInMonth},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.daysSince},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.daysUntil},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.endOfDay},function(t,e,n){"use strict";var r=n(0),i=n(13),s=n(24),a=n(29),o=n(56),u=i.DAY_INDEX;r.Date.defineInstance({endOfISOWeek:function(t){return 0!==s(t)&&a(t,7),o(t,u)}}),t.exports=r.Date.endOfISOWeek},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.endOfMonth},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.endOfWeek},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.endOfYear},function(t,e,n){"use strict";var r=n(0),i=n(114);r.Date.defineInstance({format:function(t,e,n){return i(t,e,n)}}),t.exports=r.Date.format},function(t,e,n){"use strict";var i,r,s,a=n(14),o=n(296),u=n(115),c=n(32),l=n(70),f=n(52),d=n(28),h=n(16),p=n(302),m=n(58),y=a.localeManager,g=h.hasOwn,b=h.getOwn,v=h.forEachProperty,O=d.sugarDate;!function buildDateFormatTokens(){function addFormats(e,t,n){t&&c(f(t),function(t){e[t]=n})}function buildLowercase(n){return function(t,e){return n(t,e).toLowerCase()}}function buildPadded(n,r){return function(t,e){return l(n(t,e),r)}}function buildTwoDigits(n){return function(t,e){return n(t,e)%100}}function buildAlias(n){return function(t,e){return s(n,t,e)}}function buildAlternate(n,r){function bCa(t,e){return n.get(t,e,r)}addFormats(i,n.ldml+r,bCa),n.lowerToken&&(i[n.lowerToken+r]=buildLowercase(bCa))}function getIdentityFormat(r){return function(t,e){var n=y.get(e);return s(n[r],t,e)}}i={},r={},c(o,function(t){var e,n=t.get;t.lowerToken&&(i[t.lowerToken]=buildLowercase(n)),t.ordinalToken&&(i[t.ordinalToken]=function buildOrdinal(r){return function(t,e){var n=r(t,e);return n+y.get(e).getOrdinal(n)}}(n)),t.ldmlPaddedToken&&(i[t.ldmlPaddedToken]=buildPadded(n,t.ldmlPaddedToken.length)),t.ldmlTwoDigitToken&&(i[t.ldmlTwoDigitToken]=buildPadded(buildTwoDigits(n),2)),t.strfTwoDigitToken&&(r[t.strfTwoDigitToken]=buildPadded(buildTwoDigits(n),2)),t.strfPadding&&(e=buildPadded(n,t.strfPadding)),t.alias&&(n=buildAlias(t.alias)),t.allowAlternates&&function buildAlternates(t){for(var e=1;e<=5;e++)buildAlternate(t,e)}(t),addFormats(i,t.ldml,n),addFormats(r,t.strf,e||n)}),v(u,function(t,e){addFormats(i,e,buildAlias(t))}),m(O,"short medium long full",function(t,e){var n=getIdentityFormat(e);addFormats(i,e,n),t[e]=n}),addFormats(i,"time",getIdentityFormat("time")),addFormats(i,"stamp",getIdentityFormat("stamp"))}(),function buildDateFormatMatcher(){s=p(function getLdml(t,e,n){return b(i,e)(t,n)},function getStrf(t,e,n){return b(r,e)(t,n)},function checkDateToken(t,e){return g(i,t)||g(r,e)})}(),t.exports={ldmlTokens:i,strfTokens:r,dateFormatMatcher:s}},function(t,e,n){"use strict";var r=n(297),i=n(14),s=n(13),a=n(26),o=n(40),u=n(35),c=n(116),l=n(36),f=n(41),d=n(70),h=n(24),p=n(23),m=n(15),y=n(299),g=n(117),b=n(300),v=n(71),O=n(301),_=n(37),C=i.localeManager,w=s.MONTH_INDEX,x=m.ceil,k=[{ldml:"Dow",strf:"a",lowerToken:"dow",get:function(t,e){return C.get(e).getWeekdayName(h(t),2)}},{ldml:"Weekday",strf:"A",lowerToken:"weekday",allowAlternates:!0,get:function(t,e,n){return C.get(e).getWeekdayName(h(t),n)}},{ldml:"Mon",strf:"b h",lowerToken:"mon",get:function(t,e){return C.get(e).getMonthName(l(t),2)}},{ldml:"Month",strf:"B",lowerToken:"month",allowAlternates:!0,get:function(t,e,n){return C.get(e).getMonthName(l(t),n)}},{strf:"C",get:function(t){return u(t).toString().slice(0,2)}},{ldml:"d date day",strf:"d",strfPadding:2,ldmlPaddedToken:"dd",ordinalToken:"do",get:function(t){return o(t)}},{strf:"e",get:function(t){return d(o(t),2,!1,10," ")}},{ldml:"H 24hr",strf:"H",strfPadding:2,ldmlPaddedToken:"HH",get:function(t){return c(t)}},{ldml:"h hours 12hr",strf:"I",strfPadding:2,ldmlPaddedToken:"hh",get:function(t){return c(t)%12||12}},{ldml:"D",strf:"j",strfPadding:3,ldmlPaddedToken:"DDD",get:function(t){var e=_(f(t),w);return b(t,e)+1}},{ldml:"M",strf:"m",strfPadding:2,ordinalToken:"Mo",ldmlPaddedToken:"MM",get:function(t){return l(t)+1}},{ldml:"m minutes",strf:"M",strfPadding:2,ldmlPaddedToken:"mm",get:function(t){return p(t,"Minutes")}},{ldml:"Q",get:function(t){return x((l(t)+1)/3)}},{ldml:"TT",strf:"p",get:function(t,e){return O(t,e)}},{ldml:"tt",strf:"P",get:function(t,e){return O(t,e).toLowerCase()}},{ldml:"T",lowerToken:"t",get:function(t,e){return O(t,e).charAt(0)}},{ldml:"s seconds",strf:"S",strfPadding:2,ldmlPaddedToken:"ss",get:function(t){return p(t,"Seconds")}},{ldml:"S ms",strfPadding:3,ldmlPaddedToken:"SSS",get:function(t){return p(t,"Milliseconds")}},{ldml:"e",strf:"u",ordinalToken:"eo",get:function(t){return h(t)||7}},{strf:"U",strfPadding:2,get:function(t){return v(t,!1,0)}},{ldml:"W",strf:"V",strfPadding:2,ordinalToken:"Wo",ldmlPaddedToken:"WW",get:function(t){return v(t,!0)}},{strf:"w",get:function(t){return h(t)}},{ldml:"w",ordinalToken:"wo",ldmlPaddedToken:"ww",get:function(t,e){var n=C.get(e),r=n.getFirstDayOfWeek(e),i=n.getFirstDayOfWeekYear(e);return v(t,!0,r,i)}},{strf:"W",strfPadding:2,get:function(t){return v(t,!1)}},{ldmlPaddedToken:"gggg",ldmlTwoDigitToken:"gg",get:function(t,e){return y(t,e)}},{strf:"G",strfPadding:4,strfTwoDigitToken:"g",ldmlPaddedToken:"GGGG",ldmlTwoDigitToken:"GG",get:function(t,e){return y(t,e,!0)}},{ldml:"year",ldmlPaddedToken:"yyyy",ldmlTwoDigitToken:"yy",strf:"Y",strfPadding:4,strfTwoDigitToken:"y",get:function(t){return u(t)}},{ldml:"ZZ",strf:"z",get:function(t){return g(t)}},{ldml:"X",get:function(t){return a(t.getTime()/1e3)}},{ldml:"x",get:function(t){return t.getTime()}},{ldml:"Z",get:function(t){return g(t,!0)}},{ldml:"z",strf:"Z",get:function(t){var e=t.toString().match(r);return e?e[1]:""}},{strf:"D",alias:"%m/%d/%y"},{strf:"F",alias:"%Y-%m-%d"},{strf:"r",alias:"%I:%M:%S %p"},{strf:"R",alias:"%H:%M"},{strf:"T",alias:"%H:%M:%S"},{strf:"x",alias:"{short}"},{strf:"X",alias:"{time}"},{strf:"c",alias:"{stamp}"}];t.exports=k},function(t,e,n){"use strict";t.exports=/\(([-+]\d{2,4}|\w{3,5})\)$/},function(t,e,n){"use strict";t.exports=function repeatString(t,e){var n="";for(t=t.toString();0<e;)1&e&&(n+=t),(e>>=1)&&(t+=t);return n}},function(t,e,n){"use strict";var r=n(14),c=n(35),l=n(36),f=n(71),d=r.localeManager;t.exports=function getWeekYear(t,e,n){var r,i,s,a,o,u;return r=c(t),0!==(i=l(t))&&11!==i||(n||(s=(u=d.get(e)).getFirstDayOfWeek(e),a=u.getFirstDayOfWeekYear(e)),o=f(t,!1,s,a),0===i&&0===o?r-=1:11===i&&1===o&&(r+=1)),r}},function(t,e,n){"use strict";var r=n(34),i=n(13),s=n(69),a=i.DAY_INDEX;t.exports=function getDaysSince(t,e){return s(t,e,r[a])}},function(t,e,n){"use strict";var r=n(14),i=n(26),s=n(116),a=r.localeManager;t.exports=function getMeridiemToken(t,e){var n=s(t);return a.get(e).ampm[i(n/12)]||""}},function(t,e,n){"use strict";var r=n(303),i=n(51),s=n(304),o=i.OPEN_BRACE,u=i.CLOSE_BRACE;t.exports=function createFormatMatcher(c,l,f){var i=r,a=s(function compile(t){var e,n=[],r=0;i.lastIndex=0;for(;e=i.exec(t);)getSubstring(n,t,r,e.index),getToken(n,e),r=i.lastIndex;return getSubstring(n,t,r,t.length),n});function getToken(t,e){var n,r,i,s,a=e[2],o=e[3],u=e[5];e[4]&&l?(r=u,n=l):a?(r=a,n=c):i=o&&l?o:e[1]||e[0],n&&(function assertPassesPrecheck(t,e,n){if(t&&!t(e,n))throw new TypeError("Invalid token "+(e||n)+" in format string")}(f,a,u),s=function(t,e){return n(t,r,e)}),t.push(s||function getLiteral(t){return function(){return t}}(i))}function getSubstring(t,e,n,r){if(n<r){var i=e.slice(n,r);assertNoUnmatched(i,o),assertNoUnmatched(i,u),t.push(function(){return i})}}function assertNoUnmatched(t,e){if(-1!==t.indexOf(e))throw new TypeError("Unmatched "+e+" in format string")}return function(t,e,n){for(var r=a(t),i="",s=0;s<r.length;s++)i+=r[s](e,n);return i}}},function(t,e,n){"use strict";t.exports=/([{}])\1|{([^}]*)}|(%)%|(%(\w*))/g},function(t,e,n){"use strict";var i=n(305),s=n(16).hasOwn;t.exports=function memoizeFunction(e){var n={},r=0;return function(t){return s(n,t)?n[t]:(r===i&&(n={},r=0),r++,n[t]=e(t))}}},function(t,e,n){"use strict";t.exports=1e3},function(t,e,n){"use strict";var r=n(0),i=n(307);r.Date.defineInstance({get:function(t,e,n){return i(t,e,n)}}),t.exports=r.Date.get},function(t,e,n){"use strict";var i=n(65);t.exports=function createDateWithContext(t,e,n,r){return i(t,e,n,r).date}},function(t,e,n){"use strict";var r=n(0),i=n(71);r.Date.defineInstance({getISOWeek:function(t){return i(t,!0)}}),t.exports=r.Date.getISOWeek},function(t,e,n){"use strict";var r=n(0),i=n(117);r.Date.defineInstance({getUTCOffset:function(t,e){return i(t,e)}}),t.exports=r.Date.getUTCOffset},function(t,e,n){"use strict";var r=n(0);r.Date.defineInstance({getUTCWeekday:function(t){return t.getUTCDay()}}),t.exports=r.Date.getUTCWeekday},function(t,e,n){"use strict";var r=n(0),i=n(24);r.Date.defineInstance({getWeekday:function(t){return i(t)}}),t.exports=r.Date.getWeekday},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.hoursAgo},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.hoursFromNow},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.hoursSince},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.hoursUntil},function(t,e,n){"use strict";var r=n(0),i=n(119);r.Date.defineInstance({is:function(t,e,n){return i(t,e,n)}}),t.exports=r.Date.is},function(t,e,n){"use strict";t.exports=function trim(t){return t.trim()}},function(t,e,n){"use strict";var r=n(39),i=n(40),s=n(35),a=n(36),o=n(44);t.exports=function compareDay(t,e){var n=o();return e&&r(n,i(n)+e),s(t)===s(n)&&a(t)===a(n)&&i(t)===i(n)}},function(t,e,n){"use strict";var r=n(0),i=n(27);r.Date.defineInstance({isAfter:function(t,e,n){return t.getTime()>i(e).getTime()-(n||0)}}),t.exports=r.Date.isAfter},function(t,e,n){"use strict";var r=n(0),i=n(27);r.Date.defineInstance({isBefore:function(t,e,n){return t.getTime()<i(e).getTime()+(n||0)}}),t.exports=r.Date.isBefore},function(t,e,n){"use strict";var r=n(0),c=n(27),i=n(15),l=i.min,f=i.max;r.Date.defineInstance({isBetween:function(t,e,n,r){var i=t.getTime(),s=c(e).getTime(),a=c(n).getTime(),o=l(s,a),u=f(s,a);return o-(r=r||0)<=i&&i<=u+r}}),t.exports=r.Date.isBetween},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isFriday},function(t,e,n){"use strict";var r=n(14),i=n(52),s=n(119),a=n(28),o=n(58),u=r.English,c=a.sugarDate;t.exports=function buildRelativeAliases(){var t=i("Today Yesterday Tomorrow Weekday Weekend Future Past"),e=u.weekdays.slice(0,7),n=u.months.slice(0,12),r=t.concat(e).concat(n);o(c,r,function(t,e){t["is"+e]=function(t){return s(t,e)}})}},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isFuture},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.isLastMonth},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.isLastWeek},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.isLastYear},function(t,e,n){"use strict";var r=n(0),i=n(35);r.Date.defineInstance({isLeapYear:function(t){var e=i(t);return e%4==0&&e%100!=0||e%400==0}}),t.exports=r.Date.isLeapYear},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isMonday},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.isNextMonth},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.isNextWeek},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.isNextYear},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isPast},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isSaturday},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isSunday},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.isThisMonth},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.isThisWeek},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.isThisYear},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isThursday},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isToday},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isTomorrow},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isTuesday},function(t,e,n){"use strict";var r=n(0),i=n(344);r.Date.defineInstance({isUTC:function(t){return i(t)}}),t.exports=r.Date.isUTC},function(t,e,n){"use strict";var r=n(25),i=n(53);t.exports=function isUTC(t){return!!r(t)||0===i(t)}},function(t,e,n){"use strict";var r=n(0),i=n(46);r.Date.defineInstance({isValid:function(t){return i(t)}}),t.exports=r.Date.isValid},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isWednesday},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isWeekday},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isWeekend},function(t,e,n){"use strict";var r=n(0);n(17),t.exports=r.Date.isYesterday},function(t,e,n){"use strict";var r=n(0);r.Date.defineInstance({iso:function(t){return t.toISOString()}}),t.exports=r.Date.iso},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.millisecondsAgo},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.millisecondsFromNow},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.millisecondsSince},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.millisecondsUntil},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.minutesAgo},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.minutesFromNow},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.minutesSince},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.minutesUntil},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.monthsAgo},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.monthsFromNow},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.monthsSince},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.monthsUntil},function(t,e,n){"use strict";var r=n(0),i=n(120);r.Date.defineInstance({relative:function(t,e,n){return i(t,null,e,n)}}),t.exports=r.Date.relative},function(t,e,n){"use strict";var r=n(44),i=n(15),s=n(103),a=n(69),o=i.abs;t.exports=function getAdjustedUnitForDate(e,n){return n||(n=r())<e&&(n=new Date(n.getTime()-10)),s(e-n,function(t){return o(a(e,n,t))})}},function(t,e,n){"use strict";var r=n(0),i=n(27),s=n(120);r.Date.defineInstance({relativeTo:function(t,e,n){return s(t,i(e),n)}}),t.exports=r.Date.relativeTo},function(t,e,n){"use strict";var r=n(0),i=n(13),s=n(57),a=n(367),o=i.DAY_INDEX;r.Date.defineInstance({reset:function(t,e,n){var r=e?a(e):o;return s(t,r,n),t}}),t.exports=r.Date.reset},function(t,e,n){"use strict";var r=n(55);t.exports=function getUnitIndexForParamName(t){var i,e={};return e[t]=1,r(e,function(t,e,n,r){return i=r,!1}),i}},function(t,e,n){"use strict";var r=n(0),i=n(112);r.Date.defineInstanceWithArguments({rewind:function(t,e){return i(t,e,-1)}}),t.exports=r.Date.rewind},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.secondsAgo},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.secondsFromNow},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.secondsSince},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.secondsUntil},function(t,e,n){"use strict";var r=n(0),i=n(54),s=n(113);r.Date.defineInstanceWithArguments({set:function(t,e){return e=s(e),i(t,e[0],e[1])}}),t.exports=r.Date.set},function(t,e,n){"use strict";var r=n(0),i=n(107);r.Date.defineInstance({setISOWeek:function(t,e){return i(t,e)}}),t.exports=r.Date.setISOWeek},function(t,e,n){"use strict";var r=n(0),i=n(25);r.Date.defineInstance({setUTC:function(t,e){return i(t,e)}}),t.exports=r.Date.setUTC},function(t,e,n){"use strict";var r=n(0),i=n(29);r.Date.defineInstance({setWeekday:function(t,e){return i(t,e)}}),t.exports=r.Date.setWeekday},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.weeksAgo},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.weeksFromNow},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.weeksSince},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.weeksUntil},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.yearsAgo},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.yearsFromNow},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.yearsSince},function(t,e,n){"use strict";var r=n(0);n(7),t.exports=r.Date.yearsUntil},function(t,e,n){"use strict";var r=n(0);n(66);t.exports=r.Date.getOption},function(t,e,n){"use strict";var r=n(0);n(66);t.exports=r.Date.setOption},function(t,e,n){"use strict";n(388),n(394),n(396),n(397),n(398),n(407),n(408),n(409),n(410),n(411),n(412),n(413),n(414),n(415),n(417),n(418),n(419),n(420),n(421),t.exports=n(0)},function(t,e,n){"use strict";var r=n(0),i=n(389);r.Date.defineStatic({range:i}),t.exports=r.Date.range},function(t,e,n){"use strict";var r=n(19),i=n(12),s=n(123),a=n(390),o=i.isString;t.exports=function(t,e){return 1===arguments.length&&o(t)?a(t):new r(s(t),s(e))}},function(t,e,n){"use strict";var o=n(19),r=n(391),u=n(124),c=n(123),i=n(28),l=n(126),f=i.sugarDate,d=r.RANGE_REG_FROM_TO,h=r.RANGE_REG_REAR_DURATION,p=r.RANGE_REG_FRONT_DURATION;t.exports=function createDateRangeFromString(t){var e,n,r,i,s,a;return f.get&&(e=t.match(d))?(s=c(e[1].replace("from","at")),a=f.get(s,e[2]),new o(s,a)):((e=t.match(p))&&(r=e[1],n=e[2]),(e=t.match(h))&&(n=e[1],r=e[2]),n&&r?(s=c(n),i=l(r),a=u(s,i[0],i[1])):s=t,new o(c(s),c(a)))}},function(t,e,n){"use strict";var r=n(392);t.exports={RANGE_REG_FROM_TO:/(?:from)?\s*(.+)\s+(?:to|until)\s+(.+)$/i,RANGE_REG_REAR_DURATION:RegExp("(.+)\\s*for\\s*"+r,"i"),RANGE_REG_FRONT_DURATION:RegExp("(?:for)?\\s*"+r+"\\s*(?:starting)?\\s(?:at\\s)?(.+)","i")}},function(t,e,n){"use strict";var r=n(72);t.exports="((?:\\d+)?\\s*(?:"+r+"))s?"},function(t,e,n){"use strict";var r=n(72);t.exports=RegExp("(\\d+)?\\s*("+r+")s?","i")},function(t,e,n){"use strict";var r=n(19),i=n(395);n(21)(r,{clamp:function(t){return i(this,t)}})},function(t,e,n){"use strict";var a=n(121);t.exports=function rangeClamp(t,e){var n=t.start,r=t.end,i=r<n?r:n,s=r<n?n:r;return a(e<i?i:s<e?s:e)}},function(t,e,n){"use strict";var r=n(19);n(21)(r,{clone:function(){return new r(this.start,this.end)}})},function(t,e,n){"use strict";var r=n(19);n(21)(r,{contains:function(t){return null!=t&&(t.start&&t.end?t.start>=this.start&&t.start<=this.end&&t.end>=this.start&&t.end<=this.end:t>=this.start&&t<=this.end)}})},function(t,e,n){"use strict";n(30)},function(t,e,n){"use strict";var a=n(125),r=n(72),i=n(19),o=n(26),u=n(32),c=n(73),l=n(68),f=n(21);t.exports=function buildDateRangeUnits(){var s={};u(r.split("|"),function(t,e){var n,r,i=t+"s";r=e<4?function(){return c(this,t,!0)}:(n=a[l(i)],function(){return o((this.end-this.start)/n)}),s[i]=r}),f(i,s)}},function(t,e,n){"use strict";var r=n(401),i=n(122);t.exports=function isValidRangeMember(t){var e=i(t);return(!!e||0===e)&&r(t)}},function(t,e,n){"use strict";t.exports=function valueIsNotInfinite(t){return t!==-1/0&&t!==1/0}},function(t,e,n){"use strict";var r=n(102);t.exports=function incrementNumber(t,e,n){return r(t+e,n)}},function(t,e,n){"use strict";var r=n(101);t.exports=function incrementString(t,e){return r(t.charCodeAt(0)+e)}},function(t,e,n){"use strict";var r=n(15),i=n(405),s=r.max;t.exports=function getGreaterPrecision(t,e){return s(i(t),i(e))}},function(t,e,n){"use strict";var r=n(406);t.exports=function getPrecision(t){var e=r(t.toString());return e[1]?e[1].length:0}},function(t,e,n){"use strict";var r=n(51).HALF_WIDTH_PERIOD;t.exports=function periodSplit(t){return t.split(r)}},function(t,e,n){"use strict";var r=n(19),i=n(73);n(21)(r,{every:function(t,e){return i(this,t,!1,e)}})},function(t,e,n){"use strict";n(30)},function(t,e,n){"use strict";var r=n(19);n(21)(r,{intersect:function(t){return t.start>this.end||t.end<this.start?new r(NaN,NaN):new r(this.start>t.start?this.start:t.start,this.end<t.end?this.end:t.end)}})},function(t,e,n){"use strict";var r=n(19),i=n(59);n(21)(r,{isValid:function(){return i(this)}})},function(t,e,n){"use strict";n(30)},function(t,e,n){"use strict";n(30)},function(t,e,n){"use strict";n(30)},function(t,e,n){"use strict";n(30)},function(t,e,n){"use strict";var r=n(19),i=n(15),s=n(59),a=n(21),o=n(416),u=i.abs;a(r,{span:function(){var t=o(this.end)-o(this.start);return s(this)?u(t)+1:NaN}})},function(t,e,n){"use strict";var r=n(12).isString;t.exports=function getRangeMemberNumericValue(t){return r(t)?t.charCodeAt(0):t}},function(t,e,n){"use strict";var r=n(19),i=n(73);n(21)(r,{toArray:function(){return i(this)}})},function(t,e,n){"use strict";var r=n(19),i=n(59);n(21)(r,{toString:function(){return i(this)?this.start+".."+this.end:"Invalid Range"}})},function(t,e,n){"use strict";var r=n(19);n(21)(r,{union:function(t){return new r(this.start<t.start?this.start:t.start,this.end>t.end?this.end:t.end)}})},function(t,e,n){"use strict";n(30)},function(t,e,n){"use strict";n(30)},function(t,e,n){"use strict";n(423),n(424),n(425),n(426),n(427),n(428),n(429),n(430),n(431),n(432),n(433),n(434),n(435),n(436),n(437),n(438),n(439),t.exports=n(0)},function(t,e,n){"use strict";n(11)("ca",{plural:!0,units:"milisegon:|s,segon:|s,minut:|s,hor:a|es,di:a|es,setman:a|es,mes:|os,any:|s",months:"gen:er|,febr:er|,mar:ç|,abr:il|,mai:g|,jun:y|,jul:iol|,ag:ost|,set:embre|,oct:ubre|,nov:embre|,des:embre|",weekdays:"diumenge|dg,dilluns|dl,dimarts|dt,dimecres|dc,dijous|dj,divendres|dv,dissabte|ds",numerals:"zero,un,dos,tres,quatre,cinc,sis,set,vuit,nou,deu",tokens:"el,la,de",short:"{dd}/{MM}/{yyyy}",medium:"{d} {month} {yyyy}",long:"{d} {month} {yyyy} {time}",full:"{weekday} {d} {month} {yyyy} {time}",stamp:"{dow} {d} {mon} {yyyy} {time}",time:"{H}:{mm}",past:"{sign} {num} {unit}",future:"{sign} {num} {unit}",duration:"{num} {unit}",timeMarkers:"a las",ampm:"am,pm",modifiers:[{name:"day",src:"abans d'ahir",value:-2},{name:"day",src:"ahir",value:-1},{name:"day",src:"avui",value:0},{name:"day",src:"demà|dema",value:1},{name:"sign",src:"fa",value:-1},{name:"sign",src:"en",value:1},{name:"shift",src:"passat",value:-1},{name:"shift",src:"el proper|la propera",value:1}],parse:["{sign} {num} {unit}","{num} {unit} {sign}","{0?}{1?} {unit:5-7} {shift}","{0?}{1?} {shift} {unit:5-7}"],timeParse:["{shift} {weekday}","{weekday} {shift}","{date?} {2?} {months}\\.? {2?} {year?}"]})},function(t,e,n){"use strict";n(11)("da",{plural:!0,units:"millisekund:|er,sekund:|er,minut:|ter,tim:e|er,dag:|e,ug:e|er|en,måned:|er|en+maaned:|er|en,år:||et+aar:||et",months:"jan:uar|,feb:ruar|,mar:ts|,apr:il|,maj,jun:i|,jul:i|,aug:ust|,sep:tember|,okt:ober|,nov:ember|,dec:ember|",weekdays:"søn:dag|+son:dag|,man:dag|,tir:sdag|,ons:dag|,tor:sdag|,fre:dag|,lør:dag|+lor:dag|",numerals:"nul,en|et,to,tre,fire,fem,seks,syv,otte,ni,ti",tokens:"den,for",articles:"den",short:"{dd}-{MM}-{yyyy}",medium:"{d}. {month} {yyyy}",long:"{d}. {month} {yyyy} {time}",full:"{weekday} d. {d}. {month} {yyyy} {time}",stamp:"{dow} {d} {mon} {yyyy} {time}",time:"{H}:{mm}",past:"{num} {unit} {sign}",future:"{sign} {num} {unit}",duration:"{num} {unit}",ampm:"am,pm",modifiers:[{name:"day",src:"forgårs|i forgårs|forgaars|i forgaars",value:-2},{name:"day",src:"i går|igår|i gaar|igaar",value:-1},{name:"day",src:"i dag|idag",value:0},{name:"day",src:"i morgen|imorgen",value:1},{name:"day",src:"over morgon|overmorgen|i over morgen|i overmorgen|iovermorgen",value:2},{name:"sign",src:"siden",value:-1},{name:"sign",src:"om",value:1},{name:"shift",src:"i sidste|sidste",value:-1},{name:"shift",src:"denne",value:0},{name:"shift",src:"næste|naeste",value:1}],parse:["{months} {year?}","{num} {unit} {sign}","{sign} {num} {unit}","{1?} {num} {unit} {sign}","{shift} {unit:5-7}"],timeParse:["{day|weekday}","{date} {months?}\\.? {year?}"],timeFrontParse:["{shift} {weekday}","{0?} {weekday?},? {date}\\.? {months?}\\.? {year?}"]})},function(t,e,n){"use strict";n(11)("de",{plural:!0,units:"Millisekunde:|n,Sekunde:|n,Minute:|n,Stunde:|n,Tag:|en,Woche:|n,Monat:|en,Jahr:|en|e",months:"Jan:uar|,Feb:ruar|,M:är|ärz|ar|arz,Apr:il|,Mai,Juni,Juli,Aug:ust|,Sept:ember|,Okt:ober|,Nov:ember|,Dez:ember|",weekdays:"So:nntag|,Mo:ntag|,Di:enstag|,Mi:ttwoch|,Do:nnerstag|,Fr:eitag|,Sa:mstag|",numerals:"null,ein:|e|er|en|em,zwei,drei,vier,fuenf,sechs,sieben,acht,neun,zehn",tokens:"der",short:"{dd}.{MM}.{yyyy}",medium:"{d}. {Month} {yyyy}",long:"{d}. {Month} {yyyy} {time}",full:"{Weekday}, {d}. {Month} {yyyy} {time}",stamp:"{Dow} {d} {Mon} {yyyy} {time}",time:"{H}:{mm}",past:"{sign} {num} {unit}",future:"{sign} {num} {unit}",duration:"{num} {unit}",timeMarkers:"um",ampm:"am,pm",modifiers:[{name:"day",src:"vorgestern",value:-2},{name:"day",src:"gestern",value:-1},{name:"day",src:"heute",value:0},{name:"day",src:"morgen",value:1},{name:"day",src:"übermorgen|ubermorgen|uebermorgen",value:2},{name:"sign",src:"vor:|her",value:-1},{name:"sign",src:"in",value:1},{name:"shift",src:"letzte:|r|n|s",value:-1},{name:"shift",src:"nächste:|r|n|s+nachste:|r|n|s+naechste:|r|n|s+kommende:n|r",value:1}],parse:["{months} {year?}","{sign} {num} {unit}","{num} {unit} {sign}","{shift} {unit:5-7}"],timeParse:["{shift?} {day|weekday}","{weekday?},? {date}\\.? {months?}\\.? {year?}"],timeFrontParse:["{shift} {weekday}","{weekday?},? {date}\\.? {months?}\\.? {year?}"]})},function(t,e,n){"use strict";n(11)("es",{plural:!0,units:"milisegundo:|s,segundo:|s,minuto:|s,hora:|s,día|días|dia|dias,semana:|s,mes:|es,año|años|ano|anos",months:"ene:ro|,feb:rero|,mar:zo|,abr:il|,may:o|,jun:io|,jul:io|,ago:sto|,sep:tiembre|,oct:ubre|,nov:iembre|,dic:iembre|",weekdays:"dom:ingo|,lun:es|,mar:tes|,mié:rcoles|+mie:rcoles|,jue:ves|,vie:rnes|,sáb:ado|+sab:ado|",numerals:"cero,uno,dos,tres,cuatro,cinco,seis,siete,ocho,nueve,diez",tokens:"el,la,de",short:"{dd}/{MM}/{yyyy}",medium:"{d} de {Month} de {yyyy}",long:"{d} de {Month} de {yyyy} {time}",full:"{weekday}, {d} de {month} de {yyyy} {time}",stamp:"{dow} {d} {mon} {yyyy} {time}",time:"{H}:{mm}",past:"{sign} {num} {unit}",future:"{sign} {num} {unit}",duration:"{num} {unit}",timeMarkers:"a las",ampm:"am,pm",modifiers:[{name:"day",src:"anteayer",value:-2},{name:"day",src:"ayer",value:-1},{name:"day",src:"hoy",value:0},{name:"day",src:"mañana|manana",value:1},{name:"sign",src:"hace",value:-1},{name:"sign",src:"dentro de",value:1},{name:"shift",src:"pasad:o|a",value:-1},{name:"shift",src:"próximo|próxima|proximo|proxima",value:1}],parse:["{months} {2?} {year?}","{sign} {num} {unit}","{num} {unit} {sign}","{0?}{1?} {unit:5-7} {shift}","{0?}{1?} {shift} {unit:5-7}"],timeParse:["{shift?} {day|weekday} {shift?}","{date} {2?} {months?}\\.? {2?} {year?}"],timeFrontParse:["{shift?} {weekday} {shift?}","{date} {2?} {months?}\\.? {2?} {year?}"]})},function(t,e,n){"use strict";n(11)("fi",{plural:!0,units:"millisekun:ti|tia|nin|teja|tina,sekun:ti|tia|nin|teja|tina,minuut:ti|tia|in|teja|tina,tun:ti|tia|nin|teja|tina,päiv:ä|ää|än|iä|änä,viik:ko|koa|on|olla|koja|kona,kuukau:si|tta|den+kuussa,vuo:si|tta|den|sia|tena|nna",months:"tammi:kuuta||kuu,helmi:kuuta||kuu,maalis:kuuta||kuu,huhti:kuuta||kuu,touko:kuuta||kuu,kesä:kuuta||kuu,heinä:kuuta||kuu,elo:kuuta||kuu,syys:kuuta||kuu,loka:kuuta||kuu,marras:kuuta||kuu,joulu:kuuta||kuu",weekdays:"su:nnuntai||nnuntaina,ma:anantai||anantaina,ti:istai||istaina,ke:skiviikko||skiviikkona,to:rstai||rstaina,pe:rjantai||rjantaina,la:uantai||uantaina",numerals:"nolla,yksi|ensimmäinen,kaksi|toinen,kolm:e|as,neljä:|s,vii:si|des,kuu:si|des,seitsemä:n|s,kahdeksa:n|s,yhdeksä:n|s,kymmene:n|s",short:"{d}.{M}.{yyyy}",medium:"{d}. {month} {yyyy}",long:"{d}. {month} {yyyy} klo {time}",full:"{weekday} {d}. {month} {yyyy} klo {time}",stamp:"{dow} {d} {mon} {yyyy} {time}",time:"{H}.{mm}",timeMarkers:"klo,kello",timeSeparator:".",ordinalSuffix:".",relative:function(e,n,t,r){var i=this.units;function numberWithUnit(t){return e+" "+i[8*t+n]}function baseUnit(){return numberWithUnit(1===e?0:1)}switch(r){case"duration":return baseUnit();case"past":return baseUnit()+" sitten";case"future":return numberWithUnit(2)+" kuluttua"}},modifiers:[{name:"day",src:"toissa päivänä",value:-2},{name:"day",src:"eilen|eilistä",value:-1},{name:"day",src:"tänään",value:0},{name:"day",src:"huomenna|huomista",value:1},{name:"day",src:"ylihuomenna|ylihuomista",value:2},{name:"sign",src:"sitten|aiemmin",value:-1},{name:"sign",src:"päästä|kuluttua|myöhemmin",value:1},{name:"edge",src:"lopussa",value:2},{name:"edge",src:"ensimmäinen|ensimmäisenä",value:-2},{name:"shift",src:"edel:linen|lisenä",value:-1},{name:"shift",src:"viime",value:-1},{name:"shift",src:"tä:llä|ssä|nä|mä",value:0},{name:"shift",src:"seuraava|seuraavana|tuleva|tulevana|ensi",value:1}],parse:["{months} {year?}","{shift} {unit:5-7}"],timeParse:["{shift?} {day|weekday}","{weekday?},? {date}\\.? {months?}\\.? {year?}"],timeFrontParse:["{shift?} {day|weekday}","{num?} {unit} {sign}","{weekday?},? {date}\\.? {months?}\\.? {year?}"]})},function(t,e,n){"use strict";n(11)("fr",{plural:!0,units:"milliseconde:|s,seconde:|s,minute:|s,heure:|s,jour:|s,semaine:|s,mois,an:|s|née|nee",months:"janv:ier|,févr:ier|+fevr:ier|,mars,avr:il|,mai,juin,juil:let|,août,sept:embre|,oct:obre|,nov:embre|,déc:embre|+dec:embre|",weekdays:"dim:anche|,lun:di|,mar:di|,mer:credi|,jeu:di|,ven:dredi|,sam:edi|",numerals:"zéro,un:|e,deux,trois,quatre,cinq,six,sept,huit,neuf,dix",tokens:"l'|la|le,er",short:"{dd}/{MM}/{yyyy}",medium:"{d} {month} {yyyy}",long:"{d} {month} {yyyy} {time}",full:"{weekday} {d} {month} {yyyy} {time}",stamp:"{dow} {d} {mon} {yyyy} {time}",time:"{H}:{mm}",past:"{sign} {num} {unit}",future:"{sign} {num} {unit}",duration:"{num} {unit}",timeMarkers:"à",ampm:"am,pm",modifiers:[{name:"day",src:"hier",value:-1},{name:"day",src:"aujourd'hui",value:0},{name:"day",src:"demain",value:1},{name:"sign",src:"il y a",value:-1},{name:"sign",src:"dans|d'ici",value:1},{name:"shift",src:"derni:èr|er|ère|ere",value:-1},{name:"shift",src:"prochain:|e",value:1}],parse:["{months} {year?}","{sign} {num} {unit}","{0?} {unit:5-7} {shift}"],timeParse:["{day|weekday} {shift?}","{weekday?},? {0?} {date}{1?} {months}\\.? {year?}"],timeFrontParse:["{0?} {weekday} {shift}","{weekday?},? {0?} {date}{1?} {months}\\.? {year?}"]})},function(t,e,n){"use strict";n(11)("it",{plural:!0,units:"millisecond:o|i,second:o|i,minut:o|i,or:a|e,giorn:o|i,settiman:a|e,mes:e|i,ann:o|i",months:"gen:naio|,feb:braio|,mar:zo|,apr:ile|,mag:gio|,giu:gno|,lug:lio|,ago:sto|,set:tembre|,ott:obre|,nov:embre|,dic:embre|",weekdays:"dom:enica|,lun:edì||edi,mar:tedì||tedi,mer:coledì||coledi,gio:vedì||vedi,ven:erdì||erdi,sab:ato|",numerals:"zero,un:|a|o|',due,tre,quattro,cinque,sei,sette,otto,nove,dieci",tokens:"l'|la|il",short:"{dd}/{MM}/{yyyy}",medium:"{d} {month} {yyyy}",long:"{d} {month} {yyyy} {time}",full:"{weekday}, {d} {month} {yyyy} {time}",stamp:"{dow} {d} {mon} {yyyy} {time}",time:"{H}:{mm}",past:"{num} {unit} {sign}",future:"{num} {unit} {sign}",duration:"{num} {unit}",timeMarkers:"alle",ampm:"am,pm",modifiers:[{name:"day",src:"ieri",value:-1},{name:"day",src:"oggi",value:0},{name:"day",src:"domani",value:1},{name:"day",src:"dopodomani",value:2},{name:"sign",src:"fa",value:-1},{name:"sign",src:"da adesso",value:1},{name:"shift",src:"scors:o|a",value:-1},{name:"shift",src:"prossim:o|a",value:1}],parse:["{months} {year?}","{num} {unit} {sign}","{0?} {unit:5-7} {shift}","{0?} {shift} {unit:5-7}"],timeParse:["{day|weekday} {shift?}","{weekday?},? {date} {months?}\\.? {year?}"],timeFrontParse:["{day|weekday} {shift?}","{weekday?},? {date} {months?}\\.? {year?}"]})},function(t,e,n){"use strict";n(11)("ja",{ampmFront:!0,numeralUnits:!0,allowsFullWidth:!0,timeMarkerOptional:!0,firstDayOfWeek:0,firstDayOfWeekYear:1,units:"ミリ秒,秒,分,時間,日,週間|週,ヶ月|ヵ月|月,年|年度",weekdays:"日:曜日||曜,月:曜日||曜,火:曜日||曜,水:曜日||曜,木:曜日||曜,金:曜日||曜,土:曜日||曜",numerals:"〇,一,二,三,四,五,六,七,八,九",placeholders:"十,百,千,万",timeSuffixes:",秒,分,時,日,,月,年度?",short:"{yyyy}/{MM}/{dd}",medium:"{yyyy}年{M}月{d}日",long:"{yyyy}年{M}月{d}日{time}",full:"{yyyy}年{M}月{d}日{time} {weekday}",stamp:"{yyyy}年{M}月{d}日 {H}:{mm} {dow}",time:"{tt}{h}時{mm}分",past:"{num}{unit}{sign}",future:"{num}{unit}{sign}",duration:"{num}{unit}",ampm:"午前,午後",modifiers:[{name:"day",src:"一昨々日|前々々日",value:-3},{name:"day",src:"一昨日|おととい|前々日",value:-2},{name:"day",src:"昨日|前日",value:-1},{name:"day",src:"今日|当日|本日",value:0},{name:"day",src:"明日|翌日|次日",value:1},{name:"day",src:"明後日|翌々日",value:2},{name:"day",src:"明々後日|翌々々日",value:3},{name:"sign",src:"前",value:-1},{name:"sign",src:"後",value:1},{name:"edge",src:"始|初日|頭",value:-2},{name:"edge",src:"末|尻",value:2},{name:"edge",src:"末日",value:1},{name:"shift",src:"一昨々|前々々",value:-3},{name:"shift",src:"一昨|前々|先々",value:-2},{name:"shift",src:"先|昨|去|前",value:-1},{name:"shift",src:"今|本|当",value:0},{name:"shift",src:"来|明|翌|次",value:1},{name:"shift",src:"明後|翌々|次々|再来|さ来",value:2},{name:"shift",src:"明々後|翌々々",value:3}],parse:["{month}{edge}","{num}{unit}{sign}","{year?}{month}","{year}"],timeParse:["{day|weekday}","{shift}{unit:5}{weekday?}","{shift}{unit:7}{month}{edge}","{shift}{unit:7}{month?}{date?}","{shift}{unit:6}{edge?}{date?}","{year?}{month?}{date}"]})},function(t,e,n){"use strict";n(11)("ko",{ampmFront:!0,numeralUnits:!0,units:"밀리초,초,분,시간,일,주,개월|달,년|해",weekdays:"일:요일|,월:요일|,화:요일|,수:요일|,목:요일|,금:요일|,토:요일|",numerals:"영|제로,일|한,이,삼,사,오,육,칠,팔,구,십",short:"{yyyy}.{MM}.{dd}",medium:"{yyyy}년 {M}월 {d}일",long:"{yyyy}년 {M}월 {d}일 {time}",full:"{yyyy}년 {M}월 {d}일 {weekday} {time}",stamp:"{yyyy}년 {M}월 {d}일 {H}:{mm} {dow}",time:"{tt} {h}시 {mm}분",past:"{num}{unit} {sign}",future:"{num}{unit} {sign}",duration:"{num}{unit}",timeSuffixes:",초,분,시,일,,월,년",ampm:"오전,오후",modifiers:[{name:"day",src:"그저께",value:-2},{name:"day",src:"어제",value:-1},{name:"day",src:"오늘",value:0},{name:"day",src:"내일",value:1},{name:"day",src:"모레",value:2},{name:"sign",src:"전",value:-1},{name:"sign",src:"후",value:1},{name:"shift",src:"지난|작",value:-1},{name:"shift",src:"이번|올",value:0},{name:"shift",src:"다음|내",value:1}],parse:["{num}{unit} {sign}","{shift?} {unit:5-7}","{year?} {month}","{year}"],timeParse:["{day|weekday}","{shift} {unit:5?} {weekday}","{year?} {month?} {date} {weekday?}"]})},function(t,e,n){"use strict";n(11)("nl",{plural:!0,units:"milliseconde:|n,seconde:|n,minu:ut|ten,uur,dag:|en,we:ek|ken,maand:|en,jaar",months:"jan:uari|,feb:ruari|,maart|mrt,apr:il|,mei,jun:i|,jul:i|,aug:ustus|,sep:tember|,okt:ober|,nov:ember|,dec:ember|",weekdays:"zondag|zo,maandag|ma,dinsdag|di,woensdag|wo|woe,donderdag|do,vrijdag|vr|vrij,zaterdag|za",numerals:"nul,een,twee,drie,vier,vijf,zes,zeven,acht,negen,tien",short:"{dd}-{MM}-{yyyy}",medium:"{d} {month} {yyyy}",long:"{d} {Month} {yyyy} {time}",full:"{weekday} {d} {Month} {yyyy} {time}",stamp:"{dow} {d} {Mon} {yyyy} {time}",time:"{H}:{mm}",past:"{num} {unit} {sign}",future:"{num} {unit} {sign}",duration:"{num} {unit}",timeMarkers:"'s,om",modifiers:[{name:"day",src:"gisteren",value:-1},{name:"day",src:"vandaag",value:0},{name:"day",src:"morgen",value:1},{name:"day",src:"overmorgen",value:2},{name:"sign",src:"geleden",value:-1},{name:"sign",src:"vanaf nu",value:1},{name:"shift",src:"laatste|vorige|afgelopen",value:-1},{name:"shift",src:"volgend:|e",value:1}],parse:["{months} {year?}","{num} {unit} {sign}","{0?} {unit:5-7} {shift}","{0?} {shift} {unit:5-7}"],timeParse:["{shift?} {day|weekday}","{weekday?},? {date} {months?}\\.? {year?}"],timeFrontParse:["{shift?} {day|weekday}","{weekday?},? {date} {months?}\\.? {year?}"]})},function(t,e,n){"use strict";n(11)("no",{plural:!0,units:"millisekund:|er,sekund:|er,minutt:|er,tim:e|er,dag:|er,uk:e|er|en,måned:|er|en+maaned:|er|en,år:||et+aar:||et",months:"januar,februar,mars,april,mai,juni,juli,august,september,oktober,november,desember",weekdays:"søndag|sondag,mandag,tirsdag,onsdag,torsdag,fredag,lørdag|lordag",numerals:"en|et,to,tre,fire,fem,seks,sju|syv,åtte,ni,ti",tokens:"den,for",articles:"den",short:"d. {d}. {month} {yyyy}",long:"den {d}. {month} {yyyy} {H}:{mm}",full:"{Weekday} den {d}. {month} {yyyy} {H}:{mm}:{ss}",past:"{num} {unit} {sign}",future:"{sign} {num} {unit}",duration:"{num} {unit}",ampm:"am,pm",modifiers:[{name:"day",src:"forgårs|i forgårs|forgaars|i forgaars",value:-2},{name:"day",src:"i går|igår|i gaar|igaar",value:-1},{name:"day",src:"i dag|idag",value:0},{name:"day",src:"i morgen|imorgen",value:1},{name:"day",src:"overimorgen|overmorgen|over i morgen",value:2},{name:"sign",src:"siden",value:-1},{name:"sign",src:"om",value:1},{name:"shift",src:"i siste|siste",value:-1},{name:"shift",src:"denne",value:0},{name:"shift",src:"neste",value:1}],parse:["{num} {unit} {sign}","{sign} {num} {unit}","{1?} {num} {unit} {sign}","{shift} {unit:5-7}"],timeParse:["{date} {month}","{shift} {weekday}","{0?} {weekday?},? {date?} {month}\\.? {year}"]})},function(t,e,n){"use strict";n(11)("pl",{plural:!0,units:"milisekund:a|y|,sekund:a|y|,minut:a|y|,godzin:a|y|,dzień|dni|dni,tydzień|tygodnie|tygodni,miesiąc|miesiące|miesięcy,rok|lata|lat",months:"sty:cznia||czeń,lut:ego||y,mar:ca||zec,kwi:etnia||ecień,maj:a|,cze:rwca||rwiec,lip:ca||iec,sie:rpnia||rpień,wrz:eśnia||esień,paź:dziernika||dziernik,lis:topada||topad,gru:dnia||dzień",weekdays:"nie:dziela||dzielę,pon:iedziałek|,wt:orek|,śr:oda||odę,czw:artek|,piątek|pt,sobota|sb|sobotę",numerals:"zero,jeden|jedną,dwa|dwie,trzy,cztery,pięć,sześć,siedem,osiem,dziewięć,dziesięć",tokens:"w|we,roku",short:"{dd}.{MM}.{yyyy}",medium:"{d} {month} {yyyy}",long:"{d} {month} {yyyy} {time}",full:"{weekday}, {d} {month} {yyyy} {time}",stamp:"{dow} {d} {mon} {yyyy} {time}",time:"{H}:{mm}",timeMarkers:"o",ampm:"am,pm",modifiers:[{name:"day",src:"przedwczoraj",value:-2},{name:"day",src:"wczoraj",value:-1},{name:"day",src:"dzisiaj|dziś",value:0},{name:"day",src:"jutro",value:1},{name:"day",src:"pojutrze",value:2},{name:"sign",src:"temu|przed",value:-1},{name:"sign",src:"za",value:1},{name:"shift",src:"zeszły|zeszła|ostatni|ostatnia",value:-1},{name:"shift",src:"następny|następna|następnego|przyszły|przyszła|przyszłego",value:1}],relative:function(t,e,n,r){var i;if(4===e){if(1===t&&"past"===r)return"wczoraj";if(1===t&&"future"===r)return"jutro";if(2===t&&"past"===r)return"przedwczoraj";if(2===t&&"future"===r)return"pojutrze"}var s=+t.toFixed(0).slice(-1),a=+t.toFixed(0).slice(-2);switch(!0){case 1===t:i=0;break;case 12<=a&&a<=14:i=2;break;case 2<=s&&s<=4:i=1;break;default:i=2}var o=this.units[8*i+e],u=t+" ";switch("past"!==r&&"future"!==r||1!==t||(o=o.replace(/a$/,"ę")),o=u+o,r){case"duration":return o;case"past":return o+" temu";case"future":return"za "+o}},parse:["{num} {unit} {sign}","{sign} {num} {unit}","{months} {year?}","{shift} {unit:5-7}","{0} {shift?} {weekday}"],timeFrontParse:["{day|weekday}","{date} {months} {year?} {1?}","{0?} {shift?} {weekday}"]})},function(t,e,n){"use strict";n(11)("pt",{plural:!0,units:"milisegundo:|s,segundo:|s,minuto:|s,hora:|s,dia:|s,semana:|s,mês|mêses|mes|meses,ano:|s",months:"jan:eiro|,fev:ereiro|,mar:ço|,abr:il|,mai:o|,jun:ho|,jul:ho|,ago:sto|,set:embro|,out:ubro|,nov:embro|,dez:embro|",weekdays:"dom:ingo|,seg:unda-feira|,ter:ça-feira|,qua:rta-feira|,qui:nta-feira|,sex:ta-feira|,sáb:ado||ado",numerals:"zero,um:|a,dois|duas,três|tres,quatro,cinco,seis,sete,oito,nove,dez",tokens:"a,de",short:"{dd}/{MM}/{yyyy}",medium:"{d} de {Month} de {yyyy}",long:"{d} de {Month} de {yyyy} {time}",full:"{Weekday}, {d} de {Month} de {yyyy} {time}",stamp:"{Dow} {d} {Mon} {yyyy} {time}",time:"{H}:{mm}",past:"{num} {unit} {sign}",future:"{sign} {num} {unit}",duration:"{num} {unit}",timeMarkers:"às",ampm:"am,pm",modifiers:[{name:"day",src:"anteontem",value:-2},{name:"day",src:"ontem",value:-1},{name:"day",src:"hoje",value:0},{name:"day",src:"amanh:ã|a",value:1},{name:"sign",src:"atrás|atras|há|ha",value:-1},{name:"sign",src:"daqui a",value:1},{name:"shift",src:"passad:o|a",value:-1},{name:"shift",src:"próximo|próxima|proximo|proxima",value:1}],parse:["{months} {1?} {year?}","{num} {unit} {sign}","{sign} {num} {unit}","{0?} {unit:5-7} {shift}","{0?} {shift} {unit:5-7}"],timeParse:["{shift?} {day|weekday}","{0?} {shift} {weekday}","{date} {1?} {months?} {1?} {year?}"],timeFrontParse:["{shift?} {day|weekday}","{date} {1?} {months?} {1?} {year?}"]})},function(t,e,n){"use strict";n(11)("ru",{firstDayOfWeekYear:1,units:"миллисекунд:а|у|ы|,секунд:а|у|ы|,минут:а|у|ы|,час:||а|ов,день|день|дня|дней,недел:я|ю|и|ь|е,месяц:||а|ев|е,год|год|года|лет|году",months:"янв:аря||.|арь,фев:раля||р.|раль,мар:та||т,апр:еля||.|ель,мая|май,июн:я||ь,июл:я||ь,авг:уста||.|уст,сен:тября||т.|тябрь,окт:ября||.|ябрь,ноя:бря||брь,дек:абря||.|абрь",weekdays:"воскресенье|вс,понедельник|пн,вторник|вт,среда|ср,четверг|чт,пятница|пт,суббота|сб",numerals:"ноль,од:ин|ну,дв:а|е,три,четыре,пять,шесть,семь,восемь,девять,десять",tokens:"в|на,г\\.?(?:ода)?",short:"{dd}.{MM}.{yyyy}",medium:"{d} {month} {yyyy} г.",long:"{d} {month} {yyyy} г., {time}",full:"{weekday}, {d} {month} {yyyy} г., {time}",stamp:"{dow} {d} {mon} {yyyy} {time}",time:"{H}:{mm}",timeMarkers:"в",ampm:" утра, вечера",modifiers:[{name:"day",src:"позавчера",value:-2},{name:"day",src:"вчера",value:-1},{name:"day",src:"сегодня",value:0},{name:"day",src:"завтра",value:1},{name:"day",src:"послезавтра",value:2},{name:"sign",src:"назад",value:-1},{name:"sign",src:"через",value:1},{name:"shift",src:"прошл:ый|ой|ом",value:-1},{name:"shift",src:"следующ:ий|ей|ем",value:1}],relative:function(t,e,n,r){var i,s,a=t.toString().slice(-1);switch(!0){case 11<=t&&t<=15:s=3;break;case 1==a:s=1;break;case 2<=a&&a<=4:s=2;break;default:s=3}switch(i=t+" "+this.units[8*s+e],r){case"duration":return i;case"past":return i+" назад";case"future":return"через "+i}},parse:["{num} {unit} {sign}","{sign} {num} {unit}","{months} {year?}","{0?} {shift} {unit:5-7}"],timeParse:["{day|weekday}","{0?} {shift} {weekday}","{date} {months?} {year?} {1?}"],timeFrontParse:["{0?} {shift} {weekday}","{date} {months?} {year?} {1?}"]})},function(t,e,n){"use strict";n(11)("sv",{plural:!0,units:"millisekund:|er,sekund:|er,minut:|er,timm:e|ar,dag:|ar,veck:a|or|an,månad:|er|en+manad:|er|en,år:||et+ar:||et",months:"jan:uari|,feb:ruari|,mar:s|,apr:il|,maj,jun:i|,jul:i|,aug:usti|,sep:tember|,okt:ober|,nov:ember|,dec:ember|",weekdays:"sön:dag|+son:dag|,mån:dag||dagen+man:dag||dagen,tis:dag|,ons:dag|,tor:sdag|,fre:dag|,lör:dag||dag",numerals:"noll,en|ett,två|tva,tre,fyra,fem,sex,sju,åtta|atta,nio,tio",tokens:"den,för|for",articles:"den",short:"{yyyy}-{MM}-{dd}",medium:"{d} {month} {yyyy}",long:"{d} {month} {yyyy} {time}",full:"{weekday} {d} {month} {yyyy} {time}",stamp:"{dow} {d} {mon} {yyyy} {time}",time:"{H}:{mm}",past:"{num} {unit} {sign}",future:"{sign} {num} {unit}",duration:"{num} {unit}",ampm:"am,pm",modifiers:[{name:"day",src:"förrgår|i förrgår|iförrgår|forrgar|i forrgar|iforrgar",value:-2},{name:"day",src:"går|i går|igår|gar|i gar|igar",value:-1},{name:"day",src:"dag|i dag|idag",value:0},{name:"day",src:"morgon|i morgon|imorgon",value:1},{name:"day",src:"över morgon|övermorgon|i över morgon|i övermorgon|iövermorgon|over morgon|overmorgon|i over morgon|i overmorgon|iovermorgon",value:2},{name:"sign",src:"sedan|sen",value:-1},{name:"sign",src:"om",value:1},{name:"shift",src:"i förra|förra|i forra|forra",value:-1},{name:"shift",src:"denna",value:0},{name:"shift",src:"nästa|nasta",value:1}],parse:["{months} {year?}","{num} {unit} {sign}","{sign} {num} {unit}","{1?} {num} {unit} {sign}","{shift} {unit:5-7}"],timeParse:["{day|weekday}","{shift} {weekday}","{0?} {weekday?},? {date} {months?}\\.? {year?}"],timeFrontParse:["{day|weekday}","{shift} {weekday}","{0?} {weekday?},? {date} {months?}\\.? {year?}"]})},function(t,e,n){"use strict";n(11)("zh-CN",{ampmFront:!0,numeralUnits:!0,allowsFullWidth:!0,timeMarkerOptional:!0,units:"毫秒,秒钟,分钟,小时,天,个星期|周,个月,年",weekdays:"星期日|日|周日|星期天,星期一|一|周一,星期二|二|周二,星期三|三|周三,星期四|四|周四,星期五|五|周五,星期六|六|周六",numerals:"〇,一,二,三,四,五,六,七,八,九",placeholders:"十,百,千,万",short:"{yyyy}-{MM}-{dd}",medium:"{yyyy}年{M}月{d}日",long:"{yyyy}年{M}月{d}日{time}",full:"{yyyy}年{M}月{d}日{weekday}{time}",stamp:"{yyyy}年{M}月{d}日{H}:{mm}{dow}",time:"{tt}{h}点{mm}分",past:"{num}{unit}{sign}",future:"{num}{unit}{sign}",duration:"{num}{unit}",timeSuffixes:",秒,分钟?,点|时,日|号,,月,年",ampm:"上午,下午",modifiers:[{name:"day",src:"大前天",value:-3},{name:"day",src:"前天",value:-2},{name:"day",src:"昨天",value:-1},{name:"day",src:"今天",value:0},{name:"day",src:"明天",value:1},{name:"day",src:"后天",value:2},{name:"day",src:"大后天",value:3},{name:"sign",src:"前",value:-1},{name:"sign",src:"后",value:1},{name:"shift",src:"上|去",value:-1},{name:"shift",src:"这",value:0},{name:"shift",src:"下|明",value:1}],parse:["{num}{unit}{sign}","{shift}{unit:5-7}","{year?}{month}","{year}"],timeParse:["{day|weekday}","{shift}{weekday}","{year?}{month?}{date}"]})},function(t,e,n){"use strict";n(11)("zh-TW",{ampmFront:!0,numeralUnits:!0,allowsFullWidth:!0,timeMarkerOptional:!0,units:"毫秒,秒鐘,分鐘,小時,天,個星期|週,個月,年",weekdays:"星期日|日|週日|星期天,星期一|一|週一,星期二|二|週二,星期三|三|週三,星期四|四|週四,星期五|五|週五,星期六|六|週六",numerals:"〇,一,二,三,四,五,六,七,八,九",placeholders:"十,百,千,万",short:"{yyyy}/{MM}/{dd}",medium:"{yyyy}年{M}月{d}日",long:"{yyyy}年{M}月{d}日{time}",full:"{yyyy}年{M}月{d}日{weekday}{time}",stamp:"{yyyy}年{M}月{d}日{H}:{mm}{dow}",time:"{tt}{h}點{mm}分",past:"{num}{unit}{sign}",future:"{num}{unit}{sign}",duration:"{num}{unit}",timeSuffixes:",秒,分鐘?,點|時,日|號,,月,年",ampm:"上午,下午",modifiers:[{name:"day",src:"大前天",value:-3},{name:"day",src:"前天",value:-2},{name:"day",src:"昨天",value:-1},{name:"day",src:"今天",value:0},{name:"day",src:"明天",value:1},{name:"day",src:"後天",value:2},{name:"day",src:"大後天",value:3},{name:"sign",src:"前",value:-1},{name:"sign",src:"後",value:1},{name:"shift",src:"上|去",value:-1},{name:"shift",src:"這",value:0},{name:"shift",src:"下|明",value:1}],parse:["{num}{unit}{sign}","{shift}{unit:5-7}","{year?}{month}","{year}"],timeParse:["{day|weekday}","{shift}{weekday}","{year?}{month?}{date}"]})}])});
},{}],5:[function(require,module,exports){
'use strict';

module.exports = require('./dist/tablefilter/tablefilter').TableFilter;

},{"./dist/tablefilter/tablefilter":4}],6:[function(require,module,exports){
var $ = require('jquery');
require('tablefilter');
require('popper.js');
require('bootstrap');


},{"bootstrap":1,"jquery":2,"popper.js":3,"tablefilter":5}]},{},[6]);
