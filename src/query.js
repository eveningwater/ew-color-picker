/**
 * 获取元素的子元素
 * @param {*} el 
 * @param {*} prop 
 * @param {*} bool 
 */
 export function getELByClass(el, prop, bool) {
    return !bool ? el.querySelector('.' + prop) : el.querySelectorAll('.' + prop);
}