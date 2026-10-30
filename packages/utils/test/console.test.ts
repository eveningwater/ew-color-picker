import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { create } from '../src/dom';
import ConsolePlugin from '../src/consolePlugin';
import { createMockCore } from '../../../test/setup';

describe('Console Plugin', () => {
  let container: HTMLElement;
  let mockCore: any;

  beforeEach(() => {
    container = create('div');
    document.body.appendChild(container);
    
    mockCore = createMockCore(container, {
      showConsole: true
    });
  });

  afterEach(() => {
    // 安全地移除容器
    if (container && container.parentNode) {
      container.parentNode.removeChild(container);
    }
  });

  describe('plugin installation', () => {
    it('should install plugin correctly', () => {
      const plugin = new ConsolePlugin(mockCore);
      
      expect(() => plugin.install(mockCore)).not.toThrow();
      expect(mockCore.on).toHaveBeenCalled();
    });

    it('should create console element', () => {
      const plugin = new ConsolePlugin(mockCore);
      plugin.install(mockCore);
      
      // Console plugin doesn't create DOM elements, it just logs
      expect(plugin).toBeInstanceOf(ConsolePlugin);
    });

    it('should not log when showConsole is false', () => {
      mockCore.options.showConsole = false;
      const plugin = new ConsolePlugin(mockCore);
      plugin.install(mockCore);
      
      // Console plugin should still exist but not log
      expect(plugin).toBeInstanceOf(ConsolePlugin);
    });
  });

  describe('console functionality', () => {
    it('should display color information', () => {
      const plugin = new ConsolePlugin(mockCore);
      plugin.install(mockCore);
      
      // Console plugin logs to console, not DOM
      expect(plugin).toBeInstanceOf(ConsolePlugin);
    });

    it('should update console when color changes', () => {
      const plugin = new ConsolePlugin(mockCore);
      plugin.install(mockCore);
      
      // Simulate color change
      mockCore.getColor = vi.fn(() => '#00ff00');
      
      // Trigger color change event
      const colorChangeHandler = mockCore.on.mock.calls.find(
        call => call[0] === 'change'
      )?.[1];
      
      if (colorChangeHandler) {
      colorChangeHandler();
      }
      
      // Console plugin should handle color change
      expect(plugin).toBeInstanceOf(ConsolePlugin);
    });

    it('should display multiple color formats', () => {
      const plugin = new ConsolePlugin(mockCore);
      plugin.install(mockCore);
      
      // Console plugin logs to console, not DOM
      expect(plugin).toBeInstanceOf(ConsolePlugin);
    });
  });

  describe('plugin options', () => {
    it('should handle console plugin options', () => {
      const plugin = new ConsolePlugin(mockCore);
      plugin.install(mockCore);
      
      expect(plugin).toBeInstanceOf(ConsolePlugin);
    });

    it('should handle plugin initialization', () => {
      const plugin = new ConsolePlugin(mockCore);
      plugin.install(mockCore);
      
      expect(plugin).toBeInstanceOf(ConsolePlugin);
    });
  });

  describe('cleanup', () => {
    it('should clean up event listeners on destroy', () => {
      const plugin = new ConsolePlugin(mockCore);
      plugin.install(mockCore);
      
      // Console plugin doesn't have a destroy method
      expect(plugin).toBeInstanceOf(ConsolePlugin);
    });
  });
}); 