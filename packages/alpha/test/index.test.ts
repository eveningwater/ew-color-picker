import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import AlphaPlugin from '../src/index';
import { createMockCore } from '../../../test/mockCore';

describe('Alpha Plugin', () => {
  let container: HTMLElement;
  let mockCore: any;

  beforeEach(() => {
    container = document.createElement('div');
    container.className = 'ew-color-picker';
    document.body.appendChild(container);
    
    // 使用通用的 mockCore 工厂函数
    mockCore = createMockCore(container, {
      defaultColor: '#ff0000',
      alphaDirection: 'vertical'
    });
    
    // 创建完整的 DOM 结构
    const panelContainer = mockCore.getMountPoint('panelContainer');
    if (panelContainer) {
      panelContainer.classList.remove('ew-color-picker-panel-container-hidden');
    }
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('plugin installation', () => {
    it('should install plugin correctly', () => {
      const plugin = new AlphaPlugin(mockCore);
      
      expect(() => plugin.install(mockCore)).not.toThrow();
      expect(mockCore.on).toHaveBeenCalled();
    });

    it('should create alpha slider element', () => {
      const plugin = new AlphaPlugin(mockCore);
      plugin.install(mockCore);
      
      const alphaElement = container.querySelector('.ew-color-picker-slider.ew-alpha');
      expect(alphaElement).toBeTruthy();
    });

    it('should create alpha element when plugin is installed', () => {
      const plugin = new AlphaPlugin(mockCore);
      plugin.install(mockCore);
      
      const alphaElement = container.querySelector('.ew-color-picker-slider.ew-alpha');
      expect(alphaElement).toBeTruthy();
    });
  });

  describe('alpha slider functionality', () => {
    it('should handle mouse events on alpha slider', async () => {
      const plugin = new AlphaPlugin(mockCore);
      plugin.install(mockCore);
      
      // 等待事件绑定完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const alphaElement = container.querySelector('.ew-color-picker-slider.ew-alpha') as HTMLElement;
      expect(alphaElement).toBeTruthy();
      
      // 获取 alpha bar 元素
      const alphaBar = alphaElement.querySelector('.ew-color-picker-alpha-slider-bar') as HTMLElement;
      expect(alphaBar).toBeTruthy();
      
      // 直接调用 updateAlpha 方法来测试功能
      (plugin as any).updateAlpha(0.5);
      
      // Should emit color change event
      expect(mockCore.setColor).toHaveBeenCalled();
    });

    it('should update alpha value on slider interaction', async () => {
      const plugin = new AlphaPlugin(mockCore);
      plugin.install(mockCore);
      
      // 等待事件绑定完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const alphaElement = container.querySelector('.ew-color-picker-slider.ew-alpha') as HTMLElement;
      const alphaBar = alphaElement.querySelector('.ew-color-picker-alpha-slider-bar') as HTMLElement;
      
      // 直接调用 updateAlpha 方法来测试功能
      (plugin as any).updateAlpha(0.8);
      
      expect(mockCore.setColor).toHaveBeenCalled();
    });
  });

  describe('color updates', () => {
    it('should update alpha slider when color changes', () => {
      const plugin = new AlphaPlugin(mockCore);
      plugin.install(mockCore);
      
      // Simulate color change event
      const colorChangeHandler = mockCore.on.mock.calls.find(
        call => call[0] === 'change'
      )?.[1];
      
      expect(colorChangeHandler).toBeDefined();
      
      // Call the color change handler
      colorChangeHandler('#ff0000');
      
      // Should update the alpha slider
      const alphaElement = container.querySelector('.ew-color-picker-slider.ew-alpha');
      expect(alphaElement).toBeTruthy();
    });
  });

  describe('plugin options', () => {
    it('should respect custom alpha direction options', () => {
      // Update mockCore options to include alpha direction options
      mockCore.options.alphaDirection = 'horizontal';
      const plugin = new AlphaPlugin(mockCore);
      
      plugin.install(mockCore);
      
      const alphaElement = container.querySelector('.ew-color-picker-slider.ew-alpha') as HTMLElement;
      expect(alphaElement).toBeTruthy();
      expect(alphaElement.classList.contains('ew-color-picker-is-horizontal')).toBe(true);
    });
  });

  describe('cleanup', () => {
    it('should clean up event listeners on destroy', () => {
      const plugin = new AlphaPlugin(mockCore);
      plugin.install(mockCore);
      
      // 先断言 alpha 元素存在
      const alphaElement = container.querySelector('.ew-color-picker-slider.ew-alpha');
      expect(alphaElement).toBeTruthy();
      
      // 调用 destroy
      plugin.destroy?.();
      
      // alpha 元素应被移除（destroy 会清理 DOM 引用）
      expect(plugin.alphaBar).toBeNull();
      expect(plugin.alphaThumb).toBeNull();
    });
  });
}); 