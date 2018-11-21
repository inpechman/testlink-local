const tlApiClient = require('../demo-tlapi-client/tlApiClient');

let client = tlApiClient.createTLClient('testlink2.local', 80, path = '/lib/api/xmlrpc/v1/custom_xmlrpc.php')
client.setDevKey('20b497c0a4ae51e2869653bcca22727e');

async function getAlRequirementsForProject(projectName) {
    let all_requirements_for_project = await client.sendRequest('getRequirements', { testprojectname: projectName });
    // console.log(all_requirements_for_project);
    return all_requirements_for_project;
}

async function get_expected_coverage_for_one_requirement(projectName, requirementID) {
    let exepected_coverage = [];
    let all_requirements_for_project = getAlRequirementsForProject(projectName);
    for (let i = 0; i < all_requirements_for_project.length; i++) {
        let getReqByID = awaitclient.sendRequest('getReqById', { requirementid: all_requirements_for_project[i].id });
        console.log(getReqByID);
        
    }
    return exepected_coverage;
}

async function getNumberOfCoverage(projectName) {
    let all_requirements_for_project = await getAlRequirementsForProject(projectName);
    // console.log(all_requirements_for_project);
    console.log(all_requirements_for_project);
    for (let i = 0; i < all_requirements_for_project.length; i++) {
        let coverage = await client.sendRequest('getReqCoverage', { testprojectname: projectName, requirementdocid: all_requirements_for_project[i].req_doc_id })

        console.log(coverage.length);

    }
}

// getNumberOfCoverage('TRB')
