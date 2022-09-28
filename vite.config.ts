import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [
    vue(),

    /* CONFIGURATION FOR SCRIPTS AUTO-IMPORT */
    AutoImport({
      dts: command === 'serve' && './dts/auto-imports.d.ts',

      dirs: [
        './src/composables',
        './src/composables/**/index.ts'
      ],

      eslintrc: {
        enabled: true
      },

      imports: [
        'vue'
      ],
      resolvers: [ElementPlusResolver()]
    }),

    /* CONFIGURATION FOR COMPONENTS AUTO-IMPORT */
    Components({
      dts: command === 'serve' && './dts/components.d.ts',
      dirs: [
        'src/components'
      ],
      resolvers: [ElementPlusResolver({ importStyle: false })]
    })
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
}))
