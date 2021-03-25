import { setPredefineDisabled,hasAlpha } from './predefineColor';
import util from './util';
import { isValidColor,colorRegRGB,colorToRgba } from './color';
/**
 * 重新渲染颜色选择器
 * @param {*} color 
 * @param {*} pickerFlag 
 * @param {*} el 
 * @param {*} scope 
 */
export function onRenderColorPicker(color, pickerFlag, el, scope) {
    scope.config.defaultColor = scope.config.colorValue = color;
    scope.config.pickerFlag = pickerFlag;
    scope.render(el, scope.config);
}
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
        openChangeColorModeLabelHTML = '';
    const p_c = config.predefineColor;
    if (!util.isDeepArray(p_c)) return util.ewError(ERROR_VARIABLE.PREDEFINE_COLOR_ERROR);
    if (p_c.length) {
        p_c.map(color => {
            let isValidColorString = util.isString(color) && isValidColor(color);
            let isValidColorObj = util.isDeepObject(color) && color.hasOwnProperty('color') && isValidColor(color.color);
            let renderColor = isValidColorString ? color : isValidColorObj ? color.color : '';
            let renderDisabled = isValidColorObj ? setPredefineDisabled(color.disabled) : '';
            predefineColorHTML += `<div class="ew-pre-define-color${hasAlpha(renderColor)}${renderDisabled}" style="background:${renderColor};"></div>`;
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
    if (config.defaultColor && !isValidColor(config.defaultColor)) return util.ewError(ERROR_VARIABLE.DEFAULT_COLOR_ERROR);
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
        if (!config.alpha || !config.hue) return util.ewError(ERROR_VARIABLE.COLOR_MODE_ERROR);
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