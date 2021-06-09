const fs = require('fs');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const dist = process.env.NODE_ENV === 'development' ? '/src' : '/build';

const entry = glob.sync('src/*/index.+(j|t)s?(x)').reduce((map, entry) => {
  return {
    ...map,
    [entry.replace(/^src\//, '').replace(/\.(j|t)sx?$/, '')]: `./${entry}`
  };
}, {});

module.exports = {
  entry,
  mode: process.env.NODE_ENV || 'production',
  output: {
    path: __dirname + '/build',
    filename: '[name].js'
  },
  resolve: {
    alias: {
      '@': __dirname + '/src'
    }
  },
  devtool: 'source-map',
  optimization: {
    minimize: false
  },
  module: {
    rules: [
      {
        test: /\.(j|t)sx?$/,
        loader: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    ...Object.keys(entry).map((chunk) => {
      const filename = `.${dist}/${chunk}.html`;
      return new HtmlWebpackPlugin({
        filename,
        chunks: [chunk],
        ...(fs.existsSync(filename) ? {
          template: filename
        } : null)
      })
    })
  ]
}