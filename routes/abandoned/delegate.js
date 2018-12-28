var express = require('express');
var router = express.Router();
var Eos = require('eosjs');
var bodyParser = require('body-parser');
var config = require('../utils/config.js');
var db = require('../utils/db.js');
var respJson = require('../utils/responseJson.js');


function buyRam(eos,payerAccount,receiverAccount,ramAmount,callback){
		eos.transaction(tr => {

		tr.buyrambytes({
		    payer: payerAccount,
		    receiver: receiverAccount,
		    bytes: ramAmount
			});
		}).then(r => {
			//返回成功结果
			console.log(r);
			callback("ok");
		}).catch(e => {
			//返回失败结果
			console.log(e);
			callback("error");
		});
	}

	function stakeNet(eos,payerAccount,receiverAccount,netAmount,callback){
		eos.transaction(tr => {
			tr.delegatebw({
		    from: payerAccount,
		    receiver: receiverAccount,
		    stake_net_quantity: netAmount,
		    stake_cpu_quantity: '0.0000 EOS',
		    transfer: 0
			});
		}).then(r => {
			//返回成功结果
			console.log(r);
			callback("ok");
		}).catch(e => {
			//返回失败结果
			console.log(e);
			callback("error");
		});
	}

	function stakeCpu(eos,payerAccount,receiverAccount,cpuAmount,callback){
		eos.transaction(tr => {
			tr.delegatebw({
		    from: payerAccount,
		    receiver: receiverAccount,
		    stake_net_quantity: '0.0000 EOS',
		    stake_cpu_quantity: cpuAmount,
		    transfer: 0
			});
		}).then(r => {
			//返回成功结果
			console.log(r);
			callback("ok");
		}).catch(e => {
			//返回失败结果
			console.log(e);
			callback("error");
		});
	}

/* GET home page. */
router.post('/', function(req, res, next) {
	chain = {
	    main: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906', // main network
	    jungle: 'e70aaab8997e1dfce58fbfac80cbbb8fecec7b99cf982a9444273cbc64c41473', // jungle testnet
	    sys: 'cf057bbfb72640471fd910bcb67639c22df9f92470936cddc1ade0e2f2e7dc4f' // local developer
	};
	let eos = Eos({
	    //payer的私钥
	    keyProvider: '5JjEmJ5aT4kXvJATdc7jvh2TD8VijVeCxMik72EVdAeYWMawdgq',// private key
	    httpEndpoint: 'http://jungle2.cryptolions.io:80',
	    chainId: chain.jungle,
	});
	//payer用户名
	var payerAccount = "tygavingavin";
	//被质押的用户名
	var receiverAccount = "eostesttest1";
	// 5HvJKiTh47yNbPHrtc7AqZk27jZpeM2TNmRvgnGRrNgnELJNvnm eostesttest1的私钥
	// EOS8K3QgUHshaTBFS6xGoKEgLzj39CYXHMV2oxaRZMnn7qwr7uWWA eostesttest1的公钥

	//通过网络协议来确定应该执行哪个
	var ramAmount = 4096;
	var netAmount = '1.0000 EOS';
	var cpuAmount = '1.0000 EOS';
	stakeCpu(cpuAmount);

	
    
	
});

module.exports = router;
