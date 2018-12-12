var express = require('express');
var eosApi = require('eosjs-api');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('./utils/config.js');
var db = require('./utils/db.js');
var respJson = require('./utils/responseJson.js');
var utils = require('./utils/utils.js');
/* GET home page. */
router.get('/', function(req, resp, next) {
	
  var options = {
	  httpEndpoint: config.ConfigInfo.p2pServer.jungle, // default, null for cold-storage
	  verbose: false, // API logging
	  logger: { // Default logging functions
	    log: console.log,
	    error: console.error
	  },
	  fetchConfiguration: {}
	};

	var eos = eosApi(options);
	var accountName = utils.randomString(12);
	utils.getAccountExists(eos,accountName,function(data){
		if (data == "ok"){
			console.log("exists:", data);
		}
		else
		{
			console.log("not exists:",data);
		}
	});
	
	
});

module.exports = router;
