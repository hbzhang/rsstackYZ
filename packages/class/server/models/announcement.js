'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Announcement Schema
 */
var AnnouncementSchema = new Schema({
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    class_: {
        type: Schema.ObjectId,
        ref: 'Class'
    },
    date: {
        type: Date
    },
    title: {
        type: String
    },
    content: {
        type: String
    }
});

AnnouncementSchema.path('owner').validate(function(owner) {
    return !!owner;
}, 'Owner cannot be blank');

AnnouncementSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');

AnnouncementSchema.path('content').validate(function(content) {
    return !!content;
}, 'Content cannot be blank');

// Don't need to populate class.
var populateQuery = [{path:'owner', select:'name username'}];
AnnouncementSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate(populateQuery).exec(cb);
};

mongoose.model('Announcement', AnnouncementSchema);
