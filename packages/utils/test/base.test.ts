import { describe, it, expect } from 'vitest';
import {
  removeAllSpace,
  isString,
  isFunction,
  isUndefined,
  isNull,
  clone,
  extend,
  toArray,
  JSONClone,
  isPromise,
  handleClassName
} from '../src/base';
import {
  isNumber,
  isBoolean,
  isObject,
  isArray
} from '../src/type';

describe('Base Utils', () => {
  describe('removeAllSpace', () => {
    it('should remove all spaces from string', () => {
      expect(removeAllSpace('  hello  world  ')).toBe('helloworld');
      expect(removeAllSpace('no spaces')).toBe('nospaces');
      expect(removeAllSpace('')).toBe('');
    });
  });

  describe('type checking functions', () => {
    it('should check string type', () => {
      expect(isString('hello')).toBe(true);
      expect(isString(123)).toBe(false);
      expect(isString('')).toBe(true);
    });

    it('should check number type', () => {
      expect(isNumber(123)).toBe(true);
      expect(isNumber('123')).toBe(false);
      expect(isNumber(NaN)).toBe(true); // NaN 在 JavaScript 中是 number 类型
      expect(isNumber(Infinity)).toBe(true);
    });

    it('should check boolean type', () => {
      expect(isBoolean(true)).toBe(true);
      expect(isBoolean(false)).toBe(true);
      expect(isBoolean(1)).toBe(false);
      expect(isBoolean('true')).toBe(false);
    });

    it('should check object type', () => {
      expect(isObject({})).toBe(true);
      expect(isObject([])).toBe(false);
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(() => {})).toBe(false);
    });

    it('should check array type', () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray({})).toBe(false);
      expect(isArray('array')).toBe(false);
    });

    it('should check function type', () => {
      expect(isFunction(() => {})).toBe(true);
      expect(isFunction(function() {})).toBe(true);
      expect(isFunction({})).toBe(false);
      expect(isFunction('function')).toBe(false);
    });

    it('should check undefined type', () => {
      expect(isUndefined(undefined)).toBe(true);
      expect(isUndefined(null)).toBe(false);
      expect(isUndefined('')).toBe(false);
    });

    it('should check null type', () => {
      expect(isNull(null)).toBe(true);
      expect(isNull(undefined)).toBe(false);
      expect(isNull('')).toBe(false);
    });
  });

  describe('extend', () => {
    it('should merge objects', () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const result = extend({}, obj1, obj2);
      
      expect(result).toEqual({ a: 1, b: 3, c: 4 });
    });

    it('should handle null target', () => {
      const obj = { a: 1 };
      const result = extend(null as any, obj);
      expect(result).toEqual({});
    });
  });

  describe('toArray', () => {
    it('should convert array-like objects to array', () => {
      const arrayLike = { 0: 'a', 1: 'b', length: 2 };
      const result = toArray(arrayLike);
      expect(result).toEqual(['a', 'b']);
    });

    it('should return non-object values as is', () => {
      expect(toArray('string')).toBe('string');
      expect(toArray(123)).toBe(123);
    });
  });

  describe('JSONClone', () => {
    it('should clone objects using JSON', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = JSONClone(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
    });

    it('should handle primitive values', () => {
      expect(JSONClone(123)).toBe(123);
      expect(JSONClone('hello')).toBe('hello');
    });
  });

  describe('clone', () => {
    it('should clone primitive values', () => {
      expect(clone(123)).toBe(123);
      expect(clone('hello')).toBe('hello');
      expect(clone(true)).toBe(true);
      expect(clone(null)).toBe(null);
    });

    it('should clone objects', () => {
      const obj = { a: 1, b: { c: 2 } };
      const cloned = clone(obj);
      
      expect(cloned).toEqual(obj);
      expect(cloned).not.toBe(obj);
      expect(cloned.b).not.toBe(obj.b);
    });

    it('should clone arrays', () => {
      const arr = [1, [2, 3], { a: 4 }];
      const cloned = clone(arr);
      
      expect(cloned).toEqual(arr);
      expect(cloned).not.toBe(arr);
      expect(cloned[1]).not.toBe(arr[1]);
      expect(cloned[2]).not.toBe(arr[2]);
    });
  });

  describe('isPromise', () => {
    it('should detect promises', () => {
      const promise = Promise.resolve(123);
      expect(isPromise(promise)).toBe(true);
    });

    it('should reject non-promises', () => {
      expect(isPromise({})).toBe(false);
      expect(isPromise(() => {})).toBe(false);
      expect(isPromise(null)).toBe(false);
    });
  });

  describe('handleClassName', () => {
    it('should add space prefix to class name', () => {
      expect(handleClassName('test')).toBe(' test');
    });

    it('should return empty string for undefined', () => {
      expect(handleClassName()).toBe('');
    });

    it('should return empty string for empty string', () => {
      expect(handleClassName('')).toBe('');
    });
  });
}); 