const EventEmitter = require('events');
const tlAPIClient = require('../../demo-tlapi-client/tlApiClient');
const DEV_KEY = '20b497c0a4ae51e2869653bcca22727e';
const {TL_HOST, TL_PORT, TL_API_PATH} = require('../../constants/constants');
const COVERAGE = module.exports.COVERAGE = 'coverage';
const EXECUTION = module.exports.EXECUTION = 'execution';

class TestLinkAuditor extends EventEmitter {

    constructor(tlHost, tlAPIPath) {
        super();
        this.tlHost = tlHost;
        this.tlAPIPath = tlAPIPath;
        this.tlClient = tlAPIClient.createTLClient(tlHost, 80, tlAPIPath);
        this.tlClient.setDevKey(DEV_KEY)
    }

    startAudit(subject, identifier, timeout) {
        console.log(subject);
        let interval;
        const auditor = {stopAudit: () => clearInterval(interval)};
        switch (subject) {
            case COVERAGE:
                break;
            case EXECUTION:
                interval = setInterval((a, b, c) => {
                    console.log(a, b, c);

                }, timeout,1234,6534,78979,'dfndhn');
                break;
        }
        return auditor;
    }

    async _getLastExecForCase(tCaseId, tPlanId) {
        return await this.tlClient.sendRequest('getLastExecutionResult', {testcaseid: tCaseId, tpalid: tPlanId})
    }

    async _getTestCasesForTestPlan(tPlanId) {
        return await this.tlClient.sendRequest('getTestCasesForTestPlan', {testpalid: tPlanId})
    }
}

let auditor = new TestLinkAuditor(TL_HOST, TL_API_PATH).startAudit(EXECUTION,'plan_1',2000);

setTimeout(()=>auditor.stopAudit(),15000);