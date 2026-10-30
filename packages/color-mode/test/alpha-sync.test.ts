import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ewColorPicker from '../../core/src/index';
import { createMockCore } from '../../../test/setup';

describe('Color Mode Plugin - Alpha Synchronization', () => {
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

  describe('RGBA Alpha Input Sync', () => {
    it('should sync alpha input with alpha slider when alpha input changes', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultMode: 'rgb'
      });

      // 等待插件初始化
      setTimeout(() => {
        // 查找 alpha 输入框
        const alphaInputWrap = document.querySelector('.ew-color-picker-rgb-alpha-input') as HTMLElement;
        const alphaInput = alphaInputWrap?.querySelector('input') as HTMLInputElement;
        
        expect(alphaInput).toBeTruthy();
        
        // 设置 alpha 输入框的值为 0.5
        alphaInput.value = '0.5';
        alphaInput.dispatchEvent(new Event('input'));
        alphaInput.dispatchEvent(new Event('blur'));
        
        // 验证 alpha 滑块位置已更新
        const alphaThumb = document.querySelector('.ew-color-picker-alpha-slider-thumb') as HTMLElement;
        expect(alphaThumb).toBeTruthy();
        
        // 验证当前颜色的 alpha 值
        const currentColor = picker.getColor();
        expect(currentColor).toContain('0.5');
      }, 100);
    });

    it('should sync alpha slider with alpha input when alpha slider changes', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultMode: 'rgb'
      });

      // 等待插件初始化
      setTimeout(() => {
        // 查找 alpha 滑块
        const alphaBar = document.querySelector('.ew-color-picker-alpha-slider-bar') as HTMLElement;
        expect(alphaBar).toBeTruthy();
        
        // 模拟点击 alpha 滑块中间位置
        const rect = alphaBar.getBoundingClientRect();
        const clickEvent = new MouseEvent('click', {
          clientX: rect.left + rect.width / 2,
          clientY: rect.top + rect.height / 2
        });
        alphaBar.dispatchEvent(clickEvent);
        
        // 验证 alpha 输入框的值已更新
        const alphaInputWrap = document.querySelector('.ew-color-picker-rgb-alpha-input') as HTMLElement;
        const alphaInput = alphaInputWrap?.querySelector('input') as HTMLInputElement;
        
        // 等待更新
        setTimeout(() => {
          const alphaValue = parseFloat(alphaInput.value);
          expect(alphaValue).toBeCloseTo(0.5, 1);
        }, 50);
      }, 100);
    });
  });

  describe('HSLA Alpha Input Sync', () => {
    it('should sync alpha input with alpha slider when alpha input changes in HSL mode', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultMode: 'hsl'
      });

      // 等待插件初始化
      setTimeout(() => {
        // 查找 alpha 输入框
        const alphaInputWrap = document.querySelector('.ew-color-picker-hsl-alpha-input') as HTMLElement;
        const alphaInput = alphaInputWrap?.querySelector('input') as HTMLInputElement;
        
        expect(alphaInput).toBeTruthy();
        
        // 设置 alpha 输入框的值为 0.3
        alphaInput.value = '0.3';
        alphaInput.dispatchEvent(new Event('input'));
        alphaInput.dispatchEvent(new Event('blur'));
        
        // 验证 alpha 滑块位置已更新
        const alphaThumb = document.querySelector('.ew-color-picker-alpha-slider-thumb') as HTMLElement;
        expect(alphaThumb).toBeTruthy();
        
        // 验证当前颜色的 alpha 值
        const currentColor = picker.getColor();
        expect(currentColor).toContain('0.3');
      }, 100);
    });

    it('should sync alpha slider with alpha input when alpha slider changes in HSL mode', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultMode: 'hsl'
      });

      // 等待插件初始化
      setTimeout(() => {
        // 查找 alpha 滑块
        const alphaBar = document.querySelector('.ew-color-picker-alpha-slider-bar') as HTMLElement;
        expect(alphaBar).toBeTruthy();
        
        // 模拟点击 alpha 滑块顶部位置（alpha = 0）
        const rect = alphaBar.getBoundingClientRect();
        const clickEvent = new MouseEvent('click', {
          clientX: rect.left + rect.width / 2,
          clientY: rect.top
        });
        alphaBar.dispatchEvent(clickEvent);
        
        // 验证 alpha 输入框的值已更新
        const alphaInputWrap = document.querySelector('.ew-color-picker-hsl-alpha-input') as HTMLElement;
        const alphaInput = alphaInputWrap?.querySelector('input') as HTMLInputElement;
        
        // 等待更新
        setTimeout(() => {
          const alphaValue = parseFloat(alphaInput.value);
          expect(alphaValue).toBeCloseTo(0, 1);
        }, 50);
      }, 100);
    });
  });

  describe('Mode Switching Alpha Sync', () => {
    it('should maintain alpha sync when switching between RGB and HSL modes', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultMode: 'rgb'
      });

      // 等待插件初始化
      setTimeout(() => {
        // 在 RGB 模式下设置 alpha 为 0.7
        const rgbAlphaInputWrap = document.querySelector('.ew-color-picker-rgb-alpha-input') as HTMLElement;
        const rgbAlphaInput = rgbAlphaInputWrap?.querySelector('input') as HTMLInputElement;
        rgbAlphaInput.value = '0.7';
        rgbAlphaInput.dispatchEvent(new Event('input'));
        rgbAlphaInput.dispatchEvent(new Event('blur'));
        
        // 切换到 HSL 模式
        const downButton = document.querySelector('.ew-color-picker-mode-down-btn') as HTMLButtonElement;
        downButton.click();
        
        // 等待模式切换
        setTimeout(() => {
          // 验证 HSL 模式下的 alpha 输入框值
          const hslAlphaInputWrap = document.querySelector('.ew-color-picker-hsl-alpha-input') as HTMLElement;
          const hslAlphaInput = hslAlphaInputWrap?.querySelector('input') as HTMLInputElement;
          const alphaValue = parseFloat(hslAlphaInput.value);
          expect(alphaValue).toBeCloseTo(0.7, 1);
          
          // 验证 alpha 滑块位置
          const alphaThumb = document.querySelector('.ew-color-picker-alpha-slider-thumb') as HTMLElement;
          expect(alphaThumb).toBeTruthy();
        }, 100);
      }, 100);
    });
  });
}); 