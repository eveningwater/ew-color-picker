// vite.config.ts
import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  server: {
    port: 3000,
    open: '/examples/color.html',
    cors: true
  },
  // 定义全局变量
  define: {
    __DEV__: true,  // 开发模式
    'process.env.NODE_ENV': JSON.stringify('development')
  },
  // 配置路径别名，将 workspace 包映射到源码目录
  resolve: {
    alias: {
      '@ew-color-picker/core': path.resolve(__dirname, 'packages/core/src/index.ts'),
      '@ew-color-picker/utils': path.resolve(__dirname, 'packages/utils/src/index.ts'),
      '@ew-color-picker/box': path.resolve(__dirname, 'packages/box/src/index.ts'),
      '@ew-color-picker/panel': path.resolve(__dirname, 'packages/panel/src/index.ts'),
      '@ew-color-picker/hue': path.resolve(__dirname, 'packages/hue/src/index.ts'),
      '@ew-color-picker/alpha': path.resolve(__dirname, 'packages/alpha/src/index.ts'),
      '@ew-color-picker/input': path.resolve(__dirname, 'packages/input/src/index.ts'),
      '@ew-color-picker/input-number': path.resolve(__dirname, 'packages/input-number/src/index.ts'),
      '@ew-color-picker/button': path.resolve(__dirname, 'packages/button/src/index.ts'),
      '@ew-color-picker/predefine': path.resolve(__dirname, 'packages/predefine/src/index.ts'),
      '@ew-color-picker/color-mode': path.resolve(__dirname, 'packages/color-mode/src/index.ts'),
      '@ew-color-picker/style': path.resolve(__dirname, 'packages/style/src/index.ts'),
    }
  },
  // 优化开发体验
  optimizeDeps: {
    exclude: ['@ew-color-picker/core', '@ew-color-picker/utils']
  }
});
