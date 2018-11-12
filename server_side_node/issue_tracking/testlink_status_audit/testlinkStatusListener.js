const EventEmitter = require('events');
const tlAPIClient = require('../../demo-tlapi-client/tlApiClient');
const DEV_KEY = '20b497c0a4ae51e2869653bcca22727e';
const {TL_HOST, TL_PORT, TL_API_PATH} = require('../../constants/constants');
const COVERAGE = module.exports.COVERAGE = 'coverage';
const EXECUTION = module.exports.EXECUTION = 'execution';
const events = {};
const TEST_FAILURE = events.TEST_FAILURE = 'test_failure';
const TEST_PASSED = events.TEST_PASSED = 'test_passed';
module.exports.events = events;
// const TEST_FAILURE = module.exports.events.TEST_FAILURE = 'test_failure';
// const TEST_PASSED = module.exports.events.TEST_PASSED = 'test_passed';

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
                interval = setInterval(async (a, b, c) => {
                    console.log(a, b, c);
                    try {
                        let testCases = await this._getTestCasesForTestPlan(identifier);
                        console.log(testCases);
                        for (let testCaseId of Object.keys(testCases)) {
                            let testCase = testCases['' + testCaseId];
                            if (testCase[0]['exec_status'] === "f") {
                                this.emit(TEST_FAILURE, testCase);
                            }
                            if (testCase[0]['exec_status'] === "p") {
                                this.emit(TEST_PASSED, testCase);
                            }
                        }
                    } catch (e) {
                        console.log(e)
                    }


                }, timeout, 1234, 6534, 78979, 'dfndhn');
                break;
        }
        return auditor;
    }

    async _getLastExecForCase(tCaseId, tPlanId) {
        return await this.tlClient.sendRequest('getLastExecutionResult', {testcaseid: tCaseId, tpalid: tPlanId})
    }

    async _getTestCasesForTestPlan(tPlanId) {
        return await this.tlClient.sendRequest('getTestCasesForTestPlan', {testplanid: tPlanId})
    }
}

let auditor = new TestLinkAuditor(TL_HOST, TL_API_PATH);
let audit = auditor.startAudit(EXECUTION, '14', 5000);
auditor.on(TEST_PASSED, args => {
    console.log('test passed ', args);
});
setTimeout(() => audit.stopAudit(), 10000);