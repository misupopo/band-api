const MongoClient = require('mongodb').MongoClient;
const url = 'mongodb://localhost:27017/band_admin';

const mongoConnection = async () => {
    return new Promise(function (resolve, reject) {
        return MongoClient.connect(url, function(err, db) {
            resolve(db);
        });
    });
};

const findAllDocuments = async (collectionName) => {
    const db = await mongoConnection();

    const collection = await db.collection(collectionName);
    // db.close();

    return await collection.find({}).toArray();
};

const findDocument = async (collectionName, searchObject) => {
    const db = await mongoConnection();

    const collection = await db.collection(collectionName);
    // db.close();

    return await collection.find(searchObject).toArray();
};

const insertDocument = async (collectionName, insertObject) => {
    const db = await mongoConnection();

    const collection = await db.collection(collectionName);
    // db.close();

    return await collection.insert(insertObject);
};


module.exports.mongoConnection = mongoConnection;
module.exports.findAllDocuments = findAllDocuments;
module.exports.findDocument = findDocument;
module.exports.insertDocument = insertDocument;