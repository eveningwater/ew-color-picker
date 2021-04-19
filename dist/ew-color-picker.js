(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = global || self, global.ewColorPicker = factory());
}(this, (function () { 'use strict';

    let addMethod = (instance, method, func) => {
      instance.prototype[method] = func;
      return instance;
    };
    const util = Object.create(null);
    const _toString = Object.prototype.toString;
    ['Number', 'String', 'Function', 'Undefined', 'Boolean'].forEach(type => util['is' + type] = value => typeof value === type.toLowerCase());
    util.addMethod = addMethod;
    ['Object', 'Array', 'RegExp'].forEach(type => util['isDeep' + type] = value => _toString.call(value).slice(8, -1).toLowerCase() === type.toLowerCase());

    util.isShallowObject = value => typeof value === 'object' && !util.isNull(value);

    util['ewObjToArray'] = value => util.isShallowObject(value) ? Array.prototype.slice.call(value) : value;

    util.isNull = value => value === null;

    util.ewAssign = function (target, args) {
      if (util.isNull(target)) return;

      if (Object.assign) {
        return Object.assign(target, args);
      } else {
        const _ = Object(target);

        for (let j = 1, len = arguments.length; j < len; j += 1) {
          const source = arguments[j];

          if (source) {
            for (let key in source) {
              if (Object.prototype.hasOwnProperty.call(source, key)) {
                _[key] = source[key];
              }
            }
          }
        }

        return _;
      }
    };

    util.addClass = (el, className) => el.classList.add(className);

    util.removeClass = (el, className) => el.classList.remove(className);

    util.hasClass = (el, className) => {
      let _hasClass = value => new RegExp(" " + el.className + " ").test(" " + value + " ");

      if (util.isDeepArray(className)) {
        return className.some(name => _hasClass(name));
      } else {
        return _hasClass(className);
      }
    };

    util['setCss'] = (el, prop, value) => el.style.setProperty(prop, value);

    util.setSomeCss = (el, propValue = []) => {
      if (propValue.length) {
        propValue.forEach(p => util.setCss(el, p.prop, p.value));
      }
    };

    util.isDom = el => util.isShallowObject(HTMLElement) ? el instanceof HTMLElement : el && util.isShallowObject(el) && el.nodeType === 1 && util.isString(el.nodeName) || el instanceof HTMLCollection || el instanceof NodeList;

    util.ewError = value => console.error('[ewColorPicker warn]\n' + new Error(value));

    util.ewWarn = value => console.warn('[ewColorPicker warn]\n' + value);

    util.deepCloneObjByJSON = obj => JSON.parse(JSON.stringify(obj));

    util.deepCloneObjByRecursion = function f(obj) {
      if (!util.isShallowObject(obj)) return;
      let cloneObj = util.isDeepArray(obj) ? [] : {};

      for (let k in obj) {
        cloneObj[k] = util.isShallowObject(obj[k]) ? f(obj[k]) : obj[k];
      }

      return cloneObj;
    };

    util.getCss = (el, prop) => window.getComputedStyle(el, null)[prop];

    util.$ = ident => {
      if (!ident) return null;
      return document[ident.indexOf('#') > -1 ? 'querySelector' : 'querySelectorAll'](ident);
    };

    util["on"] = (element, type, handler, useCapture = false) => {
      if (element && type && handler) {
        element.addEventListener(type, handler, useCapture);
      }
    };

    util["off"] = (element, type, handler, useCapture = false) => {
      if (element && type && handler) {
        element.removeEventListener(type, handler, useCapture);
      }
    };

    util['getRect'] = el => el.getBoundingClientRect();

    util['baseClickOutSide'] = (element, isUnbind = true, callback) => {
      const mouseHandler = event => {
        const rect = util.getRect(element);
        const target = event.target;
        if (!target) return;
        const targetRect = util.getRect(target);
        if (targetRect.x >= rect.x && targetRect.y >= rect.y && targetRect.width <= rect.width && targetRect.height <= rect.height) return;
        if (util.isFunction(callback)) callback();

        if (isUnbind) {
          // 延迟解除绑定
          setTimeout(() => {
            util.off(document, util.eventType[0], mouseHandler);
          }, 0);
        }
      };

      util.on(document, util.eventType[0], mouseHandler);
    };

    util["clickOutSide"] = (context, config, callback) => {
      const mouseHandler = event => {
        const rect = util.getRect(context.$Dom.picker);
        let boxRect = null;

        if (config.hasBox) {
          boxRect = util.getRect(context.$Dom.box);
        }

        const target = event.target;
        if (!target) return;
        const targetRect = util.getRect(target); // 利用rect来判断用户点击的地方是否在颜色选择器面板区域之内

        if (config.hasBox) {
          if (targetRect.x >= rect.x && targetRect.y >= rect.y && targetRect.width <= rect.width) return; // 如果点击的是盒子元素

          if (targetRect.x >= boxRect.x && targetRect.y >= boxRect.y && targetRect.width <= boxRect.width && targetRect.height <= boxRect.height) return;
          callback();
        } else {
          if (targetRect.x >= rect.x && targetRect.y >= rect.y && targetRect.width <= rect.width && targetRect.height <= rect.height) return;
          callback();
        }

        setTimeout(() => {
          util.off(document, util.eventType[0], mouseHandler);
        }, 0);
      };

      util.on(document, util.eventType[0], mouseHandler);
    };

    util['createUUID'] = () => (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + new Date().getTime() + '-' + Math.random().toString().substr(2, 5);

    util.removeAllSpace = value => value.replace(/\s+/g, ""); //the event


    util.eventType = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];

    const NOT_DOM_ELEMENTS = ['html', 'head', 'meta', 'title', 'link', 'style', 'script'];
    const ERROR_VARIABLE = {
      DOM_OBJECT_ERROR: 'can not find the element by el property,make sure to pass a correct value!',
      DOM_ERROR: 'can not find the element,make sure to pass a correct param!',
      CONFIG_SIZE_ERROR: 'the value must be a string which is one of the normal,medium,small,mini,or must be an object and need to contain width or height property!',
      DOM_NOT_ERROR: 'Do not pass these elements: ' + NOT_DOM_ELEMENTS.join(',') + ' as a param,pass the correct element such as div!',
      PREDEFINE_COLOR_ERROR: '"predefineColor" is a array that is need to contain color value!',
      CONSTRUCTOR_ERROR: 'ewColorPicker is a constructor and should be called with the new keyword!',
      DEFAULT_COLOR_ERROR: 'the "defaultColor" is not an invalid color,make sure to use the correct color!',
      UPDATE_PARAM_COLOR_ERROR: 'the param is not a invalid color,make sure to use the correct color!',
      UPDATE_PARAM_COLOR_WARN: "the color picker is hided,make sure showing it and then updating the color!",
      COLOR_MODE_ERROR: "To turn on the mode for changing the color, the 'alpha' property and the 'hue' property should be set to true!"
    };

    const animation = {};

    function TimerManager() {
      this.timers = [];
      this.args = [];
      this.isTimerRun = false;
    }

    TimerManager.makeTimerManage = function (element) {
      const elementTimerManage = element.TimerManage;

      if (!elementTimerManage || elementTimerManage.constructor !== TimerManager) {
        element.TimerManage = new TimerManager();
      }
    };

    const methods = [{
      method: "add",
      func: function (timer, args) {
        this.timers.push(timer);
        this.args.push(args);
        this.timerRun();
      }
    }, {
      method: "timerRun",
      func: function () {
        if (!this.isTimerRun) {
          let timer = this.timers.shift(),
              args = this.args.shift();

          if (timer && args) {
            this.isTimerRun = true;
            timer(args[0], args[1]);
          }
        }
      }
    }, {
      method: "next",
      func: function () {
        this.isTimerRun = false;
        this.timerRun();
      }
    }];
    methods.forEach(method => util.addMethod(TimerManager, method.method, method.func));

    function runNext(element) {
      const elementTimerManage = element.TimerManage;

      if (elementTimerManage && elementTimerManage.constructor === TimerManager) {
        elementTimerManage.next();
      }
    }

    function registerMethods(type, element, time) {
      let transition = '';

      if (type.indexOf('slide') > -1) {
        transition = "height" + time + ' ms';
        util.setCss(element, 'overflow', "hidden");
        upAndDown();
      } else {
        transition = "opacity" + time + ' ms';
        inAndOut();
      }

      util.setCss(element, 'transition', transition);

      function upAndDown() {
        const isDown = type.toLowerCase().indexOf('down') > -1;
        if (isDown) util.setCss(element, 'display', 'block');
        let totalHeight = element.offsetHeight;
        let currentHeight = isDown ? 0 : totalHeight;
        let unit = totalHeight / (time / 10);
        if (isDown) util.setCss(element, 'height', '0px');
        let timer = setInterval(() => {
          currentHeight = isDown ? currentHeight + unit : currentHeight - unit;
          util.setCss(element, 'height', currentHeight + 'px');

          if (currentHeight >= totalHeight || currentHeight <= 0) {
            clearInterval(timer);
            util.setCss(element, 'height', totalHeight + 'px');
            runNext(element);
          }

          if (!isDown && currentHeight <= 0) util.setCss(element, 'display', 'none');
        }, 10);
      }

      function inAndOut() {
        const isIn = type.toLowerCase().indexOf('in') > -1;
        let timer = null;
        let unit = 1 * 100 / (time / 10);
        let curAlpha = isIn ? 0 : 100;
        util.setSomeCss(element, [{
          prop: "display",
          value: isIn ? 'none' : 'block'
        }, {
          prop: "opacity",
          value: isIn ? 0 : 1
        }]);

        let handleFade = function () {
          curAlpha = isIn ? curAlpha + unit : curAlpha - unit;
          if (element.style.display === 'none' && isIn) util.setCss(element, 'display', 'block');
          util.setCss(element, 'opacity', (curAlpha / 100).toFixed(2));

          if (curAlpha >= 100 || curAlpha <= 0) {
            if (timer) clearTimeout(timer);
            runNext(element);
            if (curAlpha <= 0) util.setCss(element, 'display', 'none');
            util.setCss(element, 'opacity', curAlpha >= 100 ? 1 : 0);
          } else {
            timer = setTimeout(handleFade, 10);
          }
        };

        handleFade();
      }
    }

    ['slideUp', 'slideDown', 'fadeIn', 'fadeOut'].forEach(method => {
      animation[method] = function (element) {
        TimerManager.makeTimerManage(element);
        element.TimerManage.add(function (element, time) {
          return registerMethods(method, element, time);
        }, arguments);
      };
    });

    const colorRegExp = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/; // RGB color 

    const colorRegRGB = /[rR][gG][Bb][Aa]?[\(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[\)]{1}/g; // RGBA color

    const colorRegRGBA = /^[rR][gG][Bb][Aa][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){3}[\\s]*(1|1.0|0|0?.[0-9]{1,2})[\\s]*[\)]{1}$/; // hsl color

    const colorRegHSL = /^[hH][Ss][Ll][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*)[\)]$/; // HSLA color

    const colorRegHSLA = /^[hH][Ss][Ll][Aa][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,){2}([\\s]*(1|1.0|0|0?.[0-9]{1,2})[\\s]*)[\)]$/;
    /**
     * hex to rgba
     * @param {*} hex 
     * @param {*} alpha 
     */

    function colorHexToRgba(hex, alpha) {
      let a = alpha || 1,
          hColor = hex.toLowerCase(),
          hLen = hex.length,
          rgbaColor = [];

      if (hex && colorRegExp.test(hColor)) {
        //the hex length may be 4 or 7,contained the symbol of #
        if (hLen === 4) {
          let hSixColor = '#';

          for (let i = 1; i < hLen; i++) {
            let sColor = hColor.slice(i, i + 1);
            hSixColor += sColor.concat(sColor);
          }

          hColor = hSixColor;
        }

        for (let j = 1, len = hColor.length; j < len; j += 2) {
          rgbaColor.push(parseInt('0X' + hColor.slice(j, j + 2), 16));
        }

        return util.removeAllSpace("rgba(" + rgbaColor.join(",") + ',' + a + ")");
      } else {
        return util.removeAllSpace(hColor);
      }
    }
    /**
     * rgba to hex
     * @param {*} rgba 
     */

    function colorRgbaToHex(rgba) {
      const hexObject = {
        10: 'A',
        11: 'B',
        12: 'C',
        13: 'D',
        14: 'E',
        15: 'F'
      },
            hexColor = function (value) {
        value = Math.min(Math.round(value), 255);
        const high = Math.floor(value / 16),
              low = value % 16;
        return '' + (hexObject[high] || high) + (hexObject[low] || low);
      };

      const value = '#';

      if (/rgba?/.test(rgba)) {
        let values = rgba.replace(/rgba?\(/, '').replace(/\)/, '').replace(/[\s+]/g, '').split(','),
            color = '';
        values.map((value, index) => {
          if (index <= 2) {
            color += hexColor(value);
          }
        });
        return util.removeAllSpace(value + color);
      }
    }
    /**
     * hsva to rgba
     * @param {*} hsva 
     * @param {*} alpha 
     */

    function colorHsvaToRgba(hsva, alpha) {
      let r,
          g,
          b,
          a = hsva.a; //rgba(r,g,b,a)

      let h = hsva.h,
          s = hsva.s * 255 / 100,
          v = hsva.v * 255 / 100; //hsv(h,s,v)

      if (s === 0) {
        r = g = b = v;
      } else {
        let t = v,
            p = (255 - s) * v / 255,
            q = (t - p) * (h % 60) / 60;

        if (h === 360) {
          r = t;
          g = b = 0;
        } else if (h < 60) {
          r = t;
          g = p + q;
          b = p;
        } else if (h < 120) {
          r = t - q;
          g = t;
          b = p;
        } else if (h < 180) {
          r = p;
          g = t;
          b = p + q;
        } else if (h < 240) {
          r = p;
          g = t - q;
          b = t;
        } else if (h < 300) {
          r = p + q;
          g = p;
          b = t;
        } else if (h < 360) {
          r = t;
          g = p;
          b = t - q;
        } else {
          r = g = b = 0;
        }
      }

      if (alpha >= 0 || alpha <= 1) a = alpha;
      return util.removeAllSpace('rgba(' + Math.ceil(r) + ',' + Math.ceil(g) + ',' + Math.ceil(b) + ',' + a + ')');
    }
    /**
     * hsla to rgba
     * 换算公式:https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4#%E4%BB%8EHSL%E5%88%B0RGB%E7%9A%84%E8%BD%AC%E6%8D%A2
     * @param {*} hsla 
     */

    function colorHslaToRgba(hsla) {
      let h = hsla.h,
          s = hsla.s / 100,
          l = hsla.l / 100,
          a = hsla.a;
      let r, g, b;

      if (s === 0) {
        r = g = b = l;
      } else {
        let compareRGB = (p, q, t) => {
          if (t > 1) t = t - 1;
          if (t < 0) t = t + 1;
          if (t < 1 / 6) return p + (q - p) * 6 * t;
          if (t < 1 / 2) return q;
          if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
          return p;
        };

        let q = l >= 0.5 ? l + s - l * s : l * (1 + s),
            p = 2 * l - q,
            k = h / 360;
        r = compareRGB(p, q, k + 1 / 3);
        g = compareRGB(p, q, k);
        b = compareRGB(p, q, k - 1 / 3);
      }

      return util.removeAllSpace(`rgba(${Math.ceil(r * 255)},${Math.ceil(g * 255)},${Math.ceil(b * 255)},${a})`);
    }
    /**
     * rgba to hsla
     * 换算公式:https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4#%E4%BB%8EHSL%E5%88%B0RGB%E7%9A%84%E8%BD%AC%E6%8D%A2
     * @param {*} rgba 
     */

    function colorRgbaToHsla(rgba) {
      const rgbaArr = rgba.slice(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(',');
      let a = rgbaArr.length < 4 ? 1 : Number(rgbaArr[3]);
      let r = parseInt(rgbaArr[0]) / 255,
          g = parseInt(rgbaArr[1]) / 255,
          b = parseInt(rgbaArr[2]) / 255;
      let max = Math.max(r, g, b),
          min = Math.min(r, g, b);
      let h,
          s,
          l = (max + min) / 2;

      if (max === min) {
        h = s = 0;
      } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

        switch (max) {
          case r:
            h = (g - b) / d + (g >= b ? 0 : 6);
            break;

          case g:
            h = (b - r) / d + 2;
            break;

          case b:
            h = (r - g) / d + 4;
            break;
        }
      }

      return {
        colorStr: util.removeAllSpace('hsla(' + Math.ceil(h * 60) + ',' + Math.ceil(s * 100) + '%,' + Math.ceil(l * 100) + '%,' + a + ')'),
        colorObj: {
          h,
          s,
          l,
          a
        }
      };
    }
    /**
     * rgba to hsva
     * @param {*} rgba 
     */

    function colorRgbaToHsva(rgba) {
      const rgbaArr = rgba.slice(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(',');
      let a = rgbaArr.length < 4 ? 1 : Number(rgbaArr[3]);
      let r = parseInt(rgbaArr[0]) / 255,
          g = parseInt(rgbaArr[1]) / 255,
          b = parseInt(rgbaArr[2]) / 255;
      let h, s, v;
      let min = Math.min(r, g, b);
      let max = v = Math.max(r, g, b);
      let diff = max - min;

      if (max === 0) {
        s = 0;
      } else {
        s = 1 - min / max;
      }

      if (max === min) {
        h = 0;
      } else {
        switch (max) {
          case r:
            h = (g - b) / diff + (g < b ? 6 : 0);
            break;

          case g:
            h = 2.0 + (b - r) / diff;
            break;

          case b:
            h = 4.0 + (r - g) / diff;
            break;
        }

        h = h * 60;
      }

      s = s * 100;
      v = v * 100;
      return {
        h,
        s,
        v,
        a
      };
    }
    /* 
    * 任意色值（甚至是CSS颜色关键字）转换为RGBA颜色的方法
    * 此方法IE9+浏览器支持，基于DOM特性实现 
    * @param {*} color 
    */

    function colorToRgba(color) {
      const div = document.createElement('div');
      util.setCss(div, 'background-color', color);
      document.body.appendChild(div);
      const c = util.getCss(div, 'background-color');
      document.body.removeChild(div);
      let isAlpha = c.match(/,/g) && c.match(/,/g).length > 2;
      let result = isAlpha ? c : c.slice(0, 2) + 'ba' + c.slice(3, c.length - 1) + ', 1)';
      return util.removeAllSpace(result);
    }
    /**
     * 判断是否是合格的颜色值
     * @param {*} color 
     */

    function isValidColor(color) {
      // https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value#%E8%89%B2%E5%BD%A9%E5%85%B3%E9%94%AE%E5%AD%97
      let isTransparent = color === 'transparent';
      return colorRegExp.test(color) || colorRegRGB.test(color) || colorRegRGBA.test(color) || colorRegHSL.test(color) || colorRegHSLA.test(color) || colorToRgba(color) !== 'rgba(0,0,0,0)' && !isTransparent || isTransparent;
    }
    /**
     * 
     * @param {*} color 
     * @returns 
     */

    function isAlphaColor(color) {
      return colorRegRGB.test(color) || colorRegRGBA.test(color) || colorRegHSL.test(color) || colorRegHSLA.test(color);
    }

    var color = /*#__PURE__*/Object.freeze({
        __proto__: null,
        colorRegExp: colorRegExp,
        colorRegRGB: colorRegRGB,
        colorRegRGBA: colorRegRGBA,
        colorRegHSL: colorRegHSL,
        colorRegHSLA: colorRegHSLA,
        colorHexToRgba: colorHexToRgba,
        colorRgbaToHex: colorRgbaToHex,
        colorHsvaToRgba: colorHsvaToRgba,
        colorHslaToRgba: colorHslaToRgba,
        colorRgbaToHsla: colorRgbaToHsla,
        colorRgbaToHsva: colorRgbaToHsva,
        colorToRgba: colorToRgba,
        isValidColor: isValidColor,
        isAlphaColor: isAlphaColor
    });

    /**
     * 
     * @param {*} disabled 
     * @returns 
     */

    function setPredefineDisabled(disabled) {
      if (disabled) return ' ew-pre-define-color-disabled';
      return '';
    }
    /**
     * 
     * @param {*} color 
     * @returns 
     */

    function hasAlpha(color) {
      let alpha = color.slice(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',')[3];
      if (isAlphaColor(color) && alpha < 1 && alpha > 0) return ' ew-has-alpha';
      return '';
    }

    let depId = 0;
    function remove(array, item) {
      if (array.length) {
        let idx = array.indexOf(item);

        if (idx > -1) {
          return array.splice(idx, 1);
        }
      }
    }
    class Dep {
      constructor() {
        this.id = depId++;
        this.subs = [];
      }

      addSub(sub) {
        this.subs.push(sub);
      }

      removeSub(sub) {
        remove(this.subs, sub);
      }

      notify() {
        const subs = this.subs.slice();

        for (let i = 0, len = subs.length; i < len; i++) {
          subs[i].update();
        }
      }

      depend() {
        if (Dep.DepTarget) {
          Dep.DepTarget.addDep(this);
        }
      }

    }
    Dep.id = depId;
    Dep.subs = [];
    Dep.DepTarget = null;
    function pushTarget(watcher) {
      Dep.DepTarget = watcher;
    }
    function popTarget() {
      Dep.DepTarget = null;
    }

    const emptyFun = function () {};

    const baseDefaultConfig = {
      hue: true,
      alpha: false,
      size: "normal",
      predefineColor: [],
      disabled: false,
      defaultColor: "",
      pickerAnimation: "height",
      pickerAnimationTime: 200,
      sure: emptyFun,
      clear: emptyFun,
      openOrClosePicker: emptyFun,
      isLog: true,
      changeColor: emptyFun,
      hasBox: true,
      isClickOutside: true,
      hasClear: true,
      hasSure: true,
      hasColorInput: true,
      boxDisabled: false,
      openChangeColorMode: false,
      changeBoxByChangeColor: false,
      hueDirection: "vertical",
      //vertical or horizontal
      alphaDirection: "vertical" //vertical or horizontal

    };

    const consoleInfo = () => console.log(`%c ew-color-picker@1.8.7%c 联系QQ：854806732 %c 联系微信：eveningwater %c github:https://github.com/eveningwater/ew-color-picker %c `, 'background:#0ca6dc ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');

    function filterConfig(config) {
      config.hueDirection = config.hueDirection === 'horizontal' ? config.hueDirection : 'vertical';
      config.alphaDirection = config.alphaDirection === 'horizontal' ? config.alphaDirection : 'vertical';
    }
    /**
     * 初始化配置
     * @param {*} config 
     * @returns 
     */


    function initConfig(config) {
      const defaultConfig = { ...baseDefaultConfig
      };
      let element,
          error,
          mergeConfig = null; //如果第二个参数传的是字符串，或DOM对象，则初始化默认的配置

      if (util.isString(config) || util.isDom(config)) {
        mergeConfig = defaultConfig;
        element = config;
        error = ERROR_VARIABLE.DOM_ERROR;
      } //如果是对象，则自定义配置，自定义配置选项如下:
      else if (util.isDeepObject(config) && (util.isString(config.el) || util.isDom(config.el))) {
          filterConfig(config);
          mergeConfig = util.ewAssign(defaultConfig, config);
          element = config.el;
          error = ERROR_VARIABLE.DOM_OBJECT_ERROR;
        } else {
          element = 'body';

          if (util.isDeepObject(config)) {
            filterConfig(config);
            mergeConfig = util.ewAssign(defaultConfig, config);
            error = ERROR_VARIABLE.DOM_OBJECT_ERROR;
          } else {
            mergeConfig = defaultConfig;
            error = ERROR_VARIABLE.DOM_ERROR;
          }
        }

      if (mergeConfig.isLog) consoleInfo();
      return {
        element,
        config: mergeConfig,
        error
      };
    }

    let initError = null;
    /**
     *  开始初始化
     * @param {*} context 
     * @param {*} config 
     * @returns 
     */

    function startInit(context, config) {
      let initOptions = initConfig(config);
      if (!initOptions) return;
      context.config = initOptions.config;
      initError = initOptions.error;
      context._privateConfig = {
        boxSize: {
          b_width: null,
          b_height: null
        },
        pickerFlag: false,
        colorValue: ""
      };
      context.beforeInit(initOptions.element, initOptions.config, initError);
    }

    class RenderWatcher {
      constructor(vm) {
        this._colorPickerInstance = vm;
        this._watcher_id = vm._color_picker_uid;
        this.depIds = new Set();
        this.dep = null;
        vm._watcher = this;
        this.get();
      }

      get() {
        pushTarget(this);
      }

      update() {
        popTarget(); // 每次更新时清空依赖

        this.cleanDeps();
        let vm = this._colorPickerInstance;
        let config = vm.config;
        vm.beforeInit(vm.$Dom.rootElement, vm.config, initError);
      }

      cleanDeps() {
        if (this.dep) {
          this.dep.subs = [];
          this.dep = null;
          this.depIds = new Set();
        }
      }

      addDep(dep) {
        const id = dep.id;

        if (!this.depIds.has(id)) {
          this.depIds.add(id);
          dep.addSub(this);
          this.dep = dep;
        }
      }

    }

    function defineReactive(target) {
      const dep = new Dep();

      const notify = () => {
        if (Dep.DepTarget) {
          dep.notify();
        }
      };

      let proxy = new Proxy(target, {
        get(target, key, receiver) {
          let val = Reflect.get(target, key, receiver);

          if (Dep.DepTarget) {
            dep.depend();
          }

          return val;
        },

        set(target, key, receiver) {
          let val = Reflect.set(target, key, receiver);
          notify();
          return val;
        },

        has(target, key) {
          if (key in target && !(key in Object.prototype)) {
            return Reflect.has(target, key);
          } else {
            return false;
          }
        },

        deleteProperty(target, key) {
          if (this.has(target, key)) {
            let val = Reflect.deleteProperty(target, key);
            notify();
            return val;
          }
        }

      });
      return proxy;
    }

    function def(obj, key, value, enumerable) {
      Object.defineProperty(obj, key, {
        enumerable: !!enumerable,
        value: value,
        writable: true,
        configurable: true
      });
    }

    class Observer {
      constructor(value) {
        this.value = value;
        this.reactive = null;
        this.dep = new Dep(); // 为了区分于vue,添加独特的标志属性

        def(value, '__ew__color__picker__ob__', this);
        this.walk(value);
      }

      walk(value) {
        this.reactive = defineReactive(value);
      }

    }

    /**
     * 重新渲染颜色选择器
     * @param {*} color 
     * @param {*} pickerFlag 
     * @param {*} el 
     * @param {*} scope 
     */

    function onRenderColorPicker(color, pickerFlag, el, scope) {
      scope.config.defaultColor = scope._privateConfig.colorValue = color;
      scope._privateConfig.pickerFlag = pickerFlag;
      scope.render(el, scope.config);
    }
    /**
     * 渲染
     * @param {*} element 
     * @param {*} config 
     * @returns 
     */

    function staticRender(element, config) {
      let predefineColorHTML = '',
          alphaBar = '',
          hueBar = '',
          predefineHTML = '',
          boxDisabledClassName = '',
          boxBackground = '',
          boxHTML = '',
          clearHTML = '',
          sureHTML = '',
          inputHTML = '',
          btnGroupHTML = '',
          dropHTML = '',
          openChangeColorModeHTML = '',
          openChangeColorModeLabelHTML = '',
          horizontalSliderHTML = '',
          verticalSliderHTML = '';
      const p_c = config.predefineColor;
      if (!util.isDeepArray(p_c)) return util.ewError(ERROR_VARIABLE.PREDEFINE_COLOR_ERROR);

      if (p_c.length) {
        p_c.map((color, index) => {
          let isValidColorString = util.isString(color) && isValidColor(color);
          let isValidColorObj = util.isDeepObject(color) && color.hasOwnProperty('color') && isValidColor(color.color);
          let renderColor = isValidColorString ? color : isValidColorObj ? color.color : '';
          let renderDisabled = isValidColorObj ? setPredefineDisabled(color.disabled) : '';
          predefineColorHTML += `
            <div class="ew-pre-define-color${hasAlpha(renderColor)}${renderDisabled}" tabindex=${index}>
                <div class="ew-pre-define-color-item" style="background-color:${renderColor};"></div>
            </div>`;
        });
      }

      const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow" style="width:${this._privateConfig.boxSize.b_width};height:${this._privateConfig.boxSize.b_height};">
        <div class="ew-color-picker-arrow-left"></div>
        <div class="ew-color-picker-arrow-right"></div>
    </div>` : `<div class="ew-color-picker-no" style="width:${this._privateConfig.boxSize.b_width};height:${this._privateConfig.boxSize.b_height};line-height:${this._privateConfig.boxSize.b_height};">&times;</div>`; //透明度

      if (config.alpha) {
        alphaBar = `<div class="ew-alpha-slider-bar">
            <div class="ew-alpha-slider-wrapper"></div>
            <div class="ew-alpha-slider-bg"></div>
            <div class="ew-alpha-slider-thumb"></div>
        </div>`;
      } // hue


      if (config.hue) {
        hueBar = `<div class="ew-color-slider-bar"><div class="ew-color-slider-thumb"></div></div>`;
      }

      if (predefineColorHTML) {
        predefineHTML = `<div class="ew-pre-define-color-container">${predefineColorHTML}</div>`;
      }

      if (config.disabled || config.boxDisabled) boxDisabledClassName = 'ew-color-picker-box-disabled';

      if (config.defaultColor) {
        if (!isValidColor(config.defaultColor)) {
          return util.ewError(ERROR_VARIABLE.DEFAULT_COLOR_ERROR);
        } else {
          config.defaultColor = colorToRgba(config.defaultColor);
        }
      }
      this._privateConfig.colorValue = config.defaultColor;
      if (!config.disabled && this._privateConfig.colorValue) boxBackground = `background:${this._privateConfig.colorValue}`; // 盒子样式

      const boxStyle = `width:${this._privateConfig.boxSize.b_width};height:${this._privateConfig.boxSize.b_height};${boxBackground}`;

      if (config.hasBox) {
        boxHTML = `<div class="ew-color-picker-box ${boxDisabledClassName}" tabIndex="0" style="${boxStyle}">${colorBox}</div>`;
      }

      if (config.hasClear) {
        clearHTML = '<button class="ew-color-clear ew-color-drop-btn">清空</button>';
      }

      if (config.hasSure) {
        sureHTML = `<button class="ew-color-sure ew-color-drop-btn">确定</button>`;
      }

      if (config.hasClear || config.hasSure) {
        btnGroupHTML = `<div class="ew-color-drop-btn-group">${clearHTML}${sureHTML}</div>`;
      }

      if (config.hasColorInput) {
        inputHTML = '<input type="text" class="ew-color-input">';
      }

      if (config.openChangeColorMode) {
        if (!config.alpha || !config.hue) return util.ewError(ERROR_VARIABLE.COLOR_MODE_ERROR);
        openChangeColorModeHTML = `<div class="ew-color-mode-container">
        <div class="ew-color-mode-up"></div>
        <div class="ew-color-mode-down"></div>
        </div>`;
        openChangeColorModeLabelHTML = `<label class="ew-color-mode-title">${this.colorMode[1]}</label>`;
      }

      if (config.hasColorInput || config.hasClear || config.hasSure) {
        dropHTML = config.openChangeColorMode ? `<div class="ew-color-drop-container ew-has-mode-container">
        ${openChangeColorModeLabelHTML}${inputHTML}${openChangeColorModeHTML}
        </div><div class="ew-color-drop-container">
        ${btnGroupHTML}
        </div>` : `<div class="ew-color-drop-container">
        ${inputHTML}${btnGroupHTML}
        </div>`;
      }

      this.isAlphaHorizontal = config.alphaDirection === 'horizontal';
      this.isHueHorizontal = config.hueDirection === 'horizontal';

      if (this.isAlphaHorizontal && this.isHueHorizontal) {
        horizontalSliderHTML = hueBar + alphaBar;
      } else if (!this.isAlphaHorizontal && !this.isHueHorizontal) {
        verticalSliderHTML = alphaBar + hueBar;
      } else {
        if (this.isHueHorizontal) {
          horizontalSliderHTML = hueBar;
          verticalSliderHTML = alphaBar;
        } else {
          horizontalSliderHTML = alphaBar;
          verticalSliderHTML = hueBar;
        }
      }

      if (horizontalSliderHTML) {
        horizontalSliderHTML = `<div class="ew-color-slider ew-is-horizontal">${horizontalSliderHTML}</div>`;
      }

      if (verticalSliderHTML) {
        verticalSliderHTML = `<div class="ew-color-slider ew-is-vertical">${verticalSliderHTML}</div>`;
      } //颜色选择器


      const html = `${boxHTML}
        <div class="ew-color-picker">
            <div class="ew-color-picker-content">
                ${verticalSliderHTML}
                <div class="ew-color-panel" style="background:red;">
                    <div class="ew-color-white-panel"></div>
                    <div class="ew-color-black-panel"></div>
                    <div class="ew-color-cursor"></div>
                </div>
            </div>
            ${horizontalSliderHTML}
            ${dropHTML}
            ${predefineHTML}
        </div>`;
      let isBody = element.tagName.toLowerCase() === 'body';
      let container = document.createElement('div');
      let mountElement = isBody ? container.cloneNode(true) : element;
      let mountProp = isBody ? 'id' : 'color-picker-id';
      let mountValue = isBody ? 'placeElement-' + this._color_picker_uid : this._color_picker_uid;
      mountElement.setAttribute(mountProp, mountValue);

      if (isBody) {
        let hasDiv = util.$('#placeElement-' + this._color_picker_uid);
        if (hasDiv) hasDiv.parentElement.removeChild(hasDiv);
        mountElement.innerHTML = html;
        util.addClass(container, 'ew-color-picker-container');
        container.appendChild(mountElement);
        element.appendChild(container);
      } else {
        element.innerHTML = `<div class="ew-color-picker-container">${html}</div>`;
      }

      this._watcher = new RenderWatcher(this); // 如果config上有__ob__属性，则表明是一个响应式对象

      if (!('__ew__color__picker__ob__' in this.config)) {
        this.config = new Observer(config).reactive;
      }

      this.startMain(mountElement, config);
    }

    /**
     * 转换颜色模式
     * @param {*} context 
     * @param {*} color 
     * @returns 
     */

    function changeMode(context, color) {
      let result = null;

      switch (context.currentMode) {
        case "hex":
          result = colorRgbaToHex(color);
          break;

        case "rgba":
          result = colorToRgba(color);
          break;

        case "hsla":
          result = colorRgbaToHsla(color).colorStr;
          break;

        default:
          result = color;
          break;
      }

      context.$Dom.modeTitle.innerHTML = context.currentMode;
      return result;
    }
    /**
    * 切换颜色模式
    * @param {*} context 
    * @param {*} index 
    */

    function onHandleChangeMode(context, handleType, callback) {
      let l = context.colorMode.length;

      if (handleType === 'up') {
        context.modeCount += 1;
      } else {
        context.modeCount -= 1;
      }

      if (context.modeCount > l - 1) context.modeCount = 0;
      if (context.modeCount < 0) context.modeCount = l - 1;
      context.currentMode = context.colorMode[context.modeCount];
      callback();
    }

    /**
     * 改变透明度
     * @param {*} scope 
     */

    function changeAlphaBar(scope) {
      if (!scope.$Dom.alphaBarBg) return;
      let position = scope.isAlphaHorizontal ? 'to right' : 'to top';
      util.setCss(scope.$Dom.alphaBarBg, 'background', 'linear-gradient(' + position + ',' + colorHsvaToRgba(scope.hsvaColor, 0) + ' 0%,' + colorHsvaToRgba(scope.hsvaColor, 1) + ' 100%)');
    }

    function setBoxBackground(box, color) {
      return util.setCss(box, 'background', color);
    }

    /**
     * 改变元素的颜色
     * @param {*} scope 
     * @param {*} isAlpha 
     */

    function changeElementColor(scope, isAlpha) {
      const color = colorHsvaToRgba(scope.hsvaColor);
      let newColor = isAlpha || scope.config.alpha ? color : colorRgbaToHex(color);

      if (scope.config.openChangeColorMode) {
        newColor = changeMode(scope, color);
      }

      if (scope.config.hasColorInput) {
        scope.$Dom.pickerInput.value = newColor;
        scope.prevInputValue = newColor;
      }

      changeAlphaBar(scope);

      if (scope.config.hasBox && scope.config.changeBoxByChangeColor && scope.boxChange) {
        setBoxBackground(scope.$Dom.box, newColor);
      }

      if (util.isFunction(scope.config.changeColor)) scope.config.changeColor(newColor);
    }

    /**
    * 克隆颜色对象
    * @param {*} color 
    */

    function cloneColor(color) {
      const newColor = util.deepCloneObjByRecursion(color);
      newColor.s = newColor.v = 100;
      return newColor;
    }

    /**
     * 设置颜色
     * @param {*} context 
     * @param {*} panelWidth 
     * @param {*} panelHeight 
     */

    function setColorValue(context, panelWidth, panelHeight, boxChange) {
      context.boxChange = boxChange;
      changeElementColor(context);
      if (context.config.hasColorInput) context.prevInputValue = context.$Dom.pickerInput.value;
      let l = parseInt(context.hsvaColor.s * panelWidth / 100),
          t = parseInt(panelHeight - context.hsvaColor.v * panelHeight / 100);
      [{
        el: context.$Dom.pickerCursor,
        prop: 'left',
        value: l + 4 + 'px'
      }, {
        el: context.$Dom.pickerCursor,
        prop: 'top',
        value: t + 4 + 'px'
      }, {
        el: context.$Dom.pickerPanel,
        prop: 'background',
        value: colorRgbaToHex(colorHsvaToRgba(cloneColor(context.hsvaColor)))
      }].forEach(item => util.setCss(item.el, item.prop, item.value));

      if (context.config.hue) {
        getSliderBarPosition(context.isHueHorizontal, context.$Dom.hueBar, (position, prop) => {
          util.setCss(context.$Dom.hueThumb, prop, parseInt(context.hsvaColor.h * position / 360) + 'px');
        });
      }

      if (context.config.alpha) {
        getSliderBarPosition(context.isAlphaHorizontal, context.$Dom.alphaBar, (position, prop) => {
          util.setCss(context.$Dom.alphaBarThumb, prop, position - context.hsvaColor.a * position + 'px');
        });
      }
    }
    /**
     * 设置样式
     * @param {*} direction 
     * @param {*} bar 
     * @param {*} thumb 
     * @param {*} value 
     */

    function getSliderBarPosition(direction, bar, callback) {
      let sliderPosition = direction ? bar.offsetWidth : bar.offsetHeight;
      let sliderProp = direction ? 'left' : 'top';
      callback(sliderPosition, sliderProp);
    }

    /**
     * 开启颜色选择器
     * @param {*} expression 
     * @param {*} picker 
     */

    function open(expression, picker, time = 200) {
      return animation[expression ? 'slideDown' : 'fadeIn'](picker, time);
    }
    /**
     * 关闭颜色选择器
     * @param {*} expression 
     * @param {*} picker 
     */

    function close(expression, picker, time = 200) {
      return animation[expression ? 'slideUp' : 'fadeOut'](picker, time);
    }
    /**
     * 获取动画类型
     * @param {*} scope 
     */

    function getHeiAni(scope) {
      return util.isString(scope.config.pickerAnimation) && scope.config.pickerAnimation.indexOf('height') > -1;
    }
    /**
     * 打开和关闭
     * @param {*} scope 
     */

    function openAndClose(scope) {
      const time = scope.config.pickerAnimationTime;
      scope._privateConfig.pickerFlag ? open(getHeiAni(scope), scope.$Dom.picker, time) : close(getHeiAni(scope), scope.$Dom.picker, time);
    }
    /**
     * 手动关闭颜色选择器
     * @param {*} ani 
     */

    function handleClosePicker(ani, time) {
      if (ani) {
        this.config.pickerAnimation = ani;
      }

      if (time) {
        this.config.pickerAnimationTime = time;
      }

      if (this._privateConfig.pickerFlag) {
        this._privateConfig.pickerFlag = false;
        close(getHeiAni(this), this.$Dom.picker, this.config.pickerAnimationTime);
      }
    }
    /**
     * 手动打开颜色选择器
     * @param {*} ani 
     */

    function handleOpenPicker(ani, time) {
      if (ani) {
        this.config.pickerAnimation = ani;
      }

      if (time) {
        this.config.pickerAnimationTime = time;
      }

      if (!this._privateConfig.pickerFlag) {
        this._privateConfig.pickerFlag = true;

        const funOpen = () => open(getHeiAni(this), this.$Dom.picker, this.config.pickerAnimationTime);

        const funRender = () => onRenderColorPicker(this.config.defaultColor, this._privateConfig.pickerFlag, this.$Dom.rootElement, this);

        if (this.config.hasBox) {
          funRender();
          funOpen();
        } else {
          funOpen();
          funRender();
        }

        setColorValue(this, this.panelWidth, this.panelHeight, false);
      }
    }
    /**
     * 打开面板
     * @param {*} el 
     * @param {*} scope 
     */

    function handlePicker(el, scope) {
      scope._privateConfig.pickerFlag = !scope._privateConfig.pickerFlag;
      onRenderColorPicker(scope.config.defaultColor, scope._privateConfig.pickerFlag, el, scope);
      setColorValue(scope, scope.panelWidth, scope.panelHeight, false);
      openAndClose(scope);
      if (util.isFunction(scope.config.openOrClosePicker)) scope.config.openOrClosePicker(el, scope);
    }

    /**
     * 绑定事件
     * @param {*} el 
     * @param {*} callback 
     * @param {*} bool 
     */

    function bindEvent(el, callback, bool) {
      const context = this;

      const callResult = event => {
        context.moveX = util.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientX : event.clientX;
        context.moveY = util.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientY : event.clientY;
        bool ? callback(context, context.moveX, context.moveY) : callback(context, el, context.moveX, context.moveY);
      };

      const handler = () => {
        const moveFn = e => {
          e.preventDefault();
          callResult(e);
        };

        const upFn = () => {
          util.off(document, util.eventType[1], moveFn);
          util.off(document, util.eventType[2], upFn);
        };

        util.on(document, util.eventType[1], moveFn);
        util.on(document, util.eventType[2], upFn);
      };

      util.on(el, util.eventType[0], handler);
    }

    const createColorPicker = function (config) {
      const Super = this;

      const Sub = function () {
        startInit(this, config);
      };

      Sub.prototype = Object.create(Super.prototype);
      Sub.prototype.constructor = Sub;
      Sub['Super'] = Super;
      return new Sub();
    };

    const getDefaultConfig = function () {
      return baseDefaultConfig;
    };

    const util$1 = Object.create(null);
    [color, util, {
      bindEvent: bindEvent
    }].forEach(module => {
      Object.keys(module).forEach(key => {
        if (util.isFunction(module[key]) && key !== 'clickOutSide') {
          util$1[key] = module[key];
        }
      });
    });
    var globalAPI = {
      createColorPicker,
      getDefaultConfig,
      util: util$1
    };

    const isNotDom = ele => {
      if (NOT_DOM_ELEMENTS.indexOf(ele.tagName.toLowerCase()) > -1) {
        util.ewError(ERROR_VARIABLE.DOM_NOT_ERROR);
        return true;
      }

      return false;
    };
    /**
     * 
     * @param {*} element 
     * @param {*} config 
     * @param {*} errorText 
     * @returns 
     */


    function beforeInit(element, config, errorText) {
      config = util.ewAssign(baseDefaultConfig, config);
      errorText = errorText || initError;
      let ele = util.isDom(element) ? element : util.isString(element) ? util.$(element) : null;
      if (!ele) return util.ewError(errorText);
      ele = ele.length ? ele[0] : ele;
      if (!ele.tagName) return util.ewError(errorText);

      if (!isNotDom(ele)) {
        this._color_picker_uid = util.createUUID();

        if (config.openChangeColorMode) {
          this.colorMode = ["hex", "rgba", "hsla"];
        }

        this.init(ele, config);
      }
    }

    /**
     * 手动更新颜色
     * @param {*} color 
     * @returns 
     */

    function updateColor(color) {
      if (!isValidColor(color)) return util.ewError(ERROR_VARIABLE.UPDATE_PARAM_COLOR_ERROR);
      if (!this._privateConfig.pickerFlag) util.ewWarn(ERROR_VARIABLE.UPDATE_PARAM_COLOR_WARN);
      let rgbaColor = colorToRgba(color);
      this.hsvaColor = colorRgbaToHsva(rgbaColor);
      setColorValue(this, this.panelWidth, this.panelHeight, true);
    }

    /**
     * 初始化
     * @param {*} bindElement 
     * @param {*} config 
     * @returns 
     */

    function initFunction(bindElement, config) {
      if (!util.isDom(bindElement)) {
        return this.beforeInit(bindElement, config, ERROR_VARIABLE.DOM_ERROR);
      }

      config = util.ewAssign(baseDefaultConfig, config);
      let b_width, b_height; //自定义颜色选择器的类型

      if (util.isString(config.size)) {
        switch (config.size) {
          case 'normal':
            b_width = b_height = '40px';
            break;

          case 'medium':
            b_width = b_height = '36px';
            break;

          case 'small':
            b_width = b_height = '32px';
            break;

          case 'mini':
            b_width = b_height = '28px';
            break;

          default:
            b_width = b_height = '40px';
            break;
        }
      } else if (util.isDeepObject(config.size)) {
        b_width = config.size.width && (util.isNumber(config.size.width) || util.isString(config.size.width)) ? parseInt(config.size.width) + 'px' : '40px';
        b_height = config.size.height && (util.isNumber(config.size.height) || util.isString(config.size.height)) ? parseInt(config.size.height) + 'px' : '40px';
      } else {
        return util.ewError(ERROR_VARIABLE.CONFIG_SIZE_ERROR);
      }

      this._privateConfig.boxSize.b_width = b_width;
      this._privateConfig.boxSize.b_height = b_height; //渲染选择器

      this.render(bindElement, config);
    }

    /**
     * 点击目标元素之外关闭颜色选择器
     * @param {*} context 
     * @param {*} config 
     */

    function handleClickOutSide(context, config) {
      util.clickOutSide(context, config, () => {
        if (context._privateConfig.pickerFlag) {
          context._privateConfig.pickerFlag = false;
          close(getHeiAni({
            config: config
          }), context.$Dom.picker, config.pickerAnimationTime);

          if (config.hasBox && config.changeBoxByChangeColor) {
            setBoxBackground(context.$Dom.box, config.defaultColor);
          }
        }
      });
    }

    /**
     * 获取元素的子元素
     * @param {*} el 
     * @param {*} prop 
     * @param {*} bool 
     */
    function getELByClass(el, prop, bool) {
      return !bool ? el.querySelector('.' + prop) : el.querySelectorAll('.' + prop);
    }

    /**
     * 
     * @param {*} direction 
     * @param {*} bar 
     * @param {*} thumb 
     * @param {*} position 
     */

    function setAlphaHuePosition(direction, bar, thumb, position) {
      const positionProp = direction ? 'x' : 'y';
      const barProp = direction ? 'left' : 'top';
      const barPosition = direction ? bar.offsetWidth : bar.offsetHeight,
            barRect = util.getRect(bar);
      const barThumbPosition = Math.max(0, Math.min(position - barRect[positionProp], barPosition));
      util.setCss(thumb, barProp, barThumbPosition + 'px');
      return {
        barPosition,
        barThumbPosition
      };
    }
    /**
    * 改变透明度
    * @param {*} context 
    * @param {*} position
    */


    function changeAlpha(context, position) {
      let value = setAlphaHuePosition(context.isAlphaHorizontal, context.$Dom.alphaBar, context.$Dom.alphaBarThumb, position);
      let currentValue = value.barPosition - value.barThumbPosition <= 0 ? 0 : value.barPosition - value.barThumbPosition;
      let alpha = context.isAlphaHorizontal ? 1 - currentValue / value.barPosition : currentValue / value.barPosition;
      context.hsvaColor.a = alpha >= 1 ? 1 : alpha.toFixed(2);
      changeElementColor(context, true);
    }
    /**
     * 改变色调
     * @param {*} context 
     * @param {*} position
     */

    function changeHue(context, position) {
      let value = setAlphaHuePosition(context.isHueHorizontal, context.$Dom.hueBar, context.$Dom.hueThumb, position);
      context.hsvaColor.h = cloneColor(context.hsvaColor).h = parseInt(360 * value.barThumbPosition / value.barPosition);
      util.setCss(context.$Dom.pickerPanel, 'background', colorRgbaToHex(colorHsvaToRgba(cloneColor(context.hsvaColor))));
      changeElementColor(context);
    }

    /**
     * 拖拽
     * @param {*} scope 
     * @param {*} left 
     * @param {*} top 
     * @param {*} panelWidth 
     * @param {*} panelHeight 
     */

    function changeCursorColor(scope, left, top, panelWidth, panelHeight) {
      util.setSomeCss(scope.$Dom.pickerCursor, [{
        prop: 'left',
        value: left + 'px'
      }, {
        prop: 'top',
        value: top + 'px'
      }]);
      const s = parseInt(100 * (left - 4) / panelWidth);
      const v = parseInt(100 * (panelHeight - (top - 4)) / panelHeight); //需要减去本身的宽高来做判断

      scope.hsvaColor.s = s > 100 ? 100 : s < 0 ? 0 : s;
      scope.hsvaColor.v = v > 100 ? 100 : v < 0 ? 0 : v;
      scope.boxChange = true;
      changeElementColor(scope);
    }
    /**
     * 点击面板改变
     * @param {*} scope 
     * @param {*} eve 
     */

    function onClickPanel(scope, eve) {
      if (eve.target !== scope.$Dom.pickerCursor) {
        //临界值处理
        const moveX = eve.layerX;
        const moveY = eve.layerY;
        const panelWidth = scope.$Dom.pickerPanel.offsetWidth;
        const panelHeight = scope.$Dom.pickerPanel.offsetHeight;
        const left = moveX >= panelWidth - 1 ? panelWidth : moveX <= 0 ? 0 : moveX;
        const top = moveY >= panelHeight - 2 ? panelHeight : moveY <= 0 ? 0 : moveY;
        changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight);
      }
    }

    /**
     * 输入颜色的转换
     * @param {*} scope 
     * @param {*} value 
     */

    function onInputColor(scope, value) {
      if (!isValidColor(value)) return; // 两者相等，说明用户没有更改颜色

      if (util.removeAllSpace(scope.prevInputValue) === util.removeAllSpace(value)) return;
      let color = null;

      if (scope.config.openChangeColorMode) {
        switch (scope.currentMode) {
          case "hex":
            color = colorRgbaToHsva(colorHexToRgba(value));
            break;

          case "rgba":
            color = colorRgbaToHsva(value);
            break;

          case "hsla":
            // 需要先转换成rgba,再转换成hsv模式
            let hslaArr = value.slice(value.indexOf('(') + 1, value.lastIndexOf(')')).split(',');
            color = colorRgbaToHsva(colorHslaToRgba({
              h: Number(hslaArr[0]),
              s: Number(hslaArr[1].replace(/%/g, "")),
              l: Number(hslaArr[2].replace(/%/g, "")),
              a: Number(hslaArr[3]) | 1
            }));
            break;
        }
      } else {
        color = scope.config.alpha ? colorRgbaToHsva(value) : colorRgbaToHsva(colorHexToRgba(value));
      }

      scope.hsvaColor = color;
      setColorValue(scope, scope.panelWidth, scope.panelHeight, true);
    }

    /**
     * 清空
     * @param {*} el 
     * @param {*} scope 
     */

    function onClearColor(el, scope) {
      onRenderColorPicker('', false, el, scope);
      openAndClose(scope);
      scope.config.clear(scope.config.defaultColor, scope);
    }
    /**
     * 确定
     * @param {*} scope 
     */

    function onSureColor(el, scope) {
      const result = scope.config.alpha ? colorHsvaToRgba(scope.hsvaColor) : colorRgbaToHex(colorHsvaToRgba(scope.hsvaColor));
      onRenderColorPicker(result, false, el, scope);
      openAndClose(scope);
      changeElementColor(scope);
      scope.config.sure(result, scope);
    }

    function showColorPickerWithNoBox(context) {
      setTimeout(() => {
        const ani = getHeiAni(context);
        context._privateConfig.pickerFlag = true;

        if (util.getCss(context.$Dom.picker, 'display') === 'none') {
          open(ani, context.$Dom.picker, context.config.pickerAnimationTime);
        }

        setColorValue(context, context.panelWidth, context.panelHeight, false);
      }, 0);
    }

    /**
     *  
     * @param {*} context 
     */

    function initAnimation(context) {
      //颜色选择器打开的动画初始设置
      const expression = getHeiAni(context);
      util.setCss(context.$Dom.picker, expression ? 'display' : 'opacity', expression ? 'none' : 0);
      let pickerWidth = 0,
          sliderWidth = 0,
          sliderHeight = 0;
      let isVerticalAlpha = !context.isAlphaHorizontal;
      let isVerticalHue = !context.isHueHorizontal;
      let isHue = context.config.hue;
      let isAlpha = context.config.alpha;

      if (isAlpha && isHue && isVerticalAlpha && isVerticalHue) {
        pickerWidth = 320;
        sliderWidth = 28;
      } else if (isVerticalAlpha && isAlpha && (!isVerticalHue || !isHue) || isVerticalHue && isHue && (!isVerticalAlpha || !isAlpha)) {
        pickerWidth = 300;
        sliderWidth = sliderHeight = 14;
      } else {
        pickerWidth = 280;
        sliderHeight = isAlpha && isHue && !isVerticalHue && !isVerticalAlpha ? 30 : 14;
      }

      util.setCss(context.$Dom.picker, 'min-width', pickerWidth + 'px');

      if (context.$Dom.horizontalSlider) {
        util.setCss(context.$Dom.horizontalSlider, 'height', sliderHeight + 'px');
      }

      if (context.$Dom.verticalSlider) {
        util.setCss(context.$Dom.verticalSlider, 'width', sliderWidth + 'px');
      }
    }
    /**
     * 
     * @param {*} items 
     * @param {*} context 
     */


    function initPreDefineHandler(items, context) {
      // get the siblings
      const siblings = el => Array.prototype.filter.call(el.parentElement.children, child => child !== el);

      items.map(item => {
        const clickHandler = event => {
          util.addClass(item, 'ew-pre-define-color-active');
          siblings(item).forEach(sibling => util.removeClass(sibling, 'ew-pre-define-color-active'));
          const bgColor = util.getCss(event.target, 'background-color');
          context.hsvaColor = colorRgbaToHsva(bgColor);
          setColorValue(context, context.panelWidth, context.panelHeight, true);
          changeElementColor(context);
        };

        const blurHandler = event => util.removeClass(event.target, 'ew-pre-define-color-active');

        [{
          type: "click",
          handler: clickHandler
        }, {
          type: "blur",
          handler: blurHandler
        }].forEach(t => {
          if (!context.config.disabled && util.ewObjToArray(item.classList).indexOf('ew-pre-define-color-disabled') === -1) {
            util.on(item, t.type, t.handler);
          }
        });
      });
    }
    /**
     * 主要功能
     * @param {*} ele 
     * @param {*} config 
     * @returns 
     */


    function startMain(ele, config) {
      let scope = this;
      this.$Dom = Object.create(null);
      this.$Dom.rootElement = ele;
      this.$Dom.pickerPanel = getELByClass(ele, 'ew-color-panel');
      this.$Dom.pickerCursor = getELByClass(ele, 'ew-color-cursor');
      this.$Dom.picker = getELByClass(ele, 'ew-color-picker');

      if (this.isHueHorizontal || this.isAlphaHorizontal) {
        this.$Dom.horizontalSlider = getELByClass(ele, 'ew-is-horizontal');
      }

      if (!this.isHueHorizontal || !this.isAlphaHorizontal) {
        this.$Dom.verticalSlider = getELByClass(ele, 'ew-is-vertical');
      }

      if (config.defaultColor) {
        this.hsvaColor = colorRegRGBA.test(config.defaultColor) ? colorRgbaToHsva(config.defaultColor) : colorRgbaToHsva(colorToRgba(config.defaultColor));
      } else {
        this.hsvaColor = {
          h: 0,
          s: 100,
          v: 100,
          a: 1
        };
      }

      const panelWidth = this.panelWidth = parseInt(util.getCss(this.$Dom.pickerPanel, 'width'));
      const panelHeight = this.panelHeight = parseInt(util.getCss(this.$Dom.pickerPanel, 'height')); //计算偏差

      let elem = ele,
          top = elem.offsetTop,
          left = elem.offsetLeft;

      while (elem.offsetParent) {
        top += elem.offsetParent.offsetTop;
        left += elem.offsetParent.offsetLeft;
        elem = elem.offsetParent;
      }

      this.panelLeft = left;
      this.panelTop = top + ele.offsetHeight;
      this.$Dom.preDefineItem = getELByClass(ele, 'ew-pre-define-color', true);

      if (this.$Dom.preDefineItem.length) {
        initPreDefineHandler(util.ewObjToArray(this.$Dom.preDefineItem), scope);
      }

      if (config.hue) {
        this.$Dom.hueBar = getELByClass(ele, 'ew-color-slider-bar');
        this.$Dom.hueThumb = getELByClass(ele, 'ew-color-slider-thumb');

        if (!config.disabled) {
          //hue的点击事件
          util.on(this.$Dom.hueBar, 'click', event => changeHue(scope, this.isHueHorizontal ? event.x : event.y)); //hue 轨道的拖拽事件

          this.bindEvent(this.$Dom.hueThumb, (scope, el, x, y) => changeHue(scope, this.isHueHorizontal ? x : y));
        }
      }

      if (config.alpha) {
        this.$Dom.alphaBar = getELByClass(ele, 'ew-alpha-slider-bar');
        this.$Dom.alphaBarBg = getELByClass(ele, 'ew-alpha-slider-bg');
        this.$Dom.alphaBarThumb = getELByClass(ele, 'ew-alpha-slider-thumb');

        if (!config.disabled) {
          this.bindEvent(this.$Dom.alphaBarThumb, (scope, el, x, y) => changeAlpha(scope, this.isAlphaHorizontal ? x : y));
          util.on(this.$Dom.alphaBar, 'click', event => changeAlpha(scope, this.isAlphaHorizontal ? event.x : event.y));
        }
      }

      initAnimation(scope); //获取颜色选择器的一些操作元素

      if (config.hasBox) {
        this.$Dom.box = getELByClass(ele, 'ew-color-picker-box');
        if (!config.boxDisabled && !config.disabled) util.on(this.$Dom.box, 'click', () => handlePicker(ele, scope));
      } else {
        showColorPickerWithNoBox(this);
      }

      if (config.hasColorInput) {
        this.$Dom.pickerInput = getELByClass(ele, 'ew-color-input');
        util.on(this.$Dom.pickerInput, 'blur', event => onInputColor(scope, event.target.value));
      }

      if (config.disabled) {
        if (config.hasColorInput) {
          if (!util.hasClass(this.$Dom.pickerInput, 'ew-input-disabled')) {
            this.$Dom.pickerInput.classList.add('ew-input-disabled');
            this.$Dom.pickerInput.disabled = true;
          }
        }

        if (!util.hasClass(this.$Dom.picker, 'ew-color-picker-disabled')) {
          this.$Dom.picker.classList.add('ew-color-picker-disabled');
        }

        return false;
      }

      if (config.isClickOutside) {
        handleClickOutSide(this, config);
      }

      if (config.hasClear) {
        this.$Dom.pickerClear = getELByClass(ele, 'ew-color-clear');
        util.on(this.$Dom.pickerClear, 'click', () => onClearColor(ele, scope));
      }

      if (config.hasSure) {
        this.$Dom.pickerSure = getELByClass(ele, 'ew-color-sure');
        util.on(this.$Dom.pickerSure, 'click', () => onSureColor(ele, scope));
      }

      if (config.openChangeColorMode) {
        this.$Dom.modeUp = getELByClass(ele, 'ew-color-mode-up');
        this.$Dom.modeDown = getELByClass(ele, 'ew-color-mode-down');
        this.$Dom.modeTitle = getELByClass(ele, "ew-color-mode-title");

        if (config.hasColorInput) {
          this.modeCount = config.alpha ? 1 : 0;
          this.currentMode = this.colorMode[this.modeCount];
          util.on(this.$Dom.modeUp, "click", event => onHandleChangeMode(scope, 'up', () => changeElementColor(scope)));
          util.on(this.$Dom.modeDown, "click", event => onHandleChangeMode(scope, 'down', () => changeElementColor(scope)));
        }
      } //颜色面板点击事件


      util.on(this.$Dom.pickerPanel, 'click', event => onClickPanel(scope, event)); //颜色面板拖拽元素拖拽事件

      this.bindEvent(this.$Dom.pickerCursor, (scope, el, x, y) => {
        const left = Math.max(0, Math.min(x - scope.panelLeft, panelWidth));
        const top = Math.max(0, Math.min(y - scope.panelTop, panelHeight));
        changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight);
      });
    }

    /**
     * 构造函数
     * @param {*} config 
     */

    function ewColorPicker(config) {
      if (util.isUndefined(new.target)) return util.ewError(ERROR_VARIABLE.CONSTRUCTOR_ERROR);
      startInit(this, config);
    }

    const methods$1 = [{
      name: "beforeInit",
      func: beforeInit
    }, {
      name: "init",
      func: initFunction
    }, {
      name: "render",
      func: staticRender
    }, {
      name: "startMain",
      func: startMain
    }, {
      name: "bindEvent",
      func: bindEvent
    }, {
      name: "updateColor",
      func: updateColor
    }, {
      name: "openPicker",
      func: handleOpenPicker
    }, {
      name: "closePicker",
      func: handleClosePicker
    }];
    methods$1.forEach(method => util.addMethod(ewColorPicker, method.name, method.func)); // 全局API注册

    Object.keys(globalAPI).forEach(key => {
      ewColorPicker[key] = globalAPI[key];
    });

    return ewColorPicker;

})));
