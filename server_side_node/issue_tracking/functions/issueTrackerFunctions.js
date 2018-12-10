const database = require('../../database/database_mgr');
const trelloClient = require('../trello_client/rt_trello_client');
const tlAPIClient = require("../../demo-tlapi-client/tlApiClient");
const constants = require('../../constants/constants');
const tlClient = require("../../demo-tlapi-client/tlAPIFunctions");
const toBeTested = require("../to_be_tested/to_be_tested");

const dbMgr = database.createDBmgr();


const groupBugsByState = (bugs) => {
    console.log("group by state", bugs);
    let groupedBugs = {};
    groupedBugs[constants.bugState.OPENED] = [];
    groupedBugs[constants.bugState.TO_BE_TESTED] = [];
    groupedBugs[constants.bugState.DONE] = [];

    for (const bug of bugs) {
        groupedBugs[bug.state].push(bug.bugId)
    }
    return groupedBugs;
};

const groupBugsByTester = async (bugs = []) => {
    let groupedBugs = {};
    for (const bug of bugs) {
        let tester = await dbMgr.getBugByReporter(bug);
        if (!groupedBugs[tester]) {
            groupedBugs[tester] = [];
        }
        groupedBugs[tester].push(bug);
    }
    return groupedBugs;

};

 const findRelatedCasesForBugs = async (bugsIds) => {
    let bugs = await dbMgr.getBugs(bugsIds);
    console.log('findRelatedCasesForBugs', bugs);

    let executions = bugs.map((bug) => {
        return bug.execution_id;
    });
    console.log(executions);
    let testCases = await getCasesForExecutions(executions);
    console.log(testCases);
    return testCases;
};
const getCasesForExecutions = async (executions) => {
    console.log('getCasesForExecutions', executions);
    let cases = [];
    for (const execution of executions) {
        let testCase = await tlClient.getTCByExecId(execution);
        console.log(testCase);
        cases.push(testCase.testcase_id);
    }
    console.log('getCasesForExecutions', cases);
    return cases;
};

const insertRetestBugsInDB = async (bugs) => {
    for (const bug of bugs) {
        let bugsFromDB = await dbMgr.getBug(bug);
        let bugFromDB = bugsFromDB[0];
        console.log('bug from DB: ', bugFromDB);
        let result = await dbMgr.addBugToTestingList(bug, bugFromDB.execution_status, bugFromDB.execution_time_stamp, bugFromDB.test_plan_id, bugFromDB.report_count);
    }

};

const filterOutDoublesFromTestingList = async (bugs) => {
    const filteredBugs = [];
    for (const bug of bugs) {
        let exists = await dbMgr.checkIfBugInTestingList(bug);
        console.log('bug ' + bug + ': ', exists);
        if (exists.length === 0) {
            filteredBugs.push(bug);
        }
    }
    return filteredBugs;
};
module.exports = {
    getBugById: async (id) => {
        let bugs = await dbMgr.getBug(id);
        let bug = bugs[0];
        return {
            id: bug['id'],
            iid: bug['id'],
            title: bug['title'],
            description: bug['details'],
            state: bug['execution_status'],
            web_url: bug['web_url']
        }
    },

    getProjects: async () => {
        let projects = await dbMgr.getAllProjects();
        return { ...projects };
    },

    addIssue: async (projectId, build, title, details, testerId, execTS, execId, execStatus) => {
        let bugId = await dbMgr.getNextAutoIdForTable('bugs');
        let [project, ...rest] = await dbMgr.getProject(projectId);
        let projectName = project['name'];
        let bugFromTrello = await trelloClient.addIssue(projectName, build, bugId, title, details);
        // let tcId = await tlClient.getTCByExecId(execId);
        // console.log('tcid: ',tcId);
        let webUrl = bugFromTrello.web_url;
        await dbMgr.createBug(bugId, projectId, title, details, testerId, execTS, execId, execStatus, webUrl);
        return { id: bugId, iid: bugId, web_url: webUrl }
    },

    addNote: async (projectId, bugId, details) => {
        let noteFromTrello = await trelloClient.addNote(projectId, bugId, details);
        return noteFromTrello;
    },

    getBugsStatus: async (projectId) => {
        let [project, ...rest] = await dbMgr.getProject(projectId);
        let projectName = project['name'];
        let bugs = await trelloClient.getBugsStatus(projectName);
        return bugs;
    },

    handleBugStatusChange: async (projectName, bugs, min = 0) => {
        console.log('started');
        try {
            let fixedBugs = groupBugsByState(bugs)[constants.bugState.TO_BE_TESTED];
            console.log('fixed bugs ', fixedBugs);
            let filteredBugs = await filterOutDoublesFromTestingList(fixedBugs);
            console.log('filtered bugs ', filteredBugs);
            if (filteredBugs.length >= min) {
                //TODO: add related cases to new test plan
                let groupedByTester = await groupBugsByTester(fixedBugs);
                for (let [tester, bugs] of Object.entries(groupedByTester)) {
                    console.log(tester, bugs);
                    let relatedCases = await findRelatedCasesForBugs(bugs);
                    let resultOfOperation = await toBeTested.makeRetestPlan(projectName, '1.1.35', relatedCases, tester);
                }
            }
            await insertRetestBugsInDB(filteredBugs);
            return { status_ok: true }
        } catch (e) {
            console.log('error in handleBugStatusChange', e)
        }
    },
    findRelatedCasesForBugs:findRelatedCasesForBugs
};
// const bulkResolveTester = async (bugs) => {
//     let groupedBugs = {};
//     for (const bug of bugs) {
//         let tester = await dbMgr.getBugByReporter(bug);
//         if (!groupedBugs[tester]) {
//             groupedBugs[tester] = [];
//         }
//         groupedBugs[tester].push(bug);
//     }
//     return groupedBugs;
// };
