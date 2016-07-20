# PostCSS JS Loader for Webpack


## Installation

```bash
$ npm install --save-dev postcss-js-loader
```


## Usage

[Documentation: Using loaders](http://webpack.github.io/docs/using-loaders.html)

### Example Webpack Configuration

```javascript
export default {
  module: {
    loaders: [
      {
        test: /\.css\.js$/,
        loader: 'style!css!postcss-js',
      },
    ],
  },
}
```

### Integration with Babel Loader

```javascript
export default {
  module: {
    loaders: [
      {
        test: /\.css\.js$/,
        loader: 'style!css!postcss-js!babel',
      },
    ],
  },
}
```

### Integration with CSS Modules

```javascript
export default {
  module: {
    loaders: [
      {
        test: /\.css\.js$/,
        loader: 'style' +
          '!css?modules&importLoaders=1' +
          '!postcss-js'
      },
    ],
  },
}
```

### Integration with PostCSS Plugins

```javascript
import autoprefixer from 'autoprefixer'

export default {
  module: {
    loaders: [
      {
        test: /\.css\.js$/,
        loader: 'style!css!postcss-js',
      },
    ],
  },

  postcss: [autoprefixer],
}
```
