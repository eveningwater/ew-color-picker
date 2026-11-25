import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import Tooltip, { type TooltipOptions } from "../src/index";

interface RectLike {
  left: number;
  top: number;
  right: number;
  bottom: number;
  width: number;
  height: number;
}

let instances: Tooltip[] = [];

function create(options: TooltipOptions = {}): Tooltip {
  const instance = new Tooltip(options);
  instances.push(instance);
  return instance;
}

function setRect(el: HTMLElement, rect: RectLike) {
  const full = {
    ...rect,
    x: rect.left,
    y: rect.top,
    toJSON: () => rect,
  };
  el.getBoundingClientRect = () => full as DOMRect;
}

function createAnchor(rect?: RectLike): HTMLElement {
  const anchor = document.createElement("button");
  document.body.appendChild(anchor);
  if (rect) setRect(anchor, rect);
  return anchor;
}

function setSize(el: HTMLElement, width: number, height: number) {
  Object.defineProperty(el, "offsetWidth", {
    configurable: true,
    value: width,
  });
  Object.defineProperty(el, "offsetHeight", {
    configurable: true,
    value: height,
  });
}

function getNode(): HTMLElement {
  return document.querySelector(".ew-tooltip") as HTMLElement;
}

function click(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

function hover(el: HTMLElement, type: "mouseenter" | "mouseleave" = "mouseenter") {
  el.dispatchEvent(new MouseEvent(type));
}

function focus(el: HTMLElement) {
  el.dispatchEvent(new FocusEvent("focus"));
}

function blur(el: HTMLElement, relatedTarget?: Node) {
  const event = new FocusEvent("blur");
  if (relatedTarget) {
    Object.defineProperty(event, "relatedTarget", { value: relatedTarget });
  }
  el.dispatchEvent(event);
}

function mockViewport(width = 1024, height = 768) {
  vi.spyOn(window, "innerWidth", "get").mockReturnValue(width);
  vi.spyOn(window, "innerHeight", "get").mockReturnValue(height);
}

// 打开提示并设置浮层尺寸，方便断言精确坐标
function openWith(
  rect: RectLike,
  options: TooltipOptions = {},
  size: [number, number] = [100, 30]
): { tooltip: Tooltip; node: HTMLElement } {
  const anchor = createAnchor(rect);
  const tooltip = create({ content: "定位", ...options });
  tooltip.show(undefined, anchor);
  const node = tooltip.getElement()!;
  setSize(node, size[0], size[1]);
  tooltip.updatePopper();
  return { tooltip, node };
}

beforeEach(() => {
  mockViewport();
});

afterEach(() => {
  instances.forEach((instance) => instance.destroy());
  instances = [];
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
  vi.useRealTimers();
  document.body.innerHTML = "";
});

describe("Tooltip 定位计算", () => {
  it("places the tooltip below the anchor and centers it", () => {
    const { node } = openWith({
      left: 100,
      top: 100,
      right: 300,
      bottom: 140,
      width: 200,
      height: 40,
    });

    expect(node.style.left).toBe("150px");
    expect(node.style.top).toBe("152px");
    expect(node.getAttribute("data-placement")).toBe("bottom");
    expect(node.getAttribute("data-popper-placement")).toBe("bottom");
  });

  it("aligns to the start and clamps the arrow by arrowOffset", () => {
    const { node } = openWith(
      { left: 100, top: 100, right: 300, bottom: 140, width: 200, height: 40 },
      { placement: "bottom-start" }
    );

    const arrow = node.querySelector(".ew-tooltip__arrow") as HTMLElement;
    expect(node.style.left).toBe("100px");
    // 箭头中心会被限制在 [arrowOffset, width - arrowOffset] 内
    expect(arrow.style.left).toBe("91px");
    expect(arrow.getAttribute("data-placement")).toBe("bottom-start");
  });

  it("aligns to the end", () => {
    const { node } = openWith(
      { left: 100, top: 100, right: 300, bottom: 140, width: 200, height: 40 },
      { placement: "bottom-end" }
    );

    const arrow = node.querySelector(".ew-tooltip__arrow") as HTMLElement;
    expect(node.style.left).toBe("200px");
    expect(arrow.style.left).toBe("1px");
  });

  it("places the tooltip above the anchor when there is room", () => {
    const { node } = openWith(
      { left: 100, top: 400, right: 300, bottom: 440, width: 200, height: 40 },
      { placement: "top" }
    );

    const arrow = node.querySelector(".ew-tooltip__arrow") as HTMLElement;
    expect(node.getAttribute("data-placement")).toBe("top");
    expect(node.style.left).toBe("150px");
    expect(node.style.top).toBe("358px");
    expect(arrow.style.bottom).toBe("-4px");
    expect(arrow.style.top).toBe("");
  });

  it("places the tooltip to the left and positions the arrow vertically", () => {
    const { node } = openWith(
      { left: 400, top: 100, right: 600, bottom: 140, width: 200, height: 40 },
      { placement: "left" }
    );

    const arrow = node.querySelector(".ew-tooltip__arrow") as HTMLElement;
    expect(node.getAttribute("data-placement")).toBe("left");
    expect(node.style.left).toBe("288px");
    expect(node.style.top).toBe("105px");
    expect(arrow.style.right).toBe("-4px");
    expect(arrow.style.top).toBe("11px");
  });

  it("places the tooltip to the right of the anchor", () => {
    const { node } = openWith(
      { left: 100, top: 100, right: 300, bottom: 140, width: 200, height: 40 },
      { placement: "right" }
    );

    const arrow = node.querySelector(".ew-tooltip__arrow") as HTMLElement;
    expect(node.getAttribute("data-placement")).toBe("right");
    expect(node.style.left).toBe("312px");
    expect(arrow.style.left).toBe("-4px");
  });

  it("shifts horizontally to stay inside the viewport", () => {
    const leftEdge = openWith(
      { left: -20, top: 100, right: 180, bottom: 140, width: 200, height: 40 },
      { placement: "bottom-start" }
    );
    expect(leftEdge.node.style.left).toBe("5px");
    leftEdge.tooltip.destroy();

    const rightEdge = openWith(
      { left: 1000, top: 100, right: 1200, bottom: 140, width: 200, height: 40 },
      { placement: "bottom-start" }
    );
    expect(rightEdge.node.style.left).toBe("919px");
  });

  it("shifts vertically to stay inside the viewport", () => {
    const { node } = openWith(
      { left: 400, top: 760, right: 600, bottom: 800, width: 200, height: 40 },
      { placement: "left" }
    );

    expect(node.getAttribute("data-placement")).toBe("left");
    expect(node.style.top).toBe("733px");
  });

  it("flips to the opposite side when the tooltip does not fit", () => {
    const { node } = openWith(
      { left: 100, top: 20, right: 300, bottom: 60, width: 200, height: 40 },
      { placement: "top" }
    );

    expect(node.getAttribute("data-placement")).toBe("bottom");
    expect(node.style.top).toBe("72px");
  });

  it("tries fallbackPlacements in order", () => {
    const { node } = openWith(
      { left: 100, top: 20, right: 300, bottom: 60, width: 200, height: 40 },
      { placement: "top", fallbackPlacements: ["left", "right"] }
    );

    expect(node.getAttribute("data-placement")).toBe("right");
    expect(node.style.left).toBe("312px");
    expect(node.style.top).toBe("25px");
  });

  it("keeps the preferred placement and clamps when nothing fits", () => {
    mockViewport(200, 100);
    const { node } = openWith(
      { left: 50, top: 40, right: 150, bottom: 60, width: 100, height: 20 },
      {},
      [180, 90]
    );

    expect(node.getAttribute("data-placement")).toBe("bottom");
    expect(node.style.left).toBe("10px");
    expect(node.style.top).toBe("72px");
  });

  it("respects a custom offset", () => {
    const { node } = openWith(
      { left: 100, top: 100, right: 300, bottom: 140, width: 200, height: 40 },
      { offset: 30 }
    );

    expect(node.style.top).toBe("170px");
  });

  it("hides the arrow when showArrow is false", () => {
    const { node } = openWith(
      { left: 100, top: 100, right: 300, bottom: 140, width: 200, height: 40 },
      { showArrow: false }
    );

    const arrow = node.querySelector(".ew-tooltip__arrow") as HTMLElement;
    expect(arrow.style.display).toBe("none");
  });
});

describe("Tooltip 触发方式", () => {
  it("opens on hover immediately and hides after the default delay", () => {
    vi.useFakeTimers();
    const anchor = createAnchor();
    const tooltip = create({ target: anchor, content: "悬浮" });

    hover(anchor, "mouseenter");
    expect(tooltip.isVisible()).toBe(true);

    hover(anchor, "mouseleave");
    expect(tooltip.isVisible()).toBe(true);
    vi.advanceTimersByTime(199);
    expect(tooltip.isVisible()).toBe(true);
    vi.advanceTimersByTime(1);
    expect(tooltip.isVisible()).toBe(false);
  });

  it("opens on focus and hides on blur", () => {
    const anchor = createAnchor();
    const tooltip = create({
      target: anchor,
      content: "聚焦",
      trigger: "focus",
      hideAfter: 0,
    });

    focus(anchor);
    expect(tooltip.isVisible()).toBe(true);

    blur(anchor);
    expect(tooltip.isVisible()).toBe(false);
  });

  it("combines triggers passed as an array", () => {
    const anchor = createAnchor();
    const tooltip = create({
      target: anchor,
      content: "组合",
      trigger: ["hover", "click"],
    });

    hover(anchor);
    expect(tooltip.isVisible()).toBe(true);

    click(anchor);
    expect(tooltip.isVisible()).toBe(false);

    click(anchor);
    expect(tooltip.isVisible()).toBe(true);
  });

  it("combines contextmenu and click triggers", () => {
    const anchor = createAnchor();
    const tooltip = create({
      target: anchor,
      content: "右键与点击",
      trigger: ["contextmenu", "click"],
    });

    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(tooltip.isVisible()).toBe(true);

    click(anchor);
    expect(tooltip.isVisible()).toBe(false);
  });

  it("keeps the tooltip open when focus moves into enterable content", () => {
    const anchor = createAnchor();
    const tooltip = create({
      target: anchor,
      content: "焦点移入",
      trigger: "focus",
      hideAfter: 0,
      enterable: true,
    });

    focus(anchor);
    const inner = document.createElement("button");
    tooltip.getElement()!.appendChild(inner);
    blur(anchor, inner);

    expect(tooltip.isVisible()).toBe(true);
  });

  it("closes when focus moves into content but enterable is false", () => {
    const anchor = createAnchor();
    const tooltip = create({
      target: anchor,
      content: "不可移入",
      trigger: "focus",
      hideAfter: 0,
      enterable: false,
    });

    focus(anchor);
    const inner = document.createElement("button");
    tooltip.getElement()!.appendChild(inner);
    blur(anchor, inner);

    expect(tooltip.isVisible()).toBe(false);
  });

  it("supports the default Space trigger key via event.code", () => {
    const anchor = createAnchor();
    const tooltip = create({
      target: anchor,
      content: "空格",
      trigger: "click",
    });

    const event = new KeyboardEvent("keydown", {
      key: " ",
      code: "Space",
      bubbles: true,
      cancelable: true,
    });
    anchor.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(tooltip.isVisible()).toBe(true);
  });

  it("ignores trigger keys when disabled or already open", () => {
    const disabledAnchor = createAnchor();
    const disabledTooltip = create({
      target: disabledAnchor,
      content: "禁用",
      trigger: "click",
      disabled: true,
    });
    const disabledEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    disabledAnchor.dispatchEvent(disabledEvent);
    expect(disabledEvent.defaultPrevented).toBe(false);
    expect(disabledTooltip.isVisible()).toBe(false);

    const anchor = createAnchor();
    const tooltip = create({
      target: anchor,
      content: "已打开",
      trigger: "click",
    });
    click(anchor);
    const event = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    anchor.dispatchEvent(event);
    expect(event.defaultPrevented).toBe(false);
    expect(tooltip.isVisible()).toBe(true);
  });
});

describe("Tooltip 内容与公开 API", () => {
  it("uses options.content when show() is called without content", () => {
    const anchor = createAnchor();
    const tooltip = create({ content: "默认内容" });
    tooltip.show(undefined, anchor);

    expect(getNode().textContent).toBe("默认内容");
  });

  it("updates content without emitting show events twice", () => {
    const anchor = createAnchor();
    const tooltip = create();
    const beforeShow = vi.fn();
    const show = vi.fn();
    tooltip.on("beforeShow", beforeShow).on("show", show);

    tooltip.show("第一次", anchor);
    tooltip.show("第二次", anchor);

    expect(beforeShow).toHaveBeenCalledTimes(1);
    expect(show).toHaveBeenCalledTimes(1);
    expect(getNode().textContent).toBe("第二次");
  });

  it("hides when show() receives empty content while open", () => {
    const anchor = createAnchor();
    const tooltip = create();
    tooltip.show("内容", anchor);
    tooltip.show("   ", anchor);

    expect(tooltip.isVisible()).toBe(false);
  });

  it("keeps content set by setContent before the first show", () => {
    const anchor = createAnchor();
    const tooltip = create();
    tooltip.setContent("预设内容");
    tooltip.show(undefined, anchor);

    expect(getNode().textContent).toBe("预设内容");
  });

  it("returns null before the node is created", () => {
    const anchor = createAnchor();
    const tooltip = create({ target: anchor });

    expect(tooltip.getElement()).toBeNull();
    expect(tooltip.getContentElement()).toBeNull();
    expect(tooltip.getTrigger()).toBe(anchor);
    expect(tooltip.isVisible()).toBe(false);
  });

  it("subscribes and unsubscribes handlers", () => {
    const anchor = createAnchor();
    const tooltip = create({ content: "订阅事件" });
    const handler = vi.fn();
    const hideHandler = vi.fn();

    expect(tooltip.on("show", handler)).toBe(tooltip);
    tooltip.show(undefined, anchor);
    expect(handler).toHaveBeenCalledTimes(1);

    tooltip.hide();
    tooltip.off("show", handler);
    tooltip.show(undefined, anchor);
    expect(handler).toHaveBeenCalledTimes(1);

    tooltip.on("hide", hideHandler).off("hide");
    tooltip.hide();
    expect(hideHandler).not.toHaveBeenCalled();
  });

  it("exposes onOpen and onClose", () => {
    const anchor = createAnchor();
    const tooltip = create({ content: "暴露方法" });

    tooltip.onOpen();
    expect(tooltip.isVisible()).toBe(true);

    tooltip.show(undefined, anchor);
    tooltip.onClose();
    expect(tooltip.isVisible()).toBe(false);
  });
});

describe("Tooltip 运行时配置", () => {
  it("updates content while open", () => {
    const anchor = createAnchor();
    const tooltip = create();
    tooltip.show("旧内容", anchor);

    tooltip.setOptions({ content: "新内容" });

    expect(getNode().textContent).toBe("新内容");
    expect(tooltip.isVisible()).toBe(true);
  });

  it("disables at runtime and hides the tooltip", () => {
    const anchor = createAnchor();
    const tooltip = create({
      target: anchor,
      content: "运行时禁用",
      trigger: "click",
    });

    click(anchor);
    expect(tooltip.isVisible()).toBe(true);

    tooltip.setOptions({ disabled: true });
    expect(tooltip.isVisible()).toBe(false);

    click(anchor);
    expect(tooltip.isVisible()).toBe(false);
  });

  it("rebinds listeners when the target changes", () => {
    const first = createAnchor();
    const second = createAnchor();
    const tooltip = create({
      target: first,
      content: "换目标",
      trigger: "click",
    });

    tooltip.setOptions({ target: second });

    click(first);
    expect(tooltip.isVisible()).toBe(false);

    click(second);
    expect(tooltip.isVisible()).toBe(true);
  });

  it("rebinds listeners when the trigger changes", () => {
    const anchor = createAnchor();
    const tooltip = create({
      target: anchor,
      content: "换触发",
      trigger: "click",
    });

    tooltip.setOptions({ trigger: "focus" });

    click(anchor);
    expect(tooltip.isVisible()).toBe(false);

    focus(anchor);
    expect(tooltip.isVisible()).toBe(true);
  });

  it("moves the node when appendTo changes", () => {
    const firstHost = document.createElement("div");
    const secondHost = document.createElement("div");
    document.body.appendChild(firstHost);
    document.body.appendChild(secondHost);

    const anchor = createAnchor();
    const tooltip = create({ appendTo: firstHost, content: "换挂载点" });
    tooltip.show(undefined, anchor);
    expect(tooltip.getElement()!.parentElement).toBe(firstHost);

    tooltip.setOptions({ appendTo: secondHost });
    expect(tooltip.getElement()!.parentElement).toBe(secondHost);
  });

  it("switches to the absolute strategy at runtime", () => {
    vi.spyOn(window, "scrollX", "get").mockReturnValue(50);
    vi.spyOn(window, "scrollY", "get").mockReturnValue(30);

    const anchor = createAnchor({
      left: 100,
      top: 100,
      right: 300,
      bottom: 140,
      width: 200,
      height: 40,
    });
    const tooltip = create();
    tooltip.show("绝对定位", anchor);
    setSize(tooltip.getElement()!, 100, 30);
    tooltip.updatePopper();
    expect(tooltip.getElement()!.style.top).toBe("152px");

    tooltip.setOptions({ popperOptions: { strategy: "absolute" } });

    expect(tooltip.getElement()!.style.position).toBe("absolute");
    expect(tooltip.getElement()!.style.left).toBe("200px");
    expect(tooltip.getElement()!.style.top).toBe("182px");
  });

  it("updates aria-label, popperStyle, transition and arrow state", () => {
    const anchor = createAnchor();
    const tooltip = create({ content: "样式", transition: "my-fade" });
    tooltip.show(undefined, anchor);

    expect(getNode().classList.contains("my-fade")).toBe(true);

    tooltip.setOptions({ ariaLabel: "新说明" });
    expect(getNode().getAttribute("aria-label")).toBe("新说明");

    tooltip.setOptions({ popperStyle: { zIndex: "4321" } });
    expect(getNode().style.zIndex).toBe("4321");

    tooltip.setOptions({ showArrow: false });
    const arrow = getNode().querySelector(".ew-tooltip__arrow") as HTMLElement;
    expect(arrow.style.display).toBe("none");

    tooltip.setOptions({ showArrow: true });
    expect(arrow.style.display).toBe("");
  });

  it("resolves a selector target", () => {
    const anchor = document.createElement("button");
    anchor.id = "tooltip-trigger";
    document.body.appendChild(anchor);

    const tooltip = create({
      target: "#tooltip-trigger",
      content: "选择器",
      trigger: "click",
    });

    click(anchor);
    expect(tooltip.isVisible()).toBe(true);
    expect(tooltip.getTrigger()).toBe(anchor);
  });

  it("resolves a selector appendTo", () => {
    const host = document.createElement("div");
    host.id = "tooltip-host";
    document.body.appendChild(host);

    const tooltip = create({ appendTo: "#tooltip-host", content: "选择器挂载" });
    tooltip.show(undefined, createAnchor());

    expect(tooltip.getElement()!.parentElement).toBe(host);
  });
});

describe("Tooltip 生命周期", () => {
  it("recreates the node when persistent is false", () => {
    const anchor = createAnchor();
    const tooltip = create({ persistent: false });

    tooltip.show("第一次", anchor);
    const first = tooltip.getElement();
    tooltip.hide();
    expect(tooltip.getElement()).toBeNull();

    tooltip.show("第二次", anchor);
    const second = tooltip.getElement();

    expect(second).not.toBeNull();
    expect(second).not.toBe(first);
    expect(second!.textContent).toBe("第二次");
  });

  it("clears pending timers on destroy", () => {
    vi.useFakeTimers();
    const anchor = createAnchor();
    const tooltip = create({
      target: anchor,
      content: "延迟销毁",
      showAfter: 100,
    });

    hover(anchor);
    tooltip.destroy();
    vi.advanceTimersByTime(500);

    expect(tooltip.isVisible()).toBe(false);
    expect(tooltip.getElement()).toBeNull();
    expect(getNode()).toBeNull();
  });

  it("keeps multiple instances independent", () => {
    const firstAnchor = createAnchor();
    const secondAnchor = createAnchor();
    const first = create({ content: "实例一" });
    const second = create({ content: "实例二" });

    first.show(undefined, firstAnchor);
    second.show(undefined, secondAnchor);
    expect(document.querySelectorAll(".ew-tooltip").length).toBe(2);

    first.hide();
    expect(first.isVisible()).toBe(false);
    expect(second.isVisible()).toBe(true);
  });

  it("restores the previous aria-describedby value", () => {
    const anchor = createAnchor();
    anchor.setAttribute("aria-describedby", "existing-id");
    const tooltip = create();

    tooltip.show("无障碍", anchor);
    expect(anchor.getAttribute("aria-describedby")).toBe(
      tooltip.getElement()!.id
    );

    tooltip.hide();
    expect(anchor.getAttribute("aria-describedby")).toBe("existing-id");
  });

  it("resets the autoClose timer when shown again", () => {
    vi.useFakeTimers();
    const anchor = createAnchor();
    const tooltip = create({ content: "自动关闭", autoClose: 100 });

    tooltip.show(undefined, anchor);
    vi.advanceTimersByTime(60);
    tooltip.hide();
    tooltip.show(undefined, anchor);

    vi.advanceTimersByTime(60);
    expect(tooltip.isVisible()).toBe(true);

    vi.advanceTimersByTime(40);
    expect(tooltip.isVisible()).toBe(false);
  });

  it("repositions on window scroll", () => {
    let frame: FrameRequestCallback | null = null;
    vi.stubGlobal("requestAnimationFrame", (callback: FrameRequestCallback) => {
      frame = callback;
      return 1;
    });
    vi.stubGlobal("cancelAnimationFrame", () => {});

    const anchor = createAnchor({
      left: 100,
      top: 100,
      right: 300,
      bottom: 140,
      width: 200,
      height: 40,
    });
    const tooltip = create();
    tooltip.show("滚动", anchor);
    setSize(tooltip.getElement()!, 100, 30);
    tooltip.updatePopper();
    expect(tooltip.getElement()!.style.top).toBe("152px");

    setRect(anchor, {
      left: 100,
      top: 300,
      right: 300,
      bottom: 340,
      width: 200,
      height: 40,
    });
    window.dispatchEvent(new Event("scroll"));

    const captured = frame as FrameRequestCallback | null;
    expect(captured).not.toBeNull();
    captured!(0);

    expect(tooltip.getElement()!.style.top).toBe("352px");
  });

  it("ignores Escape when no tooltip is shown", () => {
    const tooltip = create();

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );

    expect(tooltip.isVisible()).toBe(false);
    expect(getNode()).toBeNull();
  });
});
