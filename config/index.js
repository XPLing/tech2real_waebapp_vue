// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

module.exports = {
  build: {
    env: process.env.NODE_ENV === 'production_testing'
      ? require('./testing.env')
      : require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsRootTest: path.resolve(__dirname, '../testing'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],
    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: require('./dev.env'),
    port: 6060,
    autoOpenBrowser: true,
    assetsRoot: path.resolve(__dirname, '../output'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    apiproxy: 'http://localhost:8001', // http://localhost:8001
    apiproxyhost: 'localhost:8001',
    apiproxy_open: 'http://localhost:8080/open',
    proxyTable: {
      '/api': {
        target: 'https://open.dev.tech2real.com', //设置调用接口域名和端口号别忘了加http http://localhost:8001
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/' //这里理解成用‘/api’代替target里面的地址，组件中我们调接口时直接用/api代替
          // 比如我要调用'http://0.0:300/user/add'，直接写‘/api/user/add’即可 代理后地址栏显示/
        }
      },
      '/open': {
        target: 'https://open.dev.tech2real.com',
        changeOrigin: true,
        pathRewrite: {
          '^/open': '/'
        }
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
};
