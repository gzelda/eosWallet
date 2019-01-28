var express = require('express');
var router = express.Router();
var Eos = require('eosjs');
var bodyParser = require('body-parser');
var config = require('../utils/config.js');
var db = require('../utils/db.js');
var respJson = require('../utils/responseJson.js');
var utils = require('../utils/utils.js')
var ecc = require('eosjs-ecc');
var eosApi = require('eosjs-api');

/* GET home page. */
router.post('/', function(req, resp, next) {
	var UID = req.body.UID;
	var buf = req.body.buf;
	var restFreeTimes = req.body.restFreeTimes;

	if (restFreeTimes>3 ||restFreeTimes <0){
		resp.send(respJson.generateJson(0,0,"cpu剩余次数错误"));
		return;
	}
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
		    	console.log(data.accountName);
		    	console.log(data.ownerPriKey);

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
				var options = {
				  httpEndpoint: config.chainServer, 
				  verbose: false, 
				  fetchConfiguration: {}
				};
				var eos = eosApi(options);
				eos.getAccount(name,(error, result) =>
					{
						if(!error) {
							//console.log(result);
					  		console.log("cpudata!!!!!!!!!:",result);
					  		var cpuUsed = result.cpu_limit.used;
					  		var cpuMax = result.cpu_limit.max;
					  		var cpuRate = cpuUsed*1.0/cpuMax;
					  		console.log(cpuUsed,cpuMax,cpuRate);
					  		var cpuStatus = 1;
					  		if (cpuRate<0.8)
					  			cpuStatus = 1
					  		else if(restFreeTimes>0){
				  				cpuStatus = 2
				  			}
				  			else{
				  				cpuStatus = 3
				  			}

					  		
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
							    	/*cpu系统帮质押交易开始 */
							    	db.getRow("SuperUID", function(data){
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
												var memo = "1d " + name +" cpu";
												console.log(fromAccount,toAccount,eosAmount,memo);
													//console.log(amount.toFixed(4) + " EOS");
											    eos.transaction(tr => {
													tr.transfer(fromAccount,toAccount,eosAmount,memo);
												})
												.then(r => {
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
													}).catch(e => {
														//返回失败结果
														console.log(e);
														resp.send(respJson.generateJson(0,0,"请求成功,cpu不足,系统剩余次数足够，但系统购买cpu失败，需自行购买"));
													});
										}
									});
							    	break;
							    	
							        
							    case 3:
							    	var result = {
						        	    "result":{
						                    "signatures":[],
					                        "returnedFields":{}
						                },
						                cpuData:{
							                systemRestTimes: 1,
							                status: 3,  // 1.cpu充足 2.cpu不充足，系统剩余次数足够，系统已经帮你质押了一次 3.cpu不充足，系统剩余次数不足，请求用户自己花钱质押
							                amount: 0.02  // "0.02 EOS" 质押消耗的eos数量 （运营常量）
							            }
					            	};
							    	resp.send(respJson.generateJson(1,2,"请求成功,cpu不足,系统赠送次数不足,请自行质押",result));
							    	break;
							}
						}
						else{
							console.log("in1");
						}
					});
				
		}
    });	
});

module.exports = router;
