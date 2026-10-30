import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import PredefinePlugin from '../src/index';
import { createMockCore } from '../../../test/mockCore';

function create(tag: string) {
  return document.createElement(tag);
}

describe('Predefine Plugin Position Verification', () => {
  let container: HTMLElement;
  let mockCore: any;

  beforeEach(() => {
    container = create('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('real DOM structure position verification', () => {
    it('should place predefine container before mode-container in real structure', () => {
      // 模拟真实的DOM结构，按照用户提供的顺序
      const panelContainer = create('div');
      panelContainer.className = 'ew-color-picker-panel-container';
      container.appendChild(panelContainer);
      
      // 创建面板
      const panel = create('div');
      panel.className = 'ew-color-picker-panel';
      panelContainer.appendChild(panel);
      
      // 创建垂直slider
      const verticalSlider = create('div');
      verticalSlider.className = 'ew-color-picker-slider ew-color-picker-is-vertical';
      panelContainer.appendChild(verticalSlider);
      
      // 创建alpha slider
      const alphaSlider = create('div');
      alphaSlider.className = 'ew-color-picker-slider ew-alpha ew-color-picker-is-vertical';
      panelContainer.appendChild(alphaSlider);
      
      // 创建mode-container
      const modeContainer = create('div');
      modeContainer.className = 'ew-color-picker-mode-container';
      panelContainer.appendChild(modeContainer);
      
      // 创建bottom-row
      const bottomRow = create('div');
      bottomRow.className = 'ew-color-picker-bottom-row';
      panelContainer.appendChild(bottomRow);
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: ['#ff0000', '#00ff00', '#0000ff']
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 获取所有子元素
      const children = Array.from(panelContainer.children);
      
      // 找到各个元素的位置
      const predefineIndex = children.findIndex(child => 
        child.classList.contains('ew-color-picker-predefine-container')
      );
      const modeIndex = children.findIndex(child => 
        child.classList.contains('ew-color-picker-mode-container')
      );
      const bottomRowIndex = children.findIndex(child => 
        child.classList.contains('ew-color-picker-bottom-row')
      );
      
      // 验证predefine容器在mode-container之前
      expect(predefineIndex).toBeLessThan(modeIndex);
      
      // 验证predefine容器在bottom-row之前
      expect(predefineIndex).toBeLessThan(bottomRowIndex);
      
      // 验证mode-container在bottom-row之前
      expect(modeIndex).toBeLessThan(bottomRowIndex);
      
      
    });

    it('should handle existing predefine container and move it to correct position', () => {
      // 先创建一个错误位置的predefine容器
      const panelContainer = create('div');
      panelContainer.className = 'ew-color-picker-panel-container';
      container.appendChild(panelContainer);
      
      const wrongPredefineContainer = create('div');
      wrongPredefineContainer.className = 'ew-color-picker-predefine-container';
      panelContainer.appendChild(wrongPredefineContainer); // 错误位置：在最前面
      
      // 创建其他元素
      const panel = create('div');
      panel.className = 'ew-color-picker-panel';
      panelContainer.appendChild(panel);
      
      const modeContainer = create('div');
      modeContainer.className = 'ew-color-picker-mode-container';
      panelContainer.appendChild(modeContainer);
      
      const bottomRow = create('div');
      bottomRow.className = 'ew-color-picker-bottom-row';
      panelContainer.appendChild(bottomRow);
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: ['#ff0000', '#00ff00', '#0000ff']
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 获取所有子元素
      const children = Array.from(panelContainer.children);
      
      // 找到各个元素的位置
      const predefineIndex = children.findIndex(child => 
        child.classList.contains('ew-color-picker-predefine-container')
      );
      const modeIndex = children.findIndex(child => 
        child.classList.contains('ew-color-picker-mode-container')
      );
      
      // 验证predefine容器被移动到了正确位置（在mode-container之前）
      expect(predefineIndex).toBeLessThan(modeIndex);
      
      
    });

    it('should maintain correct position after multiple renders', () => {
      // 创建完整的DOM结构
      const panelContainer = create('div');
      panelContainer.className = 'ew-color-picker-panel-container';
      container.appendChild(panelContainer);
      
      const panel = create('div');
      panel.className = 'ew-color-picker-panel';
      panelContainer.appendChild(panel);
      
      const modeContainer = create('div');
      modeContainer.className = 'ew-color-picker-mode-container';
      panelContainer.appendChild(modeContainer);
      
      const bottomRow = create('div');
      bottomRow.className = 'ew-color-picker-bottom-row';
      panelContainer.appendChild(bottomRow);
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: ['#ff0000', '#00ff00', '#0000ff']
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 第一次渲染后的位置
      let children = Array.from(panelContainer.children);
      let predefineIndex1 = children.findIndex(child => 
        child.classList.contains('ew-color-picker-predefine-container')
      );
      let modeIndex1 = children.findIndex(child => 
        child.classList.contains('ew-color-picker-mode-container')
      );
      
      expect(predefineIndex1).toBeLessThan(modeIndex1);
      
      // 更新颜色并重新渲染
      plugin.updatePredefineColors(['#ff0000', '#00ff00', '#0000ff', '#ffff00']);
      
      // 第二次渲染后的位置
      children = Array.from(panelContainer.children);
      let predefineIndex2 = children.findIndex(child => 
        child.classList.contains('ew-color-picker-predefine-container')
      );
      let modeIndex2 = children.findIndex(child => 
        child.classList.contains('ew-color-picker-mode-container')
      );
      
      // 验证位置保持一致
      expect(predefineIndex2).toBeLessThan(modeIndex2);
      expect(predefineIndex2).toBe(predefineIndex1);
      expect(modeIndex2).toBe(modeIndex1);
      
      
    });
  });
}); 