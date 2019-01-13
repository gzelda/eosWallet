var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('../utils/config.js');
var db = require('../utils/db.js');
var respJson = require('../utils/responseJson.js');
var utils = require('../utils/utils.js');
var redis = require('../utils/redis.js');

/* GET home page. */
router.post('/', function(req, resp, next) {
	var UID = req.body.UID;
	console.log(UID);
	redis.getValue("restWallet",function(data){
		console.log(data,typeof(data));
		var restNum;
		if (typeof(data) == "string"){
			restNum = parseInt(data);
		}
		console.log(restNum,typeof(restNum));
		if (restNum <= 0){
			resp.send(respJson.generateJson(0,1,"缓存显示钱包数量不足"));
		}
		else{
			redis.setValue("restWallet",(restNum-1).toString(),function(data){
				if (data!="error"){
					db.queryUID(UID,function(data){
						console.log(data);
						if (data == 1){
							redis.setValue("restWallet",restNum.toString(),function(data){
								console.log("redis 回滚");
								resp.send(respJson.generateJson(0,2,"该UID已经有EOS账户了"));
							})
						}
						else if (data == 0){
							db.updateEOSWallet(UID,function(data){
								console.log(data);
								if (data == "error"){
									redis.setValue("restWallet",restNum.toString(),function(data){
										console.log("redis 回滚");
										resp.send(respJson.generateJson(0,3,"写库失败，无空余钱包"));
									})
									
								}
								else{
									db.getRow(UID,function(data){
										console.log(data);
										if (data != "error"){
											console.log(data.accountName);
											var respData = {accountName:data.accountName};
											resp.send(respJson.generateJson(1,0,"分配成功",respData));
										}
										else{
											console.log("error db");
											redis.setValue("restWallet",restNum.toString(),function(data){
												console.log("redis 回滚");
												resp.send(respJson.generateJson(0,4,"查库失败，可能会有重大问题"));
											})
											
										}
									})
								}
							})
						}	
						else{
							redis.setValue("restWallet",restNum.toString(),function(data){
												console.log("redis 回滚");
												resp.send(respJson.generateJson(0,5,"私钥数据库UID重复，需要手动查看后端数据库"));
											});
						}

							                              	
					});
				}
			})
			
		}	
	});
});

module.exports = router;
