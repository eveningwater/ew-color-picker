export let addMethod = (instance, method, func) => {
    instance.prototype[method] = func;
    return instance;
}
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
    const findNode = (node) => {
        const children = node.children;
        if (!children) return;
        const childrenArr = util.ewObjToArray(children);
        childrenArr.forEach(item => nodes.push(item));
        childrenArr.forEach(item => findNode(item));
    }
    findNode(el);
    const mouseHandler = (event) => {
        const target = event.target;
        if(nodes.some(item => item.className === target.className))return;
        callback(nodes, mouseHandler);
    }
    util.on(document, 'mousedown', mouseHandler);
}
util["unBindMouseDown"] = (nodes, mouseHandler) => {
    if (!util.isDeepArray(nodes)) return;
    const nodeLen = nodes.length;
    if (nodeLen > 0) {
        for (let i = 0; i < nodeLen; i++) {
            nodes.splice(i, 1);
        }
    }
    util.off(document, 'mousedown', mouseHandler);
}
//the event
util.eventType = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];
export default util;