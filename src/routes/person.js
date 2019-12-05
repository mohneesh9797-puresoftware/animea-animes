let express = require('express')
let router = express.Router()

// QueryString => Query property on the request object
// localhost:3000/person?name=thomas
router.get('/person', (req, res) => {
    if (req.query.name) {
        res.send(`You have requested the person ${req.query.name}`);
    } else {
        res.send('You have requested a person');
    }
   
})

// Params property on the request object
router.get('/person/:name', (req, res) => {
    res.send(`You have requested the person ${req.params.name}`);
})

module.exports = router