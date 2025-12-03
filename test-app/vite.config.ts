import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

/**
 * Vite configuration for the test application
 */
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@components': resolve(__dirname, '../src/components'),
            '@services': resolve(__dirname, '../src/services'),
            '@stores': resolve(__dirname, '../src/stores'),
            '@hooks': resolve(__dirname, '../src/hooks'),
            '@models': resolve(__dirname, '../src/models'),
            '@commands': resolve(__dirname, '../src/commands'),
            '@utils': resolve(__dirname, '../src/utils'),
        },
    },
    server: {
        port: 3000,
        open: true,
    },
});
