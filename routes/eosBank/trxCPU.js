var express = require('express');
var Eos = require('eosjs');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('../utils/config.js');
var db = require('../utils/db.js');
var respJson = require('../utils/responseJson.js');
var utils = require('../utils/utils.js');
/* GET home page. */


router.post('/', function(req, resp, next) {
	var UID = req.body.UID;



	//读db获取UID和私钥
	db.getRow(UID, function(data){
		console.log(data);
		switch(data)
		{
		    case "void":
		    	resp.send(respJson.generateJson(0,0,"此UID没有eos钱包"));
		        break;
		    case "error":
		    	console.log("error db");
				resp.send(respJson.generateJson(0,0,"读库失败"));
		        break;
		    default:
				var priKey = data.ownerPriKey;
				console.log(priKey);
				var userAccountName = data.accountName;
				console.log(priKey);
				var eos = Eos({
				//payer的私钥
				    keyProvider: priKey,// private key
				    httpEndpoint: config.chainServer,
				    chainId: config.chainID
				});
				var fromAccount = userAccountName;
				var toAccount = "cpubankeosio";
				//读redis TODO
				var eosAmount = "0.0200 EOS";
				var memo = "1d " + fromAccount +" cpu";
				console.log(fromAccount,toAccount,eosAmount,memo);
					//console.log(amount.toFixed(4) + " EOS");
				console.log("in");
			    eos.transaction(tr => {
			    	console.log("in2");
					tr.transfer(fromAccount,toAccount,eosAmount,memo);
				})
				.then(r => {
						//返回成功结果
						console.log(r);
						resp.send(respJson.generateJson(1,0,"购买成功",r));
					}).catch(e => {
						//返回失败结果
						console.log(e);
						resp.send(respJson.generateJson(0,0,"链端购买失败，请检查余额、cpu等相关参数",e));
					});

		}
	});
	
});

module.exports = router;
