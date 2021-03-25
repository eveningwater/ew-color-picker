import { initConfig } from './initConfig';
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
    context.beforeInit(initOptions.element,initOptions.config,initOptions.error);
}