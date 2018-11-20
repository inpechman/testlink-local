import axios from "axios";

const constants = require('../../constants/constants');

const trelloBaseUrl = 'http://' + constants.trelloModule.HOST + ':' +
    constants.trelloModule.PORT + constants.trelloModule.API_PATH;

module.exports.addIssue = async function (projectName, bugId, title, details) {
    console.log('addIssue args: ', arguments);
    // TODO: replace with real trello module communication
    return {web_url: 'http://dummyurltobug.bugs/demo/demo'}
};

module.exports.addNote = async function (projectName, bugId, details) {
    console.log('addNote args: ', arguments);
    // TODO: replace with real trello module communication
    return {status_ok: 1}
};

module.exports.getBugsStatus = async function (projectName) {
    return await axios.get(trelloBaseUrl + projectName + '/bugs');
};
