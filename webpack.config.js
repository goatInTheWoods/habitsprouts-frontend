const currentTask = process.env.npm_lifecycle_event;
const path = require('path');
const Dotenv = require('dotenv-webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fse = require('fs-extra');

/*
  Because I didn't bother making CSS part of our
  webpack workflow for this project I'm just
  manually copying our CSS file to the DIST folder.
*/
class RunAfterCompile {
  apply(compiler) {
    compiler.hooks.done.tap('Copy files', function () {
      fse.copySync('./app/main.css', './dist/main.css');

      /*
        If you needed to copy another file or folder
        such as your "images" folder, you could just
        call fse.copySync() as many times as you need
        to here to cover all of your files/folders.
      */
    });
  }
}

config = {
  mode: 'development',
  entry: './app/main.js',
  output: {
    publicPath: '/',
    path: path.resolve(__dirname, 'app'),
    filename: 'bundled.js',
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
              ['@babel/preset-env', { targets: { node: '12' } }],
            ],
            plugins: ['babel-plugin-inline-react-svg'],
          },
        },
      },
      {
        test: /\.(scss)$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: () => [require('autoprefixer')],
              },
            },
          },
          {
            loader: 'sass-loader',
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'app/'),
    },
  },
};

if (currentTask == 'webpackDev' || currentTask == 'dev') {
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
}

if (currentTask == 'webpackBuild') {
  config.plugins.push(
    new CleanWebpackPlugin(),
    new RunAfterCompile(),
    new Dotenv({
      systemvars: true, // Ensures that system environment variables are used
    })
  );
  config.mode = 'production';
  config.output = {
    publicPath: '/',
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js',
    chunkFilename: '[name].[chunkhash].js',
  };
}

module.exports = config;
