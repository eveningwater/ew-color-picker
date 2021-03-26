import colorPickerConfig from './config';
import { startInit } from './startInit';
import * as color from './color';
import base from './util';
const createColorPicker = function (config) {
    const Super = this;
    const Sub = function(){
        startInit(this,config);
    }
    Sub.prototype = Object.create(Super.prototype);
    Sub.prototype.constructor = Sub;
    Sub['Super'] = Super;
    return new Sub();
}
const getDefaultConfig = function () {
    return colorPickerConfig;
}
const util = Object.create(null);
[color,base].forEach(module => {
    Object.keys(module).forEach(key => {
        if(base.isFunction(module[key])){
            util[key] = module[key];
        }
    })
})
export default {
    createColorPicker,
    getDefaultConfig,
    util
}