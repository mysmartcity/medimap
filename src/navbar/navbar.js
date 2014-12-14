
(function(app) {
    'use strict';

    var navbar = function() {
        return {
            restrict: "AE",
            templateUrl: "src/navbar/navbar.html",
            link: function($scope) {
                $scope.showLegend = function() {
                    $("#legendModal").modal("show");
                };

                $scope.showAbout = function() {
                    $("#aboutModal").modal("show");
                }
            }
        }
    };

    app.directive("navbar", navbar)

} (angular.module("medimap")));