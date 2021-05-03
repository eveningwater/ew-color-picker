import util from "./util";

/**
 * 获取元素的子元素
 * @param {*} el 
 * @param {*} prop 
 * @param {*} bool 
 */
export function getELByClass(el, prop, bool) {
    let child = el.firstElementChild;
    if(!util.hasClass(child,'ew-color-picker-container'))child = el;
    return !bool ? child.querySelector('.' + prop) : child.querySelectorAll('.' + prop);
}