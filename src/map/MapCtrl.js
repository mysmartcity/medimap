(function(app) {
    'use strict';

    var MapCtrl = function(MapFactory, MedicalUnits) {
        MapFactory.renderMap();

        MedicalUnits.getPharmacies()
            .success(function(data) {
                console.log(data);
            })
            .error(function() {
                console.log("Farmaciile nu au putut fi citite");
            })
    };

    app.controller("MapCtrl", MapCtrl)

} (angular.module("medimap")));