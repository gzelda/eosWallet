var mysql  = require('mysql');


var pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'superWallet'
});


function SQLquery(sql,param,callback){
    pool.getConnection(function(err,conn){
        if(err){
            console.log("SQLerr")
            callback("error");
        }else{
            console.log("SQLsuccess")
            conn.query(sql,param,function(qerr,vals,fields){
                //释放连接
                conn.release();
                //事件驱动回调
                //console.log(qerr,vals,fields)
                callback(vals);
            });
        }
    });
    /*
    connection.query(sql, param, function (error, results, fields) {
        if (error) {
            console.log("error");
            callback("error");
        }
        else{
            console.log('sql:' + results);
            callback(results);
        }
        
    });
    */
}

//修改
function updateEOSINFO (UID,accountName,priKey,callback) {

    
    var sqlPriKey = 'INSERT INTO EOSPriKeyWarehouse(UID,activePriKey,ownerPrikey) values(?,?,?)';
    var sqlAddress = 'UPDATE EOSTOKEN set EOSAccountName = ? where UID = ?';

    var res1 = SQLquery(sqlPriKey,[ UID,priKey,priKey],function(data){
        console.log('data:' + data);
        if (data!="error"){
            var res2 = SQLquery(sqlAddress,[accountName, UID],function(data){
                console.log(data);
                if (data!="error"){
                    callback("ok"); 
                }
                else
                    callback("error");
            });
        }
        else{
            callback("error");  
        }
        
    });
}


//获取address
function getEOSAccountName (UID,callback){
    
    var sql = 'SELECT EOSAccountName FROM EOSTOKEN WHERE UID = ?';

    
    SQLquery(sql,[UID],function(data){
        console.log('data:' + data);
        if (data!= "error"){

            callback(data[0].EOSAccountName);
        }
    })

    /*
    connection.query(sql, [UID], function (error, result) {
        if (error) {
            console.log(error);
            throw error;
        }
        else{
            console.log('sql:' + result[0].ETHAddress);
            //console.log(UID + 'gtygtygty(((((((((('+JSON.stringfy(result))
            //result;
            callback(result[0].ETHAddress);
        }
        
    });

    connection.end();
    */
}


//获取address
function getEOSPri(UID,callback){

    var sql = 'SELECT activePriKey FROM EOSPriKeyWarehouse WHERE UID = ?';
    /*
    connection.query(sql, [UID], function (error, result) {
        if (error) throw error;
        console.log('sql:' + result);
        callback(result[0].priKey);
    });
    */

    SQLquery(sql,[UID],function(data){
        console.log('data:' + data);
        if (data!= ""){

            callback(data[0].activePriKey);
        }
        else
        {
            callback("error");
        }
    })
    
}

module.exports = {
 getEOSPri,
 getEOSAccountName,
 updateEOSINFO
}