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
	var buf = req.body.buf;
	var restFreeTimes = req.body.restFreeTimes;

	
	if (typeof(buf) == "string"){
		buf = JSON.parse(buf);
	}

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
		    	config.log(data.accountName);
		    	config.log(data.ownerPriKey);

		    	var publicKey = ecc.privateToPublic(data.ownerPriKey)
		    	var name = data.accountName;
		    	var priv = data.ownerPriKey;
		    	let signature = ecc.sign(Buffer.from(buf, 'utf8'), priv);
				console.log(signature);
				//
				//cpu处理模块：
				//1.先计算出用户cpu比例
				//2.比例如果不满足80%则看系统剩余次数
				//3.系统剩余次数足够的话系统帮购买
				//4.系统剩余次数不足够的话不返回signature
				var cpuStatus = 1;

				//
				

			    switch(cpuStatus)
				{
				    case 1:
				    	var result = {
			        	    "result":{
			                    "signatures":[signature],
		                        "returnedFields":{}
			                },
			                cpuData:{
				                systemRestTimes: 1,
				                status: 1,  // 1.cpu充足 2.cpu不充足，系统剩余次数足够，系统已经帮你质押了一次 3.cpu不充足，系统剩余次数不足，请求用户自己花钱质押
				                amount: 0.02  // "0.02 EOS" 质押消耗的eos数量 （运营常量）
				            }
		            	};
				    	resp.send(respJson.generateJson(1,0,"请求成功,cpu充足",result));
				        break;
				    case 2:
				    	var result = {
			        	    "result":{
			                    "signatures":[signature],
		                        "returnedFields":{}
			                },
			                cpuData:{
				                systemRestTimes: 1,
				                status: 2,  // 1.cpu充足 2.cpu不充足，系统剩余次数足够，系统已经帮你质押了一次 3.cpu不充足，系统剩余次数不足，请求用户自己花钱质押
				                amount: 0.02  // "0.02 EOS" 质押消耗的eos数量 （运营常量）
				            }
		            	};
				    	resp.send(respJson.generateJson(1,1,"请求成功,cpu不足,系统帮质押一次",result));
				        break;
				    case 3:
				    	var result = {
			        	    "result":{
			                    "signatures":[],
		                        "returnedFields":{}
			                },
			                cpuData:{
				                systemRestTimes: 1,
				                status: 2,  // 1.cpu充足 2.cpu不充足，系统剩余次数足够，系统已经帮你质押了一次 3.cpu不充足，系统剩余次数不足，请求用户自己花钱质押
				                amount: 0.02  // "0.02 EOS" 质押消耗的eos数量 （运营常量）
				            }
		            	};
				    	resp.send(respJson.generateJson(1,2,"请求成功,cpu不足,系统赠送次数相同",result));
				    	break;
				}
		}
    });	
});

module.exports = router;
