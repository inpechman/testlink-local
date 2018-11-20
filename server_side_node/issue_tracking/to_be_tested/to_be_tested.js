const tlApiClient = require('../../demo-tlapi-client/tlApiClient');
var client = tlApiClient.createTLClient('testlink2.local', 80, path = '/lib/api/xmlrpc/v1/custom_xmlrpc.php');
var getProjectIdByName = require('../../main_flow')
client.setDevKey("20b497c0a4ae51e2869653bcca22727e")
const db = require('../../database/database_mgr');

let database = db.createDBmgr({ host: '10.2.1.105' });



async function getTestPlanId(projectName, planName) {
    let testPlan = await client.sendRequest('getTestPlanByName', { testprojectname: projectName, testplanname: planName });
    return testPlan[0].id;
}



async function getTestCaseId(projectName, testCaseName) {
    let testCase = await client.sendRequest('getTestCaseIDByName', { testprojectname: projectName, testcasename: testCaseName });
    console.log(testCase);
    let testCaseID = testCase[0].id
    return testCaseID;
}
// getTestCaseId('TRB', 'my test case on my test suit');


// async function getTestCaseExtrenalIdOrTestCaseVersion(projectName, testCaseName, extrenalID_or_version) {
//     let testCaseID = await getTestCaseId(projectName, testCaseName);
//     let testCase = await client.sendRequest('getTestCase', { testcasename: testCaseName, testcaseid: testCaseID })
//     let extrenalID = testCase[0].tc_external_id;
//     let version = testCase[0].version;
//     if (extrenalID_or_version == "extrenalID") {
//         return extrenalID;
//     }
//     if (extrenalID_or_version == "version") {
//         return version
//     }
// }

async function getTestCase(projectName, testCaseID) {
    let testCase = await client.sendRequest('getTestCase', { testprojectname: projectName, testcaseid: testCaseID })
    // console.log(testCase[0]);
    return testCase[0];
}


async function addTestCaseToTestPlan(projectName, planName, testCaseID_Arr, tester_id) {
    try {
        let projectId = await getProjectIdByName.getProjectIdByName(projectName);
        let projectPrefix = await getProjectIdByName.getProjectIdByName(projectName, true)
        let planId = await getTestPlanId(projectName, planName);
        for (let i = 0; i < testCaseID_Arr.length; i++) {
            let testCase = await getTestCase(projectName, testCaseID_Arr[i]);
            let version = await testCase.version;
            let doTestCaseToTestPlan = await client.sendRequest('addTestCaseToTestPlan', {
                testprojectid: projectId, testplanid: planId,
                testcaseid: testCaseID_Arr[i], version: parseInt(version)
            });
        }

        client.sendRequest('sendEmailToTester', { testerid: tester_id, testplanid: planId, testcases: testCaseID_Arr })
    } catch (error) {
        console.log(error);

    }

}



async function createDate() {
    let fullDate = 'RETEST- ' + new Date(new Date().toString().split('GMT')[0] + ' UTC').toISOString().split('.')[0].replace('T', ' ');
    return fullDate
}

async function createBuild(projectName, planName) {
    let buildName = "build for retest plan";
    let testPlanId = await getTestPlanId(projectName, planName);
    let new_test_build = await client.sendRequest('createBuild', { testprojectname: projectName, testplanid: testPlanId, buildname: buildName });
    database.createBuild(new_test_build[0].id, testPlanId, buildName)
    return new_test_build[0];
}



async function create_Test_Plan_And_Add_TC_to_TP(projectName, testCaseID, tester_id) {
    let planName = await createDate();
    let projectId = await getProjectIdByName.getProjectIdByName(projectName);

    try {
        let new_test_plan = await client.sendRequest('createTestPlan', { testplanname: planName, testprojectname: projectName });
        // console.log(new_test_plan);

        database.createTestPlan(new_test_plan[0].id, projectId, planName);
        let new_test_build = await createBuild(projectName, planName);
        await addTestCaseToTestPlan(projectName, planName, testCaseID, tester_id)

    }
    catch (error) {
        console.log(error);

    }
}





create_Test_Plan_And_Add_TC_to_TP("TRB", ['564', '572'], 2);




