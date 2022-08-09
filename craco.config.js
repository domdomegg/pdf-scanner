const webpack = require('webpack');

module.exports = {
  webpack: {
    plugins: {
      add: [
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
        new webpack.ProvidePlugin({
          process: 'process/browser',
        }),
        new webpack.DefinePlugin({
          'process.browser': 'true'
        }),
      ]
    },
    configure: {
      module: {
        rules: [
          {
            enforce: 'post',
            test: /fontkit[/\\]index.js$/,
            use: [{
              loader: "transform-loader",
              options: {
                brfs: true,
              },
            }],
          },
          {
            enforce: 'post',
            test: /unicode-properties[/\\]index.js$/,
            use: [{
              loader: "transform-loader",
              options: {
                brfs: true,
              },
            }],
          },
          {
            enforce: 'post',
            test: /linebreak[/\\]src[/\\]linebreaker.js/,
            use: [{
              loader: "transform-loader",
              options: {
                brfs: true,
              },
            }],
          },
        ]
      },
      resolve: {
        fallback: {
          stream: require.resolve("stream-browserify"),
          path: require.resolve("path-browserify"),
          zlib: require.resolve("browserify-zlib"),
          buffer: require.resolve('buffer/'),
          util: require.resolve("util/"),
          assert: require.resolve("assert/"),
          fs: false,
          crypto: false,
        }
      }
    }
  }
}