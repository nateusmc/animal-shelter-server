'use strict';

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const app = express();

const { PORT, CLIENT_ORIGIN } = require('./config');
const { catData, dogData } = require('./petsData');
const { dbConnect } = require('./db-mongoose');
const { Queue, peek } = require('./queue');
const [catQueue, dogQueue] = [new Queue(), new Queue()];

function populateQueue(queue, data) {
  data = [...data];

  for (let i = 0; i < data.length; i++) {
    queue.enqueue(data[i]);
  }
}

app.use(
  morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
    skip: () => process.env.NODE_ENV === 'test',
  })
);
app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

app.get('/api/cat', (req, res) => {
  populateQueue(catQueue, catData);
  return res.json(peek(catQueue));
});

app.get('/api/dog', (req, res) => {
  populateQueue(dogQueue, dogData);
  return res.json(peek(dogQueue));
});

app.delete('/api/cat', (req, res) => {
  catQueue.dequeue();
  res.sendStatus(204);
});

app.delete('/api/dog', (req, res) => {
  dogQueue.dequeue();
  res.sendStatus(204);
});

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on('error', err => {
      console.error('Express failed to start');
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = { app };
