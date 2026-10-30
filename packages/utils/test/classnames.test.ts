import { describe, it, expect } from 'vitest';
import { classnames } from '../src/classnames';

describe('Classnames Utils', () => {
  describe('classnames', () => {
    it('should combine string class names', () => {
      const result = classnames('class1', 'class2', 'class3');
      expect(result).toBe('class1 class2 class3');
    });

    it('should handle conditional class names', () => {
      const result = classnames(
        'base-class',
        { 'active': true, 'disabled': false, 'hidden': true }
      );
      expect(result).toBe('base-class active hidden');
    });

    it('should handle mixed string and conditional classes', () => {
      const result = classnames(
        'base',
        'static-class',
        { 'conditional': true, 'hidden': false },
        'another-static'
      );
      expect(result).toBe('base static-class conditional another-static');
    });

    it('should handle empty and falsy values', () => {
      const result = classnames(
        '',
        null,
        undefined,
        false,
        0,
        'valid-class'
      );
      expect(result).toBe('valid-class');
    });

    it('should handle arrays of class names', () => {
      const result = classnames([
        'class1',
        'class2',
        { 'conditional': true }
      ]);
      expect(result).toBe('class1 class2 conditional');
    });

    it('should handle nested arrays', () => {
      const result = classnames([
        'base',
        ['nested1', 'nested2'],
        { 'active': true }
      ]);
      expect(result).toBe('base nested1 nested2 active');
    });

    it('should handle objects with string keys', () => {
      const result = classnames({
        'btn': true,
        'btn-primary': true,
        'btn-large': false,
        'btn-disabled': true
      });
      expect(result).toBe('btn btn-primary btn-disabled');
    });

    it('should handle complex nested structures', () => {
      const result = classnames(
        'base-class',
        [
          'array-class1',
          { 'array-conditional': true }
        ],
        {
          'object-class': true,
          'object-conditional': false
        },
        'final-class'
      );
      expect(result).toBe('base-class array-class1 array-conditional object-class final-class');
    });

    it('should handle empty input', () => {
      expect(classnames()).toBe('');
      expect(classnames('')).toBe('');
      expect(classnames([])).toBe('');
      expect(classnames({})).toBe('');
    });

    it('should handle whitespace in class names', () => {
      const result = classnames('  class1  ', '  class2  ');
      expect(result).toBe('class1 class2');
    });

    it('should handle duplicate class names', () => {
      const result = classnames('class1', 'class1', 'class2', 'class1');
      expect(result).toBe('class1 class2');
    });
  });
}); 