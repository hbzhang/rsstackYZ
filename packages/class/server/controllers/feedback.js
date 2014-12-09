'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Feedback = mongoose.model('Feedback');

var populateQuery = [{path:'owner', select:'name username'}];

/**
 * Create a feedback
 */
exports.create = function(req, res) {
    var feedback = new Feedback(req.body);
    // The creator is set here
    feedback.owner = req.user._id;
    // The creation date is set here.
    feedback.date = new Date();
    feedback.save(function(err) {
        if (err) {
            return res.jsonp(500, {error: 'cannot submit the feedback'});
        }
        res.jsonp(feedback);
    });
};

exports.destroy = function(req, res) {
    var feedbackId = req.params.feedbackId;
    Feedback.remove({_id:feedbackId}, function(err, feedback) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot delete the feedback'
            });
        }
        res.jsonp(feedback);
    });
};

exports.destroyByClass = function(classId, cb) {
    Feedback.remove({class_: classId}, cb);
};

/**
 * List feedbacks by classid
 */
exports.getFeedbackByClass = function(req, res) {
    var classId = req.params.classId;
    Feedback.find({class_:classId}).populate(populateQuery).exec(function(err, feedback){
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the feedbacks'
            });
        }
        res.jsonp(feedback);
    });
};
