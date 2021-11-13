import util from '../utils/util';
import { ERROR_VARIABLE } from '../const/error';
import colorPickerConfig from '../config';
export function initBoxSize(context,config){
    let b_width, b_height;
    //自定义颜色选择器的类型
    if (util.isString(config.size)) {
        switch (config.size) {
            case 'normal':
                b_width = b_height = '40px';
                break;
            case 'medium':
                b_width = b_height = '36px';
                break;
            case 'small':
                b_width = b_height = '32px';
                break;
            case 'mini':
                b_width = b_height = '28px';
                break;
            default:
                b_width = b_height = '40px';
                break;
        }
    } else if (util.isDeepObject(config.size)) {
        b_width = config.size.width && (util.isNumber(config.size.width) || util.isString(config.size.width)) ? (parseInt(config.size.width) <= 25 ? 25 :  parseInt(config.size.width))+ 'px' : '40px';
        b_height = config.size.height && (util.isNumber(config.size.height) || util.isString(config.size.height)) ? (parseInt(config.size.height) <= 25 ? 25 : parseInt(config.size.height)) + 'px' : '40px';
    } else {
        return util.ewError(ERROR_VARIABLE.CONFIG_SIZE_ERROR);
    }
    context._privateConfig.boxSize.b_width = b_width;
    context._privateConfig.boxSize.b_height = b_height;
    return Promise.resolve(context._privateConfig.boxSize);
}
/**
 * 初始化
 * @param {*} bindElement 
 * @param {*} config 
 * @returns 
 */
export function initFunction(bindElement, config) {
    if(!util.isDom(bindElement)){
        return this.beforeInit(bindElement,config,ERROR_VARIABLE.DOM_ERROR);
    }
    config = util.ewAssign(colorPickerConfig,config);
    initBoxSize(this,config);
    //渲染选择器
    this.render(bindElement, config);
}