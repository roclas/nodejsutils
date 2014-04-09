#!/usr/bin/env node

var fs = require('fs');
var walk = function(dir) {
    var results = [];
    var list = fs.readdirSync(dir);
    list.forEach(function(file) {
        file = dir + '/' + file;
        var stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
        	results.push(file);
		results = results.concat(walk(file));
	}
        //else results.push(file);
    })
    return results;
}
var watchPath=function(path){
 fs.watch(path, function (event, filename) {
  ignores=[/^\./];
  for(i in ignores)if(filename.match(ignores[i]))return;
  if (filename) {
    console.log(path+'/'+filename+' :'+event );
  } else {
    console.log('unknown file modified: '+event);
  }
 });
}

w=walk(".");
for(e in w){ watchPath(w[e]); }
