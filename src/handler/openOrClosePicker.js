import util from '../utils/util';
import ani from '../utils/animation';
import { setColorValue } from '../layout/setColorValue';
/**
 * 开启颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */
export function open(expression, picker,time = 200) {
    time = time > 10000 ? 10000 : time;
    return ani[expression ? 'slideDown' : 'fadeIn'](picker, time);
}
/**
 * 关闭颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */
export function close(expression, picker,time = 200) {
    time = time > 10000 ? 10000 : time;
    return ani[expression ? 'slideUp' : 'fadeOut'](picker, time);
}
/**
 * 获取动画类型
 * @param {*} scope 
 */
export function getHeiAni(scope) {
    return util.isString(scope.config.pickerAnimation) && scope.config.pickerAnimation.indexOf('height') > -1;
}
/**
 * 打开和关闭
 * @param {*} scope 
 */
export function openAndClose(scope) {
    const time = scope.config.pickerAnimationTime;
    scope._privateConfig.pickerFlag ? open(getHeiAni(scope), scope.$Dom.picker,time) : close(getHeiAni(scope), scope.$Dom.picker,time);
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
        close(getHeiAni(this), this.$Dom.picker,this.config.pickerAnimationTime);
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
        open(getHeiAni(this), this.$Dom.picker,this.config.pickerAnimationTime);
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
    openAndClose(scope);
    if (util.isFunction(scope.config.togglePicker)){
        scope.config.togglePicker(el, scope._privateConfig.pickerFlag,scope);
    }
    if(util.isFunction(callback))callback(scope._privateConfig.pickerFlag);
}