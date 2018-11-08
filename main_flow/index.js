const tlApiClient = require('../demo-tlapi-client/tlApiClient');

var client = tlApiClient.createTLClient('testlink2.local',80,path = '/lib/api/xmlrpc/v1/custom_xmlrpc.php');

client.sendRequest('tl.getProjects',{devKey:'20b497c0a4ae51e2869653bcca22727e'}).then((value)=>{
    console.log("aaaaaaaaaaaa"+value);
    
}).catch((error)=>{
    console.log(error);
    
})
