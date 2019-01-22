var express = require('express');
var router = express.Router();
var Eos = require('eosjs');
var bodyParser = require('body-parser');
var config = require('../utils/config.js');
var db = require('../utils/db.js');
var respJson = require('../utils/responseJson.js');
var utils = require('../utils/utils.js')
var ecc = require('eosjs-ecc');

/* GET home page. */
router.post('/', function(req, resp, next) {
	var UID = req.body.UID;
	//库表查
	
	db.getRow(UID,function(data){
    	switch(data)
		{
		    case "void":
		    	resp.send(respJson.generateJson(0,0,"此用户名无EOS钱包"));
		        break;
		    case "error":
		    	resp.send(respJson.generateJson(0,1,"查库失败"));
		        break;
		    default:
		    	console.log(data.accountName);
		    	console.log(data.ownerPriKey);

		    	var publicKey = ecc.privateToPublic(data.ownerPriKey)
		    	var name = data.accountName;
		    	var result = {
	        	    "result":{
	                    "accounts":[
	                        {
	                            "authority":"active",
	                            "blockchain":"eos",
	                            "name":name,
	                            "publicKey":publicKey                       }
	                    ],
	                    "hash":"aljdfhbvadkfjnvapdifuh",
	                    "publicKey":"EOS8PadkjfhbvladjfhbvRenxofzjHmNminKPLCQzcVaGRh9PnPNpt4W4YmJa",
	                    "name":"MyIdentity",
	                    "kyc":false
	                }
            	};
            	resp.send(respJson.generateJson(1,0,"请求成功",result));
		}
    });
		
});

module.exports = router;
