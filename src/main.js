import { handleClickOutSide } from './clickOutSide';
import { getELByClass } from './query';
import { handlePicker,getHeiAni,open } from './openOrClosePicker';
import { colorRegRGBA,colorRgbaToHsva,colorToRgba } from './color';
import { setColorValue } from './setColorValue';
import { changeElementColor } from './changeElementColor';
import { changeAlpha,changeHue } from './hueAndAlpha';
import { onHandleChangeMode } from './mode';
import { onClickPanel,changeCursorColor } from './panelAndCursor';
import { onInputColor } from './input';
import { onClearColor,onSureColor } from './clearAndSure';
import util from './util';
/**
 *  
 * @param {*} context 
 */
function initAnimation(context){
    //颜色选择器打开的动画初始设置
    const expression = getHeiAni(context);
    context.picker.style[expression  ? 'display' : 'opacity'] = expression ? 'none' : 0;
    const sliderWidth = !context.config.alpha && !context.config.hue ? 0 : !context.config.alpha || !context.config.hue ? 14 : 27;
    const pickerWidth = !context.config.alpha && !context.config.hue ? 280 : !context.config.alpha || !context.config.hue ? 300 : 320;
    context.slider.style.width = sliderWidth + 'px';
    context.picker.style.minWidth = pickerWidth + 'px';
}
/**
 * 
 * @param {*} items 
 * @param {*} context 
 */
function initPreDefineHandler(items,context){
    // get the siblings
    const siblings = el => Array.prototype.filter.call(el.parentElement.children,child => child !== el);
    items.map(item => {
        const clickHandler = event => {
            util.addClass(item,'ew-pre-define-color-active');
            siblings(item).forEach(sibling => util.removeClass(sibling,'ew-pre-define-color-active'))
            const bgColor = util.getCss(event.target, 'background-color');
            context.hsvaColor = colorRgbaToHsva(bgColor);
            setColorValue(context, panelWidth, panelHeight,true);
            changeElementColor(context);
        };
        const blurHandler = event => util.removeClass(event.target, 'ew-pre-define-color-active');
        [{ type: "click", handler: clickHandler }, { type: "blur", handler: blurHandler }].forEach(t => {
            if (!context.config.disabled && util.ewObjToArray(item.classList).indexOf('ew-pre-define-color-disabled') === -1){
                util.on(item, t.type, t.handler);
            }
        });
    })
}
/**
 * 主要功能
 * @param {*} ele 
 * @param {*} config 
 * @returns 
 */
export function startMain(ele, config) {
    let scope = this;
    this.rootElement = ele;
    this.pickerPanel = getELByClass(ele, 'ew-color-panel');
    this.pickerCursor = getELByClass(ele, 'ew-color-cursor');
    this.picker = getELByClass(ele, 'ew-color-picker');
    this.slider = getELByClass(ele, 'ew-color-slider');
    if (config.defaultColor) {
        this.hsvaColor = colorRegRGBA.test(config.defaultColor) ? colorRgbaToHsva(config.defaultColor) : colorRgbaToHsva(colorToRgba(config.defaultColor));
    } else {
        this.hsvaColor = {
            h: 0,
            s: 100,
            v: 100,
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
    this.preDefineItem = getELByClass(ele, 'ew-pre-define-color', true);
    if (this.preDefineItem.length) {
        initPreDefineHandler(util.ewObjToArray(this.preDefineItem),scope);
    }
    if (config.hue) {
        this.hueBar = getELByClass(ele, 'ew-color-slider-bar');
        this.hueThumb = getELByClass(ele, 'ew-color-slider-thumb');
        //hue的点击事件
        util.on(this.hueBar, 'click', event => changeHue(scope, event.y))
        //hue 轨道的拖拽事件
        this.bindEvent(this.hueThumb, (scope, el, x, y) => changeHue(scope, y));
    }
    if (config.alpha) {
        this.alphaBar = getELByClass(ele, 'ew-alpha-slider-bar');
        this.alphaBarBg = getELByClass(ele, 'ew-alpha-slider-bg');
        this.alphaBarThumb = getELByClass(ele, 'ew-alpha-slider-thumb');
        if (!config.disabled) {
            this.bindEvent(this.alphaBarThumb, (scope, el, x, y) => changeAlpha(scope, y));
            util.on(this.alphaBar, 'click', event => changeAlpha(scope, event.y));
        }
    }
    initAnimation(scope);
    //获取颜色选择器的一些操作元素
    if (config.hasBox) {
        this.box = getELByClass(ele, 'ew-color-picker-box');
        if(!config.boxDisabled)util.on(this.box, 'click', () => handlePicker(ele, scope));;
    }else{
        this.config.pickerFlag = true;
        open(getHeiAni(scope), this.picker);
        setColorValue(this, this.panelWidth, this.panelHeight,false);
    }
    if (config.hasColorInput) {
        this.pickerInput = getELByClass(ele, 'ew-color-input');
        util.on(this.pickerInput, 'blur', event => onInputColor(scope, event.target.value));
    }
    if (config.hasClear) {
        this.pickerClear = getELByClass(ele, 'ew-color-clear');
        util.on(this.pickerClear, 'click', () => onClearColor(ele, scope));
    }
    if (config.hasSure) {
        this.pickerSure = getELByClass(ele, 'ew-color-sure');
        util.on(this.pickerSure, 'click', () => onSureColor(ele, scope));
    }
    if (config.openChangeColorMode) {
        this.modeUp = getELByClass(ele, 'ew-color-mode-up');
        this.modeDown = getELByClass(ele, 'ew-color-mode-down');
        this.modeTitle = getELByClass(ele, "ew-color-mode-title");
        if(config.hasColorInput){
            this.modeCount = config.alpha ? 1 : 0;
            this.currentMode = this.colorMode[this.modeCount];
            util.on(this.modeUp, "click", event => onHandleChangeMode(scope,'up',() => changeElementColor(scope)));
            util.on(this.modeDown, "click", event => onHandleChangeMode(scope,'down',() => changeElementColor(scope)));
        }
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
    if (config.isClickOutside) {
        handleClickOutSide(this,config);
    }
    //颜色面板点击事件
    util.on(this.pickerPanel, 'click', event => onClickPanel(scope, event));
    //颜色面板拖拽元素拖拽事件
    this.bindEvent(this.pickerCursor, (scope, el, x, y) => {
        const left = Math.max(0, Math.min(x - scope.panelLeft, panelWidth));
        const top = Math.max(0, Math.min(y - scope.panelTop, panelHeight));
        changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight);
    });
}