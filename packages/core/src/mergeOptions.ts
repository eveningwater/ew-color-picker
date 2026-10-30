import {
  checkContainer,
  extend
} from "@ew-color-picker/utils";

export interface WrapperElement extends HTMLElement {
  isEwColorPickerContainer?: boolean;
}

export interface ewColorPickerConstructorOptions extends ewColorPickerOptions {
  el?: WrapperElement | string;
}

export interface PredefineColor {
  color: string;
  disabled?: boolean;
}

export interface ewColorPickerOptions {
  el?: WrapperElement | string;
  disabled?: boolean;
  predefineColor?: PredefineColor | string [];
  size?: string;
  defaultColor?: string;
  isClickOutside?: boolean;
  hueDirection?: string;
  alphaDirection?: string;
  clearText?: string;
  sureText?: string;
  togglePickerAnimation?: string;
  pickerAnimationTime?: number;
  autoPanelPosition?: boolean;
  panelPlacement?: 'top-start' | 'top' | 'top-end' | 'left-start' | 'left' | 'left-end' | 'right-start' | 'right' | 'right-end' | 'bottom-start' | 'bottom' | 'bottom-end';
  sure?: Function;
  clear?: Function;
  togglePicker?: Function;
  changeColor?: Function;
  [key: string]: any;
}

export const defaultConfig: Omit<ewColorPickerOptions, "el"> = {
  disabled: false,
  predefineColor: [],
  size: "normal",
  defaultColor: "",
  isClickOutside: true,
  hueDirection: "vertical",
  alphaDirection: "vertical",
  clearText: "清空",
  sureText: "确定",
  togglePickerAnimation: "default",
  pickerAnimationTime: 200,
  autoPanelPosition: false,
  panelPlacement: "bottom",
  sure: () => {},
  clear: () => {},
  togglePicker: () => {},
  changeColor: () => {},
};

export interface ewColorPickerCustomOptions {}
export class CustomOptions {}
export interface ewColorPickerMountedElement extends HTMLElement {
  isEwColorPickerContainer?: boolean;
}
export interface ewColorPickerMergeOptionsData
  extends Omit<ewColorPickerOptions, "el">,
    ewColorPickerCustomOptions {
  el: ewColorPickerMountedElement;
}

export interface ewColorPickerBindPluginOptions {
  [k: string]: any;
}
export default class ewColorPickerMergeOptions
  extends CustomOptions
  implements ewColorPickerMergeOptionsData
{
  [
    k: string
  ]: ewColorPickerMergeOptionsData[keyof ewColorPickerMergeOptionsData];
  el: ewColorPickerMountedElement = document.body as ewColorPickerMountedElement;
  constructor() {
    super();
  }
  merge(
    options?: ewColorPickerConstructorOptions,
    pluginNameProp?: ewColorPickerBindPluginOptions
  ): ewColorPickerOptions {
    const { el, ...rest } = options || {};
    return extend({}, defaultConfig, {
      ...rest,
      el: checkContainer(el),
      ...pluginNameProp,
    });
  }
  bindOptions(
    options?: ewColorPickerConstructorOptions,
    pluginNameProp: ewColorPickerBindPluginOptions = {}
  ) {
    const mergeOptions = this.merge(options, pluginNameProp);
    for (const k in mergeOptions) {
      const value = mergeOptions[k as keyof ewColorPickerOptions];
      this[k] = value;
    }
    return this;
  }
}
