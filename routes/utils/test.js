var redis = require("redis"),
    RDS_PORT = 6379,
    RDS_HOST = '127.0.0.1',
    RDS_PWD = 'tygavingavin',
    RDS_OPTS = {auth_pass:RDS_PWD},
    client = redis.createClient(RDS_PORT,RDS_HOST,RDS_OPTS);

function getRedis(){
    client.on('connect',function(){
        //client.set('author', 'Wilson',redis.print);
        //client.set(rest)
        client.get('gty', function(err,res){
            if (err!= null)
                console.log("error:",err);
            else
                console.log("result:",res);
        });
    });
}

getRedis();
