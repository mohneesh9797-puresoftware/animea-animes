const AnimeService = require('../services/animeService.js');
const express = require('express');
const router = express.Router();
const cache = require('memory-cache');

var BASE_API_PATH = "/api/v1";

/**
 * @typedef Anime
 * @property {integer} anime_id.required - Identifier of the anime
 * @property {integer} user_id.required - Identifier of the user
 * @property {enum} status.required - Status of the anime in the user's list - eg: pending, watching, finished
 * @property {integer} rating - Rating given from the user for the anime
 */

/**
 * @route GET /animes
 * @group Anime - Operations about Anime
 * @param {string} status.query - status of the anime for the user
 * @param {string} status.genres - genres of the anime
 * @param {string} status.text - text contained in the anime title or description
 * @returns {object} 200 - An array with the searched animes
 * @returns {Error}  default - Unexpected error
 */
router.get(BASE_API_PATH + '/animes', (req, res) => {
  page = req.query.page ? req.query.page : 0;

  const filters = {
    'status': req.query.status ? req.query.status : '',
    'genres': req.query.genre ? req.query.genre : '',
    'text': req.query.text ? req.query.text : '',
  };

  AnimeService.getAnimes(page, filters).then((response) => {
    res.send(response.data);
  }, function(err) {
    console.log(err);
  });
});


/**
 * @route GET /animes/:id
 * @group Anime - Operations about Anime
 * @param {string} id.query.required - identifier of the anime
 * @returns {object} 200 - JSON object with information about the searched anime
 * @returns {Error}  default - Unexpected error
 */
router.get(BASE_API_PATH + '/animes/:id', (req, res) => {
  animeId = req.params.id;

  AnimeService.getAnimeById(animeId).then((response) =>{
    res.send(response.data);
  }, function(err) {
    console.log(err);
  });
});

/**
 * @route GET /user/:id/animes
 * @group Anime - Operations about Anime
 * @param {string} id.query.required - identifier of the user
 * @returns {object} 200 - An array with the animes that the user has in his list
 * @returns {object} 401 - Invalid token
 * @returns {Error}  default - Unexpected error
 */
router.get(BASE_API_PATH + '/user/:id/animes', (req, res) => {
  userId = req.params.id;
  userToken = req.header('x-access-token')
  cacheKey = `getUserAnimesById:${userId}`
  cachedBody = cache.get(cacheKey);

  AnimeService.getUserAnimesById(userId, userToken).then((response) => {
    cache.put(cacheKey, response, 86400000) // the cache will be stored 24h
    res.json(response);
  }, function (err) {
    if (err == 401){
      res.status(401).json({
        error: 'Unauthorized. Authentication failed.'
    })
    }
    console.log(err);
    if (cachedBody) {
      console.log("Using cache...")
      res.json(cachedBody);
    }
  });
});

/**
 * @route GET /user/:userId/animes/:animeId
 * @group Anime - Operations about Anime
 * @param {string} userId.query.required - identifier of the user
 * @param {string} animeId.query.required - identifier of the anime
 * @returns {object} 200 - An array with the user's friends that have watched that anime
 * @returns {object} 401 - Invalid token
 * @returns {Error}  default - Unexpected error
 */
router.get(BASE_API_PATH + '/user/:userId/animes/:animeId', (req, res) => {
  userId = req.params.userId;
  animeId = req.params.animeId;
  userToken = req.header('x-access-token')
  cacheKey = `getFriendsForAnimeById:${userId}`
  cachedBody = cache.get(cacheKey);

  AnimeService.getFriendsForAnimeById(userId, animeId, userToken).then((response) => {
    cache.put(cacheKey, response, 86400000) // the cache will be stored 24h
    res.json(response);
  }, function (err) {
    if (err == 401){
      res.status(401).json({
        error: 'Unauthorized. Authentication failed.'
    })
    }
    console.log(err);
    if (cachedBody) {
      console.log("Using cache...")
      res.json(cachedBody);
    }
  });
});

/**
 * @route GET /animes/:animeId/users
 * @group Anime - Operations about Anime
 * @param {string} animeId.query.required - identifier of the anime
 * @returns {object} 200 - An array with the users that have watched that anime
 * @returns {Error}  default - Unexpected error
 */
router.get(BASE_API_PATH + '/animes/:animeId/users', (req, res) => {
  animeId = req.params.animeId;
  cacheKey = `getUsersForAnimeById:${animeId}`
  cachedBody = cache.get(cacheKey);

  AnimeService.getUsersForAnimeById(animeId).then((response) => {
    cache.put(cacheKey, response, 86400000) // the cache will be stored 24h
    res.json(response);
  }, function (err) {
    console.log(err);
    if (cachedBody) {
      console.log("Using cache...")
      res.json(cachedBody);
    }
  });
});


/**
 * @route DELETE /user/animes/:id
 * @group Anime - Operations about Anime
 * @param {string} id.query.required - identifier of the anime
 * @returns {object} 200 - Anime was properly deleted from the user's list
 * @returns {object} 404 - There's no user with that anime in database
 * @returns {object} 401 - Invalid token
 * @returns {Error}  default - Unexpected error
 */
router.delete(BASE_API_PATH + '/user/animes/:animeId', (req, res) => {
  animeId = req.params.animeId;
  userId = req.body.user_id;
  userToken = req.header('x-access-token')


  AnimeService.deleteUserAnimeById(animeId, userId, userToken).then((response) => {
    res.sendStatus(200);
  }, function(err) {
    console.log(err);
    if (err == 401){
      res.status(401).json({
        error: 'Unauthorized. Authentication failed.'
    })
    } else if (err == 404) {
      res.status(404).json({
        error: 'The resource doesn\'t exists.'
    })
    }
  });
});

/**
 * @route POST /user/animes/:id
 * @group Anime - Operations about Anime
 * @param {string} anime.query.required - anime to save in the user'list
 * @returns {object} 200 - Anime was properly added to the user's list
 * @returns {object} 401 - Invalid token
 * @returns {Error}  default - Unexpected error
 */
router.post(BASE_API_PATH + '/user/animes/:animeId', (req, res) => {
  const anime = req.body;
  anime.anime_id = req.params.animeId;
  anime.user_id = req.body.user_id;
  anime.status = 'pending';
  anime.rating = '';
  userToken = req.header('x-access-token')

  AnimeService.postUserNewAnime(anime, userToken).then((response) =>{
    res.sendStatus(201);
  }, function(err) {
    console.log(err);
    if (err == 401){
      res.status(401).json({
        error: 'Unauthorized. Authentication failed.'
    })
    }
  });
});

/**
 * @route PUT /user/animes/:id
 * @group Anime - Operations about Anime
 * @param {string} anime.query.required - anime to update in the user's list
 * @returns {object} 200 - Anime was properly updated from the user's list
 * @returns {object} 404 - There's no user with that anime in database
 * @returns {object} 401 - Invalid token
 * @returns {Error}  default - Unexpected error
 */
router.put(BASE_API_PATH + '/user/animes/:animeId', (req, res) => {
  var anime = req.body;

  anime.anime_id = req.params.animeId;
  userToken = req.header('x-access-token')

  if (req.body.status) {
    anime.status = req.body.status;
  }

  if (req.body.rating) {
    anime.rating = req.body.rating;
  }

  AnimeService.updateUserAnimeById(anime, userToken).then((response) =>{
    res.sendStatus(200);
  }, function(err){
    console.log(err);
    if (err == 401){
      res.status(401).json({
        error: 'Unauthorized. Authentication failed.'
    })
    } else if (err == 404) {
      res.status(404).json({
        error: 'The resource doesn\'t exists.'
    })
    }
  });
});

module.exports = router;
