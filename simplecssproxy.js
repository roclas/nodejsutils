var httpProxy = require('http-proxy'), connect = require('connect'), http = require('http'), fs = require('fs'), mkdirp = require('mkdirp')

var bhost="www.bbva.com", bport=80, record_dir="www2"

connect.createServer( connect.static(record_dir)).listen(8000);

httpProxy.createServer(function (req, res, proxy) { //WORKING PROXY
  if(req.url.match(/\.css\?*/)){
	proxy.proxyRequest(req, res, { host: 'localhost', port: 8000 })
  } else {
	proxy.proxyRequest(req, res, { host: bhost, port: bport })
	//try to go to localhost:9001/TLBB/tlbb/esp/index.jsp
  }
}).listen(9001);


httpProxy.createServer(function (req, res, proxy) { //RECORDING MODE PROXY
  if(req.url.match(/\.css\?*/)){
	var options = { host: bhost , port: bport , path: '/'+req.url}
	var request = http.get(options, function(res2){
    		var imagedata = ''
		var dir_array=options.path.split("/")
		var filename=dir_array.pop()
    		res2.setEncoding('binary')
		
    		res2.on('data', function(chunk){ imagedata += chunk })
		
    		res2.on('end', function(){
			mkdirp(record_dir+dir_array.join("/"), function(err) { });
        		fs.writeFile(record_dir+options.path, imagedata, 'binary', function(err){
            			if (err){ console.log("error saving file: ", err) }
            			console.log('File saved:',filename)
        		})
    		})
	})
	proxy.proxyRequest(req, res, { host: bhost, port: bport })
  } else {
	proxy.proxyRequest(req, res, { host: bhost, port: bport})
  }
}).listen(9002);

