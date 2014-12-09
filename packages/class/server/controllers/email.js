'use strict';
var mongoose = require('mongoose'),
    User = mongoose.model('User'),
    Class = mongoose.model('Class'),
    nodemailer = require('nodemailer'),
    config = require('meanio').loadConfig();

var transporter = nodemailer.createTransport('SMTP', config.mailer);

var populateQuery = [{path:'students', select:'name username email'}];

exports.sendMailToClass = function(classId, sender, title, content) {
    Class.findOne({_id:classId}).populate(populateQuery).exec(function(err, class_) {
        if (err) {
            return err;
        }

        var recipients = '';
        for (var i = 0; i < class_.students.length; i += 1) {
            recipients += class_.students[i].name + ' <' + 
                            class_.students[i].email + '>, ';
        }
        console.log(recipients);

        var mailOptions = {
            from: sender + ' <vtrstest@gmail.com>',
            to: recipients,
            subject: title,
            text: content
        };

        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.log(info);
                console.log(err);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    });
};

exports.sendMailToStudent = function(userId, sender, title, content) {
    User.findOne({_id:userId}).exec(function(err, user) {
        if (err) {
            return err;
        }

        var recipients = user.name + ' <' + user.email + '>';

        var mailOptions = {
            from: sender + ' <vtrstest@gmail.com>',
            to: recipients,
            subject: title,
            text: content
        };

        transporter.sendMail(mailOptions, function(err, info) {
            if (err) {
                console.log(err);
            } else {
                console.log('Message sent: ' + info.response);
            }
        });
    });
};
