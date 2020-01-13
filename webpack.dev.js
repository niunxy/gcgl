/*
 * @Descripttion: 
 * @version: 
 * @Author: sueRimn
 * @Date: 2019-11-09 16:11:33
 * @LastEditors: sueRimn
 * @LastEditTime: 2019-12-10 09:12:19
 */
const webpack = require('webpack')
const merge = require('webpack-merge')
const commomConfig = require('./webpack.common.js')
const devConfig = {
    mode: 'development',
    devtool: 'cheap-module-source-map',
    module: {
        rules: [
            {
                test: /\.less$/,
                use: ['style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                            // modules : true 
                        }
                    }, 
                     'resolve-url-loader', // 
                    'postcss-loader', // postcss-loader 是处理 css 的不能在 less-loader 之前使用
                    {
                        loader: "less-loader",
                        options: {
                          javascriptEnabled: true
                        }
                      },
                   
                   
                ]
            },
            {
                test: /\.css$/,
                use: ['style-loader',
                    {
                        loader: 'css-loader', 
                    },
                    'resolve-url-loader',
                    'postcss-loader',
                                      
                ]
            },
           
        ]
    },
    devServer: {
        contentBase: './public',
        open: true,
        hot: true, // 让 devServer 开启 HMR 功能
        hotOnly: false, // true 表示即使 HMR 功能未生效浏览器也不自动刷新
        progress : true, // 显示打包进度条

        // 用自己的 ip 访问 devServer 启动的服务
        useLocalIp: true, 
        host : '0.0.0.0',
        proxy: {
			'/geoserver': {
				target: 'http://192.168.141.103:8083/', 
                secure: false,
            },
            '/cfApi': {
				target: 'http://192.168.140.209:22222/',
				pathRewrite: {
					'^/cfApi': ''
				}
            },
            '/arcgis': {
				target: 'http://192.168.5.124:6080/',
				pathRewrite: {
					'^/arcgis': ''
				}
            },
            /* '/api':{
                //target:'http://192.168.7.194:8081/',
                target:'http://192.168.7.86:8081/',
                changeOrigin: true,
                pathRewrite: {
					'^/api': ''
				}
            } */
		}
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ],
    output: {
        filename: 'static/js/[name].js', // 这里占位符 [name] 就是 entry 配置的 key 值
        chunkFilename: 'static/js/[name].chunk.js',
        sourcePrefix: ''
    }
}

module.exports = merge(commomConfig, devConfig)