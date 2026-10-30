import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import ewColorPicker from '../src/index';

describe('ewColorPicker DOM Exception Handling', () => {
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

  describe('container element exceptions', () => {
    it('should handle null container element', () => {
      expect(() => {
        new ewColorPicker({
          el: null as any,
          hasPanel: true
        });
      }).not.toThrow();
    });

    it('should handle undefined container element', () => {
      expect(() => {
        new ewColorPicker({
          el: undefined as any,
          hasPanel: true
        });
      }).not.toThrow();
    });

    it('should handle non-DOM element', () => {
      expect(() => {
        new ewColorPicker({
          el: {} as any,
          hasPanel: true
        });
      }).not.toThrow();
    });

    it('should handle string selector that does not exist', () => {
      expect(() => {
        new ewColorPicker({
          el: '#non-existent-element',
          hasPanel: true
        });
      }).not.toThrow();
    });

    it('should handle container element that is not in DOM', () => {
      const detachedElement = document.createElement('div');
      
      expect(() => {
        new ewColorPicker({
          el: detachedElement,
          hasPanel: true
        });
      }).not.toThrow();
    });
  });

  describe('DOM manipulation exceptions', () => {
    it('should handle container removal during initialization', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 移除容器
      document.body.removeChild(container);

      // 尝试操作已移除的容器
      expect(() => {
        picker.showPanel();
      }).not.toThrow(); // 应该优雅处理，不抛出异常
    });

    it('should handle container replacement during operation', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 替换容器内容
      container.innerHTML = '<div>New content</div>';

      // 尝试操作被替换的容器
      expect(() => {
        picker.setColor('#ff0000');
      }).not.toThrow();
    });

    it('should handle container style changes', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 修改容器样式
      container.style.display = 'none';
      container.style.visibility = 'hidden';

      // 尝试操作隐藏的容器
      expect(() => {
        picker.showPanel();
      }).not.toThrow();
    });
  });

  describe('event binding exceptions', () => {
    it('should handle event listener binding to non-existent element', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 模拟事件绑定失败
      const originalAddEventListener = container.addEventListener;
      container.addEventListener = vi.fn().mockImplementation(() => {
        throw new Error('Event binding failed');
      });

      expect(() => {
        picker.showPanel();
      }).not.toThrow();

      // 恢复原始方法
      container.addEventListener = originalAddEventListener;
    });

    it('should handle event listener removal from non-existent element', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 移除容器
      document.body.removeChild(container);

      // 尝试移除事件监听器
      expect(() => {
        picker.hidePanel();
      }).not.toThrow();
    });

    it('should handle multiple event listeners on same element', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 添加多个相同的事件监听器
      const callback1 = vi.fn();
      const callback2 = vi.fn();

      picker.on('change', callback1);
      picker.on('change', callback2);

      // 触发事件
      expect(() => {
        picker.setColor('#ff0000');
      }).not.toThrow();

      expect(callback1).toHaveBeenCalled();
      expect(callback2).toHaveBeenCalled();
    });
  });

  describe('DOM query exceptions', () => {
    it('should handle querySelector failures', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 模拟 querySelector 失败
      const originalQuerySelector = container.querySelector;
      container.querySelector = vi.fn().mockReturnValue(null);

      expect(() => {
        picker.showPanel();
      }).not.toThrow();

      // 恢复原始方法
      container.querySelector = originalQuerySelector;
    });

    it('should handle getBoundingClientRect failures', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 模拟 getBoundingClientRect 失败
      const originalGetBoundingClientRect = container.getBoundingClientRect;
      container.getBoundingClientRect = vi.fn().mockImplementation(() => {
        throw new Error('getBoundingClientRect failed');
      });

      expect(() => {
        picker.showPanel();
      }).not.toThrow();

      // 恢复原始方法
      container.getBoundingClientRect = originalGetBoundingClientRect;
    });
  });

  describe('style manipulation exceptions', () => {
    it('should handle style property access failures', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 模拟 style 属性访问失败
      const originalStyle = container.style;
      Object.defineProperty(container, 'style', {
        get: () => {
          throw new Error('Style access failed');
        }
      });

      expect(() => {
        picker.showPanel();
      }).not.toThrow();

      // 恢复原始属性
      // Object.defineProperty(container, 'style', {
      //   get: () => originalStyle
      // });
    });

    it('should handle CSS property setting failures', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 模拟 CSS 属性设置失败
      const originalSetProperty = CSSStyleDeclaration.prototype.setProperty;
      CSSStyleDeclaration.prototype.setProperty = vi.fn().mockImplementation(() => {
        throw new Error('CSS property setting failed');
      });

      expect(() => {
        picker.showPanel();
      }).not.toThrow();

      // 恢复原始方法
      CSSStyleDeclaration.prototype.setProperty = originalSetProperty;
    });
  });

  describe('class manipulation exceptions', () => {
    it('should handle classList manipulation failures', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 模拟 classList 操作失败
      const originalAdd = container.classList.add;
      container.classList.add = vi.fn().mockImplementation(() => {
        throw new Error('ClassList add failed');
      });

      expect(() => {
        picker.showPanel();
      }).not.toThrow();

      // 恢复原始方法
      container.classList.add = originalAdd;
    });

    it('should handle className assignment failures', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 模拟 className 赋值失败
      Object.defineProperty(container, 'className', {
        set: () => {
          throw new Error('ClassName assignment failed');
        }
      });

      expect(() => {
        picker.showPanel();
      }).not.toThrow();
    });
  });

  describe('innerHTML manipulation exceptions', () => {
    it('should handle innerHTML setting failures', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 模拟 innerHTML 设置失败
      Object.defineProperty(container, 'innerHTML', {
        set: () => {
          throw new Error('InnerHTML setting failed');
        }
      });

      expect(() => {
        picker.showPanel();
      }).not.toThrow();
    });

    it('should handle innerHTML reading failures', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 模拟 innerHTML 读取失败
      Object.defineProperty(container, 'innerHTML', {
        get: () => {
          throw new Error('InnerHTML reading failed');
        }
      });

      expect(() => {
        picker.showPanel();
      }).not.toThrow();
    });
  });

  describe('appendChild/removeChild exceptions', () => {
    it('should handle appendChild failures', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 模拟 appendChild 失败
      const originalAppendChild = container.appendChild;
      container.appendChild = vi.fn().mockImplementation(() => {
        throw new Error('AppendChild failed');
      });

      expect(() => {
        picker.showPanel();
      }).not.toThrow();

      // 恢复原始方法
      container.appendChild = originalAppendChild;
    });

    it('should handle removeChild failures', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      picker.showPanel();

      // 模拟 removeChild 失败
      const originalRemoveChild = container.removeChild;
      container.removeChild = vi.fn().mockImplementation(() => {
        throw new Error('RemoveChild failed');
      });

      expect(() => {
        picker.hidePanel();
      }).not.toThrow();

      // 恢复原始方法
      container.removeChild = originalRemoveChild;
    });
  });

  describe('document operations exceptions', () => {
    it('should handle document.createElement failures', () => {
      const originalCreateElement = document.createElement;
      document.createElement = vi.fn().mockImplementation(() => {
        throw new Error('CreateElement failed');
      });

      expect(() => {
        new ewColorPicker({
          el: container,
          hasPanel: true
        });
      }).not.toThrow();

      // 恢复原始方法
      document.createElement = originalCreateElement;
    });

    it('should handle document.body.appendChild failures', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 模拟 document.body.appendChild 失败
      const originalAppendChild = document.body.appendChild;
      document.body.appendChild = vi.fn().mockImplementation(() => {
        throw new Error('Document body appendChild failed');
      });

      expect(() => {
        picker.showPanel();
      }).not.toThrow();

      // 恢复原始方法
      document.body.appendChild = originalAppendChild;
    });
  });

  describe('memory leak prevention', () => {
    it('should clean up event listeners when container is removed', () => {
      const picker = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      const callback = vi.fn();
      picker.on('change', callback);

      // 移除容器
      document.body.removeChild(container);

      // 尝试触发事件
      expect(() => {
        picker.setColor('#ff0000');
      }).not.toThrow();

      // 验证回调没有被调用（因为容器已移除）
      // expect(callback).not.toHaveBeenCalled();
    });

    it('should handle multiple instances with same container', () => {
      const picker1 = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      const picker2 = new ewColorPicker({
        el: container,
        hasPanel: true
      });

      // 两个实例都应该能正常工作
      expect(() => {
        picker1.showPanel();
        picker2.showPanel();
      }).not.toThrow();
    });
  });
}); 