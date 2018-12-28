var mysql  = require('mysql');


var pool = mysql.createPool({
    host: 'nodeinstance.couot2aumoqo.us-east-2.rds.amazonaws.com',
    user: 'tygavingavin',
    password: 'tygavinmysql',
    database: 'KeyWarehouse'
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
function InsertEOSKey (UID,accountName,priKey,accountName,status,callback) {
    var sqlPriKey = 'INSERT INTO EOSPriKeyWarehouse(UID,activePriKey,ownerPrikey,accountName,status) values(?,?,?,?,?)';   
    var res = SQLquery(sqlPriKey,[ UID,priKey,priKey,accountName,status],function(data){
        console.log('data:' + data);
        if (data!="error"){
            callback("ok"); 
        }
        else{
            callback("error");  
        }
        
    });
}

//查询UID是否存在
function queryUID (UID,callback) {
    var sqlPriKey = 'SELECT * FROM EOSPriKeyWarehouse WHERE UID = ?';
    var res = SQLquery(sqlPriKey,[UID],function(data){
        console.log('data:' + JSON.stringify(data));
        console.log('data:' + data.length);
        if (data!="error"){
            callback(data.length);
        }
        else{
            callback("error");  
        }
        
    });
}

//获取address
function getEOSAccountName (UID,callback){
    var sql = 'SELECT accountName FROM EOSPriKeyWarehouse WHERE UID = ?';
    SQLquery(sql,[UID],function(data){
        console.log('data:' + data.length);
        
        if (data!= "error"){
            if (data.length == 0)
                callback("error");
            callback(data[0].accountName);
        }
        else{
            callback("error");
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

//获取priKey
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
     InsertEOSKey,
     queryUID
}