import colorPickerConfig from './config';
import { initConfig } from './initConfig';
const createColorPicker = function (config) {
    const Super = this;
    const Sub = function(){
        let initOptions = initConfig(config);
        this.config = initOptions.config;
        this.beforeInit(initOptions.element,initOptions.config,initOptions.error);
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