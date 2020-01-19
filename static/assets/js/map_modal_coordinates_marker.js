var map = new L.Map('map', {
    'center': [36, 103],
    'zoom': 8,
    'layers': [layer_base_osm]
});

var marker = L.marker([36, 103], {
    draggable: true
}).addTo(map);

marker.on('dragend', function (e) {
    $('.latitude').val(marker.getLatLng().lat);
    $('.longitude').val(marker.getLatLng().lng);
});