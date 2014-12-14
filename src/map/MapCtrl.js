(function(app) {
    'use strict';

    var MapCtrl = function($scope, MapFactory, MedicalUnits) {
        MapFactory.renderMap();

        MedicalUnits.getPharmacies()
            .success(function(data) {
                MapFactory.addPharmacies(data);
                $scope.pharmacies = data;
            })
            .error(function() {
                toastr.error("Farmaciile nu au putut fi citite");
            });

        MedicalUnits.getHospitals()
            .success(function(data) {
                MapFactory.addHospitals(data);
                $scope.hospitals = data;
            })
            .error(function() {
                toastr.error("Lista spitalelor nu au putut fi citită");
            });

        // TODO: this is a hack. Use scope instead
        window.showHospital = function(ID) {
            for ( var i = 0 ; i < $scope.hospitals.length; i++ ) {
                if ($scope.hospitals[i].ID == ID ) {
                    $scope.hospital = $scope.hospitals[i];
                    $scope.$apply();

                    $("#hospitalInfo").modal("show");

                    break;
                }
            }
        };
        // TODO: this is a hack. Use scope instead
        window.showPharmacy = function(ID) {
            for ( var i = 0 ; i < $scope.pharmacies.length; i++ ) {
                if ($scope.pharmacies[i].ID == ID ) {
                    $scope.pharmacy = $scope.pharmacies[i];
                    $scope.$apply();

                    $("#pharmacyInfo").modal("show");

                    break;
                }
            }
        };
    };

    app.controller("MapCtrl", MapCtrl)

} (angular.module("medimap")));