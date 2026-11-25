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

export interface InputComponentOptions {
  value?: string;
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  size?: "small" | "default" | "large";
  type?: "text" | "password" | "number" | "search";
  prefix?: string;
  onChange?: (value: string, event?: Event) => void;
  onFocus?: (value: string, event?: FocusEvent) => void;
  onBlur?: (value: string, event?: FocusEvent) => void;
  onEnter?: (value: string, event?: KeyboardEvent) => void;
}

/**
 * 可独立使用的文本输入框。
 * 颜色选择器里的 Input 插件仍负责颜色校验与同步，这里是通用输入框。
 */
export default class Input {
  private options: InputComponentOptions;
  private input: HTMLInputElement | null = null;

  private get prefix(): string {
    return this.options.prefix || DEFAULT_PREFIX;
  }

  constructor(options: InputComponentOptions = {}) {
    this.options = extend(
      {
        value: "",
        placeholder: "",
        disabled: false,
        readonly: false,
        size: "default",
        type: "text",
        prefix: DEFAULT_PREFIX,
      },
      options
    ) as InputComponentOptions;

    this.createElements();
    this.bindEvents();
  }

  private createElements() {
    const p = this.prefix;

    this.input = create<HTMLInputElement>("input");
    addClass(this.input, `${p}input`);
    addClass(this.input, `${p}input--${this.options.size}`);

    setAttr(this.input, {
      type: this.options.type,
      placeholder: this.options.placeholder,
    });
    this.input.value = this.options.value || "";

    if (this.options.disabled) this.setDisabled(true);
    if (this.options.readonly) this.setReadonly(true);
  }

  private bindEvents() {
    if (!this.input) return;
    on(this.input, "input", this.handleInput);
    on(this.input, "focus", this.handleFocus);
    on(this.input, "blur", this.handleBlur);
    on(this.input, "keydown", this.handleKeydown);
  }

  private handleInput = (event: Event) => {
    if (isFunction(this.options.onChange)) {
      this.options.onChange(this.getValue(), event);
    }
  };

  private handleFocus = (event: Event) => {
    if (isFunction(this.options.onFocus)) {
      this.options.onFocus(this.getValue(), event as FocusEvent);
    }
  };

  private handleBlur = (event: Event) => {
    if (isFunction(this.options.onBlur)) {
      this.options.onBlur(this.getValue(), event as FocusEvent);
    }
  };

  private handleKeydown = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === "Enter" && isFunction(this.options.onEnter)) {
      this.options.onEnter(this.getValue(), keyboardEvent);
    }
  };

  public getValue(): string {
    return this.input ? this.input.value : "";
  }

  public setValue(value: string, triggerChange: boolean = true) {
    const next = value ?? "";
    this.options.value = next;
    if (!this.input) return;

    this.input.value = next;
    if (triggerChange && isFunction(this.options.onChange)) {
      this.options.onChange(next);
    }
  }

  public setPlaceholder(placeholder: string) {
    this.options.placeholder = placeholder;
    if (this.input) {
      setAttr(this.input, { placeholder });
    }
  }

  public setDisabled(disabled: boolean) {
    this.options.disabled = disabled;
    if (!this.input) return;

    this.input.disabled = disabled;
    if (disabled) {
      addClass(this.input, `${this.prefix}input--disabled`);
    } else {
      removeClass(this.input, `${this.prefix}input--disabled`);
    }
  }

  public setReadonly(readonly: boolean) {
    this.options.readonly = readonly;
    if (!this.input) return;

    this.input.readOnly = readonly;
    if (readonly) {
      addClass(this.input, `${this.prefix}input--readonly`);
    } else {
      removeClass(this.input, `${this.prefix}input--readonly`);
    }
  }

  public focus() {
    this.input?.focus();
  }

  public getElement(): HTMLInputElement {
    return this.input!;
  }

  public destroy() {
    if (this.input) {
      off(this.input, "input", this.handleInput);
      off(this.input, "focus", this.handleFocus);
      off(this.input, "blur", this.handleBlur);
      off(this.input, "keydown", this.handleKeydown);
    }
    if (this.input?.parentNode) {
      removeElement(this.input);
    }
    this.input = null;
  }
}
