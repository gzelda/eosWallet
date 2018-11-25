var express = require('express');
var eosApi = require('eosjs-api');
var router = express.Router();


/* GET home page. */
router.get('/', function(req, res, next) {
    chain = {
	    main: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // main network
	    jungle: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473', // jungle testnet
	    sys: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f' // local developer
	};

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
	console.log(eos);
	eos.getInfo((error, result) => 
		{ 
			if(!error) {
				console.log(result);
		  		res.send(result);
			}else{
				res.send(error);
			}
		}
	);
	
});

module.exports = router;
