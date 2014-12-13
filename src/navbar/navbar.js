
(function(app) {
    'use strict';

    var navbar = function() {
        return {
            restrict: "AE",
            templateUrl: "src/navbar/navbar.html"
        }
    };

    app.directive("navbar", navbar)

} (angular.module("medimap")));