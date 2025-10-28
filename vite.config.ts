// 👇 CAMBIA 'vite' POR 'vitest/config'
import { defineConfig } from 'vitest/config'; 
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: { // <-- El error rojo desaparecerá
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.ts',
    
    // Dejamos esto listo para cuando ejecutes las pruebas
    // y evitar el error del antivirus (el 'getComputedStyle')
    environmentOptions: {
      jsdom: {
        resources: 'usable'
      }
    }
  },
});