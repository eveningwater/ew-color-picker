import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import Button from '../src/button';

describe('Button 组件', () => {
  let container: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    container.remove();
  });

  it('should render text, type and size classes', () => {
    const button = new Button({ text: '确定', type: 'primary', size: 'large' });
    container.appendChild(button.getElement());

    const el = container.querySelector('button') as HTMLButtonElement;
    expect(el.textContent).toBe('确定');
    expect(el.type).toBe('button');
    expect(el.classList.contains('ew-button')).toBe(true);
    expect(el.classList.contains('ew-button--primary')).toBe(true);
    expect(el.classList.contains('ew-button--large')).toBe(true);
  });

  it('should trigger onClick when clicked', () => {
    const onClick = vi.fn();
    const button = new Button({ text: '点击', onClick });
    container.appendChild(button.getElement());

    button.getElement().click();
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('should not trigger onClick when disabled', () => {
    const onClick = vi.fn();
    const button = new Button({ text: '禁用', disabled: true, onClick });
    container.appendChild(button.getElement());

    button.getElement().click();
    expect(onClick).not.toHaveBeenCalled();
  });

  it('should support block and nativeType', () => {
    const button = new Button({ text: '提交', block: true, nativeType: 'submit' });
    container.appendChild(button.getElement());

    const el = button.getElement();
    expect(el.classList.contains('ew-button--block')).toBe(true);
    expect(el.type).toBe('submit');
  });

  it('should update text, type and disabled state', () => {
    const button = new Button({ text: '之前' });
    container.appendChild(button.getElement());

    button.setText('之后');
    expect(button.getElement().textContent).toBe('之后');

    button.setType('danger');
    expect(button.getElement().classList.contains('ew-button--danger')).toBe(true);
    expect(button.getElement().classList.contains('ew-button--default')).toBe(false);

    button.setDisabled(true);
    expect(button.isDisabled()).toBe(true);
    expect(button.getElement().disabled).toBe(true);
  });

  it('should remove element and unbind events on destroy', () => {
    const onClick = vi.fn();
    const button = new Button({ text: '销毁', onClick });
    const el = button.getElement();
    container.appendChild(el);

    button.destroy();
    el.click();

    expect(container.contains(el)).toBe(false);
    expect(onClick).not.toHaveBeenCalled();
  });
});
