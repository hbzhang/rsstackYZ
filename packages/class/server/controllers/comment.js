'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    classmail = require('./email'),
    Comment = mongoose.model('Comment');

var populateQuery = [{path:'instructor', select:'name username'},
                     {path:'student', select:'name username'}];

/**
 * Create a comment
 */
exports.create = function(req, res) {
    var comment = new Comment(req.body);
    comment.instructor = req.user._id;
    comment.date = new Date();
    comment.save(function(err) {
        if (err) {
            return res.jsonp(500, {error: 'cannot submit the comment'});
        }
        res.jsonp(comment);
    });

    var mailtitle = 'New comment from ' + req.user.name;
    classmail.sendMailToStudent(comment.student, 'DSA Human Resource', mailtitle, comment.content);
};

/**
 * Delete a comment
 */
exports.destroy = function(req, res) {
    var commentId = req.params.commentId;
    Comment.remove({_id:commentId}, function(err, comment) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot delete the comment'
            });
        }
        res.jsonp(comment);
    });
};

exports.destroyByClass = function(classId, cb) {
    Comment.remove({class_: classId}, cb);
};

/**
 * List comments by class
 */
exports.get = function(req, res) {
    var classId = req.params.classId;
    var condition = {};

    /**
     * Different roles see different results
     */
    if (req.user.hasRole('instructor') && !req.user.hasRole('student')) {
        condition = {class_:classId, instructor:req.user._id};
    } else if (req.user.hasRole('admin')) {
        condition = {class_:classId};
    } else if (req.user.hasRole('student') && !req.user.hasRole('instructor')) {
        condition = {class_:classId, student:req.user._id};
    }

    Comment.find(condition).populate(populateQuery).exec(function(err, comment) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the comments'
            });
        }
        res.jsonp(comment);
    });
};
