import { getKeys } from './keys';
import express = require('express');
import bodyParser = require('body-parser');
import cors = require('cors');
import { Pool } from 'pg';
import redis = require('redis');

const keys = getKeys();

const app = express();
app.use(cors());
app.use(bodyParser.json());

const pgClient = new Pool({
  user: keys.pgUser,
  host: keys.pgHost,
  database: keys.pgDatabase,
  password: keys.pgPassword,
  port: keys.pgPort,
});
pgClient.on('error', () => console.log('Lost PG connection'));

pgClient
  .query('CREATE TABLE IF NOT EXISTS values (number INT)')
  .catch(err => console.log(err));

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000,
});

const redisPublisher = redisClient.duplicate();

app.get('/', (_req, res) => {
  res.send('Hi');
});

app.get('/values/all', async (_req, res) => {
  const values = await pgClient.query('SELECT * FROM values');
  res.send(values.rows);
});

app.get('/values/current', (_req, res) => {
  redisClient.hgetall('values', (_err, values) => {
    res.send(values);
  });
});

app.post('/values', (req, res) => {
  const index = req.body.value;
  const indexNumber = parseInt(index);
  if (indexNumber > 40) {
    return res.status(422).send('Index too high');
  }
  redisClient.hset('values', index, 'Nothing yet!');
  redisPublisher.publish('insert', index);
  pgClient.query('INSERT INTO values(number) VALUES($1)', [indexNumber]);
  res.send({ working: true });
});

app.listen(5000, () => {
  console.log('Listening');
});
