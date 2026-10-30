import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ewColorPicker from '../../core/src/index';

describe('Clear Button Logic Tests', () => {
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

  describe('Clear Button with defaultColor', () => {
    it('should reset to defaultColor when defaultColor is configured', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true,
        hue: true,
        alpha: true,
        defaultColor: '#00ff00', // 绿色
        openChangeColorMode: true
      });

      // 设置一个不同的颜色
      picker.setColor('#ff0000');

      // 验证初始颜色
      expect(picker.getColor()).toBe('#ff0000');

      // 模拟清空按钮点击
      const clearButton = container.querySelector('.ew-color-picker-clear-btn') as HTMLButtonElement;
      if (clearButton) {
        clearButton.click();
        
        // 验证颜色已重置为 defaultColor
        expect(picker.getColor()).toBe('#00ff00');
        
        // 验证面板已关闭
        expect(picker.pickerFlag).toBe(false);
      }
    });

    it('should reset to defaultColor with alpha when alpha is enabled', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true,
        hue: true,
        alpha: true,
        defaultColor: 'rgba(0, 255, 0, 0.5)', // 半透明绿色
        openChangeColorMode: true
      });

      // 设置一个不同的颜色
      picker.setColor('#ff0000');

      // 模拟清空按钮点击
      const clearButton = container.querySelector('.ew-color-picker-clear-btn') as HTMLButtonElement;
      if (clearButton) {
        clearButton.click();
        
        // 验证颜色已重置为 defaultColor
        expect(picker.getColor()).toBe('rgba(0, 255, 0, 0.5)');
        
        // 验证 HSVA 颜色已同步
        const hsva = picker.getHsvaColor();
        expect(hsva.h).toBe(120); // 绿色
        expect(hsva.a).toBe(0.5); // 半透明
      }
    });
  });

  describe('Clear Button without defaultColor', () => {
    it('should reset to empty string when no defaultColor is configured', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true,
        hue: true,
        alpha: false, // 不启用 alpha
        openChangeColorMode: true
      });

      // 设置一个不同的颜色
      picker.setColor('#00ff00');

      // 模拟清空按钮点击
      const clearButton = container.querySelector('.ew-color-picker-clear-btn') as HTMLButtonElement;
      if (clearButton) {
        clearButton.click();
        
        // 验证颜色已清空
        expect(picker.getColor()).toBe('');
        
        // 验证主输入框已清空
        const mainInput = container.querySelector('.ew-color-picker-input') as HTMLInputElement;
        if (mainInput) {
          expect(mainInput.value).toBe('');
        }
        // 验证颜色框已清空
        const colorBox = container.querySelector('.ew-color-picker-box') as HTMLElement;
        if (colorBox) {
          expect(colorBox.style.backgroundColor).toBe('');
        }
        // 验证面板已关闭
        expect(picker.pickerFlag).toBe(false);
      }
    });

    it('should reset to default red with alpha when alpha is enabled', () => {
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true,
        hue: true,
        alpha: true, // 启用 alpha
        openChangeColorMode: true
      });

      // 设置一个不同的颜色
      picker.setColor('#00ff00');

      // 模拟清空按钮点击
      const clearButton = container.querySelector('.ew-color-picker-clear-btn') as HTMLButtonElement;
      if (clearButton) {
        clearButton.click();
        
        // 验证颜色已重置为默认红色（带 alpha）
        expect(picker.getColor()).toBe('rgba(255, 0, 0, 1)');
      }
    });
  });

  describe('Clear Button Panel Behavior', () => {
    it('should automatically close panel when clear button is clicked', async () => {
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

      // 打开面板并等待动画完成
      picker.showPanel();
      
      // 等待面板完全打开
      await new Promise(resolve => setTimeout(resolve, 300));
      
      expect(picker.pickerFlag).toBe(true);

      // 模拟清空按钮点击
      const clearButton = container.querySelector('.ew-color-picker-clear-btn') as HTMLButtonElement;
      if (clearButton) {
        clearButton.click();
        
        // 等待面板关闭动画完成
        await new Promise(resolve => setTimeout(resolve, 300));
        
        // 验证面板已关闭
        expect(picker.pickerFlag).toBe(false);
      }
    });
  });

  describe('Clear Button Plugin Synchronization', () => {
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
        defaultColor: '#00ff00',
        openChangeColorMode: true
      });

      // 设置一个不同的颜色
      picker.setColor('#ff0000');

      // 模拟清空按钮点击
      const clearButton = container.querySelector('.ew-color-picker-clear-btn') as HTMLButtonElement;
      if (clearButton) {
        clearButton.click();
        
        // 验证主输入框已更新
        const mainInput = container.querySelector('.ew-color-picker-input') as HTMLInputElement;
        if (mainInput) {
          expect(mainInput.value).toBe('#00ff00');
        }
        
        // 验证颜色框已更新
        const colorBox = container.querySelector('.ew-color-picker-box') as HTMLElement;
        if (colorBox) {
          expect(colorBox.style.backgroundColor).toBe('rgb(0, 255, 0)');
        }
      }
    });
  });

  describe('Clear Button Event Handling', () => {
    it('should trigger clear event and callback', () => {
      const clearCallback = vi.fn();
      const clearEventSpy = vi.fn();
      
      const picker = new ewColorPicker({
        el: container,
        hasBox: true,
        hasPanel: true,
        hasInput: true,
        hasClear: true,
        hasSure: true,
        clear: clearCallback,
        openChangeColorMode: true
      });

      // 监听 clear 事件
      picker.on('clear', clearEventSpy);

      // 模拟清空按钮点击
      const clearButton = container.querySelector('.ew-color-picker-clear-btn') as HTMLButtonElement;
      if (clearButton) {
        clearButton.click();
        
        // 验证回调被调用
        expect(clearCallback).toHaveBeenCalledWith(picker);
        
        // 验证事件被触发
        expect(clearEventSpy).toHaveBeenCalled();
      }
    });
  });
}); 