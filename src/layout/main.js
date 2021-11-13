import { handleClickOutSide } from '../handler/clickOutSide';
import { getELByClass } from '../utils/query';
import { handlePicker, getAnimationType } from '../handler/openOrClosePicker';
import { colorRgbaToHsva } from '../color/color';
import { setColorValue } from './setColorValue';
import { changeElementColor } from './changeElementColor';
import { changeAlpha, changeHue } from './hueAndAlpha';
import { onHandleChangeMode } from './mode';
import { onClickPanel, changeCursorColor } from './panelAndCursor';
import { onInputColor } from './input';
import { onClearColor, onSureColor } from './clearAndSure';
import util from '../utils/util';
import { showColorPickerWithNoBox } from './showColorPickerWithNoBox';
import { initColor } from '../init/initColor';
/**
 *  初始化动画
 * @param {*} context 
 */
export function initAnimation(context) {
    //颜色选择器打开的动画初始设置
    const expression = getAnimationType(context);
    util.setCss(context.$Dom.picker, (expression ? 'display' : 'opacity'), (expression ? 'none' : 0))
}
/**
 * 初始化预定义颜色
 * @param {*} items 
 * @param {*} context 
 */
function initPreDefineHandler(items, context) {
    // get the siblings
    const siblings = el => Array.prototype.filter.call(el.parentElement.children, child => child !== el);
    items.map(item => {
        const clickHandler = event => {
            util.addClass(item, 'ew-pre-define-color-active');
            siblings(item).forEach(sibling => util.removeClass(sibling, 'ew-pre-define-color-active'))
            const bgColor = util.getCss(event.target, 'background-color');
            context.hsvaColor = colorRgbaToHsva(bgColor);
            setColorValue(context, context.panelWidth, context.panelHeight, true);
            changeElementColor(context);
        };
        const blurHandler = event => util.removeClass(event.target, 'ew-pre-define-color-active');
        [{ type: "click", handler: clickHandler }, { type: "blur", handler: blurHandler }].forEach(t => {
            if (!context.config.disabled && util.ewObjToArray(item.classList).indexOf('ew-pre-define-color-disabled') === -1) {
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
    // 初始化逻辑
    let scope = this;
    this.$Dom = Object.create(null);
    // cache the dom
    this.$cacheDom = Object.create(null);
    this.$Dom.rootElement = ele;
    this.$Dom.picker = getELByClass(ele, 'ew-color-picker');
    this.$Dom.pickerPanel = getELByClass(ele, 'ew-color-panel');
    this.$Dom.pickerCursor = getELByClass(ele, 'ew-color-cursor');
    if (this.isHueHorizontal || this.isAlphaHorizontal) {
        this.$Dom.horizontalSlider = getELByClass(ele, 'ew-is-horizontal');
    }
    if (!this.isHueHorizontal || !this.isAlphaHorizontal) {
        this.$Dom.verticalSlider = getELByClass(ele, 'ew-is-vertical');
    }
    initColor(this, config);
    const panelWidth = this.panelWidth = parseInt(util.getCss(this.$Dom.pickerPanel, 'width'));
    const panelHeight = this.panelHeight = parseInt(util.getCss(this.$Dom.pickerPanel, 'height'));
    const rect = util.getRect(ele);
    this.panelLeft = rect.left;
    this.panelTop = rect.top + rect.height;
    this.$Dom.preDefineItem = getELByClass(ele, 'ew-pre-define-color', true);
    // 预定义颜色逻辑
    if (this.$Dom.preDefineItem.length) {
        const preDefineItemArray = util.ewObjToArray(this.$Dom.preDefineItem);
        this.$cacheDom.preDefineItemContainer = preDefineItemArray[0].parentElement;
        initPreDefineHandler(preDefineItemArray, scope);
    }
    // 色阶柱逻辑
    if (config.hue) {
        this.$Dom.hueBar = getELByClass(ele, 'ew-color-slider-bar');
        this.$Dom.hueThumb = getELByClass(ele, 'ew-color-slider-thumb');
        // cache the hue node
        this.$cacheDom.hueContainer = this.$Dom.hueBar.parentElement;
        if (!config.disabled) {
            //hue的点击事件
            util.on(this.$Dom.hueBar, 'click', event => changeHue(scope, (this.isHueHorizontal ? event.x : event.y)))
            //hue 轨道的拖拽事件
            this.bindEvent(this.$Dom.hueThumb, (scope, el, x, y) => changeHue(scope, (this.isHueHorizontal ? x : y)));
        }
    }
    // 透明度柱
    if (config.alpha) {
        this.$Dom.alphaBar = getELByClass(ele, 'ew-alpha-slider-bar');
        this.$Dom.alphaBarBg = getELByClass(ele, 'ew-alpha-slider-bg');
        this.$Dom.alphaBarThumb = getELByClass(ele, 'ew-alpha-slider-thumb');
        // cache the alpha node
        this.$cacheDom.alphaContainer = this.$Dom.alphaBar.parentElement;
        if (!config.disabled) {
            this.bindEvent(this.$Dom.alphaBarThumb, (scope, el, x, y) => changeAlpha(scope, (this.isAlphaHorizontal ? x : y)));
            util.on(this.$Dom.alphaBar, 'click', event => changeAlpha(scope, (this.isAlphaHorizontal ? event.x : event.y)));
        }
    }
    initAnimation(scope);
    // 色块
    if (config.hasBox) {
        this.$Dom.box = getELByClass(ele, 'ew-color-picker-box');
        if (!config.boxDisabled && !config.disabled){
            util.on(this.$Dom.box, 'click', () => handlePicker(ele, scope, (flag) => {
                if (flag) {
                    initColor(this, config);
                    setColorValue(scope, scope.panelWidth, scope.panelHeight, false);
                }
            }));
        }
    } else {
        showColorPickerWithNoBox(this);
    }
    // 输入框
    if (config.hasInput) {
        this.$Dom.pickerInput = getELByClass(ele, 'ew-color-input');
        util.on(this.$Dom.pickerInput, 'blur', event => onInputColor(scope, event.target.value));
    }
    // 禁用逻辑
    if (config.disabled) {
        if (config.hasInput) {
            if (!util.hasClass(this.$Dom.pickerInput, 'ew-input-disabled')) {
                util.addClass(this.$Dom.pickerInput,'ew-input-disabled')
            }
            this.$Dom.pickerInput.disabled = true;
        }
        if (!util.hasClass(this.$Dom.picker, 'ew-color-picker-disabled')) {
            util.addClass(this.$Dom.picker,'ew-color-picker-disabled')
        }
        return false;
    }
    // 点击目标区域之外逻辑
    handleClickOutSide(this, config);
    // 清空按钮逻辑
    if (config.hasClear) {
        this.$Dom.pickerClear = getELByClass(ele, 'ew-color-clear');
        util.on(this.$Dom.pickerClear, 'click', () => onClearColor(scope));
    }
    // 确定按钮逻辑
    if (config.hasSure) {
        this.$Dom.pickerSure = getELByClass(ele, 'ew-color-sure');
        util.on(this.$Dom.pickerSure, 'click', () => onSureColor(scope));
    }
    // 颜色转换模式逻辑
    if (config.openChangeColorMode) {
        this.$Dom.modeUp = getELByClass(ele, 'ew-color-mode-up');
        this.$Dom.modeDown = getELByClass(ele, 'ew-color-mode-down');
        this.$Dom.modeTitle = getELByClass(ele, "ew-color-mode-title");
        if (config.hasInput) {
            this.modeCount = config.alpha ? 1 : 0;
            this.currentMode = this.colorMode[this.modeCount];
            util.on(this.$Dom.modeUp, "click", event => onHandleChangeMode(scope, 'up', () => changeElementColor(scope)));
            util.on(this.$Dom.modeDown, "click", event => onHandleChangeMode(scope, 'down', () => changeElementColor(scope)));
        }
    }
    // 颜色面板逻辑
    //颜色面板点击事件
    util.on(this.$Dom.pickerPanel, 'click', event => onClickPanel(scope, event));
    //颜色面板拖拽元素拖拽事件
    this.bindEvent(this.$Dom.pickerCursor, (scope, el, x, y) => {
        const left = Math.max(0, Math.min(x - scope.panelLeft, panelWidth));
        const top = Math.max(0, Math.min(y - scope.panelTop, panelHeight));
        changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight);
    });
}