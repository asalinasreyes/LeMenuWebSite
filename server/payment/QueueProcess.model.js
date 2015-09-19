'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;





var ItemInMenuModellanguageSchema = new Schema({
    NameItemMenu:String,
    EnableName:Boolean,

    DescriptionItemMenu:String,
    EnableDescription:Boolean,

    DescriptionItemsItemMenu:String,
    EnableDescriptionItems:Boolean,

    PriceItemsItemMenu:String,
    EnablePrice:Boolean,

    FullDescriptionItemMenu:String,
    EnableFullDescription:Boolean,

    PositionOrder:Number,

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
    NameGroupInMenu:String,
    EnableName:Boolean,
    State:Number,
    PositionOrder:Number,
    ItemsInMenu:[ItemInMenuModellanguageSchema],
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
	MenuDetail:[GroupMenuModellanguageSchema],
	LanguagesTo: String,
	LanguagesFrom: String,
	StartTranslate: Date,
	EndTranslate: Date,
	UserTranslateid: {
		type: Schema.ObjectId,
		ref: 'User'
	},
	Status: String,
	Parentid: {
		type: Schema.ObjectId,
		ref: 'QueueProcess'
	},
	IsReadyToTranslate: Boolean,
	IsDoneTranslate: Boolean,
	IsParent: Boolean
});

module.exports = mongoose.model('QueueProcess', QueueProcessSchema);


