const AnimeService = require('../services/animeService.js');
const express = require('express');
const router = express.Router();

// Gets anime list
router.get('/animes', (req, res) => {
  page = req.query.page ? req.query.page : 1;

  const filters = {
    'status': req.query.status ? req.query.status : '',
    'genres': req.query.genres ? req.query.genres : '',
    'text': req.query.text ? req.query.text : '',
  };

  AnimeService.getAnimes(page, filters).then(function(response) {
    res.send(response.data);
  }, function(err) {
    console.log(err);
  });
});

router.get('/animes/:id', (req, res) => {
  animeId = req.params.id;

  AnimeService.getAnimeById(animeId).then(function(response) {
    res.send(response.data);
  }, function(err) {
    console.log(err);
  });
});

router.get('/user/:id/animes', (req, res) => {
  userId = req.params.id;

  AnimeService.getUserAnimesById(userId).then(function(response) {
    res.json(response);
  }, function(err) {
    console.log(err);
  });
});

router.delete('/user/animes/:id', (req, res) => {
  animeId = req.params.id;
  //userId = req.params.id;

  AnimeService.deleteUserAnimeById(animeId).then(function(response) {
    res.sendStatus(200);
  }, function(err) {
    console.log(err);
  });
});

router.post('/user/animes', (req, res) => {
  var anime = req.body;

  AnimeService.postUserNewAnime(anime).then(function(response){
    res.sendStatus(201);
  }, function(err) {
    console.log(err);
  });
});

router.put('/user/animes', (req, res) => {
  var anime = req.body;

  console.log(anime);

  AnimeService.updateUserAnimeById(anime).then(function(response){
    res.sendStatus(200);
  }, function(err){
    console.log(err);
  });
});

module.exports = router;
