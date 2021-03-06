const pgp = require('pg-promise')({});
require('dotenv').config();

const {
  DB_NAME,
  DB_USER,
  DB_PASS,
  DB_HOST,
} = process.env;

const db = pgp({
  user: DB_USER,
  password: DB_PASS,
  host: DB_HOST,
  database: DB_NAME,
  port: 5432,

});

module.exports = db;
