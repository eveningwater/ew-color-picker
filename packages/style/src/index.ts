// Style plugin for ew-color-picker
// 提供样式注入和移除功能

let styleElement: HTMLStyleElement | null = null;
let styleContent = '';
const injectedStyles = new Map<string, HTMLStyleElement>();

/**
 * 注入样式到页面
 * @param styles 样式内容
 * @param id 样式元素的ID（可选）
 * @param prefix 类名前缀（默认 ew-）
 */
export function injectStyles(styles?: string, id?: string, prefix = 'ew-'): void {
  // 如果提供了ID，使用ID管理样式
  if (id) {
    // 检查是否已经存在相同ID的样式
    if (injectedStyles.has(id)) {
      return; // 已经注入过了
    }
    
    // 创建新的样式元素
    const element = document.createElement('style');
    element.id = id;
    element.textContent = styles || '';
    document.head.appendChild(element);
    
    // 存储引用
    injectedStyles.set(id, element);
    return;
  }
  
  // 默认样式处理（保持向后兼容）
  if (styleElement) {
    return; // 已经注入过了
  }

  // 如果没有提供样式，使用默认样式
  if (!styles) {
    // 这里可以导入默认样式，或者使用内联样式
    const rawStyles = `
      /* ew-color-picker 默认样式 */
      .ew-color-picker {
        display: inline-block;
        position: relative;
      }
      
      .ew-color-picker-panel-container {
        display: inline-block;
        position: absolute;
        left: 0;
        top: 100%;
        margin-top: 8px;
        padding: 10px;
        background: #fff;
        border-radius: 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.18);
        border: 1px solid #e5e6eb;
        min-width: 320px;
        overflow: visible;
        z-index: 1000;
        transition: opacity 0.2s, transform 0.2s;
        opacity: 1;
      }
      
      .ew-color-picker-panel {
        width: 280px;
        height: 180px;
        border-radius: 8px;
        margin-bottom: 0;
        box-shadow: 0 2px 8px rgba(0,0,0,0.04);
        display: inline-block;
      }
      
      .ew-color-picker-white-panel {
        background: linear-gradient(90deg, #fff, hsla(0, 0%, 100%, 0));
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
      
      .ew-color-picker-black-panel {
        background: linear-gradient(0deg, #000, transparent);
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
      }
      
      .ew-color-picker-panel-cursor {
        position: absolute;
        width: 8px;
        height: 8px;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
        pointer-events: none;
      }
      
      .ew-color-picker-slider {
        position: relative;
        box-sizing: border-box;
        cursor: pointer;
      }
      
      .ew-color-picker-slider-bar {
        position: relative;
        cursor: pointer;
      }
      
      .ew-color-picker-slider-thumb {
        position: absolute;
        box-sizing: border-box;
        cursor: pointer;
        width: 12px;
        height: 12px;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
        pointer-events: none;
      }
      
      .ew-color-picker-alpha-slider-bar {
        position: relative;
        cursor: pointer;
      }
      
      .ew-color-picker-alpha-slider-thumb {
        position: absolute;
        box-sizing: border-box;
        cursor: pointer;
        width: 12px;
        height: 12px;
        border: 2px solid #fff;
        border-radius: 50%;
        box-shadow: 0 0 4px rgba(0,0,0,0.3);
        pointer-events: none;
      }
      
      .ew-color-picker-box {
        position: relative;
        background-color: #fff;
        transition: background-color 0.3s;
        display: inline-block;
        outline: none;
        cursor: pointer;
        color: #666666;
      }
      
      .ew-color-picker-input {
        background-color: #fff;
        outline: none;
        display: inline-block;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 14px;
      }
      
      .ew-color-picker-drop-btn {
        background-color: #fff;
        outline: none;
        display: inline-block;
        cursor: pointer;
        text-align: center;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        padding: 4px 12px;
        font-size: 14px;
        margin-left: 4px;
      }
      
      .ew-color-picker-bottom-row {
        margin-top: 8px;
        display: flex;
        align-items: center;
        justify-content: space-between;
      }
      
      .ew-color-picker-input-container {
        flex: 1;
        margin-right: 8px;
      }
      
      .ew-color-picker-drop-btn-group {
        display: flex;
        gap: 4px;
      }
      
      .ew-color-picker-predefine-container {
        margin-top: 8px;
      }
      
      .ew-color-picker-predefine-color {
        float: left;
        cursor: pointer;
        outline: none;
        width: 20px;
        height: 20px;
        border-radius: 4px;
        margin-right: 4px;
        margin-bottom: 4px;
        border: 1px solid #d9d9d9;
      }
      
      .ew-color-picker-predefine-color-item {
        width: 20px;
        height: 20px;
        border-radius: 4px;
        margin-right: 4px;
        margin-bottom: 4px;
        border: 1px solid #d9d9d9;
        cursor: pointer;
        display: inline-block;
      }
      
      .ew-color-picker-predefine-color-item.active {
        border: 2px solid #1890ff;
      }
      
      .ew-color-picker-mode-container {
        margin-top: 8px;
        display: flex;
        gap: 4px;
      }
      
      .ew-color-picker-mode-btn {
        padding: 4px 8px;
        border: 1px solid #d9d9d9;
        border-radius: 4px;
        background: #fff;
        cursor: pointer;
        font-size: 12px;
      }
      
      .ew-color-picker-mode-btn.active {
        background: #1890ff;
        color: #fff;
        border-color: #1890ff;
      }
      
      .ew-color-picker-panel-container-hidden {
        display: none;
      }
      
      .ew-color-picker-panel-dynamic-size {
        width: var(--panel-width, 285px);
        height: var(--panel-height, 180px);
      }
      
      .ew-color-picker-bottom-row-single {
        justify-content: flex-end;
      }
      
      .ew-color-picker-input-container-flex {
        flex: 1;
      }
      
      .ew-color-picker-drop-btn-group-single {
        margin-left: 8px;
      }
      
      .ew-color-picker-clear-btn {
        background: #f5f5f5;
        color: #666;
      }
      
      .ew-color-picker-sure-btn {
        background: #1890ff;
        color: #fff;
        border-color: #1890ff;
      }
      
      .ew-color-picker-icon {
        fill: currentColor;
      }
      
      .ew-color-picker-box-arrow-icon {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
      }
    `;
    styleContent = rawStyles
      .replace(/\.ew-color-picker-/g, () => `.${prefix}color-picker-`)
      .replace(/\.ew-color-picker(?![-\w])/g, () => `.${prefix}color-picker`);
  } else {
    styleContent = styles;
  }

  // 创建样式元素
  styleElement = document.createElement('style');
  styleElement.id = 'ew-color-picker-styles';
  styleElement.textContent = styleContent;
  
  // 注入到 head 中
  document.head.appendChild(styleElement);
}

/**
 * 移除注入的样式
 * @param id 要移除的样式ID（可选）
 */
export function removeStyles(id?: string): void {
  if (id) {
    // 移除指定ID的样式
    const element = injectedStyles.get(id);
    if (element && element.parentNode) {
      element.parentNode.removeChild(element);
      injectedStyles.delete(id);
    }
  } else {
    // 移除所有样式
    // 移除默认样式
    if (styleElement && styleElement.parentNode) {
      styleElement.parentNode.removeChild(styleElement);
      styleElement = null;
    }
    
    // 移除所有带ID的样式
    injectedStyles.forEach((element) => {
      if (element && element.parentNode) {
        element.parentNode.removeChild(element);
      }
    });
    injectedStyles.clear();
  }
}

/**
 * 检查样式是否已注入
 */
export function hasStyles(): boolean {
  return styleElement !== null;
}

/**
 * 获取当前注入的样式内容
 */
export function getStyles(): string {
  return styleContent;
} 