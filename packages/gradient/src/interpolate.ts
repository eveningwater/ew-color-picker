import { colorToRgba, parseRgbaString } from "@ew-color-picker/utils";
import type { GradientStop } from "./types";

export interface Rgba {
  r: number;
  g: number;
  b: number;
  a: number;
}

type HueDirection = "shorter" | "longer" | "increasing" | "decreasing";

interface InterpolationSpec {
  space:
    | "srgb"
    | "srgb-linear"
    | "hsl"
    | "oklab"
    | "oklch"
    | "lab"
    | "lch"
    | "hwb";
  hue: HueDirection;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function parseAngleToken(token: string): number {
  const match = /^([+-]?(?:\d+\.?\d*|\.\d+))(deg|rad|grad|turn)$/i.exec(
    token.trim()
  );
  if (!match) return Number.parseFloat(token) || 0;
  const value = Number.parseFloat(match[1]);
  switch (match[2].toLowerCase()) {
    case "rad":
      return (value * 180) / Math.PI;
    case "grad":
      return value * 0.9;
    case "turn":
      return value * 360;
    default:
      return value;
  }
}

function parseAlpha(token: string | undefined, fallback = 1): number {
  if (token === undefined || token === "") return fallback;
  if (token.endsWith("%")) {
    return clamp(Number.parseFloat(token) / 100, 0, 1);
  }
  return clamp(Number.parseFloat(token), 0, 1);
}

function parseRgbChannel(token: string): number {
  if (token.endsWith("%")) {
    return clamp((Number.parseFloat(token) * 255) / 100, 0, 255);
  }
  return clamp(Number.parseFloat(token), 0, 255);
}

function splitFunctionArgs(body: string): {
  channels: string[];
  alpha?: string;
} {
  const trimmed = body.trim();
  const [main, alpha] = trimmed.split("/");
  const channelPart = main.trim();
  const channels = channelPart.includes(",")
    ? channelPart.split(",").map((item) => item.trim())
    : channelPart.split(/\s+/).filter(Boolean);
  return { channels, alpha: alpha?.trim() };
}

function parseHexColor(input: string): Rgba | null {
  const match = /^#([0-9a-f]{3,8})$/i.exec(input);
  if (!match) return null;
  const hex = match[1];
  const toChannel = (value: string) => parseInt(value, 16);
  if (hex.length === 3 || hex.length === 4) {
    return {
      r: toChannel(hex[0] + hex[0]),
      g: toChannel(hex[1] + hex[1]),
      b: toChannel(hex[2] + hex[2]),
      a: hex.length === 4 ? toChannel(hex[3] + hex[3]) / 255 : 1,
    };
  }
  if (hex.length === 6 || hex.length === 8) {
    return {
      r: toChannel(hex.slice(0, 2)),
      g: toChannel(hex.slice(2, 4)),
      b: toChannel(hex.slice(4, 6)),
      a: hex.length === 8 ? toChannel(hex.slice(6, 8)) / 255 : 1,
    };
  }
  return null;
}

function parseHslColor(input: string): Rgba | null {
  const match = /^hsla?\(([^)]*)\)$/i.exec(input);
  if (!match) return null;
  const { channels, alpha } = splitFunctionArgs(match[1]);
  if (channels.length < 3) return null;

  const hue = parseAngleToken(channels[0]);
  const toPercent = (token: string) =>
    token.endsWith("%")
      ? clamp(Number.parseFloat(token), 0, 100)
      : clamp(Number.parseFloat(token), 0, 100);
  const saturation = toPercent(channels[1]);
  const lightness = toPercent(channels[2]);
  const rgba = hslToRgb(hue, saturation, lightness);
  return { ...rgba, a: parseAlpha(alpha ?? channels[3]) };
}

/**
 * 解析颜色为 RGBA 对象，支持 hex（3/4/6/8 位）、rgb/rgba、hsl/hsla、
 * transparent 以及常见颜色关键字。
 */
export function parseColorToRgba(color: string): Rgba | null {
  if (!color || typeof color !== "string") return null;
  const input = color.trim().toLowerCase();
  if (input === "transparent") return { r: 0, g: 0, b: 0, a: 0 };

  const hex = parseHexColor(input);
  if (hex) return hex;

  const rgbMatch = /^rgba?\(([^)]*)\)$/i.exec(input);
  if (rgbMatch) {
    const { channels, alpha } = splitFunctionArgs(rgbMatch[1]);
    if (channels.length < 3) return null;
    return {
      r: parseRgbChannel(channels[0]),
      g: parseRgbChannel(channels[1]),
      b: parseRgbChannel(channels[2]),
      a: parseAlpha(alpha ?? channels[3]),
    };
  }

  const hsl = parseHslColor(input);
  if (hsl) return hsl;

  const converted = colorToRgba(input);
  if (converted) {
    const parsed = parseRgbaString(converted);
    if (parsed) {
      return {
        r: parsed.r,
        g: parsed.g,
        b: parsed.b,
        a: clamp(parsed.a, 0, 1),
      };
    }
  }
  return null;
}

function hslToRgb(h: number, s: number, l: number): Rgba {
  const saturation = s / 100;
  const lightness = l / 100;
  const normalizedHue = (((h % 360) + 360) % 360) / 360;

  if (saturation === 0) {
    const value = Math.round(lightness * 255);
    return { r: value, g: value, b: value, a: 1 };
  }

  const helper = (p: number, q: number, t: number) => {
    let value = t;
    if (value < 0) value += 1;
    if (value > 1) value -= 1;
    if (value < 1 / 6) return p + (q - p) * 6 * value;
    if (value < 1 / 2) return q;
    if (value < 2 / 3) return p + (q - p) * 6 * (2 / 3 - value);
    return p;
  };

  const q =
    lightness >= 0.5
      ? lightness + saturation - lightness * saturation
      : lightness * (1 + saturation);
  const p = 2 * lightness - q;

  const r = helper(p, q, normalizedHue + 1 / 3);
  const g = helper(p, q, normalizedHue);
  const b = helper(p, q, normalizedHue - 1 / 3);

  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255),
    a: 1,
  };
}

function rgbToHsl(rgba: Rgba): { h: number; s: number; l: number } {
  const r = rgba.r / 255;
  const g = rgba.g / 255;
  const b = rgba.b / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;

  if (max === min) return { h: 0, s: 0, l: l * 100 };

  const diff = max - min;
  const s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min);

  let h = 0;
  switch (max) {
    case r:
      h = (g - b) / diff + (g < b ? 6 : 0);
      break;
    case g:
      h = (b - r) / diff + 2;
      break;
    default:
      h = (r - g) / diff + 4;
      break;
  }

  return { h: h * 60, s: s * 100, l: l * 100 };
}

function srgbToLinear(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045
    ? value / 12.92
    : ((value + 0.055) / 1.055) ** 2.4;
}

function linearToSrgb(channel: number): number {
  const value =
    channel <= 0.00312989
      ? 12.92 * channel
      : 1.055 * channel ** (1 / 2.4) - 0.055;
  return clamp(Math.round(value * 255), 0, 255);
}

export function rgbToOklab(rgba: Rgba): { l: number; a: number; b: number } {
  const r = srgbToLinear(rgba.r);
  const g = srgbToLinear(rgba.g);
  const b = srgbToLinear(rgba.b);

  const l = 0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b;
  const m = 0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b;
  const s = 0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b;

  const lRoot = Math.cbrt(l);
  const mRoot = Math.cbrt(m);
  const sRoot = Math.cbrt(s);

  return {
    l: 0.2104542553 * lRoot + 0.793617785 * mRoot - 0.0040720468 * sRoot,
    a: 1.9779984951 * lRoot - 2.428592205 * mRoot + 0.4505937099 * sRoot,
    b: 0.0259040371 * lRoot + 0.7827717662 * mRoot - 0.808675766 * sRoot,
  };
}

export function oklabToRgb(lab: {
  l: number;
  a: number;
  b: number;
}): Rgba {
  const lRoot = lab.l + 0.3963377774 * lab.a + 0.2158037573 * lab.b;
  const mRoot = lab.l - 0.1055613458 * lab.a - 0.0638541728 * lab.b;
  const sRoot = lab.l - 0.0894841775 * lab.a - 1.291485548 * lab.b;

  const l = lRoot ** 3;
  const m = mRoot ** 3;
  const s = sRoot ** 3;

  const r = 4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s;
  const g = -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s;
  const b = -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s;

  return {
    r: linearToSrgb(r),
    g: linearToSrgb(g),
    b: linearToSrgb(b),
    a: 1,
  };
}

function rgbToOklch(rgba: Rgba): { l: number; c: number; h: number } {
  const lab = rgbToOklab(rgba);
  const c = Math.sqrt(lab.a * lab.a + lab.b * lab.b);
  let h = (Math.atan2(lab.b, lab.a) * 180) / Math.PI;
  if (h < 0) h += 360;
  return { l: lab.l, c, h: c < 0.0001 ? 0 : h };
}

function oklchToRgb(lch: { l: number; c: number; h: number }): Rgba {
  const hue = (lch.h * Math.PI) / 180;
  return oklabToRgb({
    l: lch.l,
    a: lch.c * Math.cos(hue),
    b: lch.c * Math.sin(hue),
  });
}

function normalizeHue(hue: number): number {
  return ((hue % 360) + 360) % 360;
}

function interpolateHue(
  h1: number,
  h2: number,
  ratio: number,
  direction: HueDirection
): number {
  let start = normalizeHue(h1);
  let end = normalizeHue(h2);
  let diff = end - start;

  switch (direction) {
    case "longer": {
      if (diff > 0 && diff < 180) diff -= 360;
      if (diff < 0 && diff > -180) diff += 360;
      break;
    }
    case "increasing": {
      if (diff < 0) diff += 360;
      break;
    }
    case "decreasing": {
      if (diff > 0) diff -= 360;
      break;
    }
    default: {
      if (diff > 180) diff -= 360;
      if (diff < -180) diff += 360;
      break;
    }
  }

  return normalizeHue(start + diff * ratio);
}

function parseInterpolation(
  interpolation?: string | null
): InterpolationSpec {
  const spec: InterpolationSpec = { space: "srgb", hue: "shorter" };
  if (!interpolation) return spec;

  const tokens = interpolation.trim().toLowerCase().split(/\s+/);
  const space = tokens[0];
  const supported = [
    "srgb",
    "srgb-linear",
    "hsl",
    "oklab",
    "oklch",
    "lab",
    "lch",
    "hwb",
  ];
  if (supported.includes(space)) {
    spec.space = space as InterpolationSpec["space"];
  }
  const hueIndex = tokens.findIndex((token) => token === "hue");
  if (hueIndex > 0) {
    const method = tokens[hueIndex - 1];
    if (
      method === "shorter" ||
      method === "longer" ||
      method === "increasing" ||
      method === "decreasing"
    ) {
      spec.hue = method;
    }
  }
  return spec;
}

interface PositionedStop {
  color: Rgba;
  position: number;
}

function getStopColors(stops: GradientStop[]): GradientStop[] {
  const expanded: GradientStop[] = [];
  stops.forEach((stop) => {
    if (stop.position2 !== undefined) {
      expanded.push({ color: stop.color, position: stop.position ?? 0 });
      expanded.push({ color: stop.color, position: stop.position2 });
    } else {
      expanded.push({ ...stop });
    }
  });
  return expanded;
}

/**
 * 补全色标位置：首个缺省为 0%，末个缺省为 100%，
 * 中间未指定的位置在相邻已知位置之间均匀分布。
 */
export function resolveGradientPositions(stops: GradientStop[]): number[] {
  const positions: Array<number | undefined> = (stops || []).map(
    (stop) => stop.position
  );
  if (positions.length === 0) return [];

  if (positions[0] === undefined) positions[0] = 0;
  if (positions[positions.length - 1] === undefined) {
    positions[positions.length - 1] = 100;
  }

  let index = 0;
  while (index < positions.length) {
    if (positions[index] !== undefined) {
      index += 1;
      continue;
    }
    let next = index;
    while (next < positions.length && positions[next] === undefined) {
      next += 1;
    }
    const start = positions[index - 1] as number;
    const end = positions[next] as number;
    const count = next - (index - 1);
    for (let offset = 0; offset < next - index; offset += 1) {
      positions[index + offset] = start + ((end - start) * (offset + 1)) / count;
    }
    index = next;
  }

  return positions.map((position) => clamp(position as number, 0, 100));
}

function resolveStopPositions(stops: GradientStop[]): PositionedStop[] {
  const positions = resolveGradientPositions(stops);

  const result: PositionedStop[] = [];
  stops.forEach((stop, stopIndex) => {
    const color = parseColorToRgba(stop.color);
    if (!color) return;
    result.push({
      color,
      position: clamp(positions[stopIndex] as number, 0, 100),
    });
  });
  return result.sort((a, b) => a.position - b.position);
}

function formatChannel(value: number): number {
  return Math.round(clamp(value, 0, 255));
}

/**
 * 计算渐变条上某个百分比位置的颜色。
 * 支持 sRGB / sRGB-linear / HSL / OKLab / OKLCH 插值，以及四种 hue 方向。
 * 其余色彩空间（lab/lch/hwb）回退为 sRGB 插值。
 */
export function interpolateStops(
  stops: GradientStop[],
  position: number,
  interpolation?: string | null
): string {
  const positioned = resolveStopPositions(getStopColors(stops || []));
  if (positioned.length === 0) return "";

  const target = clamp(position, 0, 100);
  if (target <= positioned[0].position) {
    return formatRgba(positioned[0].color);
  }
  const last = positioned[positioned.length - 1];
  if (target >= last.position) return formatRgba(last.color);

  let left = positioned[0];
  let right = last;
  for (let index = 0; index < positioned.length - 1; index += 1) {
    const current = positioned[index];
    const next = positioned[index + 1];
    if (target >= current.position && target <= next.position) {
      left = current;
      right = next;
      break;
    }
  }

  if (right.position === left.position) {
    return formatRgba(right.color);
  }

  const ratio =
    (target - left.position) / (right.position - left.position);
  const spec = parseInterpolation(interpolation);
  const alpha =
    left.color.a + (right.color.a - left.color.a) * ratio;
  const mixed = mixColor(left.color, right.color, ratio, spec);
  return formatRgba({ ...mixed, a: alpha });
}

function mixColor(
  from: Rgba,
  to: Rgba,
  ratio: number,
  spec: InterpolationSpec
): Rgba {
  switch (spec.space) {
    case "hsl": {
      const start = rgbToHsl(from);
      const end = rgbToHsl(to);
      const hue = interpolateHue(start.h, end.h, ratio, spec.hue);
      return {
        ...hslToRgb(
          hue,
          start.s + (end.s - start.s) * ratio,
          start.l + (end.l - start.l) * ratio
        ),
        a: 1,
      };
    }
    case "oklab": {
      const start = rgbToOklab(from);
      const end = rgbToOklab(to);
      return {
        ...oklabToRgb({
          l: start.l + (end.l - start.l) * ratio,
          a: start.a + (end.a - start.a) * ratio,
          b: start.b + (end.b - start.b) * ratio,
        }),
        a: 1,
      };
    }
    case "oklch": {
      const start = rgbToOklch(from);
      const end = rgbToOklch(to);
      const hue = interpolateHue(start.h, end.h, ratio, spec.hue);
      return {
        ...oklchToRgb({
          l: start.l + (end.l - start.l) * ratio,
          c: start.c + (end.c - start.c) * ratio,
          h: hue,
        }),
        a: 1,
      };
    }
    case "srgb-linear": {
      const channels: Array<"r" | "g" | "b"> = ["r", "g", "b"];
      const result = { r: 0, g: 0, b: 0, a: 1 };
      channels.forEach((channel) => {
        const start = srgbToLinear(from[channel]);
        const end = srgbToLinear(to[channel]);
        result[channel] = linearToSrgb(start + (end - start) * ratio);
      });
      return result;
    }
    default:
      return {
        r: formatChannel(from.r + (to.r - from.r) * ratio),
        g: formatChannel(from.g + (to.g - from.g) * ratio),
        b: formatChannel(from.b + (to.b - from.b) * ratio),
        a: 1,
      };
  }
}

function formatRgba(rgba: Rgba): string {
  const r = Math.round(clamp(rgba.r, 0, 255));
  const g = Math.round(clamp(rgba.g, 0, 255));
  const b = Math.round(clamp(rgba.b, 0, 255));
  const a = Number(clamp(rgba.a, 0, 1).toFixed(2));
  return `rgba(${r}, ${g}, ${b}, ${a})`;
}
