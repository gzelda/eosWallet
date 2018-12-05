var mysql  = require('mysql');

var connection = mysql.createConnection({
host     : 'localhost',
user     : 'root',
password : 'root',
database : 'superWallet'
});

// 查找
function select() {
    connection.connect(function (err) {
        if (err) {
            console.error('error connecting:' + err.stack)
        }
        console.log('connected as id ' + connection.threadId);
    })

    connection.query('SELECT * FROM demo', function (error, results, fields) {
        if (error) throw error;
        console.log('The solution is:', results);
    });
    connection.end();
}

//添加
function add() {
    let post = {
        id: 1,
        name: 'Hello MySql',
        age: 20,
        time: Date.now(),
        temp: 'deom'
    };
    let query = connection.query("INSERT INTO demo SET ?", post, function (error, results, fields) {
        if (error) throw error;
    })
    console.log(query.sql); //INSERT INTO posts 'id'=1, 'title'='Hello MySQL'
}


//更新EOS表
function updateEOSINFO(UID,accountName,priKey) {

    connection.connect(function (err) {
        if (err) {
            console.error('error connecting:' + err.stack);
        }
        console.log('connected as id ' + connection.threadId);
    });

    var sqlOwnerPriKey = 'UPDATE EOSPriKeyWarehouse set ownerPriKey= ? where UID = ?';
    var sqlActivePriKey = 'UPDATE EOSPriKeyWarehouse set activePriKey= ? where UID = ?';
    var sqlAccountName = 'UPDATE EOSTOKEN set EOSAccountName = ? where UID = ?';
    ///需要插入多次

    connection.query(sqlOwnerPriKey, [priKey, UID], function (error, results, fields) {
        if (error) throw error;
        console.log('changed:' + results.changeRows + 'rows');
    });

    connection.query(sqlActivePriKey, [priKey, UID], function (error, results, fields) {
        if (error) throw error;
        console.log('changed:' + results.changeRows + 'rows');
    });

    connection.query(sqlAccountName, [accountName, UID], function (error, results, fields) {
        if (error) throw error;
        console.log('changed:' + results.changeRows + 'rows');
    });
    connection.end();
}

//获取address
function getEOSAccountName(UID){
	connection.connect(function (err) {
        if (err) {
            console.error('error connecting:' + err.stack);
        }
        console.log('connected as id ' + connection.threadId);
    });
	var sql = 'SELECT EOSAccountName FROM EOSTOKEN WHERE UID = ?';
	var address = "";
	connection.query(sql, [UID], function (error, result) {
        if (error) throw error;
        console.log('changed:' + result.changeRows + 'rows');
        return result;
    });
    
}

//获取address
function getEOSPri(UID){
	connection.connect(function (err) {
        if (err) {
            console.error('error connecting:' + err.stack);
        }
        console.log('connected as id ' + connection.threadId);
    });
	var sql = 'SELECT activePriKey FROM EOSPriKeyWarehouse WHERE UID = ?';
	connection.query(sql, [UID], function (error, result) {
        if (error) throw error;
        console.log('changed:' + result.changeRows + 'rows');
        return result;
    });
    
}

module.exports = {
 updateEOSINFO,
 getEOSPri,
 getEOSaddress
}