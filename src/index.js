import util from './utils/util';
import { ERROR_VARIABLE } from './const/error';
import { handleClosePicker,handleOpenPicker } from './handler/openOrClosePicker';
import globalAPI from './globalAPI.js';
import { startInit } from './init/startInit';
import { bindEvent } from './handler/bindEvent';
import { beforeInit } from './init/beforeInit';
import { updateColor } from './layout/updateColor';
import { initFunction } from './init/init';
import { startMain } from './layout/main';
import { staticRender } from './render/render';
import { destroyInstance } from './destroy/destroy'
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
    },
    {
        name:"destroy",
        func:destroyInstance
    }
];
methods.forEach(method => util.addMethod(ewColorPicker, method.name, method.func));
// 全局API注册
Object.keys(globalAPI).forEach(key => {
    ewColorPicker[key] = globalAPI[key];
});
export default ewColorPicker;