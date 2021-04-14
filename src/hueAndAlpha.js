import util from './util';
import { changeElementColor } from './changeElementColor';
import { cloneColor } from './cloneColor';
import { colorHsvaToRgba, colorRgbaToHex } from './color';
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
    let value = setAlphaHuePosition(context.isAlphaHorizontal,context.alphaBar,context.alphaBarThumb,position);
    let currentValue = value.barPosition - value.barThumbPosition <= 0 ? 0 : value.barPosition - value.barThumbPosition; 
    let alpha = context.isAlphaHorizontal ? 1 - currentValue / value.barPosition : currentValue / value.barPosition;
    context.hsvaColor.a = alpha >= 1 ? 1 : alpha.toFixed(2);
    changeElementColor(context, true);
}
/**
 * 改变色调
 * @param {*} context 
 * @param {*} position
 */
export function changeHue(context, position) {
    let value = setAlphaHuePosition(context.isHueHorizontal,context.hueBar, context.hueThumb, position);
    context.hsvaColor.h = cloneColor(context.hsvaColor).h = parseInt(360 * value.barThumbPosition / value.barPosition);
    util.setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsvaToRgba(cloneColor(context.hsvaColor))));
    changeElementColor(context);
}