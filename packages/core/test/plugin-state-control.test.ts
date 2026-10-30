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

// 注册插件（除了ColorMode，因为我们要测试input插件的状态控制）
ewColorPicker.use(Console);
ewColorPicker.use(Box);
ewColorPicker.use(Panel);
ewColorPicker.use(Hue);
ewColorPicker.use(Alpha);
ewColorPicker.use(Input);
ewColorPicker.use(Button);
ewColorPicker.use(Predefine);
// ewColorPicker.use(ColorMode); // 不注册ColorMode插件，确保使用默认的input插件

describe('Plugin State Control Tests', () => {
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

  describe('Button Plugin State Control', () => {
    it('should enable/disable clear button dynamically', () => {
      const picker = new ewColorPicker({ el: container });

      
      const buttonPlugin = picker.plugins.ewColorPickerButton;
      expect(buttonPlugin).toBeDefined();
      expect(buttonPlugin.hasClear).toBe(true);
      let clearButton = container.querySelector('.ew-color-picker-clear-btn');
      expect(clearButton).toBeTruthy();

      // 禁用清空按钮
      buttonPlugin.enableClear(false);
      expect(buttonPlugin.hasClear).toBe(false);
      clearButton = container.querySelector('.ew-color-picker-clear-btn');
      expect(clearButton).toBeFalsy();

      // 重新启用清空按钮
      buttonPlugin.enableClear(true);
      expect(buttonPlugin.hasClear).toBe(true);
      clearButton = container.querySelector('.ew-color-picker-clear-btn');
      expect(clearButton).toBeTruthy();
    });

    it('should enable/disable sure button dynamically', () => {
      const picker = new ewColorPicker({ el: container });

      
      const buttonPlugin = picker.plugins.ewColorPickerButton;
      expect(buttonPlugin).toBeDefined();
      expect(buttonPlugin.hasSure).toBe(true);
      let sureButton = container.querySelector('.ew-color-picker-sure-btn');
      expect(sureButton).toBeTruthy();

      // 禁用确定按钮
      buttonPlugin.enableSure(false);
      expect(buttonPlugin.hasSure).toBe(false);
      sureButton = container.querySelector('.ew-color-picker-sure-btn');
      expect(sureButton).toBeFalsy();

      // 重新启用确定按钮
      buttonPlugin.enableSure(true);
      expect(buttonPlugin.hasSure).toBe(true);
      sureButton = container.querySelector('.ew-color-picker-sure-btn');
      expect(sureButton).toBeTruthy();
    });

    it('should enable/disable all buttons dynamically', () => {
      const picker = new ewColorPicker({ el: container });

      
      const buttonPlugin = picker.plugins.ewColorPickerButton;
      expect(buttonPlugin).toBeDefined();
      expect(buttonPlugin.hasClear).toBe(true);
      expect(buttonPlugin.hasSure).toBe(true);
      expect(container.querySelector('.ew-color-picker-clear-btn')).toBeTruthy();
      expect(container.querySelector('.ew-color-picker-sure-btn')).toBeTruthy();

      // 禁用所有按钮
      buttonPlugin.enableButtons(false);
      expect(buttonPlugin.hasClear).toBe(false);
      expect(buttonPlugin.hasSure).toBe(false);
      expect(container.querySelector('.ew-color-picker-clear-btn')).toBeFalsy();
      expect(container.querySelector('.ew-color-picker-sure-btn')).toBeFalsy();

      // 重新启用所有按钮
      buttonPlugin.enableButtons(true);
      expect(buttonPlugin.hasClear).toBe(true);
      expect(buttonPlugin.hasSure).toBe(true);
      expect(container.querySelector('.ew-color-picker-clear-btn')).toBeTruthy();
      expect(container.querySelector('.ew-color-picker-sure-btn')).toBeTruthy();
    });
  });

  describe('Input Plugin State Control', () => {
    it('should enable/disable input dynamically', () => {
      const picker = new ewColorPicker({ 
        el: container,
        ewColorPickerColorMode: false // 禁用color-mode插件，确保使用默认的input插件
      });

      
      const inputPlugin = picker.plugins.ewColorPickerInput;
      expect(inputPlugin).toBeDefined();
      expect(inputPlugin.hasInput).toBe(true);
      let input = container.querySelector('.ew-color-picker-input');
      expect(input).toBeTruthy();

      // 禁用输入框
      inputPlugin.enableInput(false);
      expect(inputPlugin.hasInput).toBe(false);
      input = container.querySelector('.ew-color-picker-input');
      expect(input).toBeFalsy();

      // 重新启用输入框
      inputPlugin.enableInput(true);
      expect(inputPlugin.hasInput).toBe(true);
      input = container.querySelector('.ew-color-picker-input');
      expect(input).toBeTruthy();
    });
  });

  describe('Box Plugin State Control', () => {
    it('should enable/disable box dynamically', () => {
      const picker = new ewColorPicker({ el: container });

      
      const boxPlugin = picker.plugins.ewColorPickerBox;
      expect(boxPlugin).toBeDefined();
      expect(boxPlugin.hasBox).toBe(true);
      let box = container.querySelector('.ew-color-picker-box');
      expect(box).toBeTruthy();

      // 禁用颜色框
      boxPlugin.enableBox(false);
      expect(boxPlugin.hasBox).toBe(false);
      box = container.querySelector('.ew-color-picker-box');
      expect(box).toBeFalsy();

      // 重新启用颜色框
      boxPlugin.enableBox(true);
      expect(boxPlugin.hasBox).toBe(true);
      box = container.querySelector('.ew-color-picker-box');
      expect(box).toBeTruthy();
    });
  });

  describe('Plugin State Persistence', () => {
    it('should maintain plugin state after color changes', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      const buttonPlugin = picker.plugins.ewColorPickerButton;
      const inputPlugin = picker.plugins.ewColorPickerInput;

      // 禁用一些功能
      buttonPlugin.enableClear(false);
      inputPlugin.enableInput(false);

      // 改变颜色
      picker.setColor('#ff0000');

      // 验证状态保持不变
      expect(buttonPlugin.hasClear).toBe(false);
      expect(inputPlugin.hasInput).toBe(false);
      expect(container.querySelector('.ew-color-picker-clear-btn')).toBeFalsy();
      expect(container.querySelector('.ew-color-picker-input')).toBeFalsy();
    });
  });

  describe('Hue Plugin State Control', () => {
    it('should enable/disable hue dynamically', () => {
      const picker = new ewColorPicker({ el: container });

      
      const huePlugin = picker.plugins.ewColorPickerHue;
      expect(huePlugin).toBeDefined();
      expect(huePlugin.hasHue).toBe(true);
      let hueBar = container.querySelector('.ew-color-picker-slider-bar');
      expect(hueBar).toBeTruthy();
      // 禁用hue滑块
      huePlugin.enableHue(false);
      expect(huePlugin.hasHue).toBe(false);
      hueBar = container.querySelector('.ew-color-picker-slider-bar');
      expect(hueBar).toBeFalsy();

      // 重新启用hue滑块
      huePlugin.enableHue(true);
      expect(huePlugin.hasHue).toBe(true);
      hueBar = container.querySelector('.ew-color-picker-slider-bar');
      expect(hueBar).toBeTruthy();
    });
  });

  describe('Alpha Plugin State Control', () => {
    it('should enable/disable alpha dynamically', () => {
      const picker = new ewColorPicker({ el: container });

      
      const alphaPlugin = picker.plugins.ewColorPickerAlpha;
      expect(alphaPlugin).toBeDefined();
      expect(alphaPlugin.hasAlpha).toBe(true);
      let alphaBar = container.querySelector('.ew-color-picker-alpha-slider-bar');
      expect(alphaBar).toBeTruthy();
      // 禁用alpha滑块
      alphaPlugin.enableAlpha(false);
      expect(alphaPlugin.hasAlpha).toBe(false);
      alphaBar = container.querySelector('.ew-color-picker-alpha-slider-bar');
      expect(alphaBar).toBeFalsy();

      // 重新启用alpha滑块
      alphaPlugin.enableAlpha(true);
      expect(alphaPlugin.hasAlpha).toBe(true);
      alphaBar = container.querySelector('.ew-color-picker-alpha-slider-bar');
      expect(alphaBar).toBeTruthy();
    });
  });
}); 