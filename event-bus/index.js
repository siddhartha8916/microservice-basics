const express = require('express');
const bodyParser = require('body-parser')
const cors = require('cors');
const { default: axios } = require('axios');

const app = express();

app.use(bodyParser.json());
app.use(cors());

const events = []

app.get('/events', (req, res) => {
  res.send(events)
})

app.post('/events', (req, res) => {
  const event = req.body;

  events.push(event)

  axios.post('http://posts-srv:4000/events', event).catch(err => console.log(err))
  axios.post('http://comments-srv:4001/events', event).catch(err => console.log(err))
  axios.post('http://query-srv:4002/events', event).catch(err => console.log(err))
  axios.post('http://moderation-srv:4003/events', event).catch(err => console.log(err))

  res.send({ status: 'OK' })
})

app.listen(4005, () => {
  console.log('Listening on port 4005...');
})

