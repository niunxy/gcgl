const merge = require('webpack-merge')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
    CleanWebpackPlugin
} = require('clean-webpack-plugin');
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const CopyWebpackPlugin = require('copy-webpack-plugin')
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const safePostCssParser = require('postcss-safe-parser');
const path = require('path')
const commomConfig = require('./webpack.common.js')
const prodConfig = {
    mode: 'production',
    devtool: 'cheap-module-eval-source-map',
    module: {
        rules: [{
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            importLoaders: 2,
                        }
                    },
                    'resolve-url-loader',
                    'postcss-loader',
                    {
                        loader: "less-loader",
                        options: {
                            javascriptEnabled: true
                        }
                    },
                    // 'less-loader', 

                ]
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                    },
                    'resolve-url-loader',
                    'postcss-loader',
                ]
            }
        ]
    },
    optimization: {
        minimizer: [
            // This is only used in production mode
            new TerserPlugin({
                terserOptions: {
                    parse: {
                        ecma: 8,
                    },
                    compress: {
                        ecma: 5,
                        warnings: false,
                        comparisons: false,
                        inline: 2,
                    },
                    mangle: {
                        safari10: true,
                    },
                    output: {
                        ecma: 5,
                        comments: false,
                        ascii_only: true,
                    },
                },
                parallel: true,
                cache: true,
                sourceMap: false,
            }),
            new OptimizeCSSAssetsPlugin({
                cssProcessorOptions: {
                    parser: safePostCssParser,
                    // map:false,
                },
            }),
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 30000, // 模块大于30k会被抽离到公共模块
            minChunks: 1, // 模块出现1次就会被抽离到公共模块
            maxAsyncRequests: 5, // 异步模块，一次最多只能被加载5个
            maxInitialRequests: 3, // 入口模块最多只能加载3个
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                    // name: 'default'
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    // name: 'vendors'
                }
            }
        },
        runtimeChunk: {
            name: 'runtime'
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new MiniCssExtractPlugin({
            filename: 'style/[name].[contenthash].css',
            chunkFilename: 'style/[id].[contenthash].css'
        }),
        new ProgressBarPlugin({
            format: 'build [:bar] :percent (:elapsed seconds)',
            clear: false,
            width: 60
        }),
        new BundleAnalyzerPlugin(),
        new CopyWebpackPlugin([{
                from: './public/config.js',
                to: path.resolve(__dirname, 'dist'),
                toType: 'dir'
            },
            {
                from: './public/favicon.ico',
                to: path.resolve(__dirname, 'dist'),
                toType: 'dir'
            }, 
            // {
            //     from: './public/libs',
            //     to: path.resolve(__dirname, 'dist/libs'),
            //     toType: 'dir'
            // }
        ])
    ],
    output: {
        filename: 'static/js/[name].[contenthash].js',
        // chunkFilename: 'static/js/[name].[contenthash].js',
        chunkFilename: 'static/js/[id].[contenthash].js'
    },
}

module.exports = merge(commomConfig, prodConfig)