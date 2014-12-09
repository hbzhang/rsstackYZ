'use strict';
var mongoose = require('mongoose'),
    classmail = require('./email'),
    Announcement = mongoose.model('Announcement');

// Don't need to populate class.
var populateQuery = [{path:'owner', select:'name username'}, {path:'class_'}];

/**
 * Create an announcement
 */
exports.create = function(req, res) {
    var announcement = new Announcement(req.body);
    // The creator is set here
    announcement.owner = req.user._id;
    // The creation date is set here.
    announcement.date = new Date();
    announcement.save(function(err) {
        if (err) {
            return res.jsonp(500, {error: 'cannot submit the announcement'});
        }
        res.jsonp(announcement);
        classmail.sendMailToClass(announcement.class_, req.user.name, announcement.title, announcement.content);
    });
};

exports.destroy = function(req, res) {
    var announcementId = req.params.announcementId;
    Announcement.remove({_id:announcementId}, function(err, announcement) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot delete the announcement'
            });
        }
        res.jsonp(announcement);
    });
};

exports.destroyByClass = function(classId, cb) {
    Announcement.remove({class_: classId}, cb);
};

/**
 * List announcements by classid. If classid is not defined, list all.
 */
exports.getAnnouncementByClass = function(req, res) {
    var classId = req.params.classId;
    var query = {};
    if (classId !== undefined) {
        query = {class_:classId};
    }

    Announcement.find(query).populate(populateQuery).exec(function(err, announcement){
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the announcements'
            });
        }
        res.jsonp(announcement);
    });
};
