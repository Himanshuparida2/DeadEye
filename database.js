const {DynamoDBClient,PutItemCommand}=require('@aws-sdk/client-dynamodb');
const {fromIni}=require('@aws-sdk/credential-provider-ini');
const dynamodb = new DynamoDBClient({
  region : 'us-east-1',
  credentials : fromIni()
});
const AddandSendEmail = async (Player) => {
  const param = {
    TableName: "DeadEye",
    Item: {
      email: { S : Player.email},
      TeamName: { S : Player.TeamName},
    },
  };
  const data = await dynamodb.send(new PutItemCommand(param));
  console.log("Data Added Successfully!!!");
};

const player = {
  email: "himanshu.parida16@gmail.com",
  TeamName: "DeadEye Esports",
};
AddandSendEmail(player);
