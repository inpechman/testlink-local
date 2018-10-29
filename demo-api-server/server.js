const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.post('/api/:api/projects/:id/issues',(req,res,next)=>{
    console.log("post receved");
    console.log(req.params);
    res.send({'status': 'ok'});
    next();
});
app.use((req,res,next)=>{
    console.log(req);
    console.log(res);
    console.log(next);
});

app.listen(3333, (req, res)=>{
    console.log(req)
});