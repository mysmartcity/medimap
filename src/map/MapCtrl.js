(function(app) {
    'use strict';

    var MapCtrl = function() {
        var iconFeatures=[];

        var iconFeature = new ol.Feature({
            geometry: new ol.geom.Point(ol.proj.transform([25.63, 45.655], 'EPSG:4326', 'EPSG:900913')),
            name: 'Null Island',
            population: 4000,
            rainfall: 500
        });

        iconFeatures.push(iconFeature);

        var vectorSource = new ol.source.Vector({
            features: iconFeatures //add an array of features
        });

        var iconStyle = new ol.style.Style({
            image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
                anchor: [0,0],
                anchorXUnits: 'fraction',
                anchorYUnits: 'pixels',
                opacity: 0.75,
                src: 'styles/images/icon.png'
            }))
        });

        var vectorLayer = new ol.layer.Vector({
            source: vectorSource,
            style: iconStyle
        });

        var map = new ol.Map({
            target: document.getElementById('map'),
            layers: [
                new ol.layer.Tile({
                    source: new ol.source.MapQuest({layer: 'osm'})
                }),
                vectorLayer
            ],
            view: new ol.View({
                center: ol.proj.transform([25.61, 45.655], 'EPSG:4326', 'EPSG:900913'),
                zoom: 13
            })
        });

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
                function(feature, layer) {
                    return feature;
                });
            if (feature) {
                var geometry = feature.getGeometry();
                var coord = geometry.getCoordinates();
                popup.setPosition(coord);
                $(element).popover({
                    'placement': 'top',
                    'html': true,
                    'content': feature.get('name') + " population: " + feature.get('population')
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
    };

    app.controller("MapCtrl", MapCtrl)

} (angular.module("medimap")));