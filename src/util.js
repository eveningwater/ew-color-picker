export let addMethod = (instance, method, func) => {
    instance.prototype[method] = func;
    return instance;
}
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
}
util.addClass = (el, className) => el.classList.add(className);
util.removeClass = (el, className) => el.classList.remove(className);
util['setCss'] = (el, prop, value) => el.style[prop] = value;
util.isDom = el => util.isShallowObject(HTMLElement) ? el instanceof HTMLElement : el && util.isShallowObject(el) && el.nodeType === 1 && util.isString(el.nodeName) || el instanceof HTMLCollection || el instanceof NodeList;
util.ewError = value => console.error('[ewColorPicker warn]\n' + new Error(value));
util.deepCloneObjByJSON = obj => JSON.parse(JSON.stringify(obj));
util.deepCloneObjByRecursion = (function f(obj) {
    if (!util.isShallowObject(obj)) return;
    let cloneObj = util.isDeepArray(obj) ? [] : {};
    for (let k in obj) {
        cloneObj[k] = util.isShallowObject(obj[k]) ? f(obj[k]) : obj[k];
    }
    return cloneObj;
});
util.getCss = (el, prop) => {
    const getStyle = el.currentStyle ? function (prop) {
        const propName = el.currentStyle[prop];
        if (propName.indexOf('height') > -1 && propName.search(/px/i) > -1) {
            const rect = el.getBoundingClientRect;
            return rect.bottom - rect.top - parseInt(getStyle('padding-bottom')) - parseInt(getStyle('padding-top')) + 'px';
        }
    } : function (prop) {
        return window.getComputedStyle(el, null)[prop];
    };
    return getStyle(prop);
};
util.$ = ident => document.querySelector(ident);
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
//the event
util.eventType = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];
export default util;