let addMethod = (instance, method, func) => {
  instance.prototype[method] = func;
  return instance;
};
const util$1 = Object.create(null);
const _toString = Object.prototype.toString,
      hasOwn = Object.prototype.hasOwnProperty;
['Number', 'String', 'Function', 'Undefined', 'Boolean'].forEach(type => util$1['is' + type] = value => typeof value === type.toLowerCase());
util$1.addMethod = addMethod;
['Object', 'Array', 'RegExp'].forEach(type => util$1['isDeep' + type] = value => _toString.call(value).slice(8, -1).toLowerCase() === type.toLowerCase());

util$1.isShallowObject = value => typeof value === 'object' && !util$1.isNull(value);

util$1['ewObjToArray'] = value => util$1.isShallowObject(value) ? Array.prototype.slice.call(value) : value;

util$1.isNull = value => value === null;

util$1.ewAssign = function (target) {
  if (util$1.isNull(target)) return;

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
};

util$1.addClass = (el, className) => el.classList.add(className);

util$1.removeClass = (el, className) => el.classList.remove(className);

util$1.hasClass = (el, className) => {
  let _hasClass = value => new RegExp(" " + el.className + " ").test(" " + value + " ");

  if (util$1.isDeepArray(className)) {
    return className.some(name => _hasClass(name));
  } else {
    return _hasClass(className);
  }
};

util$1['setCss'] = (el, prop, value) => el.style.setProperty(prop, value);

util$1.setSomeCss = (el, propValue = []) => {
  if (propValue.length) {
    propValue.forEach(p => util$1.setCss(el, p.prop, p.value));
  }
};

util$1.isDom = el => util$1.isShallowObject(HTMLElement) ? el instanceof HTMLElement : el && util$1.isShallowObject(el) && el.nodeType === 1 && util$1.isString(el.nodeName) || el instanceof HTMLCollection || el instanceof NodeList;

util$1.ewError = value => console.error('[ewColorPicker warn]\n' + new Error(value));

util$1.ewWarn = value => console.warn('[ewColorPicker warn]\n' + value);

util$1.deepCloneObjByJSON = obj => JSON.parse(JSON.stringify(obj));

util$1.deepCloneObjByRecursion = function f(obj) {
  if (!util$1.isShallowObject(obj)) return;
  let cloneObj = util$1.isDeepArray(obj) ? [] : {};

  for (let k in obj) {
    cloneObj[k] = util$1.isShallowObject(obj[k]) ? f(obj[k]) : obj[k];
  }

  return cloneObj;
};

util$1.getCss = (el, prop) => window.getComputedStyle(el, null)[prop];

util$1.$ = (selector, el = document) => el.querySelector(selector);

util$1.$$ = (selector, el = document) => el.querySelectorAll(selector);

util$1["on"] = (element, type, handler, useCapture = false) => {
  if (element && type && handler) {
    element.addEventListener(type, handler, useCapture);
  }
};

util$1["off"] = (element, type, handler, useCapture = false) => {
  if (element && type && handler) {
    element.removeEventListener(type, handler, useCapture);
  }
};

util$1['getRect'] = el => el.getBoundingClientRect();

util$1['baseClickOutSide'] = (element, isUnbind = true, callback) => {
  const mouseHandler = event => {
    const rect = util$1.getRect(element);
    const target = event.target;
    if (!target) return;
    const targetRect = util$1.getRect(target);
    if (targetRect.x >= rect.x && targetRect.y >= rect.y && targetRect.width <= rect.width && targetRect.height <= rect.height) return;
    if (util$1.isFunction(callback)) callback();

    if (isUnbind) {
      // 延迟解除绑定
      setTimeout(() => {
        util$1.off(document, util$1.eventType[0], mouseHandler);
      }, 0);
    }
  };

  util$1.on(document, util$1.eventType[0], mouseHandler);
};

util$1["clickOutSide"] = (context, config, callback) => {
  const mouseHandler = event => {
    const rect = util$1.getRect(context.$Dom.picker);
    let boxRect = null;

    if (config.hasBox) {
      boxRect = util$1.getRect(context.$Dom.box);
    }

    const target = event.target;

    if (!target) {
      return;
    }

    const targetRect = util$1.getRect(target);

    if (config.hasBox) {
      if (targetRect.x >= rect.x && targetRect.y >= rect.y && targetRect.width <= rect.width) {
        return;
      }

      if (targetRect.x >= boxRect.x && targetRect.y >= boxRect.y && targetRect.width <= boxRect.width && targetRect.height <= boxRect.height) {
        return;
      }

      callback();
    } else {
      if (targetRect.x >= rect.x && targetRect.y >= rect.y && targetRect.width <= rect.width && targetRect.height <= rect.height) {
        return;
      }

      callback();
    }

    setTimeout(() => {
      util$1.off(document, util$1.eventType[0], mouseHandler);
      util$1.on(document, util$1.eventType[0], mouseHandler);
    }, 0);
  };

  util$1.on(document, util$1.eventType[0], mouseHandler);
};

util$1['createUUID'] = () => (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + new Date().getTime() + '-' + Math.random().toString().substr(2, 5);

util$1.removeAllSpace = value => value.replace(/\s+/g, "");

util$1.isJQDom = dom => typeof window.jQuery !== "undefined" && dom instanceof jQuery;

util$1.isPromise = value => !util$1.isUndefined(value) && !util$1.isNull(value) && util$1.isFunction(value.then) && util$1.isFunction(value.catch);

const classnames = function (...args) {
  const classes = [];

  for (let i = 0, l = args.length; i < l; i++) {
    const arg = args[i];

    if (!arg) {
      continue;
    }

    if (util$1.isString(arg) || util$1.isNumber(arg)) {
      classes.push(arg);
    } else if (util$1.isDeepArray(arg)) {
      if (arg.length) {
        const __class = classnames.apply(null, arg);

        if (__class) {
          classes.push(__class);
        }
      }
    } else {
      if (arg.toString === _toString) {
        for (let key in arg) {
          if (hasOwn.call(arg, key) && arg[key]) {
            classes.push(key);
          }
        }
      } else {
        classes.push(arg.toString());
      }
    }
  }

  return classes.join(" ");
};

util$1.classnames = classnames; //the event

util$1.eventType = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];

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

const methods$1 = [{
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
methods$1.forEach(method => util$1.addMethod(TimerManager, method.method, method.func));

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
    util$1.setCss(element, 'overflow', "hidden");
    upAndDown();
  } else if (type.indexOf('fade') > -1) {
    transition = "opacity" + time + ' ms';
    inAndOut();
  } else {
    transition = "display" + time + ' ms';
    return showOrHide();
  }

  util$1.setCss(element, 'transition', transition);

  function upAndDown() {
    const isDown = type.toLowerCase().indexOf('down') > -1;
    if (isDown) util$1.setCss(element, 'display', 'block');

    const getPropValue = function (item, prop) {
      let v = util$1.getCss(item, prop);
      return util$1.removeAllSpace(v).length ? parseInt(v) : Number(v);
    };

    const elementChildHeight = [].reduce.call(element.children, (res, item) => {
      res += item.offsetHeight + getPropValue(item, 'margin-top') + getPropValue(item, 'margin-bottom');
      return res;
    }, 0);
    let totalHeight = Math.max(element.offsetHeight, elementChildHeight + 10);
    let currentHeight = isDown ? 0 : totalHeight;
    let unit = totalHeight / (time / 10);
    if (isDown) util$1.setCss(element, 'height', '0px');
    let timer = null;

    let handler = () => {
      currentHeight = isDown ? currentHeight + unit : currentHeight - unit;
      util$1.setCss(element, 'height', currentHeight + 'px');

      if (currentHeight >= totalHeight || currentHeight <= 0) {
        clearTimeout(timer);
        util$1.setCss(element, 'height', totalHeight + 'px');
        runNext(element);
      } else {
        timer = setTimeout(handler, 10);
      }

      if (!isDown && currentHeight <= 0) {
        util$1.setSomeCss(element, [{
          prop: "display",
          value: 'none'
        }, {
          prop: "height",
          value: 0
        }]);
      }
    };

    handler();
  }

  function inAndOut() {
    const isIn = type.toLowerCase().indexOf('in') > -1;
    let timer = null;
    let unit = 1 * 100 / (time / 10);
    let curAlpha = isIn ? 0 : 100;
    util$1.setSomeCss(element, [{
      prop: "display",
      value: isIn ? 'none' : 'block'
    }, {
      prop: "opacity",
      value: isIn ? 0 : 1
    }]);

    let handleFade = function () {
      curAlpha = isIn ? curAlpha + unit : curAlpha - unit;
      if (element.style.display === 'none' && isIn) util$1.setCss(element, 'display', 'block');
      util$1.setCss(element, 'opacity', (curAlpha / 100).toFixed(2));

      if (curAlpha >= 100 || curAlpha <= 0) {
        if (timer) clearTimeout(timer);
        runNext(element);
        if (curAlpha <= 0) util$1.setCss(element, 'display', 'none');
        util$1.setCss(element, 'opacity', curAlpha >= 100 ? 1 : 0);
      } else {
        timer = setTimeout(handleFade, 10);
      }
    };

    handleFade();
  }

  function showOrHide() {
    const isShow = type.indexOf('show') > -1;
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        util$1.setCss(element, 'display', isShow ? 'block' : 'none');
        resolve();
      }, Math.floor(time / 100));
    });
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
['show', 'hide'].forEach(method => {
  animation[method] = function (element, time) {
    return registerMethods(method, element, time);
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

    return util$1.removeAllSpace("rgba(" + rgbaColor.join(",") + ',' + a + ")");
  } else {
    return util$1.removeAllSpace(hColor);
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
    return util$1.removeAllSpace(value + color);
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
  return util$1.removeAllSpace('rgba(' + Math.ceil(r) + ',' + Math.ceil(g) + ',' + Math.ceil(b) + ',' + a + ')');
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

  return util$1.removeAllSpace(`rgba(${Math.ceil(r * 255)},${Math.ceil(g * 255)},${Math.ceil(b * 255)},${a})`);
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
    colorStr: util$1.removeAllSpace('hsla(' + Math.ceil(h * 60) + ',' + Math.ceil(s * 100) + '%,' + Math.ceil(l * 100) + '%,' + a + ')'),
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
  util$1.setCss(div, 'background-color', color);
  document.body.appendChild(div);
  const c = util$1.getCss(div, 'background-color');
  document.body.removeChild(div);
  let isAlpha = c.match(/,/g) && c.match(/,/g).length > 2;
  let result = isAlpha ? c : c.slice(0, 2) + 'ba' + c.slice(3, c.length - 1) + ', 1)';
  return util$1.removeAllSpace(result);
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
  util$1.setCss(scope.$Dom.alphaBarBg, 'background', 'linear-gradient(' + position + ',' + colorHsvaToRgba(scope.hsvaColor, 0) + ' 0%,' + colorHsvaToRgba(scope.hsvaColor, 1) + ' 100%)');
}

function setBoxBackground(box, color) {
  return util$1.setCss(box, 'background', color);
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

  if (scope.config.hasInput) {
    scope.$Dom.pickerInput.value = newColor;
    scope.prevInputValue = newColor;
  }

  changeAlphaBar(scope);

  if (scope.config.hasBox && scope.config.boxBgColor && scope.boxChange) {
    setBoxBackground(scope.$Dom.box, newColor);
  }

  if (util$1.isFunction(scope.config.changeColor)) {
    scope.config.changeColor(newColor);
  }
}

/**
* 克隆颜色对象
* @param {*} color 
*/

function cloneColor(color) {
  const newColor = util$1.deepCloneObjByRecursion(color);
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

  if (context.config.hasInput) {
    context.prevInputValue = context.$Dom.pickerInput.value;
  }
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
  }].forEach(item => util$1.setCss(item.el, item.prop, item.value));
  setBarStyle(context);
}
function setBarStyle(context) {
  if (context.config.hue) {
    getSliderBarPosition(context.isHueHorizontal, context.$Dom.hueBar, (position, prop) => {
      util$1.setCss(context.$Dom.hueThumb, prop, parseInt(context.hsvaColor.h * position / 360) + 'px');
    });
  }

  if (context.config.alpha) {
    getSliderBarPosition(context.isAlphaHorizontal, context.$Dom.alphaBar, (position, prop) => {
      util$1.setCss(context.$Dom.alphaBarThumb, prop, (context.isAlphaHorizontal ? context.hsvaColor.a * position : position - context.hsvaColor.a * position) + 'px');
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
 * 初始化颜色
 * @param {*} context 
 * @param {*} config 
 */

function initColor(context, config) {
  if (config.defaultColor) {
    context.hsvaColor = colorRegRGBA.test(config.defaultColor) ? colorRgbaToHsva(config.defaultColor) : colorRgbaToHsva(colorToRgba(config.defaultColor));
  } else {
    context.hsvaColor = {
      h: 0,
      s: 100,
      v: 100,
      a: 1
    };
  }
}

/**
 * 开启颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */

function open(expression, picker, time = 200) {
  time = time > 10000 ? 10000 : time;
  let animation$1 = '';

  switch (expression) {
    case 'height':
      animation$1 = 'slideDown';
      break;

    case 'opacity':
      animation$1 = 'fadeIn';
      break;

    default:
      animation$1 = 'show';
  }

  return animation[animation$1](picker, time);
}
/**
 * 关闭颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */

function close(expression, picker, time = 200) {
  time = time > 10000 ? 10000 : time;
  let animation$1 = '';

  switch (expression) {
    case 'height':
      animation$1 = 'slideUp';
      break;

    case 'opacity':
      animation$1 = 'fadeOut';
      break;

    default:
      animation$1 = 'hide';
  }

  return animation[animation$1](picker, time);
}
/**
 * 获取动画类型
 * @param {*} scope 
 */

function getAnimationType(scope) {
  return scope.config.pickerAnimation;
}
/**
 * 打开和关闭
 * @param {*} scope 
 */

function openAndClose(scope) {
  const time = scope.config.pickerAnimationTime;
  return scope._privateConfig.pickerFlag ? open(getAnimationType(scope), scope.$Dom.picker, time) : close(getAnimationType(scope), scope.$Dom.picker, time);
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
    close(getAnimationType(this), this.$Dom.picker, this.config.pickerAnimationTime);
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
    open(getAnimationType(this), this.$Dom.picker, this.config.pickerAnimationTime);
    setColorValue(this, this.panelWidth, this.panelHeight, false);
  }
}
/**
 * 打开面板
 * @param {*} el 
 * @param {*} scope 
 */

function handlePicker(el, scope, callback) {
  scope._privateConfig.pickerFlag = !scope._privateConfig.pickerFlag;
  const returnValue = openAndClose(scope);

  if (util$1.isFunction(scope.config.togglePicker)) {
    scope.config.togglePicker(el, scope._privateConfig.pickerFlag, scope);
  }

  if (util$1.isPromise(returnValue)) {
    returnValue.then(() => {
      pickerCallBack(scope, callback);
    });
  } else {
    pickerCallBack(scope, callback);
  }
}

function pickerCallBack(scope, callback) {
  if (util$1.isFunction(callback)) {
    callback(scope._privateConfig.pickerFlag);
  }
}

const emptyFun = function () {};
const baseDefaultConfig = {
  hue: true,
  alpha: false,
  size: "normal",
  predefineColor: [],
  disabled: false,
  defaultColor: "",
  pickerAnimation: "default",
  pickerAnimationTime: 200,
  sure: emptyFun,
  clear: emptyFun,
  togglePicker: emptyFun,
  isLog: true,
  changeColor: emptyFun,
  hasBox: true,
  isClickOutside: true,
  hasClear: true,
  hasSure: true,
  hasInput: true,
  boxDisabled: false,
  openChangeColorMode: false,
  boxBgColor: false,
  hueDirection: "vertical",
  //vertical or horizontal
  alphaDirection: "vertical",
  //vertical or horizontal
  lang: "zh",
  userDefineText: false
};

const consoleInfo = () => console.log(`%c ew-color-picker@2.0.0%c 联系QQ：854806732 %c 联系微信：eveningwater %c github:https://github.com/eveningwater/ew-color-picker %c `, 'background:#0ca6dc ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff', 'background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff', 'background:transparent');

var zh = {
  clearText: "清空",
  sureText: "确定"
};

var en = {
  clearText: "clear",
  sureText: "sure"
};

function filterConfig(config) {
  config.hueDirection = config.hueDirection === 'horizontal' ? config.hueDirection : 'vertical';
  config.alphaDirection = config.alphaDirection === 'horizontal' ? config.alphaDirection : 'vertical';
}

function initLang(mergeConfig) {
  let langData = mergeConfig.lang === "en" ? en : zh;

  if (mergeConfig.userDefineText) {
    mergeConfig = util$1.ewAssign(mergeConfig, langData);
  } else {
    mergeConfig = util$1.ewAssign(langData, mergeConfig);
  }

  return Promise.resolve(mergeConfig);
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

  if (util$1.isString(config) || util$1.isDom(config) || util$1.isJQDom(config)) {
    mergeConfig = defaultConfig;
    element = util$1.isJQDom(config) ? config.get(0) : config;
    error = ERROR_VARIABLE.DOM_ERROR;
  } //如果是对象，则自定义配置，自定义配置选项如下:
  else if (util$1.isDeepObject(config) && (util$1.isString(config.el) || util$1.isDom(config.el) || util$1.isJQDom(config.el))) {
      filterConfig(config);
      mergeConfig = util$1.ewAssign(defaultConfig, config);
      element = util$1.isJQDom(config.el) ? config.el.get(0) : config.el;
      error = ERROR_VARIABLE.DOM_OBJECT_ERROR;
    } else {
      element = 'body';

      if (util$1.isDeepObject(config)) {
        filterConfig(config);
        mergeConfig = util$1.ewAssign(defaultConfig, config);
        error = ERROR_VARIABLE.DOM_OBJECT_ERROR;
      } else {
        mergeConfig = defaultConfig;
        error = ERROR_VARIABLE.DOM_ERROR;
      }
    }

  initLang(mergeConfig);

  if (mergeConfig.isLog) {
    consoleInfo();
  }

  if (['height', 'opacity'].indexOf(mergeConfig.pickerAnimation) === -1) {
    mergeConfig.pickerAnimation = 'default';
  }

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

/**
 * 绑定事件
 * @param {*} el 
 * @param {*} callback 
 * @param {*} bool 
 */

function bindEvent(el, callback, bool) {
  const context = this;

  const callResult = event => {
    context.moveX = util$1.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientX : event.clientX;
    context.moveY = util$1.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientY : event.clientY;
    bool ? callback(context, context.moveX, context.moveY) : callback(context, el, context.moveX, context.moveY);
  };

  const handler = () => {
    const moveFn = e => {
      e.preventDefault();
      callResult(e);
    };

    const upFn = () => {
      util$1.off(document, util$1.eventType[1], moveFn);
      util$1.off(document, util$1.eventType[2], upFn);
    };

    util$1.on(document, util$1.eventType[1], moveFn);
    util$1.on(document, util$1.eventType[2], upFn);
  };

  util$1.on(el, util$1.eventType[0], handler);
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

const destroy = function (instances) {
  let remove = vm => {
    if (vm instanceof ewColorPicker) {
      vm.destroy();
    }
  };

  if (util.isDeepArray(instances)) {
    let i = instances.length;

    while (i--) {
      remove(instances[i]);
    }
  } else {
    remove(instances);
  }
};

const util = Object.create(null);
[color, util$1, {
  bindEvent: bindEvent
}].forEach(module => {
  Object.keys(module).forEach(key => {
    if (util$1.isFunction(module[key]) && key !== 'clickOutSide') {
      util[key] = module[key];
    }
  });
});
var globalAPI = {
  createColorPicker,
  getDefaultConfig,
  destroy,
  util
};

const isNotDom = ele => {
  if (NOT_DOM_ELEMENTS.indexOf(ele.tagName.toLowerCase()) > -1) {
    util$1.ewError(ERROR_VARIABLE.DOM_NOT_ERROR);
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
  let lang = config.lang === "zh" ? zh : en;
  let newConfig;

  if (config.userDefineText) {
    newConfig = util$1.ewAssign(baseDefaultConfig, lang, config);
  } else {
    newConfig = util$1.ewAssign(baseDefaultConfig, config, lang);
  }

  errorText = errorText || initError;
  let ele = util$1.isDom(element) ? element : util$1.isString(element) ? util$1.$(element) : util$1.isJQDom(element) ? element.get(0) : null;
  if (!ele) return util$1.ewError(errorText);
  ele = ele.length ? ele[0] : ele;
  if (!ele.tagName) return util$1.ewError(errorText);

  if (!isNotDom(ele)) {
    if (!this._color_picker_uid) {
      this._color_picker_uid = util$1.createUUID();
    }

    if (config.openChangeColorMode) {
      this.colorMode = ["hex", "rgba", "hsla"];
    }

    this.init(ele, newConfig);
  }
}

/**
 * 手动更新颜色
 * @param {*} color 
 * @returns 
 */

function updateColor(color) {
  if (!isValidColor(color)) return util$1.ewError(ERROR_VARIABLE.UPDATE_PARAM_COLOR_ERROR);
  if (!this._privateConfig.pickerFlag) util$1.ewWarn(ERROR_VARIABLE.UPDATE_PARAM_COLOR_WARN);
  let rgbaColor = colorToRgba(color);
  this.hsvaColor = colorRgbaToHsva(rgbaColor);
  setColorValue(this, this.panelWidth, this.panelHeight, true);
}

function initBoxSize(context, config) {
  let b_width, b_height; //自定义颜色选择器的类型

  if (util$1.isString(config.size)) {
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
  } else if (util$1.isDeepObject(config.size)) {
    b_width = config.size.width && (util$1.isNumber(config.size.width) || util$1.isString(config.size.width)) ? (parseInt(config.size.width) <= 25 ? 25 : parseInt(config.size.width)) + 'px' : '40px';
    b_height = config.size.height && (util$1.isNumber(config.size.height) || util$1.isString(config.size.height)) ? (parseInt(config.size.height) <= 25 ? 25 : parseInt(config.size.height)) + 'px' : '40px';
  } else {
    return util$1.ewError(ERROR_VARIABLE.CONFIG_SIZE_ERROR);
  }

  context._privateConfig.boxSize.b_width = b_width;
  context._privateConfig.boxSize.b_height = b_height;
  return Promise.resolve(context._privateConfig.boxSize);
}
/**
 * 初始化
 * @param {*} bindElement 
 * @param {*} config 
 * @returns 
 */

function initFunction(bindElement, config) {
  if (!util$1.isDom(bindElement)) {
    return this.beforeInit(bindElement, config, ERROR_VARIABLE.DOM_ERROR);
  }

  config = util$1.ewAssign(baseDefaultConfig, config);
  initBoxSize(this, config); //渲染选择器

  this.render(bindElement, config);
}

/**
 * 点击目标元素之外关闭颜色选择器
 * @param {*} context 
 * @param {*} config 
 */

function handleClickOutSide(context, config) {
  util$1.clickOutSide(context, config, () => {
    if (!config.isClickOutside) {
      return;
    }

    if (context._privateConfig.pickerFlag) {
      context._privateConfig.pickerFlag = false;
      close(getAnimationType({
        config: config
      }), context.$Dom.picker, config.pickerAnimationTime);

      if (config.hasBox && config.boxBgColor) {
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
  let child = el.firstElementChild;

  if (!util$1.hasClass(child, 'ew-color-picker-container')) {
    child = el;
  }

  return !bool ? util$1.$('.' + prop) : util$1.$$('.' + prop);
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
        barRect = util$1.getRect(bar);
  const barThumbPosition = Math.max(0, Math.min(position - barRect[positionProp], barPosition));
  util$1.setCss(thumb, barProp, barThumbPosition + 'px');
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
  const {
    isAlphaHorizontal,
    $Dom: {
      alphaBar,
      alphaBarThumb
    }
  } = context;
  const value = setAlphaHuePosition(isAlphaHorizontal, alphaBar, alphaBarThumb, position);
  const {
    barPosition,
    barThumbPosition
  } = value;
  let currentValue = barPosition - barThumbPosition <= 0 ? 0 : barPosition - barThumbPosition;
  let alpha = isAlphaHorizontal ? 1 - currentValue / barPosition : currentValue / barPosition;
  context.hsvaColor.a = alpha >= 1 ? 1 : alpha.toFixed(2);
  changeElementColor(context, true);
}
/**
 * 改变色调
 * @param {*} context 
 * @param {*} position
 */

function changeHue(context, position) {
  const {
    isHueHorizontal,
    $Dom: {
      hueBar,
      hueThumb,
      pickerPanel
    },
    hsvaColor
  } = context;
  let value = setAlphaHuePosition(isHueHorizontal, hueBar, hueThumb, position);
  const {
    barThumbPosition,
    barPosition
  } = value;
  context.hsvaColor.h = cloneColor(hsvaColor).h = parseInt(360 * barThumbPosition / barPosition);
  util$1.setCss(pickerPanel, 'background', colorRgbaToHex(colorHsvaToRgba(cloneColor(context.hsvaColor))));
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
  util$1.setSomeCss(scope.$Dom.pickerCursor, [{
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
  if (!isValidColor(value) || util$1.removeAllSpace(scope.prevInputValue) === util$1.removeAllSpace(value)) return;
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
          a: Number(hslaArr[3]) || 1
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

function onClearColor(scope) {
  scope._privateConfig.pickerFlag = false;
  close(getAnimationType(scope), scope.$Dom.picker, scope.config.pickerAnimationTime);
  scope.config.defaultColor = scope._privateConfig.colorValue = "";
  scope.config.clear(scope.config.defaultColor, scope);
  setBoxBackground(scope.$Dom.box, scope.config.defaultColor);
}
/**
 * 确定
 * @param {*} scope 
 */

function onSureColor(scope) {
  const result = scope.config.alpha ? colorHsvaToRgba(scope.hsvaColor) : colorRgbaToHex(colorHsvaToRgba(scope.hsvaColor));
  scope._privateConfig.pickerFlag = false;
  close(getAnimationType(scope), scope.$Dom.picker, scope.config.pickerAnimationTime);
  scope.config.defaultColor = scope._privateConfig.colorValue = result;
  changeElementColor(scope);
  scope.config.sure(result, scope);
  setBoxBackground(scope.$Dom.box, scope.config.defaultColor);
}

function showColorPickerWithNoBox(context) {
  setTimeout(() => {
    const ani = getAnimationType(context);
    context._privateConfig.pickerFlag = true;

    if (util$1.getCss(context.$Dom.picker, 'display') === 'none') {
      open(ani, context.$Dom.picker, context.config.pickerAnimationTime);
    }

    setColorValue(context, context.panelWidth, context.panelHeight, false);
  }, 0);
}

/**
 *  初始化动画
 * @param {*} context 
 */

function initAnimation(context) {
  //颜色选择器打开的动画初始设置
  const expression = getAnimationType(context);
  util$1.setCss(context.$Dom.picker, expression ? 'display' : 'opacity', expression ? 'none' : 0);
}
/**
 * 初始化预定义颜色
 * @param {*} items 
 * @param {*} context 
 */

function initPreDefineHandler(items, context) {
  // get the siblings
  const siblings = el => Array.prototype.filter.call(el.parentElement.children, child => child !== el);

  items.map(item => {
    const clickHandler = event => {
      util$1.addClass(item, 'ew-pre-define-color-active');
      siblings(item).forEach(sibling => util$1.removeClass(sibling, 'ew-pre-define-color-active'));
      const bgColor = util$1.getCss(event.target, 'background-color');
      context.hsvaColor = colorRgbaToHsva(bgColor);
      setColorValue(context, context.panelWidth, context.panelHeight, true);
      changeElementColor(context);
    };

    const blurHandler = event => util$1.removeClass(event.target, 'ew-pre-define-color-active');

    [{
      type: "click",
      handler: clickHandler
    }, {
      type: "blur",
      handler: blurHandler
    }].forEach(t => {
      if (!context.config.disabled && util$1.ewObjToArray(item.classList).indexOf('ew-pre-define-color-disabled') === -1) {
        util$1.on(item, t.type, t.handler);
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
  // 初始化逻辑
  let scope = this;
  this.$Dom = Object.create(null); // cache the dom

  this.$cacheDom = Object.create(null);
  this.$Dom.rootElement = ele;
  this.$Dom.picker = getELByClass(ele, 'ew-color-picker');
  this.$Dom.pickerPanel = getELByClass(ele, 'ew-color-panel');
  this.$Dom.pickerCursor = getELByClass(ele, 'ew-color-cursor');

  if (this.isHueHorizontal || this.isAlphaHorizontal) {
    this.$Dom.horizontalSlider = getELByClass(ele, 'ew-is-horizontal');
  }

  if (!this.isHueHorizontal || !this.isAlphaHorizontal) {
    this.$Dom.verticalSlider = getELByClass(ele, 'ew-is-vertical');
  }

  initColor(this, config);
  const panelWidth = this.panelWidth = parseInt(util$1.getCss(this.$Dom.pickerPanel, 'width'));
  const panelHeight = this.panelHeight = parseInt(util$1.getCss(this.$Dom.pickerPanel, 'height'));
  const rect = util$1.getRect(ele);
  this.panelLeft = rect.left;
  this.panelTop = rect.top + rect.height;
  this.$Dom.preDefineItem = getELByClass(ele, 'ew-pre-define-color', true); // 预定义颜色逻辑

  if (this.$Dom.preDefineItem.length) {
    const preDefineItemArray = util$1.ewObjToArray(this.$Dom.preDefineItem);
    this.$cacheDom.preDefineItemContainer = preDefineItemArray[0].parentElement;
    initPreDefineHandler(preDefineItemArray, scope);
  } // 色阶柱逻辑


  if (config.hue) {
    this.$Dom.hueBar = getELByClass(ele, 'ew-color-slider-bar');
    this.$Dom.hueThumb = getELByClass(ele, 'ew-color-slider-thumb'); // cache the hue node

    this.$cacheDom.hueContainer = this.$Dom.hueBar.parentElement;

    if (!config.disabled) {
      //hue的点击事件
      util$1.on(this.$Dom.hueBar, 'click', event => changeHue(scope, this.isHueHorizontal ? event.x : event.y)); //hue 轨道的拖拽事件

      this.bindEvent(this.$Dom.hueThumb, (scope, el, x, y) => changeHue(scope, this.isHueHorizontal ? x : y));
    }
  } // 透明度柱


  if (config.alpha) {
    this.$Dom.alphaBar = getELByClass(ele, 'ew-alpha-slider-bar');
    this.$Dom.alphaBarBg = getELByClass(ele, 'ew-alpha-slider-bg');
    this.$Dom.alphaBarThumb = getELByClass(ele, 'ew-alpha-slider-thumb'); // cache the alpha node

    this.$cacheDom.alphaContainer = this.$Dom.alphaBar.parentElement;

    if (!config.disabled) {
      this.bindEvent(this.$Dom.alphaBarThumb, (scope, el, x, y) => changeAlpha(scope, this.isAlphaHorizontal ? x : y));
      util$1.on(this.$Dom.alphaBar, 'click', event => changeAlpha(scope, this.isAlphaHorizontal ? event.x : event.y));
    }
  }

  initAnimation(scope); // 色块

  if (config.hasBox) {
    this.$Dom.box = getELByClass(ele, 'ew-color-picker-box');

    if (!config.boxDisabled && !config.disabled) {
      this.$Dom.box.clickHandler = () => handlePicker(ele, scope, flag => {
        if (flag) {
          initColor(this, config);
          setColorValue(scope, scope.panelWidth, scope.panelHeight, false);
        }
      });

      util$1.on(this.$Dom.box, 'click', this.$Dom.box.clickHandler);
    }
  } else {
    showColorPickerWithNoBox(this);
  } // 输入框


  if (config.hasInput) {
    this.$Dom.pickerInput = getELByClass(ele, 'ew-color-input');
    util$1.on(this.$Dom.pickerInput, 'blur', event => onInputColor(scope, event.target.value));
  } // 禁用逻辑


  if (config.disabled) {
    if (config.hasInput) {
      if (!util$1.hasClass(this.$Dom.pickerInput, 'ew-input-disabled')) {
        util$1.addClass(this.$Dom.pickerInput, 'ew-input-disabled');
      }

      this.$Dom.pickerInput.disabled = true;
    }

    if (!util$1.hasClass(this.$Dom.picker, 'ew-color-picker-disabled')) {
      util$1.addClass(this.$Dom.picker, 'ew-color-picker-disabled');
    }

    return false;
  } // 点击目标区域之外逻辑


  handleClickOutSide(this, config); // 清空按钮逻辑

  if (config.hasClear) {
    this.$Dom.pickerClear = getELByClass(ele, 'ew-color-clear');
    util$1.on(this.$Dom.pickerClear, 'click', () => onClearColor(scope));
  } // 确定按钮逻辑


  if (config.hasSure) {
    this.$Dom.pickerSure = getELByClass(ele, 'ew-color-sure');
    util$1.on(this.$Dom.pickerSure, 'click', () => onSureColor(scope));
  } // 颜色转换模式逻辑


  if (config.openChangeColorMode) {
    this.$Dom.modeUp = getELByClass(ele, 'ew-color-mode-up');
    this.$Dom.modeDown = getELByClass(ele, 'ew-color-mode-down');
    this.$Dom.modeTitle = getELByClass(ele, "ew-color-mode-title");

    if (config.hasInput) {
      this.modeCount = config.alpha ? 1 : 0;
      this.currentMode = this.colorMode[this.modeCount];
      util$1.on(this.$Dom.modeUp, "click", event => onHandleChangeMode(scope, 'up', () => changeElementColor(scope)));
      util$1.on(this.$Dom.modeDown, "click", event => onHandleChangeMode(scope, 'down', () => changeElementColor(scope)));
    }
  } // 颜色面板逻辑
  //颜色面板点击事件


  util$1.on(this.$Dom.pickerPanel, 'click', event => onClickPanel(scope, event)); //颜色面板拖拽元素拖拽事件

  this.bindEvent(this.$Dom.pickerCursor, (scope, el, x, y) => {
    const left = Math.max(0, Math.min(x - scope.panelLeft, panelWidth));
    const top = Math.max(0, Math.min(y - scope.panelTop, panelHeight));
    changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight);
  });
}

/**
 * 
 * @param {*} disabled 
 * @returns 
 */

function setPredefineDisabled(disabled) {
  return {
    "ew-pre-define-color-disabled": disabled
  };
}
/**
 * 
 * @param {*} color 
 * @returns 
 */

function hasAlpha(color) {
  let alpha = color.slice(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',')[3];
  return {
    "ew-has-alpha": isAlphaColor(color) && alpha < 1 && alpha > 0
  };
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

  notify(key) {
    const subs = this.subs.slice();

    for (let i = 0, len = subs.length; i < len; i++) {
      subs[i].update(key);
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

const notKeys = ["el", "isLog"];
const isNotKey = key => {
  return notKeys.indexOf(key) === -1;
};
function defineReactive(dep, target) {
  const notify = k => {
    if (Dep.DepTarget && isNotKey(k)) {
      dep.notify(k);
    }
  };

  let proxy = new Proxy(target, {
    get(target, key, receiver) {
      let val = Reflect.get(target, key, receiver);

      if (Dep.DepTarget && isNotKey(key)) {
        dep.depend();
      }

      return val;
    },

    set(target, key, receiver) {
      let val = Reflect.set(target, key, receiver);
      notify(key);
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
        notify(key);
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
    this.value = { ...value
    };
    this.reactive = null;
    this.dep = new Dep(); // 为了区分于vue,添加独特的标志属性

    def(value, '__ew__color__picker__ob__', this);
    this.walk(this.value);
  }

  walk(value) {
    this.reactive = defineReactive(this.dep, value);
  }

}

const notUpdateKeys = ["pickerAnimation", "pickerAnimationTime", "sure", "clear", "togglePicker", "changeColor"];

function handleNode(flag, node, parentNode) {
  return new Promise((resolve, reject) => {
    if (!flag) {
      node.remove();
    } else {
      parentNode.appendChild(node);
    }

    resolve();
  });
}

function updateBoxHandler(box, b_width, b_height) {
  if (box) {
    const firstChild = box.firstElementChild;

    if (util$1.hasClass(firstChild, "ew-color-picker-no")) {
      util$1.setCss(firstChild, "line-height", b_height);
    }

    [box, firstChild].forEach(el => {
      util$1.setSomeCss(el, [{
        prop: "width",
        value: b_width
      }, {
        prop: "height",
        value: b_height
      }]);
    });
  }
}

function updateLangHandler(config, pickerClear, pickerSure) {
  initLang(config).then(({
    clearText,
    sureText
  }) => {
    pickerClear.textContent = clearText;
    pickerSure.textContent = sureText;
  });
}
/**
 * 重新渲染颜色选择器
 * @param {*} vm 
 * @param {*} callback 
 */


function render(vm, key, callback) {
  if (notUpdateKeys.indexOf(key) > -1) {
    return;
  }

  setTimeout(() => {
    const {
      $Dom: {
        hueBar,
        alphaBar,
        box,
        pickerSure,
        pickerClear,
        rootElement,
        pickerInput,
        picker
      },
      $cacheDom: {
        hueContainer,
        alphaContainer
      },
      config: {
        hue,
        alpha,
        isClickOutside,
        hasInput,
        pickerAnimationTime
      }
    } = vm;

    switch (key) {
      case "hue":
        {
          handleNode(hue, hueBar, hueContainer).then(() => setBarStyle(vm));
          break;
        }

      case "alpha":
        handleNode(alpha, alphaBar, alphaContainer).then(() => setBarStyle(vm));
        break;

      case "size":
        initBoxSize(vm, vm.config).then(({
          b_width,
          b_height
        }) => updateBoxHandler(box, b_width, b_height));
        break;

      case "isClickOutside":
        handleClickOutSide(vm, vm.config);
        break;

      case "lang":
        updateLangHandler(vm.config, pickerClear, pickerSure);
        break;

      case "userDefineText":
        updateLangHandler(vm.config, pickerClear, pickerSure);
        break;

      case "disabled":
        vm.config[key] ? util$1.addClass(box, "ew-color-picker-box-disabled") : util$1.removeClass(box, "ew-color-picker-box-disabled");
        util$1.setCss(box, "background", vm.config[key] ? "" : vm.config.defaultColor);

        if (vm.config[key]) {
          if (vm._privateConfig.pickerFlag) {
            vm._privateConfig.pickerFlag = false;
            close(getAnimationType(vm), picker, pickerAnimationTime);
          }

          util$1.off(box, "click", box.clickHandler);

          if (hasInput) {
            if (!util$1.hasClass(pickerInput, 'ew-input-disabled')) {
              util$1.addClass(pickerInput, 'ew-input-disabled');
            }

            pickerInput.disabled = true;
          }

          if (!util$1.hasClass(picker, 'ew-color-picker-disabled')) {
            util$1.addClass(picker, 'ew-color-picker-disabled');
          }
        } else {
          if (hasInput) {
            util$1.removeClass(pickerInput, 'ew-input-disabled');
            pickerInput.disabled = false;
          }

          util$1.removeClass(picker, 'ew-color-picker-disabled');
          util$1.on(box, "click", box.clickHandler);
        }

        break;
    }

    if (util$1.isFunction(callback)) {
      callback();
    }
  }, vm.config.pickerAnimationTime);
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

  update(key) {
    const updateHandler = (vm, key) => {
      render(vm, key);
    };

    updateHandler(this._colorPickerInstance, key);
  }

  cleanDeps() {
    if (this.dep) {
      this.dep.subs = [];
    }
  }

  addDep(dep) {
    const id = dep.id;
    this.dep = dep;

    if (!this.depIds.has(id)) {
      this.depIds.add(id);
      dep.addSub(this);
    }
  }

}

const closeIcon = `
<svg 
    t="1634963211095" 
    class="ew-color-picker-close-icon" 
    viewBox="0 0 1024 1024" 
    version="1.1" 
    xmlns="http://www.w3.org/2000/svg" 
    p-id="2424">
    <path 
        d="M504.224 470.288l207.84-207.84a16 16 0 0 1 22.608 0l11.328 11.328a16 16 0 0 1 0 22.624l-207.84 
        207.824 207.84 207.84a16 16 0 0 1 0 22.608l-11.328 11.328a16 16 0 0 1-22.624 0l-207.824-207.84-207.84 
        207.84a16 16 0 0 1-22.608 0l-11.328-11.328a16 16 0 0 1 0-22.624l207.84-207.824-207.84-207.84a16 16 0 0 
        1 0-22.608l11.328-11.328a16 16 0 0 1 22.624 0l207.824 207.84z" p-id="2425"
    >
    </path>
    </svg>
`;
const arrowIcon = `
<svg 
    t="1634963310652" 
    class="ew-color-picker-arrow-icon" 
    viewBox="0 0 1024 1024" 
    version="1.1" 
    xmlns="http://www.w3.org/2000/svg" 
    p-id="3223"
>
    <path 
        d="M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 
        0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 
        44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z" 
        p-id="3224"
    >
    </path>
</svg>
`;

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
  const p_c = config.predefineColor; // validate the predefineColor;

  if (!util$1.isDeepArray(p_c)) {
    return util$1.ewError(ERROR_VARIABLE.PREDEFINE_COLOR_ERROR);
  }

  if (p_c.length) {
    p_c.forEach((color, index) => {
      const isValidColorString = util$1.isString(color) && isValidColor(color);
      const isValidColorObj = util$1.isDeepObject(color) && color.hasOwnProperty('color') && isValidColor(color.color);
      const renderColor = isValidColorString ? color : isValidColorObj ? color.color : '';
      let preColorClassObject = {
        "ew-pre-define-color": true,
        ...hasAlpha(renderColor)
      };

      if (isValidColorObj) {
        preColorClassObject = util$1.ewAssign(preColorClassObject, setPredefineDisabled(color.disabled));
      }

      const preColorClassStr = util$1.classnames(preColorClassObject);
      predefineColorHTML += `
                <div class="${preColorClassStr}" tabindex=${index}>
                    <div class="ew-pre-define-color-item" style="background-color:${renderColor};"></div>
                </div>
            `;
    });
  }
  const {
    b_width,
    b_height
  } = this._privateConfig.boxSize;
  const boxArrowStyle = `width:${b_width};height:${b_height};`;
  const boxNoStyle = `${boxArrowStyle}line-height:${b_height};`; //打开颜色选择器的方框

  const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow" style="${boxArrowStyle}">${arrowIcon}</div>` : `<div class="ew-color-picker-no" style="${boxNoStyle}">${closeIcon}</div>`; //透明度

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

  if (config.disabled || config.boxDisabled) {
    boxDisabledClassName = 'ew-color-picker-box-disabled';
  }

  if (config.defaultColor) {
    if (!isValidColor(config.defaultColor)) {
      return util$1.ewError(ERROR_VARIABLE.DEFAULT_COLOR_ERROR);
    } else {
      config.defaultColor = colorToRgba(config.defaultColor);
    }
  }
  this._privateConfig.colorValue = config.defaultColor;

  if (!config.disabled && this._privateConfig.colorValue) {
    boxBackground = `background:${this._privateConfig.colorValue}`;
  } // 盒子样式


  const boxStyle = `${boxArrowStyle};${boxBackground}`;

  if (config.hasBox) {
    boxHTML = `<div class="ew-color-picker-box ${boxDisabledClassName}" tabIndex="0" style="${boxStyle}">${colorBox}</div>`;
  }

  if (config.hasClear) {
    clearHTML = `<button class="ew-color-clear ew-color-drop-btn">${config.clearText}</button>`;
  }

  if (config.hasSure) {
    sureHTML = `<button class="ew-color-sure ew-color-drop-btn">${config.sureText}</button>`;
  }

  if (config.hasClear || config.hasSure) {
    btnGroupHTML = `<div class="ew-color-drop-btn-group">${clearHTML}${sureHTML}</div>`;
  }

  if (config.hasInput) {
    inputHTML = '<input type="text" class="ew-color-input">';
  }

  if (config.openChangeColorMode) {
    if (!config.alpha || !config.hue) return util$1.ewError(ERROR_VARIABLE.COLOR_MODE_ERROR);
    openChangeColorModeHTML = `<div class="ew-color-mode-container">
        <div class="ew-color-mode-up"></div>
        <div class="ew-color-mode-down"></div>
        </div>`;
    openChangeColorModeLabelHTML = `<label class="ew-color-mode-title">${this.colorMode[1]}</label>`;
  }

  if (config.hasInput || config.hasClear || config.hasSure) {
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
                <div class="ew-color-panel" style="background:red;">
                    <div class="ew-color-white-panel"></div>
                    <div class="ew-color-black-panel"></div>
                    <div class="ew-color-cursor"></div>
                </div>
                ${verticalSliderHTML}
            </div>
            ${horizontalSliderHTML}
            ${dropHTML}
            ${predefineHTML}
        </div>`;
  let isBody = element.tagName.toLowerCase() === 'body';
  let container = document.createElement('div');
  let mountElement = isBody ? container.cloneNode(true) : element;
  mountElement.setAttribute("color-picker-id", this._color_picker_uid);

  if (isBody) {
    mountElement.setAttribute("id", 'placeElement-' + this._color_picker_uid);
    let hasDiv = util$1.$('#placeElement-' + this._color_picker_uid);
    if (hasDiv) hasDiv.parentElement.removeChild(hasDiv);
    mountElement.innerHTML = html;
    util$1.addClass(container, 'ew-color-picker-container');
    container.appendChild(mountElement);
    element.appendChild(container);
  } else {
    element.innerHTML = `<div class="ew-color-picker-container">${html}</div>`;
  }

  this._watcher = new RenderWatcher(this);
  this.config = new Observer(config).reactive;
  this.startMain(mountElement, config);
}

/**
 * 销毁颜色选择器实例
 */

function destroyInstance() {
  const instance = this.$Dom.rootElement;
  const instanceParentElement = instance.parentElement;
  const isContainer = util$1.hasClass(instanceParentElement, 'ew-color-picker-container');

  if (isContainer && instanceParentElement) {
    removeNode(instanceParentElement);
  } else if (instance) {
    removeNode(instance);
  }
}

function removeNode(node) {
  return node.parentElement.removeChild(node);
}

/**
 * 构造函数
 * @param {*} config 
 */

function ewColorPicker$1(config) {
  if (util$1.isUndefined(new.target)) return util$1.ewError(ERROR_VARIABLE.CONSTRUCTOR_ERROR);
  startInit(this, config);
}

const methods = [{
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
}, {
  name: "destroy",
  func: destroyInstance
}];
methods.forEach(method => util$1.addMethod(ewColorPicker$1, method.name, method.func)); // 全局API注册

Object.keys(globalAPI).forEach(key => {
  ewColorPicker$1[key] = globalAPI[key];
});

export { ewColorPicker$1 as default };
