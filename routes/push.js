const express = require('express');
const router = express.Router();
const AWS = require('aws-sdk');
const key = require('../config/development.js');

const mongo = require('../mongo');

const awsSdkMock = require('aws-sdk-mock');

const AWS_KEY = key.AWS_KEY;
const AWS_SECRET = key.AWS_SECRET;
const SNS_REGION = key.APPNS.REGION;

const APPLICATION_ARN = key.APPNS.APPLICATION_ARN;
const REGISTRATION_ID = key.APPNS.REGISTRATION_ID;

let sns = null;

const aws_push_action = async (err, data) => {
    console.log('aws_push_action 1');

    if (err) {
        console.log(err.stack);
        return;
    }

    console.log(data);

    const endpointArn = data.EndpointArn;

    let payload = {
        default: 'Hello World',
        GCM: {
            data: {
                message: 'test'
            }
        },
        APPNS: {
            data: {
                message: 'test'
            }
        }
    };

    // first have to stringify the inner APNS object...
    payload.APNS = JSON.stringify(payload.APPNS);
    // then have to stringify the entire message payload
    payload = JSON.stringify(payload);

    console.log('sending push');

    // awsSdkMock.mock('SNS', 'publish', {
    //     Message: payload,
    //     MessageStructure: 'json',
    //     TargetArn: endpointArn
    // }, function(err, data) {
    //     if (err) {
    //         console.log(err.stack);
    //         return;
    //     }
    //
    //     console.log('push sent');
    //     console.log(data);
    // });

    sns.publish({
        Message: payload,
        MessageStructure: 'json',
        TargetArn: endpointArn
    }, function(err, data) {
        if (err) {
            console.log(err.stack);
            return;
        }

        console.log('push sent');
        console.log(data);
    });
};

const aws_push = async () => {
    AWS.config.update({
        accessKeyId: AWS_KEY,
        secretAccessKey: AWS_SECRET,
        region: SNS_REGION
    });

    // AWS.config.paramValidation = false;

    // awsSdkMock.mock('SNS', 'createPlatformEndpoint', 'message');

    // const sns = new AWS.SNS();
    sns = new AWS.SNS();

    // sns.createPlatformEndpoint({
    //
    // }, function(err, data){
    //     if (err) {
    //         console.log(err);
    //         return;
    //     }
    //
    //     console.log(data);
    // });

    // sns.createPlatformEndpoint = () => {
    //     return 'Hello world';
    // };
    //


    // console.log('mock 1');

    sns.createPlatformEndpoint({
        PlatformApplicationArn: APPLICATION_ARN,
        Token: REGISTRATION_ID
    }, aws_push_action);
};

router.post('/', async (req, res) => {
    const params = req.body;
    const user_id = params.user_id;

    // const collection = await mongo.findDocument('devices', {
    //     user_id: user_id
    // });

    aws_push();

    res.json({
        test: 'super test'
    });
});

module.exports = router;
