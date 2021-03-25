import util from './util';
import { ERROR_VARIABLE } from './error';
import { handleClosePicker,handleOpenPicker } from './openOrClosePicker';
import globalAPI from './globalAPI.js';
import { startInit } from './startInit';
import { bindEvent } from './bindEvent';
import { beforeInit } from './beforeInit';
import { updateColor } from './updateColor';
import { initFunction } from './init';
import { startMain } from './main';
import { staticRender } from './render';
/**
 * 构造函数
 * @param {*} config 
 */
function ewColorPicker(config) {
    if (util.isUndefined(new.target)) return util.ewError(ERROR_VARIABLE.CONSTRUCTOR_ERROR);
    startInit(this,config);
}
const methods = [
    {
        name: "beforeInit",
        func: beforeInit
    },
    {
        name: "init",
        func: initFunction
    },
    {
        name: "render",
        func: staticRender
    },
    {
        name: "startMain",
        func: startMain
    },
    {
        name:"bindEvent",
        func:bindEvent 
    },
    {
        name: "updateColor",
        func:updateColor 
    },
    {
        name: "openPicker",
        func: handleOpenPicker
    },
    {
        name: "closePicker",
        func: handleClosePicker 
    }
];
methods.forEach(method => util.addMethod(ewColorPicker, method.name, method.func));
// 全局API注册
Object.keys(globalAPI).forEach(key => {
    ewColorPicker[key] = globalAPI[key];
});
export default ewColorPicker;