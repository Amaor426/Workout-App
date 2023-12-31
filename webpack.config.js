const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './client/src/index.js',
  mode: 'production',
  output: {
    path: path.resolve(__dirname, 'client/public/build'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'client/public/index.html',
      filename: 'index.html',
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'client/public/index.html'),
    port: 8080,
    proxy: {
        '/api': {
          target: 'http://localhost:3000/',
          secure: false,
        },
      },
  },
  resolve: {
    extensions: ['.js', '.jsx', '.scss'],
  },
};
