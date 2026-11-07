import { ApplyOrder, extend, getPrefix, isFunction, $ } from "@ew-color-picker/utils";
import Checkbox from "./checkbox";
import type { CheckboxOptions } from "./checkbox";
import ewColorPicker from "@ew-color-picker/core";

export interface CheckboxPluginOptions {
  // 默认 true，仅在提供了 checkboxLabel 时才渲染
  showCheckbox?: boolean;
  checkboxLabel?: string;
  checkboxChecked?: boolean;
  checkboxDisabled?: boolean;
  onCheckboxChange?: (checked: boolean) => void;
}

export class ewColorPickerCheckboxPlugin {
  static pluginName = "ewColorPickerCheckbox";
  static applyOrder = ApplyOrder.Post;

  options: CheckboxPluginOptions & Record<string, any> = {};
  private instance: Checkbox | null = null;
  private ewColorPicker: ewColorPicker | null;

  constructor(ewColorPicker: ewColorPicker) {
    this.ewColorPicker = ewColorPicker;
    this.handleOptions();
    this.run();
  }

  install(ewColorPicker: ewColorPicker) {
    this.ewColorPicker = ewColorPicker;
    this.handleOptions();
    this.run();
  }

  handleOptions() {
    const options = this.ewColorPicker?.options;
    if (options) {
      this.options = extend({}, this.options, options);
    }
  }

  updateOptions() {
    this.handleOptions();
    this.run();
  }

  run() {
    if (!this.ewColorPicker) return;
    this.removeInstance();

    const label = this.options.checkboxLabel;
    if (
      this.options.showCheckbox === false ||
      typeof label !== "string" ||
      label === ""
    ) {
      return;
    }

    const prefix = getPrefix(this.ewColorPicker);
    const panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
    if (!panelContainer) return;

    this.instance = this.createCheckbox({
      label,
      checked: this.options.checkboxChecked === true,
      disabled: this.options.checkboxDisabled === true,
      prefix,
      onChange: (checked) => {
        if (isFunction(this.options.onCheckboxChange)) {
          this.options.onCheckboxChange(checked);
        }
      },
    });

    const bottomRow = $(
      `.${prefix}color-picker-bottom-row`,
      panelContainer
    ) as HTMLElement | null;
    (bottomRow || panelContainer).appendChild(this.instance.getElement());
  }

  createCheckbox(options: CheckboxOptions = {}): Checkbox {
    return new Checkbox(options);
  }

  private removeInstance() {
    if (this.instance) {
      this.instance.destroy();
      this.instance = null;
    }
  }

  destroy() {
    this.removeInstance();
    this.ewColorPicker = null;
  }
}

export { Checkbox };
export type { CheckboxOptions };
export default ewColorPickerCheckboxPlugin;

declare module "@ew-color-picker/core" {
  interface CustomOptions {
    ewColorPickerCheckbox: CheckboxPluginOptions;
  }
}
