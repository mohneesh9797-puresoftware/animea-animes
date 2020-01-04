const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const SERVER = process.env.SERVER;
const DATABASE = process.env.DATABASE;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const OPTIONS = process.env.OPTIONS;

function connect() {
  mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@${SERVER}/${DATABASE}?${OPTIONS}`);
}

module.exports.connect = connect;
