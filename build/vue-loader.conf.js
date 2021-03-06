let utils = require('./utils'),
	ExtractTextPlugin = require('extract-text-webpack-plugin'),
	isProduction = utils.isProduction(); //判断是开发环境还是生产环境

/**
 * vue css加载器
 * @param {Object} options
 */
function cssLoaders(options) {
	options = options || {}
	var cssLoader = 'css' + (isProduction ? '?minimize' : '')
	// generate loader string to be used with extract text plugin
	function generateLoaders(loader) {
		var loaders = [cssLoader]
		if(loader) loaders.push(loader)
		var sourceLoader = loaders.map(function(loader) {
			var extraParamChar
			if(/\?/.test(loader)) {
				loader = loader.replace(/\?/, '-loader?')
				extraParamChar = '&'
			} else {
				loader = loader + '-loader'
				extraParamChar = '?'
			}
			return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
		})

		// Extract CSS when that option is specified
		// (which is the case during production build)
		if(options.extract) {
			return ExtractTextPlugin.extract({
				use: sourceLoader,
				fallback: 'vue-style-loader'
			})
		} else {
			return ['vue-style-loader'].concat(sourceLoader)
		}
	}
     
	// http://vuejs.github.io/vue-loader/en/configurations/extract-css.html
	return {
		css: generateLoaders(),
		postcss: generateLoaders(),
		less: generateLoaders('less'),
		sass: generateLoaders('sass?indentedSyntax'),
		scss: generateLoaders('sass'),
		stylus: generateLoaders('stylus'),
		styl: generateLoaders('stylus')
	}
}
module.exports = {
	loaders: cssLoaders({
		sourceMap: !isProduction, //开发环境关闭sourcemap开发环境开启
		extract: isProduction
	}),
	postcss: [
		require('autoprefixer')({
			browsers: ['last 2 versions']
		})
	]
}