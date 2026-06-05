import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // host: true permite acesso pelo proxy do GitHub Codespaces / rede local.
    host: true,
    // Libera o domínio dinâmico que o Codespaces gera (*.app.github.dev),
    // senão o Vite bloqueia com "Blocked request. This host is not allowed".
    allowedHosts: ['.app.github.dev', '.github.dev', 'localhost'],
    // Encaminha as chamadas da API para o backend Express. Assim o navegador
    // só fala com a origem do frontend (sem CORS, sem expor a porta 3333) e o
    // Vite repassa internamente — funciona igual em local e no Codespaces.
    proxy: {
      '/api': 'http://localhost:3333',
      '/health': 'http://localhost:3333',
    },
  },
});
