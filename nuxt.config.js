module.exports = {
  /*
   ** Headers of the page
   */
  head: {
    title: 'starter',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
   ** Global CSS
   */
  css: ['~assets/css/main.css', 'element-ui/lib/theme-default/index.css'],
  /*
   ** Add axios globally
   */
  build: {
    vendor: ['axios', 'element-ui', 'babel-polyfill'],
    babel: {
      plugins: ['transform-async-to-generator',
        'transform-runtime', ['component', [{
          libraryName: 'element-ui',
          styleLibraryName: 'theme-default'
        }]]
      ],
      presets: [
        ['es2015', { modules: false }],
        'stage-2'
      ]
    },
    loaders: [{
      test: /\.(png|jpg|gif|svg)$/,
      loader: 'url-loader',
      options: {
        limit: 10000,
        name: '[name].[ext]?[hash]'
      }
    }, {
      test: /\.css$/,
      loader: 'style-loader!css-loader'
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
      loader: 'url-loader',
      query: {
        limit: 1000, // 1 KO
        name: 'fonts/[name].[hash:7].[ext]'
      }
    }]
  },
  plugins: ['~plugins/axios', '~plugins/element']
}
