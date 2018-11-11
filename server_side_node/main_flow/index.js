const tlApiClient = require('../demo-tlapi-client/tlApiClient');
const axios = require('axios')


var client = tlApiClient.createTLClient('testlink2.local', 80, path = '/lib/api/xmlrpc/v1/custom_xmlrpc.php');
client.setDevKey("20b497c0a4ae51e2869653bcca22727e")
const URL_ALL_PROJECTS = 'http://10.2.1.119:5000/api/project/allProjects';
let NUBER_FOR_TEST_CASE_PREFIX = 0;


async function createUrlSpec(urlAllProjects, projectName) {
    var res = await axios.default.get(urlAllProjects);
    // console.log(res.data);

    var urlSpec = "http://10.2.1.119:5000/api/userStory/allStories/"
    for (i = 0; i < res.data.length; i++) {
        if (res.data[i].projectName == projectName) {
            return urlSpec + res.data[i]._id;
        }
    }
}

async function getProjectNameFromApi(urlSpec) {
    var res = await axios.default.get(urlSpec);
    return res.data.projectName;
}

async function createTestCasePrefix(projectName) {
    var projectNameSplit = await projectName.trim().split("");
    for (let i = 0; i < projectNameSplit.length; i++) {
        if (projectNameSplit[i] == " ") {
            NUBER_FOR_TEST_CASE_PREFIX += 1;
            return projectNameSplit[0] + projectNameSplit[i + 1] + NUBER_FOR_TEST_CASE_PREFIX;
        }
        else {
            NUBER_FOR_TEST_CASE_PREFIX += 1;
            return projectNameSplit[0] + NUBER_FOR_TEST_CASE_PREFIX;
        }
    }
}


async function createProject(urlAllProjects, projectName) {
    let urlSpec = await createUrlSpec(urlAllProjects, projectName);
    let projectName1 = await getProjectNameFromApi(urlSpec);
    let testCasePrefix = await createTestCasePrefix(projectName)
    let createdProject = await client.sendRequest('createTestProject', {
        testprojectname: projectName1, testcaseprefix: testCasePrefix, notes: "defult",
        options: [1, 1, 1, 1], active: 1, public: 1
    })
}
createProject(URL_ALL_PROJECTS, 'TRB');

async function getProjectIdFromTL(projectName) {
    console.log(projectName);
    
    let getProjectId = await client.sendRequest('getTestProjectByName', { testprojectname: projectName });
    console.log(getProjectId);

}

// getProjectIdFromTL('TRB');


async function createReqSpeq() {
    var info = {
        devKey: "20b497c0a4ae51e2869653bcca22727e",
        testprojectid: "",
        parentid: "",
        reqspecdocid: "",
        title: "",
        scope: ""
    }
}