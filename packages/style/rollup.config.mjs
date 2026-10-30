import scss from 'rollup-plugin-scss';

const buildType = [
  {
    ext: '.css',
    env: 'development',
  },
  {
    ext: '.min.css',
    env: 'production',
  },
];

function generateBuildConfigs() {
  const result = [];
  buildType.forEach((type) => {
    const isMin = type.ext.indexOf('min') > -1;
    // index.scss 构建
    const config = {
      input: 'src/index.scss',
      output: {
        file: `dist/index${type.ext}`,
        banner: `/*!\n * @ew-color-picker/style\n * (c) 2024-${new Date().getFullYear()} eveningwater(854806732@qq.com)\n * Released under the MIT License.\n */`,
      },
      plugins: [
        scss({
          failOnError: true,
          outputStyle: isMin ? 'compressed' : 'expanded',
          sourceMap: false,
          // 直接输出到文件
          fileName: `index${type.ext}`,
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

    // input-number.scss 构建
    const inputNumberConfig = {
      input: 'src/input-number.scss',
      output: {
        file: `dist/input-number${type.ext}`,
        banner: `/*!\n * @ew-color-picker/style input-number\n * (c) 2024-${new Date().getFullYear()} eveningwater(854806732@qq.com)\n * Released under the MIT License.\n */`,
      },
      plugins: [
        scss({
          failOnError: true,
          outputStyle: isMin ? 'compressed' : 'expanded',
          sourceMap: false,
          fileName: `input-number${type.ext}`,
        }),
      ],
      onwarn(warning, warn) {
        if (warning.code === 'EMPTY_BUNDLE') return;
        warn(warning);
      },
    };
    Object.defineProperties(inputNumberConfig, {
      packageName: { value: 'style' },
      ext: { value: type.ext },
    });
    result.push(inputNumberConfig);
  });
  return result;
}

export default generateBuildConfigs(); 