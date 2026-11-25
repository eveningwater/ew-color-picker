import {
  $,
  addClass,
  clamp,
  create,
  extend,
  getAttr,
  getElementSize,
  getRect,
  insertNode,
  isArray,
  isBoolean,
  isFunction,
  isHTMLElement,
  isNull,
  isPlacement,
  isString,
  isUndefined,
  off,
  on,
  parsePlacement,
  removeClass,
  removeElement,
  setAttr,
  toStyleStr,
  DEFAULT_PREFIX,
  type Placement,
  type PlacementSide,
} from "@ew-color-picker/utils";

// 主题
export type TooltipEffect = "dark" | "light";

// 12 种方位与 el-tooltip 的 placement 保持一致，类型定义在 utils 中复用
export type TooltipPlacement = Placement;

// 触发方式
export type TooltipTrigger = "hover" | "click" | "focus" | "contextmenu";

export type TooltipTriggerType = TooltipTrigger | TooltipTrigger[];

export type TooltipContent = string | HTMLElement | null | undefined;

export type TooltipEvent =
  | "beforeShow"
  | "show"
  | "beforeHide"
  | "hide"
  | "visibleChange";

// 虚拟锚点，只要求能返回几何信息
export interface TooltipVirtualElement {
  getBoundingClientRect(): DOMRect;
}

export interface TooltipPopperOptions {
  // 定位参照：fixed（默认，视口）或 absolute（文档）
  strategy?: "fixed" | "absolute";
}

export interface TooltipOptions {
  // 类名前缀，需与选择器保持一致
  prefix?: string;
  // 触发元素，可传 DOM 或选择器；也可只用声明式 API 时由它自动绑定事件
  target?: HTMLElement | string;
  // 提示内容，可传字符串或 DOM 节点
  content?: TooltipContent;
  // content 为字符串时是否按 HTML 解析
  rawContent?: boolean;
  // 主题，dark / light
  effect?: TooltipEffect;
  // 展示方位，默认 bottom
  placement?: TooltipPlacement;
  // 首选方位放不下时的候选方位
  fallbackPlacements?: TooltipPlacement[];
  // 受控可见状态；传入后由调用方通过 setOptions({ visible }) 控制
  visible?: boolean;
  // 禁用后不响应任何触发
  disabled?: boolean;
  // 与锚点的间距（px）
  offset?: number;
  // 箭头距离浮层边缘的最小距离（px）
  arrowOffset?: number;
  // 是否展示箭头
  showArrow?: boolean;
  // 悬浮后延迟展示（ms）
  showAfter?: number;
  // 离开后延迟隐藏（ms）
  hideAfter?: number;
  // 展示后自动隐藏的时长（ms），0 表示不自动隐藏
  autoClose?: number;
  // 附加到浮层上的自定义类名
  popperClass?: string;
  // 附加到浮层上的自定义样式
  popperStyle?: string | Record<string, string>;
  // 浮层挂载的父元素，可传 DOM 或选择器
  appendTo?: HTMLElement | string;
  // 是否挂载到 appendTo（默认 body），false 时挂到触发元素同级
  teleported?: boolean;
  // 是否允许鼠标移入浮层内容
  enterable?: boolean;
  // 触发方式，可传单个或数组
  trigger?: TooltipTriggerType;
  // 使用虚拟锚点定位（不绑定触发事件）
  virtualTriggering?: boolean;
  // 虚拟锚点
  virtualRef?: TooltipVirtualElement | HTMLElement | null;
  // click 触发时，哪些按键也能打开提示
  triggerKeys?: string[];
  // 隐藏后是否保留 DOM
  persistent?: boolean;
  // 自定义过渡类名
  transition?: string;
  // 浮层 aria-label
  ariaLabel?: string;
  // 隐藏后是否把焦点移回触发元素
  focusOnTarget?: boolean;
  // 定位策略
  popperOptions?: TooltipPopperOptions;
  // 兼容旧版：等同于 popperClass
  className?: string;
  // 兼容旧版：等同于 appendTo
  container?: HTMLElement;
  // 事件回调
  onBeforeShow?: (event?: Event) => void;
  onShow?: (event?: Event) => void;
  onBeforeHide?: (event?: Event) => void;
  onHide?: (event?: Event) => void;
  onVisibleChange?: (visible: boolean) => void;
}

interface ResolvedTooltipOptions
  extends Omit<TooltipOptions, "trigger" | "triggerKeys" | "popperOptions"> {
  prefix: string;
  effect: TooltipEffect;
  placement: TooltipPlacement;
  fallbackPlacements: TooltipPlacement[];
  disabled: boolean;
  offset: number;
  arrowOffset: number;
  showArrow: boolean;
  showAfter: number;
  hideAfter: number;
  autoClose: number;
  popperClass: string;
  popperStyle: string | Record<string, string>;
  teleported: boolean;
  enterable: boolean;
  trigger: TooltipTrigger[];
  triggerKeys: string[];
  persistent: boolean;
  transition: string;
  ariaLabel: string;
  focusOnTarget: boolean;
  popperOptions: TooltipPopperOptions;
}

interface AnchorRect {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

interface Size {
  width: number;
  height: number;
}

const TRIGGERS: TooltipTrigger[] = ["hover", "click", "focus", "contextmenu"];

const OPPOSITE_SIDE: Record<PlacementSide, PlacementSide> = {
  top: "bottom",
  bottom: "top",
  left: "right",
  right: "left",
};

// 浮层与视口边缘的最小留白
const VIEWPORT_PADDING = 5;
// 箭头尺寸（与样式中的宽高保持一致）
const ARROW_SIZE = 8;

let uid = 0;

function isTrigger(value: unknown): value is TooltipTrigger {
  return TRIGGERS.indexOf(value as TooltipTrigger) > -1;
}

function normalizeTrigger(trigger?: TooltipTriggerType): TooltipTrigger[] {
  if (isArray(trigger)) {
    const result = trigger.filter(isTrigger);
    return result.length ? result : ["hover"];
  }
  return isTrigger(trigger) ? [trigger] : ["hover"];
}

/**
 * 与 el-tooltip 能力对齐的悬浮提示：
 * 支持 12 种方位 + 自动翻转/位移、dark/light 主题、箭头、多种触发方式、
 * 延迟展示/隐藏、受控可见、虚拟锚点、事件与暴露方法。
 * 既可以通过 target + content 声明式使用，也可以 show(content, anchor) 手动控制。
 */
export default class Tooltip {
  private options: ResolvedTooltipOptions;
  private node: HTMLDivElement | null = null;
  private contentNode: HTMLDivElement | null = null;
  private arrowNode: HTMLDivElement | null = null;
  private isOpen: boolean = false;
  private controlled: boolean = false;
  private currentContent: TooltipContent = undefined;
  // 手动 show() 传入的锚点，优先级高于 target
  private imperativeAnchor: HTMLElement | null = null;
  private prevAriaDescribedBy: string | null = null;
  private showTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private autoCloseTimer: ReturnType<typeof setTimeout> | null = null;
  private positionFrame: number | null = null;
  private globalBound: boolean = false;
  private triggerListeners: Array<{
    el: HTMLElement;
    type: string;
    handler: EventListener;
  }> = [];
  private popperListeners: Array<{ type: string; handler: EventListener }> = [];
  private listeners: Partial<
    Record<TooltipEvent, Array<(...args: any[]) => void>>
  > = {};

  constructor(options: TooltipOptions = {}) {
    this.options = extend(
      {
        prefix: DEFAULT_PREFIX,
        rawContent: false,
        effect: "dark",
        placement: "bottom",
        fallbackPlacements: [],
        disabled: false,
        offset: 12,
        arrowOffset: 5,
        showArrow: true,
        showAfter: 0,
        hideAfter: 200,
        autoClose: 0,
        popperClass: "",
        popperStyle: "",
        teleported: true,
        enterable: true,
        triggerKeys: ["Enter", "Space"],
        persistent: true,
        transition: "",
        ariaLabel: "",
        focusOnTarget: false,
        popperOptions: {},
        className: "",
      },
      options
    ) as ResolvedTooltipOptions;

    this.options.trigger = normalizeTrigger(options.trigger);
    this.options.popperOptions = options.popperOptions || {};
    this.options.triggerKeys = options.triggerKeys || ["Enter", "Space"];
    this.controlled =
      Object.prototype.hasOwnProperty.call(options, "visible") &&
      isBoolean(options.visible);
    this.currentContent = options.content;

    this.bindTriggerEvents();

    if (this.controlled && this.options.visible) {
      this.doOpen();
    }
  }

  private get prefix(): string {
    return this.options.prefix;
  }

  private get strategy(): "fixed" | "absolute" {
    return this.options.popperOptions.strategy === "absolute"
      ? "absolute"
      : "fixed";
  }

  private get triggerList(): TooltipTrigger[] {
    return this.options.trigger;
  }

  /* ------------------------------- 内容与节点 ------------------------------- */

  private hasContent(content: TooltipContent = this.currentContent): boolean {
    if (isNull(content) || isUndefined(content)) return false;
    if (isString(content)) return content.trim().length > 0;
    return true;
  }

  private resolveElement(
    target?: HTMLElement | string | null
  ): HTMLElement | null {
    if (!target) return null;
    return isString(target) ? $<HTMLElement>(target) : target;
  }

  private getAnchorElement(): HTMLElement | null {
    if (this.options.virtualTriggering) {
      const ref = this.options.virtualRef;
      return isHTMLElement(ref) ? ref : null;
    }
    return this.imperativeAnchor || this.resolveElement(this.options.target);
  }

  private getAnchorRect(): AnchorRect | null {
    if (this.options.virtualTriggering) {
      const ref = this.options.virtualRef;
      if (ref && isFunction(ref.getBoundingClientRect)) {
        return ref.getBoundingClientRect() as AnchorRect;
      }
      return null;
    }
    const el = this.getAnchorElement();
    return el ? (getRect(el) as AnchorRect) : null;
  }

  private getParent(): HTMLElement {
    if (this.options.teleported === false) {
      const anchor = this.getAnchorElement();
      return anchor?.parentElement || document.body;
    }
    const appendTo = this.options.appendTo ?? this.options.container;
    if (isString(appendTo)) {
      return $<HTMLElement>(appendTo) || document.body;
    }
    return appendTo || document.body;
  }

  private applyCustomClasses(node: HTMLElement) {
    const extra = [this.options.popperClass, this.options.className]
      .filter(Boolean)
      .join(" ");
    if (extra) addClass(node, extra);
    if (this.options.transition) addClass(node, this.options.transition);
  }

  private applyPopperStyle(node: HTMLElement) {
    const style = this.options.popperStyle;
    if (!style) return;
    node.style.cssText += isString(style) ? style : toStyleStr(style);
  }

  private ensureNode(): HTMLDivElement {
    if (this.node) {
      this.attachNode();
      return this.node;
    }

    const p = this.prefix;
    const node = create<HTMLDivElement>("div");
    node.id = `${p}tooltip-${++uid}`;
    addClass(node, `${p}tooltip`);
    addClass(node, `${p}tooltip--${this.options.effect}`);
    if (this.options.enterable) addClass(node, `${p}tooltip--enterable`);
    setAttr(node, { role: "tooltip" });
    if (this.options.ariaLabel) {
      setAttr(node, { "aria-label": this.options.ariaLabel });
    }
    this.applyCustomClasses(node);
    node.style.position = this.strategy;

    this.contentNode = create<HTMLDivElement>("div");
    addClass(this.contentNode, `${p}tooltip__content`);
    insertNode(node, this.contentNode);

    this.arrowNode = create<HTMLDivElement>("div");
    addClass(this.arrowNode, `${p}tooltip__arrow`);
    if (!this.options.showArrow) this.arrowNode.style.display = "none";
    insertNode(node, this.arrowNode);

    this.applyPopperStyle(node);
    this.node = node;
    this.attachNode();
    this.bindPopperEvents();
    return node;
  }

  private attachNode() {
    if (!this.node) return;
    const parent = this.getParent();
    if (parent && this.node.parentNode !== parent) {
      parent.appendChild(this.node);
    }
  }

  private applyContent() {
    const node = this.contentNode;
    if (!node) return;
    const content = this.currentContent;
    node.textContent = "";

    if (isNull(content) || isUndefined(content)) return;
    if (isString(content)) {
      if (this.options.rawContent) {
        node.innerHTML = content;
      } else {
        node.textContent = content;
      }
      return;
    }
    if (isHTMLElement(content)) {
      node.appendChild(content);
      return;
    }
    node.textContent = String(content);
  }

  private destroyNode() {
    this.unbindPopperEvents();
    if (this.node) {
      removeElement(this.node);
      this.node = null;
    }
    this.contentNode = null;
    this.arrowNode = null;
  }

  /* --------------------------------- 定位 --------------------------------- */

  private getNodeSize(): Size {
    if (!this.node) return { width: 0, height: 0 };
    const { offsetWidth, offsetHeight } = getElementSize(this.node);
    return {
      width: offsetWidth || 0,
      height: offsetHeight || 0,
    };
  }

  private computeCoords(
    placement: TooltipPlacement,
    anchorRect: AnchorRect,
    size: Size
  ): { left: number; top: number } {
    const { side, align } = parsePlacement(placement);
    const offset = this.options.offset;
    let left = 0;
    let top = 0;

    const alignX = () => {
      if (align === "start") return anchorRect.left;
      if (align === "end") return anchorRect.right - size.width;
      return anchorRect.left + (anchorRect.width - size.width) / 2;
    };
    const alignY = () => {
      if (align === "start") return anchorRect.top;
      if (align === "end") return anchorRect.bottom - size.height;
      return anchorRect.top + (anchorRect.height - size.height) / 2;
    };

    switch (side) {
      case "top":
        top = anchorRect.top - offset - size.height;
        left = alignX();
        break;
      case "bottom":
        top = anchorRect.bottom + offset;
        left = alignX();
        break;
      case "left":
        left = anchorRect.left - offset - size.width;
        top = alignY();
        break;
      case "right":
        left = anchorRect.right + offset;
        top = alignY();
        break;
    }

    // 视口边界位移（shift）
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    if (side === "top" || side === "bottom") {
      left = clamp(
        left,
        VIEWPORT_PADDING,
        Math.max(VIEWPORT_PADDING, vw - size.width - VIEWPORT_PADDING)
      );
    } else {
      top = clamp(
        top,
        VIEWPORT_PADDING,
        Math.max(VIEWPORT_PADDING, vh - size.height - VIEWPORT_PADDING)
      );
    }

    if (this.strategy === "absolute") {
      left += window.scrollX || window.pageXOffset || 0;
      top += window.scrollY || window.pageYOffset || 0;
    }

    return { left, top };
  }

  private fitsViewport(
    placement: TooltipPlacement,
    anchorRect: AnchorRect,
    size: Size
  ): boolean {
    const { side } = parsePlacement(placement);
    const offset = this.options.offset;
    const vw = window.innerWidth;
    const vh = window.innerHeight;

    switch (side) {
      case "top":
        return (
          anchorRect.top - offset - size.height >= VIEWPORT_PADDING
        );
      case "bottom":
        return (
          anchorRect.bottom + offset + size.height <=
          vh - VIEWPORT_PADDING
        );
      case "left":
        return (
          anchorRect.left - offset - size.width >= VIEWPORT_PADDING
        );
      case "right":
        return (
          anchorRect.right + offset + size.width <=
          vw - VIEWPORT_PADDING
        );
    }
  }

  private resolvePlacement(
    anchorRect: AnchorRect,
    size: Size
  ): TooltipPlacement {
    const preferred = this.options.placement;
    if (this.fitsViewport(preferred, anchorRect, size)) return preferred;

    const { side, align } = parsePlacement(preferred);
    const opposite = OPPOSITE_SIDE[side];
    const fallback = (
      align === "center" ? opposite : `${opposite}-${align}`
    ) as TooltipPlacement;
    const fallbacks = this.options.fallbackPlacements.length
      ? this.options.fallbackPlacements
      : [fallback];

    for (const placement of fallbacks) {
      if (isPlacement(placement) && this.fitsViewport(placement, anchorRect, size)) {
        return placement;
      }
    }
    return preferred;
  }

  private updateArrow(
    placement: TooltipPlacement,
    anchorRect: AnchorRect,
    coords: { left: number; top: number },
    size: Size
  ) {
    const arrow = this.arrowNode;
    if (!arrow) return;
    if (!this.options.showArrow) {
      arrow.style.display = "none";
      return;
    }
    arrow.style.display = "";
    arrow.style.left = "";
    arrow.style.right = "";
    arrow.style.top = "";
    arrow.style.bottom = "";

    const { side } = parsePlacement(placement);
    const half = ARROW_SIZE / 2;
    const min = this.options.arrowOffset;

    if (side === "top" || side === "bottom") {
      const centerX = anchorRect.left + anchorRect.width / 2;
      let x = centerX - coords.left;
      if (size.width > min * 2) {
        x = clamp(x, min, size.width - min);
      }
      arrow.style.left = `${x - half}px`;
      if (side === "top") {
        arrow.style.bottom = `${-half}px`;
      } else {
        arrow.style.top = `${-half}px`;
      }
    } else {
      const centerY = anchorRect.top + anchorRect.height / 2;
      let y = centerY - coords.top;
      if (size.height > min * 2) {
        y = clamp(y, min, size.height - min);
      }
      arrow.style.top = `${y - half}px`;
      if (side === "left") {
        arrow.style.right = `${-half}px`;
      } else {
        arrow.style.left = `${-half}px`;
      }
    }

    setAttr(arrow, { "data-placement": placement });
  }

  private updatePosition() {
    const node = this.node;
    if (!node) return;
    const anchorRect = this.getAnchorRect();
    if (!anchorRect) return;

    const size = this.getNodeSize();
    const placement = this.resolvePlacement(anchorRect, size);
    const coords = this.computeCoords(placement, anchorRect, size);

    node.style.left = `${Math.round(coords.left)}px`;
    node.style.top = `${Math.round(coords.top)}px`;
    setAttr(node, {
      "data-placement": placement,
      "data-popper-placement": placement,
    });

    this.updateArrow(placement, anchorRect, coords, size);
  }

  // 滚动/resize 时按帧合并重算，避免高频 reflow
  private scheduleUpdate = () => {
    if (this.positionFrame !== null) return;
    const raf =
      typeof requestAnimationFrame === "function"
        ? requestAnimationFrame
        : (cb: FrameRequestCallback) =>
            setTimeout(() => cb(Date.now()), 16) as unknown as number;
    this.positionFrame = raf(() => {
      this.positionFrame = null;
      this.updatePosition();
    });
  };

  /* -------------------------------- 事件绑定 -------------------------------- */

  private addTriggerListener(
    el: HTMLElement,
    type: string,
    handler: EventListener
  ) {
    on(el, type, handler);
    this.triggerListeners.push({ el, type, handler });
  }

  private bindTriggerEvents() {
    this.unbindTriggerEvents();
    if (this.options.virtualTriggering) return;
    const el = this.resolveElement(this.options.target);
    if (!el) return;

    const triggers = this.triggerList;
    const hasHover = triggers.indexOf("hover") > -1;
    const hasClick = triggers.indexOf("click") > -1;
    const hasFocus = triggers.indexOf("focus") > -1;
    const hasContextMenu = triggers.indexOf("contextmenu") > -1;

    if (hasHover) {
      this.addTriggerListener(el, "mouseenter", () => this.requestOpen());
      this.addTriggerListener(el, "mouseleave", (event) =>
        this.requestHide(event)
      );
      this.addTriggerListener(el, "focus", () => this.requestOpen());
      this.addTriggerListener(el, "blur", (event) =>
        this.handleBlur(event as FocusEvent)
      );
    }

    if (hasFocus && !hasHover) {
      this.addTriggerListener(el, "focus", () => this.requestOpen());
      this.addTriggerListener(el, "blur", (event) =>
        this.handleBlur(event as FocusEvent)
      );
    }

    if (hasClick) {
      this.addTriggerListener(el, "click", () => {
        if (this.isOpen) {
          this.hide();
        } else {
          this.requestOpen();
        }
      });
      this.addTriggerListener(el, "keydown", (event) =>
        this.handleTriggerKeydown(event as KeyboardEvent)
      );
    }

    if (hasContextMenu) {
      this.addTriggerListener(el, "contextmenu", (event) => {
        event.preventDefault();
        this.requestOpen(event);
      });
    }
  }

  private unbindTriggerEvents() {
    this.triggerListeners.forEach(({ el, type, handler }) => {
      off(el, type, handler);
    });
    this.triggerListeners = [];
  }

  private bindPopperEvents() {
    if (!this.node || this.popperListeners.length) return;
    const cancelHide = () => this.clearHideTimer();
    const leave = (event: Event) => this.requestHide(event);
    on(this.node, "mouseenter", cancelHide);
    on(this.node, "mouseleave", leave);
    this.popperListeners = [
      { type: "mouseenter", handler: cancelHide },
      { type: "mouseleave", handler: leave },
    ];
  }

  private unbindPopperEvents() {
    if (!this.node) {
      this.popperListeners = [];
      return;
    }
    this.popperListeners.forEach(({ type, handler }) => {
      off(this.node!, type, handler);
    });
    this.popperListeners = [];
  }

  private handleBlur(event: FocusEvent) {
    const related = event.relatedTarget as Node | null;
    if (
      related &&
      this.node &&
      this.node.contains(related) &&
      this.options.enterable
    ) {
      return;
    }
    this.requestHide(event);
  }

  private handleTriggerKeydown(event: KeyboardEvent) {
    const keys = this.options.triggerKeys;
    // 兼容 event.key（Enter）与 event.code（Space / NumpadEnter）
    if (
      (keys.indexOf(event.key) > -1 || keys.indexOf(event.code) > -1) &&
      !this.isOpen &&
      !this.options.disabled
    ) {
      event.preventDefault();
      this.requestOpen(event);
    }
  }

  private handleDocumentKeydown = (event: Event) => {
    const keyboardEvent = event as KeyboardEvent;
    if (keyboardEvent.key === "Escape" && this.isOpen) {
      this.doHide(event);
    }
  };

  private handleDocumentClick = (event: Event) => {
    const target = event.target as Node | null;
    if (!target) return;
    if (this.node && this.node.contains(target)) return;
    const anchor = this.getAnchorElement();
    if (anchor && anchor.contains(target)) return;
    this.hide();
  };

  private bindGlobalEvents() {
    if (this.globalBound) return;
    on(window, "scroll", this.scheduleUpdate, { capture: true });
    on(window, "resize", this.scheduleUpdate);
    on(document, "keydown", this.handleDocumentKeydown);
    if (this.triggerList.indexOf("click") > -1) {
      on(document, "click", this.handleDocumentClick, { capture: true });
    }
    this.globalBound = true;
  }

  private unbindGlobalEvents() {
    if (!this.globalBound) return;
    off(window, "scroll", this.scheduleUpdate, { capture: true });
    off(window, "resize", this.scheduleUpdate);
    off(document, "keydown", this.handleDocumentKeydown);
    if (this.triggerList.indexOf("click") > -1) {
      off(document, "click", this.handleDocumentClick, { capture: true });
    }
    this.globalBound = false;
    if (this.positionFrame !== null) {
      if (typeof cancelAnimationFrame === "function") {
        cancelAnimationFrame(this.positionFrame);
      }
      this.positionFrame = null;
    }
  }

  /* --------------------------------- 状态 --------------------------------- */

  private setAriaDescribedBy(add: boolean) {
    const anchor = this.getAnchorElement();
    if (!anchor || !this.node) return;
    if (add) {
      this.prevAriaDescribedBy = getAttr(anchor, "aria-describedby");
      setAttr(anchor, { "aria-describedby": this.node.id });
    } else if (getAttr(anchor, "aria-describedby") === this.node.id) {
      if (this.prevAriaDescribedBy) {
        setAttr(anchor, { "aria-describedby": this.prevAriaDescribedBy });
      } else {
        anchor.removeAttribute("aria-describedby");
      }
    }
  }

  private emit(event: TooltipEvent, ...args: any[]) {
    const handlers = this.listeners[event];
    if (handlers) {
      handlers.forEach((handler) => handler(...args));
    }
    const optionKey = `on${event.charAt(0).toUpperCase()}${event.slice(1)}`;
    const optionHandler = (this.options as any)[optionKey];
    if (isFunction(optionHandler)) {
      optionHandler(...args);
    }
  }

  private clearShowTimer() {
    if (this.showTimer) {
      clearTimeout(this.showTimer);
      this.showTimer = null;
    }
  }

  private clearHideTimer() {
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
      this.hideTimer = null;
    }
  }

  private clearAutoCloseTimer() {
    if (this.autoCloseTimer) {
      clearTimeout(this.autoCloseTimer);
      this.autoCloseTimer = null;
    }
  }

  private requestOpen(event?: Event) {
    if (this.options.disabled) return;
    this.clearHideTimer();
    if (this.isOpen) return;
    if (this.controlled) {
      this.emit("visibleChange", true);
      return;
    }
    const delay = this.options.showAfter;
    if (delay > 0) {
      this.clearShowTimer();
      this.showTimer = setTimeout(() => this.doOpen(event), delay);
    } else {
      this.doOpen(event);
    }
  }

  private requestHide(event?: Event) {
    this.clearShowTimer();
    if (!this.isOpen) return;
    if (this.controlled) {
      this.emit("visibleChange", false);
      return;
    }
    const delay = this.options.hideAfter;
    if (delay > 0) {
      this.clearHideTimer();
      this.hideTimer = setTimeout(() => this.doHide(event), delay);
    } else {
      this.doHide(event);
    }
  }

  private doOpen(event?: Event) {
    if (this.options.disabled || !this.hasContent()) return;
    // target 可能晚于实例创建才挂载到页面上，首次展示时补绑触发事件
    if (!this.triggerListeners.length && !this.options.virtualTriggering) {
      this.bindTriggerEvents();
    }
    if (this.isOpen) {
      this.applyContent();
      this.updatePosition();
      return;
    }

    this.clearTimers();
    this.emit("beforeShow", event);

    const node = this.ensureNode();
    this.applyContent();
    addClass(node, `${this.prefix}tooltip--visible`);
    this.isOpen = true;

    this.updatePosition();
    this.bindGlobalEvents();
    this.setAriaDescribedBy(true);

    this.emit("show", event);
    this.emit("visibleChange", true);

    if (this.options.autoClose > 0) {
      this.autoCloseTimer = setTimeout(() => {
        this.doHide();
      }, this.options.autoClose);
    }
  }

  private doHide(event?: Event) {
    if (!this.isOpen) return;
    this.emit("beforeHide", event);
    this.isOpen = false;

    if (this.node) {
      removeClass(this.node, `${this.prefix}tooltip--visible`);
    }
    this.setAriaDescribedBy(false);
    this.unbindGlobalEvents();
    this.clearTimers();

    this.emit("hide", event);
    this.emit("visibleChange", false);

    if (!this.options.persistent) {
      this.destroyNode();
    }

    if (this.options.focusOnTarget) {
      const anchor = this.getAnchorElement();
      anchor?.focus();
    }
  }

  private clearTimers() {
    this.clearShowTimer();
    this.clearHideTimer();
    this.clearAutoCloseTimer();
  }

  /* -------------------------------- 公开 API -------------------------------- */

  /**
   * 手动展示提示。
   * @param content 提示内容，省略时沿用 options.content
   * @param anchor 锚点元素，省略时沿用 options.target
   */
  show(content?: TooltipContent, anchor?: HTMLElement) {
    if (anchor) this.imperativeAnchor = anchor;
    if (content !== undefined) this.currentContent = content;

    if (!this.hasContent()) {
      this.hide();
      return;
    }
    if (this.options.disabled) return;

    if (this.controlled) {
      this.emit("visibleChange", true);
      return;
    }
    this.doOpen();
  }

  // 立即隐藏
  hide(event?: Event) {
    if (this.controlled) {
      this.emit("visibleChange", false);
      return;
    }
    this.doHide(event);
  }

  // 与 el-tooltip 暴露的 onOpen / onClose 对齐
  onOpen() {
    this.requestOpen();
  }

  onClose() {
    this.hide();
  }

  isVisible(): boolean {
    return this.isOpen;
  }

  getElement(): HTMLDivElement | null {
    return this.node;
  }

  getContentElement(): HTMLDivElement | null {
    return this.contentNode;
  }

  getTrigger(): HTMLElement | null {
    return this.resolveElement(this.options.target);
  }

  // 焦点是否位于浮层内容内
  isFocusInsideContent(): boolean {
    return Boolean(this.node && this.node.contains(document.activeElement));
  }

  // 重新计算位置，可手动调用
  updatePopper() {
    this.updatePosition();
  }

  setContent(content: TooltipContent) {
    this.currentContent = content;
    if (this.isOpen) {
      this.applyContent();
      this.updatePosition();
    }
  }

  setOptions(options: Partial<TooltipOptions>) {
    const prevTarget = this.options.target;
    const prevTrigger = this.options.trigger.join(",");
    const prevAppendTo = this.options.appendTo;
    const prevContainer = this.options.container;
    const prevVirtual = this.options.virtualTriggering;

    this.options = extend(this.options, options) as ResolvedTooltipOptions;

    if (options.trigger !== undefined) {
      this.options.trigger = normalizeTrigger(options.trigger);
    }
    if (options.triggerKeys) {
      this.options.triggerKeys = options.triggerKeys;
    }
    if (options.popperOptions) {
      this.options.popperOptions = options.popperOptions;
    }
    if (options.content !== undefined) {
      this.currentContent = options.content;
    }
    if (Object.prototype.hasOwnProperty.call(options, "visible")) {
      this.controlled = isBoolean(options.visible);
    }

    // 触发/挂载相关配置变化时重新绑定
    if (
      options.target !== undefined ||
      options.trigger !== undefined ||
      options.virtualTriggering !== undefined ||
      prevTarget !== this.options.target ||
      prevTrigger !== this.options.trigger.join(",") ||
      prevVirtual !== this.options.virtualTriggering
    ) {
      this.bindTriggerEvents();
    }
    if (
      this.node &&
      (options.appendTo !== undefined ||
        options.container !== undefined ||
        options.teleported !== undefined ||
        prevAppendTo !== this.options.appendTo ||
        prevContainer !== this.options.container)
    ) {
      this.attachNode();
    }

    if (this.node) {
      const p = this.prefix;
      this.node.style.position = this.strategy;
      removeClass(this.node, `${p}tooltip--dark`);
      removeClass(this.node, `${p}tooltip--light`);
      addClass(this.node, `${p}tooltip--${this.options.effect}`);

      if (this.options.enterable) {
        addClass(this.node, `${p}tooltip--enterable`);
      } else {
        removeClass(this.node, `${p}tooltip--enterable`);
      }
      if (this.arrowNode) {
        this.arrowNode.style.display = this.options.showArrow ? "" : "none";
      }
      if (this.options.ariaLabel) {
        setAttr(this.node, { "aria-label": this.options.ariaLabel });
      }
      if (this.options.popperClass) {
        addClass(this.node, this.options.popperClass);
      }
      if (this.options.popperStyle) {
        this.applyPopperStyle(this.node);
      }
      if (this.isOpen) {
        this.applyContent();
        this.updatePosition();
      }
    }

    if (this.options.disabled) {
      this.doHide();
    } else if (this.controlled) {
      if (this.options.visible) {
        this.doOpen();
      } else {
        this.doHide();
      }
    }
  }

  // 事件订阅，返回实例便于链式调用
  on(event: TooltipEvent, handler: (...args: any[]) => void) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event]!.push(handler);
    return this;
  }

  off(event: TooltipEvent, handler?: (...args: any[]) => void) {
    const handlers = this.listeners[event];
    if (!handlers) return this;
    if (!handler) {
      this.listeners[event] = [];
      return this;
    }
    this.listeners[event] = handlers.filter((item) => item !== handler);
    return this;
  }

  destroy() {
    this.clearTimers();
    this.unbindTriggerEvents();
    this.unbindGlobalEvents();
    this.unbindPopperEvents();
    this.setAriaDescribedBy(false);
    this.destroyNode();
    this.currentContent = undefined;
    this.imperativeAnchor = null;
    this.isOpen = false;
    this.listeners = {};
    this.controlled = false;
  }
}
