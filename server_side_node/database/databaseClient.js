const DataBaseMGR = require('./database_mgr');
const dateformat = require('dateformat');

module.exports.test = function () {
    let dbMgr = DataBaseMGR.createDBmgr();
    dbMgr.insertOrUpdateTestCase(14, 'tc_1', dateformat(new Date('2018-11-05 16:45:38'), 'yyyy-mm-dd HH:MM:ss'),'p', 4).then(value => console.log(value)).catch(reason => console.log(reason));
};