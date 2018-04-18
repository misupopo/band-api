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

    const data = await mongo.insertDocument('carousel', params);

    res.json({
        result: data
    });
});

router.post('/create/image', upload.any(), async (req, res, next) => {
    const file = req.files[0];
    const id = new mongoDb.ObjectId(req.body.id);

    const releaseData = await mongo.findDocument('carousel', {
        _id: id
    });

    releaseData[0].file_name = file.filename;

    delete releaseData[0]._id;

    const data = await mongo.updateDocument('carousel', {
        _id: id
    }, releaseData[0]);

    res.json({
        result: releaseData
    });
});

router.get('/list', async (req, res, next) => {
    const releaseData = await mongo.findAllDocuments('carousel');

    releaseData.sort(function (a, b) {
        return new Date(b.date) - new Date(a.date);
    });

    res.json({
        now: new Date(),
        result: releaseData
    });
});

router.get('/detail', async (req, res, next) => {
    const releaseData = await mongo.findDocument('carousel', {
        _id: new mongoDb.ObjectId(req.query.id)
    });

    res.json({
        result: releaseData[0] || {}
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

    const releaseData = await mongo.findDocument('carousel', {
        _id: new mongoDb.ObjectId(id)
    });

    const newData = await Object.assign(releaseData[0], params);

    await mongo.updateDocument('carousel', {
        _id: id
    }, newData);

    res.json({
        result: newData || {}
    });
});

router.post('/remove', async (req, res, next) => {
    const params = req.body.params;

    const id = new mongoDb.ObjectId(params.id);

    if (params.id) {
        delete params.id;
    }

    const removeData = await mongo.removeDocument('carousel', {
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
