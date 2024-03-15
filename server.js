const express = require('express');
const validateToken = require('./cognitoAuth');

const app = express();
const port = 8000;

app.get('/', (req, res) => {
  res.json({ message: 'Hello World!' });
});


// Use the middleware on a protected route
app.get('/protected', validateToken, (req, res) => {
  res.status(200).json({ message: `Hello ${req.user.email}, you have access to this protected endpoint!` });
});
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
