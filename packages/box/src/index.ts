import ewColorPicker from "@ew-color-picker/core";
import {
  createByTemplate,
  extend,
  insertNode,
  removeElement,
  on,
  off,
  removeStyle,
  setStyle,
  addClass,
  removeClass,
  warn,
  create,
  $,
  getPrefix
} from "@ew-color-picker/utils";
import { ewColorPickerOptions } from "@ew-color-picker/core";
import { PartialBoxProps } from "./type";
import { getBoxChildren, processSizeConfig, getBoxIconColor } from "./method";

export default class ewColorPickerBoxPlugin {
  static pluginName = "ewColorPickerBox";
  options: ewColorPickerBoxPluginOptions & Omit<ewColorPickerOptions, "el"> = {};
  box: HTMLElement | null;
  hasColor: boolean;
  _handlers: Array<() => void> = [];
  
  // 内部状态控制
  private _hasBox: boolean = true;

  private get prefix(): string {
    return getPrefix(this.ewColorPicker);
  }
  
  constructor(public ewColorPicker: ewColorPicker) {
    this.box = null;
    this.hasColor = false;
    this.handleOptions();
    // 支持构造时通过 hasBox 关闭盒子
    if (this.options.hasBox === false) {
      this._hasBox = false;
    }
    
    // 注册事件监听器
    if (this.ewColorPicker.on && typeof this.ewColorPicker.on === 'function') {
      this.ewColorPicker.on('change', (color: string) => {
        // 当颜色改变时，更新盒子背景色
        this.setBoxBgColor(color);
      });
    }
    
    this.run();
  }

  // 获取盒子状态
  get hasBox(): boolean {
    return this._hasBox;
  }

  // 设置盒子状态
  set hasBox(value: boolean) {
    if (this._hasBox !== value) {
      this._hasBox = value;
      if (value) {
        this.render();
      } else {
        // 如果禁用了盒子，移除DOM
        if (this.box && this.box.parentNode) {
          removeElement(this.box);
          this.box = null;
        }
      }
    }
  }

  // 动态启用/禁用盒子
  enableBox(enable: boolean = true): void {
    this.hasBox = enable;
  }
  
  handleOptions() {
    this.options = extend(this.options, this.ewColorPicker.options);
  }
  
  run() {
    this.render();
  }
  
  updateChildren() {
    if (this.box) {
      // 使用 currentColor 而不是 defaultColor 来判断是否有颜色
      const currentColor = this.ewColorPicker.currentColor;
      this.hasColor = !!currentColor;
      this.box.replaceChildren(createByTemplate(getBoxChildren(this.hasColor, this.options)));
    }
  }
  
  destroy() {
    if (this.box) {
      this.unbindHandler();
      removeElement(this.box);
      this.box = null;
    }
  }
  
  update(keys: string[] = ["defaultColor", "size", "disabled", "readonly", "className", "style"]) {
    if (!this.box) {
      this.render();
    } else {
      if (keys.includes("defaultColor")) {
        this.updateChildren();
        this.setBoxBgColor(this.ewColorPicker.currentColor);
      }
      if (keys.includes("size")) {
        this.setBoxSize();
      }
      if (keys.includes("disabled") || keys.includes("readonly") || keys.includes("className") || keys.includes("style")) {
        this.setBoxState();
      }
    }
  }
  
  render() {
    const { className, style } = this.options;
    
    // 检查是否显示盒子
    if (!this.hasBox) {
      return;
    }
    
    // 直接使用主容器
    const rootElement = this.ewColorPicker.getMountPoint("root");
    if (!rootElement) {
      warn("[ewColorPicker] Root mount point not found");
      return;
    }
    
    // 查找或创建盒子容器
    this.box = $(`.${this.prefix}color-picker-box`, rootElement);
    if (!this.box) {
      this.box = create("div");
      addClass(this.box, `${this.prefix}color-picker-box`);
      if (className) addClass(this.box, className);
      if (style) setStyle(this.box, style);
      insertNode(rootElement, this.box);
    }
    
    // 渲染内容
    this.updateChildren();
    this.setBoxSize();
    this.setBoxBgColor(this.ewColorPicker.currentColor);
    this.setBoxState();
    this.bindHandler();
  }
  
  setBoxSize() {
    if (!this.box) return;
    
    const { size } = this.options;
    const sizeStyles = processSizeConfig(size);
    
    if (Object.keys(sizeStyles).length > 0) {
      setStyle(this.box, sizeStyles);
    } else {
      // 无尺寸配置，使用默认样式
      removeStyle(this.box, ["width", "height"]);
    }
  }
  
  setBoxBgColor(color?: string) {
    if (this.box) {
      if (color && color.trim() !== '') {
        // 图标颜色随背景色亮度自动适配，保证足够对比度
        const iconColor = getBoxIconColor(color);
        setStyle(this.box, {
          backgroundColor: color,
          transition: "background-color 0.3s",
          ...(iconColor ? { color: iconColor } : {})
        });
      } else {
        this.clearBoxBgColor();
      }
    }
  }
  
  clearBoxBgColor() {
    if (this.box) {
      removeStyle(this.box, ["background-color", "transition", "color"]);
    }
  }
  
  setBoxState() {
    if (this.box) {
      const { disabled, readonly, className } = this.options;
      if (disabled) addClass(this.box, "is-disabled"); else removeClass(this.box, "is-disabled");
      if (readonly) addClass(this.box, "is-readonly"); else removeClass(this.box, "is-readonly");
      if (className) addClass(this.box, className);
    }
  }
  
  bindHandler() {
    if (!this.box) return;
    
    const { onClick, onMouseEnter, onMouseLeave, disabled, readonly, togglePickerAnimation, pickerAnimationTime } = this.options;
    
    // 绑定点击事件
    const clickHandler = (e: Event) => {
      if (disabled || readonly) {
        e.preventDefault();
        e.stopPropagation();
        return;
      }
      
      // 切换面板状态：如果面板隐藏则打开，如果面板显示则关闭
      if (this.ewColorPicker.pickerFlag) {
        this.ewColorPicker.hidePanel(togglePickerAnimation, pickerAnimationTime);
      } else {
        this.ewColorPicker.showPanel(togglePickerAnimation, pickerAnimationTime);
      }
      
      onClick?.(this);
    };
    on(this.box, "click", clickHandler);
    this._handlers.push(() => off(this.box!, "click", clickHandler));
    
    // 绑定鼠标事件
    this.bindMouseEvents(onMouseEnter, onMouseLeave);
  }

  // 设置禁用状态
  setDisabled(disabled: boolean) {
    if (this.box) {
      if (disabled) {
        addClass(this.box, "is-disabled");
      } else {
        removeClass(this.box, "is-disabled");
      }
    }
  }
  
  bindMouseEvents(onMouseEnter?: (instance: ewColorPickerBoxPlugin) => void, onMouseLeave?: (instance: ewColorPickerBoxPlugin) => void) {
    if (!this.box) return;
    
    if (onMouseEnter) {
      const enterHandler = () => onMouseEnter(this);
      on(this.box, "mouseenter", enterHandler);
      this._handlers.push(() => off(this.box!, "mouseenter", enterHandler));
    }
    
    if (onMouseLeave) {
      const leaveHandler = () => onMouseLeave(this);
      on(this.box, "mouseleave", leaveHandler);
      this._handlers.push(() => off(this.box!, "mouseleave", leaveHandler));
    }
  }
  
  unbindHandler() {
    this._handlers.forEach((off) => off());
    this._handlers = [];
  }
}

export type ewColorPickerBoxPluginOptions = PartialBoxProps;

declare module "@ew-color-picker/core" {
  interface CustomOptions {
    ewColorPickerBoxPlugin: ewColorPickerBoxPluginOptions;
  }
}
