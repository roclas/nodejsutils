var __dirname="www";

var express = require('express'),
    app = express(),
    httpProxy = require('http-proxy');

app.use(express.bodyParser());
//app.listen(process.env.PORT || 9000);
app.listen(9000);

var proxy = new httpProxy.RoutingProxy();

app.get('/', function(req, res) {
    res.sendfile(__dirname + '/index.html');
});
app.get('/js/*', function(req, res) {
    res.sendfile(__dirname + req.url);
});
app.get('/css/*', function(req, res) {
    res.sendfile(__dirname + req.url);
});

app.all('/*', function(req, res) {
    //req.url = 'v1/public/yql?q=show%20tables&format=json&callback=';
    proxy.proxyRequest(req, res, {
        //host: 'query.yahooapis.com', //yahoo is just an example to verify its not the apis fault
        host: 'localhost', //yahoo is just an example to verify its not the apis fault
        port: 80
    });
	console.log(req);
	console.log(res);

});
