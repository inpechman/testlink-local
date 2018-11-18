const express = require('express');
const router = express.Router();

router.get('/:api/projects/:projectid/issues/', (req, res, next) => {
    console.log("get receved");
    console.log(req.params);
    res.send([
        {
            "id": "1",
            "iid": "1",
            "title": "issue 1",
            "description": "discription for issue 1",
            "projectid": "1",
            "notes": [
                {
                    "id": "11",
                    "title": "note 1",
                    "description": "description for note 1 on issue 1"
                }
            ],
            "web_url": "http://localhost:3333/testlink/issuetracker/api/v1/projects/1/issues/1",
            "state":"opened"
        },
        {
            "id": "2",
            "iid": "2",
            "title": "issue 2",
            "description": "discription for issue 2",
            "projectid": "1",
            "notes": [
                {
                    "id": "21",
                    "title": "note 1",
                    "description": "description for note 1 on issue 2"
                }
            ],
            "web_url": "http://localhost:3333/testlink/issuetracker/api/v1/projects/1/issues/2",
            "state":"opened"
        },
    ]);
    next();
});
router.get('/:api//projects/', ((req, res, next) => {
    console.log('get recived');
    res.send([
        {
            "id": "1",
            "iid": "1",
            "title": "issue 1",
            "description": "discription for issue 1",
            "projectid": "1",
            "notes": [
                {
                    "id": "11",
                    "title": "note 1",
                    "description": "description for note 1 on issue 1"
                }
            ],
            "web_url": "http://localhost:3333/testlink/issuetracker/api/v1/projects/1/issues/1",
            "state":"opened"
        },
        {
            "id": "2",
            "iid": "2",
            "title": "issue 2",
            "description": "discription for issue 2",
            "projectid": "1",
            "notes": [
                {
                    "id": "21",
                    "title": "note 1",
                    "description": "description for note 1 on issue 2"
                }
            ],
            "web_url": "http://localhost:3333/testlink/issuetracker/api/v1/projects/1/issues/2",
            "state": "opened"
        },
    ]);
    next()
}));
router.get('/:api//projects/:projectid', (req, res, next) => {
    res.send({"iid": "1"});
    next();
});
router.get('/:api//projects/:projectid/issues/:issueid/', (req, res, next) => {
    res.send({
        "id": "1",
        "iid": "1",
        "title": "issue 1",
        "description": "discription for issue 1",
        "projectid": "1",
        "notes": [
            {
                "id": "11",
                "title": "note 1",
                "description": "description for note 1 on issue 1"
            }
        ],
        "web_url": "http://localhost:3333/testlink/issuetracker/api/v1/projects/1/issues/1",
        "state": "opened"
    });
    next();
});

router.post('/:api//projects/:projectid/issues/', (req, res, next) => {
    res.send({
        "id": "1",
        "iid": "1",
        "title": "issue 1",
        "description": "discription for issue 1",
        "projectid": "1",
        "notes": [
            {
                "id": "11",
                "title": "note 1",
                "description": "description for note 1 on issue 1"
            }
        ],
        "web_url": "http://localhost:3333/testlink/issuetracker/api/v1/projects/1/issues/1"
    });
    console.log(req.query);
    console.log(JSON.parse(req.query.opt)['%%EXECTS%%']);
    next();
});
router.post('/:api//projects/:projectid/issues/:issueid/notes', (req, res, next) => {
    res.send({
        "id": "1",
        "iid": "1",
        "title": "issue 1",
        "description": "discription for issue 1",
        "projectid": "1",
        "notes": [
            {
                "id": "11",
                "title": "note 1",
                "description": "description for note 1 on issue 1"
            }
        ],
        "web_url": "http://localhost:3333/testlink/issuetracker/api/v1/projects/1/issues/1"
    });
    console.log(req.query);
    next();
});

router.use((req, res, next) => {
    console.log(req);
    console.log(res);
    console.log(next);
});

module.exports = router;