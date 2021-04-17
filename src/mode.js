import { colorToRgba, colorRgbaToHex, colorRgbaToHsla } from './color';
/**
 * 转换颜色模式
 * @param {*} context 
 * @param {*} color 
 * @returns 
 */
 export function changeMode(context, color) {
    let result = null;
    switch (context.currentMode) {
        case "hex":
            result = colorRgbaToHex(color);
            break;
        case "rgba":
            result = colorToRgba(color);
            break;
        case "hsla":
            result = colorRgbaToHsla(color).colorStr;
            break;
        default:
            result = color;
            break;
    }
    context.$Dom.modeTitle.innerHTML = context.currentMode;
    return result;
}
 /**
* 切换颜色模式
* @param {*} context 
* @param {*} index 
*/
export function onHandleChangeMode(context,handleType,callback){
   let l = context.colorMode.length;
   if(handleType === 'up'){
       context.modeCount += 1;
   }else{
       context.modeCount -= 1;
   }
   if (context.modeCount > l - 1) context.modeCount = 0;
   if (context.modeCount < 0) context.modeCount = l - 1;
   context.currentMode = context.colorMode[context.modeCount];
   callback();
}