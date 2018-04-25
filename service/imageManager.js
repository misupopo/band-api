
const path = require('path');
const uploadsDir = path.resolve(__dirname, '../public/images');
const fs = require('fs');
const multer = require('multer');
const rimraf = require('rimraf');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        let ext = path.extname(file.originalname);
        cb(null, `${Math.random().toString(36).substring(7)}${ext}`);
    }
});

const imageManager = function () {
    return multer({ storage: storage });
};

const remove = function (fileName) {
    rimraf(uploadsDir + '/' + fileName, callback)
};

module.exports.imageManager = imageManager;
module.exports.remove = remove;

