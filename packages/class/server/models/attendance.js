'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Attendance Schema
 */
var AttendanceSchema = new Schema({
    student: {
        required: true,
        type: Schema.ObjectId,
        ref: 'User'
    },
    class_: {
        required: true,
        type: Schema.ObjectId,
        ref: 'Class'
    },
    date: {
        required: true,
        type: Date
    }
});

// Don't need to populate class.
var populateQuery = [{path:'student', select:'name username email'}, {path:'class', select:'title'}];
AttendanceSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate(populateQuery).exec(cb);
};

mongoose.model('Attendance', AttendanceSchema);
