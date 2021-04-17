import colorPickerConfig from './config';
import util from './util';
import { ERROR_VARIABLE } from './error';
import { consoleInfo } from './console';
function filterConfig(config){
    config.hueDirection = config.hueDirection === 'horizontal' ? config.hueDirection : 'vertical';
    config.alphaDirection = config.alphaDirection === 'horizontal' ? config.alphaDirection : 'vertical';
}
/**
 * 初始化配置
 * @param {*} config 
 * @returns 
 */
export function initConfig(config){
    const defaultConfig = { ...colorPickerConfig };
    let element,error,mergeConfig = null;
    //如果第二个参数传的是字符串，或DOM对象，则初始化默认的配置
    if (util.isString(config) || util.isDom(config)) {
        mergeConfig = defaultConfig;
        element = config;
        error = ERROR_VARIABLE.DOM_ERROR;
    } //如果是对象，则自定义配置，自定义配置选项如下:
    else if (util.isDeepObject(config) && (util.isString(config.el) || util.isDom(config.el))) {
        filterConfig(config);
        mergeConfig = util.ewAssign(defaultConfig, config);
        element = config.el;
        error = ERROR_VARIABLE.DOM_OBJECT_ERROR;
    } else {
        element = 'body';
        if(util.isDeepObject(config)){
            filterConfig(config);
            mergeConfig =  util.ewAssign(defaultConfig, config);
            error = ERROR_VARIABLE.DOM_OBJECT_ERROR;
        }else{
            mergeConfig = defaultConfig;
            error = ERROR_VARIABLE.DOM_ERROR;
        }
    }
    if (mergeConfig.isLog)consoleInfo();
    return {
        element,
        config:mergeConfig,
        error
    }
}