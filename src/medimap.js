
(function() {
    'use strict';

    var medimap = angular.module("medimap", ["ngRoute"]);

    medimap.config(function($routeProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "src/map/map.html",
                controller: "MapCtrl"
            })
            .otherwise({redirectTo: "/"})
    });


} ());