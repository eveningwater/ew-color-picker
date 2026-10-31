export const BOX_TEMPLATE = (
  children: string,
  style?: string,
  className?: string,
  prefix = "ew-"
) =>
  `<div class="${prefix}color-picker-box${className ? ' ' + className : ''}" ${
    style ? `style="${style}"` : ""
  }>${children}</div>`;
