'use strict';

angular.module('mean.class').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider
            .state('create announcement', {
                url: '/announcement/create',
                templateUrl: 'class/views/create_announcement.html'
            })
            .state('announcements', {
                url: '/announcement',
                templateUrl: 'class/views/view_announcement.html'
            })
            .state('create class', {
                url: '/class/create',
                templateUrl: 'class/views/create.html'
            })
            .state('instructor class', {
                url: '/class/instructor/:instructorId',
                templateUrl: 'class/views/instructor.html'
            })
            .state('location class', {
                url: '/class/location/:location',
                templateUrl: 'class/views/location.html'
            })
            .state('my class', {
                url: '/class/myclass/:studentId',
                templateUrl: 'class/views/myclass.html'
            })
            .state('class', {
                url: '/class',
                templateUrl: 'class/views/list.html'
            })
            .state('view class', {
                url: '/class/view/:classId',
                templateUrl: 'class/views/view.html'
            })
            .state('edit class', {
                url: '/class/edit/:classId',
                templateUrl: 'class/views/edit.html'
            })
            .state('class calendar', {
                url: '/class/calendar',
                templateUrl: 'class/views/calendar.html'
            });
    }
]);
