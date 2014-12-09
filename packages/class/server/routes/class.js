'use strict';

var classes = require('../controllers/class');
var feedback = require('../controllers/feedback');
var instructor = require('../controllers/instructor');
var student = require('../controllers/student');
var upload = require('../controllers/files');
var comment = require('../controllers/comment');
var announcement = require('../controllers/announcement');
var attendance = require('../controllers/attendance');
var classlocation = require('../controllers/location');

var isAdmin = function(req, res, next) {
    if (!req.user.isAdmin()) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

var isStudent = function(req, res, next) {
    if (!req.user.isAdmin() && !req.user.hasRole('student')) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

var isInstructor = function(req, res, next) {
    if (!req.user.isAdmin() && !req.user.hasRole('instructor')) {
        return res.send(401, 'User is not authorized');
    }
    next();
};

var hasClassUpdatePermission = function(req, res, next) {
    if (req.user.isAdmin() ||(req.class_ && req.class_.instructor._id === req.user._id)) {
        next();
    } else {
        return res.send(401, 'User is not authorized');
    }
};

// The Package is past automatically as first parameter
module.exports = function(Class, app, auth, database) {

    app.route('/feedback/view/:classId')
        .get(auth.requiresLogin, feedback.getFeedbackByClass);
    app.route('/feedback/:feedbackId')
        .delete(auth.requiresLogin, isAdmin, feedback.destroy);
    app.route('/feedback')
        .post(auth.requiresLogin, isStudent, feedback.create);

    app.route('/upload')
        .post(auth.requiresLogin, isInstructor, upload.uploadfile);
    app.route('/upload/:fileId')
        .get(auth.requiresLogin, upload.getfile)
        .delete(auth.requiresLogin, isInstructor, upload.destroy);

    app.route('/class/location/:location')
        .get(auth.requiresLogin, classes.listClassByLocation);
    app.route('/class/instructor/:instructorId')
        .get(auth.requiresLogin, classes.listClassByInstructor);
    app.route('/class/student/:studentId')
        .get(auth.requiresLogin, classes.listClassByStudent);
    app.route('/class/date/:timestamp')
        .get(auth.requiresLogin, classes.listClassByDate);
    app.route('/class/join/:classId')
        .get(auth.requiresLogin, isStudent, classes.join);
    app.route('/class/:classId')
        .get(auth.requiresLogin, classes.view)
        .put(auth.requiresLogin, hasClassUpdatePermission, classes.update)
        .delete(auth.requiresLogin, isAdmin, classes.destroy);
    app.route('/class')
        .get(auth.requiresLogin, classes.all)
        .post(auth.requiresLogin, isAdmin, classes.create);

    app.route('/comment/view/:classId')
        .get(auth.requiresLogin, comment.get);
    app.route('/comment/:commentId')
        .delete(auth.requiresLogin, hasClassUpdatePermission, comment.destroy);
    app.route('/comment')
        .post(auth.requiresLogin, hasClassUpdatePermission, comment.create);

    app.route('/announcement/view')
        .get(auth.requiresLogin, announcement.getAnnouncementByClass);
    app.route('/announcement/view/:classId')
        .get(auth.requiresLogin, announcement.getAnnouncementByClass);
    app.route('/announcement/:announcementId')
        .delete(auth.requiresLogin, isInstructor, announcement.destroy);
    app.route('/announcement')
        .post(auth.requiresLogin, isInstructor, announcement.create);

    app.route('/attendance')
        .post(auth.requiresLogin, isAdmin, attendance.create);
    app.route('/attendance_test')
        .post(auth.requiresLogin, isAdmin, attendance.create_test);
    app.route('/attendance/:classId')
        .get(auth.requiresLogin, attendance.listAttendanceByClass);

    app.route('/instructor')
        .get(auth.requiresLogin, instructor.instructors);

    app.route('/student')
        .get(auth.requiresLogin, isAdmin, student.students);
    app.route('/studentbyemail')
        .post(auth.requiresLogin, isAdmin, student.listStudentByEmail);

    app.route('/location')
        .get(auth.requiresLogin, isAdmin, classlocation.locations);

    app.param('classId', classes.class_);
};
