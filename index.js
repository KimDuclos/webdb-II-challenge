const express = require('express');

const server = express();

const knex = require('knex');
const knexConfig = require('./knexfile');
const db = knex(knexConfig.development);

server.use(express.json());

const zoo = require('./data/routes/zoo');
const bear = require('./data/routes/bear');

// endpoints here

server.use('/api/zoos', zoo);
server.use('/api/bears', bear);

const port = 9000;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:9000\n`);
});