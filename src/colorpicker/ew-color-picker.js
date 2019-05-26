import { eventType, isDeepObject, ewError, getDom, isStr, isDom, createElement, addClass, clone } from '../util/util'
import style from './css';
import ani from './animation';

function getELByClass(prop) {
    if (document.querySelector) {
        return document.querySelector('.' + prop);
    } else {
        return document.getElementsByClassName(prop)[0];
    }
}
function openPicker(scope) {
    scope.pickerFlag = !scope.pickerFlag;
    scope.config.defaultColor = '#ff0000';
    if(scope.pickerFlag)scope.render(scope.config);
    openAndClose(scope);
}
function openAndClose(scope){
    if(scope.config.openPickerAni.indexOf('height') > -1){
        if(scope.pickerFlag){
            ani.slideDown(scope.picker,400);
        }else{
            ani.slideUp(scope.picker,400);
        }
    }else{
        if(scope.pickerFlag){
            ani.fadeIn(scope.picker,400);
        }else{
            ani.fadeOut(scope.picker,400);
        }
    }
}
function onInputColor(scope){
    console.log(scope)
}
function onClearColor(scope){
    scope.config.defaultColor = '';
    scope.pickerFlag = !scope.pickerFlag;
    scope.render(scope.config);
    openAndClose(scope);
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
            openPickerAni:"height"
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
    let html = `<div class="ew-color-picker-box ew-color-picker-box-default" tabindex="0" style="background:${ config.defaultColor }">
                ${ colorBox }
            </div>
            <div class="ew-color-picker">
                <div class="ew-color-picker-content">
                    <div class="ew-color-slider">
                        <div class="ew-alpha-slider-bar">
                            <div class="ew-alpha-slider-wrapper"></div>
                            <div class="ew-alpha-slider-bg"></div>
                            <div class="ew-alpha-slider-thumb"></div>
                        </div>
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
            </div>`;
    config.el.innerHTML = html;
    this.startMain(config);
}
ewColorPicker.prototype.startMain = function(config){
    let scope = this;
    this.box = getELByClass('ew-color-picker-box');
    //
    this.picker = getELByClass('ew-color-picker');
    if(config.openPickerAni.indexOf('height') > -1){
        this.picker.style.display = 'none';
    }else{
        this.picker.style.opacity = 0;
    }
    this.alpha = getELByClass('ew-alpha-slider-bar');
    this.slider = getELByClass('ew-color-slider');
    if(!config.alpha){
        this.alpha.style.display = 'none';
        this.slider.style.width = '14px';
        this.picker.style.minWidth='300px';
    }else{
        this.alpha.style.display = 'block';
    }
    this.pickerPanel = getELByClass('ew-color-panel');
    this.pickerCursor = getELByClass('ew-color-cursor');
    this.pickerInput = getELByClass('ew-color-input');
    this.pickerClear = getELByClass('ew-color-clear');
    this.pickerSure = getELByClass('ew-color-sure');
    this.hueBar = getELByClass('ew-color-slider-thumb');
    this.pickerInput.value = config.defaultColor;
    this.pickerInput.addEventListener('input',function(){
        onInputColor(scope);
    },false);
    this.pickerClear.addEventListener('click',function(){
        onClearColor(scope);
    },false);
    this.box.addEventListener('click', function(){
        openPicker(scope);
    }, false);
}
ewColorPicker.prototype.createStyle = function (style) {
    let styleElement = createElement(style);
    styleElement.textContent = style;
    return styleElement;
}
ewColorPicker.prototype.bindEvent = function (el, callback, bool) {
    let context = this;
    const callResult = function (event) {
        context.moveX = event.clientX || event.changedTouches[0].clientX;
        context.moveY = event.clientY || event.changedTouches[0].clientY;
        bool ? callback(context, context.moveX, context.moveY) : callback(context, el, context.moveX, context.moveY);
    }
    el.addEventListener(eventType[0], function (ev) {
        callResult(ev);
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