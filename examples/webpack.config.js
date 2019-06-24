const path = require('path')

module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }, {
          loader: path.resolve('../index.js'),
          options: {
            src: {
              style: 'aliasModule/style/index.css'
            },
            My1: {
              style: './style/index.css'
            }
          }
        }]
      },
      {
        test: /\.jpg|png/,
        use: ['file-loader']
      },
      {
        test: /\.css/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.less/,
        use: ['style-loader', 'css-loader', 'less-loader']
      }
    ]
  },
  resolve: {
    alias: {
      'aliasModule': path.resolve('./src/My')
    }
  }
}
