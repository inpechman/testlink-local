const functions = require('./functions/issueTrackerFunctions');
const db = require('../database/database_mgr');
const constans = require('../constants/constants')
const tlApiClient = require('../demo-tlapi-client/tlApiClient');
let client = tlApiClient.createTLClient('testlink.local', 80, path = '/lib/api/xmlrpc/v1/custom_xmlrpc.php')
client.setDevKey(' b5570b0be54dbd061a61a1c24bfbe5ed');
let dataBase = db.createDBmgr({ host: constans.DB_HOST })


async function getAllBugsID() {
    let allBugsID = await dataBase.getAllBugsID()
    return allBugsID
}
async function convertBugsIDToCaseID(bugsIDsArr) {
    for (let i = 0; i < bugsIDsArr.length; i++) {
        let caseID = await functions.findRelatedCasesForBugs(bugsIDsArr[i].bug_id);
        console.log('aaaaaaa ', caseID);
    }
}


async function checkAllBugsIfPassed(bugsArr) {
    for (let i = 0; i < bugsArr.length; i++) {
        let bugId = bugsArr[i].bug_id;
        let bug = await dataBase.getBugs([bugId])
        // console.log('bug id -', bugId);
        // console.log('bug status -', bug[0].execution_status);
        //     if (bug == failed) {
        //     console.log('aaaaaaaaaaaaa   true');
        // }
    }
}

async function name() {
    let allBugsID = await getAllBugsID();
    console.log('allBugsID ', allBugsID);
    
   await convertBugsIDToCaseID(allBugsID)
    // checkAllBugsIfPassed(allBugsID);
    // console.log(allBugsID);

    // console.log(bug[0].execution_status);
    // console.log(await functions.getBugsStatus("1"));

}


name()
