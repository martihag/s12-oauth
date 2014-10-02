'use strict';

var express = require('express');
var controller = require('./auth.controller');

var router = express.Router();

router.get('/twitter', controller.twitter);

module.exports = router;
