
import { ewError,isStr,oneOf } from './util/util';
import ewDrag from './drag/drag';
import ewTextArea from './textarea/autotextarea'
import ewColorPicker from './colorpicker/ew-color-picker'
import ewDatePicker from './datepicker/datepicker'
import ewSelect from './select/select'

(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ?
        define(factory) : (global = global || self, global.ewPlugins = factory());
}(this, function () {
    'use strict';
    function ewPlugins(type,config){
        const typeArr = ['drag','textarea','colorpicker','select','datepicker'];
        if(!isStr(type) || !oneOf(typeArr,type))throw ewError('you should pass a string params,sush as drag,textarea,colorpicker,select,datepicker！')
        switch(type){
            case 'drag':
                return new ewDrag(config);
                break;
            case 'textarea':
                return new ewTextArea(config);
                break;
            case 'colorpicker':
                return new ewColorPicker(config);
                break;
            case 'datepicker':
                return new ewDatePicker(config);
                break;
            case 'select':
                return new ewSelect(config);
                break;
        }
        return this;
    }
    if(!window.ewPlugins){
        window.ewPlugins = ewPlugins;
    }
    return ewPlugins;
}));