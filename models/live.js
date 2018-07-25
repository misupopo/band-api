const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const LiveSchema = new Schema({
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

const Live = mongoose.model('Live', LiveSchema, 'live');
module.exports = Live;
