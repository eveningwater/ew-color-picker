import { isNumber, isShallowObject, isString, isUndefined, tryErrorHandler } from "./type";
import { supportsPassive } from "./env";
import { extend } from "./base";
import { warn } from "./assert";

export type SafeCSSStyleDeclaration = {
  [key: string]: string;
} & CSSStyleDeclaration;

export const create = <T extends HTMLElement>(tag: string) => document.createElement(tag) as T;
export const createByTemplate = (temp: string) =>
  document
    .createRange()
    .createContextualFragment(
      temp
    );
export const hasClass = (el: HTMLElement, className: string) => {
  let reg = new RegExp("(^|\\s)" + className + "(\\s|$)");
  return reg.test(el.className);
};

export const addClass = (el: HTMLElement, className: string) => {
  // 支持多个类名，用空格分隔
  const classNames = className.trim().split(/\s+/);
  
  for (const cls of classNames) {
    if (cls && !hasClass(el, cls)) {
      let newClass = el.className.split(" ").filter(Boolean);
      newClass.push(cls);
      el.className = newClass.join(" ");
    }
  }
};

export const removeClass = (el: HTMLElement, className: string) => {
  if (!hasClass(el, className)) {
    return;
  }

  let reg = new RegExp("(^|\\s)" + className + "(\\s|$)", "g");
  el.className = el.className.replace(reg, " ");
};

export const isHTMLElement = (el: any): el is HTMLElement => el instanceof HTMLElement;
export const isDom = <T extends HTMLElement>(el: T) =>
  isShallowObject(HTMLElement)
    ? isHTMLElement(el)
    : (el &&
      isShallowObject(el) &&
      el.nodeType === 1 &&
      isString(el.nodeName)) ||
    el instanceof HTMLCollection ||
    el instanceof NodeList;

export const baseSetStyle = (el: HTMLElement, property: string, value: string) => {
  const prop = property.startsWith('--') ? property : property.replace(/([A-Z])/g, '-$1').toLowerCase();
  el.style.setProperty(prop, value);
};

export const setStyle = (
  el: HTMLElement,
  style: Partial<SafeCSSStyleDeclaration> | string | Array<{ prop: string; value: string }> = {},
  value?: string | number
) => {
  if (isString(style) && !isUndefined(value)) {
    const finalValue = isNumber(value) ? `${value}px` : value;
    baseSetStyle(el, style, finalValue);
  } else if (Array.isArray(style)) {
    style.forEach(({ prop, value }) => {
      baseSetStyle(el, prop, value);
    });
  } else {
    // 处理CSS变量和普通样式
    for (const [key, value] of Object.entries(style)) {
      baseSetStyle(el, key, value as string);
    }
  }
};
export const removeStyle = (el: HTMLElement, props: string[] = []) => {
  for (const item of props) {
    el.style.removeProperty(item);
  }
};
export const camelCase = <T extends string>(name: T) =>
  name
    .replace(/([\:\_\-]+(.))/g, (_, separator, letter, offset) =>
      offset ? letter.toUpperCase() : letter
    )
    .replace(/^moz([A-Z])/, "Moz$1");
export const getStyle = (
  el: HTMLElement,
  styleName: keyof CSSStyleDeclaration,
  pseudoElt?: string
) => {
  if (!el || !styleName) return null;
  styleName = camelCase(styleName as string) as keyof CSSStyleDeclaration;
  if (styleName === "float") {
    styleName = "cssFloat";
  }
  let result = null;
  tryErrorHandler(() => {
    const computed = document.defaultView
      ? document.defaultView.getComputedStyle(el, pseudoElt)
      : window.getComputedStyle(el, pseudoElt);
    result = el.style[styleName] || computed ? computed[styleName] : null;
  });
  return result || el.style[styleName];
};

export const setAttr = <T>(el: HTMLElement, values: Record<string, T>) => {
  if (!isShallowObject(values)) {
    return;
  }
  for (const [key, value] of Object.entries(values)) {
    el.setAttribute(key, `${value}`);
  }
};
export const getAttr = (el: HTMLElement, key: string) => el.getAttribute(key);
export const $ = <T extends HTMLElement>(selector: string, el: HTMLElement | Document = document) =>
  el.querySelector<T>(selector);
export const $$ = <T extends HTMLElement>(selector: string, el: HTMLElement | Document = document) =>
  el.querySelectorAll<T>(selector);
export const removeElement = (el: HTMLElement) => {
  if (el?.parentElement) {
    el?.parentElement?.removeChild(el);
  } else {
    el?.remove();
  }
};
export const insertNode = (el: HTMLElement, node: Node, oldNode?: Node | null, beforeNode?: Node | null) => {
  if (beforeNode && el?.contains(beforeNode)) {
    el.insertBefore(node, beforeNode);
  } else if (oldNode && el?.contains(oldNode)) {
    el.replaceChild(node, oldNode);
  } else {
    el?.appendChild(node);
  }
};
export const checkContainer = (el: string | HTMLElement | undefined): HTMLElement => {
  if (isString(el)) {
    const element = $(el);
    if (!element) {
      warn(`[ewColorPicker warning]: Cannot find element with selector: ${el}`);
      return document.body;
    }
    return element;
  }
  if (isHTMLElement(el)) {
    return el;
  }
  return document.body;
};

// 移除重复的 removeNode 函数，使用 removeElement 替代
// export const removeNode = (el: HTMLElement) => { ... };
// 将 removeNode 作为 removeElement 的别名
export const removeNode = removeElement;

export function getElementSize(el: HTMLElement) {
  return {
    clientWidth: el.clientWidth,
    clientHeight: el.clientHeight,
    offsetWidth: el.offsetWidth,
    offsetHeight: el.offsetHeight,
    scrollWidth: el.scrollWidth,
    scrollHeight: el.scrollHeight,
  };
}

export const getRect = (el: HTMLElement) => el.getBoundingClientRect();

export const getOffset = (el: HTMLElement | null) => {
  let left = 0;
  let top = 0;

  while (el) {
    left -= el.offsetLeft;
    top -= el.offsetTop;
    el = el.offsetParent as HTMLElement;
  }

  return {
    left,
    top,
  };
};

// 计算面板位置
export const calculatePanelPosition = (
  triggerElement: HTMLElement,
  panelElement: HTMLElement,
  placement: string = 'bottom',
  margin: number = 8
) => {
  const triggerRect = getRect(triggerElement);
  const panelRect = getRect(panelElement);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  
  let left = 0;
  let top = 0;
  
  // 解析位置字符串
  const [position, align] = placement.split('-');
  
  switch (position) {
    case 'top':
      top = triggerRect.top - panelRect.height - margin;
      if (align === 'start') {
        left = triggerRect.left;
      } else if (align === 'end') {
        left = triggerRect.right - panelRect.width;
      } else {
        left = triggerRect.left + (triggerRect.width - panelRect.width) / 2;
      }
      break;
      
    case 'bottom':
      top = triggerRect.bottom + margin;
      if (align === 'start') {
        left = triggerRect.left;
      } else if (align === 'end') {
        left = triggerRect.right - panelRect.width;
      } else {
        left = triggerRect.left + (triggerRect.width - panelRect.width) / 2;
      }
      break;
      
    case 'left':
      left = triggerRect.left - panelRect.width - margin;
      if (align === 'start') {
        top = triggerRect.top;
      } else if (align === 'end') {
        top = triggerRect.bottom - panelRect.height;
      } else {
        top = triggerRect.top + (triggerRect.height - panelRect.height) / 2;
      }
      break;
      
    case 'right':
      left = triggerRect.right + margin;
      if (align === 'start') {
        top = triggerRect.top;
      } else if (align === 'end') {
        top = triggerRect.bottom - panelRect.height;
      } else {
        top = triggerRect.top + (triggerRect.height - panelRect.height) / 2;
      }
      break;
  }
  
  // 边界检查，确保面板不超出视口
  if (left < 0) left = margin;
  if (top < 0) top = margin;
  if (left + panelRect.width > viewportWidth) {
    left = viewportWidth - panelRect.width - margin;
  }
  if (top + panelRect.height > viewportHeight) {
    top = viewportHeight - panelRect.height - margin;
  }
  
  return { left, top };
};

export const on = (
  el: HTMLElement | Document | Window,
  type: string,
  fn: EventListenerOrEventListenerObject,
  capture?: AddEventListenerOptions
) => {
  const useCapture = supportsPassive
    ? {
      passive: false,
      capture: !!capture,
    }
    : !!capture;
  el.addEventListener(type, fn, useCapture);
};

export const off = (
  el: HTMLElement | Document | Window,
  type: string,
  fn: EventListenerOrEventListenerObject,
  capture?: EventListenerOptions
) => {
  el.removeEventListener(type, fn, {
    capture: !!capture,
  });
};

// 这些函数已经在base.ts中定义，这里只是重新导出
export { isString, isFunction, isUndefined, isNull, isDeepArray, isDeepObject, isPromise, removeAllSpace, throwError } from './base';
