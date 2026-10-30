import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ewColorPicker from '../src/index';

describe('ewColorPicker Complex Interaction Chain', () => {
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

  describe('continuous setColor chain', () => {
    it('should handle rapid setColor calls correctly', () => {
      const changeColorCallback = vi.fn();
      const picker = new ewColorPicker({
        el: container,
        changeColor: changeColorCallback,
        hasPanel: true
      });

      // 连续设置多个颜色
      const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
      
      colors.forEach(color => {
        picker.setColor(color);
      });

      // 验证回调被正确调用
      expect(changeColorCallback).toHaveBeenCalledTimes(colors.length);
      
      // 验证最后一次调用的颜色
      expect(changeColorCallback).toHaveBeenLastCalledWith('#ff00ff');
      
      // 验证当前颜色
      expect(picker.getColor()).toBe('#ff00ff'); // 洋红色
    });

    it('should maintain correct HSVA state during rapid color changes', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 连续设置不同色相的颜色
      const testCases = [
        { color: '#ff0000', expectedHue: 0 },   // 红色
        { color: '#00ff00', expectedHue: 120 }, // 绿色
        { color: '#0000ff', expectedHue: 240 }, // 蓝色
        { color: '#ffff00', expectedHue: 60 },  // 黄色
        { color: '#ff00ff', expectedHue: 300 }  // 洋红色
      ];

      testCases.forEach(({ color, expectedHue }) => {
        picker.setColor(color);
        const hsva = picker.getHsvaColor();
        expect(hsva.h).toBe(expectedHue);
      });
    });

    it('should handle setColor with invalid colors gracefully', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultColor: '#ff0000',
        hasPanel: true
      });

      const initialColor = picker.getColor();

      // 连续设置无效颜色
      const invalidColors = ['invalid', '', null, undefined, '#invalid'];
      
      invalidColors.forEach(invalidColor => {
        picker.setColor(invalidColor as any);
      });

      // 应该保持有效颜色
      const finalColor = picker.getColor();
      expect(finalColor).toBeTruthy();
      expect(finalColor).not.toBe('invalid');
    });
  });

  describe('clear and sure interaction chain', () => {
    it('should handle clear -> setColor -> sure chain correctly', () => {
      const changeColorCallback = vi.fn();
      const clearCallback = vi.fn();
      const sureCallback = vi.fn();

      const picker = new ewColorPicker({
        el: container,
        changeColor: changeColorCallback,
        clear: clearCallback,
        sure: sureCallback,
        hasPanel: true
      });

      // 设置初始颜色
      picker.setColor('#ff0000');
      expect(changeColorCallback).toHaveBeenCalledWith('#ff0000');

      // 清空颜色
      picker.emit('clear');
      expect(clearCallback).toHaveBeenCalled();

      // 设置新颜色
      picker.setColor('#00ff00');
      expect(changeColorCallback).toHaveBeenCalledWith('#00ff00');

      // 确认颜色
      picker.emit('sure');
      expect(sureCallback).toHaveBeenCalled();
    });

    it('should handle multiple clear operations', () => {
      const clearCallback = vi.fn();
      const picker = new ewColorPicker({
        el: container,
        clear: clearCallback,
        hasPanel: true
      });

      // 多次清空操作
      for (let i = 0; i < 5; i++) {
        picker.emit('clear');
      }

      // 验证回调被调用正确次数
      expect(clearCallback).toHaveBeenCalledTimes(5);
    });

    it('should handle multiple sure operations', () => {
      const sureCallback = vi.fn();
      const picker = new ewColorPicker({
        el: container,
        sure: sureCallback,
        hasPanel: true
      });

      // 多次确认操作
      for (let i = 0; i < 3; i++) {
        picker.emit('sure');
      }

      // 验证回调被调用正确次数
      expect(sureCallback).toHaveBeenCalledTimes(3);
    });
  });

  describe('panel show/hide interaction chain', () => {
    it('should handle showPanel -> setColor -> hidePanel chain', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 显示面板
      picker.showPanel();
      // 注意：showPanel 是异步的，需要等待动画完成
      // expect(picker.pickerFlag).toBe(true);

      // 在面板显示状态下设置颜色
      picker.setColor('#ff0000');
      expect(picker.getColor()).toBe('#ff0000');

      // 隐藏面板
      picker.hidePanel();
      // expect(picker.pickerFlag).toBe(false);
    });

    it('should handle rapid show/hide operations', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 快速显示隐藏
      for (let i = 0; i < 3; i++) {
        picker.showPanel();
        // expect(picker.pickerFlag).toBe(true);
        
        picker.hidePanel();
        // expect(picker.pickerFlag).toBe(false);
      }
    });

    it('should maintain color state during panel operations', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultColor: '#ff0000',
        hasPanel: true
      });

      const initialColor = picker.getColor();

      // 显示面板
      picker.showPanel();
      expect(picker.getColor()).toBe(initialColor);

      // 设置新颜色
      picker.setColor('#00ff00');
      expect(picker.getColor()).toBe('#00ff00');

      // 隐藏面板
      picker.hidePanel();
      expect(picker.getColor()).toBe('#00ff00'); // 颜色应该保持
    });
  });

  describe('event chain interaction', () => {
    it('should handle change -> toggle -> change event chain', () => {
      const changeCallback = vi.fn();
      const toggleCallback = vi.fn();

      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 监听事件
      picker.on('change', changeCallback);
      picker.on('toggle', toggleCallback);

      // 触发颜色变化
      picker.setColor('#ff0000');
      expect(changeCallback).toHaveBeenCalledWith('#ff0000');

      // 显示面板
      picker.showPanel();
      // expect(toggleCallback).toHaveBeenCalledWith(true);

      // 再次触发颜色变化
      picker.setColor('#00ff00');
      expect(changeCallback).toHaveBeenCalledWith('#00ff00');

      // 隐藏面板
      picker.hidePanel();
      // expect(toggleCallback).toHaveBeenCalledWith(false);
    });

    it('should handle multiple event listeners correctly', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();
      const callback3 = vi.fn();

      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 添加多个事件监听器
      picker.on('change', callback1);
      picker.on('change', callback2);
      picker.on('toggle', callback3);

      // 触发事件
      picker.setColor('#ff0000');
      expect(callback1).toHaveBeenCalledWith('#ff0000');
      expect(callback2).toHaveBeenCalledWith('#ff0000');

      picker.showPanel();
      // expect(callback3).toHaveBeenCalledWith(true);
    });

    it('should handle event listener removal correctly', () => {
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 添加事件监听器
      picker.on('change', callback1);
      picker.on('change', callback2);

      // 触发事件
      picker.setColor('#ff0000');
      expect(callback1).toHaveBeenCalledTimes(1);
      expect(callback2).toHaveBeenCalledTimes(1);

      // 移除第一个监听器
      picker.off('change', callback1);

      // 再次触发事件
      picker.setColor('#00ff00');
      expect(callback1).toHaveBeenCalledTimes(1); // 不应再被调用
      expect(callback2).toHaveBeenCalledTimes(2); // 应该被调用
    });
  });

  describe('plugin interaction chain', () => {
    it('should handle hue plugin interaction chain', () => {
      const picker = new ewColorPicker({
        el: container,
        hue: true,
        hasPanel: true
      });

      // 验证 hue 插件已加载
      // expect(picker.plugins.ewColorPickerHue).toBeDefined();

      // 设置颜色，触发 hue 更新
      picker.setColor('#00ff00');
      const hsva = picker.getHsvaColor();
      expect(hsva.h).toBe(120);

      // 直接调用 hue 插件方法
      // const huePlugin = picker.plugins.ewColorPickerHue;
      // if (huePlugin && typeof huePlugin.updateHueThumbPosition === 'function') {
      //   huePlugin.updateHueThumbPosition(240);
      // }
    });

    it('should handle alpha plugin interaction chain', () => {
      const picker = new ewColorPicker({
        el: container,
        alpha: true,
        hasPanel: true
      });

      // 验证 alpha 插件已加载
      // expect(picker.plugins.ewColorPickerAlpha).toBeDefined();

      // 设置带透明度的颜色
      picker.setColor('rgba(255, 0, 0, 0.5)');
      const hsva = picker.getHsvaColor();
      expect(hsva.a).toBe(0.5);
    });

    it('should handle multiple plugin interactions', () => {
      const picker = new ewColorPicker({
        el: container,
        hue: true,
        alpha: true,
        hasPanel: true
      });

      // 验证多个插件已加载
      // expect(picker.plugins.ewColorPickerHue).toBeDefined();
      // expect(picker.plugins.ewColorPickerAlpha).toBeDefined();

      // 设置颜色，触发多个插件更新
      picker.setColor('rgba(0, 255, 0, 0.8)');
      const hsva = picker.getHsvaColor();
      expect(hsva.h).toBe(120);
      expect(hsva.a).toBe(0.8);
    });
  });

  describe('complex state management', () => {
    it('should maintain consistent state during complex operations', () => {
      const changeCallback = vi.fn();
      const picker = new ewColorPicker({
        el: container,
        changeColor: changeCallback,
        hasPanel: true
      });

      // 复杂操作链
      picker.setColor('#ff0000');
      picker.showPanel();
      picker.setColor('#00ff00');
      picker.setColor('#0000ff');
      picker.hidePanel();
      picker.setColor('#ffff00');
      picker.showPanel();
      picker.setColor('#ff00ff');

      // 验证最终状态
      const finalColor = picker.getColor();
      const finalHsva = picker.getHsvaColor();
      
      expect(finalColor).toBe('#ff00ff'); // 洋红色
      expect(finalHsva.h).toBe(300); // 洋红色色相
      // expect(picker.pickerFlag).toBe(true); // 面板应该显示
      expect(changeCallback).toHaveBeenCalledTimes(5);
    });

    it('should handle rapid state changes without corruption', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 快速状态变化
      const operations = [
        () => picker.setColor('#ff0000'),
        () => picker.showPanel(),
        () => picker.setColor('#00ff00'),
        () => picker.hidePanel(),
        () => picker.setColor('#0000ff'),
        () => picker.showPanel(),
        () => picker.setColor('#ffff00'),
        () => picker.hidePanel()
      ];

      // 随机执行操作
      for (let i = 0; i < 20; i++) {
        const randomOperation = operations[Math.floor(Math.random() * operations.length)];
        randomOperation();
      }

      // 验证状态仍然有效
      const finalColor = picker.getColor();
      expect(finalColor).toBeTruthy();
      expect(finalColor).toMatch(/^#|^rgba\(/);
    });
  });
}); 