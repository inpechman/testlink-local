const xmlrpc = require('xmlrpc');

const tlClient = xmlrpc.createClient({host:'testlink2.local',port:80,path:'/lib/api/xmlrpc/v1/custom_xmlrpc.php'});

tlClient.methodCall('getProjects',)