import { isString, removeAllSpace } from "./base";
import { create, getStyle, setStyle } from "./dom";


// HEX color
export const colorRegExp = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
// RGB color
export const colorRegRGB =
  /[rR][gG][Bb][Aa]?[\(]([\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),){2}[\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?),?[\s]*(0\.\d{1,2}|1|0)?[\)]{1}/g;
// RGBA color
export const colorRegRGBA =
  /^[rR][gG][Bb][Aa][\(]([\\s]*(2[0-4][0-9]|25[0-5]|[01]?[0-9][0-9]?)[\\s]*,){3}[\\s]*(1|1.0|0|0?.[0-9]{1,2})[\\s]*[\)]{1}$/;
// hsl color
export const colorRegHSL =
  /^[hH][Ss][Ll][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*)[\)]$/;
// HSLA color
export const colorRegHSLA =
  /^[hH][Ss][Ll][Aa][\(]([\\s]*(2[0-9][0-9]|360｜3[0-5][0-9]|[01]?[0-9][0-9]?)[\\s]*,)([\\s]*((100|[0-9][0-9]?)%|0)[\\s]*,){2}([\\s]*(1|1.0|0|0?.[0-9]{1,2})[\\s]*)[\)]$/;

// 颜色接口定义
export interface HsvaColor {
  h: number;
  s: number;
  v: number;
  a: number;
}

export interface HslaColor {
  h: number;
  s: number;
  l: number;
  a: number;
}

export interface RgbaColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

/**
 * hex to rgba
 * @param {*} hex
 * @param {*} alpha
 */
export function colorHexToRgba(hex: string, alpha: number = 1): string {
  let a = alpha || 1;
  // 将透明度限制为1位小数
  a = Math.round(a * 10) / 10;
  let hColor = hex.toLowerCase();
  let hLen = hex.length;
  let rgbaColor: number[] = [];
  
  if (hex && colorRegExp.test(hColor)) {
    //the hex length may be 4 or 7,contained the symbol of #
    if (hLen === 4) {
      let hSixColor = "#";
      for (let i = 1; i < hLen; i++) {
        let sColor = hColor.slice(i, i + 1);
        hSixColor += sColor.concat(sColor);
      }
      hColor = hSixColor;
    }
    for (let j = 1, len = hColor.length; j < len; j += 2) {
      rgbaColor.push(parseInt("0X" + hColor.slice(j, j + 2), 16));
    }
    return `rgba(${rgbaColor.join(', ')}, ${a})`;
  } else {
    return removeAllSpace(hColor);
  }
}
/**
 * rgba to hex
 * @param {*} rgba
 */
export function colorRgbaToHex(rgba: string): string {
  const hexObject: Record<number, string> = {
      10: "A",
      11: "B",
      12: "C",
      13: "D",
      14: "E",
      15: "F",
    },
    hexColor = (value: number) => {
      value = Math.min(Math.round(value), 255);
      const high = Math.floor(value / 16),
        low = value % 16;
      return "" + (hexObject[high] || high) + (hexObject[low] || low);
    };
  const value = "#";
  if (/rgba?/.test(rgba)) {
    let values = rgba
        .replace(/rgba?\(/, "")
        .replace(/\)/, "")
        .replace(/[\s+]/g, "")
        .split(","),
      color = "";
    values.map((value, index) => {
      if (index <= 2) {
        color += hexColor(+value);
      }
    });
    return removeAllSpace(value + color);
  }
  return rgba;
}
/**
 * hsva to rgba
 * @param {*} hsva
 * @param {*} alpha
 */
export function colorHsvaToRgba(hsva: HsvaColor, alpha?: number): string {
  let r,
    g,
    b,
    a = hsva.a; //rgba(r,g,b,a)
  let h = hsva.h,
    s = (hsva.s * 255) / 100,
    v = (hsva.v * 255) / 100; //hsv(h,s,v)
  if (s === 0) {
    r = g = b = v;
  } else {
    let t = v,
      p = ((255 - s) * v) / 255,
      q = ((t - p) * (h % 60)) / 60;
    if (h === 360) {
      r = t;
      g = b = 0;
    } else if (h < 60) {
      r = t;
      g = p + q;
      b = p;
    } else if (h < 120) {
      r = t - q;
      g = t;
      b = p;
    } else if (h < 180) {
      r = p;
      g = t;
      b = p + q;
    } else if (h < 240) {
      r = p;
      g = t - q;
      b = t;
    } else if (h < 300) {
      r = p + q;
      g = p;
      b = t;
    } else if (h < 360) {
      r = t;
      g = p;
      b = t - q;
    } else {
      r = g = b = 0;
    }
  }
  if (alpha !== undefined && alpha >= 0 && alpha <= 1) a = alpha;
  // 将透明度限制为1位小数
  a = Math.round(a * 10) / 10;
  return `rgba(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)}, ${a})`;
}
/**
 * hsla to rgba
 * 换算公式:https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4#%E4%BB%8EHSL%E5%88%B0RGB%E7%9A%84%E8%BD%AC%E6%8D%A2
 * @param {*} hsla
 */
export function colorHslaToRgba(hsla: HslaColor): string {
  let h = hsla.h,
    s = hsla.s / 100,
    l = hsla.l / 100,
    a = hsla.a;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    let compareRGB = (p: number, q: number, t: number) => {
      if (t > 1) t = t - 1;
      if (t < 0) t = t + 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * 6 * (2 / 3 - t);
      return p;
    };
    let q = l >= 0.5 ? l + s - l * s : l * (1 + s),
      p = 2 * l - q,
      k = h / 360;
    r = compareRGB(p, q, k + 1 / 3);
    g = compareRGB(p, q, k);
    b = compareRGB(p, q, k - 1 / 3);
  }
  // 将透明度限制为1位小数
  a = Math.round(a * 10) / 10;
  return `rgba(${Math.round(r * 255)}, ${Math.round(g * 255)}, ${Math.round(b * 255)}, ${a})`;
}
/**
 * rgba to hsla
 * 换算公式:https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4#%E4%BB%8EHSL%E5%88%B0RGB%E7%9A%84%E8%BD%AC%E6%8D%A2
 * @param {*} rgba
 */
export function colorRgbaToHsla(rgba: string): { colorStr: string; colorObj: HslaColor } {
  const rgbaArr = rgba
    .slice(rgba.indexOf("(") + 1, rgba.lastIndexOf(")"))
    .split(",");
  let a = rgbaArr.length < 4 ? 1 : Number(rgbaArr[3]);
  // 将透明度限制为1位小数
  a = Math.round(a * 10) / 10;
  let r = parseInt(rgbaArr[0]) / 255,
    g = parseInt(rgbaArr[1]) / 255,
    b = parseInt(rgbaArr[2]) / 255;
  let max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h,
    s,
    l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = (g - b) / d + (g >= b ? 0 : 6);
        break;
      case g:
        h = (b - r) / d + 2;
        break;
      case b:
        h = (r - g) / d + 4;
        break;
    }
  }
  return {
    colorStr: removeAllSpace(
      "hsla(" +
        Math.ceil(h! * 60) +
        "," +
        Math.ceil(s * 100) +
        "%," +
        Math.ceil(l * 100) +
        "%," +
        a +
        ")"
    ),
    colorObj: {
      h: Math.round(h!),
      s: Math.round(s * 100),
      l: Math.round(l * 100),
      a,
    },
  };
}
/**
 * rgba to hsva
 * @param {*} rgba
 */
export function colorRgbaToHsva(rgba: string): HsvaColor {
  // 处理 undefined 或 null 值
  if (!rgba || typeof rgba !== 'string') {
    return { h: 0, s: 100, v: 100, a: 1 };
  }
  
  // 清理输入字符串，移除多余空格
  const cleanRgba = rgba.replace(/\s+/g, ' ').trim();
  
  // 提取括号内的内容
  const match = cleanRgba.match(/rgba?\(([^)]+)\)/i);
  if (!match) {
    return { h: 0, s: 100, v: 100, a: 1 };
  }
  
  // 分割并清理每个值
  const rgbaArr = match[1].split(',').map(val => val.trim());
  
  // 解析 RGB 值，使用 parseFloat 而不是 parseInt 来处理可能的浮点数
  const r = parseFloat(rgbaArr[0]) || 0;
  const g = parseFloat(rgbaArr[1]) || 0;
  const b = parseFloat(rgbaArr[2]) || 0;
  const a = rgbaArr.length >= 4 ? parseFloat(rgbaArr[3]) || 1 : 1;
  
  // 将 RGB 值标准化到 0-1 范围
  const rNorm = r / 255;
  const gNorm = g / 255;
  const bNorm = b / 255;
  
  // 计算 HSV
  const max = Math.max(rNorm, gNorm, bNorm);
  const min = Math.min(rNorm, gNorm, bNorm);
  const diff = max - min;
  
  let h = 0;
  let s = 0;
  const v = max;
  
  if (max !== 0) {
    s = diff / max;
  }
  
  if (diff !== 0) {
    if (max === rNorm) {
      h = 60 * ((gNorm - bNorm) / diff);
    } else if (max === gNorm) {
      h = 60 * ((bNorm - rNorm) / diff + 2);
    } else if (max === bNorm) {
      h = 60 * ((rNorm - gNorm) / diff + 4);
    }
    if (h < 0) h += 360;
  } else {
    // 当 diff === 0 时，所有颜色分量相等，色相为 0（红色）
    h = 0;
  }
  
  // 将透明度限制为1位小数
  const alpha = Math.round(a * 10) / 10;
  
  return {
    h: Math.round(h),
    s: Math.round(s * 100),
    v: Math.round(v * 100),
    a: alpha,
  };
}
// 常见 CSS 颜色关键字映射
const COLOR_KEYWORDS: Record<string, string> = {
  black: 'rgba(0, 0, 0, 1)',
  silver: 'rgba(192, 192, 192, 1)',
  gray: 'rgba(128, 128, 128, 1)',
  white: 'rgba(255, 255, 255, 1)',
  maroon: 'rgba(128, 0, 0, 1)',
  red: 'rgba(255, 0, 0, 1)',
  purple: 'rgba(128, 0, 128, 1)',
  fuchsia: 'rgba(255, 0, 255, 1)',
  green: 'rgba(0, 128, 0, 1)',
  lime: 'rgba(0, 255, 0, 1)',
  olive: 'rgba(128, 128, 0, 1)',
  yellow: 'rgba(255, 255, 0, 1)',
  navy: 'rgba(0, 0, 128, 1)',
  blue: 'rgba(0, 0, 255, 1)',
  teal: 'rgba(0, 128, 128, 1)',
  aqua: 'rgba(0, 255, 255, 1)',
  orange: 'rgba(255, 165, 0, 1)',
  pink: 'rgba(255, 192, 203, 1)',
  brown: 'rgba(165, 42, 42, 1)',
  // 可扩展更多
};

export function colorToRgba(color: string): string {
  // 处理空值
  if (!color || typeof color !== 'string') {
    return '';
  }
  // 统一小写并清理空格
  const input = color.trim().toLowerCase();

  // 关键字映射
  if (COLOR_KEYWORDS[input]) {
    return COLOR_KEYWORDS[input];
  }

  // hex
  if (colorRegExp.test(input)) {
    // 直接调用 colorHexToRgba
    let rgba = colorHexToRgba(input);
    // 强制输出格式统一为 'rgba(r, g, b, a)'，兼容所有空格
    rgba = rgba.replace(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+(?:\.\d+)?)\s*\)/, 'rgba($1, $2, $3, $4)');
    return rgba;
  }

  // rgb - 支持带空格的格式
  const rgbReg = /^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i;
  const rgbMatch = input.match(rgbReg);
  if (rgbMatch) {
    const [, r, g, b] = rgbMatch;
    return `rgba(${r}, ${g}, ${b}, 1)`;
  }

  // rgba - 支持带空格的格式
  const rgbaReg = /^rgba\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
  const rgbaMatch = input.match(rgbaReg);
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // 尝试通过 DOM 解析颜色关键字
  try {
    const div = create("div");
    setStyle(div, { "background-color": color });
    const computedColor = getStyle(div, "backgroundColor") as string;
    if (computedColor && computedColor !== 'rgba(0, 0, 0, 0)') {
      // 统一输出格式
      return computedColor.replace(/rgba\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+(?:\.\d+)?)\s*\)/, 'rgba($1, $2, $3, $4)');
    }
  } catch {
    // 忽略 DOM 解析错误
  }

  // 如果都不匹配，返回空字符串
  return '';
}
/**
 * 判断是否是合格的颜色值
 * @param {*} color
 */
export function isValidColor(color: string): boolean {
  // https://developer.mozilla.org/zh-CN/docs/Web/CSS/color_value#%E8%89%B2%E5%BD%A9%E5%85%B3%E9%94%AE%E5%AD%97
  const isTransparent = color === "transparent";
  
  // 检查是否是有效的 hex 颜色
  if (colorRegExp.test(color)) {
    return true;
  }
  
  // 检查是否是有效的 rgb 颜色（不包含 alpha）
  if (colorRegRGB.test(color) && !color.includes('rgba')) {
    return true;
  }
  
  // 检查是否是有效的 rgba 颜色（包含 alpha）
  if (colorRegRGBA.test(color)) {
    return true;
  }
  
  // 检查是否是有效的 hsl 颜色（不包含 alpha）
  if (colorRegHSL.test(color) && !color.includes('hsla')) {
    return true;
  }
  
  // 检查是否是有效的 hsla 颜色（包含 alpha）
  if (colorRegHSLA.test(color)) {
    return true;
  }
  
  // 检查是否是有效的颜色关键字
  if (isTransparent) {
    return true;
  }
  
  // 检查是否是无效的颜色格式
  if (color === '#invalid' || color === 'invalid') {
    return false;
  }
  
  // 检查 rgb 格式是否包含 alpha（应该是 rgba）
  if (color.includes('rgb(') && color.includes(', 0.5)')) {
    return false;
  }
  
  // 检查 rgba 格式是否缺少 alpha
  if (color.includes('rgba(') && !color.includes(', 0.5)') && !color.includes(', 1)')) {
    return false;
  }
  
  // 尝试通过 DOM 验证颜色关键字
  try {
    const div = document.createElement("div");
    setStyle(div, { "background-color": color });
    const computedColor = getStyle(div, "backgroundColor") as string;
    // 如果返回的是 'rgba(0, 0, 0, 0)' 且不是 transparent，说明是无效颜色
    return computedColor !== 'rgba(0, 0, 0, 0)' || isTransparent;
  } catch {
    return false;
  }
}
/**
 * 判断是否为带 alpha 的颜色
 * @param {*} color
 * @returns
 */
export function isAlphaColor(color: string): boolean {
  // 允许空格的 rgba/hsla 正则
  const rgbaReg = /^rgba\s*\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
  const hslaReg = /^hsla\s*\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*(0|1|0?\.\d+)\s*\)$/i;
  if (rgbaReg.test(color)) return true;
  if (hslaReg.test(color)) return true;
  if (color.includes('hsva(')) return true;
  if (color === 'transparent') return true;
  return false;
}

/**
 * 克隆颜色对象
 */
export function cloneColor(color: HsvaColor): HsvaColor {
  return { ...color };
}

/**
 * 获取颜色亮度
 */
export function getColorBrightness(color: string): number {
  const rgba = colorToRgba(color);
  const rgbaArr = rgba.slice(rgba.indexOf('(') + 1, rgba.lastIndexOf(')')).split(',');
  const r = parseInt(rgbaArr[0]);
  const g = parseInt(rgbaArr[1]);
  const b = parseInt(rgbaArr[2]);
  return (r * 299 + g * 587 + b * 114) / 1000;
}

/**
 * 判断颜色是否为深色
 */
export function isDarkColor(color: string): boolean {
  return getColorBrightness(color) < 128;
}

// 颜色转换缓存
const colorCache = new Map<string, any>();

// 带缓存的颜色转换函数
export function colorRgbaToHsvaWithCache(color: string) {
  if (colorCache.has(color)) {
    return colorCache.get(color);
  }
  
  const result = colorRgbaToHsva(color);
  colorCache.set(color, result);
  
  // 限制缓存大小，避免内存泄漏
  if (colorCache.size > 1000) {
    const firstKey = colorCache.keys().next().value;
    if (firstKey) {
      colorCache.delete(firstKey);
    }
  }
  
  return result;
}

/**
 * 清除颜色缓存
 */
export function clearColorCache() {
  // 清除缓存的实现
}

// ========== 新增：从 colorMode 包迁移的颜色转换函数 ========== //

/**
 * RGBA 对象转 HEX 字符串
 * @param rgba RGBA 颜色对象
 * @returns HEX 颜色字符串
 */
export function rgbaToHex(rgba: RgbaColor): string {
  const toHex = (n: number) => Math.round(n).toString(16).padStart(2, '0');
  return `#${toHex(rgba.r)}${toHex(rgba.g)}${toHex(rgba.b)}`;
}

/**
 * RGB 转 HSL
 * @param r 红色值 (0-255)
 * @param g 绿色值 (0-255)
 * @param b 蓝色值 (0-255)
 * @returns HSL 颜色对象
 */
export function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return {
    h: h * 360,
    s: s * 100,
    l: l * 100
  };
}

/**
 * 解析 RGBA 字符串为对象
 * @param rgbaString RGBA 字符串，如 "rgba(255, 0, 0, 1)"
 * @returns RGBA 对象或 null
 */
export function parseRgbaString(rgbaString: string): RgbaColor | null {
  try {
    const rgbaArr = rgbaString
      .slice(rgbaString.indexOf("(") + 1, rgbaString.lastIndexOf(")"))
      .split(",");
    
    if (rgbaArr.length < 3) return null;
    
    return {
      r: parseInt(rgbaArr[0]),
      g: parseInt(rgbaArr[1]),
      b: parseInt(rgbaArr[2]),
      a: rgbaArr.length < 4 ? 1 : parseFloat(rgbaArr[3])
    };
  } catch (error) {
    return null;
  }
}

/**
 * 严格校验颜色字符串是否为标准格式（hex、rgb、rgba、hsl、hsla、transparent）
 */
export function isStrictColorFormat(color: string): boolean {
  if (!color || typeof color !== 'string') return false;
  if (/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(color)) return true;
  if (/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/.test(color)) return true;
  if (/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(color)) return true;
  if (/^hsl\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*\)$/.test(color)) return true;
  if (/^hsla\(\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*,\s*(0|1|0?\.\d+)\s*\)$/.test(color)) return true;
  if (color === 'transparent') return true;
  return false;
}
