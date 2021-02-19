const babel = require('rollup-plugin-babel');
const cssnano = require('cssnano');
const postcss = require('rollup-plugin-postcss');
import { terser } from 'rollup-plugin-terser';
import cssNext from 'postcss-cssnext';
const options = {
    // 产出文件使用 umd 规范（即兼容 amd cjs 和 iife）
    format: 'umd',
    // iife 规范下的全局变量名称
    name: 'ewColorPicker',
    // 产出的未压缩的文件名
    file: './dist/ew-color-picker.js'
};
const cssOption = {
    extensions: ['.css'],
    plugins: [
        cssNext({ warnForDuplicates: false, }),
        cssnano()
    ],
    extract: "ew-color-picker.min.css"
}
export default [
    {
        // 入口文件
        input: './src/index.js',
        output: [
            {
                ...options
            },
            {
                ...options,
                // 产出的压缩的文件名
                file: './dist/ew-color-picker.min.js',
                plugins: [
                    terser()
                ]
            }
        ],
        plugins: [
            babel({
                exclude: 'node_modules/**' // only transpile our source code
            }),
            postcss(cssOption)
        ]
    }
]
