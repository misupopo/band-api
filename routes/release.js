const express = require('express');
const router = express.Router();
const mongo = require('../mongo');
const mongoDb = require('mongodb');
const imageManager = require('../service/imageManager');
const upload = imageManager.imageManager();

/* GET users listing. */
router.post('/create', upload.any(), async (req, res, next) => {
    const params = req.body;
    const file = req.files[0];

    [
        'date'
    ].forEach((key) => {
        params[key] = new Date(params[key]);
    });

    params['create_at'] = new Date();
    params['update_at'] = new Date();

    params['image_name'] = file.filename;

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

router.get('/detail', async (req, res, next) => {
    const liveData = await mongo.findDocument('release', {
        _id: new mongoDb.ObjectId(req.query.id)
    });

    res.json({
        result: liveData[0] || {}
    });
});

router.post('/detail', async (req, res, next) => {
    const params = req.body.params;

    [
        'date'
    ].forEach((key) => {
        params[key] = new Date(params[key]);
    });

    params['update_at'] = new Date();

    const id = new mongoDb.ObjectId(params.id);

    if (params.id) {
        delete params.id;
    }

    params.price_value = parseInt(params.price_value, 10);

    await mongo.updateDocument('release', {
        _id: id
    }, params);

    res.json({
        result: params || {}
    });
});

router.post('/image', upload.any(), async (req, res, next) => {
    const file = req.files[0];

    // rimraf.sync(`${uploadsDir}/**/*`);
    res.status(200).json(req.files);
});



module.exports = router;
