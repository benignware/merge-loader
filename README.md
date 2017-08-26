# merge-loader

> A webpack loader to merge modules

## Installation

```cli
npm i merge-loader
```

## Usage

### Example

webpack.config.js

```js
const path = require('path');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'index.js'
  },
  module: {
    rules: [
      {
        test: /config.js$/,
        use: [
          {
            loader: 'merge-loader',
            options: {
              pattern: [
                `env/${process.env.NODE_ENV}/config.*`
              ]
            }
          }
        ]
      }
    ]
  }
};
```

The example assumes that `process.env.NODE_ENV` is set to `production`. This can be achieved by with [cross-env](https://www.npmjs.com/package/cross-env) when issued as shell command:
```cli
cross-env NODE_ENV=production webpack
```

src/config.js

```js
module.exports = {
  helloWorld: 'Hello World'
};
```

src/env/production/config.js

```js
module.exports = {
  environment: function() {
    return 'Production';
  }
};

```

src/index.js

```js
const { helloWorld, environment } = require('./config.js');
console.log(helloWorld); // Hello World
console.log(environment()); // Production
```

## Options

| Param    | Type                             | Description                      |
| -------- | -------------------------------- | -------------------------------- |
| pattern  | <code>string&#x007C;array</code> | Provide one or more glob patterns to match files that should be merged in. See [node-glob](https://github.com/isaacs/node-glob) for more info.
