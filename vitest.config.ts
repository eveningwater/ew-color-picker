import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'test/',
        '**/*.d.ts',
        '**/*.config.*',
        'scripts/',
        'examples/'
      ]
    }
  },
  resolve: {
    alias: {
      '@ew-color-picker/utils': resolve(__dirname, './packages/utils/src'),
      '@ew-color-picker/core': resolve(__dirname, './packages/core/src'),
      '@ew-color-picker/alpha': resolve(__dirname, './packages/alpha/src'),
      '@ew-color-picker/hue': resolve(__dirname, './packages/hue/src'),
      '@ew-color-picker/panel': resolve(__dirname, './packages/panel/src'),
      '@ew-color-picker/input': resolve(__dirname, './packages/input/src'),
      '@ew-color-picker/input-number': resolve(__dirname, './packages/input-number/src'),
      '@ew-color-picker/button': resolve(__dirname, './packages/button/src'),
      '@ew-color-picker/predefine': resolve(__dirname, './packages/predefine/src'),
      '@ew-color-picker/color-mode': resolve(__dirname, './packages/color-mode/src'),
      '@ew-color-picker/box': resolve(__dirname, './packages/box/src'),
      '@ew-color-picker/style': resolve(__dirname, './packages/style/src'),
    }
  }
}); 