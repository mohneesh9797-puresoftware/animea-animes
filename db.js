const mongoose = require('mongoose');

const SERVER = process.env.SERVER;
const DATABASE = process.env.DATABASE;
const USER = process.env.USER;
const PASSWORD = process.env.PASSWORD;
const OPTIONS = process.env.OPTIONS;

function connect() {
  mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@${SERVER}/${DATABASE}?${OPTIONS}`);
}

function connectTestDb(){
  mongoose.connect('mongodb://mongo/test');
}

module.exports.connect = connect;
module.exports.connectTestDb = connectTestDb;
