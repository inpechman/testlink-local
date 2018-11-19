const tlAPIClient = require('./tlApiClient');
const constants = require('../constants/constants');

const tlClient = tlAPIClient.createTLClient(constants.TL_HOST,
    constants.TL_PORT,constants.TL_API_PATH);

module.exports.getTCByExecId = async (execId)=>{
    return await tlClient.sendRequest('getTestCaseByExecutionId',{executionid:execId})
};
