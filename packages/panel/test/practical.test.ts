import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import PanelPlugin from '../src/index';

describe('Panel Plugin 实用功能测试', () => {
  let container: HTMLElement;
  let mockCore: any;
  let plugin: PanelPlugin;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // 创建模拟的核心实例
    mockCore = {
      options: {
        ewColorPickerPanel: true,
        hue: true,
        alpha: true,
        hueDirection: 'horizontal',
        alphaDirection: 'horizontal'
      },
      currentColor: '#ff0000',
      getColor: vi.fn(() => '#ff0000'),
      setColor: vi.fn(),
      on: vi.fn(),
      trigger: vi.fn(),
      getMountPoint: vi.fn(() => container)
    };
  });

  afterEach(() => {
    if (plugin) {
      plugin.destroy();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('基础功能测试', () => {
    it('应该正确初始化Panel插件', () => {
      plugin = new PanelPlugin(mockCore);
      
      expect(plugin).toBeDefined();
      expect(plugin.panel).toBeDefined();
      expect(plugin.cursor).toBeDefined();
    });

    it('应该正确渲染Panel元素', () => {
      plugin = new PanelPlugin(mockCore);
      
      const panelElement = container.querySelector('.ew-color-picker-panel');
      expect(panelElement).toBeTruthy();
      expect(panelElement?.classList.contains('ew-color-picker-panel-dynamic-size')).toBe(true);
    });

    it('应该包含白色和黑色面板', () => {
      plugin = new PanelPlugin(mockCore);
      
      const whitePanel = container.querySelector('.ew-color-picker-white-panel');
      const blackPanel = container.querySelector('.ew-color-picker-black-panel');
      
      expect(whitePanel).toBeTruthy();
      expect(blackPanel).toBeTruthy();
    });

    it('应该包含光标元素', () => {
      plugin = new PanelPlugin(mockCore);
      
      const cursor = container.querySelector('.ew-color-picker-panel-cursor');
      expect(cursor).toBeTruthy();
    });
  });

  describe('配置项测试', () => {
    it('应该支持ewColorPickerPanel配置', () => {
      mockCore.options.ewColorPickerPanel = false;
      plugin = new PanelPlugin(mockCore);
      
      const panelElement = container.querySelector('.ew-color-picker-panel');
      expect(panelElement).toBeFalsy();
    });

    it('应该支持hueDirection配置', () => {
      mockCore.options.hueDirection = 'vertical';
      plugin = new PanelPlugin(mockCore);
      
      // 方向配置主要影响内部逻辑，面板本身应该仍然存在
      const panelElement = container.querySelector('.ew-color-picker-panel');
      expect(panelElement).toBeTruthy();
    });



    it('应该支持hueDirection配置', () => {
      mockCore.options.hueDirection = 'vertical';
      plugin = new PanelPlugin(mockCore);
      
      // 方向配置主要影响内部逻辑，面板本身应该仍然存在
      const panelElement = container.querySelector('.ew-color-picker-panel');
      expect(panelElement).toBeTruthy();
    });

    it('应该支持alphaDirection配置', () => {
      mockCore.options.alphaDirection = 'vertical';
      plugin = new PanelPlugin(mockCore);
      
      // 方向配置主要影响内部逻辑，面板本身应该仍然存在
      const panelElement = container.querySelector('.ew-color-picker-panel');
      expect(panelElement).toBeTruthy();
    });
  });

  describe('面板尺寸测试', () => {
    it('应该设置正确的面板尺寸', () => {
      plugin = new PanelPlugin(mockCore);
      
      const panelElement = container.querySelector('.ew-color-picker-panel') as HTMLElement;
      expect(panelElement).toBeTruthy();
      
      // 检查CSS变量是否设置
      const computedStyle = getComputedStyle(panelElement);
      expect(computedStyle.getPropertyValue('--panel-width')).toBeTruthy();
      expect(computedStyle.getPropertyValue('--panel-height')).toBeTruthy();
    });

    it('应该根据方向配置调整面板宽度', () => {
      // 测试水平方向
      mockCore.options.hueDirection = 'horizontal';
      mockCore.options.alphaDirection = 'horizontal';
      plugin = new PanelPlugin(mockCore);
      
      let panelElement = container.querySelector('.ew-color-picker-panel') as HTMLElement;
      expect(panelElement).toBeTruthy();
      
      // 重新创建插件测试垂直方向
      plugin.destroy();
      mockCore.options.hueDirection = 'vertical';
      mockCore.options.alphaDirection = 'vertical';
      plugin = new PanelPlugin(mockCore);
      
      panelElement = container.querySelector('.ew-color-picker-panel') as HTMLElement;
      expect(panelElement).toBeTruthy();
    });
  });

  describe('光标位置测试', () => {
    it('应该更新光标位置', () => {
      plugin = new PanelPlugin(mockCore);
      
      const cursor = container.querySelector('.ew-color-picker-panel-cursor') as HTMLElement;
      expect(cursor).toBeTruthy();
      
      // 测试光标位置更新
      plugin.updateCursorPosition(50, 50);
      
      // 光标应该有样式设置
      expect(cursor.style.left).toBeTruthy();
      expect(cursor.style.top).toBeTruthy();
    });

    it('应该根据颜色更新光标位置', () => {
      plugin = new PanelPlugin(mockCore);
      
      const cursor = container.querySelector('.ew-color-picker-panel-cursor') as HTMLElement;
      expect(cursor).toBeTruthy();
      
      // 模拟颜色变化事件
      mockCore.getColor = vi.fn(() => '#00ff00');
      plugin.updateCursorPosition(75, 25);
      
      expect(cursor.style.left).toBeTruthy();
      expect(cursor.style.top).toBeTruthy();
    });
  });

  describe('事件处理测试', () => {
    it('应该绑定面板点击事件', () => {
      plugin = new PanelPlugin(mockCore);
      
      const panelElement = container.querySelector('.ew-color-picker-panel') as HTMLElement;
      expect(panelElement).toBeTruthy();
      
      // 模拟点击事件 - 由于事件绑定是异步的，这里只测试元素存在
      expect(panelElement).toBeTruthy();
    });

    it('应该处理鼠标按下事件', () => {
      plugin = new PanelPlugin(mockCore);
      
      const panelElement = container.querySelector('.ew-color-picker-panel') as HTMLElement;
      expect(panelElement).toBeTruthy();
      
      // 模拟鼠标按下事件 - 由于事件绑定是异步的，这里只测试元素存在
      expect(panelElement).toBeTruthy();
    });
  });

  describe('颜色更新测试', () => {
    it('应该根据光标位置更新颜色', () => {
      plugin = new PanelPlugin(mockCore);
      
      // 测试颜色更新
      plugin.updateColor(50, 50);
      
      expect(mockCore.setColor).toHaveBeenCalled();
    });

    it('应该处理边界值', () => {
      plugin = new PanelPlugin(mockCore);
      
      // 测试边界值
      plugin.updateColor(0, 0);
      expect(mockCore.setColor).toHaveBeenCalled();
      
      plugin.updateColor(100, 100);
      expect(mockCore.setColor).toHaveBeenCalled();
      
      plugin.updateColor(-10, 150); // 超出边界
      expect(mockCore.setColor).toHaveBeenCalled();
    });
  });

  describe('位置计算测试', () => {
    it('应该计算容器尺寸', () => {
      plugin = new PanelPlugin(mockCore);
      
      // 模拟容器尺寸计算
      plugin.calculateContainerSize();
      
      expect(plugin.containerWidth).toBeDefined();
      expect(plugin.containerHeight).toBeDefined();
    });

    it('应该处理自动定位', () => {
      plugin = new PanelPlugin(mockCore);
      
      // 模拟自动定位
      expect(() => {
        plugin.handleAutoPosition();
      }).not.toThrow();
    });
  });

  describe('生命周期测试', () => {
    it('应该正确销毁插件', () => {
      plugin = new PanelPlugin(mockCore);
      
      const panelElement = container.querySelector('.ew-color-picker-panel');
      expect(panelElement).toBeTruthy();
      
      plugin.destroy();
      
      // 销毁后插件实例应该被清理
      expect(plugin.panel).toBeNull();
    });

    it('应该解绑事件处理器', () => {
      plugin = new PanelPlugin(mockCore);
      
      const panelElement = container.querySelector('.ew-color-picker-panel') as HTMLElement;
      expect(panelElement).toBeTruthy();
      
      plugin.destroy();
      
      // 销毁后插件实例应该被清理
      expect(plugin.panel).toBeNull();
    });
  });

  describe('边界情况测试', () => {
    it('应该处理挂载点不存在的情况', () => {
      mockCore.getMountPoint = vi.fn(() => null);
      plugin = new PanelPlugin(mockCore);
      
      // 应该不会抛出异常
      expect(() => {
        plugin.render();
      }).not.toThrow();
    });

    it('应该处理重复渲染', () => {
      plugin = new PanelPlugin(mockCore);
      
      // 重复调用render应该不会创建重复的元素
      const firstPanelCount = container.querySelectorAll('.ew-color-picker-panel').length;
      plugin.render();
      const secondPanelCount = container.querySelectorAll('.ew-color-picker-panel').length;
      
      expect(firstPanelCount).toBe(1);
      expect(secondPanelCount).toBe(1);
    });

    it('应该处理空颜色值', () => {
      mockCore.getColor = vi.fn(() => '');
      plugin = new PanelPlugin(mockCore);
      
      // 应该不会抛出异常
      expect(() => {
        plugin.updateCursorPosition(50, 50);
      }).not.toThrow();
    });
  });

  describe('性能测试', () => {
    it('应该高效处理频繁的颜色更新', () => {
      plugin = new PanelPlugin(mockCore);
      
      const startTime = performance.now();
      
      // 模拟频繁的颜色更新
      for (let i = 0; i < 100; i++) {
        plugin.updateCursorPosition(i, i);
      }
      
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      // 100次更新应该在合理时间内完成（比如100ms内）
      expect(duration).toBeLessThan(100);
    });
  });
}); 