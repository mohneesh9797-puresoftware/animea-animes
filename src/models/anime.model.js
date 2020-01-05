const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
  status: String,
  anime_id: {
    type: Number,
    required: true,
    unique: false,
  },
  user_id: {
    type: String,
    required: true,
    unique: false,
  },
  rating: {
    type: Number,
    required: false,
    unique: false,
  },
}, { collection : 'animes' });

module.exports = mongoose.model('Anime', AnimeSchema);
