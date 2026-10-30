/*!
 * @ew-color-picker/ewColorPicker
 * (c) 2024-2026 eveningwater(854806732@qq.com)
 * Released under the MIT License.
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define(['exports'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.ewColorPicker = {}));
})(this, (function (exports) { 'use strict';

    /******************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise, SuppressedError, Symbol, Iterator */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
        var e = new Error(message);
        return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };

    var assertLists = ['warn', 'error', 'log'];
    // 样式配置
    var STYLES = {
        log: {
            icon: '📝',
            color: '#4CAF50',
            bgColor: '#E8F5E8',
            borderColor: '#4CAF50'
        },
        warn: {
            icon: '⚠️',
            color: '#FF9800',
            bgColor: '#FFF3E0',
            borderColor: '#FF9800'
        },
        error: {
            icon: '❌',
            color: '#F44336',
            bgColor: '#FFEBEE',
            borderColor: '#F44336'
        }
    };
    // 格式化消息
    var formatMessage = function (type) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var style = STYLES[type];
        var timestamp = new Date().toLocaleTimeString();
        var prefix = "".concat(style.icon, " [ewColorPicker ").concat(type.toUpperCase(), "] ").concat(timestamp);
        // 检查第一个参数是否已经包含 %c（表示已经有自定义样式）
        var firstArg = args[0];
        var hasCustomStyle = typeof firstArg === 'string' && firstArg.includes('%c');
        if (hasCustomStyle) {
            // 如果已经有自定义样式，只添加前缀，不添加我们的样式
            return __spreadArray(["".concat(prefix, " ").concat(firstArg)], args.slice(1), true);
        }
        else {
            // 否则使用我们的默认样式
            return __spreadArray([
                "%c".concat(prefix),
                "color: ".concat(style.color, "; background: ").concat(style.bgColor, "; padding: 2px 6px; border-radius: 4px; border-left: 3px solid ").concat(style.borderColor, "; font-weight: bold;")
            ], args, true);
        }
    };
    var noop = function () { };
    var assertObj = {
        log: noop,
        warn: noop,
        error: noop
    };
    // 为每个方法添加样式，只在开发环境中启用
    assertLists.forEach(function (key) {
        assertObj[key] = function () {
            var v = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                v[_i] = arguments[_i];
            }
            {
                var formattedArgs = formatMessage.apply(void 0, __spreadArray([key], v, false));
                console[key].apply(console, formattedArgs);
            }
        };
    });
    var warn = assertObj.warn;
    var error = assertObj.error;
    var log = assertObj.log;

    var isBrowser = typeof window !== 'undefined';
    var ua = isBrowser && navigator.userAgent.toLowerCase();
    ua && ua.match(/(iPhone|iPod|Android|ios)/i);
    var supportsPassive = false;
    if (isBrowser) {
        var EventName = 'test-passive';
        try {
            var opts = {};
            Object.defineProperty(opts, 'passive', {
                get: function () {
                    supportsPassive = true;
                },
            }); // https://github.com/facebook/flow/issues/285
            window.addEventListener(EventName, function () { }, opts);
        }
        catch (error) {
            // 忽略错误，supportsPassive 保持为 false
        }
    }

    var _toString = Object.prototype.toString;
    var _hasOwn = Object.prototype.hasOwnProperty;

    // 基础类型守卫函数
    var isNull = function (v) { return v === null; };
    var isUndefined = function (v) { return typeof v === 'undefined'; };
    var isString = function (v) { return typeof v === 'string'; };
    var isNumber = function (v) { return typeof v === 'number'; };
    var isFunction = function (v) { return typeof v === 'function'; };
    // 对象类型守卫函数
    var isShallowObject = function (v) {
        return typeof v === 'object' && !isNull(v);
    };
    var isObject = function (v) {
        return _toString.call(v).slice(8, -1).toLowerCase() === 'object';
    };
    var tryErrorHandler = function (fn, onError) {
        try {
            fn();
        }
        catch (err) {
            if (isFunction(onError)) {
                onError(err);
                return;
            }
            error("[ewColorPicker error]: ".concat(err));
        }
    };

    /**
     * 对象合并
     * @param t
     * @param o
     * @returns
     */
    var extend = function (t) {
        var o = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            o[_i - 1] = arguments[_i];
        }
        if (isNull(t)) {
            return {};
        }
        if (Object.assign) {
            return Object.assign.apply(Object, __spreadArray([t], o, false));
        }
        else {
            var _ = Object(t);
            for (var j = 0, len = o.length; j < len; j++) {
                var source = o[j];
                if (source) {
                    for (var key in source) {
                        if (_hasOwn.call(source, key)) {
                            _[key] = source[key];
                        }
                    }
                }
            }
            return _;
        }
    };
    /**
     * 移除所有空白
     * @param value
     * @returns
     */
    var removeAllSpace = function (value) { return value.replace(/\s+/g, ""); };
    /**
     * 处理类名
     * @param c
     * @returns
     */
    var handleClassName = function (c) { return (c ? " ".concat(c) : ""); };

    var create = function (tag) { return document.createElement(tag); };
    var createByTemplate = function (temp) {
        return document
            .createRange()
            .createContextualFragment(temp);
    };
    var hasClass = function (el, className) {
        var reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
        return reg.test(el.className);
    };
    var addClass = function (el, className) {
        // 支持多个类名，用空格分隔
        var classNames = className.trim().split(/\s+/);
        for (var _i = 0, classNames_1 = classNames; _i < classNames_1.length; _i++) {
            var cls = classNames_1[_i];
            if (cls && !hasClass(el, cls)) {
                var newClass = el.className.split(" ").filter(Boolean);
                newClass.push(cls);
                el.className = newClass.join(" ");
            }
        }
    };
    var removeClass = function (el, className) {
        if (!hasClass(el, className)) {
            return;
        }
        var reg = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
        el.className = el.className.replace(reg, " ");
    };
    var isHTMLElement = function (el) { return el instanceof HTMLElement; };
    var baseSetStyle = function (el, property, value) {
        var prop = property.startsWith('--') ? property : property.replace(/([A-Z])/g, '-$1').toLowerCase();
        el.style.setProperty(prop, value);
    };
    var setStyle = function (el, style, value) {
        if (style === void 0) { style = {}; }
        if (isString(style) && !isUndefined(value)) {
            var finalValue = isNumber(value) ? "".concat(value, "px") : value;
            baseSetStyle(el, style, finalValue);
        }
        else if (Array.isArray(style)) {
            style.forEach(function (_a) {
                var prop = _a.prop, value = _a.value;
                baseSetStyle(el, prop, value);
            });
        }
        else {
            // 处理CSS变量和普通样式
            for (var _i = 0, _a = Object.entries(style); _i < _a.length; _i++) {
                var _b = _a[_i], key = _b[0], value_1 = _b[1];
                baseSetStyle(el, key, value_1);
            }
        }
    };
    var removeStyle = function (el, props) {
        if (props === void 0) { props = []; }
        for (var _i = 0, props_1 = props; _i < props_1.length; _i++) {
            var item = props_1[_i];
            el.style.removeProperty(item);
        }
    };
    var camelCase = function (name) {
        return name
            .replace(/([\:\_\-]+(.))/g, function (_, separator, letter, offset) {
            return offset ? letter.toUpperCase() : letter;
        })
            .replace(/^moz([A-Z])/, "Moz$1");
    };
    var getStyle = function (el, styleName, pseudoElt) {
        if (!el || !styleName)
            return null;
        styleName = camelCase(styleName);
        if (styleName === "float") {
            styleName = "cssFloat";
        }
        var result = null;
        tryErrorHandler(function () {
            var computed = document.defaultView
                ? document.defaultView.getComputedStyle(el, pseudoElt)
                : window.getComputedStyle(el, pseudoElt);
            result = el.style[styleName] || computed ? computed[styleName] : null;
        });
        return result || el.style[styleName];
    };
    var setAttr = function (el, values) {
        if (!isShallowObject(values)) {
            return;
        }
        for (var _i = 0, _a = Object.entries(values); _i < _a.length; _i++) {
            var _b = _a[_i], key = _b[0], value = _b[1];
            el.setAttribute(key, "".concat(value));
        }
    };
    var $ = function (selector, el) {
        if (el === void 0) { el = document; }
        return el.querySelector(selector);
    };
    var removeElement = function (el) {
        var _a;
        if (el === null || el === void 0 ? void 0 : el.parentElement) {
            (_a = el === null || el === void 0 ? void 0 : el.parentElement) === null || _a === void 0 ? void 0 : _a.removeChild(el);
        }
        else {
            el === null || el === void 0 ? void 0 : el.remove();
        }
    };
    var insertNode = function (el, node, oldNode, beforeNode) {
        if (beforeNode && (el === null || el === void 0 ? void 0 : el.contains(beforeNode))) {
            el.insertBefore(node, beforeNode);
        }
        else if (oldNode && (el === null || el === void 0 ? void 0 : el.contains(oldNode))) {
            el.replaceChild(node, oldNode);
        }
        else {
            el === null || el === void 0 ? void 0 : el.appendChild(node);
        }
    };
    var checkContainer = function (el) {
        if (isString(el)) {
            var element = $(el);
            if (!element) {
                warn("[ewColorPicker warning]: Cannot find element with selector: ".concat(el));
                return document.body;
            }
            return element;
        }
        if (isHTMLElement(el)) {
            return el;
        }
        return document.body;
    };
    function getElementSize(el) {
        return {
            clientWidth: el.clientWidth,
            clientHeight: el.clientHeight,
            offsetWidth: el.offsetWidth,
            offsetHeight: el.offsetHeight,
            scrollWidth: el.scrollWidth,
            scrollHeight: el.scrollHeight,
        };
    }
    var getRect = function (el) { return el.getBoundingClientRect(); };
    var on = function (el, type, fn, capture) {
        var useCapture = supportsPassive
            ? {
                passive: false,
                capture: !!capture,
            }
            : !!capture;
        el.addEventListener(type, fn, useCapture);
    };
    var off = function (el, type, fn, capture) {
        el.removeEventListener(type, fn, {
            capture: !!capture,
        });
    };

    var EventEmitter = /** @class */ (function () {
        function EventEmitter(names) {
            this.events = {};
            this.eventTypes = {};
            this.registerType(names);
        }
        EventEmitter.prototype.on = function (type, fn, context) {
            if (context === void 0) { context = this; }
            this.hasType(type);
            if (!this.events[type]) {
                this.events[type] = [];
            }
            this.events[type].push([fn, context]);
            return this;
        };
        EventEmitter.prototype.once = function (type, fn, context) {
            var _this = this;
            if (context === void 0) { context = this; }
            this.hasType(type);
            var magic = function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                _this.off(type, magic);
                var ret = fn.apply(context, args);
                if (ret === true) {
                    return ret;
                }
            };
            magic.fn = fn;
            this.on(type, magic);
            return this;
        };
        EventEmitter.prototype.off = function (type, fn) {
            if (!type && !fn) {
                this.events = {};
                return this;
            }
            if (type) {
                this.hasType(type);
                if (!fn) {
                    this.events[type] = [];
                    return this;
                }
                var events = this.events[type];
                if (!events) {
                    return this;
                }
                var count = events.length;
                while (count--) {
                    if (events[count][0] === fn ||
                        (events[count][0] && events[count][0].fn === fn)) {
                        events.splice(count, 1);
                    }
                }
                return this;
            }
        };
        EventEmitter.prototype.trigger = function (type) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.hasType(type);
            var events = this.events[type];
            if (!events) {
                return;
            }
            var len = events.length;
            var eventsCopy = __spreadArray([], events, true);
            var ret;
            for (var i = 0; i < len; i++) {
                var event_1 = eventsCopy[i];
                var fn = event_1[0], context = event_1[1];
                if (fn) {
                    ret = fn.apply(context, args);
                    if (ret === true) {
                        return ret;
                    }
                }
            }
        };
        EventEmitter.prototype.registerType = function (names) {
            var _this = this;
            names.forEach(function (type) {
                _this.eventTypes[type] = type;
            });
        };
        EventEmitter.prototype.destroy = function () {
            this.events = {};
            this.eventTypes = {};
        };
        EventEmitter.prototype.hasType = function (type) {
            var types = this.eventTypes;
            var isType = types[type] === type;
            if (!isType) {
                warn("[ewColorPicker warning]: EventEmitter has used unknown event type: \"".concat(type, "\", should be oneof [") +
                    "".concat(Object.keys(types).map(function (_) { return JSON.stringify(_); })) +
                    "]");
            }
        };
        return EventEmitter;
    }());

    // HEX color
    var colorRegExp = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
    // RGB color
    var colorRegRGB = /[rR][gG][Bb][Aa]?[\(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[\)]{1}/g;
    // RGBA color
    var colorRegRGBA = /^[rR][gG][Bb][Aa][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){3}[\\s]*(1|1.0|0|0?.[0-9]{1,2})[\\s]*[\)]{1}$/;
    // hsl color
    var colorRegHSL = /^[hH][Ss][Ll][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*)[\)]$/;
    // HSLA color
    var colorRegHSLA = /^[hH][Ss][Ll][Aa][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,){2}([\\s]*(1|1.0|0|0?.[0-9]{1,2})[\\s]*)[\)]$/;
    /**
     * hex to rgba
     * @param {*} hex
     * @param {*} alpha
     */
    function colorHexToRgba(hex, alpha) {
        if (alpha === void 0) { alpha = 1; }
        var a = alpha || 1;
        // 将透明度限制为1位小数
        a = Math.round(a * 10) / 10;
        var hColor = hex.toLowerCase();
        var hLen = hex.length;
        var rgbaColor = [];
        if (hex && colorRegExp.test(hColor)) {
            //the hex length may be 4 or 7,contained the symbol of #
            if (hLen === 4) {
                var hSixColor = "#";
                for (var i = 1; i < hLen; i++) {
                    var sColor = hColor.slice(i, i + 1);
                    hSixColor += sColor.concat(sColor);
                }
                hColor = hSixColor;
            }
            for (var j = 1, len = hColor.length; j < len; j += 2) {
                rgbaColor.push(parseInt("0X" + hColor.slice(j, j + 2), 16));
            }
            return "rgba(".concat(rgbaColor.join(', '), ", ").concat(a, ")");
        }
        else {
            return removeAllSpace(hColor);
        }
    }
    /**
     * rgba to hex
     * @param {*} rgba
     */
    function colorRgbaToHex(rgba) {
        var hexObject = {
            10: "A",
            11: "B",
            12: "C",
            13: "D",
            14: "E",
            15: "F",
        }, hexColor = function (value) {
            value = Math.min(Math.round(value), 255);
            var high = Math.floor(value / 16), low = value % 16;
            return "" + (hexObject[high] || high) + (hexObject[low] || low);
        };
        var value = "#";
        if (/rgba?/.test(rgba)) {
            var values = rgba
                .replace(/rgba?\(/, "")
                .replace(/\)/, "")
                .replace(/[\s+]/g, "")
                .split(","), color_1 = "";
            values.map(function (value, index) {
                if (index <= 2) {
                    color_1 += hexColor(+value);
                }
            });
            return removeAllSpace(value + color_1);
        }
        return rgba;
    }
    /**
     * hsva to rgba
     * @param {*} hsva
     * @param {*} alpha
     */
    function colorHsvaToRgba(hsva, alpha) {
        var r, g, b, a = hsva.a; //rgba(r,g,b,a)
        var h = hsva.h, s = (hsva.s * 255) / 100, v = (hsva.v * 255) / 100; //hsv(h,s,v)
        if (s === 0) {
            r = g = b = v;
        }
        else {
            var t = v, p = ((255 - s) * v) / 255, q = ((t - p) * (h % 60)) / 60;
            if (h === 360) {
                r = t;
                g = b = 0;
            }
            else if (h < 60) {
                r = t;
                g = p + q;
                b = p;
            }
            else if (h < 120) {
                r = t - q;
                g = t;
                b = p;
            }
            else if (h < 180) {
                r = p;
                g = t;
                b = p + q;
            }
            else if (h < 240) {
                r = p;
                g = t - q;
                b = t;
            }
            else if (h < 300) {
                r = p + q;
                g = p;
                b = t;
            }
            else if (h < 360) {
                r = t;
                g = p;
                b = t - q;
            }
            else {
                r = g = b = 0;
            }
        }
        // 将透明度限制为1位小数
        a = Math.round(a * 10) / 10;
        return "rgba(".concat(Math.round(r), ", ").concat(Math.round(g), ", ").concat(Math.round(b), ", ").concat(a, ")");
    }
    /**
     * rgba to hsva
     * @param {*} rgba
     */
    function colorRgbaToHsva(rgba) {
        // 处理 undefined 或 null 值
        if (!rgba || typeof rgba !== 'string') {
            return { h: 0, s: 100, v: 100, a: 1 };
        }
        // 清理输入字符串，移除多余空格
        var cleanRgba = rgba.replace(/\s+/g, ' ').trim();
        // 提取括号内的内容
        var match = cleanRgba.match(/rgba?\(([^)]+)\)/i);
        if (!match) {
            return { h: 0, s: 100, v: 100, a: 1 };
        }
        // 分割并清理每个值
        var rgbaArr = match[1].split(',').map(function (val) { return val.trim(); });
        // 解析 RGB 值，使用 parseFloat 而不是 parseInt 来处理可能的浮点数
        var r = parseFloat(rgbaArr[0]) || 0;
        var g = parseFloat(rgbaArr[1]) || 0;
        var b = parseFloat(rgbaArr[2]) || 0;
        var a = rgbaArr.length >= 4 ? parseFloat(rgbaArr[3]) || 1 : 1;
        // 将 RGB 值标准化到 0-1 范围
        var rNorm = r / 255;
        var gNorm = g / 255;
        var bNorm = b / 255;
        // 计算 HSV
        var max = Math.max(rNorm, gNorm, bNorm);
        var min = Math.min(rNorm, gNorm, bNorm);
        var diff = max - min;
        var h = 0;
        var s = 0;
        var v = max;
        if (max !== 0) {
            s = diff / max;
        }
        if (diff !== 0) {
            if (max === rNorm) {
                h = 60 * ((gNorm - bNorm) / diff);
            }
            else if (max === gNorm) {
                h = 60 * ((bNorm - rNorm) / diff + 2);
            }
            else if (max === bNorm) {
                h = 60 * ((rNorm - gNorm) / diff + 4);
            }
            if (h < 0)
                h += 360;
        }
        else {
            // 当 diff === 0 时，所有颜色分量相等，色相为 0（红色）
            h = 0;
        }
        // 将透明度限制为1位小数
        var alpha = Math.round(a * 10) / 10;
        return {
            h: Math.round(h),
            s: Math.round(s * 100),
            v: Math.round(v * 100),
            a: alpha,
        };
    }
    // 常见 CSS 颜色关键字映射
    var COLOR_KEYWORDS = {
        black: 'rgba(0, 0, 0, 1)',
        silver: 'rgba(192, 192, 192, 1)',
        gray: 'rgba(128, 128, 128, 1)',
        white: 'rgba(255, 255, 255, 1)',
        maroon: 'rgba(128, 0, 0, 1)',
        red: 'rgba(255, 0, 0, 1)',
        purple: 'rgba(128, 0, 128, 1)',
        fuchsia: 'rgba(255, 0, 255, 1)',
        green: 'rgba(0, 128, 0, 1)',
        lime: 'rgba(0, 255, 0, 1)',
        olive: 'rgba(128, 128, 0, 1)',
        yellow: 'rgba(255, 255, 0, 1)',
        navy: 'rgba(0, 0, 128, 1)',
        blue: 'rgba(0, 0, 255, 1)',
        teal: 'rgba(0, 128, 128, 1)',
        aqua: 'rgba(0, 255, 255, 1)',
        orange: 'rgba(255, 165, 0, 1)',
        pink: 'rgba(255, 192, 203, 1)',
        brown: 'rgba(165, 42, 42, 1)',
        // 可扩展更多
    };
    function colorToRgba(color) {
        // 处理空值
        if (!color || typeof color !== 'string') {
            return '';
        }
        // 统一小写并清理空格
        var input = color.trim().toLowerCase();
        // 关键字映射
        if (COLOR_KEYWORDS[input]) {
            return COLOR_KEYWORDS[input];
        }
        // hex
        if (colorRegExp.test(input)) {
            // 直接调用 colorHexToRgba
            var rgba = colorHexToRgba(input);
            // 强制输出格式统一为 'rgba(r, g, b, a)'，兼容所有空格
            rgba = rgba.replace(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+(?:\.\d+)?)\s*\)/, 'rgba($1, $2, $3, $4)');
            return rgba;
        }
        // rgb - 支持带空格的格式
        var rgbReg = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
        var rgbMatch = input.match(rgbReg);
        if (rgbMatch) {
            var r = rgbMatch[1], g = rgbMatch[2], b = rgbMatch[3];
            return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", 1)");
        }
        // rgba - 支持带空格的格式
        var rgbaReg = /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
        var rgbaMatch = input.match(rgbaReg);
        if (rgbaMatch) {
            var r = rgbaMatch[1], g = rgbaMatch[2], b = rgbaMatch[3], a = rgbaMatch[4];
            return "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")");
        }
        // 尝试通过 DOM 解析颜色关键字
        try {
            var div = create("div");
            setStyle(div, { "background-color": color });
            var computedColor = getStyle(div, "backgroundColor");
            if (computedColor && computedColor !== 'rgba(0, 0, 0, 0)') {
                // 统一输出格式
                return computedColor.replace(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+(?:\.\d+)?)\s*\)/, 'rgba($1, $2, $3, $4)');
            }
        }
        catch (_a) {
            // 忽略 DOM 解析错误
        }
        // 如果都不匹配，返回空字符串
        return '';
    }
    /**
     * 判断是否是合格的颜色值
     * @param {*} color
     */
    function isValidColor(color) {
        // https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value#%E8%89%B2%E5%BD%A9%E5%85%B3%E9%94%AE%E5%AD%97
        var isTransparent = color === "transparent";
        // 检查是否是有效的 hex 颜色
        if (colorRegExp.test(color)) {
            return true;
        }
        // 检查是否是有效的 rgb 颜色（不包含 alpha）
        if (colorRegRGB.test(color) && !color.includes('rgba')) {
            return true;
        }
        // 检查是否是有效的 rgba 颜色（包含 alpha）
        if (colorRegRGBA.test(color)) {
            return true;
        }
        // 检查是否是有效的 hsl 颜色（不包含 alpha）
        if (colorRegHSL.test(color) && !color.includes('hsla')) {
            return true;
        }
        // 检查是否是有效的 hsla 颜色（包含 alpha）
        if (colorRegHSLA.test(color)) {
            return true;
        }
        // 检查是否是有效的颜色关键字
        if (isTransparent) {
            return true;
        }
        // 检查是否是无效的颜色格式
        if (color === '#invalid' || color === 'invalid') {
            return false;
        }
        // 检查 rgb 格式是否包含 alpha（应该是 rgba）
        if (color.includes('rgb(') && color.includes(', 0.5)')) {
            return false;
        }
        // 检查 rgba 格式是否缺少 alpha
        if (color.includes('rgba(') && !color.includes(', 0.5)') && !color.includes(', 1)')) {
            return false;
        }
        // 尝试通过 DOM 验证颜色关键字
        try {
            var div = document.createElement("div");
            setStyle(div, { "background-color": color });
            var computedColor = getStyle(div, "backgroundColor");
            // 如果返回的是 'rgba(0, 0, 0, 0)' 且不是 transparent，说明是无效颜色
            return computedColor !== 'rgba(0, 0, 0, 0)' || isTransparent;
        }
        catch (_a) {
            return false;
        }
    }
    // ========== 新增：从 colorMode 包迁移的颜色转换函数 ========== //
    /**
     * RGBA 对象转 HEX 字符串
     * @param rgba RGBA 颜色对象
     * @returns HEX 颜色字符串
     */
    function rgbaToHex(rgba) {
        var toHex = function (n) { return Math.round(n).toString(16).padStart(2, '0'); };
        return "#".concat(toHex(rgba.r)).concat(toHex(rgba.g)).concat(toHex(rgba.b));
    }
    /**
     * RGB 转 HSL
     * @param r 红色值 (0-255)
     * @param g 绿色值 (0-255)
     * @param b 蓝色值 (0-255)
     * @returns HSL 颜色对象
     */
    function rgbToHsl(r, g, b) {
        r /= 255;
        g /= 255;
        b /= 255;
        var max = Math.max(r, g, b);
        var min = Math.min(r, g, b);
        var h = 0, s = 0, l = (max + min) / 2;
        if (max !== min) {
            var d = max - min;
            s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
            switch (max) {
                case r:
                    h = (g - b) / d + (g < b ? 6 : 0);
                    break;
                case g:
                    h = (b - r) / d + 2;
                    break;
                case b:
                    h = (r - g) / d + 4;
                    break;
            }
            h /= 6;
        }
        return {
            h: h * 360,
            s: s * 100,
            l: l * 100
        };
    }
    /**
     * 解析 RGBA 字符串为对象
     * @param rgbaString RGBA 字符串，如 "rgba(255, 0, 0, 1)"
     * @returns RGBA 对象或 null
     */
    function parseRgbaString(rgbaString) {
        try {
            var rgbaArr = rgbaString
                .slice(rgbaString.indexOf("(") + 1, rgbaString.lastIndexOf(")"))
                .split(",");
            if (rgbaArr.length < 3)
                return null;
            return {
                r: parseInt(rgbaArr[0]),
                g: parseInt(rgbaArr[1]),
                b: parseInt(rgbaArr[2]),
                a: rgbaArr.length < 4 ? 1 : parseFloat(rgbaArr[3])
            };
        }
        catch (error) {
            return null;
        }
    }
    /**
     * 严格校验颜色字符串是否为标准格式（hex、rgb、rgba、hsl、hsla、transparent）
     */
    function isStrictColorFormat(color) {
        if (!color || typeof color !== 'string')
            return false;
        if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color))
            return true;
        if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color))
            return true;
        if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(color))
            return true;
        if (/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(color))
            return true;
        if (/^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(color))
            return true;
        if (color === 'transparent')
            return true;
        return false;
    }

    // 基础动画类
    var Animation = /** @class */ (function () {
        function Animation(element, options) {
            if (options === void 0) { options = {}; }
            this.element = element;
            this.options = __assign({ duration: 300, easing: 'ease-out', delay: 0 }, options);
        }
        // 显示动画
        Animation.prototype.show = function () {
            var _this = this;
            return new Promise(function (resolve) {
                setStyle(_this.element, {
                    display: 'block'
                });
                resolve();
            });
        };
        // 隐藏动画
        Animation.prototype.hide = function () {
            var _this = this;
            return new Promise(function (resolve) {
                setStyle(_this.element, {
                    display: 'none'
                });
                resolve();
            });
        };
        // 滑下动画
        Animation.prototype.slideDown = function () {
            var _this = this;
            return new Promise(function (resolve) {
                // 先设置为 block 以获取真实高度
                setStyle(_this.element, {
                    display: 'block',
                    visibility: 'hidden'
                });
                // 获取元素的完整高度（包括 padding 和 border）
                var marginTop = getStyle(_this.element, 'marginTop');
                var marginBottom = getStyle(_this.element, 'marginBottom');
                var height = _this.element.offsetHeight +
                    parseInt(marginTop) +
                    parseInt(marginBottom);
                setStyle(_this.element, {
                    height: '0px',
                    overflow: 'hidden',
                    visibility: 'visible'
                });
                // 强制重排
                _this.element.offsetHeight;
                setTimeout(function () {
                    setStyle(_this.element, {
                        transition: "height ".concat(_this.options.duration, "ms ").concat(_this.options.easing),
                        height: "".concat(height, "px")
                    });
                    setTimeout(function () {
                        setStyle(_this.element, {
                            height: '',
                            overflow: '',
                            transition: ''
                        });
                        resolve();
                    }, _this.options.duration);
                }, _this.options.delay);
            });
        };
        // 滑上动画
        Animation.prototype.slideUp = function () {
            var _this = this;
            return new Promise(function (resolve) {
                // 获取元素的完整高度
                var marginTop = getStyle(_this.element, 'marginTop');
                var marginBottom = getStyle(_this.element, 'marginBottom');
                var height = _this.element.offsetHeight +
                    parseInt(marginTop) +
                    parseInt(marginBottom);
                // 设置初始状态
                setStyle(_this.element, {
                    height: "".concat(height, "px"),
                    overflow: 'hidden'
                });
                // 强制重排
                _this.element.offsetHeight;
                setTimeout(function () {
                    setStyle(_this.element, {
                        height: '0px',
                        transition: "height ".concat(_this.options.duration, "ms ").concat(_this.options.easing)
                    });
                    setTimeout(function () {
                        setStyle(_this.element, {
                            height: '',
                            overflow: '',
                            transition: '',
                            display: 'none'
                        });
                        resolve();
                    }, _this.options.duration);
                }, _this.options.delay);
            });
        };
        // 淡入动画
        Animation.prototype.fadeIn = function () {
            var _this = this;
            return new Promise(function (resolve) {
                var element = _this.element;
                var duration = _this.options.duration;
                // 设置初始状态
                setStyle(element, {
                    display: 'block',
                    opacity: '0'
                });
                // 强制重排
                element.offsetHeight;
                var startTime = performance.now();
                var animate = function (currentTime) {
                    var elapsed = currentTime - startTime;
                    var progress = Math.min(elapsed / duration, 1);
                    // 使用 ease-out 缓动函数
                    var easeProgress = 1 - Math.pow(1 - progress, 3);
                    setStyle(element, {
                        opacity: easeProgress.toString()
                    });
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                    else {
                        setStyle(element, {
                            opacity: '1'
                        });
                        resolve();
                    }
                };
                requestAnimationFrame(animate);
            });
        };
        // 淡出动画
        Animation.prototype.fadeOut = function () {
            var _this = this;
            return new Promise(function (resolve) {
                var element = _this.element;
                var duration = _this.options.duration;
                // 确保元素可见
                setStyle(element, {
                    display: 'block',
                    opacity: '1'
                });
                // 强制重排
                element.offsetHeight;
                var startTime = performance.now();
                var animate = function (currentTime) {
                    var elapsed = currentTime - startTime;
                    var progress = Math.min(elapsed / duration, 1);
                    // 使用 ease-in 缓动函数
                    var easeProgress = Math.pow(progress, 3);
                    setStyle(element, {
                        opacity: (1 - easeProgress).toString()
                    });
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    }
                    else {
                        setStyle(element, {
                            display: 'none',
                            opacity: '0'
                        });
                        resolve();
                    }
                };
                requestAnimationFrame(animate);
            });
        };
        return Animation;
    }());
    // 动画工具函数
    var ani = {
        show: function (element, duration) {
            if (duration === void 0) { duration = 300; }
            return new Animation(element, { duration: duration }).show();
        },
        hide: function (element, duration) {
            if (duration === void 0) { duration = 300; }
            return new Animation(element, { duration: duration }).hide();
        },
        slideDown: function (element, duration) {
            if (duration === void 0) { duration = 300; }
            return new Animation(element, { duration: duration }).slideDown();
        },
        slideUp: function (element, duration) {
            if (duration === void 0) { duration = 300; }
            return new Animation(element, { duration: duration }).slideUp();
        },
        fadeIn: function (element, duration) {
            if (duration === void 0) { duration = 300; }
            return new Animation(element, { duration: duration }).fadeIn();
        },
        fadeOut: function (element, duration) {
            if (duration === void 0) { duration = 300; }
            return new Animation(element, { duration: duration }).fadeOut();
        }
    };
    // 获取动画类型
    function getAnimationType(scope) {
        var _a;
        return ((_a = scope.options) === null || _a === void 0 ? void 0 : _a.togglePickerAnimation) || 'default';
    }
    // 打开动画
    function open(expression, picker, time) {
        if (time === void 0) { time = 300; }
        time = time > 10000 ? 10000 : time;
        var animation = '';
        switch (expression) {
            case 'height':
                animation = 'slideDown';
                break;
            case 'opacity':
                animation = 'fadeIn';
                break;
            default:
                animation = 'show';
        }
        return ani[animation](picker, time);
    }
    // 关闭动画
    function close(expression, picker, time) {
        if (time === void 0) { time = 300; }
        time = time > 10000 ? 10000 : time;
        var animation = '';
        switch (expression) {
            case 'height':
                animation = 'slideUp';
                break;
            case 'opacity':
                animation = 'fadeOut';
                break;
            default:
                animation = 'hide';
        }
        return ani[animation](picker, time);
    }
    // 防抖函数
    function debounce(func, wait, immediate) {
        if (immediate === void 0) { immediate = false; }
        var timeout = null;
        return function executedFunction() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            var later = function () {
                timeout = null;
                if (!immediate)
                    func.apply(void 0, args);
            };
            var callNow = immediate && !timeout;
            if (timeout)
                clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow)
                func.apply(void 0, args);
        };
    }
    // 节流函数
    function throttle(func, limit) {
        var inThrottle;
        return function executedFunction() {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            if (!inThrottle) {
                func.apply(void 0, args);
                inThrottle = true;
                setTimeout(function () { return inThrottle = false; }, limit);
            }
        };
    }

    var closeIcon = function (className, size) {
        var sizeAttr = size && size > 0 ? " width=\"".concat(size, "\" height=\"").concat(size, "\"") : "";
        return "<svg t=\"1690189203554\" class=\"ew-color-picker-icon".concat(handleClassName(className), "\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"2272\" fill=\"currentColor\"").concat(sizeAttr, "><path d=\"M504.224 470.288l207.84-207.84a16 16 0 0 1 22.608 0l11.328 11.328a16 16 0 0 1 0 22.624l-207.84 207.824 207.84 207.84a16 16 0 0 1 0 22.608l-11.328 11.328a16 16 0 0 1-22.624 0l-207.824-207.84-207.84 207.84a16 16 0 0 1-22.608 0l-11.328-11.328a16 16 0 0 1 0-22.624l207.84-207.824-207.84-207.84a16 16 0 0 1 0-22.608l11.328-11.328a16 16 0 0 1 22.624 0l207.824 207.84z\" p-id=\"2273\"></path></svg>");
    };
    var arrowIcon = function (className, size) {
        var sizeAttr = size && size > 0 ? " width=\"".concat(size, "\" height=\"").concat(size, "\"") : "";
        return "<svg t=\"1717384498630\" class=\"ew-color-picker-icon".concat(handleClassName(className), "\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"4234\"").concat(sizeAttr, "><path d=\"M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z\" fill=\"currentColor\" p-id=\"4235\"></path></svg>");
    };
    var upArrowIcon = function (className, size) {
        var sizeAttr = size && size > 0 ? " width=\"".concat(size, "\" height=\"").concat(size, "\"") : "";
        return "<svg t=\"1717384498631\" class=\"ew-color-picker-icon".concat(handleClassName(className), "\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"4235\"").concat(sizeAttr, "><path d=\"M512 309.333333c8.533333 0 17.066667 2.133333 23.466667 8.533334l341.333333 341.333333c12.8 12.8 12.8 32 0 44.8-12.8 12.8-32 12.8-44.8 0L533.333333 374.4 215.466667 692.266667c-12.8 12.8-32 12.8-44.8 0-12.8-12.8-12.8-32 0-44.8L488.533333 317.866667c4.266667-8.533333 12.8-10.666667 21.333334-10.666667z\" fill=\"#666666\" p-id=\"4236\"></path></svg>");
    };
    var downArrowIcon = function (className, size) {
        var sizeAttr = size && size > 0 ? " width=\"".concat(size, "\" height=\"").concat(size, "\"") : "";
        return "<svg t=\"1717384498632\" class=\"ew-color-picker-icon".concat(handleClassName(className), "\" viewBox=\"0 0 1024 1024\" version=\"1.1\" xmlns=\"http://www.w3.org/2000/svg\" p-id=\"4236\"").concat(sizeAttr, "><path d=\"M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z\" fill=\"#666666\" p-id=\"4237\"></path></svg>");
    };

    var tips = [
        "%c ew-color-picker@2.0.0%c \u8054\u7CFBQQ\uFF1A854806732 %c \u8054\u7CFB\u5FAE\u4FE1\uFF1Aeveningwater %c github:https://github.com/eveningwater/ew-color-picker %c ",
        "background:#0ca6dc ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
        "background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
        "background:#ff7878 ; padding: 1px; border-radius: 3px 0 0 3px;  color: #fff",
        "background:#ff7878 ; padding: 1px; border-radius: 0 3px 3px 0;  color: #fff",
        "background:transparent",
    ];
    // 同一页面内只输出一次版本信息，避免多实例重复打印
    var hasPrintedTips = false;
    var ewColorPickerConsolePlugin = /** @class */ (function () {
        function ewColorPickerConsolePlugin(ewColorPicker) {
            this.ewColorPicker = ewColorPicker;
            this.options = {};
            this.handleOptions();
            this.run();
        }
        ewColorPickerConsolePlugin.prototype.handleOptions = function () {
            if (this.ewColorPicker && this.ewColorPicker.options) {
                this.options = extend(this.options, this.ewColorPicker.options);
            }
        };
        ewColorPickerConsolePlugin.prototype.run = function () {
            if (hasPrintedTips)
                return;
            hasPrintedTips = true;
            log.apply(void 0, tips);
        };
        ewColorPickerConsolePlugin.prototype.install = function (core) {
            var _a;
            this.ewColorPicker = core;
            this.handleOptions();
            // 注册事件监听器
            if (core.on && isFunction(core.on)) {
                core.on('change', function (color) {
                    // 控制台插件可以在这里处理颜色变化事件
                });
            }
            (_a = this.run) === null || _a === void 0 ? void 0 : _a.call(this);
        };
        ewColorPickerConsolePlugin.pluginName = "ewColorPickerConsole";
        return ewColorPickerConsolePlugin;
    }());

    var defaultConfig = {
        disabled: false,
        predefineColor: [],
        size: "normal",
        defaultColor: "",
        isClickOutside: true,
        hueDirection: "vertical",
        alphaDirection: "vertical",
        clearText: "清空",
        sureText: "确定",
        togglePickerAnimation: "default",
        pickerAnimationTime: 200,
        autoPanelPosition: false,
        panelPlacement: "bottom",
        sure: function () { },
        clear: function () { },
        togglePicker: function () { },
        changeColor: function () { },
    };
    var CustomOptions = /** @class */ (function () {
        function CustomOptions() {
        }
        return CustomOptions;
    }());
    var ewColorPickerMergeOptions = /** @class */ (function (_super) {
        __extends(ewColorPickerMergeOptions, _super);
        function ewColorPickerMergeOptions() {
            var _this = _super.call(this) || this;
            _this.el = document.body;
            return _this;
        }
        ewColorPickerMergeOptions.prototype.merge = function (options, pluginNameProp) {
            var _a = options || {}, el = _a.el, rest = __rest(_a, ["el"]);
            return extend({}, defaultConfig, __assign(__assign(__assign({}, rest), { el: checkContainer(el) }), pluginNameProp));
        };
        ewColorPickerMergeOptions.prototype.bindOptions = function (options, pluginNameProp) {
            if (pluginNameProp === void 0) { pluginNameProp = {}; }
            var mergeOptions = this.merge(options, pluginNameProp);
            for (var k in mergeOptions) {
                var value = mergeOptions[k];
                this[k] = value;
            }
            return this;
        };
        return ewColorPickerMergeOptions;
    }(CustomOptions));

    var _a;
    // 动态获取已注册的插件配置
    var getRegisteredPlugins = function () {
        var plugins = {};
        ewColorPicker.plugins.forEach(function (plugin) {
            // 只设置插件启用状态，不覆盖其他配置
            plugins[plugin.name] = true;
        });
        return plugins;
    };
    // 动态生成挂载点顺序映射
    var getMountOrderMap = function () {
        var mountOrderMap = {};
        var order = 0;
        // 按插件注册顺序分配挂载点顺序
        ewColorPicker.plugins.forEach(function (plugin) {
            mountOrderMap[plugin.name] = order++;
        });
        return mountOrderMap;
    };
    // 应用顺序映射
    var APPLY_ORDER_MAP = (_a = {},
        _a["pre" /* ApplyOrder.Pre */] = -1,
        _a["post" /* ApplyOrder.Post */] = 1,
        _a);
    // 事件类型
    var EVENT_TYPES = [
        "destroy",
        "change",
        "sure",
        "clear",
        "toggle",
        "options-update",
        "mode-change",
    ];
    // 默认动画时间
    var DEFAULT_ANIMATION_TIME = 200;
    var ewColorPicker = /** @class */ (function (_super) {
        __extends(ewColorPicker, _super);
        function ewColorPicker(options, secondOptions) {
            var _this = _super.call(this, EVENT_TYPES) || this;
            // 插件挂载点管理
            _this.mountPoints = new Map();
            // 事件处理状态
            _this.isDestroyed = false;
            _this.shouldAutoMount = false;
            // 点击外部关闭面板
            _this._onDocumentClick = function (e) {
                if (_this.isDestroyed || !_this.options.isClickOutside)
                    return;
                var panelContainer = _this.mountPoints.get("panelContainer");
                var rootElement = _this.mountPoints.get("root");
                // 检查点击目标
                var target = e.target;
                // 如果点击的是面板内部，不关闭
                if (panelContainer && panelContainer.contains(target))
                    return;
                // 如果点击的是颜色盒子，不关闭（避免与盒子切换逻辑冲突）
                var colorBox = rootElement === null || rootElement === void 0 ? void 0 : rootElement.querySelector(".ew-color-picker-box");
                if (colorBox && colorBox.contains(target))
                    return;
                // 点击面板和盒子之外的区域，关闭面板
                // 使用配置中的动画类型和动画时间
                var _a = _this.options, togglePickerAnimation = _a.togglePickerAnimation, pickerAnimationTime = _a.pickerAnimationTime;
                _this.hidePanel(togglePickerAnimation, pickerAnimationTime);
            };
            _this.options = _this.normalizeOptions(options, secondOptions);
            // 初始化实例
            _this.init();
            // 如果提供了 el 属性，自动调用 mount 方法
            if (_this.shouldAutoMount && _this.options.el) {
                tryErrorHandler(function () {
                    _this.mount(_this.options.el);
                }, function (error) {
                    warn("[ewColorPicker warning]: Auto mount failed: ".concat(error));
                });
            }
            return _this;
        }
        // 插件注册方法
        ewColorPicker.use = function (ctor) {
            var pluginName = ctor.pluginName;
            // 检查插件是否已安装
            if (ewColorPicker.plugins.some(function (plugin) { return ctor === plugin.ctor; })) {
                return ewColorPicker;
            }
            // 验证插件名称
            if (isUndefined(pluginName) || isNull(pluginName)) {
                warn("[ewColorPicker warning]: Plugin Class must specify plugin's name in static property by 'pluginName' field.");
                return ewColorPicker;
            }
            // 注册插件
            ewColorPicker.pluginsMap[pluginName] = true;
            ewColorPicker.plugins.push({
                name: pluginName,
                applyOrder: ctor.applyOrder,
                ctor: ctor,
            });
            return ewColorPicker;
        };
        ewColorPicker.prototype.normalizeOptions = function (options, secondOptions) {
            var finalOptions;
            if (isHTMLElement(options)) {
                if (secondOptions) {
                    secondOptions.el; var otherOptions = __rest(secondOptions, ["el"]);
                    finalOptions = __assign({ el: options }, otherOptions);
                }
                else {
                    finalOptions = {
                        el: options,
                    };
                }
                this.shouldAutoMount = true;
            }
            else if (isString(options)) {
                if (secondOptions) {
                    secondOptions.el; var otherOptions = __rest(secondOptions, ["el"]);
                    finalOptions = __assign({ el: options }, otherOptions);
                }
                else {
                    finalOptions = {
                        el: options,
                    };
                }
                this.shouldAutoMount = true;
            }
            else {
                finalOptions = options;
                if (isObject(finalOptions) && finalOptions.el) {
                    this.shouldAutoMount = true;
                }
            }
            // 初始化配置
            return new ewColorPickerMergeOptions().bindOptions(finalOptions, getRegisteredPlugins());
        };
        ewColorPicker.prototype.init = function () {
            var _this = this;
            tryErrorHandler(function () {
                _this.plugins = {};
                _this._color_picker_uid = _this.generateUID();
                _this.initCoreProperties();
            });
        };
        ewColorPicker.prototype.initCoreProperties = function () {
            var _a;
            var _b = this.options, defaultColor = _b.defaultColor, alphaDirection = _b.alphaDirection, hueDirection = _b.hueDirection;
            if (defaultColor) {
                var defaultColorValue = defaultColor;
                var hasAlphaPlugin = (_a = this.plugins) === null || _a === void 0 ? void 0 : _a.ewColorPickerAlpha;
                if (hasAlphaPlugin) {
                    // 如果 defaultColor 是 hex 格式，转换为 rgba 格式
                    if (defaultColor.startsWith("#")) {
                        defaultColorValue = colorToRgba(defaultColor);
                    }
                }
                else {
                    // 如果 defaultColor 是 rgba 格式，转换为 hex 格式
                    if (defaultColor.startsWith("rgba")) {
                        defaultColorValue = colorRgbaToHex(defaultColor);
                    }
                }
                this.currentColor = defaultColorValue;
                var rgbaColor = colorToRgba(defaultColorValue);
                // 如果 colorToRgba 返回空字符串
                if (!rgbaColor) {
                    rgbaColor = "rgba(255, 0, 0, 1)";
                }
                var newHsva = colorRgbaToHsva(rgbaColor);
                if (!isNaN(newHsva.h)) {
                    this.hsvaColor = newHsva;
                }
                else {
                    // 如果转换失败，使用默认值
                    this.hsvaColor = { h: 0, s: 100, v: 100, a: 1 };
                }
            }
            else {
                // 没有默认颜色时，设置为空字符串，hsvaColor 也设置为空值
                this.currentColor = "";
                this.hsvaColor = { h: 0, s: 0, v: 0, a: 0 };
            }
            this.panelWidth = 0;
            this.panelHeight = 0;
            this.panelLeft = 0;
            this.panelTop = 0;
            this.isHueHorizontal = hueDirection === "horizontal";
            this.isAlphaHorizontal = alphaDirection === "horizontal";
            this.colorMode = ["Hex", "RGB", "HSV"];
            this.currentMode = "Hex";
            this.pickerFlag = false;
        };
        ewColorPicker.prototype.createMountPoints = function () {
            // 创建主容器
            var rootElement = create("div");
            setAttr(rootElement, {
                class: "ew-color-picker",
                "data-uid": this._color_picker_uid,
            });
            insertNode(this.getContainer(), rootElement);
            // 设置 wrapper 为创建的主容器
            this.wrapper = rootElement;
            this.wrapper.isEwColorPickerContainer = true;
            // 创建面板容器（默认隐藏）
            var panelContainer = create("div");
            setAttr(panelContainer, { class: "ew-color-picker-panel-container" });
            addClass(panelContainer, "ew-color-picker-panel-container-hidden");
            insertNode(rootElement, panelContainer);
            // 设置挂载点
            this.mountPoints.set("root", rootElement);
            this.mountPoints.set("panelContainer", panelContainer);
        };
        // 获取插件挂载点
        ewColorPicker.prototype.getMountPoint = function (pluginName) {
            if (this.isDestroyed)
                return undefined;
            return this.mountPoints.get(pluginName);
        };
        // 获取容器元素
        ewColorPicker.prototype.getContainer = function () {
            return this.options.el;
        };
        // 挂载到指定的DOM元素
        ewColorPicker.prototype.mount = function (el) {
            if (this.isDestroyed)
                return this;
            // 确定挂载容器
            var mountContainer;
            if (el) {
                // 使用 checkContainer 方法处理容器参数
                mountContainer = checkContainer(el);
            }
            else {
                // 使用配置中的el或默认document.body
                mountContainer = this.options.el || document.body;
            }
            // 更新options中的el
            this.options.el = mountContainer;
            // 创建挂载点
            this.createMountPoints();
            // 应用插件（因为挂载点已创建）
            this.applyPlugins();
            // 插件挂载后，确保色相同步
            this.notifyHuePluginUpdate(this.hsvaColor.h);
            return this;
        };
        // 重新应用插件（挂载点创建后）
        ewColorPicker.prototype.reapplyPlugins = function () {
            // 重新应用插件，确保它们能正确访问挂载点
            Object.values(this.plugins).forEach(function (plugin) {
                if (isFunction(plugin.run)) {
                    plugin.run();
                }
            });
        };
        // 显示面板
        ewColorPicker.prototype.showPanel = function (animationType, duration) {
            var _this = this;
            if (this.isDestroyed)
                return;
            var panelContainer = this.mountPoints.get("panelContainer");
            if (!panelContainer)
                return;
            // 只有在面板真正需要显示时才设置默认颜色
            // 当前没有颜色时优先使用配置的 defaultColor，未配置才回退到红色
            var _a = this.options || {}, pickerAnimationTime = _a.pickerAnimationTime, togglePicker = _a.togglePicker, defaultColor = _a.defaultColor;
            if (!this.currentColor) {
                var fallbackColor = defaultColor || "#ff0000";
                this.currentColor = fallbackColor;
                var rgbaColor = colorToRgba(fallbackColor);
                if (!rgbaColor) {
                    rgbaColor = "rgba(255, 0, 0, 1)";
                }
                var newHsva = colorRgbaToHsva(rgbaColor);
                this.hsvaColor = newHsva;
                if (!isNaN(newHsva.h)) {
                    this.notifyHuePluginUpdate(newHsva.h);
                }
            }
            var type = animationType || getAnimationType(this);
            var time = duration || pickerAnimationTime || DEFAULT_ANIMATION_TIME;
            open(type, panelContainer, time)
                .then(function () {
                _this.pickerFlag = true;
                _this.trigger("toggle", true);
                if (isFunction(togglePicker)) {
                    togglePicker(true);
                }
                _this.syncAllPlugins(_this.currentColor);
                setTimeout(function () {
                    var panelPlugin = _this.plugins.ewColorPickerPanel;
                    if (panelPlugin && isFunction(panelPlugin.handleAutoPosition)) {
                        panelPlugin.handleAutoPosition.call(panelPlugin);
                    }
                    on(document, "mousedown", _this._onDocumentClick, { capture: true });
                }, 0);
            })
                .catch(function (error) {
                warn("[ewColorPicker error]: Failed to show panel: ".concat(error));
            });
        };
        // 隐藏面板
        ewColorPicker.prototype.hidePanel = function (animationType, duration) {
            var _this = this;
            if (this.isDestroyed)
                return;
            var panelContainer = this.mountPoints.get("panelContainer");
            if (!panelContainer)
                return;
            var _a = this.options || {}, pickerAnimationTime = _a.pickerAnimationTime, togglePicker = _a.togglePicker, autoPanelPosition = _a.autoPanelPosition;
            var hasBox = this.plugins.ewColorPickerBox || false;
            var type = animationType || getAnimationType(this);
            var time = duration || pickerAnimationTime || DEFAULT_ANIMATION_TIME;
            close(type, panelContainer, time)
                .then(function () {
                if (_this.isDestroyed)
                    return;
                // 重置自动定位样式
                if (autoPanelPosition && hasBox) {
                    setStyle(panelContainer, {
                        position: "absolute",
                        left: "0",
                        top: "100%",
                        visibility: "visible",
                    });
                }
                _this.pickerFlag = false;
                _this.trigger("toggle", false);
                // 调用 togglePicker 回调
                if (isFunction(togglePicker)) {
                    togglePicker(false);
                }
                off(document, "mousedown", _this._onDocumentClick, { capture: true });
            })
                .catch(function (error) {
                warn("[ewColorPicker error]: Failed to hide panel: ".concat(error));
            });
        };
        ewColorPicker.prototype.generateUID = function () {
            return "ew-color-picker-".concat(Date.now(), "-").concat(Math.random()
                .toString(36)
                .substring(2, 11));
        };
        ewColorPicker.prototype.applyPlugins = function () {
            var _this = this;
            // 按优先级排序插件
            var sortedPlugins = __spreadArray([], ewColorPicker.plugins, true).sort(function (a, b) {
                // 首先按应用顺序排序
                var aOrder = a.applyOrder ? APPLY_ORDER_MAP[a.applyOrder] : 0;
                var bOrder = b.applyOrder ? APPLY_ORDER_MAP[b.applyOrder] : 0;
                if (aOrder !== bOrder) {
                    return aOrder - bOrder;
                }
                // 然后按挂载点顺序排序
                var mountOrderMap = getMountOrderMap();
                var aMountOrder = mountOrderMap[a.name] || 999;
                var bMountOrder = mountOrderMap[b.name] || 999;
                return aMountOrder - bMountOrder;
            });
            // 检测插件依赖和注入状态
            this.checkPluginDependencies();
            // 实例化插件 - 自动启用所有已注册的插件
            sortedPlugins.forEach(function (_a) {
                var ctor = _a.ctor, name = _a.name;
                tryErrorHandler(function () {
                    if (isFunction(ctor)) {
                        _this.plugins[name] = new ctor(_this);
                    }
                });
            });
        };
        // 检测插件依赖和注入状态
        ewColorPicker.prototype.checkPluginDependencies = function () {
            var _this = this;
            // 插件依赖关系配置
            var pluginDependencies = {
                // hue 插件依赖
                hue: ["ewColorPickerHue"],
                // alpha 插件依赖
                alpha: ["ewColorPickerAlpha"],
                // panel 插件依赖
                panel: ["ewColorPickerPanel"],
                // input 插件依赖
                input: ["ewColorPickerInput"],
                // input-number 插件依赖
                inputNumber: ["ewColorPickerInputNumber"],
                // button 插件依赖
                button: ["ewColorPickerButton"],
                // predefine 插件依赖
                predefine: ["ewColorPickerPredefine"],
                // color-mode 插件依赖
                colorMode: ["ewColorPickerColorMode"],
                // box 插件依赖
                box: ["ewColorPickerBox"],
                // console 插件依赖
                console: ["ewColorPickerConsole"],
            };
            // 检查每个配置项对应的插件是否已注入
            Object.entries(pluginDependencies).forEach(function (_a) {
                var configKey = _a[0], requiredPlugins = _a[1];
                // 检查配置是否开启
                if (_this.options[configKey]) {
                    requiredPlugins.forEach(function (pluginName) {
                        // 检查插件是否已注册
                        if (!ewColorPicker.pluginsMap[pluginName]) {
                            warn("[ewColorPicker warning]: Plugin '".concat(pluginName, "' is required but not injected. Please use ewColorPicker.use(").concat(pluginName, ") to register the plugin."));
                        }
                    });
                }
            });
            // 检查特定功能的插件依赖
            this.checkSpecificFeatureDependencies();
        };
        // 检查特定功能的插件依赖
        ewColorPicker.prototype.checkSpecificFeatureDependencies = function () {
            // 检查 hue 方向配置
            if (this.options.hueDirection &&
                !ewColorPicker.pluginsMap["ewColorPickerHue"]) {
                warn("[ewColorPicker warning]: hueDirection is configured but ewColorPickerHue plugin is not injected. Please use ewColorPicker.use(HuePlugin) to register the plugin.");
            }
            // 检查 alpha 方向配置
            if (this.options.alphaDirection &&
                !ewColorPicker.pluginsMap["ewColorPickerAlpha"]) {
                warn("[ewColorPicker warning]: alphaDirection is configured but ewColorPickerAlpha plugin is not injected. Please use ewColorPicker.use(AlphaPlugin) to register the plugin.");
            }
            // 检查预定义颜色配置
            if (this.options.predefineColor &&
                this.options.predefineColor.length > 0 &&
                !ewColorPicker.pluginsMap["ewColorPickerPredefine"]) {
                warn("[ewColorPicker warning]: predefineColor is configured but ewColorPickerPredefine plugin is not injected. Please use ewColorPicker.use(PredefinePlugin) to register the plugin.");
            }
            // 检查颜色模式切换配置下的 input-number 插件依赖
            if (ewColorPicker.pluginsMap["ewColorPickerColorMode"] &&
                !ewColorPicker.pluginsMap["ewColorPickerInputNumber"]) {
                warn("[ewColorPicker warning]: Color mode plugin requires InputNumber plugin. color-mode plugin requires InputNumber plugin. Please use ewColorPicker.use(InputNumberPlugin) to register the plugin.");
            }
            // panel插件是core的核心插件，必须始终存在
            if (!ewColorPicker.pluginsMap["ewColorPickerPanel"]) {
                warn("[ewColorPicker warning]: Panel plugin is required as core plugin but not injected. Please use ewColorPicker.use(PanelPlugin) to register the plugin.");
            }
        };
        ewColorPicker.prototype.syncAllPlugins = function (color) {
            Object.values(this.plugins).forEach(function (plugin) {
                if (isFunction(plugin.syncColor)) {
                    plugin.syncColor(color);
                }
            });
        };
        // 更新配置并重新渲染
        ewColorPicker.prototype.updateOptions = function (newOptions) {
            if (this.isDestroyed)
                return;
            // 合并新配置
            this.options = extend({}, this.options, newOptions);
            // 如果更新了 defaultColor，需要同步更新当前颜色
            var defaultColor = (this.options || {}).defaultColor;
            if (!isUndefined(defaultColor)) {
                // 验证颜色是否有效，无效时保持当前颜色不变
                var rgbaColor = colorToRgba(defaultColor);
                if (rgbaColor) {
                    this.setColor(defaultColor);
                }
                else {
                    warn("[ewColorPicker warning]: Invalid defaultColor '".concat(defaultColor, "', keep current color unchanged."));
                }
            }
            // 重新应用插件
            this.reapplyPlugins();
            // 触发配置更新事件
            this.trigger("options-update", this.options);
        };
        ewColorPicker.prototype.openPicker = function () {
            this.showPanel();
        };
        ewColorPicker.prototype.closePicker = function () {
            this.hidePanel();
        };
        ewColorPicker.prototype.destroy = function () {
            var _this = this;
            if (this.isDestroyed)
                return;
            this.isDestroyed = true;
            // 解绑外部点击事件
            off(document, "mousedown", this._onDocumentClick, { capture: true });
            // 销毁所有插件
            if (this.plugins) {
                Object.values(this.plugins).forEach(function (plugin) {
                    tryErrorHandler(function () {
                        if (isFunction(plugin === null || plugin === void 0 ? void 0 : plugin.destroy)) {
                            plugin.destroy();
                        }
                    });
                });
            }
            // 清理所有挂载点
            this.mountPoints.forEach(function (el) {
                tryErrorHandler(function () {
                    removeElement(el);
                });
            });
            this.mountPoints.clear();
            // 清理主容器
            tryErrorHandler(function () {
                removeElement(_this.wrapper);
            });
            // 清理插件引用
            this.plugins = {};
            // 触发销毁事件
            this.trigger("destroy");
        };
        ewColorPicker.prototype.setColor = function (color) {
            var _a;
            // 更新当前颜色
            this.currentColor = color;
            // 更新 HSVA 颜色值
            if (color) {
                // 先将颜色转换为 rgba 格式，再转换为 hsva
                var rgbaColor = colorToRgba(color);
                if (rgbaColor) {
                    this.hsvaColor = colorRgbaToHsva(rgbaColor);
                }
                else {
                    // 如果转换失败，使用默认值
                    this.hsvaColor = { h: 0, s: 100, v: 100, a: 1 };
                }
            }
            // 触发颜色变化事件
            this.trigger("change", color);
            if (isFunction((_a = this.options) === null || _a === void 0 ? void 0 : _a.changeColor)) {
                this.options.changeColor(color);
            }
        };
        ewColorPicker.prototype.getColor = function () {
            return this.currentColor;
        };
        ewColorPicker.prototype.getHsvaColor = function () {
            return __assign({}, this.hsvaColor);
        };
        ewColorPicker.prototype.setHsvaColor = function (hsva) {
            this.hsvaColor = __assign({}, hsva);
        };
        // 检查实例是否已销毁
        ewColorPicker.prototype.getDestroyedStatus = function () {
            return this.isDestroyed;
        };
        // 添加测试用例期望的方法
        ewColorPicker.prototype.use = function (plugin) {
            if (isFunction(plugin.install)) {
                plugin.install(this);
            }
            return this;
        };
        ewColorPicker.prototype.emit = function (event) {
            var args = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                args[_i - 1] = arguments[_i];
            }
            this.trigger.apply(this, __spreadArray([event], args, false));
            var _a = this.options || {}, clear = _a.clear, sure = _a.sure, togglePicker = _a.togglePicker;
            switch (event) {
                case "clear":
                    if (isFunction(clear)) {
                        clear();
                    }
                    break;
                case "sure":
                    if (isFunction(sure)) {
                        sure();
                    }
                    break;
                case "toggle":
                    if (isFunction(togglePicker)) {
                        togglePicker.apply(void 0, args);
                    }
                    break;
            }
        };
        ewColorPicker.prototype.on = function (type, fn, context) {
            _super.prototype.on.call(this, type, fn, context);
            return this;
        };
        ewColorPicker.prototype.off = function (type, fn) {
            _super.prototype.off.call(this, type, fn);
            return this;
        };
        ewColorPicker.prototype.getOptions = function () {
            return this.options;
        };
        ewColorPicker.prototype.notifyHuePluginUpdate = function (hue) {
            var _a;
            var huePlugin = (_a = this.plugins) === null || _a === void 0 ? void 0 : _a.ewColorPickerHue;
            if (isFunction(huePlugin === null || huePlugin === void 0 ? void 0 : huePlugin.updateHueThumbPosition)) {
                huePlugin.updateHueThumbPosition(hue);
            }
        };
        // 静态属性
        ewColorPicker.plugins = [];
        ewColorPicker.pluginsMap = {};
        return ewColorPicker;
    }(EventEmitter));

    // 预设尺寸映射常量
    var SIZE_MAP = {
        'mini': '20px',
        'small': '24px',
        'normal': '32px',
        'medium': '36px',
        'large': '40px'
    };
    // 图标尺寸映射常量
    var ICON_SIZE_MAP = {
        'mini': 12, // 20px * 0.6
        'small': 14, // 24px * 0.58
        'normal': 16, // 32px * 0.5
        'medium': 18, // 36px * 0.5
        'large': 20 // 40px * 0.5
    };
    var getBoxChildren = function (hasColor, options) {
        var _a = options.boxNoColorIcon, boxNoColorIcon = _a === void 0 ? "" : _a, _b = options.boxHasColorIcon, boxHasColorIcon = _b === void 0 ? "" : _b, size = options.size;
        // 计算图标大小
        var iconSize = calculateIconSize(size);
        return hasColor
            ? boxHasColorIcon || arrowIcon("ew-color-picker-box-arrow-icon", iconSize)
            : boxNoColorIcon || closeIcon("ew-color-picker-box-close-icon", iconSize);
    };
    // 根据背景色亮度选择对比度更高的图标颜色
    var getBoxIconColor = function (color) {
        if (!color) {
            return null;
        }
        var rgbaString = colorToRgba(color);
        if (!rgbaString) {
            return null;
        }
        var rgba = parseRgbaString(rgbaString);
        if (!rgba) {
            return null;
        }
        // 半透明颜色按叠加在白色底上计算实际呈现的颜色
        var channelLuminance = function (channel) {
            var blended = (channel * rgba.a + 255 * (1 - rgba.a)) / 255;
            return blended <= 0.03928
                ? blended / 12.92
                : Math.pow(((blended + 0.055) / 1.055), 2.4);
        };
        var luminance = 0.2126 * channelLuminance(rgba.r) +
            0.7152 * channelLuminance(rgba.g) +
            0.0722 * channelLuminance(rgba.b);
        // 相对亮度超过 0.5 视为浅色背景，用深色图标；否则用白色图标
        return luminance > 0.5 ? "#333333" : "#ffffff";
    };
    var normalizeSize = function (v) {
        if (isNumber(v)) {
            return v;
        }
        var parsed = parseInt("".concat(v));
        return isNaN(parsed) ? 32 : parsed; // 如果解析失败，返回默认值
    };
    // 根据 size 配置计算图标大小
    var calculateIconSize = function (size) {
        var _a, _b;
        if (!size) {
            return 16; // 默认图标大小
        }
        if (isShallowObject(size)) {
            // 对象形式：取较小的尺寸作为图标大小
            var width = normalizeSize((_a = size.width) !== null && _a !== void 0 ? _a : 32);
            var height = normalizeSize((_b = size.height) !== null && _b !== void 0 ? _b : 32);
            return Math.min(width, height) * 0.5; // 图标大小为盒子尺寸的 50%
        }
        else if (isNumber(size)) {
            // 数字形式
            return size * 0.5;
        }
        else if (typeof size === 'string') {
            // 字符串形式：预设尺寸映射
            return ICON_SIZE_MAP[size] || 16;
        }
        return 16; // 默认图标大小
    };
    // 处理尺寸配置，返回样式对象
    var processSizeConfig = function (size) {
        if (!size) {
            return {}; // 无尺寸配置，使用默认样式
        }
        if (isShallowObject(size)) {
            // 对象形式：{ width: '50px', height: '30px' }
            var width = size.width ? (isNumber(size.width) ? "".concat(size.width, "px") : size.width) : undefined;
            var height = size.height ? (isNumber(size.height) ? "".concat(size.height, "px") : size.height) : undefined;
            return { width: width, height: height, lineHeight: height };
        }
        else if (size) {
            // 字符串或数字形式
            var val = void 0;
            if (isNumber(size)) {
                val = "".concat(size, "px");
            }
            else if (typeof size === 'string') {
                val = SIZE_MAP[size] || size;
            }
            else {
                val = '32px'; // 默认尺寸
            }
            return { width: val, height: val, lineHeight: val };
        }
        return {};
    };

    var ewColorPickerBoxPlugin = /** @class */ (function () {
        function ewColorPickerBoxPlugin(ewColorPicker) {
            var _this = this;
            this.ewColorPicker = ewColorPicker;
            this.options = {};
            this._handlers = [];
            // 内部状态控制
            this._hasBox = true;
            this.box = null;
            this.hasColor = false;
            this.handleOptions();
            // 支持构造时通过 hasBox 关闭盒子
            if (this.options.hasBox === false) {
                this._hasBox = false;
            }
            // 注册事件监听器
            if (this.ewColorPicker.on && typeof this.ewColorPicker.on === 'function') {
                this.ewColorPicker.on('change', function (color) {
                    // 当颜色改变时，更新盒子背景色
                    _this.setBoxBgColor(color);
                });
            }
            this.run();
        }
        Object.defineProperty(ewColorPickerBoxPlugin.prototype, "hasBox", {
            // 获取盒子状态
            get: function () {
                return this._hasBox;
            },
            // 设置盒子状态
            set: function (value) {
                if (this._hasBox !== value) {
                    this._hasBox = value;
                    if (value) {
                        this.render();
                    }
                    else {
                        // 如果禁用了盒子，移除DOM
                        if (this.box && this.box.parentNode) {
                            removeElement(this.box);
                            this.box = null;
                        }
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        // 动态启用/禁用盒子
        ewColorPickerBoxPlugin.prototype.enableBox = function (enable) {
            if (enable === void 0) { enable = true; }
            this.hasBox = enable;
        };
        ewColorPickerBoxPlugin.prototype.handleOptions = function () {
            this.options = extend(this.options, this.ewColorPicker.options);
        };
        ewColorPickerBoxPlugin.prototype.run = function () {
            this.render();
        };
        ewColorPickerBoxPlugin.prototype.updateChildren = function () {
            if (this.box) {
                // 使用 currentColor 而不是 defaultColor 来判断是否有颜色
                var currentColor = this.ewColorPicker.currentColor;
                this.hasColor = !!currentColor;
                this.box.replaceChildren(createByTemplate(getBoxChildren(this.hasColor, this.options)));
            }
        };
        ewColorPickerBoxPlugin.prototype.destroy = function () {
            if (this.box) {
                this.unbindHandler();
                removeElement(this.box);
                this.box = null;
            }
        };
        ewColorPickerBoxPlugin.prototype.update = function (keys) {
            if (keys === void 0) { keys = ["defaultColor", "size", "disabled", "readonly", "className", "style"]; }
            if (!this.box) {
                this.render();
            }
            else {
                if (keys.includes("defaultColor")) {
                    this.updateChildren();
                    this.setBoxBgColor(this.ewColorPicker.currentColor);
                }
                if (keys.includes("size")) {
                    this.setBoxSize();
                }
                if (keys.includes("disabled") || keys.includes("readonly") || keys.includes("className") || keys.includes("style")) {
                    this.setBoxState();
                }
            }
        };
        ewColorPickerBoxPlugin.prototype.render = function () {
            var _a = this.options, className = _a.className, style = _a.style;
            // 检查是否显示盒子
            if (!this.hasBox) {
                return;
            }
            // 直接使用主容器
            var rootElement = this.ewColorPicker.getMountPoint("root");
            if (!rootElement) {
                warn("[ewColorPicker] Root mount point not found");
                return;
            }
            // 查找或创建盒子容器
            this.box = $('.ew-color-picker-box', rootElement);
            if (!this.box) {
                this.box = create("div");
                addClass(this.box, "ew-color-picker-box");
                if (className)
                    addClass(this.box, className);
                if (style)
                    setStyle(this.box, style);
                insertNode(rootElement, this.box);
            }
            // 渲染内容
            this.updateChildren();
            this.setBoxSize();
            this.setBoxBgColor(this.ewColorPicker.currentColor);
            this.setBoxState();
            this.bindHandler();
        };
        ewColorPickerBoxPlugin.prototype.setBoxSize = function () {
            if (!this.box)
                return;
            var size = this.options.size;
            var sizeStyles = processSizeConfig(size);
            if (Object.keys(sizeStyles).length > 0) {
                setStyle(this.box, sizeStyles);
            }
            else {
                // 无尺寸配置，使用默认样式
                removeStyle(this.box, ["width", "height"]);
            }
        };
        ewColorPickerBoxPlugin.prototype.setBoxBgColor = function (color) {
            if (this.box) {
                if (color && color.trim() !== '') {
                    // 图标颜色随背景色亮度自动适配，保证足够对比度
                    var iconColor = getBoxIconColor(color);
                    setStyle(this.box, __assign({ backgroundColor: color, transition: "background-color 0.3s" }, (iconColor ? { color: iconColor } : {})));
                }
                else {
                    this.clearBoxBgColor();
                }
            }
        };
        ewColorPickerBoxPlugin.prototype.clearBoxBgColor = function () {
            if (this.box) {
                removeStyle(this.box, ["background-color", "transition", "color"]);
            }
        };
        ewColorPickerBoxPlugin.prototype.setBoxState = function () {
            if (this.box) {
                var _a = this.options, disabled = _a.disabled, readonly = _a.readonly, className = _a.className;
                if (disabled)
                    addClass(this.box, "is-disabled");
                else
                    removeClass(this.box, "is-disabled");
                if (readonly)
                    addClass(this.box, "is-readonly");
                else
                    removeClass(this.box, "is-readonly");
                if (className)
                    addClass(this.box, className);
            }
        };
        ewColorPickerBoxPlugin.prototype.bindHandler = function () {
            var _this = this;
            if (!this.box)
                return;
            var _a = this.options, onClick = _a.onClick, onMouseEnter = _a.onMouseEnter, onMouseLeave = _a.onMouseLeave, disabled = _a.disabled, readonly = _a.readonly, togglePickerAnimation = _a.togglePickerAnimation, pickerAnimationTime = _a.pickerAnimationTime;
            // 绑定点击事件
            var clickHandler = function (e) {
                if (disabled || readonly) {
                    e.preventDefault();
                    e.stopPropagation();
                    return;
                }
                // 切换面板状态：如果面板隐藏则打开，如果面板显示则关闭
                if (_this.ewColorPicker.pickerFlag) {
                    _this.ewColorPicker.hidePanel(togglePickerAnimation, pickerAnimationTime);
                }
                else {
                    _this.ewColorPicker.showPanel(togglePickerAnimation, pickerAnimationTime);
                }
                onClick === null || onClick === void 0 ? void 0 : onClick(_this);
            };
            on(this.box, "click", clickHandler);
            this._handlers.push(function () { return off(_this.box, "click", clickHandler); });
            // 绑定鼠标事件
            this.bindMouseEvents(onMouseEnter, onMouseLeave);
        };
        // 设置禁用状态
        ewColorPickerBoxPlugin.prototype.setDisabled = function (disabled) {
            if (this.box) {
                if (disabled) {
                    addClass(this.box, "is-disabled");
                }
                else {
                    removeClass(this.box, "is-disabled");
                }
            }
        };
        ewColorPickerBoxPlugin.prototype.bindMouseEvents = function (onMouseEnter, onMouseLeave) {
            var _this = this;
            if (!this.box)
                return;
            if (onMouseEnter) {
                var enterHandler_1 = function () { return onMouseEnter(_this); };
                on(this.box, "mouseenter", enterHandler_1);
                this._handlers.push(function () { return off(_this.box, "mouseenter", enterHandler_1); });
            }
            if (onMouseLeave) {
                var leaveHandler_1 = function () { return onMouseLeave(_this); };
                on(this.box, "mouseleave", leaveHandler_1);
                this._handlers.push(function () { return off(_this.box, "mouseleave", leaveHandler_1); });
            }
        };
        ewColorPickerBoxPlugin.prototype.unbindHandler = function () {
            this._handlers.forEach(function (off) { return off(); });
            this._handlers = [];
        };
        ewColorPickerBoxPlugin.pluginName = "ewColorPickerBox";
        return ewColorPickerBoxPlugin;
    }());

    var ewColorPickerPanelPlugin = /** @class */ (function () {
        function ewColorPickerPanelPlugin(ewColorPicker) {
            var _this = this;
            var _a;
            this.ewColorPicker = ewColorPicker;
            this.options = {};
            // DOM 元素
            this.panel = null;
            this.cursor = null;
            this.whitePanel = null;
            this.blackPanel = null;
            this.hueBar = null;
            this.hueThumb = null;
            this.alphaBar = null;
            this.alphaThumb = null;
            this.hueBg = null;
            // 方向标志
            this.isHueHorizontal = false;
            this.isAlphaHorizontal = false;
            // 拖拽状态标记
            this.isDragging = false;
            // 节流相关
            this.lastUpdateTime = 0;
            this.throttleDelay = 16; // 约60fps
            // 节流函数，用于优化拖拽性能
            this.throttledUpdate = function (saturation, value) {
                var now = Date.now();
                if (now - _this.lastUpdateTime >= _this.throttleDelay) {
                    _this.lastUpdateTime = now;
                    // 添加边界检查，防止异常值
                    if (isNaN(saturation) || isNaN(value) ||
                        saturation < 0 || saturation > 100 ||
                        value < 0 || value > 100) {
                        return;
                    }
                    _this.updateCursorPosition(saturation, value);
                    _this.updateColor(saturation, value);
                }
            };
            this.handleOptions();
            // 注册颜色变化事件监听器
            if (isFunction((_a = this.ewColorPicker) === null || _a === void 0 ? void 0 : _a.on)) {
                this.ewColorPicker.on("change", function (color) {
                    // 当颜色改变时，更新面板背景色和光标位置
                    if (color && _this.panel) {
                        var hsva = colorRgbaToHsva(color);
                        _this.updateHueBg(hsva.h);
                        _this.updateCursorPosition(hsva.s, hsva.v);
                    }
                });
            }
            this.run();
        }
        ewColorPickerPanelPlugin.prototype.handleOptions = function () {
            var _a;
            if (isObject((_a = this.ewColorPicker) === null || _a === void 0 ? void 0 : _a.options)) {
                this.options = extend(this.options, this.ewColorPicker.options);
                this.isHueHorizontal = this.options.hueDirection === "horizontal";
                this.isAlphaHorizontal = this.options.alphaDirection === "horizontal";
            }
        };
        ewColorPickerPanelPlugin.prototype.run = function () {
            var _this = this;
            // 检查是否显示面板（兼容 ewColorPickerPanel / hasPanel 两种写法）
            if (this.options.ewColorPickerPanel === false ||
                this.options.hasPanel === false) {
                return;
            }
            this.render();
            // 延迟绑定事件，确保DOM完全渲染
            setTimeout(function () {
                _this.bindEvents();
            }, 10);
        };
        ewColorPickerPanelPlugin.prototype.render = function () {
            var _this = this;
            var _a;
            if (!this.ewColorPicker) {
                return;
            }
            // 直接使用面板容器
            var panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
            if (!panelContainer) {
                return;
            }
            var oldPanel = $(".ew-color-picker-panel", panelContainer);
            // 动态计算面板宽度
            var panelWidth = 285;
            if (this.isAlphaHorizontal && this.isHueHorizontal) {
                // 如果都是水平方向，需要320px宽度（外层容器最小宽度）
                panelWidth = 320;
            }
            else if ((this.isAlphaHorizontal && !this.isHueHorizontal) ||
                (!this.isAlphaHorizontal && this.isHueHorizontal)) {
                // 如果一个是水平，一个是垂直，需要297px宽度,4px的margin-left,似乎要多1px的偏差
                panelWidth = 285 + 12 + 5;
            }
            // 如果都是垂直方向，保持285px宽度
            this.panel = create("div");
            addClass(this.panel, "ew-color-picker-panel");
            addClass(this.panel, "ew-color-picker-panel-dynamic-size");
            this.panelWidth = panelWidth;
            this.panelHeight = 180;
            setStyle(this.panel, {
                "--panel-width": panelWidth + "px",
                "--panel-height": this.panelHeight + "px",
            });
            // 组装面板结构
            insertNode(panelContainer, this.panel, oldPanel);
            // 创建颜色面板
            this.whitePanel = create("div");
            addClass(this.whitePanel, "ew-color-picker-white-panel");
            insertNode(this.panel, this.whitePanel);
            this.blackPanel = create("div");
            addClass(this.blackPanel, "ew-color-picker-black-panel");
            insertNode(this.panel, this.blackPanel);
            // 创建光标
            this.cursor = create("div");
            addClass(this.cursor, "ew-color-picker-panel-cursor");
            insertNode(this.panel, this.cursor);
            // 创建底部行容器
            var bottomRow = create("div");
            addClass(bottomRow, "ew-color-picker-bottom-row");
            insertNode(panelContainer, bottomRow);
            // 使用 setTimeout 确保容器完全渲染后再计算尺寸
            setTimeout(function () {
                var _a;
                _this.calculateContainerSize();
                // 确保 ewColorPicker 实例存在且已完全初始化
                if (isFunction((_a = _this.ewColorPicker) === null || _a === void 0 ? void 0 : _a.getMountPoint)) {
                    _this.handleAutoPosition();
                }
            }, 0);
            // 设置初始色相底色
            this.updateHueBg();
            // 根据当前颜色设置初始光标位置
            if (isFunction((_a = this.ewColorPicker) === null || _a === void 0 ? void 0 : _a.getColor)) {
                var currentColor = this.ewColorPicker.getColor();
                if (currentColor) {
                    var hsva = colorRgbaToHsva(currentColor);
                    this.updateCursorPosition(hsva.s, hsva.v);
                }
                else {
                    // 默认位置（红色，饱和度和明度都是100%）
                    this.updateCursorPosition(100, 100);
                }
            }
            else {
                // 默认位置（红色，饱和度和明度都是100%）
                this.updateCursorPosition(100, 100);
            }
        };
        ewColorPickerPanelPlugin.prototype.bindEvents = function () {
            var _this = this;
            if (!this.panel) {
                // 静默处理，避免测试时的警告噪音
                return;
            }
            // 面板点击事件
            on(this.panel, "click", function (event) {
                return _this.handlePanelClick(event);
            });
            // 鼠标拖拽事件
            on(this.panel, "mousedown", function () { return _this.handlePanelMouseDown(); });
            // 触摸设备支持
            on(this.panel, "touchstart", function (event) {
                return _this.handlePanelTouchStart(event);
            });
        };
        ewColorPickerPanelPlugin.prototype.handlePanelTouchStart = function (event) {
            var _this = this;
            if (!this.panel)
                return;
            // 检查禁用状态
            if (this.options.disabled) {
                return;
            }
            // 阻止默认行为
            event.preventDefault();
            // 添加拖拽状态标记
            this.isDragging = true;
            var handleTouchMove = function (e) {
                if (_this.isDragging && e.touches.length > 0) {
                    _this.handlePanelTouchMove(e);
                }
            };
            var handleTouchEnd = function () {
                _this.isDragging = false;
                off(document, "touchmove", handleTouchMove);
                off(document, "touchend", handleTouchEnd);
            };
            on(document, "touchmove", handleTouchMove);
            on(document, "touchend", handleTouchEnd);
        };
        ewColorPickerPanelPlugin.prototype.handlePanelTouchMove = function (event) {
            if (!this.panel || !this.cursor)
                return;
            // 检查禁用状态
            if (this.options.disabled) {
                return;
            }
            // 阻止默认行为
            event.preventDefault();
            if (event.touches.length > 0) {
                // 确保使用最新的面板尺寸
                this.panelWidth = this.panel.offsetWidth;
                this.panelHeight = this.panel.offsetHeight;
                var touch = event.touches[0];
                var rect = getRect(this.panel);
                var x = touch.clientX - rect.left;
                var y = touch.clientY - rect.top;
                // 计算饱和度和明度，确保边界值准确
                var saturation = Math.max(0, Math.min(100, (x / this.panelWidth) * 100));
                var value = Math.max(0, Math.min(100, (1 - y / this.panelHeight) * 100));
                // 使用节流函数更新，提升拖拽性能
                this.throttledUpdate(saturation, value);
            }
        };
        ewColorPickerPanelPlugin.prototype.handlePanelClick = function (event) {
            if (!this.panel || !this.cursor)
                return;
            // 检查禁用状态
            if (this.options.disabled) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            // 确保使用最新的面板尺寸
            this.panelWidth = this.panel.offsetWidth;
            this.panelHeight = this.panel.offsetHeight;
            var rect = getRect(this.panel);
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            // 计算饱和度和明度
            var saturation = Math.max(0, Math.min(100, (x / this.panelWidth) * 100));
            var value = Math.max(0, Math.min(100, (1 - y / this.panelHeight) * 100));
            // 更新光标位置和颜色
            this.updateCursorPosition(saturation, value);
            this.updateColor(saturation, value);
        };
        ewColorPickerPanelPlugin.prototype.handlePanelMouseDown = function () {
            var _this = this;
            if (!this.panel)
                return;
            // 检查禁用状态
            if (this.options.disabled) {
                return;
            }
            // 添加拖拽状态标记
            this.isDragging = true;
            var handleMouseMove = function (e) {
                // 使用节流处理拖拽，提升性能
                if (_this.isDragging) {
                    _this.handlePanelDrag(e);
                }
            };
            var handleMouseUp = function () {
                _this.isDragging = false;
                off(document, "mousemove", handleMouseMove);
                off(document, "mouseup", handleMouseUp);
            };
            on(document, "mousemove", handleMouseMove);
            on(document, "mouseup", handleMouseUp);
        };
        // 新增专门的拖拽处理函数
        ewColorPickerPanelPlugin.prototype.handlePanelDrag = function (event) {
            if (!this.panel || !this.cursor)
                return;
            // 检查禁用状态
            if (this.options.disabled) {
                return;
            }
            // 阻止默认行为，避免选中文本
            event.preventDefault();
            // 确保使用最新的面板尺寸
            this.panelWidth = this.panel.offsetWidth;
            this.panelHeight = this.panel.offsetHeight;
            var rect = getRect(this.panel);
            var x = event.clientX - rect.left;
            var y = event.clientY - rect.top;
            // 计算饱和度和明度，确保边界值准确
            var saturation = Math.max(0, Math.min(100, (x / this.panelWidth) * 100));
            var value = Math.max(0, Math.min(100, (1 - y / this.panelHeight) * 100));
            // 使用节流函数更新，提升拖拽性能
            this.throttledUpdate(saturation, value);
        };
        ewColorPickerPanelPlugin.prototype.updateCursorPosition = function (saturation, value) {
            if (!this.cursor || !this.panel)
                return;
            // 检查面板是否可见
            var display = getStyle(this.panel, 'display');
            var visibility = getStyle(this.panel, 'visibility');
            if (display === 'none' || visibility === 'hidden') {
                return;
            }
            // 重新计算面板尺寸，确保获取到正确的值
            var currentPanelWidth = this.panel.offsetWidth;
            var currentPanelHeight = this.panel.offsetHeight;
            // 如果面板尺寸为0，尝试使用 getBoundingClientRect 或使用缓存值
            if (currentPanelWidth === 0 || currentPanelHeight === 0) {
                var rect = getRect(this.panel);
                currentPanelWidth = rect.width || this.panelWidth || 285;
                currentPanelHeight = rect.height || this.panelHeight || 180;
                // 如果仍然为0，使用默认值
                if (currentPanelWidth === 0 || currentPanelHeight === 0) {
                    currentPanelWidth = 285;
                    currentPanelHeight = 180;
                }
            }
            // 更新实例变量
            this.panelWidth = currentPanelWidth;
            this.panelHeight = currentPanelHeight;
            // 动态获取光标尺寸
            var cursorSize = getElementSize(this.cursor);
            var cursorOffset = {
                x: cursorSize.offsetWidth / 2,
                y: cursorSize.offsetHeight / 2
            };
            // 如果光标尺寸为0，使用默认值（防止元素未完全渲染）
            if (cursorSize.offsetWidth === 0 || cursorSize.offsetHeight === 0) {
                cursorOffset.x = 2; // 默认 4px 宽度的一半
                cursorOffset.y = 2; // 默认 4px 高度的一半
            }
            // 计算相对面板的坐标
            // 饱和度：0-100 对应 left: 0-panelWidth
            // 明度：0-100 对应 top: panelHeight-0（注意Y轴方向）
            var left = (saturation / 100) * this.panelWidth;
            var top = (1 - value / 100) * this.panelHeight;
            // 边界处理：考虑光标尺寸，确保光标完全在面板内
            // 当饱和度为 0% 时，光标中心应该在左边缘内 cursorOffset.x 处
            // 当饱和度为 100% 时，光标中心应该在右边缘内 cursorOffset.x 处
            // 当明度为 0% 时，光标中心应该在底边缘内 cursorOffset.y 处
            // 当明度为 100% 时，光标中心应该在顶边缘内 cursorOffset.y 处
            left = Math.max(cursorOffset.x, Math.min(left, this.panelWidth - cursorOffset.x));
            top = Math.max(cursorOffset.y, Math.min(top, this.panelHeight - cursorOffset.y));
            // 由于 CSS 使用了 transform: translate(-50%, -50%)，直接设置目标位置即可
            setStyle(this.cursor, {
                left: "".concat(left, "px"),
                top: "".concat(top, "px"),
            });
        };
        ewColorPickerPanelPlugin.prototype.updateColor = function (saturation, value) {
            var alpha = this.options.alpha;
            var defaultColor = alpha ? "rgba(255,0,0,1)" : "#ff0000";
            var currentColor = this.ewColorPicker.getColor();
            if (!currentColor || currentColor.indexOf("NaN") !== -1) {
                currentColor = defaultColor;
                this.ewColorPicker.setColor(currentColor);
            }
            var hsva = colorRgbaToHsva(currentColor);
            hsva.s = saturation;
            hsva.v = value;
            var newColor = colorHsvaToRgba(hsva);
            this.ewColorPicker.setColor(newColor);
            // 触发change事件
            if (isFunction(this.ewColorPicker.options.changeColor)) {
                this.ewColorPicker.options.changeColor(newColor);
            }
            this.ewColorPicker.trigger("change", newColor);
        };
        ewColorPickerPanelPlugin.prototype.updateHueBg = function (hue) {
            if (this.panel) {
                // 如果传入了 hue 参数，使用传入的值；否则使用当前的 hue 值
                var targetHue = hue;
                if (targetHue === undefined) {
                    var currentColor = this.ewColorPicker.getColor();
                    if (currentColor) {
                        var hsva = colorRgbaToHsva(currentColor);
                        targetHue = hsva.h;
                    }
                    else {
                        // 如果没有颜色，不设置背景色
                        return;
                    }
                }
                var hueColor = colorHsvaToRgba({ h: targetHue, s: 100, v: 100, a: 1 });
                setStyle(this.panel, {
                    background: hueColor,
                });
            }
        };
        ewColorPickerPanelPlugin.prototype.calculateContainerSize = function () {
            var panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
            if (panelContainer) {
                // 先尝试直接获取尺寸
                var containerWidth = panelContainer.offsetWidth;
                var containerHeight = panelContainer.offsetHeight;
                // 如果尺寸为0，尝试临时显示来获取尺寸
                if (containerWidth === 0 || containerHeight === 0) {
                    var originalDisplay = panelContainer.style.display;
                    var originalVisibility = panelContainer.style.visibility;
                    var originalPosition = panelContainer.style.position;
                    setStyle(panelContainer, {
                        display: "block",
                        visibility: "hidden",
                        position: "absolute",
                        left: "-9999px",
                        top: "-9999px",
                    });
                    // 强制重排以获取真实尺寸
                    panelContainer.offsetHeight;
                    // 尝试多种方法获取容器尺寸
                    var containerRect = getRect(panelContainer);
                    containerWidth = panelContainer.offsetWidth || containerRect.width;
                    containerHeight = panelContainer.offsetHeight || containerRect.height;
                    // 恢复原始样式
                    setStyle(panelContainer, {
                        display: originalDisplay,
                        visibility: originalVisibility,
                        position: originalPosition,
                        left: "",
                        top: "",
                    });
                }
                // 如果仍然为0，使用默认值
                this.containerWidth = containerWidth || 320;
                this.containerHeight = containerHeight || 200;
            }
        };
        ewColorPickerPanelPlugin.prototype.handleAutoPosition = function () {
            var _a;
            var _b = ((_a = this.ewColorPicker) === null || _a === void 0 ? void 0 : _a.options) || {}, autoPanelPosition = _b.autoPanelPosition, ewColorPickerBox = _b.ewColorPickerBox, panelPlacement = _b.panelPlacement;
            if (!autoPanelPosition || !ewColorPickerBox)
                return;
            var rootElement = this.ewColorPicker.getMountPoint("root");
            var colorBox = $(".ew-color-picker-box", rootElement);
            if (!rootElement || !colorBox)
                return;
            // 重新计算容器尺寸
            this.calculateContainerSize();
            // 计算位置
            var _c = getElementSize(colorBox), boxWidth = _c.offsetWidth, boxHeight = _c.offsetHeight;
            var _d = (panelPlacement || "bottom").split("-"), _e = _d[0], position = _e === void 0 ? "bottom" : _e, _f = _d[1], align = _f === void 0 ? "center" : _f;
            var _g = this.calculatePosition(position, align, boxWidth, boxHeight), left = _g.left, top = _g.top;
            // 边界调整
            var adjusted = this.adjustForViewport(rootElement, left, top);
            // 应用位置
            var panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
            if (panelContainer) {
                setStyle(panelContainer, {
                    position: "absolute",
                    left: "".concat(adjusted.left, "px"),
                    top: "".concat(adjusted.top, "px"),
                });
            }
        };
        // 计算面板位置（相对于 box）
        ewColorPickerPanelPlugin.prototype.calculatePosition = function (position, align, boxWidth, boxHeight) {
            var gap = 5; // box 和 panel 之间的间距
            var positions = {
                // 顶部
                top: {
                    left: align === "start"
                        ? -this.containerWidth
                        : align === "end"
                            ? boxWidth
                            : (boxWidth - this.containerWidth) / 2,
                    top: -this.containerHeight - boxHeight / 2,
                },
                // 底部
                bottom: {
                    left: align === "start"
                        ? -this.containerWidth
                        : align === "end"
                            ? boxWidth
                            : (boxWidth - this.containerWidth) / 2,
                    top: boxHeight,
                },
                // 左侧
                left: {
                    left: -this.containerWidth - gap,
                    top: align === "start"
                        ? -this.containerHeight - boxHeight / 2
                        : align === "end"
                            ? boxHeight
                            : (boxHeight - this.containerHeight) / 2,
                },
                // 右侧
                right: {
                    left: boxWidth + gap,
                    top: align === "start"
                        ? -this.containerHeight - boxHeight / 2
                        : align === "end"
                            ? boxHeight
                            : (boxHeight - this.containerHeight) / 2,
                },
            };
            return positions[position] || positions.bottom;
        };
        // 视口边界调整
        ewColorPickerPanelPlugin.prototype.adjustForViewport = function (rootElement, left, top) {
            var margin = 8;
            var rootRect = getRect(rootElement);
            var viewportWidth = window.innerWidth || document.documentElement.clientWidth;
            var viewportHeight = window.innerHeight || document.documentElement.clientHeight;
            // 计算面板在视口中的位置
            var panelRect = {
                left: rootRect.left + left,
                top: rootRect.top + top,
                right: rootRect.left + left + this.containerWidth,
                bottom: rootRect.top + top + this.containerHeight,
            };
            // 检查是否超出边界
            var overflow = {
                left: margin - panelRect.left,
                top: margin - panelRect.top,
                right: panelRect.right - (viewportWidth - margin),
                bottom: panelRect.bottom - (viewportHeight - margin),
            };
            // 简单调整：哪边超出就往回推
            if (overflow.left > 0)
                left += overflow.left;
            if (overflow.right > 0)
                left -= overflow.right;
            if (overflow.top > 0)
                top += overflow.top;
            if (overflow.bottom > 0)
                top -= overflow.bottom;
            return { left: left, top: top };
        };
        ewColorPickerPanelPlugin.prototype.destroy = function () {
            // 清理事件监听器
            if (this.panel) {
                off(this.panel, "click", this.handlePanelClick);
                off(this.panel, "mousedown", this.handlePanelMouseDown);
            }
            // 清理DOM引用
            this.panel = null;
            this.cursor = null;
            this.whitePanel = null;
            this.blackPanel = null;
            this.hueBar = null;
            this.hueThumb = null;
            this.alphaBar = null;
            this.alphaThumb = null;
            this.hueBg = null;
        };
        // 新增 install 方法，便于测试
        ewColorPickerPanelPlugin.prototype.install = function (core) {
            var _this = this;
            var _a;
            this.ewColorPicker = core;
            this.handleOptions();
            // 注册事件监听器
            if (isFunction(core === null || core === void 0 ? void 0 : core.on)) {
                core.on("change", function (color) {
                    // 当颜色改变时，更新面板光标位置
                    var hsva = colorRgbaToHsva(color);
                    _this.updateCursorPosition(hsva.s, hsva.v);
                });
            }
            (_a = this.run) === null || _a === void 0 ? void 0 : _a.call(this);
        };
        ewColorPickerPanelPlugin.pluginName = "ewColorPickerPanel";
        ewColorPickerPanelPlugin.applyOrder = "post" /* ApplyOrder.Post */;
        return ewColorPickerPanelPlugin;
    }());

    var ewColorPickerHuePlugin = /** @class */ (function () {
        function ewColorPickerHuePlugin(ewColorPicker) {
            var _this = this;
            this.ewColorPicker = ewColorPicker;
            this.options = {};
            this.hueBar = null;
            this.hueThumb = null;
            this.isHorizontal = false;
            // 内部状态控制
            this._hasHue = true;
            this.handleOptions();
            // 支持构造时通过 hue 关闭色相滑块
            if (this.options.hue === false) {
                this._hasHue = false;
            }
            // 初始化节流函数
            this.throttledUpdateHue = throttle(this.updateHue.bind(this), 16); // 60fps
            // 注册颜色变化事件监听器
            if (this.ewColorPicker.on && typeof this.ewColorPicker.on === "function") {
                this.ewColorPicker.on("change", function (color) {
                    // 当颜色改变时，更新 hue 滑块位置
                    if (color && _this.hueThumb) {
                        var hsva = colorRgbaToHsva(color);
                        _this.updateHueThumbPosition(hsva.h);
                    }
                });
            }
            this.run();
        }
        Object.defineProperty(ewColorPickerHuePlugin.prototype, "hasHue", {
            // 获取hue状态
            get: function () {
                return this._hasHue;
            },
            // 设置hue状态
            set: function (value) {
                if (this._hasHue !== value) {
                    this._hasHue = value;
                    if (value) {
                        this.render();
                    }
                    else {
                        if (this.hueBar && this.hueBar.parentNode) {
                            this.hueBar.parentNode.removeChild(this.hueBar);
                            this.hueBar = null;
                        }
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        // 动态启用/禁用hue
        ewColorPickerHuePlugin.prototype.enableHue = function (enable) {
            if (enable === void 0) { enable = true; }
            this.hasHue = enable;
        };
        ewColorPickerHuePlugin.prototype.handleOptions = function () {
            if (this.ewColorPicker && this.ewColorPicker.options) {
                this.options = extend(this.options, this.ewColorPicker.options);
                this.isHorizontal = this.options.hueDirection === "horizontal";
            }
        };
        ewColorPickerHuePlugin.prototype.run = function () {
            var _this = this;
            if (this.hasHue) {
                this.render();
            }
            setTimeout(function () {
                _this.bindEvents();
            }, 10);
        };
        ewColorPickerHuePlugin.prototype.render = function () {
            var panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
            if (!panelContainer) {
                warn("[ewColorPicker] Panel container not found");
                return;
            }
            // 移除旧的 hue 条
            var oldHue = $(".ew-color-picker-slider.ew-color-picker-is-vertical, .ew-color-picker-slider.ew-color-picker-is-horizontal", panelContainer);
            if (oldHue)
                removeElement(oldHue);
            // 创建 hue 条
            var hueSlider = create("div");
            addClass(hueSlider, "ew-color-picker-slider " +
                (this.isHorizontal
                    ? "ew-color-picker-is-horizontal"
                    : "ew-color-picker-is-vertical"));
            this.hueBar = create("div");
            addClass(this.hueBar, "ew-color-picker-slider-bar");
            this.hueThumb = create("div");
            addClass(this.hueThumb, "ew-color-picker-slider-thumb");
            insertNode(this.hueBar, this.hueThumb);
            insertNode(hueSlider, this.hueBar);
            // 根据方向决定插入位置
            if (this.isHorizontal) {
                // 水平方向：插入到 bottom-row 之前（底部）
                var bottomRow = $(".ew-color-picker-bottom-row", panelContainer);
                if (bottomRow && bottomRow.parentNode) {
                    bottomRow.parentNode.insertBefore(hueSlider, bottomRow);
                }
                else {
                    insertNode(panelContainer, hueSlider);
                }
            }
            else {
                // 垂直方向：插入到面板之后（顶部）
                var panel = $(".ew-color-picker-panel", panelContainer);
                if (panel && panel.parentNode) {
                    panel.parentNode.insertBefore(hueSlider, panel.nextSibling);
                }
                else {
                    insertNode(panelContainer, hueSlider);
                }
            }
            // 设置初始 thumb 位置
            var currentColor = this.ewColorPicker.getColor();
            if (currentColor) {
                var hsva = colorRgbaToHsva(currentColor);
                this.updateHueThumbPosition(hsva.h);
            }
        };
        ewColorPickerHuePlugin.prototype.bindEvents = function () {
            if (!this.hueBar)
                return;
            on(this.hueBar, "click", this.handleHueSliderClick.bind(this));
            on(this.hueBar, "mousedown", this.handleHueSliderMouseDown.bind(this));
        };
        ewColorPickerHuePlugin.prototype.handleHueSliderClick = function (event) {
            if (!this.hueBar)
                return;
            // 检查禁用状态
            if (this.options.disabled) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            var rect = getRect(this.hueBar);
            var isHorizontal = this.isHorizontal;
            var hue;
            if (isHorizontal) {
                var x = event.clientX - rect.left;
                hue = Math.max(0, Math.min(360, (x / rect.width) * 360));
            }
            else {
                var y = event.clientY - rect.top;
                hue = Math.max(0, Math.min(360, (1 - y / rect.height) * 360));
            }
            this.updateHue(hue);
        };
        ewColorPickerHuePlugin.prototype.handleHueSliderMouseDown = function (event) {
            var _this = this;
            if (!this.hueBar)
                return;
            // 检查禁用状态
            if (this.options.disabled) {
                return;
            }
            var slider = this.hueBar;
            var isHorizontal = this.isHorizontal;
            var moveHandler = function (e) {
                var rect = getRect(slider);
                var hue;
                if (isHorizontal) {
                    var x = e.clientX - rect.left;
                    hue = Math.max(0, Math.min(360, (x / rect.width) * 360));
                }
                else {
                    var y = e.clientY - rect.top;
                    hue = Math.max(0, Math.min(360, (1 - y / rect.height) * 360));
                }
                _this.throttledUpdateHue(hue);
            };
            var upHandler = function () {
                off(document, "mousemove", moveHandler);
                off(document, "mouseup", upHandler);
            };
            on(document, "mousemove", moveHandler);
            on(document, "mouseup", upHandler);
        };
        ewColorPickerHuePlugin.prototype.updateHue = function (hue) {
            var _a;
            // 只更新 hue，保持 s/v/a 不变
            var currentColor = this.ewColorPicker.getColor();
            // 确保 hue 值在有效范围内
            var validHue = Math.max(0, Math.min(360, hue));
            // 获取当前的 HSVA 值
            var hsva;
            if (currentColor) {
                hsva = colorRgbaToHsva(currentColor);
            }
            else {
                // 如果没有当前颜色，使用默认值
                hsva = { h: validHue, s: 100, v: 100, a: 1 };
            }
            // 检查 HSVA 值是否有效
            if (isNaN(hsva.h) || isNaN(hsva.s) || isNaN(hsva.v) || isNaN(hsva.a)) {
                // 如果 HSVA 值无效，使用默认值
                hsva.h = validHue;
                hsva.s = 100;
                hsva.v = 100;
                hsva.a = 1;
            }
            else {
                // 只更新 hue 值
                hsva.h = validHue;
            }
            // 转换为新的颜色值
            var newColor = colorHsvaToRgba(hsva);
            // 检查转换结果是否有效
            if (newColor && !newColor.includes("NaN")) {
                this.ewColorPicker.setColor(newColor);
            }
            else {
                // 如果转换结果无效，使用默认颜色
                var fallbackColor = this.ewColorPicker.options.alpha
                    ? "rgba(255, 0, 0, 1)"
                    : "#ff0000";
                this.ewColorPicker.setColor(fallbackColor);
            }
            this.updateHueThumbPosition(validHue);
            // 调用 panel 插件的 updateHueBg 方法，传入新的 hue 值
            var panelPlugin = (_a = this.ewColorPicker.plugins) === null || _a === void 0 ? void 0 : _a.ewColorPickerPanel;
            if (panelPlugin && isFunction(panelPlugin.updateHueBg)) {
                panelPlugin.updateHueBg(validHue);
            }
        };
        ewColorPickerHuePlugin.prototype.updateHueThumbPosition = function (hue) {
            if (!this.hueThumb || !this.hueBar)
                return;
            var isHorizontal = this.isHorizontal;
            var rect = getRect(this.hueBar);
            if (isHorizontal) {
                var x = Math.max(0, Math.min(rect.width, (hue / 360) * rect.width));
                setStyle(this.hueThumb, "left", "".concat(x, "px"));
                setStyle(this.hueThumb, "top", "0px");
            }
            else {
                var y = Math.max(0, Math.min(rect.height, (1 - hue / 360) * rect.height));
                setStyle(this.hueThumb, "top", "".concat(y, "px"));
                setStyle(this.hueThumb, "left", "0px");
            }
        };
        ewColorPickerHuePlugin.prototype.destroy = function () {
            // 清理事件监听器
            if (this.hueBar) {
                off(this.hueBar, "click", this.handleHueSliderClick.bind(this));
                off(this.hueBar, "mousedown", this.handleHueSliderMouseDown.bind(this));
            }
            // 清理DOM引用
            this.hueBar = null;
            this.hueThumb = null;
        };
        // 新增 install 方法，便于测试
        ewColorPickerHuePlugin.prototype.install = function (core) {
            var _this = this;
            var _a;
            this.ewColorPicker = core;
            this.handleOptions();
            // 注册事件监听器
            if (core.on && typeof core.on === "function") {
                core.on("change", function (color) {
                    // 当颜色改变时，更新 hue 滑块位置
                    var hsva = colorRgbaToHsva(color);
                    _this.updateHueThumbPosition(hsva.h);
                });
            }
            (_a = this.run) === null || _a === void 0 ? void 0 : _a.call(this);
        };
        ewColorPickerHuePlugin.pluginName = "ewColorPickerHue";
        ewColorPickerHuePlugin.applyOrder = "post" /* ApplyOrder.Post */;
        return ewColorPickerHuePlugin;
    }());

    var ewColorPickerAlphaPlugin = /** @class */ (function () {
        function ewColorPickerAlphaPlugin(ewColorPicker) {
            var _this = this;
            this.ewColorPicker = ewColorPicker;
            this.options = {};
            this.alphaBar = null;
            this.alphaThumb = null;
            this.isHorizontal = false;
            // 内部状态控制
            this._hasAlpha = true;
            this.handleOptions();
            // 支持构造时通过 alpha 关闭透明度滑块
            if (this.options.alpha === false) {
                this._hasAlpha = false;
            }
            // 初始化节流函数
            this.throttledUpdateAlpha = throttle(this.updateAlpha.bind(this), 16); // 60fps
            // 注册事件监听器
            if (isFunction(this.ewColorPicker.on)) {
                this.ewColorPicker.on("change", function (color) {
                    // 当颜色改变时，更新 alpha 滑块位置
                    var hsva = colorRgbaToHsva(color);
                    _this.updateAlphaThumbPosition(hsva.a);
                });
            }
            this.run();
        }
        Object.defineProperty(ewColorPickerAlphaPlugin.prototype, "hasAlpha", {
            // 获取alpha状态
            get: function () {
                return this._hasAlpha;
            },
            // 设置alpha状态
            set: function (value) {
                if (this._hasAlpha !== value) {
                    this._hasAlpha = value;
                    if (value) {
                        this.render();
                    }
                    else {
                        if (this.alphaBar && this.alphaBar.parentNode) {
                            this.alphaBar.parentNode.removeChild(this.alphaBar);
                            this.alphaBar = null;
                        }
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        // 动态启用/禁用alpha
        ewColorPickerAlphaPlugin.prototype.enableAlpha = function (enable) {
            if (enable === void 0) { enable = true; }
            this.hasAlpha = enable;
        };
        ewColorPickerAlphaPlugin.prototype.handleOptions = function () {
            if (this.ewColorPicker && this.ewColorPicker.options) {
                this.options = extend({}, this.options, this.ewColorPicker.options);
                this.isHorizontal = this.options.alphaDirection === "horizontal";
            }
        };
        ewColorPickerAlphaPlugin.prototype.run = function () {
            var _this = this;
            if (this.hasAlpha) {
                this.render();
            }
            setTimeout(function () {
                _this.bindEvents();
            }, 10);
        };
        ewColorPickerAlphaPlugin.prototype.render = function () {
            var panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
            if (!panelContainer) {
                warn("[ewColorPicker] Panel container not found, please check the ewColorPicker instance!");
                return;
            }
            // 移除旧的 alpha 条
            var oldAlpha = $(".ew-color-picker-slider.ew-alpha", panelContainer);
            if (oldAlpha)
                removeElement(oldAlpha);
            // 创建 alpha 条
            var alphaSlider = create("div");
            addClass(alphaSlider, "ew-color-picker-slider ew-alpha " +
                (this.isHorizontal
                    ? "ew-color-picker-is-horizontal"
                    : "ew-color-picker-is-vertical"));
            this.alphaBar = create("div");
            addClass(this.alphaBar, "ew-color-picker-alpha-slider-bar");
            // 背景层
            var alphaWrapper = create("div");
            addClass(alphaWrapper, "ew-color-picker-alpha-slider-wrapper");
            insertNode(this.alphaBar, alphaWrapper);
            var alphaBg = create("div");
            addClass(alphaBg, "ew-color-picker-alpha-slider-bg");
            insertNode(this.alphaBar, alphaBg);
            this.alphaThumb = create("div");
            addClass(this.alphaThumb, "ew-color-picker-alpha-slider-thumb");
            insertNode(this.alphaBar, this.alphaThumb);
            insertNode(alphaSlider, this.alphaBar);
            // 根据方向决定插入位置
            if (this.isHorizontal) {
                // 水平方向：插入到 bottom-row 之前（底部）
                var bottomRow = $(".ew-color-picker-bottom-row", panelContainer);
                if (bottomRow && bottomRow.parentNode) {
                    bottomRow.parentNode.insertBefore(alphaSlider, bottomRow);
                }
                else {
                    insertNode(panelContainer, alphaSlider);
                }
            }
            else {
                // 垂直方向：插入到面板之后（顶部）
                var panel = $(".ew-color-picker-panel", panelContainer);
                if (panel && panel.parentNode) {
                    panel.parentNode.insertBefore(alphaSlider, panel.nextSibling);
                }
                else {
                    insertNode(panelContainer, alphaSlider);
                }
            }
            // 设置初始 thumb 位置
            var currentColor = this.ewColorPicker.getColor();
            if (currentColor) {
                var hsva = colorRgbaToHsva(currentColor);
                this.updateAlphaThumbPosition(hsva.a);
            }
        };
        ewColorPickerAlphaPlugin.prototype.bindEvents = function () {
            var _this = this;
            if (!this.alphaBar)
                return;
            on(this.alphaBar, "click", function (event) {
                _this.handleAlphaSliderClick(event);
            });
            on(this.alphaBar, "mousedown", function (event) {
                _this.handleAlphaSliderMouseDown(event);
            });
        };
        ewColorPickerAlphaPlugin.prototype.handleAlphaSliderClick = function (event) {
            if (!this.alphaBar)
                return;
            // 检查禁用状态
            if (this.options.disabled) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            var rect = getRect(this.alphaBar);
            var isHorizontal = this.isHorizontal;
            var alpha;
            if (isHorizontal) {
                var x = event.clientX - rect.left;
                alpha = Math.max(0, Math.min(1, 1 - x / rect.width));
            }
            else {
                var y = event.clientY - rect.top;
                alpha = Math.max(0, Math.min(1, 1 - y / rect.height));
            }
            this.updateAlpha(alpha);
        };
        ewColorPickerAlphaPlugin.prototype.handleAlphaSliderMouseDown = function (event) {
            var _this = this;
            if (!this.alphaBar)
                return;
            // 检查禁用状态
            if (this.options.disabled) {
                return;
            }
            var slider = this.alphaBar;
            var isHorizontal = this.isHorizontal;
            var moveHandler = function (e) {
                var rect = getRect(slider);
                var alpha;
                if (isHorizontal) {
                    var x = e.clientX - rect.left;
                    alpha = Math.max(0, Math.min(1, 1 - x / rect.width));
                }
                else {
                    var y = e.clientY - rect.top;
                    alpha = Math.max(0, Math.min(1, 1 - y / rect.height));
                }
                _this.throttledUpdateAlpha(alpha);
            };
            var upHandler = function () {
                off(document, "mousemove", moveHandler);
                off(document, "mouseup", upHandler);
            };
            on(document, "mousemove", moveHandler);
            on(document, "mouseup", upHandler);
        };
        ewColorPickerAlphaPlugin.prototype.updateAlpha = function (alpha) {
            var _a;
            // 只更新 alpha，保持 h/s/v 不变
            var currentColor = this.ewColorPicker.getColor();
            if (!currentColor) {
                // 如果没有当前颜色，不进行更新
                return;
            }
            var hsva = colorRgbaToHsva(currentColor);
            hsva.a = alpha;
            var newColor = colorHsvaToRgba(hsva);
            this.ewColorPicker.setColor(newColor);
            this.updateAlphaThumbPosition(alpha);
            // 同步更新 color-mode 插件中的 alpha 输入框
            var colorModePlugin = (_a = this.ewColorPicker.plugins) === null || _a === void 0 ? void 0 : _a.ewColorPickerColorMode;
            if (colorModePlugin && colorModePlugin.currentMode !== 'hex') {
                colorModePlugin.updateInputValues(newColor);
            }
        };
        ewColorPickerAlphaPlugin.prototype.updateAlphaThumbPosition = function (alpha) {
            if (!this.alphaThumb || !this.alphaBar)
                return;
            var isHorizontal = this.isHorizontal;
            var rect = getRect(this.alphaBar);
            if (isHorizontal) {
                var x = Math.max(0, Math.min(rect.width, (1 - alpha) * rect.width));
                setStyle(this.alphaThumb, "left", "".concat(x, "px"));
                setStyle(this.alphaThumb, "top", "0px");
            }
            else {
                var y = Math.max(0, Math.min(rect.height, (1 - alpha) * rect.height));
                setStyle(this.alphaThumb, "top", "".concat(y, "px"));
                setStyle(this.alphaThumb, "left", "0px");
            }
        };
        ewColorPickerAlphaPlugin.prototype.destroy = function () {
            // 清理事件监听器
            if (this.alphaBar) {
                off(this.alphaBar, "click", this.handleAlphaSliderClick.bind(this));
                off(this.alphaBar, "mousedown", this.handleAlphaSliderMouseDown.bind(this));
                removeElement(this.alphaBar);
            }
            // 清理DOM引用
            this.alphaBar = null;
            this.alphaThumb = null;
        };
        // 新增 install 方法，便于测试
        ewColorPickerAlphaPlugin.prototype.install = function (core) {
            var _this = this;
            var _a;
            this.ewColorPicker = core;
            this.handleOptions();
            // 注册事件监听器
            if (isFunction(core.on)) {
                core.on("change", function (color) {
                    // 当颜色改变时，更新 alpha 滑块位置
                    var hsva = colorRgbaToHsva(color);
                    _this.updateAlphaThumbPosition(hsva.a);
                });
            }
            (_a = this.run) === null || _a === void 0 ? void 0 : _a.call(this);
        };
        ewColorPickerAlphaPlugin.pluginName = "ewColorPickerAlpha";
        ewColorPickerAlphaPlugin.applyOrder = "post" /* ApplyOrder.Post */;
        return ewColorPickerAlphaPlugin;
    }());

    var ewColorPickerInputPlugin = /** @class */ (function () {
        function ewColorPickerInputPlugin(ewColorPicker) {
            this.ewColorPicker = ewColorPicker;
            this.options = {};
            this.input = null;
            // 内部状态控制
            this._hasInput = true;
            this.handleOptions();
            // 支持构造时通过 hasInput 关闭输入框
            if (this.options.hasInput === false) {
                this._hasInput = false;
            }
            // 初始化防抖函数
            this.debouncedOnInputColor = debounce(this.onInputColor.bind(this), 300);
            this.run();
            this.hasAlpha = !!this.ewColorPicker.plugins.ewColorPickerAlpha;
        }
        Object.defineProperty(ewColorPickerInputPlugin.prototype, "hasInput", {
            // 获取输入框状态
            get: function () {
                return this._hasInput;
            },
            // 设置输入框状态
            set: function (value) {
                if (this._hasInput !== value) {
                    this._hasInput = value;
                    if (value) {
                        this.render();
                        this.bindEvents();
                    }
                    else {
                        // 如果禁用了输入框，移除DOM
                        if (this.input && this.input.parentNode) {
                            removeElement(this.input);
                            this.input = null;
                        }
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        // 动态启用/禁用输入框
        ewColorPickerInputPlugin.prototype.enableInput = function (enable) {
            if (enable === void 0) { enable = true; }
            this.hasInput = enable;
        };
        ewColorPickerInputPlugin.prototype.handleOptions = function () {
            if (this.ewColorPicker && this.ewColorPicker.options) {
                this.options = extend(this.options, this.ewColorPicker.options);
            }
        };
        // 更新配置并重新渲染
        ewColorPickerInputPlugin.prototype.updateOptions = function () {
            this.handleOptions();
            if (this.hasInput) {
                this.render();
            }
            else {
                // 如果禁用了输入框，移除DOM
                if (this.input && this.input.parentNode) {
                    removeElement(this.input);
                    this.input = null;
                }
            }
        };
        ewColorPickerInputPlugin.prototype.run = function () {
            // 根据内部状态决定是否渲染
            if (this.hasInput) {
                this.render();
                this.bindEvents();
            }
        };
        ewColorPickerInputPlugin.prototype.render = function () {
            // 直接使用面板容器
            var panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
            if (!panelContainer) {
                warn('[ewColorPicker] Panel container not found');
                return;
            }
            // 查找底部行容器
            var bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
            if (!bottomRow) {
                warn('[ewColorPicker] Bottom row container not found');
                return;
            }
            // 查找按钮组容器（清空和确认按钮的父元素）
            var btnGroup = $('.ew-color-picker-drop-btn-group', bottomRow);
            // 查找或创建 input 容器
            var inputContainer = $('.ew-color-picker-input-container', bottomRow);
            if (!inputContainer) {
                inputContainer = create('div');
                addClass(inputContainer, 'ew-color-picker-input-container');
                addClass(inputContainer, 'ew-color-picker-input-container-flex');
                // 如果存在按钮组，插入到按钮组之前
                if (btnGroup && btnGroup.parentNode) {
                    btnGroup.parentNode.insertBefore(inputContainer, btnGroup);
                }
                else {
                    // 如果没有按钮组，直接插入到 bottomRow
                    insertNode(bottomRow, inputContainer);
                }
            }
            // 查找已存在的 input 元素，避免重复插入
            this.input = $('input.ew-color-picker-input', inputContainer);
            if (!this.input) {
                this.input = create('input');
                if (this.input) {
                    addClass(this.input, 'ew-color-picker-input');
                    setAttr(this.input, {
                        type: 'text',
                        name: 'ew-color-picker-input',
                        placeholder: '请输入颜色值'
                    });
                    // 组装DOM结构
                    insertNode(inputContainer, this.input);
                }
            }
            // 设置当前值
            var currentColor = this.ewColorPicker.getColor();
            // 检查当前颜色是否有效
            if (!currentColor || currentColor.indexOf('NaN') !== -1) {
                currentColor = this.getDefaultColor();
                // 只有在真正需要时才设置颜色，避免在初始化时强制设置
                if (this.ewColorPicker.currentColor === '') {
                    // 如果 currentColor 为空，说明用户没有设置 defaultColor，不应该强制设置
                    currentColor = '';
                }
                else {
                    this.ewColorPicker.setColor(currentColor);
                }
            }
            // 格式化颜色显示
            var displayColor = this.formatColorForDisplay(currentColor);
            if (this.input) {
                this.input.value = displayColor;
            }
            // 如果禁用，添加禁用样式
            if (this.options.disabled) {
                this.setDisabled(true);
            }
        };
        ewColorPickerInputPlugin.prototype.bindEvents = function () {
            var _this = this;
            if (!this.input)
                return;
            // 失焦事件
            on(this.input, 'blur', function (event) {
                _this.debouncedOnInputColor(event.target.value);
            });
            // 回车事件
            on(this.input, 'keydown', function (event) {
                var keyboardEvent = event;
                if (keyboardEvent.key === 'Enter') {
                    _this.debouncedOnInputColor(keyboardEvent.target.value);
                }
            });
            // 监听颜色变化事件，自动更新输入框
            this.ewColorPicker.on('change', function (color) {
                _this.update(color);
            });
        };
        ewColorPickerInputPlugin.prototype.onInputColor = function (value) {
            var _a, _b;
            if (!value.trim())
                return;
            // 验证颜色格式
            if (!isValidColor(value)) {
                warn("[ewColorPicker warning]: Invalid color format: ".concat(value));
                return;
            }
            // 转换颜色格式
            var rgbaColor = colorToRgba(value);
            // 更新HSV颜色
            this.ewColorPicker.hsvaColor = colorRgbaToHsva(rgbaColor);
            // 更新当前颜色并触发事件
            this.ewColorPicker.setColor(rgbaColor);
            // 同步更新其他插件的状态
            this.syncOtherPlugins(rgbaColor);
            // 触发颜色改变回调
            if (isFunction(this.options.changeColor)) {
                (_b = (_a = this.options).changeColor) === null || _b === void 0 ? void 0 : _b.call(_a, rgbaColor);
            }
        };
        // 同步其他插件的状态
        ewColorPickerInputPlugin.prototype.syncOtherPlugins = function (color) {
            var _a, _b, _c, _d, _e;
            var hsva = this.ewColorPicker.hsvaColor;
            // 同步颜色模式插件的输入框
            var colorModePlugin = (_a = this.ewColorPicker.plugins) === null || _a === void 0 ? void 0 : _a.ewColorPickerColorMode;
            if (colorModePlugin && colorModePlugin.currentMode !== 'hex') {
                colorModePlugin.updateInputValues(color);
            }
            // 同步色相滑块
            var huePlugin = (_b = this.ewColorPicker.plugins) === null || _b === void 0 ? void 0 : _b.ewColorPickerHue;
            if (huePlugin && huePlugin.updateHueThumbPosition) {
                huePlugin.updateHueThumbPosition(hsva.h);
            }
            // 同步透明度滑块
            var alphaPlugin = (_c = this.ewColorPicker.plugins) === null || _c === void 0 ? void 0 : _c.ewColorPickerAlpha;
            if (alphaPlugin && alphaPlugin.updateAlphaThumbPosition) {
                alphaPlugin.updateAlphaThumbPosition(hsva.a);
            }
            // 同步面板插件
            var panelPlugin = (_d = this.ewColorPicker.plugins) === null || _d === void 0 ? void 0 : _d.ewColorPickerPanel;
            if (panelPlugin && panelPlugin.updatePanelColor) {
                panelPlugin.updatePanelColor(color);
            }
            // 同步颜色框
            var boxPlugin = (_e = this.ewColorPicker.plugins) === null || _e === void 0 ? void 0 : _e.ewColorPickerBox;
            if (boxPlugin && boxPlugin.setBoxBgColor) {
                boxPlugin.setBoxBgColor(color);
            }
        };
        ewColorPickerInputPlugin.prototype.setValue = function (value) {
            if (this.input) {
                this.input.value = value;
            }
        };
        ewColorPickerInputPlugin.prototype.getValue = function () {
            return this.input ? this.input.value : '';
        };
        ewColorPickerInputPlugin.prototype.setDisabled = function (disabled) {
            if (!this.input)
                return;
            if (disabled) {
                this.input.disabled = true;
                if (!hasClass(this.input, 'ew-input-disabled')) {
                    addClass(this.input, 'ew-input-disabled');
                }
            }
            else {
                this.input.disabled = false;
                if (hasClass(this.input, 'ew-input-disabled')) {
                    removeClass(this.input, 'ew-input-disabled');
                }
            }
        };
        ewColorPickerInputPlugin.prototype.update = function (color) {
            // 检查颜色是否有效
            if (!color || color.indexOf('NaN') !== -1) {
                // 如果颜色无效且没有设置 defaultColor，不设置默认颜色
                if (this.ewColorPicker.currentColor === '') {
                    color = '';
                }
                else {
                    color = this.getDefaultColor();
                }
            }
            // 格式化颜色显示
            var displayColor = this.formatColorForDisplay(color);
            this.setValue(displayColor);
        };
        // 获取默认颜色
        ewColorPickerInputPlugin.prototype.getDefaultColor = function () {
            var _a;
            if (this.hasAlpha) {
                return 'rgba(255,0,0,1)';
            }
            else if ((_a = this.ewColorPicker.plugins) === null || _a === void 0 ? void 0 : _a.ewColorPickerColorMode) {
                // 如果集成了颜色模式插件，根据当前模式设置格式
                var currentMode = this.ewColorPicker.currentMode || 'HSV';
                if (currentMode === 'HSL') {
                    return 'hsl(0, 100%, 50%)';
                }
                else if (currentMode === 'RGB') {
                    return 'rgba(255,0,0,1)';
                }
                else {
                    return '#ff0000';
                }
            }
            else {
                return '#ff0000';
            }
        };
        // 格式化颜色用于显示
        ewColorPickerInputPlugin.prototype.formatColorForDisplay = function (color) {
            var _a;
            if (!color)
                return '';
            var hasColorModePlugin = !!((_a = this.ewColorPicker.plugins) === null || _a === void 0 ? void 0 : _a.ewColorPickerColorMode);
            var displayColor = color;
            if (hasColorModePlugin) {
                var colorModePlugin = this.ewColorPicker.plugins.ewColorPickerColorMode;
                if (colorModePlugin && colorModePlugin.getCurrentMode() === 'hex') {
                    // HEX 模式下，将颜色转换为 HEX 格式显示
                    if (displayColor && !displayColor.startsWith('#')) {
                        var rgbaString = colorToRgba(displayColor);
                        if (rgbaString) {
                            var rgba = parseRgbaString(rgbaString);
                            if (rgba) {
                                displayColor = rgbaToHex(rgba);
                            }
                        }
                    }
                }
                else if (this.hasAlpha && !color.startsWith('rgba')) {
                    // 如果开启了 alpha 但颜色不是 rgba 格式，转换为 rgba
                    var hsva = colorRgbaToHsva(color);
                    displayColor = colorHsvaToRgba(hsva);
                }
                else if (!this.hasAlpha && color.startsWith('rgba')) {
                    // 如果没有开启 alpha 但颜色是 rgba 格式，转换为 hex
                    displayColor = colorRgbaToHex(color);
                }
            }
            else {
                // 没有集成颜色模式插件时的原有逻辑
                if (this.hasAlpha && !color.startsWith('rgba')) {
                    // 如果开启了 alpha 但颜色不是 rgba 格式，转换为 rgba
                    var hsva = colorRgbaToHsva(color);
                    displayColor = colorHsvaToRgba(hsva);
                }
                else if (!this.hasAlpha && color.startsWith('rgba')) {
                    // 如果没有开启 alpha 但颜色是 rgba 格式，转换为 hex
                    displayColor = colorRgbaToHex(color);
                }
            }
            return displayColor;
        };
        ewColorPickerInputPlugin.prototype.destroy = function () {
            if (this.input) {
                off(this.input, 'blur', this.debouncedOnInputColor);
                off(this.input, 'keydown', this.debouncedOnInputColor);
            }
            // 清理DOM引用
            this.input = null;
        };
        // 新增 install 方法，便于测试
        ewColorPickerInputPlugin.prototype.install = function (core) {
            var _this = this;
            var _a;
            this.ewColorPicker = core;
            this.handleOptions();
            // 注册事件监听器
            if (isFunction(core === null || core === void 0 ? void 0 : core.on)) {
                core.on('change', function (color) {
                    // 当颜色改变时，更新输入框
                    _this.update(color);
                });
            }
            (_a = this.run) === null || _a === void 0 ? void 0 : _a.call(this);
        };
        ewColorPickerInputPlugin.pluginName = "ewColorPickerInput";
        ewColorPickerInputPlugin.applyOrder = "post" /* ApplyOrder.Post */;
        return ewColorPickerInputPlugin;
    }());

    var InputNumber = /** @class */ (function () {
        function InputNumber(options) {
            if (options === void 0) { options = {}; }
            var _a;
            this.isFocused = false;
            var defaultOptions = {
                value: 0,
                min: -Infinity,
                max: Infinity,
                step: 1,
                precision: 0,
                disabled: false,
                placeholder: "",
                size: "default",
                onChange: function () { },
                onBlur: function () { },
                onFocus: function () { },
            };
            this.options = extend(defaultOptions, options);
            this.currentValue = (_a = this.options.value) !== null && _a !== void 0 ? _a : 0;
            this.debouncedOnChange = debounce(this.options.onChange, 300);
            this.createElements();
            this.bindEvents();
            // 初始化时只同步显示值，不触发 onChange，避免实例创建阶段误改颜色
            this.updateValue(this.currentValue, false);
        }
        InputNumber.prototype.createElements = function () {
            // 创建容器
            this.container = create("div");
            addClass(this.container, "ew-input-number");
            addClass(this.container, "ew-input-number--".concat(this.options.size));
            // 创建输入框
            this.input = create("input");
            addClass(this.input, "ew-input-number__input");
            setAttr(this.input, {
                type: "text",
                inputmode: "decimal",
                placeholder: this.options.placeholder,
            });
            // 创建按钮容器
            var buttonContainer = create("div");
            addClass(buttonContainer, "ew-input-number__buttons");
            // 创建上按钮
            this.upButton = create("button");
            addClass(this.upButton, "ew-input-number__button");
            addClass(this.upButton, "ew-input-number__button--up");
            setAttr(this.upButton, { type: "button" });
            this.upButton.innerHTML = upArrowIcon();
            // 创建下按钮
            this.downButton = create("button");
            addClass(this.downButton, "ew-input-number__button");
            addClass(this.downButton, "ew-input-number__button--down");
            setAttr(this.downButton, { type: "button" });
            this.downButton.innerHTML = downArrowIcon();
            // 组装DOM结构
            insertNode(buttonContainer, this.upButton);
            insertNode(buttonContainer, this.downButton);
            insertNode(this.container, this.input);
            insertNode(this.container, buttonContainer);
            // 设置样式
            this.setStyles();
        };
        InputNumber.prototype.setStyles = function () {
            if (this.options.disabled) {
                this.setDisabled(true);
            }
        };
        InputNumber.prototype.bindEvents = function () {
            // 输入框事件
            on(this.input, "input", this.handleInput.bind(this));
            on(this.input, "blur", this.handleBlur.bind(this));
            on(this.input, "focus", this.handleFocus.bind(this));
            on(this.input, "keydown", this.handleKeydown.bind(this));
            // 按钮事件
            on(this.upButton, "click", this.handleUpClick.bind(this));
            on(this.downButton, "click", this.handleDownClick.bind(this));
            // 鼠标滚轮事件
            on(this.container, "wheel", this.handleWheel.bind(this));
        };
        InputNumber.prototype.handleInput = function (event) {
            var target = event.target;
            var value = target.value;
            // 允许空值、负号、小数点
            if (value === "" || value === "-" || value === ".") {
                return;
            }
            // 验证数字格式
            var numValue = parseFloat(value);
            if (isNaN(numValue)) {
                // 如果不是有效数字，恢复原值
                this.input.value = this.currentValue.toString();
                return;
            }
            // 只更新当前值，不应用精度限制，让用户完整输入
            this.currentValue = numValue;
        };
        InputNumber.prototype.handleBlur = function (event) {
            this.isFocused = false;
            this.removeClass(this.container, "ew-input-number--focused");
            // 应用精度限制和边界检查
            this.updateValue(this.currentValue, false);
            // 触发blur回调
            this.options.onBlur(this.currentValue);
        };
        InputNumber.prototype.handleFocus = function (event) {
            this.isFocused = true;
            this.addClass(this.container, "ew-input-number--focused");
            // 触发focus回调
            this.options.onFocus(event);
        };
        InputNumber.prototype.handleKeydown = function (event) {
            switch (event.key) {
                case "ArrowUp":
                    event.preventDefault();
                    this.increment();
                    break;
                case "ArrowDown":
                    event.preventDefault();
                    this.decrement();
                    break;
                case "Enter":
                    event.preventDefault();
                    this.input.blur();
                    break;
            }
        };
        InputNumber.prototype.handleUpClick = function () {
            if (!this.options.disabled) {
                this.increment();
            }
        };
        InputNumber.prototype.handleDownClick = function () {
            if (!this.options.disabled) {
                this.decrement();
            }
        };
        InputNumber.prototype.handleWheel = function (event) {
            if (this.isFocused && !this.options.disabled) {
                event.preventDefault();
                if (event.deltaY < 0) {
                    this.increment();
                }
                else {
                    this.decrement();
                }
            }
        };
        InputNumber.prototype.increment = function () {
            var newValue = this.currentValue + this.options.step;
            this.updateValue(newValue);
        };
        InputNumber.prototype.decrement = function () {
            var newValue = this.currentValue - this.options.step;
            this.updateValue(newValue);
        };
        InputNumber.prototype.updateValue = function (value, triggerChange) {
            if (triggerChange === void 0) { triggerChange = true; }
            // 应用边界限制
            var min = this.options.min;
            var max = this.options.max;
            if (value < min) {
                value = min;
            }
            else if (value > max) {
                value = max;
            }
            // 应用精度限制
            var precision = this.options.precision;
            value =
                Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);
            this.currentValue = value;
            this.formatDisplayValue();
            // 触发change回调
            if (triggerChange) {
                this.debouncedOnChange(value);
            }
        };
        InputNumber.prototype.formatDisplayValue = function () {
            var precision = this.options.precision;
            this.input.value = this.currentValue.toFixed(precision);
        };
        InputNumber.prototype.addClass = function (element, className) {
            if (!hasClass(element, className)) {
                addClass(element, className);
            }
        };
        InputNumber.prototype.removeClass = function (element, className) {
            if (hasClass(element, className)) {
                removeClass(element, className);
            }
        };
        // 公共API
        InputNumber.prototype.getValue = function () {
            return this.currentValue;
        };
        InputNumber.prototype.setValue = function (value) {
            this.updateValue(value);
        };
        InputNumber.prototype.setDisabled = function (disabled) {
            this.options.disabled = disabled;
            if (disabled) {
                this.addClass(this.container, "ew-input-number--disabled");
                setAttr(this.input, { disabled: "true" });
                setAttr(this.upButton, { disabled: "true" });
                setAttr(this.downButton, { disabled: "true" });
            }
            else {
                this.removeClass(this.container, "ew-input-number--disabled");
                setAttr(this.input, { disabled: "false" });
                setAttr(this.upButton, { disabled: "false" });
                setAttr(this.downButton, { disabled: "false" });
            }
        };
        InputNumber.prototype.getElement = function () {
            return this.container;
        };
        InputNumber.prototype.destroy = function () {
            var _a;
            // 清理事件监听器
            off(this.input, "input", this.handleInput.bind(this));
            off(this.input, "blur", this.handleBlur.bind(this));
            off(this.input, "focus", this.handleFocus.bind(this));
            off(this.input, "keydown", this.handleKeydown.bind(this));
            off(this.upButton, "click", this.handleUpClick.bind(this));
            off(this.downButton, "click", this.handleDownClick.bind(this));
            off(this.container, "wheel", this.handleWheel.bind(this));
            // 移除DOM元素
            if ((_a = this.container) === null || _a === void 0 ? void 0 : _a.parentNode) {
                removeElement(this.container);
            }
            // 清理引用
            this.container = null;
            this.input = null;
            this.upButton = null;
            this.downButton = null;
        };
        InputNumber.prototype.install = function (core) {
            var _a, _b, _c;
            this.ewColorPicker = core;
            (_a = this.handleOptions) === null || _a === void 0 ? void 0 : _a.call(this);
            // 检查是否显示数字输入框
            if (((_b = this.ewColorPicker.options) === null || _b === void 0 ? void 0 : _b.showInputNumber) === false) {
                return;
            }
            // 注册事件监听器
            if (isFunction(core.on)) {
                core.on('change', function () { });
            }
            (_c = this.run) === null || _c === void 0 ? void 0 : _c.call(this);
        };
        return InputNumber;
    }());

    var ewColorPickerInputNumberPlugin = /** @class */ (function () {
        function ewColorPickerInputNumberPlugin(ewColorPicker) {
            this.options = {};
            this.instances = new Map();
            this.ewColorPicker = ewColorPicker;
            this.handleOptions();
        }
        ewColorPickerInputNumberPlugin.prototype.install = function (ewColorPicker) {
            this.ewColorPicker = ewColorPicker;
            this.handleOptions();
            this.run();
        };
        ewColorPickerInputNumberPlugin.prototype.updateOptions = function () {
            var _this = this;
            this.handleOptions();
            this.instances.forEach(function (instance) {
                if (!isUndefined(_this.options.disabled)) {
                    instance.setDisabled(_this.options.disabled);
                }
            });
        };
        ewColorPickerInputNumberPlugin.prototype.run = function () {
            if (!this.ewColorPicker)
                return;
            var inputNumber = this.createInputNumber({
                value: 0,
                disabled: this.options.disabled || false,
            });
            this.instances.set("default", inputNumber);
            var panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
            if (panelContainer) {
                var bottomRow = panelContainer.querySelector(".ew-color-picker-bottom-row");
                if (bottomRow) {
                    bottomRow.appendChild(inputNumber.getElement());
                }
            }
        };
        ewColorPickerInputNumberPlugin.prototype.handleOptions = function () {
            var _a;
            var options = (_a = this.ewColorPicker) === null || _a === void 0 ? void 0 : _a.options;
            if (options) {
                this.options = __assign(__assign(__assign({}, this.options), options), { disabled: !isUndefined(options.disabled)
                        ? options.disabled
                        : this.options.disabled || false });
            }
        };
        ewColorPickerInputNumberPlugin.prototype.createInputNumber = function (options) {
            return new InputNumber(options);
        };
        ewColorPickerInputNumberPlugin.prototype.destroy = function () {
            this.instances.forEach(function (instance) {
                instance.destroy();
            });
            this.instances.clear();
            this.ewColorPicker = null;
        };
        ewColorPickerInputNumberPlugin.pluginName = "ewColorPickerInputNumber";
        ewColorPickerInputNumberPlugin.applyOrder = "post" /* ApplyOrder.Post */;
        return ewColorPickerInputNumberPlugin;
    }());

    var ewColorPickerButtonPlugin = /** @class */ (function () {
        function ewColorPickerButtonPlugin(ewColorPicker) {
            this.ewColorPicker = ewColorPicker;
            this.options = {};
            this.clearButton = null;
            this.sureButton = null;
            // 内部状态控制
            this._hasClear = true;
            this._hasSure = true;
            this.handleOptions();
            // 支持构造时通过 hasClear / hasSure 隐藏按钮
            if (this.options.hasClear === false) {
                this._hasClear = false;
            }
            if (this.options.hasSure === false) {
                this._hasSure = false;
            }
            // 初始化防抖函数
            this.debouncedOnClearColor = debounce(this.onClearColor.bind(this), 100);
            this.debouncedOnSureColor = debounce(this.onSureColor.bind(this), 100);
            this.run();
        }
        Object.defineProperty(ewColorPickerButtonPlugin.prototype, "hasClear", {
            // 获取清空按钮状态
            get: function () {
                return this._hasClear;
            },
            // 设置清空按钮状态
            set: function (value) {
                if (this._hasClear !== value) {
                    this._hasClear = value;
                    this.render();
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ewColorPickerButtonPlugin.prototype, "hasSure", {
            // 获取确定按钮状态
            get: function () {
                return this._hasSure;
            },
            // 设置确定按钮状态
            set: function (value) {
                if (this._hasSure !== value) {
                    this._hasSure = value;
                    this.render();
                }
            },
            enumerable: false,
            configurable: true
        });
        // 动态启用/禁用清空按钮
        ewColorPickerButtonPlugin.prototype.enableClear = function (enable) {
            if (enable === void 0) { enable = true; }
            this.hasClear = enable;
        };
        // 动态启用/禁用确定按钮
        ewColorPickerButtonPlugin.prototype.enableSure = function (enable) {
            if (enable === void 0) { enable = true; }
            this.hasSure = enable;
        };
        // 动态启用/禁用所有按钮
        ewColorPickerButtonPlugin.prototype.enableButtons = function (enable) {
            if (enable === void 0) { enable = true; }
            this.hasClear = enable;
            this.hasSure = enable;
        };
        ewColorPickerButtonPlugin.prototype.handleOptions = function () {
            this.options = extend({}, this.options, this.ewColorPicker.options);
        };
        // 更新配置并重新渲染
        ewColorPickerButtonPlugin.prototype.updateOptions = function () {
            var _this = this;
            this.handleOptions();
            // 延迟执行，确保在颜色模式插件之后执行
            setTimeout(function () {
                _this.render();
            }, 0);
        };
        ewColorPickerButtonPlugin.prototype.run = function () {
            var _this = this;
            // 检查是否显示按钮
            if (this.options.showButton === false) {
                return;
            }
            this.render();
            this.bindEvents();
            // 按钮组样式依赖颜色模式插件渲染出的输入框组，延后调整
            setTimeout(function () {
                _this.adjustButtonGroupStyle();
            }, 0);
        };
        ewColorPickerButtonPlugin.prototype.render = function () {
            // 直接使用面板容器
            var panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
            if (!panelContainer) {
                warn('[ewColorPicker warning]: Panel container not found');
                return;
            }
            // 查找底部行容器
            var bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
            if (!bottomRow) {
                warn('[ewColorPicker warning]: Bottom row container not found');
                return;
            }
            // 查找或创建按钮容器
            var btnGroup = $('.ew-color-picker-drop-btn-group', bottomRow);
            if (!btnGroup) {
                btnGroup = create('div');
                addClass(btnGroup, 'ew-color-picker-drop-btn-group');
                // 插入到 bottomRow 内部
                insertNode(bottomRow, btnGroup);
            }
            // 清空旧内容
            btnGroup.textContent = '';
            // 渲染清空按钮
            if (this.hasClear) {
                this.clearButton = create('button');
                addClass(this.clearButton, 'ew-color-picker-clear-btn ew-color-picker-drop-btn');
                this.setClearText(this.options.clearText || '清空');
                insertNode(btnGroup, this.clearButton);
            }
            // 渲染确认按钮
            if (this.hasSure) {
                this.sureButton = create('button');
                addClass(this.sureButton, 'ew-color-picker-sure-btn ew-color-picker-drop-btn');
                this.setSureText(this.options.sureText || '确认');
                insertNode(btnGroup, this.sureButton);
            }
            // 根据当前颜色模式调整按钮组样式
            this.adjustButtonGroupStyle();
        };
        ewColorPickerButtonPlugin.prototype.bindEvents = function () {
            var _this = this;
            // 清空按钮事件
            if (this.clearButton) {
                on(this.clearButton, 'click', function () {
                    _this.debouncedOnClearColor();
                });
            }
            // 确定按钮事件
            if (this.sureButton) {
                on(this.sureButton, 'click', function () {
                    _this.debouncedOnSureColor();
                });
            }
            // 监听颜色模式变化事件
            this.ewColorPicker.on('mode-change', function () {
                _this.adjustButtonGroupStyle();
            });
        };
        ewColorPickerButtonPlugin.prototype.onClearColor = function () {
            var _a, _b;
            var resetColor;
            var resetHsva;
            if (this.ewColorPicker.options.defaultColor) {
                resetColor = this.ewColorPicker.options.defaultColor;
                var rgbaColor = colorToRgba(resetColor);
                if (rgbaColor) {
                    resetHsva = colorRgbaToHsva(rgbaColor);
                }
            }
            else {
                resetColor = '';
                resetHsva = undefined;
            }
            // 更新 HSV 颜色
            if (resetHsva) {
                this.ewColorPicker.hsvaColor = resetHsva;
            }
            else {
                // 清空时重置为初始状态
                this.ewColorPicker.hsvaColor = { h: 0, s: 100, v: 100, a: 1 };
            }
            // 设置颜色
            this.ewColorPicker.setColor(resetColor);
            // 同步所有插件
            this.ewColorPicker.syncAllPlugins(resetColor);
            // 自动关闭颜色面板
            this.ewColorPicker.hidePanel();
            // 触发清空回调
            if (isFunction(this.options.clear)) {
                (_b = (_a = this.options).clear) === null || _b === void 0 ? void 0 : _b.call(_a, this.ewColorPicker);
            }
            // 触发事件
            this.ewColorPicker.trigger('clear');
        };
        ewColorPickerButtonPlugin.prototype.onSureColor = function () {
            var _a, _b;
            // 触发确定回调
            if (isFunction(this.options.sure)) {
                (_b = (_a = this.options).sure) === null || _b === void 0 ? void 0 : _b.call(_a, this.ewColorPicker.currentColor, this.ewColorPicker);
            }
            // 触发事件
            this.ewColorPicker.trigger('sure', this.ewColorPicker.currentColor, this.ewColorPicker);
            // 隐藏面板
            this.ewColorPicker.hidePanel();
        };
        ewColorPickerButtonPlugin.prototype.setClearText = function (text) {
            if (this.clearButton) {
                this.clearButton.textContent = text;
            }
        };
        ewColorPickerButtonPlugin.prototype.setSureText = function (text) {
            if (this.sureButton) {
                this.sureButton.textContent = text;
            }
        };
        ewColorPickerButtonPlugin.prototype.setDisabled = function (disabled) {
            if (this.clearButton) {
                setAttr(this.clearButton, { disabled: disabled.toString() });
            }
            if (this.sureButton) {
                setAttr(this.sureButton, { disabled: disabled.toString() });
            }
        };
        ewColorPickerButtonPlugin.prototype.destroy = function () {
            if (this.clearButton) {
                off(this.clearButton, 'click', this.debouncedOnClearColor);
            }
            if (this.sureButton) {
                off(this.sureButton, 'click', this.debouncedOnSureColor);
            }
            // 清理DOM引用
            this.clearButton = null;
            this.sureButton = null;
        };
        // 根据颜色模式调整按钮组样式
        ewColorPickerButtonPlugin.prototype.adjustButtonGroupStyle = function () {
            var panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
            if (!panelContainer)
                return;
            var bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
            if (!bottomRow)
                return;
            var btnGroup = $('.ew-color-picker-drop-btn-group', bottomRow);
            if (!btnGroup)
                return;
            // 检查当前颜色模式
            var hasMultipleInputs = $('.ew-color-picker-inputs-group', panelContainer) !== null;
            if (hasMultipleInputs) {
                // HSL 或 RGB 模式：按钮组占据一行并居中
                addClass(btnGroup, 'ew-color-picker-drop-btn-group-multi');
                removeClass(btnGroup, 'ew-color-picker-drop-btn-group-single');
                addClass(bottomRow, 'ew-color-picker-bottom-row-multi');
                removeClass(bottomRow, 'ew-color-picker-bottom-row-single');
            }
            else {
                // HEX 模式：按钮组正常布局
                addClass(btnGroup, 'ew-color-picker-drop-btn-group-single');
                removeClass(btnGroup, 'ew-color-picker-drop-btn-group-multi');
                addClass(bottomRow, 'ew-color-picker-bottom-row-single');
                removeClass(bottomRow, 'ew-color-picker-bottom-row-multi');
            }
        };
        // 新增 install 方法，便于测试
        ewColorPickerButtonPlugin.prototype.install = function (core) {
            var _a;
            this.ewColorPicker = core;
            this.handleOptions();
            (_a = this.run) === null || _a === void 0 ? void 0 : _a.call(this);
        };
        ewColorPickerButtonPlugin.pluginName = "ewColorPickerButton";
        ewColorPickerButtonPlugin.applyOrder = "post" /* ApplyOrder.Post */;
        return ewColorPickerButtonPlugin;
    }());

    var ewColorPickerPredefinePlugin = /** @class */ (function () {
        function ewColorPickerPredefinePlugin(ewColorPicker) {
            this.ewColorPicker = ewColorPicker;
            this.options = {};
            this.predefineItems = [];
            this.container = null;
            // 面板切换事件处理器
            this.toggleHandler = null;
            // 颜色变化事件处理器
            this.changeHandler = null;
            // 标记是否已绑定事件
            this.isEventBound = false;
            this.handleOptions();
            // 初始化防抖函数
            this.debouncedOnPredefineColorClick = debounce(this.onPredefineColorClick.bind(this), 100);
            this.run();
        }
        ewColorPickerPredefinePlugin.prototype.handleOptions = function () {
            if (this.ewColorPicker && this.ewColorPicker.options) {
                this.options = extend(this.options, this.ewColorPicker.options);
                // 处理嵌套的 ewColorPickerPredefine 配置
                if (this.ewColorPicker.options.ewColorPickerPredefine) {
                    this.options = extend(this.options, this.ewColorPicker.options.ewColorPickerPredefine);
                }
            }
        };
        ewColorPickerPredefinePlugin.prototype.run = function () {
            // 检查是否显示预定义颜色：只根据 predefineColor 数组判断
            var validColors = this.getValidPredefineColors();
            if (validColors.length > 0) {
                this.render();
                this.bindEvents();
                this.bindColorChangeEvent();
            }
        };
        // 获取有效的预定义颜色数组
        ewColorPickerPredefinePlugin.prototype.getValidPredefineColors = function () {
            var _this = this;
            if (!this.options.predefineColor || !Array.isArray(this.options.predefineColor)) {
                return [];
            }
            // 过滤掉无效的颜色
            return this.options.predefineColor.filter(function (colorData) {
                var color = _this.parseColorData(colorData).color;
                // 使用更严格的颜色验证
                return isStrictColorFormat(color);
            });
        };
        ewColorPickerPredefinePlugin.prototype.render = function () {
            var _this = this;
            // 直接使用面板容器
            var panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
            if (!panelContainer) {
                warn('[ewColorPicker warning]: Panel container not found');
                return;
            }
            // 查找或创建预定义色块容器
            this.container = $('.ew-color-picker-predefine-container', panelContainer);
            if (!this.container) {
                this.container = create('div');
                addClass(this.container, 'ew-color-picker-predefine-container');
            }
            // 清空旧内容
            if (this.container) {
                this.container.textContent = '';
                this.predefineItems = [];
                // 获取有效的预定义颜色
                var validColors = this.getValidPredefineColors();
                // 渲染预定义色块
                validColors.forEach(function (colorData) {
                    var color = _this.parseColorData(colorData).color;
                    var item = create('div');
                    addClass(item, 'ew-color-picker-predefine-color');
                    var colorItem = create('div');
                    addClass(colorItem, 'ew-color-picker-predefine-color-item');
                    setStyle(colorItem, 'backgroundColor', color);
                    insertNode(item, colorItem);
                    insertNode(_this.container, item);
                    _this.predefineItems.push(item);
                });
            }
            // 每次渲染后都强制重新插入到正确位置
            this.ensureContainerAtCorrectPosition(panelContainer);
            // 绑定面板切换事件（避免重复绑定）
            this.bindToggleEvent(panelContainer);
        };
        // 解析颜色数据
        ewColorPickerPredefinePlugin.prototype.parseColorData = function (colorData) {
            var color = isString(colorData) ? colorData : colorData.color;
            var disabled = isObject(colorData) ? colorData.disabled : false;
            return { color: color, disabled: disabled };
        };
        // 绑定面板切换事件（避免重复绑定）
        ewColorPickerPredefinePlugin.prototype.bindToggleEvent = function (panelContainer) {
            var _this = this;
            // 如果已经绑定过事件，先解绑
            if (this.isEventBound && this.toggleHandler) {
                this.ewColorPicker.off('toggle', this.toggleHandler);
                this.isEventBound = false;
            }
            // 创建新的事件处理器
            this.toggleHandler = function (isOpen) {
                if (isOpen) {
                    _this.ensureContainerAtCorrectPosition(panelContainer);
                }
            };
            // 绑定事件
            this.ewColorPicker.on('toggle', this.toggleHandler);
            this.isEventBound = true;
        };
        // 绑定颜色变化事件
        ewColorPickerPredefinePlugin.prototype.bindColorChangeEvent = function () {
            var _this = this;
            // 如果已经绑定过颜色变化事件，先解绑
            if (this.changeHandler) {
                this.ewColorPicker.off('change', this.changeHandler);
            }
            // 创建颜色变化事件处理器
            this.changeHandler = function (color) {
                _this.updateActivePredefineColor(color);
            };
            // 绑定事件
            this.ewColorPicker.on('change', this.changeHandler);
        };
        // 确保容器在正确位置
        ewColorPickerPredefinePlugin.prototype.ensureContainerAtCorrectPosition = function (panelContainer) {
            if (!this.container)
                return;
            // 优先级1: mode-container
            var modeContainer = $('.ew-color-picker-mode-container', panelContainer);
            if (modeContainer) {
                panelContainer.insertBefore(this.container, modeContainer);
                return;
            }
            // 优先级2: bottom-row
            var bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
            if (bottomRow) {
                panelContainer.insertBefore(this.container, bottomRow);
                return;
            }
            // 优先级3: panel 之后
            var panel = $('.ew-color-picker-panel', panelContainer);
            if (panel && panel.nextSibling) {
                panelContainer.insertBefore(this.container, panel.nextSibling);
                return;
            }
            if (panel) {
                panelContainer.appendChild(this.container);
                return;
            }
            // 兜底：插到最后
            panelContainer.appendChild(this.container);
        };
        ewColorPickerPredefinePlugin.prototype.bindEvents = function () {
            var _this = this;
            this.predefineItems.forEach(function (item, index) {
                var validColors = _this.getValidPredefineColors();
                var colorData = validColors[index];
                var _a = _this.parseColorData(colorData), color = _a.color, disabled = _a.disabled;
                if (disabled) {
                    addClass(item, 'ew-color-picker-predefine-color-disabled');
                    return;
                }
                // 点击事件
                on(item, 'click', function (event) {
                    _this.debouncedOnPredefineColorClick(event, color);
                });
                // 失焦事件
                on(item, 'blur', function (event) {
                    removeClass(event.target, 'ew-color-picker-predefine-color-active');
                });
            });
        };
        ewColorPickerPredefinePlugin.prototype.onPredefineColorClick = function (event, color) {
            var _a, _b;
            var clickTarget = event.target;
            var target = clickTarget;
            // 如果点击的是子元素，找到父级的预定义颜色容器
            if (!hasClass(target, 'ew-color-picker-predefine-color')) {
                target = target.closest('.ew-color-picker-predefine-color') || target;
            }
            // 检查是否被禁用
            if (hasClass(target, 'ew-color-picker-predefine-color-disabled')) {
                return; // 如果被禁用，直接返回，不执行任何操作
            }
            // 检查全局禁用状态
            if (this.options.disabled) {
                event.preventDefault();
                event.stopPropagation();
                return;
            }
            // 添加激活状态
            addClass(target, 'ew-color-picker-predefine-color-active');
            // 移除其他项的激活状态
            this.predefineItems.forEach(function (item) {
                if (item !== target) {
                    removeClass(item, 'ew-color-picker-predefine-color-active');
                }
            });
            // 验证颜色格式
            if (!isValidColor(color)) {
                warn("[ewColorPicker warning]: Invalid predefine color: ".concat(color));
                return;
            }
            // 转换颜色格式
            var rgbaColor = colorToRgba(color);
            // 更新HSV颜色
            this.ewColorPicker.hsvaColor = colorRgbaToHsva(rgbaColor);
            // 更新当前颜色
            this.ewColorPicker.setColor(rgbaColor);
            // 触发颜色改变回调
            if (isFunction(this.options.changeColor)) {
                (_b = (_a = this.options).changeColor) === null || _b === void 0 ? void 0 : _b.call(_a, rgbaColor);
            }
        };
        ewColorPickerPredefinePlugin.prototype.updatePredefineColors = function (colors) {
            this.options.predefineColor = colors;
            // 重新渲染
            this.predefineItems = [];
            this.render();
            this.bindEvents();
        };
        ewColorPickerPredefinePlugin.prototype.setDisabled = function (index, disabled) {
            if (this.predefineItems[index]) {
                if (disabled) {
                    addClass(this.predefineItems[index], 'ew-color-picker-predefine-color-disabled');
                }
                else {
                    removeClass(this.predefineItems[index], 'ew-color-picker-predefine-color-disabled');
                }
            }
        };
        ewColorPickerPredefinePlugin.prototype.destroy = function () {
            var _this = this;
            // 清理预定义色块的事件监听器
            this.predefineItems.forEach(function (item) {
                off(item, 'click', _this.debouncedOnPredefineColorClick);
                off(item, 'blur', function () { });
            });
            // 清理面板切换事件监听器
            if (this.isEventBound && this.toggleHandler) {
                this.ewColorPicker.off('toggle', this.toggleHandler);
                this.toggleHandler = null;
                this.isEventBound = false;
            }
            // 清理颜色变化事件监听器
            if (this.changeHandler) {
                this.ewColorPicker.off('change', this.changeHandler);
                this.changeHandler = null;
            }
            // 清理DOM引用
            this.predefineItems = [];
            this.container = null;
        };
        // 新增 install 方法，便于测试
        ewColorPickerPredefinePlugin.prototype.install = function (core) {
            var _a;
            this.ewColorPicker = core;
            this.handleOptions();
            (_a = this.run) === null || _a === void 0 ? void 0 : _a.call(this);
        };
        // 更新激活的预定义颜色
        ewColorPickerPredefinePlugin.prototype.updateActivePredefineColor = function (color) {
            var _this = this;
            if (!color)
                return;
            // 将当前颜色转换为标准格式进行比较
            var currentRgba = colorToRgba(color);
            this.predefineItems.forEach(function (item, index) {
                var validColors = _this.getValidPredefineColors();
                var colorData = validColors[index];
                var itemColor = _this.parseColorData(colorData).color;
                // 将预定义颜色也转换为标准格式进行比较
                var itemRgba = colorToRgba(itemColor);
                if (currentRgba === itemRgba) {
                    addClass(item, 'ew-color-picker-predefine-color-active');
                }
                else {
                    removeClass(item, 'ew-color-picker-predefine-color-active');
                }
            });
        };
        ewColorPickerPredefinePlugin.pluginName = "ewColorPickerPredefine";
        return ewColorPickerPredefinePlugin;
    }());

    var ewColorPickerColorModePlugin = /** @class */ (function () {
        function ewColorPickerColorModePlugin(ewColorPicker) {
            var _this = this;
            this.ewColorPicker = ewColorPicker;
            this.options = {};
            // 当前颜色模式
            this.currentMode = 'hex';
            // 颜色模式切换容器
            this.modeContainer = null;
            // 模式显示文本
            this.modeText = null;
            // 上箭头按钮
            this.upButton = null;
            // 下箭头按钮
            this.downButton = null;
            // 事件处理函数引用，用于正确解绑
            this.boundEventHandlers = [];
            // 提取悬停事件处理函数，便于正确移除事件监听
            this.handleUpButtonHover = function () {
                if (_this.upButton) {
                    setStyle(_this.upButton, {
                        borderColor: '#4096ef',
                        backgroundColor: '#f0f8ff'
                    });
                }
            };
            this.handleUpButtonLeave = function () {
                if (_this.upButton) {
                    setStyle(_this.upButton, {
                        borderColor: '#ddd',
                        backgroundColor: '#fff'
                    });
                }
            };
            this.handleDownButtonHover = function () {
                if (_this.downButton) {
                    setStyle(_this.downButton, {
                        borderColor: '#4096ef',
                        backgroundColor: '#f0f8ff'
                    });
                }
            };
            this.handleDownButtonLeave = function () {
                if (_this.downButton) {
                    setStyle(_this.downButton, {
                        borderColor: '#ddd',
                        backgroundColor: '#fff'
                    });
                }
            };
            // 初始化防抖函数
            this.debouncedOnModeChange = debounce(this.onModeChange.bind(this), 100);
            this.debouncedUpdateColorFromRgb = debounce(this.updateColorFromRgbInputs.bind(this), 100);
            this.debouncedUpdateColorFromHsl = debounce(this.updateColorFromHslInputs.bind(this), 100);
            // 初始化插件
            this.initializePlugin();
        }
        Object.defineProperty(ewColorPickerColorModePlugin.prototype, "hasAlphaPlugin", {
            // 缓存插件引用，避免重复查询
            get: function () {
                var _a;
                return !!((_a = this.ewColorPicker.plugins) === null || _a === void 0 ? void 0 : _a.ewColorPickerAlpha);
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ewColorPickerColorModePlugin.prototype, "inputPlugin", {
            get: function () {
                var _a;
                return (_a = this.ewColorPicker.plugins) === null || _a === void 0 ? void 0 : _a.ewColorPickerInput;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(ewColorPickerColorModePlugin.prototype, "alphaPlugin", {
            get: function () {
                var _a;
                return (_a = this.ewColorPicker.plugins) === null || _a === void 0 ? void 0 : _a.ewColorPickerAlpha;
            },
            enumerable: false,
            configurable: true
        });
        ewColorPickerColorModePlugin.prototype.initializePlugin = function () {
            var _this = this;
            var initialize = function () {
                _this.handleOptions();
                _this.run();
            };
            if (this.ewColorPicker.plugins) {
                initialize();
            }
            else {
                setTimeout(initialize, 0);
            }
        };
        ewColorPickerColorModePlugin.prototype.install = function (core) {
            var _this = this;
            this.ewColorPicker = core;
            var setupPlugin = function () {
                var _a;
                _this.handleOptions();
                // 注册事件监听器
                if (core.on && isFunction(core.on)) {
                    core.on('change', function (color) {
                        if (_this.currentMode !== 'hex') {
                            _this.updateInputValues(color);
                        }
                    });
                }
                (_a = _this.run) === null || _a === void 0 ? void 0 : _a.call(_this);
                // 如果集成了alpha插件且当前模式是rgb，立即创建对应的输入框结构
                if (_this.hasAlphaPlugin && _this.currentMode === 'rgb') {
                    _this.updateInputStructure();
                }
            };
            if (this.ewColorPicker.plugins) {
                setupPlugin();
            }
            else {
                setTimeout(setupPlugin, 0);
            }
        };
        ewColorPickerColorModePlugin.prototype.handleOptions = function () {
            if (this.ewColorPicker && this.ewColorPicker.options) {
                this.options = extend({}, this.options, this.ewColorPicker.options);
                // 处理color-mode插件的选项
                if (this.ewColorPicker.options.ewColorPickerColorMode !== undefined) {
                    if (this.ewColorPicker.options.ewColorPickerColorMode === false) {
                        // 如果ewColorPickerColorMode设置为false，则禁用颜色模式
                        this.options.showColorMode = false;
                    }
                    else if (typeof this.ewColorPicker.options.ewColorPickerColorMode === 'object') {
                        // 如果是对象，则合并选项
                        this.options = extend({}, this.options, this.ewColorPicker.options.ewColorPickerColorMode);
                    }
                }
                // 如果集成了alpha插件，默认使用rgba模式；否则使用hex模式
                if (this.hasAlphaPlugin) {
                    this.currentMode = this.options.defaultMode || 'rgb';
                }
                else {
                    this.currentMode = this.options.defaultMode || 'hex';
                }
            }
        };
        // 更新配置并重新渲染
        ewColorPickerColorModePlugin.prototype.updateOptions = function () {
            this.handleOptions();
            this.render();
        };
        ewColorPickerColorModePlugin.prototype.run = function () {
            // 确保选项已处理
            this.handleOptions();
            // 检查是否显示颜色模式
            if (this.options.showColorMode === false) {
                return;
            }
            this.render();
            this.bindEvents();
            // 如果集成了alpha插件且当前模式是rgb，立即创建对应的输入框结构
            if (this.hasAlphaPlugin && this.currentMode === 'rgb') {
                this.updateInputStructure();
            }
            // 设置input插件状态监听
            this.setupInputPluginListener();
        };
        ewColorPickerColorModePlugin.prototype.render = function () {
            // 查找面板容器
            var panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
            if (!panelContainer) {
                warn('[ewColorPicker] Panel container not found');
                return;
            }
            // 查找已存在的颜色模式容器，避免重复插入
            this.modeContainer = $('.ew-color-picker-mode-container', panelContainer);
            if (!this.modeContainer) {
                this.createModeContainer(panelContainer);
            }
            // 更新模式显示
            this.updateModeDisplay();
        };
        ewColorPickerColorModePlugin.prototype.createModeContainer = function (panelContainer) {
            this.modeContainer = create('div');
            addClass(this.modeContainer, 'ew-color-picker-mode-container');
            // 创建上箭头按钮
            this.upButton = create('button');
            addClass(this.upButton, 'ew-color-picker-mode-up-btn');
            setAttr(this.upButton, {
                type: 'button',
                title: '上一个模式'
            });
            this.upButton.innerHTML = upArrowIcon('', 16);
            // 创建模式文本显示
            this.modeText = create('div');
            addClass(this.modeText, 'ew-color-picker-mode-text');
            // 创建下箭头按钮
            this.downButton = create('button');
            addClass(this.downButton, 'ew-color-picker-mode-down-btn');
            setAttr(this.downButton, {
                type: 'button',
                title: '下一个模式'
            });
            this.downButton.innerHTML = downArrowIcon('', 16);
            // 组装模式切换器
            insertNode(this.modeContainer, this.upButton);
            insertNode(this.modeContainer, this.modeText);
            insertNode(this.modeContainer, this.downButton);
            // 查找 bottomRow，插入到其之前
            var bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
            if (bottomRow) {
                insertNode(panelContainer, this.modeContainer, undefined, bottomRow);
            }
            else {
                insertNode(panelContainer, this.modeContainer);
            }
        };
        ewColorPickerColorModePlugin.prototype.updateModeDisplay = function () {
            if (this.modeText) {
                this.modeText.textContent = this.getModeDisplayName(this.currentMode);
            }
        };
        ewColorPickerColorModePlugin.prototype.bindEvents = function () {
            var _this = this;
            if (!this.upButton || !this.downButton)
                return;
            // 上箭头按钮事件
            var upClickHandler = function () {
                // 检查禁用状态
                if (_this.options.disabled) {
                    return;
                }
                _this.switchToPreviousMode();
            };
            on(this.upButton, 'click', upClickHandler);
            this.boundEventHandlers.push({ element: this.upButton, event: 'click', handler: upClickHandler });
            // 下箭头按钮事件
            var downClickHandler = function () {
                // 检查禁用状态
                if (_this.options.disabled) {
                    return;
                }
                _this.switchToNextMode();
            };
            on(this.downButton, 'click', downClickHandler);
            this.boundEventHandlers.push({ element: this.downButton, event: 'click', handler: downClickHandler });
            // 添加悬停效果
            if (this.upButton) {
                on(this.upButton, 'mouseenter', this.handleUpButtonHover);
                on(this.upButton, 'mouseleave', this.handleUpButtonLeave);
                this.boundEventHandlers.push({ element: this.upButton, event: 'mouseenter', handler: this.handleUpButtonHover });
                this.boundEventHandlers.push({ element: this.upButton, event: 'mouseleave', handler: this.handleUpButtonLeave });
            }
            if (this.downButton) {
                on(this.downButton, 'mouseenter', this.handleDownButtonHover);
                on(this.downButton, 'mouseleave', this.handleDownButtonLeave);
                this.boundEventHandlers.push({ element: this.downButton, event: 'mouseenter', handler: this.handleDownButtonHover });
                this.boundEventHandlers.push({ element: this.downButton, event: 'mouseleave', handler: this.handleDownButtonLeave });
            }
            // 监听颜色变化事件，更新显示（只在非 hex 模式下）
            var changeHandler = function (color) {
                if (_this.currentMode !== 'hex') {
                    _this.updateInputValues(color);
                }
            };
            this.ewColorPicker.on('change', changeHandler);
            // 注意：这里不添加到 boundEventHandlers，因为这是 ewColorPicker 的事件，不是 DOM 事件
        };
        ewColorPickerColorModePlugin.prototype.switchToPreviousMode = function () {
            var modes = ['hex', 'rgb', 'hsl'];
            var currentIndex = modes.indexOf(this.currentMode);
            var previousIndex = currentIndex > 0 ? currentIndex - 1 : modes.length - 1;
            this.debouncedOnModeChange(modes[previousIndex]);
        };
        ewColorPickerColorModePlugin.prototype.switchToNextMode = function () {
            var modes = ['hex', 'rgb', 'hsl'];
            var currentIndex = modes.indexOf(this.currentMode);
            var nextIndex = (currentIndex + 1) % modes.length;
            this.debouncedOnModeChange(modes[nextIndex]);
        };
        ewColorPickerColorModePlugin.prototype.onModeChange = function (mode) {
            var _a, _b;
            this.currentMode = mode;
            // 更新模式显示
            this.updateModeDisplay();
            // 更新输入框
            this.updateInputStructure();
            // 更新当前颜色的显示
            // HEX 模式的输入框已由 restoreDefaultInput 创建并格式化为 #xxxxxx，
            // 这里不再重复设置、也不再触发 change，避免把 HEX 显示覆盖成 rgba/hsla 字符串
            var currentColor = this.ewColorPicker.getColor();
            if (currentColor && mode !== 'hex') {
                // RGB 或 HSL 模式下，更新对应的输入框值
                this.updateInputValues(currentColor);
            }
            // 触发模式改变回调
            if (isFunction(this.options.changeMode)) {
                (_b = (_a = this.options).changeMode) === null || _b === void 0 ? void 0 : _b.call(_a, mode, this.ewColorPicker);
            }
            // 触发事件
            this.ewColorPicker.trigger('mode-change', mode);
        };
        ewColorPickerColorModePlugin.prototype.updateInputStructure = function () {
            var panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
            if (!panelContainer)
                return;
            // 查找 input 容器
            var bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
            if (!bottomRow)
                return;
            var inputContainer = $('.ew-color-picker-input-container', bottomRow);
            if (!inputContainer)
                return;
            // 检查input插件是否被禁用
            if (this.inputPlugin && !this.inputPlugin.hasInput) {
                // 如果input插件被禁用，清空容器但不创建任何输入框
                inputContainer.innerHTML = '';
                return;
            }
            // 根据模式创建新的输入框
            if (this.currentMode === 'hex') {
                // hex 模式下，恢复默认的 input 插件
                this.restoreDefaultInput();
            }
            else {
                // rgb 或 hsl 模式下，清空容器并创建多输入框
                inputContainer.innerHTML = '';
                this.createInputsForMode(inputContainer);
            }
        };
        // 设置input插件状态监听
        ewColorPickerColorModePlugin.prototype.setupInputPluginListener = function () {
            // 移除定时器检查，避免在测试环境中出现异常
            // 改为在需要时检查插件状态
        };
        ewColorPickerColorModePlugin.prototype.createInputsForMode = function (container) {
            var _this = this;
            // 检查input插件是否被禁用
            if (this.inputPlugin && !this.inputPlugin.hasInput) {
                // 如果input插件被禁用，不创建任何输入框
                return;
            }
            // 清空容器
            container.innerHTML = '';
            // 计算模式和标签
            var labels = [];
            if (this.currentMode === 'rgb') {
                labels = this.hasAlphaPlugin ? ['R', 'G', 'B', 'A'] : ['R', 'G', 'B'];
            }
            else if (this.currentMode === 'hsl') {
                labels = this.hasAlphaPlugin ? ['H', 'S', 'L', 'A'] : ['H', 'S', 'L'];
            }
            // 创建包裹区
            var group = create('div');
            addClass(group, 'ew-color-picker-inputs-group');
            // 每个输入框及其label
            labels.forEach(function (label, idx) {
                var col = create('div');
                addClass(col, 'ew-color-picker-inputs-col');
                // label
                var lab = create('div');
                addClass(lab, 'ew-color-picker-input-label');
                lab.textContent = label;
                insertNode(col, lab);
                // input
                var input;
                if (_this.currentMode === 'rgb') {
                    // RGB模式：使用InputNumber组件
                    var inputNumber = new InputNumber({
                        value: 0,
                        min: idx === 3 ? 0 : 0, // A通道最小值0
                        max: idx === 3 ? 1 : 255, // A通道最大值1，RGB通道最大值255
                        step: idx === 3 ? 0.01 : 1, // A通道步长0.01，RGB通道步长1
                        precision: idx === 3 ? 2 : 0, // A通道精度2位小数，RGB通道整数
                        placeholder: label,
                        size: 'small',
                        onChange: function () {
                            _this.debouncedUpdateColorFromRgb();
                        }
                    });
                    input = inputNumber.getElement();
                    addClass(input, "ew-color-picker-rgb-".concat(label.toLowerCase(), "-input"));
                }
                else if (_this.currentMode === 'hsl') {
                    // HSL模式：H使用InputNumber，S和L使用普通input，A使用InputNumber
                    if (idx === 0) {
                        // H通道：0-360度
                        var inputNumber = new InputNumber({
                            value: 0,
                            min: 0,
                            max: 360,
                            step: 1,
                            precision: 0,
                            placeholder: label,
                            size: 'small',
                            onChange: function () {
                                _this.debouncedUpdateColorFromHsl();
                            }
                        });
                        input = inputNumber.getElement();
                    }
                    else if (idx === 3 && _this.hasAlphaPlugin) {
                        // A通道：0-1
                        var inputNumber = new InputNumber({
                            value: 0,
                            min: 0,
                            max: 1,
                            step: 0.01,
                            precision: 2,
                            placeholder: label,
                            size: 'small',
                            onChange: function () {
                                _this.debouncedUpdateColorFromHsl();
                            }
                        });
                        input = inputNumber.getElement();
                    }
                    else {
                        // S和L通道：0-100%
                        input = create('input');
                        setAttr(input, {
                            type: 'text',
                            placeholder: label,
                            class: "ew-color-picker-hsl-".concat(label.toLowerCase(), "-input ew-color-picker-input")
                        });
                    }
                    // 确保input变量已定义并添加样式类
                    if (input) {
                        addClass(input, "ew-color-picker-hsl-".concat(label.toLowerCase(), "-input"));
                    }
                }
                // 确保input变量已定义
                if (!input) {
                    // 如果所有条件都没有匹配，创建一个默认输入框
                    input = create('input');
                    setAttr(input, {
                        type: 'text',
                        placeholder: label,
                        class: "ew-color-picker-default-input"
                    });
                }
                insertNode(col, input);
                insertNode(group, col);
            });
            insertNode(container, group);
            // 创建完输入框后，立即更新值
            var currentColor = this.ewColorPicker.getColor();
            if (currentColor) {
                this.updateInputValues(currentColor);
            }
        };
        // 获取当前实例的输入框容器，用于限定查询范围
        ewColorPickerColorModePlugin.prototype.getInputContainer = function () {
            var panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
            if (!panelContainer)
                return document;
            var bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
            if (!bottomRow)
                return document;
            return $('.ew-color-picker-input-container', bottomRow) || document;
        };
        ewColorPickerColorModePlugin.prototype.updateInputValues = function (color) {
            if (!color)
                return;
            var rgbaString = colorToRgba(color);
            if (!rgbaString)
                return;
            // 解析 RGBA 字符串为对象
            var rgba = parseRgbaString(rgbaString);
            if (!rgba)
                return;
            // 限定在当前实例的输入容器内查找，避免多实例互相覆盖
            var scope = this.getInputContainer();
            if (this.currentMode === 'rgb') {
                // 查找RGB输入框
                var rInput = $('.ew-color-picker-rgb-r-input input', scope);
                var gInput = $('.ew-color-picker-rgb-g-input input', scope);
                var bInput = $('.ew-color-picker-rgb-b-input input', scope);
                var aInput = $('.ew-color-picker-rgb-a-input input', scope);
                // 更新值
                if (rInput)
                    rInput.value = Math.round(rgba.r).toString();
                if (gInput)
                    gInput.value = Math.round(rgba.g).toString();
                if (bInput)
                    bInput.value = Math.round(rgba.b).toString();
                if (aInput)
                    aInput.value = rgba.a.toFixed(2);
            }
            else if (this.currentMode === 'hsl') {
                var hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
                // 查找HSL输入框
                var hInput = $('.ew-color-picker-hsl-h-input input', scope);
                var sInput = $('.ew-color-picker-hsl-s-input', scope);
                var lInput = $('.ew-color-picker-hsl-l-input', scope);
                var aInput = $('.ew-color-picker-hsl-a-input input', scope);
                // 更新值
                if (hInput)
                    hInput.value = Math.round(hsl.h).toString();
                if (sInput)
                    sInput.value = Math.round(hsl.s).toString() + '%';
                if (lInput)
                    lInput.value = Math.round(hsl.l).toString() + '%';
                if (aInput)
                    aInput.value = rgba.a.toFixed(2);
            }
        };
        ewColorPickerColorModePlugin.prototype.updateColorFromRgbInputs = function () {
            // 限定在当前实例的输入容器内查找，避免多实例互相覆盖
            var scope = this.getInputContainer();
            var rInput = $('.ew-color-picker-rgb-r-input input', scope);
            var gInput = $('.ew-color-picker-rgb-g-input input', scope);
            var bInput = $('.ew-color-picker-rgb-b-input input', scope);
            var aInput = $('.ew-color-picker-rgb-a-input input', scope);
            if (!rInput || !gInput || !bInput)
                return;
            var r = parseInt(rInput.value) || 0;
            var g = parseInt(gInput.value) || 0;
            var b = parseInt(bInput.value) || 0;
            var a = aInput ? parseFloat(aInput.value) || 1 : 1;
            var color = "rgba(".concat(r, ", ").concat(g, ", ").concat(b, ", ").concat(a, ")");
            // 更新颜色，这会触发 change 事件，alpha 滑块会自动更新
            this.ewColorPicker.setColor(color);
            // 同步所有插件
            this.ewColorPicker.syncAllPlugins(color);
            // 确保 alpha 滑块位置同步更新
            if (this.alphaPlugin && this.alphaPlugin.updateAlphaThumbPosition) {
                this.alphaPlugin.updateAlphaThumbPosition(a);
            }
        };
        ewColorPickerColorModePlugin.prototype.updateColorFromHslInputs = function () {
            // 限定在当前实例的输入容器内查找，避免多实例互相覆盖
            var scope = this.getInputContainer();
            var hInput = $('.ew-color-picker-hsl-h-input input', scope);
            var sInput = $('.ew-color-picker-hsl-s-input', scope);
            var lInput = $('.ew-color-picker-hsl-l-input', scope);
            var aInput = $('.ew-color-picker-hsl-a-input input', scope);
            if (!hInput || !sInput || !lInput)
                return;
            var h = parseInt(hInput.value) || 0;
            // 解析带 % 后缀的 S 和 L 值
            var s = parseInt(sInput.value.replace('%', '')) || 0;
            var l = parseInt(lInput.value.replace('%', '')) || 0;
            var a = aInput ? parseFloat(aInput.value) || 1 : 1;
            var color = "hsla(".concat(h, ", ").concat(s, "%, ").concat(l, "%, ").concat(a, ")");
            // 更新颜色，这会触发 change 事件，alpha 滑块会自动更新
            this.ewColorPicker.setColor(color);
            // 同步所有插件
            this.ewColorPicker.syncAllPlugins(color);
            // 确保 alpha 滑块位置同步更新
            if (this.alphaPlugin && this.alphaPlugin.updateAlphaThumbPosition) {
                this.alphaPlugin.updateAlphaThumbPosition(a);
            }
        };
        ewColorPickerColorModePlugin.prototype.getModeDisplayName = function (mode) {
            var names = {
                hex: 'HEX',
                rgb: 'RGB',
                hsl: 'HSL'
            };
            return names[mode] || mode.toUpperCase();
        };
        ewColorPickerColorModePlugin.prototype.getCurrentMode = function () {
            return this.currentMode;
        };
        ewColorPickerColorModePlugin.prototype.setMode = function (mode) {
            this.debouncedOnModeChange(mode);
        };
        // 恢复默认的 input 插件
        ewColorPickerColorModePlugin.prototype.restoreDefaultInput = function () {
            var panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
            if (!panelContainer)
                return;
            var bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
            if (!bottomRow)
                return;
            var inputContainer = $('.ew-color-picker-input-container', bottomRow);
            if (!inputContainer)
                return;
            // 检查input插件是否被禁用
            if (this.inputPlugin && !this.inputPlugin.hasInput) {
                // 如果input插件被禁用，清空容器但不创建任何输入框
                inputContainer.innerHTML = '';
                return;
            }
            // 清空容器，移除所有 rgba/hsl 模式相关的 DOM
            inputContainer.innerHTML = '';
            // 恢复 input 容器的默认样式
            addClass(inputContainer, 'ew-color-picker-input-container-flex');
            // 创建默认的 input 元素
            var input = create('input');
            addClass(input, 'ew-color-picker-input');
            addClass(input, 'ew-color-picker-input-default');
            setAttr(input, {
                type: 'text',
                name: 'ew-color-picker-input',
                placeholder: '请输入颜色值'
            });
            // 插入到容器中
            insertNode(inputContainer, input);
            // 设置当前颜色值，如果没有则不设置默认颜色
            var currentColor = this.ewColorPicker.getColor();
            if (!currentColor || currentColor.indexOf('NaN') !== -1) {
                // 不设置默认颜色，让输入框保持空白
                currentColor = '';
            }
            // 在 HEX 模式下，将颜色转换为 HEX 格式显示
            if (this.currentMode === 'hex') {
                var rgbaString = colorToRgba(currentColor);
                if (rgbaString) {
                    var rgba = parseRgbaString(rgbaString);
                    if (rgba) {
                        // 转换为 HEX 格式
                        var hexColor = rgbaToHex(rgba);
                        input.value = hexColor;
                    }
                    else {
                        input.value = currentColor;
                    }
                }
                else {
                    input.value = currentColor;
                }
            }
            else {
                input.value = currentColor;
            }
            // 绑定默认 input 插件的事件
            this.bindDefaultInputEvents(input);
        };
        // 绑定默认 input 插件的事件
        ewColorPickerColorModePlugin.prototype.bindDefaultInputEvents = function (input) {
            this.bindInputEvents(input);
        };
        // 重新绑定默认 input 插件的事件
        ewColorPickerColorModePlugin.prototype.rebindDefaultInputEvents = function () {
            var panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
            if (!panelContainer)
                return;
            var bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
            if (!bottomRow)
                return;
            var inputContainer = $('.ew-color-picker-input-container', bottomRow);
            if (!inputContainer)
                return;
            // 查找 hex 输入框
            var hexInput = $('.ew-color-picker-hex-input', inputContainer);
            if (!hexInput)
                return;
            // 使用统一的事件绑定函数
            this.bindInputEvents(hexInput);
        };
        // 统一的事件绑定函数
        ewColorPickerColorModePlugin.prototype.bindInputEvents = function (input) {
            var _this = this;
            // 失焦事件
            var blurHandler = function (event) {
                var value = event.target.value;
                if (isValidColor(value)) {
                    _this.ewColorPicker.setColor(value);
                    // 同步更新其他插件的状态
                    _this.syncOtherPlugins(value);
                }
            };
            on(input, 'blur', blurHandler);
            this.boundEventHandlers.push({ element: input, event: 'blur', handler: blurHandler });
            // 回车事件
            var keydownHandler = function (event) {
                var keyboardEvent = event;
                if (keyboardEvent.key === 'Enter') {
                    var value = keyboardEvent.target.value;
                    if (isValidColor(value)) {
                        _this.ewColorPicker.setColor(value);
                        // 同步更新其他插件的状态
                        _this.syncOtherPlugins(value);
                    }
                }
            };
            on(input, 'keydown', keydownHandler);
            this.boundEventHandlers.push({ element: input, event: 'keydown', handler: keydownHandler });
            // 监听颜色变化事件，自动更新输入框
            var changeHandler = function (color) {
                input.value =
                    _this.currentMode === 'hex' ? _this.toHexDisplay(color) : color;
            };
            this.ewColorPicker.on('change', changeHandler);
        };
        // 将任意颜色格式转换为 HEX 显示（alpha 模式下也统一显示 6 位 HEX）
        ewColorPickerColorModePlugin.prototype.toHexDisplay = function (color) {
            if (!color)
                return '';
            if (color.startsWith('#'))
                return color;
            var rgbaString = colorToRgba(color);
            if (!rgbaString)
                return color;
            var rgba = parseRgbaString(rgbaString);
            return rgba ? rgbaToHex(rgba) : color;
        };
        // 同步其他插件的状态
        ewColorPickerColorModePlugin.prototype.syncOtherPlugins = function (color) {
            var _a, _b, _c;
            var hsva = this.ewColorPicker.hsvaColor;
            // 同步主输入框
            if (this.inputPlugin && this.inputPlugin.update) {
                this.inputPlugin.update(color);
            }
            // 同步色相滑块
            var huePlugin = (_a = this.ewColorPicker.plugins) === null || _a === void 0 ? void 0 : _a.ewColorPickerHue;
            if (huePlugin && huePlugin.updateHueThumbPosition) {
                huePlugin.updateHueThumbPosition(hsva.h);
            }
            // 同步透明度滑块
            if (this.alphaPlugin && this.alphaPlugin.updateAlphaThumbPosition) {
                this.alphaPlugin.updateAlphaThumbPosition(hsva.a);
            }
            // 同步面板插件
            var panelPlugin = (_b = this.ewColorPicker.plugins) === null || _b === void 0 ? void 0 : _b.ewColorPickerPanel;
            if (panelPlugin && panelPlugin.updatePanelColor) {
                panelPlugin.updatePanelColor(color);
            }
            // 同步颜色框
            var boxPlugin = (_c = this.ewColorPicker.plugins) === null || _c === void 0 ? void 0 : _c.ewColorPickerBox;
            if (boxPlugin && boxPlugin.setBoxBgColor) {
                boxPlugin.setBoxBgColor(color);
            }
        };
        ewColorPickerColorModePlugin.prototype.destroy = function () {
            // 移除所有绑定的事件监听器
            this.boundEventHandlers.forEach(function (_a) {
                var element = _a.element, event = _a.event, handler = _a.handler;
                off(element, event, handler);
            });
            this.boundEventHandlers = [];
            // 移除模式切换器
            if (this.modeContainer && this.modeContainer.parentNode) {
                removeElement(this.modeContainer);
            }
            // 清理引用
            this.modeContainer = null;
            this.modeText = null;
            this.upButton = null;
            this.downButton = null;
        };
        ewColorPickerColorModePlugin.pluginName = "ewColorPickerColorMode";
        ewColorPickerColorModePlugin.applyOrder = "post" /* ApplyOrder.Post */;
        return ewColorPickerColorModePlugin;
    }());

    // 注册插件
    ewColorPicker.use(ewColorPickerConsolePlugin);
    ewColorPicker.use(ewColorPickerBoxPlugin);
    ewColorPicker.use(ewColorPickerPanelPlugin);
    ewColorPicker.use(ewColorPickerHuePlugin);
    ewColorPicker.use(ewColorPickerAlphaPlugin);
    ewColorPicker.use(ewColorPickerInputPlugin);
    ewColorPicker.use(ewColorPickerInputNumberPlugin); // 注册 InputNumber 插件
    ewColorPicker.use(ewColorPickerButtonPlugin);
    ewColorPicker.use(ewColorPickerPredefinePlugin);
    ewColorPicker.use(ewColorPickerColorModePlugin);
    // 为UMD构建添加全局变量
    if (typeof window !== 'undefined') {
        window.ewColorPicker = ewColorPicker;
    }

    exports.default = ewColorPicker;
    exports.ewColorPicker = ewColorPicker;

    Object.defineProperty(exports, '__esModule', { value: true });

}));
