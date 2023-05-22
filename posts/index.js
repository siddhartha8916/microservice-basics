const express = require('express');
const {randomBytes} = require('crypto');
const bodyParser = require('body-parser');
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res) => {
  res.send(posts)
})

app.post('/posts', async (req, res) => {
  const {title} = req.body;
  const id = randomBytes(4).toString('hex');

  posts[id] = {id, title};

  await axios.post('http://event-bus-srv:4005/events', {
    type:"PostCreated",
    data:{id, title}
  })
  
  res.status(201).send(posts[id])

})

app.post('/events', (req, res) => {
    console.log('Received Event', req.body.type);
    res.send({}) 
})

app.listen(4000, () => {
  console.log('This is the updated V22.22');
  console.log('Listening on port 4000...');
})

