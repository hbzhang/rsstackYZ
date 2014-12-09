'use strict';

var mongoose = require('mongoose'),
    Upload = mongoose.model('Upload'),
    grid = require('gridfs-stream');

var gfs = new grid(mongoose.connection.db, mongoose.mongo);

exports.getfile = function(req, res) {
    var fileId = req.params.fileId;
    Upload.findOne({fileid:fileId}, function(err, upload) {
        if (err || upload === undefined || upload === null) {
            return res.jsonp(500, {
                error: 'Cannot find this file'
            });
        }

        var readstream = gfs.createReadStream({
            _id: fileId
        });
        console.log(upload);
        res.setHeader('Content-disposition', 'attachment; filename='+upload.filename);
        readstream.pipe(res);
    });
};

exports.uploadfile = function(req, res) {
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename){
        var fstream = gfs.createWriteStream({
            filename: filename
        });
        file.pipe(fstream);
        fstream.on('close', function(file) {
            // Now store this file with Upload schema
            var upload = new Upload();
            upload.owner = req.user._id;
            upload.date = new Date();
            upload.fileid = file._id;
            upload.filename = file.filename;
            console.log(file);
            console.log(upload);
            upload.save(function(err) {
                if (err) {
                    return res.jsonp(500, {error: 'Cannot upload this file'});
                }

                if (req.class_ !== undefined) {
                    req.class_.syllabus.push(upload._id);
                    req.class_.save(function(err) {
                        if (err) {
                            return res.jsonp(500, {error: 'Cannot upload this file'});
                        }
                        res.jsonp(upload);
                    });
                } else {
                    res.jsonp(upload);
                }
            });
        });
    });
};

exports.destroy = function(req, res) {
    var id = req.params.fileId;
    Upload.findOne({fileid:id}, function(err, file) {
        if (err || file === undefined || file === null) {
            return res.jsonp(500, {
                error: 'Cannot find this file'
            });
        }

        file.remove(function(err) {
            if (err) {
                return res.jsonp(500, {
                    error: 'Cannot delete the file'
                });
            }

            gfs.remove({_id:id}, function(err) {
                if (err) {
                    return res.jsonp(500, {error: 'Holy cannot delete the file!'});
                }
                res.jsonp(file);
            });
        });
    });
};
