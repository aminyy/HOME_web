$(function () {
    var map = L.map('map').setView([32.32, 71.56], 4);
    L.tileLayer('http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=f1a5b2c434607d3ebf3552166c3b4dc3').addTo(map);
    L.tileLayer('http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=f1a5b2c434607d3ebf3552166c3b4dc3').addTo(map);
    // L.tileLayer('http://t0.tianditu.com/DataServer?T=ibo_w&x={x}&y={y}&l={z}&tk=f1a5b2c434607d3ebf3552166c3b4dc3').addTo(map);
    // FeatureGroup is to store editable layers
    var drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
        draw: {
            polygon: false,
            marker: false,
            polyline: false,
            circle: false,
            rectangle: {
                allowIntersection: false, // Restricts shapes to simple polygons
                drawError: {
                    color: '#e1e100', // Color the shape will turn when intersects
                    message: '<strong>Oh snap!<strong> you can\'t draw that!' // Message that will show when intersect
                },
                shapeOptions: {
                    color: '#f26419',
                    opacity: 0.8
                }
            },
        },
        edit: {
            featureGroup: drawnItems,
            edit: false
        }
    });
    map.addControl(drawControl);
    map.on('draw:created', function (event) {
        var layer = event.layer;
        drawnItems.addLayer(layer);
        var latlngs = drawnItems.getBounds();
        $('#west').val(latlngs.getWest());
        $('#south').val(latlngs.getSouth());
        $('#north').val(latlngs.getNorth());
        $('#east').val(latlngs.getEast());
    });
    var cp = new L.GeoJSON.AJAX("/static/json/china_pak.geojson", {
        style: function(feature) {
			return {
				color: '#f1a400',
				weight: 2
			};
		}
    });
    cp.addTo(map);

    $('.date-picker').datepicker({format: 'yyyy-mm-dd'});
});