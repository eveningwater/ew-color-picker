// 把工作区包直接映射到源码，示例无需先构建 packages 即可运行
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(here, '..');
const pkg = (name) => resolve(repoRoot, 'packages', name, 'src/index.ts');

export const ewColorPickerAliases = [
  { find: '@ew-color-picker/ew-color-picker', replacement: pkg('ew-color-picker') },
  { find: '@ew-color-picker/core', replacement: pkg('core') },
  { find: '@ew-color-picker/utils', replacement: pkg('utils') },
  { find: '@ew-color-picker/box', replacement: pkg('box') },
  { find: '@ew-color-picker/panel', replacement: pkg('panel') },
  { find: '@ew-color-picker/hue', replacement: pkg('hue') },
  { find: '@ew-color-picker/alpha', replacement: pkg('alpha') },
  { find: '@ew-color-picker/input', replacement: pkg('input') },
  { find: '@ew-color-picker/input-number', replacement: pkg('input-number') },
  { find: '@ew-color-picker/button', replacement: pkg('button') },
  { find: '@ew-color-picker/predefine', replacement: pkg('predefine') },
  { find: '@ew-color-picker/color-mode', replacement: pkg('color-mode') },
  {
    find: '@ew-color-picker/style/dist/index.css',
    replacement: resolve(repoRoot, 'packages/style/src/index.scss'),
  },
  {
    find: '@ew-color-picker/style/dist/input-number.css',
    replacement: resolve(repoRoot, 'packages/style/src/input-number.scss'),
  },
];
