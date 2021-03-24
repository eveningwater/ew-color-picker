import { isAlphaColor } from './color'; 
/**
 * 
 * @param {*} disabled 
 * @returns 
 */
 export function setPredefineDisabled(disabled){
    if(disabled)return ' ew-pre-define-color-disabled';
    return '';
}
/**
 * 
 * @param {*} color 
 * @returns 
 */
export function hasAlpha(color){
    let alpha = color.slice(color.indexOf('(') + 1, color.lastIndexOf(')')).split(',')[3];
    if(isAlphaColor(color) && alpha < 1 && alpha > 0)return ' ew-has-alpha';
    return '';
}