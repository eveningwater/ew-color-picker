import { ApplyOrder, isUndefined } from "@ew-color-picker/utils";
import InputNumber from "./input-number";
import type { InputNumberOptions } from "./input-number";
import ewColorPicker from "@ew-color-picker/core";



export class ewColorPickerInputNumberPlugin {
  static pluginName = "ewColorPickerInputNumber";
  static applyOrder = ApplyOrder.Post;

  options: { disabled?: boolean } = {};
  private instances: Map<string, InputNumber> = new Map();
  private ewColorPicker: ewColorPicker | null;

  constructor(ewColorPicker: ewColorPicker) {
    this.ewColorPicker = ewColorPicker;
    this.handleOptions();
  }

  install(ewColorPicker: ewColorPicker) {
    this.ewColorPicker = ewColorPicker;
    this.handleOptions();
    this.run();
  }

  updateOptions() {
    this.handleOptions();
    this.instances.forEach((instance) => {
      if (!isUndefined(this.options.disabled)) {
        instance.setDisabled(this.options.disabled);
      }
    });
  }

  run() {
    if (!this.ewColorPicker) return;
    const inputNumber = this.createInputNumber({
      value: 0,
      disabled: this.options.disabled || false,
    });
    this.instances.set("default", inputNumber);
    const panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
    if (panelContainer) {
      const bottomRow = panelContainer.querySelector(
        ".ew-color-picker-bottom-row"
      );
      if (bottomRow) {
        bottomRow.appendChild(inputNumber.getElement());
      }
    }
  }

  handleOptions() {
    const options = this.ewColorPicker?.options;
    if (options) {
      this.options = {
        ...this.options,
        ...options,
        disabled: !isUndefined(options.disabled)
          ? options.disabled
          : this.options.disabled || false,
      };
    }
  }

  createInputNumber(options: InputNumberOptions): InputNumber {
    return new InputNumber(options);
  }

  destroy() {
    this.instances.forEach((instance) => {
      instance.destroy();
    });
    this.instances.clear();
    this.ewColorPicker = null;
  }
}

export { InputNumber };
export type { InputNumberOptions };
export default ewColorPickerInputNumberPlugin;
