import util from '../utils/util';
import { changeMode } from './mode';
import { changeAlphaBar } from './changeAlphaBarBackground';
import { colorHsvaToRgba,colorRgbaToHex } from '../color/color';
import { setBoxBackground } from './box';
/**
 * 改变元素的颜色
 * @param {*} scope 
 * @param {*} isAlpha 
 */
 export function changeElementColor(scope, isAlpha) {
    const color = colorHsvaToRgba(scope.hsvaColor);
    let newColor = isAlpha || scope.config.alpha ? color : colorRgbaToHex(color);
    if (scope.config.openChangeColorMode) {
        newColor = changeMode(scope, color);
    }
    if (scope.config.hasColorInput) {
        scope.$Dom.pickerInput.value = newColor;
        scope.prevInputValue = newColor;
    }
    changeAlphaBar(scope);
    if(scope.config.hasBox && scope.config.changeBoxByChangeColor && scope.boxChange){
        setBoxBackground(scope.$Dom.box,newColor);
    }
    if (util.isFunction(scope.config.changeColor)) scope.config.changeColor(newColor);
}