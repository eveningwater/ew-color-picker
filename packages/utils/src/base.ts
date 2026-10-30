import { isNull, isShallowObject, isArray, isFunction, isUndefined } from './type'
import { _arrSlice, _hasOwn } from "./const";
/**
 * 对象合并
 * @param t 
 * @param o 
 * @returns 
 */
export const extend = <T extends object, U extends object[]>(t: T, ...o: U): T & U[number] => {
    if (isNull(t)) {
        return {} as T & U[number];
    }
    if (Object.assign) {
        return Object.assign(t, ...o);
    } else {
        const _ = Object(t) as T & U[number];
        for (let j = 0, len = o.length; j < len; j++) {
            const source = o[j];
            if (source) {
                for (let key in source) {
                    if (_hasOwn.call(source, key)) {
                        (_ as any)[key] = (source as any)[key];
                    }
                }
            }
        }
        return _;
    }
}

/**
 * 伪数组转换成数组
 * @param v 
 * @returns 
 */
export const toArray = <T>(v: Iterable<T> | ArrayLike<T> | any) => {
    if (!isShallowObject(v)) {
        return v;
    }
    if (Array.from) {
        return Array.from(v);
    } else {
        return _arrSlice.call(v)
    }
}
/**
 * 深度复制，受限于JSON的功能
 * @param v 
 * @returns 
 */
export const JSONClone = <T>(v: T) => JSON.parse(JSON.stringify(v));
/**
 * 递归深度复制
 * @param obj 
 * @returns 
 */
export const clone = function f<T>(obj: T) {
    if (!isShallowObject(obj)) {
        return obj;
    }
    const res = (isArray(obj) ? [] : {}) as T;
    for (const k in obj) {
        if (obj.hasOwnProperty(k)) {
            (res as any)[k] = isShallowObject((obj as any)[k]) ? f((obj as any)[k]) : (obj as any)[k];
        }
    }
    return res;
}
/**
 * 移除所有空白
 * @param value 
 * @returns 
 */
export const removeAllSpace = (value: string) => value.replace(/\s+/g, "");
/**
 * 是否是promise
 * @param value
 * @returns
 */
export const isPromise = (value: any): value is Promise<unknown> => {
  if (isUndefined(value) || isNull(value)) return false;
  const obj = value as any;
  return isFunction(obj.then) && isFunction(obj.catch);
};

/**
 * 处理类名
 * @param c 
 * @returns 
 */
export const handleClassName = (c?: string) => (c ? ` ${c}` : "");

// 重新导出type.ts中的函数
export { isString, isFunction, isUndefined, isNull, isDeepArray, isDeepObject, throwError } from './type';