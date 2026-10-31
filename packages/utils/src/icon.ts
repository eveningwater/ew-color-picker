import { handleClassName } from "./base";
import { DEFAULT_PREFIX } from "./prefix";

export const closeIcon = (className?: string, size?: number, prefix = DEFAULT_PREFIX) => {
  const sizeAttr = size && size > 0 ? ` width="${size}" height="${size}"` : "";
  return `<svg t="1690189203554" class="${prefix}color-picker-icon${handleClassName(
    className
  )}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2272" fill="currentColor"${sizeAttr}><path d="M504.224 470.288l207.84-207.84a16 16 0 0 1 22.608 0l11.328 11.328a16 16 0 0 1 0 22.624l-207.84 207.824 207.84 207.84a16 16 0 0 1 0 22.608l-11.328 11.328a16 16 0 0 1-22.624 0l-207.824-207.84-207.84 207.84a16 16 0 0 1-22.608 0l-11.328-11.328a16 16 0 0 1 0-22.624l207.84-207.824-207.84-207.84a16 16 0 0 1 0-22.608l11.328-11.328a16 16 0 0 1 22.624 0l207.824 207.84z" p-id="2273"></path></svg>`;
};

export const arrowIcon = (className?: string, size?: number, prefix = DEFAULT_PREFIX) => {
  const sizeAttr = size && size > 0 ? ` width="${size}" height="${size}"` : "";
  return `<svg t="1717384498630" class="${prefix}color-picker-icon${handleClassName(
    className
  )}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4234"${sizeAttr}><path d="M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z" fill="currentColor" p-id="4235"></path></svg>`;
};

export const upArrowIcon = (className?: string, size?: number, prefix = DEFAULT_PREFIX) => {
  const sizeAttr = size && size > 0 ? ` width="${size}" height="${size}"` : "";
  return `<svg t="1717384498631" class="${prefix}color-picker-icon${handleClassName(
    className
  )}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4235"${sizeAttr}><path d="M512 309.333333c8.533333 0 17.066667 2.133333 23.466667 8.533334l341.333333 341.333333c12.8 12.8 12.8 32 0 44.8-12.8 12.8-32 12.8-44.8 0L533.333333 374.4 215.466667 692.266667c-12.8 12.8-32 12.8-44.8 0-12.8-12.8-12.8-32 0-44.8L488.533333 317.866667c4.266667-8.533333 12.8-10.666667 21.333334-10.666667z" fill="#666666" p-id="4236"></path></svg>`;
};

export const downArrowIcon = (className?: string, size?: number, prefix = DEFAULT_PREFIX) => {
  const sizeAttr = size && size > 0 ? ` width="${size}" height="${size}"` : "";
  return `<svg t="1717384498632" class="${prefix}color-picker-icon${handleClassName(
    className
  )}" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="4236"${sizeAttr}><path d="M512 714.666667c-8.533333 0-17.066667-2.133333-23.466667-8.533334l-341.333333-341.333333c-12.8-12.8-12.8-32 0-44.8 12.8-12.8 32-12.8 44.8 0l320 317.866667 317.866667-320c12.8-12.8 32-12.8 44.8 0 12.8 12.8 12.8 32 0 44.8L533.333333 704c-4.266667 8.533333-12.8 10.666667-21.333333 10.666667z" fill="#666666" p-id="4237"></path></svg>`;
};
