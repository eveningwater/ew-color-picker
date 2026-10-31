import ewColorPicker from "@ew-color-picker/core";
import {
  on,
  setStyle,
  addClass,
  removeClass,
  hasClass,
  isFunction,
  insertNode,
  ApplyOrder,
  $,
  create,
  setAttr,
  warn,
  debounce,
  extend,
  off,
  removeElement,
  getPrefix,
} from "@ew-color-picker/utils";
import { 
  colorRgbaToHsva, 
  colorHsvaToRgba, 
  colorRgbaToHex, 
  colorToRgba, 
  isValidColor,
  parseRgbaString,
  rgbaToHex
} from "@ew-color-picker/utils";
import { ewColorPickerOptions } from "@ew-color-picker/core";

export interface InputOptions {
  disabled?: boolean;
  changeColor?: Function;
}

export default class ewColorPickerInputPlugin {
  static pluginName = "ewColorPickerInput";
  static applyOrder = ApplyOrder.Post;
  options: InputOptions & Omit<ewColorPickerOptions, "el"> = {} as any;
  input: HTMLInputElement | null = null;
  
  // 内部状态控制
  private _hasInput: boolean = true;

  private get prefix(): string {
    return getPrefix(this.ewColorPicker);
  }
  
  // 防抖处理输入事件
  private debouncedOnInputColor: (value: string) => void;
  hasAlpha: boolean;

  constructor(public ewColorPicker: ewColorPicker) {
    this.handleOptions();
    // 支持构造时通过 hasInput 关闭输入框
    if (this.options.hasInput === false) {
      this._hasInput = false;
    }
    // 初始化防抖函数
    this.debouncedOnInputColor = debounce(this.onInputColor.bind(this), 300);
    this.run();
    this.hasAlpha = !!this.ewColorPicker.plugins.ewColorPickerAlpha;
  }

  // 获取输入框状态
  get hasInput(): boolean {
    return this._hasInput;
  }

  // 设置输入框状态
  set hasInput(value: boolean) {
    if (this._hasInput !== value) {
      this._hasInput = value;
      if (value) {
        this.render();
        this.bindEvents();
      } else {
        // 如果禁用了输入框，移除DOM
        if (this.input && this.input.parentNode) {
          removeElement(this.input);
          this.input = null;
        }
      }
    }
  }

  // 动态启用/禁用输入框
  enableInput(enable: boolean = true): void {
    this.hasInput = enable;
  }

  handleOptions() {
    if (this.ewColorPicker && this.ewColorPicker.options) {
      this.options = extend(this.options, this.ewColorPicker.options);
    }
  }

  // 更新配置并重新渲染
  updateOptions(): void {
    this.handleOptions();
    if (this.hasInput) {
      this.render();
    } else {
      // 如果禁用了输入框，移除DOM
      if (this.input && this.input.parentNode) {
        removeElement(this.input);
        this.input = null;
      }
    }
  }

  run() {
    // 根据内部状态决定是否渲染
    if (this.hasInput) {
      this.render();
      this.bindEvents();
    }
  }

  render() {
    // 直接使用面板容器
    const panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
    if (!panelContainer) {
      warn('[ewColorPicker] Panel container not found');
      return;
    }
    
    // 查找底部行容器
    const bottomRow = $(`.${this.prefix}color-picker-bottom-row`, panelContainer);
    if (!bottomRow) {
      warn('[ewColorPicker] Bottom row container not found');
      return;
    }
    
    // 查找按钮组容器（清空和确认按钮的父元素）
    let btnGroup = $(`.${this.prefix}color-picker-drop-btn-group`, bottomRow);
    
    // 查找或创建 input 容器
    let inputContainer = $(`.${this.prefix}color-picker-input-container`, bottomRow);
    if (!inputContainer) {
      inputContainer = create('div');
      addClass(inputContainer, `${this.prefix}color-picker-input-container`);
      addClass(inputContainer, `${this.prefix}color-picker-input-container-flex`);
      
      // 如果存在按钮组，插入到按钮组之前
      if (btnGroup && btnGroup.parentNode) {
        btnGroup.parentNode.insertBefore(inputContainer, btnGroup);
      } else {
        // 如果没有按钮组，直接插入到 bottomRow
        insertNode(bottomRow, inputContainer);
      }
    }
    
    // 查找已存在的 input 元素，避免重复插入
    this.input = $(`input.${this.prefix}color-picker-input`, inputContainer) as HTMLInputElement;
    if (!this.input) {
      this.input = create<HTMLInputElement>('input');
      if (this.input) {
        addClass(this.input, `${this.prefix}color-picker-input`);
        setAttr(this.input, {
          type: 'text',
          name: `${this.prefix}color-picker-input`,
          placeholder: '请输入颜色值'
        });
        
        // 组装DOM结构
        insertNode(inputContainer, this.input);
      }
    }
    
    // 设置当前值
    let currentColor = this.ewColorPicker.getColor();
    
    // 检查当前颜色是否有效
    if (!currentColor || currentColor.indexOf('NaN') !== -1) {
      currentColor = this.getDefaultColor();
      // 只有在真正需要时才设置颜色，避免在初始化时强制设置
      if (this.ewColorPicker.currentColor === '') {
        // 如果 currentColor 为空，说明用户没有设置 defaultColor，不应该强制设置
        currentColor = '';
      } else {
        this.ewColorPicker.setColor(currentColor);
      }
    }
    
    // 格式化颜色显示
    const displayColor = this.formatColorForDisplay(currentColor);
    
    if (this.input) {
      this.input.value = displayColor;
    }
    
    // 如果禁用，添加禁用样式
    if (this.options.disabled) {
      this.setDisabled(true);
    }
  }

  bindEvents() {
    if (!this.input) return;

    // 失焦事件
    on(this.input, 'blur', (event: Event) => {
      this.debouncedOnInputColor((event.target as HTMLInputElement).value);
    });

    // 回车事件
    on(this.input, 'keydown', (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Enter') {
        this.debouncedOnInputColor((keyboardEvent.target as HTMLInputElement).value);
      }
    });

    // 监听颜色变化事件，自动更新输入框
    this.ewColorPicker.on('change', (color: string) => {
      this.update(color);
    });
  }

  onInputColor(value: string) {
    if (!value.trim()) return;

    // 验证颜色格式
    if (!isValidColor(value)) {
      warn(`[ewColorPicker warning]: Invalid color format: ${value}`);
      return;
    }

    // 转换颜色格式
    const rgbaColor = colorToRgba(value);
    
    // 更新HSV颜色
    this.ewColorPicker.hsvaColor = colorRgbaToHsva(rgbaColor);
    
    // 更新当前颜色并触发事件
    this.ewColorPicker.setColor(rgbaColor);
    
    // 同步更新其他插件的状态
    this.syncOtherPlugins(rgbaColor);
    
    // 触发颜色改变回调
    if (isFunction(this.options.changeColor)) {
      this.options.changeColor?.(rgbaColor);
    }
  }

  // 同步其他插件的状态
  private syncOtherPlugins(color: string) {
    const hsva = this.ewColorPicker.hsvaColor;
    
    // 同步颜色模式插件的输入框
    const colorModePlugin = this.ewColorPicker.plugins?.ewColorPickerColorMode;
    if (colorModePlugin && colorModePlugin.currentMode !== 'hex') {
      colorModePlugin.updateInputValues(color);
    }

    // 同步色相滑块
    const huePlugin = this.ewColorPicker.plugins?.ewColorPickerHue;
    if (huePlugin && huePlugin.updateHueThumbPosition) {
      huePlugin.updateHueThumbPosition(hsva.h);
    }

    // 同步透明度滑块
    const alphaPlugin = this.ewColorPicker.plugins?.ewColorPickerAlpha;
    if (alphaPlugin && alphaPlugin.updateAlphaThumbPosition) {
      alphaPlugin.updateAlphaThumbPosition(hsva.a);
    }

    // 同步面板插件
    const panelPlugin = this.ewColorPicker.plugins?.ewColorPickerPanel;
    if (panelPlugin && panelPlugin.updatePanelColor) {
      panelPlugin.updatePanelColor(color);
    }

    // 同步颜色框
    const boxPlugin = this.ewColorPicker.plugins?.ewColorPickerBox;
    if (boxPlugin && boxPlugin.setBoxBgColor) {
      boxPlugin.setBoxBgColor(color);
    }
  }

  setValue(value: string) {
    if (this.input) {
      this.input.value = value;
    }
  }

  getValue(): string {
    return this.input ? this.input.value : '';
  }

  setDisabled(disabled: boolean) {
    if (!this.input) return;

    if (disabled) {
      this.input.disabled = true;
      if (!hasClass(this.input, `${this.prefix}input-disabled`)) {
        addClass(this.input, `${this.prefix}input-disabled`);
      }
    } else {
      this.input.disabled = false;
      if (hasClass(this.input, `${this.prefix}input-disabled`)) {
        removeClass(this.input, `${this.prefix}input-disabled`);
      }
    }
  }

  update(color: string) {
    // 检查颜色是否有效
    if (!color || color.indexOf('NaN') !== -1) {
      // 如果颜色无效且没有设置 defaultColor，不设置默认颜色
      if (this.ewColorPicker.currentColor === '') {
        color = '';
      } else {
        color = this.getDefaultColor();
      }
    }
    
    // 格式化颜色显示
    const displayColor = this.formatColorForDisplay(color);
    this.setValue(displayColor);
  }

  // 获取默认颜色
  private getDefaultColor(): string {
    if (this.hasAlpha) {
      return 'rgba(255,0,0,1)';
    } else if (this.ewColorPicker.plugins?.ewColorPickerColorMode) {
      // 如果集成了颜色模式插件，根据当前模式设置格式
      const currentMode = this.ewColorPicker.currentMode || 'HSV';
      if (currentMode === 'HSL') {
        return 'hsl(0, 100%, 50%)';
      }else if(currentMode === 'RGB'){
        return 'rgba(255,0,0,1)';
      } else {
        return '#ff0000';
      }
    } else {
      return '#ff0000';
    }
  }

  // 格式化颜色用于显示
  private formatColorForDisplay(color: string): string {
    if (!color) return '';
    
    const hasColorModePlugin = !!this.ewColorPicker.plugins?.ewColorPickerColorMode;
    let displayColor = color;
    
    if (hasColorModePlugin) {
      const colorModePlugin = this.ewColorPicker.plugins.ewColorPickerColorMode;
      if (colorModePlugin && colorModePlugin.getCurrentMode() === 'hex') {
        // HEX 模式下，将颜色转换为 HEX 格式显示
        if (displayColor && !displayColor.startsWith('#')) {
          const rgbaString = colorToRgba(displayColor);
          if (rgbaString) {
            const rgba = parseRgbaString(rgbaString);
            if (rgba) {
              displayColor = rgbaToHex(rgba);
            }
          }
        }
      } else if (this.hasAlpha && !color.startsWith('rgba')) {
        // 如果开启了 alpha 但颜色不是 rgba 格式，转换为 rgba
        const hsva = colorRgbaToHsva(color);
        displayColor = colorHsvaToRgba(hsva);
      } else if (!this.hasAlpha && color.startsWith('rgba')) {
        // 如果没有开启 alpha 但颜色是 rgba 格式，转换为 hex
        displayColor = colorRgbaToHex(color);
      }
    } else {
      // 没有集成颜色模式插件时的原有逻辑
      if (this.hasAlpha && !color.startsWith('rgba')) {
        // 如果开启了 alpha 但颜色不是 rgba 格式，转换为 rgba
        const hsva = colorRgbaToHsva(color);
        displayColor = colorHsvaToRgba(hsva);
      } else if (!this.hasAlpha && color.startsWith('rgba')) {
        // 如果没有开启 alpha 但颜色是 rgba 格式，转换为 hex
        displayColor = colorRgbaToHex(color);
      }
    }
    
    return displayColor;
  }

  destroy() {
    if (this.input) {
      off(this.input, 'blur', this.debouncedOnInputColor as unknown as EventListener);
      off(this.input, 'keydown', this.debouncedOnInputColor as unknown as EventListener);
    }
    
    // 清理DOM引用
    this.input = null;
  }

  // 新增 install 方法，便于测试
  install(core: ewColorPicker) {
    this.ewColorPicker = core;
    this.handleOptions();
    
    // 注册事件监听器
    if (isFunction(core?.on)) {
      core.on('change', (color: string) => {
        // 当颜色改变时，更新输入框
        this.update(color);
      });
    }
    
    this.run?.();
  }
}

declare module "@ew-color-picker/core" {
  interface CustomOptions {
    ewColorPickerInput: InputOptions;
  }
} 