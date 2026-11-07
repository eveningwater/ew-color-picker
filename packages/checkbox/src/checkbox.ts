import {
  on,
  off,
  create,
  addClass,
  removeClass,
  setAttr,
  removeElement,
  insertNode,
  extend,
  isFunction,
  DEFAULT_PREFIX,
  checkIcon,
} from "@ew-color-picker/utils";

export interface CheckboxOptions {
  checked?: boolean;
  label?: string;
  disabled?: boolean;
  size?: "small" | "default" | "large";
  prefix?: string;
  onChange?: (checked: boolean) => void;
}

export default class Checkbox {
  private options: CheckboxOptions;
  private container: HTMLLabelElement | null = null;
  private input: HTMLInputElement | null = null;
  private box: HTMLSpanElement | null = null;
  private labelText: HTMLSpanElement | null = null;
  private currentChecked: boolean = false;

  private get prefix(): string {
    return this.options.prefix || DEFAULT_PREFIX;
  }

  constructor(options: CheckboxOptions = {}) {
    this.options = extend(
      {
        checked: false,
        label: "",
        disabled: false,
        size: "default",
        prefix: DEFAULT_PREFIX,
        onChange: () => {},
      },
      options
    ) as CheckboxOptions;

    this.currentChecked = Boolean(this.options.checked);

    this.createElements();
    this.bindEvents();
  }

  private createElements() {
    const p = this.prefix;

    this.container = create<HTMLLabelElement>("label");
    addClass(this.container, `${p}checkbox`);
    addClass(this.container, `${p}checkbox--${this.options.size}`);

    // 保留原生 input 语义与键盘操作，仅隐藏其外观
    this.input = create<HTMLInputElement>("input");
    addClass(this.input, `${p}checkbox__input`);
    setAttr(this.input, { type: "checkbox" });
    this.input.checked = this.currentChecked;

    this.box = create<HTMLSpanElement>("span");
    addClass(this.box, `${p}checkbox__box`);
    this.box.innerHTML = checkIcon(`${p}checkbox__check-icon`, 10, p);

    this.labelText = create<HTMLSpanElement>("span");
    addClass(this.labelText, `${p}checkbox__label`);
    this.labelText.textContent = this.options.label || "";

    insertNode(this.container, this.input);
    insertNode(this.container, this.box);
    insertNode(this.container, this.labelText);

    this.syncState();
    if (this.options.disabled) {
      this.setDisabled(true);
    }
  }

  private syncState() {
    if (!this.container || !this.input) return;
    const p = this.prefix;
    this.input.checked = this.currentChecked;

    if (this.currentChecked) {
      addClass(this.container, `${p}checkbox--checked`);
    } else {
      removeClass(this.container, `${p}checkbox--checked`);
    }
    setAttr(this.input, { "aria-checked": String(this.currentChecked) });
  }

  private bindEvents() {
    if (!this.input) return;
    on(this.input, "change", this.handleChange);
  }

  private handleChange = () => {
    if (!this.input || this.options.disabled) return;
    this.currentChecked = this.input.checked;
    this.syncState();

    if (isFunction(this.options.onChange)) {
      this.options.onChange(this.currentChecked);
    }
  };

  public isChecked(): boolean {
    return this.currentChecked;
  }

  public setChecked(checked: boolean, triggerChange: boolean = true) {
    const next = Boolean(checked);
    this.currentChecked = next;
    this.syncState();

    if (triggerChange && isFunction(this.options.onChange)) {
      this.options.onChange(next);
    }
  }

  public setLabel(label: string) {
    if (this.labelText) {
      this.labelText.textContent = label || "";
    }
    this.options.label = label;
  }

  public setDisabled(disabled: boolean) {
    this.options.disabled = disabled;
    if (!this.container || !this.input) return;

    this.input.disabled = disabled;
    if (disabled) {
      addClass(this.container, `${this.prefix}checkbox--disabled`);
    } else {
      removeClass(this.container, `${this.prefix}checkbox--disabled`);
    }
  }

  public getElement(): HTMLLabelElement {
    return this.container!;
  }

  public destroy() {
    if (this.input) {
      off(this.input, "change", this.handleChange);
    }
    if (this.container?.parentNode) {
      removeElement(this.container);
    }
    this.container = null;
    this.input = null;
    this.box = null;
    this.labelText = null;
  }
}
