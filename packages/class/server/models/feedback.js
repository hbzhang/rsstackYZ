'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Feedback Schema
 */
var FeedbackSchema = new Schema({
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
    content: {
        type: String
    }
});

FeedbackSchema.path('owner').validate(function(owner) {
    return !!owner;
}, 'Owner cannot be blank');

FeedbackSchema.path('class_').validate(function(class_) {
    return !!class_;
}, 'Class cannot be blank');

FeedbackSchema.path('content').validate(function(content) {
    return !!content;
}, 'Content cannot be blank');

// Don't need to populate class.
var populateQuery = [{path:'owner', select:'name username'}];
FeedbackSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate(populateQuery).exec(cb);
};

mongoose.model('Feedback', FeedbackSchema);
