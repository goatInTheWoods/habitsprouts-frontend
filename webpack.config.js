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
      const sourcePath = './app/images/user.svg';
      const targetPath = './dist/images/user.svg';

      console.log('Creating directory: ./dist/images');
      fs.ensureDirSync('./dist/images');
      console.log('Directory ensured.');

      if (fs.existsSync(sourcePath)) {
        console.log('Source file exists.');
      } else {
        console.log('Source file does not exist.');
      }

      if (fs.existsSync(targetPath)) {
        console.log('Verification: File exists at target location.');
      } else {
        console.log(
          'Verification failed: File does not exist at target location.'
        );
      }

      try {
        fse.copySync('./app/main.css', './dist/main.css');

        console.log(
          `Attempting to copy ${sourcePath} to ${targetPath}`
        );
        fs.copySync(sourcePath, targetPath);
        console.log('File copied successfully!');
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
