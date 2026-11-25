import {
  addClass,
  create,
  extend,
  removeClass,
  removeElement,
  setAttr,
  DEFAULT_PREFIX,
} from "@ew-color-picker/utils";

export interface TooltipOptions {
  // 类名前缀，需与选择器保持一致
  prefix?: string;
  // tooltip 节点挂载的父元素，默认 document.body
  container?: HTMLElement;
  // tooltip 与锚点的间距（px）
  offset?: number;
  // 附加到 tooltip 节点上的自定义类名
  className?: string;
}

interface ResolvedTooltipOptions {
  prefix: string;
  container?: HTMLElement;
  offset: number;
  className?: string;
}

/**
 * 轻量 tooltip：固定定位在锚点上方，空间不足时翻转到下方。
 * 一个实例对应一个 DOM 节点，由调用方决定何时 show / hide / destroy。
 */
export default class Tooltip {
  private options: ResolvedTooltipOptions;
  private node: HTMLDivElement | null = null;
  private visible: boolean = false;

  constructor(options: TooltipOptions = {}) {
    this.options = extend(
      {
        prefix: DEFAULT_PREFIX,
        container: undefined,
        offset: 6,
        className: "",
      },
      options
    ) as ResolvedTooltipOptions;
  }

  private get prefix(): string {
    return this.options.prefix;
  }

  private get parent(): HTMLElement {
    return this.options.container || document.body;
  }

  private ensureNode(): HTMLDivElement {
    if (!this.node) {
      const node = create<HTMLDivElement>("div");
      addClass(node, `${this.prefix}tooltip`);
      if (this.options.className) {
        addClass(node, this.options.className);
      }
      setAttr(node, { role: "tooltip" });
      this.parent.appendChild(node);
      this.node = node;
    }
    return this.node;
  }

  // 展示提示文案；空文案视为隐藏
  show(text: string, anchor: HTMLElement) {
    const content = (text || "").trim();
    if (!content || !anchor) {
      this.hide();
      return;
    }

    const node = this.ensureNode();
    const p = this.prefix;
    node.textContent = content;
    addClass(node, `${p}tooltip--visible`);
    removeClass(node, `${p}tooltip--bottom`);

    const rect = anchor.getBoundingClientRect();
    const offset = this.options.offset;
    node.style.left = `${rect.left}px`;
    node.style.top = `${rect.top - offset}px`;

    // 上方空间不足时翻转到锚点下方
    if (rect.top < node.offsetHeight + offset + 2) {
      node.style.top = `${rect.bottom + offset}px`;
      addClass(node, `${p}tooltip--bottom`);
    }
    this.visible = true;
  }

  hide() {
    if (this.node) {
      removeClass(this.node, `${this.prefix}tooltip--visible`);
    }
    this.visible = false;
  }

  isVisible(): boolean {
    return this.visible;
  }

  getElement(): HTMLDivElement | null {
    return this.node;
  }

  destroy() {
    if (this.node) {
      removeElement(this.node);
      this.node = null;
    }
    this.visible = false;
  }
}

// 内容是否被容器截断（横向）
export function isTextTruncated(el: HTMLElement | null | undefined): boolean {
  if (!el) return false;
  return el.scrollWidth > el.clientWidth;
}
