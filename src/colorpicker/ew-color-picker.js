import { eventType, isDeepObject, ewError, getDom, isStr, isDom, createElement, addClass, clone,deepCloneObjByJSON } from '../util/util'
import { colorHexToRgba, colorRgbaToHex, colorHsbaToRgba } from './color'
import style from './css';
import ani from './animation';

function getELByClass(prop) {
    if (document.querySelector) {
        return document.querySelector('.' + prop);
    } else {
        return document.getElementsByClassName(prop)[0];
    }
}
function setCss(el, prop, value) {
    el.style[prop] = value;
}
function openPicker(scope) {
    scope.pickerFlag = !scope.pickerFlag;
    scope.config.defaultColor = colorRgbaToHex(colorHsbaToRgba(scope.hsba));
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
function changeElementColor(scope){
    setCss(scope.box, 'background', colorHsbaToRgba(scope.hsba));
    setCss(scope.arrowRight, 'border-top-color', colorHsbaToRgba(scope.hsba));
    scope.pickerInput.value = colorRgbaToHex(colorHsbaToRgba(scope.hsba));
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
    const colorBox = config.defaultColor ? `<div class="ew-color-picker-arrow">
        <div class="ew-color-picker-arrow-left"></div>
        <div class="ew-color-picker-arrow-right"></div>
    </div>` : `<div class="ew-color-picker-no">X</div>`;
    const alphaBar = config.alpha ? `<div class="ew-alpha-slider-bar">
    <div class="ew-alpha-slider-wrapper"></div>
    <div class="ew-alpha-slider-bg"></div>
    <div class="ew-alpha-slider-thumb"></div>
    </div>` : '';
    let html = `<div class="ew-color-picker-box" tabindex="0" style="background:${config.defaultColor}">
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
            </div>`;
    config.el.innerHTML = html;
    this.startMain(config);
}
ewColorPicker.prototype.startMain = function (config) {
    let scope = this;
    this.box = getELByClass('ew-color-picker-box');
    this.arrowRight = getELByClass('ew-color-picker-arrow-right');
    this.pickerPanel = getELByClass('ew-color-panel');
    this.pickerCursor = getELByClass('ew-color-cursor');
    this.pickerInput = getELByClass('ew-color-input');
    this.pickerClear = getELByClass('ew-color-clear');
    this.pickerSure = getELByClass('ew-color-sure');
    this.hueBar = getELByClass('ew-color-slider-bar');
    this.hueThumb = getELByClass('ew-color-slider-thumb');
    this.picker = getELByClass('ew-color-picker');
    this.slider = getELByClass('ew-color-slider');
    this.pickerInput.value = config.defaultColor;
    const panelWidth = this.pickerPanel.offsetWidth;
    const panelHeight = this.pickerPanel.offsetHeight;
    const sliderBarHeight = this.hueBar.offsetHeight,
    sliderBarRect = this.hueBar.getBoundingClientRect();
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
    //
    if (config.openPickerAni.indexOf('height') > -1) {
        this.picker.style.display = 'none';
    } else {
        this.picker.style.opacity = 0;
    }
    if (!config.alpha) {
        this.slider.style.width = '14px';
        this.picker.style.minWidth = '300px';
    } else {
        this.alphaBar = getELByClass('ew-alpha-slider-bar');
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
    this.box.addEventListener('click', function () {
        openPicker(scope);
    }, false);
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
        context.moveX = eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientX : event.clientX - 16;
        context.moveY = eventType[0].indexOf('touch') > -1 ? event.changedTouches[0].clientY : event.clientY - 16;
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