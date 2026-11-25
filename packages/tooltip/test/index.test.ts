import { afterEach, describe, expect, it } from "vitest";
import Tooltip, { isTextTruncated } from "../src/index";

describe("Tooltip", () => {
  let tooltip: Tooltip | null = null;

  afterEach(() => {
    tooltip?.destroy();
    tooltip = null;
    document.body.innerHTML = "";
  });

  function createAnchor(): HTMLElement {
    const anchor = document.createElement("button");
    document.body.appendChild(anchor);
    return anchor;
  }

  it("creates and shows a tooltip node", () => {
    tooltip = new Tooltip({ prefix: "ew-" });
    tooltip.show("完整内容", createAnchor());

    const node = document.querySelector(".ew-tooltip") as HTMLElement;
    expect(node).not.toBeNull();
    expect(node.textContent).toBe("完整内容");
    expect(node.getAttribute("role")).toBe("tooltip");
    expect(node.classList.contains("ew-tooltip--visible")).toBe(true);
    expect(tooltip.isVisible()).toBe(true);
  });

  it("hides the tooltip but keeps the node", () => {
    tooltip = new Tooltip({ prefix: "ew-" });
    tooltip.show("内容", createAnchor());
    tooltip.hide();

    const node = document.querySelector(".ew-tooltip") as HTMLElement;
    expect(node.classList.contains("ew-tooltip--visible")).toBe(false);
    expect(tooltip.isVisible()).toBe(false);
    expect(document.querySelector(".ew-tooltip")).not.toBeNull();
  });

  it("does not create a node for empty text", () => {
    tooltip = new Tooltip({ prefix: "ew-" });
    tooltip.show("   ", createAnchor());

    expect(document.querySelector(".ew-tooltip")).toBeNull();
    expect(tooltip.isVisible()).toBe(false);
  });

  it("supports a custom prefix and extra class name", () => {
    tooltip = new Tooltip({ prefix: "my-", className: "my-extra" });
    tooltip.show("内容", createAnchor());

    const node = document.querySelector(".my-tooltip") as HTMLElement;
    expect(node).not.toBeNull();
    expect(node.classList.contains("my-extra")).toBe(true);
  });

  it("flips below the anchor when there is no space above", () => {
    tooltip = new Tooltip({ prefix: "ew-" });
    tooltip.show("内容", createAnchor());

    // jsdom 中锚点 top 为 0，必然触发翻转
    expect(
      document
        .querySelector(".ew-tooltip")!
        .classList.contains("ew-tooltip--bottom")
    ).toBe(true);
  });

  it("removes the node on destroy", () => {
    tooltip = new Tooltip({ prefix: "ew-" });
    tooltip.show("内容", createAnchor());
    expect(document.querySelector(".ew-tooltip")).not.toBeNull();

    tooltip.destroy();
    expect(document.querySelector(".ew-tooltip")).toBeNull();
    expect(tooltip.getElement()).toBeNull();
  });
});

describe("isTextTruncated", () => {
  it("reports overflow only when the content is wider than the box", () => {
    const el = document.createElement("span");
    Object.defineProperty(el, "scrollWidth", {
      configurable: true,
      value: 200,
    });
    Object.defineProperty(el, "clientWidth", {
      configurable: true,
      value: 100,
    });
    expect(isTextTruncated(el)).toBe(true);

    Object.defineProperty(el, "scrollWidth", {
      configurable: true,
      value: 50,
    });
    expect(isTextTruncated(el)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isTextTruncated(null)).toBe(false);
    expect(isTextTruncated(undefined)).toBe(false);
  });
});
