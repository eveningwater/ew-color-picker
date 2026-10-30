import { describe, it, expect } from 'vitest';
import {
  colorRgbaToHsva,
  colorHsvaToRgba,
  colorRgbaToHsla,
  colorHslaToRgba,
  colorToRgba,
  isValidColor,
  isAlphaColor,
  parseRgbaString
} from '../src/color';

describe('Color Utils', () => {
  describe('colorRgbaToHsva', () => {
    it('should convert RGBA string to HSVA', () => {
      const rgba = 'rgba(255, 0, 0, 1)';
      const hsva = colorRgbaToHsva(rgba);
      
      expect(hsva.h).toBe(0);
      expect(hsva.s).toBe(100);
      expect(hsva.v).toBe(100);
      expect(hsva.a).toBe(1);
    });

    it('should handle alpha values', () => {
      const rgba = 'rgba(255, 0, 0, 0.5)';
      const hsva = colorRgbaToHsva(rgba);
      
      expect(hsva.a).toBe(0.5);
    });

    it('should handle grayscale colors', () => {
      const rgba = 'rgba(128, 128, 128, 1)';
      const hsva = colorRgbaToHsva(rgba);
      
      expect(hsva.s).toBe(0);
      expect(hsva.v).toBe(50);
    });
  });

  describe('colorHsvaToRgba', () => {
    it('should convert HSVA to RGBA string', () => {
      const hsva = { h: 0, s: 100, v: 100, a: 1 };
      const rgba = colorHsvaToRgba(hsva);
      
      expect(rgba).toBe('rgba(255, 0, 0, 1)');
    });

    it('should handle different hues', () => {
      const hsva = { h: 120, s: 100, v: 100, a: 1 };
      const rgba = colorHsvaToRgba(hsva);
      
      expect(rgba).toBe('rgba(0, 255, 0, 1)');
    });

    it('should handle alpha values', () => {
      const hsva = { h: 0, s: 100, v: 100, a: 0.5 };
      const rgba = colorHsvaToRgba(hsva);
      
      expect(rgba).toBe('rgba(255, 0, 0, 0.5)');
    });
  });

  describe('colorRgbaToHsla', () => {
    it('should convert RGBA string to HSLA', () => {
      const rgba = 'rgba(255, 0, 0, 1)';
      const result = colorRgbaToHsla(rgba);
      
      expect(result.colorObj.h).toBe(0);
      expect(result.colorObj.s).toBe(100);
      expect(result.colorObj.l).toBe(50);
      expect(result.colorObj.a).toBe(1);
    });

    it('should handle grayscale colors', () => {
      const rgba = 'rgba(128, 128, 128, 1)';
      const result = colorRgbaToHsla(rgba);
      
      expect(result.colorObj.s).toBe(0);
      expect(result.colorObj.l).toBe(50);
    });
  });

  describe('colorHslaToRgba', () => {
    it('should convert HSLA to RGBA string', () => {
      const hsla = { h: 0, s: 100, l: 50, a: 1 };
      const rgba = colorHslaToRgba(hsla);
      
      expect(rgba).toBe('rgba(255, 0, 0, 1)');
    });

    it('should handle different lightness values', () => {
      const hsla = { h: 0, s: 100, l: 25, a: 1 };
      const rgba = colorHslaToRgba(hsla);
      
      expect(rgba).toBe('rgba(128, 0, 0, 1)');
    });
  });

  describe('colorToRgba', () => {
    it('should convert hex color to RGBA', () => {
      const rgba = colorToRgba('#ff0000');
      expect(rgba).toBe('rgba(255, 0, 0, 1)');
    });

    it('should convert rgb color to RGBA', () => {
      const rgba = colorToRgba('rgb(255, 0, 0)');
      expect(rgba).toBe('rgba(255, 0, 0, 1)');
    });

    it('should convert rgba color to RGBA', () => {
      const rgba = colorToRgba('rgba(255, 0, 0, 0.5)');
      expect(rgba).toBe('rgba(255, 0, 0, 0.5)');
    });

    it('should handle color keywords', () => {
      const rgba = colorToRgba('red');
      expect(rgba).toBe('rgba(255, 0, 0, 1)');
    });
  });

  describe('isValidColor', () => {
    it('should validate hex colors', () => {
      expect(isValidColor('#ff0000')).toBe(true);
      expect(isValidColor('#f00')).toBe(true);
      expect(isValidColor('#invalid')).toBe(false);
    });

    it('should validate rgb colors', () => {
      expect(isValidColor('rgb(255, 0, 0)')).toBe(true);
      expect(isValidColor('rgb(255, 0, 0, 0.5)')).toBe(false); // should be rgba
    });

    it('should validate rgba colors', () => {
      expect(isValidColor('rgba(255, 0, 0, 0.5)')).toBe(true);
      expect(isValidColor('rgba(255, 0, 0)')).toBe(false); // missing alpha
    });

    it('should validate color keywords', () => {
      expect(isValidColor('red')).toBe(true);
      expect(isValidColor('invalid')).toBe(false);
    });

    it('should validate hsl colors', () => {
      expect(isValidColor('hsl(0, 100%, 50%)')).toBe(true);
    });

    it('should validate hsla colors', () => {
      expect(isValidColor('hsla(0, 100%, 50%, 0.5)')).toBe(true);
    });
  });

  describe('isAlphaColor', () => {
    it('should detect colors with alpha', () => {
      expect(isAlphaColor('rgba(255, 0, 0, 0.5)')).toBe(true);
      expect(isAlphaColor('hsla(0, 100%, 50%, 0.5)')).toBe(true);
    });

    it('should detect colors without alpha', () => {
      expect(isAlphaColor('#ff0000')).toBe(false);
      expect(isAlphaColor('rgb(255, 0, 0)')).toBe(false);
      expect(isAlphaColor('hsl(0, 100%, 50%)')).toBe(false);
    });
  });

  describe('color conversion roundtrip', () => {
    it('should maintain color values through HSVA conversion', () => {
      const originalRgba = 'rgba(255, 100, 50, 0.8)';
      const hsva = colorRgbaToHsva(originalRgba);
      const convertedRgba = colorHsvaToRgba(hsva);
      
      // Parse the converted RGBA string to compare values
      const parsed = parseRgbaString(convertedRgba);
      const original = parseRgbaString(originalRgba);
      
      expect(parsed?.r).toBeCloseTo(original?.r || 0, -1); // 允许 ±10 的误差
      expect(parsed?.g).toBeCloseTo(original?.g || 0, -1); // 允许 ±10 的误差
      expect(parsed?.b).toBeCloseTo(original?.b || 0, -1); // 允许 ±10 的误差
      expect(parsed?.a).toBeCloseTo(original?.a || 0, 1);
    });

    it('should maintain color values through HSLA conversion', () => {
      const originalRgba = 'rgba(255, 100, 50, 0.8)';
      const hslaResult = colorRgbaToHsla(originalRgba);
      const convertedRgba = colorHslaToRgba(hslaResult.colorObj);
      
      // Parse the converted RGBA string to compare values
      const parsed = parseRgbaString(convertedRgba);
      const original = parseRgbaString(originalRgba);
      
      expect(parsed?.r).toBeCloseTo(original?.r || 0, -2); // 允许 ±50 的误差
      expect(parsed?.g).toBeCloseTo(original?.g || 0, -2); // 允许 ±50 的误差
      expect(parsed?.b).toBeCloseTo(original?.b || 0, -2); // 允许 ±50 的误差
      expect(parsed?.a).toBeCloseTo(original?.a || 0, 1);
    });
  });
}); 