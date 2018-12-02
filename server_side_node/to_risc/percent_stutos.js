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

async function getProjectIDByName(projectName) {
    let projectID = await client.sendRequest('getTestProjectByName', { testprojectname: projectName });

    return projectID.id;
}
async function getPercentStatusForAllCasesPerProgect(projectName) {
    let projectID = await getProjectIDByName(projectName)
    console.log('project id from tl ', projectID);
    var arrCurent = [];
    let allPlans = await getAllPlansForProjectFromTL(projectID);
    for (let i = 0; i < allPlans.length; i++) {
        let allCasesForPlan = await client.sendRequest('getTestCasesForTestPlan', { testprojectid: projectID, testplanid: allPlans[i].id });
        let keys = await Object.keys(allCasesForPlan);
        for (let x = 0; x < keys.length; x++) {
            let lastExecution = await getLastExecutionOfCasePerPlan(projectID, allPlans[i].id, keys[x]);
            let lastStatusObj = { status: lastExecution.status, planID: allPlans[i].id, caseID: keys[x], execuitionDate: lastExecution.execution_ts };
            lastStatusObj.execuitionDate != undefined ? arrCurent = (await checkLastExecuitionPerDate(arrCurent, lastStatusObj)) : "";
        }
    }
    console.log('arrCurent: ', arrCurent);
    let statusPecent = await percentStatusForCasesPerProject(arrCurent);
    return statusPecent
    console.log("end")
}

// getPercentStatusForAllCasesPerProgect('TRB')

async function percentStatusForCasesPerProject(arrCases) {
    let statusForAllCases = { passed: 0, blocked: 0, failed: 0 };
    for (let i = 0; i < arrCases.length; i++) {
        switch (arrCases[i].status) {
            case 'p':
                statusForAllCases.passed += 1;
                break;
            case 'f':
                statusForAllCases.failed += 1;
                break
            case 'b':
                statusForAllCases.blocked += 1;
                break
            default:
                console.log('default');
                break;
        }
    }
    let percentAll = statusForAllCases.passed + statusForAllCases.failed + statusForAllCases.blocked;
    let onePercent = percentAll / 100;
    let percentStatus = { passed: statusForAllCases.passed / onePercent, blocked: statusForAllCases.blocked / onePercent, failed: statusForAllCases.failed / onePercent }
    // console.log(JSON.stringify(percentStatus));

    return percentStatus
}

async function getLastExecutionOfCasePerPlan(projectID, testPlanID, testCaseID) {
    let lastExecution = await client.sendRequest('getLastExecutionResult', { testprojectid: projectID, testplanid: testPlanID, testcaseid: testCaseID });
    // console.log(lastExecution);
    return lastExecution[0];
}

// getLastExecutionOfCasePerPlan(543,838,564)

async function checkLastExecuitionPerDate(arrCurent, lastExecution) {

    let fullDate_new = lastExecution.execuitionDate;
    if (arrCurent.length == 0) {
        // console.log("one iteration");
        arrCurent.push(lastExecution)
        // console.log(arrCurent);
        return arrCurent;
    }
    else {
        // console.log(arrCurent.length);

        for (let i = 0; i < arrCurent.length; i++) {
            if (arrCurent[i].caseID == lastExecution.caseID) {
                let arrDate = arrCurent[i].execuitionDate;
                if ((new Date(arrDate).getTime() < new Date(fullDate_new).getTime())) {
                    arrCurent[i] = lastExecution;
                    return arrCurent
                }
                else {
                    return arrCurent
                }
            }
        }
    }
    arrCurent.push(lastExecution);
    return arrCurent
}

module.exports.getPercentStatus = getPercentStatusForAllCasesPerProgect;
