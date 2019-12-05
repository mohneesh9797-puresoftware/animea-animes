let mongoose = require('mongoose')

const SERVER = 'elongo-bd-adlff.mongodb.net';
const DATABASE = 'test';
const USER = 'db_admin';
const PASSWORD = '1MUJ9nwbZw5GwnqK';
const OPTIONS = 'retryWrites=true&w=majority';

function connect() {
    mongoose.connect(`mongodb+srv://${USER}:${PASSWORD}@${SERVER}/${DATABASE}?${OPTIONS}`);
}

module.exports.connect = connect;