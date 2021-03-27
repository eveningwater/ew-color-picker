import util from './util';
import ani from './animation';
import { onRenderColorPicker } from './render';
import { setColorValue } from './setColorValue';
/**
 * 开启颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */
export function open(expression, picker) {
    return ani[expression ? 'slideDown' : 'fadeIn'](picker, 200);
}
/**
 * 关闭颜色选择器
 * @param {*} expression 
 * @param {*} picker 
 */
export function close(expression, picker) {
    return ani[expression ? 'slideUp' : 'fadeOut'](picker, 200);
}
/**
 * 获取动画类型
 * @param {*} scope 
 */
export function getHeiAni(scope) {
    return util.isString(scope.config.pickerAnimation) && scope.config.pickerAnimation.indexOf('height') > -1
}
/**
 * 打开和关闭
 * @param {*} scope 
 */
export function openAndClose(scope) {
    scope.config.pickerFlag ? open(getHeiAni(scope), scope.picker) : close(getHeiAni(scope), scope.picker);
}
/**
 * 手动关闭颜色选择器
 * @param {*} ani 
 */
export function handleClosePicker(ani) {
    if (ani) {
        this.config.pickerAnimation = ani;
    }
    if (this.config.pickerFlag) {
        this.config.pickerFlag = false;
        close(getHeiAni(this), this.picker)
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
    if (!this.config.pickerFlag) {
        this.config.pickerFlag = true;
        const funOpen = () => open(getHeiAni(this), this.picker);
        const funRender = () => onRenderColorPicker(this.config.defaultColor, this.config.pickerFlag, this.rootElement, this);
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
    scope.config.pickerFlag = !scope.config.pickerFlag;
    onRenderColorPicker(scope.config.defaultColor, scope.config.pickerFlag, el, scope);
    setColorValue(scope, scope.panelWidth, scope.panelHeight,false);
    openAndClose(scope);
    if (util.isFunction(scope.config.openOrClosePicker))scope.config.openOrClosePicker(el, scope);
}