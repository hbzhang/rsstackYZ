'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User');

var fields = '_id email name username';

/**
 * List all instructors.
 */
exports.instructors = function(req, res) {
    var query;
    if (!req.user.isAdmin()) {
        query = {no:''};
    } else {
        query = {roles: 'instructor'};
    }

    User.find(query, fields).exec(function(err, instructors) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the instructors'
            });
        }
        res.jsonp(instructors);
    });
};
