let webpack = require("webpack"),
	path = require("path"),
	entry = require("./entry"),
	utils = require("./utils"),
	vueLoaderConfig = require('./vue-loader.conf'),
	config = utils.config,
	htmlPluginList = utils.getHtmlPluginList(entry);

module.exports = {
	//模块 入口文件
	entry: (function(entryMap) {
		let moduleMap = entryMap.modules,
			moduleEntry = {};
		for(let key in moduleMap) {
			moduleEntry[key] = ['babel-polyfill', utils.getModulePath(moduleMap[key].entry)];
		}
		return moduleEntry;
	})(entry),
	output: {
		path: config.outPutPath, //文件输出目录
		filename: "[name].js", //输出的文件名称
		publicPath: utils.isProduction() ? config.build.publicPath : config.dev.publicPath //静态资源前缀路径
	},
	resolve: {
		extensions: ['.js', ".vue", '.json'], //这几种扩展名的文件引入时可以不写扩展名
		modules: [
			utils.resolve('src'),
			utils.resolve('node_modules')
		],
		//别名设置
		alias: {
			'src': utils.resolve('src'),
			'assets': utils.resolve('src/assets'),
		}
	},
	plugins: [...htmlPluginList],
	module: {
		rules: [...utils.styleLoaders(), {
				test: /\.(js|vue)$/,
				loader: 'eslint-loader',
				enforce: 'pre',
				include: [utils.resolve('src')],
				options: {
					formatter: require('eslint-friendly-formatter')
				}
			}, {
				test: /\.vue$/,
				loader: 'vue-loader',
				options: vueLoaderConfig
			}, {
				test: /\.js$/,
				loader: 'babel-loader',
				include: [utils.resolve('src')]
			},
			{
				test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: utils.assetsPath('img/[name].[hash:7].[ext]') //图片输出目录及名称
				}
			},
			{
				test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
				loader: 'url-loader',
				query: {
					limit: 10000,
					name: utils.assetsPath('fonts / [name].[hash: 7].[ext]')
				}
			}, {
				test: /\.html$/,
				loader: 'html-loader',
				options: {
					minimize: true
				}
			}
		]
	}
}