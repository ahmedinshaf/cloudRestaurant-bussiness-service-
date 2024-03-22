const { ScanCommand } = require("@aws-sdk/client-dynamodb");
const { getDynamoDBDocumentClient } = require("../dbClient/client");
const { PutCommand, GetCommand } = require("@aws-sdk/lib-dynamodb");

const ddbDocClient = getDynamoDBDocumentClient();

function transformRestaurant(restaurant) {
  return {
    address: restaurant.address.S,
    name: restaurant.name.S,
    cuisineTypes: restaurant.cuisineTypes.L.map(item => item.S),
    restaurantId: restaurant.restaurantId.S
  };
}

async function addRestaurant(restaurant) {
  try {
    const command = new PutCommand({
      TableName: "Restaurants",
      Item: restaurant,
    });

    const result = await ddbDocClient.send(command);
    return{
      restaurantId: restaurant.restaurantId,
      name: restaurant.name,
      address: restaurant.address,
      cuisineTypes: restaurant.cuisineTypes}
  } catch (error) {
    console.error("Error adding restaurant:", error);
  }
}

//get all restaurants
async function getAllRestaurants() {
  try {
    const params = new ScanCommand({
      TableName: "Restaurants",
    });
    const { Items } = await ddbDocClient.send(params);
    return{ restaurants: Items.map(transformRestaurant)};
  } catch (error) {
    console.error("Error getting restaurants:", error);
  }
}

// get restaurant by id
async function getRestaurantById(restaurantId) {
  try {
    const params = new GetCommand({
      TableName: "Restaurants",
      Key: {
        restaurantId,
      },
    });

    const { Item } = await ddbDocClient.send(params);
    return Item;
  } catch (error) {
    console.error("Error getting restaurant by id:", error);
  }
}

module.exports = { addRestaurant, getAllRestaurants, getRestaurantById };