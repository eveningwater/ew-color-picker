import util from './util'
import { colorToRgba, colorRgbaToHex, colorHSBaToRgba, colorRgbaToHSBa, isValidColor, colorHexToRgba, colorRegRGB, colorRegRGBA, colorRgbaToHsla, colorHslaToRgba } from './color';
import { consoleInfo } from './console';
import { ERROR_VARIABLE, NOT_DOM_ELEMENTS } from './error';
import { getELByClass } from './query';
import { open,close,getHeiAni,openAndClose } from './openOrClosePicker';
import { setPredefineDisabled,hasAlpha } from './predefineColor';
import { setBoxBackground } from './box';
import { cloneColor } from './cloneColor';
import { handleClickOutSide } from './clickOutSide';
import { changeMode } from './mode';
import { onRenderColorPicker } from './render';
import globalAPI from './globalAPI.js';
import { initConfig } from './initConfig';
/**
 * 构造函数
 * @param {*} config 
 */
function ewColorPicker(config) {
    if (util.isUndefined(new.target)) return util.ewError(ERROR_VARIABLE.CONSTRUCTOR_ERROR);
    let initOptions = initConfig(config);
    this.config = initOptions.config;
    this.beforeInit(initOptions.element,initOptions.config,initOptions.error);
}
const methods = [
    {
        name: "beforeInit",
        func: function (element, config, errorText) {
            // 不能是哪些标签元素
            const isNotDom = ele => {
                if (NOT_DOM_ELEMENTS.indexOf(ele.tagName.toLowerCase()) > -1) {
                    util.ewError(ERROR_VARIABLE.DOM_NOT_ERROR);
                    return true;
                }
                return false;
            }
            let ele = util.isDom(element) ? element : util.isString(element) ? util.$(element) : null;
            if (!ele) return util.ewError(errorText);
            ele = ele.length ? ele[0] : ele;
            if (!ele.tagName) return util.ewError(errorText);
            if (!isNotDom(ele)) {
                this._color_picker_uid = util.createUUID();
                if (config.openChangeColorMode) {
                    this.colorMode = ["hex", "rgba", "hsla"];
                }
                this.init(ele, config);
            }
        }
    },
    {
        name: "init",
        func: function (bindElement, config) {
            if (config.isLog) consoleInfo();
            let b_width, b_height;
            //自定义颜色选择器的类型
            if (util.isString(config.size)) {
                switch (config.size) {
                    case 'normal':
                        b_width = b_height = '40px';
                        break;
                    case 'medium':
                        b_width = b_height = '36px';
                        break;
                    case 'small':
                        b_width = b_height = '32px';
                        break;
                    case 'mini':
                        b_width = b_height = '28px';
                        break;
                    default:
                        b_width = b_height = '40px';
                        break;
                }
            } else if (util.isDeepObject(config.size)) {
                b_width = config.size.width && util.isNumber(config.size.width) ? parseInt(config.size.width) + 'px' : '40px';
                b_height = config.size.height && util.isNumber(config.size.height) ? parseInt(config.size.height) + 'px' : '40px';
            } else {
                return util.ewError(ERROR_VARIABLE.CONFIG_SIZE_ERROR);
            }
            config.boxSize.b_width = b_width;
            config.boxSize.b_height = b_height;
            //渲染选择器
            this.render(bindElement, config);
        }
    },
    {
        name: "render",
        func: function (element, config) {
            let predefineColorHTML = '',
                alphaBar = '',
                hueBar = '',
                predefineHTML = '',
                boxDisabledClassName = '',
                boxBackground = '',
                boxHTML = '',
                clearHTML = '',
                sureHTML = '',
                inputHTML = '',
                btnGroupHTML = '',
                dropHTML = '',
                openChangeColorModeHTML = '',
                openChangeColorModeLabelHTML = '';
            const p_c = config.predefineColor;
            if (!util.isDeepArray(p_c)) return util.ewError(ERROR_VARIABLE.PREDEFINE_COLOR_ERROR);
            if (p_c.length){
                p_c.map(color => {
                    let isValidColorString =  util.isString(color) && isValidColor(color);
                    let isValidColorObj = util.isDeepObject(color) && color.hasOwnProperty('color') && isValidColor(color.color);
                    let renderColor = isValidColorString ? color : isValidColorObj ? color.color : '';
                    let renderDisabled = isValidColorObj ? setPredefineDisabled(color.disabled) : '';
                    predefineColorHTML += `<div class="ew-pre-define-color${hasAlpha(renderColor)}${renderDisabled}" style="background:${ renderColor };"></div>`; 
                })
            };
            //打开颜色选择器的方框
            const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow" style="width:${this.config.boxSize.b_width};height:${this.config.boxSize.b_height};">
                <div class="ew-color-picker-arrow-left"></div>
                <div class="ew-color-picker-arrow-right"></div>
            </div>` : `<div class="ew-color-picker-no" style="width:${this.config.boxSize.b_width};height:${this.config.boxSize.b_height};line-height:${this.config.boxSize.b_height};">&times;</div>`;
            //透明度
            if (config.alpha) {
                alphaBar = `<div class="ew-alpha-slider-bar">
                    <div class="ew-alpha-slider-wrapper"></div>
                    <div class="ew-alpha-slider-bg"></div>
                    <div class="ew-alpha-slider-thumb"></div>
                </div>`;
            }
            // hue
            if (config.hue) {
                hueBar = `<div class="ew-color-slider-bar"><div class="ew-color-slider-thumb"></div></div>`;
            }
            if (predefineColorHTML) {
                predefineHTML = `<div class="ew-pre-define-color-container">${predefineColorHTML}</div>`;
            }
            if (config.disabled || config.boxDisabled) boxDisabledClassName = 'ew-color-picker-box-disabled';
            if (colorRegRGB.test(config.defaultColor)) {
                config.defaultColor = colorToRgba(config.defaultColor);
            }
            if (config.defaultColor && !isValidColor(config.defaultColor))return util.ewError(ERROR_VARIABLE.DEFAULT_COLOR_ERROR);
            config.colorValue = config.defaultColor;
            if (!config.disabled && config.colorValue) boxBackground = `background:${config.colorValue}`;
            // 盒子样式
            const boxStyle = `width:${config.boxSize.b_width};height:${config.boxSize.b_height};${boxBackground}`;
            if (config.hasBox) {
                boxHTML = `<div class="ew-color-picker-box ${boxDisabledClassName}" tabIndex="0" style="${boxStyle}">${colorBox}</div>`;
            }
            if (config.hasClear) {
                clearHTML = '<button class="ew-color-clear ew-color-drop-btn">清空</button>';
            }
            if (config.hasSure) {
                sureHTML = `<button class="ew-color-sure ew-color-drop-btn">确定</button>`;
            }
            if (config.hasClear || config.hasSure) {
                btnGroupHTML = `<div class="ew-color-drop-btn-group">${clearHTML}${sureHTML}</div>`;
            }
            if (config.hasColorInput) {
                inputHTML = '<input type="text" class="ew-color-input">';
            }
            if (config.openChangeColorMode) {
                if (!config.alpha || !config.hue)return util.ewError(ERROR_VARIABLE.COLOR_MODE_ERROR);
                openChangeColorModeHTML = `<div class="ew-color-mode-container">
                <div class="ew-color-mode-up"></div>
                <div class="ew-color-mode-down"></div>
                </div>`;
                openChangeColorModeLabelHTML = `<label class="ew-color-mode-title">${this.colorMode[1]}</label>`;
            }
            if (config.hasColorInput || config.hasClear || config.hasSure) {
                dropHTML = `<div class="ew-color-drop-container">
                ${openChangeColorModeLabelHTML}${inputHTML}${openChangeColorModeHTML}${btnGroupHTML}
                </div>`;
            }
            //颜色选择器
            const html = `${boxHTML}
                <div class="ew-color-picker">
                    <div class="ew-color-picker-content">
                        <div class="ew-color-slider">${alphaBar}${hueBar}</div>
                        <div class="ew-color-panel" style="background:red;">
                            <div class="ew-color-white-panel"></div>
                            <div class="ew-color-black-panel"></div>
                            <div class="ew-color-cursor"></div>
                        </div>
                    </div>
                    ${dropHTML}
                    ${predefineHTML}
                </div>`;
            let isBody = element.tagName.toLowerCase() === 'body';
            if (isBody) {
                const div = document.createElement('div');
                div.innerHTML = html;
                div.setAttribute('id', 'placeElement-' + this._color_picker_uid);
                this._bodyPlaceEle = div;
                let hasDiv = util.$('#placeElement-' + this._color_picker_uid);
                if (hasDiv) {
                    hasDiv.parentElement.removeChild(hasDiv);
                }
                element.appendChild(div);
            } else {
                element.innerHTML = html;
            }
            if (isBody) {
                this.startMain(this._bodyPlaceEle, config);
            } else {
                this.startMain(element, config);
            }
        }
    },
    {
        name: "startMain",
        func: function (ele, config) {
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
            if (config.hasBox && !config.boxDisabled) util.on(this.box, 'click', () => openPicker(ele, scope));
            if (config.openChangeColorMode && config.hasColorInput) {
                this.modeCount = config.alpha ? 1 : 0;
                this.currentMode = this.colorMode[this.modeCount];
                util.on(this.modeUp, "click", event => onHandleChangeMode(scope,'up'));
                util.on(this.modeDown, "click", event => onHandleChangeMode(scope,'down'));
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
    },
    {
        name: "bindEvent",
        func: function (el, callback, bool) {
            const context = this;
            const callResult = event => {
                context.moveX = util.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientX : event.clientX;
                context.moveY = util.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientY : event.clientY;
                bool ? callback(context, context.moveX, context.moveY) : callback(context, el, context.moveX, context.moveY);
            }
            const handler = () => {
                const moveFn = e => { e.preventDefault(); callResult(e); }
                const upFn = () => {
                    util.off(document, util.eventType[1], moveFn);
                    util.off(document, util.eventType[2], upFn);
                }
                util.on(document, util.eventType[1], moveFn);
                util.on(document, util.eventType[2], upFn);
            }
            util.on(el, util.eventType[0], handler);
        }
    },
    {
        name: "updateColor",
        func: function (color) {
            if (!isValidColor(color)) return util.ewError(ERROR_VARIABLE.UPDATE_PARAM_COLOR_ERROR);
            if (!this.config.pickerFlag) util.ewWarn(ERROR_VARIABLE.UPDATE_PARAM_COLOR_WARN);
            let rgbaColor = colorToRgba(color);
            this.hsbColor = colorRgbaToHSBa(rgbaColor);
            setColorValue(this, this.panelWidth, this.panelHeight,true);
        }
    },
    {
        name: "openPicker",
        func: function (ani) {
            if (ani) {
                this.config.openPickerAni = ani;
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
    },
    {
        name: "closePicker",
        func: function (ani) {
            if (ani) {
                this.config.openPickerAni = ani;
            }
            if (this.config.pickerFlag) {
                this.config.pickerFlag = false;
                close(getHeiAni(this), this.picker)
            }
        }
    }
];
methods.forEach(method => util.addMethod(ewColorPicker, method.name, method.func));

/**
 * 切换颜色模式
 * @param {*} context 
 * @param {*} index 
 */
function onHandleChangeMode(context,handleType){
    let l = context.colorMode.length;
    if(handleType === 'up'){
        context.modeCount += 1;
    }else{
        context.modeCount -= 1;
    }
    if (context.modeCount > l - 1) context.modeCount = 0;
    if (context.modeCount < 0) context.modeCount = l - 1;
    context.currentMode = context.colorMode[context.modeCount];
    changeElementColor(context);
}


/**
 * 打开面板
 * @param {*} el 
 * @param {*} scope 
 */
function openPicker(el, scope) {
    scope.config.pickerFlag = !scope.config.pickerFlag;
    onRenderColorPicker(scope.config.defaultColor, scope.config.pickerFlag, el, scope);
    setColorValue(scope, scope.panelWidth, scope.panelHeight,false);
    openAndClose(scope);
    if (util.isFunction(scope.config.openPicker)) scope.config.openPicker(el, scope);
}

/**
 * 输入颜色的转换
 * @param {*} scope 
 * @param {*} value 
 */
function onInputColor(scope, value) {
    if (!isValidColor(value)) return;
    // 两者相等，说明用户没有更改颜色
    if (util.removeAllSpace(scope.prevInputValue) === util.removeAllSpace(value))return;
    let color = null;
    if(scope.config.openChangeColorMode){
        switch (scope.currentMode) {
            case "hex":
                color = colorRgbaToHSBa(colorHexToRgba(value));
                break;
            case "rgba":
                color = colorRgbaToHSBa(value);
                break;
            case "hsla":
                // 需要先转换成rgba,再转换成hsv模式
                let hslaArr = value.slice(value.indexOf('(') + 1, value.lastIndexOf(')')).split(',');
                color = colorRgbaToHSBa(colorHslaToRgba({
                    h: Number(hslaArr[0]),
                    s: Number(hslaArr[1].replace(/%/g, "")),
                    l: Number(hslaArr[2].replace(/%/g, "")),
                    a: Number(hslaArr[3]) | 1
                }));
                break;
        }
    }else{
        color = scope.config.alpha ? colorRgbaToHSBa(value) : colorRgbaToHSBa(colorHexToRgba(value));
    }
    scope.hsbColor = color;
    setColorValue(scope, scope.panelWidth, scope.panelHeight,true);
    changeElementColor(scope);
}
/**
 * 清空
 * @param {*} el 
 * @param {*} scope 
 */
function onClearColor(el, scope) {
    onRenderColorPicker('', false, el, scope);
    openAndClose(scope);
    scope.config.clear(scope.config.defaultColor, scope);
}
/**
 * 确定
 * @param {*} scope 
 */
function onSureColor(el, scope) {
    const result = scope.config.alpha ? colorHSBaToRgba(scope.hsbColor) : colorRgbaToHex(colorHSBaToRgba(scope.hsbColor));
    onRenderColorPicker(result, false, el, scope);
    openAndClose(scope);
    changeElementColor(scope);
    scope.config.sure(result, scope);
}

/**
 * 拖拽
 * @param {*} scope 
 * @param {*} left 
 * @param {*} top 
 * @param {*} panelWidth 
 * @param {*} panelHeight 
 */
function changeCursorColor(scope, left, top, panelWidth, panelHeight) {
    util.setSomeCss(scope.pickerCursor, [{ prop: 'left', value: left + 'px' }, { prop: 'top', value: top + 'px' }])
    const s = parseInt(100 * (left - 4) / panelWidth);
    const b = parseInt(100 * (panelHeight - (top - 4)) / panelHeight);
    //需要减去本身的宽高来做判断
    scope.hsbColor.s = s > 100 ? 100 : s < 0 ? 0 : s;
    scope.hsbColor.b = b > 100 ? 100 : b < 0 ? 0 : b;
    scope.boxChange = true;
    changeElementColor(scope);
}
/**
 * 设置颜色
 * @param {*} context 
 * @param {*} panelWidth 
 * @param {*} panelHeight 
 */
function setColorValue(context, panelWidth, panelHeight,boxChange) {
    context.boxChange = boxChange;
    changeElementColor(context);
    context.prevInputValue = context.pickerInput.value;
    let sliderBarHeight = 0;
    let l = parseInt(context.hsbColor.s * panelWidth / 100),
        t = parseInt(panelHeight - context.hsbColor.b * panelHeight / 100);
    [
        {
            el: context.pickerCursor,
            prop: 'left',
            value: l + 4 + 'px'
        },
        {
            el: context.pickerCursor,
            prop: 'top',
            value: t + 4 + 'px'
        },
        {
            el: context.pickerPanel,
            prop: 'background',
            value: colorRgbaToHex(colorHSBaToRgba(cloneColor(context.hsbColor)))
        }
    ].forEach(item => util.setCss(item.el, item.prop, item.value));
    if (context.config.hue) {
        sliderBarHeight = context.hueBar.offsetHeight || 180;
        util.setCss(context.hueThumb, 'top', parseInt(context.hsbColor.h * sliderBarHeight / 360) + 'px');
    }
    if (context.config.alpha) {
        sliderBarHeight = context.alphaBar.offsetHeight || 180;
        util.setCss(context.alphaBarThumb, 'top', sliderBarHeight - context.hsbColor.a * sliderBarHeight + 'px');
    }
}
/**
 * 改变元素的颜色
 * @param {*} scope 
 * @param {*} isAlpha 
 */
function changeElementColor(scope, isAlpha) {
    const color = colorHSBaToRgba(scope.hsbColor);
    let newColor = isAlpha || scope.config.alpha ? color : colorRgbaToHex(color);
    if (scope.config.openChangeColorMode) {
        newColor = changeMode(scope, color);
    }
    if (scope.pickerInput) {
        scope.pickerInput.value = newColor;
        scope.prevInputValue = newColor;
    }
    changeAlphaBar(scope);
    if(scope.config.hasBox && scope.config.changeBoxByChangeColor && scope.boxChange){
        setBoxBackground(scope.box,newColor);
    }
    if (util.isFunction(scope.config.changeColor)) scope.config.changeColor(newColor);
}
/**
 * 点击面板改变
 * @param {*} scope 
 * @param {*} eve 
 */
function onClickPanel(scope, eve) {
    if (eve.target !== scope.pickerCursor) {
        //临界值处理
        const moveX = eve.layerX;
        const moveY = eve.layerY;
        const panelWidth = scope.pickerPanel.offsetWidth;
        const panelHeight = scope.pickerPanel.offsetHeight;
        const left = moveX >= panelWidth - 1 ? panelWidth : moveX <= 0 ? 0 : moveX;
        const top = moveY >= panelHeight - 2 ? panelHeight : moveY <= 0 ? 0 : moveY;
        changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight)
    }
}

/**
 * 改变透明度
 * @param {*} scope 
 */
function changeAlphaBar(scope) {
    if (!scope.alphaBarBg) return;
    util.setCss(scope.alphaBarBg, 'background', 'linear-gradient(to top,' + colorHSBaToRgba(scope.hsbColor,0) + ' 0%,' + colorHSBaToRgba(scope.hsbColor,1) + ' 100%)')
}

/**
 * 改变色调
 * @param {*} context 
 * @param {*} y 
 */
function changeHue(context, y) {
    let value = setAlphaHueTop(context.hueBar, context.hueThumb, y);
    context.hsbColor.h = cloneColor(context.hsbColor).h = parseInt(360 * value.barThumbY / value.barHeight);
    util.setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHSBaToRgba(cloneColor(context.hsbColor))));
    changeElementColor(context);
}
/**
 * 改变透明度
 * @param {*} context 
 * @param {*} y 
 */
function changeAlpha(context, y) {
    let value = setAlphaHueTop(context.alphaBar, context.alphaBarThumb, y);
    const alpha = ((value.barHeight - value.barThumbY <= 0 ? 0 : value.barHeight - value.barThumbY) / value.barHeight);
    context.hsbColor.a = alpha >= 1 ? 1 : alpha.toFixed(2);
    changeElementColor(context, true);
}
/**
 * 设置hue和alpha的top
 * @param {*} bar 
 * @param {*} thumb 
 * @param {*} y 
 */
function setAlphaHueTop(bar, thumb, y) {
    const barHeight = bar.offsetHeight, barRect = bar.getBoundingClientRect();
    const barThumbY = Math.max(0, Math.min(y - barRect.y, barHeight));
    util.setCss(thumb, 'top', barThumbY + 'px');
    return {
        barHeight,
        barThumbY
    }
};
// 全局API注册
Object.keys(globalAPI).forEach(key => {
    ewColorPicker[key] = globalAPI[key];
});
export default ewColorPicker;