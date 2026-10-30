// 所有 JS 包的共享 rollup 构建配置
// 各包的差异全部收敛到 PACKAGES 表中，新增包只需加一行
import typescript from 'rollup-plugin-typescript2';
import { uglify } from 'rollup-plugin-uglify';
import replace from '@rollup/plugin-replace';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const CORE = '@ew-color-picker/core';
const UTILS = '@ew-color-picker/utils';
// external 依赖对应的 UMD 全局变量
const GLOBAL_NAMES = { [CORE]: 'Core', [UTILS]: 'Utils' };

// pkgName: npm 包名（用于 banner）；globalName: UMD 全局变量名；
// distName: 输出文件名（默认与目录名相同）；exports/declaration: 按需覆盖
export const PACKAGES = {
  utils: { pkgName: 'utils', globalName: 'Utils', external: [] },
  core: { pkgName: 'core', globalName: 'Core', external: [UTILS] },
  alpha: { pkgName: 'alpha', globalName: 'Alpha', external: [CORE, UTILS], exports: 'default' },
  hue: { pkgName: 'hue', globalName: 'Hue', external: [CORE, UTILS], exports: 'default' },
  panel: { pkgName: 'panel', globalName: 'Panel', external: [CORE, UTILS], exports: 'default' },
  box: { pkgName: 'box', globalName: 'Box', external: [CORE, UTILS] },
  button: { pkgName: 'button', globalName: 'Button', external: [CORE, UTILS], exports: 'default' },
  input: { pkgName: 'input', globalName: 'Input', external: [CORE, UTILS], exports: 'default' },
  'input-number': { pkgName: 'input-number', globalName: 'InputNumber', external: [UTILS], exports: 'named' },
  predefine: { pkgName: 'predefine', globalName: 'Predefine', external: [CORE, UTILS], exports: 'default' },
  'color-mode': { pkgName: 'colorMode', globalName: 'ColorMode', distName: 'colorMode', external: [CORE, UTILS], exports: 'default' },
  'ew-color-picker': { pkgName: 'ewColorPicker', globalName: 'ewColorPicker', distName: 'index', external: [] },
};

const BUILD_TYPES = [
  { format: 'umd', ext: '.js', minify: false },
  { format: 'umd', ext: '.min.js', minify: true },
  { format: 'es', ext: '.esm.js', minify: false },
];

export function getBanner(pkgName) {
  return `/*!
 * @ew-color-picker/${pkgName}
 * (c) 2024-${new Date().getFullYear()} eveningwater(854806732@qq.com)
 * Released under the MIT License.
 */`;
}

// 生成单个包的 rollup 配置（umd / umd.min / esm 三份）
export function createPackageConfigs(pkgDir) {
  const dirName = path.basename(pkgDir);
  const spec = PACKAGES[dirName];
  if (!spec) {
    throw new Error(`[rollup] no build spec found for package "${dirName}"`);
  }

  const localTsconfig = path.join(pkgDir, 'tsconfig.json');
  const tsconfig = fs.existsSync(localTsconfig)
    ? localTsconfig
    : path.join(rootDir, 'tsconfig.json');

  return BUILD_TYPES.map(({ format, ext, minify }) => {
    const plugins = [
      typescript({
        verbosity: -1,
        tsconfig,
        check: false,
        ...(spec.declaration === false ? { declaration: false } : {}),
      }),
      replace({
        __DEV__: !minify,
        'process.env.NODE_ENV': minify ? 'production' : 'development',
        preventAssignment: true,
      }),
    ];
    if (minify) plugins.push(uglify());

    const globals = {};
    spec.external.forEach((dep) => {
      if (GLOBAL_NAMES[dep]) globals[dep] = GLOBAL_NAMES[dep];
    });

    return {
      input: path.join(pkgDir, 'src/index.ts'),
      output: {
        file: path.join(pkgDir, 'dist', `${spec.distName || dirName}${ext}`),
        name: spec.globalName,
        format,
        ...(spec.exports ? { exports: spec.exports } : {}),
        banner: getBanner(spec.pkgName),
        globals,
      },
      plugins,
      external: spec.external,
    };
  });
}
