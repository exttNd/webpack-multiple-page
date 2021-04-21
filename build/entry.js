module.exports = {
    template: "common/view/template.ejs", //生成页面的模板地址
    favicon: "http://www.ctyun.cn/favicon.ico", //favicon地址
    //模块列表
    modules: {
        "main": {
            title: "首页", //页面标题
            template: "", //模块生成页面时的模板,如果不指定将使用上面的模板
            entry: "index/index.js", //模块入口文件
            filename: "index.html", //页面输出地址
        },
        "login": {
            title: "登录",
            template: "login/index.html",
            entry: "login/index.js",
            filename: "login.html"
        }
    }
}