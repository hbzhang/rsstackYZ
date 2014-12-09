'use strict';

angular.module('mean.fuse').controller('FuseController', ['$scope', '$location', 'Global', 'Activity', 'FileUploader', 'Upload', 'Users',
    function($scope, $location, Global, Activity, FileUploader, Upload, User) {
        $scope.global = Global;
        $scope.package = {
            name: 'fuse'
        };
        $scope.frames = [];

        var uploader = $scope.uploader = new FileUploader({
            scope: $scope,
            url: '/upload'
        });

        $scope.uploadComplete = true;
        $scope.upload = function() {
            $scope.uploadComplete = false;
            $scope.frames = [];
            uploader.uploadAll();
        };

        uploader.onSuccessItem = function(item, res, status, header) {
            $scope.uploadComplete = true;
            $scope.frames.push('/upload/' + res.fileid);
        };

        $scope.activitySubmit = function() {
            var act = new Activity.activity({
                PatronId: $scope.patron._id,
                TrainerId: $scope.trainer._id,
                KinectFrames: $scope.frames,
                ActivityType: $scope.type
            });

            act.$save(function(res) {
                $location.path('/');
            });
        };

        $scope.activityInit = function() {
            User.query(function(users) {
                $scope.patrons = users;
                $scope.trainers = users;
            });
        };
    }
]);
