import { eventType, isDeepObject, ewError, getDom, isStr, isDom, addClass, removeClass, deepCloneObjByRecursion, isFunction, isNumber, isDeepArray, getCss, ewObjToArray, ewAssign } from './util'
import { colorToRgb, colorRgbaToHex, colorHsbaToRgba, colorRgbaToHsba } from './color'
import ani from './animation';
import { consoleInfo } from './console';
import './color-picker.css';

/**
 * 获取元素的子元素
 * @param {*} el 
 * @param {*} prop 
 * @param {*} isIndex 
 */
function getELByClass(el, prop, isIndex) {
    if (!isIndex) {
        if (document.querySelector) {
            return el.querySelector('.' + prop);
        } else {
            return el.getElementsByClassName(prop)[0];
        }
    } else {
        if (document.querySelectorAll) {
            return el.querySelectorAll('.' + prop);
        } else {
            return el.getElementsByClassName(prop);
        }
    }
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
    if (scope.pickerFlag) scope.render(el, scope.config);
    openAndClose(scope);
    setDefaultValue(scope, scope.panelWidth, scope.panelHeight);
    if (isFunction(scope.config.openPicker)) scope.config.openPicker(el, scope);
}
/**
 * 打开和关闭
 * @param {*} scope 
 */
function openAndClose(scope) {
    if (scope.config.openPickerAni.indexOf('height') > -1) {
        if (scope.pickerFlag) {
            ani.slideDown(scope.picker, 400);
        } else {
            ani.slideUp(scope.picker, 400);
        }
    } else {
        if (scope.pickerFlag) {
            ani.fadeIn(scope.picker, 400);
        } else {
            ani.fadeOut(scope.picker, 400);
        }
    }
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
    scope.config.defaultColor = '';
    scope.pickerFlag = !scope.pickerFlag;
    scope.render(el, scope.config);
    openAndClose(scope);
    scope.config.clear(scope.config.defaultColor, scope);
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
    scope.hsba.s = (s + 4) > 100 ? 100 : (s - 4) < 0 ? 0 : s;
    scope.hsba.b = (b + 4) > 100 ? 100 : (b - 4) < 0 ? 0 : b;
    changeElementColor(scope);
}
/**
 * 改变元素的颜色
 * @param {*} scope 
 * @param {*} isAlpha 
 */
function changeElementColor(scope, isAlpha) {
    setCss(scope.box, 'background', colorHsbaToRgba(scope.hsba));
    setCss(scope.arrowRight, 'border-top-color', colorHsbaToRgba(scope.hsba));
    if (isAlpha || scope.config.alpha) {
        scope.pickerInput.value = colorHsbaToRgba(scope.hsba);
    } else {
        scope.pickerInput.value = colorRgbaToHex(colorHsbaToRgba(scope.hsba));
    }
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
        changeCursorColor(scope, left, top, panelWidth, panelHeight)
    }
}
/**
 * 改变透明度
 * @param {*} scope 
 */
function changeAlphaBar(scope) {
    const _hsba = deepCloneObjByRecursion(scope.hsba);
    _hsba.s = _hsba.b = 100;
    if (!scope.alphaBarBg) return;
    setCss(scope.alphaBarBg, 'background', 'linear-gradient(to top,' + colorHsbaToRgba(_hsba, 0) + ' 0%,' + colorHsbaToRgba(_hsba) + ' 100%)')
}
/**
 * 设置默认颜色
 * @param {*} context 
 * @param {*} panelWidth 
 * @param {*} panelHeight 
 */
function setDefaultValue(context, panelWidth, panelHeight) {
    context.pickerInput.value = context.config.alpha ? colorHsbaToRgba(context.hsba) : colorRgbaToHex(colorHsbaToRgba(context.hsba));
    if (context.arrowRight) {
        setCss(context.arrowRight, 'border-top-color', colorHsbaToRgba(context.hsba));
    }
    if(context.config.defaultColor){
        context.box.style.background = context.config.defaultColor;
    }
    const sliderBarHeight = context.hueBar.offsetHeight || 180;
    let l = parseInt(context.hsba.s * panelWidth / 100),
        t = parseInt(panelHeight - context.hsba.b * panelHeight / 100),
        ty = parseInt(context.hsba.h * sliderBarHeight / 360);
    setCss(context.pickerCursor, 'left', l + 4 + 'px');
    setCss(context.pickerCursor, 'top', t + 4 + 'px');
    setCss(context.hueThumb, 'top', ty + 'px');
    //颜色面板颜色
    const _hsba = deepCloneObjByRecursion(context.hsba);
    _hsba.s = _hsba.b = 100;
    setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsbaToRgba(_hsba)));
    //改变透明度
    if (context.config.alpha) {
        const al_t = sliderBarHeight - context.hsba.a * sliderBarHeight;
        setCss(context.alphaBarThumb, 'top', al_t + 'px');
    }
}
//改变色调的方法
function changeHue(context, y) {
    const sliderBarHeight = context.hueBar.offsetHeight,
        sliderBarRect = context.hueBar.getBoundingClientRect();
    let sliderthumbY = Math.max(0, Math.min(y - sliderBarRect.y, sliderBarHeight));
    setCss(context.hueThumb, 'top', sliderthumbY + 'px');
    let _hsba = deepCloneObjByRecursion(context.hsba);
    _hsba.s = 100;
    _hsba.b = 100;
    context.hsba.h = _hsba.h = parseInt(360 * sliderthumbY / sliderBarHeight);
    setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsbaToRgba(_hsba)));
    changeElementColor(context);
    changeAlphaBar(context);
}
//改变透明度的方法
function changeAlpha(context, y) {
    const alphaBarHeight = context.hueBar.offsetHeight,
        alphaBarRect = context.hueBar.getBoundingClientRect();
    let alphathumbY = Math.max(0, Math.min(y - alphaBarRect.y, alphaBarHeight));
    setCss(context.alphaBarThumb, 'top', alphathumbY + 'px');
    const alpha = ((alphaBarHeight - alphathumbY <= 0 ? 0 : alphaBarHeight - alphathumbY) / alphaBarHeight);
    context.hsba.a = alpha >= 1 ? 1 : alpha.toFixed(2);
    changeElementColor(context, true);
}
/**
 * 构造函数
 * @param {*} config 
 */
function ewColorPicker(config) {
    this.pickerFlag = false;
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
    //如果第二个参数传的是字符串，或DOM对象，则初始化默认的配置
    if (isStr(config) || isDom(config)) {
        let el = isDom(config) ? config : getDom(config);
        this.config = defaultConfig;
        if (el.length) {
            let i = -1;
            while (++i < el.length) {
                this.init(el[i], this.config);
            }
        } else {
            this.init(el, this.config);
        }
    } //如果是对象，则自定义配置，自定义配置选项如下:
    else if (isDeepObject(config) && (isStr(config.el) || isDom(config.el))) {
        const el = isDom(config.el) ? config.el : getDom(config.el);
        this.config = ewAssign(defaultConfig, config);
        if (el.length) {
            let i = 0;
            while (i < el.length) {
                this.init(el[i], this.config);
                i++;
            }
        } else {
            this.init(el, this.config);
        }
    } else {
        if (isDeepObject(config)) {
            return ewError('you should pass a param which is el and el must be a string or a dom element!');
        } else {
            return ewError('you should pass a param that it must be a string or a dom element!');
        }
    }
    return this;
}
ewColorPicker.prototype.init = function (bindElement, config) {
    if (config.isLog) consoleInfo();
    //渲染选择器
    this.render(bindElement, config);
}
ewColorPicker.prototype.render = function (element, config) {
    let b_width, b_height, predefineColorHTML = '';
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
        return ewError('the value must be a string which is one of the normal,medium,small,mini,or must be an object and need to contain width or height property!')
    }
    //设置预定义颜色
    if (isDeepArray(config.predefineColor) && config.predefineColor.length) {
        config.predefineColor.map((color) => {
            predefineColorHTML += `<div class="ew-pre-define-color" style="background:${color};" tabIndex=0></div>`
        })
    }
    //打开颜色选择器的方框
    const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow" style="width:${b_width};height:${b_height};">
        <div class="ew-color-picker-arrow-left"></div>
        <div class="ew-color-picker-arrow-right" style="border-top-color:${ config.defaultColor}"></div>
    </div>` : `<div class="ew-color-picker-no" style="width:${b_width};height:${b_height};line-height:${b_height};">X</div>`;
    //透明度
    const alphaBar = config.alpha ? `<div class="ew-alpha-slider-bar">
    <div class="ew-alpha-slider-wrapper"></div>
    <div class="ew-alpha-slider-bg"></div>
    <div class="ew-alpha-slider-thumb"></div>
    </div>` : '';
    //自定义颜色
    const predefineHTML = predefineColorHTML ? `<div class="ew-pre-define-color-container">${predefineColorHTML}</div>` : '';
    //颜色选择器
    let html = `<div class="ew-color-picker-box${config.disabled ? ' ew-color-picker-box-disabled' : ''}" tabindex="0" style="width:${b_width};height:${b_height};${ config.defaultColor ? 'background:' + config.defaultColor : ''}">
                ${ colorBox}
            </div>
            <div class="ew-color-picker">
                <div class="ew-color-picker-content">
                    <div class="ew-color-slider">
                        ${alphaBar}
                        <div class="ew-color-slider-bar">
                            <div class="ew-color-slider-thumb"></div>
                        </div>
                    </div>
                    <div class="ew-color-panel" style="background:red;">
                        <div class="ew-color-white-panel"></div>
                        <div class="ew-color-black-panel"></div>
                        <div class="ew-color-cursor"></div>
                    </div>
                </div>
                <div class="ew-color-dropbtns">
                    <input type="text" class="ew-color-input">
                    <div class="ew-color-dropbtngroup">
                        <button class="ew-color-clear ew-color-dropbtn">清空</button>
                        <button class="ew-color-sure ew-color-dropbtn">确定</button>
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
    this.pancelLeft = left;
    this.pancelTop = top + ele.offsetHeight;
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
    //是否开启透明度
    if (!config.alpha) {
        this.slider.style.width = '14px';
        this.picker.style.minWidth = '300px';
    } else {
        this.alphaBar = getELByClass(ele, 'ew-alpha-slider-bar');
        this.alphaBarBg = getELByClass(ele, 'ew-alpha-slider-bg');
        this.alphaBarThumb = getELByClass(ele, 'ew-alpha-slider-thumb');
        changeAlphaBar(this)
        this.bindEvent(this.alphaBarThumb, function (scope, el, x, y) {
            changeAlpha(scope, y)
        }, false);
        this.alphaBar.addEventListener('click', function (event) {
            changeAlpha(scope, event.y)
        }, false)
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
    })
    //是否禁止打开选择器面板，未禁止则点击可打开
    if (!config.disabled) {
        this.box.addEventListener('click', function () {
            openPicker(ele, scope);
        }, false);
    }
    //颜色面板点击事件
    this.pickerPanel.addEventListener('click', function (event) {
        onClickPanel(scope, event);
    }, false)
    //颜色面板拖拽元素拖拽事件
    this.bindEvent(this.pickerCursor, function (scope, el, x, y) {
        const left = Math.max(0, Math.min(x - scope.pancelLeft, panelWidth));
        const top = Math.max(0, Math.min(y - scope.pancelTop, panelHeight));
        changeCursorColor(scope, left + 4, top + 4, panelWidth, panelHeight)
    }, false);
    //hue的点击事件
    this.hueBar.addEventListener('click', function (event) {
        changeHue(scope, event.y)
    }, false)
    //hue 轨道的拖拽事件
    this.bindEvent(this.hueThumb, function (scope, el, x, y) {
        changeHue(scope, y);
    }, false)
}
/**
 * 绑定事件
 */
ewColorPicker.prototype.bindEvent = function (el, callback, bool) {
    let context = this;
    const callResult = function (event) {
        context.moveX = eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientX : event.clientX;
        context.moveY = eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientY : event.clientY;
        bool ? callback(context, context.moveX, context.moveY) : callback(context, el, context.moveX, context.moveY);
    }
    el.addEventListener(eventType[0], function (ev) {
        const movefn = function (e) {
            e.preventDefault();
            callResult(e);
        }
        const upfn = function () {
            document.removeEventListener(eventType[1], movefn, { capture: false, once: false, passive: false, useCapture: false, wantsUntrusted: false });
            document.removeEventListener(eventType[2], upfn, { capture: false, once: false, passive: false, useCapture: false, wantsUntrusted: false });
        }
        document.addEventListener(eventType[1], movefn, { capture: false, once: false, passive: false, useCapture: false, wantsUntrusted: false });
        document.addEventListener(eventType[2], upfn, { capture: false, once: false, passive: false, useCapture: false, wantsUntrusted: false });
    }, { capture: false, once: false, passive: false, useCapture: false, wantsUntrusted: false })
}
if (!window.ewColorPicker) {
    window.ewColorPicker = ewColorPicker;
}
export default ewColorPicker;