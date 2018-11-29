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
    arrCurent = [];
    let allPlans = await getAllPlansForProjectFromTL(projectID);
    for (let i = 0; i < allPlans.length; i++) {
        let allCasesForPlan = await client.sendRequest('getTestCasesForTestPlan', { testprojectid: projectID, testplanid: allPlans[i].id });
        let keys = await Object.keys(allCasesForPlan);
        for (let x = 0; x < keys.length; x++) {
            let lastExecution = await getLastExecutionOfCasePerPlan(projectID, allPlans[i].id, keys[x]);
            // console.log('plan id:', allPlans[i].id, 'case id:', keys[x], ' last exec: ', lastExecution);
            let lastStatusObj = { status: lastExecution.status, planID: allPlans[i].id, caseID: keys[x], execuitionDate: lastExecution.execution_ts };
            // console.log(lastStatusObj);
            let a = await checkLastExecuitionPerDate(arrCurent, lastStatusObj);
        }
    }

    console.log("end")
}

getAllCasesForAllPlans(543)



async function getLastExecutionOfCasePerPlan(projectID, testPlanID, testCaseID) {
    let lastExecution = await client.sendRequest('getLastExecutionResult', { testprojectid: projectID, testplanid: testPlanID, testcaseid: testCaseID });
    // console.log(lastExecution);
    return lastExecution[0];
}

// getLastExecutionOfCasePerPlan(543,838,564)

async function checkLastExecuitionPerDate(arrCurent, lastExecution) {
    if (lastExecution.execuitionDate != undefined) {
        let fullDate_new = await splitDate(lastExecution.execuitionDate);
        if (arrCurent.length == 0) {
            arrCurent[0] = lastExecution;
            console.log('arrCurent = 0');
            return arrCurent
        }
        if (arrCurent.length != 0) {
            for (let i = 0; i < arrCurent.length; i++) {
                if (arrCurent[i].caseID == lastExecution.caseID) {

                    let fullDate_2 = await splitDate(arrCurent[i].execuitionDate)
                    if (fullDate_2.year < fullDate_new.year) {
                        arrCurent[i] = lastExecution;
                        console.log('year');

                        return arrCurent;
                    }
                    if (fullDate_2.month < fullDate_new.month) {
                        arrCurent[i] = lastExecution;
                        console.log('month');
                        return arrCurent
                    }
                    if (fullDate_2.day < fullDate_new.day) {
                        arrCurent[i] = lastExecution;
                        console.log('day');

                        return arrCurent;
                    }
                    if (fullDate_2.hour < lastExecution.hour) {
                        arrCurent[i] = lastExecution;
                        console.log('hour');

                        return arrCurent;
                    }
                    if (fullDate_2.minute < lastExecution.minute) {
                        arrCurent[i] = lastExecution;
                        console.log('minute');

                        return arrCurent
                    }
                    if (fullDate_2.second < fullDate_new.second) {
                        arrCurent[i] = lastExecution;
                        console.log('second');

                        return arrCurent;
                    }

                }
            }
        }
    }
}


async function splitDate(strDate) {
    let dateSplit = strDate.split(" ")
    let date = dateSplit[0];
    let time = dateSplit[1];
    let arrDate = date.split('-');
    let arrTime = time.split(':')
    let fullDate = { year: arrDate[0], month: arrDate[1], day: arrDate[2], hour: arrTime[0], minute: arrTime[1], second: arrTime[2] }
    // console.log(fullDate);
    return fullDate;
}

// splitDate('2018-11-27 14:11:24');
