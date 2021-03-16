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

    util['setCss'] = (el, prop, value) => el.style[prop] = value;

    util.setSomeCss = (el, propValue = []) => {
      if (propValue.length) {
        propValue.forEach(p => util.setCss(el, p.prop, p.value));
      }
    };

    util.isDom = el => util.isShallowObject(HTMLElement) ? el instanceof HTMLElement : el && util.isShallowObject(el) && el.nodeType === 1 && util.isString(el.nodeName) || el instanceof HTMLCollection || el instanceof NodeList;

    util.ewError = value => console.error('[ewColorPicker warn]\n' + new Error(value));

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

    util.$ = ident => document[ident && ident.indexOf('#') > -1 ? 'querySelector' : 'querySelectorAll'](ident);

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

    util["clickOutSide"] = (el, callback) => {
      const nodes = [];

      const findNode = node => {
        const children = node.children;
        if (!children) return;
        const childrenArr = util.ewObjToArray(children);
        childrenArr.forEach(item => nodes.push(item));
        childrenArr.forEach(item => findNode(item));
      };

      findNode(el);

      const mouseHandler = event => {
        const target = event.target;
        if (nodes.some(item => item.className === target.className)) return;
        callback(nodes, mouseHandler);
      };

      util.on(document, 'mousedown', mouseHandler);
    };

    util["unBindMouseDown"] = (nodes, mouseHandler) => {
      if (!util.isDeepArray(nodes)) return;
      const nodeLen = nodes.length;

      if (nodeLen > 0) {
        for (let i = 0; i < nodeLen; i++) {
          nodes.splice(i, 1);
        }
      }

      util.off(document, 'mousedown', mouseHandler);
    }; //the event


    util.eventType = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];

    /**
     * hex to rgba
     * @param {*} hex 
     * @param {*} alpha 
     */
    function colorHexToRgba(hex, alpha) {
      let a = alpha || 1,
          colorRegExp = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/,
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

        return "rgba(" + rgbaColor.join(",") + ',' + a + ")";
      } else {
        return hColor;
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
        values.map(function (value, index) {
          if (index <= 2) {
            color += hexColor(value);
          }
        });
        return value + color;
      }
    }
    /**
     * hsb to rgba
     * @param {*} hsb 
     * @param {*} alpha 
     */

    function colorHsbToRgba(hsb, alpha) {
      let r,
          g,
          b,
          a = hsb.a; //rgba(r,g,b,a)

      let h = Math.round(hsb.h),
          s = Math.round(hsb.s * 255 / 100),
          v = Math.round(hsb.b * 255 / 100); //hsv(h,s,v)

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
      return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ',' + a + ')';
    }
    /**
     * rgba to hsb
     * @param {*} rgba 
     */

    function colorRgbaToHsb(rgba) {
      const rgbaArr = rgba.slice(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(',');
      let a = rgbaArr.length < 4 ? 1 : Number(rgbaArr[3]);
      let r = Number(rgbaArr[0]) / 255,
          g = Number(rgbaArr[1]) / 255,
          b = Number(rgbaArr[2]) / 255;
      let h, s, v;
      let min = Math.min(r, g, b);
      let max = v = Math.max(r, g, b);
      let diff = max - min;

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

        h = Math.round(h * 60);
      }

      if (max === 0) {
        s = 0;
      } else {
        s = 1 - min / max;
      }

      s = Math.round(s * 100);
      v = Math.round(v * 100);
      return {
        h: h,
        s: s,
        b: v,
        a: a
      };
    }
    /* 
    * 任意色值（甚至是CSS颜色关键字）转换为RGBA颜色的方法
    * 此方法IE9+浏览器支持，基于DOM特性实现 
    * @param {*} color 
    */

    function colorToRgba(color) {
      const div = document.createElement('div');
      div.style.backgroundColor = color;
      document.body.appendChild(div);
      const c = window.getComputedStyle(div).backgroundColor;
      document.body.removeChild(div);
      return c.slice(0, 2) + 'ba' + c.slice(3, c.length - 1) + ', 1)';
    }
    /**
     * 判断是否是合格的颜色值
     * @param {*} color 
     */

    function isValidColor(color) {
      let type = '';

      if (/^rgb\(/.test(color)) {
        //如果是rgb开头，200-249，250-255，0-199
        type = "^[rR][gG][Bb][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){2}[\\s]*(2[0-4]\\d|25[0-5]|[01]?\\d\\d?)[\\s]*[\)]{1}$";
      } else if (/^rgba\(/.test(color)) {
        //如果是rgba开头，判断0-255:200-249，250-255，0-199 判断0-1：0 1 1.0 0.0-0.9
        type = "^[rR][gG][Bb][Aa][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){3}[\\s]*(1|1.0|0|0.[0-9]{2})[\\s]*[\)]{1}$";
      } else if (/^#/.test(color)) {
        //六位或者三位
        type = "^#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})$";
      } else if (/^hsl\(/.test(color)) {
        //判断0-360 判断0-100%(0可以没有百分号)
        type = "^[hH][Ss][Ll][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*)[\)]$";
      } else if (/^hsla\(/.test(color)) {
        type = "^[hH][Ss][Ll][Aa][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,){2}([\\s]*(1|1.0|0|0.[0-9])[\\s]*)[\)]$";
      }

      return !!color.match(new RegExp(type));
    }

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
      let overflow = '';

      if (type.indexOf('slide') > -1) {
        transition = "height" + time + ' ms';
        overflow = 'hidden';
        upAndDown();
      } else {
        transition = "opacity" + time + ' ms';
        overflow = '';
        inAndOut();
      }

      if (overflow) util.setCss(element, 'overflow', overflow);
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

    const consoleInfo = () => console.log(`%c ew-color-picker@1.6.4%c 联系QQ：854806732 %c 联系微信：eveningwater %c github:https://github.com/eveningwater/ew-color-picker %c `, 'background:#0ca6dc ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');

    const NOT_DOM_ELEMENTS = ['html', 'head', 'body', 'meta', 'title', 'link', 'style', 'script'];
    const ERROR_VARIABLE = {
      PICKER_OBJECT_CONFIG_ERROR: 'you should pass a param which is el and el must be a string or a dom element!',
      PICKER_CONFIG_ERROR: 'you should pass a param that it must be a string or a dom element!',
      DOM_OBJECT_ERROR: 'can not find the element by el property,make sure to pass a correct value!',
      DOM_ERROR: 'can not find the element,make sure to pass a correct param!',
      CONFIG_SIZE_ERROR: 'the value must be a string which is one of the normal,medium,small,mini,or must be an object and need to contain width or height property!',
      DOM_NOT_ERROR: 'Do not pass these elements: ' + NOT_DOM_ELEMENTS.join(',') + ' as a param,pass the correct element such as div!',
      PREDEFINE_COLOR_ERROR: 'PredefineColor is a array that is need to contain color value!',
      CONSTRUCTOR_ERROR: 'ewColorPicker is a constructor and should be called with the new keyword!',
      DEFAULT_COLOR_ERROR: 'the "defaultColor" is not a invalid color,make sure to use the correct color!'
    };

    /**
     * 构造函数
     * @param {*} config 
     */

    function ewColorPicker(config) {
      if (util.isUndefined(new.target)) return util.ewError(ERROR_VARIABLE.CONSTRUCTOR_ERROR); // 一个空函数

      const emptyFun = function () {};

      const defaultConfig = {
        hue: true,
        alpha: false,
        size: "normal",
        predefineColor: [],
        disabled: false,
        defaultColor: "",
        openPickerAni: "height",
        sure: emptyFun,
        clear: emptyFun,
        openPicker: emptyFun,
        isLog: true,
        boxSize: {
          b_width: null,
          b_height: null
        },
        pickerFlag: false,
        colorValue: ""
      }; //如果第二个参数传的是字符串，或DOM对象，则初始化默认的配置

      if (util.isString(config) || util.isDom(config)) {
        this.config = defaultConfig;
        this.beforeInit(config, this.config, ERROR_VARIABLE.DOM_ERROR);
      } //如果是对象，则自定义配置，自定义配置选项如下:
      else if (util.isDeepObject(config) && (util.isString(config.el) || util.isDom(config.el))) {
          this.config = util.ewAssign(defaultConfig, config);
          this.beforeInit(config.el, this.config, ERROR_VARIABLE.DOM_OBJECT_ERROR);
        } else {
          const errorText = util.isDeepObject(config) ? ERROR_VARIABLE.PICKER_OBJECT_CONFIG_ERROR : ERROR_VARIABLE.PICKER_CONFIG_ERROR;
          return util.ewError(errorText);
        }
    }

    const methods$1 = [{
      name: "beforeInit",
      func: function (element, config, errorText) {
        // 不能是哪些标签元素
        const isNotDom = ele => {
          if (NOT_DOM_ELEMENTS.indexOf(ele.tagName.toLowerCase()) > -1) {
            util.ewError(ERROR_VARIABLE.DOM_NOT_ERROR);
            return true;
          }

          return false;
        };

        const ele = util.isDom(element) ? element : util.isString(element) ? util.$(element) : null;
        if (!ele) return util.ewError(errorText);

        if (ele.length) {
          util.ewObjToArray(ele).forEach(item => {
            if (!isNotDom(item)) new ewColorPicker(util.ewAssign(config, {
              el: item
            }));
          });
        } else {
          if (!ele.tagName) return util.ewError(errorText);
          if (!isNotDom(ele)) this.init(ele, config);
        }
      }
    }, {
      name: "init",
      func: function (bindElement, config) {
        if (config.isLog) consoleInfo();
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
          b_width = config.size.width && util.isNumber(config.size.width) ? parseInt(config.size.width) + 'px' : '40px';
          b_height = config.size.height && util.isNumber(config.size.height) ? parseInt(config.size.height) + 'px' : '40px';
        } else {
          return util.ewError(ERROR_VARIABLE.CONFIG_SIZE_ERROR);
        }

        config.boxSize.b_width = b_width;
        config.boxSize.b_height = b_height; //渲染选择器

        this.render(bindElement, config);
      }
    }, {
      name: "render",
      func: function (element, config) {
        let predefineColorHTML = '',
            alphaBar = '',
            hueBar = '',
            predefineHTML = '',
            boxDisabledClassName = '',
            boxBackground = '';
        const p_c = config.predefineColor;
        if (!util.isDeepArray(p_c)) return util.ewError(ERROR_VARIABLE.PREDEFINE_COLOR_ERROR);
        if (p_c.length) p_c.map(color => {
          if (isValidColor(color)) predefineColorHTML += `<div class="ew-pre-define-color" style="background:${color};"></div>`;
        }); //打开颜色选择器的方框

        const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow" style="width:${this.config.boxSize.b_width};height:${this.config.boxSize.b_height};">
                <div class="ew-color-picker-arrow-left"></div>
                <div class="ew-color-picker-arrow-right"></div>
            </div>` : `<div class="ew-color-picker-no" style="width:${this.config.boxSize.b_width};height:${this.config.boxSize.b_height};line-height:${this.config.boxSize.b_height};">&times;</div>`; //透明度

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

        if (config.disabled) boxDisabledClassName = 'ew-color-picker-box-disabled';
        if (config.defaultColor && !isValidColor(config.defaultColor)) return util.ewError(ERROR_VARIABLE.DEFAULT_COLOR_ERROR);
        config.colorValue = config.defaultColor;
        if (!config.disabled && config.colorValue) boxBackground = `background:${config.colorValue}`; // 盒子样式

        const boxStyle = `width:${config.boxSize.b_width};height:${config.boxSize.b_height};${boxBackground}`; //颜色选择器

        const html = `
                <div class="ew-color-picker-box ${boxDisabledClassName}" tabIndex="0" style="${boxStyle}">${colorBox}</div>
                <div class="ew-color-picker">
                    <div class="ew-color-picker-content">
                        <div class="ew-color-slider">${alphaBar}${hueBar}</div>
                        <div class="ew-color-panel" style="background:red;">
                            <div class="ew-color-white-panel"></div>
                            <div class="ew-color-black-panel"></div>
                            <div class="ew-color-cursor"></div>
                        </div>
                    </div>
                    <div class="ew-color-drop-container">
                        <input type="text" class="ew-color-input">
                        <div class="ew-color-drop-btn-group">
                            <button class="ew-color-clear ew-color-drop-btn">清空</button>
                            <button class="ew-color-sure ew-color-drop-btn">确定</button>
                        </div>
                    </div>
                    ${predefineHTML}
                </div>`;
        element.innerHTML = html;
        this.startMain(element, config);
      }
    }, {
      name: "startMain",
      func: function (ele, config) {
        let scope = this; //获取颜色选择器的一些操作元素

        this.box = getELByClass(ele, 'ew-color-picker-box');
        this.arrowRight = getELByClass(ele, 'ew-color-picker-arrow-right');
        this.pickerPanel = getELByClass(ele, 'ew-color-panel');
        this.pickerCursor = getELByClass(ele, 'ew-color-cursor');
        this.pickerInput = getELByClass(ele, 'ew-color-input');
        this.pickerClear = getELByClass(ele, 'ew-color-clear');
        this.pickerSure = getELByClass(ele, 'ew-color-sure');
        this.hueBar = getELByClass(ele, 'ew-color-slider-bar');
        this.hueThumb = getELByClass(ele, 'ew-color-slider-thumb');
        this.picker = getELByClass(ele, 'ew-color-picker');
        this.slider = getELByClass(ele, 'ew-color-slider');
        this.hsbColor = config.defaultColor ? colorRgbaToHsb(colorToRgba(config.defaultColor)) : {
          h: 0,
          s: 100,
          b: 100,
          a: 1
        };
        const panelWidth = this.panelWidth = parseInt(util.getCss(this.pickerPanel, 'width'));
        const panelHeight = this.panelHeight = parseInt(util.getCss(this.pickerPanel, 'height')); //计算偏差

        let elem = ele,
            top = elem.offsetTop,
            left = elem.offsetLeft;

        while (elem.offsetParent) {
          top += elem.offsetParent.offsetTop;
          left += elem.offsetParent.offsetLeft;
          elem = elem.offsetParent;
        }

        this.panelLeft = left;
        this.panelTop = top + ele.offsetHeight; //预定义颜色

        this.preDefineItem = getELByClass(ele, 'ew-pre-define-color', true);

        if (this.preDefineItem.length) {
          const items = util.ewObjToArray(this.preDefineItem); //点击预定义颜色

          items.map(item => {
            const clickHandler = event => {
              items.forEach(child => util.removeClass(child, 'ew-pre-define-color-active'));
              util.addClass(event.target, 'ew-pre-define-color-active');
              const bgColor = util.getCss(event.target, 'background-color');
              scope.hsbColor = colorRgbaToHsb(bgColor);
              setDefaultValue(scope, panelWidth, panelHeight);
              changeAlphaBar(scope);
              changeElementColor(scope); // fix the value bug

              const setColor = colorRgbaToHex(bgColor);
              scope.pickerInput.value = scope.config.alpha ? colorToRgba(setColor) : setColor;
            };

            const blurHandler = event => util.removeClass(event.target, 'ew-pre-define-color-active');

            [{
              type: "click",
              handler: clickHandler
            }, {
              type: "blur",
              handler: blurHandler
            }].forEach(t => util.on(item, t.type, t.handler));
          });
        } //颜色选择器打开的动画初始设置


        this.picker.style[getHeiAni(scope) ? 'display' : 'opacity'] = getHeiAni(scope) ? 'none' : 0;
        const sliderWidth = !config.alpha && !config.hue ? 0 : !config.alpha || !config.hue ? 14 : 27;
        const pickerWidth = !config.alpha && !config.hue ? 280 : !config.alpha || !config.hue ? 300 : 320;
        this.slider.style.width = sliderWidth + 'px';
        this.picker.style.minWidth = pickerWidth + 'px';

        if (config.alpha) {
          this.alphaBar = getELByClass(ele, 'ew-alpha-slider-bar');
          this.alphaBarBg = getELByClass(ele, 'ew-alpha-slider-bg');
          this.alphaBarThumb = getELByClass(ele, 'ew-alpha-slider-thumb');
          changeAlphaBar(this);
          this.bindEvent(this.alphaBarThumb, (scope, el, x, y) => changeAlpha(scope, y));
          util.on(this.alphaBar, 'click', event => changeAlpha(scope, event.y));
        } //输入框输入事件


        util.on(this.pickerInput, 'blur', event => onInputColor(scope, event.target.value)); //清空按钮事件

        util.on(this.pickerClear, 'click', () => onClearColor(ele, scope)); //确认按钮事件

        util.on(this.pickerSure, 'click', () => onSureColor(ele, scope)); //是否禁止打开选择器面板，未禁止则点击可打开

        if (!config.disabled) util.on(this.box, 'click', () => openPicker(ele, scope)); // 点击目标区域外关闭颜色选择器面板

        util.clickOutSide(ele, (nodes, mouseHandler) => {
          if (scope.config.pickerFlag) {
            close(getHeiAni(scope), scope.picker);
            scope.config.pickerFlag = false;
            util.unBindMouseDown(nodes, mouseHandler);
          }
        }); //颜色面板点击事件

        util.on(this.pickerPanel, 'click', event => onClickPanel(scope, event)); //颜色面板拖拽元素拖拽事件

        this.bindEvent(this.pickerCursor, (scope, el, x, y) => {
          const left = Math.max(0, Math.min(x - scope.panelLeft, panelWidth));
          const top = Math.max(0, Math.min(y - scope.panelTop, panelHeight));
          changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight);
        });

        if (config.hue) {
          //hue的点击事件
          util.on(this.hueBar, 'click', event => changeHue(scope, event.y)); //hue 轨道的拖拽事件

          this.bindEvent(this.hueThumb, (scope, el, x, y) => changeHue(scope, y));
        }
      }
    }, {
      name: "bindEvent",
      func: function (el, callback, bool) {
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
    }];
    methods$1.forEach(method => util.addMethod(ewColorPicker, method.name, method.func));
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
    * 克隆颜色对象
    * @param {*} color 
    */


    function cloneColor(color) {
      const newColor = util.deepCloneObjByRecursion(color);
      newColor.s = newColor.b = 100;
      return newColor;
    }
    /**
     * 打开面板
     * @param {*} el 
     * @param {*} scope 
     */


    function openPicker(el, scope) {
      scope.config.pickerFlag = !scope.config.pickerFlag;
      onRenderColorPicker(scope.config.defaultColor, scope.config.pickerFlag, el, scope);
      setDefaultValue(scope, scope.panelWidth, scope.panelHeight);
      openAndClose(scope);
      if (util.isFunction(scope.config.openPicker)) scope.config.openPicker(el, scope);
    }
    /**
     * 开启颜色选择器
     * @param {*} expression 
     * @param {*} picker 
     */


    function open(expression, picker) {
      return animation[expression ? 'slideDown' : 'fadeIn'](picker, 200);
    }
    /**
     * 关闭颜色选择器
     * @param {*} expression 
     * @param {*} picker 
     */


    function close(expression, picker) {
      return animation[expression ? 'slideUp' : 'fadeOut'](picker, 200);
    }
    /**
     * 获取动画类型
     * @param {*} scope 
     */


    function getHeiAni(scope) {
      return util.isString(scope.config.openPickerAni) && scope.config.openPickerAni.indexOf('height') > -1;
    }
    /**
     * 打开和关闭
     * @param {*} scope 
     */


    function openAndClose(scope) {
      scope.config.pickerFlag ? open(getHeiAni(scope), scope.picker) : close(getHeiAni(scope), scope.picker);
    }
    /**
     * 输入颜色的转换
     * @param {*} scope 
     * @param {*} value 
     */


    function onInputColor(scope, value) {
      if (!isValidColor(value)) return;
      const color = value.indexOf('#') > -1 ? colorRgbaToHsb(colorHexToRgba(value)) : colorRgbaToHsb(value);
      scope.hsbColor = color;
      setDefaultValue(scope, scope.panelWidth, scope.panelHeight);
      changeElementColor(scope);
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
      const result = scope.config.alpha ? colorHsbToRgba(scope.hsbColor) : colorRgbaToHex(colorHsbToRgba(scope.hsbColor));
      onRenderColorPicker(result, false, el, scope);
      openAndClose(scope);
      changeElementColor(scope);
      scope.config.sure(result, scope);
    }
    /**
     * 重置颜色选择器
     * @param {*} color 
     * @param {*} pickerFlag 
     * @param {*} el 
     * @param {*} scope 
     */


    function onRenderColorPicker(color, pickerFlag, el, scope) {
      scope.config.defaultColor = scope.config.colorValue = color;
      scope.config.pickerFlag = pickerFlag;
      scope.render(el, scope.config);
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
      util.setSomeCss(scope.pickerCursor, [{
        prop: 'left',
        value: left + 'px'
      }, {
        prop: 'top',
        value: top + 'px'
      }]);
      const s = parseInt(100 * (left - 4) / panelWidth);
      const b = parseInt(100 * (panelHeight - (top - 4)) / panelHeight); //需要减去本身的宽高来做判断

      scope.hsbColor.s = s > 100 ? 100 : s < 0 ? 0 : s;
      scope.hsbColor.b = b > 100 ? 100 : b < 0 ? 0 : b;
      changeElementColor(scope);
    }
    /**
     * 改变元素的颜色
     * @param {*} scope 
     * @param {*} isAlpha 
     */


    function changeElementColor(scope, isAlpha) {
      const color = colorHsbToRgba(scope.hsbColor);
      scope.pickerInput.value = isAlpha || scope.config.alpha ? color : colorRgbaToHex(color);
    }
    /**
     * 点击面板改变
     * @param {*} scope 
     * @param {*} eve 
     */


    function onClickPanel(scope, eve) {
      if (eve.target !== scope.pickerCursor) {
        //临界值处理
        const moveX = eve.layerX;
        const moveY = eve.layerY;
        const panelWidth = scope.pickerPanel.offsetWidth;
        const panelHeight = scope.pickerPanel.offsetHeight;
        const left = moveX >= panelWidth - 1 ? panelWidth : moveX <= 0 ? 0 : moveX;
        const top = moveY >= panelHeight - 2 ? panelHeight : moveY <= 0 ? 0 : moveY;
        changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight);
      }
    }
    /**
     * 改变透明度
     * @param {*} scope 
     */


    function changeAlphaBar(scope) {
      if (!scope.alphaBarBg) return;
      util.setCss(scope.alphaBarBg, 'background', 'linear-gradient(to top,' + colorHsbToRgba(cloneColor(scope.hsbColor), 0) + ' 0%,' + colorHsbToRgba(cloneColor(scope.hsbColor)) + ' 100%)');
    }
    /**
     * 设置默认颜色
     * @param {*} context 
     * @param {*} panelWidth 
     * @param {*} panelHeight 
     */


    function setDefaultValue(context, panelWidth, panelHeight) {
      context.pickerInput.value = context.config.alpha ? colorHsbToRgba(context.hsbColor) : colorRgbaToHex(colorHsbToRgba(context.hsbColor));
      let sliderBarHeight = 0;
      let l = parseInt(context.hsbColor.s * panelWidth / 100),
          t = parseInt(panelHeight - context.hsbColor.b * panelHeight / 100);
      [{
        el: context.pickerCursor,
        prop: 'left',
        value: l + 4 + 'px'
      }, {
        el: context.pickerCursor,
        prop: 'top',
        value: t + 4 + 'px'
      }, {
        el: context.pickerPanel,
        prop: 'background',
        value: colorRgbaToHex(colorHsbToRgba(cloneColor(context.hsbColor)))
      }].forEach(item => util.setCss(item.el, item.prop, item.value));

      if (context.config.hue) {
        sliderBarHeight = context.hueBar.offsetHeight || 180;
        util.setCss(context.hueThumb, 'top', parseInt(context.hsbColor.h * sliderBarHeight / 360) + 'px');
      }

      if (context.config.alpha) {
        sliderBarHeight = context.alphaBar.offsetHeight || 180;
        util.setCss(context.alphaBarThumb, 'top', sliderBarHeight - context.hsbColor.a * sliderBarHeight + 'px');
      }
    }
    /**
     * 改变色调
     * @param {*} context 
     * @param {*} y 
     */


    function changeHue(context, y) {
      const sliderBarHeight = context.hueBar.offsetHeight,
            sliderBarRect = context.hueBar.getBoundingClientRect();
      const sliderThumbY = Math.max(0, Math.min(y - sliderBarRect.y, sliderBarHeight));
      util.setCss(context.hueThumb, 'top', sliderThumbY + 'px');
      context.hsbColor.h = cloneColor(context.hsbColor).h = parseInt(360 * sliderThumbY / sliderBarHeight);
      util.setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsbToRgba(cloneColor(context.hsbColor))));
      changeElementColor(context);
      changeAlphaBar(context);
    }
    /**
     * 改变透明度
     * @param {*} context 
     * @param {*} y 
     */


    function changeAlpha(context, y) {
      const alphaBarHeight = context.alphaBar.offsetHeight,
            alphaBarRect = context.alphaBar.getBoundingClientRect();
      const alphaThumbY = Math.max(0, Math.min(y - alphaBarRect.y, alphaBarHeight));
      util.setCss(context.alphaBarThumb, 'top', alphaThumbY + 'px');
      const alpha = (alphaBarHeight - alphaThumbY <= 0 ? 0 : alphaBarHeight - alphaThumbY) / alphaBarHeight;
      context.hsbColor.a = alpha >= 1 ? 1 : alpha.toFixed(2);
      changeElementColor(context, true);
    }

    return ewColorPicker;

})));
