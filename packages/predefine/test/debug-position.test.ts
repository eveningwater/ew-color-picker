import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ewColorPicker from '../../core/src/index';
import ewColorPickerPredefinePlugin from '../src/index';
import ewColorPickerPanelPlugin from '../../panel/src/index';
import ewColorPickerBoxPlugin from '../../box/src/index';
import ewColorPickerInputPlugin from '../../input/src/index';
import ewColorPickerButtonPlugin from '../../button/src/index';
import ewColorPickerColorModePlugin from '../../color-mode/src/index';
import ewColorPickerHuePlugin from '../../hue/src/index';
import ewColorPickerAlphaPlugin from '../../alpha/src/index';

// 注册插件
ewColorPicker.use(ewColorPickerBoxPlugin);
ewColorPicker.use(ewColorPickerPanelPlugin);
ewColorPicker.use(ewColorPickerInputPlugin);
ewColorPicker.use(ewColorPickerButtonPlugin);
ewColorPicker.use(ewColorPickerColorModePlugin);
ewColorPicker.use(ewColorPickerHuePlugin);
ewColorPicker.use(ewColorPickerAlphaPlugin);
ewColorPicker.use(ewColorPickerPredefinePlugin);

describe('Predefine Plugin - DOM Position Debug (Real Page Config)', () => {
  let container: HTMLElement;
  let colorPicker: ewColorPicker;
  let predefinePlugin: ewColorPickerPredefinePlugin;

  beforeEach(() => {
    // 创建容器
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    // 使用与实际页面相同的配置
    const baseOptions = {
      isClickOutside: true,
      autoPanelPosition: true,
      panelPlacement: 'bottom-start'
    };

    // 创建颜色选择器
    colorPicker = new ewColorPicker({
      el: container,
      ...baseOptions,
      predefineColor: ['#ff0000', '#00ff00', '#0000ff'],

    });

    // 获取预定义插件实例
    predefinePlugin = colorPicker.plugins.ewColorPickerPredefine as ewColorPickerPredefinePlugin;
  });

  afterEach(() => {
    if (colorPicker) {
      colorPicker.destroy();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('应该验证实际页面配置下的DOM结构', async () => {
    // 1. 检查初始化后的DOM结构
    process.stdout.write('=== 实际页面配置下的DOM结构 ===\n');
    const panelContainer = colorPicker.getMountPoint('panelContainer');
    process.stdout.write(`panelContainer: ${panelContainer}\n`);
    
    if (panelContainer) {
      const children = Array.from(panelContainer.children).map((child: Element) => ({
        tagName: child.tagName,
        className: child.className,
        id: child.id
      }));
      process.stdout.write(`panelContainer children: ${JSON.stringify(children, null, 2)}\n`);
    }

    // 2. 显示面板
    process.stdout.write('\n=== 显示面板 ===\n');
    colorPicker.showPanel();
    
    // 等待DOM更新
    await new Promise(resolve => setTimeout(resolve, 100));
    
    process.stdout.write('面板显示后的DOM结构:\n');
    if (panelContainer) {
      const childrenAfterShow = Array.from(panelContainer.children).map((child: Element) => ({
        tagName: child.tagName,
        className: child.className,
        id: child.id
      }));
      process.stdout.write(`panelContainer children after show: ${JSON.stringify(childrenAfterShow, null, 2)}\n`);
      
      // 查找相关元素
      const horizontalSlider = panelContainer.querySelector('.ew-color-picker-slider.ew-color-picker-is-horizontal');
      const verticalSlider = panelContainer.querySelector('.ew-color-picker-slider.ew-color-picker-is-vertical');
      const modeContainer = panelContainer.querySelector('.ew-color-picker-mode-container');
      const bottomRow = panelContainer.querySelector('.ew-color-picker-bottom-row');
      const predefineContainer = panelContainer.querySelector('.ew-color-picker-predefine-container');
      
      process.stdout.write(`horizontalSlider: ${horizontalSlider}\n`);
      process.stdout.write(`verticalSlider: ${verticalSlider}\n`);
      process.stdout.write(`modeContainer: ${modeContainer}\n`);
      process.stdout.write(`bottomRow: ${bottomRow}\n`);
      process.stdout.write(`predefineContainer: ${predefineContainer}\n`);
      
      // 检查预定义容器的位置
      if (predefineContainer) {
        const containerIndex = Array.from(panelContainer.children).indexOf(predefineContainer);
        process.stdout.write(`predefineContainer index: ${containerIndex}\n`);
        
        // 检查是否在正确位置
        if (modeContainer) {
          const modeIndex = Array.from(panelContainer.children).indexOf(modeContainer);
          process.stdout.write(`modeContainer index: ${modeIndex}\n`);
          process.stdout.write(`predefineContainer should be before modeContainer: ${containerIndex < modeIndex}\n`);
        }
        
        // 检查是否在正确位置
        if (bottomRow) {
          const bottomRowIndex = Array.from(panelContainer.children).indexOf(bottomRow);
          process.stdout.write(`bottomRow index: ${bottomRowIndex}\n`);
          process.stdout.write(`predefineContainer should be before bottomRow: ${containerIndex < bottomRowIndex}\n`);
        }
      }
    }
  });

  it('应该验证插件渲染时机和位置', async () => {
    // 检查插件是否已初始化
    expect(predefinePlugin).toBeDefined();
    expect(predefinePlugin.container).toBeDefined();
    
    // 检查容器是否已创建但可能未插入DOM
    process.stdout.write(`predefinePlugin.container: ${predefinePlugin.container}\n`);
    process.stdout.write(`container.parentNode: ${predefinePlugin.container?.parentNode}\n`);
    
    // 显示面板并检查
    colorPicker.showPanel();
    
    await new Promise(resolve => setTimeout(resolve, 100));
    
    process.stdout.write('面板显示后:\n');
    process.stdout.write(`container.parentNode after show: ${predefinePlugin.container?.parentNode}\n`);
    
    const panelContainer = colorPicker.getMountPoint('panelContainer');
    if (panelContainer) {
      const allChildren = Array.from(panelContainer.children);
      process.stdout.write(`所有子元素: ${allChildren.map((child: Element) => child.className).join(', ')}\n`);
      
      // 查找预定义容器
      const predefineContainer = panelContainer.querySelector('.ew-color-picker-predefine-container');
      process.stdout.write(`找到的预定义容器: ${predefineContainer}\n`);
      
      if (predefineContainer) {
        const index = allChildren.indexOf(predefineContainer);
        process.stdout.write(`预定义容器位置: ${index}\n`);
        
        // 检查前后元素
        if (index > 0) {
          process.stdout.write(`前一个元素: ${allChildren[index - 1].className}\n`);
        }
        if (index < allChildren.length - 1) {
          process.stdout.write(`后一个元素: ${allChildren[index + 1].className}\n`);
        }
        
        // 验证位置正确性
        const modeContainer = panelContainer.querySelector('.ew-color-picker-mode-container');
        const bottomRow = panelContainer.querySelector('.ew-color-picker-bottom-row');
        
        if (modeContainer) {
          const modeIndex = allChildren.indexOf(modeContainer);
          expect(index).toBeLessThan(modeIndex);
        }
        
        if (bottomRow) {
          const bottomRowIndex = allChildren.indexOf(bottomRow);
          expect(index).toBeLessThan(bottomRowIndex);
        }
      }
    }
  });
}); 