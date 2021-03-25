import util from './util';
import { changeMode } from './mode';
import { changeAlphaBar } from './changeAlphaBarBackground';
import { colorHSBaToRgba,colorRgbaToHex } from './color';
import { setBoxBackground } from './box';
/**
 * 改变元素的颜色
 * @param {*} scope 
 * @param {*} isAlpha 
 */
 export function changeElementColor(scope, isAlpha) {
    const color = colorHSBaToRgba(scope.hsbColor);
    let newColor = isAlpha || scope.config.alpha ? color : colorRgbaToHex(color);
    if (scope.config.openChangeColorMode) {
        newColor = changeMode(scope, color);
    }
    if (scope.pickerInput) {
        scope.pickerInput.value = newColor;
        scope.prevInputValue = newColor;
    }
    changeAlphaBar(scope);
    if(scope.config.hasBox && scope.config.changeBoxByChangeColor && scope.boxChange){
        setBoxBackground(scope.box,newColor);
    }
    if (util.isFunction(scope.config.changeColor)) scope.config.changeColor(newColor);
}