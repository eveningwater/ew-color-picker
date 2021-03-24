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