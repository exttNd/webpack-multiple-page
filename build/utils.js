let path = require("path"),
    HtmlWebpackPlugin = require("html-webpack-plugin"), //html生成插件
    ExtractTextPlugin = require('extract-text-webpack-plugin');

//编译构建配置
let config = {
    outPutPath: path.join(__dirname, "..", "dist"), //编译后的文件输出目录
    assetsDirectory: "static", //静态资源输出文件夹
    dev: {
        port: 8090,
        publicPath: "",
        autoOpenBrowser: true,
        autoOpenBrowserPath: '/login.html' //自动打开的模块地址
    },
    build: {
        cdn: false,
        publicPath: ""
    }
}

/**
 * 获取模块地址
 * @param {Object} dir
 */
function getModulePath(dir) {
    return path.join(resolve('src'), dir);
}

/**
 * 获取上一层目录
 * @param {Object} dir
 */
function resolve(dir) {
    return path.join(__dirname, "..", dir);
}

/**
 * 获取编译后的静态资源目录
 */
function assetsPath(_path) {
    return path.join(config.assetsDirectory, _path);
}

/**
 * 编译时判断是否是开发环境
 */
function isProduction() {
    if (process.env.NODE_ENV && process.env.NODE_ENV === 'production') {
        return true;
    }
    return false;
}

/**
 * style 样式加载器
 */
function styleLoaders() {
    let isProduct = isProduction(),
        loaders = ['css', 'scss'];
    loaders.forEach(function (loaderName, index) {
        let loadersList = ['style-loader', 'css-loader'];
        if (loaderName != 'css') {
            loadersList.push((loaderName === 'scss' ? 'sass' : loaderName) + '-loader');
        }
        //开发环境启用sourcemap功能
        if (!isProduct) {
            loadersList.map(function (ele) {
                return ele + '?sourceMap';
            });
        }
        //添加postcss-loader
        loadersList.push({
            loader: 'postcss-loader',
            options: {
                config: {
                    path: path.join(__dirname, 'postcss.config.js')
                }
            }
        });
        //生产环境 将css抽离成单独的css文件
        if (isProduct) {
            loadersList.shift();
            loadersList = ExtractTextPlugin.extract({
                use: loadersList,
                fallback: "style-loader"
            })
        }
        loaders[index] = {
            test: new RegExp('\\.' + loaderName + '$'),
            loader: loadersList
        }
    });
    return loaders;
}

/**
 * 获取需要生成各个模块html页面的插件集合
 */
function getHtmlPluginList(entryMap) {
    let template = entryMap.template, //页面模板
        favicon = entryMap.favicon, //页面tab页小图标
        modules = entryMap.modules,
        htmlPluginArray = [], //模块列表
        isProduct = isProduction(); //判断是否是生产环境
    for (let moduleName in modules) {
        let module = modules[moduleName];
        let curTmp = module.template || template, //如果模块未声明模板则使用默认模板
            title = module.title || "",
            baseOption = {
                title: title, //页面标题
                template: getModulePath(curTmp), //页面模块
                filename: path.join(config.outPutPath, module.filename), //页面输出路径
                inject: true, //静态资源插入位置 取值:body head false
                /* favicon: favicon, */
                chunks: [moduleName]
            }
        //生产环境
        if (isProduct) {
            Object.assign(baseOption, {
                //对html页面进行压缩
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                chunksSortMode: 'dependency' //插入chunks时进行排序
            });
            delete  baseOption.chunks;
        }
        htmlPluginArray.push(new HtmlWebpackPlugin(baseOption));
    }
    return htmlPluginArray;
}

module.exports = {
    config,
    getModulePath,
    resolve,
    getHtmlPluginList,
    assetsPath,
    styleLoaders,
    isProduction
}