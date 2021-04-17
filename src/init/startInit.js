import { initConfig } from './initConfig';
export let initError = null;
/**
 *  开始初始化
 * @param {*} context 
 * @param {*} config 
 * @returns 
 */
export function startInit(context,config){
    let initOptions = initConfig(config);
    if(!initOptions)return;
    context.config = initOptions.config;
    initError = initOptions.error;
    context._privateConfig = {
        boxSize: {
            b_width: null,
            b_height: null
        },
        pickerFlag: false,
        colorValue: "",
    };
    context.beforeInit(initOptions.element,initOptions.config,initError);
}