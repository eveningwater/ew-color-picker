import ewColorPicker, { ewColorPickerOptions } from "@ew-color-picker/core";
import {
  on,
  off,
  create,
  addClass,
  removeClass,
  setAttr,
  setStyle,
  insertNode,
  removeElement,
  isFunction,
  extend,
  warn,
  $,
  getPrefix,
  ApplyOrder,
  copyIcon,
  getContrastColor,
} from "@ew-color-picker/utils";

export interface CopyColorOptions {
  showCopyColor?: boolean;
  copyColorText?: string;
  copiedText?: string;
  onCopyColor?: (color: string) => void;
}

const DEFAULT_COPY_TEXT = "复制颜色到剪贴板";
const DEFAULT_COPIED_TEXT = "已复制";

export default class ewColorPickerCopyColorPlugin {
  static pluginName = "ewColorPickerCopyColor";
  static applyOrder = ApplyOrder.Post;

  options: CopyColorOptions & Omit<ewColorPickerOptions, "el"> = {} as any;
  container: HTMLDivElement | null = null;
  button: HTMLButtonElement | null = null;
  tip: HTMLDivElement | null = null;

  private destroyed = false;
  private listening = false;
  private resetTitleTimer: ReturnType<typeof setTimeout> | null = null;
  private defaultTitle = DEFAULT_COPY_TEXT;

  private get prefix(): string {
    return getPrefix(this.ewColorPicker);
  }

  constructor(public ewColorPicker: ewColorPicker) {
    this.ewColorPicker = ewColorPicker;
    this.handleOptions();
    this.run();
    this.bindCoreEvents();
  }

  handleOptions() {
    this.options = extend({}, this.options, this.ewColorPicker.options);
  }

  updateOptions(): void {
    this.handleOptions();
    this.run();
  }

  run() {
    if (this.options.showCopyColor === false) {
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

    this.defaultTitle = this.options.copyColorText || DEFAULT_COPY_TEXT;

    this.container = create<HTMLDivElement>("div");
    addClass(this.container, `${this.prefix}color-picker-copy-group`);

    this.button = create<HTMLButtonElement>("button");
    addClass(this.button, `${this.prefix}color-picker-copy-btn`);
    setAttr(this.button, {
      type: "button",
      title: this.defaultTitle,
      "aria-label": this.defaultTitle,
    });
    this.button.innerHTML = copyIcon(undefined, 14, this.prefix);

    this.syncColor(this.ewColorPicker.getColor());

    // 复制成功提示气泡
    this.tip = create<HTMLDivElement>("div");
    addClass(this.tip, `${this.prefix}color-picker-copy-tip`);
    setAttr(this.tip, { role: "status", "aria-live": "polite" });
    this.tip.textContent = this.options.copiedText || DEFAULT_COPIED_TEXT;

    insertNode(this.container, this.button);
    insertNode(this.container, this.tip);
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

  private bindCoreEvents() {
    if (this.listening) return;
    this.ewColorPicker.on("change", this.handleChange);
    this.listening = true;
  }

  private handleChange = (color: string) => {
    this.syncColor(color);
  };

  private syncColor(color?: string) {
    if (!this.button) return;
    const backgroundColor = color || "#ffffff";
    setStyle(this.button, {
      backgroundColor,
      color: getContrastColor(backgroundColor),
    });
  }

  private handleClick = async () => {
    if (this.destroyed) return;

    const color = this.ewColorPicker.getColor();
    if (!color) return;

    const copied = await this.copyToClipboard(color);
    if (this.destroyed) return;

    if (!copied) {
      warn("[ewColorPicker warning]: Failed to copy color to clipboard");
      return;
    }

    this.showCopiedState();

    if (isFunction(this.options.onCopyColor)) {
      this.options.onCopyColor(color);
    }
  };

  private async copyToClipboard(text: string): Promise<boolean> {
    if (
      typeof navigator !== "undefined" &&
      navigator.clipboard &&
      isFunction(navigator.clipboard.writeText)
    ) {
      try {
        await navigator.clipboard.writeText(text);
        return true;
      } catch (error) {
        // 非安全上下文等场景下继续尝试兼容方案
      }
    }

    if (
      typeof document === "undefined" ||
      !isFunction(document.execCommand)
    ) {
      return false;
    }

    const textarea = create<HTMLTextAreaElement>("textarea");
    textarea.value = text;
    setStyle(textarea, {
      position: "fixed",
      top: "-9999px",
      left: "-9999px",
      opacity: "0",
    });
    insertNode(document.body, textarea);
    textarea.select();

    let copied = false;
    try {
      copied = document.execCommand("copy");
    } catch (error) {
      copied = false;
    }
    removeElement(textarea);
    return copied;
  }

  private showCopiedState() {
    if (!this.button) return;

    const copiedText = this.options.copiedText || DEFAULT_COPIED_TEXT;
    setAttr(this.button, { title: copiedText, "aria-label": copiedText });
    addClass(this.button, `${this.prefix}color-picker-copy-btn-copied`);

    // 弹出复制成功提示气泡
    if (this.tip) {
      this.tip.textContent = copiedText;
      addClass(this.tip, `${this.prefix}color-picker-copy-tip-show`);
    }

    if (this.resetTitleTimer) {
      clearTimeout(this.resetTitleTimer);
    }
    this.resetTitleTimer = setTimeout(() => {
      this.resetTitleTimer = null;
      if (this.destroyed || !this.button) return;
      setAttr(this.button, {
        title: this.defaultTitle,
        "aria-label": this.defaultTitle,
      });
      removeClass(this.button, `${this.prefix}color-picker-copy-btn-copied`);
      if (this.tip) {
        removeClass(this.tip, `${this.prefix}color-picker-copy-tip-show`);
      }
    }, 1500);
  }

  private removeContainer() {
    if (this.resetTitleTimer) {
      clearTimeout(this.resetTitleTimer);
      this.resetTitleTimer = null;
    }
    if (this.button) {
      off(this.button, "click", this.handleClick);
    }
    if (this.container) {
      removeElement(this.container);
    }
    this.button = null;
    this.container = null;
    this.tip = null;

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
    this.ewColorPicker.off("change", this.handleChange);
    this.listening = false;
  }

  install(core: ewColorPicker) {
    if (this.listening) {
      this.ewColorPicker.off("change", this.handleChange);
      this.listening = false;
    }
    this.ewColorPicker = core;
    this.destroyed = false;
    this.handleOptions();
    this.run();
    this.bindCoreEvents();
  }
}

declare module "@ew-color-picker/core" {
  interface CustomOptions {
    ewColorPickerCopyColor: CopyColorOptions;
  }
}
