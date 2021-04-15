// https://github.com/shelljs/shelljs

process.env.NODE_ENV = 'production'

let ora = require('ora'),//
	path = require('path'),
	chalk = require('chalk'),//定制控制台输出样式
	shell = require('shelljs'),
	webpack = require('webpack'),
	utils = require('./utils'),
	config = utils.config,
	webpackConfig = require('./webpack.product');
/*var CDN = require('./cdn')*/
let spinner = ora('开始构建')
spinner.start()
//获取编译后静态资源目录地址
let assetsPath = path.join(config.outPutPath, config.assetsDirectory);
//清空输出文件夹
shell.rm('-rf', config.outPutPath);
shell.mkdir('-p', assetsPath)

webpack(webpackConfig, function(err, stats) {
	spinner.stop()
	if(err) throw err
	process.stdout.write(stats.toString({
		colors: true,
		modules: false,
		children: false,
		chunks: false,
		chunkModules: false
	}) + '\n\n')

	console.log(chalk.cyan('  构建完成.\n'));
	//判断是否启动cdn,启动cdn上传
	/*	if(config.build.cdn) {
			//阿里cdn
			var cdn = new CDN({
				accessKeyId: 'LTAIKBzY4RwSIaL4 ',
				accessKeySecret: '9NV3g6DfZEUZtYPR3x56l9z9yh3JLP',
				Bucket: 'riskman',
				Region: 'oss-cn-beijing',
				staticPath: config.build.assetsRoot
			});
			cdn.start(cdn.AGENT_ALI);
			//腾讯cdn
			var cdn = new CDN({
				AppId: '1251266627',
				SecretId: 'AKID54vbIw9ix1xkNpFOYYN5czCE4lLoFHFF',
				SecretKey: 'zqplbJqCOPE0c3MTPAmDTYR9g2CBya0I',
				Bucket: 'riskman',
				Region: 'cn-north',
				staticPath: config.build.assetsRoot
			});
			cdn.start(cdn.AGENT_QQ)
		}*/
});