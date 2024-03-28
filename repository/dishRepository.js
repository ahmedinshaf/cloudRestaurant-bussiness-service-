const { getDynamoDBDocumentClient } = require("../dbClient/client");
const { PutCommand,QueryCommand, ScanCommand,GetCommand } = require("@aws-sdk/lib-dynamodb");

const ddbDocClient = getDynamoDBDocumentClient();


async function addDish(restaurantId, dish) {
  try {
    const params = {
      TableName: "Dishes", 
      Item: {
        restaurantId,             
        dishId: dish.dishId,   
        name: dish.name,
        price: dish.price,
        ingredients: dish.ingredients,
        description: dish.description,
        photos: dish.photos
      },
    };

    // Create and send a PutCommand
     await ddbDocClient.send(new PutCommand(params));
    return {
        dishId: dish.dishId,
        name: dish.name,
        price: dish.price,
        ingredients: dish.ingredients,
        description: dish.description
    };
  } catch (error) {
    console.error("Error adding dish to restaurant:", error);
  }
}

// get all dishes
// CONSIDER: not in optimal way
async function getAllDishes() {
    try {
        const params = {
        TableName: "Dishes",
        };
    
        const { Items } = await ddbDocClient.send(new ScanCommand(params));
        return Items;
    } catch (error) {
        console.error("Error getting dishes:", error);
    }
}

// get dish by id
async function getDishById(restaurantId, dishId) {
  console.log("restaurantId:", restaurantId)
  console.log("dishId:", dishId)
    try {
        const params = new GetCommand(
            {
                TableName: "Dishes",
                Key: {
                    // partition key
                    restaurantId,
                    // sort key
                    dishId,
                },
            }
        ) 
    
        const { Item } = await ddbDocClient.send(params);
        console.log("Item:", Item)
        return Item;
    } catch (error) {
        console.error("Error getting dish by id:", error);
    }
}

async function getDishByRestaurantId(restaurantId) {
    const params = {
    TableName: "Dishes",
    KeyConditionExpression: "restaurantId = :restaurantId",
    ExpressionAttributeValues: {
      ":restaurantId": restaurantId 
    }
  };

  try {
    const command = new QueryCommand(params);
    const response = await ddbDocClient.send(command);
    console.log("Query succeeded:", response.Items);
    return response.Items;
  } catch (err) {
    console.error("Error executing query:", err);
    return {error: err};
  }
}

    

module.exports = { addDish,getDishByRestaurantId,getAllDishes,getDishById };
