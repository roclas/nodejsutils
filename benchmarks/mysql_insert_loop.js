var mysql = require('mysql');
// Create a connection to MySql Server and Database

var insert_random_element=function(){
	var connection = mysql.createConnection({
	  host : 'localhost',
	  port : 3306,
	  database: 'node_test',
	  user : 'root',
	  password : 'admin'
	});
	connection.connect(function(err){
		if(err != null){
			console.error('Error connecting to mysql:' + err+'\n');
		}
	});
	
	connection.query("insert into example (`data`) VALUES ( "+(new Date()).getTime()+");", function(err, rows){
	        if(err != null) {
	            console.error("Query error:" + err);
	        } else {
		   try{
	            console.log(rows[0]);
	            console.log("Success!");
		   }catch(e){}
		}
	});
	connection.end();
}


for(var i=50;i-->0;)insert_random_element();
//process.exit(code=0)
