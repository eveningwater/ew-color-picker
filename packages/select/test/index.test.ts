import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { ApplyOrder } from "@ew-color-picker/utils";
import Select from "../src/select";
import SelectPlugin, { ewColorPickerSelectPlugin } from "../src/index";
import { createMockCore } from "../../../test/mockCore";

const ITEMS = [
  { label: "线性渐变", value: "linear" },
  { label: "径向渐变", value: "radial" },
  { label: "锥形渐变", value: "conic", disabled: true },
];

function createSelect(options: Record<string, any> = {}): Select {
  const select = new Select({ items: ITEMS, prefix: "ew-", ...options });
  document.body.appendChild(select.getElement());
  return select;
}

function getTrigger(select: Select): HTMLButtonElement {
  return select.getElement().querySelector(
    ".ew-select__trigger"
  ) as HTMLButtonElement;
}

describe("Select component", () => {
  let select: Select;

  afterEach(() => {
    select?.destroy();
  });

  it("renders a trigger with the placeholder when no value is set", () => {
    select = createSelect({ placeholder: "请选择渐变类型" });

    expect(getTrigger(select).getAttribute("aria-expanded")).toBe("false");
    expect(
      select.getElement().querySelector(".ew-select__value")!.textContent
    ).toBe("请选择渐变类型");
    expect(select.isDropdownOpen()).toBe(false);
  });

  it("opens the dropdown when the trigger is clicked", () => {
    select = createSelect();

    getTrigger(select).click();

    expect(select.isDropdownOpen()).toBe(true);
    expect(
      select.getElement().classList.contains("ew-select--open")
    ).toBe(true);
    expect(getTrigger(select).getAttribute("aria-expanded")).toBe("true");
  });

  it("selects an option, updates the label and fires onChange", () => {
    const onChange = vi.fn();
    select = createSelect({ onChange });

    getTrigger(select).click();
    const options = select.getElement().querySelectorAll(".ew-select__option");
    (options[1] as HTMLElement).click();

    expect(select.getValue()).toBe("radial");
    expect(
      select.getElement().querySelector(".ew-select__value")!.textContent
    ).toBe("径向渐变");
    expect(onChange).toHaveBeenCalledWith("radial", ITEMS[1]);
    expect(select.isDropdownOpen()).toBe(false);
  });

  it("ignores disabled options", () => {
    const onChange = vi.fn();
    select = createSelect({ onChange });

    getTrigger(select).click();
    const options = select.getElement().querySelectorAll(".ew-select__option");
    (options[2] as HTMLElement).click();

    expect(select.getValue()).toBeUndefined();
    expect(onChange).not.toHaveBeenCalled();
  });

  it("supports keyboard navigation and Enter to select", () => {
    const onChange = vi.fn();
    select = createSelect({ onChange });
    const trigger = getTrigger(select);

    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    );
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "ArrowDown", bubbles: true })
    );
    trigger.dispatchEvent(
      new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
    );

    expect(select.getValue()).toBe("radial");
    expect(onChange).toHaveBeenCalledWith("radial", ITEMS[1]);
  });

  it("closes the dropdown when clicking outside", () => {
    select = createSelect();
    getTrigger(select).click();

    document.body.dispatchEvent(
      new MouseEvent("mousedown", { bubbles: true })
    );

    expect(select.isDropdownOpen()).toBe(false);
  });

  it("setValue can skip onChange", () => {
    const onChange = vi.fn();
    select = createSelect({ onChange });

    select.setValue("linear", false);
    expect(select.getValue()).toBe("linear");
    expect(onChange).not.toHaveBeenCalled();

    select.setValue("linear");
    expect(onChange).toHaveBeenCalledWith("linear", ITEMS[0]);
  });

  it("setItems refreshes the option list", () => {
    select = createSelect();
    select.setItems([{ label: "仅一项", value: "only" }]);

    expect(
      select.getElement().querySelectorAll(".ew-select__option").length
    ).toBe(1);
  });

  it("does not open when disabled", () => {
    select = createSelect({ disabled: true });

    getTrigger(select).click();

    expect(select.isDropdownOpen()).toBe(false);
    expect(
      select.getElement().classList.contains("ew-select--disabled")
    ).toBe(true);
  });

  it("removes the DOM node on destroy", () => {
    select = createSelect();
    const element = select.getElement();

    select.destroy();

    expect(element.parentNode).toBeNull();
  });

  it("clears the selected value when the clear icon is clicked", () => {
    const onClear = vi.fn();
    select = createSelect({ value: "linear", placeholder: "请选择", onClear });

    const clearNode = select.getElement().querySelector(
      ".ew-select__clear"
    ) as HTMLElement;
    expect(clearNode.classList.contains("ew-select__clear--hidden")).toBe(false);

    clearNode.click();

    expect(select.getValue()).toBeUndefined();
    expect(
      select.getElement().querySelector(".ew-select__value")!.textContent
    ).toBe("请选择");
    expect(onClear).toHaveBeenCalledTimes(1);
    expect(select.isDropdownOpen()).toBe(false);
  });

  it("keeps the clear icon hidden when there is no value or clearable is false", () => {
    select = createSelect({ placeholder: "请选择" });
    let clearNode = select.getElement().querySelector(
      ".ew-select__clear"
    ) as HTMLElement;
    expect(clearNode.classList.contains("ew-select__clear--hidden")).toBe(true);

    select.destroy();

    select = createSelect({ value: "linear", clearable: false });
    clearNode = select.getElement().querySelector(
      ".ew-select__clear"
    ) as HTMLElement;
    expect(clearNode.classList.contains("ew-select__clear--hidden")).toBe(true);
  });

  it("does not open the dropdown when clearing an open select", () => {
    select = createSelect({ value: "linear" });
    getTrigger(select).click();
    expect(select.isDropdownOpen()).toBe(true);

    const clearNode = select.getElement().querySelector(
      ".ew-select__clear"
    ) as HTMLElement;
    clearNode.click();

    expect(select.getValue()).toBeUndefined();
    expect(select.isDropdownOpen()).toBe(false);
  });

  it("clear() can skip onClear", () => {
    const onClear = vi.fn();
    select = createSelect({ value: "linear", onClear });

    select.clear(false);

    expect(select.getValue()).toBeUndefined();
    expect(onClear).not.toHaveBeenCalled();
  });
});

describe("Select plugin", () => {
  let container: HTMLElement;
  let mockCore: any;
  let plugin: SelectPlugin | null = null;

  beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
    mockCore = createMockCore(container, { selectItems: ITEMS });
  });

  afterEach(() => {
    plugin?.destroy();
    plugin = null;
    if (container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it("renders nothing when selectItems is not provided", () => {
    mockCore.options.selectItems = undefined;
    plugin = new SelectPlugin(mockCore);

    expect(container.querySelector(".ew-select")).toBeNull();
  });

  it("renders nothing when showSelect is false", () => {
    mockCore.options.showSelect = false;
    plugin = new SelectPlugin(mockCore);

    expect(container.querySelector(".ew-select")).toBeNull();
  });

  it("renders the select into the bottom row", () => {
    mockCore.getMountPoint("panelContainer");
    const bottomRow = mockCore.getMountPoint("bottom-row");
    plugin = new SelectPlugin(mockCore);

    const selectEl = container.querySelector(".ew-select") as HTMLElement;
    expect(selectEl).not.toBeNull();
    expect(bottomRow.contains(selectEl)).toBe(true);
  });

  it("forwards onSelectChange", () => {
    const onSelectChange = vi.fn();
    mockCore.options.onSelectChange = onSelectChange;
    plugin = new SelectPlugin(mockCore);

    const trigger = container.querySelector(
      ".ew-select__trigger"
    ) as HTMLButtonElement;
    trigger.click();
    (container.querySelectorAll(".ew-select__option")[1] as HTMLElement).click();

    expect(onSelectChange).toHaveBeenCalledWith("radial", ITEMS[1]);
  });

  it("re-renders when updateOptions provides new items", () => {
    plugin = new SelectPlugin(mockCore);
    expect(container.querySelectorAll(".ew-select__option").length).toBe(3);

    mockCore.options.selectItems = [{ label: "新增项", value: "new" }];
    plugin.updateOptions();

    expect(container.querySelectorAll(".ew-select__option").length).toBe(1);
  });

  it("removes the select on destroy", () => {
    plugin = new SelectPlugin(mockCore);
    expect(container.querySelector(".ew-select")).not.toBeNull();

    plugin.destroy();
    plugin = null;

    expect(container.querySelector(".ew-select")).toBeNull();
  });

  it("exposes the plugin name and order", () => {
    expect(ewColorPickerSelectPlugin.pluginName).toBe("ewColorPickerSelect");
    expect(ewColorPickerSelectPlugin.applyOrder).toBe(ApplyOrder.Post);
  });

  it("forwards onSelectClear when the clear icon is clicked", () => {
    const onSelectClear = vi.fn();
    mockCore.options.selectValue = "linear";
    mockCore.options.onSelectClear = onSelectClear;
    plugin = new SelectPlugin(mockCore);

    const clearNode = container.querySelector(
      ".ew-select__clear"
    ) as HTMLElement;
    expect(clearNode.classList.contains("ew-select__clear--hidden")).toBe(false);

    clearNode.click();

    expect(onSelectClear).toHaveBeenCalledTimes(1);
  });

  it("hides the clear icon when selectClearable is false", () => {
    mockCore.options.selectValue = "linear";
    mockCore.options.selectClearable = false;
    plugin = new SelectPlugin(mockCore);

    const clearNode = container.querySelector(
      ".ew-select__clear"
    ) as HTMLElement;
    expect(clearNode.classList.contains("ew-select__clear--hidden")).toBe(true);
  });
});
