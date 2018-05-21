const client = require('redis').createClient();

const set = (key, data) => {
    return new Promise((resolve, reject) => {
        // JSオブジェクトを文字列に変換してsetする
        client.set(key, JSON.stringify(data), () => {
            resolve();
        });
    });
}

const get = (key) => {
    return new Promise((resolve, reject) => {
        // 文字列からJSオブジェクトに変換して利用する
        client.get(key, function(error, val){
            if (error) {
                console.log(error);
            }

            const data = JSON.parse(val);

            resolve(data);
        });
    });
}

const list = () => {
    return new Promise((resolve, reject) => {
        // 文字列からJSオブジェクトに変換して利用する
        client.keys('*', async function(error, keys){
            if (error) {
                console.log(error);
            }

            const redisData = {};

            for(let i = 0, len = keys.length; i < len; i++) {
                redisData[keys[i]] = await get(keys[i]);
            }

            resolve(redisData);
        });
    });
}

module.exports.set = set;
module.exports.get = get;
module.exports.list = list;

