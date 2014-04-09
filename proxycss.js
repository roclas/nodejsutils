var http = require('http'), httpProxy = require('http-proxy');
var connect = require('connect');
var fs = require('fs');

var record_dir="www";

httpProxy.createServer(function (req, res, proxy) {
  if(req.url.match(/\.css\?*/)){
	proxy.proxyRequest(req, res, { host: 'localhost', port: 8000 });
  } else {
	proxy.proxyRequest(req, res, { host: 'localhost', port: 80 });
	var  options = { host: 'localhost' , port: 80, path: req.url }; 
	//var  options = { host: 'www.google.com' , port: 80 , path: '/images/logos/ps_logo2.png' }
	var request = http.get(options, function(r){
    		var imagedata = ''
    		r.setEncoding('binary')
		r.on('data', function(chunk){ imagedata += chunk })
    		r.on('end', function(){
        		fs.writeFile(record_dir+req.url, imagedata, 'binary', function(err){
            			if (err) throw err;
            			console.log('File saved.');
        		})
    		})
		
	})
}).listen(9000);

////////////////////////////////////////////////////////////////////////////
//////////////////normal http server on port 8000 //////////////////////////
////////////////////////////////////////////////////////////////////////////
connect.createServer( 
    connect.static("www")
).listen(8000);
////////////////////////////////////////////////////////////////////////////




