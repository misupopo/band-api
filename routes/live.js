const express = require('express');
const router = express.Router();
const mongo = require('../mongo');

/* GET users listing. */
router.post('/create', async (req, res, next) => {
    const params = req.body.params;

    [
        'enter_time',
        'start_time',
        'date'
    ].forEach((key) => {
        params[key] = new Date(params[key]);
    });

    await mongo.insertDocument('live', params);

    res.json('success');
});

router.get('/list', async (req, res, next) => {
    const liveData = await mongo.findAllDocuments('live');

    res.json({
        result: liveData
    });
});

module.exports = router;
