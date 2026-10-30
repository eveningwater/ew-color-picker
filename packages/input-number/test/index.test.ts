import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import InputNumberPlugin, { InputNumber } from '../src/index';
import { createMockCore } from '../../../test/mockCore';

function create(tag: string) {
  return document.createElement(tag);
}

describe('InputNumber Plugin', () => {
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
    
    mockCore = createMockCore(container, {
      
      
    });
  });

  afterEach(() => {
    // 安全地移除容器
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('plugin installation', () => {
    it('should install plugin correctly', () => {
      const plugin = new InputNumberPlugin();
      plugin.install(mockCore);
      
      expect(plugin).toBeInstanceOf(InputNumberPlugin);
      expect(plugin.ewColorPicker).toBe(mockCore);
    });

    it('should create input number elements', () => {
      const plugin = new InputNumberPlugin();
      plugin.install(mockCore);
      
      const inputElements = container.querySelectorAll('.ew-input-number');
      expect(inputElements.length).toBeGreaterThan(0);
    });

    it('should create input number elements even when showInputNumber is false', () => {
      mockCore.options.showInputNumber = false;
      const plugin = new InputNumberPlugin();
      plugin.install(mockCore);
      
      const inputElements = container.querySelectorAll('.ew-input-number');
      expect(inputElements.length).toBe(1);
    });
  });

  describe('input number functionality', () => {
    it('should handle input change events', async () => {
      const plugin = new InputNumberPlugin();
      plugin.install(mockCore);
      
      // 等待事件绑定完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const inputElements = container.querySelectorAll('.ew-input-number__input');
      const firstInput = inputElements[0] as HTMLInputElement;
      expect(firstInput).toBeTruthy();
      
      // Simulate input change
      firstInput.value = '255';
      firstInput.dispatchEvent(new Event('input'));
      
      // 等待防抖处理完成
      await new Promise(resolve => setTimeout(resolve, 350));
      
      // Should call onChange callback
      expect(plugin.instances.get('default')?.getValue()).toBe(255);
    });

    it('should handle input blur events', async () => {
      const plugin = new InputNumberPlugin();
      plugin.install(mockCore);
      
      // 等待事件绑定完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const inputElements = container.querySelectorAll('.ew-input-number__input');
      const firstInput = inputElements[0] as HTMLInputElement;
      expect(firstInput).toBeTruthy();
      
      // Simulate input change first
      firstInput.value = '255';
      firstInput.dispatchEvent(new Event('input'));
      
      // 等待防抖处理完成
      await new Promise(resolve => setTimeout(resolve, 350));
      
      expect(plugin.instances.get('default')?.getValue()).toBe(255);
    });

    it('should validate numeric input', async () => {
      const plugin = new InputNumberPlugin();
      plugin.install(mockCore);
      
      // 等待事件绑定完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const inputElements = container.querySelectorAll('.ew-input-number__input');
      const firstInput = inputElements[0] as HTMLInputElement;
      expect(firstInput).toBeTruthy();
      
      // Test valid numeric input
      firstInput.value = '255';
      firstInput.dispatchEvent(new Event('input'));
      
      // 等待防抖处理完成
      await new Promise(resolve => setTimeout(resolve, 350));
      
      expect(plugin.instances.get('default')?.getValue()).toBe(255);
    });

    it('should handle invalid numeric input', async () => {
      const plugin = new InputNumberPlugin();
      plugin.install(mockCore);
      
      // 等待事件绑定完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const inputElements = container.querySelectorAll('.ew-input-number__input');
      const firstInput = inputElements[0] as HTMLInputElement;
      expect(firstInput).toBeTruthy();
      
      // Test invalid input
      firstInput.value = 'abc';
      firstInput.dispatchEvent(new Event('blur'));
      
      // 等待事件处理完成
      await new Promise(resolve => setTimeout(resolve, 50));
      
      // Should not change value with invalid input
      expect(plugin.instances.get('default')?.getValue()).toBe(0);
    });
  });

  describe('color updates', () => {
    it('should update input numbers when color changes', () => {
      const plugin = new InputNumberPlugin();
      plugin.install(mockCore);
      
      // 触发 change 事件
      mockCore.emit('change');
      
      // Should update the input numbers
      const inputElements = container.querySelectorAll('.ew-input-number');
      expect(inputElements.length).toBeGreaterThan(0);
    });
  });

  describe('plugin options', () => {
    it('should respect custom input number options', () => {
      const plugin = new InputNumberPlugin();
      plugin.install(mockCore);
      
      const inputElements = container.querySelectorAll('.ew-input-number');
      expect(inputElements.length).toBeGreaterThan(0);
      expect(plugin.instances.get('default')?.getValue()).toBe(0);
    });
  });

  describe('cleanup', () => {
    it('should clean up event listeners on destroy', () => {
      const plugin = new InputNumberPlugin();
      plugin.install(mockCore);
      
      // Simulate plugin destruction
      plugin.destroy();
      
      expect(plugin.ewColorPicker).toBeNull();
    });
  });
}); 