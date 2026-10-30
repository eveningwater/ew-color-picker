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
  'color-mode': { pkgName: 'color-mode', globalName: 'ColorMode', distName: 'colorMode', external: [CORE, UTILS], exports: 'default' },
  'ew-color-picker': {
    pkgName: 'ew-color-picker',
    globalName: 'ewColorPicker',
    distName: 'index',
    external: [],
    // ESM 产物把内置插件交给打包工具解析，避免与各子包重复打包
    esmExternal: [
      CORE,
      UTILS,
      '@ew-color-picker/alpha',
      '@ew-color-picker/hue',
      '@ew-color-picker/panel',
      '@ew-color-picker/box',
      '@ew-color-picker/button',
      '@ew-color-picker/input',
      '@ew-color-picker/input-number',
      '@ew-color-picker/predefine',
      '@ew-color-picker/color-mode',
    ],
  },
};

// 产出两份：UMD（压缩，供 script 标签/CDN）与 ESM（供打包工具）
const BUILD_TYPES = [
  { format: 'umd', ext: '.min.js', minify: true },
  { format: 'es', ext: '.esm.js', minify: false },
];

// rollup-plugin-typescript2 会把整个 monorepo 源码的声明文件都写进 dist，
// 这里只保留当前包自身（package.json types 入口所在目录）的 .d.ts，
// 并移除仅开发期可用的 .d.ts.map
function pruneForeignDeclarations(pkgDir) {
  return {
    name: 'prune-foreign-declarations',
    closeBundle() {
      const pkgJson = JSON.parse(
        fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'),
      );
      const typesEntry = pkgJson.types || pkgJson.typings;
      if (!typesEntry) return;

      const distDir = path.join(pkgDir, 'dist');
      if (!fs.existsSync(distDir)) return;
      const keepDir = path.dirname(path.join(pkgDir, typesEntry));

      const walk = (dir) => {
        fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
          const full = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            walk(full);
            return;
          }
          const isOwnDeclaration = full.startsWith(keepDir + path.sep);
          const shouldRemove =
            entry.name.endsWith('.d.ts.map') ||
            (entry.name.endsWith('.d.ts') && !isOwnDeclaration);
          if (shouldRemove) {
            fs.unlinkSync(full);
          }
        });
        if (dir !== distDir && fs.readdirSync(dir).length === 0) {
          fs.rmdirSync(dir);
        }
      };

      walk(distDir);
    },
  };
}

export function getBanner(pkgName) {
  return `/*!
 * @ew-color-picker/${pkgName}
 * (c) 2024-${new Date().getFullYear()} eveningwater(854806732@qq.com)
 * Released under the MIT License.
 */`;
}

// 生成单个包的 rollup 配置（umd.min / esm 两份）
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
      pruneForeignDeclarations(pkgDir),
    ];
    if (minify) plugins.push(uglify());

    const externals = format === 'es' && spec.esmExternal ? spec.esmExternal : spec.external;
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
      external: externals,
    };
  });
}
