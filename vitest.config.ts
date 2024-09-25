import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      // TODO: find a way to track coverage in ./bin
      include: ['lib/*.ts'],
    },
  },
});
