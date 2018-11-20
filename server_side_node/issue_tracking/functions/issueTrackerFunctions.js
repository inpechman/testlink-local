const database = require('../../database/database_mgr');
const trelloClient = require('../trello_client/rt_trello_client');
const tlAPIClient = require("../../demo-tlapi-client/tlApiClient");
const constants = require('../../constants/constants');
const tlClient = require("../../demo-tlapi-client/tlAPIFunctions");

const dbMgr = database.createDBmgr();

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
        return {...projects};
    },

    addIssue: async (projectId,title, details, testerId, execTS, execId, execStatus) => {
        let bugId = await dbMgr.getNextAutoIdForTable('bugs');
        let bugFromTrello = await trelloClient.addIssue(bugId,title, details);
        // let tcId = await tlClient.getTCByExecId(execId);
        // console.log('tcid: ',tcId);
        let webUrl = bugFromTrello.web_url;
        await dbMgr.createBug(bugId,projectId, title, details, testerId, execTS, execId, execStatus, webUrl);
        return {id: bugId, iid: bugId, web_url: webUrl}
    },

    addNote: async (bugId, details)=>{
        let noteFromTrello = await trelloClient.addNote(bugId,details);
        return noteFromTrello;
    },

    getBugsStatus: async (projectId)=>{
        let [project,...rest] = await dbMgr.getProject(projectId);
        let projectName = project['name'];
        let bugs = await trelloClient.getBugsStatus(projectName)
    }
};