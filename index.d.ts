declare namespace ewColorPicker {
  export type WrapperType = string | HTMLElement;
  export type OptionType = {
    el: WrapperType;
    alpha?: boolean;
    hue?: boolean;
    size?:string | {
        width?: string | number;
        height?: string | number;
    };
    predefineColor?: string[];
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