var express = require('express');
var router = express.Router();
var config = require('./utils/config.js');
/* GET home page. */
router.get('/', function(req, res, next) {

  res.send(config.ConfigInfo.chain.main);
});

module.exports = router;
