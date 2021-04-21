let path = require('path'),
	utils = require('./utils'),
	webpack = require('webpack'),
	config = utils.config,
	merge = require('webpack-merge'),
	baseWebpackConfig = require('./webpack.base'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'), //提取css做为单独的文件
	OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');

let webpackConfig = merge(baseWebpackConfig, {
	devtool: false, //禁用sourcemap
	output: {
		filename: utils.assetsPath('js/[name].[chunkhash].js'),
		chunkFilename: utils.assetsPath('js/[id].[chunkhash].js')
	},
	plugins: [
		//是否是开发环境
		new webpack.DefinePlugin({
			'isDev': false
		}),
		//js文件压缩插件
		new webpack.optimize.UglifyJsPlugin({
			compress: {
				warnings: false//不显示经过
			},
			sourceMap: false//是否生成sourceMap
		}),
		//将js中引入的css分离为单独的样式文件
		new ExtractTextPlugin({
			filename: utils.assetsPath('css/[name].[contenthash].css')
		}),
		//压缩css
		new OptimizeCSSPlugin(),
		//将node_modules中的文件抽离成公共的文件
            new webpack.optimize.CommonsChunkPlugin({
			name: 'vendor',
			minChunks: function(module, count) {
				// any required modules inside node_modules are extracted to vendor
				return(
					module.resource &&
					/\.js$/.test(module.resource) &&
					module.resource.indexOf(
						path.join(__dirname, '../node_modules')
					) === 0
				)
			}
		}),
		//抽离业务模块当中的公共文件
		new webpack.optimize.CommonsChunkPlugin({
			name: 'manifest',
			chunks: ['vendor']
		})
	]
})
module.exports = webpackConfig