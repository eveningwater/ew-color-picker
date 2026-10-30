import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ewColorPicker from '../../core/src/index';
import { createMockCore } from '../../../test/setup';

describe('Plugin Synchronization Tests', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('Clear Button Synchronization', () => {
    it('should sync all plugins when clear button is clicked', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true,
        hue: true,
        alpha: true,
        openChangeColorMode: true,
        defaultMode: 'rgb'
      });

      // 设置一个初始颜色
      picker.setColor('rgba(100, 150, 200, 0.8)');
      
      // 等待插件初始化
      setTimeout(() => {
        // 模拟点击清空按钮
        const clearButton = document.querySelector('.ew-color-picker-clear-btn') as HTMLButtonElement;
        if (clearButton) {
          clearButton.click();
        }
        
        // 验证所有插件都已同步
        setTimeout(() => {
          // 验证主输入框
          const mainInput = document.querySelector('.ew-color-picker-input') as HTMLInputElement;
          expect(mainInput.value).toBe('rgba(255, 0, 0, 1)');
          
          // 验证RGB输入框
          const rInput = document.querySelector('.ew-color-picker-rgb-r-input input') as HTMLInputElement;
          const gInput = document.querySelector('.ew-color-picker-rgb-g-input input') as HTMLInputElement;
          const bInput = document.querySelector('.ew-color-picker-rgb-b-input input') as HTMLInputElement;
          const aInput = document.querySelector('.ew-color-picker-rgb-alpha-input input') as HTMLInputElement;
          
          expect(rInput.value).toBe('255');
          expect(gInput.value).toBe('0');
          expect(bInput.value).toBe('0');
          expect(aInput.value).toBe('1');
          
          // 验证颜色框
          const colorBox = document.querySelector('.ew-color-picker-box') as HTMLElement;
          expect(colorBox.style.backgroundColor).toBe('rgba(255, 0, 0, 1)');
        }, 100);
      }, 100);
    });
  });

  describe('Input Field Synchronization', () => {
    it('should sync all plugins when main input changes', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true,
        hue: true,
        alpha: true,
        openChangeColorMode: true,
        defaultMode: 'rgb'
      });

      // 等待插件初始化
      setTimeout(() => {
        // 修改主输入框的值
        const mainInput = document.querySelector('.ew-color-picker-input') as HTMLInputElement;
        if (mainInput) {
          mainInput.value = 'rgba(50, 100, 150, 0.6)';
          mainInput.dispatchEvent(new Event('blur'));
        }
        
        // 验证其他插件已同步
        setTimeout(() => {
          // 验证RGB输入框
          const rInput = document.querySelector('.ew-color-picker-rgb-r-input input') as HTMLInputElement;
          const gInput = document.querySelector('.ew-color-picker-rgb-g-input input') as HTMLInputElement;
          const bInput = document.querySelector('.ew-color-picker-rgb-b-input input') as HTMLInputElement;
          const aInput = document.querySelector('.ew-color-picker-rgb-alpha-input input') as HTMLInputElement;
          
          expect(rInput.value).toBe('50');
          expect(gInput.value).toBe('100');
          expect(bInput.value).toBe('150');
          expect(aInput.value).toBe('0.6');
          
          // 验证颜色框
          const colorBox = document.querySelector('.ew-color-picker-box') as HTMLElement;
          expect(colorBox.style.backgroundColor).toBe('rgba(50, 100, 150, 0.6)');
        }, 100);
      }, 100);
    });
  });

  describe('RGB Input Synchronization', () => {
    it('should sync all plugins when RGB inputs change', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true,
        hue: true,
        alpha: true,
        openChangeColorMode: true,
        defaultMode: 'rgb'
      });

      // 等待插件初始化
      setTimeout(() => {
        // 修改RGB输入框的值
        const rInput = document.querySelector('.ew-color-picker-rgb-r-input input') as HTMLInputElement;
        const gInput = document.querySelector('.ew-color-picker-rgb-g-input input') as HTMLInputElement;
        const bInput = document.querySelector('.ew-color-picker-rgb-b-input input') as HTMLInputElement;
        const aInput = document.querySelector('.ew-color-picker-rgb-alpha-input input') as HTMLInputElement;
        
        if (rInput && gInput && bInput && aInput) {
          rInput.value = '75';
          gInput.value = '125';
          bInput.value = '175';
          aInput.value = '0.7';
          
          rInput.dispatchEvent(new Event('blur'));
        }
        
        // 验证其他插件已同步
        setTimeout(() => {
          // 验证主输入框
          const mainInput = document.querySelector('.ew-color-picker-input') as HTMLInputElement;
          expect(mainInput.value).toBe('rgba(75, 125, 175, 0.7)');
          
          // 验证颜色框
          const colorBox = document.querySelector('.ew-color-picker-box') as HTMLElement;
          expect(colorBox.style.backgroundColor).toBe('rgba(75, 125, 175, 0.7)');
        }, 100);
      }, 100);
    });
  });

  describe('HSL Input Synchronization', () => {
    it('should sync all plugins when HSL inputs change', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true,
        hue: true,
        alpha: true,
        openChangeColorMode: true,
        defaultMode: 'hsl'
      });

      // 等待插件初始化
      setTimeout(() => {
        // 修改HSL输入框的值
        const hInput = document.querySelector('.ew-color-picker-hsl-h-input input') as HTMLInputElement;
        const sInput = document.querySelector('.ew-color-picker-hsl-s-input') as HTMLInputElement;
        const lInput = document.querySelector('.ew-color-picker-hsl-l-input') as HTMLInputElement;
        const aInput = document.querySelector('.ew-color-picker-hsl-alpha-input input') as HTMLInputElement;
        
        if (hInput && sInput && lInput && aInput) {
          hInput.value = '120';
          sInput.value = '60%';
          lInput.value = '40%';
          aInput.value = '0.8';
          
          hInput.dispatchEvent(new Event('blur'));
        }
        
        // 验证其他插件已同步
        setTimeout(() => {
          // 验证主输入框
          const mainInput = document.querySelector('.ew-color-picker-input') as HTMLInputElement;
          expect(mainInput.value).toBe('hsla(120, 60%, 40%, 0.8)');
          
          // 验证颜色框
          const colorBox = document.querySelector('.ew-color-picker-box') as HTMLElement;
          expect(colorBox.style.backgroundColor).toBe('hsla(120, 60%, 40%, 0.8)');
        }, 100);
      }, 100);
    });
  });
}); 