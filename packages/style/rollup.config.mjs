import scss from 'rollup-plugin-scss';

// 每个 scss 入口产出 .css 与 .min.css 两份
const buildType = [
  { ext: '.css', minify: false },
  { ext: '.min.css', minify: true },
];

const entries = ['index', 'input-number', 'select'];

function getBanner(name) {
  return `/*!\n * @ew-color-picker/style${name === 'index' ? '' : ' ' + name}\n * (c) 2024-${new Date().getFullYear()} eveningwater(854806732@qq.com)\n * Released under the MIT License.\n */`;
}

function generateBuildConfigs() {
  const result = [];

  for (const entry of entries) {
    for (const type of buildType) {
      const outName = `${entry}${type.ext}`;
      const config = {
        input: `src/${entry}.scss`,
        output: {
          file: `dist/${outName}`,
          banner: getBanner(entry),
        },
        plugins: [
          scss({
            failOnError: true,
            outputStyle: type.minify ? 'compressed' : 'expanded',
            sourceMap: false,
            // 直接输出到文件
            fileName: outName,
          }),
        ],
        // 减少 rollup 警告
        onwarn(warning, warn) {
          if (warning.code === 'EMPTY_BUNDLE') return;
          warn(warning);
        },
      };
      Object.defineProperties(config, {
        packageName: { value: 'style' },
        ext: { value: type.ext },
      });
      result.push(config);
    }
  }

  return result;
}

export default generateBuildConfigs();
