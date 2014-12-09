'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    classmail = require('./email'),
    announcement = require('./announcement'),
    comment = require('./comment'),
    feedback = require('./feedback'),
    Class = mongoose.model('Class'),
    Upload = mongoose.model('Upload'),
    _ = require('lodash'),
    grid = require('gridfs-stream');

var populateQuery = [{path:'instructor', select:'name username'}, {path:'students', select:'name username'}, {path:'syllabus'}, {path:'thumbnail'}];
var gfs = new grid(mongoose.connection.db, mongoose.mongo);

/**
 * Find classes by id
 */
exports.class_ = function(req, res, next, id) {
    Class.load(id, function(err, class_) {
        if (err) return next(err);
        if (!class_) return next(new Error('Failed to load class' + id));
        req.class_ = class_;
        next();
    });
};

exports.view = function(req, res) {
    res.jsonp(req.class_);
};

var generateAllDates = function(class_) {
    var d = new Date(class_.startdate.getTime());
    var all = [];
    // Find all possible dates
    while (d.getTime() <= class_.enddate.getTime()) {
        for (var wd in class_.weekdays) {
            if (d.getDay() === class_.weekdays[wd]) {
                var newd = new Date(d.getTime());
                newd.setHours(class_.weektime.getHours());
                newd.setMinutes(class_.weektime.getMinutes());
                all.push(newd);
                console.log(newd);
            }
        }
        d.setDate(d.getDate() + 1);
    }

    // Filter out the exclusions
    all = all.filter(function(el) {
        return class_.exclusiondates.indexOf(el) === -1;
    });

    return all;
};

var dateValidation = function(class_) {
    var e;
    // Start date must be prior to end date
    if (class_.enddate <= class_.startdate) {
        return 'Start date must be less than end date';
    }

    console.log(class_.exclusiondates[0] < class_.startdate);
    console.log(class_.startdate < class_.enddate);
    console.log(class_.enddate);
    // Exclusion dates must be between the start date and end date
    for (e = 0; e < class_.exclusiondates.length; e += 1) {
        console.log(class_.exclusiondates[e]);
        if (class_.exclusiondates[e] > class_.enddate || class_.exclusiondates[e] < class_.startdate) {
            return 'Exclusion dates must be between the start date and end date';
        }
    }

    if (class_.weekdays.indexOf(class_.startdate.getDay()) === -1 ||
         class_.weekdays.indexOf(class_.enddate.getDay()) === -1) {
            return 'Start date and end date must be on the weekdays';
    }

    // Exclusion dates must be on weekdays
    for (e = 0; e < class_.exclusiondates.length; e += 1) {
        if (class_.weekdays.indexOf(class_.exclusiondates[e].getDay()) === -1) {
            return 'Exclusion dates must be on weekdays';
        }
    }

    // Seems OK in the end
    return '';
};

/**
 * Update a class
 */
exports.update = function(req, res) {
    var class_ = req.class_;
    class_ = _.extend(class_, req.body);

    var e = dateValidation(class_);
    if (e !== '') {
        return res.jsonp(500, {
            error: e
        });
    }

    class_.alldates = generateAllDates(class_);

    if (!req.user.hasRole('admin')) {
        // Only admin can update the instructor of a class.
        class_.instructor = req.class_.instructor;
    }

    class_.save(function(err) {
        if (err) {
            console.log(err);
            return res.jsonp(500, {
                error: 'Cannot update the class'
            });
        }
        res.jsonp(class_);
    });
};

/**
 * Create an class 
 */
exports.create = function(req, res) {
    var class_ = new Class(req.body);

    console.log(class_);
    var e = dateValidation(class_);
    if (e !== '') {
        console.log(e);
        return res.jsonp(500, {
            error: e
        });
    }

    class_.alldates = generateAllDates(class_);

    class_.save(function(err) {
        if (err) {
            console.log(err);
            return res.jsonp(500, {error: 'cannot save the class'});
        }
        res.jsonp(class_);
    });
};

/*
 * Join the class with current user id.
 *
 */
exports.join = function(req, res) {
    var class_ = req.class_;
    var students = class_.students;

    for (var i in students) {
        if (students[i]._id !== undefined &&
                students[i]._id.toString() === req.user._id.toString()) {
            console.log(students[i]._id.toString());
            console.log(req.user._id.toString());
            return res.jsonp(500, {error: 'already in this class'});
        }
    }

    class_.students.push(req.user._id);
    class_.save(function(err) {
        if (err) {
            return res.jsonp(500, {error: 'cannot save the class'});
        }
        res.jsonp(req.user);
    });

    var sender;
    if (class_.instructor) {
        sender = class_.instructor.name;
    } else {
        sender = 'DSA';
    }

    classmail.sendMailToStudent(req.user._id, sender, 'Welcome to '+class_.title, class_.emailtemplate);
};

exports.listClassByInstructor = function(req, res) {
    var instructorid = req.params.instructorId;
    Class.find({instructor:instructorid}).populate(populateQuery).exec(function(err, classes){
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the classes'
            });
        }
        res.jsonp(classes);
    });
};

exports.listClassByStudent = function(req, res) {
    var student = req.params.studentId;
    Class.find({students:student}).populate(populateQuery).exec(function(err, classes){
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the classes'
            });
        }
        res.jsonp(classes);
    });
};

exports.listClassByLocation = function(req, res) {
    var location = req.params.location;
    Class.find({location:location}).populate(populateQuery).exec(function(err, classes){
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the classes'
            });
        }
        res.jsonp(classes);
    });
};

exports.listClassByDate = function(req, res) {
    var date = new Date();
    date.setTime(req.params.timestamp);
    date.setHours(0, 0, 0, 0);
    Class.find({alldates: date}).populate(populateQuery).exec(function(err, classes) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the classes'
            });
        }
        res.jsonp(classes);
    });
};

/**
 * Delete a class
 */
exports.destroy = function(req, res) {
    var class_ = req.class_;

    feedback.destroyByClass(class_._id, function(){});
    announcement.destroyByClass(class_._id, function(){});
    comment.destroyByClass(class_._id, function(){});

    class_.remove(function(err) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot delete the class'
            });
        }

        // Then delete the thumbnail.
        Upload.findOne({_id:class_.thumbnail}, function(err, file) {
            gfs.remove({_id:file.fileid}, function() {});
        });

        var removefunc = function(err, file) {
            if (err) {
                return;
            }
            gfs.remove({_id:file.fileid}, function(err) {
                if (err) {
                    console.log('Error in deleting files' + err);
                }
            });
        };
        // Then delete all the files under this class.
        for (var u = 0; u < class_.syllabus.length; u += 1) {
            Upload.findOneAndRemove({_id:class_.syllabus[u]._id}, removefunc);
        }
        res.jsonp(class_);
    });
};

/**
 * List of Classes
 */
exports.all = function(req, res) {
    Class.find({}, '_id capacity startdate enddate thumbnail title instructor location alldates').populate(populateQuery).exec(function(err, classes) {
        if (err) {
            return res.jsonp(500, {
                error: 'Cannot list the classes'
            });
        }
        res.jsonp(classes);
    });
};
