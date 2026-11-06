import { ApplyOrder, extend, getPrefix, isFunction, $ } from "@ew-color-picker/utils";
import Select from "./select";
import type { SelectOptions, SelectOption } from "./select";
import ewColorPicker from "@ew-color-picker/core";

export interface SelectPluginOptions {
  // 默认 true，仅在提供了 selectItems 时才渲染
  showSelect?: boolean;
  selectItems?: SelectOption[];
  selectValue?: string | number;
  selectPlaceholder?: string;
  // 默认 true，选中值后显示清空图标
  selectClearable?: boolean;
  onSelectChange?: (value: string | number, option: SelectOption) => void;
  onSelectClear?: () => void;
}

export class ewColorPickerSelectPlugin {
  static pluginName = "ewColorPickerSelect";
  static applyOrder = ApplyOrder.Post;

  options: SelectPluginOptions & Record<string, any> = {};
  private instance: Select | null = null;
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

    const items = this.options.selectItems;
    if (
      this.options.showSelect === false ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return;
    }

    const prefix = getPrefix(this.ewColorPicker);
    const panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
    if (!panelContainer) return;

    this.instance = this.createSelect({
      items,
      value: this.options.selectValue,
      placeholder: this.options.selectPlaceholder,
      prefix,
      clearable: this.options.selectClearable !== false,
      onChange: (value, option) => {
        if (isFunction(this.options.onSelectChange)) {
          this.options.onSelectChange(value, option);
        }
      },
      onClear: () => {
        if (isFunction(this.options.onSelectClear)) {
          this.options.onSelectClear();
        }
      },
    });

    const bottomRow = $(
      `.${prefix}color-picker-bottom-row`,
      panelContainer
    ) as HTMLElement | null;
    (bottomRow || panelContainer).appendChild(this.instance.getElement());
  }

  createSelect(options: SelectOptions = {}): Select {
    return new Select(options);
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

export { Select };
export type { SelectOptions, SelectOption };
export default ewColorPickerSelectPlugin;
