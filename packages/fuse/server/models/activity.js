'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Activity Schema
 */
var ActivitySchema = new Schema({
    PatronId: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    TrainerId: {
        type: Schema.ObjectId,
        required: true,
        ref: 'User'
    },
    Date: {
        type: Date,
        required: true
    },
    ActivityType: {
        type: String,
        required: true
    },
    KinectFrames: [{
        type: String
    }],
    ActivityData: [{
        type: String
    }]
});

var populateQuery = [{path:'PatronId', select:'name username email'}, {path:'TrainerId', select:'name username email'}];

ActivitySchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populoate(populateQuery).exec(cb);
};

mongoose.model('Activity', ActivitySchema);
