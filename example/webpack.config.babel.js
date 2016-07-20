import autoprefixer from 'autoprefixer'

export default {
  devtool: 'source-map',

  entry: './entry.js',

  output: {
    path: __dirname,
    filename: 'bundle.js',
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /\.css\.js$/,
        loader: 'babel',
      },

      {
        test: /\.css\.js$/,
        loader: 'style' +
          '!css?modules&importLoaders=2' +
          '!postcss-js' +
          '!babel',
      },
    ],
  },

  postcss: [autoprefixer],
}
