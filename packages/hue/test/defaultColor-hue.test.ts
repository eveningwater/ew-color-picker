import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import HuePlugin from '../src/index';
import ewColorPicker from '../../ew-color-picker/src/index';
import { colorToRgba, colorRgbaToHsva } from '../../utils/src/color';

describe('Hue Plugin - defaultColor Integration', () => {
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

  describe('defaultColor hue position update', () => {
    it('should update hue thumb position when defaultColor has different hue value', () => {
      const spy = vi.spyOn(HuePlugin.prototype, 'updateHueThumbPosition');
      const picker = new ewColorPicker({
        el: container,
        defaultColor: '#00ff00' // 绿色，hue = 120
      });
      expect(spy).toHaveBeenCalledWith(120);
      spy.mockRestore();
    });

    it('should not update hue thumb position when defaultColor has same hue value', () => {
      const spy = vi.spyOn(HuePlugin.prototype, 'updateHueThumbPosition');
      const picker = new ewColorPicker({
        el: container,
        defaultColor: '#ff0000' // 红色，hue = 0，与默认值相同
      });
      // 红色 hue = 0，与默认值相同，所以应该被调用但传入 0
      expect(spy).toHaveBeenCalledWith(0);
      spy.mockRestore();
    });

    it('should update hue thumb position when showPanel is called with different defaultColor', () => {
      const spy = vi.spyOn(HuePlugin.prototype, 'updateHueThumbPosition');
      const picker = new ewColorPicker({
        el: container
      });
      picker.showPanel();
      expect(spy).toHaveBeenCalled();
      spy.mockRestore();
    });

    it('should handle various defaultColor formats correctly', () => {
      const testCases = [
        { color: '#00ff00', expectedHue: 120, description: 'hex green' },
        { color: 'rgb(0, 255, 0)', expectedHue: 120, description: 'rgb green' },
        { color: 'rgba(0, 255, 0, 1)', expectedHue: 120, description: 'rgba green' },
        { color: '#0000ff', expectedHue: 240, description: 'hex blue' },
        { color: 'rgb(255, 0, 255)', expectedHue: 300, description: 'rgb magenta' }
      ];
      testCases.forEach(({ color, expectedHue, description }) => {
        const spy = vi.spyOn(HuePlugin.prototype, 'updateHueThumbPosition');
        const testContainer = document.createElement('div');
        document.body.appendChild(testContainer);
        const picker = new ewColorPicker({
          el: testContainer,
          defaultColor: color,

        });
        const hsva = colorRgbaToHsva(colorToRgba(color));
        expect(hsva.h).toBe(expectedHue);
        expect(spy).toHaveBeenCalledWith(expectedHue);
        spy.mockRestore();
        document.body.removeChild(testContainer);
      });
    });

    it('should handle alpha-enabled defaultColor correctly', () => {
      const spy = vi.spyOn(HuePlugin.prototype, 'updateHueThumbPosition');
      const picker = new ewColorPicker({
        el: container,
        defaultColor: '#00ff00'
      });
      const currentColor = picker.getColor();
      expect(currentColor).toBe('#00ff00'); // 应该是 hex 格式
      const hsva = colorRgbaToHsva(colorToRgba(currentColor));
      expect(hsva.h).toBe(120); // 绿色应该是 120 度
      expect(spy).toHaveBeenCalledWith(120);
      spy.mockRestore();
    });
  });

  describe('hue plugin method exposure', () => {
    it('should expose updateHueThumbPosition method', () => {
      const picker = new ewColorPicker({
        el: container,
        defaultColor: '#00ff00'
      });

      const huePlugin = picker.plugins.ewColorPickerHue;
      expect(typeof huePlugin.updateHueThumbPosition).toBe('function');
    });
  });
}); 