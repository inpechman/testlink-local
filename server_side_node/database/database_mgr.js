const mysql = require('mysql');
const fs = require('fs');
// const readLine = require('readline');
const constants = require('../constants/constants');

const connectionDetails = {
    host: constants.DB_HOST,
    user: constants.DB_USER,
    password: constants.DB_PASS,
    database: constants.DB_NAME,
    multipleStatements: true
};
const tableNames = {
    bugs: 'bugs',
    bugsToBeTested: 'bugs_to_be_tested',
    builds: 'builds',
    projects: 'projects',
    requirements: 'requirements',
    reqSpecs: 'req_specs',
    testPlans: 'test_plans',
};


console.log(new Date('2018-11-06 11:07:40'));

class DataBaseMGR {

    constructor(connectionDetails) {
        this.connectionDetails = connectionDetails;
    }

    exeQuery(sql, placeholders = []) {
        return new Promise((resolve, reject) => {
            let connection = mysql.createConnection(this.connectionDetails);
            connection.query(sql, placeholders, (err, res, fileds) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(res)
                }
            });
            connection.end()
        })
    }


    async initTables(sqlFilePath) {
        let projectsTable = await this.exeQuery(`SHOW TABLES LIKE 'projects'`);
        if (projectsTable[0]) {
            console.log(projectsTable[0], 'exists');
            return 'already exists';
        } else {
            console.log(projectsTable[0], 'not exists');
            let sqlStr = fs.readFileSync(sqlFilePath).toString('utf-8');
            console.log(sqlStr);
            return await this.exeQuery(sqlStr)
        }
    }

    async createProject(tlProjectId, name) {
        return await this.exeQuery(`INSERT INTO projects (tl_project_id, name) VALUES (?,?) ON DUPLICATE KEY UPDATE name=?`, [tlProjectId, name, name])
    }

    async getProject(tlProjectId) {
        return this.exeQuery(`SELECT * FROM projects WHERE tl_project_id=?`[tlProjectId])
    }

    async createTestPlan(tlPlanId, tlProjectId, name) {
        return await this.exeQuery(
            `INSERT INTO test_plans (tl_tplan_id, project_id, name) VALUES (?,?,?)`,
            [tlPlanId, tlProjectId, name]
        )
    }

    async getTestPlan(tlPlanId) {
        return await this.exeQuery(`SELECT * FROM test_plans WHERE tl_tplan_id=?`, [tlPlanId])
    }

    async createBuild(tlBuildId, tlPlanId, name) {
        return await this.exeQuery(`INSERT INTO builds (tl_build_id,test_plan_id,name)VALUES (?,?,?)`,
            [tlBuildId, tlPlanId, name])
    }

    async getBuild(tlBuildId) {
        return await this.exeQuery(`SELECT * FROM builds WHERE tl_build_id=?`,
            [tlBuildId])
    }

    async createReqSpec(tlReqSpecId, parentId, name, scope) {
        return await this.exeQuery(`INSERT INTO req_specs (tl_req_spec_id, parent_id, name, scope) VALUES (?,?,?,?)`,
            [tlReqSpecId, parentId, name, scope])
    }

    async getReqSpec(tlReqSpecId) {
        return await this.exeQuery(`SELECT * FROM req_specs WHERE tl_req_spec_id=?`, [tlReqSpecId])
    }

    async createRequirement(tlReqId, name, scope, tlReqSpecID) {
        return await this.exeQuery(`INSERT INTO requirements (tl_requirement_id, name, scope, req_spec_id) VALUES (?,?,?,?)`,
            [tlReqId, name, scope, tlReqSpecID])
    }

    async getRequirement(tlReqId) {
        return await this.exeQuery(`SELECT * FROM requirements WHERE tl_requirement_id=?`, [tlReqId])
    }

    async createBug(id, title, details, tlTestCaseId, tlTesterId, executionTimeStamp, executionId, executionStatus, webUrl, reportCount = 1) {
        return await this.exeQuery(`INSERT INTO bugs VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [id, title, details, tlTestCaseId, tlTesterId, executionTimeStamp, executionId, executionStatus, reportCount, webUrl])
    }

    async getBug(bugId) {
        return await this.exeQuery(`SELECT * FROM bugs WHERE id=?`, [bugId]);
    }

    async addBugToTestingList(bugId, testCaseId, execStatus, lastExecTS, tlTestPlanId, reportCount = 1) {
        return await this.exeQuery(`INSERT INTO bugs_to_be_tested (bug_id, test_case_id, execution_status, last_execution_time_stamp, test_plan_id, report_count) VALUES (?,?,?,?,?,?)`,
            [bugId, testCaseId, execStatus, lastExecTS, tlTestPlanId, reportCount]);
    }

    async getBugFromTestingList(bugId, reportCount) {
        return await this.exeQuery(`SELECT * FROM bugs_to_be_tested WHERE bug_id=? AND report_count=?`, [bugId, reportCount])
    }

    async getNextAutoIdForTable(tableNmae) {
        let tableInfo = await this.exeQuery(`SHOW TABLE STATUS LIKE ?;`, [tableNmae]);
        return tableInfo[0].Auto_increment;
    }

}

module.exports.createDBmgr = ((defaultConnectionDetails) => function (connectionDetails={}) {
    let mergedConnectionDetails = {...defaultConnectionDetails, ...connectionDetails};
    console.log(mergedConnectionDetails);
    return new DataBaseMGR(mergedConnectionDetails);
})(connectionDetails);