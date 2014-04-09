var https = require('https');
var fs = require('fs');
var qs = require('querystring');


var options = {
  key: fs.readFileSync('key.pem'),
  cert: fs.readFileSync('cert.pem')
};

var a = https.createServer(options, function (req, res) {
  res.writeHead(200);
  var POST='';
  var body='';
  if (req.method == 'POST') {
        req.on('data', function (data) { body += data; });
        req.on('end', function () {
		var AAA="";
		if(body!=''){
			POST = qs.parse(body);
			for( i in POST ){
				AAA+= i+"="+POST[i]+"  \n";
			}
		}
   		res.end("params= "+AAA+"\r"+req.url);
        });
   }else res.end("params= "+req.url);
}).listen(8000);
