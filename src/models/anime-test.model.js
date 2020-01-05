const mongoose = require('mongoose');

const AnimeTestSchema = new mongoose.Schema({
  status: String,
  anime_id: {
    type: String,
    required: true,
    unique: false,
  },
  user_id: {
    type: Number,
    required: true,
    unique: false,
  },
  rating: {
    type: Number,
    required: false,
    unique: false,
  },
}, { collection : 'animes-test' });

module.exports = mongoose.model('AnimeTest', AnimeTestSchema);
