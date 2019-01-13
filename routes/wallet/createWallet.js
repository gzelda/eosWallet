var express = require('express');
var eosApi = require('eosjs-api');
var Eos = require('eosjs');
var router = express.Router();
var bodyParser = require('body-parser');
var config = require('../utils/config.js');
var db = require('../utils/db.js');
var respJson = require('../utils/responseJson.js');
var utils = require('../utils/utils.js');
var ecc = require('eosjs-ecc');
var config = require('../utils/config.js');
var redis = require('../utils/redis.js');

function newAccountName(callback){
    var options = {
      httpEndpoint: config.chainServer, // default, null for cold-storage
      verbose: false, // API logging
      fetchConfiguration: {}
    };
    /**
     Other httpEndpoint's: https://www.eosdocs.io/resources/apiendpoints
     */
    var eos = eosApi(options);
    (function iterator(i){
        var accountName = utils.randomString(12);
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


router.post('/', function(req, resp, next) {
	var Num = req.body.Num;
	(function iterator(i){
     	db.getRow("SuperUID",function(data){

            switch(data)
            {
                case "void":
                    resp.send(respJson.generateJson(0,0,"SuperUID为空，请检查")); 
                    return;            
                    break;
                case "error":
                    resp.send(respJson.generateJson(0,1,"数据库查询失败，请检查数据库"));
                    return;                
                    break;
                default:
                    console.log(data);
                    var SuperPriKey = data.ownerPriKey;
                    var eos = Eos({
                    //payer的私钥
                        keyProvider: SuperPriKey,// private key
                        httpEndpoint: config.chainServer,
                        chainId: config.chainID
                    });
                    var payer = data.accountName;
                    var newUserName = newAccountName(function(name){
                        console.log(name);
                        var newUserName = name;
                        //var respData = {accountName:newUserName};
                        
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
                                stake_net_quantity: '0.2000 EOS',
                                stake_cpu_quantity: '0.2000 EOS',
                                transfer: 0
                            });

                        }).then(r => {
                                //链上创建用户成功，数据库存储
                                    console.log("result:"+r);
                                    
                                    db.InsertEOSWallet(newUserName,privateKey,newUserName,0,function(data){
                                        if (data !="error"){
                                            if (i < Num)
                                                iterator(i+1);
                                            else{
                                                redis.getValue("restWallet",function(data){
                                                    var amount = parseInt(data);
                                                    if (data!="error")
                                                        redis.setValue("restWallet",(amount+i).toString(),function(data){
                                                            if(data!="error"){
                                                                var respData = {"status":0,"amount":i};
                                                                resp.send(respJson.generateJson(1,0," 全部成功",respData));
                                                                return;
                                                            }
                                                            else{
                                                                resp.send(respJson.generateJson(0,0,"数据库钱包创建成功，但是redis 钱包剩余量设置失败"));
                                                                return;
                                                            }
                                                        })
                                                    else{
                                                        resp.send(respJson.generateJson(0,1,"redis 回滚失败"));
                                                        return;
                                                    }
                                                })  
                                            }
                                            //resp.send(respJson.generateJson(1,0,"创建成功",respData));
                                        }
                                        else{

                                            var respData = {"status":1,"amount":i};
                                            resp.send(respJson.generateJson(0,2,"链端创建部分成功，数据库返回结果错误，写库失败可能会丢失钱包，需要手动调整",respData));
                                            return;
                                        }
                                            //resp.send(respJson.generateJson(0,0,"写库失败"));
                                    })
                                    
                                
                                }).catch(e => {
                                    //返回失败结果
                                    redis.getValue("restWallet",function(data){
                                        var amount = parseInt(data);
                                        if (data!="error")
                                            redis.setValue("restWallet",(amount+i-1).toString(),function(data){
                                                if(data!="error"){
                                                    var respData = {"status":1,"amount":i-1,"message":e};
                                                    resp.send(respJson.generateJson(0,3,"部分成功，区块链返回结果错误，请关注超级账户余额 内存 及CPU百分比",respData));
                                                    return;
                                                }
                                                else{
                                                    resp.send(respJson.generateJson(0,4,"数据库钱包创建成功，但是redis 钱包剩余量设置失败"));
                                                    return;
                                                }
                                            })
                                        else{
                                            resp.send(respJson.generateJson(0,5,"redis 回滚失败"));
                                            return;
                                        }
                                    })  


                                    
                                });
                        })
                        
                    });
            }

                
        })
    })(1);
});

module.exports = router;
