var express = require('express');
var eosApi = require('eosjs-api');
var Eos = require('eosjs');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('./utils/config.js');
var db = require('./utils/db.js');
var respJson = require('./utils/responseJson.js');
var utils = require('./utils/utils.js');
var ecc = require('eosjs-ecc');
/* GET home page. */

function newAccountName(newName,callback){
    var options = {
      httpEndpoint: config.ConfigInfo.p2pServer.jungle, // default, null for cold-storage
      verbose: false, // API logging
      fetchConfiguration: {}
    };
    /**
     Other httpEndpoint's: https://www.eosdocs.io/resources/apiendpoints
     */
    var eos = eosApi(options);
    (function iterator(i){
        var accountName = newName;
        console.log(accountName);
        utils.getAccountExists(eos,accountName,function(data){
            if (data == "ok"){
                console.log("exists:", data);
                iterator(i+1);
            }
            else
            {
                console.log("not exists:",data);
                callback(accountName);
                return;
            }
        });
    })(0);
    
    
}

router.get('/', function(req, resp, next) {
	
	var options = {
	  httpEndpoint: config.ConfigInfo.p2pServer.main, // default, null for cold-storage
	  verbose: false, // API logging
	  fetchConfiguration: {}
	};
	var SuperPriKey = "data";
	var eos = Eos({
	//payer的私钥
	    keyProvider: SuperPriKey,// private key
	    httpEndpoint: config.ConfigInfo.p2pServer.main,
	    chainId: config.ConfigInfo.chain.main
	});
	var payer = "zjugtyzjugty";
	var newUserName = newAccountName("mark11111111",function(name){
	    console.log(name);
	    var newUserName = name;
	    
	    ecc.randomKey().then(privateKey => {
	    //随机私钥
	    console.log('Private Key:\t', privateKey) // wif
	    //随机公钥
	    console.log('Public Key:\t', ecc.privateToPublic(privateKey)) // EOSkey...

	    //获取公钥
	    var pubKey = ecc.privateToPublic(privateKey);
	    //新建账户
	    eos.transaction(tr => {
	        tr.newaccount({
	            creator: payer,
	            name: newUserName,
	            owner: pubKey,
	            active: pubKey
	        });

	        tr.buyrambytes({
	            payer: payer,
	            receiver: newUserName,
	            bytes: 4096
	        });

	        tr.delegatebw({
	            from: payer,
	            receiver: newUserName,
	            stake_net_quantity: '1.0000 EOS',
	            stake_cpu_quantity: '1.0000 EOS',
	            transfer: 0
	        });

	    }).then(r => {
	            //返回成功结果
	            console.log("result:"+r);
	            resp.send(respJson.generateJson(1,0,""));
	            }).catch(e => {
	                //返回失败结果
	                console.log("err:"+e);
	                resp.send(respJson.generateJson(0,0,"用户已经存在"));
	            });
	    })
	    
	});
	
});

module.exports = router;
