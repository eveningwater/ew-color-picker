export const emptyFun = function () { };
const baseDefaultConfig = {
    hue: true,
    alpha: false,
    size: "normal",
    predefineColor: [],
    disabled: false,
    defaultColor: "",
    pickerAnimation: "default",
    pickerAnimationTime:200,
    sure: emptyFun,
    clear: emptyFun,
    togglePicker: emptyFun,
    isLog: true,
    changeColor: emptyFun,
    hasBox: true,
    isClickOutside: true,
    hasClear:true,
    hasSure:true,
    hasInput:true,
    boxDisabled:false,
    openChangeColorMode:false,
    boxBgColor:false,
    hueDirection:"vertical",//vertical or horizontal
    alphaDirection:"vertical",//vertical or horizontal
    lang:"zh",
    userDefineText:false
}
export default baseDefaultConfig;