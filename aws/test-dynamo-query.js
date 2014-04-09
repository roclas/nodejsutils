AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');
AWS.config.update({region: 'eu-west-1'});

var dynamodb = new AWS.DynamoDB(),client=dynamodb.client, tablename="tweets";

/*
client.query(
        {
                "TableName":tablename
		,"KeyConditions":{ 
		  created_at:{
			AttributeValueList: [
				{"N":"20130000"}
			],
			ComparisonOperator:"GE"
		  },
		  user_id:{
			AttributeValueList: [
				{"N":"543654721"}
			],
			ComparisonOperator:"EQ"
		  }
		}
                //,"AttributesToGet":["user_id","created_at","text"]
		//,"ReturnConsumedCapacity":"TOTAL"
        }, function(err, data) {
                if(err != null) { console.log("error",err); }
                else{for(d in data.Items){console.log(data.Items[d]);}}
        }
);
*/

client.scan(
        {
                "TableName":tablename
		,"ScanFilter":{ 
		  id:{
			AttributeValueList: [
				{"S":"2000"}
			],
			ComparisonOperator:"GE"
		  }
		}
                //,"AttributesToGet":["user_id","created_at","text"]
		//,"ReturnConsumedCapacity":"TOTAL"
        }, function(err, data) {
                if(err != null) { console.log("error",err); }
                else{for(d in data.Items){console.log(data.Items[d]);}}
        }
);
