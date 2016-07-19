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
    'loader-utils': 'loaderUtils',
    'postcss': 'postcss',
    'postcss-js': 'postcssJs',
    'webpack/lib/node/NodeTemplatePlugin': 'NodeTemplatePlugin',
    'webpack/lib/node/NodeTargetPlugin': 'NodeTargetPlugin',
    'webpack/lib/LibraryTemplatePlugin': 'LibraryTemplatePlugin',
    'webpack/lib/SingleEntryPlugin': 'SingleEntryPlugin',
    'webpack/lib/optimize/LimitChunkCountPlugin': 'LimitChunkCountPlugin',
  },
}
