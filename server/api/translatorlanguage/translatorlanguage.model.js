'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var TranslatorlanguageSchema = new Schema({
    active: Boolean,
    userid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdat: {
        type: Date,
        required: true,
        default: Date.now
    },
    languages: [String]
});

module.exports = mongoose.model('Translatorlanguage', TranslatorlanguageSchema);
