var express = require('express');
var router = express.Router();
var Eos = require('eosjs');



/* GET home page. */
router.get('/', function(req, res, next) {
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
	var payer = "tygavingavin";
	//被质押的用户名
	var username = "eostesttest1";
	// 5HvJKiTh47yNbPHrtc7AqZk27jZpeM2TNmRvgnGRrNgnELJNvnm eostesttest1的私钥
	// EOS8K3QgUHshaTBFS6xGoKEgLzj39CYXHMV2oxaRZMnn7qwr7uWWA eostesttest1的公钥

	//通过网络协议来确定应该执行哪个
	var ramAmount = 4096;
	var netAmount = '1.0000 EOS';
	var cpuAmount = '1.0000 EOS';
	stakeCpu(cpuAmount);

	function buyRam(ramAmount){
		eos.transaction(tr => {

		tr.buyrambytes({
		    payer: payer,
		    receiver: username,
		    bytes: ramAmount
			});
		}).then(r => {
			//返回成功结果
			console.log(r);
			res.send(r);
		}).catch(e => {
			//返回失败结果
			console.log(e);
			res.send(e);
		});
	}

	function stakeNet(netAmount){
		eos.transaction(tr => {
			tr.delegatebw({
		    from: payer,
		    receiver: username,
		    stake_net_quantity: netAmount,
		    stake_cpu_quantity: '0.0000 EOS',
		    transfer: 0
			});
		}).then(r => {
			//返回成功结果
			console.log(r);
			res.send(r);
		}).catch(e => {
			//返回失败结果
			console.log(e);
			res.send(e);
		});
	}

	function stakeCpu(cpuAmount){
		eos.transaction(tr => {
			tr.delegatebw({
		    from: payer,
		    receiver: username,
		    stake_net_quantity: '0.0000 EOS',
		    stake_cpu_quantity: cpuAmount,
		    transfer: 0
			});
		}).then(r => {
			//返回成功结果
			console.log(r);
			res.send(r);
		}).catch(e => {
			//返回失败结果
			console.log(e);
			res.send(e);
		});
	}
    
	
});

module.exports = router;
