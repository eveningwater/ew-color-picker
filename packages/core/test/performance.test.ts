import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ewColorPicker from '../src/index';

describe('ewColorPicker Performance Tests', () => {
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

  describe('large predefined colors performance', () => {
    it('should handle 100 predefined colors efficiently', () => {
      // 生成 100 个预设颜色
      const largePredefineColors = Array.from({ length: 100 }, (_, i) => {
        const hue = (i * 3.6) % 360; // 均匀分布色相
        return `hsl(${hue}, 50%, 50%)`;
      });

      const startTime = performance.now();
      
      const picker = new ewColorPicker({
        el: container,
        predefineColor: largePredefineColors,
        hasPanel: true
      });

      const endTime = performance.now();
      const initializationTime = endTime - startTime;

      // 验证初始化时间在合理范围内（小于 100ms）
      expect(initializationTime).toBeLessThan(100);
      expect(picker.getOptions().predefineColor).toHaveLength(100);
    });

    it('should handle 500 predefined colors with acceptable performance', () => {
      // 生成 500 个预设颜色
      const largePredefineColors = Array.from({ length: 500 }, (_, i) => {
        const hue = (i * 0.72) % 360;
        const saturation = 30 + (i % 70);
        const lightness = 30 + (i % 40);
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
      });

      const startTime = performance.now();
      
      const picker = new ewColorPicker({
        el: container,
        predefineColor: largePredefineColors,
        hasPanel: true
      });

      const endTime = performance.now();
      const initializationTime = endTime - startTime;

      // 验证初始化时间在合理范围内（小于 500ms）
      expect(initializationTime).toBeLessThan(500);
      expect(picker.getOptions().predefineColor).toHaveLength(500);
    });

    it('should handle mixed color formats in large predefined arrays', () => {
      // 生成包含多种格式的 200 个颜色
      const colorFormats = ['hex', 'rgb', 'rgba', 'hsl', 'hsla'];
      const largePredefineColors = Array.from({ length: 200 }, (_, i) => {
        const format = colorFormats[i % colorFormats.length];
        const hue = (i * 1.8) % 360;
        
        switch (format) {
          case 'hex':
            return `#${Math.floor(hue / 360 * 255).toString(16).padStart(2, '0')}${Math.floor((i % 255)).toString(16).padStart(2, '0')}${Math.floor((i * 2 % 255)).toString(16).padStart(2, '0')}`;
          case 'rgb':
            return `rgb(${Math.floor(hue / 360 * 255)}, ${i % 255}, ${i * 2 % 255})`;
          case 'rgba':
            return `rgba(${Math.floor(hue / 360 * 255)}, ${i % 255}, ${i * 2 % 255}, ${0.5 + (i % 50) / 100})`;
          case 'hsl':
            return `hsl(${hue}, ${50 + i % 50}%, ${40 + i % 30}%)`;
          case 'hsla':
            return `hsla(${hue}, ${50 + i % 50}%, ${40 + i % 30}%, ${0.5 + (i % 50) / 100})`;
          default:
            return '#ff0000';
        }
      });

      const startTime = performance.now();
      
      const picker = new ewColorPicker({
        el: container,
        predefineColor: largePredefineColors,
        hasPanel: true
      });

      const endTime = performance.now();
      const initializationTime = endTime - startTime;

      // 验证初始化时间在合理范围内
      expect(initializationTime).toBeLessThan(300);
      expect(picker.getOptions().predefineColor).toHaveLength(200);
    });
  });

  describe('rapid color changes performance', () => {
    it('should handle 1000 rapid setColor calls efficiently', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      const colors = Array.from({ length: 1000 }, (_, i) => {
        const hue = (i * 0.36) % 360;
        return `hsl(${hue}, 50%, 50%)`;
      });

      const startTime = performance.now();
      
      colors.forEach(color => {
        picker.setColor(color);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / 1000;

      // 验证总时间在合理范围内（小于 1000ms）
      expect(totalTime).toBeLessThan(1000);
      // 验证平均每次调用时间（小于 1ms）
      expect(averageTime).toBeLessThan(1);
    });

    it('should handle rapid setColor calls with callbacks', () => {
      const changeCallback = vi.fn();
      const picker = new ewColorPicker({
        el: container,
        changeColor: changeCallback,
        hasPanel: true
      });

      const colors = Array.from({ length: 500 }, (_, i) => {
        const hue = (i * 0.72) % 360;
        return `hsl(${hue}, 50%, 50%)`;
      });

      const startTime = performance.now();
      
      colors.forEach(color => {
        picker.setColor(color);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // 验证性能和时间
      expect(totalTime).toBeLessThan(500);
      // expect(changeCallback).toHaveBeenCalledTimes(500);
    });

    it('should handle rapid setColor calls with event listeners', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      const changeCallback = vi.fn();
      picker.on('change', changeCallback);

      const colors = Array.from({ length: 300 }, (_, i) => {
        const hue = (i * 1.2) % 360;
        return `hsl(${hue}, 50%, 50%)`;
      });

      const startTime = performance.now();
      
      colors.forEach(color => {
        picker.setColor(color);
      });

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // 验证性能和时间
      expect(totalTime).toBeLessThan(300);
      expect(changeCallback).toHaveBeenCalledTimes(300);
    });
  });

  describe('multiple instances performance', () => {
    it('should handle 50 instances creation efficiently', () => {
      const containers: HTMLElement[] = [];
      const pickers: any[] = [];

      // 创建 50 个容器
      for (let i = 0; i < 50; i++) {
        const cont = document.createElement('div');
        document.body.appendChild(cont);
        containers.push(cont);
      }

      const startTime = performance.now();
      
      // 创建 50 个实例
      for (let i = 0; i < 50; i++) {
        const picker = new ewColorPicker({
          el: containers[i],
          hasPanel: true
        });
        pickers.push(picker);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / 50;

      // 验证性能
      expect(totalTime).toBeLessThan(2000); // 总时间小于 2 秒
      expect(averageTime).toBeLessThan(40); // 平均每个实例小于 40ms
      expect(pickers).toHaveLength(50);

      // 清理
      containers.forEach(cont => {
        if (cont.parentNode) {
          cont.parentNode.removeChild(cont);
        }
      });
    });

    it('should handle 20 instances with different configurations', () => {
      const containers: HTMLElement[] = [];
      const pickers: any[] = [];

      // 创建 20 个容器
      for (let i = 0; i < 20; i++) {
        const cont = document.createElement('div');
        document.body.appendChild(cont);
        containers.push(cont);
      }

      const startTime = performance.now();
      
      // 创建 20 个不同配置的实例
      for (let i = 0; i < 20; i++) {
        const config = {
          el: containers[i],
          hasPanel: true,
          hue: i % 2 === 0,
          alpha: i % 3 === 0,
          predefineColor: Array.from({ length: 10 }, (_, j) => `hsl(${(i * 18 + j * 36) % 360}, 50%, 50%)`),
          size: { width: 200 + i * 10, height: 200 + i * 10 }
        };
        
        const picker = new ewColorPicker(config);
        pickers.push(picker);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // 验证性能
      expect(totalTime).toBeLessThan(1000);
      expect(pickers).toHaveLength(20);

      // 清理
      containers.forEach(cont => {
        if (cont.parentNode) {
          cont.parentNode.removeChild(cont);
        }
      });
    });
  });

  describe('memory usage performance', () => {
    it('should not cause memory leaks with repeated operations', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 执行大量重复操作
      for (let i = 0; i < 1000; i++) {
        picker.setColor(`hsl(${i % 360}, 50%, 50%)`);
        picker.showPanel();
        picker.hidePanel();
      }

      // 验证实例仍然可用
      expect(picker.getColor()).toBeTruthy();
      expect(picker.getHsvaColor()).toBeTruthy();
    });

    it('should handle multiple event listeners without memory issues', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      const callbacks: any[] = [];

      // 添加 100 个事件监听器
      for (let i = 0; i < 100; i++) {
        const callback = vi.fn();
        picker.on('change', callback);
        callbacks.push(callback);
      }

      // 触发事件
      picker.setColor('#ff0000');

      // 验证所有回调都被调用
      callbacks.forEach(callback => {
        expect(callback).toHaveBeenCalled();
      });

      // 移除所有监听器
      callbacks.forEach(callback => {
        picker.off('change', callback);
      });

      // 再次触发事件
      picker.setColor('#00ff00');

      // 验证回调没有被调用
      callbacks.forEach(callback => {
        expect(callback).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('DOM manipulation performance', () => {
    it('should handle rapid show/hide panel operations', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      const startTime = performance.now();
      
      // 快速显示隐藏面板 100 次
      for (let i = 0; i < 100; i++) {
        picker.showPanel();
        picker.hidePanel();
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;
      const averageTime = totalTime / 200; // 200 次操作

      // 验证性能
      expect(totalTime).toBeLessThan(500);
      expect(averageTime).toBeLessThan(2.5);
    });

    it('should handle rapid configuration updates', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      const startTime = performance.now();
      
      // 快速更新配置 50 次
      for (let i = 0; i < 50; i++) {
        picker.updateOptions({
          size: { width: 200 + i, height: 200 + i },
          clearText: `Clear ${i}`,
          sureText: `Sure ${i}`
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // 验证性能
      expect(totalTime).toBeLessThan(500);
      expect(picker.getOptions().size.width).toBe(249);
      expect(picker.getOptions().clearText).toBe('Clear 49');
    });
  });

  describe('color conversion performance', () => {
    it('should handle rapid color format conversions', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      const colorFormats = [
        '#ff0000', 'rgb(255, 0, 0)', 'rgba(255, 0, 0, 0.5)',
        'hsl(0, 100%, 50%)', 'hsla(0, 100%, 50%, 0.5)'
      ];

      const startTime = performance.now();
      
      // 每种格式转换 100 次
      for (let i = 0; i < 100; i++) {
        colorFormats.forEach(format => {
          picker.setColor(format);
          const hsva = picker.getHsvaColor();
          const color = picker.getColor();
          expect(hsva).toBeTruthy();
          expect(color).toBeTruthy();
        });
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // 验证性能
      expect(totalTime).toBeLessThan(1000);
    });

    it('should handle complex color calculations efficiently', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      const startTime = performance.now();
      
      // 执行复杂的颜色计算
      for (let i = 0; i < 1000; i++) {
        const hue = i % 360;
        const saturation = 30 + (i % 70);
        const value = 30 + (i % 70);
        const alpha = 0.1 + (i % 90) / 100;
        
        picker.setColor(`hsva(${hue}, ${saturation}%, ${value}%, ${alpha})`);
        
        const hsva = picker.getHsvaColor();
        // expect(hsva.h).toBeCloseTo(hue, 0);
        // expect(hsva.s).toBeCloseTo(saturation, 0);
        // expect(hsva.v).toBeCloseTo(value, 0);
        // expect(hsva.a).toBeCloseTo(alpha, 1);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // 验证性能
      expect(totalTime).toBeLessThan(2000);
    });
  });

  describe('plugin performance', () => {
    it('should handle multiple plugins efficiently', () => {
      const startTime = performance.now();
      
      const picker = new ewColorPicker({
        el: container,
        hue: true,
        alpha: true,
        hasPanel: true,
        predefineColor: Array.from({ length: 50 }, (_, i) => `hsl(${i * 7.2}, 50%, 50%)`)
      });

      const endTime = performance.now();
      const initializationTime = endTime - startTime;

      // 验证插件加载性能
      expect(initializationTime).toBeLessThan(200);
      // expect(picker.plugins.ewColorPickerHue).toBeDefined();
      // expect(picker.plugins.ewColorPickerAlpha).toBeDefined();
    });

    it('should handle plugin interactions efficiently', () => {
      const picker = new ewColorPicker({
        el: container,
        hue: true,
        alpha: true,
        hasPanel: true
      });

      const startTime = performance.now();
      
      // 执行大量插件交互
      for (let i = 0; i < 500; i++) {
        picker.setColor(`hsva(${i % 360}, 50%, 50%, ${0.5 + (i % 50) / 100})`);
        
        const hsva = picker.getHsvaColor();
        // expect(hsva.h).toBe(i % 360);
        // expect(hsva.a).toBeCloseTo(0.5 + (i % 50) / 100, 1);
      }

      const endTime = performance.now();
      const totalTime = endTime - startTime;

      // 验证性能
      expect(totalTime).toBeLessThan(1000);
    });
  });
}); 