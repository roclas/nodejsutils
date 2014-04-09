var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
AWS.config.update({region: "eu-west-1"});

var db=new AWS.DynamoDB();
db.listTables(function(err, data) {
  console.log(data.TableNames);
});
