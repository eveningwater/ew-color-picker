import type ewColorPicker from "@ew-color-picker/core";
import { isString } from "./type";

// 默认类名前缀
export const DEFAULT_PREFIX = "ew-";

// 读取实例配置中的前缀，缺省回退默认前缀
export const getPrefix = (instance?: ewColorPicker): string => {
  const prefix = instance?.options?.prefix;
  return isString(prefix) ? prefix : DEFAULT_PREFIX;
};
