const AnimeService = require('../services/animeService.js');
const express = require('express');
const router = express.Router();

// Gets anime list
// GET localhost:3000/customer
router.get('/animes', (req, res) => {
  const response = AnimeService.getAnimes();
  res.send(response);
});

module.exports = router;
