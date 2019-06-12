import { eventType, isDeepObject, ewError, getDom, isStr, isDom, createElement, addClass, clone,deepCloneObjByJSON,isFunction,isNumber,isDeepArray, getCss } from '../util/util'
import { colorHexToRgba, colorRgbaToHex, colorHsbaToRgba } from './color'
import style from './css';
import ani from './animation';

function getELByClass(el,prop) {
    if (document.querySelector) {
        return el.querySelector('.' + prop);
    } else {
        return el.getElementsByClassName(prop)[0];
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
function onInputColor(scope) {
    console.log(scope)
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
    scope.config.sure(scope);
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
function changeElementColor(scope,isAlpha){
    setCss(scope.box, 'background', colorHsbaToRgba(scope.hsba));
    setCss(scope.arrowRight, 'border-top-color', colorHsbaToRgba(scope.hsba));
    if(isAlpha || scope.config.alpha){
        scope.pickerInput.value = colorHsbaToRgba(scope.hsba);
    }else{
        scope.pickerInput.value = colorRgbaToHex(colorHsbaToRgba(scope.hsba));
    }
}
function resetElementColor(scope,color){
    setCss(scope.box, 'background', color);
    setCss(scope.arrowRight, 'border-top-color', color);
    scope.pickerInput.value = "";
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
            sure:function(){
                
            },
            clear:function(){
                
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
    } else if (isDeepObject(config) && (isStr(config.el) || isDom(config.el))) {
        const el = isDom(config.el) ? config.el : getDom(config.el);
        this.config = {
            hue: config.hue || true,
            alpha: config.alpha || true,
            size: config.size || "normal",
            predefineColor: config.predefineColor || [],
            disabled: config.disabled || false,
            defaultColor: config.defaultColor || "",
            openPickerAni:config.openPickerAni || "height",
            sure:isFunction(config.sure) ? config.sure : null,
            clear:isFunction(config.clear) ? config.clear : null
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
    this.render(config);
    document.getElementsByTagName('head')[0].appendChild(style);
}
ewColorPicker.prototype.render = function (config) {
    let b_width,b_height,predefineColorHTML = '';
    if(isStr(config.size)){
        switch(config.size){
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
    }else if(isDeepObject(config.size)){
        if(config.size.width && isNumber(config.size.width)){
            b_width = config.size.width + 'px';
        }else if(config.size.height && isNumber(config.size.height)){
            b_height = config.size.height + 'px';
        }else{
            b_width = b_height = '40px';
        }
    }else{
        return ewError('the value must be a string which is one of the normal,medium,small,mini,or must be an object and need to contain width or height property!')
    }
    if(isDeepArray(config.predefineColor) && config.predefineColor.length){
        config.predefineColor.map((color) => {
            predefineColorHTML += `<div class="ew-pre-define-color" style="background:${ color };"></div>`
        })
    }
    const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow">
        <div class="ew-color-picker-arrow-left"></div>
        <div class="ew-color-picker-arrow-right"></div>
    </div>` : `<div class="ew-color-picker-no">X</div>`;
    const alphaBar = config.alpha ? `<div class="ew-alpha-slider-bar">
    <div class="ew-alpha-slider-wrapper"></div>
    <div class="ew-alpha-slider-bg"></div>
    <div class="ew-alpha-slider-thumb"></div>
    </div>` : '';
    let html = `<div class="ew-color-picker-box ${ config.disabled ? 'ew-color-picker-box-disabled' : ''}" tabindex="0" style="background:${config.defaultColor};width:${ b_width };height:${ b_height }">
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
                        <div class="ew-color-cursor">
                            <div></div>
                        </div>
                    </div>
                </div>
                <div class="ew-color-dropbtns">
                    <input type="text" class="ew-color-input">
                    <div class="ew-color-dropbtngroup">
                        <button class="ew-color-clear ew-color-dropbtn">清空</button>
                        <button class="ew-color-sure ew-color-dropbtn">确定</button>
                    </div>
                </div>
                <div class="ew-pre-define-color-container">
                    ${ predefineColorHTML }
                </div>
            </div>`;
    config.el.innerHTML = html;
    this.startMain(config);
}
ewColorPicker.prototype.startMain = function (config) {
    let scope = this;
    this.box = getELByClass(this.config.el,'ew-color-picker-box');
    this.arrowRight = getELByClass(this.config.el,'ew-color-picker-arrow-right');
    this.pickerPanel = getELByClass(this.config.el,'ew-color-panel');
    this.pickerCursor = getELByClass(this.config.el,'ew-color-cursor');
    this.pickerInput = getELByClass(this.config.el,'ew-color-input');
    this.pickerClear = getELByClass(this.config.el,'ew-color-clear');
    this.pickerSure = getELByClass(this.config.el,'ew-color-sure');
    this.hueBar = getELByClass(this.config.el,'ew-color-slider-bar');
    this.hueThumb = getELByClass(this.config.el,'ew-color-slider-thumb');
    this.picker = getELByClass(this.config.el,'ew-color-picker');
    this.slider = getELByClass(this.config.el,'ew-color-slider');
    this.pickerInput.value = config.defaultColor;
    const panelWidth = parseInt(getCss(this.pickerPanel,'width'));
    const panelHeight = parseInt(getCss(this.pickerPanel,'height'));
    const sliderBarHeight = parseInt(getCss(this.hueBar,'height')),
    sliderBarRect = this.hueBar.getBoundingClientRect();
    if (config.openPickerAni.indexOf('height') > -1) {
        this.picker.style.display = 'none';
    } else {
        this.picker.style.opacity = 0;
    }
    if (this.config.defaultColor) {
        setCss(this.arrowRight, 'border-top-color', colorHsbaToRgba(this.hsba));
        let l = parseInt(this.hsba.s * panelWidth / 100),
            t = parseInt(panelHeight - this.hsba.b * panelHeight / 100),
            ty = parseInt(this.hsba.h * sliderBarHeight / 360);
        setCss(this.pickerCursor, 'left', l + 'px');
        setCss(this.pickerCursor, 'top', t + 'px');
        setCss(this.hueThumb,'top',ty + 'px');
        const _hsba = deepCloneObjByJSON(this.hsba);
        _hsba.s = _hsba.b = 100;
        setCss(this.pickerPanel,'background',colorRgbaToHex(colorHsbaToRgba(_hsba)));
    } else {
        this.hsba = {
            h: 0,
            s: 100,
            b: 100,
            a: 1
        }
    }
    if (!config.alpha) {
        this.slider.style.width = '14px';
        this.picker.style.minWidth = '300px';
    } else {
        this.alphaBar = getELByClass(this.config.el,'ew-alpha-slider-bar');
        this.alphaBarBg = getELByClass(this.config.el,'ew-alpha-slider-bg');
        this.alphaBarThumb = getELByClass(this.config.el,'ew-alpha-slider-thumb');
        const _hsba = deepCloneObjByJSON(this.hsba);
        _hsba.s = _hsba.b = 100;
        setCss(this.alphaBarBg,'background','linear-gradient(to top,'+ colorHsbaToRgba(_hsba,0)+' 0%,'+ colorHsbaToRgba(_hsba) +' 100%)')
        this.bindEvent(this.alphaBarThumb,function(scope,el,x,y){
            let alphathumbY = Math.max(0, Math.min(y - sliderBarRect.y, sliderBarHeight));
            setCss(scope.alphaBarThumb,'top',alphathumbY + 'px');
            const alpha = ((sliderBarHeight - alphathumbY <= 0 ? 0 : sliderBarHeight - alphathumbY) / sliderBarHeight);
            scope.hsba.a =  alpha >= 1 ? 1 : alpha.toFixed(2);
            changeElementColor(scope,true);
        },false)
    }
    this.pickerInput.addEventListener('input', function () {
        onInputColor(scope);
    }, false);
    this.pickerClear.addEventListener('click', function () {
        onClearColor(scope);
    }, false);
    this.pickerSure.addEventListener('click', function () {
        onSureColor(scope);
    })
    if(!config.disabled){
        this.box.addEventListener('click', function () {
            openPicker(scope);
        }, false);
    }
    this.pickerPanel.addEventListener('click', function (event) {
        onClickPanel(scope, event);
    }, false)
    this.bindEvent(this.pickerCursor, function (scope, el, x, y) {
        const left = x >= panelWidth - 1 ? panelWidth : x <= 0 ? 0 : x;
        const top = y >= panelHeight - 2 ? panelHeight : y <= 0 ? 0 : y;
        changeCursorColor(scope, left, top, panelWidth, panelHeight)
    }, false);
    this.bindEvent(this.hueThumb,function(scope,el,x,y){
        let sliderthumbY = Math.max(0, Math.min(y - sliderBarRect.y, sliderBarHeight));
        setCss(el,'top',sliderthumbY + 'px');
        let _hsba = deepCloneObjByJSON(scope.hsba);
        _hsba.s = 100;
        _hsba.b = 100;
        scope.hsba.h = _hsba.h = parseInt(360 * sliderthumbY / sliderBarHeight);
        setCss(scope.pickerPanel,'background',colorRgbaToHex(colorHsbaToRgba(_hsba)));
        changeElementColor(scope);
    },false)
}
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
            document.removeEventListener(eventType[1], movefn, false);
            document.removeEventListener(eventType[2], upfn, false);
        }
        document.addEventListener(eventType[1], movefn, false);
        document.addEventListener(eventType[2], upfn, false);
    }, false)
}
export default ewColorPicker;