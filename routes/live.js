const express = require('express');
const router = express.Router();
const mongo = require('../mongo');
const mongoDb = require('mongodb');
const Live = require('../models/live');

/* GET users listing. */
router.post('/create', async (req, res, next) => {
    const params = req.body.params;

    const live = new Live(params);
    live.addLiveList();

    res.json('success');
});

router.get('/list', async (req, res, next) => {
    const live = new Live();

    res.json({
        now: new Date(),
        result: await live.getLiveList()
    });
});

router.get('/detail', async (req, res, next) => {
    const live = new Live();

    res.json({
        result: await live.getLiveDetail(req.query.id) || {}
    });
});

router.post('/detail', async (req, res, next) => {
    const live = new Live();

    res.json({
        result: await live.updateLiveDetail(req.body.params.id, req.body.params) || {}
    });
});

router.post('/remove', async (req, res, next) => {
    const live = new Live();

    res.json({
        result: await live.removeLiveDetail(req.body.params.id) || {}
    });
});

module.exports = router;
