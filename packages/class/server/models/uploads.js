'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

/**
 * Upload Schema
 */
var UploadsSchema = new Schema({
    owner: {
        type: Schema.ObjectId,
        ref: 'User'
    },
    filename: {
        type: String
    },
    fileid: {
        type: Schema.ObjectId
    }
});

var populateQuery = [{path:'owner', select:'name username'}];
UploadsSchema.statics.load = function(id, cb) {
    this.findOne({
        _id: id
    }).populate(populateQuery).exec(cb);
};

mongoose.model('Upload', UploadsSchema);
