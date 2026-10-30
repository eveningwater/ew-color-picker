import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import PredefinePlugin from '../src/index';
import { createMockCore } from '../../../test/mockCore';

function create(tag: string) {
  return document.createElement(tag);
}

describe('Predefine Plugin Real DOM Structure', () => {
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

  describe('real DOM structure simulation', () => {
    it('should insert predefine container before mode-container in real structure', () => {
      // 模拟真实的DOM结构，按照用户提供的顺序
      const panelContainer = create('div');
      panelContainer.className = 'ew-color-picker-panel-container';
      container.appendChild(panelContainer);
      
      // 1. 面板
      const panel = create('div');
      panel.className = 'ew-color-picker-panel ew-color-picker-panel-dynamic-size';
      panelContainer.appendChild(panel);
      
      // 2. 垂直色相滑块
      const verticalSlider = create('div');
      verticalSlider.className = 'ew-color-picker-slider ew-color-picker-is-vertical';
      panelContainer.appendChild(verticalSlider);
      
      // 3. Alpha滑块
      const alphaSlider = create('div');
      alphaSlider.className = 'ew-color-picker-slider ew-alpha ew-color-picker-is-vertical';
      panelContainer.appendChild(alphaSlider);
      
      // 4. 模式容器
      const modeContainer = create('div');
      modeContainer.className = 'ew-color-picker-mode-container';
      panelContainer.appendChild(modeContainer);
      
      // 5. 底部行
      const bottomRow = create('div');
      bottomRow.className = 'ew-color-picker-bottom-row ew-color-picker-bottom-row-single';
      panelContainer.appendChild(bottomRow);
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff']
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 验证预定义容器在mode-container之前
      const predefineContainer = panelContainer.querySelector('.ew-color-picker-predefine-container');
      expect(predefineContainer).toBeTruthy();
      
      // 获取所有子元素的索引
      const children = Array.from(panelContainer.children);
      const predefineIndex = children.indexOf(predefineContainer!);
      const modeIndex = children.indexOf(modeContainer);
      const panelIndex = children.indexOf(panel);
      const verticalSliderIndex = children.indexOf(verticalSlider);
      const alphaSliderIndex = children.indexOf(alphaSlider);
      const bottomRowIndex = children.indexOf(bottomRow);
      
      // 验证顺序：panel -> verticalSlider -> alphaSlider -> predefineContainer -> modeContainer -> bottomRow
      expect(panelIndex).toBe(0);
      expect(verticalSliderIndex).toBe(1);
      expect(alphaSliderIndex).toBe(2);
      expect(predefineIndex).toBe(3);
      expect(modeIndex).toBe(4);
      expect(bottomRowIndex).toBe(5);
      
      // 验证预定义容器在mode-container之前
      expect(predefineIndex).toBe(modeIndex - 1);
      
      // 验证预定义颜色项数量
      const predefineItems = predefineContainer!.querySelectorAll('.ew-color-picker-predefine-color');
      expect(predefineItems.length).toBe(6);
    });

    it('should handle case when mode-container is not present', () => {
      // 模拟没有mode-container的DOM结构
      const panelContainer = create('div');
      panelContainer.className = 'ew-color-picker-panel-container';
      container.appendChild(panelContainer);
      
      const panel = create('div');
      panel.className = 'ew-color-picker-panel';
      panelContainer.appendChild(panel);
      
      const verticalSlider = create('div');
      verticalSlider.className = 'ew-color-picker-slider ew-color-picker-is-vertical';
      panelContainer.appendChild(verticalSlider);
      
      const bottomRow = create('div');
      bottomRow.className = 'ew-color-picker-bottom-row';
      panelContainer.appendChild(bottomRow);
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: ['#ff0000', '#00ff00']
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 验证预定义容器在bottom-row之前
      const predefineContainer = panelContainer.querySelector('.ew-color-picker-predefine-container');
      expect(predefineContainer).toBeTruthy();
      
      const children = Array.from(panelContainer.children);
      const predefineIndex = children.indexOf(predefineContainer!);
      const bottomRowIndex = children.indexOf(bottomRow);
      
      expect(predefineIndex).toBe(bottomRowIndex - 1);
    });

    it('should handle case when horizontal slider is present', () => {
      // 模拟有水平slider的DOM结构
      const panelContainer = create('div');
      panelContainer.className = 'ew-color-picker-panel-container';
      container.appendChild(panelContainer);
      
      const panel = create('div');
      panel.className = 'ew-color-picker-panel';
      panelContainer.appendChild(panel);
      
      const horizontalSlider = create('div');
      horizontalSlider.className = 'ew-color-picker-slider ew-color-picker-is-horizontal';
      panelContainer.appendChild(horizontalSlider);
      
      const modeContainer = create('div');
      modeContainer.className = 'ew-color-picker-mode-container';
      panelContainer.appendChild(modeContainer);
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: ['#ff0000', '#00ff00']
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 验证预定义容器在水平slider之后
      const predefineContainer = panelContainer.querySelector('.ew-color-picker-predefine-container');
      expect(predefineContainer).toBeTruthy();
      
      const children = Array.from(panelContainer.children);
      const predefineIndex = children.indexOf(predefineContainer!);
      const horizontalSliderIndex = children.indexOf(horizontalSlider);
      
      expect(predefineIndex).toBe(horizontalSliderIndex + 1);
    });
  });
}); 