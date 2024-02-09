const express = require('express'); //requiring express module

const app = express(); //app variable for express

// get request from browser
// get = http method
// req = request
// res = response
// '/' = url
app.get('/', (req, res) => {
  // res.status(200).send('Hello from the server side!'); //send response for the client side with 200=success
  //sending response for client side
  res
    .status(200)
    .json({ message: 'Hello from the server side', app: 'Natours' });
});

app.post('/', (req, res) => {
  res.send('You can post to this endpoint...'); //send response for the client side
});

//start server
const port = 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
