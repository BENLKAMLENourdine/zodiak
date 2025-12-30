import swc from 'unplugin-swc';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    root: './',
  },
  plugins: [
    // This is required to transform the test files with SWC
    swc.vite({
      // Explicitly set the module type to avoid inheriting from a .swcrc file if you have one
      module: { type: 'es6' },
    }),
  ],
});
