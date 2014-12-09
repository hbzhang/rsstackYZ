'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Activity = mongoose.model('Activity');

var populateQuery = [{path:'PatronId', select:'name username email'}, {path:'TrainerId', select:'name username email'}];

/**
 * Create an activity
 */
exports.create = function(req, res) {
    var activity = new Activity(req.body);
    activity.Date = new Date();
    activity.save(function(err) {
        if (err) {
            console.log(err);
            return res.jsonp(500, {error: 'cannot submit the activity'});
        }
        res.jsonp(activity);
    });
};

exports.destroy = function(req, res) {
    var activityId = req.params.activityId;
    Activity.remove({_id:activityId}, function(err, activity) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot delete the activity'
            });
        }
        res.jsonp(activity);
    });
};

exports.getActivityList = function(req, res) {
    var query = {};
    if (!req.user.isAdmin()) {
        query = {PatronId: req.user._id};
    }
    Activity.find(query).exec(function(err, activities) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the activity'
            });
        }

        var activitylist = [];
        for (var a in activities) {
            activitylist.push(activities[a]._id);
        }

        res.jsonp(activitylist);
    });
};

exports.getActivity = function(req, res) {
    var activityId = req.params.activityId;
    var query = {};
    if (!req.user.isAdmin()) {
        query = {PatronId: req.user._id, _id: activityId};
    } else {
        query = {_id: activityId};
    }

    Activity.find(query).populate(populateQuery).exec(function(err, activity) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot query the activity'
            });
        }

        res.jsonp(activity);
    });
};
