import { isValidColor,colorRgbaToHsva,colorHexToRgba,colorHslaToRgba } from '../color/color';
import { setColorValue } from './setColorValue';
import { changeElementColor } from './changeElementColor';
import util from '../utils/util';
/**
 * 输入颜色的转换
 * @param {*} scope 
 * @param {*} value 
 */
 export function onInputColor(scope, value) {
    if (!isValidColor(value)) return;
    // 两者相等，说明用户没有更改颜色
    if (util.removeAllSpace(scope.prevInputValue) === util.removeAllSpace(value))return;
    let color = null;
    if(scope.config.openChangeColorMode){
        switch (scope.currentMode) {
            case "hex":
                color = colorRgbaToHsva(colorHexToRgba(value));
                break;
            case "rgba":
                color = colorRgbaToHsva(value);
                break;
            case "hsla":
                // 需要先转换成rgba,再转换成hsv模式
                let hslaArr = value.slice(value.indexOf('(') + 1, value.lastIndexOf(')')).split(',');
                color = colorRgbaToHsva(colorHslaToRgba({
                    h: Number(hslaArr[0]),
                    s: Number(hslaArr[1].replace(/%/g, "")),
                    l: Number(hslaArr[2].replace(/%/g, "")),
                    a: Number(hslaArr[3]) | 1
                }));
                break;
        }
    }else{
        color = scope.config.alpha ? colorRgbaToHsva(value) : colorRgbaToHsva(colorHexToRgba(value));
    }
    scope.hsvaColor = color;
    setColorValue(scope, scope.panelWidth, scope.panelHeight,true);
}