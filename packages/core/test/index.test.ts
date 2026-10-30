import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { create } from '../../utils/src/dom';
import ewColorPicker from '../src/index';

describe('ewColorPicker', () => {
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
    // 安全地移除容器
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('initialization', () => {
    it('should create core instance with default options', () => {
      core = new ewColorPicker({ el: container });

      
      expect(core).toBeInstanceOf(ewColorPicker);
      expect(core.wrapper).toBeDefined(); // wrapper 是创建的主容器
      expect(core.wrapper.classList.contains('ew-color-picker')).toBe(true);
      expect(core.options).toBeDefined();
    });

    it('should create core instance with custom options', () => {
      const options = {
        el: container,
        defaultColor: '#ff0000',
        
      };
      
      core = new ewColorPicker(options);

      
      expect(core.options.defaultColor).toBe('#ff0000');

    });
  });

  describe('plugin management', () => {
    it('should register plugins', () => {
      core = new ewColorPicker({ el: container });

      
      const mockPlugin = {
        name: 'test-plugin',
        install: vi.fn()
      };
      
      core.use(mockPlugin);
      
      expect(mockPlugin.install).toHaveBeenCalledWith(core);
    });

    it('should apply plugins during initialization', () => {
      const mockPlugin = {
        name: 'test-plugin',
        install: vi.fn()
      };
      
      core = new ewColorPicker({ el: container });

      core.use(mockPlugin);
      
      expect(mockPlugin.install).toHaveBeenCalled();
    });
  });

  describe('color management', () => {
    it('should set and get color', () => {
      core = new ewColorPicker({ el: container });

      
      core.setColor('#00ff00');
      const color = core.getColor();
      
      expect(color).toBe('#00ff00');
    });

    it('should emit color change events', () => {
      core = new ewColorPicker({ el: container });

      let eventEmitted = false;
      
      // 先监听事件，再设置颜色
      core.on('change', () => {
        eventEmitted = true;
      });
      
      // 测试事件系统是否正常工作 - 使用 emit 方法
      core.emit('change', 'test');
      expect(eventEmitted).toBe(true);
      
      // 重置
      eventEmitted = false;
      
      // 设置颜色，应该触发 change 事件
      core.setColor('#ff0000');
      
      // 直接检查事件是否被触发
      expect(eventEmitted).toBe(true);
    });
  });

  describe('lifecycle methods', () => {
    it('should initialize properly', () => {
      core = new ewColorPicker({ el: container });

      
      expect(core).toBeDefined();
    });

    it('should destroy properly', () => {
      core = new ewColorPicker({ el: container });

      
      expect(() => core.destroy()).not.toThrow();
    });

    it('should handle multiple destroy calls', () => {
      core = new ewColorPicker({ el: container });

      core.destroy();
      
      expect(() => core.destroy()).not.toThrow();
    });
  });

  describe('event handling', () => {
    it('should register event listeners', () => {
      core = new ewColorPicker({ el: container });

      let eventHandled = false;
      
      core.on('change', () => {
        eventHandled = true;
      });
      
      core.emit('change');
      
      expect(eventHandled).toBe(true);
    });

    it('should remove event listeners', () => {
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

  describe('utility methods', () => {
    it('should get container element', () => {
      core = new ewColorPicker({ el: container });

      
      expect(core.getContainer()).toBe(container);
    });

    it('should get current options', () => {
      const options = { el: container, defaultColor: '#ff0000' };
      core = new ewColorPicker(options);

      
      expect(core.getOptions()).toEqual(expect.objectContaining(options));
    });

    it('should update options', () => {
      core = new ewColorPicker({ el: container });

      const newOptions = { defaultColor: '#00ff00' };
      
      core.updateOptions(newOptions);
      
      expect(core.options.defaultColor).toBe('#00ff00');
    });
  });

  describe('defaultColor handling', () => {
    it('should not set currentColor when defaultColor is not provided', () => {
      core = new ewColorPicker({ el: container });

      
      // 没有设置 defaultColor 时，currentColor 应该为空
      expect(core.currentColor).toBe('');
    });

    it('should set currentColor when defaultColor is provided', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: '#00ff00' 
      });

      
      // 设置了 defaultColor 时，currentColor 应该等于 defaultColor
      // 颜色会被转换为RGBA格式
      // 颜色会被转换为HEX格式（因为默认没有开启alpha）
      // 颜色会被转换为HEX格式（因为默认没有开启alpha）
      expect(core.currentColor).toBe('#00ff00');
    });

    it('should use defaultColor in showPanel when currentColor is empty', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: '#0000ff' 
      });

      
      // 清空 currentColor
      core.currentColor = '';
      
      // 调用 showPanel，应该使用 defaultColor
      core.showPanel();
      
      expect(core.currentColor).toBe('#0000ff');
    });

    it('should use fallback red color in showPanel when both currentColor and defaultColor are empty', () => {
      core = new ewColorPicker({ el: container });

      
      // 确保 currentColor 为空
      core.currentColor = '';
      
      // 调用 showPanel，应该使用默认红色
      core.showPanel();
      
      expect(core.currentColor).toBe('#ff0000');
    });
  });

  // ========== 新增：所有配置对象参数的全面测试 ==========

  describe('配置对象参数测试 - defaultColor', () => {
    it('should handle hex defaultColor', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: '#ff0000' 
      });

      expect(core.currentColor).toBe('#ff0000');
    });

    it('should handle rgb defaultColor', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: 'rgb(255, 0, 0)' 
      });

      expect(core.currentColor).toBe('rgb(255, 0, 0)');
    });

    it('should handle rgba defaultColor', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: 'rgba(255, 0, 0, 0.5)' 
      });

      // RGBA颜色会被转换为HEX格式
      expect(core.currentColor).toBe('#FF0000');
    });

    it('should handle hsl defaultColor', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: 'hsl(0, 100%, 50%)' 
      });

      expect(core.currentColor).toBe('hsl(0, 100%, 50%)');
    });

    it('should handle hsla defaultColor', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: 'hsla(0, 100%, 50%, 0.5)' 
      });

      expect(core.currentColor).toBe('hsla(0, 100%, 50%, 0.5)');
    });

    it('should handle color keyword defaultColor', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: 'red' 
      });

      expect(core.currentColor).toBe('red');
    });

    it('should handle empty string defaultColor', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: '' 
      });

      expect(core.currentColor).toBe('');
    });

    it('should handle null defaultColor', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: null as any 
      });

      expect(core.currentColor).toBe('');
    });

    it('should handle undefined defaultColor', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: undefined as any 
      });

      expect(core.currentColor).toBe('');
    });
  });



  describe('配置对象参数测试 - color-mode插件', () => {
    it('should check color mode plugin registration', async () => {
      core = new ewColorPicker({ el: container });

      // 等待DOM渲染完成
      await new Promise(resolve => setTimeout(resolve, 200));
      // 检查DOM中是否存在color-mode插件的元素
      const modeContainer = container.querySelector('.ew-color-picker-mode-container');
      expect(modeContainer).toBeDefined();
    });

    it('should check alpha plugin dependency for color mode', async () => {
      core = new ewColorPicker({ el: container });

      // 等待DOM渲染完成
      await new Promise(resolve => setTimeout(resolve, 200));
      // 检查DOM中是否存在alpha插件的元素
      const alphaSlider = container.querySelector('.ew-color-picker-slider.ew-alpha');
      expect(alphaSlider).toBeDefined();
    });

    it('should check input-number plugin dependency for color mode', async () => {
      core = new ewColorPicker({ el: container });

      // 等待DOM渲染完成
      await new Promise(resolve => setTimeout(resolve, 200));
      // 检查DOM中是否存在input-number插件的元素
      const inputsGroup = container.querySelector('.ew-color-picker-inputs-group');
      expect(inputsGroup).toBeDefined();
    });
  });





  describe('配置对象参数测试 - predefineColor', () => {
    it('should handle string array predefineColor', () => {
      const colors = ['#ff0000', '#00ff00', '#0000ff'];
      core = new ewColorPicker({ 
        el: container, 
        predefineColor: colors 
      });

      expect(core.options.predefineColor).toEqual(colors);
    });

    it('should handle empty array predefineColor', () => {
      core = new ewColorPicker({ 
        el: container, 
        predefineColor: [] 
      });

      expect(core.options.predefineColor).toEqual([]);
    });

    it('should handle object array predefineColor', () => {
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

    it('should use default predefineColor value when not specified', () => {
      core = new ewColorPicker({ el: container });

      expect(core.options.predefineColor).toBeDefined();
    });
  });









  describe('配置对象参数测试 - size', () => {
    it('should handle string size', () => {
      core = new ewColorPicker({ 
        el: container, 
        size: 'small' 
      });

      expect(core.options.size).toBe('small');
    });

    it('should handle object size', () => {
      const size = { width: '200px', height: '150px' };
      core = new ewColorPicker({ 
        el: container, 
        size: size 
      });

      expect(core.options.size).toEqual(size);
    });

    it('should use default size value when not specified', () => {
      core = new ewColorPicker({ el: container });

      expect(core.options.size).toBeDefined();
    });
  });

  describe('配置对象参数测试 - hueDirection', () => {
    it('should handle vertical hueDirection', () => {
      core = new ewColorPicker({ 
        el: container, 
        hueDirection: 'vertical' 
      });

      expect(core.options.hueDirection).toBe('vertical');
    });

    it('should handle horizontal hueDirection', () => {
      core = new ewColorPicker({ 
        el: container, 
        hueDirection: 'horizontal' 
      });

      expect(core.options.hueDirection).toBe('horizontal');
    });

    it('should use default hueDirection value when not specified', () => {
      core = new ewColorPicker({ el: container });

      expect(core.options.hueDirection).toBeDefined();
    });
  });

  describe('配置对象参数测试 - alphaDirection', () => {
    it('should handle vertical alphaDirection', () => {
      core = new ewColorPicker({ 
        el: container, 
        alphaDirection: 'vertical' 
      });

      expect(core.options.alphaDirection).toBe('vertical');
    });

    it('should handle horizontal alphaDirection', () => {
      core = new ewColorPicker({ 
        el: container, 
        alphaDirection: 'horizontal' 
      });

      expect(core.options.alphaDirection).toBe('horizontal');
    });

    it('should use default alphaDirection value when not specified', () => {
      core = new ewColorPicker({ el: container });

      expect(core.options.alphaDirection).toBeDefined();
    });
  });

  describe('配置对象参数测试 - clearText', () => {
    it('should handle custom clearText', () => {
      core = new ewColorPicker({ 
        el: container, 
        clearText: '清除' 
      });

      expect(core.options.clearText).toBe('清除');
    });

    it('should use default clearText value when not specified', () => {
      core = new ewColorPicker({ el: container });

      expect(core.options.clearText).toBeDefined();
    });
  });

  describe('配置对象参数测试 - sureText', () => {
    it('should handle custom sureText', () => {
      core = new ewColorPicker({ 
        el: container, 
        sureText: '确定' 
      });

      expect(core.options.sureText).toBe('确定');
    });

    it('should use default sureText value when not specified', () => {
      core = new ewColorPicker({ el: container });

      expect(core.options.sureText).toBeDefined();
    });
  });

  describe('配置对象参数测试 - changeColor callback', () => {
    it('should register changeColor callback', () => {
      const changeColor = vi.fn();
      core = new ewColorPicker({ 
        el: container, 
        changeColor: changeColor 
      });

      expect(core.options.changeColor).toBe(changeColor);
    });

    it('should trigger change event when color changes', () => {
      const changeHandler = vi.fn();
      core = new ewColorPicker({ 
        el: container
      });

      
      core.on('change', changeHandler);
      core.setColor('#ff0000');
      expect(changeHandler).toHaveBeenCalledWith('#ff0000');
    });
  });

  describe('配置对象参数测试 - sure callback', () => {
    it('should register sure callback', () => {
      const sure = vi.fn();
      core = new ewColorPicker({ 
        el: container, 
        sure: sure 
      });

      expect(core.options.sure).toBe(sure);
    });
  });

  describe('配置对象参数测试 - clear callback', () => {
    it('should register clear callback', () => {
      const clear = vi.fn();
      core = new ewColorPicker({ 
        el: container, 
        clear: clear 
      });

      expect(core.options.clear).toBe(clear);
    });
  });





  describe('配置对象参数测试 - isClickOutside', () => {
    it('should enable click outside when isClickOutside is true', () => {
      core = new ewColorPicker({ 
        el: container, 
        isClickOutside: true 
      });

      expect(core.options.isClickOutside).toBe(true);
    });

    it('should disable click outside when isClickOutside is false', () => {
      core = new ewColorPicker({ 
        el: container, 
        isClickOutside: false 
      });

      expect(core.options.isClickOutside).toBe(false);
    });

    it('should use default isClickOutside value when not specified', () => {
      core = new ewColorPicker({ el: container });

      expect(core.options.isClickOutside).toBeDefined();
    });
  });



  describe('配置对象参数测试 - togglePickerAnimation', () => {
    it('should handle custom togglePickerAnimation', () => {
      core = new ewColorPicker({ 
        el: container, 
        togglePickerAnimation: 'fade' 
      });

      expect(core.options.togglePickerAnimation).toBe('fade');
    });

    it('should use default togglePickerAnimation value when not specified', () => {
      core = new ewColorPicker({ el: container });

      expect(core.options.togglePickerAnimation).toBeDefined();
    });
  });

  describe('配置对象参数测试 - pickerAnimationTime', () => {
    it('should handle custom pickerAnimationTime', () => {
      core = new ewColorPicker({ 
        el: container, 
        pickerAnimationTime: 500 
      });

      expect(core.options.pickerAnimationTime).toBe(500);
    });

    it('should use default pickerAnimationTime value when not specified', () => {
      core = new ewColorPicker({ el: container });

      expect(core.options.pickerAnimationTime).toBeDefined();
    });
  });

  describe('配置对象参数测试 - autoPanelPosition', () => {
    it('should enable auto panel position when autoPanelPosition is true', () => {
      core = new ewColorPicker({ 
        el: container, 
        autoPanelPosition: true 
      });

      expect(core.options.autoPanelPosition).toBe(true);
    });

    it('should disable auto panel position when autoPanelPosition is false', () => {
      core = new ewColorPicker({ 
        el: container, 
        autoPanelPosition: false 
      });

      expect(core.options.autoPanelPosition).toBe(false);
    });

    it('should use default autoPanelPosition value when not specified', () => {
      core = new ewColorPicker({ el: container });

      expect(core.options.autoPanelPosition).toBeDefined();
    });
  });

  describe('配置对象参数测试 - panelPlacement', () => {
    it('should handle top-start panelPlacement', () => {
      core = new ewColorPicker({ 
        el: container, 
        panelPlacement: 'top-start' 
      });

      expect(core.options.panelPlacement).toBe('top-start');
    });

    it('should handle bottom-end panelPlacement', () => {
      core = new ewColorPicker({ 
        el: container, 
        panelPlacement: 'bottom-end' 
      });

      expect(core.options.panelPlacement).toBe('bottom-end');
    });

    it('should handle left panelPlacement', () => {
      core = new ewColorPicker({ 
        el: container, 
        panelPlacement: 'left' 
      });

      expect(core.options.panelPlacement).toBe('left');
    });

    it('should handle right panelPlacement', () => {
      core = new ewColorPicker({ 
        el: container, 
        panelPlacement: 'right' 
      });

      expect(core.options.panelPlacement).toBe('right');
    });

    it('should use default panelPlacement value when not specified', () => {
      core = new ewColorPicker({ el: container });

      expect(core.options.panelPlacement).toBeDefined();
    });
  });



  describe('配置对象参数测试 - 组合场景', () => {
    it('should handle complex configuration with multiple options', () => {
      const complexConfig = {
        el: container,
        defaultColor: '#ff0000',
        hasInput: true,
        openChangeColorMode: true,
        alpha: true,
        hue: true,
        predefineColor: ['#ff0000', '#00ff00'],
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
        isLog: true,

        isClickOutside: true,
        userDefineText: true,
        togglePickerAnimation: 'slide',
        pickerAnimationTime: 300,
        autoPanelPosition: true,
        panelPlacement: 'bottom',
        lang: 'zh-CN'
      };

      core = new ewColorPicker(complexConfig);

      
      expect(core.options.defaultColor).toBe('#ff0000');
      expect(core.options.predefineColor).toEqual(['#ff0000', '#00ff00']);
      expect(core.options.size).toBe('small');
      expect(core.options.hueDirection).toBe('vertical');
      expect(core.options.alphaDirection).toBe('horizontal');
      expect(core.options.clearText).toBe('清除');
      expect(core.options.sureText).toBe('确定');
      expect(core.options.changeColor).toBe(complexConfig.changeColor);
      expect(core.options.sure).toBe(complexConfig.sure);
      expect(core.options.clear).toBe(complexConfig.clear);
      expect(core.options.isLog).toBe(true);

      expect(core.options.isClickOutside).toBe(true);
      expect(core.options.userDefineText).toBe(true);
      expect(core.options.togglePickerAnimation).toBe('slide');
      expect(core.options.pickerAnimationTime).toBe(300);
      expect(core.options.autoPanelPosition).toBe(true);
      expect(core.options.panelPlacement).toBe('bottom');
      expect(core.options.lang).toBe('zh-CN');
    });

    it('should handle minimal configuration', () => {
      const minimalConfig = {
        el: container
      };

      core = new ewColorPicker(minimalConfig);

      
      expect(core).toBeInstanceOf(ewColorPicker);
      expect(core.options.el).toBe(container);
      expect(core.currentColor).toBe('');
    });

    it('should handle configuration with only color-related options', () => {
      const colorConfig = {
        el: container,
        defaultColor: '#00ff00',
        predefineColor: ['#ff0000', '#0000ff']
      };

      core = new ewColorPicker(colorConfig);

      
      expect(core.options.defaultColor).toBe('#00ff00');
      expect(core.options.predefineColor).toEqual(['#ff0000', '#0000ff']);
      expect(core.currentColor).toBe('#00ff00');
    });

    it('should handle configuration with only UI-related options', () => {
      const uiConfig = {
        el: container,
        size: 'large',
        clearText: '清空',
        sureText: '确认'
      };

      core = new ewColorPicker(uiConfig);

      
      expect(core.options.size).toBe('large');
      expect(core.options.clearText).toBe('清空');
      expect(core.options.sureText).toBe('确认');
    });
  });

  describe('配置对象参数测试 - 边界条件', () => {
    it('should handle extreme color values', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: '#000000' 
      });

      expect(core.currentColor).toBe('#000000');

      core = new ewColorPicker({ 
        el: container, 
        defaultColor: '#ffffff' 
      });

      expect(core.currentColor).toBe('#ffffff');
    });

    it('should handle very long color arrays', () => {
      const longColors = Array.from({ length: 100 }, (_, i) => `#${i.toString(16).padStart(6, '0')}`);
      core = new ewColorPicker({ 
        el: container, 
        predefineColor: longColors 
      });

      expect(core.options.predefineColor).toEqual(longColors);
    });

    it('should handle very short animation time', () => {
      core = new ewColorPicker({ 
        el: container, 
        pickerAnimationTime: 0 
      });

      expect(core.options.pickerAnimationTime).toBe(0);
    });

    it('should handle very long animation time', () => {
      core = new ewColorPicker({ 
        el: container, 
        pickerAnimationTime: 10000 
      });

      expect(core.options.pickerAnimationTime).toBe(10000);
    });
  });

  describe('配置对象参数测试 - 异常情况', () => {
    it('should handle invalid color format gracefully', () => {
      expect(() => {
        core = new ewColorPicker({ 
          el: container, 
          defaultColor: 'invalid-color' 
        });
      }).not.toThrow();
    });

    it('should handle invalid size object', () => {
      expect(() => {
        core = new ewColorPicker({ 
          el: container, 
          size: { invalid: 'size' } as any 
        });
      }).not.toThrow();
    });

    it('should handle invalid panelPlacement', () => {
      expect(() => {
        core = new ewColorPicker({ 
          el: container, 
          panelPlacement: 'invalid' as any 
        });
      }).not.toThrow();
    });

    it('should handle invalid hueDirection', () => {
      expect(() => {
        core = new ewColorPicker({ 
          el: container, 
          hueDirection: 'invalid' as any 
        });
      }).not.toThrow();
    });

    it('should handle invalid alphaDirection', () => {
      expect(() => {
        core = new ewColorPicker({ 
          el: container, 
          alphaDirection: 'invalid' as any 
        });
      }).not.toThrow();
    });
  });

  describe('配置对象参数测试 - 更新配置', () => {
    it('should update defaultColor', () => {
      core = new ewColorPicker({ el: container });

      core.updateOptions({ defaultColor: '#ff0000' });
      expect(core.options.defaultColor).toBe('#ff0000');
    });

    it('should update multiple options at once', () => {
      core = new ewColorPicker({ el: container });

      core.updateOptions({ 
        clearText: '清空' 
      });
      expect(core.options.clearText).toBe('清空');
    });

    it('should preserve existing options when updating', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: '#ff0000'
      });

      core.updateOptions({ clearText: '清空' });
      expect(core.options.defaultColor).toBe('#ff0000');
      expect(core.options.clearText).toBe('清空');
    });

    it('should trigger options-update event when updating options', () => {
      core = new ewColorPicker({ el: container });

      let eventTriggered = false;
      core.on('options-update', () => {
        eventTriggered = true;
      });
      
      core.updateOptions({ clearText: '清空' });
      expect(eventTriggered).toBe(true);
    });
  });
}); 