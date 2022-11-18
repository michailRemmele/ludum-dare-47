const webpack = require('webpack');
const paths = require('./paths');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
  mode: 'none',

  entry: {
    app: paths.editorIndexJs,
  },

  output: {
    path: paths.buildEditor,
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'editorExtension',
  },

  devtool: false,

  resolve: {
    extensions: [ '.js', '.jsx' ],
    modules: [
      'editor',
      'src',
      'node_modules',
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    new CleanWebpackPlugin([ paths.buildEditor ]),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    new UglifyJsPlugin(),
  ],

  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(png|jp(e?)g)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: 'images/[hash]-[name].[ext]',
            },
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [ '@svgr/webpack' ],
      },
      {
        test: /\.css$/i,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
            options: {
              url: false,
            },
          },
        ],
      },
    ],
  },
};
