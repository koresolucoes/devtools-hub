import { defineConfig } from 'vite';
import analog from '@analogjs/vite-plugin-angular';

export default defineConfig({
  plugins: [analog()],
});
