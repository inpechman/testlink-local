//database config constants
// module.exports.DB_HOST = '10.2.2.127';
module.exports.DB_HOST = 'mysql';
module.exports.DB_NAME = 'rtsuitetestlinksync';
module.exports.DB_USER = 'root';
module.exports.DB_PASS = '0953bloc';

//testlink app config constants
module.exports.TL_HOST = 'testlink';
module.exports.TL_PORT = 80;
module.exports.TL_API_PATH = '/lib/api/xmlrpc/v1/custom_xmlrpc.php';
module.exports.TL_API_KEY = 'b5570b0be54dbd061a61a1c24bfbe5ed';
module.exports.APP_API_HOST = 'localhost';
module.exports.APP_API_PORT = '3333';


//project scoper module connection detalse
module.exports.URL_ALL_PROJECTS = 'http://scoper-server:5000/api/project/allProjects'

//test execution status constants
module.exports.EXEC_STAT_PASSED = 'p';
module.exports.EXEC_STAT_FAILED = 'f';
module.exports.EXEC_STAT_BLOCKED = 'b';
module.exports.EXEC_STAT_NOT_RUN = 'n';

//trello module
module.exports.trelloModule = {
    HOST:'10.2.1.110',
    PORT:5555,
    API_PATH:'/api/v1/'
};

//bugs status
module.exports.bugState = {
    OPENED: 1,
    TO_BE_TESTED:2,
    DONE:3
};
