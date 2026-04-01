const { defineConfig } = require('@vue/cli-service');
const { DefinePlugin } = require('webpack');

module.exports = defineConfig({
  transpileDependencies: ['vuetify'],
  lintOnSave: false,
  publicPath: "/",
  configureWebpack: {
    plugins: [
      new DefinePlugin({
        __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
        __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
      }),
    ],
  },
  devServer: {
    allowedHosts: 'all',
    proxy: {
      '/api': {
        target: 'https://mycentralapp.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
