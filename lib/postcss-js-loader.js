module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(__dirname) {'use strict';
	
	var _loaderUtils = __webpack_require__(1);
	
	var _loaderUtils2 = _interopRequireDefault(_loaderUtils);
	
	var _postcss = __webpack_require__(2);
	
	var _postcss2 = _interopRequireDefault(_postcss);
	
	var _postcssJs = __webpack_require__(3);
	
	var _postcssJs2 = _interopRequireDefault(_postcssJs);
	
	var _NodeTemplatePlugin = __webpack_require__(4);
	
	var _NodeTemplatePlugin2 = _interopRequireDefault(_NodeTemplatePlugin);
	
	var _NodeTargetPlugin = __webpack_require__(5);
	
	var _NodeTargetPlugin2 = _interopRequireDefault(_NodeTargetPlugin);
	
	var _LibraryTemplatePlugin = __webpack_require__(6);
	
	var _LibraryTemplatePlugin2 = _interopRequireDefault(_LibraryTemplatePlugin);
	
	var _SingleEntryPlugin = __webpack_require__(7);
	
	var _SingleEntryPlugin2 = _interopRequireDefault(_SingleEntryPlugin);
	
	var _LimitChunkCountPlugin = __webpack_require__(8);
	
	var _LimitChunkCountPlugin2 = _interopRequireDefault(_LimitChunkCountPlugin);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	/*
	 * References:
	 * - PostCSS Loader: https://github.com/postcss/postcss-loader/blob/1ab50d/index.js
	 * - CSS-in-JS Loader: https://github.com/nthtran/css-in-js-loader/blob/934458/index.js
	 */
	
	var getRootCompilation = function getRootCompilation(loader) {
	  var compiler = loader._compiler;
	  var compilation = loader._compilation;
	  while (compiler.parentCompilation) {
	    compilation = compiler.parentCompilation;
	    compiler = compilation.compiler;
	  }
	
	  return compilation;
	};
	
	var produce = function produce(loader, request, processor, callback) {
	  var outputFilename = 'postcss-js-output-filename';
	  var outputOptions = { filename: outputFilename };
	  var childCompiler = getRootCompilation(loader).createChildCompiler('postcss-js-compiler', outputOptions);
	  childCompiler.apply(new _NodeTemplatePlugin2.default(outputOptions));
	  childCompiler.apply(new _LibraryTemplatePlugin2.default(null, 'commonjs2'));
	  childCompiler.apply(new _NodeTargetPlugin2.default());
	  childCompiler.apply(new _SingleEntryPlugin2.default(loader.context, '!!' + request));
	  childCompiler.apply(new _LimitChunkCountPlugin2.default({ maxChunks: 1 }));
	
	  var subCache = 'subcache ' + __dirname + ' ' + request;
	  childCompiler.plugin('compilation', function (compilation) {
	    if (compilation.cache) {
	      if (!compilation.cache[subCache]) {
	        compilation.cache[subCache] = {};
	      }
	
	      compilation.cache = compilation.cache[subCache];
	    }
	  });
	
	  // We set loaderContext[__dirname] = false to indicate we already in
	  // a child compiler so we don't spawn another child compilers from there.
	  childCompiler.plugin('this-compilation', function (compilation) {
	    compilation.plugin('normal-module-loader', function (loaderContext) {
	      loaderContext[__dirname] = false;
	    });
	  });
	
	  var source = null;
	  childCompiler.plugin('after-compile', function (compilation, callback) {
	    source = compilation.assets[outputFilename] && compilation.assets[outputFilename].source();
	
	    // Remove all chunk assets
	    compilation.chunks.forEach(function (chunk) {
	      chunk.files.forEach(function (file) {
	        delete compilation.assets[file];
	      });
	    });
	
	    callback();
	  });
	
	  childCompiler.runAsChild(function (error, entries, compilation) {
	    if (error) {
	      return callback(error);
	    }
	
	    if (compilation.errors.length > 0) {
	      return callback(compilation.errors[0]);
	    }
	
	    if (!source) {
	      return callback(new Error('Didn\'t get a result from child compiler'));
	    }
	
	    compilation.fileDependencies.forEach(function (dep) {
	      loader.addDependency(dep);
	    });
	
	    compilation.contextDependencies.forEach(function (dep) {
	      loader.addContextDependency(dep);
	    });
	
	    var module = null;
	    try {
	      module = loader.exec(source, request);
	      if (module.__esModule && module.default) {
	        module = module.default;
	      }
	    } catch (e) {
	      return callback(e);
	    }
	
	    if (!module) {
	      return callback();
	    }
	
	    processor(module).then(function (res) {
	      return callback(null, res.css);
	    }).catch(callback);
	
	    return void 0;
	  });
	};
	
	module.exports = function (content, map) {
	  if (this.cacheable) {
	    this.cacheable();
	  }
	
	  var file = this.resourcePath;
	  var query = _loaderUtils2.default.parseQuery(this.query);
	  var opts = {
	    parser: _postcssJs2.default,
	    from: file,
	    to: file,
	    map: {
	      inline: false,
	      annotation: false
	    }
	  };
	
	  if (typeof map === 'string') {
	    map = JSON.parse(map);
	  }
	
	  if (map && map.mappings) {
	    opts.map.prev = map;
	  }
	
	  var options = this.options.postcss;
	  if (typeof options === 'function') {
	    options = options.call(this, this);
	  }
	
	  var plugins = null;
	  if (typeof options === 'undefined') {
	    plugins = [];
	  } else if (Array.isArray(options)) {
	    plugins = options;
	  } else {
	    plugins = options.plugins || options.defaults;
	  }
	
	  if (query.pack) {
	    plugins = options[query.pack];
	    if (!plugins) {
	      throw new Error('PostCSS plugin pack is not defined in options');
	    }
	  }
	
	  var request = this.request.split('!').slice(this.loaderIndex + 1).join('!');
	
	  var processor = function processor(obj) {
	    return (0, _postcss2.default)(plugins).process(obj, opts);
	  };
	  produce(this, request, processor, this.async());
	};
	/* WEBPACK VAR INJECTION */}.call(exports, "/"))

/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("loaderUtils");

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = require("postcss");

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("postcssJs");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("NodeTemplatePlugin");

/***/ },
/* 5 */
/***/ function(module, exports) {

	module.exports = require("NodeTargetPlugin");

/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("LibraryTemplatePlugin");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("SingleEntryPlugin");

/***/ },
/* 8 */
/***/ function(module, exports) {

	module.exports = require("LimitChunkCountPlugin");

/***/ }
/******/ ]);
//# sourceMappingURL=postcss-js-loader.js.map