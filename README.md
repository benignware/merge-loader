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

> The example assumes that `process.env.NODE_ENV` is set to `production`. This can be achieved with [cross-env](https://www.npmjs.com/package/cross-env) when issued as a shell command:
```cli
cross-env NODE_ENV=production webpack
```

## Options

| Param    | Type                             | Description                      |
| -------- | -------------------------------- | -------------------------------- |
| pattern  | <code>string&#x007C;array</code> | Provide one or more glob patterns to match files that should be merged in. See [glob](https://www.npmjs.com/package/glob) for more info.
| glob  | <code>object</code> | Options passed to [glob](https://www.npmjs.com/package/glob).
| merge  | <code>string</code> | Specify a module used for merging. Implementation should match signature `merge(src, ...dest)`. Defaults to `lodash.merge`: See [lodash.merge](https://www.npmjs.com/package/lodash.merge) for more info.
