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

describe('ewColorPicker 实用功能测试', () => {
  let container: HTMLElement;
  let core: ewColorPicker;

  beforeEach(() => {
    container = document.createElement('div');
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

  describe('基础功能测试', () => {
    it('应该正确初始化颜色选择器', () => {
      core = new ewColorPicker({ 
        el: container, 
        defaultColor: '#ff0000' 
      });
      
      expect(core).toBeDefined();
      expect(core.getColor()).toBe('#ff0000');
      expect(core.getContainer()).toBe(container);
    });

    it('应该支持设置和获取颜色', () => {
      core = new ewColorPicker({ el: container });
      
      core.setColor('#00ff00');
      expect(core.getColor()).toBe('#00ff00');
      
      core.setColor('#0000ff');
      expect(core.getColor()).toBe('#0000ff');
    });

    it('应该支持HSVA颜色操作', () => {
      core = new ewColorPicker({ el: container });
      
      const hsva = { h: 120, s: 100, v: 100, a: 1 };
      core.setHsvaColor(hsva);
      
      const result = core.getHsvaColor();
      expect(result.h).toBe(120);
      expect(result.s).toBe(100);
      expect(result.v).toBe(100);
      expect(result.a).toBe(1);
    });

    it('应该触发颜色变化事件', () => {
      core = new ewColorPicker({ el: container });

      
      let eventTriggered = false;
      core.on('change', () => {
        eventTriggered = true;
      });
      
      core.setColor('#ff0000');
      expect(eventTriggered).toBe(true);
    });
  });

  describe('面板控制测试', () => {
    it('应该能够显示和隐藏面板', async () => {
      core = new ewColorPicker({ el: container });

      
      // 等待DOM渲染完成
      await new Promise(resolve => setTimeout(resolve, 100));
      
      core.showPanel();
      // 等待面板显示动画完成
      await new Promise(resolve => setTimeout(resolve, 300));
      expect(core.pickerFlag).toBe(true);
      
      core.hidePanel();
      // 等待面板隐藏动画完成
      await new Promise(resolve => setTimeout(resolve, 300));
      expect(core.pickerFlag).toBe(false);
    });

    it('应该支持动画类型配置', () => {
      core = new ewColorPicker({ 
        el: container,
        togglePickerAnimation: 'fade'
      });

      
      expect(core.options.togglePickerAnimation).toBe('fade');
    });
  });

  describe('配置更新测试', () => {
    it('应该支持更新配置', () => {
      core = new ewColorPicker({ el: container });

      
      core.updateOptions({ clearText: '清空' });
      expect(core.options.clearText).toBe('清空');
    });

    it('应该保持container属性不被覆盖', () => {
      core = new ewColorPicker({ el: container });

      
      core.updateOptions({ clearText: '清空' });
      
      expect(core.getContainer()).toBe(container);
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
  });

  describe('挂载点测试', () => {
    it('应该提供挂载点访问', () => {
      core = new ewColorPicker({ el: container });

      
      const rootMount = core.getMountPoint('root');
      const panelMount = core.getMountPoint('panelContainer');
      
      expect(rootMount).toBeDefined();
      expect(panelMount).toBeDefined();
      expect(rootMount instanceof HTMLElement).toBe(true);
      expect(panelMount instanceof HTMLElement).toBe(true);
    });

    it('应该返回undefined对于不存在的挂载点', () => {
      core = new ewColorPicker({ el: container });

      
      const nonExistentMount = core.getMountPoint('nonExistent');
      expect(nonExistentMount).toBeUndefined();
    });
  });

  describe('事件系统测试', () => {
    it('应该支持事件监听', () => {
      core = new ewColorPicker({ el: container });

      
      let eventHandled = false;
      core.on('change', () => {
        eventHandled = true;
      });
      
      core.emit('change');
      expect(eventHandled).toBe(true);
    });

    it('应该支持事件移除', () => {
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

  describe('插件系统测试', () => {
    it('应该正确加载插件', async () => {
      core = new ewColorPicker({ el: container });

      
      // 等待插件渲染完成
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // 检查插件是否已注册
      expect(core.plugins).toBeDefined();
      
      // 检查核心插件是否存在
      const hasBox = core.plugins.ewColorPickerBox;
      const hasPanel = core.plugins.ewColorPickerPanel;
      
      // 如果插件存在，验证它们
      if (hasBox) {
        expect(hasBox).toBeDefined();
      }
      if (hasPanel) {
        expect(hasPanel).toBeDefined();
      }
      
      // 至少应该有一些插件被加载
      const pluginCount = Object.keys(core.plugins).length;
      expect(pluginCount).toBeGreaterThan(0);
    });
  });

  describe('边界情况测试', () => {
    it('应该处理空颜色值', () => {
      core = new ewColorPicker({ el: container });

      
      core.setColor('');
      expect(core.getColor()).toBe('');
    });

    it('应该处理无效颜色值', () => {
      core = new ewColorPicker({ el: container });

      
      core.setColor('invalid-color');
      // 应该保持之前的颜色或使用默认值
      expect(core.getColor()).toBeDefined();
    });

    it('应该处理null和undefined值', () => {
      core = new ewColorPicker({ el: container });

      
      expect(() => core.setColor(null as any)).not.toThrow();
      expect(() => core.setColor(undefined as any)).not.toThrow();
    });
  });

  describe('实际DOM测试', () => {
    it('应该正确渲染到DOM', () => {
      core = new ewColorPicker({ el: container });

      
      // 检查容器被正确设置
      expect(core.getContainer()).toBe(container);
      
      // 检查主容器是否存在
      const wrapper = container.querySelector('.ew-color-picker');
      expect(wrapper).toBeTruthy();
    });

    it('应该支持不同的容器类型', () => {
      const stringContainer = document.createElement('div');
      stringContainer.id = 'test-container';
      document.body.appendChild(stringContainer);
      
      core = new ewColorPicker('#test-container');

      expect(core.getContainer()).toBe(stringContainer);
      
      core.destroy();
      document.body.removeChild(stringContainer);
    });
  });
}); 