import {
  on,
  off,
  create,
  addClass,
  removeClass,
  setAttr,
  removeElement,
  extend,
  isFunction,
  DEFAULT_PREFIX,
} from "@ew-color-picker/utils";

export type ButtonType = "default" | "primary" | "danger" | "text";
export type ButtonSize = "small" | "default" | "large";

export interface ButtonComponentOptions {
  text?: string;
  type?: ButtonType;
  size?: ButtonSize;
  disabled?: boolean;
  block?: boolean;
  nativeType?: "button" | "submit" | "reset";
  prefix?: string;
  onClick?: (event: MouseEvent) => void;
}

/**
 * 可独立使用的按钮组件。
 * 颜色选择器里的 Button 插件仍负责清空/确定逻辑，这里是通用按钮。
 */
export default class Button {
  private options: ButtonComponentOptions;
  private button: HTMLButtonElement | null = null;

  private get prefix(): string {
    return this.options.prefix || DEFAULT_PREFIX;
  }

  constructor(options: ButtonComponentOptions = {}) {
    this.options = extend(
      {
        text: "",
        type: "default",
        size: "default",
        disabled: false,
        block: false,
        nativeType: "button",
        prefix: DEFAULT_PREFIX,
      },
      options
    ) as ButtonComponentOptions;

    this.createElements();
    this.bindEvents();
  }

  private createElements() {
    const p = this.prefix;

    this.button = create<HTMLButtonElement>("button");
    addClass(this.button, `${p}button`);
    addClass(this.button, `${p}button--${this.options.type}`);
    addClass(this.button, `${p}button--${this.options.size}`);
    if (this.options.block) {
      addClass(this.button, `${p}button--block`);
    }

    setAttr(this.button, { type: this.options.nativeType });
    this.button.textContent = this.options.text || "";

    if (this.options.disabled) {
      this.setDisabled(true);
    }
  }

  private bindEvents() {
    if (!this.button) return;
    on(this.button, "click", this.handleClick);
  }

  private handleClick = (event: Event) => {
    if (this.options.disabled) return;
    if (isFunction(this.options.onClick)) {
      this.options.onClick(event as MouseEvent);
    }
  };

  public setText(text: string) {
    this.options.text = text;
    if (this.button) {
      this.button.textContent = text || "";
    }
  }

  public setDisabled(disabled: boolean) {
    this.options.disabled = disabled;
    if (!this.button) return;

    this.button.disabled = disabled;
    if (disabled) {
      addClass(this.button, `${this.prefix}button--disabled`);
    } else {
      removeClass(this.button, `${this.prefix}button--disabled`);
    }
  }

  public setType(type: ButtonType) {
    if (!this.button) return;
    removeClass(this.button, `${this.prefix}button--${this.options.type}`);
    this.options.type = type;
    addClass(this.button, `${this.prefix}button--${type}`);
  }

  public isDisabled(): boolean {
    return Boolean(this.options.disabled);
  }

  public getElement(): HTMLButtonElement {
    return this.button!;
  }

  public destroy() {
    if (this.button) {
      off(this.button, "click", this.handleClick);
    }
    if (this.button?.parentNode) {
      removeElement(this.button);
    }
    this.button = null;
  }
}
