export let addMethod = function(instance,method,func){
    instance.prototype[method] = func;
    return instance;
}
const util = Object.create(null);
const _toString = Object.prototype.toString;
['Number','String','Function'].forEach(type => util['is' + type] = function(value){
    return typeof value === type.toLowerCase();
});
util.addMethod = addMethod;
['Object','Array','RegExp'].forEach(type => util['isDeep' + type] = function(value){
    return _toString.call(value).slice(8,-1).toLowerCase() === type.toLowerCase();
});
util.isShallowObject = function(value){
    return typeof value === 'object' && !util.isNull(value);
}
util['ewObjToArray'] = function(value){
    return util.isShallowObject(value) ? Array.prototype.slice.call(value) : value;
}
util.isNull = function(value){
    return value === null;
}
util.ewAssign = function(target,args){
    if (util.isNull(target)) return;
    if (Object.assign) {
        return Object.assign(target, args);
    } else {
        var _ = Object(target);
        for (var j = 1,len = arguments.length; j < len; j += 1) {
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
util.addClass = function(el,className){
    return el.classList.add(className);
}
util.removeClass = function(el,className){
    return el.classList.remove(className);
}
util['setCss'] = function (el, prop, value) {
    el.style[prop] = value;
}
util.isDom = function(el){
    return util.isShallowObject(HTMLElement) ? el instanceof HTMLElement : el && util.isShallowObject(el) && el.nodeType === 1 && util.isString(el.nodeName) || el instanceof HTMLCollection || el instanceof NodeList;
}
util.ewError = function(value){
    return console.error('[ewColorPicker warn]\n' + new Error(str));
}
util.deepCloneObjByJSON = function(obj){
    return JSON.parse(JSON.stringify(obj));
}
util.deepCloneObjByRecursion = (function f(obj) {
    if (!util.isShallowObject(obj)) return;
    let cloneObj = util.isDeepArray(obj) ? [] : {};
    for (var k in obj) {
        cloneObj[k] = util.isShallowObject(obj[k]) ? f(obj[k]) : obj[k];
    }
    return cloneObj;
});
util.getCss = function (el, prop) {
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
util.getDom = function(ident){
    var selector,
        sType = ident.slice(0, 1),
        identTxt = ident.slice(1);
    if (/^[#\.]/.test(sType)) {
        if (sType === "#") {
            selector = document.getElementById(identTxt);
        }
        else if (sType === ".") {
            selector = document.getElementsByClassName(identTxt);
        }
    } else {
        selector = document.getElementsByTagName(ident);
    }
    return selector;
}
//the event
util.eventType = navigator.userAgent.match(/(iPhone|iPod|Android|ios)/i) ? ['touchstart', 'touchmove', 'touchend'] : ['mousedown', 'mousemove', 'mouseup'];
export default util;