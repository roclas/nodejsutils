#!/usr/bin/env node


///STATIC SERVER 1
var express = require('express'), app = express.createServer();

app.configure(function() {
  var hourMs = 1000*60*60;
  app.use(express.static(__dirname + '/data', { maxAge: hourMs }));
  app.use(express.directory(__dirname + '/data'));
  app.use(express.errorHandler());
});

app.listen(8000);


///STATIC SERVER 2
var http = require('http'),fs=require('fs');

http.createServer(function (req, res) {
	//var JS_Script = 'function Test() { alert("test success")}';
	res.setHeader('content-type', 'application/json');
	file="data/"+req.url;
	fs.readFile(file, 'utf8', function(err, data) {
  		if (err){
		  try{
			stat=fs.statSync(file);
			if(stat.isDirectory()){
				result={
					"type":"dir",
					"children":[]
				}
				files=fs.readdirSync(file);
				for(f in files){
					result.children.push(files[f]);
				}
				res.end(JSON.stringify(result));
			}
		   }catch(error){
			//throw err;
			console.log("could find "+file);
		   }
		}
		res.end(data);
	});
}).listen(9000);
