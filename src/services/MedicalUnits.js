
(function(app){
    'use strict';

    var MedicalUnits = function($http) {
        return {
            getPharmacies: function() {
                return $http.get("/api/pharmacies/town/brasov.json");
            }
        }
    };

    app.service("MedicalUnits", MedicalUnits)
}(angular.module("medimap")));