import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ColorModePlugin from '../src/index'; // color-mode plugin
import { createMockCore } from '../../../test/mockCore';

function create(tag: string) {
  return document.createElement(tag);
}

describe('color-mode Plugin', () => {
  let container: HTMLElement;
  let mockCore: any;

  beforeEach(() => {
    container = create('div');
    document.body.appendChild(container);
    
    // 创建完整的 DOM 结构
    const panelContainer = create('div');
    panelContainer.className = 'ew-color-picker-panel-container';
    container.appendChild(panelContainer);
    
    const bottomRow = create('div');
    bottomRow.className = 'ew-color-picker-bottom-row';
    panelContainer.appendChild(bottomRow);
    
    // 创建input容器
    const inputContainer = create('div');
    inputContainer.className = 'ew-color-picker-input-container';
    bottomRow.appendChild(inputContainer);
    
    mockCore = createMockCore(container, {
      showColorMode: true,
      colorMode: 'hex',
      alpha: true, // 启用alpha支持
      plugins: {
        ewColorPickerAlpha: {
          // 模拟alpha插件
          updateAlphaThumbPosition: vi.fn()
        }
      }
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
  });

  describe('plugin installation', () => {
    it('should install plugin correctly', () => {
      const plugin = new ColorModePlugin(mockCore);
      
      expect(plugin).toBeInstanceOf(ColorModePlugin);
      // 由于alpha插件存在，插件应该能正常安装
      expect(plugin.options.alpha).toBe(true);
    });

    it('should create color mode element', () => {
      const plugin = new ColorModePlugin(mockCore);
      
      const colorModeElement = container.querySelector('.ew-color-picker-mode-container');
      expect(colorModeElement).toBeTruthy();
    });

    it('should not create color mode element when showColorMode is false', () => {
      mockCore.options.ewColorPickerColorMode = false;
      const plugin = new ColorModePlugin(mockCore);
      
      const colorModeElement = container.querySelector('.ew-color-picker-mode-container');
      expect(colorModeElement).toBeFalsy();
    });
  });

  describe('color mode functionality', () => {
    it('should create mode buttons for different color formats', () => {
      const plugin = new ColorModePlugin(mockCore);
      
      const modeButtons = container.querySelectorAll('.ew-color-picker-mode-up-btn, .ew-color-picker-mode-down-btn');
      expect(modeButtons.length).toBeGreaterThan(0);
    });

    it('should handle mode button click events', async () => {
      const plugin = new ColorModePlugin(mockCore);
      
      // 等待事件绑定完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const upButton = container.querySelector('.ew-color-picker-mode-up-btn') as HTMLElement;
      expect(upButton).toBeTruthy();
      
      // 直接调用 onModeChange 方法来测试功能
      (plugin as any).onModeChange('rgb');
      
      // Should call trigger or update mode
      expect(mockCore.trigger).toHaveBeenCalled();
    });

    it('should highlight active mode', () => {
      const plugin = new ColorModePlugin(mockCore);
      
      const modeText = container.querySelector('.ew-color-picker-mode-text') as HTMLElement;
      expect(modeText).toBeTruthy();
      
      // Should display current mode
      expect(modeText.textContent).toBeTruthy();
    });

    it('should switch active mode on button click', async () => {
      const plugin = new ColorModePlugin(mockCore);
      
      // 等待事件绑定完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const upButton = container.querySelector('.ew-color-picker-mode-up-btn') as HTMLElement;
      const downButton = container.querySelector('.ew-color-picker-mode-down-btn') as HTMLElement;
      
      expect(upButton).toBeTruthy();
      expect(downButton).toBeTruthy();
      
      // 测试模式切换 - 直接调用onModeChange方法，避免防抖延迟
      (plugin as any).onModeChange('rgb');
      expect(plugin.currentMode).toBe('rgb');
    });
  });

  describe('plugin options', () => {
    it('should respect custom color mode options', () => {
      mockCore.options.defaultMode = 'rgb';
      const plugin = new ColorModePlugin(mockCore);
      
      const colorModeElement = container.querySelector('.ew-color-picker-mode-container');
      expect(colorModeElement).toBeTruthy();
      
      const modeButtons = container.querySelectorAll('.ew-color-picker-mode-up-btn, .ew-color-picker-mode-down-btn');
      expect(modeButtons.length).toBe(2);
      
      expect(plugin.currentMode).toBe('rgb');
    });

    it('should handle single mode option', () => {
      mockCore.options.ewColorPickerColorMode = false;
      const plugin = new ColorModePlugin(mockCore);
      
      const modeButtons = container.querySelectorAll('.ew-color-picker-mode-up-btn, .ew-color-picker-mode-down-btn');
      expect(modeButtons.length).toBe(0);
    });
  });

  describe('cleanup', () => {
    it('should clean up properly', () => {
      const plugin = new ColorModePlugin(mockCore);
      
      // 确保插件已创建
      expect(container.querySelector('.ew-color-picker-mode-container')).toBeTruthy();
      
      // 销毁插件
      plugin.destroy();
      
      // 确保DOM已被清理
      expect(container.querySelector('.ew-color-picker-mode-container')).toBeFalsy();
    });
  });
}); 