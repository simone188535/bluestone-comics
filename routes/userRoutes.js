const express = require('express');

const router = express.Router();

// define the home page route
router
    .route('/')
    .get(function (req, res) {
        res.send('Get a random book')
    })

module.exports = router;