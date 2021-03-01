import util from './util'
import { colorToRgba, colorRgbaToHex, colorHsbToRgba, colorRgbaToHsb, isValidColor, colorHexToRgba } from './color'
import ani from './animation';
import { consoleInfo } from './console';
import { ERROR_VARIABLE, NOT_DOM_ELEMENTS } from './error';
/**
 * 构造函数
 * @param {*} config 
 */
function ewColorPicker(config) {
    if (util.isUndefined(new.target)) return util.ewError(ERROR_VARIABLE.CONSTRUCTOR_ERROR);
    // 一个空函数
    const emptyFun = function () { };
    const defaultConfig = {
        hue: true,
        alpha: false,
        size: "normal",
        predefineColor: [],
        disabled: false,
        defaultColor: "",
        openPickerAni: "height",
        sure: emptyFun,
        clear: emptyFun,
        openPicker: emptyFun,
        isLog: true
    }
    // 盒子宽高
    this.boxSize = {
        b_width: null,
        b_height: null
    };
    //如果第二个参数传的是字符串，或DOM对象，则初始化默认的配置
    if (util.isString(config) || util.isDom(config)) {
        this.config = defaultConfig;
        this.beforeInit(config, this.config, ERROR_VARIABLE.DOM_ERROR);
    } //如果是对象，则自定义配置，自定义配置选项如下:
    else if (util.isDeepObject(config) && (util.isString(config.el) || util.isDom(config.el))) {
        this.config = util.ewAssign(defaultConfig, config);
        this.beforeInit(config.el, this.config, ERROR_VARIABLE.DOM_OBJECT_ERROR);
    } else {
        const errorText = util.isDeepObject(config) ? ERROR_VARIABLE.PICKER_OBJECT_CONFIG_ERROR : ERROR_VARIABLE.PICKER_CONFIG_ERROR;
        return util.ewError(errorText);
    }
    this.config.pickerFlag = false;
    this.config.colorValue = "";
    return this;
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
            const ele = util.isDom(element) ? element : util.isString(element) ? util.$(element) : null;
            if (!ele) return util.ewError(errorText);
            if (ele.length) {
                util.ewObjToArray(ele).forEach(item => {
                    if (!isNotDom(item)) new ewColorPicker(util.ewAssign(config, { el: item }));
                });
            } else {
                if (!ele.tagName) return util.ewError(errorText);
                if (!isNotDom(ele)) this.init(ele, config);
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
            this.boxSize.b_width = b_width;
            this.boxSize.b_height = b_height;
            //渲染选择器
            this.render(bindElement, config);
        }
    },
    {
        name: "render",
        func: function (element, config) {
            let predefineColorHTML = '', alphaBar = '', hueBar = '', predefineHTML = '', boxDisabledClassName = '', boxBackground = '';
            const p_c = config.predefineColor;
            if (!util.isDeepArray(p_c)) return util.ewError(ERROR_VARIABLE.PREDEFINE_COLOR_ERROR);
            if (p_c.length) p_c.map(color => { if (isValidColor(color)) predefineColorHTML += `<div class="ew-pre-define-color" style="background:${color};"></div>` });
            //打开颜色选择器的方框
            const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow" style="width:${this.boxSize.b_width};height:${this.boxSize.b_height};">
                <div class="ew-color-picker-arrow-left"></div>
                <div class="ew-color-picker-arrow-right"></div>
            </div>` : `<div class="ew-color-picker-no" style="width:${this.boxSize.b_width};height:${this.boxSize.b_height};line-height:${this.boxSize.b_height};">&times;</div>`;
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
            if (config.disabled) boxDisabledClassName = 'ew-color-picker-box-disabled';
            if (config.defaultColor && !isValidColor(config.defaultColor)) return util.ewError(ERROR_VARIABLE.DEFAULT_COLOR_ERROR);
            config.colorValue = config.defaultColor;
            if (!config.disabled && config.colorValue) boxBackground = `background:${config.colorValue}`;
            // 盒子样式
            const boxStyle = `width:${this.boxSize.b_width};height:${this.boxSize.b_height};${boxBackground}`;
            //颜色选择器
            const html = `
                <div class="ew-color-picker-box ${boxDisabledClassName}" tabIndex="0" style="${boxStyle}">${colorBox}</div>
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
    },
    {
        name: "startMain",
        func: function (ele, config) {
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
            this.hsbColor = this.config.defaultColor ? colorRgbaToHsb(colorToRgba(this.config.defaultColor)) : {
                h: 0,
                s: 100,
                b: 100,
                a: 1
            };
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
                        scope.hsbColor = colorRgbaToHsb(util.getCss(event.target, 'background-color'));
                        setDefaultValue(scope, panelWidth, panelHeight);
                        changeAlphaBar(scope);
                        changeElementColor(scope);
                        // fix the value bug
                        const setColor = colorRgbaToHex(util.getCss(event.target, 'background-color'));
                        scope.pickerInput.value = scope.config.alpha ? colorToRgba(setColor) : setColor;
                    };
                    const blurHandler = event => util.removeClass(event.target, 'ew-pre-define-color-active');
                    [{ type: "click", handler: clickHandler }, { type: "blur", handler: blurHandler }].forEach(t => util.on(item, t.type, t.handler));
                })
            }
            //颜色选择器打开的动画初始设置
            const isHeiAni = config.openPickerAni.indexOf('height') > -1;
            this.picker.style[isHeiAni ? 'display' : 'opacity'] = isHeiAni ? 'none' : 0;
            const sliderWidth = !config.alpha && !config.hue ? 0 : !config.alpha || !config.hue ? 14 : 27;
            const pickerWidth = !config.alpha && !config.hue ? 280 : !config.alpha || !config.hue ? 300 : 320;
            this.slider.style.width = sliderWidth + 'px';
            this.picker.style.minWidth = pickerWidth + 'px';
            if (config.alpha) {
                this.alphaBar = getELByClass(ele, 'ew-alpha-slider-bar');
                this.alphaBarBg = getELByClass(ele, 'ew-alpha-slider-bg');
                this.alphaBarThumb = getELByClass(ele, 'ew-alpha-slider-thumb');
                changeAlphaBar(this);
                this.bindEvent(this.alphaBarThumb, (scope, el, x, y) => changeAlpha(scope, y));
                util.on(this.alphaBar, 'click', event => changeAlpha(scope, event.y));
            }
            //输入框输入事件
            util.on(this.pickerInput, 'blur', event => onInputColor(scope, event.target.value))
            //清空按钮事件
            util.on(this.pickerClear, 'click', () => onClearColor(ele, scope));
            //确认按钮事件
            util.on(this.pickerSure, 'click', () => onSureColor(ele, scope));
            //是否禁止打开选择器面板，未禁止则点击可打开
            if (!config.disabled) util.on(this.box, 'click', () => openPicker(ele, scope));
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
    }
];
methods.forEach(method => util.addMethod(ewColorPicker, method.name, method.func));
/**
 * 获取元素的子元素
 * @param {*} el 
 * @param {*} prop 
 * @param {*} isIndex 
 */
function getELByClass(el, prop, isIndex) {
    return !isIndex ? el.querySelector('.' + prop) : el.querySelectorAll('.' + prop);
}
/**
 * 打开面板
 * @param {*} el 
 * @param {*} scope 
 */
function openPicker(el, scope) {
    scope.config.pickerFlag = !scope.config.pickerFlag;
    onRenderColorPicker(scope.config.defaultColor, scope.config.pickerFlag, el, scope);
    setDefaultValue(scope, scope.panelWidth, scope.panelHeight);
    openAndClose(scope);
    if (util.isFunction(scope.config.openPicker)) scope.config.openPicker(el, scope);
}
/**
 * 打开和关闭
 * @param {*} scope 
 */
function openAndClose(scope) {
    const expression = util.isString(scope.config.openPickerAni) && scope.config.openPickerAni.indexOf('height') > -1;
    const open = () => ani[expression ? 'slideDown' : 'fadeIn'](scope.picker, 200);
    const close = () => ani[expression ? 'slideUp' : 'fadeOut'](scope.picker, 200);
    if (scope.config.pickerFlag) {
        open();
        util.clickOutSide(scope.picker, (el, nodes, mouseHandler) => {
            if (scope.box !== el && !scope.box.contains(el)) {
                close();
                scope.config.pickerFlag = false;
                util.unBindMouseDown(nodes, mouseHandler);
            }
        });
    } else {
        close();
    }
}
/**
 * 输入颜色的转换
 * @param {*} scope 
 * @param {*} value 
 */
function onInputColor(scope, value) {
    if (!isValidColor(value)) return;
    const color = value.indexOf('#') > -1 ? colorRgbaToHsb(colorHexToRgba(value)) : colorRgbaToHsb(value);
    scope.hsbColor = color;
    setDefaultValue(scope, scope.panelWidth, scope.panelHeight);
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
    const result = scope.config.alpha ? colorHsbToRgba(scope.hsbColor) : colorRgbaToHex(colorHsbToRgba(scope.hsbColor));
    onRenderColorPicker(result, false, el, scope);
    openAndClose(scope);
    changeElementColor(scope);
    scope.config.sure(result, scope);
}
function onRenderColorPicker(color, pickerFlag, el, scope) {
    scope.config.defaultColor = scope.config.colorValue = color;
    scope.config.pickerFlag = pickerFlag;
    scope.render(el, scope.config);
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
    util.setCss(scope.pickerCursor, 'left', left + 'px');
    util.setCss(scope.pickerCursor, 'top', top + 'px');
    const s = parseInt(100 * (left - 4) / panelWidth);
    const b = parseInt(100 * (panelHeight - (top - 4)) / panelHeight);
    //需要减去本身的宽高来做判断
    scope.hsbColor.s = s > 100 ? 100 : s < 0 ? 0 : s;
    scope.hsbColor.b = b > 100 ? 100 : b < 0 ? 0 : b;
    changeElementColor(scope);
}
/**
 * 改变元素的颜色
 * @param {*} scope 
 * @param {*} isAlpha 
 */
function changeElementColor(scope, isAlpha) {
    const color = colorHsbToRgba(scope.hsbColor);
    scope.pickerInput.value = isAlpha || scope.config.alpha ? color : colorRgbaToHex(color);
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
function cloneColor(color) {
    const newColor = util.deepCloneObjByRecursion(color);
    newColor.s = newColor.b = 100;
    return newColor;
}
/**
 * 改变透明度
 * @param {*} scope 
 */
function changeAlphaBar(scope) {
    if (!scope.alphaBarBg) return;
    util.setCss(scope.alphaBarBg, 'background', 'linear-gradient(to top,' + colorHsbToRgba(cloneColor(scope.hsbColor), 0) + ' 0%,' + colorHsbToRgba(cloneColor(scope.hsbColor)) + ' 100%)')
}
/**
 * 设置默认颜色
 * @param {*} context 
 * @param {*} panelWidth 
 * @param {*} panelHeight 
 */
function setDefaultValue(context, panelWidth, panelHeight) {
    context.pickerInput.value = context.config.alpha ? colorHsbToRgba(context.hsbColor) : colorRgbaToHex(colorHsbToRgba(context.hsbColor));
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
            value: colorRgbaToHex(colorHsbToRgba(cloneColor(context.hsbColor)))
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
//改变色调的方法
function changeHue(context, y) {
    const sliderBarHeight = context.hueBar.offsetHeight,
        sliderBarRect = context.hueBar.getBoundingClientRect();
    const sliderThumbY = Math.max(0, Math.min(y - sliderBarRect.y, sliderBarHeight));
    util.setCss(context.hueThumb, 'top', sliderThumbY + 'px');
    context.hsbColor.h = cloneColor(context.hsbColor).h = parseInt(360 * sliderThumbY / sliderBarHeight);
    util.setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsbToRgba(cloneColor(context.hsbColor))));
    changeElementColor(context);
    changeAlphaBar(context);
}
//改变透明度的方法
function changeAlpha(context, y) {
    const alphaBarHeight = context.alphaBar.offsetHeight,
        alphaBarRect = context.alphaBar.getBoundingClientRect();
    const alphaThumbY = Math.max(0, Math.min(y - alphaBarRect.y, alphaBarHeight));
    util.setCss(context.alphaBarThumb, 'top', alphaThumbY + 'px');
    const alpha = ((alphaBarHeight - alphaThumbY <= 0 ? 0 : alphaBarHeight - alphaThumbY) / alphaBarHeight);
    context.hsbColor.a = alpha >= 1 ? 1 : alpha.toFixed(2);
    changeElementColor(context, true);
}
export default ewColorPicker;