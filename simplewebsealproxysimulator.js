var httpProxy = require('http-proxy') , bhost="localhost", bport=8080

httpProxy.createServer(function (req, res, proxy) {
  req.headers['iv-user']='admin';
  proxy.proxyRequest(req, res, { host: 'localhost', port: bport });
}).listen(9009);
