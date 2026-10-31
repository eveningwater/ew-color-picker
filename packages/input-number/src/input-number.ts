import {
  on,
  off,
  addClass,
  removeClass,
  hasClass,
  create,
  setAttr,
  debounce,
  extend,
  $,
  removeElement,
  insertNode,
  isFunction,
  DEFAULT_PREFIX,
} from "@ew-color-picker/utils";
import { upArrowIcon, downArrowIcon } from "@ew-color-picker/utils";
import ewColorPicker from "@ew-color-picker/core";

export interface InputNumberOptions {
  value?: number;
  min?: number;
  max?: number;
  step?: number;
  precision?: number;
  disabled?: boolean;
  placeholder?: string;
  size?: "small" | "default" | "large";
  prefix?: string;
  onChange?: (value: number) => void;
  onBlur?: (value: number) => void;
  onFocus?: (event: FocusEvent) => void;
}

export default class InputNumber {
  private options: InputNumberOptions;
  private container: HTMLElement | null;
  private input: HTMLInputElement | null;
  private upButton: HTMLButtonElement | null;
  private downButton: HTMLButtonElement | null;
  private currentValue: number;
  private isFocused: boolean = false;

  private get prefix(): string {
    return this.options.prefix || DEFAULT_PREFIX;
  }

  // 防抖处理输入事件
  private debouncedOnChange: (value: number) => void;

  ewColorPicker: ewColorPicker;
  handleOptions?: () => void;
  run?: () => void;

  constructor(options: InputNumberOptions = {}) {
    const defaultOptions: InputNumberOptions = {
      value: 0,
      min: -Infinity,
      max: Infinity,
      step: 1,
      precision: 0,
      disabled: false,
      placeholder: "",
      size: "default",
      prefix: DEFAULT_PREFIX,
      onChange: () => {},
      onBlur: () => {},
      onFocus: () => {},
    };
    this.options = extend(
      defaultOptions,
      options
    ) as Required<InputNumberOptions>;

    this.currentValue = this.options.value ?? 0;
    this.debouncedOnChange = debounce(this.options.onChange!, 300);

    this.createElements();
    this.bindEvents();
    // 初始化时只同步显示值，不触发 onChange，避免实例创建阶段误改颜色
    this.updateValue(this.currentValue, false);
  }

  private createElements() {
    const p = this.prefix;
    // 创建容器
    this.container = create("div");
    addClass(this.container, `${p}input-number`);
    addClass(this.container, `${p}input-number--${this.options.size}`);

    // 创建输入框
    this.input = create<HTMLInputElement>("input");
    addClass(this.input, `${p}input-number__input`);
    setAttr(this.input, {
      type: "text",
      inputmode: "decimal",
      placeholder: this.options.placeholder,
    });

    // 创建按钮容器
    const buttonContainer = create("div");
    addClass(buttonContainer, `${p}input-number__buttons`);

    // 创建上按钮
    this.upButton = create<HTMLButtonElement>("button");
    addClass(this.upButton, `${p}input-number__button`);
    addClass(this.upButton, `${p}input-number__button--up`);
    setAttr(this.upButton, { type: "button" });
    this.upButton.innerHTML = upArrowIcon(undefined, undefined, p);

    // 创建下按钮
    this.downButton = create<HTMLButtonElement>("button");
    addClass(this.downButton, `${p}input-number__button`);
    addClass(this.downButton, `${p}input-number__button--down`);
    setAttr(this.downButton, { type: "button" });
    this.downButton.innerHTML = downArrowIcon(undefined, undefined, p);

    // 组装DOM结构
    insertNode(buttonContainer, this.upButton);
    insertNode(buttonContainer, this.downButton);
    insertNode(this.container, this.input);
    insertNode(this.container, buttonContainer);

    // 设置样式
    this.setStyles();
  }

  private setStyles() {
    if (this.options.disabled) {
      this.setDisabled(true);
    }
  }

  private bindEvents() {
    // 输入框事件
    on(this.input!, "input", this.handleInput.bind(this));
    on(this.input!, "blur", this.handleBlur.bind(this) as EventListener);
    on(this.input!, "focus", this.handleFocus.bind(this) as EventListener);
    on(this.input!, "keydown", this.handleKeydown.bind(this) as EventListener);

    // 按钮事件
    on(this.upButton!, "click", this.handleUpClick.bind(this));
    on(this.downButton!, "click", this.handleDownClick.bind(this));

    // 鼠标滚轮事件
    on(this.container!, "wheel", this.handleWheel.bind(this) as EventListener);
  }

  private handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    const value = target.value;

    // 允许空值、负号、小数点
    if (value === "" || value === "-" || value === ".") {
      return;
    }

    // 验证数字格式
    const numValue = parseFloat(value);
    if (isNaN(numValue)) {
      // 如果不是有效数字，恢复原值
      this.input!.value = this.currentValue.toString();
      return;
    }

    // 只更新当前值，不应用精度限制，让用户完整输入
    this.currentValue = numValue;
  }

  private handleBlur(event: FocusEvent) {
    this.isFocused = false;
    this.removeClass(this.container!, `${this.prefix}input-number--focused`);

    // 应用精度限制和边界检查
    this.updateValue(this.currentValue, false);

    // 触发blur回调
    this.options.onBlur!(this.currentValue);
  }

  private handleFocus(event: FocusEvent) {
    this.isFocused = true;
    this.addClass(this.container!, `${this.prefix}input-number--focused`);

    // 触发focus回调
    this.options.onFocus!(event);
  }

  private handleKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowUp":
        event.preventDefault();
        this.increment();
        break;
      case "ArrowDown":
        event.preventDefault();
        this.decrement();
        break;
      case "Enter":
        event.preventDefault();
        this.input!.blur();
        break;
    }
  }

  private handleUpClick() {
    if (!this.options.disabled) {
      this.increment();
    }
  }

  private handleDownClick() {
    if (!this.options.disabled) {
      this.decrement();
    }
  }

  private handleWheel(event: WheelEvent) {
    if (this.isFocused && !this.options.disabled) {
      event.preventDefault();
      if (event.deltaY < 0) {
        this.increment();
      } else {
        this.decrement();
      }
    }
  }

  private increment() {
    const newValue = this.currentValue + this.options.step!;
    this.updateValue(newValue);
  }

  private decrement() {
    const newValue = this.currentValue - this.options.step!;
    this.updateValue(newValue);
  }

  private updateValue(value: number, triggerChange: boolean = true) {
    // 应用边界限制
    const min = this.options.min!;
    const max = this.options.max!;

    if (value < min) {
      value = min;
    } else if (value > max) {
      value = max;
    }

    // 应用精度限制
    const precision = this.options.precision!;
    value =
      Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision);

    this.currentValue = value;
    this.formatDisplayValue();

    // 触发change回调
    if (triggerChange) {
      this.debouncedOnChange(value);
    }
  }

  private formatDisplayValue() {
    const precision = this.options.precision!;
    this.input!.value = this.currentValue.toFixed(precision);
  }

  private addClass(element: HTMLElement, className: string) {
    if (!hasClass(element, className)) {
      addClass(element, className);
    }
  }

  private removeClass(element: HTMLElement, className: string) {
    if (hasClass(element, className)) {
      removeClass(element, className);
    }
  }

  // 公共API
  public getValue(): number {
    return this.currentValue;
  }

  public setValue(value: number) {
    this.updateValue(value);
  }

  public setDisabled(disabled: boolean) {
    this.options.disabled = disabled;

    if (disabled) {
      this.addClass(this.container!, `${this.prefix}input-number--disabled`);
      setAttr(this.input!, { disabled: "true" });
      setAttr(this.upButton!, { disabled: "true" });
      setAttr(this.downButton!, { disabled: "true" });
    } else {
      this.removeClass(this.container!, `${this.prefix}input-number--disabled`);
      setAttr(this.input!, { disabled: "false" });
      setAttr(this.upButton!, { disabled: "false" });
      setAttr(this.downButton!, { disabled: "false" });
    }
  }

  public getElement(): HTMLElement {
    return this.container!;
  }

  public destroy() {
    // 清理事件监听器
    off(this.input!, "input", this.handleInput.bind(this));
    off(this.input!, "blur", this.handleBlur.bind(this) as EventListener);
    off(this.input!, "focus", this.handleFocus.bind(this) as EventListener);
    off(this.input!, "keydown", this.handleKeydown.bind(this) as EventListener);
    off(this.upButton!, "click", this.handleUpClick.bind(this));
    off(this.downButton!, "click", this.handleDownClick.bind(this));
    off(this.container!, "wheel", this.handleWheel.bind(this) as EventListener);
    
    // 移除DOM元素
    if (this.container?.parentNode) {
      removeElement(this.container);
    }
    
    // 清理引用
    this.container = null;
    this.input = null;
    this.upButton = null;
    this.downButton = null;
  }

  install(core: ewColorPicker) {
    this.ewColorPicker = core;
    this.handleOptions?.();
    
    // 检查是否显示数字输入框
    if (this.ewColorPicker.options?.showInputNumber === false) {
      return;
    }
    
    // 注册事件监听器
    if (isFunction(core.on)) {
      core.on('change', () => {});
    }
    
    this.run?.();
  }
}
