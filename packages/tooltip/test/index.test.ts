import { afterEach, describe, expect, it, vi } from "vitest";
import Tooltip from "../src/index";

function createAnchor(): HTMLElement {
  const anchor = document.createElement("button");
  document.body.appendChild(anchor);
  return anchor;
}

function getNode(): HTMLElement {
  return document.querySelector(".ew-tooltip") as HTMLElement;
}

function getArrow(): HTMLElement {
  return document.querySelector(".ew-tooltip__arrow") as HTMLElement;
}

function click(el: HTMLElement) {
  el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
}

describe("Tooltip", () => {
  let tooltip: Tooltip | null = null;

  afterEach(() => {
    tooltip?.destroy();
    tooltip = null;
    vi.useRealTimers();
    document.body.innerHTML = "";
  });

  it("creates and shows a tooltip node", () => {
    tooltip = new Tooltip();
    tooltip.show("完整内容", createAnchor());

    const node = getNode();
    expect(node).not.toBeNull();
    expect(node.textContent).toBe("完整内容");
    expect(node.getAttribute("role")).toBe("tooltip");
    expect(node.classList.contains("ew-tooltip--visible")).toBe(true);
    expect(tooltip.isVisible()).toBe(true);
  });

  it("hides the tooltip but keeps the node by default", () => {
    tooltip = new Tooltip();
    tooltip.show("内容", createAnchor());
    tooltip.hide();

    const node = getNode();
    expect(node.classList.contains("ew-tooltip--visible")).toBe(false);
    expect(tooltip.isVisible()).toBe(false);
    expect(getNode()).not.toBeNull();
  });

  it("does not create a node for empty text", () => {
    tooltip = new Tooltip();
    tooltip.show("   ", createAnchor());

    expect(getNode()).toBeNull();
    expect(tooltip.isVisible()).toBe(false);
  });

  it("supports prefix, popperClass and legacy className", () => {
    tooltip = new Tooltip({
      prefix: "my-",
      popperClass: "my-popper",
      className: "my-extra",
    });
    tooltip.show("内容", createAnchor());

    const node = document.querySelector(".my-tooltip") as HTMLElement;
    expect(node).not.toBeNull();
    expect(node.classList.contains("my-popper")).toBe(true);
    expect(node.classList.contains("my-extra")).toBe(true);
  });

  it("uses the dark theme by default and supports the light theme", () => {
    tooltip = new Tooltip();
    tooltip.show("内容", createAnchor());
    expect(getNode().classList.contains("ew-tooltip--dark")).toBe(true);

    tooltip.setOptions({ effect: "light" });
    expect(getNode().classList.contains("ew-tooltip--light")).toBe(true);
    expect(getNode().classList.contains("ew-tooltip--dark")).toBe(false);
  });

  it("renders an arrow by default and can hide it", () => {
    tooltip = new Tooltip();
    tooltip.show("内容", createAnchor());
    expect(getArrow()).not.toBeNull();
    expect(getArrow().style.display).not.toBe("none");
    expect(getArrow().getAttribute("data-placement")).toBe("bottom");

    tooltip.setOptions({ showArrow: false });
    expect(getArrow().style.display).toBe("none");
  });

  it("defaults to bottom placement", () => {
    tooltip = new Tooltip();
    tooltip.show("内容", createAnchor());
    expect(getNode().getAttribute("data-placement")).toBe("bottom");
  });

  it("flips to the opposite side when there is no room", () => {
    tooltip = new Tooltip({ placement: "top" });
    tooltip.show("内容", createAnchor());
    // happy-dom 中锚点位于视口顶部，上方放不下，翻转到下方
    expect(getNode().getAttribute("data-placement")).toBe("bottom");

    tooltip.setOptions({ placement: "left" });
    tooltip.updatePopper();
    expect(getNode().getAttribute("data-placement")).toBe("right");
  });

  it("respects explicit fallbackPlacements", () => {
    tooltip = new Tooltip({
      placement: "top",
      fallbackPlacements: ["right"],
    });
    tooltip.show("内容", createAnchor());
    expect(getNode().getAttribute("data-placement")).toBe("right");
  });

  it("opens on click and closes on a second click", () => {
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "点击提示",
      trigger: "click",
    });

    click(anchor);
    expect(tooltip.isVisible()).toBe(true);
    click(anchor);
    expect(tooltip.isVisible()).toBe(false);
  });

  it("closes when clicking outside", () => {
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "点击提示",
      trigger: "click",
    });

    click(anchor);
    expect(tooltip.isVisible()).toBe(true);
    click(document.body);
    expect(tooltip.isVisible()).toBe(false);
  });

  it("does not react when disabled", () => {
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "提示",
      trigger: "click",
      disabled: true,
    });

    click(anchor);
    expect(tooltip.isVisible()).toBe(false);
    expect(getNode()).toBeNull();
  });

  it("supports showAfter and hideAfter delays", () => {
    vi.useFakeTimers();
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "延迟提示",
      showAfter: 100,
      hideAfter: 50,
    });

    anchor.dispatchEvent(new MouseEvent("mouseenter"));
    expect(tooltip.isVisible()).toBe(false);

    vi.advanceTimersByTime(100);
    expect(tooltip.isVisible()).toBe(true);

    anchor.dispatchEvent(new MouseEvent("mouseleave"));
    expect(tooltip.isVisible()).toBe(true);

    vi.advanceTimersByTime(50);
    expect(tooltip.isVisible()).toBe(false);
  });

  it("keeps the tooltip open when the pointer enters an enterable popper", () => {
    vi.useFakeTimers();
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "可移入",
      hideAfter: 50,
      enterable: true,
    });

    anchor.dispatchEvent(new MouseEvent("mouseenter"));
    vi.advanceTimersByTime(1);
    expect(tooltip.isVisible()).toBe(true);

    anchor.dispatchEvent(new MouseEvent("mouseleave"));
    getNode().dispatchEvent(new MouseEvent("mouseenter"));
    vi.advanceTimersByTime(50);
    expect(tooltip.isVisible()).toBe(true);

    getNode().dispatchEvent(new MouseEvent("mouseleave"));
    vi.advanceTimersByTime(50);
    expect(tooltip.isVisible()).toBe(false);
  });

  it("auto closes after the given duration", () => {
    vi.useFakeTimers();
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "自动关闭",
      trigger: "click",
      autoClose: 300,
    });

    click(anchor);
    expect(tooltip.isVisible()).toBe(true);
    vi.advanceTimersByTime(300);
    expect(tooltip.isVisible()).toBe(false);
  });

  it("supports controlled visible state", () => {
    tooltip = new Tooltip({ content: "受控", visible: true });
    expect(tooltip.isVisible()).toBe(true);

    tooltip.setOptions({ visible: false });
    expect(tooltip.isVisible()).toBe(false);

    tooltip.setOptions({ visible: true });
    expect(tooltip.isVisible()).toBe(true);
  });

  it("emits lifecycle events in order", () => {
    const calls: string[] = [];
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "事件",
      trigger: "click",
      onBeforeShow: () => calls.push("before-show"),
      onShow: () => calls.push("show"),
      onBeforeHide: () => calls.push("before-hide"),
      onHide: () => calls.push("hide"),
    });
    tooltip.on("visibleChange", (visible) =>
      calls.push(`visible:${visible}`)
    );

    click(anchor);
    click(anchor);

    expect(calls).toEqual([
      "before-show",
      "show",
      "visible:true",
      "before-hide",
      "hide",
      "visible:false",
    ]);
  });

  it("removes the node on hide when persistent is false", () => {
    tooltip = new Tooltip({ persistent: false });
    tooltip.show("临时", createAnchor());
    expect(getNode()).not.toBeNull();

    tooltip.hide();
    expect(getNode()).toBeNull();
  });

  it("can render next to the trigger when teleported is false", () => {
    const wrapper = document.createElement("div");
    const anchor = document.createElement("button");
    wrapper.appendChild(anchor);
    document.body.appendChild(wrapper);

    tooltip = new Tooltip({
      target: anchor,
      content: "非传送",
      trigger: "click",
      teleported: false,
    });
    click(anchor);

    expect(getNode().parentElement).toBe(wrapper);
  });

  it("mounts into a custom appendTo container", () => {
    const container = document.createElement("div");
    document.body.appendChild(container);

    tooltip = new Tooltip({ appendTo: container });
    tooltip.show("挂载", createAnchor());

    expect(getNode().parentElement).toBe(container);
  });

  it("supports virtual triggering with a virtual ref", () => {
    const rect = {
      left: 10,
      top: 20,
      right: 110,
      bottom: 40,
      width: 100,
      height: 20,
      x: 10,
      y: 20,
      toJSON: () => rect,
    };
    tooltip = new Tooltip({
      virtualTriggering: true,
      virtualRef: { getBoundingClientRect: () => rect as DOMRect },
      content: "虚拟锚点",
    });
    tooltip.show();

    expect(tooltip.isVisible()).toBe(true);
    expect(getNode().getAttribute("data-placement")).toBe("bottom");
    expect(getNode().style.left).not.toBe("");
  });

  it("supports rawContent and HTMLElement content", () => {
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "<b>加粗</b>",
      rawContent: true,
      trigger: "click",
    });
    click(anchor);
    expect(getNode().querySelector("b")?.textContent).toBe("加粗");

    tooltip.setContent("新内容");
    expect(getNode().textContent).toBe("新内容");

    const span = document.createElement("span");
    span.textContent = "节点内容";
    tooltip.setContent(span);
    expect(getNode().textContent).toBe("节点内容");
  });

  it("links the trigger with aria-describedby and applies aria-label", () => {
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "无障碍",
      trigger: "click",
      ariaLabel: "提示说明",
    });

    click(anchor);
    expect(anchor.getAttribute("aria-describedby")).toBe(getNode().id);
    expect(getNode().getAttribute("aria-label")).toBe("提示说明");

    click(anchor);
    expect(anchor.hasAttribute("aria-describedby")).toBe(false);
  });

  it("recalculates the position on updatePopper", () => {
    const anchor = createAnchor();
    let rect = {
      left: 100,
      top: 100,
      right: 200,
      bottom: 120,
      width: 100,
      height: 20,
      x: 100,
      y: 100,
      toJSON: () => rect,
    };
    anchor.getBoundingClientRect = () => rect as DOMRect;

    tooltip = new Tooltip();
    tooltip.show("定位", anchor);

    const firstTop = getNode().style.top;
    expect(firstTop).toBe("132px");

    rect = { ...rect, top: 300, bottom: 320, toJSON: () => rect };
    tooltip.updatePopper();
    expect(getNode().style.top).toBe("332px");
  });

  it("supports the absolute positioning strategy", () => {
    const anchor = createAnchor();
    const rect = {
      left: 100,
      top: 100,
      right: 200,
      bottom: 120,
      width: 100,
      height: 20,
      x: 100,
      y: 100,
      toJSON: () => rect,
    };
    anchor.getBoundingClientRect = () => rect as DOMRect;
    const scrollX = vi.spyOn(window, "scrollX", "get").mockReturnValue(50);
    const scrollY = vi.spyOn(window, "scrollY", "get").mockReturnValue(30);

    tooltip = new Tooltip({ popperOptions: { strategy: "absolute" } });
    tooltip.show("绝对定位", anchor);

    const node = getNode();
    expect(node.style.position).toBe("absolute");
    expect(node.style.left).toBe("200px");
    expect(node.style.top).toBe("162px");

    scrollX.mockRestore();
    scrollY.mockRestore();
  });

  it("opens with trigger keys", () => {
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "键盘",
      trigger: "click",
      triggerKeys: ["Enter"],
    });

    anchor.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    );
    expect(tooltip.isVisible()).toBe(true);
  });

  it("closes on Escape", () => {
    tooltip = new Tooltip();
    tooltip.show("Escape", createAnchor());

    document.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Escape", bubbles: true })
    );
    expect(tooltip.isVisible()).toBe(false);
  });

  it("opens on contextmenu", () => {
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "右键",
      trigger: "contextmenu",
    });

    const event = new MouseEvent("contextmenu", {
      bubbles: true,
      cancelable: true,
    });
    anchor.dispatchEvent(event);

    expect(event.defaultPrevented).toBe(true);
    expect(tooltip.isVisible()).toBe(true);
  });

  it("focuses the trigger after hiding when focusOnTarget is true", () => {
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "焦点",
      trigger: "click",
      focusOnTarget: true,
    });

    click(anchor);
    tooltip.hide();
    expect(document.activeElement).toBe(anchor);
  });

  it("reports whether focus is inside the content", () => {
    tooltip = new Tooltip();
    tooltip.show("焦点判断", createAnchor());

    const button = document.createElement("button");
    tooltip.getContentElement()!.appendChild(button);
    expect(tooltip.isFocusInsideContent()).toBe(false);

    button.focus();
    expect(tooltip.isFocusInsideContent()).toBe(true);
  });

  it("removes the node and unbinds listeners on destroy", () => {
    const anchor = createAnchor();
    tooltip = new Tooltip({
      target: anchor,
      content: "销毁",
      trigger: "click",
    });
    click(anchor);
    expect(getNode()).not.toBeNull();

    tooltip.destroy();
    expect(document.querySelector(".ew-tooltip")).toBeNull();

    tooltip = null;
    click(anchor);
    expect(document.querySelector(".ew-tooltip")).toBeNull();
  });
});
