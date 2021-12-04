declare namespace ewColorPicker {
  export interface PredefineColorType {
    color: String;
    disabled: boolean;
  }
  export type ColorPickerElementType =
    | string
    | HTMLElement
    | Element
    | HTMLCollection
    | Node
    | NodeList
    | null
    | void;
  type SizeType = string | Partial<{ width:string | number,height:string | number }>
  export type ColorPickerOptionType = {
    el: ColorPickerElementType;
    alpha: boolean;
    hue: boolean;
    size:SizeType;
    predefineColor: string[] | Array<Partial<PredefineColorType>>;
    disabled: boolean;
    defaultColor: string;
    pickerAnimation: string;
    pickerAnimationTime: number;
    sure: Function;
    clear: Function;
    isLog: boolean;
    togglePicker: Function;
    changeColor: Function;
    hasBox: boolean;
    isClickOutside: boolean;
    hasClear: boolean;
    hasSure: boolean;
    hasInput: boolean;
    boxDisabled: boolean;
    openChangeColorMode: boolean;
    boxBgColor: boolean;
    hueDirection: string;
    alphaDirection: string;
    lang:string;
    userDefineText:boolean;
    clearText:string;
    sureText:string;
  };
}
export type ElementType = ewColorPicker.ColorPickerElementType;
export type OptionType = Partial<ewColorPicker.ColorPickerOptionType>;
export interface $DomType {
  box?: HTMLDivElement;
  hueBar?: HTMLDivElement;
  hueThumb?: HTMLDivElement;
  pickerClear?: HTMLButtonElement;
  picker: HTMLDivElement;
  pickerCursor: HTMLDivElement;
  pickerInput?: HTMLInputElement;
  pickerPanel: HTMLDivElement;
  pickerSure?: HTMLButtonElement;
  preDefineItem?: NodeList;
  rootElement: Element | HTMLElement;
  verticalSlider?: HTMLDivElement;
  horizontalSlider?: HTMLDivElement;
}
export interface Instance {
  $Dom: $DomType;
  config: OptionType;
}
type getDefaultConfig = () => OptionType;
declare class ewColorPicker implements Instance {
  public config: OptionType;
  public $Dom: $DomType;
  static createColorPicker:(colorPickerOption: ElementType | OptionType) => Instance;
  static getDefaultConfig:() => ReturnType<getDefaultConfig>;
  constructor(colorPickerOption: ElementType | OptionType);
}
export default ewColorPicker;
