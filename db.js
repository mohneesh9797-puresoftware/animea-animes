const mongoose = require('mongoose');

const SERVER = 'animea-animes-5gkx1.mongodb.net';
const DATABASE = 'animea-animes';
const USER = 'animea';
const PASSWORD = 'animea';
const OPTIONS = 'retryWrites=true&w=majority';

function connect() {
  mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@${SERVER}/${DATABASE}?${OPTIONS}`);
}

module.exports.connect = connect;
