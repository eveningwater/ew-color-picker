const emptyFun = function () { };
const baseDefaultConfig = {
    hue: true,
    alpha: false,
    size: "normal",
    predefineColor: [],
    disabled: false,
    defaultColor: "",
    pickerAnimation: "height",
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
    hasColorInput:true,
    boxDisabled:false,
    openChangeColorMode:false,
    changeBoxByChangeColor:false,
    hueDirection:"vertical",//vertical or horizontal
    alphaDirection:"vertical",//vertical or horizontal
}
export default baseDefaultConfig;