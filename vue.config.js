export default {
  title: 'Homie Dashboard',
  entry: './app/index.js',
  static: {
    from: './app/static'
  },
  dist: './dist-app',
  template: './app/index.html',
  notify: true,
  resolve: true,
  vendor: ['axios', 'chart.js', 'eva.js', 'eventemitter3', 'fast-json-patch', 'uuid', 'vue', 'vue-async-computed', 'vue-color', 'vue-grid-layout/dist/vue-grid-layout.min.js'],
  mergeConfig: {
    performance: {
      hints: false,
      assetFilter: function (assetFilename) {
        return assetFilename.endsWith('.js')
      }
    }
  }
}
