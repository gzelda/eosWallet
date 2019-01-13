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
	db.getRow(UID,function(data){

		switch(data)
		{
		    case "void":
		    	resp.send(respJson.generateJson(0,0,"此UID无EOS钱包，无需回收"));
		        break;
		    case "error":
		    	resp.send(respJson.generateJson(0,1,"读库失败"));
		        break;
		    default:
		    	db.recycleEOSWallet(UID,function(data){
		    		if (data!="error"){
		    			resp.send(respJson.generateJson(1,0,"回收成功"));
		    		}
		    		else{
		    			resp.send(respJson.generateJson(0,2,"回收失败"));
		    		}
		    	})
		}

	})
});

module.exports = router;
