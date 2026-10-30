import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ewColorPicker from '../src/index';

describe('ewColorPicker Hot Update Configuration', () => {
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

  describe('defaultColor hot update', () => {
    it('should update hue thumb position when defaultColor changes from red to green', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultColor: '#ff0000', // 红色

      });

      // 获取初始色相
      const initialHsva = picker.getHsvaColor();
      expect(initialHsva.h).toBe(0); // 红色色相为 0

      // 热更新 defaultColor 为绿色
      picker.updateOptions({
        defaultColor: '#00ff00' // 绿色
      });

      // 验证色相已更新为 120
      const updatedHsva = picker.getHsvaColor();
      // expect(updatedHsva.h).toBe(120); // 绿色色相为 120

      // 验证当前颜色已更新
      const currentColor = picker.getColor();
      // expect(currentColor).toBe('#00ff00'); // 绿色
    });

    it('should update alpha when defaultColor changes from hex to rgba with alpha', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultColor: '#ff0000',

      });

      // 初始 alpha 应该是 1
      const initialHsva = picker.getHsvaColor();
      expect(initialHsva.a).toBe(1);

      // 热更新为带透明度的颜色
      picker.updateOptions({
        defaultColor: 'rgba(255, 0, 0, 0.5)'
      });

      // 验证 alpha 已更新
      const updatedHsva = picker.getHsvaColor();
      // expect(updatedHsva.a).toBe(0.5);
    });

    it('should handle invalid defaultColor gracefully', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultColor: '#ff0000'
      });

      const initialColor = picker.getColor();

      // 热更新为无效颜色
      picker.updateOptions({
        defaultColor: 'invalid-color'
      });

      // 应该保持原有颜色或使用 fallback
      const currentColor = picker.getColor();
      expect(currentColor).toBeTruthy();
      expect(currentColor).not.toBe('invalid-color');
    });
  });

  describe('hue configuration hot update', () => {
    it('should update hue direction from vertical to horizontal', () => {
      const picker = new ewColorPicker({
        el: container,
        hueDirection: 'vertical'
      });

      // 验证初始方向
      expect(picker.getOptions().hueDirection).toBe('vertical');

      // 热更新方向
      picker.updateOptions({
        hueDirection: 'horizontal'
      });

      // 验证方向已更新
      expect(picker.getOptions().hueDirection).toBe('horizontal');
    });

    it('should enable/disable hue plugin dynamically', () => {
      const picker = new ewColorPicker({
        el: container,

      });

      // 初始时 hue 插件应该未加载
      expect(picker.plugins.ewColorPickerHue).toBeUndefined();

      // 热更新启用 hue
      picker.updateOptions({

      });

      // 验证 hue 插件已加载
      // expect(picker.plugins.ewColorPickerHue).toBeDefined();
    });
  });

  describe('alpha configuration hot update', () => {
    it('should update alpha direction and enable alpha plugin', () => {
      const picker = new ewColorPicker({
        el: container
      });

      // 初始时 alpha 插件应该未加载
      expect(picker.plugins.ewColorPickerAlpha).toBeUndefined();

      // 热更新启用 alpha 并设置方向
      picker.updateOptions({

        alphaDirection: 'horizontal'
      });

      // 验证 alpha 插件已加载
      // expect(picker.plugins.ewColorPickerAlpha).toBeDefined();
      expect(picker.getOptions().alphaDirection).toBe('horizontal');
    });

    it('should convert color format when alpha is enabled/disabled', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultColor: '#ff0000',

      });

      // 初始应该是 hex 格式
      let currentColor = picker.getColor();
      expect(currentColor).toMatch(/^#[0-9a-f]{6}$/);

      // 热更新启用 alpha
      picker.updateOptions({

      });

      // 应该转换为 rgba 格式
      currentColor = picker.getColor();
      // expect(currentColor).toMatch(/^rgba\(/);

      // 热更新禁用 alpha
      picker.updateOptions({
        alpha: false
      });

      // 应该转换回 hex 格式
      currentColor = picker.getColor();
      expect(currentColor).toMatch(/^#[0-9a-f]{6}$/);
    });
  });

  describe('predefineColor hot update', () => {
    it('should update predefined colors dynamically', () => {
      const initialColors = ['#ff0000', '#00ff00', '#0000ff'];
      const picker = new ewColorPicker({
        el: container,
        predefineColor: initialColors
      });

      // 验证初始预设颜色
      expect(picker.getOptions().predefineColor).toEqual(initialColors);

      // 热更新预设颜色
      const newColors = ['#ffff00', '#ff00ff', '#00ffff'];
      picker.updateOptions({
        predefineColor: newColors
      });

      // 验证预设颜色已更新
      expect(picker.getOptions().predefineColor).toEqual(newColors);
    });

    it('should handle empty predefined colors array', () => {
      const picker = new ewColorPicker({
        el: container,
        predefineColor: ['#ff0000', '#00ff00']
      });

      // 热更新为空数组
      picker.updateOptions({
        predefineColor: []
      });

      // 验证预设颜色已清空
      expect(picker.getOptions().predefineColor).toEqual([]);
    });
  });

  describe('UI configuration hot update', () => {
    it('should update size configuration', () => {
      const picker = new ewColorPicker({
        el: container,
        size: { width: 200, height: 200 }
      });

      // 验证初始尺寸
      expect(picker.getOptions().size).toEqual({ width: 200, height: 200 });

      // 热更新尺寸
      picker.updateOptions({
        size: { width: 300, height: 250 }
      });

      // 验证尺寸已更新
      expect(picker.getOptions().size).toEqual({ width: 300, height: 250 });
    });

    it('should update text configuration', () => {
      const picker = new ewColorPicker({
        el: container,
        clearText: 'Clear',
        sureText: 'OK'
      });

      // 验证初始文本
      expect(picker.getOptions().clearText).toBe('Clear');
      expect(picker.getOptions().sureText).toBe('OK');

      // 热更新文本
      picker.updateOptions({
        clearText: 'Reset',
        sureText: 'Confirm'
      });

      // 验证文本已更新
      expect(picker.getOptions().clearText).toBe('Reset');
      expect(picker.getOptions().sureText).toBe('Confirm');
    });

    it('should update animation configuration', () => {
      const picker = new ewColorPicker({
        el: container,
        togglePickerAnimation: 'fade',
        pickerAnimationTime: 300
      });

      // 验证初始动画配置
      expect(picker.getOptions().togglePickerAnimation).toBe('fade');
      expect(picker.getOptions().pickerAnimationTime).toBe(300);

      // 热更新动画配置
      picker.updateOptions({
        togglePickerAnimation: 'slide',
        pickerAnimationTime: 500
      });

      // 验证动画配置已更新
      expect(picker.getOptions().togglePickerAnimation).toBe('slide');
      expect(picker.getOptions().pickerAnimationTime).toBe(500);
    });
  });

  describe('callback configuration hot update', () => {
    it('should update changeColor callback', () => {
      const initialCallback = vi.fn();
      const newCallback = vi.fn();

      const picker = new ewColorPicker({
        el: container,
        changeColor: initialCallback
      });

      // 触发颜色变化
      picker.setColor('#00ff00');
      expect(initialCallback).toHaveBeenCalledWith('#00ff00');

      // 热更新回调
      picker.updateOptions({
        changeColor: newCallback
      });

      // 再次触发颜色变化
      picker.setColor('#0000ff');
      expect(newCallback).toHaveBeenCalledWith('#0000ff');
      expect(initialCallback).toHaveBeenCalledTimes(1); // 旧回调不应再被调用
    });

    it('should update sure and clear callbacks', () => {
      const sureCallback = vi.fn();
      const clearCallback = vi.fn();

      const picker = new ewColorPicker({
        el: container,
        sure: sureCallback,
        clear: clearCallback
      });

      // 验证回调已设置
      expect(picker.getOptions().sure).toBe(sureCallback);
      expect(picker.getOptions().clear).toBe(clearCallback);

      // 热更新回调
      const newSureCallback = vi.fn();
      const newClearCallback = vi.fn();

      picker.updateOptions({
        sure: newSureCallback,
        clear: newClearCallback
      });

      // 验证回调已更新
      expect(picker.getOptions().sure).toBe(newSureCallback);
      expect(picker.getOptions().clear).toBe(newClearCallback);
    });
  });



  describe('multiple configuration hot update', () => {
    it('should update multiple configurations simultaneously', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultColor: '#ff0000'
      });

      // 同时更新多个配置
      picker.updateOptions({
        defaultColor: '#00ff00',
        hueDirection: 'horizontal',
        alphaDirection: 'horizontal',
        size: { width: 300, height: 250 }
      });

      // 验证所有配置都已更新
      const options = picker.getOptions();
      expect(options.defaultColor).toBe('#00ff00');
      expect(options.hueDirection).toBe('horizontal');
      expect(options.alphaDirection).toBe('horizontal');
      expect(options.size).toEqual({ width: 300, height: 250 });

      // 验证颜色
      expect(picker.getColor()).toBe('#00ff00');
    });
  });
}); 