#!/usr/bin/env node

var httpProxy = require('http-proxy') , bhost="localhost", bport=8080

var ivuser="admin";

httpProxy.createServer(function (req, res, proxy) {
  req.headers['iv-user']=ivuser;
  proxy.proxyRequest(req, res, { host: 'localhost', port: bport });
}).listen(9090);


require('net').createServer(function (socket) {
  console.log("connected");
  socket.on('data', function (data) {
	ivuser=data.toString().trim();
	console.log("changing ivuser to "+ivuser);
  });
}).listen(9091);
