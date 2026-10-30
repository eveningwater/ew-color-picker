// scripts/build.js
import { rollup } from 'rollup';
import scss from 'rollup-plugin-scss';
import fs from 'fs';
import path from 'path';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

// JS 包构建配置与各包 `rollup -c` 共享同一份定义，避免两处维护漂移
import { createPackageConfigs, getBanner } from './rollup.shared.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packagesDir = path.resolve(__dirname, '../packages');

async function buildJsTsPackage(pkg) {
  const pkgDir = path.join(packagesDir, pkg);
  if (!fs.existsSync(path.join(pkgDir, 'src/index.ts'))) return;

  for (const { input, output, plugins, external } of createPackageConfigs(pkgDir)) {
    const bundle = await rollup({ input, plugins, external });
    await bundle.write(output);
    await bundle.close();
  }
}

async function buildStylePackage(pkg) {
  const pkgDir = path.join(packagesDir, pkg);
  const scssDir = path.join(pkgDir, 'src');
  if (!fs.existsSync(scssDir)) return;
  const scssFiles = fs.readdirSync(scssDir).filter(f => f.endsWith('.scss'));
  if (scssFiles.length === 0) return;

  const buildType = [
    { ext: '.css', minify: false },
    { ext: '.min.css', minify: true }
  ];

  for (const file of scssFiles) {
    for (const type of buildType) {
      const isMin = type.minify;
      const input = path.join(scssDir, file);
      const outName = file.replace(/\.scss$/, type.ext);
      const bundle = await rollup({
        input,
        plugins: [
          scss({
            failOnError: true,
            outputStyle: isMin ? 'compressed' : 'expanded',
            sourceMap: false,
            fileName: outName,
            additionalData: `@import './variable.scss';`,
          }),
        ],
        onwarn(warning, warn) {
          if (warning.code === 'EMPTY_BUNDLE') return;
          warn(warning);
        },
      });
      await bundle.write({
        file: path.join(pkgDir, 'dist', outName),
        banner: getBanner(pkg + (file !== 'index.scss' ? ' ' + file.replace('.scss', '') : '')),
      });
      await bundle.close();
    }
  }
}

async function buildAll() {
  const packages = fs.readdirSync(packagesDir).filter(f =>
    fs.statSync(path.join(packagesDir, f)).isDirectory()
  );
  for (const pkg of packages) {
    // style 包特殊处理
    if (pkg === 'style') {
      console.log(`Building style package...`);
      await buildStylePackage(pkg);
      continue;
    }
    // 只构建含 src/index.ts 的包
    if (fs.existsSync(path.join(packagesDir, pkg, 'src/index.ts'))) {
      console.log(`Building ${pkg}...`);
      await buildJsTsPackage(pkg);
    }
  }
  console.log('All packages built!');
}

buildAll();
