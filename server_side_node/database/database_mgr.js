const mysql = require('mysql');
const constants = require('../constants/constants');

const connectionDetails = {
    host: constants.DB_HOST,
    user: constants.DB_USER,
    password: constants.DB_PASS,
    database: constants.DB_NAME
};
const tableNames = {
    testCases: 'testcases'
};
const testCaseTableColumns = {
    ID: 'id',
    NAME: 'name',
    LAST_EXEC_TS: 'lastexects',
    LAST_EXEC_STAT: 'last_exec_stat',
    TC_EXTERNAL_ID: 'tcexternalid'
};

console.log(Date.parse('2018-11-06 11:07:40'));

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

    async insertOrUpdateTestCase(id, name, lastExecTimeStamp,lastExecStat, externalID) {
        let tn = tableNames.testCases;
        let colId = testCaseTableColumns.ID;
        let colName = testCaseTableColumns.NAME;
        let colExTs = testCaseTableColumns.LAST_EXEC_TS;
        let colExStat = testCaseTableColumns.LAST_EXEC_STAT;
        let colExtID = testCaseTableColumns.TC_EXTERNAL_ID;

        return await this.exeQuery(
            `INSERT INTO ${tn} (${colId},${colName},${colExTs},${colExStat},${colExtID}) VALUES (?, ?, ?, ?) ON DUPLICATE KEY UPDATE ${colExTs}='${lastExecTimeStamp}'`,
            [id, name, lastExecTimeStamp,lastExecStat, externalID]
        )
    }
}

module.exports.createDBmgr = function (connectionDetails = {
    host: constants.DB_HOST,
    user: constants.DB_USER,
    password: constants.DB_PASS,
    database: constants.DB_NAME
    }) {
    return new DataBaseMGR(connectionDetails);
};