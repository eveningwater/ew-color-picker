(function (global, factory) {
   typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
   typeof define === 'function' && define.amd ? define(factory) :
   (global = global || self, global['ew-color-picker'] = factory());
}(this, (function () { 'use strict';

   /*
      * 功能:判断是否是一个数值
      * params@1:字符串
   */
   function isNumber(str) {
     return typeof str === 'number';
   }
   /*
   * 功能:判断是否是一个字符串
   * params@1:字符串
   */

   function isStr(str) {
     return typeof str === 'string';
   }
   /*
   * 功能:判断是否是一个函数
   * params@1:值
   */

   function isFunction(fn) {
     return typeof fn === 'function';
   }
   /*
   * 功能:判断是否是一个对象
   * params@1:对象
   */

   function isShallowObject(obj) {
     return obj !== null && typeof obj === 'object';
   }
   /*
   * 功能:判断是否是一个对象
   * params@1:对象
   */

   function isDeepObject(obj) {
     return Object.prototype.toString.call(obj) === "[object Object]";
   }
   /*
   * 功能:判断是否是一个数组
   * params@1:对象
   */

   function isDeepArray(obj) {
     return Object.prototype.toString.call(obj) === "[object Array]";
   }
   /*
   * 功能:将类数组对象转换成数组
   * params@1:类数组对象
   */

   function ewObjToArray(obj) {
     if (isShallowObject(obj)) return Array.prototype.slice.call(obj);
   }
   /*
   * 功能:判断是否是一个DOM元素
   * params@1:元素
   */

   function isDom(el) {
     return isShallowObject(HTMLElement) ? el instanceof HTMLElement : el && isShallowObject(el) && el.nodeType === 1 && isStr(el.nodeName) || el instanceof HTMLCollection || el instanceof NodeList;
   }
   /*
   * 功能:合并对象
   * params@1:源数据对象
   * params@2~...:多个对象
   */

   function ewAssign(target, args) {
     if (target === null) return;

     if (Object.assign) {
       return Object.assign(target, args);
     } else {
       var _ = Object(target);

       for (var j = 1; j < arguments.length; j++) {
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
   }
   /*
   * 功能:错误函数
   * params@1:字符串
   */

   function ewError(str) {
     return console.error('[ewColorPicker warn]\n' + new Error(str));
   }
   /*
   * 功能:深度克隆对象
   * params@1:对象
   */

   const deepCloneObjByRecursion = function f(obj) {
     if (!isShallowObject(obj)) return;
     let cloneObj = isDeepArray(obj) ? [] : {};

     for (var k in obj) {
       cloneObj[k] = isShallowObject(obj[k]) ? f(obj[k]) : obj[k];
     }

     return cloneObj;
   };
   /*
   * 功能:获取css属性值
   * params@1:元素对象
   * params@2:css属性名
   */

   function getCss(el, prop) {
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
   }
   /*
   * 功能:获取dom元素
   * params@1:元素字符串
   */

   function getDom(ident) {
     var selector,
         sType = ident.slice(0, 1),
         identTxt = ident.slice(1);

     if (/^[#\.]/.test(sType)) {
       if (sType === "#") {
         selector = document.getElementById(identTxt);
       } else if (sType === ".") {
         selector = document.getElementsByClassName(identTxt);
       }
     } else {
       selector = document.getElementsByTagName(ident);
     }

     return selector;
   }

   var eventType = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];
   /*
   * 功能:为元素添加一个类名
   * params@1:元素与类名
   */

   function addClass(el, className) {
     return el.classList.add(className);
   }
   /*
   * 功能:为元素移除一个类名
   * params@1:元素与类名
   */

   function removeClass(el, className) {
     return el.classList.remove(className);
   }

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
    * hsba to rgba
    * @param {*} hsba 
    * @param {*} alpha 
    */

   function colorHsbaToRgba(hsba, alpha) {
     var r,
         g,
         b,
         a = hsba.a; //rgba(r,g,b,a)

     var h = Math.round(hsba.h),
         s = Math.round(hsba.s * 255 / 100),
         v = Math.round(hsba.b * 255 / 100); //hsv(h,s,v)

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
    * rgba to hsba
    * @param {*} rgba 
    */

   function colorRgbaToHsba(rgba) {
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
   * 任意色值（甚至是CSS颜色关键字）转换为RGB颜色的方法
   * 此方法IE9+浏览器支持，基于DOM特性实现 
   * @param {*} color 
   */

   function colorToRgb(color) {
     var div = document.createElement('div');
     div.style.backgroundColor = color;
     document.body.appendChild(div);
     var c = window.getComputedStyle(div).backgroundColor;
     document.body.removeChild(div);
     return c;
   }

   const ani = function () {
     var animation = {};

     function TimerManager() {
       this.timers = [];
       this.args = [];
       this.isTimerRun = false;
     }

     TimerManager.makeTimerManage = function (element) {
       if (!element.TimerManage || element.TimerManage.constructor !== TimerManager) {
         element.TimerManage = new TimerManager();
       }
     };

     TimerManager.prototype.add = function (timer, args) {
       this.timers.push(timer);
       this.args.push(args);
       this.timerRun();
     };

     TimerManager.prototype.timerRun = function () {
       if (!this.isTimerRun) {
         var timer = this.timers.shift(),
             args = this.args.shift();

         if (timer && args) {
           this.isTimerRun = true;
           timer(args[0], args[1]);
         }
       }
     };

     TimerManager.prototype.next = function () {
       this.isTimerRun = false;
       this.timerRun();
     };

     function slideUp(element, time) {
       if (element.offsetHeight > 0) {
         var totalHeight = element.offsetHeight;
         var currentHeight = totalHeight;
         var reduceValue = totalHeight / (time / 10);
         element.style.transition = "height " + time + " ms";
         element.style.overflow = "hidden";
         var timer = setInterval(function () {
           currentHeight -= reduceValue;
           element.style.height = currentHeight + "px";

           if (currentHeight <= 0) {
             clearInterval(timer);
             element.style.display = "none";
             element.style.height = totalHeight + "px";

             if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
               element.TimerManage.next();
             }
           }
         }, 10);
       } else {
         if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
           element.TimerManage.next();
         }
       }
     }

     function slideDown(element, time) {
       if (element.offsetHeight <= 0) {
         element.style.display = "block";
         element.style.transition = "height" + time + " ms";
         element.style.overflow = "hidden";
         var totalHeight = element.offsetHeight;
         var currentHeight = 0;
         element.style.height = "0px";
         var addValue = totalHeight / (time / 10);
         var timer = setInterval(function () {
           currentHeight += addValue;
           element.style.height = currentHeight + "px";

           if (currentHeight >= totalHeight) {
             clearInterval(timer);
             element.style.height = totalHeight + "px";

             if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
               element.TimerManage.next();
             }
           }
         }, 10);
       } else {
         if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
           element.TimerManage.next();
         }
       }
     }

     function fadeIn(element, time) {
       element.style.transition = "opacity" + time + " ms";

       if (!Number(getCss(element, 'opacity')) || !parseInt(getCss(element, 'opacity')) <= 0) {
         element.style.display = "none";
         element.style.opacity = 0;
         let curAlpha = 0;
         let addAlpha = 1 * 100 / (time / 10);
         let timer = null;

         let handleFade = function () {
           curAlpha += addAlpha;
           if (element.style.display === 'none') element.style.display = "block";
           element.style.opacity = (curAlpha / 100).toFixed(2);

           if (curAlpha >= 100) {
             if (timer) clearTimeout(timer);
             element.style.opacity = 1;

             if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
               element.TimerManage.next();
             }
           } else {
             timer = setTimeout(handleFade, 10);
           }
         };

         handleFade();
       } else {
         if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
           element.TimerManage.next();
         }
       }
     }

     function fadeOut(element, time) {
       element.style.transition = "opacity" + time + " ms";

       if (parseInt(getCss(element, 'opacity')) >= 1) {
         let curAlpha = 100;
         element.style.opacity = 1;
         element.style.display = "block";
         let reduceAlpha = 1 * 100 / (time / 10);
         let timer = null;

         let handleFade = function () {
           curAlpha -= reduceAlpha;
           element.style.opacity = (curAlpha / 100).toFixed(2);

           if (curAlpha <= 0) {
             if (timer) clearTimeout(timer);
             element.style.opacity = 0;
             element.style.display = "none";

             if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
               element.TimerManage.next();
             }
           } else {
             timer = setTimeout(handleFade, 10);
           }
         };

         handleFade();
       } else {
         if (element.TimerManage && element.TimerManage.constructor === TimerManager) {
           element.TimerManage.next();
         }
       }
     }

     animation.slideUp = function (element) {
       TimerManager.makeTimerManage(element);
       element.TimerManage.add(slideUp, arguments);
       return this;
     };

     animation.slideDown = function (element) {
       TimerManager.makeTimerManage(element);
       element.TimerManage.add(slideDown, arguments);
       return this;
     };

     animation.fadeIn = function (element) {
       TimerManager.makeTimerManage(element);
       element.TimerManage.add(fadeIn, arguments);
       return this;
     };

     animation.fadeOut = function (element) {
       TimerManager.makeTimerManage(element);
       element.TimerManage.add(fadeOut, arguments);
       return this;
     };

     return animation;
   }();

   const consoleInfo = function () {
     console.log(`%c ew-color-picker@1.4.4 %c 联系QQ：854806732 %c 联系微信：eveningwater %c github:https://github.com/eveningwater/ew-color-picker %c `, 'background:#0ca6dc ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');
   };

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

   var css_248z = ".ew-color-picker {\r\n    min-width: 320px;\r\n    position: absolute;\r\n    box-sizing: content-box;\r\n    border: 1px solid #ebeeff;\r\n    box-shadow: 0 4px 15px rgba(0, 0, 0, .2);\r\n    border-radius: 5px;\r\n    z-index: 10;\r\n    padding: 7px;\r\n    background-color: #ffffff;\r\n    display: none;\r\n    text-align: left;\r\n}\r\n\r\n.ew-color-picker .ew-color-picker-content:after {\r\n    content: \"\";\r\n    display: table;\r\n    clear: both;\r\n}\r\n\r\n.ew-color-picker-content {\r\n    margin-bottom: 6px;\r\n}\r\n\r\n.ew-color-panel {\r\n    position: relative;\r\n    width: 280px;\r\n    height: 180px;\r\n    cursor: pointer;\r\n}\r\n\r\n.ew-color-white-panel,\r\n.ew-color-black-panel {\r\n    position: absolute;\r\n    left: 0;\r\n    right: 0;\r\n    top: 0;\r\n    bottom: 0;\r\n}\r\n\r\n.ew-color-white-panel {\r\n    background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));\r\n}\r\n\r\n.ew-color-black-panel {\r\n    background: linear-gradient(0deg, #000, transparent);\r\n}\r\n\r\n.ew-color-slider {\r\n    width: 27px;\r\n    height: 180px;\r\n    position: relative;\r\n    float: right;\r\n    box-sizing: border-box;\r\n}\r\n.ew-color-slider-bar {\r\n    background: linear-gradient(180deg, #f00 0, #ff0 17%, #0f0 33%, #0ff 50%, #00f 67%, #f0f 83%, #f00);\r\n    margin-left: 3px;\r\n}\r\n.ew-alpha-slider-bar,.ew-color-slider-bar{\r\n    width: 12px;\r\n    height: 100%;\r\n    position: relative;\r\n    float: left;\r\n    cursor: pointer;\r\n}\r\n.ew-alpha-slider-wrapper{\r\n    background: url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAIAAADZF8uwAAAAGUlEQVQYV2M4gwH+YwCGIasIUwhT25BVBADtzYNYrHvv4gAAAABJRU5ErkJggg==\");\r\n}\r\n.ew-alpha-slider-bg,.ew-alpha-slider-wrapper{\r\n    position: absolute;\r\n    right: 0;\r\n    top: 0;\r\n    left: 0;\r\n    bottom: 0;\r\n}\r\n.ew-color-slider-thumb,.ew-alpha-slider-thumb {\r\n    position: absolute;\r\n    cursor: pointer;\r\n    box-sizing: border-box;\r\n    left: 0;\r\n    top: 0;\r\n    width: 12px;\r\n    height: 4px;\r\n    border-radius: 1px;\r\n    background: #fff;\r\n    border: 1px solid #f0f0f0;\r\n    box-shadow: 0 0 2px rgba(0, 0, 0, .6);\r\n}\r\n\r\n.ew-color-cursor{\r\n    position: absolute;\r\n    left: 100%;\r\n    top: 0%;\r\n    cursor: default;\r\n    width: 4px;\r\n    height: 4px;\r\n    transform: translate(-2px, -2px);\r\n    border-radius: 50%;\r\n    box-shadow: 0 0 0 3px #fff,\r\n        inset 0 0 2px 2px rgba(0, 0, 0, .4),\r\n        0 0 2px 3px rgba(0, 0, 0, .5);\r\n    transform: translate(-6px,-6px)\r\n}\r\n\r\n.ew-color-drop-container {\r\n    margin-top: 6px;\r\n    position: relative;\r\n}\r\n\r\n.ew-color-input {\r\n    width: 160px;\r\n    height: 28px;\r\n    line-height: 28px;\r\n    border: 1px solid #dcdfe6;\r\n    background-color: #ffffff;\r\n    display: inline-block;\r\n    box-sizing: border-box;\r\n    padding: 0 5px;\r\n    transition: border-color .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n    border-radius: 5px;\r\n    outline: none;\r\n}\r\n\r\n.ew-color-input:focus {\r\n    border-color: #239fe6;\r\n}\r\n\r\n.ew-color-drop-btn {\r\n    display: inline-block;\r\n    padding: 5px 15px;\r\n    font-size: 12px;\r\n    border-radius: 3px;\r\n    cursor: pointer;\r\n    text-align: center;\r\n    transition: .1s;\r\n    font-weight: 500;\r\n    outline: none;\r\n    box-sizing: border-box;\r\n    margin: 0;\r\n    white-space: nowrap;\r\n    color: #606266;\r\n    border: 1px solid #dcdfe6;\r\n}\r\n\r\n.ew-color-drop-btn-group {\r\n    position: absolute;\r\n    right: 0;\r\n    top: 1px;\r\n}\r\n\r\n.ew-color-clear {\r\n    color: #4096ef;\r\n    border-color: transparent;\r\n    background-color: transparent;\r\n    padding-left: 0;\r\n    padding-right: 0;\r\n}\r\n\r\n.ew-color-clear:hover,\r\n.ew-color-clear:active {\r\n    color: #66b1ff;\r\n}\r\n\r\n.ew-color-sure {\r\n    background-color: #ffffff;\r\n    margin-left: 10px;\r\n}\r\n\r\n.ew-color-sure:hover,\r\n.ew-color-sure:active {\r\n    border-color: #4096ef;\r\n    color: #4096ef;\r\n}\r\n.ew-pre-define-color-container{\r\n    width: 280px;\r\n    font-size: 12px;\r\n    margin-top: 8px;\r\n}\r\n.ew-pre-define-color-container:after{\r\n    content: \"\";\r\n    visibility: hidden;\r\n    clear: both;\r\n    display: block;\r\n    height: 0;\r\n}\r\n.ew-pre-define-color{\r\n    float: left;\r\n    margin: 0 0 8px 8px;\r\n    width: 20px;\r\n    height: 20px;\r\n    border-radius: 4px;\r\n    cursor: pointer;\r\n    outline: none;\r\n    border: 1px solid #9b979b;\r\n}\r\n.ew-pre-define-color:nth-child(10n+1){\r\n    margin-left: 0;\r\n}\r\n.ew-pre-define-color:hover,\r\n.ew-pre-define-color:active{\r\n    opacity: .8;\r\n}\r\n.ew-pre-define-color-active{\r\n    box-shadow: 0 0 3px 2px #409eff;\r\n}\r\n.ew-color-picker-box{\r\n    border: 1px solid #dcdee2;\r\n    color: #535353;\r\n    outline: none;\r\n    display: inline-block;\r\n    background-color: #ffffff;\r\n    position: relative;\r\n    border-radius: 4px;\r\n    padding: 4px 7px;\r\n    line-height: 1.5;\r\n    cursor: pointer;\r\n    font-size: 14px;\r\n    transition: border-color  .2s cubic-bezier(0.175, 0.885, 0.32, 1.275);\r\n}\r\n.ew-color-picker-box-disabled{\r\n    background-color: #ebe7e7;\r\n    cursor: not-allowed;\r\n}\r\n.ew-color-picker-arrow,.ew-color-picker-no{\r\n    width: 20px;\r\n    height: 20px;\r\n    position: absolute;\r\n    left: 0;\r\n    top: 0;\r\n    bottom: 0;\r\n    right: 0;\r\n    margin: auto;\r\n    z-index: 3;\r\n}\r\n.ew-color-picker-no{\r\n    width: 40px;\r\n    height: 40px;\r\n    font-size: 20px;\r\n    text-align: center;\r\n    line-height: 40px;\r\n    color: #5e535f;\r\n    border: 1px solid #e2dfe2;\r\n    border-radius: 2px;\r\n}\r\n.ew-color-picker-arrow {\r\n    display: flex;\r\n    justify-content: center;\r\n    align-items: center;\r\n}\r\n.ew-color-picker-arrow-left,.ew-color-picker-arrow-right{\r\n    width: 12px;\r\n    height: 1px;\r\n    background-color: #fff;\r\n    display: inline-block;\r\n    position: relative;\r\n}\r\n.ew-color-picker-arrow-left{\r\n    transform:rotate(45deg);\r\n}\r\n.ew-color-picker-arrow-right {\r\n    transform: rotate(-45deg);\r\n    right: 3px;\r\n}";
   styleInject(css_248z);

   const NOT_DOM_ELEMENTS = ['html', 'head', 'body', 'meta', 'title', 'link', 'style', 'script'];
   const ERROR_VARIABLE = {
     PICKER_OBJECT_CONFIG_ERROR: 'you should pass a param which is el and el must be a string or a dom element!',
     PICKER_CONFIG_ERROR: 'you should pass a param that it must be a string or a dom element!',
     DOM_OBJECT_ERROR: 'can not find the element by el property,make sure to pass a correct value!',
     DOM_ERROR: 'can not find the element,make sure to pass a correct param!',
     CONFIG_SIZE_ERROR: 'the value must be a string which is one of the normal,medium,small,mini,or must be an object and need to contain width or height property!',
     DOM_NOT_ERROR: 'Do not pass these elements: ' + NOT_DOM_ELEMENTS.join(',') + ' as a param,pass the correct element such as div!',
     PREDEFINE_COLOR_ERROR: 'PredefineColor is a array that is need to contain color value!'
   };
   const PICKER_OBJECT_CONFIG_ERROR = ERROR_VARIABLE.PICKER_OBJECT_CONFIG_ERROR;
   const PICKER_CONFIG_ERROR = ERROR_VARIABLE.PICKER_CONFIG_ERROR;
   const DOM_OBJECT_ERROR = ERROR_VARIABLE.DOM_OBJECT_ERROR;
   const DOM_ERROR = ERROR_VARIABLE.DOM_ERROR;
   const CONFIG_SIZE_ERROR = ERROR_VARIABLE.CONFIG_SIZE_ERROR;
   const DOM_NOT_ERROR = ERROR_VARIABLE.DOM_NOT_ERROR;
   const PREDEFINE_COLOR_ERROR = ERROR_VARIABLE.PREDEFINE_COLOR_ERROR;

   /**
    * 构造函数
    * @param {*} config 
    */

   function ewColorPicker(config) {
     this.pickerFlag = false;
     const defaultConfig = {
       hue: true,
       alpha: false,
       size: "normal",
       predefineColor: [],
       disabled: false,
       defaultColor: "",
       openPickerAni: "height",
       sure: function () {},
       clear: function () {},
       openPicker: function () {},
       isLog: true
     }; //如果第二个参数传的是字符串，或DOM对象，则初始化默认的配置

     if (isStr(config) || isDom(config)) {
       this.config = defaultConfig;
       this.beforeInit(config, this.config, DOM_ERROR);
     } //如果是对象，则自定义配置，自定义配置选项如下:
     else if (isDeepObject(config) && (isStr(config.el) || isDom(config.el))) {
         this.config = ewAssign(defaultConfig, config);
         this.beforeInit(config.el, this.config, DOM_OBJECT_ERROR);
       } else {
         const errorText = isDeepObject(config) ? PICKER_OBJECT_CONFIG_ERROR : PICKER_CONFIG_ERROR;
         return ewError(errorText);
       }

     return this;
   }

   ewColorPicker.prototype.beforeInit = function (element, config, errorText) {
     if (config.isLog) consoleInfo(); // 不能是哪些标签元素

     const isNotDom = function (ele) {
       if (NOT_DOM_ELEMENTS.indexOf(ele.tagName.toLowerCase()) > -1) {
         ewError(DOM_NOT_ERROR);
         return true;
       }

       return false;
     };

     if (isDom(element)) {
       if (!isNotDom(element)) this.init(element, config);
     } else if (ewObjToArray(getDom(element)).length) {
       ewObjToArray(getDom(element)).forEach(item => {
         if (!isNotDom(item)) this.init(item, config);
       });
     } else {
       return ewError(errorText);
     }
   };

   ewColorPicker.prototype.init = function (bindElement, config) {
     let b_width, b_height; //自定义颜色选择器的类型

     if (isStr(config.size)) {
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
     } else if (isDeepObject(config.size)) {
       b_width = config.size.width && isNumber(config.size.width) ? parseInt(config.size.width) + 'px' : '40px';
       b_height = config.size.height && isNumber(config.size.height) ? parseInt(config.size.height) + 'px' : '40px';
     } else {
       return ewError(CONFIG_SIZE_ERROR);
     }

     this.b_width = b_width;
     this.b_height = b_height; //渲染选择器

     this.render(bindElement, config);
   };

   ewColorPicker.prototype.render = function (element, config) {
     let predefineColorHTML = ''; //设置预定义颜色

     if (isDeepArray(config.predefineColor)) {
       if (config.predefineColor.length) {
         config.predefineColor.map(color => {
           predefineColorHTML += `<div class="ew-pre-define-color" style="background:${color};" tabIndex=0></div>`;
         });
       }
     } else {
       return ewError(PREDEFINE_COLOR_ERROR);
     } //打开颜色选择器的方框


     const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow" style="width:${this.b_width};height:${this.b_height};">
        <div class="ew-color-picker-arrow-left"></div>
        <div class="ew-color-picker-arrow-right"></div>
    </div>` : `<div class="ew-color-picker-no" style="width:${this.b_width};height:${this.b_height};line-height:${this.b_height};">&times;</div>`; //透明度

     const alphaBar = config.alpha ? `<div class="ew-alpha-slider-bar">
    <div class="ew-alpha-slider-wrapper"></div>
    <div class="ew-alpha-slider-bg"></div>
    <div class="ew-alpha-slider-thumb"></div>
    </div>` : ''; // hue

     const hueBar = config.hue ? `<div class="ew-color-slider-bar"><div class="ew-color-slider-thumb"></div></div>` : ''; //自定义颜色

     const predefineHTML = predefineColorHTML ? `<div class="ew-pre-define-color-container">${predefineColorHTML}</div>` : ''; // 禁用类名

     const boxDisabledClassName = config.disabled ? 'ew-color-picker-box-disabled' : ''; // 盒子样式

     const boxStyle = `width:${this.b_width};height:${this.b_height};${config.defaultColor ? 'background:' + config.defaultColor : ''}`; //颜色选择器

     let html = `
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
   };

   ewColorPicker.prototype.startMain = function (ele, config) {
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
     this.hsba = this.config.defaultColor ? colorRgbaToHsba(colorToRgb(this.config.defaultColor)) : {
       h: 0,
       s: 100,
       b: 100,
       a: 1
     };
     const panelWidth = this.panelWidth = parseInt(getCss(this.pickerPanel, 'width'));
     const panelHeight = this.panelHeight = parseInt(getCss(this.pickerPanel, 'height')); //计算偏差

     let elem = ele;
     let top = elem.offsetTop;
     let left = elem.offsetLeft;

     while (elem.offsetParent) {
       top += elem.offsetParent.offsetTop;
       left += elem.offsetParent.offsetLeft;
       elem = elem.offsetParent;
     }

     this.panelLeft = left;
     this.panelTop = top + ele.offsetHeight; //预定义颜色

     this.preDefineItem = getELByClass(ele, 'ew-pre-define-color', true);

     if (this.preDefineItem.length) {
       //点击预定义颜色
       ewObjToArray(this.preDefineItem).map(item => {
         item.addEventListener('click', function (event) {
           ewObjToArray(this.parentElement.children).forEach(child => {
             removeClass(child, 'ew-pre-define-color-active');
           });
           addClass(event.target, 'ew-pre-define-color-active');
           let pColor = colorRgbaToHsba(getCss(event.target, 'background-color'));
           scope.hsba = pColor;
           changeElementColor(scope);
           changeAlphaBar(scope);
           setDefaultValue(scope, panelWidth, panelHeight);
         }, false);
         item.addEventListener('blur', function (event) {
           removeClass(event.target, 'ew-pre-define-color-active');
         }, false);
       });
     } //颜色选择器打开的动画初始设置


     if (config.openPickerAni.indexOf('height') > -1) {
       this.picker.style.display = 'none';
     } else {
       this.picker.style.opacity = 0;
     }

     const sliderWidth = !config.alpha && !config.hue ? 0 : !config.alpha || !config.hue ? 14 : 27;
     const pickerWidth = !config.alpha && !config.hue ? 280 : !config.alpha || !config.hue ? 300 : 320;
     this.slider.style.width = sliderWidth + 'px';
     this.picker.style.minWidth = pickerWidth + 'px';

     if (config.alpha) {
       this.alphaBar = getELByClass(ele, 'ew-alpha-slider-bar');
       this.alphaBarBg = getELByClass(ele, 'ew-alpha-slider-bg');
       this.alphaBarThumb = getELByClass(ele, 'ew-alpha-slider-thumb');
       changeAlphaBar(this);
       this.bindEvent(this.alphaBarThumb, function (scope, el, x, y) {
         changeAlpha(scope, y);
       }, false);
       this.alphaBar.addEventListener('click', function (event) {
         changeAlpha(scope, event.y);
       }, false);
     } //输入框输入事件


     this.pickerInput.addEventListener('blur', function (event) {
       onInputColor(scope, event.target.value);
     }, false); //清空按钮事件

     this.pickerClear.addEventListener('click', function () {
       onClearColor(ele, scope);
     }, false); //确认按钮事件

     this.pickerSure.addEventListener('click', function () {
       onSureColor(scope);
     }); //是否禁止打开选择器面板，未禁止则点击可打开

     if (!config.disabled) {
       this.box.addEventListener('click', function () {
         openPicker(ele, scope);
       }, false);
     } //颜色面板点击事件


     this.pickerPanel.addEventListener('click', function (event) {
       onClickPanel(scope, event);
     }, false); //颜色面板拖拽元素拖拽事件

     this.bindEvent(this.pickerCursor, function (scope, el, x, y) {
       const left = Math.max(0, Math.min(x - scope.panelLeft, panelWidth));
       const top = Math.max(0, Math.min(y - scope.panelTop, panelHeight));
       changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight);
     }, false);

     if (config.hue) {
       //hue的点击事件
       this.hueBar.addEventListener('click', function (event) {
         changeHue(scope, event.y);
       }, false); //hue 轨道的拖拽事件

       this.bindEvent(this.hueThumb, function (scope, el, x, y) {
         changeHue(scope, y);
       }, false);
     }
   };
   /**
    * 绑定事件
    */


   ewColorPicker.prototype.bindEvent = function (el, callback, bool) {
     const context = this;
     const event_param = {
       capture: false,
       once: false,
       passive: false,
       useCapture: false,
       wantsUntrusted: false
     };

     const callResult = function (event) {
       context.moveX = eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientX : event.clientX;
       context.moveY = eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientY : event.clientY;
       bool ? callback(context, context.moveX, context.moveY) : callback(context, el, context.moveX, context.moveY);
     };

     el.addEventListener(eventType[0], function () {
       const moveFn = function (e) {
         e.preventDefault();
         callResult(e);
       };

       const upFn = function () {
         document.removeEventListener(eventType[1], moveFn, event_param);
         document.removeEventListener(eventType[2], upFn, event_param);
       };

       document.addEventListener(eventType[1], moveFn, event_param);
       document.addEventListener(eventType[2], upFn, event_param);
     }, event_param);
   };
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
    * 设置css样式
    * @param {*} el 
    * @param {*} prop 
    * @param {*} value 
    */


   function setCss(el, prop, value) {
     el.style[prop] = value;
   }
   /**
    * 打开面板
    * @param {*} el 
    * @param {*} scope 
    */


   function openPicker(el, scope) {
     scope.pickerFlag = !scope.pickerFlag;
     scope.config.defaultColor = scope.config.alpha ? colorHsbaToRgba(scope.hsba) : colorRgbaToHex(colorHsbaToRgba(scope.hsba));
     scope.render(el, scope.config);
     setDefaultValue(scope, scope.panelWidth, scope.panelHeight);
     openAndClose(scope);
     if (isFunction(scope.config.openPicker)) scope.config.openPicker(el, scope);
   }
   /**
    * 打开和关闭
    * @param {*} scope 
    */


   function openAndClose(scope) {
     const expression = isStr(scope.config.openPickerAni) && scope.config.openPickerAni.indexOf('height') > -1;

     let open = function () {
       return expression ? ani.slideDown(scope.picker, 400) : ani.fadeIn(scope.picker, 400);
     };

     let close = function () {
       return expression ? ani.slideUp(scope.picker, 400) : ani.fadeOut(scope.picker, 400);
     };

     return scope.pickerFlag ? open() : close();
   }
   /**
    * 输入颜色的转换
    * @param {*} scope 
    * @param {*} value 
    */


   function onInputColor(scope, value) {
     const color = colorRgbaToHsba(colorToRgb(value));
     if (!color.h && !color.s && !color.h && !color.a) return;
     scope.hsba = color;
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
     scope.pickerFlag = !scope.pickerFlag;
     scope.render(el, scope.config);
   }
   /**
    * 确定
    * @param {*} scope 
    */


   function onSureColor(scope) {
     scope.pickerFlag = false;
     openAndClose(scope);
     changeElementColor(scope);
     const result = scope.config.alpha ? colorHsbaToRgba(scope.hsba) : colorRgbaToHex(colorHsbaToRgba(scope.hsba));
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
     setCss(scope.pickerCursor, 'left', left + 'px');
     setCss(scope.pickerCursor, 'top', top + 'px');
     const s = parseInt(100 * left / panelWidth);
     const b = parseInt(100 * (panelHeight - top) / panelHeight); //需要减去本身的宽高来做判断

     scope.hsba.s = s > 100 ? 100 : s < 0 ? 0 : s;
     scope.hsba.b = b > 100 ? 100 : b < 0 ? 0 : b;
     changeElementColor(scope);
   }
   /**
    * 改变元素的颜色
    * @param {*} scope 
    * @param {*} isAlpha 
    */


   function changeElementColor(scope, isAlpha) {
     setCss(scope.box, 'background', colorHsbaToRgba(scope.hsba));
     scope.pickerInput.value = isAlpha || scope.config.alpha ? colorHsbaToRgba(scope.hsba) : colorRgbaToHex(colorHsbaToRgba(scope.hsba));
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
     const newColor = deepCloneObjByRecursion(color);
     newColor.s = newColor.b = 100;
     return newColor;
   }
   /**
    * 改变透明度
    * @param {*} scope 
    */


   function changeAlphaBar(scope) {
     if (!scope.alphaBarBg) return;
     setCss(scope.alphaBarBg, 'background', 'linear-gradient(to top,' + colorHsbaToRgba(cloneColor(scope.hsba), 0) + ' 0%,' + colorHsbaToRgba(cloneColor(scope.hsba)) + ' 100%)');
   }
   /**
    * 设置默认颜色
    * @param {*} context 
    * @param {*} panelWidth 
    * @param {*} panelHeight 
    */


   function setDefaultValue(context, panelWidth, panelHeight) {
     context.pickerInput.value = context.config.alpha ? colorHsbaToRgba(context.hsba) : colorRgbaToHex(colorHsbaToRgba(context.hsba));
     if (context.box) context.box.style.background = context.pickerInput.value;
     let sliderBarHeight = 0;

     if (context.config.hue) {
       sliderBarHeight = context.hueBar.offsetHeight || 180;
       let ty = parseInt(context.hsba.h * sliderBarHeight / 360);
       setCss(context.hueThumb, 'top', ty + 'px');
     }

     let l = parseInt(context.hsba.s * panelWidth / 100),
         t = parseInt(panelHeight - context.hsba.b * panelHeight / 100);
     setCss(context.pickerCursor, 'left', l + 4 + 'px');
     setCss(context.pickerCursor, 'top', t + 4 + 'px'); //颜色面板颜色

     setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsbaToRgba(cloneColor(context.hsba)))); //改变透明度

     if (context.config.alpha) {
       if (!context.config.hue) sliderBarHeight = context.alphaBar.offsetHeight || 180;
       const al_t = sliderBarHeight - context.hsba.a * sliderBarHeight;
       setCss(context.alphaBarThumb, 'top', al_t + 'px');
     }
   } //改变色调的方法


   function changeHue(context, y) {
     const sliderBarHeight = context.hueBar.offsetHeight,
           sliderBarRect = context.hueBar.getBoundingClientRect();
     let sliderThumbY = Math.max(0, Math.min(y - sliderBarRect.y, sliderBarHeight));
     setCss(context.hueThumb, 'top', sliderThumbY + 'px');
     context.hsba.h = cloneColor(context.hsba).h = parseInt(360 * sliderThumbY / sliderBarHeight);
     setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsbaToRgba(cloneColor(context.hsba))));
     changeElementColor(context);
     changeAlphaBar(context);
   } //改变透明度的方法


   function changeAlpha(context, y) {
     const alphaBarHeight = context.alphaBar.offsetHeight,
           alphaBarRect = context.alphaBar.getBoundingClientRect();
     let alphaThumbY = Math.max(0, Math.min(y - alphaBarRect.y, alphaBarHeight));
     setCss(context.alphaBarThumb, 'top', alphaThumbY + 'px');
     const alpha = (alphaBarHeight - alphaThumbY <= 0 ? 0 : alphaBarHeight - alphaThumbY) / alphaBarHeight;
     context.hsba.a = alpha >= 1 ? 1 : alpha.toFixed(2);
     changeElementColor(context, true);
   }

   if (!window.ewColorPicker) {
     window.ewColorPicker = ewColorPicker;
   }

   return ewColorPicker;

})));
