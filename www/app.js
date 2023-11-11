const querystring = require('querystring');
const handleRoute = require('./src/route/route');

//处理post数据
const getPostData = (req) => {
    const promise = new Promise((resolve, reject) => {
        if (req.method !== 'POST') {
            resolve({});
            return;
        }

        if (req.headers['content-type'] !== 'application/json') {
            resolve({});
            return;
        }

        let postData = '';

        req.on('data', (chunk) => {
            postData += chunk.toString();
        });

        req.on('end', () => {
            if (!postData) {
                resolve({});
                return;
            }
            // console.log("postData111:", postData);
            // console.log("postData222:", JSON.parse(postData));
            resolve(JSON.parse(postData));
        });
    });

    return promise;
}

const serverHander = (req, res) => {
    const url = req.url;
    req.path = url.split('?')[0];
    req.query = querystring.parse(url.split('?')[1]);

    //处理post数据 (异步的动作)
    getPostData(req).then((postData) => {
        req.body = postData;

        //路由相关的接口
        const routeData = handleRoute(req, res);
        if (routeData == gJustSpace) {
            return;
        }
        if (routeData) {
            if (typeof routeData === "string") {
                //WEB客户端不需要转换JSON
                res.end(
                    routeData
                );
            }
            else {
                //终端客户端需要转换JSON
                res.end(
                    JSON.stringify(routeData)
                );
            }

            return;
        }

        //设置成纯文本的形式
        res.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        //返回404 Not Found响应
        res.write('404 Not Found');
        //结束响应
        res.end();
    })
}

module.exports = serverHander;
