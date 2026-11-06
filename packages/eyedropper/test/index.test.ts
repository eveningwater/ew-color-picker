import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import EyedropperPlugin from "../src/index";
import { createMockCore } from "../../../test/mockCore";

const originalEyeDropper = (window as any).EyeDropper;

function setEyeDropper(value: any) {
  (window as any).EyeDropper = value;
}

function restoreEyeDropper() {
  if (originalEyeDropper === undefined) {
    delete (window as any).EyeDropper;
  } else {
    (window as any).EyeDropper = originalEyeDropper;
  }
}

const flushPromises = () => new Promise<void>((resolve) => setTimeout(resolve, 0));

describe("Eyedropper Plugin", () => {
  let container: HTMLElement;
  let panelContainer: HTMLElement;
  let bottomRow: HTMLElement;
  let mockCore: any;

  beforeEach(() => {
    vi.clearAllMocks();

    container = document.createElement("div");
    document.body.appendChild(container);

    panelContainer = document.createElement("div");
    panelContainer.className = "ew-color-picker-panel-container";
    container.appendChild(panelContainer);

    bottomRow = document.createElement("div");
    bottomRow.className = "ew-color-picker-bottom-row";
    panelContainer.appendChild(bottomRow);

    mockCore = createMockCore(container, {});
  });

  afterEach(() => {
    restoreEyeDropper();
  });

  const getButton = () =>
    container.querySelector(
      ".ew-color-picker-eyedropper-btn"
    ) as HTMLButtonElement | null;

  it("does not render when EyeDropper is unavailable", () => {
    delete (window as any).EyeDropper;

    new EyedropperPlugin(mockCore);

    expect(getButton()).toBeNull();
  });

  it("does not render when showEyedropper is false", () => {
    setEyeDropper(class {});
    mockCore.options.showEyedropper = false;

    new EyedropperPlugin(mockCore);

    expect(getButton()).toBeNull();
  });

  it("renders an accessible button when EyeDropper is available", () => {
    setEyeDropper(class {});

    new EyedropperPlugin(mockCore);

    const button = getButton();
    expect(button).not.toBeNull();
    expect(button!.getAttribute("aria-label")).toBe("取色");
    expect(button!.getAttribute("title")).toBe("取色");
    expect(button!.querySelector(".ew-color-picker-icon")).not.toBeNull();

    // 位于单独的工具栏行，而不是输入框 / 清空确定按钮所在行
    const extraRow = panelContainer.querySelector(
      ".ew-color-picker-extra-row"
    ) as HTMLElement | null;
    expect(extraRow).not.toBeNull();
    expect(extraRow!.contains(button)).toBe(true);
    expect(panelContainer.children[0]).toBe(extraRow);
  });

  it("falls back to panelContainer when bottom-row is absent", () => {
    setEyeDropper(class {});
    bottomRow.remove();

    new EyedropperPlugin(mockCore);

    expect(panelContainer.querySelector(".ew-color-picker-eyedropper-btn")).not.toBeNull();
  });

  it("writes the picked color back and calls the callback", async () => {
    const open = vi.fn().mockResolvedValue({ sRGBHex: "#123456" });
    setEyeDropper(
      class {
        open = open;
      }
    );
    const onEyedropperPick = vi.fn();
    mockCore.options.onEyedropperPick = onEyedropperPick;

    new EyedropperPlugin(mockCore);
    getButton()!.click();
    await flushPromises();

    expect(open).toHaveBeenCalledTimes(1);
    expect(mockCore.setColor).toHaveBeenCalledWith("#123456");
    expect(onEyedropperPick).toHaveBeenCalledWith("#123456");
  });

  it("silently ignores AbortError when the user cancels", async () => {
    const error = new Error("aborted");
    error.name = "AbortError";
    setEyeDropper(
      class {
        open = vi.fn().mockRejectedValue(error);
      }
    );

    new EyedropperPlugin(mockCore);
    getButton()!.click();
    await flushPromises();

    expect(mockCore.setColor).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
  });

  it("warns on unexpected picker errors", async () => {
    setEyeDropper(
      class {
        open = vi.fn().mockRejectedValue(new Error("boom"));
      }
    );

    new EyedropperPlugin(mockCore);
    getButton()!.click();
    await flushPromises();

    expect(mockCore.setColor).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalled();
  });

  it("does not write back when destroyed before the pick resolves", async () => {
    let resolvePick: (value: any) => void = () => {};
    const pending = new Promise((resolve) => {
      resolvePick = resolve;
    });
    setEyeDropper(
      class {
        open = () => pending;
      }
    );

    const plugin = new EyedropperPlugin(mockCore);
    getButton()!.click();
    plugin.destroy();

    resolvePick({ sRGBHex: "#abcdef" });
    await flushPromises();

    expect(mockCore.setColor).not.toHaveBeenCalled();
    expect(getButton()).toBeNull();
  });

  it("removes the previous node before re-rendering", () => {
    setEyeDropper(class {});

    const plugin = new EyedropperPlugin(mockCore);
    plugin.run();

    expect(
      container.querySelectorAll(".ew-color-picker-eyedropper-btn").length
    ).toBe(1);
  });
});
