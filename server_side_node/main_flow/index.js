const tlApiClient = require('../demo-tlapi-client/tlApiClient');
const axios = require('axios')


var client = tlApiClient.createTLClient('testlink2.local', 80, path = '/lib/api/xmlrpc/v1/custom_xmlrpc.php');
client.setDevKey("20b497c0a4ae51e2869653bcca22727e")
const URL_ALL_PROJECTS = 'http://10.2.1.119:5000/api/project/allProjects';
let NUBER_FOR_TEST_CASE_PREFIX = 0;




async function createUrlSpec(urlAllProjects, projectName) {
    var res = await axios.default.get(urlAllProjects);
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





async function getProjectIdFromTL(projectName) {
    let getProjectId = await client.sendRequest('getTestProjectByName', { testprojectname: projectName });
    return getProjectId.id;
}

async function getReqSpecDocIdFromApi(urlSpec, reqSpecName) {
    let res = await axios.default.get(urlSpec);
    for (let i = 0; i < res.data.subjects.length; i++) {
        if (res.data.subjects[i].subjectName == reqSpecName) {
            let reqSpecDocId = res.data.subjects[i].subjectName;
            return reqSpecDocId
        }
    }
}
async function getScopeForReqSpecFromApi(urlSpec, reqSpecName) {
    let res = await axios.default.get(urlSpec);
    for (let i = 0; i < res.data.subjects.length; i++) {
        if (res.data.subjects[i].subjectName == reqSpecName) {
            let reqSpeqScope = res.data.subjects[i].subjectDescreption;
            return reqSpeqScope;
        }
    }
}



async function getReqSpecIdFromApi(projectName, reqSpecDocId) {
    let testProjectId = await getProjectIdFromTL(projectName);
    let reqSpecId = await client.sendRequest("getReqSpecByDocId", { testprojectid: testProjectId, reqspecdocid: reqSpecDocId })
    return reqSpecId.id;
}

async function getTitleOrScopeForRequirementFromApi(urlSpec, requirementName, reqSpecName, titleOrScope) {
    let res = await axios.default.get(urlSpec);
    let subjects = res.data.subjects;
    for (let i = 0; i < subjects.length; i++) {
        if (subjects[i].subjectName == reqSpecName) {
            for (let x = 0; x < subjects[i].requirements.length; x++) {
                let requirementTitle = subjects[i].requirements[x].title;
                let requirementScope = subjects[i].requirements[x].userStory;
                if (titleOrScope == 'title') {
                    return requirementTitle;
                };
                if (titleOrScope == 'scope') {
                    return requirementScope;
                }
            }
        }
    }

}


async function addAllRequirements(urlAllProjects, urlSpec, reqSpecIndex, projectName) {
    let res = await axios.default.get(urlSpec);
    let requirements = res.data.subjects[reqSpecIndex].requirements;
    for (let i = 0; i < requirements.length; i++) {
        await createRequirement(urlAllProjects, projectName, res.data.subjects[reqSpecIndex].subjectName, requirements[i].title)
    }
}
async function addAllReqSpecAndAllRequirements(urlAllProjects, projectName) {
    let urlSpec = await createUrlSpec(urlAllProjects, projectName)
    let res = await axios.default.get(urlSpec);
    let projectNameFromApi = await res.data.projectName;
    let allReqSpec = await res.data.subjects;
    for (let i = 0; i < allReqSpec.length; i++) {
        await createReqSpeq(projectNameFromApi, urlAllProjects, allReqSpec[i].subjectName)
        await addAllRequirements(urlAllProjects, urlSpec, i, projectNameFromApi);
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
    await addAllReqSpecAndAllRequirements(urlAllProjects, projectName)

}

createProject(URL_ALL_PROJECTS, 'TRB')

async function createReqSpeq(projectName, urlAllProjects, reqSpecName) {
    let urlSpec = await createUrlSpec(urlAllProjects, projectName);
    let testProjectId = await getProjectIdFromTL(projectName);
    let parentId = await testProjectId;
    let reqSpecDocId = await getReqSpecDocIdFromApi(urlSpec, reqSpecName);
    let title = await reqSpecDocId;
    let scope = await getScopeForReqSpecFromApi(urlSpec, reqSpecName);
    let addReqSpec = await client.sendRequest("addReqSpec", {
        testprojectid: testProjectId,
        parentid: parentId, reqspecdocid: reqSpecDocId, title: title, scope: scope
    })
}


async function createRequirement(urlAllProjects, projectName, reqSpecDocId, requirementName) {
    let urlSpec = await createUrlSpec(urlAllProjects, projectName);
    let testProjectId = await getProjectIdFromTL(projectName);
    let reqSpecId = await getReqSpecIdFromApi(projectName, reqSpecDocId);
    let requirementDocId = await requirementName;
    let title = await getTitleOrScopeForRequirementFromApi(urlSpec, requirementName, reqSpecDocId, 'title');
    let scope = await getTitleOrScopeForRequirementFromApi(urlSpec, requirementName, reqSpecDocId, 'scope');
    let addRequirement = await client.sendRequest('addRequirement', {
        testprojectid: testProjectId, reqspecid: reqSpecId,
        requirementdocid: requirementDocId, title: title, scope: scope,
        status: 'V', requirementtype: '3', expectedcoverage: '2'
    })
}


// createRequirement(URL_ALL_PROJECTS,'TRB','Main screen','main screen')
// getTitleForRequirementFromApi('http://10.2.1.119:5000/api/userStory/allStories/5be44a6216632a2e2cf2d7b0', 'main screen', 'Main screen')
// createProject(URL_ALL_PROJECTS,"TRB")
// createReqSpeq("TRB",URL_ALL_PROJECTS,"Main screen")
