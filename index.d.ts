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
    togglePicker?: Function;
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
export interface $DomType {
  box?:HTMLDivElement;
    hueBar?:HTMLDivElement;
    hueThumb?:HTMLDivElement;
    pickerClear?:HTMLButtonElement;
    picker:HTMLDivElement;
    pickerCursor:HTMLDivElement;
    pickerInput?:HTMLInputElement;
    pickerPanel:HTMLDivElement;
    pickerSure?:HTMLButtonElement;
    preDefineItem?:NodeList;
    rootElement:Element | HTMLElement;
    verticalSlider?:HTMLDivElement;
    horizontalSlider?:HTMLDivElement;
}
export interface Instance {
  $Dom:$DomType;
  config:OptionType;
}
declare class ewColorPicker implements Instance {
    public config:OptionType;
    public $Dom:$DomType;
    constructor(colorPickerOption:WrapperType | OptionType);
    createColorPicker(colorPickerOption:WrapperType | OptionType);
    getDefaultConfig();
}


export default ewColorPicker; 