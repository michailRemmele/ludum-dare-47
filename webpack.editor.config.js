const webpack = require('webpack');
const paths = require('./paths');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');

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

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM',
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

  optimization: {
    minimize: true,
    minimizer: [ new TerserPlugin() ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
  ],

  module: {
    rules: [
      {
        test: /\.js(x?)$/,
        exclude: /(node_modules)/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: [
                '@babel/preset-env',
                '@babel/preset-react',
              ],
            },
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
