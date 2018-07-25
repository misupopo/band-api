const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const TestSchema = new Schema({
    title: {type: String, default: ''},
    date: {type: Date, default: ''},
    venue: {type: String, default: ''},
    information: {type: String, default: ''},
    enter_time: {type: Date, default: ''},
    start_time: {type: Date, default: ''},
    advance_sale_ticket: {type: String, default: ''},
    day_ticket: {type: String, default: ''},
    performer: [],
    article_title: {type: String, default: ''},
    article_content: {type: String, default: ''},
});

TestSchema.pre('save', function (next) {
    const compileTarget = [
        'enter_time',
        'start_time',
        'date'
    ];

    compileTarget.forEach((key) => {
        this[key] = new Date(this[key]);
    });

    next();
});

TestSchema.methods.createTest = () => {
    return 'test';
};

// 三つ目の引数は複数形の命名規則を無視して collection を作成する
const Test = mongoose.model('Test', TestSchema, 'test');
module.exports = Test;
