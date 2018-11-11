const EventEmitter = require('events');
const tlAPIClient = require('../../demo-tlapi-client/tlApiClient');
const DEV_KEY = '20b497c0a4ae51e2869653bcca22727e';
class ExecStatAuditor extends EventEmitter{

    constructor(tlHost, tlAPIPath, tPlan) {
        super();
        this.tlHost = tlHost;
        this.tlAPIPath = tlAPIPath;
        this.tPlan = tPlan;
        this.tlClient = tlAPIClient.createTLClient(tlHost,80,tlAPIPath);
        this.tlClient.setDevKey(DEV_KEY)
    }

    startAudit(timeout){
        this.interval = setInterval((tPlan)=>{

        },timeout)
    }

    async _getLastExecForCase(tCaseId,tPlanId){
        return await this.tlClient.sendRequest('getLastExecutionResult',{testcaseid:tCaseId,tpalid:tPlanId})
    }

    async _getTestCasesForTestPlan(tPlanId){
        return await this.tlClient.sendRequest('getTestCasesForTestPlan',{testpalid:tPlanId})
    }
}

