import util from '../utils/util';
import ani from '../utils/animation';
import { setColorValue } from '../layout/setColorValue';
import { initColor } from '../init/initColor';
/**
 * 开启颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */
export function open(expression, picker,time = 200) {
    time = time > 10000 ? 10000 : time;
    let animation = '';
    switch(expression){
        case 'height':
            animation = 'slideDown';
            break;
        case 'opacity':
            animation = 'fadeIn';
            break;
        default:
            animation = 'show';
    }
    return ani[animation](picker, time);
}
/**
 * 关闭颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */
export function close(expression, picker,time = 200) {
    time = time > 10000 ? 10000 : time;
    let animation = '';
    switch(expression){
        case 'height':
            animation = 'slideUp';
            break;
        case 'opacity':
            animation = 'fadeOut';
            break;
        default:
            animation = 'hide';
    }
    return ani[animation](picker, time);
}
/**
 * 获取动画类型
 * @param {*} scope 
 */
export function getAnimationType(scope) {
    return scope.config.pickerAnimation;
}
/**
 * 打开和关闭
 * @param {*} scope 
 */
export function openAndClose(scope) {
    const time = scope.config.pickerAnimationTime;
    return scope._privateConfig.pickerFlag ? open(getAnimationType(scope), scope.$Dom.picker,time) : close(getAnimationType(scope), scope.$Dom.picker,time);
}
/**
 * 手动关闭颜色选择器
 * @param {*} ani 
 */
export function handleClosePicker(ani,time) {
    if (ani) {
        this.config.pickerAnimation = ani;
    }
    if(time){
        this.config.pickerAnimationTime = time;
    }
    if (this._privateConfig.pickerFlag) {
        this._privateConfig.pickerFlag = false;
        close(getAnimationType(this), this.$Dom.picker,this.config.pickerAnimationTime);
    }
}
/**
 * 手动打开颜色选择器
 * @param {*} ani 
 */
export function handleOpenPicker(ani,time) {
    if (ani) {
        this.config.pickerAnimation = ani;
    }
    if(time){
        this.config.pickerAnimationTime = time;
    }
    if (!this._privateConfig.pickerFlag) {
        this._privateConfig.pickerFlag = true;
        open(getAnimationType(this), this.$Dom.picker,this.config.pickerAnimationTime);
        setColorValue(this, this.panelWidth, this.panelHeight,false);
    }
}
/**
 * 打开面板
 * @param {*} el 
 * @param {*} scope 
 */
 export function handlePicker(el, scope,callback) {
    scope._privateConfig.pickerFlag = !scope._privateConfig.pickerFlag;
    const returnValue = openAndClose(scope);
    if (util.isFunction(scope.config.togglePicker)){
        scope.config.togglePicker(el, scope._privateConfig.pickerFlag,scope);
    }
    if(util.isPromise(returnValue)){
        returnValue.then(() => {
            pickerCallBack(scope,callback);
        })
    }else {
        pickerCallBack(scope,callback);
    }
}
function pickerCallBack(scope,callback){
    if(util.isFunction(callback)){
        callback(scope._privateConfig.pickerFlag);
    }
}