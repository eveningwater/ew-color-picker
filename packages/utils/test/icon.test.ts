import { describe, it, expect, beforeEach, vi } from 'vitest';
import { closeIcon, arrowIcon, upArrowIcon, downArrowIcon } from '../src/icon';

describe('Icon Utils', () => {
  describe('closeIcon', () => {
    it('should generate close icon SVG', () => {
      const icon = closeIcon();
      expect(icon).toContain('<svg');
      expect(icon).toContain('class="ew-color-picker-icon"');
      expect(icon).toContain('viewBox="0 0 1024 1024"');
    });

    it('should apply custom className', () => {
      const icon = closeIcon('custom-class');
      expect(icon).toContain('class="ew-color-picker-icon custom-class"');
    });

    it('should apply custom size', () => {
      const icon = closeIcon(undefined, 24);
      expect(icon).toContain('width="24" height="24"');
    });

    it('should apply both className and size', () => {
      const icon = closeIcon('custom-class', 32);
      expect(icon).toContain('class="ew-color-picker-icon custom-class"');
      expect(icon).toContain('width="32" height="32"');
    });
  });

  describe('arrowIcon', () => {
    it('should generate arrow icon SVG', () => {
      const icon = arrowIcon();
      expect(icon).toContain('<svg');
      expect(icon).toContain('class="ew-color-picker-icon"');
      expect(icon).toContain('viewBox="0 0 1024 1024"');
    });

    it('should apply custom className', () => {
      const icon = arrowIcon('custom-class');
      expect(icon).toContain('class="ew-color-picker-icon custom-class"');
    });

    it('should apply custom size', () => {
      const icon = arrowIcon(undefined, 24);
      expect(icon).toContain('width="24" height="24"');
    });
  });

  describe('upArrowIcon', () => {
    it('should generate up arrow icon SVG', () => {
      const icon = upArrowIcon();
      expect(icon).toContain('<svg');
      expect(icon).toContain('class="ew-color-picker-icon"');
      expect(icon).toContain('viewBox="0 0 1024 1024"');
    });

    it('should apply custom className', () => {
      const icon = upArrowIcon('custom-class');
      expect(icon).toContain('class="ew-color-picker-icon custom-class"');
    });

    it('should apply custom size', () => {
      const icon = upArrowIcon(undefined, 24);
      expect(icon).toContain('width="24" height="24"');
    });
  });

  describe('downArrowIcon', () => {
    it('should generate down arrow icon SVG', () => {
      const icon = downArrowIcon();
      expect(icon).toContain('<svg');
      expect(icon).toContain('class="ew-color-picker-icon"');
      expect(icon).toContain('viewBox="0 0 1024 1024"');
    });

    it('should apply custom className', () => {
      const icon = downArrowIcon('custom-class');
      expect(icon).toContain('class="ew-color-picker-icon custom-class"');
    });

    it('should apply custom size', () => {
      const icon = downArrowIcon(undefined, 24);
      expect(icon).toContain('width="24" height="24"');
    });
  });

  describe('icon functionality', () => {
    it('should generate valid SVG markup', () => {
      const icons = [closeIcon(), arrowIcon(), upArrowIcon(), downArrowIcon()];
      
      icons.forEach(icon => {
        expect(icon).toMatch(/^<svg.*<\/svg>$/);
        expect(icon).toContain('xmlns="http://www.w3.org/2000/svg"');
        expect(icon).toContain('version="1.1"');
      });
    });

    it('should handle empty className', () => {
      const icon = closeIcon('');
      expect(icon).toContain('class="ew-color-picker-icon"');
    });

    it('should handle zero size', () => {
      const icon = closeIcon(undefined, 0);
      expect(icon).not.toContain('width="0" height="0"');
    });

    it('should handle negative size', () => {
      const icon = closeIcon(undefined, -10);
      expect(icon).not.toContain('width="-10" height="-10"');
    });
  });
}); 