module.exports = {
  productionSourceMap: false,
  publicPath: '/opinionsuggestion/',
  devServer: {
    proxy: {
      '/api/': {
        target: 'https://www.mystery-vr.com',
        ws: true,
        changeOrigin: true,
      },
      '/wx-api/': {
        target: 'https://qyapi.weixin.qq.com',
        pathRewrite: { '^/wx-api': '/' },
        ws: true,
        changeOrigin: true,
      },
    },
  },
};
