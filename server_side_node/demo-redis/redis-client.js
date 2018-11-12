const redis = require('redis');

const redisClient = redis.createClient(6379,'10.2.1.109');
redisClient.on("error", function (err) {
    console.log("Error " + err);
});
// redisClient.SUBSCRIBE('testing',(a,b)=>{
//     console.log(a,b);
// });
redisClient.PUBLISH('testing1','avergararg כעימדכעיגכעמד',(err,rep)=>{
    console.log(err, rep)
});
// redisClient.set("string key", "string val", redis.print);

redisClient.quit();
