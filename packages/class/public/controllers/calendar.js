'use strict';

angular.module('mean.class').controller('CalendarController', ['$scope', '$location', '$stateParams', 'Global', 'Class',
    function($scope, $location, $stateParams, Global, Class) {
        $scope.ev = [];
        /* config object */
        $scope.uiConfig = {
            calendar:{
                height: 550,
                editable: true,
                header:{
                    left: 'month basicWeek basicDay agendaWeek agendaDay',
                    center: 'title'
                },
            }
        };

        $scope.changeView = function(view, calendar) {
            calendar.fullCalendar('changeView', view);
        };

        $scope.renderCalendar = function(calendar) {
            calendar.fullCalendar('render');
        };

        $scope.listClass = function() {
            Class.class_.query(function(classes) {
                for (var i = 0; i < classes.length; i += 1) {
                    for (var j = 0; j < classes[i].alldates.length; j += 1) {
                        $scope.ev.push({
                            title: classes[i].title,
                            start: classes[i].alldates[j],
                            end: classes[i].alldates[j],
                        });
                    }
                }
            });
        };

        $scope.evF = function (start, end, callbackjs) {
            Class.class_.query(function(classes) {
                for (var i = 0; i < classes.length; i += 1) {
                    for (var j = 0; j < classes[i].alldates.length; j += 1) {
                        $scope.ev.push({
                            title: classes[i].title,
                            start: classes[i].alldates[j],
                            end: classes[i].alldates[j],
                        });
                    }
                }
                console.log($scope.ev);
            });
        };

        $scope.eventSources = [
            $scope.evF,
            $scope.ev
        ];
    }
]);
