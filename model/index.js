const MongoClient = require('mongodb').MongoClient;
//const assert = require('assert');
// Connection URL
const url = 'mongodb://localhost:27017';
const dbName='project';

//数据库链接方法封装
function connect(callback){
    MongoClient.connect(url, function(err,client){
        if (err){
            console.log('failed connect',err);
        }else {
            var db=client.db(dbName);
            callback && callback(db)
            client.close()
        }
    })
}

module.exports={
    connect
};