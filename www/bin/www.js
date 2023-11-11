//创建服务器
const http = require('http');
const serverHander = require('../app');
const PORT = 5000;
const server = http.createServer(serverHander);

server.listen(PORT, () => {
    console.log('server running at port', PORT);
})
