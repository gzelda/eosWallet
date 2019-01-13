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
	console.log(UID);
	var options = {
	  httpEndpoint: config.chainServer, // default, null for cold-storage
	  verbose: false, // API logging
	  /*
	  logger: { // Default logging functions
	    log: console.log,
	    error: console.error
	  },
	  */
	  fetchConfiguration: {}
	};
	/**
	 Other httpEndpoint's: https://www.eosdocs.io/resources/apiendpoints
	 */
	var eos = eosApi(options);
	db.getRow(UID,function(data){
		switch(data)
		{
		    case "void":
		        resp.send(respJson.generateJson(0,0,"此UID无EOS钱包",error));
		        break;
		    case "error":
		        resp.send(respJson.generateJson(0,1,"数据库查询失败",error));
		        break;
		    default:
		        var accountName = data;
				console.log(accountName);
				eos.getAccount(accountName,(error, result) =>
					{
						if(!error) {
							//console.log(result);
					  		resp.send(respJson.generateJson(1,0,"请求成功",result));
					  		console.log("in1");
						}
						else{
							resp.send(respJson.generateJson(0,2,"请求链端服务器失败",error));
						}
					});
		}
		
	});
});

module.exports = router;
