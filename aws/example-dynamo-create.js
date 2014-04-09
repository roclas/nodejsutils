var credentials = {accessKeyId : "mykey", secretAccessKey   : "mySecret"};

var dynamo = require("dynamo") , client = dynamo.createClient(credentials) , db = client.get("eu-west-1");

tweets=db.add({    name: "tweets",
    schema: [ ['user_id', Number], ['created_at', Number] ],
    throughput: {read: 1, write: 1}
}).save( function(err, data){ 
	console.log(data);
});
