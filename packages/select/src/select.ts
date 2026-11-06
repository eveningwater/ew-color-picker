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
  closeIcon,
  downArrowIcon,
} from "@ew-color-picker/utils";

export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

export interface SelectOptions {
  value?: string | number;
  items?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  size?: "small" | "default" | "large";
  prefix?: string;
  clearable?: boolean;
  onChange?: (value: string | number, option: SelectOption) => void;
  onClear?: () => void;
  onOpen?: () => void;
  onClose?: () => void;
}

export default class Select {
  private options: SelectOptions;
  private container: HTMLDivElement | null = null;
  private trigger: HTMLButtonElement | null = null;
  private valueText: HTMLSpanElement | null = null;
  private clearNode: HTMLSpanElement | null = null;
  private dropdown: HTMLDivElement | null = null;
  private optionNodes: HTMLDivElement[] = [];
  private items: SelectOption[] = [];
  private currentValue: string | number | undefined;
  private isOpen: boolean = false;
  private activeIndex: number = -1;

  private get prefix(): string {
    return this.options.prefix || DEFAULT_PREFIX;
  }

  constructor(options: SelectOptions = {}) {
    this.options = extend(
      {
        value: undefined,
        items: [],
        placeholder: "",
        disabled: false,
        size: "default",
        prefix: DEFAULT_PREFIX,
        clearable: true,
        onChange: () => {},
        onClear: () => {},
        onOpen: () => {},
        onClose: () => {},
      },
      options
    ) as SelectOptions;

    this.items = this.options.items || [];
    this.currentValue = this.options.value;

    this.createElements();
    this.renderOptions();
    this.updateDisplayValue();
    this.bindEvents();
  }

  private createElements() {
    const p = this.prefix;

    this.container = create<HTMLDivElement>("div");
    addClass(this.container, `${p}select`);
    addClass(this.container, `${p}select--${this.options.size}`);

    this.trigger = create<HTMLButtonElement>("button");
    addClass(this.trigger, `${p}select__trigger`);
    setAttr(this.trigger, {
      type: "button",
      "aria-haspopup": "listbox",
      "aria-expanded": "false",
    });

    this.valueText = create<HTMLSpanElement>("span");
    addClass(this.valueText, `${p}select__value`);

    this.clearNode = create<HTMLSpanElement>("span");
    addClass(this.clearNode, `${p}select__clear`);
    addClass(this.clearNode, `${p}select__clear--hidden`);
    setAttr(this.clearNode, {
      role: "button",
      "aria-label": "Clear selection",
      tabindex: "-1",
    });
    this.clearNode.innerHTML = closeIcon(`${p}select__clear-icon`, 12, p);

    const arrow = create<HTMLSpanElement>("span");
    addClass(arrow, `${p}select__arrow`);
    arrow.innerHTML = downArrowIcon(`${p}select__arrow-icon`, 12, p);

    insertNode(this.trigger, this.valueText);
    insertNode(this.trigger, this.clearNode);
    insertNode(this.trigger, arrow);

    this.dropdown = create<HTMLDivElement>("div");
    addClass(this.dropdown, `${p}select__dropdown`);
    setAttr(this.dropdown, { role: "listbox" });

    insertNode(this.container, this.trigger);
    insertNode(this.container, this.dropdown);

    if (this.options.disabled) {
      this.setDisabled(true);
    }
  }

  private renderOptions() {
    if (!this.dropdown) return;
    this.dropdown.textContent = "";
    this.optionNodes = [];

    const p = this.prefix;
    this.items.forEach((item, index) => {
      const option = create<HTMLDivElement>("div");
      addClass(option, `${p}select__option`);
      setAttr(option, {
        role: "option",
        "data-select-index": String(index),
      });
      option.textContent = item.label;
      if (item.disabled) {
        addClass(option, `${p}select__option--disabled`);
        setAttr(option, { "aria-disabled": "true" });
      }
      insertNode(this.dropdown!, option);
      this.optionNodes.push(option);
    });

    this.updateOptionStates();
  }

  private updateOptionStates() {
    const p = this.prefix;
    this.optionNodes.forEach((node, index) => {
      const item = this.items[index];
      if (!item) return;
      if (item.value === this.currentValue && !item.disabled) {
        addClass(node, `${p}select__option--selected`);
        setAttr(node, { "aria-selected": "true" });
      } else {
        removeClass(node, `${p}select__option--selected`);
        setAttr(node, { "aria-selected": "false" });
      }
      if (index === this.activeIndex) {
        addClass(node, `${p}select__option--active`);
      } else {
        removeClass(node, `${p}select__option--active`);
      }
    });
  }

  private updateDisplayValue() {
    const p = this.prefix;
    const matched = this.items.find(
      (item) => item.value === this.currentValue
    );
    const isEmpty = this.currentValue === undefined || this.currentValue === "";

    if (this.valueText) {
      if (isEmpty) {
        this.valueText.textContent = this.options.placeholder || "";
        addClass(this.valueText, `${p}select__value--placeholder`);
      } else {
        this.valueText.textContent = matched
          ? matched.label
          : String(this.currentValue);
        removeClass(this.valueText, `${p}select__value--placeholder`);
      }
    }

    this.updateClearVisibility(isEmpty);
  }

  private updateClearVisibility(isEmpty: boolean) {
    if (!this.clearNode) return;
    const p = this.prefix;
    const hidden =
      !this.options.clearable || isEmpty || Boolean(this.options.disabled);
    if (hidden) {
      addClass(this.clearNode, `${p}select__clear--hidden`);
    } else {
      removeClass(this.clearNode, `${p}select__clear--hidden`);
    }
  }

  private bindEvents() {
    if (!this.trigger || !this.dropdown) return;
    on(this.trigger, "click", this.handleTriggerClick);
    on(this.trigger, "keydown", this.handleKeydown as EventListener);
    on(this.dropdown, "click", this.handleDropdownClick);
  }

  private handleTriggerClick = (event: Event) => {
    if (this.options.disabled) return;
    const target = event.target as HTMLElement | null;
    if (
      this.clearNode &&
      target &&
      target.closest(`.${this.prefix}select__clear`)
    ) {
      event.stopPropagation();
      this.clear();
      return;
    }
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  };

  private handleDropdownClick = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    const optionNode = target.closest(
      `[data-select-index]`
    ) as HTMLElement | null;
    if (!optionNode) return;
    const index = Number(optionNode.getAttribute("data-select-index"));
    this.selectIndex(index);
  };

  private handleKeydown = (event: KeyboardEvent) => {
    if (this.options.disabled) return;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!this.isOpen) {
          this.open();
        } else {
          this.moveActive(1);
        }
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!this.isOpen) {
          this.open();
        } else {
          this.moveActive(-1);
        }
        break;
      case "Enter":
        event.preventDefault();
        if (this.isOpen) {
          this.selectIndex(this.activeIndex);
        } else {
          this.open();
        }
        break;
      case "Escape":
        if (this.isOpen) {
          event.preventDefault();
          this.close();
        }
        break;
      case "Tab":
        if (this.isOpen) this.close();
        break;
    }
  };

  private handleDocumentMousedown = (event: Event) => {
    const target = event.target as HTMLElement | null;
    if (!target || !this.container) return;
    if (!this.container.contains(target)) {
      this.close();
    }
  };

  private moveActive(step: number) {
    if (this.items.length === 0) return;
    let next = this.activeIndex;
    for (let i = 0; i < this.items.length; i++) {
      next = (next + step + this.items.length) % this.items.length;
      if (!this.items[next].disabled) break;
    }
    this.activeIndex = next;
    this.updateOptionStates();
  }

  private selectIndex(index: number, triggerChange: boolean = true) {
    const item = this.items[index];
    if (!item || item.disabled) return;

    this.currentValue = item.value;
    this.updateDisplayValue();
    this.close();

    if (triggerChange && isFunction(this.options.onChange)) {
      this.options.onChange(item.value, item);
    }
  }

  public open() {
    if (this.options.disabled || this.isOpen || !this.container) return;
    this.isOpen = true;
    addClass(this.container, `${this.prefix}select--open`);
    if (this.trigger) setAttr(this.trigger, { "aria-expanded": "true" });

    const selectedIndex = this.items.findIndex(
      (item) => item.value === this.currentValue && !item.disabled
    );
    this.activeIndex = selectedIndex >= 0 ? selectedIndex : 0;
    this.updateOptionStates();

    on(document, "mousedown", this.handleDocumentMousedown);
    if (isFunction(this.options.onOpen)) this.options.onOpen();
  }

  public close() {
    if (!this.isOpen || !this.container) {
      this.isOpen = false;
      return;
    }
    this.isOpen = false;
    removeClass(this.container, `${this.prefix}select--open`);
    if (this.trigger) setAttr(this.trigger, { "aria-expanded": "false" });
    off(document, "mousedown", this.handleDocumentMousedown);
    if (isFunction(this.options.onClose)) this.options.onClose();
  }

  public getValue(): string | number | undefined {
    return this.currentValue;
  }

  public setValue(value: string | number | undefined, triggerChange: boolean = true) {
    this.currentValue = value;
    this.updateDisplayValue();
    this.updateOptionStates();

    if (triggerChange && isFunction(this.options.onChange)) {
      const matched = this.items.find((item) => item.value === value);
      if (matched) {
        this.options.onChange(value!, matched);
      }
    }
  }

  public clear(triggerChange: boolean = true) {
    if (this.options.disabled) return;
    const wasEmpty = this.currentValue === undefined || this.currentValue === "";

    this.currentValue = undefined;
    this.activeIndex = -1;
    this.updateDisplayValue();
    this.updateOptionStates();
    this.close();

    if (!wasEmpty && triggerChange && isFunction(this.options.onClear)) {
      this.options.onClear();
    }
  }

  public setItems(items: SelectOption[]) {
    this.items = items || [];
    this.activeIndex = -1;
    this.renderOptions();
    this.updateDisplayValue();
  }

  public setDisabled(disabled: boolean) {
    this.options.disabled = disabled;
    if (!this.container || !this.trigger) return;

    if (disabled) {
      addClass(this.container, `${this.prefix}select--disabled`);
      setAttr(this.trigger, { disabled: "true" });
      this.close();
    } else {
      removeClass(this.container, `${this.prefix}select--disabled`);
      setAttr(this.trigger, { disabled: "false" });
    }
    this.updateDisplayValue();
  }

  public isDropdownOpen(): boolean {
    return this.isOpen;
  }

  public getElement(): HTMLDivElement {
    return this.container!;
  }

  public destroy() {
    this.close();
    if (this.trigger) {
      off(this.trigger, "click", this.handleTriggerClick);
      off(this.trigger, "keydown", this.handleKeydown as EventListener);
    }
    if (this.dropdown) {
      off(this.dropdown, "click", this.handleDropdownClick);
    }
    if (this.container?.parentNode) {
      removeElement(this.container);
    }
    this.container = null;
    this.trigger = null;
    this.valueText = null;
    this.clearNode = null;
    this.dropdown = null;
    this.optionNodes = [];
  }
}
