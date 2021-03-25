import { isValidColor,colorToRgba,colorRgbaToHSBa } from './color';
import { ERROR_VARIABLE } from './error';
import { setColorValue } from './setColorValue';
import util from './util';
/**
 * 手动更新颜色
 * @param {*} color 
 * @returns 
 */
export function updateColor(color) {
    if (!isValidColor(color)) return util.ewError(ERROR_VARIABLE.UPDATE_PARAM_COLOR_ERROR);
    if (!this.config.pickerFlag) util.ewWarn(ERROR_VARIABLE.UPDATE_PARAM_COLOR_WARN);
    let rgbaColor = colorToRgba(color);
    this.hsbColor = colorRgbaToHSBa(rgbaColor);
    setColorValue(this, this.panelWidth, this.panelHeight,true);
}