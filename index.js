const { DynamoDBClient, ListTablesCommand, PutItemCommand } = require('@aws-sdk/client-dynamodb');
const {SESClient,SendEmailCommand}=require('@aws-sdk/client-ses');
const {fromIni}=require('@aws-sdk/credential-provider-ini');

const dynamodb = new DynamoDBClient({
    region : 'us-east-1',
    credentials : fromIni()
  });
  const ses = new SESClient({ 
    region: "us-east-1", 
    credentials : fromIni()
  });
const listTables = async () => {
  try {
    const data = await dynamodb.send(new ListTablesCommand({}));
    console.log("Existing tables:", data.TableNames);
  } catch (error) {
    console.error("Error listing tables:", error);
  }
};
const AddandSendEmail = async (Player) => {
    const param = {
      TableName: "DeadEye",
      Item: {
        email: { S : Player.email},
        TeamName: { S : Player.TeamName},
        TeamLeader: { S : Player.TeamLeader},
      }
    }
    const data = await dynamodb.send(new PutItemCommand(param));
    console.log("Data Added Successfully!!!");
  try {
    const Email_param = {
      Source: "deadeyeorg@gmail.com",
      Destination: {
        ToAddresses: [Player.email],
      },
      Message: {
        Subject: {
          Data: `Team ${Player.TeamName} Successfully Registered`,
        },
        Body: {
          Text: {
            Data: `Dear ,

                We are thrilled to inform you that your team has been successfully registered with Deadeye Orgs! We are excited to welcome you to our community, where teamwork, skill, and passion for excellence come together.
                
                Team Details:
                
                Team Name: ${Player.TeamName}
                Team Leader: ${Player.TeamLeader}
                Registration Date: ${new Date().toLocaleDateString()}
                Next Steps:
                Access Your Dashboard: Log in to your team dashboard at [website link] to manage your team’s profile, view upcoming events, and access resources.
                
                Connect with Other Teams: Join our community forums to network with other teams, share strategies, and participate in discussions.
                
                Stay Updated: Follow us on ${"https://www.instagram.com/deadeyeesports/"} for the latest news, updates, and events that may interest your team.
                
                If you have any questions or need assistance, feel free to reach out to our support team at ${"deadeyeorg@gmail.com"}.
                
                Welcome aboard, and let’s make great things happen together!
                
                Best regards,
                
                Deadeye Orgs
                deadeyeorg@gmail.com
                `,
          },
        },
      },
    };
    const emailResult = await ses.send(new SendEmailCommand(Email_param));
    console.log("Email sent successfully", emailResult);
  } catch (error) {
    console.error("Error Adding Email : ",error);
  }
};

const player = {
  email: "himanshuparida27@gmail.com",
  TeamName: "FrostBytes",
  TeamLeader: "Himanshu",
}

listTables();
AddandSendEmail(player);