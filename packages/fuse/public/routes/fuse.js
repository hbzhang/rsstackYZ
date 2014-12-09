'use strict';

angular.module('mean.fuse').config(['$stateProvider',
    function($stateProvider) {
        $stateProvider
            .state('create activity', {
                url: '/activity/create',
                templateUrl: 'fuse/views/create_activity.html'
            });
    }
]);
