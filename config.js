/**
 * 小程序配置文件
 */

// 此处主机域名是腾讯云解决方案分配的域名
// 小程序后台服务解决方案：https://www.qcloud.com/solution/la

var host = "***.***.cn"

var config = {

    // 下面的地址配合云端 Server 工作
    host,

    // 测试的请求地址，用于测试会话
    requestUrl: `https://${host}/api/v1/wxxcx`,

    //unionid
    reqUnionIdUrl: `https://${host}/api/v1/requnionid`,

    // 请求车型URL
    chexingUrl: `https://${host}/api/v1/chexing/info`,

    // 请求线索URL
    xiansuoUrl: `https://${host}/api/v1/wxxcx/giveMoney`,

    // 请求下线URL
    xiaxianUrl: `https://${host}/api/v1/user/`,

    // 请求推荐人URL
    tuijianrenUrl: `https://${host}/api/v1/user/`,

    // 请求海报URL
    haibaoUrl: `https://${host}/api/v1/wxxcx/getmyposter`,

};

module.exports = config
