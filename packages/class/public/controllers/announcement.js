'use strict';

angular.module('mean.class').controller('AnnouncementController', ['$scope', '$location', '$stateParams', 'Global', 'Class', 'Announcement',
    function($scope, $location, $stateParams, Global, Class, Announcement) {
        $scope.global = Global;
        $scope.findClasses = function() {
            if ($scope.global.user.roles.indexOf('admin')) {
                Class.class_.query(function(classes) {
                    $scope.classlist = classes;
                });
            } else {
                Class.classByInstructor.query({instructorId: $scope.global.user._id}, function(classes) {
                    $scope.classlist = classes;
                });
            }
        };

        $scope.listClass = function() {
            Class.class_.query(function(classes) {
                $scope.classes = classes;
            });
        };

        $scope.announcementSubmit = function() {
            var a = new Announcement.announcement({
                class_: $scope.announceclass._id,
                title: $scope.title,
                content: $scope.content
            });

            a.$save(function(res) {
                $location.path('announcement');
            });
        };

        $scope.announcementList = function() {
            Announcement.announcementByClass.query({}, function(announcements) {
                $scope.announcementlist = announcements;
            });
        };

        $scope.announcementListByClass = function() {
            Announcement.announcementByClass.query({classId: $stateParams.classId}, function(announcements) {
                $scope.announcementlist = announcements;
            });
        };
    }
]);
