import { setPredefineDisabled,hasAlpha } from '../layout/predefineColor';
import util from '../utils/util';
import { isValidColor,colorRegRGB,colorToRgba } from '../color/color';
import { ERROR_VARIABLE } from '../const/error';
import { Observer } from '../observe/proxy';
import RenderWatcher from './renderWatcher';
import { closeIcon,arrowIcon } from "../const/icon";
/**
 * 渲染
 * @param {*} element 
 * @param {*} config 
 * @returns 
 */
export function staticRender(element, config) {
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
        openChangeColorModeLabelHTML = '',
        horizontalSliderHTML = '',
        verticalSliderHTML = '';
    const p_c = config.predefineColor;
    // validate the predefineColor;
    if (!util.isDeepArray(p_c)){
        return util.ewError(ERROR_VARIABLE.PREDEFINE_COLOR_ERROR);
    }
    if (p_c.length) {
        p_c.forEach((color,index) => {
            const isValidColorString = util.isString(color) && isValidColor(color);
            const isValidColorObj = util.isDeepObject(color) && color.hasOwnProperty('color') && isValidColor(color.color);
            const renderColor = isValidColorString ? color : isValidColorObj ? color.color : '';
            let preColorClassObject = {
                "ew-pre-define-color":true,
                ...hasAlpha(renderColor)
            }
            if(isValidColorObj){
                preColorClassObject = util.ewAssign(preColorClassObject,setPredefineDisabled(color.disabled))
            }
            const preColorClassStr = util.classnames(preColorClassObject);
            predefineColorHTML += `
                <div class="${preColorClassStr}" tabindex=${index}>
                    <div class="ew-pre-define-color-item" style="background-color:${renderColor};"></div>
                </div>
            `;
        })
    };
    const { b_width,b_height } = this._privateConfig.boxSize;
    const boxArrowStyle = `width:${b_width};height:${b_height};`;
    const boxNoStyle = `${boxArrowStyle}line-height:${b_height};`;
    //打开颜色选择器的方框
    const colorBox = config.defaultColor ? 
    `<div class="ew-color-picker-arrow" style="${boxArrowStyle}">${ arrowIcon }</div>` : 
    `<div class="ew-color-picker-no" style="${boxNoStyle}">${ closeIcon }</div>`;
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
    if (config.disabled || config.boxDisabled){
        boxDisabledClassName = 'ew-color-picker-box-disabled';
    }
    if (config.defaultColor){
        if(!isValidColor(config.defaultColor)){
            return util.ewError(ERROR_VARIABLE.DEFAULT_COLOR_ERROR)
        }else{
            config.defaultColor = colorToRgba(config.defaultColor);
        }
    };
    this._privateConfig.colorValue = config.defaultColor;
    if (!config.disabled && this._privateConfig.colorValue){
        boxBackground = `background:${this._privateConfig.colorValue}`;
    }
    // 盒子样式
    const boxStyle = `${ boxArrowStyle };${boxBackground}`;
    if (config.hasBox) {
        boxHTML = `<div class="ew-color-picker-box ${boxDisabledClassName}" tabIndex="0" style="${boxStyle}">${colorBox}</div>`;
    }
    if (config.hasClear) {
        clearHTML = `<button class="ew-color-clear ew-color-drop-btn">${ config.clearText }</button>`;
    }
    if (config.hasSure) {
        sureHTML = `<button class="ew-color-sure ew-color-drop-btn">${ config.sureText }</button>`;
    }
    if (config.hasClear || config.hasSure) {
        btnGroupHTML = `<div class="ew-color-drop-btn-group">${clearHTML}${sureHTML}</div>`;
    }
    if (config.hasInput) {
        inputHTML = '<input type="text" class="ew-color-input">';
    }
    if (config.openChangeColorMode) {
        if (!config.alpha || !config.hue) return util.ewError(ERROR_VARIABLE.COLOR_MODE_ERROR);
        openChangeColorModeHTML = `<div class="ew-color-mode-container">
        <div class="ew-color-mode-up"></div>
        <div class="ew-color-mode-down"></div>
        </div>`;
        openChangeColorModeLabelHTML = `<label class="ew-color-mode-title">${this.colorMode[1]}</label>`;
    }
    if (config.hasInput || config.hasClear || config.hasSure) {
        dropHTML = config.openChangeColorMode ? `<div class="ew-color-drop-container ew-has-mode-container">
        ${openChangeColorModeLabelHTML}${inputHTML}${openChangeColorModeHTML}
        </div><div class="ew-color-drop-container">
        ${btnGroupHTML}
        </div>` : `<div class="ew-color-drop-container">
        ${inputHTML}${btnGroupHTML}
        </div>`;
    }
    this.isAlphaHorizontal = config.alphaDirection === 'horizontal';
    this.isHueHorizontal = config.hueDirection === 'horizontal';
    if(this.isAlphaHorizontal && this.isHueHorizontal){
        horizontalSliderHTML = hueBar + alphaBar;
    }else if(!this.isAlphaHorizontal && !this.isHueHorizontal){
        verticalSliderHTML = alphaBar + hueBar;
    }else{
        if(this.isHueHorizontal){
            horizontalSliderHTML = hueBar;
            verticalSliderHTML = alphaBar;
        } else{
            horizontalSliderHTML = alphaBar;
            verticalSliderHTML = hueBar;
        }
    }
    if(horizontalSliderHTML){
        horizontalSliderHTML = `<div class="ew-color-slider ew-is-horizontal">${ horizontalSliderHTML }</div>`
    }
    if(verticalSliderHTML){
        verticalSliderHTML = `<div class="ew-color-slider ew-is-vertical">${ verticalSliderHTML }</div>`;
    }
    //颜色选择器
    const html = `${boxHTML}
        <div class="ew-color-picker">
            <div class="ew-color-picker-content">
                <div class="ew-color-panel" style="background:red;">
                    <div class="ew-color-white-panel"></div>
                    <div class="ew-color-black-panel"></div>
                    <div class="ew-color-cursor"></div>
                </div>
                ${ verticalSliderHTML }
            </div>
            ${ horizontalSliderHTML }
            ${dropHTML}
            ${predefineHTML}
        </div>`;
    let isBody = element.tagName.toLowerCase() === 'body';
    let container = document.createElement('div');
    let mountElement = isBody ? container.cloneNode(true) : element;
    mountElement.setAttribute("color-picker-id",this._color_picker_uid);
    if (isBody) {
        mountElement.setAttribute("id",'placeElement-' + this._color_picker_uid);
        let hasDiv = util.$('#placeElement-' + this._color_picker_uid);
        if (hasDiv)hasDiv.parentElement.removeChild(hasDiv);
        mountElement.innerHTML = html;
        util.addClass(container,'ew-color-picker-container');
        container.appendChild(mountElement);
        element.appendChild(container);
    } else {
        element.innerHTML = `<div class="ew-color-picker-container">${ html }</div>`;
    }
    this._watcher = new RenderWatcher(this);
    this.config = new Observer(config).reactive; 
    this.startMain(mountElement, config);
}