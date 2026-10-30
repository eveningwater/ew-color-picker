import { _hasOwn } from "./const";

export type Value = boolean | string | number | undefined | null | Symbol;
export type Mapping = Record<string, unknown>;
export interface ArgumentArray extends Array<Argument> {}
export type Argument = string | number | boolean | null | undefined | Mapping | ArgumentArray;
export const classnames = (...args: ArgumentArray) => {
  const classes: string[] = [];
  for (let i = 0, len = args.length; i < len; i++) {
    const arg = args[i];
    if (!arg) {
      continue;
    }
    if (typeof arg === "string" || typeof arg === "number") {
      const trimmed = String(arg).trim();
      if (trimmed) {
        classes.push(trimmed);
      }
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const __class = classnames.apply(null, arg);
        if (__class) {
          const trimmed = __class.trim();
          if (trimmed) {
            classes.push(trimmed);
          }
        }
      }
    } else if (typeof arg === "object") {
      if (arg.toString === Object.prototype.toString) {
        for (let key in arg) {
          if (_hasOwn.call(arg, key) && arg[key]) {
            const trimmed = key.trim();
            if (trimmed) {
              classes.push(trimmed);
            }
          }
        }
      } else {
        const trimmed = String(arg).trim();
        if (trimmed) {
          classes.push(trimmed);
        }
      }
    }
  }
  // 去重并返回
  const uniqueClasses = Array.from(new Set(classes));
  return uniqueClasses.join(" ");
};
