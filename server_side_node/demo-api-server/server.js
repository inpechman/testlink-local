const express = require('express');
const bodyParser = require('body-parser');
const issueTrackerRoutes = require('./issueTrackerRoutes');

module.exports.startApiServer = function startApiServer() {
    console.log('started startApiServer()');
    const app = express();
    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    app.use('/testlink/issuetracker/api/', issueTrackerRoutes);

    app.listen(3333, (req, res) => {
        console.log(req)
    });
};