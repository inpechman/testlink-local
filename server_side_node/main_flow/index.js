const tlApiClient = require('../demo-tlapi-client/tlApiClient');
const axios = require('axios')
const db = require('../database/database_mgr')
const constans = require('../constants/constants')
let database = db.createDBmgr({ host: constans.DB_HOST });

var client = tlApiClient.createTLClient(constans.TL_HOST, constans.TL_PORT, path = constans.TL_API_PATH);
client.setDevKey(constans.TL_API_KEY)
const URL_ALL_PROJECTS = 'http://scoper-server:5000/api/project/allProjects';


/**
 * this function gets url of all projects from Scoper API
 *
 * @param {String} urlAllProjects = [{_id:int,projectNmae}]
 * @param {String} projectName = project name
 *
 * @returns {String} url for one project
 */
async function createUrlSpec(urlAllProjects, projectName) {
    console.log('createUrlSpec()...2')
    var res = await axios.default.get(urlAllProjects);
    var urlSpec = "http://scoper-server:5000/api/userStory/allStories/"
    for (i = 0; i < res.data.length; i++) {
        if (res.data[i].projectName == projectName) {
            return urlSpec + res.data[i]._id;
        }
    }
} 

/**
 *this function gets url for one project
 
 * @param {String} urlSpec = {projectName:"bla bla bla",subjects:[{"subjectName": "Login","subjectDescreption": "login bla",
 * "requirements":[{"_id": "5beac2ad99688c0468b011b3","subject": "Login","title": "bla","userStory": "As a user 1: bla *3"}]}]}
 * @returns{String} project name from scoper API
 */
async function getProjectNameFromApi(urlSpec) {
    console.log('getProjectNameFromApi()...3')
    var res = await axios.default.get(urlSpec);
    return res.data.projectName;
}


/**
 * this function gets project name and create prefix to project
 *
 * @param {String} projectName
 *
 * @returns {String}project prefix
 */
async function createTestProjectPrefix(projectName) {
    console.log('createTestProjectPrefix()...4');
    
    var projectNameSplit = await projectName.trim().split("");
    let id_cuonter = await database.getNextAutoIdForTable('projects')
    for (let i = 0; i < projectNameSplit.length; i++) {
        if (projectNameSplit[i] == " ") {
            return projectNameSplit[0] + projectNameSplit[i + 1] + "-" + id_cuonter;
        }
        else {
            return projectNameSplit[0] + "-" + id_cuonter;
        }
    }
}




/**
 * this function get project ID or project prefix from testLink.
 *
 *
 * @param {String} projectName project name.
 * @param {boolean} option_prefix optional for get prefix. default param option_perfix = false.
 *
 * @returns{String} if param option_prefix = true return project prefix.
 * @returns{String} if param option_prefix = false return project ID.
 */
async function getProjectIdFromTL(projectName, option_prefix = false) {
    console.log('getProjectIdFromTL()...6');
    
    let getProjectId = await client.sendRequest('getTestProjectByName', { testprojectname: projectName });
    if (option_prefix) {
        return getProjectId.prefix
    }
    if (!option_prefix) {
        return getProjectId.id;
    }
}


/**
 * this function gets requirement specifiction doc ID from scoper API
 * @param {String} urlSpec url to scoper API for one project
 * @param {String} reqSpecName requirement specifiction name
 *
 * @returns{String} req spec docID
 */
async function getReqSpecDocIdFromApi(urlSpec, reqSpecName) {
    let res = await axios.default.get(urlSpec);
    for (let i = 0; i < res.data.subjects.length; i++) {
        if (res.data.subjects[i].subjectName == reqSpecName) {
            let reqSpecDocId = res.data.subjects[i].subjectName;
            return reqSpecDocId
        }
    }
}

/**
 * this function take scope for req spec from scoper API
 *
 * @param {String} urlSpec url to scoper API for one project
 * @param {String} reqSpecName requirement specifiction name
 *
 * @returns{String} scope for requirement specifiction
 */
async function getScopeForReqSpecFromApi(urlSpec, reqSpecName) {
    let res = await axios.default.get(urlSpec);
    for (let i = 0; i < res.data.subjects.length; i++) {
        if (res.data.subjects[i].subjectName == reqSpecName) {
            let reqSpeqScope = res.data.subjects[i].subjectDescreption;
            return reqSpeqScope;
        }
    }
}


/**
 *
 * @param {String} projectName project name
 * @param {String} reqSpecDocId requirement specifiction docID
 *
 * @returns{int} requirement specifiction ID
 */
async function getReqSpecIdFromTestLink(projectName, reqSpecDocId) {
    let testProjectId = await getProjectIdFromTL(projectName);
    let reqSpecId = await client.sendRequest("getReqSpecByDocId", { testprojectid: testProjectId, reqspecdocid: reqSpecDocId })
    return reqSpecId.id;
}


/**
 * this function take title or scope for requirement from scoper API
 *
 * @param {String} urlSpec url to scoper API for one project
 * @param {String} requirementName requirement name
 * @param {String} reqSpecName req spc name
 * @param {String} titleOrScope "title" or "scope"
 * @returns{String} if param titleOrScope = "title" return title for requirement
 * if param titleOrScope = "scope" return scope for requirement
 *  */
async function getTitleOrScopeForRequirementFromApi(urlSpec, requirementName, reqSpecName, titleOrScope) {
    let res = await axios.default.get(urlSpec);
    let subjects = res.data.subjects;
    for (let i = 0; i < subjects.length; i++) {
        if (subjects[i].subjectName == reqSpecName) {
            for (let x = 0; x < subjects[i].requirements.length; x++) {
                if (requirementName == subjects[i].requirements[x].title) {
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
    
}

/**
 * this function create all requirements for one req spec from scoper API
 *
 * @param {String} urlAllProjects scoper url for all projects[{_id:"",projectName:""}]
 * @param {String} urlSpec url to scoper API for one project
 * @param {int} reqSpecIndex number for index to one req spec
 * @param {String} projectName project name
 */
async function addAllRequirements(urlAllProjects, urlSpec, reqSpecIndex, projectName) {
    let res = await axios.default.get(urlSpec);
    let requirements = res.data.subjects[reqSpecIndex].requirements;
    for (let i = 0; i < requirements.length; i++) {
        await createRequirement(urlAllProjects, projectName, res.data.subjects[reqSpecIndex].subjectName, requirements[i].title)
    }
}

/**
 * this function create all req spec and all requirements per project form scoper API
 * @param {String} urlAllProjects scoper url for all projects[{_id:"",projectName:""}]
 * @param {String} projectName project name
 *
 * void
 */
async function addAllReqSpecAndAllRequirements(urlAllProjects, projectName) {
    console.log('addAllReqSpecAndAllRequirements()...8');
    
    let urlSpec = await createUrlSpec(urlAllProjects, projectName)
    let res = await axios.default.get(urlSpec);
    let projectNameFromApi = await res.data.projectName;
    let allReqSpec = await res.data.subjects;
    for (let i = 0; i < allReqSpec.length; i++) {
        await createReqSpeq(projectNameFromApi, urlAllProjects, allReqSpec[i].subjectName)
        await addAllRequirements(urlAllProjects, urlSpec, i, projectNameFromApi);
    }
}


async function createAndAssignIssueTreckerSystem(projectID, projectName) {
    console.log('createAndAssignIssueTreckerSystem()...9');
    
    // client.sendRequest('createNewIssueTracker');
    let res = await client.sendRequest('createNewIssueTracker', {'testprojectname':projectName, 'testprojectid':projectID, 'issuetrackerurl':'http://'+constans.APP_API_HOST+':'+constans.APP_API_PORT+'/testlink/issuetracker'});
    console.log('response from creating tracker',res);
    let res2 = await client.sendRequest('assignITSForProject',{'issuetrackerid':res['id'],'testprojectid':projectID})
    console.log('response from assigning tracker', res2);
    
    
}

/**
 * this function create new project from scoper API and create all req spec and all requirements all data from scoper API.
 * @param {String} urlAllProjects scoper url for all projects[{_id:"",projectName:""}]
 * @param {String} projectName project name
 * void
 */
async function createProject(urlAllProjects, projectName) {
    console.log('createProject()...1');
    
    let urlSpec = await createUrlSpec(urlAllProjects, projectName);
    console.log('urlSpec: ', urlSpec);
    let projectName1 = await getProjectNameFromApi(urlSpec);
    console.log('projectName1: ', projectName1);
    let testCasePrefix = await createTestProjectPrefix(projectName)
    console.log('prefix: ', testCasePrefix);
    let createdProject = await client.sendRequest('createTestProject', {
        testprojectname: projectName1, testcaseprefix: testCasePrefix, notes: "defult",
        options: [1, 1, 1, 1], active: 1, public: 1
    })
    let projectID = await getProjectIdFromTL(projectName);
    let add_info_to_db = await database.createProject(projectID, projectName1, testCasePrefix)
    await addAllReqSpecAndAllRequirements(urlAllProjects, projectName)
    
    
    await createAndAssignIssueTreckerSystem(projectID, projectName)
    
}



/**
 * this function create new requirement specifiction data drom scoper API
 * @param {String} projectName project name
 * @param {String} urlAllProjects scoper url for all projects[{_id:"",projectName:""}]
 * @param {String} reqSpecName req spec name
 * void
 *
 */
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
    let add_info_to_db = await database.createReqSpec(addReqSpec.id, parentId, reqSpecDocId, scope);
    
}

/**
 * this function create new requirement gets data from scoper API
 *
 * @param {String} urlAllProjects scoper url for all projects[{_id:"",projectName:""}]
 * @param {String} projectName project name
 * @param {String} reqSpecDocId requirement specifiction doc ID
 * @param {String} requirementName requirement name
 * void
 */
async function createRequirement(urlAllProjects, projectName, reqSpecDocId, requirementName) {
    console.log("cr_par ", urlAllProjects, projectName, reqSpecDocId, requirementName);
    
    let urlSpec = await createUrlSpec(urlAllProjects, projectName);
    let testProjectId = await getProjectIdFromTL(projectName);
    let reqSpecId = await getReqSpecIdFromTestLink(projectName, reqSpecDocId);
    let requirementDocId = await requirementName;
    let title = await getTitleOrScopeForRequirementFromApi(urlSpec, requirementName, reqSpecDocId, 'title');
    console.log('title: ', title);
    let scope = await getTitleOrScopeForRequirementFromApi(urlSpec, requirementName, reqSpecDocId, 'scope');
    console.log('scope: ', scope);
    
    let addRequirement = await client.sendRequest('addRequirement', {
        testprojectid: testProjectId, reqspecid: reqSpecId,
        requirementdocid: requirementDocId, title: title, scope: scope,
        status: 'V', requirementtype: '3', expectedcoverage: '2'
    })
    let add_info_to_db = database.createRequirement(addRequirement.id, title, scope, reqSpecId);
}



module.exports.getProjectIdByName = getProjectIdFromTL;
module.exports.createProject = createProject;

// createRequirement(URL_ALL_PROJECTS,'TRB','Main screen','main screen')
// getTitleForRequirementFromApi('http://10.2.1.119:5000/api/userStory/allStories/5be44a6216632a2e2cf2d7b0', 'main screen', 'Main screen')
// createProject(URL_ALL_PROJECTS, "my test planner 4")
// createReqSpeq("TRB",URL_ALL_PROJECTS,"Main screen")

