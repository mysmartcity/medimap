(function(app) {
    'use strict';

    var MapCtrl = function($scope, MapFactory, MedicalUnits) {
        MapFactory.renderMap();

        MedicalUnits.getPharmacies()
            .success(function(data) {
                MapFactory.addPharmacies(data);
            })
            .error(function() {
                console.log("Farmaciile nu au putut fi citite");
            });

        MedicalUnits.getHospitals()
            .success(function(data) {
                MapFactory.addHospitals(data);
            })
            .error(function() {
                console.log("Farmaciile nu au putut fi citite");
            });

        $scope.showHospital = function(ID) {
            console.log(ID);
        }
    };

    app.controller("MapCtrl", MapCtrl)

} (angular.module("medimap")));