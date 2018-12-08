var express = require('express');
var router = express.Router();
var Eos = require('eosjs');
var ecc = require('eosjs-ecc');
var bodyParser = require('body-parser');
var config = require('./utils/config.js');
var db = require('./utils/db.js');
var respJson = require('./utils/responseJson.js');

/* GET home page. */

function newAccountName(UID){
    return "eostesttes11";
}


router.post('/', function(req, resp, next) {
	
    var UID = req.body.UID;

    db.getEOSPri("SuperUID",function(data){
        console.log(data);
        var SuperPriKey = data;
        var eos = Eos({
        //payer的私钥
            keyProvider: SuperPriKey,// private key
            httpEndpoint: config.ConfigInfo.p2pServer.jungle,
            chainId: config.ConfigInfo.chain.jungle
        });
        var payer = "tygavingavin";
        var newUserName = newAccountName(UID);

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
                    db.updateEOSINFO(UID,newUserName,privateKey,function(data){
                        if (data !="error"){
                            resp.send(respJson.generateJson(1,0,""));
                        }
                        else
                            resp.send(respJson.generateJson(0,0,"写库失败"));
                    })
                    
                    }).catch(e => {
                        //返回失败结果
                        console.log("err:"+e);
                        resp.send(respJson.generateJson(0,0,"用户已经存在"));
                    });
        })
    })
    /*
	var eos = Eos({
        //payer的私钥
	    keyProvider: '5JjEmJ5aT4kXvJATdc7jvh2TD8VijVeCxMik72EVdAeYWMawdgq',// private key
	    httpEndpoint: 'http://jungle2.cryptolions.io:80',
	    chainId: chain.jungle,
	});
    //payer用户名
	var payer = "tygavingavin";
    //动态生成随机用户名
	var newUserName = "eostesttest1";

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
            console.log(r);
            res.send(r);
        }).catch(e => {
            //返回失败结果
            console.log(e);
            res.send(e);
        });
    })
*/
    /*
	
        */
});

module.exports = router;
