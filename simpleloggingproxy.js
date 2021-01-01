#!/usr/bin/env node 

var http = require('http');

http.createServer(onRequest).listen(3000);

function onRequest(client_req, client_res) {
  console.log('serve: ' + client_req.url);

  let body = [];
  client_req.on('error',e=>console.error(e)).on('data',d=>body.push(d)).on('end',()=>{
    body = Buffer.concat(body).toString();
    console.log("body",body);
    client_res.on('error', (err) => console.error(err));
  });

  var options = {
    hostname: 'localhost',
    //port: 8080,
    port: 80,
    path: client_req.url,
    method: client_req.method,
    headers: client_req.headers
  };

  var proxy = http.request(options, function (res) {
    client_res.writeHead(res.statusCode, res.headers)
    res.pipe(client_res, { end: true });
  });

  client_req.pipe(proxy, { end: true });
}

