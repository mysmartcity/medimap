
(function(app){
    'use strict';

    var MapFactory = function() {
        var _service = {
            //
            // Borrowed from:
            // http://mapicons.nicolasmollet.com/
            //
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
                    var feature = map.forEachFeatureAtPixel(evt.pixel, function(feature) {
                        return feature;
                    });


                    if (feature) {

                        var geometry = feature.getGeometry();
                        var coord = geometry.getCoordinates();


                        var content = "none";

                        console.log(feature.get('properties')["name"]);

                        if (feature.get('properties')["type"] === "pharmacy") {
                            content = '<div class="map-popup"><img src="styles/images/pharmacies/' + feature.get('properties')["Picture"] + '" alt=""/>' +'<b>' + feature.get('properties')["name"] +
                                "</b></br>" + feature.get('properties')["address"] +
                                '</br><button class="btn btn-primary" onclick="showPharmacy(' + feature.get('properties')["ID"] + ')">Informații</button>' +
                            '</div>'
                        }
                        else if (feature.get('properties')["type"] === "hospital") {

                            content = '<div class="map-popup"><img src="styles/images/hospitals/' + feature.get('properties')["Picture"] + '" alt=""/>' +
                                "<b>" + feature.get('properties')["name"] +
                                "</b></br>" + feature.get('properties')["Address"] + "<br/>" +
                                '<button class="btn btn-primary" onclick="showHospital(' + feature.get('properties')["ID"] + ')">Informații</button>' +
                            '</div>'

                        }
                        popup.setPosition(coord);

                        $(element).popover({
                            'placement': 'top',
                            'html': true,
                            'content': content
                        });

                        $(element).popover('show');
                        //
                        // Hack because content does not update
                        //
                        $(".popover-content").html(content);

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
                            type: "pharmacy",
                            ID: pharmacies[i].ID,
                            name: pharmacies[i].Name,
                            address: pharmacies[i].Address,
                            Picture: pharmacies[i].Picture
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
                            type: "hospital",
                            ID: hospitals[i].ID,
                            Picture: hospitals[i].Picture,
                            Address: hospitals[i].Address,
                            name: hospitals[i].Name
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