/**
 * Created by bao on 2018/1/3.
 */
$(function () {

    var map = new ol.Map({
        target: 'map',
        layers: [],
        view: new ol.View({
            center: ol.proj.fromLonLat([103.666667, 36.05]),
            zoom: 6,
            minZoom: 2,
            MaxZoom: 21
        })
    });
    var overlay = initPopup(map);
    var tML = initTianDiTuMapLayer(map);
    var tSL = initTianDiTuSatelliteLayer(map);
    var tAL = initTianDiTuAnnotationLayer(map);


    var pointSource1 = new ol.source.Vector({});

    var pointSource2 = new ol.source.Vector({});

    var markLayer1 = initMarkLayer(pointSource1, map);
    var markLayer2 = initMarkLayer(pointSource2, map);

    map.on('pointermove', function (e) {
        var pixel = map.getEventPixel(e.originalEvent);
        var hit = map.hasFeatureAtPixel(pixel);
        map.getTargetElement().style.cursor = hit ? 'pointer' : '';
    });

    map.on('singleclick', function (event) {
        var feature = map.forEachFeatureAtPixel(event.pixel,
            function (feature) {
                return feature;
            });
        if (feature) {
            var devices = feature.get('devices')
            openWindow(event, overlay, devices);

        }
    });

    $(".map-layer-switch-container a").click(function (e) {
        e.preventDefault();
        var type = $(this).data('type');
        $(this).parent().find('.btn').removeClass('active');
        $(this).addClass("active");
        if (type == 'map') {
            tML.setVisible(true);
            tSL.setVisible(false);
        } else {
            tML.setVisible(false);
            tSL.setVisible(true);
        }
    });

    loadFeatures("/static/json/observer_guyuan.json", pointSource1)
    loadFeatures("/static/json/observer_jiawa.json", pointSource2)

    function loadFeatures(url, source) {
        $.get(url, function (data) {
            var d = data
            var feature = new ol.Feature({
                type: 'icon',
                name: data.node.nodeName,
                devices: data.devices,
                geometry: new ol.geom.Point(ol.proj.fromLonLat([d.node.longtitude, d.node.latitude]))
            })
            source.addFeature(feature);
            return feature
        });
    }

    function openWindow(event, overlay, devices) {
        var result = [];
        for (var i = 0; i < devices.length; i++) {
            var d = devices[i];
            if (d.checked == 1) {
                result.push(d)
            }
        }

        var coordinates = event.coordinate;
        var rl = result.map(function (n) {
            return '<tr><td style="text-align: center"><a href="#">' + n.deviceName + '</a></td></tr>'
        })
        var el = '<table class="table table-bordered show-popup" >' + rl.join("") +
            '</table>';

        $('#popup-content').html(el);
        overlay.setPosition(coordinates);

        $('#popup-content a').click(function (e) {
            e.preventDefault()
            console.log($(this).text())
            var name = $(this).text()
            var url = "/static/json/" + name + ".json"
            $.get(url, function (data) {
                console.log(data.content.NODE_NOTE);
                $('.nodeName').text(data.content.nodeName)
                $('.NODE_NOTE').text(data.content.NODE_NOTE)
                $('.STR_LONGTITUDE').text(data.content.STR_LONGTITUDE)
                $('.STR_LATITUDE').text(data.content.STR_LATITUDE)
                $('.ALTITUDE').text(data.content.ALTITUDE)
                $('.PRINCIPAL').text(data.content.PRINCIPAL)
                $('.LINK_MAN').text(data.content.LINK_MAN)
                $('.LINK_PHONE').text(data.content.LINK_PHONE)
                $('.LINK_EMAIL').text(data.content.LINK_EMAIL)
                $('.CREATE_TIME').text(data.content.CREATE_TIME)
                $('.UPDATE_TIME').text(data.content.UPDATE_TIME)
                $('.DEVICE_CODE').text(data.content.DEVICE_CODE)
                $('.COMM_TYPE').text(data.content.COMM_TYPE)
                $('.COMM_MODULE').text(data.content.COMM_MODULE)
                $('.COMM_PORT_NUM').text(data.content.COMM_PORT_NUM)
                $('.SERVER_ADDRESS').text(data.content.SERVER_ADDRESS)
                $('.COMM_CARD_NUM').text(data.content.COMM_CARD_NUM)
                $('#modal').modal()
            })

        })
    }


});

var initTianDiTuMapLayer = function (map) {
    var tMl = new ol.layer.Tile({
        visible: false,
        title: "天地图路网",
        source: new ol.source.XYZ({
            url: "http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}"
        })
    });
    map.addLayer(tMl);
    return tMl;
};

var initTianDiTuSatelliteLayer = function (map) {
    var tSL = new ol.layer.Tile({
        title: "天地图卫星影像",
        source: new ol.source.XYZ({
            url: 'http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}'
        })
    });
    map.addLayer(tSL);
    return tSL;
};

var initTianDiTuAnnotationLayer = function (map) {
    var tAL = new ol.layer.Tile({
        title: "天地图文字标注",
        source: new ol.source.XYZ({
            url: 'http://t3.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}'
        })
    });
    map.addLayer(tAL);
    return tAL;
};

var initMarkLayer = function (source, map) {
    var markLayer = new ol.layer.Vector({
        source: source,
        style: function (feature) {
            var style = [new ol.style.Style({
                image: new ol.style.Icon(({
                    anchor: [0.5, 1],
                    anchorXUnits: 'fraction',
                    anchorYUnits: 'fraction',
                    src: '/static/assets/images/map_marker-24.png'
                })),
                text: new ol.style.Text({
                    text: feature.get('name'),
                    offsetY: -30,
                    fill: new ol.style.Fill({
                        color: '#000'
                    }),
                    font: '14px sans-serif'
                })
            })];
            return style;
        }

    });
    map.addLayer(markLayer);
    return markLayer
};

var initPopup = function (map) {
    var container = document.getElementById('popup-container');
    container.style.display = '';
    var closer = document.getElementById('popup-closer');
    var overlay = new ol.Overlay({
        element: container,
        autoPan: true,
        autoPanAnimation: {
            duration: 250
        }
    });

    closer.onclick = function (e) {
        e.preventDefault();
        overlay.setPosition(undefined);
        $('#popup-content').empty();
    };
    map.addOverlay(overlay);
    return overlay;
};





