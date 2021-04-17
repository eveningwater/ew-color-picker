import { onRenderColorPicker } from '../render/render';
import { changeElementColor } from './changeElementColor';
import { openAndClose } from '../handler/openOrClosePicker';
import { colorHsvaToRgba, colorRgbaToHex } from '../color/color';
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
    const result = scope.config.alpha ? colorHsvaToRgba(scope.hsvaColor) : colorRgbaToHex(colorHsvaToRgba(scope.hsvaColor));
    onRenderColorPicker(result, false, el, scope);
    openAndClose(scope);
    changeElementColor(scope);
    scope.config.sure(result, scope);
}