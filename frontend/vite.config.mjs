import fs from 'node:fs'
import path from 'node:path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {}
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const env = {}
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) {
      continue
    }
    const idx = trimmed.indexOf('=')
    const key = trimmed.slice(0, idx).trim()
    const value = trimmed.slice(idx + 1).trim()
    env[key] = value
  }
  return env
}

// https://vitejs.dev/config/
export default defineConfig(() => {
  const profileRaw = process.env.APP_ENV_PROFILE || process.env.VITE_ENV_PROFILE || 'local'
  const profile = ['local', 'server'].includes(String(profileRaw).trim().toLowerCase())
    ? String(profileRaw).trim().toLowerCase()
    : 'local'

  const profilePath = path.resolve(__dirname, `${profile}.env`)
  const fileEnv = parseEnvFile(profilePath)
  const mergedEnv = { ...fileEnv, ...process.env }

  const defineEnv = {}
  for (const [key, value] of Object.entries(mergedEnv)) {
    if (key.startsWith('VITE_')) {
      defineEnv[`import.meta.env.${key}`] = JSON.stringify(String(value))
    }
  }

  return {
    plugins: [react()],
    define: defineEnv,
    server: {
      port: 5173,
      strictPort: true,
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})