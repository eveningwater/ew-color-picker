import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ewColorPicker from '../../core/src/index';
import ewColorPickerPredefinePlugin from '../src/index';
import ewColorPickerPanelPlugin from '../../panel/src/index';
import ewColorPickerBoxPlugin from '../../box/src/index';
import ewColorPickerInputPlugin from '../../input/src/index';
import ewColorPickerButtonPlugin from '../../button/src/index';
import ewColorPickerColorModePlugin from '../../color-mode/src/index';

// 注册插件
ewColorPicker.use(ewColorPickerBoxPlugin);
ewColorPicker.use(ewColorPickerPanelPlugin);
ewColorPicker.use(ewColorPickerInputPlugin);
ewColorPicker.use(ewColorPickerButtonPlugin);
ewColorPicker.use(ewColorPickerColorModePlugin);
ewColorPicker.use(ewColorPickerPredefinePlugin);

describe('Predefine Plugin - Click Target Handling', () => {
  let container: HTMLElement;
  let colorPicker: ewColorPicker;
  let predefinePlugin: ewColorPickerPredefinePlugin;

  beforeEach(() => {
    // 创建容器
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);

    // 创建颜色选择器
    colorPicker = new ewColorPicker({
      el: container,
      hasBox: true,
      hasPanel: true,
      hasInput: true,
      hasClear: true,
      hasSure: true,
      hue: true,
      alpha: true,
      openChangeColorMode: true,
      predefineColor: ['#ff0000', '#00ff00', '#0000ff'],
      showPredefine: true
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

  it('应该正确处理点击目标元素', async () => {
    // 显示面板
    colorPicker.showPanel();

    // 等待DOM渲染
    await new Promise((resolve) => setTimeout(resolve, 100));

    const predefineContainer = container.querySelector('.ew-color-picker-predefine-container');
    expect(predefineContainer).toBeTruthy();

    // 获取第一个预定义颜色元素
    const firstPredefineColor = predefineContainer?.querySelector('.ew-color-picker-predefine-color') as HTMLElement;
    const firstColorItem = predefineContainer?.querySelector('.ew-color-picker-predefine-color-item') as HTMLElement;

    expect(firstPredefineColor).toBeTruthy();
    expect(firstColorItem).toBeTruthy();

    // 模拟点击颜色项元素
    const clickEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
      view: window
    });

    // 模拟点击子元素
    firstColorItem.dispatchEvent(clickEvent);

    // 验证点击事件被正确处理
    // 这里我们可以通过检查颜色是否被设置来验证
    const currentColor = colorPicker.getColor();
    expect(currentColor).toBeTruthy();
  });

  it('应该验证DOM结构', async () => {
    colorPicker.showPanel();

    await new Promise((resolve) => setTimeout(resolve, 100));

    const predefineContainer = container.querySelector('.ew-color-picker-predefine-container');
    const predefineColors = predefineContainer?.querySelectorAll('.ew-color-picker-predefine-color');
    const colorItems = predefineContainer?.querySelectorAll('.ew-color-picker-predefine-color-item');

    expect(predefineColors?.length).toBe(3);
    expect(colorItems?.length).toBe(3);

    // 验证DOM结构
    predefineColors?.forEach((colorElement, index) => {
      const colorItem = colorElement.querySelector('.ew-color-picker-predefine-color-item');
      expect(colorItem).toBeTruthy();

      // 验证颜色值
      const expectedColors = ['#ff0000', '#00ff00', '#0000ff'];
      const backgroundColor = (colorItem as HTMLElement).style.backgroundColor;
      expect(backgroundColor).toBe(expectedColors[index]);
    });
  });
}); 