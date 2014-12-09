'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    uuid = require('node-uuid');

var fields = '_id email name username';

/**
 * List all students.
 */
exports.students = function(req, res) {
    User.find({roles:'student'}, fields).exec(function(err, students) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the students'
            });
        }
        res.jsonp(students);
    });
};

/*
 * POST the email and the name. If there's a user match in the database,
 * return the user object. Otherwise create a new user based on the provided
 * information, use a random string as the new user's password.
 * {
 *     email: 'a@b.com',
 *     name: 'Holy Mercy',
 * }
 *
 * */
exports.listStudentByEmail = function(req, res) {
    var params = req.body;
    User.findOne({email: params.email}, fields).exec(function(err, student) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the students'
            });
        }

        if (student === null) {
            student = {};
            student.email = params.email;
            student.name = params.name;
            student.username = params.email;
            student.roles = ['authenticated', 'student'];
            student.password = uuid.v1();
            student.confirmPassword = student.password;
            var user = new User(student);
            user.save(function(err) {
                if (err) {
                    return res.jsonp(500, {
                        error: 'Cannot create a new student'
                    });
                }

                student.password = undefined;
                student.confirmPassword = undefined;
                student._id = user._id;
                res.jsonp(student);
            });
        } else {
            res.jsonp(student);
        }
    });
};
