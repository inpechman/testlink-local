const express = require('express');
const functions = require('../to_risc/percent_stutos')
const myRouter = express.Router();

myRouter.get('/:apiv/:projectName/status', (req, res) => {
    // res.header('Access-Control-Allow-Origin', '*');
    // res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    // res.header('Access-Control-Max-Age', 86400)
    // res.header('Access-Control-Allow-Headers', '*');
    functions.getPercentStatus(req.params.projectName).then((value) => {
        res.send(value)
    })

})

module.exports = myRouter;


