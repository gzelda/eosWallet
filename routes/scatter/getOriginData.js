var express = require('express');
var router = express.Router();
var Eos = require('eosjs');
var bodyParser = require('body-parser');
var config = require('../utils/config.js');
var db = require('../utils/db.js');
var respJson = require('../utils/responseJson.js');
var utils = require('../utils/utils.js');
var Fcbuffer = require('fcbuffer');

/* GET home page. */
router.post('/', function(req, resp, next) {
	var data = req.body.data;

	//var EosRamAmount = utils.amountConvert(RamAmount);
	var eos = Eos({
        httpEndpoint:'https://mainnet.eoscanada.com',
        chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    });
	console.log(data);
	if (typeof data == "string"){
		data = JSON.parse(data);
		console.log(data,typeof(data));
	}
	
    eos.getAbi(data.actions[0].account)
	.then(res => {
	      console.log(res);
	      var origin_data = Fcbuffer.fromBuffer(
	        eos.fc.abiCache.abi(data.actions[0].account).structs[data.actions[0].name],
	        Buffer.from(data.actions[0].data, "hex")
	      );
	      resp.send(respJson.generateJson(1,0,"请求成功",origin_data));
	      console.log(origin_data);

	}).catch(e=>{
		resp.send(respJson.generateJson(0,0,"请求失败"));
	    console.log(e);
	})	
});

module.exports = router;
