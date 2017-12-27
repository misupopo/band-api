const express = require('express');
const router = express.Router();
const mongo = require('../mongo');
const mongoDb = require('mongodb');


router.get('/list', async (req, res, next) => {
    const liveData = await mongo.findAllDocuments('live');
    const releaseData = await mongo.findAllDocuments('release');

    liveData.map(function (data) {
        data['news_type'] = 'live';
    });

    releaseData.map(function (data) {
        data['news_type'] = 'release';
    });

    let newsData = [];

    newsData = newsData.concat(liveData, releaseData);

    newsData.sort(function (a, b) {
       return new Date(b.date) - new Date(a.date);
    });

    res.json({
        result: newsData
    });
});


module.exports = router;
