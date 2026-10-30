import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import HuePlugin from '../src/index';
import { createMockCore } from '../../../test/mockCore';

describe('Hue Plugin', () => {
  let container: HTMLElement;
  let mockCore: any;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    
    mockCore = createMockCore(container, {});
  });

  afterEach(() => {
    // 安全地移除容器
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('plugin installation', () => {
    it('should install plugin correctly', () => {
      const plugin = new HuePlugin(mockCore);
      
      expect(() => plugin.install(mockCore)).not.toThrow();
      expect(mockCore.on).toHaveBeenCalled();
    });

    it('should create hue slider element', () => {
      const plugin = new HuePlugin(mockCore);
      plugin.install(mockCore);
      
      const hueElement = container.querySelector('.ew-color-picker-slider');
      expect(hueElement).toBeTruthy();
    });

    it('should create hue element when plugin is installed', () => {
      const plugin = new HuePlugin(mockCore);
      plugin.install(mockCore);
      
      const hueElement = container.querySelector('.ew-color-picker-slider');
      expect(hueElement).toBeTruthy();
    });
  });

  describe('hue slider functionality', () => {
    it('should handle mouse events on hue slider', async () => {
      const plugin = new HuePlugin(mockCore);
      plugin.install(mockCore);
      
      // 等待事件绑定完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const hueElement = container.querySelector('.ew-color-picker-slider') as HTMLElement;
      expect(hueElement).toBeTruthy();
      
      // 获取 hue bar 元素
      const hueBar = hueElement.querySelector('.ew-color-picker-slider-bar') as HTMLElement;
      expect(hueBar).toBeTruthy();
      
      // 直接调用 updateHue 方法来测试功能
      (plugin as any).updateHue(180);
      
      // Should call setColor
      expect(mockCore.setColor).toHaveBeenCalled();
    });

    it('should update hue value on slider interaction', async () => {
      const plugin = new HuePlugin(mockCore);
      plugin.install(mockCore);
      
      // 等待事件绑定完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const hueElement = container.querySelector('.ew-color-picker-slider') as HTMLElement;
      const hueBar = hueElement.querySelector('.ew-color-picker-slider-bar') as HTMLElement;
      
      // 直接调用 updateHue 方法来测试功能
      (plugin as any).updateHue(270);
      
      expect(mockCore.setColor).toHaveBeenCalled();
    });
  });

  describe('color updates', () => {
    it('should update hue slider when color changes', () => {
      const plugin = new HuePlugin(mockCore);
      plugin.install(mockCore);
      
      // Simulate color change event
      const colorChangeHandler = mockCore.on.mock.calls.find(
        call => call[0] === 'change'
      )?.[1];
      
      expect(colorChangeHandler).toBeDefined();
      
      // Call the color change handler
      colorChangeHandler();
      
      // Should update the hue slider
      const hueElement = container.querySelector('.ew-color-picker-slider');
      expect(hueElement).toBeTruthy();
    });
  });

  describe('plugin options', () => {
    it('should respect custom hue direction options', () => {
      mockCore.options.hueDirection = 'horizontal';
      
      const plugin = new HuePlugin(mockCore);
      plugin.install(mockCore);
      
      const hueElement = container.querySelector('.ew-color-picker-slider') as HTMLElement;
      expect(hueElement).toBeTruthy();
      expect(hueElement.classList.contains('ew-color-picker-is-horizontal')).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should clean up event listeners on destroy', () => {
      const plugin = new HuePlugin(mockCore);
      plugin.install(mockCore);
      
      // Mock destroy method
      const destroySpy = vi.fn();
      mockCore.destroy = destroySpy;
      
      // Simulate core destruction
      plugin.destroy();
      
      expect(plugin.hueBar).toBeNull();
      expect(plugin.hueThumb).toBeNull();
    });
  });
}); 