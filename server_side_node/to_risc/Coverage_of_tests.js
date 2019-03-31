const tlApiClient = require('../demo-tlapi-client/tlApiClient');

let client = tlApiClient.createTLClient('testlink.local', 80, path = '/lib/api/xmlrpc/v1/custom_xmlrpc.php')
client.setDevKey(' b5570b0be54dbd061a61a1c24bfbe5ed');

async function getAlRequirementsForProject(projectName) {
    let all_requirements_for_project = await client.sendRequest('getRequirements', { testprojectname: projectName });
    // console.log(all_requirements_for_project);
    return all_requirements_for_project;
}
// getAlRequirementsForProject('TRB')


async function get_number_expected_coverage_for_project(projectName) {

    let exepected_coverage = 0;
    let all_requirements_for_project = await getAlRequirementsForProject(projectName);
    for (let i = 0; i < all_requirements_for_project.length; i++) {
        let getReqByID = await client.sendRequest('getReqById', { testprojectname: projectName, requirementid: all_requirements_for_project[i].id });
        // console.log(getReqByID[0].expected_coverage);
        exepected_coverage += parseInt(getReqByID[0].expected_coverage);
    }

    return exepected_coverage;
}


async function getNumberOfCoverageForProject(projectName) {
    let all_requirements_for_project = await getAlRequirementsForProject(projectName);
    let numberCoverageForProject = 0;
    for (let i = 0; i < all_requirements_for_project.length; i++) {
        let coverage = await client.sendRequest('getReqCoverage', { testprojectname: projectName, requirementdocid: all_requirements_for_project[i].req_doc_id })
        numberCoverageForProject += coverage.length;
    }
    return numberCoverageForProject
}

async function getPercentCoverageForProject(projectName) {
    let numberOfCasesNeded = await get_number_expected_coverage_for_project(projectName);
    let numberOfCoveraged = await getNumberOfCoverageForProject(projectName);
    let onePercent = numberOfCasesNeded / 100
    let resultInPercent = numberOfCoveraged / onePercent;
    console.log(resultInPercent + ' %');
    return resultInPercent;
}


module.exports.getPercentCoverageForProject = getPercentCoverageForProject;
// getPercentCoverageForProject('demo project')