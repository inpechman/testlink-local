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

// const testCaseTableColumns = {
//     ID: 'id',
//     NAME: 'name',
//     LAST_EXEC_TS: 'lastexects',
//     LAST_EXEC_STAT: 'last_execution_status',
//     TC_EXTERNAL_ID: 'tcexternalid'
// };

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

    // async insertOrUpdateTestCase(id, name, lastExecTimeStamp, lastExecStat, externalID) {
    //     let tn = tableNames.testCases;
    //     let colId = testCaseTableColumns.ID;
    //     let colName = testCaseTableColumns.NAME;
    //     let colExTs = testCaseTableColumns.LAST_EXEC_TS;
    //     let colExStat = testCaseTableColumns.LAST_EXEC_STAT;
    //     let colExtID = testCaseTableColumns.TC_EXTERNAL_ID;
    //
    //     return await this.exeQuery(
    //         `INSERT INTO ${tn} (${colId},${colName},${colExTs},${colExStat},${colExtID}) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE ${colName}='${name}',
    //          ${colExTs}='${lastExecTimeStamp}', ${colExStat}='${lastExecStat}',
    //           ${colExtID}='${externalID}'`,
    //         [id, name, lastExecTimeStamp, lastExecStat, externalID]
    //     )
    // }

    // async getTestCaseById(id) {
    //     return await this.exeQuery(
    //         `SELECT * FROM ${tableNames.testCases} WHERE ${tableNames.testCases}.${testCaseTableColumns.ID} = '${id}'`)
    // }

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

    async createOrUpdateProject(id, tlProjectId, name) {
        return await this.exeQuery(`INSERT INTO projects VALUES (?,?,?) ON DUPLICATE KEY UPDATE name=?`,[id,tlProjectId,name,name])
    }

    async getProject(tlProjectId){
        return this.exeQuery(`SELECT * FROM projects WHERE tl_project_id=?`[tlProjectId])
    }


}

module.exports.createDBmgr = ((connectionDetails) => function () {
    return new DataBaseMGR(connectionDetails);
})(connectionDetails);