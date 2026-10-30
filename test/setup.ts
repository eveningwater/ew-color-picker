// 测试环境设置
import { beforeAll, afterEach, afterAll, vi } from 'vitest';
import { create } from '../packages/utils/src';

// 模拟 __DEV__ 变量
declare global {
  var __DEV__: boolean;
}

// 设置开发环境
globalThis.__DEV__ = true;

// 清理 DOM
afterEach(() => {
  // 确保 document.body 存在
  if (typeof document !== 'undefined' && document.body) {
  document.body.innerHTML = '';
  }
});

// 模拟 console 方法以避免测试输出
const originalConsole = { ...console };
beforeAll(() => {
  console.warn = vi.fn();
  console.error = vi.fn();
  console.log = vi.fn();
});

afterAll(() => {
  console.warn = originalConsole.warn;
  console.error = originalConsole.error;
  console.log = originalConsole.log;
}); 

// 创建通用的测试配置
export function createTestConfig(container: HTMLElement, options: any = {}) {
  return {
    el: container,
    ...options
  };
}

// 创建通用的 mockCore 工厂函数
export function createMockCore(container: HTMLElement, options: any = {}) {
  // 创建完整的 DOM 结构
  const panelContainer = create('div');
  panelContainer.className = 'panelContainer';
  container.appendChild(panelContainer);
  
  const bottomRow = create('div');
  bottomRow.className = 'ew-color-picker-bottom-row';
  panelContainer.appendChild(bottomRow);
  
  const btnGroup = create('div');
  btnGroup.className = 'ew-color-picker-drop-btn-group';
  bottomRow.appendChild(btnGroup);
  
  return {
    container,
    options: {
      defaultColor: '#ff0000',
      predefineColor: ['#ff0000', '#00ff00', '#0000ff'],
      ...options
    },
    on: vi.fn(),
    emit: vi.fn(),
    getColor: vi.fn(() => '#ff0000'),
    setColor: vi.fn(),
    destroy: vi.fn(),
    trigger: vi.fn(),
    showPanel: vi.fn(),
    hidePanel: vi.fn(),
    updateColor: vi.fn(),
    getMountPoint: vi.fn((name: string) => {
      if (name === 'root') {
        return container;
      }
      if (name === 'panelContainer') {
        return panelContainer;
      }
      if (name === 'bottomRow') {
        return bottomRow;
      }
      if (name === 'btnGroup') {
        return btnGroup;
      }
      return container;
    })
  };
} 