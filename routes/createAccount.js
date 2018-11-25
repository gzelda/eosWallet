var express = require('express');
var router = express.Router();
var Eos = require('eosjs');
var ecc = require('eosjs-ecc')
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
    //动态生成随机用户名
	var newUserName = "eostesttest1";

    var newKey;
    ecc.randomKey().then(privateKey => {
        //随机私钥
        console.log('Private Key:\t', privateKey) // wif
        newKey = privateKey;
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
            console.log(r);
            res.send(r);
        }).catch(e => {
            //返回失败结果
            console.log(e);
            res.send(e);
        });
    })

    /*
	
        */
});

module.exports = router;
