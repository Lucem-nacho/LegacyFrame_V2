import { defineConfig } from 'vite'; 
import react from '@vitejs/plugin-react';

// Nota: usamos el tipo de Vite para evitar depender de 'vitest/config' en compilación
export default defineConfig({
  plugins: [react()],
  // Este bloque es consumido por Vitest; Vite lo ignorará sin problema.
  test: { 
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    environmentOptions: {
      jsdom: {
        resources: 'usable'
      }
    }
  },
} as any);