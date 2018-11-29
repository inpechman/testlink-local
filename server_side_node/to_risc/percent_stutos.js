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
    let lastStatus = [];
    let allPlans = await getAllPlansForProjectFromTL(projectID);
    for (let i = 0; i < allPlans.length; i++) {
        let allCasesForPlan = await client.sendRequest('getTestCasesForTestPlan', { testprojectid: projectID, testplanid: allPlans[i].id });
        let keys = await Object.keys(allCasesForPlan);
        for (let x = 0; x < keys.length; x++) {
            let lastExecution = await getLastExecutionOfCasePerPlan(projectID, allPlans[i].id, keys[x]);
            // console.log('plan id:', allPlans[i].id, 'case id:', keys[x], ' last exec: ', lastExecution);
            if (true) {
                lastStatus.push({ status: lastExecution.status, planID: allPlans[i].id, caseID: keys[x], execuitionDate: lastExecution.execution_ts })

            }
        }
    }
    console.log(lastStatus);
    console.log("end")
}

// getAllCasesForAllPlans(543)



async function getLastExecutionOfCasePerPlan(projectID, testPlanID, testCaseID) {
    let lastExecution = await client.sendRequest('getLastExecutionResult', { testprojectid: projectID, testplanid: testPlanID, testcaseid: testCaseID });
    // console.log(lastExecution);
    return lastExecution[0];
}

// getLastExecutionOfCasePerPlan(543,838,564)

async function checkLastExecuitionPerDate(arrCurent, lastExecution) {
    if (arrCurent.length == 0) {
        arrCurent.push(lastExecution);
    }
    else {
        for (let i = 0; i < arrCurent.length; i++) {
            let dateSplit = lastExecution.execution_ts.split(" ")
            let date = dateSplit[0];
            let time = dateSplit[1];
            let arrDate = date.split('-');
            let year = arrDate[0];
            let month = arrDate[1];
            let day = arrDate[2];
            let arrTime = time.split(':')
            let hour = arrTime[0];
            let minute = arrTime[1];
            let second = arrTime[2];
            
        }
    }

}


// let fullDate = '2018-11-27 14:11:21';
// let dateSplit = fullDate.split(' ');
// let date = dateSplit[0];
// let time = dateSplit[1];
// console.log(date, " ", time);

// // let day = dateSplit[2][0]
// // let arrDate = [];
// // arrDate.push(dateSplit[0])
// // arrDate.push(dateSplit[1])
// // arrDate.push(dateSplit[2][0]+dateSplit[2][1])
// console.log(dateSplit);
