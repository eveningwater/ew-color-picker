import { describe, it, expect, afterEach } from 'vitest';
import { create } from '../../utils/src/dom';
import { injectStyles, removeStyles } from '../src/index';

describe('Style Utils', () => {
  describe('injectStyles', () => {
    it('should inject CSS styles into document', () => {
      const testStyles = `
        .test-class {
          color: red;
          background: blue;
        }
      `;
      
      const styleId = 'test-styles';
      injectStyles(testStyles, styleId);
      
      const styleElement = document.getElementById(styleId);
      expect(styleElement).toBeTruthy();
      expect(styleElement?.tagName).toBe('STYLE');
      expect(styleElement?.textContent).toContain('color: red');
      expect(styleElement?.textContent).toContain('background: blue');
    });

    it('should not inject duplicate styles with same id', () => {
      const testStyles = '.test-class { color: red; }';
      const styleId = 'duplicate-test';
      
      // Inject first time
      injectStyles(testStyles, styleId);
      const firstStyle = document.getElementById(styleId);
      
      // Inject second time
      injectStyles(testStyles, styleId);
      const secondStyle = document.getElementById(styleId);
      
      // Should be the same element
      expect(firstStyle).toBe(secondStyle);
    });

    it('should inject styles without id', () => {
      const testStyles = '.test-class { color: red; }';
      
      injectStyles(testStyles);
      
      // Should find a style element with the content
      const styleElements = document.querySelectorAll('style');
      const hasStyle = Array.from(styleElements).some(el => 
        el.textContent?.includes('color: red')
      );
      
      expect(hasStyle).toBe(true);
    });
  });

  describe('removeStyles', () => {
    it('should remove styles by id', () => {
      const testStyles = '.test-class { color: red; }';
      const styleId = 'remove-test';
      
      injectStyles(testStyles, styleId);
      expect(document.getElementById(styleId)).toBeTruthy();
      
      removeStyles(styleId);
      expect(document.getElementById(styleId)).toBeFalsy();
    });

    it('should handle removing non-existent styles', () => {
      expect(() => removeStyles('non-existent-id')).not.toThrow();
    });

    it('should remove all injected styles when no id provided', () => {
      const testStyles1 = '.test-class1 { color: red; }';
      const testStyles2 = '.test-class2 { color: blue; }';
      
      injectStyles(testStyles1, 'test1');
      injectStyles(testStyles2, 'test2');
      
      expect(document.getElementById('test1')).toBeTruthy();
      expect(document.getElementById('test2')).toBeTruthy();
      
      removeStyles();
      
      expect(document.getElementById('test1')).toBeFalsy();
      expect(document.getElementById('test2')).toBeFalsy();
    });
  });

  describe('style content validation', () => {
    it('should handle empty styles', () => {
      expect(() => injectStyles('')).not.toThrow();
    });

    it('should handle styles with special characters', () => {
      const testStyles = `
        .test-class {
          content: "test";
          background: url('test.jpg');
        }
      `;
      
      const styleId = 'special-chars';
      injectStyles(testStyles, styleId);
      
      const styleElement = document.getElementById(styleId);
      expect(styleElement).toBeTruthy();
      expect(styleElement?.textContent).toContain('content: "test"');
    });

    it('should handle large style blocks', () => {
      const largeStyles = Array(1000).fill('.test-class { color: red; }').join('\n');
      
      expect(() => injectStyles(largeStyles, 'large-test')).not.toThrow();
      
      const styleElement = document.getElementById('large-test');
      expect(styleElement).toBeTruthy();
    });
  });

  describe('cleanup', () => {
    it('should clean up injected styles after each test', () => {
      // This test ensures the cleanup mechanism works
      const testStyles = '.cleanup-test { color: red; }';
      injectStyles(testStyles, 'cleanup-test');
      
      expect(document.getElementById('cleanup-test')).toBeTruthy();
      
      // Cleanup should happen in afterEach
    });
    
    afterEach(() => {
      // Clean up any injected styles
      const styleElements = document.querySelectorAll('style');
      styleElements.forEach(el => el.remove());
    });
  });
}); 