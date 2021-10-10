import util from '../utils/util';
import { changeElementColor } from './changeElementColor';
import { cloneColor } from '../color/cloneColor';
import { colorHsvaToRgba, colorRgbaToHex } from '../color/color';
/**
 * 
 * @param {*} direction 
 * @param {*} bar 
 * @param {*} thumb 
 * @param {*} position 
 */
function setAlphaHuePosition(direction,bar,thumb,position){
    const positionProp = direction ? 'x' :'y';
    const barProp = direction ? 'left' : 'top';
    const barPosition = direction ? bar.offsetWidth : bar.offsetHeight,
          barRect = util.getRect(bar);
    const barThumbPosition = Math.max(0,Math.min(position - barRect[positionProp],barPosition));
        util.setCss(thumb,barProp,barThumbPosition +'px');
        return {
            barPosition,
            barThumbPosition
        }
}
/**
* 改变透明度
* @param {*} context 
* @param {*} position
*/
export function changeAlpha(context, position) {
    const { isAlphaHorizontal,$Dom:{ alphaBar,alphaBarThumb }} = context;
    const value = setAlphaHuePosition(isAlphaHorizontal,alphaBar,alphaBarThumb,position);
    const { barPosition,barThumbPosition } = value;
    let currentValue = barPosition - barThumbPosition <= 0 ? 0 : barPosition - barThumbPosition; 
    let alpha = isAlphaHorizontal ? 1 - currentValue / barPosition : currentValue / barPosition;
    context.hsvaColor.a = alpha >= 1 ? 1 : alpha.toFixed(2);
    changeElementColor(context, true);
}
/**
 * 改变色调
 * @param {*} context 
 * @param {*} position
 */
export function changeHue(context, position) {
    const { isHueHorizontal,$Dom:{ hueBar,hueThumb,pickerPanel },hsvaColor} = context;
    let value = setAlphaHuePosition(isHueHorizontal,hueBar, hueThumb, position);
    const { barThumbPosition,barPosition } = value;
    context.hsvaColor.h = cloneColor(hsvaColor).h = parseInt(360 * barThumbPosition / barPosition);
    util.setCss(pickerPanel, 'background', colorRgbaToHex(colorHsvaToRgba(cloneColor(context.hsvaColor))));
    changeElementColor(context);
}