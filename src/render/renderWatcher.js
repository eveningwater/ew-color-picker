
import { pushTarget, remove } from '../observe/dep';
import util from '../utils/util';
import { setBarStyle } from "../layout/setColorValue";
import { initBoxSize } from "../init/init";
import { notUpdateKeys } from "../const/notUpdateKeys";
import { handleClickOutSide } from "../handler/clickOutSide";
import { initLang } from "../init/initConfig"
import { close, getAnimationType } from '../handler/openOrClosePicker';
function handleNode(flag,node,parentNode){
    return new Promise((resolve,reject) => {
        if(!flag){
            node.remove();
        }else{
            parentNode.appendChild(node);
        }
        resolve();
    });
}
function updateBoxHandler(box,b_width,b_height){
    if(box){
        const firstChild = box.firstElementChild;
        if(util.hasClass(firstChild,"ew-color-picker-no")){
            util.setCss(firstChild,"line-height",b_height);
        }
        [box,firstChild].forEach(el => {
            util.setSomeCss(el,[
                {
                    prop:"width",
                    value:b_width
                },
                {
                    prop:"height",
                    value:b_height
                }
            ])
        })
    }
}
function updateLangHandler(config,pickerClear,pickerSure){
    initLang(config).then(({ clearText,sureText }) => {
        pickerClear.textContent = clearText;
        pickerSure.textContent = sureText;
   });
}
/**
 * 重新渲染颜色选择器
 * @param {*} vm 
 * @param {*} callback 
 */
 export function render(vm,key,callback){
    if(notUpdateKeys.indexOf(key) > -1){
        return;
    }
    setTimeout(() => {
        const { 
            $Dom:{ hueBar,alphaBar,box,pickerSure,pickerClear,rootElement,pickerInput,picker },
            $cacheDom:{ hueContainer,alphaContainer },
            config:{ hue,alpha,isClickOutside,hasInput,pickerAnimationTime }
        } = vm;
        switch(key){
            case "hue":{
                handleNode(hue,hueBar,hueContainer).then(() => setBarStyle(vm));
                break;
            }
            case "alpha":
                handleNode(alpha,alphaBar,alphaContainer,vm).then(() => setBarStyle(vm));
                break;
            case "size":
                initBoxSize(vm,vm.config).then(({ b_width,b_height }) => updateBoxHandler(box,b_width,b_height));
                break;
            case "isClickOutside":
                handleClickOutSide(vm,vm.config);
                break;
            case "lang":
                updateLangHandler(vm.config,pickerClear,pickerSure);
                break;
            case "userDefineText":
                updateLangHandler(vm.config,pickerClear,pickerSure);
                break;
            case "disabled":
                vm.config[key] ? util.addClass(box,"ew-color-picker-box-disabled") : util.removeClass(box,"ew-color-picker-box-disabled");
                util.setCss(box,"background",vm.config[key] ? "" : vm.config.defaultColor);
                if(vm.config[key]){
                    if(vm._privateConfig.pickerFlag){
                        vm._privateConfig.pickerFlag = false;
                        close(getAnimationType(vm), picker,pickerAnimationTime);
                    }
                    util.off(box,"click",box.clickHandler);
                    if (hasInput) {
                        if (!util.hasClass(pickerInput, 'ew-input-disabled')) {
                            util.addClass(pickerInput,'ew-input-disabled')
                        }
                        pickerInput.disabled = true;
                    }
                    if (!util.hasClass(picker, 'ew-color-picker-disabled')) {
                        util.addClass(picker,'ew-color-picker-disabled');
                    }
                }else{
                    if (hasInput) {
                        util.removeClass(pickerInput,'ew-input-disabled')
                        pickerInput.disabled = false;
                    }
                    util.removeClass(picker,'ew-color-picker-disabled');
                    util.on(box,"click",box.clickHandler);
                }
                break;
        }
        if(util.isFunction(callback)){
            callback();
        }
    },vm.config.pickerAnimationTime);
}
export default class RenderWatcher {
    constructor(vm){
        this._colorPickerInstance = vm;
        this._watcher_id = vm._color_picker_uid;
        this.depIds = new Set();
        this.dep = null;
        vm._watcher = this;
        this.get();
    }
    get(){
        pushTarget(this);
    }
    update(key){
        const updateHandler = (vm,key) => {
            render(vm,key);
        }
        updateHandler(this._colorPickerInstance,key);
    }
    cleanDeps(){
        if(this.dep){
            this.dep.subs = [];
        }
    }
    addDep(dep){
        const id = dep.id;
        this.dep = dep;
        if(!this.depIds.has(id)){
            this.depIds.add(id);
            dep.addSub(this);
        }
    }
}