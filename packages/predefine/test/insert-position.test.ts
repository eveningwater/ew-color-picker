import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import PredefinePlugin from '../src/index';
import { createMockCore } from '../../../test/mockCore';

function create(tag: string) {
  return document.createElement(tag);
}

describe('Predefine Plugin Insert Position', () => {
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

  describe('insert position logic', () => {
    it('should insert after horizontal slider when it exists', () => {
      // 创建包含水平slider的DOM结构
      const panelContainer = create('div');
      panelContainer.className = 'ew-color-picker-panel-container';
      container.appendChild(panelContainer);
      
      const panel = create('div');
      panel.className = 'ew-color-picker-panel';
      panelContainer.appendChild(panel);
      
      const horizontalSlider = create('div');
      horizontalSlider.className = 'ew-color-picker-slider ew-color-picker-is-horizontal';
      panelContainer.appendChild(horizontalSlider);
      
      const bottomRow = create('div');
      bottomRow.className = 'ew-color-picker-bottom-row';
      panelContainer.appendChild(bottomRow);
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: ['#ff0000', '#00ff00']
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 验证预定义容器在水平slider之后
      const predefineContainer = panelContainer.querySelector('.ew-color-picker-predefine-container');
      expect(predefineContainer).toBeTruthy();
      
      const sliderIndex = Array.from(panelContainer.children).indexOf(horizontalSlider);
      const predefineIndex = Array.from(panelContainer.children).indexOf(predefineContainer!);
      
      expect(predefineIndex).toBe(sliderIndex + 1);
    });

    it('should insert before mode-container when it exists and no horizontal slider', () => {
      // 创建包含mode-container的DOM结构
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
        predefineColor: ['#ff0000', '#00ff00']
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 验证预定义容器在mode-container之前
      const predefineContainer = panelContainer.querySelector('.ew-color-picker-predefine-container');
      expect(predefineContainer).toBeTruthy();
      
      const modeIndex = Array.from(panelContainer.children).indexOf(modeContainer);
      const predefineIndex = Array.from(panelContainer.children).indexOf(predefineContainer!);
      
      expect(predefineIndex).toBe(modeIndex - 1);
    });

    it('should insert before bottom-row when no horizontal slider and no mode-container', () => {
      // 创建只包含bottom-row的DOM结构
      const panelContainer = create('div');
      panelContainer.className = 'ew-color-picker-panel-container';
      container.appendChild(panelContainer);
      
      const panel = create('div');
      panel.className = 'ew-color-picker-panel';
      panelContainer.appendChild(panel);
      
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
      
      const bottomRowIndex = Array.from(panelContainer.children).indexOf(bottomRow);
      const predefineIndex = Array.from(panelContainer.children).indexOf(predefineContainer!);
      
      expect(predefineIndex).toBe(bottomRowIndex - 1);
    });

    it('should insert after panel when no other elements exist', () => {
      // 创建只包含panel的DOM结构
      const panelContainer = create('div');
      panelContainer.className = 'ew-color-picker-panel-container';
      container.appendChild(panelContainer);
      
      const panel = create('div');
      panel.className = 'ew-color-picker-panel';
      panelContainer.appendChild(panel);
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: ['#ff0000', '#00ff00']
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 验证预定义容器在panel之后
      const predefineContainer = panelContainer.querySelector('.ew-color-picker-predefine-container');
      expect(predefineContainer).toBeTruthy();
      
      const panelIndex = Array.from(panelContainer.children).indexOf(panel);
      const predefineIndex = Array.from(panelContainer.children).indexOf(predefineContainer!);
      
      expect(predefineIndex).toBe(panelIndex + 1);
    });

    it('should handle complex DOM structure with multiple elements', () => {
      // 创建复杂的DOM结构
      const panelContainer = create('div');
      panelContainer.className = 'ew-color-picker-panel-container';
      container.appendChild(panelContainer);
      
      const panel = create('div');
      panel.className = 'ew-color-picker-panel';
      panelContainer.appendChild(panel);
      
      const verticalSlider = create('div');
      verticalSlider.className = 'ew-color-picker-slider ew-color-picker-is-vertical';
      panelContainer.appendChild(verticalSlider);
      
      const modeContainer = create('div');
      modeContainer.className = 'ew-color-picker-mode-container';
      panelContainer.appendChild(modeContainer);
      
      const bottomRow = create('div');
      bottomRow.className = 'ew-color-picker-bottom-row';
      panelContainer.appendChild(bottomRow);
      
      mockCore = createMockCore(container, {
        showPredefine: true,
        predefineColor: ['#ff0000', '#00ff00']
      });
      
      const plugin = new PredefinePlugin(mockCore);
      plugin.install(mockCore);
      
      // 验证预定义容器在mode-container之前（因为垂直slider不算水平slider）
      const predefineContainer = panelContainer.querySelector('.ew-color-picker-predefine-container');
      expect(predefineContainer).toBeTruthy();
      
      const modeIndex = Array.from(panelContainer.children).indexOf(modeContainer);
      const predefineIndex = Array.from(panelContainer.children).indexOf(predefineContainer!);
      
      expect(predefineIndex).toBe(modeIndex - 1);
    });
  });
}); 