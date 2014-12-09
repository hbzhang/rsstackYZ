'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Comment Schema
 */
var CommentSchema = new Schema({
    instructor: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    class_: {
        type: Schema.ObjectId,
        ref: 'Class'
    },
    student: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    content: {
        type: String
    },
    date: {
        type: Date
    }
});

CommentSchema.path('instructor').validate(function(instructor) {
    return !!instructor;
}, 'Instructor cannot be blank');

CommentSchema.path('student').validate(function(student) {
    return !!student;
}, 'Student cannot be blank');

CommentSchema.path('class_').validate(function(class_) {
    return !!class_;
}, 'Class cannot be blank');

CommentSchema.path('content').validate(function(content) {
    return !!content;
}, 'Content cannot be blank');

var populateQuery = [{path:'instructor', select:'name username'},
                     {path:'student', select:'name username'}];
CommentSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate(populateQuery).exec(cb);
};

mongoose.model('Comment', CommentSchema);
