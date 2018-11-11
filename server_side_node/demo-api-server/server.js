const express = require('express');
const bodyParser = require('body-parser');
const apiRouter = require('./routes');
const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.use('/testlink/issuetracker/api/',apiRouter);

app.listen(3333, (req, res)=>{
    console.log(req)
});