import util from '../utils/util';
import colorPickerConfig from '../config';
import { ERROR_VARIABLE, NOT_DOM_ELEMENTS } from '../const/error';
import { initError } from './startInit';
import zh from '../const/zh';
import en from '../const/en';
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
    let lang = config.lang === "zh" ? zh : en;
    let newConfig;
    if(config.userDefineText){
        newConfig = util.ewAssign(colorPickerConfig,lang,config);
    }else{
        newConfig = util.ewAssign(colorPickerConfig,config,lang);
    }   
    errorText = errorText || initError;
    let ele = util.isDom(element) ? element : util.isString(element) ? util.$(element) : util.isJQDom(element) ? element.get(0) : null;
    if (!ele) return util.ewError(errorText);
    ele = ele.length ? ele[0] : ele;
    if (!ele.tagName) return util.ewError(errorText);
    if (!isNotDom(ele)) {
        this._color_picker_uid = util.createUUID();
        if (config.openChangeColorMode) {
            this.colorMode = ["hex", "rgba", "hsla"];
        }
        this.init(ele, newConfig);
    }
}