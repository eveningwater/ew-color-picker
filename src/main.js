import { handleClickOutSide } from './clickOutSide';
import { getELByClass } from './query';
import { handlePicker,getHeiAni,open } from './openOrClosePicker';
import { colorRegRGBA,colorRgbaToHSBa,colorToRgba } from './color';
import { setColorValue } from './setColorValue';
import { changeElementColor } from './changeElementColor';
import { changeAlpha,changeHue } from './hueAndAlpha';
import { onHandleChangeMode } from './mode';
import { onClickPanel,changeCursorColor } from './panelAndCursor';
import { onInputColor } from './input';
import { onClearColor,onSureColor } from './clearAndSure';
import util from './util';
/**
 * 主要功能
 * @param {*} ele 
 * @param {*} config 
 * @returns 
 */
export function startMain(ele, config) {
    let scope = this;
    this.rootElement = ele;
    //获取颜色选择器的一些操作元素
    if (config.hasBox) {
        this.box = getELByClass(ele, 'ew-color-picker-box');
    }
    this.pickerPanel = getELByClass(ele, 'ew-color-panel');
    this.pickerCursor = getELByClass(ele, 'ew-color-cursor');
    if (config.hasColorInput) {
        this.pickerInput = getELByClass(ele, 'ew-color-input');
    }
    if (config.hasClear) {
        this.pickerClear = getELByClass(ele, 'ew-color-clear');
    }
    if (config.hasSure) {
        this.pickerSure = getELByClass(ele, 'ew-color-sure');
    }
    if (config.hue) {
        this.hueBar = getELByClass(ele, 'ew-color-slider-bar');
        this.hueThumb = getELByClass(ele, 'ew-color-slider-thumb');
    }
    if (config.openChangeColorMode) {
        this.modeUp = getELByClass(ele, 'ew-color-mode-up');
        this.modeDown = getELByClass(ele, 'ew-color-mode-down');
        this.modeTitle = getELByClass(ele, "ew-color-mode-title");
    }
    this.picker = getELByClass(ele, 'ew-color-picker');
    this.slider = getELByClass(ele, 'ew-color-slider');
    if (config.defaultColor) {
        this.hsbColor = colorRegRGBA.test(config.defaultColor) ? colorRgbaToHSBa(config.defaultColor) : colorRgbaToHSBa(colorToRgba(config.defaultColor));
    } else {
        this.hsbColor = {
            h: 0,
            s: 100,
            b: 100,
            a: 1
        };
    }
    const panelWidth = this.panelWidth = parseInt(util.getCss(this.pickerPanel, 'width'));
    const panelHeight = this.panelHeight = parseInt(util.getCss(this.pickerPanel, 'height'));
    //计算偏差
    let elem = ele, top = elem.offsetTop, left = elem.offsetLeft;
    while (elem.offsetParent) {
        top += elem.offsetParent.offsetTop;
        left += elem.offsetParent.offsetLeft;
        elem = elem.offsetParent;
    }
    this.panelLeft = left;
    this.panelTop = top + ele.offsetHeight;
    //预定义颜色
    this.preDefineItem = getELByClass(ele, 'ew-pre-define-color', true);
    if (this.preDefineItem.length) {
        const items = util.ewObjToArray(this.preDefineItem);
        //点击预定义颜色
        items.map(item => {
            const clickHandler = event => {
                items.forEach(child => util.removeClass(child, 'ew-pre-define-color-active'));
                util.addClass(event.target, 'ew-pre-define-color-active');
                const bgColor = util.getCss(event.target, 'background-color');
                scope.hsbColor = colorRgbaToHSBa(bgColor);
                setColorValue(scope, panelWidth, panelHeight,true);
                changeElementColor(scope);
            };
            const blurHandler = event => util.removeClass(event.target, 'ew-pre-define-color-active');
            [{ type: "click", handler: clickHandler }, { type: "blur", handler: blurHandler }].forEach(t => {
                if (!config.disabled && util.ewObjToArray(item.classList).indexOf('ew-pre-define-color-disabled') === -1){
                    util.on(item, t.type, t.handler);
                }
            });
        })
    }
    //颜色选择器打开的动画初始设置
    this.picker.style[getHeiAni(scope) ? 'display' : 'opacity'] = getHeiAni(scope) ? 'none' : 0;
    const sliderWidth = !config.alpha && !config.hue ? 0 : !config.alpha || !config.hue ? 14 : 27;
    const pickerWidth = !config.alpha && !config.hue ? 280 : !config.alpha || !config.hue ? 300 : 320;
    this.slider.style.width = sliderWidth + 'px';
    this.picker.style.minWidth = pickerWidth + 'px';
    if (config.alpha) {
        this.alphaBar = getELByClass(ele, 'ew-alpha-slider-bar');
        this.alphaBarBg = getELByClass(ele, 'ew-alpha-slider-bg');
        this.alphaBarThumb = getELByClass(ele, 'ew-alpha-slider-thumb');
        if (!config.disabled) {
            this.bindEvent(this.alphaBarThumb, (scope, el, x, y) => changeAlpha(scope, y));
            util.on(this.alphaBar, 'click', event => changeAlpha(scope, event.y));
        }
    }
    if (!config.hasBox) {
        this.config.pickerFlag = true;
        open(getHeiAni(scope), this.picker);
        setColorValue(this, this.panelWidth, this.panelHeight,false);
    }
    if (config.disabled) {
        if (config.hasColorInput) {
            if (!util.hasClass(this.pickerInput, 'ew-input-disabled')) {
                this.pickerInput.classList.add('ew-input-disabled');
                this.pickerInput.disabled = true;
            }
        }
        if (!util.hasClass(this.picker, 'ew-color-picker-disabled')) {
            this.picker.classList.add('ew-color-picker-disabled');
        }
        return false;
    }
    //输入框输入事件
    if (config.hasColorInput) {
        util.on(this.pickerInput, 'blur', event => onInputColor(scope, event.target.value))
    }
    //清空按钮事件
    if (config.hasClear) {
        util.on(this.pickerClear, 'click', () => onClearColor(ele, scope));
    }
    //确认按钮事件
    if (config.hasSure) {
        util.on(this.pickerSure, 'click', () => onSureColor(ele, scope));
    }
    if (config.isClickOutside) {
        handleClickOutSide(this,config);
    }
    if (config.hasBox && !config.boxDisabled) util.on(this.box, 'click', () => handlePicker(ele, scope));
    if (config.openChangeColorMode && config.hasColorInput) {
        this.modeCount = config.alpha ? 1 : 0;
        this.currentMode = this.colorMode[this.modeCount];
        util.on(this.modeUp, "click", event => onHandleChangeMode(scope,'up',() => changeElementColor(scope)));
        util.on(this.modeDown, "click", event => onHandleChangeMode(scope,'down',() => changeElementColor(scope)));
    }
    //颜色面板点击事件
    util.on(this.pickerPanel, 'click', event => onClickPanel(scope, event));
    //颜色面板拖拽元素拖拽事件
    this.bindEvent(this.pickerCursor, (scope, el, x, y) => {
        const left = Math.max(0, Math.min(x - scope.panelLeft, panelWidth));
        const top = Math.max(0, Math.min(y - scope.panelTop, panelHeight));
        changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight);
    });
    if (config.hue) {
        //hue的点击事件
        util.on(this.hueBar, 'click', event => changeHue(scope, event.y))
        //hue 轨道的拖拽事件
        this.bindEvent(this.hueThumb, (scope, el, x, y) => changeHue(scope, y));
    }
}