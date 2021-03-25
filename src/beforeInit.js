import util from './util';
import { ERROR_VARIABLE, NOT_DOM_ELEMENTS } from './error';
// 不能是哪些标签元素
const isNotDom = ele => {
    if (NOT_DOM_ELEMENTS.indexOf(ele.tagName.toLowerCase()) > -1) {
        util.ewError(ERROR_VARIABLE.DOM_NOT_ERROR);
        return true;
    }
    return false;
}
/**
 * 
 * @param {*} element 
 * @param {*} config 
 * @param {*} errorText 
 * @returns 
 */
export function beforeInit(element, config, errorText) {
    let ele = util.isDom(element) ? element : util.isString(element) ? util.$(element) : null;
    if (!ele) return util.ewError(errorText);
    ele = ele.length ? ele[0] : ele;
    if (!ele.tagName) return util.ewError(errorText);
    if (!isNotDom(ele)) {
        this._color_picker_uid = util.createUUID();
        if (config.openChangeColorMode) {
            this.colorMode = ["hex", "rgba", "hsla"];
        }
        this.init(ele, config);
    }
}