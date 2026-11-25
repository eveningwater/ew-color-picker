import { describe, it, expect } from 'vitest';
import {
  PLACEMENTS,
  isPlacement,
  parsePlacement
} from '../src/placement';

describe('Placement Utils', () => {
  it('should expose 12 placements', () => {
    expect(PLACEMENTS.length).toBe(12);
    expect(PLACEMENTS).toContain('top');
    expect(PLACEMENTS).toContain('bottom-end');
    expect(PLACEMENTS).toContain('left-start');
    expect(PLACEMENTS).toContain('right');
  });

  describe('isPlacement', () => {
    it('should accept valid placements', () => {
      expect(isPlacement('top')).toBe(true);
      expect(isPlacement('bottom-start')).toBe(true);
      expect(isPlacement('right-end')).toBe(true);
    });

    it('should reject invalid values', () => {
      expect(isPlacement('center')).toBe(false);
      expect(isPlacement('top-middle')).toBe(false);
      expect(isPlacement('')).toBe(false);
      expect(isPlacement(undefined)).toBe(false);
      expect(isPlacement(null)).toBe(false);
      expect(isPlacement(123)).toBe(false);
    });
  });

  describe('parsePlacement', () => {
    it('should default align to center', () => {
      expect(parsePlacement('top')).toEqual({ side: 'top', align: 'center' });
      expect(parsePlacement('right')).toEqual({ side: 'right', align: 'center' });
    });

    it('should parse side and align', () => {
      expect(parsePlacement('bottom-start')).toEqual({
        side: 'bottom',
        align: 'start'
      });
      expect(parsePlacement('left-end')).toEqual({
        side: 'left',
        align: 'end'
      });
    });
  });
});
