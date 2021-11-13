export let addMethod = (instance, method, func) => {
    instance.prototype[method] = func;
    return instance;
}
const util = Object.create(null);
const _toString = Object.prototype.toString,
      hasOwn = Object.prototype.hasOwnProperty;
['Number', 'String', 'Function', 'Undefined', 'Boolean'].forEach(type => util['is' + type] = value => typeof value === type.toLowerCase());
util.addMethod = addMethod;
['Object', 'Array', 'RegExp'].forEach(type => util['isDeep' + type] = value => _toString.call(value).slice(8, -1).toLowerCase() === type.toLowerCase());
util.isShallowObject = value => typeof value === 'object' && !util.isNull(value);
util['ewObjToArray'] = value => util.isShallowObject(value) ? Array.prototype.slice.call(value) : value;
util.isNull = value => value === null;
util.ewAssign = function (target) {
    if (util.isNull(target)) return;
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
util.addClass = (el, className) => el.classList.add(className);
util.removeClass = (el, className) => el.classList.remove(className);
util.hasClass = (el, className) => {
    let _hasClass = (value) => new RegExp(" " + el.className + " ").test(" " + value + " ");
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
}
util.isDom = el => util.isShallowObject(HTMLElement) ? el instanceof HTMLElement : el && util.isShallowObject(el) && el.nodeType === 1 && util.isString(el.nodeName) || el instanceof HTMLCollection || el instanceof NodeList;
util.ewError = value => console.error('[ewColorPicker warn]\n' + new Error(value));
util.ewWarn = value => console.warn('[ewColorPicker warn]\n' + value);
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
util.$ = (selector,el = document) => el.querySelector(selector);
util.$$ = (selector,el = document) => el.querySelectorAll(selector);
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
util['getRect'] = (el) => el.getBoundingClientRect();
util['baseClickOutSide'] = (element, isUnbind = true, callback) => {
    const mouseHandler = (event) => {
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
    }
    util.on(document, util.eventType[0], mouseHandler);
}
util["clickOutSide"] = (context, config, callback) => {
    const mouseHandler = (event) => {
        const rect = util.getRect(context.$Dom.picker);
        let boxRect = null;
        if (config.hasBox) {
            boxRect = util.getRect(context.$Dom.box);
        }
        const target = event.target;
        if (!target){
            return;
        }
        const targetRect = util.getRect(target);
        if (config.hasBox) {
            if (targetRect.x >= rect.x && targetRect.y >= rect.y && targetRect.width <= rect.width){
                return;
            }
            if (targetRect.x >= boxRect.x && targetRect.y >= boxRect.y && targetRect.width <= boxRect.width && targetRect.height <= boxRect.height){
                return;
            }
            callback();
        } else {
            if (targetRect.x >= rect.x && targetRect.y >= rect.y && targetRect.width <= rect.width && targetRect.height <= rect.height){
                return;
            }
            callback();
        }
        setTimeout(() => {
            util.off(document,util.eventType[0],mouseHandler);
            util.on(document, util.eventType[0], mouseHandler);
        },0);
    }
    util.on(document, util.eventType[0], mouseHandler);
}
util['createUUID'] = () => (Math.random() * 10000000).toString(16).substr(0, 4) + '-' + (new Date()).getTime() + '-' + Math.random().toString().substr(2, 5);
util.removeAllSpace = (value) => value.replace(/\s+/g, "");
util.isJQDom = dom => typeof window.jQuery !== "undefined" && dom instanceof jQuery;
util.isPromise = value => !util.isUndefined(value) && !util.isNull(value) && util.isFunction(value.then) && util.isFunction(value.catch);
const classnames = function(...args){
    const classes = [];
    for(let i = 0,l = args.length;i < l;i++){
        const arg = args[i];
        if(!arg){
            continue;
        }
        if(util.isString(arg) || util.isNumber(arg)){
            classes.push(arg);
        }else if(util.isDeepArray(arg)){
            if(arg.length){
                const __class = classnames.apply(null,arg);
                if(__class){
                    classes.push(__class);
                }
            }
        }else{
            if(arg.toString === _toString){
                for(let key in arg){
                    if(hasOwn.call(arg,key) && arg[key]){
                        classes.push(key);
                    }
                }
            }else {
                classes.push(arg.toString())
            }
        }
    }
    return classes.join(" ");
}
util.classnames = classnames;
//the event
util.eventType = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];
export default util;