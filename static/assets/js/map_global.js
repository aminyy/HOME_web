var tiles_COPY = '';
var TileStream_URL = 'http://210.77.79.190:20020/v2/';


var layer_base_osm = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var layer_over_MB_landsat = new L.TileLayer(TileStream_URL + 'landsat/{z}/{x}/{y}.png', {
    errorTileUrl: '/static/assets/images/none.png',
    minZoom: 5,
    maxZoom: 15,
    attribution: tiles_COPY
});

var mc_layerGroup = L.layerGroup();
var mc_mapScale = L.control.scale();
var mc_mousePosition = L.control.mousePosition();

var mc_fullScreen = L.control.fullscreen({
    position: 'topright',
    title: "全屏",
    content: null,
    forceSeparateButton: false,
    forcePseudoFullscreen: false
});

var pop_menu = '<span class="leaflet-popup-menu-button">' +
    '<i class="fa fa-bars" aria-hidden="true"></i></span>';

$(function () {
    $('[data-toggle="tooltip"]').tooltip();

    $('.modal_coordinates_marker').click(function () {
        $('#modal_coordinates_marker').modal('show');
        map.invalidateSize();
    });

    $('.modal_coordinates_marker_close').click(function () {
        $('.latitude').val('');
        $('.longitude').val('');
    });
});
