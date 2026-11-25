import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Input from '../src/input';

describe('Input 组件', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should render input with value, placeholder and size class', () => {
    const input = new Input({ value: 'hello', placeholder: '请输入', size: 'large' });
    container.appendChild(input.getElement());

    const el = container.querySelector('input') as HTMLInputElement;
    expect(el.value).toBe('hello');
    expect(el.placeholder).toBe('请输入');
    expect(el.classList.contains('ew-input')).toBe(true);
    expect(el.classList.contains('ew-input--large')).toBe(true);
  });

  it('should trigger onChange when typing', () => {
    const onChange = vi.fn();
    const input = new Input({ onChange });
    container.appendChild(input.getElement());

    const el = input.getElement();
    el.value = 'abc';
    el.dispatchEvent(new Event('input'));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0]).toBe('abc');
  });

  it('should trigger onEnter when pressing Enter', () => {
    const onEnter = vi.fn();
    const input = new Input({ onEnter });
    container.appendChild(input.getElement());

    input.getElement().dispatchEvent(
      new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
    );

    expect(onEnter).toHaveBeenCalledTimes(1);
  });

  it('should update value via setValue and optionally trigger onChange', () => {
    const onChange = vi.fn();
    const input = new Input({ onChange });
    container.appendChild(input.getElement());

    input.setValue('first');
    expect(input.getValue()).toBe('first');
    expect(onChange).toHaveBeenCalledWith('first');

    input.setValue('second', false);
    expect(input.getValue()).toBe('second');
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('should toggle disabled and readonly state', () => {
    const input = new Input();
    container.appendChild(input.getElement());

    input.setDisabled(true);
    expect(input.getElement().disabled).toBe(true);
    expect(input.getElement().classList.contains('ew-input--disabled')).toBe(true);

    input.setDisabled(false);
    expect(input.getElement().disabled).toBe(false);

    input.setReadonly(true);
    expect(input.getElement().readOnly).toBe(true);
    expect(input.getElement().classList.contains('ew-input--readonly')).toBe(true);
  });

  it('should remove element and unbind events on destroy', () => {
    const onChange = vi.fn();
    const input = new Input({ onChange });
    const el = input.getElement();
    container.appendChild(el);

    input.destroy();
    el.dispatchEvent(new Event('input'));

    expect(container.contains(el)).toBe(false);
    expect(onChange).not.toHaveBeenCalled();
  });
});
