declare namespace ewColorPicker {
  export interface PredefineColorType {
      color?:String,
      disabled?:boolean
  }
  export type WrapperType = string | HTMLElement;
  export type OptionType = {
    el: WrapperType;
    alpha?: boolean;
    hue?: boolean;
    size?:string | {
        width?: string | number;
        height?: string | number;
    };
    predefineColor?: string[] | Array<PredefineColorType>;
    disabled?: boolean;
    defaultColor?: string;
    openPickerAni?: string;
    sure?: Function;
    clear?: Function;
    isLog?: boolean;
    openPicker?: Function;
    changeColor?: Function;
    hasBox?:boolean;
    isClickOutside?:boolean;
    hasClear?:boolean;
    hasSure?:boolean;
    hasColorInput?:boolean;
    boxDisabled?:boolean;
    openChangeColorMode?:boolean;
    changeBoxByChangeColor?:boolean;
  };
}
export type WrapperType = ewColorPicker.WrapperType;
export type OptionType = ewColorPicker.OptionType;
declare class ewColorPicker {
    constructor(colorPickerOption:WrapperType | OptionType);
    createColorPicker(colorPickerOption:WrapperType | OptionType);
    getDefaultConfig();
}
export default ewColorPicker; 