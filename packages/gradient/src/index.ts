import ewColorPicker, { ewColorPickerOptions } from "@ew-color-picker/core";
import {
  on,
  create,
  addClass,
  setAttr,
  insertNode,
  removeElement,
  isFunction,
  extend,
  warn,
  $,
  getPrefix,
  getRect,
  bindMouseDrag,
  DEFAULT_PANEL_WIDTH,
  isString,
  isObject,
  isBoolean,
  isNumber,
  colorToRgba,
  ApplyOrder,
} from "@ew-color-picker/utils";
import { Select } from "@ew-color-picker/select";
import type { SelectOptions } from "@ew-color-picker/select";
import { InputNumber } from "@ew-color-picker/input-number";
import type { InputNumberOptions } from "@ew-color-picker/input-number";
import { Checkbox } from "@ew-color-picker/checkbox";
import type { CheckboxOptions } from "@ew-color-picker/checkbox";
import { parseGradient, serializeGradient } from "./parse";
import { interpolateStops, resolveGradientPositions } from "./interpolate";
import {
  cloneGradientValue,
  createGradientValue,
  type GradientStop,
  type GradientType,
  type GradientValue,
} from "./types";

export type {
  GradientAngle,
  GradientPosition,
  GradientStop,
  GradientType,
  GradientValue,
} from "./types";
export { parseGradient, serializeGradient } from "./parse";
export { interpolateStops, resolveGradientPositions } from "./interpolate";

export interface GradientPluginOptions {
  /** 默认 false；传 gradient / gradientStops 或显式 true 时渲染 */
  showGradient?: boolean;
  /** 初始渐变，CSS 字符串或结构化数据 */
  gradient?: string | GradientValue;
  gradientType?: GradientType;
  gradientRepeating?: boolean;
  gradientStops?: Array<string | GradientStop>;
  /** 线性渐变的初始角度（度） */
  gradientAngle?: number;
  gradientInterpolation?: string | null;
  /** 默认 2 */
  minGradientStops?: number;
  /** 默认 8 */
  maxGradientStops?: number;
  /** 默认 true，主面板改色时写回当前选中的 stop */
  syncStopsOnChange?: boolean;
  gradientChange?: (css: string, value: GradientValue) => void;
}

const DEFAULT_OPTIONS = {
  minGradientStops: 2,
  maxGradientStops: 8,
  syncStopsOnChange: true,
};

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function roundPercent(value: number): number {
  return Math.round(clamp(value, 0, 100) * 10) / 10;
}

function angleToDegrees(angle: { value: number; unit: string }): number {
  switch (angle.unit) {
    case "rad":
      return (angle.value * 180) / Math.PI;
    case "grad":
      return angle.value * 0.9;
    case "turn":
      return angle.value * 360;
    default:
      return angle.value;
  }
}

export default class ewColorPickerGradientPlugin {
  static pluginName = "ewColorPickerGradient";
  static applyOrder = ApplyOrder.Post;

  options: GradientPluginOptions & Omit<ewColorPickerOptions, "el"> =
    {} as any;
  private ewColorPicker: ewColorPicker | null;

  private value: GradientValue = createGradientValue();
  private selectedIndex: number = 0;
  private syncing: boolean = false;
  private destroyed: boolean = false;
  private changeBound: boolean = false;
  private gradientRef: unknown = undefined;
  private stopsRef: unknown = undefined;

  private container: HTMLDivElement | null = null;
  private bar: HTMLDivElement | null = null;
  private sizeInput: HTMLInputElement | null = null;

  private selects: Select[] = [];
  private numbers: InputNumber[] = [];
  private checkboxes: Checkbox[] = [];
  private angleInput: InputNumber | null = null;
  private atXInput: InputNumber | null = null;
  private atYInput: InputNumber | null = null;
  private posInput: InputNumber | null = null;
  private pos2Input: InputNumber | null = null;

  private draggingIndex: number = -1;
  private dragUnbind: (() => void) | null = null;

  private get prefix(): string {
    return getPrefix(this.ewColorPicker);
  }

  constructor(ewColorPicker: ewColorPicker) {
    this.ewColorPicker = ewColorPicker;
    this.handleOptions();
    this.gradientRef = this.options.gradient;
    this.stopsRef = this.options.gradientStops;
    this.initValue();
    this.bindCoreEvents();
    this.run();
  }

  install(ewColorPicker: ewColorPicker) {
    this.ewColorPicker = ewColorPicker;
    this.destroyed = false;
    this.handleOptions();
    this.gradientRef = this.options.gradient;
    this.stopsRef = this.options.gradientStops;
    this.initValue();
    this.bindCoreEvents();
    this.run();
  }

  handleOptions() {
    const options = this.ewColorPicker?.options;
    this.options = extend(
      {},
      DEFAULT_OPTIONS,
      this.options,
      options || {}
    ) as GradientPluginOptions & Omit<ewColorPickerOptions, "el">;
  }

  updateOptions() {
    this.handleOptions();
    const gradientChanged = this.options.gradient !== this.gradientRef;
    const stopsChanged = this.options.gradientStops !== this.stopsRef;
    this.gradientRef = this.options.gradient;
    this.stopsRef = this.options.gradientStops;
    if (gradientChanged || stopsChanged) {
      this.initValue();
    }
    this.run();
  }

  run() {
    if (!this.ewColorPicker) return;
    if (!this.shouldRender()) {
      this.removeContainer();
      return;
    }
    if (this.isPanelDisabled()) {
      warn(
        "[ewColorPicker warning]: Gradient plugin requires the panel. Set hasPanel: false disables the gradient editor."
      );
      this.removeContainer();
      return;
    }
    this.render();
  }

  private shouldRender(): boolean {
    if (this.options.showGradient === false) return false;
    if (this.options.showGradient === true) return true;
    return (
      this.options.gradient !== undefined ||
      (Array.isArray(this.options.gradientStops) &&
        this.options.gradientStops.length > 0)
    );
  }

  private isPanelDisabled(): boolean {
    return (
      this.options.hasPanel === false ||
      this.options.ewColorPickerPanel === false
    );
  }

  private getCurrentColor(): string {
    const core = this.ewColorPicker;
    if (!core) return "#ff0000";
    const current = isFunction(core.getColor) ? core.getColor() : "";
    return current || core.options?.defaultColor || "#ff0000";
  }

  private initValue() {
    const {
      gradient,
      gradientStops,
      gradientType,
      gradientRepeating,
      gradientAngle,
      gradientInterpolation,
    } = this.options;

    let value: GradientValue | null = null;
    if (isString(gradient)) {
      const parsed = parseGradient(gradient);
      if (parsed) {
        value = parsed;
      } else {
        warn(
          `[ewColorPicker warning]: Unable to parse gradient "${gradient}", fallback to default stops.`
        );
      }
    } else if (isObject(gradient)) {
      value = cloneGradientValue(
        extend(createGradientValue(gradient.type || "linear"), gradient)
      );
    }

    if (!value) {
      value = createGradientValue(gradientType || "linear");
      const rawStops =
        Array.isArray(gradientStops) && gradientStops.length > 0
          ? gradientStops
          : [this.getCurrentColor(), "#ffffff"];
      value.stops = rawStops.map((stop) =>
        isString(stop) ? { color: stop } : { ...stop }
      );
    }

    if (gradientType) value.type = gradientType;
    if (isBoolean(gradientRepeating)) {
      value.repeating = gradientRepeating;
    }
    if (isNumber(gradientAngle)) {
      value.angle = { value: gradientAngle, unit: "deg" };
    }
    if (gradientInterpolation !== undefined) {
      value.interpolation = gradientInterpolation || null;
    }

    value.stops = this.normalizeStops(value.stops, value);
    this.value = value;
    this.selectedIndex = 0;
  }

  private normalizeStops(
    stops: GradientStop[],
    base: GradientValue = this.value
  ): GradientStop[] {
    const max = this.options.maxGradientStops ?? 8;
    const mapped = (stops || []).map((stop) => ({ ...stop }));
    if (mapped.length > max) {
      warn(
        `[ewColorPicker warning]: maxGradientStops is ${max}, extra stops are ignored.`
      );
      return mapped.slice(0, max);
    }
    if (mapped.length === 0) {
      return [
        { color: base.stops?.[0]?.color || this.getCurrentColor() },
        { color: "#ffffff" },
      ];
    }
    if (mapped.length === 1) {
      return [mapped[0], { color: "#ffffff" }];
    }
    return mapped;
  }

  private bindCoreEvents() {
    if (this.changeBound || !this.ewColorPicker) return;
    this.ewColorPicker.on("change", this.handleCoreChange);
    this.changeBound = true;
  }

  private handleCoreChange = (color: string) => {
    if (this.destroyed || this.syncing) return;
    if (this.options.syncStopsOnChange === false) return;
    if (!color) return;

    const stop = this.value.stops[this.selectedIndex];
    if (!stop) return;

    const previous = colorToRgba(stop.color) || stop.color;
    const next = colorToRgba(color) || color;
    if (previous === next) return;

    stop.color = color;
    this.updatePreview();
    this.emitChange();
  };

  private emitChange() {
    if (isFunction(this.options.gradientChange)) {
      this.options.gradientChange(this.getGradient(), this.getGradientValue());
    }
  }

  private applySelectedStopColor() {
    const core = this.ewColorPicker;
    const stop = this.value.stops[this.selectedIndex];
    if (!core || !stop?.color) return;
    this.syncing = true;
    try {
      core.setColor(stop.color);
    } finally {
      this.syncing = false;
    }
  }

  private render() {
    const core = this.ewColorPicker;
    if (!core) return;
    const panelContainer = core.getMountPoint("panelContainer");
    if (!panelContainer) {
      warn("[ewColorPicker warning]: Panel container not found");
      this.removeContainer();
      return;
    }

    this.removeContainer();
    const p = this.prefix;
    const container = create<HTMLDivElement>("div");
    addClass(container, `${p}gradient-container`);
    this.container = container;

    this.buildPreview(container);
    this.buildTypeRow(container);
    if (this.value.type === "radial") this.buildRadialRow(container);
    if (this.value.type === "radial" || this.value.type === "conic") {
      this.buildPositionRow(container);
    }
    this.buildInterpolationRow(container);
    this.buildStopRow(container);

    const bottomRow = $(
      `.${p}color-picker-bottom-row`,
      panelContainer
    ) as HTMLElement | null;
    insertNode(panelContainer, container, null, bottomRow);

    this.updatePreview();
    this.syncStopInputs();
  }

  private createRow(className: string = ""): HTMLDivElement {
    const row = create<HTMLDivElement>("div");
    addClass(row, `${this.prefix}gradient-row`);
    if (className) addClass(row, className);
    return row;
  }

  private createLabel(text: string): HTMLSpanElement {
    const label = create<HTMLSpanElement>("span");
    addClass(label, `${this.prefix}gradient-label`);
    label.textContent = text;
    return label;
  }

  private createButton(text: string): HTMLButtonElement {
    const button = create<HTMLButtonElement>("button");
    addClass(button, `${this.prefix}gradient-btn`);
    setAttr(button, { type: "button" });
    button.textContent = text;
    return button;
  }

  private createSelect(options: SelectOptions): Select {
    const select = new Select({
      prefix: this.prefix,
      size: "small",
      clearable: false,
      ...options,
    });
    this.selects.push(select);
    return select;
  }

  private createNumber(options: InputNumberOptions): InputNumber {
    const number = new InputNumber({
      prefix: this.prefix,
      size: "small",
      ...options,
    });
    this.numbers.push(number);
    return number;
  }

  private createCheckbox(options: CheckboxOptions): Checkbox {
    const checkbox = new Checkbox({
      prefix: this.prefix,
      size: "small",
      ...options,
    });
    this.checkboxes.push(checkbox);
    return checkbox;
  }

  private buildPreview(container: HTMLElement) {
    const p = this.prefix;
    const preview = create<HTMLDivElement>("div");
    addClass(preview, `${p}gradient-preview`);
    const bar = create<HTMLDivElement>("div");
    addClass(bar, `${p}gradient-preview-bar`);
    this.bar = bar;

    insertNode(preview, bar);
    insertNode(container, preview);
    on(preview, "click", this.handlePreviewClick as EventListener);
  }

  private updatePreview() {
    if (!this.bar) return;
    this.bar.style.background = this.buildPreviewCss();
    this.renderHandles();
  }

  private buildPreviewCss(): string {
    const positions = this.getResolvedPositions();
    const stops = this.value.stops
      .map((stop, index) => `${stop.color} ${positions[index]}%`)
      .join(", ");
    return `linear-gradient(90deg, ${stops})`;
  }

  private getResolvedPositions(): number[] {
    return resolveGradientPositions(this.value.stops).map((position) =>
      roundPercent(position)
    );
  }

  private renderHandles() {
    if (!this.bar) return;
    const p = this.prefix;
    this.bar.textContent = "";
    const positions = this.getResolvedPositions();

    this.value.stops.forEach((stop, index) => {
      const handle = create<HTMLButtonElement>("button");
      addClass(handle, `${p}gradient-handle`);
      if (index === this.selectedIndex) {
        addClass(handle, `${p}gradient-handle-active`);
      }
      setAttr(handle, {
        type: "button",
        "data-gradient-index": index,
        "aria-label": `${stop.color} ${positions[index]}%`,
        title: `${stop.color} ${positions[index]}%`,
      });
      handle.style.left = `${positions[index]}%`;
      handle.style.backgroundColor = stop.color;
      on(handle, "mousedown", (event) =>
        this.handleHandleMousedown(event as MouseEvent, index)
      );
      insertNode(this.bar!, handle);
    });
  }

  private handleHandleMousedown(event: MouseEvent, index: number) {
    event.preventDefault();
    event.stopPropagation();
    this.selectStop(index);
    this.draggingIndex = index;
    this.dragUnbind?.();
    this.dragUnbind = bindMouseDrag(
      this.handleDocumentMove,
      this.handleDocumentUp
    );
  }

  private handleDocumentMove = (event: MouseEvent) => {
    if (this.draggingIndex < 0) return;
    const stop = this.value.stops[this.draggingIndex];
    if (!stop) return;

    const position = this.getPositionByClientX(event.clientX);
    stop.position = position;
    this.posInput?.setValue(position, false);
    if (stop.position2 !== undefined) {
      this.pos2Input?.setValue(position, false);
    }
    this.renderHandles();
    if (this.bar) this.bar.style.background = this.buildPreviewCss();
    this.emitChange();
  };

  private handleDocumentUp = () => {
    this.draggingIndex = -1;
    this.dragUnbind = null;
  };

  private getPositionByClientX(clientX: number): number {
    const bar = this.bar;
    if (!bar) return 0;
    const rect = getRect(bar);
    const width = rect.width || bar.offsetWidth || DEFAULT_PANEL_WIDTH;
    const left = rect.left || 0;
    return roundPercent(((clientX - left) / width) * 100);
  }

  private handlePreviewClick = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;
    if (!target) return;
    if (target.closest(`.${this.prefix}gradient-handle`)) return;

    const position = this.getPositionByClientX(event.clientX);
    const color =
      interpolateStops(
        this.value.stops,
        position,
        this.value.interpolation
      ) || this.getCurrentColor();
    this.addStopInternal(color, position);
  };

  private buildTypeRow(container: HTMLElement) {
    const p = this.prefix;
    const row = this.createRow(`${p}gradient-row-type`);
    insertNode(row, this.createLabel("类型"));

    const selectWrap = create<HTMLDivElement>("div");
    addClass(selectWrap, `${p}gradient-select`);
    const typeSelect = this.createSelect({
      value: this.value.type,
      items: [
        { label: "Linear", value: "linear" },
        { label: "Radial", value: "radial" },
        { label: "Conic", value: "conic" },
      ],
      onChange: (value) => {
        if (value === this.value.type) return;
        this.value.type = value as GradientType;
        this.render();
        this.emitChange();
      },
    });
    insertNode(selectWrap, typeSelect.getElement());
    insertNode(row, selectWrap);

    const repeatBox = this.createCheckbox({
      label: "Repeating",
      checked: this.value.repeating,
      onChange: (checked) => {
        this.value.repeating = checked;
        this.emitChange();
      },
    });
    insertNode(row, repeatBox.getElement());

    if (this.value.type !== "radial") {
      const isConic = this.value.type === "conic";
      insertNode(row, this.createLabel(isConic ? "起始角" : "角度"));
      this.angleInput = this.createNumber({
        value: angleToDegrees(
          isConic ? this.value.conicFrom : this.value.angle
        ),
        min: 0,
        max: 360,
        step: 1,
        precision: 0,
        onChange: (value) => {
          if (isConic) {
            this.value.conicFrom = { value, unit: "deg" };
          } else {
            this.value.angle = { value, unit: "deg" };
          }
          this.emitChange();
        },
      });
      insertNode(row, this.angleInput.getElement());
    }

    insertNode(container, row);
  }

  private buildRadialRow(container: HTMLElement) {
    const p = this.prefix;
    const row = this.createRow(`${p}gradient-row-radial`);

    insertNode(row, this.createLabel("形状"));
    const shapeWrap = create<HTMLDivElement>("div");
    addClass(shapeWrap, `${p}gradient-select`);
    const shapeSelect = this.createSelect({
      value: this.value.radialShape,
      items: [
        { label: "Ellipse", value: "ellipse" },
        { label: "Circle", value: "circle" },
      ],
      onChange: (value) => {
        this.value.radialShape = value as "circle" | "ellipse";
        this.emitChange();
      },
    });
    insertNode(shapeWrap, shapeSelect.getElement());
    insertNode(row, shapeWrap);

    insertNode(row, this.createLabel("尺寸"));
    const sizeWrap = create<HTMLDivElement>("div");
    addClass(sizeWrap, `${p}gradient-select`);
    const sizeKeywords = [
      "closest-side",
      "closest-corner",
      "farthest-side",
      "farthest-corner",
    ];
    const sizeSelect = this.createSelect({
      value: sizeKeywords.includes(this.value.radialSize)
        ? this.value.radialSize
        : "farthest-corner",
      items: sizeKeywords.map((keyword) => ({
        label: keyword,
        value: keyword,
      })),
      onChange: (value) => {
        this.value.radialSize = String(value);
        if (this.sizeInput) this.sizeInput.value = "";
        this.emitChange();
      },
    });
    insertNode(sizeWrap, sizeSelect.getElement());
    insertNode(row, sizeWrap);

    const sizeInput = create<HTMLInputElement>("input");
    addClass(sizeInput, `${p}gradient-text`);
    setAttr(sizeInput, {
      type: "text",
      placeholder: "自定义尺寸",
    });
    sizeInput.value = sizeKeywords.includes(this.value.radialSize)
      ? ""
      : this.value.radialSize;
    on(sizeInput, "change", () => {
      const next = sizeInput.value.trim();
      this.value.radialSize = next || "farthest-corner";
      this.emitChange();
    });
    this.sizeInput = sizeInput;
    insertNode(row, sizeInput);

    insertNode(container, row);
  }

  private buildPositionRow(container: HTMLElement) {
    const p = this.prefix;
    const row = this.createRow(`${p}gradient-row-position`);
    insertNode(row, this.createLabel("位置"));

    this.atXInput = this.createNumber({
      value: this.value.position.x,
      min: 0,
      max: 100,
      step: 1,
      precision: 0,
      onChange: (value) => {
        this.value.position.x = clamp(value, 0, 100);
        this.emitChange();
      },
    });
    insertNode(row, this.atXInput.getElement());

    this.atYInput = this.createNumber({
      value: this.value.position.y,
      min: 0,
      max: 100,
      step: 1,
      precision: 0,
      onChange: (value) => {
        this.value.position.y = clamp(value, 0, 100);
        this.emitChange();
      },
    });
    insertNode(row, this.atYInput.getElement());

    insertNode(container, row);
  }

  private buildInterpolationRow(container: HTMLElement) {
    const p = this.prefix;
    const row = this.createRow(`${p}gradient-row-interp`);
    insertNode(row, this.createLabel("插值"));

    const wrap = create<HTMLDivElement>("div");
    addClass(wrap, `${p}gradient-select`);
    const interpolation = this.value.interpolation || "default";
    const select = this.createSelect({
      value: interpolation,
      items: [
        { label: "Default", value: "default" },
        { label: "sRGB", value: "srgb" },
        { label: "sRGB linear", value: "srgb-linear" },
        { label: "OKLab", value: "oklab" },
        { label: "OKLCH", value: "oklch" },
        { label: "HSL shorter", value: "hsl shorter hue" },
        { label: "HSL longer", value: "hsl longer hue" },
        { label: "OKLCH longer", value: "oklch longer hue" },
      ],
      onChange: (value) => {
        this.value.interpolation =
          value === "default" ? null : String(value);
        this.emitChange();
      },
    });
    insertNode(wrap, select.getElement());
    insertNode(row, wrap);
    insertNode(container, row);
  }

  private buildStopRow(container: HTMLElement) {
    const p = this.prefix;
    const row = this.createRow(`${p}gradient-row-stop`);
    insertNode(row, this.createLabel("停靠点"));

    const stop = this.value.stops[this.selectedIndex];
    const primary = this.getResolvedPositions()[this.selectedIndex] ?? 0;

    this.posInput = this.createNumber({
      value: primary,
      min: 0,
      max: 100,
      step: 1,
      precision: 0,
      onChange: (value) => {
        const target = this.value.stops[this.selectedIndex];
        if (!target) return;
        target.position = clamp(value, 0, 100);
        this.updatePreview();
        this.emitChange();
      },
    });
    insertNode(row, this.posInput.getElement());

    insertNode(row, this.createLabel("~"));

    this.pos2Input = this.createNumber({
      value: stop?.position2 ?? primary,
      min: 0,
      max: 100,
      step: 1,
      precision: 0,
      onChange: (value) => {
        const target = this.value.stops[this.selectedIndex];
        if (!target) return;
        const position = target.position ?? primary;
        if (value === position) {
          delete target.position2;
        } else {
          target.position2 = clamp(value, 0, 100);
        }
        this.updatePreview();
        this.emitChange();
      },
    });
    insertNode(row, this.pos2Input.getElement());

    const removeBtn = this.createButton("删除");
    on(removeBtn, "click", () => {
      this.removeStopInternal(this.selectedIndex);
    });
    insertNode(row, removeBtn);

    const addBtn = this.createButton("新增");
    on(addBtn, "click", () => {
      this.addStopInternal(
        interpolateStops(
          this.value.stops,
          50,
          this.value.interpolation
        ) || this.getCurrentColor(),
        50
      );
    });
    insertNode(row, addBtn);

    insertNode(container, row);
  }

  private selectStop(index: number, applyColor: boolean = true) {
    if (index < 0 || index >= this.value.stops.length) return;
    this.selectedIndex = index;
    this.renderHandles();
    this.syncStopInputs();
    if (applyColor) this.applySelectedStopColor();
  }

  private syncStopInputs() {
    const positions = this.getResolvedPositions();
    const stop = this.value.stops[this.selectedIndex];
    if (!stop) return;
    const primary = positions[this.selectedIndex] ?? 0;
    this.posInput?.setValue(primary, false);
    this.pos2Input?.setValue(stop.position2 ?? primary, false);
  }

  private addStopInternal(color: string, position?: number): number {
    const max = this.options.maxGradientStops ?? 8;
    if (this.value.stops.length >= max) {
      warn(
        `[ewColorPicker warning]: Cannot add more than ${max} gradient stops.`
      );
      return -1;
    }

    const stop: GradientStop = { color };
    if (position !== undefined) stop.position = roundPercent(position);

    // 先按已有色标解析出位置，再插入新色标并排序，
    // 避免新色标的显式位置影响已有缺省位置的补全结果
    const existingPositions = this.getResolvedPositions();
    const newPosition =
      stop.position !== undefined ? stop.position : 50;
    this.value.stops.push(stop);

    const order = this.value.stops
      .map((item, index) => ({
        item,
        position:
          index === this.value.stops.length - 1
            ? newPosition
            : existingPositions[index],
      }))
      .sort((a, b) => a.position - b.position);
    this.value.stops = order.map((entry) => entry.item);
    this.selectedIndex = order.findIndex((entry) => entry.item === stop);

    this.updatePreview();
    this.syncStopInputs();
    this.emitChange();
    return this.selectedIndex;
  }

  private removeStopInternal(index?: number): boolean {
    const targetIndex =
      index === undefined ? this.selectedIndex : index;
    const min = this.options.minGradientStops ?? 2;
    if (this.value.stops.length <= min) {
      warn(
        `[ewColorPicker warning]: At least ${min} gradient stops are required.`
      );
      return false;
    }
    if (targetIndex < 0 || targetIndex >= this.value.stops.length) return false;

    this.value.stops.splice(targetIndex, 1);
    this.selectedIndex = clamp(
      targetIndex,
      0,
      Math.max(this.value.stops.length - 1, 0)
    );
    this.updatePreview();
    this.syncStopInputs();
    this.emitChange();
    return true;
  }

  private removeContainer() {
    this.destroyComponents();
    if (this.container) {
      removeElement(this.container);
    }
    this.container = null;
    this.bar = null;
    this.sizeInput = null;
    this.draggingIndex = -1;
  }

  private destroyComponents() {
    this.selects.forEach((select) => select.destroy());
    this.selects = [];
    this.numbers.forEach((number) => number.destroy());
    this.numbers = [];
    this.checkboxes.forEach((checkbox) => checkbox.destroy());
    this.checkboxes = [];
    this.angleInput = null;
    this.atXInput = null;
    this.atYInput = null;
    this.posInput = null;
    this.pos2Input = null;
  }

  public getGradient(): string {
    return serializeGradient(this.value);
  }

  public getGradientValue(): GradientValue {
    return cloneGradientValue(this.value);
  }

  public getStops(): GradientStop[] {
    return this.value.stops.map((stop) => ({ ...stop }));
  }

  public setGradient(input: string | Partial<GradientValue>) {
    if (isString(input)) {
      const parsed = parseGradient(input);
      if (!parsed) {
        warn(
          `[ewColorPicker warning]: Unable to set invalid gradient "${input}".`
        );
        return;
      }
      this.value = parsed;
    } else if (isObject(input)) {
      const next = cloneGradientValue(this.value);
      if (input.type) next.type = input.type;
      if (isBoolean(input.repeating)) next.repeating = input.repeating;
      if (input.angle) next.angle = { ...input.angle };
      if (input.radialShape) next.radialShape = input.radialShape;
      if (input.radialSize) next.radialSize = input.radialSize;
      if (input.conicFrom) next.conicFrom = { ...input.conicFrom };
      if (input.position) next.position = { ...input.position };
      if (input.interpolation !== undefined) {
        next.interpolation = input.interpolation || null;
      }
      if (Array.isArray(input.stops)) {
        next.stops = input.stops.map((stop) => ({ ...stop }));
      }
      this.value = next;
    }

    this.value.stops = this.normalizeStops(this.value.stops);
    this.selectedIndex = clamp(
      this.selectedIndex,
      0,
      Math.max(this.value.stops.length - 1, 0)
    );
    this.render();
  }

  public setStops(stops: Array<string | GradientStop>) {
    const mapped = (stops || []).map((stop) =>
      isString(stop) ? { color: stop } : { ...stop }
    );
    this.value.stops = this.normalizeStops(mapped);
    this.selectedIndex = clamp(
      this.selectedIndex,
      0,
      Math.max(this.value.stops.length - 1, 0)
    );
    this.updatePreview();
    this.syncStopInputs();
  }

  public addStop(color: string, position?: number): number {
    return this.addStopInternal(color, position);
  }

  public removeStop(index?: number): boolean {
    return this.removeStopInternal(index);
  }

  destroy() {
    this.destroyed = true;
    if (this.ewColorPicker && this.changeBound) {
      this.ewColorPicker.off("change", this.handleCoreChange);
      this.changeBound = false;
    }
    this.dragUnbind?.();
    this.handleDocumentUp();
    this.removeContainer();
  }
}

declare module "@ew-color-picker/core" {
  interface CustomOptions {
    ewColorPickerGradient: GradientPluginOptions;
  }
}
