import { vi } from "vitest";

// 通用的 mockCore 工厂函数
// 用于创建完整的 mock 核心对象，供所有插件测试使用

export interface MockCore {
  // 基础属性
  container: HTMLElement;
  options: any;
  plugins: Record<string, any>;
  _eventHandlers?: Record<string, Function[]>;
  wrapper: HTMLElement;
  currentColor?: string; // 添加 currentColor 属性
  hsvaColor?: any; // 添加 hsvaColor 属性

  // DOM 相关方法
  getMountPoint: (name: string) => HTMLElement | null;
  getContainer: () => HTMLElement;

  // 颜色相关方法
  getColor: () => string;
  setColor: (color: string) => void;
  updateColor: (color: string) => void;
  syncAllPlugins: (color: string) => void;

  // 事件相关方法
  on: (event: string, handler: Function) => void;
  off: (event: string, handler: Function) => void;
  emit: (event: string, ...args: any[]) => void;
  trigger: (event: string, ...args: any[]) => void;

  // 面板相关方法
  showPanel: (animation?: boolean, time?: number) => void;
  hidePanel: (animation?: boolean, time?: number) => void;

  // 工具方法
  $: (selector: string, context?: HTMLElement) => HTMLElement | null;
  create: (tag: string) => HTMLElement;
  addClass: (element: HTMLElement, className: string) => void;
  removeClass: (element: HTMLElement, className: string) => void;
  hasClass: (element: HTMLElement, className: string) => boolean;
  setStyle: (
    element: HTMLElement,
    styles: string | Record<string, string>
  ) => void;
  insertNode: (parent: HTMLElement, child: HTMLElement) => void;
  removeElement: (element: HTMLElement) => void;
  getRect: (element: HTMLElement) => DOMRect;
  addEventListener: (
    element: HTMLElement,
    event: string,
    handler: Function
  ) => void;
  removeEventListener: (
    element: HTMLElement,
    event: string,
    handler: Function
  ) => void;
}

export function createMockCore(
  container: HTMLElement,
  options: any = {}
): MockCore {
  const mockCore: MockCore = {
    container,
    options: {
      defaultColor: "#ff0000",
      showPanel: true,
      showHue: true,
      showAlpha: true,
      showInput: true,
      showButton: true,
      showBox: true,
      showPredefine: true,
      showColorMode: true,
      showInputNumber: true,
      ...options,
    },
    plugins: options.plugins || {}, // 确保plugins能正确传递
    wrapper: container,
    hsvaColor: { h: 0, s: 100, v: 100, a: 1 }, // 添加默认的 hsvaColor

    // DOM 相关方法
    getMountPoint: vi.fn((name: string) => {
      switch (name) {
        case "root":
          return container;
        case "panelContainer":
          return (
            container.querySelector(".ew-color-picker-panel-container") ||
            createPanelContainer(container)
          );
        case "bottom-row":
          return (
            container.querySelector(".ew-color-picker-bottom-row") ||
            createBottomRow(container)
          );
        default:
          return container.querySelector(`[data-mount="${name}"]`);
      }
    }),

    getContainer: vi.fn(() => container),

    // 颜色相关方法
    getColor: vi.fn(
      () => mockCore.currentColor || mockCore.options.defaultColor || "#ff0000"
    ),
    setColor: vi.fn((color: string) => {
      mockCore.currentColor = color;
      mockCore.options.defaultColor = color;
      // 触发 change 事件
      mockCore.emit("change", color);
    }),
    updateColor: vi.fn((color: string) => {
      mockCore.setColor(color);
    }),

    syncAllPlugins: vi.fn((color: string) => {
      // 模拟同步所有插件的逻辑
      mockCore.currentColor = color;
      // 触发 change 事件
      mockCore.emit("change", color);
    }),

    // 事件相关方法
    on: vi.fn((event: string, handler: Function) => {
      if (!mockCore._eventHandlers) {
        mockCore._eventHandlers = {};
      }
      if (!mockCore._eventHandlers[event]) {
        mockCore._eventHandlers[event] = [];
      }
      mockCore._eventHandlers[event].push(handler);
    }),
    off: vi.fn((event: string, handler: Function) => {
      if (mockCore._eventHandlers && mockCore._eventHandlers[event]) {
        mockCore._eventHandlers[event] = mockCore._eventHandlers[event].filter(
          (h) => h !== handler
        );
      }
    }),
    emit: vi.fn((event: string, ...args: any[]) => {
      if (mockCore._eventHandlers && mockCore._eventHandlers[event]) {
        mockCore._eventHandlers[event].forEach((handler) => handler(...args));
      }
    }),
    trigger: vi.fn((event: string, ...args: any[]) => {
      if (mockCore._eventHandlers && mockCore._eventHandlers[event]) {
        mockCore._eventHandlers[event].forEach((handler) => handler(...args));
      }
    }),

    // 面板相关方法
    showPanel: vi.fn((animation = false, time = 300) => {
      const panelContainer = mockCore.getMountPoint("panelContainer");
      if (panelContainer) {
        panelContainer.classList.remove(
          "ew-color-picker-panel-container-hidden"
        );
      }
    }),

    hidePanel: vi.fn((animation = false, time = 300) => {
      const panelContainer = mockCore.getMountPoint("panelContainer");
      if (panelContainer) {
        panelContainer.classList.add("ew-color-picker-panel-container-hidden");
      }
    }),

    // 工具方法
    $: vi.fn((selector: string, context?: HTMLElement) => {
      const searchContext = context || container;
      return searchContext.querySelector(selector);
    }),

    create: vi.fn((tag: string) => {
      return document.createElement(tag);
    }),

    addClass: vi.fn((element: HTMLElement, className: string) => {
      element.classList.add(className);
    }),

    removeClass: vi.fn((element: HTMLElement, className: string) => {
      element.classList.remove(className);
    }),

    hasClass: vi.fn((element: HTMLElement, className: string) => {
      return element.classList.contains(className);
    }),

    setStyle: vi.fn(
      (element: HTMLElement, styles: string | Record<string, string>) => {
        if (typeof styles === "string") {
          element.style.cssText = styles;
        } else {
          Object.assign(element.style, styles);
        }
      }
    ),

    insertNode: vi.fn((parent: HTMLElement, child: HTMLElement) => {
      parent.appendChild(child);
    }),

    removeElement: vi.fn((element: HTMLElement) => {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    }),

    getRect: vi.fn((element: HTMLElement) => {
      return element.getBoundingClientRect();
    }),

    addEventListener: vi.fn(
      (element: HTMLElement, event: string, handler: Function) => {
        element.addEventListener(event, handler as EventListener);
      }
    ),

    removeEventListener: vi.fn(
      (element: HTMLElement, event: string, handler: Function) => {
        element.removeEventListener(event, handler as EventListener);
      }
    ),
  };

  // 添加事件处理器存储
  (mockCore as any)._eventHandlers = {};

  return mockCore;
}

// 辅助函数：创建面板容器
function createPanelContainer(container: HTMLElement): HTMLElement {
  const panelContainer = document.createElement("div");
  panelContainer.className =
    "ew-color-picker-panel-container ew-color-picker-panel-container-hidden";
  container.appendChild(panelContainer);
  return panelContainer;
}

// 辅助函数：创建底部行
function createBottomRow(container: HTMLElement): HTMLElement {
  const bottomRow = document.createElement("div");
  bottomRow.className =
    "ew-color-picker-bottom-row ew-color-picker-bottom-row-single";

  // 创建输入容器
  const inputContainer = document.createElement("div");
  inputContainer.className =
    "ew-color-picker-input-container ew-color-picker-input-container-flex";

  const input = document.createElement("input");
  input.className = "ew-color-picker-input";
  input.name = "ew-color-picker-input";
  input.placeholder = "请输入颜色值";
  input.type = "text";

  inputContainer.appendChild(input);
  bottomRow.appendChild(inputContainer);

  // 创建按钮组
  const buttonGroup = document.createElement("div");
  buttonGroup.className =
    "ew-color-picker-drop-btn-group ew-color-picker-drop-btn-group-single";

  const clearBtn = document.createElement("button");
  clearBtn.className = "ew-color-picker-clear-btn ew-color-picker-drop-btn";
  clearBtn.textContent = "清空";

  const sureBtn = document.createElement("button");
  sureBtn.className = "ew-color-picker-sure-btn ew-color-picker-drop-btn";
  sureBtn.textContent = "确定";

  buttonGroup.appendChild(clearBtn);
  buttonGroup.appendChild(sureBtn);
  bottomRow.appendChild(buttonGroup);

  // 添加到面板容器
  const panelContainer = container.querySelector(
    ".ew-color-picker-panel-container"
  );
  if (panelContainer) {
    panelContainer.appendChild(bottomRow);
  }

  return bottomRow;
}
