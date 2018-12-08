var express = require('express');
var eosApi = require('eosjs-api');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('./utils/config.js');
var db = require('./utils/db.js');
var respJson = require('./utils/responseJson.js');
var utils = require('./utils/utils.js');

/* GET home page. */
router.post('/', function(req, resp, next) {

	var UID = req.body.UID;

	var options = {
	  httpEndpoint: config.ConfigInfo.p2pServer.jungle, // default, null for cold-storage
	  verbose: false, // API logging
	  logger: { // Default logging functions
	    log: console.log,
	    error: console.error
	  },
	  fetchConfiguration: {}
	};
	/**
	 Other httpEndpoint's: https://www.eosdocs.io/resources/apiendpoints
	 */
	var eos = eosApi(options);
	db.getEOSAccountName(UID,function(data){
		var accountName = data;
		eos.getAccount(accountName,(error, result) =>
		{
			if(!error) {
				//console.log(result);
		  		resp.send(respJson.generateJson(1,0,result));
		  		console.log("in1");
			}
			else{
				resp.send(respJson.generateJson(0,0,error));
			}
		}
	);
	})
	/*
	eos.getAccount("eostesttest1",(error, result) =>
		{
			if(!error) {
				console.log(result);
		  		res.send(result);
			}else{
				res.send(error);
			}
		}
	);
	*/
	/*
	ram_quota：持有的RAM量，单位字节。
	net_limit：帐户的总额、可用额、已用额，单位字节。
	cpu_limit：CPU总量、可用CPU和已用CPU的总量，单位us。
	ram_usage：帐户使用的RAM量，单位字节。
	*/


});

module.exports = router;
