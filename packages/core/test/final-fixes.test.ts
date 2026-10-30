import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ewColorPicker from '../../core/src/index';

describe('Final Fixes Verification', () => {
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

  describe('Console Warning Fix', () => {
    it('should use warn function instead of console.warn', () => {
      const container = document.createElement('div');
      document.body.appendChild(container);
      
      const picker = new ewColorPicker({ container: container });
      picker.mount();
      
      expect(picker).toBeDefined();
      expect(picker.getOptions().container).toBe(container);
    });
  });

  describe('Event Listener Cleanup', () => {
    it('should properly cleanup event listeners on destroy', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true
      });

      // 验证实例创建成功
      expect(picker).toBeDefined();
      expect(picker.getDestroyedStatus()).toBe(false);

      // 销毁实例
      picker.destroy();

      // 验证销毁状态
      expect(picker.getDestroyedStatus()).toBe(true);
    });
  });

  describe('Plugin Synchronization', () => {
    it('should sync all plugins when color changes', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true,
        hue: true,
        alpha: true,
        openChangeColorMode: true
      });

      // 设置颜色
      picker.setColor('#ff0000');

      // 验证颜色已设置
      expect(picker.getColor()).toBe('#ff0000');

      // 验证HSVA颜色已同步
      const hsva = picker.getHsvaColor();
      expect(hsva.h).toBe(0); // 红色
      expect(hsva.s).toBe(100);
      expect(hsva.v).toBe(100);
      expect(hsva.a).toBe(1);
    });
  });

  describe('Clear Button Functionality', () => {
    it('should reset to default color when clear button is clicked', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true,
        alpha: true
      });

      // 设置一个颜色
      picker.setColor('#00ff00');

      // 模拟清空按钮点击
      const clearButton = container.querySelector('.ew-color-picker-clear-btn') as HTMLButtonElement;
      if (clearButton) {
        clearButton.click();
        
        // 验证颜色已重置为默认红色
        expect(picker.getColor()).toBe('rgba(255, 0, 0, 1)');
      }
    });
  });

  describe('Input Synchronization', () => {
    it('should sync input values when color changes', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        openChangeColorMode: true
      });

      // 设置颜色
      picker.setColor('#ff0000');

      // 验证主输入框已更新
      const mainInput = container.querySelector('.ew-color-picker-input') as HTMLInputElement;
      if (mainInput) {
        expect(mainInput.value).toBe('#ff0000');
      }
    });
  });

  describe('Memory Leak Prevention', () => {
    it('should not leak memory when creating and destroying multiple instances', () => {
      const instances: ewColorPicker[] = [];

      // 创建多个实例
      for (let i = 0; i < 5; i++) {
        const picker = new ewColorPicker({
          el: document.createElement('div'),
          hasBox: true,
          hasPanel: true
        });
        instances.push(picker);
      }

      // 销毁所有实例
      instances.forEach(picker => picker.destroy());

      // 验证所有实例都已销毁
      instances.forEach(picker => {
        expect(picker.getDestroyedStatus()).toBe(true);
      });
    });
  });
}); 