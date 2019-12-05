const AnimeService = require("../services/animeService.js");
let express = require('express')
let router = express.Router()

// Gets anime list
// GET localhost:3000/customer
router.get('/animes', (req, res) => {
    res.send("test")
})

module.exports = router