import colorPickerConfig from '../config';
import util from '../utils/util';
import { ERROR_VARIABLE } from '../const/error';
import { consoleInfo } from '../const/console';
import zhData from '../const/zh';
import enData from '../const/en';
function filterConfig(config){
    config.hueDirection = config.hueDirection === 'horizontal' ? config.hueDirection : 'vertical';
    config.alphaDirection = config.alphaDirection === 'horizontal' ? config.alphaDirection : 'vertical';
}
export function initLang(mergeConfig){
    let langData = mergeConfig.lang === "en" ? enData : zhData;
    if(mergeConfig.userDefineText){
        mergeConfig =  util.ewAssign(mergeConfig,langData);
    }else{
        mergeConfig =  util.ewAssign(langData,mergeConfig);
    }
    return Promise.resolve(mergeConfig);
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
    if (util.isString(config) || util.isDom(config) || util.isJQDom(config)) {
        mergeConfig = defaultConfig;
        element = util.isJQDom(config) ? config.get(0) : config;
        error = ERROR_VARIABLE.DOM_ERROR;
    } //如果是对象，则自定义配置，自定义配置选项如下:
    else if (util.isDeepObject(config) && (util.isString(config.el) || util.isDom(config.el) || util.isJQDom(config.el))) {
        filterConfig(config);
        mergeConfig = util.ewAssign(defaultConfig, config);
        element = util.isJQDom(config.el) ? config.el.get(0) : config.el;
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
    initLang(mergeConfig);
    if (mergeConfig.isLog){
        consoleInfo();
    }
    if(['height','opacity'].indexOf(mergeConfig.pickerAnimation) === -1){
        mergeConfig.pickerAnimation = 'default';
    }
    return {
        element,
        config:mergeConfig,
        error
    }
}