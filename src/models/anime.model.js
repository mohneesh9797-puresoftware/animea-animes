const mongoose = require('mongoose');

const AnimeSchema = new mongoose.Schema({
  status: String,
  anime_id: {
    type: Number,
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
});

module.exports = mongoose.model('Anime', AnimeSchema);
