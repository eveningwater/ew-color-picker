export const BOX_TEMPLATE = (children: string, style?: string, className?: string) =>
  `<div class="ew-color-picker-box${className ? ' ' + className : ''}" ${
    style ? `style="${style}"` : ""
  }>${children}</div>`;
