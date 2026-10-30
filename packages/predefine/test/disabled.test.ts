import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import PredefinePlugin from '../src/index';
import { createMockCore } from '../../../test/mockCore';

function create(tag: string) {
  return document.createElement(tag);
}

describe('Predefine Plugin Disabled Functionality', () => {
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
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('disabled color handling', () => {
    it('should not trigger click event for disabled colors', () => {
      // 创建包含禁用颜色的配置
      const colorsWithDisabled = [
        { color: '#ff0000', disabled: false },
        { color: '#00ff00', disabled: true },  // 禁用状态
        { color: '#0000ff', disabled: false }
      ];
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: colorsWithDisabled
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 获取所有预定义颜色项
      const predefineItems = container.querySelectorAll('.ew-color-picker-predefine-color');
      expect(predefineItems.length).toBe(3);
      
      // 检查第二个元素（禁用状态）是否有禁用类
      const disabledItem = predefineItems[1];
      expect(disabledItem.classList.contains('ew-color-picker-predefine-color-disabled')).toBe(true);
      
      // 模拟点击禁用项
      const clickEvent = new Event('click');
      disabledItem.dispatchEvent(clickEvent);
      
      // 验证没有调用 setColor（因为被禁用了）
      expect(mockCore.setColor).not.toHaveBeenCalled();
    });

    it('should trigger click event for enabled colors', () => {
      // 创建包含禁用颜色的配置
      const colorsWithDisabled = [
        { color: '#ff0000', disabled: false },
        { color: '#00ff00', disabled: true },  // 禁用状态
        { color: '#0000ff', disabled: false }
      ];
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: colorsWithDisabled
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 获取所有预定义颜色项
      const predefineItems = container.querySelectorAll('.ew-color-picker-predefine-color');
      
      // 模拟点击第一个元素（启用状态）
      const enabledItem = predefineItems[0];
      expect(enabledItem.classList.contains('ew-color-picker-predefine-color-disabled')).toBe(false);
      
      // 直接调用 onPredefineColorClick 方法来测试
      (plugin as any).onPredefineColorClick({ target: enabledItem }, '#ff0000');
      
      // 验证调用了 setColor
      expect(mockCore.setColor).toHaveBeenCalled();
    });

    it('should handle mixed string and object color formats', () => {
      // 混合字符串和对象格式
      const mixedColors = [
        '#ff0000',  // 字符串格式，默认启用
        { color: '#00ff00', disabled: true },  // 对象格式，禁用
        '#0000ff'   // 字符串格式，默认启用
      ];
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: mixedColors
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 获取所有预定义颜色项
      const predefineItems = container.querySelectorAll('.ew-color-picker-predefine-color');
      expect(predefineItems.length).toBe(3);
      
      // 检查第二个元素（禁用状态）是否有禁用类
      const disabledItem = predefineItems[1];
      expect(disabledItem.classList.contains('ew-color-picker-predefine-color-disabled')).toBe(true);
      
      // 检查第一个和第三个元素（启用状态）没有禁用类
      const enabledItem1 = predefineItems[0];
      const enabledItem3 = predefineItems[2];
      expect(enabledItem1.classList.contains('ew-color-picker-predefine-color-disabled')).toBe(false);
      expect(enabledItem3.classList.contains('ew-color-picker-predefine-color-disabled')).toBe(false);
    });

    it('should apply disabled class correctly in render method', () => {
      const colorsWithDisabled = [
        { color: '#ff0000', disabled: false },
        { color: '#00ff00', disabled: true },
        { color: '#0000ff', disabled: false }
      ];
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: colorsWithDisabled
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 验证渲染时正确应用了禁用类
      const predefineItems = container.querySelectorAll('.ew-color-picker-predefine-color');
      expect(predefineItems.length).toBe(3);
      
      // 检查禁用状态
      expect(predefineItems[0].classList.contains('ew-color-picker-predefine-color-disabled')).toBe(false);
      expect(predefineItems[1].classList.contains('ew-color-picker-predefine-color-disabled')).toBe(true);
      expect(predefineItems[2].classList.contains('ew-color-picker-predefine-color-disabled')).toBe(false);
    });

    it('should handle dynamic disabled state changes', () => {
      const colorsWithDisabled = [
        { color: '#ff0000', disabled: false },
        { color: '#00ff00', disabled: false },
        { color: '#0000ff', disabled: false }
      ];
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: colorsWithDisabled
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 初始状态：所有都是启用
      const predefineItems = container.querySelectorAll('.ew-color-picker-predefine-color');
      expect(predefineItems[1].classList.contains('ew-color-picker-predefine-color-disabled')).toBe(false);
      
      // 动态设置禁用状态
      plugin.setDisabled(1, true);
      expect(predefineItems[1].classList.contains('ew-color-picker-predefine-color-disabled')).toBe(true);
      
      // 动态取消禁用状态
      plugin.setDisabled(1, false);
      expect(predefineItems[1].classList.contains('ew-color-picker-predefine-color-disabled')).toBe(false);
    });
  });
}); 