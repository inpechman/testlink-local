const express = require('express');
const functions = require('../to_risc/percent_stutos')
const myRouter = express.Router();

myRouter.get('/:apiv/:projectName/status', (req, res) => {
    functions.getPercentStatus(req.params.projectName).then((value) => {
        res.send(value)
    })

})

module.exports = myRouter;