const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const SERVER = process.env.SERVER;
const DATABASE = process.env.DATABASE;
const DB_USER = process.env.DB_USER;
const PASSWORD = process.env.PASSWORD;
const OPTIONS = process.env.OPTIONS;

function connect() {
  mongoose.connect(`mongodb+srv://${DB_USER}:${PASSWORD}@${SERVER}/${DATABASE}?${OPTIONS}`, { useNewUrlParser: true, useFindAndModify: false });
}

module.exports.connect = connect;
