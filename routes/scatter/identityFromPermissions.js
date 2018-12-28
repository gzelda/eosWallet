var express = require('express');
var router = express.Router();
var Eos = require('eosjs');
var bodyParser = require('body-parser');
var config = require('../utils/config.js');
var db = require('../utils/db.js');
var respJson = require('../utils/responseJson.js');
var utils = require('../utils/utils.js')

/* GET home page. */
router.post('/', function(req, resp, next) {
	var UID = req.body.UID;
	//库表查
	var name = "gtygavintest";
	var publicKey = "EOS8ivzcSu6Co6hJXaTfPjGyXUX2jnrK5VKrsQ9DXhKcBPF9TZj8p";
	
	var result = {
	        	    "result":{
	                    "accounts":[
	                        {
	                            "authority":"active",
	                            "blockchain":"eos",
	                            "name":name,
	                            "publicKey":publicKey
	                        }
	                    ],
	                }
            	};
    resp.send(respJson.generateJson(1,0,"请求成功",result));

	//var EosRamAmount = utils.amountConvert(RamAmount);


	
});

module.exports = router;
