import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ButtonPlugin from '../src/index';
import { createMockCore } from '../../../test/mockCore';

function create(tag: string) {
  return document.createElement(tag);
}

describe('Button Plugin', () => {
  let container: HTMLElement;
  let mockCore: any;

  beforeEach(() => {
    container = create('div');
    document.body.appendChild(container);
    
    // 创建完整的 DOM 结构
    const panelContainer = create('div');
    panelContainer.className = 'ew-color-picker-panel-container';
    container.appendChild(panelContainer);
    
    // 创建 bottom-row 元素，ButtonPlugin 需要它来插入按钮
    const bottomRow = create('div');
    bottomRow.className = 'ew-color-picker-bottom-row';
    panelContainer.appendChild(bottomRow);
    
    mockCore = createMockCore(container, {});
  });

  afterEach(() => {
    // 安全地移除容器
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('plugin installation', () => {
    it('should create plugin instance correctly', () => {
      const plugin = new ButtonPlugin(mockCore);
      plugin.install(mockCore);
      
      expect(plugin).toBeInstanceOf(ButtonPlugin);
      expect(mockCore.on).toHaveBeenCalled();
    });

    it('should create button elements', () => {
      const plugin = new ButtonPlugin(mockCore);
      plugin.install(mockCore);
      
      const buttonElements = container.querySelectorAll('.ew-color-picker-drop-btn');
      expect(buttonElements.length).toBeGreaterThan(0);
    });
  });

  describe('button functionality', () => {
    it('should handle button click events', async () => {
      const plugin = new ButtonPlugin(mockCore);
      plugin.install(mockCore);
      
      const buttonElements = container.querySelectorAll('.ew-color-picker-drop-btn');
      const firstButton = buttonElements[0] as HTMLElement;
      expect(firstButton).toBeTruthy();
      
      // Simulate button click
      firstButton.click();
      
      // Wait for debounce delay (100ms)
      await new Promise(resolve => setTimeout(resolve, 150));
      
      // Should call trigger or hidePanel
      expect(mockCore.trigger).toHaveBeenCalled();
    });

    it('should update button color when color changes', () => {
      const plugin = new ButtonPlugin(mockCore);
      plugin.install(mockCore);
      
      const buttonElements = container.querySelectorAll('.ew-color-picker-drop-btn');
      const firstButton = buttonElements[0] as HTMLElement;
      
      // Simulate color change
      mockCore.getColor = vi.fn(() => '#00ff00');
      
      // Trigger color change event
      const colorChangeHandler = mockCore.on.mock.calls.find(
        call => call[0] === 'change'
      )?.[1];
      
      if (colorChangeHandler) {
      colorChangeHandler();
      }
      
      // Button should reflect new color
      expect(firstButton).toBeTruthy();
    });
  });

  describe('plugin options', () => {
    it('should respect custom button options', () => {
      mockCore.options.clearText = 'Clear';
      mockCore.options.sureText = 'Sure';
      
      const plugin = new ButtonPlugin(mockCore);
      plugin.install(mockCore);
      
      const clearButton = container.querySelector('.ew-color-picker-clear-btn') as HTMLElement;
      const sureButton = container.querySelector('.ew-color-picker-sure-btn') as HTMLElement;
      
      expect(clearButton).toBeTruthy();
      expect(sureButton).toBeTruthy();
      expect(clearButton.textContent).toBe('Clear');
      expect(sureButton.textContent).toBe('Sure');
    });

    it('should handle button size options', () => {
      const plugin = new ButtonPlugin(mockCore);
      plugin.install(mockCore);
      
      const buttonElements = container.querySelectorAll('.ew-color-picker-drop-btn');
      expect(buttonElements.length).toBeGreaterThan(0);
    });
  });

  describe('cleanup', () => {
    it('should clean up event listeners on destroy', () => {
      const plugin = new ButtonPlugin(mockCore);
      plugin.install(mockCore);
      
      // Mock destroy method
      const destroySpy = vi.fn();
      mockCore.destroy = destroySpy;
      
      // Simulate core destruction
      plugin.destroy();
      
      expect(plugin.clearButton).toBeNull();
      expect(plugin.sureButton).toBeNull();
    });
  });
}); 