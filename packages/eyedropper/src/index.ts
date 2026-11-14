import ewColorPicker, { ewColorPickerOptions } from "@ew-color-picker/core";
import {
  on,
  off,
  create,
  addClass,
  setAttr,
  insertNode,
  removeElement,
  isFunction,
  extend,
  warn,
  $,
  getPrefix,
  ApplyOrder,
  eyedropperIcon,
} from "@ew-color-picker/utils";

export interface EyedropperOptions {
  showEyedropper?: boolean;
  eyedropperText?: string;
  onEyedropperPick?: (color: string) => void;
}

export default class ewColorPickerEyedropperPlugin {
  static pluginName = "ewColorPickerEyedropper";
  static applyOrder = ApplyOrder.Post;
  options: EyedropperOptions & Omit<ewColorPickerOptions, "el"> = {};
  container: HTMLDivElement | null = null;
  button: HTMLButtonElement | null = null;

  private destroyed = false;

  private get prefix(): string {
    return getPrefix(this.ewColorPicker);
  }

  constructor(public ewColorPicker: ewColorPicker) {
    this.ewColorPicker = ewColorPicker;
    this.handleOptions();
    this.run();
  }

  private isSupported(): boolean {
    return typeof window !== "undefined" && "EyeDropper" in window;
  }

  handleOptions() {
    this.options = extend({}, this.options, this.ewColorPicker.options);
  }

  // 配置更新后由 core 重新调用，先移除旧节点避免 Panel 重建 bottom-row 后重复渲染
  updateOptions(): void {
    this.handleOptions();
    this.run();
  }

  run() {
    if (this.options.showEyedropper === false || !this.isSupported()) {
      this.removeContainer();
      return;
    }
    this.removeContainer();
    this.render();
    this.bindEvents();
  }

  render() {
    const panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
    if (!panelContainer) {
      warn("[ewColorPicker warning]: Panel container not found");
      return;
    }

    // 单独的工具栏行，避免和输入框 / 清空确定按钮挤在同一行
    const extraRow = this.getExtraRow(panelContainer);

    this.container = create<HTMLDivElement>("div");
    addClass(this.container, `${this.prefix}color-picker-eyedropper-group`);

    this.button = create<HTMLButtonElement>("button");
    addClass(this.button, `${this.prefix}color-picker-eyedropper-btn`);
    setAttr(this.button, {
      type: "button",
      title: this.options.eyedropperText || "取色",
      "aria-label": this.options.eyedropperText || "取色",
    });
    this.button.innerHTML = eyedropperIcon(undefined, 16, this.prefix);

    if (this.options.eyedropperText) {
      const text = create<HTMLSpanElement>("span");
      addClass(text, `${this.prefix}color-picker-eyedropper-text`);
      text.textContent = this.options.eyedropperText;
      insertNode(this.button, text);
    }

    insertNode(this.container, this.button);
    insertNode(extraRow, this.container);
  }

  // 获取（或创建）底部按钮行上方的工具栏行
  private getExtraRow(panelContainer: HTMLElement): HTMLElement {
    const existing = $(
      `.${this.prefix}color-picker-extra-row`,
      panelContainer
    ) as HTMLElement | null;
    if (existing) return existing;

    const row = create<HTMLDivElement>("div");
    addClass(row, `${this.prefix}color-picker-extra-row`);
    const bottomRow = $(`.${this.prefix}color-picker-bottom-row`, panelContainer);
    if (bottomRow) {
      insertNode(panelContainer, row, null, bottomRow);
    } else {
      insertNode(panelContainer, row);
    }
    return row;
  }

  bindEvents() {
    if (this.button) {
      on(this.button, "click", this.handleClick);
    }
  }

  private handleClick = async () => {
    if (this.destroyed) return;
    const EyeDropperCtor = (
      window as Window & {
        EyeDropper?: new () => {
          open: () => Promise<{ sRGBHex: string }>;
        };
      }
    ).EyeDropper;
    if (!EyeDropperCtor) return;

    try {
      const result = await new EyeDropperCtor().open();
      // Promise 回调可能在实例销毁后执行
      if (this.destroyed || !result || !result.sRGBHex) return;

      this.ewColorPicker.setColor(result.sRGBHex);
      if (isFunction(this.options.onEyedropperPick)) {
        this.options.onEyedropperPick(result.sRGBHex);
      }
    } catch (error) {
      // 用户按 Esc 取消取色时 EyeDropper 会抛出 AbortError，属于正常流程
      if (error instanceof Error && error.name === "AbortError") return;
      warn(
        "[ewColorPicker warning]: Failed to pick color with EyeDropper",
        error
      );
    }
  };

  private removeContainer() {
    if (this.button) {
      off(this.button, "click", this.handleClick);
    }
    if (this.container) {
      removeElement(this.container);
    }
    this.button = null;
    this.container = null;

    // 工具栏行没有其他插件的内容时一并移除，避免留下空白间距
    const panelContainer = this.ewColorPicker?.getMountPoint?.("panelContainer");
    if (panelContainer) {
      const extraRow = $(
        `.${this.prefix}color-picker-extra-row`,
        panelContainer
      ) as HTMLElement | null;
      if (extraRow && extraRow.children.length === 0) {
        removeElement(extraRow);
      }
    }
  }

  destroy() {
    this.destroyed = true;
    this.removeContainer();
  }

  // 便于测试时直接绑定 mock core
  install(core: ewColorPicker) {
    this.ewColorPicker = core;
    this.destroyed = false;
    this.handleOptions();
    this.run?.();
  }
}

declare module "@ew-color-picker/core" {
  interface CustomOptions {
    ewColorPickerEyedropper: EyedropperOptions;
  }
}
