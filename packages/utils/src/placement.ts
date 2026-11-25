// 浮层方位词表，供 tooltip / panel 等需要 12 方位定位的模块复用

// 主方向
export type PlacementSide = "top" | "bottom" | "left" | "right";

// 对齐方式，默认 center
export type PlacementAlign = "start" | "center" | "end";

// 12 种方位，与 el-tooltip 的 placement 保持一致
export type Placement =
  | "top"
  | "top-start"
  | "top-end"
  | "bottom"
  | "bottom-start"
  | "bottom-end"
  | "left"
  | "left-start"
  | "left-end"
  | "right"
  | "right-start"
  | "right-end";

export const PLACEMENTS: Placement[] = [
  "top",
  "top-start",
  "top-end",
  "bottom",
  "bottom-start",
  "bottom-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
];

export function isPlacement(value: unknown): value is Placement {
  return PLACEMENTS.indexOf(value as Placement) > -1;
}

export function parsePlacement(placement: Placement): {
  side: PlacementSide;
  align: PlacementAlign;
} {
  const parts = placement.split("-");
  const side = parts[0] as PlacementSide;
  const align = (parts[1] || "center") as PlacementAlign;
  return { side, align };
}
