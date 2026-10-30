import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import PredefinePlugin from '../src/index';
import { createMockCore } from '../../../test/mockCore';

function create(tag: string) {
  return document.createElement(tag);
}

describe('Predefine Plugin Class Names', () => {
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
        showPredefine: true,
        predefineColor: ['#ff0000', '#00ff00', '#0000ff']
    });
  });

  afterEach(() => {
    // 安全地移除容器
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('class name verification', () => {
    it('should use correct class name for predefine color items', () => {
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 检查预定义颜色容器
      const predefineContainer = container.querySelector('.ew-color-picker-predefine-container');
      expect(predefineContainer).toBeTruthy();
      
      // 检查预定义颜色项应该使用 ew-color-picker-predefine-color 类名
      const predefineItems = container.querySelectorAll('.ew-color-picker-predefine-color');
      expect(predefineItems.length).toBe(3);
      
      // 检查颜色项内部元素
      const colorItems = container.querySelectorAll('.ew-color-picker-predefine-color-item');
      expect(colorItems.length).toBe(3);
    });

    it('should not use old class name ew-color-picker-predefine-item', () => {
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 确保没有使用旧的类名
      const oldClassItems = container.querySelectorAll('.ew-color-picker-predefine-item');
      expect(oldClassItems.length).toBe(0);
    });

    it('should apply correct styles to predefine color items', () => {
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      const predefineItems = container.querySelectorAll('.ew-color-picker-predefine-color');
      expect(predefineItems.length).toBe(3);
      
      // 检查每个元素都有正确的样式类
      predefineItems.forEach((item, index) => {
        expect(item.classList.contains('ew-color-picker-predefine-color')).toBe(true);
        
        // 检查内部颜色元素
        const colorItem = item.querySelector('.ew-color-picker-predefine-color-item') as HTMLElement;
        expect(colorItem).toBeTruthy();
        expect(colorItem.style.backgroundColor).toBe(mockCore.options.predefineColor[index]);
      });
    });
  });
}); 