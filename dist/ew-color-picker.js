(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global['ew-color-picker'] = factory());
}(this, (function () { 'use strict';

    let addMethod = (instance, method, func) => {
      instance.prototype[method] = func;
      return instance;
    };
    const util = Object.create(null);
    const _toString = Object.prototype.toString;
    ['Number', 'String', 'Function', 'Undefined'].forEach(type => util['is' + type] = value => typeof value === type.toLowerCase());
    util.addMethod = addMethod;
    ['Object', 'Array', 'RegExp'].forEach(type => util['isDeep' + type] = value => _toString.call(value).slice(8, -1).toLowerCase() === type.toLowerCase());

    util.isShallowObject = value => typeof value === 'object' && !util.isNull(value);

    util['ewObjToArray'] = value => util.isShallowObject(value) ? Array.prototype.slice.call(value) : value;

    util.isNull = value => value === null;

    util.ewAssign = (target, args) => {
      if (util.isNull(target)) return;

      if (Object.assign) {
        return Object.assign(target, args);
      } else {
        var _ = Object(target);

        for (var j = 1, len = arguments.length; j < len; j += 1) {
          var source = arguments[j];

          if (source) {
            for (var key in source) {
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

    util.isDom = el => util.isShallowObject(HTMLElement) ? el instanceof HTMLElement : el && util.isShallowObject(el) && el.nodeType === 1 && util.isString(el.nodeName) || el instanceof HTMLCollection || el instanceof NodeList;

    util.ewError = value => console.error('[ewColorPicker warn]\n' + new Error(value));

    util.deepCloneObjByJSON = obj => JSON.parse(JSON.stringify(obj));

    util.deepCloneObjByRecursion = function f(obj) {
      if (!util.isShallowObject(obj)) return;
      let cloneObj = util.isDeepArray(obj) ? [] : {};

      for (var k in obj) {
        cloneObj[k] = util.isShallowObject(obj[k]) ? f(obj[k]) : obj[k];
      }

      return cloneObj;
    };

    util.getCss = (el, prop) => {
      var getStyle = el.currentStyle ? function (prop) {
        var propName = el.currentStyle[prop];

        if (propName.indexOf('height') > -1 && propName.search(/px/i) > -1) {
          var rect = el.getBoundingClientRect;
          return rect.bottom - rect.top - parseInt(getStyle('padding-bottom')) - parseInt(getStyle('padding-top')) + 'px';
        }
      } : function (prop) {
        return window.getComputedStyle(el, null)[prop];
      };
      return getStyle(prop);
    };

    util.$ = ident => document.querySelector(ident); //the event


    util.eventType = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];

    /**
     * hex to rgba
     * @param {*} hex 
     * @param {*} alpha 
     */
    /**
     * rgba to hex
     * @param {*} rgba 
     */

    function colorRgbaToHex(rgba) {
      var hexObject = {
        10: 'A',
        11: 'B',
        12: 'C',
        13: 'D',
        14: 'E',
        15: 'F'
      },
          hexColor = function (value) {
        value = Math.min(Math.round(value), 255);
        var high = Math.floor(value / 16),
            low = value % 16;
        return '' + (hexObject[high] || high) + (hexObject[low] || low);
      };

      var value = '#';

      if (/rgba?/.test(rgba)) {
        var values = rgba.replace(/rgba?\(/, '').replace(/\)/, '').replace(/[\s+]/g, '').split(','),
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
      var r,
          g,
          b,
          a = hsb.a; //rgba(r,g,b,a)

      var h = Math.round(hsb.h),
          s = Math.round(hsb.s * 255 / 100),
          v = Math.round(hsb.b * 255 / 100); //hsv(h,s,v)

      if (s === 0) {
        r = g = b = v;
      } else {
        var t = v,
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
      var div = document.createElement('div');
      div.style.backgroundColor = color;
      document.body.appendChild(div);
      var c = window.getComputedStyle(div).backgroundColor;
      document.body.removeChild(div);
      return c.slice(0, 2) + 'ba' + c.slice(3, c.length - 1) + ', 1)';
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
        util.setCss(element, 'display', isIn ? 'none' : 'block');
        util.setCss(element, 'opacity', isIn ? 0 : 1);

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

    const consoleInfo = () => console.log(`%c ew-color-picker@1.5.4%c 联系QQ：854806732 %c 联系微信：eveningwater %c github:https://github.com/eveningwater/ew-color-picker %c `, 'background:#0ca6dc ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');

    function styleInject(css, ref) {
      if ( ref === void 0 ) ref = {};
      var insertAt = ref.insertAt;

      if (!css || typeof document === 'undefined') { return; }

      var head = document.head || document.getElementsByTagName('head')[0];
      var style = document.createElement('style');
      style.type = 'text/css';

      if (insertAt === 'top') {
        if (head.firstChild) {
          head.insertBefore(style, head.firstChild);
        } else {
          head.appendChild(style);
        }
      } else {
        head.appendChild(style);
      }

      if (style.styleSheet) {
        style.styleSheet.cssText = css;
      } else {
        style.appendChild(document.createTextNode(css));
      }
    }

    var css_248z = ".ew-alpha-slider-bg,.ew-alpha-slider-thumb,.ew-alpha-slider-wrapper,.ew-color-black-panel,.ew-color-cursor,.ew-color-drop-btn-group,.ew-color-picker,.ew-color-picker-arrow,.ew-color-picker-no,.ew-color-slider-thumb,.ew-color-white-panel{position:absolute}.ew-alpha-slider-bar,.ew-color-drop-container,.ew-color-panel,.ew-color-picker-arrow-left,.ew-color-picker-arrow-right,.ew-color-picker-box,.ew-color-slider,.ew-color-slider-bar{position:relative}.ew-alpha-slider-thumb,.ew-color-drop-btn,.ew-color-input,.ew-color-slider,.ew-color-slider-thumb{-webkit-box-sizing:border-box;box-sizing:border-box}.ew-alpha-slider-bar,.ew-alpha-slider-thumb,.ew-color-drop-btn,.ew-color-panel,.ew-color-picker-box,.ew-color-slider-bar,.ew-color-slider-thumb,.ew-pre-define-color{cursor:pointer}.ew-color-input,.ew-color-picker,.ew-color-picker-arrow-left,.ew-color-picker-arrow-right,.ew-color-picker-box,.ew-color-sure{background-color:#fff}.ew-color-drop-btn,.ew-color-input,.ew-color-picker-box,.ew-pre-define-color{outline:none}.ew-color-drop-btn,.ew-color-input,.ew-color-picker-arrow-left,.ew-color-picker-arrow-right,.ew-color-picker-box{display:inline-block}.ew-color-picker .ew-color-picker-content:after,.ew-pre-define-color-container:after{content:\"\";display:table;clear:both}.ew-alpha-slider-bar,.ew-color-slider-bar,.ew-pre-define-color{float:left}.ew-color-drop-btn,.ew-color-picker-no{text-align:center}.ew-color-picker{min-width:320px;-webkit-box-sizing:content-box;box-sizing:content-box;border:1px solid #ebeeff;-webkit-box-shadow:0 4px 15px rgba(0,0,0,.2);box-shadow:0 4px 15px rgba(0,0,0,.2);border-radius:5px;z-index:10;padding:7px;display:none;text-align:left}.ew-color-picker-content{margin-bottom:6px}.ew-color-panel{width:280px;height:180px}.ew-alpha-slider-bg,.ew-alpha-slider-wrapper,.ew-color-black-panel,.ew-color-picker-arrow,.ew-color-picker-no,.ew-color-white-panel{left:0;right:0;top:0;bottom:0}.ew-color-white-panel{background:-webkit-gradient(linear,left top,right top,from(#fff),to(hsla(0,0%,100%,0)));background:linear-gradient(90deg,#fff,hsla(0,0%,100%,0))}.ew-color-black-panel{background:-webkit-gradient(linear,left bottom,left top,from(#000),to(transparent));background:linear-gradient(0deg,#000,transparent)}.ew-color-slider{width:27px;height:180px;float:right}.ew-color-slider-bar{background:-webkit-gradient(linear,left top,left bottom,color-stop(0,red),color-stop(17%,#ff0),color-stop(33%,#0f0),color-stop(50%,#0ff),color-stop(67%,#00f),color-stop(83%,#f0f),to(red));background:linear-gradient(180deg,red,#ff0 17%,#0f0 33%,#0ff 50%,#00f 67%,#f0f 83%,red);margin-left:3px}.ew-alpha-slider-bar,.ew-color-slider-bar{width:12px;height:100%}.ew-alpha-slider-wrapper{background:url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==\")}.ew-alpha-slider-thumb,.ew-color-slider-thumb{left:0;top:0;width:12px;height:4px;border-radius:1px;background:#fff;border:1px solid #f0f0f0;-webkit-box-shadow:0 0 2px rgba(0,0,0,.6);box-shadow:0 0 2px rgba(0,0,0,.6)}.ew-color-cursor{left:100%;top:0;cursor:default;width:4px;height:4px;-webkit-transform:translate(-2px,-2px);transform:translate(-2px,-2px);border-radius:50%;-webkit-box-shadow:0 0 0 3px #fff,inset 0 0 2px 2px rgba(0,0,0,.4),0 0 2px 3px rgba(0,0,0,.5);box-shadow:0 0 0 3px #fff,inset 0 0 2px 2px rgba(0,0,0,.4),0 0 2px 3px rgba(0,0,0,.5);-webkit-transform:translate(-6px,-6px);transform:translate(-6px,-6px)}.ew-color-drop-container{margin-top:6px}.ew-color-input{width:160px;height:28px;line-height:28px;border:1px solid #dcdfe6;padding:0 5px;-webkit-transition:border-color .2s cubic-bezier(.175,.885,.32,1.275);transition:border-color .2s cubic-bezier(.175,.885,.32,1.275);border-radius:5px}.ew-color-input:focus{border-color:#239fe6}.ew-color-drop-btn{padding:5px 15px;font-size:12px;border-radius:3px;-webkit-transition:.1s;transition:.1s;font-weight:500;margin:0;white-space:nowrap;color:#606266;border:1px solid #dcdfe6;letter-spacing:1px}.ew-color-drop-btn-group{right:0;top:1px}.ew-color-clear{color:#4096ef;border-color:transparent;background-color:transparent;padding-left:0;padding-right:0}.ew-color-clear:active,.ew-color-clear:hover{color:#66b1ff}.ew-color-sure{margin-left:10px}.ew-color-sure:active,.ew-color-sure:hover{border-color:#4096ef;color:#4096ef}.ew-pre-define-color-container{width:280px;font-size:12px;margin-top:8px}.ew-pre-define-color-container:after{visibility:hidden;height:0}.ew-pre-define-color{margin:0 0 8px 8px;width:20px;height:20px;border-radius:4px;border:1px solid #9b979b}.ew-pre-define-color:nth-child(10n+1){margin-left:0}.ew-pre-define-color:active,.ew-pre-define-color:hover{opacity:.8}.ew-pre-define-color-active{-webkit-box-shadow:0 0 3px 2px #409eff;box-shadow:0 0 3px 2px #409eff}.ew-color-picker-box{border:1px solid #dcdee2;color:#535353;border-radius:4px;padding:4px 7px;line-height:1.5;font-size:14px;-webkit-transition:border-color .2s cubic-bezier(.175,.885,.32,1.275);transition:border-color .2s cubic-bezier(.175,.885,.32,1.275)}.ew-color-picker-box-disabled{background-color:#ebe7e7;cursor:not-allowed}.ew-color-picker-arrow,.ew-color-picker-no{width:20px;height:20px;margin:auto;z-index:3}.ew-color-picker-no{width:40px;height:40px;font-size:20px;line-height:40px;color:#5e535f;border:1px solid #e2dfe2;border-radius:2px}.ew-color-picker-arrow{display:-webkit-box;display:-ms-flexbox;display:flex;-webkit-box-pack:center;-ms-flex-pack:center;justify-content:center;-webkit-box-align:center;-ms-flex-align:center;align-items:center}.ew-color-picker-arrow-left,.ew-color-picker-arrow-right{width:12px;height:1px}.ew-color-picker-arrow-left{-webkit-transform:rotate(45deg);transform:rotate(45deg)}.ew-color-picker-arrow-right{-webkit-transform:rotate(-45deg);transform:rotate(-45deg);right:3px}";
    styleInject(css_248z);

    const NOT_DOM_ELEMENTS = ['html', 'head', 'body', 'meta', 'title', 'link', 'style', 'script'];
    const ERROR_VARIABLE = {
      PICKER_OBJECT_CONFIG_ERROR: 'you should pass a param which is el and el must be a string or a dom element!',
      PICKER_CONFIG_ERROR: 'you should pass a param that it must be a string or a dom element!',
      DOM_OBJECT_ERROR: 'can not find the element by el property,make sure to pass a correct value!',
      DOM_ERROR: 'can not find the element,make sure to pass a correct param!',
      CONFIG_SIZE_ERROR: 'the value must be a string which is one of the normal,medium,small,mini,or must be an object and need to contain width or height property!',
      DOM_NOT_ERROR: 'Do not pass these elements: ' + NOT_DOM_ELEMENTS.join(',') + ' as a param,pass the correct element such as div!',
      PREDEFINE_COLOR_ERROR: 'PredefineColor is a array that is need to contain color value!',
      CONSTRUCTOR_ERROR: 'ewColorPicker is a constructor and should be called with the new keyword'
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
        isLog: true
      }; // 盒子宽高

      this.boxSize = {
        b_width: null,
        b_height: null
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

      this.config.pickerFlag = false;
      return this;
    }

    const methods$1 = [{
      name: "beforeInit",
      func: function (element, config, errorText) {
        if (config.isLog) consoleInfo(); // 不能是哪些标签元素

        const isNotDom = function (ele) {
          if (NOT_DOM_ELEMENTS.indexOf(ele.tagName.toLowerCase()) > -1) {
            util.ewError(ERROR_VARIABLE.DOM_NOT_ERROR);
            return true;
          }

          return false;
        };

        const ele = util.isDom(element) ? element : util.isString(element) ? util.$(element) : null;

        if (ele) {
          if (ele.length) {
            util.ewObjToArray(ele).forEach(item => {
              if (!isNotDom(item)) this.init(item, config);
            });
          } else {
            if (!ele.tagName) return util.ewError(errorText);
            if (!isNotDom(ele)) this.init(ele, config);
          }
        } else {
          return util.ewError(errorText);
        }
      }
    }, {
      name: "init",
      func: function (bindElement, config) {
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

        this.boxSize.b_width = b_width;
        this.boxSize.b_height = b_height; //渲染选择器

        this.render(bindElement, config);
      }
    }, {
      name: "render",
      func: function (element, config) {
        let predefineColorHTML = '',
            alphaBar = '',
            hueBar = '',
            predefineHTML = '',
            boxDisabledClassName = '';
        const p_c = config.predefineColor;
        if (!util.isDeepArray(p_c)) return util.ewError(ERROR_VARIABLE.PREDEFINE_COLOR_ERROR);
        if (p_c.length) p_c.map(color => predefineColorHTML += `<div class="ew-pre-define-color" style="background:${color};"></div>`); //打开颜色选择器的方框

        const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow" style="width:${this.boxSize.b_width};height:${this.boxSize.b_height};">
                <div class="ew-color-picker-arrow-left"></div>
                <div class="ew-color-picker-arrow-right"></div>
            </div>` : `<div class="ew-color-picker-no" style="width:${this.boxSize.b_width};height:${this.boxSize.b_height};line-height:${this.boxSize.b_height};">&times;</div>`; //透明度

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

        if (config.disabled) boxDisabledClassName = 'ew-color-picker-box-disabled'; // 盒子样式

        const boxStyle = `width:${this.boxSize.b_width};height:${this.boxSize.b_height};${config.defaultColor ? 'background:' + config.defaultColor : ''}`; //颜色选择器

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
        this.hsbColor = this.config.defaultColor ? colorRgbaToHsb(colorToRgba(this.config.defaultColor)) : {
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
            item.addEventListener('click', event => {
              items.forEach(child => util.removeClass(child, 'ew-pre-define-color-active'));
              util.addClass(event.target, 'ew-pre-define-color-active');
              scope.hsbColor = colorRgbaToHsb(util.getCss(event.target, 'background-color'));
              setDefaultValue(scope, panelWidth, panelHeight);
              changeAlphaBar(scope);
              changeElementColor(scope); // fix the value bug

              const setColor = colorRgbaToHex(util.getCss(event.target, 'background-color'));
              scope.pickerInput.value = scope.config.alpha ? colorToRgba(setColor) : setColor;
            }, false);
            item.addEventListener('blur', event => util.removeClass(event.target, 'ew-pre-define-color-active'), false);
          });
        } //颜色选择器打开的动画初始设置


        const isHeiAni = config.openPickerAni.indexOf('height') > -1;
        this.picker.style[isHeiAni ? 'display' : 'opacity'] = isHeiAni ? 'none' : 0;
        const sliderWidth = !config.alpha && !config.hue ? 0 : !config.alpha || !config.hue ? 14 : 27;
        const pickerWidth = !config.alpha && !config.hue ? 280 : !config.alpha || !config.hue ? 300 : 320;
        this.slider.style.width = sliderWidth + 'px';
        this.picker.style.minWidth = pickerWidth + 'px';

        if (config.alpha) {
          this.alphaBar = getELByClass(ele, 'ew-alpha-slider-bar');
          this.alphaBarBg = getELByClass(ele, 'ew-alpha-slider-bg');
          this.alphaBarThumb = getELByClass(ele, 'ew-alpha-slider-thumb');
          changeAlphaBar(this);
          this.bindEvent(this.alphaBarThumb, (scope, el, x, y) => changeAlpha(scope, y), false);
          this.alphaBar.addEventListener('click', event => changeAlpha(scope, event.y), false);
        } //输入框输入事件


        this.pickerInput.addEventListener('blur', event => onInputColor(scope, event.target.value), false); //清空按钮事件

        this.pickerClear.addEventListener('click', () => onClearColor(ele, scope), false); //确认按钮事件

        this.pickerSure.addEventListener('click', () => onSureColor(scope)); //是否禁止打开选择器面板，未禁止则点击可打开

        if (!config.disabled) this.box.addEventListener('click', () => openPicker(ele, scope), false); //颜色面板点击事件

        this.pickerPanel.addEventListener('click', event => onClickPanel(scope, event), false); //颜色面板拖拽元素拖拽事件

        this.bindEvent(this.pickerCursor, (scope, el, x, y) => {
          const left = Math.max(0, Math.min(x - scope.panelLeft, panelWidth));
          const top = Math.max(0, Math.min(y - scope.panelTop, panelHeight));
          changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight);
        }, false);

        if (config.hue) {
          //hue的点击事件
          this.hueBar.addEventListener('click', event => changeHue(scope, event.y), false); //hue 轨道的拖拽事件

          this.bindEvent(this.hueThumb, (scope, el, x, y) => changeHue(scope, y), false);
        }
      }
    }, {
      name: "bindEvent",
      func: function (el, callback, bool) {
        const context = this;
        const event_param = {
          capture: false,
          once: false,
          passive: false,
          useCapture: false,
          wantsUntrusted: false
        };

        const callResult = event => {
          context.moveX = util.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientX : event.clientX;
          context.moveY = util.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientY : event.clientY;
          bool ? callback(context, context.moveX, context.moveY) : callback(context, el, context.moveX, context.moveY);
        };

        el.addEventListener(util.eventType[0], () => {
          const moveFn = e => {
            e.preventDefault();
            callResult(e);
          };

          const upFn = () => {
            document.removeEventListener(util.eventType[1], moveFn, event_param);
            document.removeEventListener(util.eventType[2], upFn, event_param);
          };

          document.addEventListener(util.eventType[1], moveFn, event_param);
          document.addEventListener(util.eventType[2], upFn, event_param);
        }, event_param);
      }
    }];
    methods$1.forEach(method => util.addMethod(ewColorPicker, method.name, method.func));
    /**
     * 获取元素的子元素
     * @param {*} el 
     * @param {*} prop 
     * @param {*} isIndex 
     */

    function getELByClass(el, prop, isIndex) {
      return !isIndex ? el.querySelector ? el.querySelector('.' + prop) : el.getElementsByClassName(prop)[0] : el.querySelectorAll ? el.querySelectorAll('.' + prop) : el.getElementsByClassName(prop);
    }
    /**
     * 打开面板
     * @param {*} el 
     * @param {*} scope 
     */


    function openPicker(el, scope) {
      scope.config.pickerFlag = !scope.config.pickerFlag;
      scope.config.defaultColor = scope.config.alpha ? colorHsbToRgba(scope.hsbColor) : colorRgbaToHex(colorHsbToRgba(scope.hsbColor));
      scope.render(el, scope.config);
      setDefaultValue(scope, scope.panelWidth, scope.panelHeight);
      openAndClose(scope);
      if (util.isFunction(scope.config.openPicker)) scope.config.openPicker(el, scope);
    }
    /**
     * 打开和关闭
     * @param {*} scope 
     */


    function openAndClose(scope) {
      const expression = util.isString(scope.config.openPickerAni) && scope.config.openPickerAni.indexOf('height') > -1;

      const open = () => animation[expression ? 'slideDown' : 'fadeIn'](scope.picker, 200);

      const close = () => animation[expression ? 'slideUp' : 'fadeOut'](scope.picker, 200);

      return scope.config.pickerFlag ? open() : close();
    }
    /**
     * 输入颜色的转换
     * @param {*} scope 
     * @param {*} value 
     */


    function onInputColor(scope, value) {
      const color = colorRgbaToHsb(colorToRgba(value));
      if (!color.h && !color.s && !color.h && !color.a) return;
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
      onRenderColorPicker(el, scope);
      openAndClose(scope);
      scope.config.clear(scope.config.defaultColor, scope);
    }
    /**
     * 重新渲染
     * @param {*} scope 
     */


    function onRenderColorPicker(el, scope) {
      scope.config.defaultColor = '';
      scope.config.pickerFlag = !scope.config.pickerFlag;
      scope.render(el, scope.config);
    }
    /**
     * 确定
     * @param {*} scope 
     */


    function onSureColor(scope) {
      scope.config.pickerFlag = false;
      openAndClose(scope);
      changeElementColor(scope);
      const result = scope.config.alpha ? colorHsbToRgba(scope.hsbColor) : colorRgbaToHex(colorHsbToRgba(scope.hsbColor));
      scope.config.sure(result, scope);
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
      util.setCss(scope.pickerCursor, 'left', left + 'px');
      util.setCss(scope.pickerCursor, 'top', top + 'px');
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
      util.setCss(scope.box, 'background', color);
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
     * 克隆颜色对象
     * @param {*} color 
     */


    function cloneColor(color) {
      const newColor = util.deepCloneObjByRecursion(color);
      newColor.s = newColor.b = 100;
      return newColor;
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
      if (context.box) context.box.style.background = context.pickerInput.value;

      if (context.config.hue) {
        sliderBarHeight = context.hueBar.offsetHeight || 180;
        util.setCss(context.hueThumb, 'top', parseInt(context.hsbColor.h * sliderBarHeight / 360) + 'px');
      }

      if (context.config.alpha) {
        if (!context.config.hue) sliderBarHeight = context.alphaBar.offsetHeight || 180;
        util.setCss(context.alphaBarThumb, 'top', sliderBarHeight - context.hsbColor.a * sliderBarHeight + 'px');
      }
    } //改变色调的方法


    function changeHue(context, y) {
      const sliderBarHeight = context.hueBar.offsetHeight,
            sliderBarRect = context.hueBar.getBoundingClientRect();
      const sliderThumbY = Math.max(0, Math.min(y - sliderBarRect.y, sliderBarHeight));
      util.setCss(context.hueThumb, 'top', sliderThumbY + 'px');
      context.hsbColor.h = cloneColor(context.hsbColor).h = parseInt(360 * sliderThumbY / sliderBarHeight);
      util.setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsbToRgba(cloneColor(context.hsbColor))));
      changeElementColor(context);
      changeAlphaBar(context);
    } //改变透明度的方法


    function changeAlpha(context, y) {
      const alphaBarHeight = context.alphaBar.offsetHeight,
            alphaBarRect = context.alphaBar.getBoundingClientRect();
      const alphaThumbY = Math.max(0, Math.min(y - alphaBarRect.y, alphaBarHeight));
      util.setCss(context.alphaBarThumb, 'top', alphaThumbY + 'px');
      const alpha = (alphaBarHeight - alphaThumbY <= 0 ? 0 : alphaBarHeight - alphaThumbY) / alphaBarHeight;
      context.hsbColor.a = alpha >= 1 ? 1 : alpha.toFixed(2);
      changeElementColor(context, true);
    }

    if (!window.ewColorPicker) {
      window.ewColorPicker = ewColorPicker;
    }

    return ewColorPicker;

})));
