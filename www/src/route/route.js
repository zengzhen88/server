var fs = require('fs'); 
var path = require("path");
const querystring = require('querystring');
const {
    SuccessModel
} = require("../model/responseModel");

global.gJustSpace = "justspace";
//这里先用全局变量保存在这里,后续保存到msql中
const gToken            = "123456789";
const gCommunityId      = "123456789";
var gTimestamp          = 0;
var gPower              = 0;
var gBatteryLevel       = 0;
var gTemperature        = 0;
var gGateWayVer         = '';
// var gBlemVer            = '';
var gNeedConfig         = 0;
var gArray              = [];


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
    if (req.url === '/gz231'
        || req.url === '/jgd215') {
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
        if ((req.url.split('?')[0] === '/jgd215')
            && (req.query.username === 'admin')
            && (req.query.password === '123456')) {
            //显示功能界面
            var mHtml = __dirname + "/../../html/jgd215main.html";
            var html = fs.readFileSync(mHtml, 'utf8');
            res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
            res.write(html);
            res.end();
            return gJustSpace;
        }
        else if ((req.url.split('?')[0] === '/gz231')
            && (req.query.username === 'admin')
            && (req.query.password === '654321')) {
            //显示功能界面
            var mHtml = __dirname + "/../../html/gz231main.html";
            var html = fs.readFileSync(mHtml, 'utf8');
            res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
            res.write(html);
            res.end();
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

////获取网关状态
const getGatewayBaseStatusInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关获取网关状态 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += '<input type=\'submit\' name=\'getGatewayBaseStatus\' value=\'获取网关状态\'/>';
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

const getGatewayBaseStatus = (req, res) => {
    var marray = {
        htype:"getGatewayBaseStatus",
        seq:123,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return getGatewayBaseStatusInfo(req, res, "获取网关状态", 1);
    // return gArray;
}

const getGatewayBaseStatusHtml = (req, res) => {
    if (req.url === '/getGatewayBaseStatus.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/getGatewayBaseStatus.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return getGatewayBaseStatus(req, res);
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
        port:parseInt(req.query.port),
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return httpurlInfo(req, res, "设置Web服务器", 1);
    // return gArray;
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

////同步系统时间
const synctimeInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关同步服务器时间 ";
    htmls += "</title>";
    htmls += "</head>";
    htmls += '<p style=\'color:#FF0000;\'> ';
    htmls += isSok ? "成功:" : "失败:";
    htmls += strings;
    htmls += ' </p>';
    htmls += '</body></html>';
    return htmls;
}

const synctimeHtml = (req, res) => {
    const currentTime = new Date();
    const timeJson = {
        year: currentTime.getFullYear(),
        month: currentTime.getMonth() + 1,
        day: currentTime.getDate(),
        hour: currentTime.getHours(),
        minute: currentTime.getMinutes(),
        second: currentTime.getSeconds(),
    };
    console.log("currentTime:", timeJson);
    console.log("currentTime:", currentTime.getTime());
    console.log(currentTime.getTimezoneOffset());
    console.log(currentTime.getTimezoneOffset()*60*1000);
    console.log(currentTime.getTimezoneOffset()*60*1000+8*60*60*1000);

    var marray = {
        htype:"synTime",
        seq:123,
        time:((parseInt(currentTime.getTime()/1000)) - (currentTime.getTimezoneOffset()*60)),
    }
    gArray.push(marray);
    gNeedConfig = 1;

    var timestring = "同步Web服务器系统时间:";
    timestring += String(currentTime.getFullYear());
    timestring += '年 ';
    timestring += String(currentTime.getMonth() + 1);
    timestring += '月 ';
    timestring += String(currentTime.getDate());
    timestring += '日 ';
    timestring += String(currentTime.getHours());
    timestring += ':';
    timestring += String(currentTime.getMinutes());
    timestring += ':';
    timestring += String(currentTime.getSeconds());
    return synctimeInfo(req, res, timestring, 1);
}

const startsynctimeHtml = (req, res) => {
    const currentTime = new Date();
    const timeJson = {
        year: currentTime.getFullYear(),
        month: currentTime.getMonth() + 1,
        day: currentTime.getDate(),
        hour: currentTime.getHours(),
        minute: currentTime.getMinutes(),
        second: currentTime.getSeconds(),
    };
    console.log("currentTime:", timeJson);
    console.log("currentTime:", currentTime.getTime());
    console.log(currentTime.getTimezoneOffset());
    console.log(currentTime.getTimezoneOffset()*60*1000);
    console.log(currentTime.getTimezoneOffset()*60*1000+8*60*60*1000);

    var marray = {
        htype:"startSyncTime",
        seq:123,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    var timestring = "同步Web服务器系统时间:";
    timestring += String(currentTime.getFullYear());
    timestring += '年 ';
    timestring += String(currentTime.getMonth() + 1);
    timestring += '月 ';
    timestring += String(currentTime.getDate());
    timestring += '日 ';
    timestring += String(currentTime.getHours());
    timestring += ':';
    timestring += String(currentTime.getMinutes());
    timestring += ':';
    timestring += String(currentTime.getSeconds());
    return synctimeInfo(req, res, timestring, 1);
}

////获取蓝牙信息
const getbleminfoInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关获取蓝牙信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'getbleminfo\' value=\'获取蓝牙信息\'/>';
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

const getbleminfo = (req, res) => {
    var marray = {
        htype:"getBlemInfo",
        seq:123,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return getbleminfoInfo(req, res, "获取蓝牙信息", 1);
    // return gArray;
}

const getbleminfoHtml = (req, res) => {
    if (req.url === '/getbleminfo.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/getbleminfo.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return getbleminfo(req, res);
    }
}

////设置蓝牙信息
const setbleminfoInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关设置蓝牙信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'setbleminfo\' value=\'设置蓝牙信息\'/>';
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

const setbleminfo = (req, res) => {
    var value = req.query.value;
    var marray = {
        htype:"setBlemInfo",
        seq:123,
        value:value,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return setbleminfoInfo(req, res, "设置蓝牙信息", 1);
    // return gArray;
}

const setbleminfoHtml = (req, res) => {
    if (req.url === '/setbleminfo.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/setbleminfo.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return setbleminfo(req, res);
    }
}

////获取蓝牙扫描窗口时间
const getscaninrInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关获取蓝牙扫描窗口时间 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'getscaninr\' value=\'获取蓝牙扫描窗口时间\'/>';
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

const getscaninr = (req, res) => {
    var marray = {
        htype:"getScaninr",
        seq:123,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return getscaninrInfo(req, res, "获取蓝牙扫描窗口时间", 1);
    // return gArray;
}

const getscaninrHtml = (req, res) => {
    if (req.url === '/getscaninr.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/getscaninr.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return getscaninr(req, res);
    }
}

////设置蓝牙扫描窗口时间
const setscaninrInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关设置蓝牙扫描窗口时间 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'setscaninr\' value=\'设置蓝牙扫描窗口时间\'/>';
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

const setscaninr = (req, res) => {
    var value = req.query.scaninrtime;
    console.log("value:", value);
    var marray = {
        htype:"setScaninr",
        seq:123,
        value:value,
    }
    console.log("array::", marray);
    gArray.push(marray);
    gNeedConfig = 1;

    return setscaninrInfo(req, res, "设置蓝牙扫描窗口时间", 1);
    // return gArray;
}

const setscaninrHtml = (req, res) => {
    if (req.url === '/setscaninr.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/setscaninr.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return setscaninr(req, res);
    }
}

////获取无线网络信息
const getwifiInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关获取无线网络信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'getwifi\' value=\'获取无线网络信息\'/>';
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

const getwificonfigInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关获取无线网络信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'getwificonfig\' value=\'获取无线网络信息\'/>';
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

const getwifi = (req, res) => {
    var marray = {
        htype:"getWiFi",
        seq:123,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return getwifiInfo(req, res, "获取无线网络信息", 1);
    // return gArray;
}

const getwificonfig = (req, res) => {
    var marray = {
        htype:"getWiFiConfig",
        seq:123,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return getwificonfigInfo(req, res, "获取无线网络信息", 1);
    // return gArray;
}

const getwifiHtml = (req, res) => {
    if (req.url === '/getwifi.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/getwifi.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return getwifi(req, res);
    }
}

const getwifiConfigHtml = (req, res) => {
    if (req.url === '/getwificonfig.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/getwificonfig.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return getwificonfig(req, res);
    }
}

////设置无线网络信息
const setwifiInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关设置无线网络信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'setwifi\' value=\'设置无线网络信息\'/>';
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

const setwifi = (req, res) => {
    var ssid    = req.query.ssid;
    var psk     = req.query.psk;
    var ip      = req.query.ip;
    var netmask = req.query.netmask;
    var gateway = req.query.gateway;
    var marray  = {
        htype:"setWiFi",
        seq:123,
        ssid:ssid,
        psk:psk,
        ip:ip,
        netmask:netmask,
        gateway:gateway,
    }
    // console.log('req.marray', marray);
    gArray.push(marray);
    gNeedConfig = 1;

    return setwifiInfo(req, res, "设置无线网络信息", 1);
    // return gArray;
}

const setwifiHtml = (req, res) => {
    if (req.url === '/setwifi.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/setwifi.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return setwifi(req, res);
    }
}

////获取以太网网络信息
const getethInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关获取以太网网络信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'geteth\' value=\'获取以太网网络信息\'/>';
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

const geteth = (req, res) => {
    var marray = {
        htype:"getETH",
        seq:123,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return getethInfo(req, res, "获取以太网网络信息", 1);
    // return gArray;
}

const getethHtml = (req, res) => {
    if (req.url === '/geteth.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/geteth.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return geteth(req, res);
    }
}

////设置以太网网络信息
const setethInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关设置以太网网络信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'seteth\' value=\'设置以太网网络信息\'/>';
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

const seteth = (req, res) => {
    var ip      = req.query.ip;
    var netmask = req.query.netmask;
    var gateway = req.query.gateway;
    var marray  = {
        htype:"setETH",
        seq:123,
        ip:ip,
        netmask:netmask,
        gateway:gateway,
    }
    // console.log('req.marray', marray);
    gArray.push(marray);
    gNeedConfig = 1;

    return setethInfo(req, res, "设置以太网网络信息", 1);
    // return gArray;
}

const setethHtml = (req, res) => {
    if (req.url === '/seteth.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/seteth.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return seteth(req, res);
    }
}

////获取用户名信息
const getauthInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关获取用户名信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'getauth\' value=\'获取用户名信息\'/>';
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

const getauth = (req, res) => {
    var marray = {
        htype:"getAuth",
        seq:123,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return getauthInfo(req, res, "获取用户名信息", 1);
    // return gArray;
}

const getauthHtml = (req, res) => {
    if (req.url === '/getauth.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/getauth.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return getauth(req, res);
    }
}

////设置用户名信息
const setauthInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关设置用户名信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'setauth\' value=\'设置用户名信息\'/>';
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

const setauth = (req, res) => {
    var ip      = req.query.ip;
    var username= req.query.username;
    var password= req.query.password;
    var marray  = {
        htype:"setAuth",
        seq:123,
        ip:ip,
        username:username,
        password:password,
    }
    // console.log('req.marray', marray);
    gArray.push(marray);
    gNeedConfig = 1;

    return setauthInfo(req, res, "设置用户名信息", 1);
    // return gArray;
}

const setauthHtml = (req, res) => {
    if (req.url === '/setauth.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/setauth.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return setauth(req, res);
    }
}

////获取服务器信息
const gethttpserverInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关获取服务器信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'gethttpserver\' value=\'获取服务器信息\'/>';
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

const gethttpserver = (req, res) => {
    var marray = {
        htype:"getHttpServer",
        seq:123,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return gethttpserverInfo(req, res, "获取服务器信息", 1);
    // return gArray;
}

const gethttpserverHtml = (req, res) => {
    if (req.url === '/gethttpserver.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/gethttpserver.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return gethttpserver(req, res);
    }
}

////设置服务器信息
const sethttpserverInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关设置服务器信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'sethttpserver\' value=\'设置服务器信息\'/>';
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

const sethttpserver = (req, res) => {
    var ip      = req.query.ip;
    var port    = req.query.port;
    var marray  = {
        htype:"setHttpServer",
        seq:123,
        ip:ip,
        port:parseInt(port),
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return sethttpserverInfo(req, res, "设置服务器信息", 1);
    // return gArray;
}

const sethttpserverHtml = (req, res) => {
    if (req.url === '/sethttpserver.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/sethttpserver.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return sethttpserver(req, res);
    }
}

////设置第三方终端上报间隔
const otmdataintervalInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关设置第三方终端上报间隔 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'otmdatainterval\' value=\'设置第三方终端上报间隔\'/>';
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

const otmdatainterval = (req, res) => {
    var ip      = req.query.ip;
    var interval= req.query.interval;
    var marray  = {
        htype:"otMdataInterval",
        seq:123,
        interval:parseInt(interval),
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return otmdataintervalInfo(req, res, "设置第三方终端上报间隔", 1);
    // return gArray;
}

const otmdataintervalHtml = (req, res) => {
    if (req.url === '/otmdatainterval.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/otmdatainterval.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return otmdatainterval(req, res);
    }
}

////显示定时上报终端数据使能
const reporteddataInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关定时上报终端数据使能 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'reporteddata\' value=\'定时上报终端数据使能\'/>';
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

const reporteddata = (req, res) => {
    var ip      = req.query.ip;
    var value   = req.query.value;
    var marray  = {
        htype:"reportedData",
        seq:123,
        value:value,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return reporteddataInfo(req, res, "定时上报终端数据使能", 1);
    // return gArray;
}

const reporteddataHtml = (req, res) => {
    if (req.url === '/reporteddata.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/reporteddata.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return reporteddata(req, res);
    }
}

////显示设置终端默认上报
const setuploaddefaultInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关设置终端默认上报 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'setuploaddefault\' value=\'设置终端默认上报\'/>';
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

const setuploaddefault = (req, res) => {
    var marray  = {
        htype:"setUploadDefault",
        seq:123,
        deviceID:parseInt(req.query.deviceID),
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return setuploaddefaultInfo(req, res, "设置终端默认上报", 1);
    // return gArray;
}

const setuploaddefaultHtml = (req, res) => {
    if (req.url === '/setuploaddefault.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/setuploaddefault.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return setuploaddefault(req, res);
    }
}

////显示设置终端指定类型上报
const setuploadInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关设置终端指定类型上报 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'setupload\' value=\'设置终端指定类型上报\'/>';
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

const setupload = (req, res) => {
    var marray  = {
        htype:"setUpload",
        seq:123,
        deviceID:parseInt(req.query.deviceID),
        deviceMac:(req.query.deviceMac),
        time:parseInt(req.query.time),
        type:parseInt(req.query.type),
        valueRange:req.query.valueRange,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return setuploadInfo(req, res, "设置终端指定类型上报", 1);
    // return gArray;
}

const setuploadHtml = (req, res) => {
    if (req.url === '/setupload.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/setupload.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return setupload(req, res);
    }
}

////显示清除蓝牙数据上报信息
const cleantoterminalInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关清除蓝牙数据上报信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'cleantoterminal\' value=\'清除蓝牙数据上报信息\'/>';
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

const cleantoterminal = (req, res) => {
    var marray  = {
        htype:"cleanToTerminal",
        seq:123,
        value:parseInt(req.query.priority),
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return cleantoterminalInfo(req, res, "清除蓝牙数据上报信息", 1);
    // return gArray;
}

const cleantoterminalHtml = (req, res) => {
    if (req.url === '/cleantoterminal.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/cleantoterminal.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return cleantoterminal(req, res);
    }
}

////显示配置蓝牙数据上报信息
const toterminalInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关配置蓝牙数据上报信息 ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'toterminal\' value=\'配置蓝牙数据上报信息\'/>';
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

const toterminal = (req, res) => {
    var marray  = {
        htype:"toTerminal",
        seq:123,
        deviceID:parseInt(req.query.deviceID),
        deviceMac:req.query.deviceMac,
        timeout:parseInt(req.query.timeout),
        priority:parseInt(req.query.priority),
        message:req.query.message,
    }
    gArray.push(marray);
    gNeedConfig = 1;

    return toterminalInfo(req, res, "配置蓝牙数据上报信息", 1);
    // return gArray;
}

const toterminalHtml = (req, res) => {
    if (req.url === '/toterminal.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/toterminal.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return toterminal(req, res);
    }
}

////显示配置社区ID
const setcommunityidInfo = (request, respond, strings, isSok) => {
    respond.setHeader("Content-Type", "text/html;charset=utf-8");
    var htmls = "<html>";
    htmls += "<head>";
    htmls += "<title>";
    htmls += " 网关配置社区ID ";
    htmls += "</title>";
    htmls += "</head>";
    if (!isSok) {
        htmls +="<form>";
        htmls += "ip   : <input type=\'text\' name=\'ip\'/>";
        htmls += 'port : <input type=\'text\' name=\'port\'/>';
        htmls += '<input type=\'submit\' name=\'setcommunityid\' value=\'配置蓝牙数据上报信息\'/>';
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

const setcommunityid = (req, res) => {
    var marray  = {
        htype:"setCommunityId",
        seq:123,
        value:req.query.communityId,
    }
    console.log('marray:', marray);
    gArray.push(marray);
    gNeedConfig = 1;

    return setcommunityidInfo(req, res, "配置社区ID", 1);
    // return gArray;
}

const setcommunityidHtml = (req, res) => {
    if (req.url === '/setcommunityid.html') {
        //显示登录页面
        var mHtml = __dirname + "/../../html/setcommunityid.html";
        var html = fs.readFileSync(mHtml, 'utf8');
        res.writeHead(200, "Content-Type", "text/html;charset=utf-8");
        res.write(html);
        res.end();
        return gJustSpace;
    }
    else {
        return setcommunityid(req, res);
    }
}

const tarsfertoclient = (array) => {
    if (gNeedConfig) {
        gNeedConfig = 0;
        console.log('send jgd215', gArray);
        for (var index = 0; index < gArray.length; index++) {
            array.push(gArray.pop());
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

    // console.log('method1');
    // console.log('method1', method);
    // console.log('url', url);
    // console.log('path', req.path);
    // console.log('header', req.headers);

    if (method === 'GET' && req.path === '/api/route/list') {
        req.query = querystring.parse(url.split('?')[1]);
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
        req.query = querystring.parse(url.split('?')[1]);
        //192.168.0.117:5000/api/route/detail/?id=x
        const id = req.query.id;
        const detailData = getDetail(id);
        return new SuccessModel(detailData);
    }

    if (method == 'POST' && req.path === '/api/route/update') {
        req.query = querystring.parse(url.split('?')[1]);
        //192.168.0.117:5000/api/route/update
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
        req.query = querystring.parse(url.split('?')[1]);
        const postData = req.body;
        const id = req.query.id;
        const routeData = createNewRoute(id, postData);
        return new SuccessModel(routeData);
    }

    if (method == 'GET' && 
        (req.path === '/gz231') || (req.path === '/jgd215')) {
        req.query = querystring.parse(url.split('?')[1]);
        // console.log('start login');
        return btnLoginHtml(req, res);
    }
    else if (req.path == '/upgradation.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示升级程序
        return upgradationHtml(req, res);
    }
    else if (req.path == '/synctime.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示同步系统时间
        return synctimeHtml(req, res);
    }
    else if (req.path == '/startsynctime.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示同步系统时间
        return startsynctimeHtml(req, res);
    }
    else if (req.path == '/getbleminfo.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示获取蓝牙信息
        return getbleminfoHtml(req, res);
    }
    else if (req.path == '/setbleminfo.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示修改蓝牙信息
        return setbleminfoHtml(req, res);
    }
    else if (req.path == '/getscaninr.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示获取蓝牙扫描窗口时间
        return getscaninrHtml(req, res);
    }
    else if (req.path == '/setscaninr.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //修改蓝牙扫描窗口时间
        return setscaninrHtml(req, res);
    }
    else if (req.path == '/getwifi.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示获取无线网络信息
        return getwifiHtml(req, res);
    }
    else if (req.path == '/getwificonfig.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示获取无线网络信息
        return getwifiConfigHtml(req, res);
    }
    else if (req.path == '/setwifi.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示修改获取无线网络信息
        return setwifiHtml(req, res);
    }
    else if (req.path == '/geteth.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示获取以太网网络信息
        return getethHtml(req, res);
    }
    else if (req.path == '/seteth.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示修改以太网网络信息
        return setethHtml(req, res);
    }
    else if (req.path == '/getauth.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示获取用户名信息
        return getauthHtml(req, res);
    }
    else if (req.path == '/setauth.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示设置用户名信息
        return setauthHtml(req, res);
    }
    else if (req.path == '/gethttpserver.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示获取服务器信息
        return gethttpserverHtml(req, res);
    }
    else if (req.path == '/httpurl.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示设置Web服务器
        return httpurlHtml(req, res);
    }
    else if (req.path == '/toterminal.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示配置蓝牙数据上报信息
        return toterminalHtml(req, res);
    }
    else if (req.path == '/cleantoterminal.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示清除蓝牙数据上报信息
        return cleantoterminalHtml(req, res);
    }
    else if (req.path == '/setupload.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //设置终端指定类型上报
        return setuploadHtml(req, res);
    }
    else if (req.path == '/setuploaddefault.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示设置终端默认上报
        return setuploaddefaultHtml(req, res);
    }
    else if (req.path == '/reporteddata.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示定时上报终端数据使能
        return reporteddataHtml(req, res);
    }
    else if (req.path == '/otmdatainterval.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示设置第三方终端上报间隔
        return otmdataintervalHtml(req, res);
    }
    else if (req.path == '/setcommunityid.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //显示设置社区ID
        return setcommunityidHtml(req, res);
    }
    else if (req.path == '/getGatewayBaseStatus.html') {
        req.query = querystring.parse(url.split('?')[1]);
        //获取网关状态
        return getGatewayBaseStatusHtml(req, res);
    }

    if (method == 'POST') {
        //192.168.0.117:5000

        var array = [];
        for (var index = 0; index < req.body.length; index++) {
            const msg = req.body[index];//获取数组每个成员
            const htype = msg.htype;//获取消息类型
            // const obj = JSON.parse(req.body);
            
            if (htype === 'gatewayConn') {
                // console.log('get gatewayConn msg');
                var marray = {
                    htype:"gatewayConn",
                    ret: 0,
                    token:gToken,
                }

                array.push(marray);
            }
            else if (htype === 'getCommunityId') {
                var marray = {
                    htype:"communityId",
                    seq:"123",
                    value:gCommunityId,//目前只支持一个，后续改成申请ID号
                }
                console.log('marray:', marray);
                
                array.push(marray);
            }
            else if (htype === 'heartbeat') {
                gTimestamp          = msg.timestamp;
                gPower              = msg.power;
                gBatteryLevel       = msg.batteryLevel;
                gTemperature        = msg.temperature;
                gGateWayVer         = msg.gatewayVer;
                // gBlemVer            = msg.blemVer;

                /*
                 * console.log('timestamp     :', gTimestamp);
                 * console.log('power         :', gPower);
                 * console.log('batterylevel  :', gBatteryLevel);
                 * console.log('temperature   :', gTemperature);
                 * console.log('gatewayver    :', gGateWayVer);
                 * console.log('blemver       :', gBlemVer);
                 */

                tarsfertoclient(array);
            }
            else if (htype === 'adv_msg') {
                handleAdvMessage(msg);
                tarsfertoclient(array);
            }
            else if (htype === 'getBlemInfo') {
                console.log("getbleminfo :", msg.value);
                console.log("aseq:", msg.aseq);
                
                tarsfertoclient(array);
            }
            else if (htype == 'setBlemInfo') {
                console.log('setBlemInfo :', msg.aseq);
            }
            else if (htype === 'getScaninr') {
                console.log("getscaninr value:", msg.value);
                tarsfertoclient(array);
            }
            else if (htype === 'getWiFi') {
                console.log("getWiFi ssid:", msg.ssid);
                console.log("getWiFi psk:", msg.psk);
                console.log("getWiFi address:", msg.address);
                console.log("getWiFi netmask:", msg.netmask);
                console.log("getWiFi gateway:", msg.gateway);
                tarsfertoclient(array);
            }
            else if (htype === 'getETH') {
                console.log("getETH address:", msg.address);
                console.log("getETH netmask:", msg.netmask);
                console.log("getETH gateway:", msg.gateway);
                tarsfertoclient(array);
            }
            else if (htype === 'getAuth') {
                console.log('getAuth username:', msg.username);
                console.log('getAuth password:', msg.password);
                tarsfertoclient(array);
            }
            else if (htype === 'getHttpServer') {
                console.log('getHttpServer ip:', msg.ip);
                console.log('getHttpServer port:', msg.port);
                tarsfertoclient(array);
            }
            else if (htype === 'startSyncTime') {
                console.log("startSyncTime starting...");
                tarsfertoclient(array);
            }
            else if (htype === 'reqSyncTime') {
                console.log("reqSyncTime starting...:", msg.originate_timestamp);
                const currentTime   = new Date();
                const gettime       = (currentTime.getTime()/1000) - (currentTime.getTimezoneOffset()*60);
                const tz            = currentTime.getTimezoneOffset() / 60;
                var marray = {
                    htype:"syncTime",
                    seq:123,
                    originate_timestamp:(msg.originate_timestamp),
                    time_zone:(tz),
                    receive_timestamp:parseInt(gettime),
                    transmit_timestamp:parseInt(gettime),
                }
                console.log('marray:', marray);
                
                array.push(marray);
            }
            else if (htype == 'getGatewayBaseStatus') {
                console.log("getGatewayBaseStatus starting....:",
                    msg.power, msg.batteryLevel, msg.temperature);
                gPower          = msg.power;
                gBatteryLevel   = msg.batteryLevel;
                gTemperature    = msg.temperature;
            }
            else if (htype == 'getWiFiConfig') {
                console.log("getWiFiConfig ssid:", msg.ssid);
                console.log("getWiFiConfig psk:", msg.psk);
                console.log("getWiFiConfig address:", msg.address);
                console.log("getWiFiConfig netmask:", msg.netmask);
                console.log("getWiFiConfig gateway:", msg.gateway);
                console.log("getWiFiConfig dns:", msg.dns);
                tarsfertoclient(array);
            }
            else if (htype === 'syncTime') {
                console.log("syncTime endding...:", msg.aseq);
                tarsfertoclient(array);
            }
            else if (htype === 'aseq') {
                tarsfertoclient(array);
            }
            else {
            }
        }

        return array;
    }

    return new SuccessModel("404 Fatal");
}

module.exports = handleRoute;
