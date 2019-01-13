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

function initialize(){
    setValue("cpuSystem",0.02,function(data){
        console.log(data);
    })
    setValue("cpuUser",0.02,function(data){
        console.log(data);
    })
    setValue("ramBytes",4096,function(data){
        console.log(data);
    })
    setValue("netAmount",0.02,function(data){
        console.log(data);
    })
    setValue("cpuAmount",0.02,function(data){
        console.log(data);
    })
    setValue("restWallet",20,function(data){
        console.log(data);
})
}
/*
initialize();
*/


module.exports = {
    getValue,
    setValue
}