import { colorRegRGBA, colorRgbaToHsva, colorToRgba } from '../color/color';
/**
 * 初始化颜色
 * @param {*} context 
 * @param {*} config 
 */
 export function initColor(context, config) {
    if (config.defaultColor) {
        context.hsvaColor = colorRegRGBA.test(config.defaultColor) ? colorRgbaToHsva(config.defaultColor) : colorRgbaToHsva(colorToRgba(config.defaultColor));
    } else {
        context.hsvaColor = {
            h: 0,
            s: 100,
            v: 100,
            a: 1
        };
    }
}