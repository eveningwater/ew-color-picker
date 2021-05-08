import colorPickerConfig from './config';
import { startInit } from './init/startInit';
import * as color from './color/color';
import base from './utils/util';
import { bindEvent } from './handler/bindEvent';

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
const destroy = function(instances){
    let remove = vm => {
        if(vm instanceof ewColorPicker){
            vm.destroy();
        }
    }
    if(util.isDeepArray(instances)){
        let i = instances.length;
        while(i--){
            remove(instances[i])
        }
    }else {
        remove(instances);
    }
}
const util = Object.create(null);
[color,base,{ bindEvent:bindEvent }].forEach(module => {
    Object.keys(module).forEach(key => {
        if(base.isFunction(module[key]) && key !=='clickOutSide'){
            util[key] = module[key];
        }
    })
})
export default {
    createColorPicker,
    getDefaultConfig,
    destroy,
    util
}