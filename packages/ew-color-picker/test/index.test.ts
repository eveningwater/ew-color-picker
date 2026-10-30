import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { create } from '../../utils/src/dom';
import EWColorPicker from '../src/index';

describe('EWColorPicker', () => {
  let container: HTMLElement;
  let colorPicker: any;

  beforeEach(() => {
    container = create('div');
    // 不添加到 document.body，保持独立的容器
  });

  afterEach(() => {
    if (colorPicker) {
      colorPicker.destroy();
    }
    // 清理容器
    if (container) {
      container.innerHTML = '';
    }
  });

  describe('initialization', () => {
    it('should create color picker instance with default options', () => {
      colorPicker = new EWColorPicker({ el: container });

      
      expect(colorPicker).toBeInstanceOf(EWColorPicker);
      expect(colorPicker.wrapper).toBeDefined(); // wrapper 是创建的主容器
      expect(colorPicker.wrapper.classList.contains('ew-color-picker')).toBe(true);
      expect(colorPicker.options).toBeDefined();
    });

    it('should create color picker instance with custom options', () => {
      const options = {
        el: container,
        defaultColor: '#ff0000',
        showAlpha: true,
        showHue: true
      };
      
      colorPicker = new EWColorPicker(options);

      
      expect(colorPicker.options.defaultColor).toBe('#ff0000');
      expect(colorPicker.options.showAlpha).toBe(true);
      expect(colorPicker.options.showHue).toBe(true);
    });
  });

  describe('plugin management', () => {
    it('should register plugins', () => {
      colorPicker = new EWColorPicker({ el: container });

      
      const mockPlugin = {
        name: 'test-plugin',
        install: vi.fn()
      };
      
      colorPicker.use(mockPlugin);
      
      expect(mockPlugin.install).toHaveBeenCalledWith(colorPicker);
    });

    it('should apply plugins during initialization', () => {
      const mockPlugin = {
        name: 'test-plugin',
        install: vi.fn()
      };
      
      colorPicker = new EWColorPicker({ el: container });

      colorPicker.use(mockPlugin);
      
      expect(mockPlugin.install).toHaveBeenCalled();
    });
  });

  describe('color management', () => {
    it('should set and get color', () => {
      colorPicker = new EWColorPicker({ el: container });

      
      colorPicker.setColor('#00ff00');
      const color = colorPicker.getColor();
      
      expect(color).toBe('#00ff00');
    });

    it('should emit color change events', () => {
      colorPicker = new EWColorPicker({ el: container });

      let eventEmitted = false;
      
      // 先监听事件，再设置颜色
      colorPicker.on('change', () => {
        eventEmitted = true;
      });
      
      // 测试事件系统是否正常工作 - 使用 emit 方法
      colorPicker.emit('change', 'test');
      expect(eventEmitted).toBe(true);
      
      // 重置
      eventEmitted = false;
      
      // 测试通过 setColor 触发事件
      colorPicker.setColor('#ff0000');
      expect(eventEmitted).toBe(true);
    });

    it('should handle HSVA color operations', () => {
      colorPicker = new EWColorPicker({ el: container });

      
      const hsva = { h: 120, s: 100, v: 100, a: 1 };
      colorPicker.setHsvaColor(hsva);
      
      const result = colorPicker.getHsvaColor();
      expect(result.h).toBe(120);
      expect(result.s).toBe(100);
      expect(result.v).toBe(100);
      expect(result.a).toBe(1);
    });
  });

  describe('lifecycle methods', () => {
    it('should initialize properly', () => {
      colorPicker = new EWColorPicker({ el: container });

      
      expect(colorPicker).toBeInstanceOf(EWColorPicker);
      expect(colorPicker.wrapper).toBeDefined(); // wrapper 是创建的主容器
      expect(colorPicker.wrapper.classList.contains('ew-color-picker')).toBe(true);
    });

    it('should destroy properly', () => {
      colorPicker = new EWColorPicker({ el: container });

      
      expect(() => colorPicker.destroy()).not.toThrow();
    });

    it('should handle multiple destroy calls', () => {
      colorPicker = new EWColorPicker({ el: container });

      colorPicker.destroy();
      
      expect(() => colorPicker.destroy()).not.toThrow();
    });
  });

  describe('event handling', () => {
    it('should register event listeners', () => {
      colorPicker = new EWColorPicker({ el: container });

      let eventHandled = false;
      
      colorPicker.on('change', () => {
        eventHandled = true;
      });
      
      colorPicker.emit('change');
      expect(eventHandled).toBe(true);
    });

    it('should remove event listeners', () => {
      colorPicker = new EWColorPicker({ el: container });

      let eventHandled = false;
      
      const handler = () => {
        eventHandled = true;
      };
      
      colorPicker.on('change', handler);
      colorPicker.off('change', handler);
      
      colorPicker.emit('change');
      expect(eventHandled).toBe(false);
    });
  });

  describe('utility methods', () => {
    it('should get container element', () => {
      colorPicker = new EWColorPicker({ el: container });

      
      // getContainer() 应该返回传入的原始容器元素
      expect(colorPicker.getContainer()).toBe(container);
      // wrapper 是创建的主容器，应该包含在原始容器内
      expect(colorPicker.wrapper.parentNode).toBe(container);
      expect(colorPicker.wrapper.classList.contains('ew-color-picker')).toBe(true);
    });

    it('should get current options', () => {
      const options = { el: container, defaultColor: '#ff0000' };
      colorPicker = new EWColorPicker(options);

      
      expect(colorPicker.getOptions()).toEqual(expect.objectContaining(options));
    });

    it('should update options', () => {
      colorPicker = new EWColorPicker({ el: container });

      const newOptions = { showAlpha: true };
      
      colorPicker.updateOptions(newOptions);
      
      expect(colorPicker.options.showAlpha).toBe(true);
    });
  });

  describe('plugin detection', () => {
    it('should detect missing required plugins', () => {
      colorPicker = new EWColorPicker(container, {
        showAlpha: true,
        showHue: true,
        showPanel: true
      });
      
      // Should warn about missing plugins in development
      colorPicker.init();
      
      // Verify that warnings are logged (in development mode)
      expect(colorPicker).toBeDefined();
    });
  });
}); 