const express = require('express');
const functions = require('../to_risc/Coverage_of_tests')
const myRouter = express.Router();


// functions.getPercentCoverageForProject('TRB')

myRouter.get('/:apiV/:projectName/coverage', (req, res) => {

    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Max-Age', 86400)
    res.header('Access-Control-Allow-Headers', '*');
    // console.log(req);
    functions.getPercentCoverageForProject(req.params.projectName).then((valeu) => {
        res.send({ coverage: valeu });
    })
})



module.exports = myRouter
