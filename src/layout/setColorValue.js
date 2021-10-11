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
        getSliderBarPosition(context.isHueHorizontal,context.$Dom.hueBar,(position,prop) => {
            util.setCss(context.$Dom.hueThumb, prop, parseInt(context.hsvaColor.h * position / 360) + 'px');
        });
    }
    if (context.config.alpha) {
        getSliderBarPosition(context.isAlphaHorizontal,context.$Dom.alphaBar,(position,prop) => {
            util.setCss(context.$Dom.alphaBarThumb, prop, (context.isAlphaHorizontal ? context.hsvaColor.a * position : position - context.hsvaColor.a * position) + 'px');
        });
    }
}
/**
 * 设置样式
 * @param {*} direction 
 * @param {*} bar 
 * @param {*} thumb 
 * @param {*} value 
 */
export function getSliderBarPosition(direction,bar,callback){
    let sliderPosition = direction ? bar.offsetWidth : bar.offsetHeight;
    let sliderProp = direction ? 'left' : 'top';
    callback(sliderPosition,sliderProp);
}