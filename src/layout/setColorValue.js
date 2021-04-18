import { changeElementColor } from './changeElementColor';
import util from '../utils/util';
import { cloneColor } from '../color/cloneColor';
import { colorHsvaToRgba,colorRgbaToHex } from '../color/color';
/**
 * 设置颜色
 * @param {*} context 
 * @param {*} panelWidth 
 * @param {*} panelHeight 
 */
 export function setColorValue(context, panelWidth, panelHeight,boxChange) {
    context.boxChange = boxChange;
    changeElementColor(context);
    if(context.config.hasColorInput)context.prevInputValue = context.$Dom.pickerInput.value;
    let sliderBarHeight = 0;
    let l = parseInt(context.hsvaColor.s * panelWidth / 100),
        t = parseInt(panelHeight - context.hsvaColor.v * panelHeight / 100);
    [
        {
            el: context.$Dom.pickerCursor,
            prop: 'left',
            value: l + 4 + 'px'
        },
        {
            el: context.$Dom.pickerCursor,
            prop: 'top',
            value: t + 4 + 'px'
        },
        {
            el: context.$Dom.pickerPanel,
            prop: 'background',
            value: colorRgbaToHex(colorHsvaToRgba(cloneColor(context.hsvaColor)))
        }
    ].forEach(item => util.setCss(item.el, item.prop, item.value));
    if (context.config.hue) {
        sliderBarHeight = context.$Dom.hueBar.offsetHeight || 180;
        util.setCss(context.$Dom.hueThumb, 'top', parseInt(context.hsvaColor.h * sliderBarHeight / 360) + 'px');
    }
    if (context.config.alpha) {
        sliderBarHeight = context.$Dom.alphaBar.offsetHeight || 180;
        util.setCss(context.$Dom.alphaBarThumb, 'top', sliderBarHeight - context.hsvaColor.a * sliderBarHeight + 'px');
    }
}