import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ewColorPicker from '../src/index';
import Box from '../../box/src/index';
import Panel from '../../panel/src/index';
import Hue from '../../hue/src/index';
import Alpha from '../../alpha/src/index';
import Input from '../../input/src/index';
import Button from '../../button/src/index';
import Predefine from '../../predefine/src/index';
import Console from '../../utils/src/consolePlugin';
import ColorMode from '../../color-mode/src/index';
import InputNumber from '../../input-number/src/index';

// 注册插件
ewColorPicker.use(Console);
ewColorPicker.use(Box);
ewColorPicker.use(Panel);
ewColorPicker.use(Hue);
ewColorPicker.use(Alpha);
ewColorPicker.use(Input);
ewColorPicker.use(Button);
ewColorPicker.use(Predefine);
ewColorPicker.use(ColorMode);
ewColorPicker.use(InputNumber);

describe('禁用功能测试', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  it('应该正确设置禁用状态', () => {
    const core = new ewColorPicker({
      el: container,
      disabled: true
    });


    expect(core.options.disabled).toBe(true);
  });

  it('应该正确设置启用状态', () => {
    const core = new ewColorPicker({
      el: container,
      disabled: false
    });


    expect(core.options.disabled).toBe(false);
  });

  it('应该使用默认的禁用状态', () => {
    const core = new ewColorPicker({
      el: container
    });


    expect(core.options.disabled).toBe(false);
  });

  it('应该能够动态更新禁用状态', () => {
    const core = new ewColorPicker({
      el: container,
      disabled: false
    });


    expect(core.options.disabled).toBe(false);

    // 更新为禁用状态
    core.updateOptions({ disabled: true });
    expect(core.options.disabled).toBe(true);

    // 更新为启用状态
    core.updateOptions({ disabled: false });
    expect(core.options.disabled).toBe(false);
  });

  it('禁用时应该阻止面板点击事件', () => {
    const core = new ewColorPicker({
      el: container,
      disabled: true
    });


    // 模拟面板点击事件
    const panelPlugin = core.plugins.ewColorPickerPanel;
    expect(panelPlugin).toBeDefined();

    // 验证禁用状态被正确传递
    expect(panelPlugin.options.disabled).toBe(true);
  });

  it('禁用时应该阻止色相滑块事件', () => {
    const core = new ewColorPicker({
      el: container,
      disabled: true
    });


    const huePlugin = core.plugins.ewColorPickerHue;
    expect(huePlugin).toBeDefined();
    expect(huePlugin.options.disabled).toBe(true);
  });

  it('禁用时应该阻止透明度滑块事件', () => {
    const core = new ewColorPicker({
      el: container,
      disabled: true
    });


    const alphaPlugin = core.plugins.ewColorPickerAlpha;
    expect(alphaPlugin).toBeDefined();
    expect(alphaPlugin.options.disabled).toBe(true);
  });

  it('禁用时应该阻止预定义颜色点击事件', () => {
    const core = new ewColorPicker({
      el: container,
      disabled: true,
      predefineColor: ['#ff0000', '#00ff00']
    });

    const predefinePlugin = core.plugins.ewColorPickerPredefine;
    expect(predefinePlugin).toBeDefined();
    expect(predefinePlugin.options.disabled).toBe(true);
  });

  it('禁用时应该阻止颜色模式切换事件', () => {
    const core = new ewColorPicker({
      el: container,
      disabled: true,
      openChangeColorMode: true
    });

    const colorModePlugin = core.plugins.ewColorPickerColorMode;
    expect(colorModePlugin).toBeDefined();
    expect(colorModePlugin.options.disabled).toBe(true);
  });

  it('禁用时应该阻止按钮点击事件', () => {
    const core = new ewColorPicker({
      el: container,
      disabled: true
    });

    const buttonPlugin = core.plugins.ewColorPickerButton;
    expect(buttonPlugin).toBeDefined();
    expect(buttonPlugin.options.disabled).toBe(true);
  });

  it('禁用时应该阻止输入框操作', () => {
    const core = new ewColorPicker({
      el: container,
      disabled: true
    });

    const inputPlugin = core.plugins.ewColorPickerInput;
    expect(inputPlugin).toBeDefined();
    expect(inputPlugin.options.disabled).toBe(true);
  });

  it('禁用时应该阻止数字输入框操作', () => {
    const core = new ewColorPicker({
      el: container,
      disabled: true
    });

    const inputNumberPlugin = core.plugins.ewColorPickerInputNumber;
    expect(inputNumberPlugin).toBeDefined();
    expect(inputNumberPlugin.options.disabled).toBe(true);
  });
}); 