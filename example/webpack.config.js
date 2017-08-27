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
                `src/env/${process.env.NODE_ENV}/config.*`
              ]
            }
          }
        ]
      }
    ]
  }
};
