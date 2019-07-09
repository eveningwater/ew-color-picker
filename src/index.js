
import { ewError,isStr,oneOf } from './util/util';
import drag from './drag/drag';
import textarea from './textarea/autotextarea'
import ewColorPicker from './colorpicker/ew-color-picker'

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ?
        define(factory) : (global = global || self, global.ewPlugins = factory());
}(this, function () {
    'use strict';
    function ewPlugins(type,config){
        const typeArr = ['drag','textarea','colorpicker'];
        if(!isStr(type) || !oneOf(typeArr,type))throw ewError('you should pass a string params,sush as drag,textarea,colorpicker！')
        switch(type){
            case 'drag':
                return new drag(config);
                break;
            case 'textarea':
                return new textarea(config);
                break;
            case 'colorpicker':
                return new ewColorPicker(config);
                break;
        }
        return this;
    }
    if(!window.ewPlugins){
        window.ewPlugins = ewPlugins;
    }
    return ewPlugins;
}));