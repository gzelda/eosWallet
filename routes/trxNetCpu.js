var express = require('express');
var router = express.Router();
var Eos = require('eosjs');
var bodyParser = require('body-parser');
var config = require('./utils/config.js');
var db = require('./utils/db.js');
var respJson = require('./utils/responseJson.js');
var utils = require('./utils/utils.js')


/*
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
*/
/* GET home page. */
router.post('/', function(req, resp, next) {

	var UID = req.body.UID;
	var CpuAmount = req.body.cpuAmount;
	var NetAmount = req.body.netAmount;
	var actionType = req.body.actionType;


	var EosCpuAmount = utils.amountConvert(CpuAmount);
	var EosNetAmount = utils.amountConvert(NetAmount);
	//console.log(typeof(CpuAmount),EosCpuAmount);
	//console.log(EosNetAmount);
	
	db.getEOSPri(UID,function(data){
		console.log(data);
        var priKey = data;
        var eos = Eos({
        //payer的私钥
            keyProvider: priKey,// private key
            httpEndpoint: config.ConfigInfo.p2pServer.jungle,
            chainId: config.ConfigInfo.chain.jungle
        });

        db.getEOSAccountName(UID,function(data){
        	console.log(data);
        	var payerAccount = data;
        	var receiverAccount = data;
        	utils.stakeNetCpu(eos,payerAccount,receiverAccount,EosNetAmount,EosCpuAmount,function(data){
        		console.log(data);
        		if (data!="error"){
        			resp.send(respJson.generateJson(1,0,data));
        		}
        		else
        			resp.send(respJson.generateJson(0,0,"质押失败"));
        	})
        })
        

	})

	
	//payer用户名
	//var payerAccount = "tygavingavin";
	//被质押的用户名
	//var receiverAccount = "eostesttest1";
	// 5HvJKiTh47yNbPHrtc7AqZk27jZpeM2TNmRvgnGRrNgnELJNvnm eostesttest1的私钥
	// EOS8K3QgUHshaTBFS6xGoKEgLzj39CYXHMV2oxaRZMnn7qwr7uWWA eostesttest1的公钥

	//通过网络协议来确定应该执行哪个
	/*
	var ramAmount = 4096;
	var netAmount = '1.0000 EOS';
	var cpuAmount = '1.0000 EOS';
	stakeCpu(cpuAmount);

	*/
    
	
});

module.exports = router;
