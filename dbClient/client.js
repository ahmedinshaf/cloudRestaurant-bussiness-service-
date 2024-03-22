// dbClient.js
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");

let dynamoDBDocumentClient = null;

function createDynamoDBClient() {
  const isLocal = process.env.IS_LOCAL;
  const localEndpoint = process.env.DYNAMO_DB_ENDPOINT; 

  const clientConfig = {
    region: "us-east-1", 
  };

  if (isLocal && localEndpoint) {
    clientConfig.endpoint = localEndpoint;
    clientConfig.credentials = {
      accessKeyId: "local_access_key_id", 
      secretAccessKey: "local_secret_access_key",
    };
  }

  const dynamoDBClient = new DynamoDBClient(clientConfig);
  return DynamoDBDocumentClient.from(dynamoDBClient);
}

function getDynamoDBDocumentClient() {
  if (!dynamoDBDocumentClient) {
    dynamoDBDocumentClient = createDynamoDBClient();
  }
  return dynamoDBDocumentClient;
}

module.exports = { getDynamoDBDocumentClient };
