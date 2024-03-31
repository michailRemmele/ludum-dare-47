const webpack = require('webpack');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: 'none',

  entry: {
    app: paths.indexJs,
  },

  devServer: isDev ? {
    hot: true,
    open: true,
    static: {
      directory: paths.public,
    },
  } : undefined,

  output: {
    path: paths.build,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    library: '[name]',
    publicPath: isDev ? '/' : undefined,
  },

  devtool: isDev ? 'eval' : false,

  resolve: {
    extensions: [ '.js', '.jsx' ],
    alias: {
      resources: paths.resources,
    },
    modules: [
      'node_modules',
      'src',
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
    isDev ? null : new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.indexHtml,
    }),
    isDev ? null : new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    isDev ? null : new CopyWebpackPlugin(
      {
        patterns: [
          {
            from: paths.public,
            globOptions: {
              ignore: [ paths.indexHtml, paths.graphicResources ],
            },
          },
        ],
      }),
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      openAnalyzer: false,
    }),
  ].filter(Boolean),

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
