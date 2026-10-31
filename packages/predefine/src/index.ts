import ewColorPicker from "@ew-color-picker/core";
import {
  on,
  addClass,
  removeClass,
  isFunction,
  warn,
  create,
  extend,
  $,
  setStyle,
  isString,
  isObject,
  debounce,
  off,
  insertNode,
  ApplyOrder,
  hasClass,
  isStrictColorFormat, // 新增严格颜色格式校验
  getPrefix
} from "@ew-color-picker/utils";
import { colorRgbaToHsva, colorToRgba, isValidColor, isAlphaColor } from "@ew-color-picker/utils";
import { ewColorPickerOptions } from "@ew-color-picker/core";

export interface PredefineColor {
  color: string;
  disabled?: boolean;
}

export interface PredefineOptions {
  predefineColor?: string[] | PredefineColor[];
  changeColor?: Function;
}

export default class ewColorPickerPredefinePlugin {
  static pluginName = "ewColorPickerPredefine";
  options: PredefineOptions & Omit<ewColorPickerOptions, "el"> = {} as any;
  predefineItems: HTMLElement[] = [];
  container: HTMLElement | null = null;
  
  // 防抖处理颜色点击事件
  private debouncedOnPredefineColorClick: (event: Event, color: string) => void;
  // 面板切换事件处理器
  private toggleHandler: ((isOpen: boolean) => void) | null = null;
  // 颜色变化事件处理器
  private changeHandler: ((color: string) => void) | null = null;
  // 标记是否已绑定事件
  private isEventBound: boolean = false;

  private get prefix(): string {
    return getPrefix(this.ewColorPicker);
  }

  constructor(public ewColorPicker: ewColorPicker) {
    this.handleOptions();
    // 初始化防抖函数
    this.debouncedOnPredefineColorClick = debounce(this.onPredefineColorClick.bind(this), 100);
    this.run();
  }

  handleOptions() {
    if (this.ewColorPicker && this.ewColorPicker.options) {
      this.options = extend(this.options, this.ewColorPicker.options);
      
      // 处理嵌套的 ewColorPickerPredefine 配置
      if (this.ewColorPicker.options.ewColorPickerPredefine) {
        this.options = extend(this.options, this.ewColorPicker.options.ewColorPickerPredefine);
      }
    }
  }

  run() {
    // 检查是否显示预定义颜色：只根据 predefineColor 数组判断
    const validColors = this.getValidPredefineColors();
    if (validColors.length > 0) {
      this.render();
      this.bindEvents();
      this.bindColorChangeEvent();
    }
  }

  // 获取有效的预定义颜色数组
  private getValidPredefineColors(): (string | PredefineColor)[] {
    if (!this.options.predefineColor || !Array.isArray(this.options.predefineColor)) {
      return [];
    }
    
    // 过滤掉无效的颜色
    return this.options.predefineColor.filter(colorData => {
      const { color } = this.parseColorData(colorData);
      
      // 使用更严格的颜色验证
      return isStrictColorFormat(color);
    });
  }

  render() {
    // 直接使用面板容器
    const panelContainer = this.ewColorPicker.getMountPoint('panelContainer');
    if (!panelContainer) {
      warn('[ewColorPicker warning]: Panel container not found');
      return;
    }
    
    // 查找或创建预定义色块容器
    this.container = $(`.${this.prefix}color-picker-predefine-container`, panelContainer);
    if (!this.container) {
      this.container = create('div');
      addClass(this.container, `${this.prefix}color-picker-predefine-container`);
    }
    
    // 清空旧内容
    if (this.container) {
      this.container.textContent = '';
      this.predefineItems = [];
      
      // 获取有效的预定义颜色
      const validColors = this.getValidPredefineColors();
      
      // 渲染预定义色块
      validColors.forEach((colorData) => {
        const { color } = this.parseColorData(colorData);
        const item = create('div');
        addClass(item, `${this.prefix}color-picker-predefine-color`);
        const colorItem = create('div');
        addClass(colorItem, `${this.prefix}color-picker-predefine-color-item`);
        setStyle(colorItem, 'backgroundColor', color);
        insertNode(item, colorItem);
        insertNode(this.container!, item);
        this.predefineItems.push(item);
      });
    }

    // 每次渲染后都强制重新插入到正确位置
    this.ensureContainerAtCorrectPosition(panelContainer);

    // 绑定面板切换事件（避免重复绑定）
    this.bindToggleEvent(panelContainer);
  }

  // 解析颜色数据
  private parseColorData(colorData: string | PredefineColor) {
    const color = isString(colorData) ? colorData : colorData.color;
    const disabled = isObject(colorData) ? colorData.disabled : false;
    return { color, disabled };
  }

  // 绑定面板切换事件（避免重复绑定）
  private bindToggleEvent(panelContainer: HTMLElement) {
    // 如果已经绑定过事件，先解绑
    if (this.isEventBound && this.toggleHandler) {
      this.ewColorPicker.off('toggle', this.toggleHandler);
      this.isEventBound = false;
    }
    
    // 创建新的事件处理器
    this.toggleHandler = (isOpen: boolean) => {
      if (isOpen) {
        this.ensureContainerAtCorrectPosition(panelContainer);
      }
    };
    
    // 绑定事件
    this.ewColorPicker.on('toggle', this.toggleHandler);
    this.isEventBound = true;
  }

  // 绑定颜色变化事件
  private bindColorChangeEvent() {
    // 如果已经绑定过颜色变化事件，先解绑
    if (this.changeHandler) {
      this.ewColorPicker.off('change', this.changeHandler);
    }
    
    // 创建颜色变化事件处理器
    this.changeHandler = (color: string) => {
      this.updateActivePredefineColor(color);
    };
    
    // 绑定事件
    this.ewColorPicker.on('change', this.changeHandler);
  }

  // 确保容器在正确位置
  private ensureContainerAtCorrectPosition(panelContainer: HTMLElement) {
    if (!this.container) return;

    const p = this.prefix;
    // 优先级1: mode-container
    const modeContainer = $(`.${p}color-picker-mode-container`, panelContainer);
    if (modeContainer) {
      panelContainer.insertBefore(this.container, modeContainer);
      return;
    }

    // 优先级2: bottom-row
    const bottomRow = $(`.${p}color-picker-bottom-row`, panelContainer);
    if (bottomRow) {
      panelContainer.insertBefore(this.container, bottomRow);
      return;
    }

    // 优先级3: panel 之后
    const panel = $(`.${p}color-picker-panel`, panelContainer);
    if (panel && panel.nextSibling) {
      panelContainer.insertBefore(this.container, panel.nextSibling);
      return;
    }
    if (panel) {
      panelContainer.appendChild(this.container);
      return;
    }

    // 兜底：插到最后
    panelContainer.appendChild(this.container);
  }

  bindEvents() {
   
    this.predefineItems.forEach((item, index) => {
      const validColors = this.getValidPredefineColors();
      const colorData = validColors[index];
      const { color, disabled } = this.parseColorData(colorData);

      if (disabled) {
        addClass(item, `${this.prefix}color-picker-predefine-color-disabled`);
        return;
      }

      // 点击事件
      on(item, 'click', (event: Event) => {
        this.debouncedOnPredefineColorClick(event, color);
      });

      // 失焦事件
      on(item, 'blur', (event: Event) => {
        removeClass(event.target as HTMLElement, `${this.prefix}color-picker-predefine-color-active`);
      });
    });
  }

  onPredefineColorClick(event: Event, color: string) {
    const p = this.prefix;
    const clickTarget = event.target as HTMLElement;
    let target = clickTarget;

    // 如果点击的是子元素，找到父级的预定义颜色容器
    if (!hasClass(target, `${p}color-picker-predefine-color`)) {
      target = target.closest(`.${p}color-picker-predefine-color`) as HTMLElement || target;
    }
    
    // 检查是否被禁用
    if (hasClass(target, `${p}color-picker-predefine-color-disabled`)) {
      return; // 如果被禁用，直接返回，不执行任何操作
    }
    
    // 检查全局禁用状态
    if (this.options.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    // 添加激活状态
    addClass(target, `${p}color-picker-predefine-color-active`);
    
    // 移除其他项的激活状态
    this.predefineItems.forEach(item => {
      if (item !== target) {
        removeClass(item, `${p}color-picker-predefine-color-active`);
      }
    });

    // 验证颜色格式
    if (!isValidColor(color)) {
      warn(`[ewColorPicker warning]: Invalid predefine color: ${color}`);
      return;
    }

    // 转换颜色格式
    const rgbaColor = colorToRgba(color);
    
    // 更新HSV颜色
    this.ewColorPicker.hsvaColor = colorRgbaToHsva(rgbaColor);
    
    // 更新当前颜色
    this.ewColorPicker.setColor(rgbaColor);
    
    // 触发颜色改变回调
    if (isFunction(this.options.changeColor)) {
      this.options.changeColor?.(rgbaColor);
    }
  }

  updatePredefineColors(colors: string[] | PredefineColor[]) {
    this.options.predefineColor = colors;
    
    // 重新渲染
    this.predefineItems = [];
    this.render();
    this.bindEvents();
  }

  setDisabled(index: number, disabled: boolean) {
    if (this.predefineItems[index]) {
      if (disabled) {
        addClass(this.predefineItems[index], `${this.prefix}color-picker-predefine-color-disabled`);
      } else {
        removeClass(this.predefineItems[index], `${this.prefix}color-picker-predefine-color-disabled`);
      }
    }
  }

  destroy() {
    // 清理预定义色块的事件监听器
    this.predefineItems.forEach(item => {
      off(item, 'click', this.debouncedOnPredefineColorClick as unknown as EventListener);
      off(item, 'blur', () => {});
    });
    
    // 清理面板切换事件监听器
    if (this.isEventBound && this.toggleHandler) {
      this.ewColorPicker.off('toggle', this.toggleHandler);
      this.toggleHandler = null;
      this.isEventBound = false;
    }
    
    // 清理颜色变化事件监听器
    if (this.changeHandler) {
      this.ewColorPicker.off('change', this.changeHandler);
      this.changeHandler = null;
    }
    
    // 清理DOM引用
    this.predefineItems = [];
    this.container = null;
  }

  // 新增 install 方法，便于测试
  install(core: ewColorPicker) {
    this.ewColorPicker = core;
    this.handleOptions();
    
    this.run?.();
  }
  
  // 更新激活的预定义颜色
  private updateActivePredefineColor(color: string) {
    if (!color) return;
    
    // 将当前颜色转换为标准格式进行比较
    const currentRgba = colorToRgba(color);
    const p = this.prefix;
    
    this.predefineItems.forEach((item, index) => {
      const validColors = this.getValidPredefineColors();
      const colorData = validColors[index];
      const { color: itemColor } = this.parseColorData(colorData);
      
      // 将预定义颜色也转换为标准格式进行比较
      const itemRgba = colorToRgba(itemColor);
      
      if (currentRgba === itemRgba) {
        addClass(item, `${p}color-picker-predefine-color-active`);
      } else {
        removeClass(item, `${p}color-picker-predefine-color-active`);
      }
    });
  }
}

declare module "@ew-color-picker/core" {
  interface CustomOptions {
    ewColorPickerPredefine: PredefineOptions;
  }
} 