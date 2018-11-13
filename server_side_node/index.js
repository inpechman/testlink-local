const apiServer = require('./demo-api-server/server');
const testlinkStatusAuditor = require("./issue_tracking/testlink_status_audit/testlinkStatusAuditor");
const databaseClient = require("./database/databaseClient");


(function main() {
    apiServer.startApiServer();
    testlinkStatusAuditor.test();
    databaseClient.test();
})();