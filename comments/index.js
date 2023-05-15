const express = require('express');
const { randomBytes } = require('crypto');
const bodyParser = require('body-parser')
const cors = require('cors');
const { default: axios } = require('axios');


const app = express();

app.use(bodyParser.json());
app.use(cors());

const commentsByPostId = {};

app.get('/posts/:id/comments', (req, res) => {
  const postId = req.params.id;

  const comments = commentsByPostId[postId] || [];
  res.status(200).send(comments)

})

app.post('/posts/:id/comments', async (req, res) => {
  const postId = req.params.id;
  const commentId = randomBytes(4).toString('hex');
  const { content } = req.body;

  const comments = commentsByPostId[postId] || [];
  comments.push({ id: commentId, content, status: 'pending' });
  commentsByPostId[postId] = comments;

  await axios.post('http://localhost:4005/events', {
    type: "CommentCreated",
    data: {
      id: commentId,
      postId: postId,
      content: content,
      status: 'pending'
    }
  })

  res.status(201).send(comments);
})

app.post('/events', async (req, res) => {
  const { type, data } = req.body;

  console.log('Received Event', type);
  
  if (type === 'CommentModerated') {
    const { id, postId, status, content } = data;
    const comments = commentsByPostId[postId];

    const comment = comments.find(comment => comment.id === id);
    comment.status = status

    await axios.post('http://localhost:4005/events', {
      type: "CommentUpdated",
      data: {
        id,
        postId,
        status,
        content
      }
    })
  }

  res.send({ status: 'OK' })
})

app.listen(4001, () => {
  console.log('Listening on port 4001...');
})

