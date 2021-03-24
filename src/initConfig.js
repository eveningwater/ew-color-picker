import colorPickerConfig from './config';
import util from './util';
import { ERROR_VARIABLE } from './error';
/**
 * 初始化配置
 * @param {*} config 
 * @returns 
 */
export function initConfig(config){
    const privateConfig = {
        boxSize: {
            b_width: null,
            b_height: null
        },
        pickerFlag: false,
        colorValue: "",
    }
    const defaultConfig = { ...colorPickerConfig, ...privateConfig };
    let element,error,mergeConfig = null;
    //如果第二个参数传的是字符串，或DOM对象，则初始化默认的配置
    if (util.isString(config) || util.isDom(config)) {
        mergeConfig = defaultConfig;
        element = config;
        error = ERROR_VARIABLE.DOM_ERROR;
    } //如果是对象，则自定义配置，自定义配置选项如下:
    else if (util.isDeepObject(config) && (util.isString(config.el) || util.isDom(config.el))) {
        mergeConfig = util.ewAssign(defaultConfig, config);
        element = config.el;
        error = ERROR_VARIABLE.DOM_OBJECT_ERROR;
    } else {
        const errorText = util.isDeepObject(config) ? ERROR_VARIABLE.PICKER_OBJECT_CONFIG_ERROR : ERROR_VARIABLE.PICKER_CONFIG_ERROR;
        return util.ewError(errorText);
    }
    return {
        element,
        config:mergeConfig,
        error
    }
}