function isoStringToDate(s) {
  try{
  	var b = s.split(/[ :+]/ig);
  	return parseInt(b[8]+""+b[3]+""+b[2]);
  }catch(e){ return null; }
}

var fs = require('fs') ,AWS = require('aws-sdk'),roclas = require('../roclas.js');
AWS.config.loadFromPath('../config.json');
AWS.config.update({region: 'eu-west-1'});

var dynamodb = new AWS.DynamoDB();

fs.readFile('./logs1.txt', 'utf8', function (err,data) { 
	if (err) { console.log('Error: ' + err); return; }
	a= JSON.parse(data); 
	for(i in a){ 
		a[i]["created_at"]=isoStringToDate(a[i]["created_at"]);
  		try{ a[i]["user_id"]=a[i]["user"]["id"];
  		}catch(e){a[i]["user_id"]=0;}
		var item={};
		//text=roclas.findInObject(a[i],"text")[0];
		//item[text]=a[i][text];
		for(f in a[i]){
		 if(typeof(a[i][f])=="object"){
			//item[f]={"S":JSON.stringify(a[i][f])}; 
			//console.log("typeof "+f+" == object");
		 }
		 else{item[f]={"S":""+a[i][f]}; }
		}
		item.user_id={"N":""+a[i]["user_id"]};
		item.created_at={"N":""+a[i]["created_at"]};
		dynamodb.putItem({TableName:'tweets',Item:item },function(err, data){
    			if (err) { console.log("Error: "+err); 
    			} else { console.log(data); }
		});
	}
});
