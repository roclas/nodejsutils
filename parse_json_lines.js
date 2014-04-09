if(process.argv.length<3){
	console.error("missing argument (file to parse)");
	return(-1);
}

var fs = require('fs'),readline = require('readline');

var rd = readline.createInterface({
    input: fs.createReadStream(process.argv[2]),
    output: process.stdout,
    terminal: false
});

rd.on('line', function(line) {
    try{
	var l=JSON.parse(line);
	console.log(JSON.stringify(l,null,4));
    }catch(error){}
    
});
