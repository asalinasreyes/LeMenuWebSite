'use strict';

var mongoose = require('mongoose'),
    Schema = mongoose.Schema, 
    autoIncrement = require('mongoose-auto-increment');

var config = require('../config/environment');
var connection = mongoose.createConnection(config.mongo.uri);
autoIncrement.initialize(connection);
 
var ItemInMenuModellanguageSchema = new Schema({

    NameItemMenu: String,
    DescriptionItemMenu: String,
    DescriptionItemsItemMenu: String,
    PriceItemsItemMenu: String,
    FullDescriptionItemMenu: String,
    PositionOrder: Number,

    ParentMenuId: {
        type: Schema.ObjectId,
        ref: 'ItemInMenuModellanguageSchema'
    },


    userid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdat: {
        type: Date,
        required: true,
        default: Date.now
    }
});

var GroupMenuModellanguageSchema = new Schema({
    NameGroupInMenu: String,
    EnableName: Boolean,
    State: Number,
    PositionOrder: Number,
    ItemsInMenu: [ItemInMenuModellanguageSchema],
    userid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    createdat: {
        type: Date,
        required: true,
        default: Date.now
    }
});




var QueueProcessSchema = new Schema({
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
    MenuDetail: [GroupMenuModellanguageSchema],
    LanguagesTo: String,
    LanguagesFrom: String,
    StartTranslate: Date,
    EndTranslate: Date,
    UserTranslateid: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    Parentid: {
        type: Schema.ObjectId,
        ref: 'QueueProcess'
    },
    IsReadyToTranslate: Boolean,
    IsDoneTranslate: Boolean,
    OwnerApproved:Boolean,
    IsParent: Boolean
});



QueueProcessSchema.plugin(autoIncrement.plugin, {model: 'QueueProcess',field: 'TranslationNumber'});

module.exports = mongoose.model('QueueProcess', QueueProcessSchema);
