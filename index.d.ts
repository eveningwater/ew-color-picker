declare namespace ewColorPicker {
  export interface PredefineColorType {
      color?:String,
      disabled?:boolean
  }
  export type WrapperType = string | HTMLElement | Element | HTMLCollection | Node | NodeList | null | void;
  export type OptionType = {
    el?: WrapperType;
    alpha?: boolean;
    hue?: boolean;
    size?:string | {
        width?: string | number;
        height?: string | number;
    };
    predefineColor?: string[] | Array<PredefineColorType>;
    disabled?: boolean;
    defaultColor?: string;
    pickerAnimation?: string;
    pickerAnimationTime?:number;
    sure?: Function;
    clear?: Function;
    isLog?: boolean;
    openOrClosePicker?: Function;
    changeColor?: Function;
    hasBox?:boolean;
    isClickOutside?:boolean;
    hasClear?:boolean;
    hasSure?:boolean;
    hasColorInput?:boolean;
    boxDisabled?:boolean;
    openChangeColorMode?:boolean;
    changeBoxByChangeColor?:boolean;
    hueDirection?:string;
    alphaDirection?:string;
  };
}
export type WrapperType = ewColorPicker.WrapperType;
export type OptionType = ewColorPicker.OptionType;
declare class ewColorPicker {
    public config:OptionType;
    constructor(colorPickerOption:WrapperType | OptionType);
    createColorPicker(colorPickerOption:WrapperType | OptionType);
    getDefaultConfig();
}
export default ewColorPicker; 