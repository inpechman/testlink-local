const constans = require('../constants/constants');
const tlApiClient = require('../demo-tlapi-client/tlApiClient');
let client = tlApiClient.createTLClient(constans.TL_HOST, constans.TL_PORT, constans.TL_API_PATH);
client.setDevKey(constans.TL_API_KEY);


async function getAllPlansForProjectFromTL(projectID) {
    let allPlans = await client.sendRequest('getProjectTestPlans', { testprojectid: projectID });
    // console.log(allPlans);
    return allPlans;
}

// getAllPlansForProjectFromTL(543);

async function getAllCasesForAllPlans(projectID) {
    let allPlans = await getAllPlansForProjectFromTL(projectID);
    let arrAllCasesForAllPlan = []
    for (let i = 0; i < allPlans.length; i++) {
        let allCasesForPlan = await client.sendRequest('getTestCasesForTestPlan', { testprojectid: projectID, testplanid: allPlans[i].id });
        arrAllCasesForAllPlan.push(allCasesForPlan)
    }
    console.log(arrAllCasesForAllPlan);
    console.log("end")
}
// getAllCasesForAllPlans(543)

async function getLastExecutionOfCasePerPlan(projectID, testPlanID, testCaseID) {
    let lastExecution =await client.sendRequest('getLastExecutionResult', { testprojectid: projectID, testplanid: testPlanID, testcaseid: testCaseID });
    console.log(lastExecution);   
}

// getLastExecutionOfCasePerPlan(543,838,564)

async function name(params) {
    
}