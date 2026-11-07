import { warn } from "@ew-color-picker/utils";
import {
  cloneGradientValue,
  createGradientValue,
  type AngleUnit,
  type GradientAngle,
  type GradientPosition,
  type GradientStop,
  type GradientType,
  type GradientValue,
} from "./types";
import { parseColorToRgba } from "./interpolate";

const GRADIENT_PREFIX =
  /^(repeating-)?(linear|radial|conic)-gradient\s*\(([\s\S]*)\)\s*$/i;
const ANGLE_TOKEN =
  /^([+-]?(?:\d+\.?\d*|\.\d+))(deg|rad|grad|turn)$/i;
const PERCENT_TOKEN = /^([+-]?(?:\d+\.?\d*|\.\d+))%$/;
const LENGTH_TOKEN =
  /^[+-]?(?:\d+\.?\d*|\.\d+)(px|em|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|ch|ex|q)$/i;

const SHAPE_KEYWORDS = ["circle", "ellipse"];
const SIZE_KEYWORDS = [
  "closest-side",
  "closest-corner",
  "farthest-side",
  "farthest-corner",
];
const SIDE_ANGLES: Record<string, number> = {
  "top": 0,
  "right": 90,
  "bottom": 180,
  "left": 270,
  "top right": 45,
  "right top": 45,
  "bottom right": 135,
  "right bottom": 135,
  "bottom left": 225,
  "left bottom": 225,
  "top left": 315,
  "left top": 315,
};

function warnInvalid(reason: string) {
  warn(`[ewColorPicker warning]: Invalid gradient syntax: ${reason}`);
}

/**
 * 按括号深度切分顶层参数，避免把 rgb()/hsl() 内部的逗号切开。
 */
export function splitTopLevel(input: string, delimiter = ","): string[] {
  const result: string[] = [];
  let depth = 0;
  let current = "";
  for (const char of input) {
    if (char === "(") depth += 1;
    if (char === ")") depth = Math.max(0, depth - 1);
    if (char === delimiter && depth === 0) {
      result.push(current);
      current = "";
      continue;
    }
    current += char;
  }
  result.push(current);
  return result.map((item) => item.trim());
}

function parseAngle(token: string): GradientAngle | null {
  const trimmed = token.trim();
  // CSS 允许零角度省略单位
  if (/^[+-]?0(\.0+)?$/.test(trimmed)) {
    return { value: 0, unit: "deg" };
  }
  const match = ANGLE_TOKEN.exec(trimmed);
  if (!match) return null;
  return {
    value: Number.parseFloat(match[1]),
    unit: match[2].toLowerCase() as AngleUnit,
  };
}

function parsePercent(token: string): number | null {
  const match = PERCENT_TOKEN.exec(token.trim());
  if (match) return Number.parseFloat(match[1]);
  if (/^[+-]?0$/.test(token.trim())) return 0;
  return null;
}

function keywordPositionValue(keyword: string, axis: "x" | "y"): number {
  if (keyword === "center") return 50;
  if (axis === "x") {
    if (keyword === "left") return 0;
    if (keyword === "right") return 100;
  }
  if (axis === "y") {
    if (keyword === "top") return 0;
    if (keyword === "bottom") return 100;
  }
  return 50;
}

function parsePosition(tokens: string[]): GradientPosition | null {
  if (tokens.length === 0) return null;
  if (tokens.length > 2) return null;

  if (tokens.length === 1) {
    const token = tokens[0].trim().toLowerCase();
    if (LENGTH_TOKEN.test(token)) return null;
    if (token === "left" || token === "right" || token === "center") {
      return { x: keywordPositionValue(token, "x"), y: 50 };
    }
    if (token === "top" || token === "bottom") {
      return { x: 50, y: keywordPositionValue(token, "y") };
    }
    const percent = parsePercent(token);
    return percent === null ? null : { x: percent, y: 50 };
  }

  const [xToken, yToken] = tokens.map((token) => token.trim().toLowerCase());
  if (LENGTH_TOKEN.test(xToken) || LENGTH_TOKEN.test(yToken)) return null;

  let x: number | null = null;
  if (xToken === "left" || xToken === "right" || xToken === "center") {
    x = keywordPositionValue(xToken, "x");
  } else {
    x = parsePercent(xToken);
  }

  let y: number | null = null;
  if (yToken === "top" || yToken === "bottom" || yToken === "center") {
    y = keywordPositionValue(yToken, "y");
  } else {
    y = parsePercent(yToken);
  }

  if (x === null || y === null) return null;
  return { x, y };
}

function isSupportedStopColor(color: string): boolean {
  return parseColorToRgba(color) !== null;
}

function clampPercent(value: number): number {
  return Math.min(Math.max(value, 0), 100);
}

function parseStop(token: string): GradientStop | null {
  let rest = token.trim();
  if (!rest) return null;

  const positions: number[] = [];
  while (positions.length < 2) {
    const match = /(?:^|\s)([+-]?(?:\d+\.?\d*|\.\d+))%\s*$/.exec(rest);
    if (!match) break;
    positions.unshift(clampPercent(Number.parseFloat(match[1])));
    rest = rest.slice(0, match.index).trim();
  }

  // 渐变编辑器统一使用百分比，遇到 px 等长度位置直接拒绝
  if (/\s[+-]?(?:\d+\.?\d*|\.\d+)(px|em|rem|vw|vh|vmin|vmax|cm|mm|in|pt|pc|ch|ex|q)\s*$/i.test(rest)) {
    warnInvalid(`stop position must be a percentage, got "${rest}"`);
    return null;
  }

  if (/\s[+-]?((?:\d+\.?\d*)|(?:\.\d+))%\s*$/.test(rest)) {
    warnInvalid(`stop has more than two positions: "${token}"`);
    return null;
  }

  const color = rest.trim();
  if (!color || !isSupportedStopColor(color)) {
    warnInvalid(`unsupported stop color "${color}"`);
    return null;
  }

  const stop: GradientStop = { color };
  if (positions.length > 0) stop.position = positions[0];
  if (positions.length > 1) stop.position2 = positions[1];
  return stop;
}

function extractInterpolation(firstArg: string): {
  interpolation: string | null;
  remaining: string;
} {
  const match =
    /\bin\s+((?:srgb(?:-linear)?|lab|oklab|lch|oklch|hsl|hwb)(?:\s+(?:shorter|longer|increasing|decreasing)\s+hue)?)/i.exec(
      firstArg
    );
  if (!match) {
    return { interpolation: null, remaining: firstArg.trim() };
  }
  const interpolation = match[1].toLowerCase().replace(/\s+/g, " ");
  const remaining = (
    firstArg.slice(0, match.index) + firstArg.slice(match.index + match[0].length)
  ).trim();
  return { interpolation, remaining };
}

function parseLinearConfig(config: string): Partial<GradientValue> | null {
  if (!config) return {};
  const lower = config.trim().toLowerCase();

  if (lower.startsWith("to ")) {
    const side = lower.slice(3).trim();
    const angle = SIDE_ANGLES[side];
    if (angle === undefined) return null;
    return { angle: { value: angle, unit: "deg" } };
  }

  const angle = parseAngle(lower);
  if (!angle) return null;
  return { angle };
}

function parseRadialConfig(config: string): Partial<GradientValue> | null {
  if (!config) return {};
  const tokens = config.trim().split(/\s+/).filter(Boolean);
  const atIndex = tokens.findIndex((token) => token.toLowerCase() === "at");

  let sizeTokens = tokens;
  let positionTokens: string[] = [];
  if (atIndex >= 0) {
    sizeTokens = tokens.slice(0, atIndex);
    positionTokens = tokens.slice(atIndex + 1);
  }

  if (positionTokens.length > 0) {
    const position = parsePosition(positionTokens);
    if (!position) return null;
    const rest: Partial<GradientValue> = { position };
    if (sizeTokens.length > 0) {
      const parsed = parseRadialSize(sizeTokens);
      if (!parsed) return null;
      Object.assign(rest, parsed);
    }
    return rest;
  }

  return parseRadialSize(sizeTokens);
}

function parseRadialSize(tokens: string[]): Partial<GradientValue> | null {
  if (tokens.length === 0) return {};
  const result: Partial<GradientValue> = {};
  let index = 0;

  const first = tokens[0].toLowerCase();
  if (SHAPE_KEYWORDS.includes(first)) {
    result.radialShape = first as "circle" | "ellipse";
    index = 1;
  }

  const sizeTokens = tokens.slice(index);
  if (sizeTokens.length === 0) {
    if (!result.radialShape) return null;
    return result;
  }

  if (
    sizeTokens.length === 1 &&
    SIZE_KEYWORDS.includes(sizeTokens[0].toLowerCase())
  ) {
    result.radialSize = sizeTokens[0].toLowerCase();
    if (!result.radialShape) result.radialShape = "ellipse";
    return result;
  }

  const validLengths = sizeTokens.every(
    (token) =>
      PERCENT_TOKEN.test(token) || LENGTH_TOKEN.test(token)
  );
  if (!validLengths || sizeTokens.length > 2) return null;

  result.radialSize = sizeTokens.join(" ");
  if (!result.radialShape) result.radialShape = "ellipse";
  return result;
}

function parseConicConfig(config: string): Partial<GradientValue> | null {
  if (!config) return {};
  const tokens = config.trim().split(/\s+/).filter(Boolean);
  const result: Partial<GradientValue> = {};
  let index = 0;

  if (tokens[index]?.toLowerCase() === "from") {
    const angle = parseAngle(tokens[index + 1] || "");
    if (!angle) return null;
    result.conicFrom = angle;
    index += 2;
  }

  if (tokens[index]?.toLowerCase() === "at") {
    const positionTokens = tokens.slice(index + 1);
    const position = parsePosition(positionTokens);
    if (!position) return null;
    result.position = position;
    index = tokens.length;
  }

  if (index < tokens.length) return null;
  return result;
}

/**
 * 解析 CSS 渐变字符串为结构化数据；无法识别时返回 null 并输出警告。
 */
export function parseGradient(css: string): GradientValue | null {
  if (typeof css !== "string" || !css.trim()) return null;

  const match = GRADIENT_PREFIX.exec(css.trim());
  if (!match) {
    warnInvalid(`not a supported gradient: "${css}"`);
    return null;
  }

  const repeating = Boolean(match[1]);
  const type = match[2].toLowerCase() as GradientType;
  const value = createGradientValue(type);
  value.repeating = repeating;

  const args = splitTopLevel(match[3]).filter(Boolean);
  if (args.length === 0) return null;

  const firstArg = args[0];
  const { interpolation, remaining } = extractInterpolation(firstArg);
  value.interpolation = interpolation;

  // 首个参数只有在能识别为配置（角度/形状/尺寸/位置/插值）时才消费，
  // 否则它本身就是第一个色标，例如 linear-gradient(red, blue)
  let consumedFirstArg = interpolation !== null;
  let config: Partial<GradientValue> | null = null;

  if (remaining !== "") {
    if (type === "linear") {
      config = parseLinearConfig(remaining);
    } else if (type === "radial") {
      config = parseRadialConfig(remaining);
    } else {
      config = parseConicConfig(remaining);
    }
  }

  if (config) {
    consumedFirstArg = true;
    Object.assign(value, config);
  }

  const stopArgs = consumedFirstArg ? args.slice(1) : args;
  const stops: GradientStop[] = [];
  for (const token of stopArgs) {
    const stop = parseStop(token);
    if (!stop) return null;
    stops.push(stop);
  }

  if (stops.length < 2) {
    warnInvalid("gradient requires at least two color stops");
    return null;
  }

  value.stops = stops;
  return value;
}

function formatNumber(value: number): string {
  return String(Number(value.toFixed(3)));
}

function formatAngle(angle: GradientAngle): string {
  const unit = angle.unit || "deg";
  return `${formatNumber(angle.value)}${unit}`;
}

function formatStop(stop: GradientStop): string {
  const parts = [stop.color];
  if (stop.position !== undefined) {
    parts.push(`${formatNumber(clampPercent(stop.position))}%`);
  }
  if (stop.position2 !== undefined) {
    parts.push(`${formatNumber(clampPercent(stop.position2))}%`);
  }
  return parts.join(" ");
}

/**
 * 序列化结构化渐变数据为 CSS 字符串，保证 parse -> serialize -> parse 稳定。
 */
export function serializeGradient(value: GradientValue): string {
  const data = cloneGradientValue(value);
  const prefix = `${data.repeating ? "repeating-" : ""}${data.type}-gradient`;
  const interpolation = data.interpolation
    ? ` in ${data.interpolation}`
    : "";
  const stops = data.stops.map(formatStop).join(", ");
  const position = `${formatNumber(clampPercent(data.position.x))}% ${formatNumber(
    clampPercent(data.position.y)
  )}%`;

  if (data.type === "linear") {
    return `${prefix}(${formatAngle(data.angle)}${interpolation}, ${stops})`;
  }

  if (data.type === "radial") {
    const shape = data.radialShape || "ellipse";
    const size = data.radialSize || "farthest-corner";
    return `${prefix}(${shape} ${size} at ${position}${interpolation}, ${stops})`;
  }

  return `${prefix}(from ${formatAngle(data.conicFrom)} at ${position}${interpolation}, ${stops})`;
}
