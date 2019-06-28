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
        test: /\.js/,
        use: [{
          loader: path.resolve('../index.js'),
          options: {
            baseStyleTarget: path.resolve('./src/index.js'),
            components: [{
              // is default
              lib: 'lib',
              // will inject to baseStyleTarget script
              baseStyle: 'lib/style/base',
              // will inject to component file
              style: 'less'
            }, {
              test: 'My',
              style: 'less'
            }]
          }
        }]
      },
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: [{
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
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
      'lib': path.resolve('./src/lib')
    }
  }
}
// 组件自动加载样式，组件按需加载
// component load 可以屏蔽底层依赖的配置，使用者只需要关心真正自己依赖的库
// 在 node module package 中的 json 文件中使用 'react-component-pack-loader': {'@byted/byteui'}
// treeshake 如果可用的话
