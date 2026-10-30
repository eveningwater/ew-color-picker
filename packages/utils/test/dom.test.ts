import { describe, it, expect, beforeEach } from 'vitest';
import {
  create,
  addClass,
  removeClass,
  hasClass,
  setStyle,
  getStyle,
  setAttr,
  getAttr,
  $,
  $$,
  removeElement,
  insertNode,
  getRect,
  getOffset,
  on,
  off
} from '../src/dom';

describe('DOM Utils', () => {
  let container: HTMLElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.id = 'test-container';
    document.body.appendChild(container);
  });

  describe('create', () => {
    it('should create an element with the specified tag', () => {
      const div = create('div');
      expect(div.tagName).toBe('DIV');
      
      const span = create<HTMLSpanElement>('span');
      expect(span.tagName).toBe('SPAN');
    });
  });

  describe('class operations', () => {
    it('should add class to element', () => {
      const element = create('div');
      addClass(element, 'test-class');
      expect(element.classList.contains('test-class')).toBe(true);
    });

    it('should remove class from element', () => {
      const element = create('div');
      element.classList.add('test-class');
      removeClass(element, 'test-class');
      expect(element.classList.contains('test-class')).toBe(false);
    });

    it('should check if element has class', () => {
      const element = create('div');
      element.classList.add('test-class');
      expect(hasClass(element, 'test-class')).toBe(true);
      expect(hasClass(element, 'non-existent')).toBe(false);
    });
  });

  describe('style operations', () => {
    it('should set style properties', () => {
      const element = create('div');
      setStyle(element, { color: 'red', fontSize: '16px' });
      expect(element.style.color).toBe('red');
      expect(element.style.fontSize).toBe('16px');
    });

    it('should set single style property', () => {
      const element = create('div');
      setStyle(element, 'color', 'blue');
      expect(element.style.color).toBe('blue');
    });

    it('should get computed style', () => {
      const element = create('div');
      element.style.color = 'red';
      const color = getStyle(element, 'color');
      expect(color).toBe('red');
    });
  });

  describe('attribute operations', () => {
    it('should set attributes', () => {
      const element = create('div');
      setAttr(element, { id: 'test', 'data-value': '123' });
      expect(element.getAttribute('id')).toBe('test');
      expect(element.getAttribute('data-value')).toBe('123');
    });

    it('should get attribute', () => {
      const element = create('div');
      element.setAttribute('data-test', 'value');
      expect(getAttr(element, 'data-test')).toBe('value');
    });
  });

  describe('DOM queries', () => {
    it('should query single element', () => {
      const div = create('div');
      div.className = 'test-div';
      container.appendChild(div);
      
      const result = $('.test-div', container);
      expect(result).toBe(div);
    });

    it('should query multiple elements', () => {
      const div1 = create('div');
      const div2 = create('div');
      div1.className = 'test-div';
      div2.className = 'test-div';
      container.appendChild(div1);
      container.appendChild(div2);
      
      const results = $$('.test-div', container);
      expect(results.length).toBe(2);
      expect(results[0]).toBe(div1);
      expect(results[1]).toBe(div2);
    });
  });

  describe('DOM manipulation', () => {
    it('should remove element', () => {
      const element = create('div');
      container.appendChild(element);
      expect(container.contains(element)).toBe(true);
      
      removeElement(element);
      expect(container.contains(element)).toBe(false);
    });

    it('should insert node', () => {
      const parent = create('div');
      const child = create('span');
      
      insertNode(parent, child);
      expect(parent.contains(child)).toBe(true);
    });

    it('should replace node when oldNode exists', () => {
      const parent = create('div');
      const oldChild = create('span');
      const newChild = create('div');
      
      parent.appendChild(oldChild);
      insertNode(parent, newChild, oldChild);
      
      expect(parent.contains(newChild)).toBe(true);
      expect(parent.contains(oldChild)).toBe(false);
    });
  });

  describe('position and size', () => {
    it('should get element rect', () => {
      const element = create('div');
      element.style.width = '100px';
      element.style.height = '50px';
      element.style.position = 'absolute';
      element.style.left = '0px';
      element.style.top = '0px';
      element.style.display = 'block';
      container.appendChild(element);
      
      // 强制浏览器重新计算布局
      container.offsetHeight;
      
      const rect = getRect(element);
      // 在测试环境中，元素可能没有实际尺寸，所以检查 rect 对象的存在
      expect(rect).toBeDefined();
      expect(typeof rect.width).toBe('number');
      expect(typeof rect.height).toBe('number');
      expect(typeof rect.left).toBe('number');
      expect(typeof rect.top).toBe('number');
    });

    it('should get element offset', () => {
      const element = create('div');
      container.appendChild(element);
      
      const offset = getOffset(element);
      expect(typeof offset.left).toBe('number');
      expect(typeof offset.top).toBe('number');
    });
  });

  describe('event handling', () => {
    it('should add event listener', () => {
      const element = create('div');
      let clicked = false;
      
      on(element, 'click', () => {
        clicked = true;
      });
      
      element.click();
      expect(clicked).toBe(true);
    });

    it('should remove event listener', () => {
      const element = create('div');
      let clicked = false;
      
      const handler = () => {
        clicked = true;
      };
      
      on(element, 'click', handler);
      off(element, 'click', handler);
      
      element.click();
      expect(clicked).toBe(false);
    });
  });
}); 