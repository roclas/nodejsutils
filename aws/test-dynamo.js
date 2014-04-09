var credentials = {accessKeyId : "AAAAAAAAAAAAAA", secretAccessKey   : "dfadsfadsfasdUasfasdfasdfasdfasdfasd"};
var dynamo = require("dynamo") , client = dynamo.createClient(credentials) , db = client.get("eu-west-1");
var roclas=require("./roclas.js");

/*
db.query(
        {
                "TableName":"AllRelationshipByMonth",
                "HashKeyValue":{"S":"58724733"},
                "AttributesToGet":["ag","dt"]
        }, function(err, data) {
                        if(err != null) {
                                console.log("error",err);
                        }
                        else {
                                //console.log(data);
				for(d in data.Items){
                                	console.log(data.Items[d]);
				}
                        }
        }
);
*/


db.get("AllRelationshipByMonth").fetch(function(err, data){ 
                        if(err != null) { console.log("error",err); }
                        else { console.log(data); }
});

db.get("AllRelationshipByMonth").query({id: "58724733"}).fetch(function(err, data){ 
                        if(err != null) { console.log("error",err); }
                        else { console.log(data); }
});
