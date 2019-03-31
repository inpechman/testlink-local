const express = require('express');
const myRouter = express.Router();
const createProject = require('../main_flow/index').createProject;



myRouter.post('/TestLink/newProject', ((req, res) => {
    res.send('get the api from planner!')
    console.log('the API working!!! 4');
    console.log('################################################################################################  WOW!!!!!!!');
    console.log(req.body);
    createProject(`http://scoper-server:5000/api/project/allProjects`, req.body.projectName)

}))




module.exports = myRouter