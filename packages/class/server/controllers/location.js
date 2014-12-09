'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Class = mongoose.model('Class');

var fields = 'location';

/**
 * List all locations.
 */
exports.locations = function(req, res) {
    Class.collection.distinct('location', fields, function(err, results) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the students'
            });
        }

        res.jsonp(results);
    });
};