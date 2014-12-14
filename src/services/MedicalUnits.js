
(function(app){
    'use strict';

    var MedicalUnits = function($http) {
        return {
            getPharmacies: function() {
                return $http.get("api/pharmacies/town/brasov.json");
            },
            getHospitals: function() {
                return $http.get("api/hospitals/town/brasov.json");
            }
        }
    };

    app.service("MedicalUnits", MedicalUnits)
}(angular.module("medimap")));