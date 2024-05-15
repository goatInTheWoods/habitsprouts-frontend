const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const fse = require('fs-extra');

class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap('Copy files', () => {
      // Ensure the destination directory exists before copying
      fs.ensureDirSync('./dist/images');

      try {
        fs.copySync('./app/main.css', './dist/main.css');
        fs.copySync(
          './app/images/user.svg',
          './dist/images/user.svg'
        );
        console.log('Files copied successfully!');
      } catch (err) {
        console.error('Error copying files:', err);
      }
    });
  }
}

const isDevelopment = process.env.NODE_ENV !== 'production';

const config = {
  mode: isDevelopment ? 'development' : 'production',
  entry: './app/main.js',
  output: {
    publicPath: '/',
    path: isDevelopment
      ? path.resolve(__dirname, 'app')
      : path.resolve(__dirname, 'dist'),
    filename: isDevelopment ? 'bundled.js' : '[name].[chunkhash].js',
    chunkFilename: isDevelopment
      ? undefined
      : '[name].[chunkhash].js',
  },
  plugins: [
    new Dotenv({ systemvars: true }),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'app/index-template.html',
      alwaysWriteToDisk: true,
    }),
    new HtmlWebpackHarddiskPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-react',
              [
                '@babel/preset-env',
                {
                  targets: isDevelopment
                    ? { node: 'current' }
                    : 'defaults',
                },
              ],
            ],
            plugins: ['babel-plugin-inline-react-svg'],
          },
        },
      },
      {
        test: /\.(scss|css)$/,
        use: [
          isDevelopment
            ? 'style-loader'
            : MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [require('autoprefixer')],
              },
            },
          },
          'sass-loader',
        ],
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'app/'),
    },
  },
};

if (isDevelopment) {
  config.devtool = 'source-map';
  config.devServer = {
    port: 3000,
    static: {
      directory: path.join(__dirname, 'app'),
    },
    hot: true,
    liveReload: false,
    historyApiFallback: { index: 'index.html' },
  };
} else {
  config.plugins.push(
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new RunAfterCompile()
  );
}

module.exports = config;
