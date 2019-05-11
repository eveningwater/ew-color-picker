
import { ewError,isStr,isUndefined } from './util';
import drag from './drag';
import textarea from './autotextarea'
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ?
        define(factory) : (global = global || self, global.ewPlugins = factory());
}(this, function () {
    'use strict';
    function ewPlugins(type,config){
        if(!isStr(type))throw ewError('you should pass a string params,sush as drag,textarea！')
        isUndefined(config)
        switch(type){
            case 'drag':
                return new drag(config);
                break;
            case 'textarea':
                return new textarea(config);
                break;
        }
        return this;
    }
    if(!window.ewPlugins){
        window.ewPlugins = ewPlugins;
    }
    return ewPlugins;
}));