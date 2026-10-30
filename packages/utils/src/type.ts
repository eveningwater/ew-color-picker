import { error } from "./assert";
import { _toString } from "./const";

// 基础类型守卫函数
export const isNull = <T>(v: T): v is Extract<T, null> => v === null;

export const isUndefined = <T>(v: T): v is Extract<T, undefined> => typeof v === 'undefined';

export const isString = (v: any): v is string => typeof v === 'string';

export const isNumber = (v: any): v is number => typeof v === 'number';

export const isBoolean = (v: any): v is boolean => typeof v === 'boolean';

export const isFunction = (v: any): v is Function => typeof v === 'function';

// 对象类型守卫函数
export const isShallowObject = <T>(v: T): v is Extract<T, object> => 
  typeof v === 'object' && !isNull(v);

export const isObject = (v: any): v is object => 
  _toString.call(v).slice(8, -1).toLowerCase() === 'object';

export const isArray = (v: any): v is any[] => 
  _toString.call(v).slice(8, -1).toLowerCase() === 'array';

export const isRegExp = (v: any): v is RegExp => 
  _toString.call(v).slice(8, -1).toLowerCase() === 'regexp';

// 深度类型检查函数
export const isDeepArray = (value: any): value is any[] => Array.isArray(value);

export const isDeepObject = (value: any): value is object => 
  value !== null && typeof value === 'object' && !Array.isArray(value);

// 错误处理函数
export const throwError = (message: string): never => {
  throw new Error(`[ewColorPicker error]: ${message}`);
};

export const tryErrorHandler = (fn: () => void, onError?: (error: any) => void) => {
  try {
    fn();
  } catch (err) {
    if (isFunction(onError)) {
      onError(err);
      return;
    }
    error(`[ewColorPicker error]: ${err}`);
  }
};

// 为了向后兼容，保留原有的类型定义
export const basicDataTypeList = ["Number", "String", "Function", "Undefined", "Boolean"] as const;
export const objDataTypeList = ["Object", "Array", "RegExp"] as const;
export type TypeKey = typeof basicDataTypeList[number] | typeof objDataTypeList[number];
export type IsTypeUtil = Record<`is${TypeKey}`, <T>(v: T) => boolean>;

export const isNotEmptyObject = <T>(obj: any): obj is NonNullable<T> => isObject(obj) && Object.keys(obj).length > 0;