import { onRenderColorPicker } from './render';
import { changeElementColor } from './changeElementColor';
import { openAndClose } from './openOrClosePicker';
import { colorHSBaToRgba, colorRgbaToHex } from './color';
/**
 * 清空
 * @param {*} el 
 * @param {*} scope 
 */
export function onClearColor(el, scope) {
    onRenderColorPicker('', false, el, scope);
    openAndClose(scope);
    scope.config.clear(scope.config.defaultColor, scope);
}
/**
 * 确定
 * @param {*} scope 
 */
export function onSureColor(el, scope) {
    const result = scope.config.alpha ? colorHSBaToRgba(scope.hsbColor) : colorRgbaToHex(colorHSBaToRgba(scope.hsbColor));
    onRenderColorPicker(result, false, el, scope);
    openAndClose(scope);
    changeElementColor(scope);
    scope.config.sure(result, scope);
}