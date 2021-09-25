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
      resolve: {
        alias: {
          fs: 'pdfkit/js/virtual-fs.js'
        }
      },
      module: {    
        rules: [            
          { enforce: 'post', test: /fontkit[/\\]index.js$/, loader: "transform-loader?brfs" },
          { enforce: 'post', test: /unicode-properties[/\\]index.js$/, loader: "transform-loader?brfs" },
          { enforce: 'post', test: /linebreak[/\\]src[/\\]linebreaker.js/, loader: "transform-loader?brfs" },
          { test: /src[/\\]assets/, loader: 'arraybuffer-loader'},
          { test: /\.afm$/, loader: 'raw-loader'}
        ]
      },
    }
  }
}