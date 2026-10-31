import ewColorPicker, { HsvaColor } from "@ew-color-picker/core";
import {
  on,
  setStyle,
  addClass,
  removeClass,
  hasClass,
  isFunction,
  insertNode,
  ApplyOrder,
  extend,
  warn,
  create,
  $,
  off,
  setAttr,
  debounce,
  colorToRgba,
  colorRgbaToHsva,
  getPrefix,
} from "@ew-color-picker/utils";
import { ewColorPickerOptions } from "@ew-color-picker/core";

export interface ButtonOptions {
  clearText?: string;
  sureText?: string;
  clear?: Function;
  sure?: Function;
  showButton?: boolean;
  hasClear?: boolean;
  hasSure?: boolean;
}

export default class ewColorPickerButtonPlugin {
  static pluginName = "ewColorPickerButton";
  static applyOrder = ApplyOrder.Post;
  options: ButtonOptions & Omit<ewColorPickerOptions, "el"> = {} as any;
  clearButton: HTMLButtonElement | null = null;
  sureButton: HTMLButtonElement | null = null;
  
  // 内部状态控制
  private _hasClear: boolean = true;
  private _hasSure: boolean = true;

  private get prefix(): string {
    return getPrefix(this.ewColorPicker);
  }
  
  // 防抖处理按钮点击事件
  private debouncedOnClearColor: () => void;
  private debouncedOnSureColor: () => void;

  constructor(public ewColorPicker: ewColorPicker) {
    this.handleOptions();
    // 支持构造时通过 hasClear / hasSure 隐藏按钮
    if (this.options.hasClear === false) {
      this._hasClear = false;
    }
    if (this.options.hasSure === false) {
      this._hasSure = false;
    }
    // 初始化防抖函数
    this.debouncedOnClearColor = debounce(this.onClearColor.bind(this), 100);
    this.debouncedOnSureColor = debounce(this.onSureColor.bind(this), 100);
    this.run();
  }

  // 获取清空按钮状态
  get hasClear(): boolean {
    return this._hasClear;
  }

  // 设置清空按钮状态
  set hasClear(value: boolean) {
    if (this._hasClear !== value) {
      this._hasClear = value;
      this.render();
    }
  }

  // 获取确定按钮状态
  get hasSure(): boolean {
    return this._hasSure;
  }

  // 设置确定按钮状态
  set hasSure(value: boolean) {
    if (this._hasSure !== value) {
      this._hasSure = value;
      this.render();
    }
  }

  // 动态启用/禁用清空按钮
  enableClear(enable: boolean = true): void {
    this.hasClear = enable;
  }

  // 动态启用/禁用确定按钮
  enableSure(enable: boolean = true): void {
    this.hasSure = enable;
  }

  // 动态启用/禁用所有按钮
  enableButtons(enable: boolean = true): void {
    this.hasClear = enable;
    this.hasSure = enable;
  }

  handleOptions() {
    this.options = extend({}, this.options, this.ewColorPicker.options);
  }

  // 更新配置并重新渲染
  updateOptions(): void {
    this.handleOptions();
    // 延迟执行，确保在颜色模式插件之后执行
    setTimeout(() => {
      this.render();
    }, 0);
  }

  run() {
    // 检查是否显示按钮
    if (this.options.showButton === false) {
      return;
    }

    this.render();
    this.bindEvents();

    // 按钮组样式依赖颜色模式插件渲染出的输入框组，延后调整
    setTimeout(() => {
      this.adjustButtonGroupStyle();
    }, 0);
  }

  render() {
    // 直接使用面板容器
    const panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
    if (!panelContainer) {
      warn('[ewColorPicker warning]: Panel container not found');
      return;
    }
    
    // 查找底部行容器
    const bottomRow = $(`.${this.prefix}color-picker-bottom-row`, panelContainer);
    if (!bottomRow) {
      warn('[ewColorPicker warning]: Bottom row container not found');
      return;
    }
    
    // 查找或创建按钮容器
    let btnGroup = $(`.${this.prefix}color-picker-drop-btn-group`, bottomRow);
    if (!btnGroup) {
      btnGroup = create('div');
      addClass(btnGroup, `${this.prefix}color-picker-drop-btn-group`);
      // 插入到 bottomRow 内部
      insertNode(bottomRow, btnGroup);
    }
    
    // 清空旧内容
    btnGroup.textContent = '';
    
    // 渲染清空按钮
    if (this.hasClear) {
      this.clearButton = create<HTMLButtonElement>('button');
      addClass(this.clearButton, `${this.prefix}color-picker-clear-btn ${this.prefix}color-picker-drop-btn`);
      this.setClearText(this.options.clearText || '清空');
      insertNode(btnGroup, this.clearButton);
    }
    
    // 渲染确认按钮
    if (this.hasSure) {
      this.sureButton = create<HTMLButtonElement>('button');
      addClass(this.sureButton, `${this.prefix}color-picker-sure-btn ${this.prefix}color-picker-drop-btn`);
      this.setSureText(this.options.sureText || '确认');
      insertNode(btnGroup, this.sureButton);
    }
    
    // 根据当前颜色模式调整按钮组样式
    this.adjustButtonGroupStyle();
  }

  bindEvents() {
    // 清空按钮事件
    if (this.clearButton) {
      on(this.clearButton, 'click', () => {
        this.debouncedOnClearColor();
      });
    }

    // 确定按钮事件
    if (this.sureButton) {
      on(this.sureButton, 'click', () => {
        this.debouncedOnSureColor();
      });
    }
    
    // 监听颜色模式变化事件
    this.ewColorPicker.on('mode-change', () => {
      this.adjustButtonGroupStyle();
    });
  }

  onClearColor() {
    let resetColor: string;
    let resetHsva: HsvaColor | undefined;
    if (this.ewColorPicker.options.defaultColor) {
      resetColor = this.ewColorPicker.options.defaultColor;
      const rgbaColor = colorToRgba(resetColor);
      if (rgbaColor) {
        resetHsva = colorRgbaToHsva(rgbaColor);
      }
    } else {
      resetColor = '';
      resetHsva = undefined;
    }
    // 更新 HSV 颜色
    if (resetHsva) {
      this.ewColorPicker.hsvaColor = resetHsva;
    } else {
      // 清空时重置为初始状态
      this.ewColorPicker.hsvaColor = { h: 0, s: 100, v: 100, a: 1 };
    }
    // 设置颜色
    this.ewColorPicker.setColor(resetColor);
    // 同步所有插件
    this.ewColorPicker.syncAllPlugins(resetColor);
    // 自动关闭颜色面板
    this.ewColorPicker.hidePanel();
    // 触发清空回调
    if (isFunction(this.options.clear)) {
      this.options.clear?.(this.ewColorPicker);
    }
    // 触发事件
    this.ewColorPicker.trigger('clear');
  }

  onSureColor() {
    // 触发确定回调
    if (isFunction(this.options.sure)) {
      this.options.sure?.(this.ewColorPicker.currentColor, this.ewColorPicker);
    }
    
    // 触发事件
    this.ewColorPicker.trigger('sure', this.ewColorPicker.currentColor, this.ewColorPicker);
    
    // 隐藏面板
    this.ewColorPicker.hidePanel();
  }

  setClearText(text: string) {
    if (this.clearButton) {
      this.clearButton.textContent = text;
    }
  }

  setSureText(text: string) {
    if (this.sureButton) {
      this.sureButton.textContent = text;
    }
  }

  setDisabled(disabled: boolean) {
    if (this.clearButton) {
      setAttr(this.clearButton, { disabled: disabled.toString() });
    }
    if (this.sureButton) {
      setAttr(this.sureButton, { disabled: disabled.toString() });
    }
  }

  destroy() {
    if (this.clearButton) {
      off(this.clearButton, 'click', this.debouncedOnClearColor as unknown as EventListener);
    }
    if (this.sureButton) {
      off(this.sureButton, 'click', this.debouncedOnSureColor as unknown as EventListener);
    }
    
    // 清理DOM引用
    this.clearButton = null;
    this.sureButton = null;
  }

  // 根据颜色模式调整按钮组样式
  adjustButtonGroupStyle() {
    const p = this.prefix;
    const panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
    if (!panelContainer) return;
    
    const bottomRow = $(`.${p}color-picker-bottom-row`, panelContainer);
    if (!bottomRow) return;
    
    const btnGroup = $(`.${p}color-picker-drop-btn-group`, bottomRow);
    if (!btnGroup) return;
    
    // 检查当前颜色模式
    const hasMultipleInputs = $(`.${p}color-picker-inputs-group`, panelContainer) !== null;
    
    if (hasMultipleInputs) {
      // HSL 或 RGB 模式：按钮组占据一行并居中
      addClass(btnGroup, `${p}color-picker-drop-btn-group-multi`);
      removeClass(btnGroup, `${p}color-picker-drop-btn-group-single`);
      addClass(bottomRow, `${p}color-picker-bottom-row-multi`);
      removeClass(bottomRow, `${p}color-picker-bottom-row-single`);
    } else {
      // HEX 模式：按钮组正常布局
      addClass(btnGroup, `${p}color-picker-drop-btn-group-single`);
      removeClass(btnGroup, `${p}color-picker-drop-btn-group-multi`);
      addClass(bottomRow, `${p}color-picker-bottom-row-single`);
      removeClass(bottomRow, `${p}color-picker-bottom-row-multi`);
    }
  }

  // 新增 install 方法，便于测试
  install(core: ewColorPicker) {
    this.ewColorPicker = core;
    this.handleOptions();
    this.run?.();
  }
}

declare module "@ew-color-picker/core" {
  interface CustomOptions {
    ewColorPickerButton: ButtonOptions;
  }
} 