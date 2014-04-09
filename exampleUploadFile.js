#!/usr/bin/env node 

var multiparty = require('multiparty')
  , http = require('http')
  , util = require('util')

http.createServer(function(req, res) {
  if (req.url === '/upload' && req.method === 'POST') {
    var form = new multiparty.Form();
    form.parse(req, function(err, fields, files) {
	res.writeHead(200, {'content-type': 'text/plain'});
    	for(f in files.upload){
		var uploadedTo=files.upload[f].path;
		res.write('received upload ('+uploadedTo+')\n\n');
	}
    	for(f in fields){ res.write('received field('+f+')='+fields[f]+'\n\n'); }
	res.write('fields + files =\n\n');
	res.end(util.inspect({fields: fields, files: files}));
    });
    return;
  }

  // show a file upload form
  res.writeHead(200, {'content-type': 'text/html'});
  res.end(
    '<form action="/upload" enctype="multipart/form-data" method="post">'+
    '<input type="text" name="title"><br>'+
    '<input type="file" name="upload" multiple="multiple"><br>'+
    '<input type="submit" value="Upload">'+
    '</form>'
  );
}).listen(8002);
