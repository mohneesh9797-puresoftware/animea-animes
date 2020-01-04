const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const SERVER = process.env.SERVER;
const DATABASE = process.env.DATABASE;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const OPTIONS = process.env.OPTIONS;

function connect() {
  console.log(USER)
  console.log(PASSWORD)
  console.log(DATABASE)
  console.log(SERVER)
  mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@${SERVER}/${DATABASE}?${OPTIONS}`, { useNewUrlParser: true });
}

module.exports.connect = connect;
