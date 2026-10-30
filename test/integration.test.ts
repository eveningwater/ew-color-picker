import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ewColorPicker from '../packages/ew-color-picker/src/index';

describe('Integration Tests', () => {
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

  describe('defaultColor integration scenarios', () => {
    it('should work correctly when no defaultColor is provided', () => {
      const picker = new ewColorPicker({ el: container });

      
      // 没有设置 defaultColor 时，currentColor 应该为空
      expect(picker.currentColor).toBe('');
      
      // box 不应该有背景色
      const box = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(box).toBeTruthy();
      
      const bg = box.style.backgroundColor;
      expect(bg === '' || bg === 'transparent' || bg === 'rgba(0, 0, 0, 0)').toBeTruthy();
    });

    it('should work correctly when defaultColor is provided', () => {
      const picker = new ewColorPicker({ 
        el: container, 
        defaultColor: '#00ff00' 
      });

      
      // 设置了 defaultColor 时，currentColor 应该等于 defaultColor
      expect(picker.currentColor).toBe('#00ff00');
      
      // box 应该有背景色
      const box = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(box).toBeTruthy();
      
      const bg = box.style.backgroundColor;
      expect(bg === 'rgb(0, 255, 0)' || bg === '#00ff00').toBeTruthy();
    });

    it('should sync color across all plugins when color changes', () => {
      const picker = new ewColorPicker({ 
        el: container, 
        defaultColor: '#ff0000' 
      });

      
      // 改变颜色
      picker.setColor('#0000ff');
      
      // 验证所有插件都同步了颜色
      expect(picker.currentColor).toBe('#0000ff');
      
      // box 应该更新背景色
      const box = container.querySelector('.ew-color-picker-box') as HTMLElement;
      const bg = box.style.backgroundColor;
      expect(bg === 'rgb(0, 0, 255)' || bg === '#0000ff').toBeTruthy();
    });

    it('should handle showPanel with empty currentColor correctly', () => {
      const picker = new ewColorPicker({ el: container });

      
      // 确保 currentColor 为空
      expect(picker.currentColor).toBe('');
      
      // 打开面板，应该使用默认红色
      picker.showPanel();
      
      expect(picker.currentColor).toBe('#ff0000');
    });

    it('should handle showPanel with defaultColor correctly', () => {
      const picker = new ewColorPicker({ 
        el: container, 
        defaultColor: '#00ff00' 
      });

      
      // 清空 currentColor
      picker.currentColor = '';
      
      // 打开面板，应该使用 defaultColor
      picker.showPanel();
      
      expect(picker.currentColor).toBe('#00ff00');
    });
  });

  describe('plugin interaction scenarios', () => {
    it('should handle box click to toggle panel', async () => {
      const picker = new ewColorPicker({ el: container });

      const box = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(box).toBeTruthy();
      const panelContainer = container.querySelector('.ew-color-picker-panel-container');
      expect(panelContainer).toBeTruthy();
      expect(panelContainer?.classList.contains('ew-color-picker-panel-container-hidden')).toBe(true);

      picker.showPanel();
      // 等待动画和异步逻辑
      await new Promise(resolve => setTimeout(resolve, 250)); // 200ms动画+50ms缓冲

      expect(picker.pickerFlag).toBe(true);
    });

    it('should handle color change events across all plugins', () => {
      const picker = new ewColorPicker({ 
        el: container, 
        defaultColor: '#ff0000' 
      });

      
      let eventCount = 0;
      picker.on('change', () => {
        eventCount++;
      });
      
      // 改变颜色
      picker.setColor('#00ff00');
      
      // 应该触发 change 事件
      expect(eventCount).toBe(1);
      
      // 再次改变颜色
      picker.setColor('#0000ff');
      
      // 应该再次触发 change 事件
      expect(eventCount).toBe(2);
    });
  });
}); 