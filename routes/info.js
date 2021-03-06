const express = require('express');
const router = express.Router();
const mongo = require('../mongo');
const mongoDb = require('mongodb');
const imageManager = require('../service/imageManager');
const upload = imageManager.imageManager();

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

    const data = await mongo.insertDocument('info', params);

    res.json({
        result: data
    });
});

router.post('/create/image', upload.any(), async (req, res, next) => {
    const id = new mongoDb.ObjectId(req.body.id);

    const infoData = await mongo.findDocument('info', {
        _id: id
    });

    if (!infoData[0].file_name) {
        infoData[0].file_name = [];

        req.files.forEach((data) => {
            infoData[0].file_name.push(data);
        });
    } else {
        req.files.forEach((data) => {
            infoData[0].file_name.push(data);
        });
    }

    delete infoData[0]._id;

    const data = await mongo.updateDocument('info', {
        _id: id
    }, infoData[0]);

    res.json({
        result: infoData
    });
});

router.get('/list', async (req, res, next) => {
    const infoData = await mongo.findAllDocuments('info');

    infoData.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    res.json({
        now: new Date(),
        result: infoData
    });
});

router.get('/detail', async (req, res, next) => {
    const infoData = await mongo.findDocument('info', {
        _id: new mongoDb.ObjectId(req.query.id)
    });

    res.json({
        result: infoData[0] || {}
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

    await mongo.updateDocument('info', {
        _id: id
    }, params);

    const infoData = await mongo.findDocument('info', {
        _id: new mongoDb.ObjectId(id)
    });

    res.json({
        result: infoData || {}
    });
});

router.post('/remove', async (req, res, next) => {
    const params = req.body.params;

    const id = new mongoDb.ObjectId(params.id);

    if (params.id) {
        delete params.id;
    }

    const removeData = await mongo.removeDocument('info', {
        _id: id
    });

    res.json({
        result: removeData[0] || {}
    });
});

router.post('/image', upload.any(), async (req, res, next) => {
    const file = req.files[0];

    // rimraf.sync(`${uploadsDir}/**/*`);
    res.status(200).json(req.files);
});



module.exports = router;
