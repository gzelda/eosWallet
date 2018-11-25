var express = require('express');
var eosApi = require('eosjs-api');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
	options = {
	  httpEndpoint: 'http://jungle2.cryptolions.io:80', // default, null for cold-storage
	  verbose: false, // API logging
	  logger: { // Default logging functions
	    log: console.log,
	    error: console.error
	  },
	  fetchConfiguration: {}
	}
	/**
	 Other httpEndpoint's: https://www.eosdocs.io/resources/apiendpoints
	 */
	var eos = eosApi(options);
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
	/*
	ram_quota：持有的RAM量，单位字节。
	net_limit：帐户的总额、可用额、已用额，单位字节。
	cpu_limit：CPU总量、可用CPU和已用CPU的总量，单位us。
	ram_usage：帐户使用的RAM量，单位字节。
	*/
});

module.exports = router;
