var mysql  = require('mysql');


var pool = mysql.createPool({
    connectionLimit : 1000,
    connectTimeout  : 60 * 60 * 1000,
    aquireTimeout   : 60 * 60 * 1000,
    timeout         : 60 * 60 * 1000,
    host: 'bgskeywarehouse.cqlq5eld8w6d.us-east-2.rds.amazonaws.com',
    user: 'bgsGameRDS123',
    password: 'bgsGameRDSP+WD',
    database: 'KeyWarehouse'
});



function SQLquery(sql,param,callback){
    pool.getConnection(function(err,conn){
        if(err){
            console.log("SQLerr:",err)
            callback("error");
        }else{
            console.log("SQLsuccess")
            conn.query(sql,param,function(qerr,vals,fields){
                //释放连接
                pool.releaseConnection(conn);
                //conn.release();
                //事件驱动回调
                //console.log(qerr,vals,fields)
                
                if (vals == undefined)
                    callback("error");
                else{
                    console.log("length:",vals.length);
                    callback(vals);
                }
                
                
                
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

//插入
function InsertEOSKey (UID,accountName,priKey,accountName,status,callback) {
    var sqlPriKey = 'INSERT INTO EOSPriKeyWarehouse(UID,activePriKey,ownerPrikey,accountName,status) values(?,?,?,?,?)';   
    var res = SQLquery(sqlPriKey,[ UID,priKey,priKey,accountName,status],function(data){
        console.log('data:' + data);
        if (data!="error"){
            callback(data); 
        }
        else{
            callback("error");  
        }
        
    });
}

//插入
function InsertEOSWallet (accountName,priKey,accountName,status,callback) {
    var sqlPriKey = 'INSERT INTO EOSPriKeyWarehouse(activePriKey,ownerPrikey,accountName,status) values(?,?,?,?)';   
    var res = SQLquery(sqlPriKey,[ priKey,priKey,accountName,status],function(data){
        console.log('data:' + data);
        if (data!="error"){
            callback(data); 
        }
        else{
            callback("error");  
        }
        
    });
}

//分配
function allocateEOSWallet (UID,callback) {
    var sql = 'UPDATE EOSPriKeyWarehouse INNER JOIN(SELECT * from EOSPriKeyWarehouse where ISNULL(UID) LIMIT 1) a SET EOSPriKeyWarehouse.UID = ?,EOSPriKeyWarehouse.status = 1 WHERE EOSPriKeyWarehouse.accountName = a.accountName;';   
    var res = SQLquery(sql,[UID],function(data){
        console.log('data:' + data);
        if (data!="error"){
            callback(data); 
        }
        else{
            callback("error");  
        }
        
    });
}

//回收
function recycleEOSWallet (UID,callback) {
    var sql = 'UPDATE EOSPriKeyWarehouse SET UID = null,status = 0 WHERE UID = ?;';   
    var res = SQLquery(sql,[UID],function(data){
        console.log('data:' + data);
        if (data!="error"){
            callback(data); 
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
            if (data.length == 0)
                callback("void");
            else
                callback(data[0]);
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
                callback("void");
            else
                callback(data[0].accountName);
        }
        else{
            callback("error");
        }       
    })
}

//获取priKey
function getEOSPri(UID,callback){
    var sql = 'SELECT activePriKey FROM EOSPriKeyWarehouse WHERE UID = ?';
    SQLquery(sql,[UID],function(data){
        console.log('data:' + data);
        if (data!= "error"){
            if (data.length == 0)
                callback("void");
            else
                callback(data[0].activePriKey);
        }
        else
        {
            callback("error");
        }
    })
    
}

//获取priKey
function getRow(UID,callback){
    var sql = 'SELECT * FROM EOSPriKeyWarehouse WHERE UID = ?';
    SQLquery(sql,[UID],function(data){
        console.log('data:' + data);
        if (data!= "error"){
            if (data.length == 0)
                callback("void");
            else
                {   
                    console.log(data[0]);
                    callback(data[0]);
                }
                
            
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
     InsertEOSWallet,
     allocateEOSWallet,
     recycleEOSWallet,
     queryUID,
     getRow
}