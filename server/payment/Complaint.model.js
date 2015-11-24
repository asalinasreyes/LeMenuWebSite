'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema, 
    autoIncrement = require('mongoose-auto-increment');

var config = require('../config/environment');
var connection = mongoose.createConnection(config.mongo.uri);
autoIncrement.initialize(connection);

var ComplaintSchema = new Schema({
    Menuid: {
        type: Schema.ObjectId,
        ref: 'Menu'
    },
    Restaurantid: {
        type: Schema.ObjectId,
        ref: 'Restaurant'
    },
    Createdat: {
        type: Date,
        default: Date.now
    },
    Closedat: {
        type: Date
    },
    QueueTranslationID: {
        type: Schema.ObjectId,
        ref: 'QueueProcess'
    },
    Status:String,
    DescriptionComplaint:String
});

ComplaintSchema.plugin(autoIncrement.plugin, {model: 'Complaint',field: 'ComplainNumber'});
module.exports = mongoose.model('Complaint', ComplaintSchema);