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
      httpEndpoint: 'https://api.eosnewyork.io', // default, null for cold-storage
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
	/*
	var options = {
	  httpEndpoint: 'https://api.eosnewyork.io', // default, null for cold-storage
	  verbose: false, // API logging
	  fetchConfiguration: {}
	};
	var SuperPriKey = "data";
	var eos = Eos({
	//payer的私钥
	    keyProvider: ,// private key
	    httpEndpoint: 'https://api.eosnewyork.io',
	    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
	});
	var payer = "zjugtyzjugty";
	var newUserName = newAccountName("gtygavintest",function(name){
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
	            stake_net_quantity: '5.0000 EOS',
	            stake_cpu_quantity: '5.0000 EOS',
	            transfer: 10
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
	*/
	var eos = Eos({
	//payer的私钥
	    keyProvider: aaa,// private key
	    httpEndpoint: 'https://api.eosnewyork.io',
	    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
	});
	var fromAccount = "zjugtyzjugty";
	var toAccount = "gtygavintest";
	var eosAmount = "10.0000 EOS";
	var memo = "program test";
		//console.log(amount.toFixed(4) + " EOS");
	console.log("in");
        eos.transaction(tr => {
			tr.transfer(fromAccount,toAccount,eosAmount,memo);
		}).then(r => {
				//返回成功结果
				console.log(r);
				resp.send(respJson.generateJson(1,0,r));
			}).catch(e => {
				//返回失败结果
				console.log(e);
				resp.send(respJson.generateJson(0,0,e));
			});
	
});

module.exports = router;
