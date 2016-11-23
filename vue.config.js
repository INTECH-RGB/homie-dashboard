var CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = {
  title: 'Homie Dashboard',
  entry: './app/index.js',
  dist: './dist-app',
  template: './app/index.html',
  resolve: true,
  mergeConfig: {
    plugins: [
      new CopyWebpackPlugin([{ from: 'app/assets/favicon.ico' }])
    ]
  }
}
