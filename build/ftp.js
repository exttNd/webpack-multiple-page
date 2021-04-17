var Client = require("ftp");
/**
 * 上传构造对象
 * 具体配置详情请参照 node-ftp API
 * @param {Object} config
 */
function FTP(config) {
	var defaultConfig = {
		host: '',
		port: '21',
		user: '',
		password: '',
		connTimeout: '10000'
	};
	//设置配置文件
	this.config = Object.assign(defaultConfig, config);
}
/**
 * 链接到服务器
 * @param {Object} clent
 */
FTP.prototype.connect = function(client) {
	try {
		client.connect(this.config);
	} catch(e) {
		console.dir(e);
		//TODO handle the exception
	}
}
/**
 * 获取ftp 链接
 */
FTP.prototype.getClient = function() {

}
/**
 * 文件上传
 * @param {Object} path
 */
FTP.prototype.upload = function(path) {

}

/**
 * 
 */
FTP.prototype.download = function() {
	var client = this.getClient();
	client.on('ready', function() {
		client.list(function(err, list) {
			if(err) {
				throw err;
			};
			list.forEach(function(ele, index) {
				console.dir(ele);
			});
			client.end();
		});
	});
	this.connect(client);
}
/**
 * 
 */
FTP.prototype.getFileList = function() {

}
var ftp = new FTP({
	host: '123.207.147.146',
	user: 'jinhaibin',
	password: 'jinhaibin',
});
ftp.download();