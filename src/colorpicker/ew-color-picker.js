import { eventType, isDeepObject, ewError, getDom, isStr, isDom, addClass, removeClass, deepCloneObjByJSON, isFunction, isNumber, isDeepArray, getCss, ewObjToArray } from '../util/util'
import { colorToRgb, colorRgbaToHex, colorHsbaToRgba, colorRgbaToHsba } from './color'
import style from './css';
import ani from './animation';

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
function setCss(el, prop, value) {
    el.style[prop] = value;
}
function openPicker(scope) {
    scope.pickerFlag = !scope.pickerFlag;
    scope.config.defaultColor = scope.config.alpha ? colorHsbaToRgba(scope.hsba) : colorRgbaToHex(colorHsbaToRgba(scope.hsba));
    if (scope.pickerFlag) scope.render(scope.config);
    openAndClose(scope);
    setDefaultValue(scope,scope.panelWidth,scope.panelHeight);
}
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
function onInputColor(scope,value) {
    const color = colorRgbaToHsba(colorToRgb(value));
    if(!color.h && !color.s && !color.h && !color.a)return;
    scope.hsba = color;
    setDefaultValue(scope,scope.panelWidth,scope.panelHeight);
    changeElementColor(scope)
}
function onClearColor(scope) {
    scope.config.defaultColor = '';
    scope.pickerFlag = !scope.pickerFlag;
    scope.render(scope.config);
    openAndClose(scope);
    scope.config.clear(scope);
}
function onSureColor(scope) {
    scope.pickerFlag = false;
    openAndClose(scope);
    changeElementColor(scope);
    const result = scope.config.alpha ? colorHsbaToRgba(scope.hsba) : colorRgbaToHex(colorHsbaToRgba(scope.hsba));
    scope.config.sure(result,scope);
}
function changeCursorColor(scope, left, top, panelWidth, panelHeight) {
    setCss(scope.pickerCursor, 'left', left + 'px');
    setCss(scope.pickerCursor, 'top', top + 'px');
    const s = parseInt(100 * left / panelWidth);
    const b = parseInt(100 * (panelHeight - top) / panelHeight);
    scope.hsba.s = s > 100 ? 100 : s < 0 ? 0 : s;
    scope.hsba.b = b > 100 ? 100 : b < 0 ? 0 : b;
    changeElementColor(scope);
}
function changeElementColor(scope, isAlpha) {
    setCss(scope.box, 'background', colorHsbaToRgba(scope.hsba));
    setCss(scope.arrowRight, 'border-top-color', colorHsbaToRgba(scope.hsba));
    if (isAlpha || scope.config.alpha) {
        scope.pickerInput.value = colorHsbaToRgba(scope.hsba);
    } else {
        scope.pickerInput.value = colorRgbaToHex(colorHsbaToRgba(scope.hsba));
    }
}
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
function ewColorPicker(config) {
    this.pickerFlag = false;
    //如果第二个参数传的是字符串，或DOM对象，则初始化默认的配置
    if (isStr(config) || isDom(config)) {
        let el = isDom(config) ? config : getDom(config);
        this.config = {
            hue: true,
            alpha: false,
            size: "normal",
            predefineColor: [],
            disabled: false,
            defaultColor: "",
            openPickerAni: "height",
            sure: function () {

            },
            clear: function () {

            }
        }
        if (el.length) {
            let i = 0;
            while (i < el.length) {
                this.config.el = el[i];
                this.init(this.config);
                i++;
            }
        } else {
            this.config.el = el;
            this.init(this.config);
        }
    } //如果是对象，则自定义配置，自定义配置选项如下:
    else if (isDeepObject(config) && (isStr(config.el) || isDom(config.el))) {
        const el = isDom(config.el) ? config.el : getDom(config.el);
        this.config = {
            hue: config.hue || true,
            alpha: config.alpha || false,
            size: config.size || "normal",
            predefineColor: config.predefineColor || [],
            disabled: config.disabled || false,
            defaultColor: config.defaultColor || "",
            openPickerAni: config.openPickerAni || "height",
            sure: isFunction(config.sure) ? config.sure : null,
            clear: isFunction(config.clear) ? config.clear : null
        }
        if (el.length) {
            let i = 0;
            while (i < el.length) {
                this.config.el = el[i];
                this.init(this.config);
                i++;
            }
        } else {
            this.config.el = el;
            this.init(this.config);
        }
    } else {
        if (isDeepObject(config)) {
            return ewError('you should pass a param which is el and el must be a string or a dom element!')
        } else {
            return ewError('you should pass a param that it must be a string or a dom element!')
        }
    }
    return config;
}
ewColorPicker.prototype.init = function (config) {
    //渲染选择器
    this.render(config);
    //添加样式
    document.getElementsByTagName('head')[0].appendChild(style);
}
ewColorPicker.prototype.render = function (config) {
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
        }
    } else if (isDeepObject(config.size)) {
        b_width = config.size.width && isNumber(config.size.width) ? config.size.width + 'px' : isStr(config.size.width) ? parseInt(config.size.width) + 'px' : '40px';
        b_height = config.size.height && isNumber(config.size.height) ? config.size.height + 'px' : isStr(config.size.height) ? parseInt(config.size.height) : '40px';
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
    const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow">
        <div class="ew-color-picker-arrow-left"></div>
        <div class="ew-color-picker-arrow-right"></div>
    </div>` : `<div class="ew-color-picker-no">X</div>`;
    //透明度
    const alphaBar = config.alpha ? `<div class="ew-alpha-slider-bar">
    <div class="ew-alpha-slider-wrapper"></div>
    <div class="ew-alpha-slider-bg"></div>
    <div class="ew-alpha-slider-thumb"></div>
    </div>` : '';
    //自定义颜色
    const predefineHTML = predefineColorHTML ? `<div class="ew-pre-define-color-container">${predefineColorHTML}</div>` : '';
    //颜色选择器
    let html = `<div class="ew-color-picker-box ${config.disabled ? 'ew-color-picker-box-disabled' : ''}" tabindex="0" style="background:${config.defaultColor};width:${b_width};height:${b_height}">
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
    config.el.innerHTML = html;
    this.startMain(config);
}
ewColorPicker.prototype.startMain = function (config) {
    let scope = this;
    //获取颜色选择器的一些操作元素
    this.box = getELByClass(this.config.el, 'ew-color-picker-box');
    this.arrowRight = getELByClass(this.config.el, 'ew-color-picker-arrow-right');
    this.pickerPanel = getELByClass(this.config.el, 'ew-color-panel');
    this.pickerCursor = getELByClass(this.config.el, 'ew-color-cursor');
    this.pickerInput = getELByClass(this.config.el, 'ew-color-input');
    this.pickerClear = getELByClass(this.config.el, 'ew-color-clear');
    this.pickerSure = getELByClass(this.config.el, 'ew-color-sure');
    this.hueBar = getELByClass(this.config.el, 'ew-color-slider-bar');
    this.hueThumb = getELByClass(this.config.el, 'ew-color-slider-thumb');
    this.picker = getELByClass(this.config.el, 'ew-color-picker');
    this.slider = getELByClass(this.config.el, 'ew-color-slider');
    this.hsba = this.config.defaultColor ? colorRgbaToHsba(colorToRgb(this.config.defaultColor)) : {
        h: 0,
        s: 100,
        b: 100,
        a: 1
    };
    const panelWidth = this.panelWidth = parseInt(getCss(this.pickerPanel, 'width'));
    const panelHeight = this.panelHeight = parseInt(getCss(this.pickerPanel, 'height'));
    //计算偏差
    var elem = config.el;
    var top = elem.offsetTop;
    var left = elem.offsetLeft;
    while (elem.offsetParent) {
        top += elem.offsetParent.offsetTop;
        left += elem.offsetParent.offsetLeft;
        elem = elem.offsetParent;
    }
    this.pancelLeft = left;
    this.pancelTop = top + config.el.offsetHeight;
    //预定义颜色
    this.preDefineItem = getELByClass(this.config.el, 'ew-pre-define-color', true);
    if (this.preDefineItem.length) {
        //点击预定义颜色
        ewObjToArray(this.preDefineItem).map((item) => {
            item.addEventListener('click', function (event) {
                ewObjToArray(this.parentElement.children).forEach((child) => {
                    removeClass(child,'ew-pre-define-color-active')
                })
                addClass(event.target,'ew-pre-define-color-active');
                let pColor = colorRgbaToHsba(getCss(event.target, 'background-color'));
                scope.hsba = pColor;
                changeElementColor(scope);
                changeAlphaBar(scope);
                setDefaultValue(scope,panelWidth,panelHeight);
            }, false)
            item.addEventListener('blur', function (event) {
                removeClass(event.target,'ew-pre-define-color-active')
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
        this.alphaBar = getELByClass(this.config.el, 'ew-alpha-slider-bar');
        this.alphaBarBg = getELByClass(this.config.el, 'ew-alpha-slider-bg');
        this.alphaBarThumb = getELByClass(this.config.el, 'ew-alpha-slider-thumb');
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
        onInputColor(scope,event.target.value);
    }, false);
    //清空按钮事件
    this.pickerClear.addEventListener('click', function () {
        onClearColor(scope);
    }, false);
    //确认按钮事件
    this.pickerSure.addEventListener('click', function () {
        onSureColor(scope);
    })
    //是否禁止打开选择器面板，未禁止则点击可打开
    if (!config.disabled) {
        this.box.addEventListener('click', function () {
            openPicker(scope);
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
function changeAlphaBar(scope){
    const _hsba = deepCloneObjByJSON(scope.hsba);
    _hsba.s = _hsba.b = 100;
    setCss(scope.alphaBarBg, 'background', 'linear-gradient(to top,' + colorHsbaToRgba(_hsba, 0) + ' 0%,' + colorHsbaToRgba(_hsba) + ' 100%)')
}
function setDefaultValue(context,panelWidth,panelHeight){
    context.pickerInput.value = context.config.alpha ? colorHsbaToRgba(context.hsba) : colorRgbaToHex(colorHsbaToRgba(context.hsba));
    if(context.arrowRight){
        setCss(context.arrowRight, 'border-top-color', colorHsbaToRgba(context.hsba));
    }
    const sliderBarHeight = context.hueBar.offsetHeight || 180;
    let l = parseInt(context.hsba.s * panelWidth / 100),
        t = parseInt(panelHeight - context.hsba.b * panelHeight / 100),
        ty = parseInt(context.hsba.h * sliderBarHeight / 360);
    setCss(context.pickerCursor, 'left', l + 4 + 'px');
    setCss(context.pickerCursor, 'top', t + 4 + 'px');
    setCss(context.hueThumb, 'top', ty + 'px');
    //颜色面板颜色
    const _hsba = deepCloneObjByJSON(context.hsba);
    _hsba.s = _hsba.b = 100;
    setCss(context.pickerPanel, 'background', colorRgbaToHex(colorHsbaToRgba(_hsba)));
    //改变透明度
    if(context.config.alpha){
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
    let _hsba = deepCloneObjByJSON(context.hsba);
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
//事件的绑定
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
            document.removeEventListener(eventType[1], movefn, { capture:false,once:false,passive:false,useCapture:false,wantsUntrusted:false});
            document.removeEventListener(eventType[2], upfn, { capture:false,once:false,passive:false,useCapture:false,wantsUntrusted:false});
        }
        document.addEventListener(eventType[1], movefn, { capture:false,once:false,passive:false,useCapture:false,wantsUntrusted:false});
        document.addEventListener(eventType[2], upfn, { capture:false,once:false,passive:false,useCapture:false,wantsUntrusted:false});
    },{ capture:false,once:false,passive:false,useCapture:false,wantsUntrusted:false})
}
export default ewColorPicker;