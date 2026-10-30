import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { create } from '../../utils/src/dom';
import ewColorPicker from '../src/index';

describe('ewColorPicker 综合配置测试', () => {
  let container: HTMLElement;
  let core: ewColorPicker;

  beforeEach(() => {
    container = create('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    if (core) {
      core.destroy();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('基础配置测试', () => {
    it('应该支持所有实际存在的配置项', () => {
      const config = {
        el: container,
        defaultColor: '#ff0000',
        hasInput: true,
        openChangeColorMode: true,
        alpha: true,
        hue: true,
        predefineColor: ['#ff0000', '#00ff00', '#0000ff'],
        hasBox: true,
        hasPanel: true,
        hasClear: true,
        hasSure: true,
        size: 'small',
        hueDirection: 'vertical',
        alphaDirection: 'horizontal',
        clearText: '清除',
        sureText: '确定',
        changeColor: vi.fn(),
        sure: vi.fn(),
        clear: vi.fn(),
  
        isClickOutside: true,
        togglePickerAnimation: 'slide',
        pickerAnimationTime: 300,
        autoPanelPosition: true,
        panelPlacement: 'bottom'
      };

      core = new ewColorPicker(config);
      
      // 验证核心配置
      expect(core.options.defaultColor).toBe('#ff0000');
      expect(core.options.openChangeColorMode).toBe(true);
      expect(core.options.predefineColor).toEqual(['#ff0000', '#00ff00', '#0000ff']);
      expect(core.options.size).toBe('small');
      expect(core.options.hueDirection).toBe('vertical');
      expect(core.options.alphaDirection).toBe('horizontal');
      expect(core.options.clearText).toBe('清除');
      expect(core.options.sureText).toBe('确定');
      expect(core.options.changeColor).toBe(config.changeColor);
      expect(core.options.sure).toBe(config.sure);
      expect(core.options.clear).toBe(config.clear);
  
      expect(core.options.isClickOutside).toBe(true);
      expect(core.options.togglePickerAnimation).toBe('slide');
      expect(core.options.pickerAnimationTime).toBe(300);
      expect(core.options.autoPanelPosition).toBe(true);
      expect(core.options.panelPlacement).toBe('bottom');
    });

    it('应该处理最小配置', () => {
      core = new ewColorPicker({ el: container });
      
      expect(core).toBeInstanceOf(ewColorPicker);
      expect(core.options.el).toBe(container);
      expect(core.currentColor).toBe('');
    });

    it('应该处理颜色相关配置', () => {
      core = new ewColorPicker({
        el: container,
        defaultColor: '#00ff00',
        predefineColor: ['#ff0000', '#0000ff']
      });
      
      expect(core.options.defaultColor).toBe('#00ff00');
      expect(core.options.predefineColor).toEqual(['#ff0000', '#0000ff']);
      expect(core.currentColor).toBe('#00ff00');
    });

    it('应该处理UI相关配置', () => {
      core = new ewColorPicker({
        el: container,
        size: 'large',
        clearText: '清空',
        sureText: '确认'
      });
      
      expect(core.options.size).toBe('large');
      expect(core.options.clearText).toBe('清空');
      expect(core.options.sureText).toBe('确认');
    });
  });

  describe('颜色格式测试', () => {
    it('应该支持HEX颜色格式', () => {
      core = new ewColorPicker({
        el: container,
        defaultColor: '#ff0000'
      });
      expect(core.currentColor).toBe('#ff0000');
    });

    it('应该支持RGB颜色格式', () => {
      core = new ewColorPicker({
        el: container,
        defaultColor: 'rgb(255, 0, 0)'
      });
      expect(core.currentColor).toBe('rgb(255, 0, 0)');
    });

    it('应该支持RGBA颜色格式', () => {
      core = new ewColorPicker({
        el: container,
        defaultColor: 'rgba(255, 0, 0, 0.5)'
      });
      // RGBA颜色会被转换为HEX格式
      expect(core.currentColor).toBe('#FF0000');
    });

    it('应该支持HSL颜色格式', () => {
      core = new ewColorPicker({
        el: container,
        defaultColor: 'hsl(0, 100%, 50%)'
      });
      expect(core.currentColor).toBe('hsl(0, 100%, 50%)');
    });

    it('应该支持HSLA颜色格式', () => {
      core = new ewColorPicker({
        el: container,
        defaultColor: 'hsla(0, 100%, 50%, 0.5)'
      });
      expect(core.currentColor).toBe('hsla(0, 100%, 50%, 0.5)');
    });

    it('应该支持颜色关键字', () => {
      core = new ewColorPicker({
        el: container,
        defaultColor: 'red'
      });
      expect(core.currentColor).toBe('red');
    });
  });

  describe('预设颜色测试', () => {
    it('应该支持字符串数组预设颜色', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      core = new ewColorPicker({
        el: container,
        predefineColor: colors
      });
      expect(core.options.predefineColor).toEqual(colors);
    });

    it('应该支持空数组预设颜色', () => {
      core = new ewColorPicker({
        el: container,
        predefineColor: []
      });
      expect(core.options.predefineColor).toEqual([]);
    });

    it('应该支持对象数组预设颜色', () => {
      const colors = [
        { color: '#ff0000', disabled: false },
        { color: '#00ff00', disabled: true }
      ];
      core = new ewColorPicker({
        el: container,
        predefineColor: colors
      });
      expect(core.options.predefineColor).toEqual(colors);
    });
  });

  describe('尺寸配置测试', () => {
    it('应该支持字符串尺寸', () => {
      core = new ewColorPicker({
        el: container,
        size: 'small'
      });
      expect(core.options.size).toBe('small');
    });

    it('应该支持对象尺寸', () => {
      const size = { width: '200px', height: '150px' };
      core = new ewColorPicker({
        el: container,
        size: size
      });
      expect(core.options.size).toEqual(size);
    });
  });

  describe('方向配置测试', () => {
    it('应该支持垂直色相方向', () => {
      core = new ewColorPicker({
        el: container,
        hueDirection: 'vertical'
      });
      expect(core.options.hueDirection).toBe('vertical');
    });

    it('应该支持水平色相方向', () => {
      core = new ewColorPicker({
        el: container,
        hueDirection: 'horizontal'
      });
      expect(core.options.hueDirection).toBe('horizontal');
    });

    it('应该支持垂直透明度方向', () => {
      core = new ewColorPicker({
        el: container,
        alphaDirection: 'vertical'
      });
      expect(core.options.alphaDirection).toBe('vertical');
    });

    it('应该支持水平透明度方向', () => {
      core = new ewColorPicker({
        el: container,
        alphaDirection: 'horizontal'
      });
      expect(core.options.alphaDirection).toBe('horizontal');
    });
  });

  describe('面板位置测试', () => {
    it('应该支持各种面板位置', () => {
      const positions = ['top-start', 'top-end', 'bottom-start', 'bottom-end', 'left', 'right'];
      
      positions.forEach(position => {
        core = new ewColorPicker({
          el: container,
          panelPlacement: position as any
        });
        expect(core.options.panelPlacement).toBe(position);
      });
    });
  });

  describe('回调函数测试', () => {
    it('应该注册changeColor回调', () => {
      const changeColor = vi.fn();
      core = new ewColorPicker({
        el: container,
        changeColor: changeColor
      });
      expect(core.options.changeColor).toBe(changeColor);
    });

    it('应该注册sure回调', () => {
      const sure = vi.fn();
      core = new ewColorPicker({
        el: container,
        sure: sure
      });
      expect(core.options.sure).toBe(sure);
    });

    it('应该注册clear回调', () => {
      const clear = vi.fn();
      core = new ewColorPicker({
        el: container,
        clear: clear
      });
      expect(core.options.clear).toBe(clear);
    });
  });

  describe('边界条件测试', () => {
    it('应该处理空字符串颜色', () => {
      core = new ewColorPicker({
        el: container,
        defaultColor: ''
      });
      expect(core.currentColor).toBe('');
    });

    it('应该处理null颜色', () => {
      core = new ewColorPicker({
        el: container,
        defaultColor: null as any
      });
      expect(core.currentColor).toBe('');
    });

    it('应该处理undefined颜色', () => {
      core = new ewColorPicker({
        el: container,
        defaultColor: undefined as any
      });
      expect(core.currentColor).toBe('');
    });

    it('应该处理极长颜色数组', () => {
      const longColors = Array.from({ length: 100 }, (_, i) => `#${i.toString(16).padStart(6, '0')}`);
      core = new ewColorPicker({
        el: container,
        predefineColor: longColors
      });
      expect(core.options.predefineColor).toEqual(longColors);
    });

    it('应该处理极短动画时间', () => {
      core = new ewColorPicker({
        el: container,
        pickerAnimationTime: 0
      });
      expect(core.options.pickerAnimationTime).toBe(0);
    });

    it('应该处理极长动画时间', () => {
      core = new ewColorPicker({
        el: container,
        pickerAnimationTime: 10000
      });
      expect(core.options.pickerAnimationTime).toBe(10000);
    });
  });

  describe('异常情况测试', () => {
    it('应该优雅处理无效颜色格式', () => {
      expect(() => {
        core = new ewColorPicker({
          el: container,
          defaultColor: 'invalid-color'
        });
      }).not.toThrow();
    });

    it('应该优雅处理无效尺寸对象', () => {
      expect(() => {
        core = new ewColorPicker({
          el: container,
          size: { invalid: 'size' } as any
        });
      }).not.toThrow();
    });

    it('应该优雅处理无效面板位置', () => {
      expect(() => {
        core = new ewColorPicker({
          el: container,
          panelPlacement: 'invalid' as any
        });
      }).not.toThrow();
    });

    it('应该优雅处理无效色相方向', () => {
      expect(() => {
        core = new ewColorPicker({
          el: container,
          hueDirection: 'invalid' as any
        });
      }).not.toThrow();
    });

    it('应该优雅处理无效透明度方向', () => {
      expect(() => {
        core = new ewColorPicker({
          el: container,
          alphaDirection: 'invalid' as any
        });
      }).not.toThrow();
    });
  });

  describe('配置更新测试', () => {
    it('应该更新defaultColor', () => {
      core = new ewColorPicker({ el: container });
      core.updateOptions({ defaultColor: '#ff0000' });
      expect(core.options.defaultColor).toBe('#ff0000');
    });

    it('应该同时更新多个配置', () => {
      core = new ewColorPicker({ el: container });
      core.updateOptions({
        clearText: '清空'
      });
      expect(core.options.clearText).toBe('清空');
    });

    it('应该保留现有配置', () => {
      core = new ewColorPicker({
        el: container,
        defaultColor: '#ff0000'
      });
      core.updateOptions({ clearText: '清空' });
      expect(core.options.defaultColor).toBe('#ff0000');
      expect(core.options.clearText).toBe('清空');
    });
  });

  describe('事件系统测试', () => {
    it('应该注册事件监听器', () => {
      core = new ewColorPicker({ el: container });
      let eventHandled = false;
      
      core.on('change', () => {
        eventHandled = true;
      });
      
      core.emit('change');
      expect(eventHandled).toBe(true);
    });

    it('应该移除事件监听器', () => {
      core = new ewColorPicker({ el: container });
      let eventHandled = false;
      
      const handler = () => {
        eventHandled = true;
      };
      
      core.on('change', handler);
      core.off('change', handler);
      core.emit('change');
      
      expect(eventHandled).toBe(false);
    });
  });

  describe('生命周期测试', () => {
    it('应该正确初始化', () => {
      core = new ewColorPicker({ el: container });

      expect(core).toBeDefined();
      expect(core.wrapper).toBeDefined();
    });

    it('应该正确销毁', () => {
      core = new ewColorPicker({ el: container });

      expect(() => core.destroy()).not.toThrow();
    });

    it('应该处理多次销毁调用', () => {
      core = new ewColorPicker({ el: container });

      core.destroy();
      expect(() => core.destroy()).not.toThrow();
    });
  });

  describe('工具方法测试', () => {
    it('应该获取容器元素', () => {
      core = new ewColorPicker({ el: container });

      expect(core.getContainer()).toBe(container);
    });

    it('应该获取当前配置', () => {
      const options = { el: container, defaultColor: '#ff0000' };
      core = new ewColorPicker(options);
      expect(core.getOptions()).toEqual(expect.objectContaining(options));
    });

    it('应该设置和获取颜色', () => {
      core = new ewColorPicker({ el: container });
      core.setColor('#00ff00');
      const color = core.getColor();
      expect(color).toBe('#00ff00');
    });
  });

  describe('插件系统测试', () => {
    it('应该注册插件', () => {
      core = new ewColorPicker({ el: container });
      
      const mockPlugin = {
        name: 'test-plugin',
        install: vi.fn()
      };
      
      core.use(mockPlugin);
      expect(mockPlugin.install).toHaveBeenCalledWith(core);
    });

    it('应该应用插件', () => {
      const mockPlugin = {
        name: 'test-plugin',
        install: vi.fn()
      };
      
      core = new ewColorPicker({ el: container });
      core.use(mockPlugin);
      expect(mockPlugin.install).toHaveBeenCalled();
    });
  });
}); 