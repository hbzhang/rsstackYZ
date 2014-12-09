'use strict';

angular.module('mean.class').factory('Class', function($resource) {
    return {
        class_: $resource('class/:classId', {classId:'@_id'}, {update: {method: 'PUT'}}, {query: {method: 'GET', params:{}, isArray: true}}),
        instructors: $resource('instructor', {}, {query: {method: 'GET', params:{}, isArray: true}}),
        locations: $resource('location', {}, {query: {method: 'GET', params:{}, isArray: true}}),
        classByInstructor: $resource('class/instructor/:instructorId', {}, {query: {method: 'GET', params:{}, isArray: true}}),
        classByLocation: $resource('class/location/:location', {}, {query: {method: 'GET', params:{}, isArray: true}}),
        classByStudent: $resource('class/student/:studentId', {}, {query: {method: 'GET', params:{}, isArray: true}}),
        join: $resource('class/join/:classId', {}, {get: {method: 'GET', params:{}, isArray: false}}),
    };
});

angular.module('mean.class').factory('Feedback', function($resource) {
    return {
        feedback: $resource('feedback/:feedbackId', {feedbackId:'@_id'}),
        feedbackByClass: $resource('feedback/view/:classId', {}, {query: {method: 'GET', params:{}, isArray: true}})
    };
});

angular.module('mean.class').factory('Upload', function($resource) {
    return {
        upload: $resource('upload/:fileId')
    };
});

angular.module('mean.class').factory('Comment', function($resource) {
    return {
        commentByClass: $resource('comment/view/:classId', {}, {query: {method: 'GET', params:{}, isArray: true}}),
        comment: $resource('comment/:commentId', {commentId: '@_id'})
    };
});

angular.module('mean.class').factory('Announcement', function($resource) {
    return {
        announcementByClass: $resource('announcement/view/:classId', {}, {query: {method: 'GET', params:{}, isArray: true}}),
        announcement: $resource('announcement/:announcementId', {announcementId: '@_id'})
    };
});
