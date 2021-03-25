import colorPickerConfig from './config';
import { startInit } from './startInit';
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
export default {
    createColorPicker,
    getDefaultConfig
}