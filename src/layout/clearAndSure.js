import { changeElementColor } from './changeElementColor';
import { close, getAnimationType } from '../handler/openOrClosePicker';
import { colorHsvaToRgba, colorRgbaToHex } from '../color/color';
import { setBoxBackground } from "./box";
/**
 * 清空
 * @param {*} el 
 * @param {*} scope 
 */
export function onClearColor(scope) {
    scope._privateConfig.pickerFlag = false;
    close(getAnimationType(scope),scope.$Dom.picker,scope.config.pickerAnimationTime);
    scope.config.defaultColor = scope._privateConfig.colorValue = "";
    scope.config.clear(scope.config.defaultColor, scope);
    setBoxBackground(scope.$Dom.box,scope.config.defaultColor);
}
/**
 * 确定
 * @param {*} scope 
 */
export function onSureColor(scope) {
    const result = scope.config.alpha ? colorHsvaToRgba(scope.hsvaColor) : colorRgbaToHex(colorHsvaToRgba(scope.hsvaColor));
    scope._privateConfig.pickerFlag = false;
    close(getAnimationType(scope),scope.$Dom.picker,scope.config.pickerAnimationTime);
    scope.config.defaultColor = scope._privateConfig.colorValue = result;
    changeElementColor(scope);
    scope.config.sure(result, scope);
    setBoxBackground(scope.$Dom.box,scope.config.defaultColor);
}