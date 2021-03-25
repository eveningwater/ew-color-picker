import { changeElementColor } from './changeElementColor';
import util from './util';
import { cloneColor } from './cloneColor';
import { colorHSBaToRgba,colorRgbaToHex } from './color';
/**
 * 设置颜色
 * @param {*} context 
 * @param {*} panelWidth 
 * @param {*} panelHeight 
 */
 export function setColorValue(context, panelWidth, panelHeight,boxChange) {
    context.boxChange = boxChange;
    changeElementColor(context);
    context.prevInputValue = context.pickerInput.value;
    let sliderBarHeight = 0;
    let l = parseInt(context.hsbColor.s * panelWidth / 100),
        t = parseInt(panelHeight - context.hsbColor.b * panelHeight / 100);
    [
        {
            el: context.pickerCursor,
            prop: 'left',
            value: l + 4 + 'px'
        },
        {
            el: context.pickerCursor,
            prop: 'top',
            value: t + 4 + 'px'
        },
        {
            el: context.pickerPanel,
            prop: 'background',
            value: colorRgbaToHex(colorHSBaToRgba(cloneColor(context.hsbColor)))
        }
    ].forEach(item => util.setCss(item.el, item.prop, item.value));
    if (context.config.hue) {
        sliderBarHeight = context.hueBar.offsetHeight || 180;
        util.setCss(context.hueThumb, 'top', parseInt(context.hsbColor.h * sliderBarHeight / 360) + 'px');
    }
    if (context.config.alpha) {
        sliderBarHeight = context.alphaBar.offsetHeight || 180;
        util.setCss(context.alphaBarThumb, 'top', sliderBarHeight - context.hsbColor.a * sliderBarHeight + 'px');
    }
}