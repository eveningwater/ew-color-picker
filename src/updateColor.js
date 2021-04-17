import { isValidColor,colorToRgba,colorRgbaToHsva } from './color';
import { ERROR_VARIABLE } from './error';
import { setColorValue } from './setColorValue';
import util from './util';
/**
 * 手动更新颜色
 * @param {*} color 
 * @returns 
 */
export function updateColor(color) {
    if (!isValidColor(color))return util.ewError(ERROR_VARIABLE.UPDATE_PARAM_COLOR_ERROR);
    if (!this._privateConfig.pickerFlag)util.ewWarn(ERROR_VARIABLE.UPDATE_PARAM_COLOR_WARN);
    let rgbaColor = colorToRgba(color);
    this.hsvaColor = colorRgbaToHsva(rgbaColor);
    setColorValue(this, this.panelWidth, this.panelHeight,true);
}