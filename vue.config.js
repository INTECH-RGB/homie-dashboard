export default {
  title: 'Homie Dashboard',
  entry: './app/index.js',
  static: {
    from: './app/static'
  },
  dist: './dist-app',
  template: './app/index.html',
  resolve: true,
  vendor: ['vue', 'eva.js', 'eventemitter3', 'axios', 'uuid', 'cookie', 'fast-json-patch']
}
