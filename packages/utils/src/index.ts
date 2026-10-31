import { isString } from "./type";

export * from "./assert";
export * from "./type";
export * from "./dom";
export * from "./env";
export * from "./base";

export * from "./enum";
export * from "./event";
export * from "./color";
export * from "./animation";
export * from "./icon";
export * from "./prefix";
export * from "./consolePlugin";
export { default as Console } from "./consolePlugin";

export function toStyleStr(style?: string | Record<string, string>): string {
  if (!style) return '';
  if (isString(style)){
    return style;
  }
  return Object.entries(style)
    .map(([k, v]) => `${k.replace(/([A-Z])/g, '-$1').toLowerCase()}:${v}`)
    .join(';');
}
