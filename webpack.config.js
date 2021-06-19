const webpack = require('webpack');
const paths = require('./paths');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const SpriteSmithWebpackPlugin = require('./etc/webpack/plugins/spritesmith-webpack-plugin');
const DirWatchWebpackPlugin = require('./etc/webpack/plugins/dir-watch-webpack-plugin');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  mode: 'none',

  entry: {
    app: paths.indexJs,
  },

  devServer: isDev ? {
    contentBase: paths.public,
    watchContentBase: true,
    inline: true,
    open: true,
    historyApiFallback: true,
    host: '0.0.0.0',
  } : undefined,

  output: {
    path: paths.build,
    filename: '[name].[hash].js',
    chunkFilename: '[name].[hash].js',
    library: '[name]',
    publicPath: isDev ? '/' : undefined,
  },

  watch: isDev,

  devtool: isDev ? 'cheap-module-eval-source-map' : false,

  resolve: {
    extensions: [ '.js', '.jsx' ],
    alias: {
      resources: paths.resources,
    },
    modules: [
      'src',
      'node_modules',
    ],
  },

  plugins: [
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
    }),
    isDev ? null : new CleanWebpackPlugin([ paths.build ]),
    new HtmlWebpackPlugin({
      inject: true,
      template: paths.indexHtml,
    }),
    isDev ? null : new MiniCssExtractPlugin({
      filename: '[name].[hash].css',
    }),
    isDev ? null : new UglifyJsPlugin(),
    isDev ? null : new CopyWebpackPlugin([
      {
        from: paths.public,
        to: paths.build,
        ignore: [ paths.indexHtml, paths.graphicResources ],
      },
    ]),
    new SpriteSmithWebpackPlugin({
      input: {
        path: paths.graphicResources,
        pattern: '**/*.png',
      },
      output: {
        path: paths.build,
        spriteFilename: 'resources/textureAtlas.png',
        sourceMapFilename: 'resources/textureAtlasMap.json',
      },
      padding: 2,
    }),
    isDev ? new DirWatchWebpackPlugin({
      path: paths.resources,
    }) : null,
  ].filter(Boolean),

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
          },
        ],
      },
    ],
  },
};
