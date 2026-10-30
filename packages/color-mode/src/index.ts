import ewColorPicker from "@ew-color-picker/core";
import {
  on,
  setStyle,
  addClass,
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
} from "@ew-color-picker/utils";
import { 
  colorToRgba, 
  isValidColor,
  rgbaToHex,
  rgbToHsl,
  parseRgbaString
} from "@ew-color-picker/utils";
import { ewColorPickerOptions } from "@ew-color-picker/core";
import { upArrowIcon, downArrowIcon } from "@ew-color-picker/utils";
import { InputNumber } from "@ew-color-picker/input-number";

// 颜色模式类型 - 只支持三种模式
export type ColorMode = 'hex' | 'rgb' | 'hsl';

export interface ColorModeOptions {
  defaultMode?: ColorMode;
  changeMode?: Function;
  showColorMode?: boolean; // 是否显示颜色模式切换器
}

export default class ewColorPickerColorModePlugin {
  static pluginName = "ewColorPickerColorMode";
  static applyOrder = ApplyOrder.Post;
  options: ColorModeOptions & Omit<ewColorPickerOptions, "el"> = {} as ColorModeOptions & Omit<ewColorPickerOptions, "el">;
  
  // 当前颜色模式
  currentMode: ColorMode = 'hex';
  
  // 颜色模式切换容器
  modeContainer: HTMLElement | null = null;
  
  // 模式显示文本
  modeText: HTMLElement | null = null;
  
  // 上箭头按钮
  upButton: HTMLButtonElement | null = null;
  
  // 下箭头按钮
  downButton: HTMLButtonElement | null = null;
  
  // 防抖处理模式切换事件
  private debouncedOnModeChange: (mode: ColorMode) => void;
  
  // 防抖处理颜色更新事件
  private debouncedUpdateColorFromRgb: () => void;
  private debouncedUpdateColorFromHsl: () => void;
  
  // 事件处理函数引用，用于正确解绑
  private boundEventHandlers: Array<{ element: HTMLElement; event: string; handler: EventListener }> = [];
  
  // 缓存插件引用，避免重复查询
  private get hasAlphaPlugin(): boolean {
    return !!this.ewColorPicker.plugins?.ewColorPickerAlpha;
  }
  
  private get inputPlugin() {
    return this.ewColorPicker.plugins?.ewColorPickerInput;
  }
  
  private get alphaPlugin() {
    return this.ewColorPicker.plugins?.ewColorPickerAlpha;
  }

  constructor(public ewColorPicker: ewColorPicker) {
    // 初始化防抖函数
    this.debouncedOnModeChange = debounce(this.onModeChange.bind(this), 100);
    this.debouncedUpdateColorFromRgb = debounce(this.updateColorFromRgbInputs.bind(this), 100);
    this.debouncedUpdateColorFromHsl = debounce(this.updateColorFromHslInputs.bind(this), 100);
    
    // 初始化插件
    this.initializePlugin();
  }
  
  private initializePlugin() {
    const initialize = () => {
      this.handleOptions();
      this.run();
    };
    
    if (this.ewColorPicker.plugins) {
      initialize();
    } else {
      setTimeout(initialize, 0);
    }
  }

  install(core: any) {
    this.ewColorPicker = core;
    
    const setupPlugin = () => {
      this.handleOptions();
      
      // 注册事件监听器
      if (core.on && isFunction(core.on)) {
        core.on('change', (color: string) => {
          if (this.currentMode !== 'hex') {
            this.updateInputValues(color);
          }
        });
      }
      
      this.run?.();
      
      // 如果集成了alpha插件且当前模式是rgb，立即创建对应的输入框结构
      if (this.hasAlphaPlugin && this.currentMode === 'rgb') {
        this.updateInputStructure();
      }
    };
    
    if (this.ewColorPicker.plugins) {
      setupPlugin();
    } else {
      setTimeout(setupPlugin, 0);
    }
  }

  handleOptions() {
    if (this.ewColorPicker && this.ewColorPicker.options) {
      this.options = extend({}, this.options, this.ewColorPicker.options);
      
      // 处理color-mode插件的选项
      if (this.ewColorPicker.options.ewColorPickerColorMode !== undefined) {
        if (this.ewColorPicker.options.ewColorPickerColorMode === false) {
          // 如果ewColorPickerColorMode设置为false，则禁用颜色模式
          this.options.showColorMode = false;
        } else if (typeof this.ewColorPicker.options.ewColorPickerColorMode === 'object') {
          // 如果是对象，则合并选项
          this.options = extend({}, this.options, this.ewColorPicker.options.ewColorPickerColorMode);
        }
      }
      
      // 如果集成了alpha插件，默认使用rgba模式；否则使用hex模式
      if (this.hasAlphaPlugin) {
        this.currentMode = this.options.defaultMode || 'rgb';
      } else {
        this.currentMode = this.options.defaultMode || 'hex';
      }
    }
  }

  // 更新配置并重新渲染
  updateOptions(): void {
    this.handleOptions();
    this.render();
  }

  run() {
    // 确保选项已处理
    this.handleOptions();
    
    // 检查是否显示颜色模式
    if (this.options.showColorMode === false) {
      return;
    }
    
    this.render();
    this.bindEvents();
    
    // 如果集成了alpha插件且当前模式是rgb，立即创建对应的输入框结构
    if (this.hasAlphaPlugin && this.currentMode === 'rgb') {
      this.updateInputStructure();
    }
    
    // 设置input插件状态监听
    this.setupInputPluginListener();
  }

  render() {
    // 查找面板容器
    const panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
    if (!panelContainer) {
      warn('[ewColorPicker] Panel container not found');
      return;
    }
    
    // 查找已存在的颜色模式容器，避免重复插入
    this.modeContainer = $('.ew-color-picker-mode-container', panelContainer);
    if (!this.modeContainer) {
      this.createModeContainer(panelContainer);
    }
    
    // 更新模式显示
    this.updateModeDisplay();
  }

  createModeContainer(panelContainer: HTMLElement) {
    this.modeContainer = create('div');
    addClass(this.modeContainer, 'ew-color-picker-mode-container');

    // 创建上箭头按钮
    this.upButton = create<HTMLButtonElement>('button');
    addClass(this.upButton, 'ew-color-picker-mode-up-btn');
    setAttr(this.upButton, {
      type: 'button',
      title: '上一个模式'
    });
    this.upButton.innerHTML = upArrowIcon('', 16);

    // 创建模式文本显示
    this.modeText = create('div');
    addClass(this.modeText, 'ew-color-picker-mode-text');

    // 创建下箭头按钮
    this.downButton = create<HTMLButtonElement>('button');
    addClass(this.downButton, 'ew-color-picker-mode-down-btn');
    setAttr(this.downButton, {
      type: 'button',
      title: '下一个模式'
    });
    this.downButton.innerHTML = downArrowIcon('', 16);

    // 组装模式切换器
    insertNode(this.modeContainer, this.upButton);
    insertNode(this.modeContainer, this.modeText);
    insertNode(this.modeContainer, this.downButton);

    // 查找 bottomRow，插入到其之前
    const bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
    if (bottomRow) {
      insertNode(panelContainer, this.modeContainer, undefined, bottomRow);
    } else {
      insertNode(panelContainer, this.modeContainer);
    }
  }

  updateModeDisplay() {
    if (this.modeText) {
      this.modeText.textContent = this.getModeDisplayName(this.currentMode);
    }
  }

  bindEvents() {
    if (!this.upButton || !this.downButton) return;

    // 上箭头按钮事件
    const upClickHandler = () => {
      // 检查禁用状态
      if (this.options.disabled) {
        return;
      }
      this.switchToPreviousMode();
    };
    
    on(this.upButton, 'click', upClickHandler);
    this.boundEventHandlers.push({ element: this.upButton, event: 'click', handler: upClickHandler });

    // 下箭头按钮事件
    const downClickHandler = () => {
      // 检查禁用状态
      if (this.options.disabled) {
        return;
      }
      this.switchToNextMode();
    };
    
    on(this.downButton, 'click', downClickHandler);
    this.boundEventHandlers.push({ element: this.downButton, event: 'click', handler: downClickHandler });

    // 添加悬停效果
    if (this.upButton) {
      on(this.upButton, 'mouseenter', this.handleUpButtonHover);
      on(this.upButton, 'mouseleave', this.handleUpButtonLeave);
      this.boundEventHandlers.push({ element: this.upButton, event: 'mouseenter', handler: this.handleUpButtonHover });
      this.boundEventHandlers.push({ element: this.upButton, event: 'mouseleave', handler: this.handleUpButtonLeave });
    }

    if (this.downButton) {
      on(this.downButton, 'mouseenter', this.handleDownButtonHover);
      on(this.downButton, 'mouseleave', this.handleDownButtonLeave);
      this.boundEventHandlers.push({ element: this.downButton, event: 'mouseenter', handler: this.handleDownButtonHover });
      this.boundEventHandlers.push({ element: this.downButton, event: 'mouseleave', handler: this.handleDownButtonLeave });
    }

    // 监听颜色变化事件，更新显示（只在非 hex 模式下）
    const changeHandler = (color: string) => {
      if (this.currentMode !== 'hex') {
        this.updateInputValues(color);
      }
    };
    
    this.ewColorPicker.on('change', changeHandler);
    // 注意：这里不添加到 boundEventHandlers，因为这是 ewColorPicker 的事件，不是 DOM 事件
  }

  switchToPreviousMode() {
    const modes: ColorMode[] = ['hex', 'rgb', 'hsl'];
    const currentIndex = modes.indexOf(this.currentMode);
    const previousIndex = currentIndex > 0 ? currentIndex - 1 : modes.length - 1;
    this.debouncedOnModeChange(modes[previousIndex]);
  }

  switchToNextMode() {
    const modes: ColorMode[] = ['hex', 'rgb', 'hsl'];
    const currentIndex = modes.indexOf(this.currentMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    this.debouncedOnModeChange(modes[nextIndex]);
  }

  onModeChange(mode: ColorMode) {
    this.currentMode = mode;
    
    // 更新模式显示
    this.updateModeDisplay();
    
    // 更新输入框
    this.updateInputStructure();
    
    // 更新当前颜色的显示
    // HEX 模式的输入框已由 restoreDefaultInput 创建并格式化为 #xxxxxx，
    // 这里不再重复设置、也不再触发 change，避免把 HEX 显示覆盖成 rgba/hsla 字符串
    const currentColor = this.ewColorPicker.getColor();
    if (currentColor && mode !== 'hex') {
      // RGB 或 HSL 模式下，更新对应的输入框值
      this.updateInputValues(currentColor);
    }
    
    // 触发模式改变回调
    if (isFunction(this.options.changeMode)) {
      this.options.changeMode?.(mode, this.ewColorPicker);
    }
    
    // 触发事件
    this.ewColorPicker.trigger('mode-change', mode);
  }

  updateInputStructure() {
    const panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
    if (!panelContainer) return;

    // 查找 input 容器
    const bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
    if (!bottomRow) return;
    
    const inputContainer = $('.ew-color-picker-input-container', bottomRow);
    if (!inputContainer) return;

    // 检查input插件是否被禁用
    if (this.inputPlugin && !this.inputPlugin.hasInput) {
      // 如果input插件被禁用，清空容器但不创建任何输入框
      inputContainer.innerHTML = '';
      return;
    }

    // 根据模式创建新的输入框
    if (this.currentMode === 'hex') {
      // hex 模式下，恢复默认的 input 插件
      this.restoreDefaultInput();
    } else {
      // rgb 或 hsl 模式下，清空容器并创建多输入框
      inputContainer.innerHTML = '';
      this.createInputsForMode(inputContainer);
    }
  }

  // 设置input插件状态监听
  private setupInputPluginListener(): void {
    // 移除定时器检查，避免在测试环境中出现异常
    // 改为在需要时检查插件状态
  }
  
  createInputsForMode(container: HTMLElement) {
    // 检查input插件是否被禁用
    if (this.inputPlugin && !this.inputPlugin.hasInput) {
      // 如果input插件被禁用，不创建任何输入框
      return;
    }
    
    // 清空容器
    container.innerHTML = '';
    
    // 计算模式和标签
    let labels: string[] = [];
    if (this.currentMode === 'rgb') {
      labels = this.hasAlphaPlugin ? ['R', 'G', 'B', 'A'] : ['R', 'G', 'B'];
    } else if (this.currentMode === 'hsl') {
      labels = this.hasAlphaPlugin ? ['H', 'S', 'L', 'A'] : ['H', 'S', 'L'];
    }
    
    // 创建包裹区
    const group = create('div');
    addClass(group, 'ew-color-picker-inputs-group');
    
    // 每个输入框及其label
    labels.forEach((label, idx) => {
      const col = create('div');
      addClass(col, 'ew-color-picker-inputs-col');
      
      // label
      const lab = create('div');
      addClass(lab, 'ew-color-picker-input-label');
      lab.textContent = label;
      insertNode(col, lab);
      
      // input
      let input: HTMLElement | undefined;
      
      if (this.currentMode === 'rgb') {
        // RGB模式：使用InputNumber组件
        const inputNumber = new InputNumber({
          value: 0,
          min: idx === 3 ? 0 : 0,  // A通道最小值0
          max: idx === 3 ? 1 : 255, // A通道最大值1，RGB通道最大值255
          step: idx === 3 ? 0.01 : 1, // A通道步长0.01，RGB通道步长1
          precision: idx === 3 ? 2 : 0, // A通道精度2位小数，RGB通道整数
          placeholder: label,
          size: 'small',
          onChange: () => {
            this.debouncedUpdateColorFromRgb();
          }
        });
        input = inputNumber.getElement();
        addClass(input, `ew-color-picker-rgb-${label.toLowerCase()}-input`);
      } else if (this.currentMode === 'hsl') {
        // HSL模式：H使用InputNumber，S和L使用普通input，A使用InputNumber
        if (idx === 0) {
          // H通道：0-360度
          const inputNumber = new InputNumber({
            value: 0,
            min: 0,
            max: 360,
            step: 1,
            precision: 0,
            placeholder: label,
            size: 'small',
            onChange: () => {
              this.debouncedUpdateColorFromHsl();
            }
          });
          input = inputNumber.getElement();
        } else if (idx === 3 && this.hasAlphaPlugin) {
          // A通道：0-1
          const inputNumber = new InputNumber({
            value: 0,
            min: 0,
            max: 1,
            step: 0.01,
            precision: 2,
            placeholder: label,
            size: 'small',
            onChange: () => {
              this.debouncedUpdateColorFromHsl();
            }
          });
          input = inputNumber.getElement();
        } else {
          // S和L通道：0-100%
          input = create<HTMLInputElement>('input');
          setAttr(input, {
            type: 'text',
            placeholder: label,
            class: `ew-color-picker-hsl-${label.toLowerCase()}-input ew-color-picker-input`
          });
        }
        
        // 确保input变量已定义并添加样式类
        if (input) {
          addClass(input, `ew-color-picker-hsl-${label.toLowerCase()}-input`);
        }
      }
      
      // 确保input变量已定义
      if (!input) {
        // 如果所有条件都没有匹配，创建一个默认输入框
        input = create<HTMLInputElement>('input');
        setAttr(input, {
          type: 'text',
          placeholder: label,
          class: `ew-color-picker-default-input`
        });
      }
      
      insertNode(col, input);
      insertNode(group, col);
    });
    
    insertNode(container, group);
    
    // 创建完输入框后，立即更新值
    const currentColor = this.ewColorPicker.getColor();
    if (currentColor) {
      this.updateInputValues(currentColor);
    }
  }

  // 获取当前实例的输入框容器，用于限定查询范围
  private getInputContainer(): HTMLElement | Document {
    const panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
    if (!panelContainer) return document;

    const bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
    if (!bottomRow) return document;

    return ($('.ew-color-picker-input-container', bottomRow) as HTMLElement) || document;
  }

  updateInputValues(color: string) {
    if (!color) return;

    const rgbaString = colorToRgba(color);
    if (!rgbaString) return;

    // 解析 RGBA 字符串为对象
    const rgba = parseRgbaString(rgbaString);
    if (!rgba) return;

    // 限定在当前实例的输入容器内查找，避免多实例互相覆盖
    const scope = this.getInputContainer();

    if (this.currentMode === 'rgb') {
      // 查找RGB输入框
      const rInput = $('.ew-color-picker-rgb-r-input input', scope) as HTMLInputElement;
      const gInput = $('.ew-color-picker-rgb-g-input input', scope) as HTMLInputElement;
      const bInput = $('.ew-color-picker-rgb-b-input input', scope) as HTMLInputElement;
      const aInput = $('.ew-color-picker-rgb-a-input input', scope) as HTMLInputElement;

      // 更新值
      if (rInput) rInput.value = Math.round(rgba.r).toString();
      if (gInput) gInput.value = Math.round(rgba.g).toString();
      if (bInput) bInput.value = Math.round(rgba.b).toString();
      if (aInput) aInput.value = rgba.a.toFixed(2);
    } else if (this.currentMode === 'hsl') {
      const hsl = rgbToHsl(rgba.r, rgba.g, rgba.b);
      
      // 查找HSL输入框
      const hInput = $('.ew-color-picker-hsl-h-input input', scope) as HTMLInputElement;
      const sInput = $('.ew-color-picker-hsl-s-input', scope) as HTMLInputElement;
      const lInput = $('.ew-color-picker-hsl-l-input', scope) as HTMLInputElement;
      const aInput = $('.ew-color-picker-hsl-a-input input', scope) as HTMLInputElement;

      // 更新值
      if (hInput) hInput.value = Math.round(hsl.h).toString();
      if (sInput) sInput.value = Math.round(hsl.s).toString() + '%';
      if (lInput) lInput.value = Math.round(hsl.l).toString() + '%';
      if (aInput) aInput.value = rgba.a.toFixed(2);
    }
  }

  updateColorFromRgbInputs() {
    // 限定在当前实例的输入容器内查找，避免多实例互相覆盖
    const scope = this.getInputContainer();
    const rInput = $('.ew-color-picker-rgb-r-input input', scope) as HTMLInputElement;
    const gInput = $('.ew-color-picker-rgb-g-input input', scope) as HTMLInputElement;
    const bInput = $('.ew-color-picker-rgb-b-input input', scope) as HTMLInputElement;
    const aInput = $('.ew-color-picker-rgb-a-input input', scope) as HTMLInputElement;

    if (!rInput || !gInput || !bInput) return;

    const r = parseInt(rInput.value) || 0;
    const g = parseInt(gInput.value) || 0;
    const b = parseInt(bInput.value) || 0;
    const a = aInput ? parseFloat(aInput.value) || 1 : 1;

    const color = `rgba(${r}, ${g}, ${b}, ${a})`;

    // 更新颜色，这会触发 change 事件，alpha 滑块会自动更新
    this.ewColorPicker.setColor(color);

    // 同步所有插件
    this.ewColorPicker.syncAllPlugins(color);
    
    // 确保 alpha 滑块位置同步更新
    if (this.alphaPlugin && this.alphaPlugin.updateAlphaThumbPosition) {
      this.alphaPlugin.updateAlphaThumbPosition(a);
    }
  }

  updateColorFromHslInputs() {
    // 限定在当前实例的输入容器内查找，避免多实例互相覆盖
    const scope = this.getInputContainer();
    const hInput = $('.ew-color-picker-hsl-h-input input', scope) as HTMLInputElement;
    const sInput = $('.ew-color-picker-hsl-s-input', scope) as HTMLInputElement;
    const lInput = $('.ew-color-picker-hsl-l-input', scope) as HTMLInputElement;
    const aInput = $('.ew-color-picker-hsl-a-input input', scope) as HTMLInputElement;

    if (!hInput || !sInput || !lInput) return;

    const h = parseInt(hInput.value) || 0;
    // 解析带 % 后缀的 S 和 L 值
    const s = parseInt(sInput.value.replace('%', '')) || 0;
    const l = parseInt(lInput.value.replace('%', '')) || 0;
    const a = aInput ? parseFloat(aInput.value) || 1 : 1;

    const color = `hsla(${h}, ${s}%, ${l}%, ${a})`;
    
    // 更新颜色，这会触发 change 事件，alpha 滑块会自动更新
    this.ewColorPicker.setColor(color);
    
    // 同步所有插件
    this.ewColorPicker.syncAllPlugins(color);
    
    // 确保 alpha 滑块位置同步更新
    if (this.alphaPlugin && this.alphaPlugin.updateAlphaThumbPosition) {
      this.alphaPlugin.updateAlphaThumbPosition(a);
    }
  }

  getModeDisplayName(mode: ColorMode): string {
    const names = {
      hex: 'HEX',
      rgb: 'RGB',
      hsl: 'HSL'
    };
    return names[mode] || mode.toUpperCase();
  }

  getCurrentMode(): ColorMode {
    return this.currentMode;
  }

  setMode(mode: ColorMode) {
    this.debouncedOnModeChange(mode);
  }

  // 恢复默认的 input 插件
  restoreDefaultInput() {
    const panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
    if (!panelContainer) return;

    const bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
    if (!bottomRow) return;
    
    const inputContainer = $('.ew-color-picker-input-container', bottomRow);
    if (!inputContainer) return;

    // 检查input插件是否被禁用
    if (this.inputPlugin && !this.inputPlugin.hasInput) {
      // 如果input插件被禁用，清空容器但不创建任何输入框
      inputContainer.innerHTML = '';
      return;
    }

    // 清空容器，移除所有 rgba/hsl 模式相关的 DOM
    inputContainer.innerHTML = '';

    // 恢复 input 容器的默认样式
    addClass(inputContainer, 'ew-color-picker-input-container-flex');

    // 创建默认的 input 元素
    const input = create<HTMLInputElement>('input');
    addClass(input, 'ew-color-picker-input');
    addClass(input, 'ew-color-picker-input-default');
    setAttr(input, {
      type: 'text',
      name: 'ew-color-picker-input',
      placeholder: '请输入颜色值'
    });

    // 插入到容器中
    insertNode(inputContainer, input);

    // 设置当前颜色值，如果没有则不设置默认颜色
    let currentColor = this.ewColorPicker.getColor();
    
    if (!currentColor || currentColor.indexOf('NaN') !== -1) {
      // 不设置默认颜色，让输入框保持空白
      currentColor = '';
    }
    
    // 在 HEX 模式下，将颜色转换为 HEX 格式显示
    if (this.currentMode === 'hex') {
              const rgbaString = colorToRgba(currentColor);
      if (rgbaString) {
        const rgba = parseRgbaString(rgbaString);
        if (rgba) {
          // 转换为 HEX 格式
          const hexColor = rgbaToHex(rgba);
          input.value = hexColor;
        } else {
          input.value = currentColor;
        }
      } else {
        input.value = currentColor;
      }
    } else {
      input.value = currentColor;
    }

    // 绑定默认 input 插件的事件
    this.bindDefaultInputEvents(input);
  }

  // 绑定默认 input 插件的事件
  bindDefaultInputEvents(input: HTMLInputElement) {
    this.bindInputEvents(input);
  }

  // 重新绑定默认 input 插件的事件
  rebindDefaultInputEvents() {
    const panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
    if (!panelContainer) return;

    const bottomRow = $('.ew-color-picker-bottom-row', panelContainer);
    if (!bottomRow) return;
    
    const inputContainer = $('.ew-color-picker-input-container', bottomRow);
    if (!inputContainer) return;

    // 查找 hex 输入框
    const hexInput = $('.ew-color-picker-hex-input', inputContainer) as HTMLInputElement;
    if (!hexInput) return;

    // 使用统一的事件绑定函数
    this.bindInputEvents(hexInput);
  }

  // 统一的事件绑定函数
  private bindInputEvents(input: HTMLInputElement) {
    // 失焦事件
    const blurHandler = (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      if (isValidColor(value)) {
        this.ewColorPicker.setColor(value);
        // 同步更新其他插件的状态
        this.syncOtherPlugins(value);
      }
    };
    
    on(input, 'blur', blurHandler);
    this.boundEventHandlers.push({ element: input, event: 'blur', handler: blurHandler });

    // 回车事件
    const keydownHandler = (event: Event) => {
      const keyboardEvent = event as KeyboardEvent;
      if (keyboardEvent.key === 'Enter') {
        const value = (keyboardEvent.target as HTMLInputElement).value;
        if (isValidColor(value)) {
          this.ewColorPicker.setColor(value);
          // 同步更新其他插件的状态
          this.syncOtherPlugins(value);
        }
      }
    };
    
    on(input, 'keydown', keydownHandler);
    this.boundEventHandlers.push({ element: input, event: 'keydown', handler: keydownHandler });

    // 监听颜色变化事件，自动更新输入框
    const changeHandler = (color: string) => {
      input.value =
        this.currentMode === 'hex' ? this.toHexDisplay(color) : color;
    };
    
    this.ewColorPicker.on('change', changeHandler);
  }

  // 将任意颜色格式转换为 HEX 显示（alpha 模式下也统一显示 6 位 HEX）
  private toHexDisplay(color: string): string {
    if (!color) return '';
    if (color.startsWith('#')) return color;

    const rgbaString = colorToRgba(color);
    if (!rgbaString) return color;

    const rgba = parseRgbaString(rgbaString);
    return rgba ? rgbaToHex(rgba) : color;
  }

  // 同步其他插件的状态
  private syncOtherPlugins(color: string) {
    const hsva = this.ewColorPicker.hsvaColor;
    
    // 同步主输入框
    if (this.inputPlugin && this.inputPlugin.update) {
      this.inputPlugin.update(color);
    }

    // 同步色相滑块
    const huePlugin = this.ewColorPicker.plugins?.ewColorPickerHue;
    if (huePlugin && huePlugin.updateHueThumbPosition) {
      huePlugin.updateHueThumbPosition(hsva.h);
    }

    // 同步透明度滑块
    if (this.alphaPlugin && this.alphaPlugin.updateAlphaThumbPosition) {
      this.alphaPlugin.updateAlphaThumbPosition(hsva.a);
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

  destroy() {
    // 移除所有绑定的事件监听器
    this.boundEventHandlers.forEach(({ element, event, handler }) => {
      off(element, event, handler);
    });
    this.boundEventHandlers = [];

    // 移除模式切换器
    if (this.modeContainer && this.modeContainer.parentNode) {
      removeElement(this.modeContainer);
    }

    // 清理引用
    this.modeContainer = null;
    this.modeText = null;
    this.upButton = null;
    this.downButton = null;
  }

  // 提取悬停事件处理函数，便于正确移除事件监听
  private handleUpButtonHover = () => {
    if (this.upButton) {
      setStyle(this.upButton, {
        borderColor: '#4096ef',
        backgroundColor: '#f0f8ff'
      });
    }
  };

  private handleUpButtonLeave = () => {
    if (this.upButton) {
      setStyle(this.upButton, {
        borderColor: '#ddd',
        backgroundColor: '#fff'
      });
    }
  };

  private handleDownButtonHover = () => {
    if (this.downButton) {
      setStyle(this.downButton, {
        borderColor: '#4096ef',
        backgroundColor: '#f0f8ff'
      });
    }
  };

  private handleDownButtonLeave = () => {
    if (this.downButton) {
      setStyle(this.downButton, {
        borderColor: '#ddd',
        backgroundColor: '#fff'
      });
    }
  };
}

// 扩展主包选项类型
declare module "@ew-color-picker/core" {
  interface CustomOptions {
    ewColorPickerColorMode: ColorModeOptions;
  }
} 