const DataBaseMGR = require('./database_mgr');
const constants = require("../constants/constants");
const dateformat = require('dateformat');

module.exports.test = async function () {
    try {
        let dbMgr = DataBaseMGR.createDBmgr();
        // await dbMgr.insertOrUpdateTestCase(14, 'tc_1', dateformat(new Date('2018-10-05 16:45:38'), 'yyyy-mm-dd HH:MM:ss'), constants.EXEC_STAT_PASSED, 4).then(value => console.log(value)).catch(reason => console.log(reason));
        // await dbMgr.getTestCaseById(14).then(value => {
        //     console.log(value, Date.parse(value[0].lastexects) < Date.now())
        // }).catch(reason => {
        //     console.log(reason)
        // });
        console.log(dbMgr);
        
        let initRes = await dbMgr.initTables('./init_tables.sql');
        console.log(initRes);
        let projectC = await dbMgr.createProject(54, 'sdfavsf');
        console.log(projectC);
        let autoId = await dbMgr.getNextAutoIdForTable('projects');
        console.log(autoId);

    } catch (error) {
        console.log(error);

    }
};

