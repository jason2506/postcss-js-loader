/* eslint import/no-commonjs: [2, "allow-primitive-modules"] */

/*
 * References:
 * - PostCSS Loader: https://github.com/postcss/postcss-loader/blob/1ab50d/index.js
 * - CSS-in-JS Loader: https://github.com/nthtran/css-in-js-loader/blob/934458/index.js
 */

import loaderUtils from 'loader-utils'
import postcss from 'postcss'
import postcssJs from 'postcss-js'
import NodeTemplatePlugin from 'webpack/lib/node/NodeTemplatePlugin'
import NodeTargetPlugin from 'webpack/lib/node/NodeTargetPlugin'
import LibraryTemplatePlugin from 'webpack/lib/LibraryTemplatePlugin'
import SingleEntryPlugin from 'webpack/lib/SingleEntryPlugin'
import LimitChunkCountPlugin from 'webpack/lib/optimize/LimitChunkCountPlugin'

const getRootCompilation = loader => {
  let compiler = loader._compiler
  let compilation = loader._compilation
  while (compiler.parentCompilation) {
    compilation = compiler.parentCompilation
    compiler = compilation.compiler
  }

  return compilation
}

const produce = (loader, request, processor, callback) => {
  const outputFilename = 'postcss-js-output-filename'
  const outputOptions = { filename: outputFilename }
  const childCompiler = getRootCompilation(loader)
    .createChildCompiler('postcss-js-compiler', outputOptions)
  childCompiler.apply(new NodeTemplatePlugin(outputOptions))
  childCompiler.apply(new LibraryTemplatePlugin(null, 'commonjs2'))
  childCompiler.apply(new NodeTargetPlugin())
  childCompiler.apply(new SingleEntryPlugin(loader.context, `!!${request}`))
  childCompiler.apply(new LimitChunkCountPlugin({ maxChunks: 1 }))

  const subCache = `subcache ${__dirname} ${request}`
  childCompiler.plugin('compilation', compilation => {
    if (compilation.cache) {
      if (!compilation.cache[subCache]) {
        compilation.cache[subCache] = {}
      }

      compilation.cache = compilation.cache[subCache]
    }
  })

  // We set loaderContext[__dirname] = false to indicate we already in
  // a child compiler so we don't spawn another child compilers from there.
  childCompiler.plugin('this-compilation', compilation => {
    compilation.plugin('normal-module-loader', loaderContext => {
      loaderContext[__dirname] = false
    })
  })

  let source = null
  childCompiler.plugin('after-compile', (compilation, callback) => {
    source = compilation.assets[outputFilename] && compilation.assets[outputFilename].source()

    // Remove all chunk assets
    compilation.chunks.forEach(chunk => {
      chunk.files.forEach(file => {
        delete compilation.assets[file]
      })
    })

    callback()
  })

  childCompiler.runAsChild((error, entries, compilation) => {
    if (error) {
      return callback(error)
    }

    if (compilation.errors.length > 0) {
      return callback(compilation.errors[0])
    }

    if (!source) {
      return callback(new Error('Didn\'t get a result from child compiler'))
    }

    compilation.fileDependencies.forEach(dep => {
      loader.addDependency(dep)
    })

    compilation.contextDependencies.forEach(dep => {
      loader.addContextDependency(dep)
    })

    let module = null
    try {
      module = loader.exec(source, request)
      if (module.__esModule && module.default) {
        module = module.default
      }
    } catch (e) {
      return callback(e)
    }

    if (!module) {
      return callback()
    }

    processor(module)
      .then(res => callback(null, res.css))
      .catch(callback)

    return void 0
  })
}

module.exports = function(content, map) {
  if (this.cacheable) {
    this.cacheable()
  }

  const file = this.resourcePath
  const query = loaderUtils.parseQuery(this.query)
  const opts = {
    parser: postcssJs,
    from: file,
    to: file,
    map: {
      inline: false,
      annotation: false,
    },
  }

  if (typeof map === 'string') {
    map = JSON.parse(map)
  }

  if (map && map.mappings) {
    opts.map.prev = map
  }

  let options = this.options.postcss
  if (typeof options === 'function') {
    options = options.call(this, this)
  }

  let plugins = null
  if (typeof options === 'undefined') {
    plugins = []
  } else if (Array.isArray(options)) {
    plugins = options
  } else {
    plugins = options.plugins || options.defaults
  }

  if (query.pack) {
    plugins = options[query.pack]
    if (!plugins) {
      throw new Error('PostCSS plugin pack is not defined in options')
    }
  }

  const request = this.request
    .split('!')
    .slice(this.loaderIndex + 1)
    .join('!')

  const processor = obj => postcss(plugins).process(obj, opts)
  produce(this, request, processor, this.async())
}
