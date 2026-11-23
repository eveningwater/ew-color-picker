export const _toString = Object.prototype.toString;
export const _arrSlice = Array.prototype.slice;
export const _hasOwn = Object.prototype.hasOwnProperty;

// 面板默认尺寸，用于取不到实际渲染尺寸时兜底
export const DEFAULT_PANEL_WIDTH = 285;
export const DEFAULT_PANEL_HEIGHT = 180;

export type PanelMode = "mini" | "small" | "medium" | "large";

// 各尺寸档位的面板像素尺寸；每个档位在 SCSS 中还会覆盖子元素的 CSS 变量
export const PANEL_MODE_SIZES: Record<PanelMode, { width: number; height: number }> = {
  mini:   { width: 180, height: 140 },
  small:  { width: 220, height: 150 },
  medium: { width: 250, height: 165 },
  large:  { width: 285, height: 180 },
};

export const DEFAULT_PANEL_MODE: PanelMode = "large";