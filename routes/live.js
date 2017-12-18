const express = require('express');
const router = express.Router();
const mongo = require('../mongo');
const mongoDb = require('mongodb');

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

    params['create_at'] = new Date();
    params['update_at'] = new Date();

    await mongo.insertDocument('live', params);

    res.json('success');
});

router.get('/list', async (req, res, next) => {
    const liveData = await mongo.findAllDocuments('live');

    res.json({
        now: new Date(),
        result: liveData
    });
});

router.get('/detail', async (req, res, next) => {
    const liveData = await mongo.findDocument('live', {
        _id: new mongoDb.ObjectId(req.query.id)
    });

    res.json({
        result: liveData[0] || {}
    });
});

router.post('/detail', async (req, res, next) => {
    const params = req.body.params;

    [
        'enter_time',
        'start_time',
        'date'
    ].forEach((key) => {
        params[key] = new Date(params[key]);
    });

    params['update_at'] = new Date();

    const id = new mongoDb.ObjectId(params.id);

    if (params.id) {
        delete params.id;
    }

    params.advance_sale_ticket = parseInt(params.advance_sale_ticket, 10);
    params.day_ticket = parseInt(params.day_ticket, 10);

    await mongo.updateDocument('live', {
        _id: id
    }, params);

    res.json({
        result: params || {}
    });
});

module.exports = router;
