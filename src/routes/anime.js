const AnimeService = require('../services/animeService.js');
const express = require('express');
const router = express.Router();

// Gets anime list
// GET localhost:3000/customer
router.get('/animes', (req, res) => {
    page = req.query.page ? req.query.page : 1
    
    var filters = {
        "status" : req.query.status ? req.query.status : "",
        "genres" : req.query.genres ? req.query.genres : "",
        "text" : req.query.text ? req.query.text : "",
    }

    AnimeService.getAnimes(page, filters).then(function (response) {
        res.send(response.data);
    }, function (err) {
        console.log(err)
    })

});

router.get('/animes/:id', (req, res) => {
    anime_id = req.params.id
    
    AnimeService.getAnimeById(anime_id).then(function (response) {
        res.send(response.data);
    }, function (err) {
        console.log(err)
    })

});

module.exports = router;
