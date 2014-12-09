'use strict';

var activity = require('../controllers/activity');

module.exports = function(Fuse, app, auth, database) {
    app.route('/activity')
        .get(auth.requiresLogin, activity.getActivityList)
        .post(auth.requiresLogin, activity.create);
    app.route('/activity/:activityId')
        .get(auth.requiresLogin, activity.getActivity);
};
