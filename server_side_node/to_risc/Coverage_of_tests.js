const tlApiClient = require('../demo-tlapi-client/tlApiClient');

let client = tlApiClient.createTLClient('testlink2.local', 80, path = '/lib/api/xmlrpc/v1/custom_xmlrpc.php')
client.setDevKey('20b497c0a4ae51e2869653bcca22727e');

async function getAlRequirementsForProject(projectName) {
    let all_requirements_for_project = await client.sendRequest('getRequirements', { testprojectname: projectName });
    console.log(all_requirements_for_project);
    return all_requirements_for_project;
}

getAlRequirementsForProject('IOS')