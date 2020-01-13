const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin");

const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const fs = require('fs')

const plugins = [
  new HtmlWebPackPlugin({
    title: '土地工程项目监督管理平台',
    chunksSortMode: "none",
    template: './public/template.html',
    hash: true,
    favicon: path.resolve(__dirname, 'public/favicon.ico'),
    minify: {
      removeComments: true,
      collapseWhitespace: true,
      removeRedundantAttributes: true,
      useShortDoctype: true,
      removeEmptyAttributes: true,
      removeStyleLinkTypeAttributes: true,
      keepClosingSlash: true,
      minifyJS: true,
      minifyCSS: true,
      minifyURLs: true
    },
  }),
        new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/Workers', to: 'Workers' }]),
        new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/ThirdParty', to: 'ThirdParty' }]),
        new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/Assets', to: 'Assets' }]),
        new CopyWebpackPlugin([{ from: 'node_modules/cesium/Build/Cesium/Widgets', to: 'Widgets' }]),
        new CopyWebpackPlugin([{ from: 'node_modules/cesiumvectortile/', to: 'cesiumvectortile' }]),
        new CopyWebpackPlugin([{ from: 'public/timeline/', to: 'timeline' }]),
        new webpack.DefinePlugin({
            // Define relative base path in cesium for loading assets
            CESIUM_BASE_URL: JSON.stringify('')
        }),
 /*  new CopyWebpackPlugin([ { from: path.join('node_modules/cesium/Source', '../Build/Cesium/Workers'), to: 'Workers' } ]),
    new CopyWebpackPlugin([ { from: path.join('node_modules/cesium/Source', 'Assets'), to: 'Assets' } ]),
    new CopyWebpackPlugin([ { from: path.join('node_modules/cesium/Source', 'Widgets'), to: 'Widgets' } ]),
    new webpack.DefinePlugin({
        // Define relative base path in cesium for loading assets
        CESIUM_BASE_URL: JSON.stringify('')
  }) */
];
const files = fs.readdirSync(path.resolve(__dirname, './public/dlls'))
files.forEach((file) => {
  if (/.*\.dll.js/.test(file)) {
    plugins.push(
      new AddAssetHtmlWebpackPlugin({
        filepath: path.resolve(__dirname, './public/dlls', file),
      }),
    )
  }
  if (/.*\.manifest.json/.test(file)) {
    plugins.push(
      new webpack.DllReferencePlugin({
        manifest: path.resolve(__dirname, './public/dlls', file)
      })
    )
  }
})
module.exports = {
  entry: {
    index: "./src/index.tsx"
  },

  module: {
    rules: [{
        test: /\.ts|x$/,
        exclude: /node_modules/, // 排除在外即不需要被 babel-loader 处理的文件
        loader: "ts-loader",
      },
      {
        test: /\.(jpe?g|png|gif|webp)$/,
        use: [{
          loader: "url-loader",
          options: {
            limit: 10 * 1024,
            name: 'static/images/[hash:6].[ext]',
            fallback: 'file-loader',
            /** 配置错误会有背景图片打包后找不到的问题 */
            publicPath: '/' 
          }
        }]
      },
      {
        test: /\.pdf$/,
        use: {
          loader: 'file-loader',
          options: {
            name: 'doc/[name].[ext]'
          }
        }
      },
      /* {
        test: /\.(wsv|ttf|otf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
        use: [{
          loader: "file-loader",
          options: {
            name: 'static/media/[name].[hash:7].[ext]',
          }
        }]
      }, */
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      }
    ]
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', 'json'],
    // mainFiles: ['index'],
    alias: {
      '@components': path.resolve(__dirname, './src/components'),
      '@config': path.resolve(__dirname, './src/config'),
      '@pages': path.resolve(__dirname, './src/pages'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@layouts': path.resolve(__dirname, './src/layouts'),
      '@api': path.resolve(__dirname, './src/api'),
      '@assets': path.resolve(__dirname, './src/assets'),
      '@css': path.resolve(__dirname, './src/css'),
      '@global': path.resolve(__dirname, './src/global'),
      '@stores': path.resolve(__dirname, './src/stores'),
      '@cesium': path.resolve(__dirname, 'node_modules/cesium/Source'),
      '@cesiumvectortile': path.resolve(__dirname, 'node_modules/cesiumvectortile/build')
    }
  },
  plugins: plugins,
  amd: {
      //允许Cesium兼容 webpack的require方式 
      toUrlUndefined: true
  }
}