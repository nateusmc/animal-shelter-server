const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const { Queue } = require('./queue');
const { PORT, CLIENT_ORIGIN } = require('./config');
const { dbConnect } = require('./db-mongoose');

// const {dbConnect} = require('./db-knex');

const app = express();

app.use(
    morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
        skip: (req, res) => process.env.NODE_ENV === 'test',
      })
);

app.use(
    cors({
        origin: CLIENT_ORIGIN,
      })
);

//Queue

const catShelter = new Queue();
const dogShelter = new Queue();

catShelter.enqueue({
  imageURL: 'https://assets3.thrillist.com/v1/image/2622128/size/tmg-slideshow_l.jpg',
  imageDescription: 'Orange bengal cat with black stripes lounging on concrete.',
  name: 'Fluffy',
  sex: 'Female',
  age: 2,
  breed: 'Bengal',
  story: 'Thrown on the street',
});

catShelter.enqueue({
  imageURL: 'https://fthmb.tqn.com/jrn695CF5q109t5-RHvLUw8Wj3E=/960x0/filters:no_upscale()/lancelot421x413-56a10c1a3df78cafdaa89d16.jpg',
  imageDescription: 'Siamese lounging around and cuddly.',
  name: 'Sparkles',
  sex: 'Female',
  age: 4,
  breed: 'Siamese',
  story: 'Thrown on the street',
});

catShelter.enqueue({
  imageURL: 'https://i.pinimg.com/564x/bd/ff/77/bdff77f23702854899ebba68553da8d7.jpg',
  imageDescription: 'looking for a purrific new home',
  name: 'Tabby',
  sex: 'Female',
  age: 3,
  breed: 'Russian Blue',
  story: 'Thrown on the street',
});

dogShelter.enqueue({
  imageURL: 'http://www.dogster.com/wp-content/uploads/2015/05/Cute%20dog%20listening%20to%20music%201_1.jpg',
  imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
  name: 'Zeus',
  sex: 'Male',
  age: 3,
  breed: 'Golden Retriever',
  story: 'Owner Passed away',
});

dogShelter.enqueue({
  imageURL: 'http://cdn2-www.dogtime.com/assets/uploads/gallery/newfoundland-dogs-and-puppies/newfoundland-dogs-puppies-1.jpg',
  imageDescription: 'A smiling newfoundland ready for a new home',
  name: 'Bella',
  sex: 'Female',
  age: 5,
  breed: 'Newfoundland',
  story: 'Dumped on Side of Road',
});

dogShelter.enqueue({
  imageURL: 'https://www.petmd.com/sites/default/files/breedopedia/droid%20412.jpg',
  imageDescription: 'A smiling golden-brown golden retreiver listening to music.',
  name: 'Bently',
  sex: 'Male',
  age: 4,
  breed: 'German Shepherd',
  story: 'Not Potty Trained',
});

app.get('/api/cat', (req, res) => {
  const nextCat = catShelter.peek();
  res.status(200).json(nextCat);
});

app.delete('/api/cat', (req, res) => {
  catShelter.dequeue();
});

app.get('/api/dog', (req, res) => {
  const nextDog = dogShelter.peek();
  res.status(200).json(nextDog);
});

app.delete('/api/dog', (req, res) => {
  dogShelter.dequeue();
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
