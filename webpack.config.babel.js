import path from 'path'

const library = 'postcss-js-loader'
const srcPath = path.resolve(__dirname, 'src')
const libPath = path.resolve(__dirname, 'lib')

export default {
  target: 'node',

  devtool: 'source-map',

  context: srcPath,

  entry: 'index.js',

  resolve: {
    root: srcPath,
  },

  output: {
    library,
    libraryTarget: 'commonjs2',
    filename: `${library}.js`,
    path: libPath,
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        include: srcPath,
        loader: 'babel',
      },
    ],
  },

  externals: {
    'loader-utils': true,
    'postcss': true,
    'postcss-js': true,
    'webpack/lib/node/NodeTemplatePlugin': true,
    'webpack/lib/node/NodeTargetPlugin': true,
    'webpack/lib/LibraryTemplatePlugin': true,
    'webpack/lib/SingleEntryPlugin': true,
    'webpack/lib/optimize/LimitChunkCountPlugin': true,
  },
}
