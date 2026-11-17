import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import ewColorPicker from '../src/index';

describe('面板层级（z-index）', () => {
  let container: HTMLElement;
  let dialog: HTMLElement | undefined;
  let core: ewColorPicker | undefined;

  const getPanelContainer = () =>
    document.querySelector('.ew-color-picker-panel-container') as HTMLElement;

  // 模拟 Element Plus Dialog：高层级容器 + 挂载到 body
  const mountInDialog = (zIndex: number) => {
    dialog = document.createElement('div');
    dialog.style.position = 'fixed';
    dialog.style.zIndex = String(zIndex);
    dialog.appendChild(container);
    document.body.appendChild(dialog);
    return dialog;
  };

  beforeEach(() => {
    container = document.createElement('div');
    document.body.appendChild(container);
  });

  afterEach(() => {
    core?.destroy();
    core = undefined;
    container.parentNode?.removeChild(container);
    dialog?.parentNode?.removeChild(dialog);
    dialog = undefined;
  });

  it('祖先存在高层级时自动提升面板层级，避免被遮罩层遮挡', () => {
    mountInDialog(2001);

    core = new ewColorPicker({ el: container, defaultColor: '#ff0000' });
    core.showPanel();

    expect(getPanelContainer().style.zIndex).toBe('2002');
  });

  it('每次打开面板都重新计算层级', () => {
    const dialogEl = mountInDialog(2001);

    core = new ewColorPicker({ el: container, defaultColor: '#ff0000' });
    core.showPanel();
    expect(getPanelContainer().style.zIndex).toBe('2002');

    // 模拟 Element Plus 再次打开弹窗时递增层级
    dialogEl.style.zIndex = '2005';
    core.showPanel();
    expect(getPanelContainer().style.zIndex).toBe('2006');
  });

  it('普通页面不写内联层级，保持样式表默认值', () => {
    core = new ewColorPicker({ el: container, defaultColor: '#ff0000' });
    core.showPanel();

    expect(getPanelContainer().style.zIndex).toBe('');
  });
});
