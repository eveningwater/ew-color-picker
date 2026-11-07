import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ApplyOrder } from "@ew-color-picker/utils";
import GradientPlugin from "../src/index";
import { createMockCore } from "../../../test/mockCore";

const STOPS = ["#ff0000", "#0000ff"];

function getContainer(container: HTMLElement): HTMLElement | null {
  return container.querySelector(".ew-gradient-container");
}

function getHandles(container: HTMLElement): HTMLButtonElement[] {
  return Array.from(
    container.querySelectorAll(".ew-gradient-handle")
  ) as HTMLButtonElement[];
}

describe("Gradient plugin", () => {
  let container: HTMLElement;
  let mockCore: any;
  let plugin: GradientPlugin | null = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    mockCore = createMockCore(container);
  });

  afterEach(() => {
    plugin?.destroy();
    plugin = null;
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it("exposes the plugin name and order", () => {
    expect(GradientPlugin.pluginName).toBe("ewColorPickerGradient");
    expect(GradientPlugin.applyOrder).toBe(ApplyOrder.Post);
  });

  it("does not render by default", () => {
    plugin = new GradientPlugin(mockCore);
    expect(getContainer(container)).toBeNull();
  });

  it("does not render when showGradient is false", () => {
    mockCore.options.showGradient = false;
    mockCore.options.gradientStops = STOPS;
    plugin = new GradientPlugin(mockCore);

    expect(getContainer(container)).toBeNull();
  });

  it("renders when showGradient is true", () => {
    mockCore.options.showGradient = true;
    mockCore.options.gradientStops = STOPS;
    plugin = new GradientPlugin(mockCore);

    expect(getContainer(container)).not.toBeNull();
    expect(getHandles(container).length).toBe(2);
    expect(
      container.querySelector(".ew-gradient-preview-bar")
    ).not.toBeNull();
  });

  it("renders when gradientStops is provided", () => {
    mockCore.options.gradientStops = STOPS;
    plugin = new GradientPlugin(mockCore);

    expect(getContainer(container)).not.toBeNull();
    expect(getHandles(container).length).toBe(2);
  });

  it("parses an initial gradient css string", () => {
    mockCore.options.gradient =
      "linear-gradient(90deg, #ff0000 0%, #00ff00 50%, #0000ff 100%)";
    plugin = new GradientPlugin(mockCore);

    expect(getHandles(container).length).toBe(3);
    expect(plugin.getGradient()).toContain("linear-gradient(90deg");
  });

  it("warns and falls back when the gradient cannot be parsed", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    mockCore.options.gradient = "not-a-gradient";
    plugin = new GradientPlugin(mockCore);

    expect(getHandles(container).length).toBe(2);
    warnSpy.mockRestore();
  });

  it("inserts the editor before the bottom row", () => {
    mockCore.getMountPoint("panelContainer");
    const bottomRow = mockCore.getMountPoint("bottom-row");
    mockCore.options.gradientStops = STOPS;
    plugin = new GradientPlugin(mockCore);

    const editor = getContainer(container)!;
    const panelContainer = mockCore.getMountPoint("panelContainer");
    const children = Array.from(panelContainer.children);
    expect(children.indexOf(editor)).toBeLessThan(
      children.indexOf(bottomRow)
    );
  });

  it("applies the selected stop color to the core", () => {
    mockCore.options.gradientStops = STOPS;
    plugin = new GradientPlugin(mockCore);

    const handles = getHandles(container);
    handles[1].dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true, cancelable: true })
    );

    expect(mockCore.setColor).toHaveBeenCalledWith("#0000ff");
    document.dispatchEvent(new MouseEvent("mouseup"));
  });

  it("writes core color changes back to the selected stop", () => {
    const gradientChange = vi.fn();
    mockCore.options.gradientStops = STOPS;
    mockCore.options.gradientChange = gradientChange;
    plugin = new GradientPlugin(mockCore);

    mockCore.emit("change", "#00ff00");

    expect(gradientChange).toHaveBeenCalledTimes(1);
    expect(gradientChange.mock.calls[0][0]).toBe(
      "linear-gradient(180deg, #00ff00, #0000ff)"
    );
    expect(getHandles(container).length).toBe(2);
  });

  it("ignores core changes when syncStopsOnChange is false", () => {
    const gradientChange = vi.fn();
    mockCore.options.gradientStops = STOPS;
    mockCore.options.gradientChange = gradientChange;
    mockCore.options.syncStopsOnChange = false;
    plugin = new GradientPlugin(mockCore);

    mockCore.emit("change", "#00ff00");

    expect(gradientChange).not.toHaveBeenCalled();
    expect(plugin.getStops()[0].color).toBe("#ff0000");
  });

  it("skips duplicate colors", () => {
    const gradientChange = vi.fn();
    mockCore.options.gradientStops = STOPS;
    mockCore.options.gradientChange = gradientChange;
    plugin = new GradientPlugin(mockCore);

    mockCore.emit("change", "rgba(255, 0, 0, 1)");

    expect(gradientChange).not.toHaveBeenCalled();
  });

  it("adds a stop and keeps them sorted by position", () => {
    mockCore.options.gradientStops = [
      "#ff0000",
      "#0000ff",
    ];
    plugin = new GradientPlugin(mockCore);

    const index = plugin.addStop("#00ff00", 40);

    expect(index).toBe(1);
    expect(plugin.getStops()).toHaveLength(3);
    expect(plugin.getStops()[1].color).toBe("#00ff00");
  });

  it("respects maxGradientStops", () => {
    mockCore.options.gradientStops = STOPS;
    mockCore.options.maxGradientStops = 2;
    plugin = new GradientPlugin(mockCore);

    expect(plugin.addStop("#00ff00")).toBe(-1);
    expect(plugin.getStops()).toHaveLength(2);
  });

  it("respects minGradientStops when removing", () => {
    mockCore.options.gradientStops = STOPS;
    plugin = new GradientPlugin(mockCore);

    expect(plugin.removeStop(0)).toBe(false);
    expect(plugin.getStops()).toHaveLength(2);
  });

  it("removes a stop when above the minimum", () => {
    mockCore.options.gradientStops = ["#ff0000", "#00ff00", "#0000ff"];
    plugin = new GradientPlugin(mockCore);

    expect(plugin.removeStop(1)).toBe(true);
    expect(plugin.getStops()).toHaveLength(2);
    expect(getHandles(container).length).toBe(2);
  });

  it("adds a stop by clicking on the preview bar", () => {
    mockCore.options.gradientStops = STOPS;
    plugin = new GradientPlugin(mockCore);

    const preview = container.querySelector(
      ".ew-gradient-preview"
    ) as HTMLElement;
    preview.dispatchEvent(
      new MouseEvent("click", { bubbles: true, clientX: 142 })
    );

    expect(plugin.getStops()).toHaveLength(3);
    expect(getHandles(container).length).toBe(3);
  });

  it("updates the gradient through setGradient with a css string", () => {
    mockCore.options.gradientStops = STOPS;
    plugin = new GradientPlugin(mockCore);

    plugin.setGradient(
      "conic-gradient(from 90deg at 25% 75%, red 0%, blue 100%)"
    );

    expect(plugin.getGradient()).toBe(
      "conic-gradient(from 90deg at 25% 75%, red 0%, blue 100%)"
    );
    expect(
      container.querySelector(".ew-gradient-row-position")
    ).not.toBeNull();
  });

  it("ignores invalid setGradient input", () => {
    mockCore.options.gradientStops = STOPS;
    plugin = new GradientPlugin(mockCore);

    const before = plugin.getGradient();
    plugin.setGradient("invalid");

    expect(plugin.getGradient()).toBe(before);
  });

  it("updates stops through setStops", () => {
    mockCore.options.gradientStops = STOPS;
    plugin = new GradientPlugin(mockCore);

    plugin.setStops(["#000000", "#ffffff", "#ff0000"]);

    expect(plugin.getStops()).toHaveLength(3);
    expect(getHandles(container).length).toBe(3);
  });

  it("renders radial specific rows", () => {
    mockCore.options.gradientStops = STOPS;
    mockCore.options.gradientType = "radial";
    plugin = new GradientPlugin(mockCore);

    expect(
      container.querySelector(".ew-gradient-row-radial")
    ).not.toBeNull();
    expect(
      container.querySelector(".ew-gradient-row-position")
    ).not.toBeNull();
  });

  it("re-renders when updateOptions provides new stops", () => {
    mockCore.options.gradientStops = STOPS;
    plugin = new GradientPlugin(mockCore);
    expect(getHandles(container).length).toBe(2);

    mockCore.options.gradientStops = ["#000000", "#ffffff", "#ff0000"];
    plugin.updateOptions();

    expect(getHandles(container).length).toBe(3);
  });

  it("removes the editor and unbinds events on destroy", () => {
    const gradientChange = vi.fn();
    mockCore.options.gradientStops = STOPS;
    mockCore.options.gradientChange = gradientChange;
    plugin = new GradientPlugin(mockCore);
    expect(getContainer(container)).not.toBeNull();

    plugin.destroy();
    plugin = null;

    expect(getContainer(container)).toBeNull();
    expect(gradientChange).not.toHaveBeenCalled();
  });

  it("skips rendering when the panel is disabled", () => {
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {});
    mockCore.options.gradientStops = STOPS;
    mockCore.options.hasPanel = false;
    plugin = new GradientPlugin(mockCore);

    expect(getContainer(container)).toBeNull();
    warnSpy.mockRestore();
  });
});
