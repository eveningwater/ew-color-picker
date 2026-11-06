import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import { ewColorPickerAliases } from '../vite.shared.mjs';

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: ewColorPickerAliases,
  },
  define: {
    // 源码中用到了 rollup 注入的 __DEV__ 常量
    __DEV__: 'true',
  },
  server: {
    port: 5175,
  },
});
