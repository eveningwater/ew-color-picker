import { isAlphaColor } from '../color/color'; 
/**
 * 
 * @param {*} disabled 
 * @returns 
 */
 export function setPredefineDisabled(disabled){
    return {
        "ew-pre-define-color-disabled":disabled
    }
}
/**
 * 
 * @param {*} color 
 * @returns 
 */
export function hasAlpha(color){
    let alpha = color.slice(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',')[3];
    return {
        "ew-has-alpha":(isAlphaColor(color) && alpha < 1 && alpha > 0)
    }
}