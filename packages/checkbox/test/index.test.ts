import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ApplyOrder } from "@ew-color-picker/utils";
import Checkbox from "../src/checkbox";
import CheckboxPlugin, { ewColorPickerCheckboxPlugin } from "../src/index";
import { createMockCore } from "../../../test/mockCore";

function createCheckbox(options: Record<string, any> = {}): Checkbox {
  const checkbox = new Checkbox({ label: "Repeating", prefix: "ew-", ...options });
  document.body.appendChild(checkbox.getElement());
  return checkbox;
}

function getInput(checkbox: Checkbox): HTMLInputElement {
  return checkbox.getElement().querySelector(
    ".ew-checkbox__input"
  ) as HTMLInputElement;
}

describe("Checkbox component", () => {
  let checkbox: Checkbox;

  afterEach(() => {
    checkbox?.destroy();
  });

  it("renders the label and stays unchecked by default", () => {
    checkbox = createCheckbox();

    expect(
      checkbox.getElement().querySelector(".ew-checkbox__label")!.textContent
    ).toBe("Repeating");
    expect(checkbox.isChecked()).toBe(false);
    expect(getInput(checkbox).checked).toBe(false);
    expect(checkbox.getElement().classList.contains("ew-checkbox--checked")).toBe(
      false
    );
  });

  it("reflects the checked option", () => {
    checkbox = createCheckbox({ checked: true });

    expect(checkbox.isChecked()).toBe(true);
    expect(getInput(checkbox).checked).toBe(true);
    expect(
      checkbox.getElement().classList.contains("ew-checkbox--checked")
    ).toBe(true);
  });

  it("fires onChange when the native input toggles", () => {
    const onChange = vi.fn();
    checkbox = createCheckbox({ onChange });

    getInput(checkbox).click();

    expect(checkbox.isChecked()).toBe(true);
    expect(
      checkbox.getElement().classList.contains("ew-checkbox--checked")
    ).toBe(true);
    expect(onChange).toHaveBeenCalledWith(true);
  });

  it("setChecked can skip onChange", () => {
    const onChange = vi.fn();
    checkbox = createCheckbox({ onChange });

    checkbox.setChecked(true, false);
    expect(checkbox.isChecked()).toBe(true);
    expect(onChange).not.toHaveBeenCalled();

    checkbox.setChecked(false);
    expect(checkbox.isChecked()).toBe(false);
    expect(onChange).toHaveBeenCalledWith(false);
  });

  it("updates the label and disabled state", () => {
    checkbox = createCheckbox();

    checkbox.setLabel("Repeat");
    expect(
      checkbox.getElement().querySelector(".ew-checkbox__label")!.textContent
    ).toBe("Repeat");

    checkbox.setDisabled(true);
    expect(getInput(checkbox).disabled).toBe(true);
    expect(
      checkbox.getElement().classList.contains("ew-checkbox--disabled")
    ).toBe(true);

    checkbox.setDisabled(false);
    expect(getInput(checkbox).disabled).toBe(false);
    expect(
      checkbox.getElement().classList.contains("ew-checkbox--disabled")
    ).toBe(false);
  });

  it("removes the DOM node on destroy", () => {
    checkbox = createCheckbox();
    const element = checkbox.getElement();

    checkbox.destroy();

    expect(element.parentNode).toBeNull();
  });
});

describe("Checkbox plugin", () => {
  let container: HTMLElement;
  let mockCore: any;
  let plugin: CheckboxPlugin | null = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    mockCore = createMockCore(container, {
      checkboxLabel: "Repeating",
      checkboxChecked: false,
    });
  });

  afterEach(() => {
    plugin?.destroy();
    plugin = null;
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it("renders nothing when checkboxLabel is not provided", () => {
    mockCore.options.checkboxLabel = undefined;
    plugin = new CheckboxPlugin(mockCore);

    expect(container.querySelector(".ew-checkbox")).toBeNull();
  });

  it("renders nothing when showCheckbox is false", () => {
    mockCore.options.showCheckbox = false;
    plugin = new CheckboxPlugin(mockCore);

    expect(container.querySelector(".ew-checkbox")).toBeNull();
  });

  it("renders the checkbox into the bottom row", () => {
    mockCore.getMountPoint("panelContainer");
    const bottomRow = mockCore.getMountPoint("bottom-row");
    plugin = new CheckboxPlugin(mockCore);

    const checkboxEl = container.querySelector(".ew-checkbox") as HTMLElement;
    expect(checkboxEl).not.toBeNull();
    expect(bottomRow.contains(checkboxEl)).toBe(true);
  });

  it("applies checkboxChecked and forwards onCheckboxChange", () => {
    const onCheckboxChange = vi.fn();
    mockCore.options.checkboxChecked = true;
    mockCore.options.onCheckboxChange = onCheckboxChange;
    plugin = new CheckboxPlugin(mockCore);

    const input = container.querySelector(
      ".ew-checkbox__input"
    ) as HTMLInputElement;
    expect(input.checked).toBe(true);

    input.click();

    expect(onCheckboxChange).toHaveBeenCalledWith(false);
  });

  it("re-renders when updateOptions changes the label", () => {
    plugin = new CheckboxPlugin(mockCore);
    expect(
      container.querySelector(".ew-checkbox__label")!.textContent
    ).toBe("Repeating");

    mockCore.options.checkboxLabel = "反向";
    mockCore.options.checkboxChecked = true;
    plugin.updateOptions();

    expect(
      container.querySelector(".ew-checkbox__label")!.textContent
    ).toBe("反向");
    expect(
      (container.querySelector(".ew-checkbox__input") as HTMLInputElement)
        .checked
    ).toBe(true);
  });

  it("removes the checkbox on destroy", () => {
    plugin = new CheckboxPlugin(mockCore);
    expect(container.querySelector(".ew-checkbox")).not.toBeNull();

    plugin.destroy();
    plugin = null;

    expect(container.querySelector(".ew-checkbox")).toBeNull();
  });

  it("exposes the plugin name and order", () => {
    expect(ewColorPickerCheckboxPlugin.pluginName).toBe("ewColorPickerCheckbox");
    expect(ewColorPickerCheckboxPlugin.applyOrder).toBe(ApplyOrder.Post);
  });
});
