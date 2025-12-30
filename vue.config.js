const path = require('path');
const { GitRevisionPlugin } = require('git-revision-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { loadEnvVariable } = require('@paoding/vue-cli-env-adaptor');

// 解决 vue-cli-env-adaptor 读取 .env 文件时覆盖了命令行传入的环境变量的问题
// Save command-line environment variables before loading .env files
const cliEnvVars = {
  VUE_APP_FAVICON: process.env.VUE_APP_FAVICON,
};

loadEnvVariable(__dirname);

// Restore command-line environment variables (they should take precedence)
if (cliEnvVars.VUE_APP_FAVICON) {
  process.env.VUE_APP_FAVICON = cliEnvVars.VUE_APP_FAVICON;
}

const env = process.env.VUE_APP_DIST;

const gitRevisionPlugin = new GitRevisionPlugin();
function configGitRevision(args) {
  const options = args[0];
  options.title = process.env.VUE_APP_DOCUMENT_TITLE;
  options.env = env;
  options.git = {
    branch: gitRevisionPlugin.branch(),
    commit: gitRevisionPlugin.commithash(),
    time: gitRevisionPlugin.lastcommitdatetime(),
  };
  return args;
}

const needMinimize = process.env.VUE_APP_MINIMIZE !== '0';
function optimizationMiniSize(config) {
  if (process.env.NODE_ENV === 'production') {
    config.optimization.minimize(needMinimize);
  }
}

const getEnvDevServer = () => {
  if (env === 'EBSCN') {
    return {
      '/autodoc': {
        changeOrigin: true,
        target: `${process.env.VUE_APP_PROXY_TARGET}`,
        // target: 'http://localhost:8082/',
        // pathRewrite: { '/autodoc': '/' },
      },
      '/calliper': {
        changeOrigin: true,
        target: `${process.env.VUE_APP_PROXY_TARGET}`,
        // target: 'http://localhost:8081/',
        // pathRewrite: { '/calliper': '/' },
      },
      '/grater': {
        changeOrigin: true,
        target: `${process.env.VUE_APP_PROXY_TARGET}`,
        // target: 'http://localhost:8081/',
        // pathRewrite: { '/grater': '/' },
      },
    };
  }

  return {};
};

const getExtraFile = () => {
  const copyDirList = [];
  if (env === 'EBSCN') {
    copyDirList.push({
      from:
        './node_modules/@paoding-label/front_calliper/module-dist/static/pdf.js',
      to: path.posix.join('static', 'pdf.js'),
      toType: 'dir',
    });
  }
  return copyDirList;
};

module.exports = {
  publicPath: './',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    proxy: {
      ...getEnvDevServer(),
      '/api/v1': {
        target: process.env.VUE_APP_PROXY_TARGET,
        changeOrigin: true,
      },
    },
    disableHostCheck: true,
  },
  chainWebpack(config) {
    config.module
      .rule('svg')
      .exclude.add(path.join(__dirname, 'src/icons'))
      .end();
    config.module
      .rule('icons')
      .test(/\.svg$/)
      .include.add(path.join(__dirname, 'src/icons'))
      .end()
      .use('svg-sprite-loader')
      .loader('svg-sprite-loader')
      .options({
        symbolId: 'icon-[name]',
      });
    config.module
      .rule('svgo')
      .test(/\.svg$/)
      .include.add(path.join(__dirname, 'src/icons'))
      .end()
      .use('svgo-loader')
      .loader('svgo-loader')
      .before('icons')
      .options({
        plugins: [
          { removeTitle: true },
          { convertPathData: true },
          { removeUselessDefs: true },
        ],
      });
    config.plugin('html').tap(configGitRevision);

    optimizationMiniSize(config);
  },
  configureWebpack: {
    plugins: [new CopyWebpackPlugin(getExtraFile())],
  },
};
