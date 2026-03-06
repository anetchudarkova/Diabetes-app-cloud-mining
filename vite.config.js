import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/Diabetes-app-cloud-mining/', // 👈 Replace with your actual repo name
});

