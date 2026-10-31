// 默认类名前缀
export const DEFAULT_PREFIX = "ew-";

// 读取实例配置中的前缀，缺省回退默认前缀
export const getPrefix = (instance?: any): string => {
  const prefix = instance?.options?.prefix;
  return typeof prefix === "string" ? prefix : DEFAULT_PREFIX;
};
