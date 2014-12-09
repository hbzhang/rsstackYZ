'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Class Schema
 */
var ClassSchema = new Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    students: [{
        type: Schema.ObjectId,
        ref: 'User'
    }],
    thumbnail: {
        type: Schema.ObjectId,
        ref: 'Upload'
    },
    startdate: {
        required: true,
        type: Date
    },
    enddate: {
        required: true,
        type: Date
    },
    weektime: {
        required: true,
        type: Date
    },
    weekdays: [{
        required: true,
        type: Number
    }],
    alldates: [{
        required: true,
        type: Date
    }],
    exclusiondates: [{
        required: true,
        type: Date
    }],
    capacity: {
        required: true,
        type: Number
    },
    location: {
        required: true,
        type: String
    },
    emailtemplate: {
        required: true,
        type: String
    },
    syllabus: [{
        type: Schema.ObjectId,
        ref: 'Upload'
    }]
});

/**
 * Validations
 */
ClassSchema.path('title').validate(function(title) {
    return !!title;
}, 'Title cannot be blank');

ClassSchema.path('description').validate(function(description) {
    return !!description;
}, 'Description cannot be blank');

ClassSchema.path('capacity').validate(function(capacity) {
    return !!capacity || capacity > 0;
}, 'Capacity must be greater than zero');

ClassSchema.path('location').validate(function(location_) {
    return !!location_;
}, 'Location cannot be blank');

/**
 * Statics
 */
var populateQuery = [{path:'instructor', select:'name username'}, {path:'students', select:'name username'}, {path:'syllabus'}, {path: 'thumbnail'}];
ClassSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate(populateQuery).exec(cb);
};

mongoose.model('Class', ClassSchema);
