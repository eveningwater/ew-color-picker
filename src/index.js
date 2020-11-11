import util from './util'
import { colorToRgb, colorRgbaToHex, colorHsbToRgba, colorRgbaToHsb,colorHexToRgba } from './color'
import ani from './animation';
import { consoleInfo } from './console';
import './color-picker.css';
import { ERROR_VARIABLE,NOT_DOM_ELEMENTS } from './error';
/**
 * 构造函数
 * @param {*} config 
 */
function ewColorPicker(config) {
    if(typeof new.target === 'undefined')return util.ewError(ERROR_VARIABLE.CONSTRUCTOR_ERROR);
    const defaultConfig = {
        hue: true,
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
    this.boxSize = {
        b_width:null,
        b_height:null
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
    return this;
}
const methods = [
    {
        name:"beforeInit",
        func:function (element, config, errorText) {
            if (config.isLog) consoleInfo();
            // 不能是哪些标签元素
            const isNotDom = function (ele) {
                if (NOT_DOM_ELEMENTS.indexOf(ele.tagName.toLowerCase()) > -1) {
                    util.ewError(ERROR_VARIABLE.DOM_NOT_ERROR);
                    return true;
                }
                return false;
            }
            const ele = util.isDom(element) ? element : util.isString(element) ? util.getDom(element) : null;
            if(ele){
                if(ele.length){
                    util.ewObjToArray(ele).forEach(item => {if (!isNotDom(item)) this.init(item, config);});
                }else{
                    if(!ele.tagName)return util.ewError(errorText);
                    if (!isNotDom(ele)) this.init(ele, config);
                }
            }else{
                return util.ewError(errorText);
            }
        }
    },
    {
        name:"init",
        func:function (bindElement, config) {
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
        name:"render",
        func:function (element, config) {
            let predefineColorHTML = '';
            //设置预定义颜色
            if (util.isDeepArray(config.predefineColor)) {
                if (config.predefineColor.length) {
                    config.predefineColor.map((color) => {
                        predefineColorHTML += `<div class="ew-pre-define-color" style="background:${color};" tabIndex=0></div>`;
                    });
                }
            } else {
                return util.ewError(ERROR_VARIABLE.PREDEFINE_COLOR_ERROR);
            }
            //打开颜色选择器的方框
            const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow" style="width:${this.boxSize.b_width};height:${this.boxSize.b_height};">
                <div class="ew-color-picker-arrow-left"></div>
                <div class="ew-color-picker-arrow-right"></div>
            </div>` : `<div class="ew-color-picker-no" style="width:${this.boxSize.b_width};height:${this.boxSize.b_height};line-height:${this.boxSize.b_height};">&times;</div>`;
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
            const boxStyle = `width:${this.boxSize.b_width};height:${this.boxSize.b_height};${config.defaultColor ? 'background:' + config.defaultColor : ''}`;
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
    },
    {
        name:"startMain",
        func:function (ele, config) {
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
            this.hsbColor = this.config.defaultColor ? colorRgbaToHsb(colorToRgb(this.config.defaultColor)) : {
                h: 0,
                s: 100,
                b: 100,
                a: 1
            };
            const panelWidth = this.panelWidth = parseInt(util.getCss(this.pickerPanel, 'width'));
            const panelHeight = this.panelHeight = parseInt(util.getCss(this.pickerPanel, 'height'));
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
                util.ewObjToArray(this.preDefineItem).map((item) => {
                    item.addEventListener('click', function (event) {
                        util.ewObjToArray(this.parentElement.children).forEach((child) => {
                            util.removeClass(child, 'ew-pre-define-color-active');
                        });
                        util.addClass(event.target, 'ew-pre-define-color-active');
                        let pColor = colorRgbaToHsb(util.getCss(event.target, 'background-color'));
                        scope.hsbColor = pColor;
                        setDefaultValue(scope, panelWidth, panelHeight);
                        changeAlphaBar(scope);
                        changeElementColor(scope);
                        // fix the value bug
                        const setColor =  colorRgbaToHex(util.getCss(event.target, 'background-color'));
                        scope.pickerInput.value = scope.config.alpha ? colorToRgb(setColor) : setColor;
                    }, false);
                    item.addEventListener('blur', function (event) {
                        util.removeClass(event.target, 'ew-pre-define-color-active');
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
            if (config.alpha) {
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
                    setPickerPosition(scope,left,top);
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
    },
    {
        name:"bindEvent",
        func:function (el, callback, bool) {
            const context = this;
            const event_param = { capture: false, once: false, passive: false, useCapture: false, wantsUntrusted: false };
            const callResult = function (event) {
                context.moveX = util.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientX : event.clientX;
                context.moveY = util.eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientY : event.clientY;
                bool ? callback(context, context.moveX, context.moveY) : callback(context, el, context.moveX, context.moveY);
            }
            el.addEventListener(util.eventType[0], function () {
                const moveFn = function (e) {
                    e.preventDefault();
                    callResult(e);
                }
                const upFn = function () {
                    document.removeEventListener(util.eventType[1], moveFn, event_param);
                    document.removeEventListener(util.eventType[2], upFn, event_param);
                }
                document.addEventListener(util.eventType[1], moveFn, event_param);
                document.addEventListener(util.eventType[2], upFn, event_param);
            }, event_param);
        }
    }
];
methods.forEach(method => util.addMethod(ewColorPicker,method.name,method.func));
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
 * 设置picker的位置
 * @param {*} scope 
 * @param {*} left 
 * @param {*} top 
 */
function setPickerPosition(scope,left,top){
    let pickerTop = top + parseInt(scope.boxSize.b_height) + 20;
    util.setCss(scope.picker, 'left', left + 'px');
    util.setCss(scope.picker, 'top', pickerTop + 'px');
}
/**
 * 打开面板
 * @param {*} el 
 * @param {*} scope 
 */
function openPicker(el, scope) {
    scope.config.pickerFlag = !scope.config.pickerFlag;
    scope.config.defaultColor = scope.config.alpha ? colorHsbToRgba(scope.hsbColor) : colorRgbaToHex(colorHsbToRgba(scope.hsbColor));
    scope.render(el, scope.config);
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
    let open = function () {
        return expression ? ani.slideDown(scope.picker, 400) : ani.fadeIn(scope.picker, 400);
    }
    let close = function () {
        return expression ? ani.slideUp(scope.picker, 400) : ani.fadeOut(scope.picker, 400);
    }
    return scope.config.pickerFlag ? open() : close();
}
/**
 * 输入颜色的转换
 * @param {*} scope 
 * @param {*} value 
 */
function onInputColor(scope, value) {
    const color = colorRgbaToHsb(colorToRgb(value));
    if (!color.h && !color.s && !color.h && !color.a) return;
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
    scope.config.pickerFlag = !scope.config.pickerFlag;
    scope.render(el, scope.config);
}
/**
 * 确定
 * @param {*} scope 
 */
function onSureColor(scope) {
    scope.config.pickerFlag = false;
    openAndClose(scope);
    changeElementColor(scope);
    const result = scope.config.alpha ? colorHsbToRgba(scope.hsbColor) : colorRgbaToHex(colorHsbToRgba(scope.hsbColor));
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
    util.setCss(scope.box, 'background', color);
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
    if (context.box) context.box.style.background = context.pickerInput.value;
    let sliderBarHeight = 0;
    if (context.config.hue) {
        sliderBarHeight = context.hueBar.offsetHeight || 180;
        let ty = parseInt(context.hsbColor.h * sliderBarHeight / 360);
        util.setCss(context.hueThumb, 'top', ty + 'px');
    }
    let l = parseInt(context.hsbColor.s * panelWidth / 100),
        t = parseInt(panelHeight - context.hsbColor.b * panelHeight / 100);
    util.setCss(context.pickerCursor, 'left', l + 4 + 'px');
    util.setCss(context.pickerCursor, 'top', t + 4 + 'px');
    //颜色面板颜色
    util.setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsbToRgba(cloneColor(context.hsbColor))));
    //改变透明度
    if (context.config.alpha) {
        if (!context.config.hue) sliderBarHeight = context.alphaBar.offsetHeight || 180;
        const al_t = sliderBarHeight - context.hsbColor.a * sliderBarHeight;
        util.setCss(context.alphaBarThumb, 'top', al_t + 'px');
    }
}
//改变色调的方法
function changeHue(context, y) {
    const sliderBarHeight = context.hueBar.offsetHeight,
        sliderBarRect = context.hueBar.getBoundingClientRect();
    let sliderThumbY = Math.max(0, Math.min(y - sliderBarRect.y, sliderBarHeight));
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
    let alphaThumbY = Math.max(0, Math.min(y - alphaBarRect.y, alphaBarHeight));
    util.setCss(context.alphaBarThumb, 'top', alphaThumbY + 'px');
    const alpha = ((alphaBarHeight - alphaThumbY <= 0 ? 0 : alphaBarHeight - alphaThumbY) / alphaBarHeight);
    context.hsbColor.a = alpha >= 1 ? 1 : alpha.toFixed(2);
    changeElementColor(context, true);
}
if (!window.ewColorPicker) {
    window.ewColorPicker = ewColorPicker;
}
export default ewColorPicker;