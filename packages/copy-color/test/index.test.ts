import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import CopyColorPlugin from "../src/index";
import { createMockCore } from "../../../test/mockCore";

const originalClipboard = Object.getOwnPropertyDescriptor(navigator, "clipboard");

function setClipboard(writeText: any) {
  Object.defineProperty(navigator, "clipboard", {
    value: { writeText },
    configurable: true,
  });
}

function restoreClipboard() {
  if (originalClipboard) {
    Object.defineProperty(navigator, "clipboard", originalClipboard);
  } else {
    delete (navigator as any).clipboard;
  }
}

const flushPromises = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("CopyColor Plugin", () => {
  let container: HTMLElement;
  let panelContainer: HTMLElement;
  let bottomRow: HTMLElement;
  let inputContainer: HTMLElement;
  let mockCore: any;

  beforeEach(() => {
    vi.clearAllMocks();

    container = document.createElement("div");
    document.body.appendChild(container);

    panelContainer = document.createElement("div");
    panelContainer.className = "ew-color-picker-panel-container";
    container.appendChild(panelContainer);

    bottomRow = document.createElement("div");
    bottomRow.className = "ew-color-picker-bottom-row ew-color-picker-bottom-row-single";
    panelContainer.appendChild(bottomRow);

    inputContainer = document.createElement("div");
    inputContainer.className =
      "ew-color-picker-input-container ew-color-picker-input-container-flex";
    inputContainer.innerHTML = '<input class="ew-color-picker-input" />';
    bottomRow.appendChild(inputContainer);

    mockCore = createMockCore(container, { defaultColor: "#ff0000" });
  });

  afterEach(() => {
    restoreClipboard();
  });

  const getButton = () =>
    container.querySelector(
      ".ew-color-picker-copy-btn"
    ) as HTMLButtonElement | null;

  it("renders the copy button in a separate toolbar row above the bottom row", () => {
    new CopyColorPlugin(mockCore);

    const button = getButton();
    expect(button).not.toBeNull();
    expect(button!.getAttribute("type")).toBe("button");
    expect(button!.getAttribute("aria-label")).toBe("复制颜色到剪贴板");
    expect(button!.querySelector(".ew-color-picker-icon")).not.toBeNull();

    const extraRow = panelContainer.querySelector(
      ".ew-color-picker-extra-row"
    ) as HTMLElement | null;
    expect(extraRow).not.toBeNull();
    expect(extraRow!.contains(getButton())).toBe(true);
    expect(panelContainer.children[0]).toBe(extraRow);
    expect(panelContainer.children[1]).toBe(bottomRow);
    expect(bottomRow.firstElementChild).toBe(inputContainer);
  });

  it("shows a success tip bubble after copying", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);

    new CopyColorPlugin(mockCore);
    const plugin = container.querySelector(
      ".ew-color-picker-copy-group"
    ) as HTMLElement;

    getButton()!.click();
    await flushPromises();

    const tip = plugin.querySelector(
      ".ew-color-picker-copy-tip"
    ) as HTMLElement;
    expect(tip).not.toBeNull();
    expect(tip.textContent).toBe("已复制");
    expect(tip.className).toContain("ew-color-picker-copy-tip-show");
  });

  it("does not render when showCopyColor is false", () => {
    mockCore.options.showCopyColor = false;

    new CopyColorPlugin(mockCore);

    expect(getButton()).toBeNull();
  });

  it("copies the current color and invokes the callback", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    const onCopyColor = vi.fn();
    mockCore.options.onCopyColor = onCopyColor;

    new CopyColorPlugin(mockCore);
    getButton()!.click();
    await flushPromises();

    expect(writeText).toHaveBeenCalledWith("#ff0000");
    expect(onCopyColor).toHaveBeenCalledWith("#ff0000");
    expect(getButton()!.className).toContain("ew-color-picker-copy-btn-copied");
    expect(getButton()!.getAttribute("title")).toBe("已复制");
  });

  it("does nothing when the current color is empty", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    mockCore.getColor = vi.fn(() => "");

    new CopyColorPlugin(mockCore);
    getButton()!.click();
    await flushPromises();

    expect(writeText).not.toHaveBeenCalled();
  });

  it("warns when copying fails", async () => {
    setClipboard(vi.fn().mockRejectedValue(new Error("clipboard unavailable")));

    new CopyColorPlugin(mockCore);
    getButton()!.click();
    await flushPromises();

    expect(console.warn).toHaveBeenCalled();
  });

  it("updates the button background when the color changes", () => {
    new CopyColorPlugin(mockCore);
    const button = getButton()!;
    const initialBackground = button.style.backgroundColor;

    mockCore.setColor("#00ff00");

    expect(button.style.backgroundColor).not.toBe(initialBackground);
  });

  it("supports custom text options", async () => {
    const writeText = vi.fn().mockResolvedValue(undefined);
    setClipboard(writeText);
    mockCore.options.copyColorText = "复制色值";
    mockCore.options.copiedText = "复制成功";

    new CopyColorPlugin(mockCore);

    expect(getButton()!.getAttribute("title")).toBe("复制色值");

    getButton()!.click();
    await flushPromises();

    expect(getButton()!.getAttribute("title")).toBe("复制成功");
  });

  it("removes and re-renders without duplicates on updateOptions", () => {
    const plugin = new CopyColorPlugin(mockCore);
    plugin.run();

    expect(container.querySelectorAll(".ew-color-picker-copy-btn").length).toBe(1);

    mockCore.options.showCopyColor = false;
    plugin.updateOptions();

    expect(getButton()).toBeNull();

    mockCore.options.showCopyColor = true;
    plugin.updateOptions();

    expect(container.querySelectorAll(".ew-color-picker-copy-btn").length).toBe(1);
  });

  it("removes the button on destroy", () => {
    const plugin = new CopyColorPlugin(mockCore);
    plugin.destroy();

    expect(getButton()).toBeNull();
  });
});
