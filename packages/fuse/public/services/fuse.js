'use strict';

angular.module('mean.fuse').factory('Activity', function($resource) {
    return {
        activityList: $resource('/activity'),
        activity: $resource('/activity/:activityId')
    };
});
