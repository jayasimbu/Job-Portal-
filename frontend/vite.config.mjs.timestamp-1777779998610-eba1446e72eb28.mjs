// vite.config.mjs
import fs from "node:fs";
import path from "node:path";
import { defineConfig } from "file:///C:/Users/JAYASIMBU/Downloads/Career%20Auto1/Career%20Auto1/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///C:/Users/JAYASIMBU/Downloads/Career%20Auto1/Career%20Auto1/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
var __vite_injected_original_dirname = "C:\\Users\\JAYASIMBU\\Downloads\\Career Auto1\\Career Auto1\\frontend";
function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }
  const raw = fs.readFileSync(filePath, "utf-8");
  const env = {};
  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const idx = trimmed.indexOf("=");
    const key = trimmed.slice(0, idx).trim();
    const value = trimmed.slice(idx + 1).trim();
    env[key] = value;
  }
  return env;
}
var vite_config_default = defineConfig(() => {
  const profileRaw = process.env.APP_ENV_PROFILE || process.env.VITE_ENV_PROFILE || "local";
  const profile = ["local", "server"].includes(String(profileRaw).trim().toLowerCase()) ? String(profileRaw).trim().toLowerCase() : "local";
  const profilePath = path.resolve(__vite_injected_original_dirname, `${profile}.env`);
  const fileEnv = parseEnvFile(profilePath);
  const mergedEnv = { ...fileEnv, ...process.env };
  const defineEnv = {};
  for (const [key, value] of Object.entries(mergedEnv)) {
    if (key.startsWith("VITE_")) {
      defineEnv[`import.meta.env.${key}`] = JSON.stringify(String(value));
    }
  }
  return {
    plugins: [react()],
    define: defineEnv,
    server: {
      port: 5173,
      strictPort: true
    },
    resolve: {
      alias: {
        "@": path.resolve(__vite_injected_original_dirname, "./src")
      }
    }
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxcSkFZQVNJTUJVXFxcXERvd25sb2Fkc1xcXFxDYXJlZXIgQXV0bzFcXFxcQ2FyZWVyIEF1dG8xXFxcXGZyb250ZW5kXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxKQVlBU0lNQlVcXFxcRG93bmxvYWRzXFxcXENhcmVlciBBdXRvMVxcXFxDYXJlZXIgQXV0bzFcXFxcZnJvbnRlbmRcXFxcdml0ZS5jb25maWcubWpzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9DOi9Vc2Vycy9KQVlBU0lNQlUvRG93bmxvYWRzL0NhcmVlciUyMEF1dG8xL0NhcmVlciUyMEF1dG8xL2Zyb250ZW5kL3ZpdGUuY29uZmlnLm1qc1wiO2ltcG9ydCBmcyBmcm9tICdub2RlOmZzJ1xyXG5pbXBvcnQgcGF0aCBmcm9tICdub2RlOnBhdGgnXHJcbmltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuXHJcbmZ1bmN0aW9uIHBhcnNlRW52RmlsZShmaWxlUGF0aCkge1xyXG4gIGlmICghZnMuZXhpc3RzU3luYyhmaWxlUGF0aCkpIHtcclxuICAgIHJldHVybiB7fVxyXG4gIH1cclxuXHJcbiAgY29uc3QgcmF3ID0gZnMucmVhZEZpbGVTeW5jKGZpbGVQYXRoLCAndXRmLTgnKVxyXG4gIGNvbnN0IGVudiA9IHt9XHJcbiAgZm9yIChjb25zdCBsaW5lIG9mIHJhdy5zcGxpdCgvXFxyP1xcbi8pKSB7XHJcbiAgICBjb25zdCB0cmltbWVkID0gbGluZS50cmltKClcclxuICAgIGlmICghdHJpbW1lZCB8fCB0cmltbWVkLnN0YXJ0c1dpdGgoJyMnKSB8fCAhdHJpbW1lZC5pbmNsdWRlcygnPScpKSB7XHJcbiAgICAgIGNvbnRpbnVlXHJcbiAgICB9XHJcbiAgICBjb25zdCBpZHggPSB0cmltbWVkLmluZGV4T2YoJz0nKVxyXG4gICAgY29uc3Qga2V5ID0gdHJpbW1lZC5zbGljZSgwLCBpZHgpLnRyaW0oKVxyXG4gICAgY29uc3QgdmFsdWUgPSB0cmltbWVkLnNsaWNlKGlkeCArIDEpLnRyaW0oKVxyXG4gICAgZW52W2tleV0gPSB2YWx1ZVxyXG4gIH1cclxuICByZXR1cm4gZW52XHJcbn1cclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZygoKSA9PiB7XHJcbiAgY29uc3QgcHJvZmlsZVJhdyA9IHByb2Nlc3MuZW52LkFQUF9FTlZfUFJPRklMRSB8fCBwcm9jZXNzLmVudi5WSVRFX0VOVl9QUk9GSUxFIHx8ICdsb2NhbCdcclxuICBjb25zdCBwcm9maWxlID0gWydsb2NhbCcsICdzZXJ2ZXInXS5pbmNsdWRlcyhTdHJpbmcocHJvZmlsZVJhdykudHJpbSgpLnRvTG93ZXJDYXNlKCkpXHJcbiAgICA/IFN0cmluZyhwcm9maWxlUmF3KS50cmltKCkudG9Mb3dlckNhc2UoKVxyXG4gICAgOiAnbG9jYWwnXHJcblxyXG4gIGNvbnN0IHByb2ZpbGVQYXRoID0gcGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgYCR7cHJvZmlsZX0uZW52YClcclxuICBjb25zdCBmaWxlRW52ID0gcGFyc2VFbnZGaWxlKHByb2ZpbGVQYXRoKVxyXG4gIGNvbnN0IG1lcmdlZEVudiA9IHsgLi4uZmlsZUVudiwgLi4ucHJvY2Vzcy5lbnYgfVxyXG5cclxuICBjb25zdCBkZWZpbmVFbnYgPSB7fVxyXG4gIGZvciAoY29uc3QgW2tleSwgdmFsdWVdIG9mIE9iamVjdC5lbnRyaWVzKG1lcmdlZEVudikpIHtcclxuICAgIGlmIChrZXkuc3RhcnRzV2l0aCgnVklURV8nKSkge1xyXG4gICAgICBkZWZpbmVFbnZbYGltcG9ydC5tZXRhLmVudi4ke2tleX1gXSA9IEpTT04uc3RyaW5naWZ5KFN0cmluZyh2YWx1ZSkpXHJcbiAgICB9XHJcbiAgfVxyXG5cclxuICByZXR1cm4ge1xyXG4gICAgcGx1Z2luczogW3JlYWN0KCldLFxyXG4gICAgZGVmaW5lOiBkZWZpbmVFbnYsXHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgcG9ydDogNTE3MyxcclxuICAgICAgc3RyaWN0UG9ydDogdHJ1ZSxcclxuICAgIH0sXHJcbiAgICByZXNvbHZlOiB7XHJcbiAgICAgIGFsaWFzOiB7XHJcbiAgICAgICAgJ0AnOiBwYXRoLnJlc29sdmUoX19kaXJuYW1lLCAnLi9zcmMnKSxcclxuICAgICAgfSxcclxuICAgIH0sXHJcbiAgfVxyXG59KSJdLAogICJtYXBwaW5ncyI6ICI7QUFBbVksT0FBTyxRQUFRO0FBQ2xaLE9BQU8sVUFBVTtBQUNqQixTQUFTLG9CQUFvQjtBQUM3QixPQUFPLFdBQVc7QUFIbEIsSUFBTSxtQ0FBbUM7QUFLekMsU0FBUyxhQUFhLFVBQVU7QUFDOUIsTUFBSSxDQUFDLEdBQUcsV0FBVyxRQUFRLEdBQUc7QUFDNUIsV0FBTyxDQUFDO0FBQUEsRUFDVjtBQUVBLFFBQU0sTUFBTSxHQUFHLGFBQWEsVUFBVSxPQUFPO0FBQzdDLFFBQU0sTUFBTSxDQUFDO0FBQ2IsYUFBVyxRQUFRLElBQUksTUFBTSxPQUFPLEdBQUc7QUFDckMsVUFBTSxVQUFVLEtBQUssS0FBSztBQUMxQixRQUFJLENBQUMsV0FBVyxRQUFRLFdBQVcsR0FBRyxLQUFLLENBQUMsUUFBUSxTQUFTLEdBQUcsR0FBRztBQUNqRTtBQUFBLElBQ0Y7QUFDQSxVQUFNLE1BQU0sUUFBUSxRQUFRLEdBQUc7QUFDL0IsVUFBTSxNQUFNLFFBQVEsTUFBTSxHQUFHLEdBQUcsRUFBRSxLQUFLO0FBQ3ZDLFVBQU0sUUFBUSxRQUFRLE1BQU0sTUFBTSxDQUFDLEVBQUUsS0FBSztBQUMxQyxRQUFJLEdBQUcsSUFBSTtBQUFBLEVBQ2I7QUFDQSxTQUFPO0FBQ1Q7QUFHQSxJQUFPLHNCQUFRLGFBQWEsTUFBTTtBQUNoQyxRQUFNLGFBQWEsUUFBUSxJQUFJLG1CQUFtQixRQUFRLElBQUksb0JBQW9CO0FBQ2xGLFFBQU0sVUFBVSxDQUFDLFNBQVMsUUFBUSxFQUFFLFNBQVMsT0FBTyxVQUFVLEVBQUUsS0FBSyxFQUFFLFlBQVksQ0FBQyxJQUNoRixPQUFPLFVBQVUsRUFBRSxLQUFLLEVBQUUsWUFBWSxJQUN0QztBQUVKLFFBQU0sY0FBYyxLQUFLLFFBQVEsa0NBQVcsR0FBRyxPQUFPLE1BQU07QUFDNUQsUUFBTSxVQUFVLGFBQWEsV0FBVztBQUN4QyxRQUFNLFlBQVksRUFBRSxHQUFHLFNBQVMsR0FBRyxRQUFRLElBQUk7QUFFL0MsUUFBTSxZQUFZLENBQUM7QUFDbkIsYUFBVyxDQUFDLEtBQUssS0FBSyxLQUFLLE9BQU8sUUFBUSxTQUFTLEdBQUc7QUFDcEQsUUFBSSxJQUFJLFdBQVcsT0FBTyxHQUFHO0FBQzNCLGdCQUFVLG1CQUFtQixHQUFHLEVBQUUsSUFBSSxLQUFLLFVBQVUsT0FBTyxLQUFLLENBQUM7QUFBQSxJQUNwRTtBQUFBLEVBQ0Y7QUFFQSxTQUFPO0FBQUEsSUFDTCxTQUFTLENBQUMsTUFBTSxDQUFDO0FBQUEsSUFDakIsUUFBUTtBQUFBLElBQ1IsUUFBUTtBQUFBLE1BQ04sTUFBTTtBQUFBLE1BQ04sWUFBWTtBQUFBLElBQ2Q7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLE9BQU87QUFBQSxRQUNMLEtBQUssS0FBSyxRQUFRLGtDQUFXLE9BQU87QUFBQSxNQUN0QztBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
