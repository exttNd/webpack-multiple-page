let webpack = require("webpack"),
	path = require("path"),
	baseWebpackConfig = require("./webpack.base"), //webpack基础配置
	utils = require("./utils"), //配置文件
	entry = require("./entry"),
	merge = require("webpack-merge"), //webpack配置合并插件
	FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin');
//合并导出webpack基础配置和开发环境配置
module.exports = merge(baseWebpackConfig, {
	devtool: '#cheap-module-eval-source-map', //sourcemap 策略(总共有七种策略)
	stats: "errors-only",
	plugins: [
		//全局变量设置标识是否是开发环境
		new webpack.DefinePlugin({
			isDev: true
		}),
		new webpack.HotModuleReplacementPlugin(), //webpack 模块热更新插件
		new webpack.NoEmitOnErrorsPlugin(), //webpack 编译过程中发生错误后，不会退出
		new FriendlyErrorsPlugin() //发生错误时友好的提示错误信息
	]
});