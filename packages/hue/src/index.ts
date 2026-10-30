import {
  on,
  setStyle,
  addClass,
  removeClass,
  isFunction,
  insertNode,
  ApplyOrder,
  warn,
  create,
  extend,
  off,
  $,
  throttle,
  getRect,
  removeElement,
} from "@ew-color-picker/utils";
import { colorRgbaToHsva, colorHsvaToRgba } from "@ew-color-picker/utils";
import ewColorPicker, { ewColorPickerOptions } from "@ew-color-picker/core";

export interface HueOptions {
  direction?: "horizontal" | "vertical";
  hue?: boolean;
}

export default class ewColorPickerHuePlugin {
  static pluginName = "ewColorPickerHue";
  static applyOrder = ApplyOrder.Post;
  options: HueOptions & Omit<ewColorPickerOptions, "el"> = {} as any;
  hueBar: HTMLElement | null = null;
  hueThumb: HTMLElement | null = null;
  isHorizontal: boolean = false;

  // 节流处理鼠标移动事件
  private throttledUpdateHue: (hue: number) => void;
  // 内部状态控制
  private _hasHue: boolean = true;

  constructor(public ewColorPicker: ewColorPicker) {
    this.handleOptions();
    // 支持构造时通过 hue 关闭色相滑块
    if (this.options.hue === false) {
      this._hasHue = false;
    }
    // 初始化节流函数
    this.throttledUpdateHue = throttle(this.updateHue.bind(this), 16); // 60fps
    
    // 注册颜色变化事件监听器
    if (this.ewColorPicker.on && typeof this.ewColorPicker.on === "function") {
      this.ewColorPicker.on("change", (color: string) => {
        // 当颜色改变时，更新 hue 滑块位置
        if (color && this.hueThumb) {
          const hsva = colorRgbaToHsva(color);
          this.updateHueThumbPosition(hsva.h);
        }
      });
    }
    
    this.run();
  }

  // 获取hue状态
  get hasHue(): boolean {
    return this._hasHue;
  }

  // 设置hue状态
  set hasHue(value: boolean) {
    if (this._hasHue !== value) {
      this._hasHue = value;
      if (value) {
        this.render();
      } else {
        if (this.hueBar && this.hueBar.parentNode) {
          this.hueBar.parentNode.removeChild(this.hueBar);
          this.hueBar = null;
        }
      }
    }
  }

  // 动态启用/禁用hue
  enableHue(enable: boolean = true): void {
    this.hasHue = enable;
  }

  handleOptions() {
    if (this.ewColorPicker && this.ewColorPicker.options) {
      this.options = extend(this.options, this.ewColorPicker.options);
      this.isHorizontal = this.options.hueDirection === "horizontal";
    }
  }

  run() {
    if (this.hasHue) {
      this.render();
    }
    setTimeout(() => {
      this.bindEvents();
    }, 10);
  }

  render() {
    const panelContainer = this.ewColorPicker.getMountPoint("panelContainer");
    if (!panelContainer) {
      warn("[ewColorPicker] Panel container not found");
      return;
    }
    // 移除旧的 hue 条
    const oldHue = $(
      ".ew-color-picker-slider.ew-color-picker-is-vertical, .ew-color-picker-slider.ew-color-picker-is-horizontal",
      panelContainer
    );
    if (oldHue) removeElement(oldHue);
    // 创建 hue 条
    const hueSlider = create("div");
    addClass(
      hueSlider,
      "ew-color-picker-slider " +
        (this.isHorizontal
          ? "ew-color-picker-is-horizontal"
          : "ew-color-picker-is-vertical")
    );
    this.hueBar = create("div");
    addClass(this.hueBar, "ew-color-picker-slider-bar");
    this.hueThumb = create("div");
    addClass(this.hueThumb, "ew-color-picker-slider-thumb");
    insertNode(this.hueBar, this.hueThumb);
    insertNode(hueSlider, this.hueBar);
    // 根据方向决定插入位置
    if (this.isHorizontal) {
      // 水平方向：插入到 bottom-row 之前（底部）
      const bottomRow = $(".ew-color-picker-bottom-row", panelContainer);
      if (bottomRow && bottomRow.parentNode) {
        bottomRow.parentNode.insertBefore(hueSlider, bottomRow);
      } else {
        insertNode(panelContainer, hueSlider);
      }
    } else {
      // 垂直方向：插入到面板之后（顶部）
      const panel = $(".ew-color-picker-panel", panelContainer);
      if (panel && panel.parentNode) {
        panel.parentNode.insertBefore(hueSlider, panel.nextSibling);
      } else {
        insertNode(panelContainer, hueSlider);
      }
    }
    // 设置初始 thumb 位置
    const currentColor = this.ewColorPicker.getColor();
    if (currentColor) {
      const hsva = colorRgbaToHsva(currentColor);
      this.updateHueThumbPosition(hsva.h);
    }
  }

  bindEvents() {
    if (!this.hueBar) return;
    on(
      this.hueBar,
      "click",
      this.handleHueSliderClick.bind(this) as EventListener
    );
    on(
      this.hueBar,
      "mousedown",
      this.handleHueSliderMouseDown.bind(this) as EventListener
    );
  }

  handleHueSliderClick(event: MouseEvent) {
    if (!this.hueBar) return;
    
    // 检查禁用状态
    if (this.options.disabled) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }
    
    const rect = getRect(this.hueBar);
    const isHorizontal = this.isHorizontal;
    let hue: number;
    if (isHorizontal) {
      const x = event.clientX - rect.left;
      hue = Math.max(0, Math.min(360, (x / rect.width) * 360));
    } else {
      const y = event.clientY - rect.top;
      hue = Math.max(0, Math.min(360, (1 - y / rect.height) * 360));
    }
    this.updateHue(hue);
  }

  handleHueSliderMouseDown(event: MouseEvent) {
    if (!this.hueBar) return;
    
    // 检查禁用状态
    if (this.options.disabled) {
      return;
    }
    
    const slider = this.hueBar;
    const isHorizontal = this.isHorizontal;
    const moveHandler = (e: MouseEvent) => {
      const rect = getRect(slider);
      let hue: number;
      if (isHorizontal) {
        const x = e.clientX - rect.left;
        hue = Math.max(0, Math.min(360, (x / rect.width) * 360));
      } else {
        const y = e.clientY - rect.top;
        hue = Math.max(0, Math.min(360, (1 - y / rect.height) * 360));
      }
      this.throttledUpdateHue(hue);
    };
    const upHandler = () => {
      off(document, "mousemove", moveHandler as EventListener);
      off(document, "mouseup", upHandler as EventListener);
    };
    on(document, "mousemove", moveHandler as EventListener);
    on(document, "mouseup", upHandler as EventListener);
  }

  updateHue(hue: number) {
    // 只更新 hue，保持 s/v/a 不变
    let currentColor = this.ewColorPicker.getColor();

    // 确保 hue 值在有效范围内
    const validHue = Math.max(0, Math.min(360, hue));

    // 获取当前的 HSVA 值
    let hsva;
    if (currentColor) {
      hsva = colorRgbaToHsva(currentColor);
    } else {
      // 如果没有当前颜色，使用默认值
      hsva = { h: validHue, s: 100, v: 100, a: 1 };
    }

    // 检查 HSVA 值是否有效
    if (isNaN(hsva.h) || isNaN(hsva.s) || isNaN(hsva.v) || isNaN(hsva.a)) {
      // 如果 HSVA 值无效，使用默认值
      hsva.h = validHue;
      hsva.s = 100;
      hsva.v = 100;
      hsva.a = 1;
    } else {
      // 只更新 hue 值
      hsva.h = validHue;
    }

    // 转换为新的颜色值
    const newColor = colorHsvaToRgba(hsva);

    // 检查转换结果是否有效
    if (newColor && !newColor.includes("NaN")) {
      this.ewColorPicker.setColor(newColor);
    } else {
      // 如果转换结果无效，使用默认颜色
      const fallbackColor = this.ewColorPicker.options.alpha
        ? `rgba(255, 0, 0, 1)`
        : "#ff0000";
      this.ewColorPicker.setColor(fallbackColor);
    }

    this.updateHueThumbPosition(validHue);

    // 调用 panel 插件的 updateHueBg 方法，传入新的 hue 值
    const panelPlugin = this.ewColorPicker.plugins?.ewColorPickerPanel;
    if (panelPlugin && isFunction(panelPlugin.updateHueBg)) {
      panelPlugin.updateHueBg(validHue);
    }
  }

  updateHueThumbPosition(hue: number) {
    if (!this.hueThumb || !this.hueBar) return;
    const isHorizontal = this.isHorizontal;
    const rect = getRect(this.hueBar);
    if (isHorizontal) {
      const x = Math.max(0, Math.min(rect.width, (hue / 360) * rect.width));
      setStyle(this.hueThumb, "left", `${x}px`);
      setStyle(this.hueThumb, "top", `0px`);
    } else {
      const y = Math.max(
        0,
        Math.min(rect.height, (1 - hue / 360) * rect.height)
      );
      setStyle(this.hueThumb, "top", `${y}px`);
      setStyle(this.hueThumb, "left", `0px`);
    }
  }

  destroy() {
    // 清理事件监听器
    if (this.hueBar) {
      off(
        this.hueBar,
        "click",
        this.handleHueSliderClick.bind(this) as EventListener
      );
      off(
        this.hueBar,
        "mousedown",
        this.handleHueSliderMouseDown.bind(this) as EventListener
      );
    }

    // 清理DOM引用
    this.hueBar = null;
    this.hueThumb = null;
  }

  // 新增 install 方法，便于测试
  install(core: any) {
    this.ewColorPicker = core;
    this.handleOptions();

    // 注册事件监听器
    if (core.on && typeof core.on === "function") {
      core.on("change", (color: string) => {
        // 当颜色改变时，更新 hue 滑块位置
        const hsva = colorRgbaToHsva(color);
        this.updateHueThumbPosition(hsva.h);
      });
    }

    this.run?.();
  }
}
