const express = require('express');
const functions = require('../to_risc/Coverage_of_tests')
const myRouter = express.Router();


// functions.getPercentCoverageForProject('TRB')

myRouter.get('/:apiV/:projectName/coverage', (req, res) => {
    // console.log(req);
    functions.getPercentCoverageForProject(req.params.projectName).then((valeu) => {
        res.send(valeu);
    })
})



module.exports = myRouter
