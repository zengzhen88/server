var fs = require('fs'); 
var path = require("path");
const querystring = require('querystring');
const {
    SuccessModel
} = require("../model/responseModel");

global.gJustSpace = "justspace";
//这里先用全局变量保存在这里,后续保存到msql中
const gToken            = "123456789";
var gTimestamp          = 0;
var gPower              = 0;
var gBatteryLevel       = 0;
var gTemperature        = 0;
var gGateWayVer         = '';
var gBlemVer            = '';
var gHttpUrlArray = [];


/****************************************
 * HTML Starting 
 *
 ****************************************
 */
////登录界面
const btnLoginInfo = (request, respond, strings) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关配置 ";
    htmls += "</title>";
    htmls += "</head>";
    htmls +="<form>";
    htmls += "用户名  : <input type=\'text\' name=\'username\'/>";
    htmls += '密码    : <input type=\'password\' name=\'password\'/>';
    htmls += '<input type=\'submit\' name=\'btnLogin\' value=\'登录\'/>';
    htmls += '</form>'
    htmls += '<br>';
    htmls += '<p style=\'color:#FF0000;\'> ';
    htmls += strings;
    htmls += ' </p>';
    htmls += '</body></html>';
    return htmls;
    // return "";
}

const btnLoginHtml = (req, res) => {
    if (req.url === '/jz231') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/index.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        //显示登录界面成功与否
        if (req.query.username === 'admin'
            && req.query.password == '123456') {
            //显示功能界面
            var mHtml = __dirname + "/../../html/main.html";
            var html = fs.readFileSync(mHtml, 'utf8');
            res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
            res.write(html);
            return gJustSpace;
        }
        else {
            if (req.query.username != 'admin') {
                return btnLoginInfo(req, res, "用户名填写错误");
            }
            else if (req.query.password != '123456') {
                return btnLoginInfo(req, res, "密码填写错误");
            }
            else {
                return btnLoginInfo(req, res, "用户名/密码填写错误");
            }
        }
    }
}

////升级界面
const upgradationInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关升级配置 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "url  : <input type=\'text\' name=\'url\'/>";
        htmls += 'md5  : <input type=\'text\' name=\'md5\'/>';
        htmls += 'md5  : <input type=\'text\' name=\'flag\'/>';
        htmls += '<input type=\'submit\' name=\'upgradation\' value=\'升级程序\'/>';
        htmls += '</form>'
        htmls += '<br>';
    }
    htmls += '<p style=\'color:#FF0000;\'> ';
    htmls += isSok ? "成功:" : "失败:";
    htmls += strings;
    htmls += ' </p>';
    htmls += '</body></html>';
    return htmls;
}

const upgradation = (req, res) => {
    var array = [];
    var marray = {
        htype:"applicationUpdate",
        seq:123,
        url:req.query.url,
        md5:req.query.md5,
        flag:req.query.flag,
    }
    array.push(marray);

    return array;
}

const upgradationHtml = (req, res) => {
    if (req.url === '/upgradation.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/upgradation.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        //显示登录界面成功与否
        if (req.query.url.length == 0) {
            //没有填写url
            return upgradationInfo(req, res, "URL必须填写", 0);
        }
        else if (req.query.md5.length == 0) {
            //没有填写md5
            return upgradationInfo(req, res, "MD5必须填写", 0);
        }
        else if (req.query.flag.length == 0) {
            //没有填写flag
            return upgradationInfo(req, res, "FLAG必须填写", 0);
        }
        else {
            //参数都填写了
            return upgradation(req, res);
        }
    }
}

////设置http服务器信息
const httpurlInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关设置HTTP服务器 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'httpurl\' value=\'设置Web服务器\'/>';
        htmls += '</form>'
        htmls += '<br>';
    }
    htmls += '<p style=\'color:#FF0000;\'> ';
    htmls += isSok ? "成功:" : "失败:";
    htmls += strings;
    htmls += ' </p>';
    htmls += '</body></html>';
    return htmls;
}

const httpurl = (req, res) => {
    var marray = {
        htype:"setHttpServer",
        seq:123,
        ip:req.query.ip,
        port:req.query.port,
    }
    gHttpUrlArray.push(marray);

    console.log('setHttpServer>>>>>>>>>>>>>>>>>>>>>>>>>', gHttpUrlArray);

    return gHttpUrlArray;
}

const httpurlHtml = (req, res) => {
    if (req.url === '/httpurl.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/httpurl.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        //显示登录界面成功与否
        if (req.query.ip.length == 0) {
            //没有填写ip
            return httpurlInfo(req, res, "IP必须填写", 0);
        }
        else if (req.query.port.length == 0) {
            //没有填写port
            return httpurlInfo(req, res, "PORT必须填写", 0);
        }
        else {
            //参数都填写了
            return httpurl(req, res);
        }
    }
}

/****************************************
 * HTML Endding
 *
 * **************************************
 */

const getList = () => {
    //从数据库里拿数据
    //先返回假数据

    return [
        {
            id:1,
            title:'标题1',
            content:'内容1',
            author:'zeng',
            createAt: 1610555518912,
        },
        {
            id:2,
            title:'标题2',
            content:'内容2',
            author:'lisi',
            createAt: 1610555518914,
        },
    ]
}

const getDetail = (id) => {
    //返回假数据 
    return [ 
        {
            id:2,
            title:'标题3',
            content:'内容3',
            author:'zhangsan',
            createAt: 1610555518919,
        },
    ]
}

const createNewRoute = (routeData) => {
    //reouteData保存的是一些信息

    return {
        id:1
    }
}

const updateRoute = (id, routeData = {}) => {
    console.log('id', id);
    console.log('routeData', routeData);

    return true;
}

//设备类型枚举
var DeviceID = {
    JMD211: 0,
    JSD201: 1,
}

var DeviceJMD211Type = {
    FirstPressure:1,//第一路压力
    FirstGateWay:2,//第一路门磁
    FirstSmokeSense:3,//第一路烟感
    FirstGas:4,//第一路燃气
    FirstWaterFlow:5,//第一路水流
    SecondPressure:6,//第二路压力
    SecondGateWay:7,//第二路门磁
    SecondSmokeSense:8,//第二路烟感
    SecondGas:9,//第二路燃气
    SecondWaterFlow:10,//第二路水流
    AntiDisassemblyDetection:11,//防拆检测
    SensorInsertionDetection:12,//传感器插入检测
    KeyStatus:12,//按键状态
    TerminalBatteryLevel:0xff,//终端电池电量
    SignalStrength:0xfe,//信号强度
    ConnectionStatus:0xfd,//连接状态
    Version:0xfc,//版本
}

var DeviceJSD201Type = {
    WearingStatus:1,//佩戴状态
    StepNumber:2,//步数
    ReminderType:3,//提醒类型
    TerminalTime:4,//终端时间
    MessageId:5,//消息ID
    MotorStatus:6,//马达状态
    KeyStatus:7,//按键状态
    TerminalBatteryLevel:0xff,//终端电池电量
    SignalStrength:0xfe,//信号强度
    ConnectionStatus:0xfd,//连接状态
    Version:0xfc,//版本
}

// deviceID           : { htype: 'adv_msg',
  // deviceID: 1,
  // deviceMac: 'DDFEF092715A',
  // time: 1,
  // type: 1,
  // valueRange: '',
  // data: [ [ 7669811, 0 ], [ 7669811, 0 ] ] }

const handleAdvMessage = (advMessage) => {
    const deviceID          = advMessage.deviceID;  //设备类型，手环、传感器等
    const deviceMac         = advMessage.deviceMac; //设备的mac地址
    const time              = advMessage.time;      //设备上报周期
    const type              = advMessage.type;      //设备上报的数据类型
    const valueRange        = advMessage.valueRange;//设备上报的数据的有效范围值
    const data              = advMessage.data;      //设备上报的数据的具体内容 

    //发送的数据可以再优化下，同一类型的同时发送
    // console.log('data:', data);

    switch (deviceID) {
        case DeviceID.JMD211:
            {
                //解析传感相应的参数,我这个服务器暂不关心
                break;
            }
        case DeviceID.JSD201:
            {
                //解析手环相关的参数，我这个服务器暂时不关心
                break;
            }
        default:break;
    }
}

const  handleRoute = (req, res) => {
    const method = req.method;
    const url = req.url;
    const path = req.path;//url.split('?')[0];

    console.log('method1', method);
    console.log('url', url);
    console.log('path', req.path);

    if (method === 'GET' && req.path === '/api/route/list') {
        // /api/route/list/?author=zeng&keyword=123

        const author = req.query.author || '';
        const keyword = req.query.keyword || '';
        //作者和密码对应关键字api/route/list
        const listData = getList(author, keyword);
        return new SuccessModel(listData);

        /*
         * return {
         *     message: '获取路由列表的接口'
         * }
         */
    }

    if (method === 'GET' && req.path === '/api/route/detail') {
        //192.168.0.117:5000/api/route/detail/?id=x
        const id = req.query.id;
        const detailData = getDetail(id);
        return new SuccessModel(detailData);
        /*
         * return {
         *     message: '获取路由详情的接口'
         * }
         */
    }

    if (method == 'POST' && req.path === '/api/route/update') {
        //192.168.0.117:5000/api/route/update
        //id +  data
        //将post数据通过 req.body传过来
        // console.log(req.body);
        const updateRoutes = updateRoute(id, req.body); 
        if (routeData) {
            return new SuccessModel("更新路由成功");
        }
        else {
            return new SuccessModel("更新路由失败");
        }
    }

    if (method == 'POST' && req.path === '/api/route/new') {
        //192.168.0.117:5000/api/route/new
        //id + data
        //新增路由
        const postData = req.body;
        const id = req.query.id;
        const routeData = createNewRoute(id, postData);
        return new SuccessModel(routeData);
    }

    if (method == 'GET' && req.path === '/jz231') {
        return btnLoginHtml(req, res);
    }
    else if (req.path == '/upgradation.html') {
        //显示升级程序
        return upgradationHtml(req, res);
        // var mHtml = __dirname + "/../../html/upgradation.html";
        // var html = fs.readFileSync(mHtml, 'utf8');
        // res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        // res.write(html);
        // res.end();
        // return gJustSpace;
    }
    else if (req.path == '/httpurl.html') {
        //显示设置Web服务器
        return httpurlHtml(req, res);
        // var mHtml = __dirname + "/../../html/httpurl.html";
        // var html = fs.readFileSync(mHtml, 'utf8');
        // res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        // res.write(html);
        // res.end();
        // return gJustSpace;
    }
    else if (req.path == '/synctime.html') {
        //显示同步系统时间
        var mHtml = __dirname + "/../../html/synctime.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/getbleminfo.html') {
        console.log("getbleminfo...");
        //显示获取蓝牙信息
        var mHtml = __dirname + "/../../html/getbleminfo.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/setbleminfo.html') {
        //显示修改蓝牙信息
        var mHtml = __dirname + "/../../html/setbleminfo.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/getscaninr.html') {
        //显示获取蓝牙扫描窗口时间
        var mHtml = __dirname + "/../../html/getscaninr.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/setscaninr.html') {
        //修改蓝牙扫描窗口时间
        var mHtml = __dirname + "/../../html/setscaninr.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/getwifi.html') {
        //显示获取无线网络信息
        var mHtml = __dirname + "/../../html/getwifi.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/setwifi.html') {
        //显示修改获取无线网络信息
        var mHtml = __dirname + "/../../html/setwifi.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/geteth.html') {
        //显示获取以太网网络信息
        var mHtml = __dirname + "/../../html/geteth.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/seteth.html') {
        //显示修改以太网网络信息
        var mHtml = __dirname + "/../../html/seteth.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/getauth.html') {
        //显示获取用户名信息
        var mHtml = __dirname + "/../../html/getauth.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/setauth.html') {
        //显示设置用户名信息
        var mHtml = __dirname + "/../../html/setauth.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/gethttpserver.html') {
        //显示获取服务器信息
        var mHtml = __dirname + "/../../html/gethttpserver.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/toterminal.html') {
        //显示配置蓝牙数据上报信息
        var mHtml = __dirname + "/../../html/toterminal.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/cleantoterminal.html') {
        //显示清除蓝牙数据上报信息
        var mHtml = __dirname + "/../../html/cleantoterminal.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/setupload.html') {
        //设置终端指定类型上报
        var mHtml = __dirname + "/../../html/setupload.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/setuploaddefault.html') {
        //显示设置终端默认上报
        var mHtml = __dirname + "/../../html/setuploaddefault.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/reporteddata.html') {
        //显示定时上报终端数据使能
        var mHtml = __dirname + "/../../html/reporteddata.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else if (req.path == '/otmdatainterval.html') {
        //显示设置第三方终端上报间隔
        var mHtml = __dirname + "/../../html/otmdatainterval.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }

    if (method == 'POST') {
        //192.168.0.117:5000
        console.log('req.body', req.body);
        console.log('req.headers', req.headers);

        var array = [];
        for (var index = 0; index < req.body.length; index++) {
            const msg = req.body[index];//获取数组每个成员
            const htype = msg.htype;//获取消息类型
            // const obj = JSON.parse(req.body);
            // console.log('array obj:', obj);
            if (htype === 'gatewayConn') {
                // console.log('get gatewayConn msg');
                var marray = {
                    htype:"gatewayConn",
                    ret: 0,
                    token:gToken,
                }

                console.log('marray:', marray);
                array.push(marray);
            }
            else if (htype === 'heartbeat') {
                console.log('get heartbeat msg');
                gTimestamp          = msg.timestamp;
                gPower              = msg.power;
                gBatteryLevel       = msg.batteryLevel;
                gTemperature        = msg.temperature;
                gGateWayVer         = msg.gatewayVer;
                gBlemVer            = msg.blemVer;

                console.log('timestamp     :', gTimestamp);
                console.log('power         :', gPower);
                console.log('batterylevel  :', gBatteryLevel);
                console.log('temperature   :', gTemperature);
                console.log('gatewayver    :', gGateWayVer);
                console.log('blemver       :', gBlemVer);
            }
            else if (htype == 'adv_msg') {
                handleAdvMessage(msg);
            }
        }

        console.log('return:', array);

        return array;
    }

    return new SuccessModel("404 Fatal");
}

module.exports = handleRoute;
