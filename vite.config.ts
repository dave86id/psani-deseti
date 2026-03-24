import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import pkg from './package.json'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  // In dev mode show "dev", in build show Czech-formatted datetime
  const buildTime = command === 'build'
    ? new Date().toLocaleString('cs-CZ', {
        day: 'numeric', month: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit',
        timeZone: 'Europe/Prague',
      })
    : 'dev';

  return {
    plugins: [react()],
    define: {
      __APP_VERSION__: JSON.stringify(pkg.version),
      __BUILD_TIME__: JSON.stringify(buildTime),
    },
  };
});
