const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config();

const SERVER = 'animea-animes-5gkx1.mongodb.net';
const DATABASE = 'animea-animes';
const DB_USER = 'animea';
const PASSWORD = 'animea';
const OPTIONS = 'authSource=admin&replicaSet=animea-animes-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true';

function connect() {
  mongoose.connect(`mongodb+srv://${DB_USER}:${PASSWORD}@${SERVER}/${DATABASE}?${OPTIONS}`, { useNewUrlParser: true, useFindAndModify: false });
}

module.exports.connect = connect;
