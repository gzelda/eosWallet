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
			//先做减法
			redis.setValue("restWallet",(restNum-1).toString(),function(data){
				if (data!="error"){
					db.queryUID(UID,function(data){

						switch(data)
						{
						    case "void":
						    	db.allocateEOSWallet(UID,function(data){
									console.log(data);
									if (data == "error"){
										redis.setValue("restWallet",restNum.toString(),function(data){
											//回滚做加法
											console.log("redis 回滚");
											resp.send(respJson.generateJson(0,3,"写库失败，找不到空余钱包，redis可能会有冲突情况"));
										})
									}
									else{
										db.getRow(UID,function(data){
											
											switch(data)
											{
											    case "void":
											    	resp.send(respJson.generateJson(0,4,"数据库插入成功后找不到，数据库会有重大问题"));
											        break;
											    case "error":
													//console.log("error db");
													redis.setValue("restWallet",restNum.toString(),function(data){
														//回滚做加法
														console.log("redis 回滚");
														resp.send(respJson.generateJson(0,4,"查库失败，后端数据库会有重大问题"));
													})
											        break;
											    default:
													var respData = {accountName:data.accountName};
													resp.send(respJson.generateJson(1,0,"分配成功",respData));
											}
										})
									}
								})
						        break;
						    case "error":
						    	redis.setValue("restWallet",restNum.toString(),function(data){
										//回滚做加法
										console.log("redis 回滚");
										resp.send(respJson.generateJson(0,5,"严重bug，后端私钥数据库UID重复，需要手动查看后端数据库"));
									});
						        break;
						    default:
						    	redis.setValue("restWallet",restNum.toString(),function(data){
									//回滚做加法
									console.log("redis 回滚");
									resp.send(respJson.generateJson(0,2,"该UID已经有EOS账户了"));
								})
						}
						console.log(data);					                              	
					});
				}
			})
			
		}	
	});
});

module.exports = router;
