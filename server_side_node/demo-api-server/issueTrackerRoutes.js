const express = require('express');
const functions = require('../issue_tracking/functions/issueTrackerFunctions');
const tlAPIFunctions = require('../demo-tlapi-client/tlAPIFunctions');

const router = express.Router();

// router.get('/:api/projects/:projectid/issues/', (req, res, next) => {
//     console.log("get receved");
//     console.log(req.params);
//     res.send([
//         {
//             "id": "1",
//             "iid": "1",
//             "title": "issue 1",
//             "description": "discription for issue 1",
//             "projectid": "1",
//             "notes": [
//                 {
//                     "id": "11",
//                     "title": "note 1",
//                     "description": "description for note 1 on issue 1"
//                 }
//             ],
//             "web_url": "http://localhost:3333/testlink/issuetracker/api/v1/projects/1/issues/1",
//             "state": "opened"
//         },
//         {
//             "id": "2",
//             "iid": "2",
//             "title": "issue 2",
//             "description": "discription for issue 2",
//             "projectid": "1",
//             "notes": [
//                 {
//                     "id": "21",
//                     "title": "note 1",
//                     "description": "description for note 1 on issue 2"
//                 }
//             ],
//             "web_url": "http://localhost:3333/testlink/issuetracker/api/v1/projects/1/issues/2",
//             "state": "opened"
//         },
//     ]);
//     next();
// });


router.get('/:api//projects/', ((req, res, next) => {
    console.log('get recived');
    functions.getProjects().then(value => res.send(value)).catch(reason => {
        res.status(404);
        res.send(reason)
    });
    next()
}));


// router.get('/:api//projects/:projectid', (req, res, next) => {
//     res.send({"iid": "1"});
//     next();
// });


router.get('/:api//projects/:projectid/issues/:issueid/', (req, res, next) => {
    console.log(req.params);
    functions.getBugById(req.params.issueid).then(value => res.send(value)).catch(reason => {
        res.status(404);
        res.send(reason)
    });
    next();
});

router.post('/:api//projects/:projectid/issues/', async (req, res, next) => {
    // let execId = await tlAPIFunctions.getTCByExecId(req.query.exeid);
    // console.log('execid: ',execId);
    let projectId = req.params['projectid'];
    let build = JSON.parse(req.query.opt)['%%BUILD%%'];
    let title = req.query.title;
    let details = req.query.description;
    let testerId = req.query.testerid;
    let execTS = JSON.parse(req.query.opt)['%%EXECTS%%'];
    let execId = req.query.exeid;
    let execStatus = JSON.parse(req.query.opt)['%%EXECSTATUS%%'];
    functions.addIssue(projectId,build, title, details, testerId, execTS, execId, execStatus).then(value => res.send(value)).catch(reason => {
        res.status(404);
        res.send(reason)
    });

    console.log(req.query);
    console.log(JSON.parse(req.query.opt)['%%EXECTS%%']);
    next();
});

router.post('/:api//projects/:projectid/issues/:issueid/notes', (req, res, next) => {
    functions.addNote(req.params.projectid, req.params.issueid, req.query.body).then(value => res.send(value)).catch(reason => {
        res.status(404);
        res.send(reason);
    });
    next();
});
// router.post('/:api//projects/:projectid/issues/:issueid/notes', (req, res, next) => {
//     res.send({
//         "id": "1",
//         "iid": "1",
//         "title": "issue 1",
//         "description": "discription for issue 1",
//         "projectid": "1",
//         "notes": [
//             {
//                 "id": "11",
//                 "title": "note 1",
//                 "description": "description for note 1 on issue 1"
//             }
//         ],
//         "web_url": "http://localhost:3333/testlink/issuetracker/api/v1/projects/1/issues/1"
//     });
//     console.log(req.query);
//     next();
// });

router.use((req, res, next) => {
    // console.log(req);
    // console.log(res);
    // console.log(next);
});

module.exports = router;