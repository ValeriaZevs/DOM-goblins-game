const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const repositoryName = process.env.GITHUB_REPOSITORY
  ? process.env.GITHUB_REPOSITORY.split('/')[1]
  : '';

const publicPath = process.env.GITHUB_ACTIONS && repositoryName
  ? `/${repositoryName}/`
  : '/';

module.exports = {
  mode: 'production',
  entry: './src/index.js',

  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, 'dist'),
    clean: true,
    publicPath,
    assetModuleFilename: 'assets/[name][contenthash][ext][query]',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        type: 'asset/resource',
      },
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      filename: 'index.html',
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'),
    },
    compress: true,
    port: 9000,
    hot: true,
    open: true,
  },
};
