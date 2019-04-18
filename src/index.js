
import drag from './drag';
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() : typeof define === 'function' && define.amd ?
        define(factory) : (global = global || self, global.ewPlugins = factory());
}(this, function () {
    'use strict';
    function ewPlugins(type,config){
        switch(type){
            case 'ewDrag':
                return new drag(config);
                break;
        }
        return this;
    }
    if(!window.ewPlugins){
        window.ewPlugins = ewPlugins;
    }
    return ewPlugins;
}));