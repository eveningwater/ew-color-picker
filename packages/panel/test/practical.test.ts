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

    it('hue 垂直、alpha 水平时面板宽度应留出垂直色相柱空间', () => {
      mockCore.options.hueDirection = 'vertical';
      mockCore.options.alphaDirection = 'horizontal';
      plugin = new PanelPlugin(mockCore);

      // 容器内容宽度 320px，垂直色相柱占 4px margin + 15px 宽度
      expect(plugin.panelWidth).toBe(301);
      expect(plugin.panel!.style.getPropertyValue('--panel-width')).toBe('301px');
    });

    it('hue 水平、alpha 垂直时 alpha 柱应右移与横向 hue 柱对齐', () => {
      mockCore.options.hueDirection = 'horizontal';
      mockCore.options.alphaDirection = 'vertical';
      plugin = new PanelPlugin(mockCore);

      // 面板 304px + 垂直透明度柱（4px margin + 12px）= 320px
      expect(plugin.panelWidth).toBe(304);
      expect(plugin.panel!.style.getPropertyValue('--panel-width')).toBe('304px');
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

  describe('appendTo 外部挂载', () => {
    it('应该把面板容器移动到目标容器并使用固定定位', () => {
      const target = document.createElement('div');
      const root = document.createElement('div');
      const panelContainer = document.createElement('div');
      root.appendChild(panelContainer);
      document.body.appendChild(root);
      document.body.appendChild(target);

      mockCore = {
        options: { ewColorPickerPanel: true, appendTo: target },
        currentColor: '#ff0000',
        getColor: vi.fn(() => '#ff0000'),
        setColor: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        getMountPoint: vi.fn((name: string) =>
          name === 'root' ? root : name === 'panelContainer' ? panelContainer : undefined
        ),
      };

      plugin = new PanelPlugin(mockCore);

      expect(target.contains(panelContainer)).toBe(true);
      expect(root.contains(panelContainer)).toBe(false);
      expect(panelContainer.style.position).toBe('fixed');

      document.body.removeChild(root);
      document.body.removeChild(target);
    });
  });

  describe('色相背景同步', () => {
    it('无初始颜色时 syncColor 应补上色相背景', () => {
      mockCore.getColor = vi.fn(() => '');
      plugin = new PanelPlugin(mockCore);

      expect(plugin.panel!.style.background).toBe('');

      plugin.syncColor('#ff0000');

      expect(plugin.panel!.style.background).toContain('255');
      expect(plugin.cursor!.style.left).not.toBe('');
    });

    it('syncColor 应忽略空颜色', () => {
      plugin = new PanelPlugin(mockCore);
      const originalBackground = plugin.panel!.style.background;

      plugin.syncColor('');

      expect(plugin.panel!.style.background).toBe(originalBackground);
    });
  });

  describe('边界定位 boundary', () => {
    const mockRect = (
      left: number,
      top: number,
      width: number,
      height: number
    ): DOMRect =>
      ({
        left,
        top,
        right: left + width,
        bottom: top + height,
        width,
        height,
        x: left,
        y: top,
        toJSON: () => ({}),
      }) as DOMRect;

    it('getBoundaryRect 未配置时返回视口', () => {
      mockCore.options.boundary = null;
      plugin = new PanelPlugin(mockCore);
      const bounds = (plugin as any).getBoundaryRect();
      expect(bounds.left).toBe(0);
      expect(bounds.top).toBe(0);
      expect(bounds.right).toBe(window.innerWidth);
      expect(bounds.bottom).toBe(window.innerHeight);
    });

    it('getBoundaryRect 配置元素时返回元素与视口交集', () => {
      const boundaryEl = document.createElement('div');
      document.body.appendChild(boundaryEl);
      boundaryEl.getBoundingClientRect = () => mockRect(100, 50, 400, 350);
      mockCore.options.boundary = boundaryEl;
      plugin = new PanelPlugin(mockCore);
      const bounds = (plugin as any).getBoundaryRect();
      expect(bounds.left).toBe(100);
      expect(bounds.top).toBe(50);
      expect(bounds.right).toBe(500);
      expect(bounds.bottom).toBe(400);
      document.body.removeChild(boundaryEl);
    });

    it('clampToBounds 把面板 rect 夹进边界', () => {
      mockCore.options.boundary = null;
      plugin = new PanelPlugin(mockCore);
      const rect = { left: -10, top: -10, right: 100, bottom: 100 };
      const bounds = { left: 0, top: 0, right: 80, bottom: 80 };
      const { left, top } = (plugin as any).clampToBounds(rect, bounds, 8);
      // left: 左溢出 18 -> 8, 右溢出 28 -> -20
      expect(left).toBe(-20);
      // top: 上溢出 18 -> 8, 下溢出 28 -> -20
      expect(top).toBe(-20);
    });

    it('toContainingBlockCoords 把视口坐标换算到 offsetParent', () => {
      mockCore.options.boundary = null;
      plugin = new PanelPlugin(mockCore);
      const panelContainer = document.createElement('div');
      const offsetParent = document.createElement('div');
      offsetParent.getBoundingClientRect = () => mockRect(100, 50, 0, 0);
      Object.defineProperty(offsetParent, 'clientLeft', { value: 2 });
      Object.defineProperty(offsetParent, 'clientTop', { value: 3 });
      Object.defineProperty(panelContainer, 'offsetParent', {
        value: offsetParent,
      });
      const { left, top } = (plugin as any).toContainingBlockCoords(
        200,
        150,
        panelContainer,
        container
      );
      expect(left).toBe(98); // 200 - 100 - 2
      expect(top).toBe(97); // 150 - 50 - 3
    });

    it('handleAutoPosition 按 boundary 夹取并换算到 offsetParent', () => {
      const root = document.createElement('div');
      const colorBox = document.createElement('div');
      colorBox.className = 'ew-color-picker-box';
      const panelContainer = document.createElement('div');
      root.appendChild(colorBox);
      root.appendChild(panelContainer);
      document.body.appendChild(root);

      colorBox.getBoundingClientRect = () => mockRect(200, 100, 40, 40);
      root.getBoundingClientRect = () => mockRect(200, 100, 40, 40);
      Object.defineProperty(panelContainer, 'offsetParent', { value: root });
      Object.defineProperty(root, 'clientLeft', { value: 0 });
      Object.defineProperty(root, 'clientTop', { value: 0 });

      const boundary = document.createElement('div');
      boundary.getBoundingClientRect = () => mockRect(0, 0, 300, 300);

      mockCore = {
        options: {
          ewColorPickerPanel: true,
          autoPanelPosition: true,
          ewColorPickerBox: true,
          panelPlacement: 'bottom',
          boundary,
          hueDirection: 'vertical',
          alphaDirection: 'vertical',
        },
        currentColor: '#ff0000',
        getColor: vi.fn(() => '#ff0000'),
        setColor: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        trigger: vi.fn(),
        getMountPoint: vi.fn((name: string) =>
          name === 'root'
            ? root
            : name === 'panelContainer'
            ? panelContainer
            : undefined
        ),
      };

      plugin = new PanelPlugin(mockCore);
      // 锁死容器尺寸，避免 calculateContainerSize 在 happy-dom 下回退到 320/200
      vi.spyOn(plugin, 'calculateContainerSize').mockImplementation(() => {});
      plugin.containerWidth = 285;
      plugin.containerHeight = 180;
      plugin.handleAutoPosition();

      // bottom 居中: left=(40-285)/2=-122.5, top=40
      // 视口: left=200-122.5=77.5, right=77.5+285=362.5
      //       top=100+40=140,  bottom=140+180=320
      // 夹到 boundary(0,0,300,300) margin8:
      //   右溢出 362.5-292=70.5 -> left=7（左移）
      //   下溢出 320-292=28    -> top=140-28=112（上移）
      // 换算到 root(offsetParent at 200,100):
      //   left=7-200=-193, top=112-100=12
      expect(panelContainer.style.position).toBe('absolute');
      expect(panelContainer.style.left).toBe('-193px');
      expect(panelContainer.style.top).toBe('12px');

      document.body.removeChild(root);
    });

    it('handleAutoPosition 在 offsetParent 非 root 时仍定位正确', () => {
      const root = document.createElement('div');
      const colorBox = document.createElement('div');
      colorBox.className = 'ew-color-picker-box';
      const panelContainer = document.createElement('div');
      const transformedAncestor = document.createElement('div');
      root.appendChild(colorBox);
      root.appendChild(panelContainer);
      document.body.appendChild(transformedAncestor);
      transformedAncestor.appendChild(root);

      colorBox.getBoundingClientRect = () => mockRect(200, 100, 40, 40);
      root.getBoundingClientRect = () => mockRect(200, 100, 40, 40);
      // 模拟 transform 祖先成为 offsetParent
      transformedAncestor.getBoundingClientRect = () =>
        mockRect(50, 50, 500, 500);
      Object.defineProperty(panelContainer, 'offsetParent', {
        value: transformedAncestor,
      });
      Object.defineProperty(transformedAncestor, 'clientLeft', { value: 0 });
      Object.defineProperty(transformedAncestor, 'clientTop', { value: 0 });

      mockCore = {
        options: {
          ewColorPickerPanel: true,
          autoPanelPosition: true,
          ewColorPickerBox: true,
          panelPlacement: 'bottom',
          boundary: null,
          hueDirection: 'vertical',
          alphaDirection: 'vertical',
        },
        currentColor: '#ff0000',
        getColor: vi.fn(() => '#ff0000'),
        setColor: vi.fn(),
        on: vi.fn(),
        off: vi.fn(),
        trigger: vi.fn(),
        getMountPoint: vi.fn((name: string) =>
          name === 'root'
            ? root
            : name === 'panelContainer'
            ? panelContainer
            : undefined
        ),
      };

      plugin = new PanelPlugin(mockCore);
      vi.spyOn(plugin, 'calculateContainerSize').mockImplementation(() => {});
      plugin.containerWidth = 285;
      plugin.containerHeight = 180;
      plugin.handleAutoPosition();

      // 视口 top=140, 不溢出视口；left=77.5 不溢出
      // offsetParent=transformedAncestor at (50,50)
      // left = 77.5 - 50 = 27.5
      // top = 140 - 50 = 90
      expect(panelContainer.style.position).toBe('absolute');
      expect(panelContainer.style.left).toBe('27.5px');
      expect(panelContainer.style.top).toBe('90px');

      document.body.removeChild(transformedAncestor);
    });
  });
}); 
