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
    create_at: {type: String},
    update_at: {type: String},
});

// arrow 関数にすると this が undefined になってしまう
LiveSchema.pre('save', function (next) {
    const compileTarget = [
        'enter_time',
        'start_time',
        'date'
    ];

    compileTarget.forEach((key) => {
        this[key] = new Date(this[key]);
    });

    this.update_at = new Date();

    next();
});

LiveSchema.pre('findOneAndUpdate', function (next) {
    this._update.update_at = new Date();

    next();
});

LiveSchema.methods.addLiveList = function () {
    this.create_at = new Date();
    this.save();
};

LiveSchema.methods.getLiveList = async function () {
    return new Promise((resolve, reject) => {
        Live.find((error, data) => {
            data.sort(function (a, b) {
                return new Date(b.date) - new Date(a.date);
            });

            resolve(data);
        });
    });
};

LiveSchema.methods.getLiveDetail = async function (id) {
    return new Promise((resolve, reject) => {
        Live.findById(id, (error, data) => {
            resolve(data);
        });
    });
};

LiveSchema.methods.updateLiveDetail = async function (id, params) {
    return new Promise((resolve, reject) => {
        params.advance_sale_ticket = parseInt(params.advance_sale_ticket, 10);
        params.day_ticket = parseInt(params.day_ticket, 10);

        Live.findByIdAndUpdate(id, params, (error, data) => {
            resolve(data);
        });
    });
};

LiveSchema.methods.removeLiveDetail = async function (id) {
    return new Promise((resolve, reject) => {
        Live.findByIdAndRemove(id, (error, data) => {
            resolve(data);
        });
    });
};

const Live = mongoose.model('Live', LiveSchema, 'live');
module.exports = Live;
