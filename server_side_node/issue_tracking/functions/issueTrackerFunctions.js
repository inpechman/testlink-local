const database = require('../../database/database_mgr');
const trelloClient = require('../trello_client/rt_trello_client');
const tlAPIClient = require("../../demo-tlapi-client/tlApiClient");
const constants = require('../../constants/constants');

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

    addIssue: async (title, details, testerId, execTS, execId, execStatus) => {
        let bugId = await dbMgr.getNextAutoIdForTable('bugs');
        let bugFromTrello = await trelloClient.addIssue(title, details);
        let tcId = tlAPIClient.createTLClient(constants.TL_HOST,constants.TL_PORT,
            constants.TL_API_PATH);
        let webUrl = bugFromTrello.web_url;
        await dbMgr.createBug(bugId, title, details, tcId, testerId, execTS, execId, execStatus, webUrl);
        return {id: bugId, iid: bugId, web_url: webUrls}

    }
};