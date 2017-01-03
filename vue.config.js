export default {
  title: 'Homie Dashboard',
  entry: './app/index.js',
  static: {
    from: './app/static'
  },
  dist: './dist-app',
  template: './app/index.html',
  resolve: true,
  vendor: ['axios', 'eva.js', 'eventemitter3', 'fast-json-patch', 'uuid', 'vue', 'vue-color']
}
