const express = require('express');
const bodyParser = require('body-parser');
const issueTrackerRoutes = require('./issueTrackerRoutes');
const coverageRoutes = require('./TLcoverage_ruotes');

module.exports.startApiServer = function startApiServer() {
    console.log('started startApiServer()');
    const app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use('/testlink/issuetracker/api/', issueTrackerRoutes);
    app.use('/testlink/coverage/api/',coverageRoutes);

    app.listen(3333, (req, res) => {
        console.log(req)
    });
};