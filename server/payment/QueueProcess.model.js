'use strict';

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;



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