const tlAPIClient = require('./tlApiClient');
const constants = require('../constants/constants');

const tlClient = tlAPIClient.createTLClient(constants.TL_HOST,
    constants.TL_PORT,constants.TL_API_PATH);
tlClient.setDevKey(constants.TL_API_KEY);

module.exports.getTCByExecId = async (execId)=>{
    let response = await tlClient.sendRequest('getTestCaseByExecutionId',{executionid:''+execId});
    return response;
};
