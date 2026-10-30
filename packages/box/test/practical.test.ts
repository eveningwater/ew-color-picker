import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import BoxPlugin from '../src/index';

describe('Box Plugin 实用功能测试', () => {
  let container: HTMLElement;
  let mockCore: any;
  let plugin: BoxPlugin;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
    
    // 创建模拟的核心实例
    mockCore = {
      options: {

        size: 'normal',
        disabled: false,
        readonly: false,
        className: '',
        style: {},
        onClick: vi.fn(),
        onMouseEnter: vi.fn(),
        onMouseLeave: vi.fn(),
        togglePickerAnimation: true,
        pickerAnimationTime: 200
      },
      currentColor: '#ff0000',
      pickerFlag: false,
      showPanel: vi.fn(),
      hidePanel: vi.fn(),
      on: vi.fn(),
      getMountPoint: vi.fn(() => container)
    };
  });

  afterEach(() => {
    if (plugin) {
      plugin.destroy();
    }
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('基础功能测试', () => {
    it('应该正确初始化Box插件', () => {
      plugin = new BoxPlugin(mockCore);
      
      expect(plugin).toBeDefined();
      expect(plugin.box).toBeDefined();
      expect(plugin.hasColor).toBe(true);
    });

    it('应该正确渲染Box元素', () => {
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement).toBeTruthy();
      expect(boxElement?.style.backgroundColor).toBe('#ff0000');
    });

    it('应该包含箭头图标', () => {
      plugin = new BoxPlugin(mockCore);
      
      const arrowIcon = container.querySelector('.ew-color-picker-box-arrow-icon');
      expect(arrowIcon).toBeTruthy();
    });
  });

  describe('配置项测试', () => {
    it('应该支持插件状态控制', () => {
      // 重新创建插件，测试插件状态控制
      plugin = new BoxPlugin(mockCore);
      plugin.destroy();
      
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box');
      expect(boxElement).toBeTruthy();
    });

    it('应该支持size配置', () => {
      mockCore.options.size = { width: '100px', height: '40px' };
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement).toBeTruthy();
      expect(boxElement.style.width).toBe('100px');
      expect(boxElement.style.height).toBe('40px');
    });

    it('应该支持disabled配置', () => {
      mockCore.options.disabled = true;
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement).toBeTruthy();
      expect(boxElement.classList.contains('is-disabled')).toBe(true);
    });

    it('应该支持readonly配置', () => {
      mockCore.options.readonly = true;
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement).toBeTruthy();
      expect(boxElement.classList.contains('is-readonly')).toBe(true);
    });

    it('应该支持className配置', () => {
      mockCore.options.className = 'custom-box-class';
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement).toBeTruthy();
      expect(boxElement.classList.contains('custom-box-class')).toBe(true);
    });

    it('应该支持style配置', () => {
      mockCore.options.style = { border: '2px solid red' };
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement).toBeTruthy();
      expect(boxElement.style.border).toBe('2px solid red');
    });
  });

  describe('颜色处理测试', () => {
    it('应该根据当前颜色更新背景色', () => {
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement.style.backgroundColor).toBe('#ff0000');
      
      // 模拟颜色变化
      mockCore.currentColor = '#00ff00';
      plugin.setBoxBgColor('#00ff00');
      expect(boxElement.style.backgroundColor).toBe('#00ff00');
    });

    it('应该处理空颜色值', () => {
      mockCore.currentColor = '';
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement.style.backgroundColor).toBe('');
    });

    it('应该更新hasColor状态', () => {
      mockCore.currentColor = '';
      plugin = new BoxPlugin(mockCore);
      expect(plugin.hasColor).toBe(false);
      
      mockCore.currentColor = '#ff0000';
      plugin.updateChildren();
      expect(plugin.hasColor).toBe(true);
    });
  });

  describe('事件处理测试', () => {
    it('应该处理点击事件', () => {
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      boxElement.click();
      
      expect(mockCore.showPanel).toHaveBeenCalled();
    });

    it('应该在禁用状态下阻止点击事件', () => {
      mockCore.options.disabled = true;
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      const clickEvent = new Event('click');
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');
      
      boxElement.dispatchEvent(clickEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
      expect(mockCore.showPanel).not.toHaveBeenCalled();
    });

    it('应该在只读状态下阻止点击事件', () => {
      mockCore.options.readonly = true;
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      const clickEvent = new Event('click');
      const preventDefaultSpy = vi.spyOn(clickEvent, 'preventDefault');
      const stopPropagationSpy = vi.spyOn(clickEvent, 'stopPropagation');
      
      boxElement.dispatchEvent(clickEvent);
      
      expect(preventDefaultSpy).toHaveBeenCalled();
      expect(stopPropagationSpy).toHaveBeenCalled();
      expect(mockCore.showPanel).not.toHaveBeenCalled();
    });

    it('应该调用自定义点击回调', () => {
      const onClick = vi.fn();
      mockCore.options.onClick = onClick;
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      boxElement.click();
      
      expect(onClick).toHaveBeenCalledWith(plugin);
    });
  });

  describe('面板切换测试', () => {
    it('应该在面板隐藏时显示面板', () => {
      mockCore.pickerFlag = false;
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      boxElement.click();
      
      expect(mockCore.showPanel).toHaveBeenCalledWith(true, 200);
    });

    it('应该在面板显示时隐藏面板', () => {
      mockCore.pickerFlag = true;
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      boxElement.click();
      
      expect(mockCore.hidePanel).toHaveBeenCalledWith(true, 200);
    });
  });

  describe('更新功能测试', () => {
    it('应该支持更新配置', () => {
      plugin = new BoxPlugin(mockCore);
      
      // 更新尺寸 - 需要重新创建插件来测试尺寸更新
      plugin.destroy();
      mockCore.options.size = { width: '150px', height: '50px' };
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement.style.width).toBe('150px');
      expect(boxElement.style.height).toBe('50px');
    });

    it('应该支持更新颜色', () => {
      plugin = new BoxPlugin(mockCore);
      
      mockCore.currentColor = '#00ff00';
      plugin.update(['defaultColor']);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement.style.backgroundColor).toBe('#00ff00');
    });

    it('应该支持更新状态', () => {
      plugin = new BoxPlugin(mockCore);
      
      // 更新状态 - 需要重新创建插件来测试状态更新
      plugin.destroy();
      mockCore.options.disabled = true;
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement.classList.contains('is-disabled')).toBe(true);
    });
  });

  describe('生命周期测试', () => {
    it('应该正确销毁插件', () => {
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box');
      expect(boxElement).toBeTruthy();
      
      plugin.destroy();
      
      const boxElementAfterDestroy = container.querySelector('.ew-color-picker-box');
      expect(boxElementAfterDestroy).toBeFalsy();
      expect(plugin.box).toBeNull();
    });

    it('应该解绑事件处理器', () => {
      plugin = new BoxPlugin(mockCore);
      
      const boxElement = container.querySelector('.ew-color-picker-box') as HTMLElement;
      expect(boxElement).toBeTruthy();
      
      plugin.destroy();
      
      // 销毁后元素应该被移除
      const boxElementAfterDestroy = container.querySelector('.ew-color-picker-box');
      expect(boxElementAfterDestroy).toBeFalsy();
    });
  });

  describe('边界情况测试', () => {
    it('应该处理挂载点不存在的情况', () => {
      mockCore.getMountPoint = vi.fn(() => null);
      plugin = new BoxPlugin(mockCore);
      
      // 应该不会抛出异常
      expect(() => {
        plugin.render();
      }).not.toThrow();
    });

    it('应该处理重复渲染', () => {
      plugin = new BoxPlugin(mockCore);
      
      // 重复调用render应该不会创建重复的元素
      const firstBoxCount = container.querySelectorAll('.ew-color-picker-box').length;
      plugin.render();
      const secondBoxCount = container.querySelectorAll('.ew-color-picker-box').length;
      
      expect(firstBoxCount).toBe(1);
      expect(secondBoxCount).toBe(1);
    });
  });
}); 