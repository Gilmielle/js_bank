// eslint-disable-next-line no-undef
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line no-undef
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// eslint-disable-next-line no-undef
module.exports = (env) => ({
  entry: {
    index: './src/index.js',
    'card-details': './src/card-details.js',
    atms: './src/atms.js',
    currency: './src/currency.js',
  },
  output: {
    filename: '[name].js',
    publicPath: '/',
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },
      {
        test: /\.(css|scss)$/i,
        use: [
          // Creates `style` nodes from JS strings
          env.production ? MiniCssExtractPlugin.loader : 'style-loader',
          // Translates CSS into CommonJS
          'css-loader',
          // Compiles Sass to CSS
          'sass-loader',
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|woff|woff2)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Банк Coin',
      filename: 'index.html',
      chunks: ['index'],
    }),
    new HtmlWebpackPlugin({
      title: 'Банк Coin | Просмотр счёта',
      filename: 'card-details.html',
      chunks: ['card-details'],
    }),
    new HtmlWebpackPlugin({
      title: 'Банк Coin | Банкоматы',
      filename: 'atms.html',
      chunks: ['atms'],
    }),
    new HtmlWebpackPlugin({
      title: 'Банк Coin | Валюта',
      filename: 'currency.html',
      chunks: ['currency'],
    }),
    new MiniCssExtractPlugin({
      filename: ({ chunk }) => `${chunk.name.replace("/js/", "/css/")}.css`,
    }),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
});
