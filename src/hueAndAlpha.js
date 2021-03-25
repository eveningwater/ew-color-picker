import util from './util';
import { changeElementColor } from './changeElementColor';
import { cloneColor } from './cloneColor';
import { colorHSBaToRgba,colorRgbaToHex } from './color';
/**
 * 设置hue和alpha的top
 * @param {*} bar 
 * @param {*} thumb 
 * @param {*} y 
 */
 function setAlphaHueTop(bar, thumb, y) {
    const barHeight = bar.offsetHeight, barRect = util.getRect(bar);
    const barThumbY = Math.max(0, Math.min(y - barRect.y, barHeight));
    util.setCss(thumb, 'top', barThumbY + 'px');
    return {
        barHeight,
        barThumbY
    }
};
 /**
* 改变透明度
* @param {*} context 
* @param {*} y 
*/
export function changeAlpha(context, y) {
   let value = setAlphaHueTop(context.alphaBar, context.alphaBarThumb, y);
   const alpha = ((value.barHeight - value.barThumbY <= 0 ? 0 : value.barHeight - value.barThumbY) / value.barHeight);
   context.hsbColor.a = alpha >= 1 ? 1 : alpha.toFixed(2);
   changeElementColor(context, true);
}
/**
 * 改变色调
 * @param {*} context 
 * @param {*} y 
 */
 export function changeHue(context, y) {
    let value = setAlphaHueTop(context.hueBar, context.hueThumb, y);
    context.hsbColor.h = cloneColor(context.hsbColor).h = parseInt(360 * value.barThumbY / value.barHeight);
    util.setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHSBaToRgba(cloneColor(context.hsbColor))));
    changeElementColor(context);
}