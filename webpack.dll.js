
const path = require('path') 
const webpack = require('webpack')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const cesiumSource = 'node_modules/cesium/Source'
const cesiumWorkers = '../Build/Cesium/Workers'
module.exports = {
    mode : 'production',
    entry: {
        react : ['react', 'react-dom'],
        moment:['moment'],
        antd:['antd']
    },
    output: {
        filename : 'dlls/[name].dll.js',
        path: path.resolve(__dirname, './public'),
        library : '[name]'
    },
    plugins : [
        new webpack.DllPlugin({
            name : '[name]', 
            path : path.resolve(__dirname, './public/dlls/[name].manifest.json'), 
        }),
            new CopyWebpackPlugin(
            [{
                from: path.join(cesiumSource, cesiumWorkers),
                to: './Workers'
              },
              {
                from: path.join(cesiumSource, 'Assets'),
                to: './Assets'
              },
              {
                from: path.join(cesiumSource, 'Widgets'),
                to: './Widgets'
              },
              {
                from: path.join(cesiumSource, 'ThirdParty'),
                to: './ThirdParty'
              }
            ]
          ),
    ]
}