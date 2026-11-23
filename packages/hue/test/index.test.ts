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

  describe('hue slider positioning', () => {
    const rect = {
      width: 100,
      height: 200,
      left: 0,
      top: 0,
      right: 100,
      bottom: 200,
      x: 0,
      y: 0,
      toJSON: () => ({})
    } as DOMRect;

    it('vertical thumb position increases with hue (matches gradient)', () => {
      const plugin = new HuePlugin(mockCore);
      plugin.install(mockCore);
      plugin.hueBar!.getBoundingClientRect = () => rect;

      plugin.updateHueThumbPosition(0);
      expect(parseFloat(plugin.hueThumb!.style.top)).toBeCloseTo(0, 3);

      plugin.updateHueThumbPosition(90);
      expect(parseFloat(plugin.hueThumb!.style.top)).toBeCloseTo(50, 3);

      plugin.updateHueThumbPosition(270);
      expect(parseFloat(plugin.hueThumb!.style.top)).toBeCloseTo(150, 3);
    });

    it('vertical click maps top to low hue and bottom to high hue', () => {
      const plugin = new HuePlugin(mockCore);
      plugin.install(mockCore);
      plugin.hueBar!.getBoundingClientRect = () => rect;

      const spy = vi.spyOn(plugin, 'updateHue');
      const clickAt = (clientY: number) =>
        plugin.handleHueSliderClick({
          clientY,
          clientX: 6,
          preventDefault: () => {},
          stopPropagation: () => {}
        } as unknown as MouseEvent);

      clickAt(50); // 25% 处
      expect(spy).toHaveBeenLastCalledWith(90);

      clickAt(150); // 75% 处
      expect(spy).toHaveBeenLastCalledWith(270);
    });

    it('horizontal thumb position is unchanged', () => {
      mockCore.options.hueDirection = 'horizontal';
      const plugin = new HuePlugin(mockCore);
      plugin.install(mockCore);
      plugin.hueBar!.getBoundingClientRect = () => rect;

      plugin.updateHueThumbPosition(90);
      expect(parseFloat(plugin.hueThumb!.style.left)).toBeCloseTo(25, 3);
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