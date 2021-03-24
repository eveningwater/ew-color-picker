import util from './util';
import ani from './animation';
/**
 * 开启颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */
 export function open(expression, picker) {
    return ani[expression ? 'slideDown' : 'fadeIn'](picker, 200);
}
/**
 * 关闭颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */
export function close(expression, picker) {
    return ani[expression ? 'slideUp' : 'fadeOut'](picker, 200);
}
/**
 * 获取动画类型
 * @param {*} scope 
 */
export function getHeiAni(scope) {
    return util.isString(scope.config.openPickerAni) && scope.config.openPickerAni.indexOf('height') > -1
}
/**
 * 打开和关闭
 * @param {*} scope 
 */
export function openAndClose(scope) {
    scope.config.pickerFlag ? open(getHeiAni(scope), scope.picker) : close(getHeiAni(scope), scope.picker);
}