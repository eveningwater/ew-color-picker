import {
  isNull,
  ApplyOrder,
  warn,
  isUndefined,
  isFunction,
  EventEmitter,
  open,
  close,
  getAnimationType,
  create,
  setAttr,
  setStyle,
  removeElement,
  insertNode,
  on,
  off,
  tryErrorHandler,
  extend,
  addClass,
  colorRgbaToHsva,
  colorRgbaToHex,
  colorToRgba,
  checkContainer,
  isObject,
  isString,
  isHTMLElement,
  DEFAULT_PREFIX,
} from "@ew-color-picker/utils";
import ewColorPickerMergeOptions from "./mergeOptions";
import type {
  ewColorPickerMergeOptionsData,
  ewColorPickerMountedElement,
  ewColorPickerOptions,
  ewColorPickerConstructorOptions,
  WrapperElement,
} from "./mergeOptions";

// 插件构造函数接口
export interface ewColorPickerPluginCtor {
  pluginName: string;
  applyOrder?: ApplyOrder;
  new (instance: ewColorPicker): ewColorPickerPlugin;
}

// 插件接口
export interface ewColorPickerPlugin {
  destroy?: () => void;
  [key: string]: any;
}

// 插件注册项接口
export interface ewColorPickerPluginItem {
  ctor: ewColorPickerPluginCtor;
  name: string;
  applyOrder?: ApplyOrder.Post | ApplyOrder.Pre;
}

// 插件实例集合
export interface ewColorPickerPluginInstances {
  [name: string]: ewColorPickerPlugin;
}

// 颜色类型定义
export interface HsvaColor {
  h: number;
  s: number;
  v: number;
  a: number;
}

// 重新导出类型
export type {
  ewColorPickerOptions,
  ewColorPickerConstructorOptions,
  ewColorPickerMergeOptionsData,
  WrapperElement,
};

// 动态获取已注册的插件配置
const getRegisteredPlugins = () => {
  const plugins: Record<string, boolean> = {};
  ewColorPicker.plugins.forEach((plugin) => {
    // 只设置插件启用状态，不覆盖其他配置
    plugins[plugin.name] = true;
  });
  return plugins;
};

// 动态生成挂载点顺序映射
const getMountOrderMap = () => {
  const mountOrderMap: Record<string, number> = {};
  let order = 0;

  // 按插件注册顺序分配挂载点顺序
  ewColorPicker.plugins.forEach((plugin) => {
    mountOrderMap[plugin.name] = order++;
  });

  return mountOrderMap;
};

// 应用顺序映射
const APPLY_ORDER_MAP = {
  [ApplyOrder.Pre]: -1,
  [ApplyOrder.Post]: 1,
} as const;

// 事件类型
const EVENT_TYPES = [
  "destroy",
  "change",
  "sure",
  "clear",
  "toggle",
  "options-update",
  "mode-change",
];

// 默认动画时间
export const DEFAULT_ANIMATION_TIME = 200;

export default class ewColorPicker extends EventEmitter {
  // 静态属性
  static plugins: ewColorPickerPluginItem[] = [];
  static pluginsMap: Record<string, boolean> = {};

  // 实例属性
  plugins: ewColorPickerPluginInstances;
  options: ewColorPickerMergeOptionsData;
  wrapper: ewColorPickerMountedElement;

  // 核心属性
  hsvaColor: HsvaColor;
  currentColor: string;
  panelWidth: number;
  panelHeight: number;
  panelLeft: number;
  panelTop: number;
  isHueHorizontal: boolean;
  isAlphaHorizontal: boolean;
  colorMode: readonly string[];
  currentMode: string;
  pickerFlag: boolean;
  _color_picker_uid: string;

  // 插件挂载点管理
  private mountPoints: Map<string, HTMLElement> = new Map();

  // 事件处理状态
  private isDestroyed: boolean = false;

  private shouldAutoMount: boolean = false;

  // 插件注册方法
  static use(ctor: ewColorPickerPluginCtor): typeof ewColorPicker {
    const { pluginName } = ctor;

    // 验证插件名称
    if (isUndefined(pluginName) || isNull(pluginName)) {
      warn(
        "[ewColorPicker warning]: Plugin Class must specify plugin's name in static property by 'pluginName' field."
      );
      return ewColorPicker;
    }

    // 按 pluginName 去重，避免 HMR 或多入口重复注册同一个插件
    if (
      ewColorPicker.plugins.some(
        (plugin) => plugin.name === pluginName || ctor === plugin.ctor
      )
    ) {
      return ewColorPicker;
    }

    // 注册插件
    ewColorPicker.pluginsMap[pluginName] = true;
    ewColorPicker.plugins.push({
      name: pluginName,
      applyOrder: ctor.applyOrder,
      ctor,
    });

    return ewColorPicker;
  }

  constructor(
    options?: ewColorPickerConstructorOptions | string | HTMLElement,
    secondOptions?: ewColorPickerConstructorOptions
  ) {
    super(EVENT_TYPES);

    this.options = this.normalizeOptions(options, secondOptions);

    // 初始化实例
    this.init();

    // 如果提供了 el 属性，自动调用 mount 方法
    if (this.shouldAutoMount && this.options.el) {
      tryErrorHandler(
        () => {
          this.mount(this.options.el);
        },
        (error) => {
          warn(`[ewColorPicker warning]: Auto mount failed: ${error}`);
        }
      );
    }
  }

  private normalizeOptions(
    options?: ewColorPickerConstructorOptions | string | HTMLElement,
    secondOptions?: ewColorPickerConstructorOptions
  ) {
    let finalOptions: ewColorPickerConstructorOptions;
    if (isHTMLElement(options)) {
      if (secondOptions) {
        const { el, ...otherOptions } = secondOptions;
        finalOptions = {
          el: options, // 第一个参数是容器
          ...otherOptions,
        };
      } else {
        finalOptions = {
          el: options,
        };
      }
      this.shouldAutoMount = true;
    } else if (isString(options)) {
      if (secondOptions) {
        const { el, ...otherOptions } = secondOptions;
        finalOptions = {
          el: options, // 第一个参数是选择器字符串
          ...otherOptions,
        };
      } else {
        finalOptions = {
          el: options,
        };
      }
      this.shouldAutoMount = true;
    } else {
      finalOptions = options as ewColorPickerConstructorOptions;
      if (isObject(finalOptions) && finalOptions.el) {
        this.shouldAutoMount = true;
      }
    }

    // 初始化配置
    return new ewColorPickerMergeOptions().bindOptions(
      finalOptions,
      getRegisteredPlugins()
    );
  }

  private init(): void {
    tryErrorHandler(() => {
      this.plugins = {};
      this._color_picker_uid = this.generateUID();

      this.initCoreProperties();
    });
  }

  private initCoreProperties(): void {
    const { defaultColor, alphaDirection, hueDirection } = this.options;

    if (defaultColor) {
      let defaultColorValue = defaultColor;
      const hasAlphaPlugin = this.plugins?.ewColorPickerAlpha;
      if (hasAlphaPlugin) {
        // 如果 defaultColor 是 hex 格式，转换为 rgba 格式
        if (defaultColor.startsWith("#")) {
          defaultColorValue = colorToRgba(defaultColor);
        }
      } else {
        // 如果 defaultColor 是 rgba 格式，转换为 hex 格式
        if (defaultColor.startsWith("rgba")) {
          defaultColorValue = colorRgbaToHex(defaultColor);
        }
      }

      this.currentColor = defaultColorValue;

      let rgbaColor = colorToRgba(defaultColorValue);
      // 如果 colorToRgba 返回空字符串
      if (!rgbaColor) {
        rgbaColor = "rgba(255, 0, 0, 1)";
      }
      const newHsva = colorRgbaToHsva(rgbaColor);
      if (!isNaN(newHsva.h)) {
        this.hsvaColor = newHsva;
      } else {
        // 如果转换失败，使用默认值
        this.hsvaColor = { h: 0, s: 100, v: 100, a: 1 };
      }
    } else {
      // 没有默认颜色时，设置为空字符串，hsvaColor 也设置为空值
      this.currentColor = "";
      this.hsvaColor = { h: 0, s: 0, v: 0, a: 0 };
    }
    this.panelWidth = 0;
    this.panelHeight = 0;
    this.panelLeft = 0;
    this.panelTop = 0;
    this.isHueHorizontal = hueDirection === "horizontal";
    this.isAlphaHorizontal = alphaDirection === "horizontal";
    this.colorMode = ["Hex", "RGB", "HSV"] as const;
    this.currentMode = "Hex";
    this.pickerFlag = false;
  }

  private createMountPoints(): void {
    const prefix = this.options.prefix || DEFAULT_PREFIX;
    // 创建主容器
    const rootElement = create("div");
    setAttr(rootElement, {
      class: `${prefix}color-picker`,
      "data-uid": this._color_picker_uid,
    });
    insertNode(this.getContainer(), rootElement);

    // 设置 wrapper 为创建的主容器
    this.wrapper = rootElement;
    this.wrapper.isEwColorPickerContainer = true;

    // 创建面板容器（默认隐藏）
    const panelContainer = create("div");
    setAttr(panelContainer, { class: `${prefix}color-picker-panel-container` });
    addClass(panelContainer, `${prefix}color-picker-panel-container-hidden`);
    insertNode(rootElement, panelContainer);

    // 设置挂载点
    this.mountPoints.set("root", rootElement);
    this.mountPoints.set("panelContainer", panelContainer);
  }

  // 获取插件挂载点
  public getMountPoint(pluginName: string): HTMLElement | undefined {
    if (this.isDestroyed) return undefined;
    return this.mountPoints.get(pluginName);
  }

  // 获取容器元素
  public getContainer(): HTMLElement {
    return this.options.el;
  }

  // 挂载到指定的DOM元素
  public mount(el?: string | HTMLElement): ewColorPicker {
    if (this.isDestroyed) return this;

    // 确定挂载容器
    let mountContainer: HTMLElement;
    if (el) {
      // 使用 checkContainer 方法处理容器参数
      mountContainer = checkContainer(el);
    } else {
      // 使用配置中的el或默认document.body
      mountContainer = this.options.el || document.body;
    }

    // 更新options中的el
    this.options.el = mountContainer;

    // 创建挂载点
    this.createMountPoints();

    // 应用插件（因为挂载点已创建）
    this.applyPlugins();

    // 插件挂载后，确保色相同步
    this.notifyHuePluginUpdate(this.hsvaColor.h);

    return this;
  }

  // 重新应用插件（挂载点创建后）
  private reapplyPlugins(): void {
    // 重新应用插件，确保它们能正确访问挂载点
    Object.values(this.plugins).forEach((plugin) => {
      if (isFunction(plugin.run)) {
        plugin.run();
      }
    });
  }

  // 显示面板
  public showPanel(animationType?: string, duration?: number): void {
    if (this.isDestroyed) return;

    const panelContainer = this.mountPoints.get("panelContainer");
    if (!panelContainer) return;

    // 只有在面板真正需要显示时才设置默认颜色
    // 当前没有颜色时优先使用配置的 defaultColor，未配置才回退到红色
    const { pickerAnimationTime, togglePicker, defaultColor } = this.options || {};
    if (!this.currentColor) {
      const fallbackColor = defaultColor || "#ff0000";
      this.currentColor = fallbackColor;
      let rgbaColor = colorToRgba(fallbackColor);
      if (!rgbaColor) {
        rgbaColor = "rgba(255, 0, 0, 1)";
      }
      const newHsva = colorRgbaToHsva(rgbaColor);
      this.hsvaColor = newHsva;

      if (!isNaN(newHsva.h)) {
        this.notifyHuePluginUpdate(newHsva.h);
      }
    }

    const type = animationType || getAnimationType(this);
    const time =
      duration || pickerAnimationTime || DEFAULT_ANIMATION_TIME;

    open(type, panelContainer, time)
      .then(() => {
        this.pickerFlag = true;
        this.trigger("toggle", true);

        if (isFunction(togglePicker)) {
          togglePicker(true);
        }

        this.syncAllPlugins(this.currentColor);

        setTimeout(() => {
          const panelPlugin = this.plugins.ewColorPickerPanel;
          if (panelPlugin && isFunction(panelPlugin.handleAutoPosition)) {
            panelPlugin.handleAutoPosition.call(panelPlugin);
          }
          on(document, "mousedown", this._onDocumentClick, { capture: true });
        }, 0);
      })
      .catch((error) => {
        warn(`[ewColorPicker error]: Failed to show panel: ${error}`);
      });
  }

  // 隐藏面板
  public hidePanel(animationType?: string, duration?: number): void {
    if (this.isDestroyed) return;

    const panelContainer = this.mountPoints.get("panelContainer");
    if (!panelContainer) return;

    const { pickerAnimationTime, togglePicker, autoPanelPosition } = this.options || {};
    const hasBox = this.plugins.ewColorPickerBox || false;
    const type = animationType || getAnimationType(this);
    const time =
      duration || pickerAnimationTime || DEFAULT_ANIMATION_TIME;

    close(type, panelContainer, time)
      .then(() => {
        if (this.isDestroyed) return;

        // 重置自动定位样式（面板被挂载到外部容器时由 Panel 插件负责定位，不能重置）
        if (autoPanelPosition && hasBox && !this.options.appendTo) {
          setStyle(panelContainer, {
            position: "absolute",
            left: "0",
            top: "100%",
            visibility: "visible",
          });
        }

        this.pickerFlag = false;
        this.trigger("toggle", false);

        // 调用 togglePicker 回调
        if (isFunction(togglePicker)) {
          togglePicker(false);
        }

        off(document, "mousedown", this._onDocumentClick, { capture: true });
      })
      .catch((error) => {
        warn(`[ewColorPicker error]: Failed to hide panel: ${error}`);
      });
  }

  // 点击外部关闭面板
  private _onDocumentClick = (e: Event): void => {
    if (this.isDestroyed || !this.options.isClickOutside) return;

    const panelContainer = this.mountPoints.get("panelContainer");
    const rootElement = this.mountPoints.get("root");

    // 检查点击目标
    const target = e.target as Node;

    // 如果点击的是面板内部，不关闭
    if (panelContainer && panelContainer.contains(target)) return;

    // 如果点击的是颜色盒子，不关闭（避免与盒子切换逻辑冲突）
    const prefix = this.options.prefix || DEFAULT_PREFIX;
    const colorBox = rootElement?.querySelector(`.${prefix}color-picker-box`);
    if (colorBox && colorBox.contains(target)) return;

    // 点击面板和盒子之外的区域，关闭面板
    // 使用配置中的动画类型和动画时间
    const { togglePickerAnimation, pickerAnimationTime } = this.options;
    this.hidePanel(togglePickerAnimation, pickerAnimationTime);
  };

  private generateUID(): string {
    return `ew-color-picker-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 11)}`;
  }

  private applyPlugins(): void {
    // 按优先级排序插件
    const sortedPlugins = [...ewColorPicker.plugins].sort((a, b) => {
      // 首先按应用顺序排序
      const aOrder = a.applyOrder ? APPLY_ORDER_MAP[a.applyOrder] : 0;
      const bOrder = b.applyOrder ? APPLY_ORDER_MAP[b.applyOrder] : 0;

      if (aOrder !== bOrder) {
        return aOrder - bOrder;
      }

      // 然后按挂载点顺序排序
      const mountOrderMap = getMountOrderMap();
      const aMountOrder = mountOrderMap[a.name] || 999;
      const bMountOrder = mountOrderMap[b.name] || 999;

      return aMountOrder - bMountOrder;
    });

    // 检测插件依赖和注入状态
    this.checkPluginDependencies();

    // 实例化插件 - 自动启用所有已注册的插件
    sortedPlugins.forEach(({ ctor, name }) => {
      tryErrorHandler(
        () => {
          if (isFunction(ctor)) {
            this.plugins[name] = new ctor(this);
          }
        },
        (error) => {
          warn(
            `[ewColorPicker warning]: Failed to apply plugin '${name}': ${error}`
          );
        }
      );
    });
  }

  // 检测插件依赖和注入状态
  private checkPluginDependencies(): void {
    // 插件依赖关系配置
    const pluginDependencies: Record<string, string[]> = {
      // hue 插件依赖
      hue: ["ewColorPickerHue"],
      // alpha 插件依赖
      alpha: ["ewColorPickerAlpha"],
      // panel 插件依赖
      panel: ["ewColorPickerPanel"],
      // input 插件依赖
      input: ["ewColorPickerInput"],
      // input-number 插件依赖
      inputNumber: ["ewColorPickerInputNumber"],
      // button 插件依赖
      button: ["ewColorPickerButton"],
      // predefine 插件依赖
      predefine: ["ewColorPickerPredefine"],
      // color-mode 插件依赖
      colorMode: ["ewColorPickerColorMode"],
      // box 插件依赖
      box: ["ewColorPickerBox"],
      // console 插件依赖
      console: ["ewColorPickerConsole"],
    };

    // 检查每个配置项对应的插件是否已注入
    Object.entries(pluginDependencies).forEach(
      ([configKey, requiredPlugins]) => {
        // 检查配置是否开启
        if (this.options[configKey]) {
          requiredPlugins.forEach((pluginName) => {
            // 检查插件是否已注册
            if (!ewColorPicker.pluginsMap[pluginName]) {
              warn(
                `[ewColorPicker warning]: Plugin '${pluginName}' is required but not injected. Please use ewColorPicker.use(${pluginName}) to register the plugin.`
              );
            }
          });
        }
      }
    );

    // 检查特定功能的插件依赖
    this.checkSpecificFeatureDependencies();
  }

  // 检查特定功能的插件依赖
  private checkSpecificFeatureDependencies(): void {
    // 检查 hue 方向配置
    if (
      this.options.hueDirection &&
      !ewColorPicker.pluginsMap["ewColorPickerHue"]
    ) {
      warn(
        "[ewColorPicker warning]: hueDirection is configured but ewColorPickerHue plugin is not injected. Please use ewColorPicker.use(HuePlugin) to register the plugin."
      );
    }

    // 检查 alpha 方向配置
    if (
      this.options.alphaDirection &&
      !ewColorPicker.pluginsMap["ewColorPickerAlpha"]
    ) {
      warn(
        "[ewColorPicker warning]: alphaDirection is configured but ewColorPickerAlpha plugin is not injected. Please use ewColorPicker.use(AlphaPlugin) to register the plugin."
      );
    }

    // 检查预定义颜色配置
    if (
      this.options.predefineColor &&
      this.options.predefineColor.length > 0 &&
      !ewColorPicker.pluginsMap["ewColorPickerPredefine"]
    ) {
      warn(
        "[ewColorPicker warning]: predefineColor is configured but ewColorPickerPredefine plugin is not injected. Please use ewColorPicker.use(PredefinePlugin) to register the plugin."
      );
    }
   
    // 检查颜色模式切换配置下的 input-number 插件依赖
    if (
      ewColorPicker.pluginsMap["ewColorPickerColorMode"] &&
      !ewColorPicker.pluginsMap["ewColorPickerInputNumber"]
    ) {
      warn(
        "[ewColorPicker warning]: Color mode plugin requires InputNumber plugin. color-mode plugin requires InputNumber plugin. Please use ewColorPicker.use(InputNumberPlugin) to register the plugin."
      );
    }

    // panel插件是core的核心插件，必须始终存在
    if (!ewColorPicker.pluginsMap["ewColorPickerPanel"]) {
      warn(
        "[ewColorPicker warning]: Panel plugin is required as core plugin but not injected. Please use ewColorPicker.use(PanelPlugin) to register the plugin."
      );
    }
  }

  public syncAllPlugins(color: string): void {
    Object.values(this.plugins).forEach((plugin) => {
      if (isFunction(plugin.syncColor)) {
        plugin.syncColor(color);
      }
    });
  }

  // 更新配置并重新渲染
  public updateOptions<T extends string>(newOptions: Record<string, T>): void {
    if (this.isDestroyed) return;

    // 合并新配置
    this.options = extend(
      {},
      this.options,
      newOptions
    ) as ewColorPickerMergeOptionsData;

    // 如果更新了 defaultColor，需要同步更新当前颜色
    const { defaultColor } = this.options || {};
    if (!isUndefined(defaultColor)) {
      // 验证颜色是否有效，无效时保持当前颜色不变
      const rgbaColor = colorToRgba(defaultColor);
      if (rgbaColor) {
        this.setColor(defaultColor);
      } else {
        warn(
          `[ewColorPicker warning]: Invalid defaultColor '${defaultColor}', keep current color unchanged.`
        );
      }
    }

    // 重新应用插件
    this.reapplyPlugins();

    // 触发配置更新事件
    this.trigger("options-update", this.options);
  }

  public openPicker(): void {
    this.showPanel();
  }

  public closePicker(): void {
    this.hidePanel();
  }

  public destroy(): void {
    if (this.isDestroyed) return;

    this.isDestroyed = true;

    // 解绑外部点击事件
    off(document, "mousedown", this._onDocumentClick, { capture: true });

    // 销毁所有插件
    if (this.plugins) {
      Object.values(this.plugins).forEach((plugin) => {
        tryErrorHandler(() => {
          if (isFunction(plugin?.destroy)) {
            plugin.destroy();
          }
        });
      });
    }

    // 清理所有挂载点
    this.mountPoints.forEach((el) => {
      tryErrorHandler(() => {
        removeElement(el);
      });
    });
    this.mountPoints.clear();

    // 清理主容器
    tryErrorHandler(() => {
      removeElement(this.wrapper);
    });

    // 清理插件引用
    this.plugins = {};

    // 触发销毁事件
    this.trigger("destroy");
  }

  public setColor(color: string): void {
    // 更新当前颜色
    this.currentColor = color;

    // 更新 HSVA 颜色值
    if (color) {
      // 先将颜色转换为 rgba 格式，再转换为 hsva
      const rgbaColor = colorToRgba(color);
      if (rgbaColor) {
        this.hsvaColor = colorRgbaToHsva(rgbaColor);
      } else {
        // 如果转换失败，使用默认值
        this.hsvaColor = { h: 0, s: 100, v: 100, a: 1 };
      }
    }

    // 触发颜色变化事件
    this.trigger("change", color);

    if (isFunction(this.options?.changeColor)) {
      this.options.changeColor(color);
    }
  }

  public getColor(): string {
    return this.currentColor;
  }

  public getHsvaColor(): HsvaColor {
    return { ...this.hsvaColor };
  }

  public setHsvaColor(hsva: HsvaColor): void {
    this.hsvaColor = { ...hsva };
  }

  // 检查实例是否已销毁
  public getDestroyedStatus(): boolean {
    return this.isDestroyed;
  }

  // 添加测试用例期望的方法
  public use(plugin: ewColorPickerPlugin): ewColorPicker {
    if (isFunction(plugin.install)) {
      plugin.install(this);
    }
    return this;
  }

  public emit<T>(event: string, ...args: T[]): void {
    this.trigger(event, ...args);

    const { clear, sure, togglePicker } = this.options || {};
    switch (event) {
      case "clear":
        if (isFunction(clear)) {
          clear();
        }
        break;
      case "sure":
        if (isFunction(sure)) {
          sure();
        }
        break;
      case "toggle":
        if (isFunction(togglePicker)) {
          togglePicker(...args);
        }
        break;
    }
  }

  public on(type: string, fn: Function, context?: Object): this {
    super.on(type, fn, context);
    return this;
  }

  public off(type?: string, fn?: Function): this | undefined {
    super.off(type, fn);
    return this;
  }

  public getOptions(): ewColorPickerMergeOptionsData {
    return this.options;
  }

  private notifyHuePluginUpdate(hue: number): void {
    const huePlugin = this.plugins?.ewColorPickerHue;
    if (isFunction(huePlugin?.updateHueThumbPosition)) {
      huePlugin.updateHueThumbPosition(hue);
    }
  }
}
