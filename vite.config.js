import { defineConfig, loadEnv } from 'vite';
import { createVuePlugin } from 'vite-plugin-vue2';
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons';
import path, { resolve } from 'path';
import { copyFileSync, existsSync, mkdirSync } from 'fs';
import { execSync } from 'child_process';
import { createHtmlPlugin } from 'vite-plugin-html';

// 获取Git信息
function getGitInfo() {
  try {
    // 清理Git信息，移除可能导致URI问题的特殊字符
    const cleanString = (str) => {
      if (!str) {
        return 'unknown';
      }
      // 移除可能导致URI问题的字符，保留基本字符
      return str
        .replace(/[^\w\s\-_.]/g, '')
        .trim()
        .substring(0, 50); // 限制长度
    };

    return {
      branch: cleanString(
        execSync('git rev-parse --abbrev-ref HEAD', {
          encoding: 'utf-8',
        }).trim(),
      ),
      commit: cleanString(
        execSync('git rev-parse HEAD', { encoding: 'utf-8' }).trim(),
      ),
      time: cleanString(
        execSync('git log -1 --format=%ci', { encoding: 'utf-8' }).trim(),
      ),
    };
  } catch (e) {
    return {
      branch: 'unknown',
      commit: 'unknown',
      time: 'unknown',
    };
  }
}

// 获取环境变量，兼容VUE_APP_前缀
function getEnvVariables(env) {
  const envVars = {};
  // 将VITE_前缀的变量映射到VUE_APP_前缀（为了兼容现有代码）
  Object.keys(env).forEach((key) => {
    if (key.startsWith('VITE_')) {
      const vueKey = key.replace(/^VITE_/, 'VUE_APP_');
      envVars[vueKey] = env[key];
    }
    // 也保留VUE_APP_前缀的变量（如果直接使用）
    if (key.startsWith('VUE_APP_')) {
      envVars[key] = env[key];
    }
  });
  return envVars;
}

// 获取环境特定的代理配置
function getEnvDevServer(env) {
  const proxyTarget = env.VUE_APP_PROXY_TARGET || env.VITE_APP_PROXY_TARGET;
  // 如果target为空或无效，不配置代理
  if (!proxyTarget || proxyTarget.trim() === '') {
    return {};
  }

  if (env.VUE_APP_DIST === 'EBSCN') {
    return {
      '/autodoc': {
        target: proxyTarget,
        changeOrigin: true,
      },
      '/calliper': {
        target: proxyTarget,
        changeOrigin: true,
      },
      '/grater': {
        target: proxyTarget,
        changeOrigin: true,
      },
    };
  }
  return {};
}

// 获取需要复制的额外文件
function getExtraFiles(env) {
  const files = [];
  if (env.VUE_APP_DIST === 'EBSCN') {
    const pdfJsPath =
      './node_modules/@paoding-label/front_calliper/module-dist/static/pdf.js';
    if (existsSync(pdfJsPath)) {
      files.push({
        src: pdfJsPath,
        dest: 'static/pdf.js',
      });
    }
  }
  return files;
}

export default defineConfig(({ mode }) => {
  // 加载环境变量
  // Vite 默认只暴露 VITE_ 开头的变量，但项目使用 VUE_APP_ 前缀（Vue CLI 约定）
  // 使用空字符串前缀会加载所有环境变量，包括 VUE_APP_ 前缀的
  // 注意：这不是 Vite 的标准做法，但为了兼容现有代码需要这样做
  const env = loadEnv(mode, process.cwd(), '');

  // 处理环境变量适配器（如果存在）
  try {
    const { loadEnvVariable } = require('@paoding/vue-cli-env-adaptor');
    // 保存命令行环境变量
    const cliEnvVars = {
      VUE_APP_FAVICON: process.env.VUE_APP_FAVICON,
    };
    loadEnvVariable(process.cwd());
    // 恢复命令行环境变量（优先级更高）
    if (cliEnvVars.VUE_APP_FAVICON) {
      process.env.VUE_APP_FAVICON = cliEnvVars.VUE_APP_FAVICON;
      env.VUE_APP_FAVICON = cliEnvVars.VUE_APP_FAVICON;
    }
  } catch (e) {
    // 如果适配器不存在，忽略
  }

  // 合并环境变量
  const allEnv = { ...env, ...process.env };
  const envVars = getEnvVariables(allEnv);
  const gitInfo = getGitInfo();

  return {
    base: './',
    plugins: [
      createVuePlugin(),
      createSvgIconsPlugin({
        iconDirs: [path.resolve(process.cwd(), 'src/icons/svg')],
        symbolId: 'icon-[name]',
        // 完全禁用 SVGO 优化，确保所有属性（包括 fill 和 stroke）都被保留
        svgoOptions: false,
      }),
      createHtmlPlugin({
        minify: false,
        inject: {
          data: {
            env: allEnv.VUE_APP_DIST || allEnv.VITE_APP_DIST || '',
            git: gitInfo,
            favicon: allEnv.VUE_APP_FAVICON || 'favicon.ico',
            title:
              allEnv.VUE_APP_TITLE || allEnv.VITE_APP_TITLE || 'front_trident',
          },
        },
      }),
      // 自定义插件：复制额外文件
      {
        name: 'copy-extra-files',
        closeBundle() {
          const files = getExtraFiles(allEnv);
          files.forEach((file) => {
            const destPath = resolve(__dirname, 'dist', file.dest);
            const destDir = resolve(destPath, '..');
            if (!existsSync(destDir)) {
              mkdirSync(destDir, { recursive: true });
            }
            if (existsSync(file.src)) {
              copyFileSync(file.src, destPath);
            }
          });
        },
      },
    ],
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    define: {
      // 将环境变量注入到代码中，兼容VUE_APP_前缀
      ...Object.keys(envVars).reduce((acc, key) => {
        const value = envVars[key];
        // 只处理有效值，跳过 undefined 和 null
        if (value !== undefined && value !== null) {
          acc[`process.env.${key}`] = JSON.stringify(value);
        }
        return acc;
      }, {}),
      'process.env.VUE_APP_DIST': JSON.stringify(
        allEnv.VUE_APP_DIST || allEnv.VITE_APP_DIST || '',
      ),
    },
    css: {
      preprocessorOptions: {
        scss: {
          // 使用现代 Sass API 并抑制弃用警告
          // 这些警告主要来自 Element UI 等第三方库，我们无法直接修复
          api: 'modern-compiler',
          silenceDeprecations: [
            'import', // @import 规则弃用
            'global-builtin', // 全局内置函数（如 mix()）弃用
            'slash-div', // 使用 / 进行除法运算弃用
            'function-units', // 函数单位参数弃用
          ],
        },
      },
    },
    server: {
      proxy: (() => {
        const proxyConfig = {
          ...getEnvDevServer(allEnv),
        };
        const apiTarget =
          allEnv.VUE_APP_PROXY_TARGET || allEnv.VITE_APP_PROXY_TARGET;
        // 只有当target有效时才配置代理
        if (apiTarget && apiTarget.trim() !== '') {
          proxyConfig['/api/v1'] = {
            target: apiTarget,
            changeOrigin: true,
          };
        }
        return proxyConfig;
      })(),
      host: true,
    },
    build: {
      outDir: 'dist',
      assetsDir: 'static',
      sourcemap: allEnv.VUE_APP_MINIMIZE === '0' ? true : false,
      minify: allEnv.VUE_APP_MINIMIZE === '0' ? false : 'terser',
      // 配置 terser 选项，移除 console.log
      terserOptions:
        allEnv.VUE_APP_MINIMIZE === '0'
          ? undefined
          : {
              compress: {
                drop_console: ['log', 'info', 'debug'],
              },
            },
      rollupOptions: {
        output: {
          manualChunks: {
            'element-ui': ['element-ui'],
            'vue-vendor': ['vue', 'vue-router', 'vuex'],
          },
        },
      },
    },
  };
});
