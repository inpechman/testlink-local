const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());
app.post('/',(req,res,next)=>{
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