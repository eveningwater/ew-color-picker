import { eventType, isDeepObject, ewError, getDom, isStr, isDom, addClass, removeClass, deepCloneObjByRecursion, isFunction, isNumber, isDeepArray, getCss, ewObjToArray, ewAssign } from './util'
import { colorToRgb, colorRgbaToHex, colorHsbaToRgba, colorRgbaToHsba } from './color'
import ani from './animation';
import { consoleInfo } from './console';
import './color-picker.css';
import { PICKER_OBJECT_CONFIG_ERROR, PICKER_CONFIG_ERROR, DOM_OBJECT_ERROR, DOM_ERROR, CONFIG_SIZE_ERROR, DOM_NOT_ERROR, NOT_DOM_ELEMENTS,PREDEFINE_COLOR_ERROR } from './error';
/**
 * 构造函数
 * @param {*} config 
 */
function ewColorPicker(config) {
    this.pickerFlag = false;
    const defaultConfig = {
        hue:true,
        alpha: false,
        size: "normal",
        predefineColor: [],
        disabled: false,
        defaultColor: "",
        openPickerAni: "height",
        sure: function () { },
        clear: function () { },
        openPicker: function () { },
        isLog: true
    }
    //如果第二个参数传的是字符串，或DOM对象，则初始化默认的配置
    if (isStr(config) || isDom(config)) {
        this.config = defaultConfig;
        this.beforeInit(config, this.config, DOM_ERROR);
    } //如果是对象，则自定义配置，自定义配置选项如下:
    else if (isDeepObject(config) && (isStr(config.el) || isDom(config.el))) {
        this.config = ewAssign(defaultConfig, config);
        this.beforeInit(config.el, this.config, DOM_OBJECT_ERROR);
    } else {
        const errorText = isDeepObject(config) ? PICKER_OBJECT_CONFIG_ERROR : PICKER_CONFIG_ERROR;
        return ewError(errorText);
    }
    return this;
}
ewColorPicker.prototype.beforeInit = function (element, config, errorText) {
    if (config.isLog) consoleInfo();
    // 不能是哪些标签元素
    const isNotDom = function (ele) {
        if (NOT_DOM_ELEMENTS.indexOf(ele.tagName.toLowerCase()) > -1) {
            ewError(DOM_NOT_ERROR);
            return true;
        }
        return false;
    }
    if (isDom(element)) {
        if (!isNotDom(element)) this.init(element, config);
    } else if (ewObjToArray(getDom(element)).length) {
        ewObjToArray(getDom(element)).forEach(item => {
            if (!isNotDom(item)) this.init(item, config);
        });
    } else {
        return ewError(errorText);
    }
}
ewColorPicker.prototype.init = function (bindElement, config) {
    let b_width, b_height;
    //自定义颜色选择器的类型
    if (isStr(config.size)) {
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
    } else if (isDeepObject(config.size)) {
        b_width = config.size.width && isNumber(config.size.width) ? parseInt(config.size.width) + 'px' : '40px';
        b_height = config.size.height && isNumber(config.size.height) ? parseInt(config.size.height) + 'px' : '40px';
    } else {
        return ewError(CONFIG_SIZE_ERROR);
    }
    this.b_width = b_width;
    this.b_height = b_height;
    //渲染选择器
    this.render(bindElement, config);
}
ewColorPicker.prototype.render = function (element, config) {
    let predefineColorHTML = '';
    //设置预定义颜色
    if (isDeepArray(config.predefineColor)) {
        if(config.predefineColor.length){
            config.predefineColor.map((color) => {
                predefineColorHTML += `<div class="ew-pre-define-color" style="background:${color};" tabIndex=0></div>`;
            });
        }
    }else {
        return ewError(PREDEFINE_COLOR_ERROR);
    }
    //打开颜色选择器的方框
    const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow" style="width:${this.b_width};height:${this.b_height};">
        <div class="ew-color-picker-arrow-left"></div>
        <div class="ew-color-picker-arrow-right"></div>
    </div>` : `<div class="ew-color-picker-no" style="width:${this.b_width};height:${this.b_height};line-height:${this.b_height};">&times;</div>`;
    //透明度
    const alphaBar = config.alpha ? `<div class="ew-alpha-slider-bar">
    <div class="ew-alpha-slider-wrapper"></div>
    <div class="ew-alpha-slider-bg"></div>
    <div class="ew-alpha-slider-thumb"></div>
    </div>` : '';
    // hue
    const hueBar = config.hue ? `<div class="ew-color-slider-bar"><div class="ew-color-slider-thumb"></div></div>` : '';
    //自定义颜色
    const predefineHTML = predefineColorHTML ? `<div class="ew-pre-define-color-container">${predefineColorHTML}</div>` : '';
    // 禁用类名
    const boxDisabledClassName = config.disabled ? 'ew-color-picker-box-disabled' : '';
    // 盒子样式
    const boxStyle = `width:${this.b_width};height:${this.b_height};${config.defaultColor ? 'background:' + config.defaultColor : ''}`;
    //颜色选择器
    let html = `
        <div class="ew-color-picker-box ${ boxDisabledClassName}" tabIndex="0" style="${boxStyle}">${colorBox}</div>
        <div class="ew-color-picker">
            <div class="ew-color-picker-content">
                <div class="ew-color-slider">${alphaBar}${hueBar}</div>
                <div class="ew-color-panel" style="background:red;">
                    <div class="ew-color-white-panel"></div>
                    <div class="ew-color-black-panel"></div>
                    <div class="ew-color-cursor"></div>
                </div>
            </div>
            <div class="ew-color-drop-container">
                <input type="text" class="ew-color-input">
                <div class="ew-color-drop-btn-group">
                    <button class="ew-color-clear ew-color-drop-btn">清空</button>
                    <button class="ew-color-sure ew-color-drop-btn">确定</button>
                </div>
            </div>
            ${predefineHTML}
        </div>`;
    element.innerHTML = html;
    this.startMain(element, config);
}
ewColorPicker.prototype.startMain = function (ele, config) {
    let scope = this;
    //获取颜色选择器的一些操作元素
    this.box = getELByClass(ele, 'ew-color-picker-box');
    this.arrowRight = getELByClass(ele, 'ew-color-picker-arrow-right');
    this.pickerPanel = getELByClass(ele, 'ew-color-panel');
    this.pickerCursor = getELByClass(ele, 'ew-color-cursor');
    this.pickerInput = getELByClass(ele, 'ew-color-input');
    this.pickerClear = getELByClass(ele, 'ew-color-clear');
    this.pickerSure = getELByClass(ele, 'ew-color-sure');
    this.hueBar = getELByClass(ele, 'ew-color-slider-bar');
    this.hueThumb = getELByClass(ele, 'ew-color-slider-thumb');
    this.picker = getELByClass(ele, 'ew-color-picker');
    this.slider = getELByClass(ele, 'ew-color-slider');
    this.hsba = this.config.defaultColor ? colorRgbaToHsba(colorToRgb(this.config.defaultColor)) : {
        h: 0,
        s: 100,
        b: 100,
        a: 1
    };
    const panelWidth = this.panelWidth = parseInt(getCss(this.pickerPanel, 'width'));
    const panelHeight = this.panelHeight = parseInt(getCss(this.pickerPanel, 'height'));
    //计算偏差
    let elem = ele;
    let top = elem.offsetTop;
    let left = elem.offsetLeft;
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
        //点击预定义颜色
        ewObjToArray(this.preDefineItem).map((item) => {
            item.addEventListener('click', function (event) {
                ewObjToArray(this.parentElement.children).forEach((child) => {
                    removeClass(child, 'ew-pre-define-color-active');
                });
                addClass(event.target, 'ew-pre-define-color-active');
                let pColor = colorRgbaToHsba(getCss(event.target, 'background-color'));
                scope.hsba = pColor;
                changeElementColor(scope);
                changeAlphaBar(scope);
                setDefaultValue(scope, panelWidth, panelHeight);
            }, false);
            item.addEventListener('blur', function (event) {
                removeClass(event.target, 'ew-pre-define-color-active');
            }, false)
        })
    }
    //颜色选择器打开的动画初始设置
    if (config.openPickerAni.indexOf('height') > -1) {
        this.picker.style.display = 'none';
    } else {
        this.picker.style.opacity = 0;
    }
    const sliderWidth = !config.alpha && !config.hue ? 0 : !config.alpha || !config.hue ? 14 : 27;
    const pickerWidth = !config.alpha && !config.hue ? 280 : !config.alpha || !config.hue ? 300 : 320;
    this.slider.style.width = sliderWidth + 'px';
    this.picker.style.minWidth = pickerWidth + 'px';
    if(config.alpha){
        this.alphaBar = getELByClass(ele, 'ew-alpha-slider-bar');
        this.alphaBarBg = getELByClass(ele, 'ew-alpha-slider-bg');
        this.alphaBarThumb = getELByClass(ele, 'ew-alpha-slider-thumb');
        changeAlphaBar(this)
        this.bindEvent(this.alphaBarThumb, function (scope, el, x, y) {
            changeAlpha(scope, y)
        }, false);
        this.alphaBar.addEventListener('click', function (event) {
            changeAlpha(scope, event.y)
        }, false);
    }
    //输入框输入事件
    this.pickerInput.addEventListener('blur', function (event) {
        onInputColor(scope, event.target.value);
    }, false);
    //清空按钮事件
    this.pickerClear.addEventListener('click', function () {
        onClearColor(ele, scope);
    }, false);
    //确认按钮事件
    this.pickerSure.addEventListener('click', function () {
        onSureColor(scope);
    });
    //是否禁止打开选择器面板，未禁止则点击可打开
    if (!config.disabled) {
        this.box.addEventListener('click', function () {
            openPicker(ele, scope);
        }, false);
    }
    //颜色面板点击事件
    this.pickerPanel.addEventListener('click', function (event) {
        onClickPanel(scope, event);
    }, false);
    //颜色面板拖拽元素拖拽事件
    this.bindEvent(this.pickerCursor, function (scope, el, x, y) {
        const left = Math.max(0, Math.min(x - scope.panelLeft, panelWidth));
        const top = Math.max(0, Math.min(y - scope.panelTop, panelHeight));
        changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight);
    }, false);
    if (config.hue) {
        //hue的点击事件
        this.hueBar.addEventListener('click', function (event) {
            changeHue(scope, event.y)
        }, false);
        //hue 轨道的拖拽事件
        this.bindEvent(this.hueThumb, function (scope, el, x, y) {
            changeHue(scope, y);
        }, false);
    }
}
/**
 * 绑定事件
 */
ewColorPicker.prototype.bindEvent = function (el, callback, bool) {
    const context = this;
    const event_param = { capture: false, once: false, passive: false, useCapture: false, wantsUntrusted: false };
    const callResult = function (event) {
        context.moveX = eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientX : event.clientX;
        context.moveY = eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientY : event.clientY;
        bool ? callback(context, context.moveX, context.moveY) : callback(context, el, context.moveX, context.moveY);
    }
    el.addEventListener(eventType[0], function () {
        const moveFn = function (e) {
            e.preventDefault();
            callResult(e);
        }
        const upFn = function () {
            document.removeEventListener(eventType[1], moveFn, event_param);
            document.removeEventListener(eventType[2], upFn, event_param);
        }
        document.addEventListener(eventType[1], moveFn, event_param);
        document.addEventListener(eventType[2], upFn, event_param);
    }, event_param);
}
/**
 * 获取元素的子元素
 * @param {*} el 
 * @param {*} prop 
 * @param {*} isIndex 
 */
function getELByClass(el, prop, isIndex) {
    return !isIndex ? el.querySelector ? el.querySelector('.' + prop) : el.getElementsByClassName(prop)[0] : el.querySelectorAll ? el.querySelectorAll('.' + prop) : el.getElementsByClassName(prop);
}

/**
 * 设置css样式
 * @param {*} el 
 * @param {*} prop 
 * @param {*} value 
 */
function setCss(el, prop, value) {
    el.style[prop] = value;
}
/**
 * 打开面板
 * @param {*} el 
 * @param {*} scope 
 */
function openPicker(el, scope) {
    scope.pickerFlag = !scope.pickerFlag;
    scope.config.defaultColor = scope.config.alpha ? colorHsbaToRgba(scope.hsba) : colorRgbaToHex(colorHsbaToRgba(scope.hsba));
    scope.render(el, scope.config);
    setDefaultValue(scope, scope.panelWidth, scope.panelHeight);
    openAndClose(scope);
    if (isFunction(scope.config.openPicker)) scope.config.openPicker(el, scope);
}
/**
 * 打开和关闭
 * @param {*} scope 
 */
function openAndClose(scope) {
    const expression = isStr(scope.config.openPickerAni) && scope.config.openPickerAni.indexOf('height') > -1;
    let open = function () {
        return expression ? ani.slideDown(scope.picker, 400) : ani.fadeIn(scope.picker, 400);
    }
    let close = function () {
        return expression ? ani.slideUp(scope.picker, 400) : ani.fadeOut(scope.picker, 400);
    }
    return scope.pickerFlag ? open() : close();
}
/**
 * 输入颜色的转换
 * @param {*} scope 
 * @param {*} value 
 */
function onInputColor(scope, value) {
    const color = colorRgbaToHsba(colorToRgb(value));
    if (!color.h && !color.s && !color.h && !color.a) return;
    scope.hsba = color;
    setDefaultValue(scope, scope.panelWidth, scope.panelHeight);
    changeElementColor(scope);
}
/**
 * 清空
 * @param {*} el 
 * @param {*} scope 
 */
function onClearColor(el, scope) {
    onRenderColorPicker(el, scope);
    openAndClose(scope);
    scope.config.clear(scope.config.defaultColor, scope);
}
/**
 * 重新渲染
 * @param {*} scope 
 */
function onRenderColorPicker(el, scope) {
    scope.config.defaultColor = '';
    scope.pickerFlag = !scope.pickerFlag;
    scope.render(el, scope.config);
}
/**
 * 确定
 * @param {*} scope 
 */
function onSureColor(scope) {
    scope.pickerFlag = false;
    openAndClose(scope);
    changeElementColor(scope);
    const result = scope.config.alpha ? colorHsbaToRgba(scope.hsba) : colorRgbaToHex(colorHsbaToRgba(scope.hsba));
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
    setCss(scope.pickerCursor, 'left', left + 'px');
    setCss(scope.pickerCursor, 'top', top + 'px');
    const s = parseInt(100 * left / panelWidth);
    const b = parseInt(100 * (panelHeight - top) / panelHeight);
    //需要减去本身的宽高来做判断
    scope.hsba.s = s > 100 ? 100 : s < 0 ? 0 : s;
    scope.hsba.b = b > 100 ? 100 : b < 0 ? 0 : b;
    changeElementColor(scope);
}
/**
 * 改变元素的颜色
 * @param {*} scope 
 * @param {*} isAlpha 
 */
function changeElementColor(scope, isAlpha) {
    setCss(scope.box, 'background', colorHsbaToRgba(scope.hsba));
    scope.pickerInput.value = isAlpha || scope.config.alpha ? colorHsbaToRgba(scope.hsba) : colorRgbaToHex(colorHsbaToRgba(scope.hsba));
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
 * 克隆颜色对象
 * @param {*} color 
 */
function cloneColor(color){
    const newColor = deepCloneObjByRecursion(color);
    newColor.s = newColor.b = 100;
    return newColor;
}
/**
 * 改变透明度
 * @param {*} scope 
 */
function changeAlphaBar(scope) {
    if (!scope.alphaBarBg) return;
    setCss(scope.alphaBarBg, 'background', 'linear-gradient(to top,' + colorHsbaToRgba(cloneColor(scope.hsba), 0) + ' 0%,' + colorHsbaToRgba(cloneColor(scope.hsba)) + ' 100%)')
}
/**
 * 设置默认颜色
 * @param {*} context 
 * @param {*} panelWidth 
 * @param {*} panelHeight 
 */
function setDefaultValue(context, panelWidth, panelHeight) {
    context.pickerInput.value = context.config.alpha ? colorHsbaToRgba(context.hsba) : colorRgbaToHex(colorHsbaToRgba(context.hsba));
    if (context.box) context.box.style.background = context.pickerInput.value;
    let sliderBarHeight = 0;
    if(context.config.hue){
        sliderBarHeight = context.hueBar.offsetHeight || 180;
        let ty = parseInt(context.hsba.h * sliderBarHeight / 360);
        setCss(context.hueThumb, 'top', ty + 'px');
    }
    let l = parseInt(context.hsba.s * panelWidth / 100),
        t = parseInt(panelHeight - context.hsba.b * panelHeight / 100);
    setCss(context.pickerCursor, 'left', l + 4 + 'px');
    setCss(context.pickerCursor, 'top', t + 4 + 'px');
    //颜色面板颜色
    setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsbaToRgba(cloneColor(context.hsba))));
    //改变透明度
    if (context.config.alpha) {
        if(!context.config.hue)sliderBarHeight = context.alphaBar.offsetHeight || 180;
        const al_t = sliderBarHeight - context.hsba.a * sliderBarHeight;
        setCss(context.alphaBarThumb, 'top', al_t + 'px');
    }
}
//改变色调的方法
function changeHue(context, y) {
    const sliderBarHeight = context.hueBar.offsetHeight,
        sliderBarRect = context.hueBar.getBoundingClientRect();
    let sliderThumbY = Math.max(0, Math.min(y - sliderBarRect.y, sliderBarHeight));
    setCss(context.hueThumb, 'top', sliderThumbY + 'px');
    context.hsba.h = cloneColor(context.hsba).h = parseInt(360 * sliderThumbY / sliderBarHeight);
    setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsbaToRgba(cloneColor(context.hsba))));
    changeElementColor(context);
    changeAlphaBar(context);
}
//改变透明度的方法
function changeAlpha(context, y) {
    const alphaBarHeight = context.alphaBar.offsetHeight,
        alphaBarRect = context.alphaBar.getBoundingClientRect();
    let alphaThumbY = Math.max(0, Math.min(y - alphaBarRect.y, alphaBarHeight));
    setCss(context.alphaBarThumb, 'top', alphaThumbY + 'px');
    const alpha = ((alphaBarHeight - alphaThumbY <= 0 ? 0 : alphaBarHeight - alphaThumbY) / alphaBarHeight);
    context.hsba.a = alpha >= 1 ? 1 : alpha.toFixed(2);
    changeElementColor(context, true);
}
if (!window.ewColorPicker) {
    window.ewColorPicker = ewColorPicker;
}
export default ewColorPicker;