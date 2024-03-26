const express = require('express');
const bodyParser = require('body-parser');
const validateToken = require('./cognitoAuth');
const {addDish, getDishByRestaurantId, getAllDishes, getDishById} = require('./repository/dishRepository');
const {addRestaurant, getAllRestaurants, getRestaurantById} = require('./repository/restaurantRepository');
const cors = require('cors');


const app = express();
app.use(bodyParser.json());
// allow cross-origin requests for all routes
app.use(cors());
const port = 8000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});

// route for add restaurant
app.post('/restaurant', async (req, res) => {
  console.log("creating restaurant : ",req.body)
  try{
    // Add restaurant to the database
    const { restaurantId, name, address, cuisineTypes } = req.body;
    // Add restaurant to the database
    const addRestaurantResult = await addRestaurant({ restaurantId, name, address, cuisineTypes });
    res.status(201).json({ message: 'Restaurant added successfully!', addRestaurantResult });
  }catch(e){
    console.log(e);
    res.status(500).json({ message: 'Error adding restaurant', error: e });
  }
});

// get restaurant by Id
app.get('/restaurant/:restaurantId', async (req, res) => {
  try{
    const restaurantId = req.params.restaurantId;
    const restaurant = await getRestaurantById(restaurantId);
    res.status(200).json({ message: 'Restaurant retrieved successfully!', restaurant });
  }catch(e){
    console.log(e);
    res.status(500).json({ message: 'Error getting restaurant', error: e });
  }
});

// get all restaurants
app.get('/restaurants', async (req, res) => {
  console.log("getting all restaurants")
  try{
    const restaurants = await getAllRestaurants();
    res.status(200).json({ message: 'Restaurants retrieved successfully!', restaurants });
  }catch(e){
    console.log(e);
    res.status(500).json({ message: 'Error getting restaurants', error: e });
  }
});

// get dishes by restaurantId
app.get('/:restaurantId/dishes', async (req, res) => {
  try{
    const restaurantId = req.params.restaurantId;
    const dishes = await getDishByRestaurantId(restaurantId);
    res.status(200).json({ message: 'Dishes retrieved successfully!', dishes });
  }catch(e){
    console.log(e);
    res.status(500).json({ message: 'Error getting dishes', error: e });
  }
}
);


app.post('/dish', async (req, res) => {
  try{
    const { restaurantId, dishId, name, price, ingredients, description } = req.body;
    // Add dish to the database
    const addDishResult = await addDish(restaurantId, { dishId, name, price, ingredients, description });
    res.status(201).json({ message: 'Dish added successfully!', addDishResult});
  }catch(e){
    console.log(e);
    res.status(500).json({ message: 'Error adding dish', error: e });
  }
});

// get dish by Id
app.get('/dish/:dishId', async (req, res) => {
  try{
    const dishId = req.params.dishId;
    // get restaurant from body
    const restaurantId = req.body.restaurantId;
    const dish = await getDishById(restaurantId, dishId);
    res.status(200).json({ message: 'Dish retrieved successfully!', dish });
  }catch(e){
    console.log(e);
    res.status(500).json({ message: 'Error getting dish', error: e });
  }
});

// get all dishes
app.get('/dishes', async (req, res) => {
  try{
    const dishes = await getAllDishes();
    res.status(200).json({ message: 'Dishes retrieved successfully!', dishes });
  }catch(e){
    console.log(e);
    res.status(500).json({ message: 'Error getting dishes', error: e });
  }
});


// Use the middleware on a protected route
app.get('/protected', validateToken, (req, res) => {
  res.status(200).json({ message: `Hello ${req.user.email}, you have access to this protected endpoint!` });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
