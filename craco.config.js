const webpack = require('webpack');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.DefinePlugin({
          'process.browser': 'true'
        })
      ]
    },
    configure: {
      module: {
        rules: [
          { enforce: 'post', test: /fontkit[/\\]index.js$/, loader: "transform-loader?brfs" },
          { enforce: 'post', test: /unicode-properties[/\\]index.js$/, loader: "transform-loader?brfs" },
          { enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, loader: "transform-loader?brfs" },
        ]
      },
    }
  }
}