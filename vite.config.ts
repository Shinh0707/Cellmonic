import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    return {
      // GitHub Pages用に相対パスを強制
      base: './',

      // サーバー設定（AI Studio用）
      server: {
        port: 3000,
        host: '0.0.0.0',
      },

      plugins: [
        react(),
        // 【追加】ビルド時のみ、HTML内の importmap を削除するプラグイン
        {
          name: 'remove-import-map-in-build',
          transformIndexHtml(html) {
            if (mode === 'production') {
              // importmapタグとその中身を空文字に置換
              return html.replace(/<script type="importmap">[\s\S]*?<\/script>/, '');
            }
            return html;
          }
        }
      ],

      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },

      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      
      // build設定：externalは絶対に書かない（Reactをバンドルに含めるため）
      build: {
        outDir: 'dist',
        assetsDir: 'assets',
      }
    };
});
