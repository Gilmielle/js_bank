// eslint-disable-next-line no-undef
const HtmlWebpackPlugin = require('html-webpack-plugin');
// eslint-disable-next-line no-undef
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

// eslint-disable-next-line no-undef
module.exports = (env) => ({
  entry: './src/index.js',
  output: {
    filename: 'main.js',
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
        test: /\.scss$/i,
        use: [
          // Creates `style` nodes from JS strings
          env.prod ? MiniCssExtractPlugin.loader : 'style-loader',
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
    }),
    new HtmlWebpackPlugin({
      title: 'Банк Coin',
      filename: 'test.html',
    }),
    new MiniCssExtractPlugin(),
  ],
  devServer: {
    historyApiFallback: true,
    hot: true,
  },
});
