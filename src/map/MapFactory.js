
(function(app){
    'use strict';

    var MapFactory = function() {
        var _service = {
            icons: {
                pharmacy: 'styles/images/pharmacy.png',
                hospital: 'styles/images/hospital.png'
            },
            getIcon: function(coordinates, properties) {
                var icon = new ol.Feature({
                    geometry: new ol.geom.Point(ol.proj.transform(coordinates, 'EPSG:4326', 'EPSG:900913')),
                    properties: properties
                });
                return icon;
            },
            getIconStyle: function(type) {
                var iconStyle = new ol.style.Style({
                    image: new ol.style.Icon({
                        anchor: [0,0],
                        anchorXUnits: 'fraction',
                        anchorYUnits: 'pixels',
                        opacity: 0.75,
                        src: this.icons[type]
                    })
                });

                return iconStyle;
            }
        };

        var map = {};

        return {
            renderMap: function() {
                map = new ol.Map({
                    target: document.getElementById('map'),
                    layers: [
                        new ol.layer.Tile({
                            source: new ol.source.MapQuest({layer: 'osm'})
                        })
                    ],
                    view: new ol.View({
                        center: ol.proj.transform([25.61, 45.655], 'EPSG:4326', 'EPSG:900913'),
                        zoom: 13
                    })
                });

                this.addPopups()
            },
            addPopups: function() {
                var element = document.getElementById('popup');

                var popup = new ol.Overlay({
                    element: element,
                    positioning: 'bottom-center',
                    stopEvent: false
                });
                map.addOverlay(popup);

                // display popup on click
                map.on('click', function(evt) {
                    var feature = map.forEachFeatureAtPixel(evt.pixel,
                        function(feature) { return feature;});

                    if (feature) {
                        var geometry = feature.getGeometry();
                        var coord = geometry.getCoordinates();

                        popup.setPosition(coord);

                        $(element).popover({
                            'placement': 'top',
                            'html': true,
                            'content': "<b>" + feature.get('properties')["name"] +
                            "</b></br>Farmacist Sef: " + feature.get('properties')["headPharmacist"]

                        });
                        $(element).popover('show');
                    } else {
                        $(element).popover('destroy');
                    }
                });

                // change mouse cursor when over marker
                $(map.getViewport()).on('mousemove', function(e) {
                    var pixel = map.getEventPixel(e.originalEvent);
                    var hit = map.forEachFeatureAtPixel(pixel, function(feature, layer) {
                        return true;
                    });
                    if (hit) {
                        map.getTarget().style.cursor = 'pointer';
                    } else {
                        map.getTarget().style.cursor = '';
                    }
                });
            },
            addPharmacies: function(pharmacies) {
                var iconFeatures=[],
                    iconFeature;

                for (var i = 0 ; i < pharmacies.length; i++) {
                    iconFeature = _service.getIcon(
                        pharmacies[i].Coordinates, {
                            name: pharmacies[i].Name,
                            headPharmacist: pharmacies[i].HeadPharmacist
                        });
                    iconFeatures.push(iconFeature);
                }

                var vectorSource = new ol.source.Vector({
                    features: iconFeatures //add an array of features
                });

                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: _service.getIconStyle("pharmacy")
                });
                map.addLayer(vectorLayer);
            },
            addHospitals: function(hospitals) {
                var iconFeatures=[],
                    iconFeature;

                for (var i = 0 ; i < hospitals.length; i++) {
                    iconFeature = _service.getIcon(
                        hospitals[i].Coordinates, {
                            name: hospitals[i].Name,
                            headPharmacist: hospitals[i].HeadPharmacist
                        });
                    iconFeatures.push(iconFeature);
                }

                var vectorSource = new ol.source.Vector({
                    features: iconFeatures //add an array of features
                });

                var vectorLayer = new ol.layer.Vector({
                    source: vectorSource,
                    style: _service.getIconStyle("hospital")
                });
                map.addLayer(vectorLayer);
            }
        }
    };

    app.service("MapFactory", MapFactory);

}(angular.module("medimap")));