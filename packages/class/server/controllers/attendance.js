'use strict';
var mongoose = require('mongoose'),
    Class = mongoose.model('Class'),
    Attendance = mongoose.model('Attendance');

var populateQuery = [{path:'student', select:'name username email'}, {path:'class', select:'title'}];
exports.create = function(req, res) {
    var attendance = new Attendance(req.body);

    var date = new Date();
    date.setTime(attendance.date.getTime());
    date.setHours(0, 0, 0, 0);
    Class.find({_id: attendance.class_, alldates: date, students: attendance.student}).exec(function(err, classes) {
        if (classes.length === 0) {
            return res.jsonp(500, {error: 'No class for student'+ attendance.student+ 'on ' + date});
        } else {
            Attendance.findOne({student: attendance.student, class_: attendance.class_, date: {$gte: date, $lt: date}});
            attendance.save(function(err) {
                if (err) {
                    return res.jsonp(500, {error: 'cannot submit the attendance'});
                }
                res.jsonp(attendance);
            });
        }
    });
};

/*
 * Post without date
 */
exports.create_test = function(req, res) {
    var attendance = new Attendance(req.body);

    var date = new Date();
    date.setTime(attendance.date.getTime());
    date.setHours(0, 0, 0, 0);
    attendance.date = date;
    Class.find({_id: attendance.class_, students: attendance.student}).exec(function(err, classes) {
        if (classes.length === 0) {
            return res.jsonp(500, {error: 'No class for student'+ attendance.student+ 'on ' + date});
        } else {
            Attendance.findOne({student: attendance.student, class_: attendance.class_, date: {$gte: date, $lt: date}});
            attendance.save(function(err) {
                if (err) {
                    return res.jsonp(500, {error: 'cannot submit the attendance'});
                }
                res.jsonp(attendance);
            });
        }
    });
};

exports.listAttendanceByClass = function(req, res) {
    var id = req.params.classId;
    var query = {};

    // * Admin can see all the classes
    // * Instructor and student can only see his own classes
    // * Others can see nothing
    if (req.user.hasRole('admin')) {
        query = {_id: id};
    } else if (req.user.hasRole('instructor')) {
        query = {_id: id, instructor: req.user._id};
    } else if (req.user.hasRole('student')){
        query = {_id: id, students: req.user._id};
    } else {
        return res.jsonp(403, {
            error: 'You don\'t have that permisson'
        });
    }

    Class.findOne(query).exec(function (err, class_) {
        if (err || class_ === null || class_ === undefined) {
            return res.jsonp(500, {
                error: 'Invalid class'
            });
        }

        Attendance.find({class_: id}).populate(populateQuery).exec(function(err, attendances) {
            if (err) {
                return res.jsonp(500, {
                    error: 'Cannot list the attendances'
                });
            }
            res.jsonp(attendances);
        });
    });
};

exports.destroyByClass = function(classId, cb) {
    Attendance.remove({class_: classId}, cb);
};
