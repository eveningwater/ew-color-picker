import ewColorPicker from "@ew-color-picker/core";
import {
  on,
  setStyle,
  getRect,
  getElementSize,
  isFunction,
  ApplyOrder,
  extend,
  warn,
  off,
  $,
  create,
  addClass,
  insertNode,
  isObject,
  colorRgbaToHsva,
  colorHsvaToRgba,
  getStyle,
} from "@ew-color-picker/utils";

import { ewColorPickerOptions } from "@ew-color-picker/core";

export interface PanelOptions {
  hue?: boolean;
  alpha?: boolean;
  hasPanel?: boolean;
  hueDirection?: "horizontal" | "vertical";
  alphaDirection?: "horizontal" | "vertical";
}

export default class ewColorPickerPanelPlugin {
  static pluginName = "ewColorPickerPanel";
  static applyOrder = ApplyOrder.Post;

  options: PanelOptions & Omit<ewColorPickerOptions, "el"> = {};

  // DOM 元素
  panel: HTMLElement | null = null;
  cursor: HTMLElement | null = null;
  whitePanel: HTMLElement | null = null;
  blackPanel: HTMLElement | null = null;
  hueBar: HTMLElement | null = null;
  hueThumb: HTMLElement | null = null;
  alphaBar: HTMLElement | null = null;
  alphaThumb: HTMLElement | null = null;
  hueBg: HTMLElement | null = null;

  // 面板尺寸
  panelWidth: number;
  panelHeight: number;

  // 面板容器尺寸
  containerWidth: number;
  containerHeight: number;

  // 方向标志
  isHueHorizontal: boolean = false;
  isAlphaHorizontal: boolean = false;

  // 拖拽状态标记
  isDragging: boolean = false;

  // 节流相关
  private lastUpdateTime: number = 0;
  private readonly throttleDelay: number = 16; // 约60fps

  // 节流函数，用于优化拖拽性能
  private throttledUpdate = (saturation: number, value: number) => {
    const now = Date.now();
    if (now - this.lastUpdateTime >= this.throttleDelay) {
      this.lastUpdateTime = now;
      
      // 添加边界检查，防止异常值
      if (isNaN(saturation) || isNaN(value) || 
          saturation < 0 || saturation > 100 || 
          value < 0 || value > 100) {
        return;
      }
      
      this.updateCursorPosition(saturation, value);
      this.updateColor(saturation, value);
    }
  };

  constructor(public ewColorPicker: ewColorPicker) {
    this.handleOptions();

    // 注册颜色变化事件监听器
    if (isFunction(this.ewColorPicker?.on)) {
      this.ewColorPicker.on("change", (color: string) => {
        // 当颜色改变时，更新面板背景色和光标位置
        if (color && this.panel) {
          const hsva = colorRgbaToHsva(color);
          this.updateHueBg(hsva.h);
          this.updateCursorPosition(hsva.s, hsva.v);
        }
      });
    }

    this.run();
  }

  handleOptions() {
    if (isObject(this.ewColorPicker?.options)) {
      this.options = extend(this.options, this.ewColorPicker.options);
      this.isHueHorizontal = this.options.hueDirection === "horizontal";
      this.isAlphaHorizontal = this.options.alphaDirection === "horizontal";
    }
  }

  run() {
    // 检查是否显示面板（兼容 ewColorPickerPanel / hasPanel 两种写法）
    if (
      this.options.ewColorPickerPanel === false ||
      this.options.hasPanel === false
    ) {
      return;
    }

    this.render();
    // 延迟绑定事件，确保DOM完全渲染
    setTimeout(() => {
      this.bindEvents();
    }, 10);
  }

  render() {
    if (!this.ewColorPicker) {
      return;
    }

    // 直接使用面板容器
    const panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
    if (!panelContainer) {
      return;
    }

    const oldPanel = $(".ew-color-picker-panel", panelContainer);

    // 动态计算面板宽度
    let panelWidth = 285;
    if (this.isAlphaHorizontal && this.isHueHorizontal) {
      // 如果都是水平方向，需要320px宽度（外层容器最小宽度）
      panelWidth = 320;
    } else if (
      (this.isAlphaHorizontal && !this.isHueHorizontal) ||
      (!this.isAlphaHorizontal && this.isHueHorizontal)
    ) {
      // 如果一个是水平，一个是垂直，需要297px宽度,4px的margin-left,似乎要多1px的偏差
      panelWidth = 285 + 12 + 5;
    }
    // 如果都是垂直方向，保持285px宽度
    this.panel = create("div");
    addClass(this.panel, "ew-color-picker-panel");
    addClass(this.panel, "ew-color-picker-panel-dynamic-size");

    this.panelWidth = panelWidth;
    this.panelHeight = 180;

    setStyle(this.panel, {
      "--panel-width": panelWidth + "px",
      "--panel-height": this.panelHeight + "px",
    });

    // 组装面板结构
    insertNode(panelContainer, this.panel, oldPanel);

    // 创建颜色面板
    this.whitePanel = create("div");
    addClass(this.whitePanel, "ew-color-picker-white-panel");
    insertNode(this.panel, this.whitePanel);

    this.blackPanel = create("div");
    addClass(this.blackPanel, "ew-color-picker-black-panel");
    insertNode(this.panel, this.blackPanel);

    // 创建光标
    this.cursor = create("div");
    addClass(this.cursor, "ew-color-picker-panel-cursor");
    insertNode(this.panel, this.cursor);

    // 创建底部行容器
    const bottomRow = create("div");
    addClass(bottomRow, "ew-color-picker-bottom-row");
    insertNode(panelContainer, bottomRow);

    // 使用 setTimeout 确保容器完全渲染后再计算尺寸
    setTimeout(() => {
      this.calculateContainerSize();
      // 确保 ewColorPicker 实例存在且已完全初始化
      if (isFunction(this.ewColorPicker?.getMountPoint)) {
        this.handleAutoPosition();
      }
    }, 0);

    // 设置初始色相底色
    this.updateHueBg();

    // 根据当前颜色设置初始光标位置
    if (isFunction(this.ewColorPicker?.getColor)) {
      const currentColor = this.ewColorPicker.getColor();
      if (currentColor) {
        const hsva = colorRgbaToHsva(currentColor);
        this.updateCursorPosition(hsva.s, hsva.v);
      } else {
        // 默认位置（红色，饱和度和明度都是100%）
        this.updateCursorPosition(100, 100);
      }
    } else {
      // 默认位置（红色，饱和度和明度都是100%）
      this.updateCursorPosition(100, 100);
    }
  }

  bindEvents() {
    if (!this.panel) {
      // 静默处理，避免测试时的警告噪音
      return;
    }

    // 面板点击事件
    on(this.panel, "click", (event) =>
      this.handlePanelClick(event as MouseEvent)
    );

    // 鼠标拖拽事件
    on(this.panel, "mousedown", () => this.handlePanelMouseDown());

    // 触摸设备支持
    on(this.panel, "touchstart", (event) =>
      this.handlePanelTouchStart(event as TouchEvent)
    );
  }

  handlePanelTouchStart(event: TouchEvent) {
    if (!this.panel) return;

    // 检查禁用状态
    if (this.options.disabled) {
      return;
    }

    // 阻止默认行为
    event.preventDefault();

    // 添加拖拽状态标记
    this.isDragging = true;

    const handleTouchMove = (e: TouchEvent) => {
      if (this.isDragging && e.touches.length > 0) {
        this.handlePanelTouchMove(e);
      }
    };

    const handleTouchEnd = () => {
      this.isDragging = false;
      off(document, "touchmove", handleTouchMove as EventListener);
      off(document, "touchend", handleTouchEnd as EventListener);
    };

    on(document, "touchmove", handleTouchMove as EventListener);
    on(document, "touchend", handleTouchEnd as EventListener);
  }

  handlePanelTouchMove(event: TouchEvent) {
    if (!this.panel || !this.cursor) return;

    // 检查禁用状态
    if (this.options.disabled) {
      return;
    }

    // 阻止默认行为
    event.preventDefault();

    if (event.touches.length > 0) {
      // 确保使用最新的面板尺寸
      this.panelWidth = this.panel.offsetWidth;
      this.panelHeight = this.panel.offsetHeight;

      const touch = event.touches[0];
      const rect = getRect(this.panel);
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;

      // 计算饱和度和明度，确保边界值准确
      const saturation = Math.max(
        0,
        Math.min(100, (x / this.panelWidth) * 100)
      );
      const value = Math.max(
        0,
        Math.min(100, (1 - y / this.panelHeight) * 100)
      );

      // 使用节流函数更新，提升拖拽性能
      this.throttledUpdate(saturation, value);
    }
  }

  handlePanelClick(event: MouseEvent) {
    if (!this.panel || !this.cursor) return;

    // 检查禁用状态
    if (this.options.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    // 确保使用最新的面板尺寸
    this.panelWidth = this.panel.offsetWidth;
    this.panelHeight = this.panel.offsetHeight;

    const rect = getRect(this.panel);
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 计算饱和度和明度
    const saturation = Math.max(0, Math.min(100, (x / this.panelWidth) * 100));
    const value = Math.max(0, Math.min(100, (1 - y / this.panelHeight) * 100));

    // 更新光标位置和颜色
    this.updateCursorPosition(saturation, value);
    this.updateColor(saturation, value);
  }

  handlePanelMouseDown() {
    if (!this.panel) return;

    // 检查禁用状态
    if (this.options.disabled) {
      return;
    }

    // 添加拖拽状态标记
    this.isDragging = true;

    const handleMouseMove = (e: MouseEvent) => {
      // 使用节流处理拖拽，提升性能
      if (this.isDragging) {
        this.handlePanelDrag(e);
      }
    };

    const handleMouseUp = () => {
      this.isDragging = false;
      off(document, "mousemove", handleMouseMove as EventListener);
      off(document, "mouseup", handleMouseUp as EventListener);
    };

    on(document, "mousemove", handleMouseMove as EventListener);
    on(document, "mouseup", handleMouseUp as EventListener);
  }

  // 新增专门的拖拽处理函数
  handlePanelDrag(event: MouseEvent) {
    if (!this.panel || !this.cursor) return;

    // 检查禁用状态
    if (this.options.disabled) {
      return;
    }

    // 阻止默认行为，避免选中文本
    event.preventDefault();

    // 确保使用最新的面板尺寸
    this.panelWidth = this.panel.offsetWidth;
    this.panelHeight = this.panel.offsetHeight;

    const rect = getRect(this.panel);
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // 计算饱和度和明度，确保边界值准确
    const saturation = Math.max(0, Math.min(100, (x / this.panelWidth) * 100));
    const value = Math.max(0, Math.min(100, (1 - y / this.panelHeight) * 100));

    // 使用节流函数更新，提升拖拽性能
    this.throttledUpdate(saturation, value);
  }

  updateCursorPosition(saturation: number, value: number) {
    if (!this.cursor || !this.panel) return;

    // 检查面板是否可见
    const display = getStyle(this.panel, 'display');
    const visibility = getStyle(this.panel, 'visibility');
    if (display === 'none' || visibility === 'hidden') {
      return;
    }

    // 重新计算面板尺寸，确保获取到正确的值
    let currentPanelWidth = this.panel.offsetWidth;
    let currentPanelHeight = this.panel.offsetHeight;
    
    // 如果面板尺寸为0，尝试使用 getBoundingClientRect 或使用缓存值
    if (currentPanelWidth === 0 || currentPanelHeight === 0) {
      const rect = getRect(this.panel);
      currentPanelWidth = rect.width || this.panelWidth || 285;
      currentPanelHeight = rect.height || this.panelHeight || 180;
      
      // 如果仍然为0，使用默认值
      if (currentPanelWidth === 0 || currentPanelHeight === 0) {
        currentPanelWidth = 285;
        currentPanelHeight = 180;
      }
    }
    
    // 更新实例变量
    this.panelWidth = currentPanelWidth;
    this.panelHeight = currentPanelHeight;

    // 动态获取光标尺寸
    const cursorSize = getElementSize(this.cursor);
    const cursorOffset = {
      x: cursorSize.offsetWidth / 2,
      y: cursorSize.offsetHeight / 2
    };

    // 如果光标尺寸为0，使用默认值（防止元素未完全渲染）
    if (cursorSize.offsetWidth === 0 || cursorSize.offsetHeight === 0) {
      cursorOffset.x = 2; // 默认 4px 宽度的一半
      cursorOffset.y = 2; // 默认 4px 高度的一半
    }

    // 计算相对面板的坐标
    // 饱和度：0-100 对应 left: 0-panelWidth
    // 明度：0-100 对应 top: panelHeight-0（注意Y轴方向）
    let left = (saturation / 100) * this.panelWidth;
    let top = (1 - value / 100) * this.panelHeight;

    // 边界处理：考虑光标尺寸，确保光标完全在面板内
    // 当饱和度为 0% 时，光标中心应该在左边缘内 cursorOffset.x 处
    // 当饱和度为 100% 时，光标中心应该在右边缘内 cursorOffset.x 处
    // 当明度为 0% 时，光标中心应该在底边缘内 cursorOffset.y 处
    // 当明度为 100% 时，光标中心应该在顶边缘内 cursorOffset.y 处
    left = Math.max(cursorOffset.x, Math.min(left, this.panelWidth - cursorOffset.x));
    top = Math.max(cursorOffset.y, Math.min(top, this.panelHeight - cursorOffset.y));

    // 由于 CSS 使用了 transform: translate(-50%, -50%)，直接设置目标位置即可
    setStyle(this.cursor, {
      left: `${left}px`,
      top: `${top}px`,
    });
  }

  updateColor(saturation: number, value: number) {
    const { alpha } = this.options;
    const defaultColor = alpha ? "rgba(255,0,0,1)" : "#ff0000";
    let currentColor = this.ewColorPicker.getColor();
    if (!currentColor || currentColor.indexOf("NaN") !== -1) {
      currentColor = defaultColor;
      this.ewColorPicker.setColor(currentColor);
    }
    const hsva = colorRgbaToHsva(currentColor);
    hsva.s = saturation;
    hsva.v = value;

    const newColor = colorHsvaToRgba(hsva);
    this.ewColorPicker.setColor(newColor);
    // 触发change事件
    if (isFunction(this.ewColorPicker.options.changeColor)) {
      this.ewColorPicker.options.changeColor(newColor);
    }
    this.ewColorPicker.trigger("change", newColor);
  }

  updateHueBg(hue?: number) {
    if (this.panel) {
      // 如果传入了 hue 参数，使用传入的值；否则使用当前的 hue 值
      let targetHue = hue;
      if (targetHue === undefined) {
        const currentColor = this.ewColorPicker.getColor();
        if (currentColor) {
          const hsva = colorRgbaToHsva(currentColor);
          targetHue = hsva.h;
        } else {
          // 如果没有颜色，不设置背景色
          return;
        }
      }
      const hueColor = colorHsvaToRgba({ h: targetHue, s: 100, v: 100, a: 1 });
      setStyle(this.panel, {
        background: hueColor,
      });
    }
  }

  calculateContainerSize() {
    const panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
    if (panelContainer) {
      // 先尝试直接获取尺寸
      let containerWidth = panelContainer.offsetWidth;
      let containerHeight = panelContainer.offsetHeight;
      
      // 如果尺寸为0，尝试临时显示来获取尺寸
      if (containerWidth === 0 || containerHeight === 0) {
        const originalDisplay = panelContainer.style.display;
        const originalVisibility = panelContainer.style.visibility;
        const originalPosition = panelContainer.style.position;

        setStyle(panelContainer, {
          display: "block",
          visibility: "hidden",
          position: "absolute",
          left: "-9999px",
          top: "-9999px",
        });

        // 强制重排以获取真实尺寸
        panelContainer.offsetHeight;
        
        // 尝试多种方法获取容器尺寸
        const containerRect = getRect(panelContainer);
        containerWidth = panelContainer.offsetWidth || containerRect.width;
        containerHeight = panelContainer.offsetHeight || containerRect.height;

        // 恢复原始样式
        setStyle(panelContainer, {
          display: originalDisplay,
          visibility: originalVisibility,
          position: originalPosition,
          left: "",
          top: "",
        });
      }
      
      // 如果仍然为0，使用默认值
      this.containerWidth = containerWidth || 320;
      this.containerHeight = containerHeight || 200;
    }
  }

  handleAutoPosition() {
    const { autoPanelPosition, ewColorPickerBox, panelPlacement } =
      this.ewColorPicker?.options || {};

    if (!autoPanelPosition || !ewColorPickerBox) return;

    const rootElement = this.ewColorPicker.getMountPoint("root");
    const colorBox = $(".ew-color-picker-box", rootElement);
    if (!rootElement || !colorBox) return;

    // 重新计算容器尺寸
    this.calculateContainerSize();

    // 计算位置
    const { offsetWidth: boxWidth, offsetHeight: boxHeight } =
      getElementSize(colorBox);
    const [position = "bottom", align = "center"] = (
      panelPlacement || "bottom"
    ).split("-");

    let { left, top } = this.calculatePosition(
      position,
      align,
      boxWidth,
      boxHeight
    );

    // 边界调整
    const adjusted = this.adjustForViewport(rootElement, left, top);

    // 应用位置
    const panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
    if (panelContainer) {
      setStyle(panelContainer, {
        position: "absolute",
        left: `${adjusted.left}px`,
        top: `${adjusted.top}px`,
      });
    }
  }

  // 计算面板位置（相对于 box）
  calculatePosition(
    position: string,
    align: string,
    boxWidth: number,
    boxHeight: number
  ) {
    const gap = 5; // box 和 panel 之间的间距
    const positions: Record<string, { left: number; top: number }> = {
      // 顶部
      top: {
        left:
          align === "start"
            ? -this.containerWidth
            : align === "end"
            ? boxWidth
            : (boxWidth - this.containerWidth) / 2,
        top: -this.containerHeight - boxHeight / 2,
      },
      // 底部
      bottom: {
        left:
          align === "start"
            ? -this.containerWidth
            : align === "end"
            ? boxWidth
            : (boxWidth - this.containerWidth) / 2,
        top: boxHeight,
      },
      // 左侧
      left: {
        left: -this.containerWidth - gap,
        top:
          align === "start"
            ? -this.containerHeight - boxHeight / 2
            : align === "end"
            ? boxHeight
            : (boxHeight - this.containerHeight) / 2,
      },
      // 右侧
      right: {
        left: boxWidth + gap,
        top:
          align === "start"
            ? -this.containerHeight - boxHeight / 2
            : align === "end"
            ? boxHeight
            : (boxHeight - this.containerHeight) / 2,
      },
    };

    return positions[position] || positions.bottom;
  }

  // 视口边界调整
  adjustForViewport(rootElement: HTMLElement, left: number, top: number) {
    const margin = 8;
    const rootRect = getRect(rootElement);
    const viewportWidth =
      window.innerWidth || document.documentElement.clientWidth;
    const viewportHeight =
      window.innerHeight || document.documentElement.clientHeight;

    // 计算面板在视口中的位置
    const panelRect = {
      left: rootRect.left + left,
      top: rootRect.top + top,
      right: rootRect.left + left + this.containerWidth,
      bottom: rootRect.top + top + this.containerHeight,
    };

    // 检查是否超出边界
    const overflow = {
      left: margin - panelRect.left,
      top: margin - panelRect.top,
      right: panelRect.right - (viewportWidth - margin),
      bottom: panelRect.bottom - (viewportHeight - margin),
    };

    // 简单调整：哪边超出就往回推
    if (overflow.left > 0) left += overflow.left;
    if (overflow.right > 0) left -= overflow.right;
    if (overflow.top > 0) top += overflow.top;
    if (overflow.bottom > 0) top -= overflow.bottom;

    return { left, top };
  }

  destroy() {
    // 清理事件监听器
    if (this.panel) {
      off(this.panel, "click", this.handlePanelClick as EventListener);
      off(this.panel, "mousedown", this.handlePanelMouseDown as EventListener);
    }

    // 清理DOM引用
    this.panel = null;
    this.cursor = null;
    this.whitePanel = null;
    this.blackPanel = null;
    this.hueBar = null;
    this.hueThumb = null;
    this.alphaBar = null;
    this.alphaThumb = null;
    this.hueBg = null;
  }

  // 新增 install 方法，便于测试
  install(core: ewColorPicker) {
    this.ewColorPicker = core;
    this.handleOptions();

    // 注册事件监听器
    if (isFunction(core?.on)) {
      core.on("change", (color: string) => {
        // 当颜色改变时，更新面板光标位置
        const hsva = colorRgbaToHsva(color);
        this.updateCursorPosition(hsva.s, hsva.v);
      });
    }

    this.run?.();
  }
}

declare module "@ew-color-picker/panel" {
  interface CustomOptions {
    ewColorPickerPanel: PanelOptions;
  }
}
