const express = require('express');
const router = express.Router();
const Test = require('../models/test');

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

router.post('/create', async (req, res) => {
    const params = {
        'title': '新宿御苑サウンド ライブ1',
        'date': '2018/06/30 19:00:00',
        'venue': '御苑サウンド',
        'information': 'test',
        'enter_time': '2018/06/30',
        'start_time': '2018/06/30 00:00:00',
        'advance_sale_ticket': '',
        'day_ticket': '',
        'performer': [
            '',
        ],
        'article_title': 'test',
        'article_content': 'test',
    };

    const test = new Test(params);

    test.save();

    res.json('create is success');
});

router.post('/method/create', async (req, res) => {
    const params = {
        'title': '新宿御苑サウンド ライブ1',
        'date': '2018/06/30 19:00:00',
        'venue': '御苑サウンド',
        'information': 'test',
        'enter_time': '2018/06/30',
        'start_time': '2018/06/30 00:00:00',
        'advance_sale_ticket': '',
        'day_ticket': '',
        'performer': [
            '',
        ],
        'article_title': 'test',
        'article_content': 'test',
    };

    const test = new Test(params);

    test.createTest();
    test.save();

    res.json('method create is success');
});

module.exports = router;
