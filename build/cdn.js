var fs = require('fs');
//腾讯云CDN上传对象
var COS = require('cos-nodejs-sdk-v5');
//阿里云CDN上传对象
var co = require('co');
var OSS = require('ali-oss');
var events = require("events");
var emitter = new events.EventEmitter();
/**
 * 实例化CDN对象
 * @param {Object} staticPath
 */
function CDN(config) {
	var defaultConfig = {
		AppId: '',
		SecretId: '',
		SecretKey: '',
		accessKeyId: '',
		accessKeySecret: '',
		Bucket: '',
		Region: '',
		staticPath: ''
	};
	//启动配置
	this.config = Object.assign(defaultConfig, config);
	this.AGENT_ALI = 'aliyun'; //阿里云标识
	this.AGENT_QQ = 'tercent'; //腾讯云标识
	var that = this;
	//绑定文件上传成功事件
	emitter.on("upload_success", function() {
		that.uploadSuccess.apply(that, arguments);
	});
	//文件上传失败回调
	emitter.on("upload_faile", function() {
		that.uploadError.apply(that, arguments);
	});
}
/**
 * 获取文件列表
 * @param {Object} filePath
 * @param {Object} fileList
 */
CDN.prototype.getFileList = function(filePath, fileList) {
	fileList = fileList || [];
	var files = fs.readdirSync(filePath);
	var that = this;
	files.forEach(function(fileName) {
		var curFilePath = filePath + '/' + fileName;
		var stat = fs.statSync(curFilePath);
		if(that.blcakArray(fileName)) {
			if(stat.isDirectory()) {
				that.getFileList(curFilePath, fileList);
			} else {
				fileList.push(curFilePath);
			}
		}

	});
	return fileList;
}
/**
 * 获取当前文件上传操作对象实例
 */
CDN.prototype.getInstance = function(agent) {
	var agentMap = {};
	//阿里云文件上传实例
	agentMap[this.AGENT_ALI] = function() {
		return new OSS({
			region: this.config.Region,
			accessKeyId: this.config.accessKeyId,
			accessKeySecret: this.config.accessKeySecret
		});
	}
	//腾讯云cos文件上传实例
	agentMap[this.AGENT_QQ] = function() {
		return new COS({
			AppId: this.config.AppId,
			SecretId: this.config.SecretId,
			SecretKey: this.config.SecretKey,
		});
	}
	if(!this.instance) {
		var instanceFactory = agentMap[agent];
		if(!instanceFactory) {
			throw exception("没有找到对应CDN运营商");
		}
		this.instance = instanceFactory.apply(this);
	}
	return this.instance;
}
/**
 * 获取文件上传方法
 * @param {Object} agent
 */
CDN.prototype.getUploader = function(agent) {
	var uploaderMap = {};
	uploaderMap[this.AGENT_ALI] = function(instance, fileName, filePath) {
		instance.useBucket(this.config.Bucket);
		co(function*() {
			var result = yield instance.put(fileName, filePath);
			emitter.emit('upload_success', filePath);
		}).catch(function(err) {
			console.dir(err);
			emitter.emit('upload_faile', filePath, err);
		});
	}
	//腾讯云上传方法
	uploaderMap[this.AGENT_QQ] = function(instance, fileName, filePath) {
		var params = {
			Bucket: this.config.Bucket,
			Region: this.config.Region,
			onProgress: function(progressData) {},
			Key: fileName,
			ContentLength: fs.statSync(filePath).size,
			Body: fs.createReadStream(filePath)
		};
		instance.putObject(params, function(err, data) {
			if(err) {
				emitter.emit('upload_faile', filePath, err);
			} else {
				emitter.emit('upload_success', filePath);
			}
		});
	}
	return uploaderMap[agent];

}
/**
 * 黑名单设置判断路径是否包含某个文件夹
 * @param {Object} folderName
 */
CDN.prototype.blcakArray = function(folderName) {
	var array = ['.git', '.svn'];
	for(var i = 0; i < array.length; i++) {
		if(folderName.indexOf(array[i]) != -1) {
			return false;
		}
	}
	return true;

}
/**
 * 获取文件相对路径
 * @param {Object} path
 */
CDN.prototype.getFileName = function(path) {
	if(!path) {
		return "";
	}
	return path.replace(this.config.staticPath + '/', '');
}
/**
 * 上传成功回调
 */
CDN.prototype.uploadSuccess = function(fileName) {
	this.showLog('success---' + fileName);
}
/**
 * 上传失败回调
 */
CDN.prototype.uploadError = function(fileName, error) {
	this.showLog('fail---' + fileName);
}
/**
 * 输出日志
 */
CDN.prototype.showLog = function(msg) {
	console.log(msg);
}
/**
 * 启动CDN上传
 * @param {Object} agent
 */
CDN.prototype.start = function(agent) {
	try {
		var fileList = this.getFileList(this.config.staticPath),
			uploadFun = this.getUploader(agent),
			instance = this.getInstance(agent);
		var that = this;
		fileList.forEach(function(filePath, index) {
			var fileName = that.getFileName(filePath);
			uploadFun.call(that, instance, fileName, filePath);
		});
	} catch(e) {
		console.dir(e);
	}

}
module.exports = CDN;