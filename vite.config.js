import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  base: 'https://maracasbarragan.github.io/Incidencia_Delictiva',
  plugins: [react()],
})
