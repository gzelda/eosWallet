var constant = require('./constant.js');

var chainServer = constant.ConstantInfo.p2pServer.main;
var chainID = constant.ConstantInfo.chain.main;
var superAccount = constant.ConstantInfo.superAccount.main;



module.exports = {
	chainServer,
	chainID,
	superAccount
}
