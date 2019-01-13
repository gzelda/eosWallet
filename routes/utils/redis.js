var redis = require("redis"),
    RDS_PORT = 6379,
    RDS_HOST = '3.17.79.21',
    RDS_PWD = 'tygavingavin',
    RDS_OPTS = {auth_pass:RDS_PWD},
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);



client.on('error',function(error){
        console.log(error);
});

function getValue(key,callback){
    console.log("in");
    client.get(key, function(err,res){
            console.log("got it");
            if (err != null)
            {
                console.log("error:",err);
                callback("error");
            }    
            else
            {
                console.log("result:",res);
                callback(res);
            }
                
            
    });

    
}

function setValue(key,value,callback){
    client.set(key,value, function(err,res){
            if (err!= null)
            {
                console.log("error:",err);
                callback("error");
            }    
            else
            {
                console.log("result:",res);
                callback(res);
            }
                
            
    });
}
/*
setValue("restWallet",19,function(data){
    console.log(data);
})
*/

module.exports = {
    getValue,
    setValue
}