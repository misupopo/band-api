const express = require('express');
const router = express.Router();
const recruitment = require('../redis');
const exec = require('child_process').exec;

router.post('/get', async (req, res, next) => {
    const key = req.body.key;

    const getValue = await recruitment.get(key);

    res.json({
        result: getValue
    });
});

router.get('/list', async (req, res, next) => {
    const listData = await recruitment.list();

    const getPm2Status = () => {
        return new Promise((resolve, reject) => {
            exec('pm2 status -m', (err, stdout, stderr) => {
                if (err) { console.log(err); }

                let indexCount = 0;
                let appName = [];
                const statusData = {};

                stdout.split(/\r\n|\r|\n/).map((value) => {
                    if (value.match(/\+--- /)) {
                        const match = value.match(/\+--- (.*)/)[1];
                        appName.push(match);
                        statusData[match] = {
                            appName: match
                        };
                    }

                    if (value.match(/.* :(\s.*)/)) {
                        const match = value.match(/(.*) :(\s.*)/);
                        const keyName = match[1].replace(' ', '');

                        statusData[appName[indexCount]][keyName] = match[2].replace(' ', '');
                    }

                    if (value === '') {
                        indexCount = (indexCount + 1);
                    }
                });

                resolve(statusData);
            });
        });
    }

    const getStatusData = await getPm2Status();

    res.json({
        result: listData,
        pm2: getStatusData
    });
});

router.post('/set', async (req, res, next) => {
    const setData = req.body.params.setData;

    Object.keys(setData).map(async (key) => {
        await recruitment.set(key, setData[key]);
    });

    res.json({
        result: await recruitment.list()
    });
});

router.post('/pm2Set', async (req, res, next) => {
    const params = req.body.params;
    const command = params.status;
    const appName = params.appName;

    const executePM2 = () => {
        return new Promise((resolve, reject) => {
            exec(`pm2 ${command} ${appName}`, (err, stdout, stderr) => {
                if (err) { console.log(err); }

                resolve('success');
            });
        });
    };

    res.json({
        result: await executePM2()
    });
});


module.exports = router;
