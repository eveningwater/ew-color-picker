import { colorToRgba, colorRgbaToHex, colorRgbaToHsla } from './color';
/**
 * 转换颜色模式
 * @param {*} context 
 * @param {*} color 
 * @returns 
 */
 export function changeMode(context, color) {
    let result = null;
    switch (context.currentMode) {
        case "hex":
            result = colorRgbaToHex(color);
            break;
        case "rgba":
            result = colorToRgba(color);
            break;
        case "hsla":
            result = colorRgbaToHsla(color).colorStr;
            break;
        default:
            result = color;
            break;
    }
    context.modeTitle.innerHTML = context.currentMode;
    return result;
}