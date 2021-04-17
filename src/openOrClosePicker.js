import util from './util';
import ani from './animation';
import { onRenderColorPicker } from './render';
import { setColorValue } from './setColorValue';
/**
 * 开启颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */
export function open(expression, picker,time = 200) {
    return ani[expression ? 'slideDown' : 'fadeIn'](picker, time);
}
/**
 * 关闭颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */
export function close(expression, picker,time = 200) {
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
export function handleClosePicker(ani) {
    if (ani) {
        this.config.pickerAnimation = ani;
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
export function handleOpenPicker(ani) {
    if (ani) {
        this.config.pickerAnimation = ani;
    }
    if (!this._privateConfig.pickerFlag) {
        this._privateConfig.pickerFlag = true;
        const funOpen = () => open(getHeiAni(this), this.$Dom.picker,this.config.pickerAnimationTime);
        const funRender = () => onRenderColorPicker(this.config.defaultColor, this._privateConfig.pickerFlag, this.$Dom.rootElement, this);
        if (this.config.hasBox) {
            funRender();
            funOpen();
        } else {
            funOpen();
            funRender();
        }
        setColorValue(this, this.panelWidth, this.panelHeight,false);
    }
}
/**
 * 打开面板
 * @param {*} el 
 * @param {*} scope 
 */
 export function handlePicker(el, scope) {
    scope._privateConfig.pickerFlag = !scope._privateConfig.pickerFlag;
    onRenderColorPicker(scope.config.defaultColor, scope._privateConfig.pickerFlag, el, scope);
    setColorValue(scope, scope.panelWidth, scope.panelHeight,false);
    openAndClose(scope);
    if (util.isFunction(scope.config.openOrClosePicker))scope.config.openOrClosePicker(el, scope);
}