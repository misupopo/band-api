const express = require('express');
const router = express.Router();
const mongo = require('../mongo');
const mongoDb = require('mongodb');

/* GET users listing. */
router.post('/create', async (req, res, next) => {
    const params = req.body.params;

    [
        'date'
    ].forEach((key) => {
        params[key] = new Date(params[key]);
    });

    params['create_at'] = new Date();
    params['update_at'] = new Date();

    await mongo.insertDocument('release', params);

    res.json('success');
});

router.get('/list', async (req, res, next) => {
    const liveData = await mongo.findAllDocuments('release');

    res.json({
        now: new Date(),
        result: liveData
    });
});

module.exports = router;
